import pb from '@/lib/pocketbase/client'

export interface SuccessCaseRecord {
  id: string
  title: string
  slug?: string
  badge_text?: string
  badge_subtext?: string
  segment?: string
  context?: string
  challenge?: string
  actions_taken?: string
  result?: string
  highlight_phrase?: string
  highlight_number?: string
  display_order?: number
  status?: 'published' | 'hidden'
  created?: string
  updated?: string
  client_name?: string
  sector?: string
  image?: string
}

export const getSuccessCases = (options?: { sort?: string; filter?: string }) => {
  const sort = options?.sort ?? 'display_order'
  const filter = options?.filter
  return pb.collection('success_cases').getFullList<SuccessCaseRecord>({
    sort,
    filter,
  })
}

export const getPublicSuccessCases = async () => {
  return pb.collection('success_cases').getFullList<SuccessCaseRecord>({
    sort: 'display_order',
    filter: "status = 'published' || status = ''",
  })
}

export const getSuccessCase = (id: string) =>
  pb.collection('success_cases').getOne<SuccessCaseRecord>(id)

export const getSuccessCaseBySlug = async (slug: string) => {
  try {
    return await pb
      .collection('success_cases')
      .getFirstListItem<SuccessCaseRecord>(
        `slug = '${slug}' && (status = 'published' || status = '')`,
      )
  } catch {
    return null
  }
}

export const createSuccessCase = (data: Partial<SuccessCaseRecord> | FormData) =>
  pb.collection('success_cases').create<SuccessCaseRecord>(data as any)

export const updateSuccessCase = (id: string, data: Partial<SuccessCaseRecord> | FormData) =>
  pb.collection('success_cases').update<SuccessCaseRecord>(id, data as any)

export const deleteSuccessCase = (id: string) => pb.collection('success_cases').delete(id)
