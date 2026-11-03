import pb from '@/lib/pocketbase/client'

export type IndexUpdateSource = 'manual' | 'automatica'

export interface IndexRecord {
  id: string
  name: string
  slug: string
  current_value?: string
  effective_date?: string
  validity_months?: number
  notes?: string
  update_source?: IndexUpdateSource
  last_updated_at?: string
  created: string
  updated: string
}

export interface IndexUpdateInput {
  current_value?: string
  effective_date?: string
  validity_months?: number
  notes?: string
  update_source?: IndexUpdateSource
  last_updated_at?: string
}

export interface IndexEntryRecord {
  id: string
  index_id: string
  index_slug: string
  effective_date: string
  value: string
  source?: IndexUpdateSource
  notes?: string
  created: string
  updated: string
}

export interface CreateIndexEntryInput {
  index_id: string
  index_slug: string
  effective_date: string
  value: string
  source?: IndexUpdateSource
  notes?: string
}

export interface UpdateIndexEntryInput {
  effective_date?: string
  value?: string
  source?: IndexUpdateSource
  notes?: string
}

export async function getIndices(): Promise<IndexRecord[]> {
  const list = await pb.collection('indices').getFullList({
    sort: 'name',
  })
  return list as unknown as IndexRecord[]
}

export async function getIndexEntries(indexSlug?: string): Promise<IndexEntryRecord[]> {
  const filter = indexSlug ? `index_slug = '${indexSlug}'` : ''
  // Usa batch pagination explícita para evitar estourar limites
  const list = (await pb.collection('index_entries').getFullList({
    filter: filter || undefined,
    batch: 500,
  })) as unknown as IndexEntryRecord[]

  // Ordena rigorosamente por data cronológica real de início decrescente (maior data primeiro)
  return list.sort((a, b) => {
    const dateA = parseDateFlexible(a.effective_date)
    const dateB = parseDateFlexible(b.effective_date)
    const timeA = dateA ? dateA.getTime() : 0
    const timeB = dateB ? dateB.getTime() : 0
    return timeB - timeA
  })
}

/**
 * Retorna contagens de vigências agrupadas por slug de índice de forma leve.
 */
export async function getIndexEntriesCounts(): Promise<Record<string, number>> {
  try {
    // Busca registros apenas com id e index_slug, com batch adequado
    const list = await pb.collection('index_entries').getFullList({
      fields: 'id,index_slug',
      batch: 1000,
    })
    const map: Record<string, number> = {}
    for (const item of list) {
      const slug = (item as any).index_slug
      if (slug) {
        map[slug] = (map[slug] || 0) + 1
      }
    }
    return map
  } catch (err) {
    console.error('Erro ao buscar contagens de vigências:', err)
    return {}
  }
}

/**
 * Recalcula o resumo do índice na coleção indices apontando sempre para a vigência
 * com a MAIOR data de início da série histórica, preservando a regra de que
 * vigências antigas ou retroativas nunca sobrescrevem a vigência vigente.
 */
export async function syncIndexSummaryFromEntries(
  indexId: string,
  indexSlug: string,
): Promise<void> {
  const allEntries = await getIndexEntries(indexSlug)
  if (allEntries.length > 0) {
    const latest = allEntries[0] // já ordenado pela maior data cronológica de início
    await pb.collection('indices').update(indexId, {
      current_value: latest.value,
      effective_date: latest.effective_date,
      update_source: latest.source || 'manual',
      last_updated_at: new Date().toISOString(),
    })
  } else {
    await pb.collection('indices').update(indexId, {
      current_value: '',
      effective_date: '',
      update_source: 'manual',
      last_updated_at: new Date().toISOString(),
    })
  }
}

