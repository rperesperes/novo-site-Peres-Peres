import pb from '@/lib/pocketbase/client'

export type SubscriberStatus = 'ativo' | 'desativado'

export interface NewsletterSubscriberRecord {
  id: string
  email: string
  source?: string
  archived?: boolean
  status?: SubscriberStatus
  status_updated_at?: string
  created: string
  updated: string
}

export interface NewsletterSubscriberInput {
  email: string
  source?: string
  archived?: boolean
  status?: SubscriberStatus
  status_updated_at?: string
}

export interface SubscribeNewsletterResult {
  record?: NewsletterSubscriberRecord
  alreadySubscribed?: boolean
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string): boolean {
  if (!email) return false
  const trimmed = email.trim()
  return EMAIL_REGEX.test(trimmed)
}

/**
 * Inscreve no Boletim Informativo.
 * - Valida formato de e-mail.
 * - Trata duplicatas: se o e-mail já estiver cadastrado, retorna `{ alreadySubscribed: true }` sem erro na tela
 *   e sem criar registro repetido.
 * - Dispara e-mail de boas-vindas via hook Resend (se for novo registro).
 */
export async function subscribeNewsletter(
  data: NewsletterSubscriberInput,
): Promise<SubscribeNewsletterResult> {
  const normalizedEmail = (data.email || '').trim().toLowerCase()

  if (!isValidEmail(normalizedEmail)) {
    throw new Error('Por favor, informe um endereço de e-mail válido.')
  }

  // Verificar se o e-mail já existe
  try {
    const existing = await pb
      .collection('newsletter_subscribers')
      .getFirstListItem(`email="${normalizedEmail}"`)
    if (existing) {
      return {
        record: existing as unknown as NewsletterSubscriberRecord,
        alreadySubscribed: true,
      }
    }
  } catch (err: any) {
    // 404 (não encontrado) é o comportamento esperado para novo assinante.
    // Qualquer outro erro não 404 ou 400 prossegue para a tentativa de criação.
    const status = err?.status || err?.response?.status
    if (status && status !== 404) {
      console.warn('Verificação de assinante existente retornou status:', status)
    }
  }

  try {
    const created = await pb.collection('newsletter_subscribers').create({
      email: normalizedEmail,
      source:
        data.source ||
        (typeof window !== 'undefined' ? window.location.href : 'Rodapé (Boletim Informativo)'),
      archived: false,
      status: 'ativo',
      status_updated_at: new Date().toISOString(),
    })
    return {
      record: created as unknown as NewsletterSubscriberRecord,
      alreadySubscribed: false,
    }
  } catch (err: any) {
    // Se bater em eventual condição de corrida ou índice único
    const message = (err?.message || '').toLowerCase()
    if (message.includes('unique') || message.includes('already exists')) {
      return { alreadySubscribed: true }
    }
    throw err
  }
}

export async function getNewsletterSubscribers(options?: {
  includeArchived?: boolean
  sort?: string
}): Promise<NewsletterSubscriberRecord[]> {
  const filter = options?.includeArchived ? '' : 'archived != true'
  const list = await pb.collection('newsletter_subscribers').getFullList({
    sort: options?.sort || '-created',
    filter: filter || undefined,
  })
  return list as unknown as NewsletterSubscriberRecord[]
}

export async function archiveNewsletterSubscriber(
  id: string,
  archived: boolean = true,
): Promise<NewsletterSubscriberRecord> {
  const res = await pb.collection('newsletter_subscribers').update(id, { archived })
  return res as unknown as NewsletterSubscriberRecord
}

/**
 * Atualiza o status do assinante (ativo / desativado) e registra data/hora da alteração.
 */
export async function updateSubscriberStatus(
  id: string,
  status: SubscriberStatus,
): Promise<NewsletterSubscriberRecord> {
  const res = await pb.collection('newsletter_subscribers').update(id, {
    status,
    status_updated_at: new Date().toISOString(),
  })
  return res as unknown as NewsletterSubscriberRecord
}
