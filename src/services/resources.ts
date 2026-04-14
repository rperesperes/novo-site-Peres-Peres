import pb from '@/lib/pocketbase/client'

export const getResources = () => pb.collection('resources').getFullList({ sort: '-created' })
export const getResource = (id: string) => pb.collection('resources').getOne(id)
export const createResource = (data: FormData | any) => pb.collection('resources').create(data)
export const updateResource = (id: string, data: FormData | any) =>
  pb.collection('resources').update(id, data)
export const deleteResource = (id: string) => pb.collection('resources').delete(id)