export async function createIndexEntry(data: CreateIndexEntryInput): Promise<IndexEntryRecord> {
  const payload = {
    ...data,
    source: data.source || 'manual',
  }
  const entry = await pb.collection('index_entries').create(payload)

  // Atualiza o resumo do índice garantindo que aponte para a vigência de MAIOR data de início
  try {
    await syncIndexSummaryFromEntries(data.index_id, data.index_slug)
  } catch (err) {
    console.error('Erro ao sincronizar resumo do índice:', err)
  }

  return entry as unknown as IndexEntryRecord
}

export interface BatchImportEntryItem {
  effective_date: string
  value: string
  notes?: string
  action: 'create' | 'update' | 'skip'
  existingEntryId?: string
}

export interface BatchImportResult {
  createdCount: number
  updatedCount: number
  skippedCount: number
  errors: string[]
}

/**
 * Importa um lote de vigências para um índice, com suporte a criação ou atualização.
 * Ao final do lote completo, sincroniza o resumo do índice garantindo que aponte
 * para a vigência com a MAIOR data de início da série histórica.
 */
/**
 * Executa uma operação assíncrona com retry progressivo e backoff exponencial em caso de 429 (Too Many Requests).
 */
async function executeWithRetry<T>(
  fn: () => Promise<T>,
  options?: {
    maxRetries?: number
    baseDelayMs?: number
    onRetry?: (attempt: number, delayMs: number) => void
  },
): Promise<T> {
  const maxRetries = options?.maxRetries ?? 5
  const baseDelayMs = options?.baseDelayMs ?? 1000

  let attempt = 0
  while (true) {
    try {
      return await fn()
    } catch (err: any) {
      const is429 =
        err?.status === 429 ||
        err?.response?.status === 429 ||
        String(err?.message || '')
          .toLowerCase()
          .includes('too many requests')

      if (is429 && attempt < maxRetries) {
        attempt++
        const delay = baseDelayMs * Math.pow(2, attempt - 1) + Math.random() * 200
        if (options?.onRetry) {
          options.onRetry(attempt, Math.round(delay))
        }
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }
      throw err
    }
  }
}

/**
 * Importa um lote de vigências para um índice com resiliência:
 * 1. Tenta a rota de lote atômica do backend (/backend/v1/indices/batch-import).
 * 2. Em caso de falha de rota, recorre à criação individual com espaçamento,
 *    retry progressivo em 429 e atualização de status para o usuário.
 * Ao final do lote completo, sincroniza o resumo do índice garantindo que aponte
 * para a vigência com a MAIOR data de início da série histórica.
 */
