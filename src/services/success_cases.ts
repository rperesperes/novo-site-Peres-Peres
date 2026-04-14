import pb from '@/lib/pocketbase/client'

export const getSuccessCases = () =>
  pb.collection('success_cases').getFullList({ sort: '-created' })
export const getSuccessCase = (id: string) => pb.collection('success_cases').getOne(id)
export const createSuccessCase = (data: FormData | any) =>
  pb.collection('success_cases').create(data)
export const updateSuccessCase = (id: string, data: FormData | any) =>
  pb.collection('success_cases').update(id, data)
export const deleteSuccessCase = (id: string) => pb.collection('success_cases').delete(id)
