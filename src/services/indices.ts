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

export async function getIndices(): Promise<IndexRecord[]> {
  const list = await pb.collection('indices').getFullList({
    sort: 'name',
  })
  return list as unknown as IndexRecord[]
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
 * Verifica se um índice está vencido considerando sua data de vigência (effective_date)
 * e o prazo de validade configurável (padrão 12 meses).
 * Retorna { isExpired: boolean, isMissing: boolean, expiryDate?: Date, monthsRemaining?: number }
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

  // Tenta parsear data no formato AAAA-MM-DD ou DD/MM/AAAA
  let effDate: Date | null = null
  if (eff.includes('/')) {
    const parts = eff.split('/')
    if (parts.length === 3) {
      effDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]))
    }
  } else if (eff.includes('-')) {
    const parts = eff.split('-')
    if (parts.length === 3) {
      effDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
    }
  } else {
    const parsed = new Date(eff)
    if (!isNaN(parsed.getTime())) {
      effDate = parsed
    }
  }

  if (!effDate || isNaN(effDate.getTime())) {
    return {
      isExpired: false,
      isMissing: false,
      expiryDate: null,
      monthsRemaining: null,
    }
  }

  const validityMonths = Number(record.validity_months) > 0 ? Number(record.validity_months) : 12

  // Data de expiração: data de vigência + N meses
  const expiryDate = new Date(effDate)
  expiryDate.setMonth(expiryDate.getMonth() + validityMonths)

  const now = new Date()
  const isExpired = now.getTime() > expiryDate.getTime()

  // Meses restantes
  const diffTime = expiryDate.getTime() - now.getTime()
  const diffMonths = Math.round(diffTime / (1000 * 60 * 60 * 24 * 30.4375))

  return {
    isExpired,
    isMissing: false,
    expiryDate,
    monthsRemaining: diffMonths,
  }
}