export async function importIndexEntriesBatch(
  indexId: string,
  indexSlug: string,
  items: BatchImportEntryItem[],
  onProgress?: (processed: number, total: number, statusText?: string) => void,
): Promise<BatchImportResult> {
  // 1. Tenta rota dedicada atômica do backend
  try {
    if (onProgress) onProgress(0, items.length, 'Processando lote no servidor...')
    const res = await executeWithRetry(
      async () => {
        return await pb.send<BatchImportResult>('/backend/v1/indices/batch-import', {
          method: 'POST',
          body: {
            index_id: indexId,
            index_slug: indexSlug,
            items: items.map((it) => ({
              effective_date: it.effective_date,
              value: it.value,
              notes: it.notes,
              action: it.action,
            })),
          },
        })
      },
      {
        maxRetries: 4,
        baseDelayMs: 1200,
        onRetry: (_attempt, delayMs) => {
          if (onProgress) {
            onProgress(
              0,
              items.length,
              `Aguardando limite do servidor, retomando em ${Math.ceil(delayMs / 1000)}s...`,
            )
          }
        },
      },
    )

    if (onProgress) onProgress(items.length, items.length, 'Concluído com sucesso.')
    return {
      createdCount: res.createdCount || 0,
      updatedCount: res.updatedCount || 0,
      skippedCount: res.skippedCount || 0,
      errors: res.errors || [],
    }
  } catch (backendErr: any) {
    console.warn(
      'Rota de lote do backend falhou ou indisponível, usando fallback sequencial resiliente:',
      backendErr,
    )
  }

  // 2. Fallback resiliente com controle de requisições, espaçamento e retry com backoff
  let createdCount = 0
  let updatedCount = 0
  let skippedCount = 0
  const errors: string[] = []

  const total = items.length

  for (let i = 0; i < total; i++) {
    const item = items[i]
    if (item.action === 'skip') {
      skippedCount++
      if (onProgress) onProgress(i + 1, total)
      continue
    }

    try {
      await executeWithRetry(
        async () => {
          if (item.action === 'update' && item.existingEntryId) {
            await pb.collection('index_entries').update(item.existingEntryId, {
              effective_date: item.effective_date,
              value: item.value,
              notes: item.notes || '',
              source: 'manual',
            })
            updatedCount++
          } else {
            await pb.collection('index_entries').create({
              index_id: indexId,
              index_slug: indexSlug,
              effective_date: item.effective_date,
              value: item.value,
              notes: item.notes || '',
              source: 'manual',
            })
            createdCount++
          }
        },
        {
          maxRetries: 5,
          baseDelayMs: 1500,
          onRetry: (attempt, delayMs) => {
            if (onProgress) {
              onProgress(
                i,
                total,
                `Aguardando limite do servidor (${attempt}/5), retomando em ${Math.ceil(delayMs / 1000)}s...`,
              )
            }
          },
        },
      )
    } catch (err: any) {
      console.error(`Erro ao importar vigência ${item.effective_date}:`, err)
      errors.push(`Erro na vigência ${item.effective_date}: ${err?.message || 'Falha ao salvar'}`)
    }

    if (onProgress) {
      onProgress(i + 1, total, `Processado ${i + 1} de ${total}`)
    }

    // Pequeno espaçamento de segurança entre requisições para respeitar o rate limit
    if (i < total - 1) {
      await new Promise((resolve) => setTimeout(resolve, 80))
    }
  }

  // Recalcula o resumo do índice uma vez ao final do lote
  try {
    await executeWithRetry(async () => {
      await syncIndexSummaryFromEntries(indexId, indexSlug)
    })
  } catch (err) {
    console.error('Erro ao sincronizar resumo após lote:', err)
  }

  return {
    createdCount,
    updatedCount,
    skippedCount,
    errors,
  }
}

export async function updateIndexEntry(
  id: string,
  data: UpdateIndexEntryInput,
  indexId?: string,
  indexSlug?: string,
): Promise<IndexEntryRecord> {
  const payload = {
    ...data,
    source: data.source || 'manual',
  }
  const entry = await pb.collection('index_entries').update(id, payload)

  if (indexId && indexSlug) {
    try {
      await syncIndexSummaryFromEntries(indexId, indexSlug)
    } catch (err) {
      console.error('Erro ao sincronizar resumo do índice após edição de vigência:', err)
    }
  }

  return entry as unknown as IndexEntryRecord
}

export async function deleteIndexEntry(
  id: string,
  indexId?: string,
  indexSlug?: string,
): Promise<boolean> {
  await pb.collection('index_entries').delete(id)
  if (indexId && indexSlug) {
    try {
      await syncIndexSummaryFromEntries(indexId, indexSlug)
    } catch (err) {
      console.error('Erro ao sincronizar resumo do índice após exclusão de vigência:', err)
    }
  }
  return true
}

export async function updateIndex(id: string, data: IndexUpdateInput): Promise<IndexRecord> {
  const payload = {
    ...data,
    update_source: data.update_source || 'manual',
    last_updated_at: data.last_updated_at || new Date().toISOString(),
  }
  const res = await pb.collection('indices').update(id, payload)
  return res as unknown as IndexRecord
}

/**
 * Normaliza qualquer data (DD/MM/AAAA ou AAAA-MM-DD ou AAAA-MM) em objeto Date
 */
