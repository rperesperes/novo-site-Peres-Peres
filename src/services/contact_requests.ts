import pb from '@/lib/pocketbase/client'

export interface ContactRequestInput {
  name?: string
  email: string
  phone?: string
  message?: string
  source_page?: string
}

export const createContactRequest = (data: ContactRequestInput) =>
  pb.collection('contact_requests').create(data)

export const getContactRequests = () =>
  pb.collection('contact_requests').getFullList({ sort: '-created' })
