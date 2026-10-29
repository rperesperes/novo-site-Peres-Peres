import pb from '@/lib/pocketbase/client'

export interface CalculatorAccessRecord {
  id: string
  calculator_slug: string
  calculator_name: string
  accessed_at?: string
  created: string
  updated: string
}

export interface CalculatorAccessStats {
  calculatorSlug: string
  calculatorName: string
  count: number
  lastAccessed: string | null
}

// Cache local em memória na sessão para evitar flood duplicado em poucos segundos na mesma navegação
const recentHits = new Set<string>()

/**
 * Registra o acesso/uso de uma calculadora no banco de dados PocketBase.
 * Chamado nos simuladores públicos. Não lança erro nem bloqueia o visitante.
 */
export async function trackCalculatorAccess(slug: string, name: string): Promise<void> {
  if (!slug) return

  // Evitar múltiplos disparos no mesmo carregamento de página em janela de 10s
  const cacheKey = `${slug}-${Math.floor(Date.now() / 10000)}`
  if (recentHits.has(cacheKey)) {
    return
  }
  recentHits.add(cacheKey)

  try {
    await pb.collection('calculator_accesses').create({
      calculator_slug: slug,
      calculator_name: name,
      accessed_at: new Date().toISOString(),
    })
  } catch (err) {
    // Falha silenciosa para não degradar a experiência do usuário visitante
    console.warn('[trackCalculatorAccess] Não foi possível registrar acesso:', err)
  }
}

/**
 * Busca todos os registros de acessos das calculadoras para análise no painel administrativo.
 * Permite filtrar por período ('all' | 'today' | '7days' | '30days' | 'year').
 */
export async function getCalculatorAccesses(
  period: string = 'all',
): Promise<CalculatorAccessRecord[]> {
  let filter = ''
  const now = new Date()

  if (period === 'today') {
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    filter = `created >= "${startOfDay}"`
  } else if (period === '7days') {
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    filter = `created >= "${sevenDaysAgo}"`
  } else if (period === '30days') {
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    filter = `created >= "${thirtyDaysAgo}"`
  } else if (period === 'year') {
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString()
    filter = `created >= "${oneYearAgo}"`
  }

  const list = await pb.collection('calculator_accesses').getFullList({
    sort: '-created',
    filter: filter || undefined,
  })

  return list as unknown as CalculatorAccessRecord[]
}