export function parseDateFlexible(dateStr?: string | null): Date | null {
  if (!dateStr) return null
  const s = dateStr.trim()
  if (!s) return null

  if (s.includes('/')) {
    const parts = s.split('/')
    if (parts.length === 3) {
      return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]))
    }
  } else if (s.includes('-')) {
    const parts = s.split('-')
    if (parts.length === 3) {
      return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
    }
    if (parts.length === 2) {
      return new Date(Number(parts[0]), Number(parts[1]) - 1, 1)
    }
  }
  const parsed = new Date(s)
  return isNaN(parsed.getTime()) ? null : parsed
}

/**
 * Retorna a vigência aplicável a uma data de referência consultada.
 * Se a data for anterior à primeira vigência cadastrada (período sem dados),
 * retorna isBeforeEarliest = true e entry = null para avisar o usuário.
 */
export function resolveIndexValueForDate(
  entries: IndexEntryRecord[],
  targetDate: Date | string,
): {
  found: boolean
  isBeforeEarliest: boolean
  entry: IndexEntryRecord | null
  earliestDate: Date | null
} {
  if (!entries || entries.length === 0) {
    return {
      found: false,
      isBeforeEarliest: true,
      entry: null,
      earliestDate: null,
    }
  }

  const target = targetDate instanceof Date ? targetDate : parseDateFlexible(targetDate)
  if (!target || isNaN(target.getTime())) {
    return {
      found: false,
      isBeforeEarliest: false,
      entry: null,
      earliestDate: null,
    }
  }

  // Ordena cronologicamente crescente
  const parsedEntries = entries
    .map((e) => ({
      entry: e,
      date: parseDateFlexible(e.effective_date),
    }))
    .filter((item): item is { entry: IndexEntryRecord; date: Date } => item.date !== null)
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  if (parsedEntries.length === 0) {
    return {
      found: false,
      isBeforeEarliest: true,
      entry: null,
      earliestDate: null,
    }
  }

  const earliest = parsedEntries[0].date
  if (target.getTime() < earliest.getTime()) {
    return {
      found: false,
      isBeforeEarliest: true,
      entry: null,
      earliestDate: earliest,
    }
  }

  // Acha a vigência em vigor na data: a última vigência com data <= target
  let activeEntry: IndexEntryRecord = parsedEntries[0].entry
  for (let i = 0; i < parsedEntries.length; i++) {
    if (parsedEntries[i].date.getTime() <= target.getTime()) {
      activeEntry = parsedEntries[i].entry
    } else {
      break
    }
  }

  return {
    found: true,
    isBeforeEarliest: false,
    entry: activeEntry,
    earliestDate: earliest,
  }
}

/**
 * Verifica se um índice está vencido considerando sua data de vigência mais recente
 * e o prazo de validade configurável (padrão 12 meses).
 */
export function checkIndexExpiration(record: IndexRecord): {
  isExpired: boolean
  isMissing: boolean
  expiryDate: Date | null
  monthsRemaining: number | null
} {
  const val = (record.current_value || '').trim()
  const eff = (record.effective_date || '').trim()

  if (!val || !eff) {
    return {
      isExpired: false,
      isMissing: true,
      expiryDate: null,
      monthsRemaining: null,
    }
  }

  const effDate = parseDateFlexible(eff)
  if (!effDate) {
    return {
      isExpired: false,
      isMissing: false,
      expiryDate: null,
      monthsRemaining: null,
    }
  }

  const validityMonths = Number(record.validity_months) > 0 ? Number(record.validity_months) : 12

  const expiryDate = new Date(effDate)
  expiryDate.setMonth(expiryDate.getMonth() + validityMonths)

  const now = new Date()
  const isExpired = now.getTime() > expiryDate.getTime()

  const diffTime = expiryDate.getTime() - now.getTime()
  const diffMonths = Math.round(diffTime / (1000 * 60 * 60 * 24 * 30.4375))

  return {
    isExpired,
    isMissing: false,
    expiryDate,
    monthsRemaining: diffMonths,
  }
}
