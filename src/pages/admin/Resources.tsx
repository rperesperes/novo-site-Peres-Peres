import { useState, useEffect } from 'react'
import { getResources, createResource, updateResource, deleteResource } from '@/services/resources'
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

export default function AdminResources() {
  const [resources, setResources] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const { toast } = useToast()

  const loadData = async () => {
    try {
      setResources(await getResources())
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('resources', () => {
    loadData()
  })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    try {
      if (editing) await updateResource(editing.id, fd)
      else await createResource(fd)
      setIsOpen(false)
      toast({ title: 'Sucesso', description: 'Recurso salvo com sucesso.' })
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este recurso?')) return
    try {
      await deleteResource(id)
      toast({ title: 'Sucesso', description: 'Recurso excluído.' })
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    }
  }

  const openModal = (item: any = null) => {
    setEditing(item)
    setIsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif font-bold text-black">Gerenciar Recursos</h1>
        <Button
          onClick={() => openModal()}
          className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Recurso
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openModal(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {resources.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                  Nenhum recurso encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md bg-white text-black">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Recurso' : 'Novo Recurso'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input name="title" defaultValue={editing?.title} required />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Input name="category" defaultValue={editing?.category} />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea name="description" defaultValue={editing?.description} />
            </div>
            <div className="space-y-2">
              <Label>Arquivo</Label>
              <Input type="file" name="file" />
            </div>
            <div className="space-y-2">
              <Label>Ou Link Externo</Label>
              <Input type="url" name="link" defaultValue={editing?.link} />
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold"
              >
                Salvar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
