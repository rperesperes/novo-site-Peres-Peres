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
  const list = await pb.collection('index_entries').getFullList({
    filter: filter || undefined,
    sort: '-effective_date',
  })
  return list as unknown as IndexEntryRecord[]
}

export async function createIndexEntry(data: CreateIndexEntryInput): Promise<IndexEntryRecord> {
  const payload = {
    ...data,
    source: data.source || 'manual',
  }
  const entry = await pb.collection('index_entries').create(payload)

  // Atualizar também o resumo do índice se esta vigência for a mais recente
  try {
    const allEntries = await getIndexEntries(data.index_slug)
    const latest = allEntries[0]
    if (latest && latest.id === entry.id) {
      await pb.collection('indices').update(data.index_id, {
        current_value: latest.value,
        effective_date: latest.effective_date,
        update_source: latest.source || 'manual',
        last_updated_at: new Date().toISOString(),
      })
    }
  } catch (err) {
    console.error('Erro ao sincronizar resumo do índice:', err)
  }

  return entry as unknown as IndexEntryRecord
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
      const allEntries = await getIndexEntries(indexSlug)
      const latest = allEntries[0]
      if (latest) {
        await pb.collection('indices').update(indexId, {
          current_value: latest.value,
          effective_date: latest.effective_date,
          update_source: latest.source || 'manual',
          last_updated_at: new Date().toISOString(),
        })
      }
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
      const allEntries = await getIndexEntries(indexSlug)
      const latest = allEntries[0]
      if (latest) {
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
