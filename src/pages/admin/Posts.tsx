import { useState, useEffect } from 'react'
import { getPosts, createPost, updatePost, deletePost } from '@/services/posts'
import { useRealtime } from '@/hooks/use-realtime'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default function AdminPosts() {
  const [posts, setPosts] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const { toast } = useToast()

  const loadData = async () => {
    try {
      setPosts(await getPosts())
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('posts', () => {
    loadData()
  })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    try {
      if (editing) await updatePost(editing.id, fd)
      else await createPost(fd)
      setIsOpen(false)
      toast({ title: 'Sucesso', description: 'Post salvo com sucesso.' })
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este post?')) return
    try {
      await deletePost(id)
      toast({ title: 'Sucesso', description: 'Post excluído.' })
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    }
  }

  const openModal = (post: any = null) => {
    setEditing(post)
    setIsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Gerenciar Blog</h1>
        <Button
          onClick={() => openModal()}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Post
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>{post.status === 'published' ? 'Publicado' : 'Rascunho'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openModal(post)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {posts.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                  Nenhum post encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl bg-white text-black">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Post' : 'Novo Post'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input name="title" defaultValue={editing?.title} required />
              </div>
              <div className="space-y-2">
                <Label>Slug (URL amigável)</Label>
                <Input name="slug" defaultValue={editing?.slug} required />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Input name="category" defaultValue={editing?.category} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  name="status"
                  defaultValue={editing?.status || 'draft'}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Resumo (Excerpt)</Label>
              <Textarea name="excerpt" defaultValue={editing?.excerpt} />
            </div>
            <div className="space-y-2">
              <Label>Conteúdo (HTML)</Label>
              <Textarea name="content" defaultValue={editing?.content} className="h-32" />
            </div>
            <div className="space-y-2">
              <Label>Capa (Imagem)</Label>
              <Input type="file" name="cover" accept="image/*" />
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black">
                Salvar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
