import pb from '@/lib/pocketbase/client'

export interface NewsletterSubscriberInput {
  email: string
  source?: string
}

export const subscribeNewsletter = (data: NewsletterSubscriberInput) =>
  pb.collection('newsletter_subscribers').create(data)
