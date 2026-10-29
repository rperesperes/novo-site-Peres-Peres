import pb from '@/lib/pocketbase/client'

export interface ContactRequestRecord {
  id: string
  name?: string
  email: string
  phone?: string
  message?: string
  source_page?: string
  archived?: boolean
  created: string
  updated: string
}

export interface ContactRequestInput {
  name?: string
  email: string
  phone?: string
  message?: string
  source_page?: string
  archived?: boolean
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string): boolean {
  if (!email) return false
  const trimmed = email.trim()
  return EMAIL_REGEX.test(trimmed)
}

export async function createContactRequest(
  data: ContactRequestInput,
): Promise<ContactRequestRecord> {
  const normalizedEmail = (data.email || '').trim().toLowerCase()

  if (!isValidEmail(normalizedEmail)) {
    throw new Error('Por favor, informe um endereço de e-mail válido.')
  }

  const payload: ContactRequestInput = {
    name: data.name ? data.name.trim() : undefined,
    email: normalizedEmail,
    phone: data.phone ? data.phone.trim() : undefined,
    message: data.message ? data.message.trim() : undefined,
    source_page: data.source_page || window.location.href,
    archived: false,
  }

  const created = await pb.collection('contact_requests').create(payload)
  return created as unknown as ContactRequestRecord
}

export async function getContactRequests(options?: {
  includeArchived?: boolean
  sort?: string
}): Promise<ContactRequestRecord[]> {
  const filter = options?.includeArchived ? '' : 'archived != true'
  const list = await pb.collection('contact_requests').getFullList({
    sort: options?.sort || '-created',
    filter: filter || undefined,
  })
  return list as unknown as ContactRequestRecord[]
}

export async function archiveContactRequest(
  id: string,
  archived: boolean = true,
): Promise<ContactRequestRecord> {
  const res = await pb.collection('contact_requests').update(id, { archived })
  return res as unknown as ContactRequestRecord
}
