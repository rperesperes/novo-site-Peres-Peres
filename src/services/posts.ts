import pb from '@/lib/pocketbase/client'

export const getPosts = () => pb.collection('posts').getFullList({ sort: '-created' })
export const getPost = (id: string) => pb.collection('posts').getOne(id)
export const createPost = (data: FormData | any) => pb.collection('posts').create(data)
export const updatePost = (id: string, data: FormData | any) =>
  pb.collection('posts').update(id, data)
export const deletePost = (id: string) => pb.collection('posts').delete(id)
