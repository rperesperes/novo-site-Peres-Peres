import pb from '@/lib/pocketbase/client'

const COLLECTION = 'social_links'

export const SOCIAL_NETWORKS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'x', label: 'X (antigo Twitter)' },
  { id: 'pinterest', label: 'Pinterest' },
  { id: 'threads', label: 'Threads' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'twitch', label: 'Twitch' },
  { id: 'kwai', label: 'Kwai' },
  { id: 'tumblr', label: 'Tumblr' },
  { id: 'reddit', label: 'Reddit' },
  { id: 'medium', label: 'Medium' },
  { id: 'substack', label: 'Substack' },
] as const

export type SocialNetworkId = (typeof SOCIAL_NETWORKS)[number]['id']

export interface SocialLinksMap {
  instagram?: string
  facebook?: string
  tiktok?: string
  x?: string
  pinterest?: string
  threads?: string
  youtube?: string
  linkedin?: string
  twitch?: string
  kwai?: string
  tumblr?: string
  reddit?: string
  medium?: string
  substack?: string
}

export interface SocialLinkRecord extends SocialLinksMap {
  id: string
  updated?: string
}

/**
 * Formato aceito para o link de uma rede social: https obrigatório.
 */
export function isValidSocialUrl(value: string): boolean {
  if (!value) return false
  let parsed: URL
  try {
    parsed = new URL(value.trim())
  } catch {
    return false
  }
  return parsed.protocol === 'https:'
}

/**
 * Normaliza o valor digitado para salvamento: sem espaços nas pontas,
 * host em minúsculas. Vazio devolve string vazia (rede removida do site).
 */
export function normalizeSocialUrl(value: string): string {
  const trimmed = (value || '').trim()
  if (!trimmed) return ''
  try {
    const parsed = new URL(trimmed)
    const port = parsed.port ? `:${parsed.port}` : ''
    return `${parsed.protocol}//${parsed.host.toLowerCase()}${port}${parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    return trimmed
  }
}

/**
 * Lê os links salvos no painel. Leitura PÚBLICA: a coleção tem regra
 * list/view sem autenticação, o site consulta sem login.
 * Falhas viram null para o rodapé cair no fallback estático em vez de quebrar.
 */
export async function getSocialLinks(): Promise<SocialLinkRecord | null> {
  try {
    const records = await pb.collection(COLLECTION).getFullList({
      sort: 'created',
    })
    if (records.length === 0) return null
    const r = records[0] as unknown as SocialLinkRecord
    return r
  } catch (err) {
    console.error('Erro ao carregar links de redes sociais:', err)
    return null
  }
}

export interface SaveSocialLinksResult {
  ok: boolean
  message?: string
}

/**
 * Salva os links no registro único da coleção (cria na primeira vez).
 * Escrita restrita ao admin autenticado pelas regras da coleção.
 * Envio explícito de string vazia limpa o campo, o que remove a rede do site.
 */
export async function saveSocialLinks(values: SocialLinksMap): Promise<SaveSocialLinksResult> {
  try {
    const existing = await getSocialLinks()
    const payload: SocialLinksMap = {}
    for (const net of SOCIAL_NETWORKS) {
      payload[net.id] = normalizeSocialUrl(values[net.id] || '')
    }
    if (existing) {
      await pb.collection(COLLECTION).update(existing.id, payload)
    } else {
      await pb.collection(COLLECTION).create(payload)
    }
    return { ok: true }
  } catch (err: unknown) {
    const message =
      err instanceof Error && err.message
        ? err.message
        : 'Não foi possível salvar os links de redes sociais.'
    return { ok: false, message }
  }
}
