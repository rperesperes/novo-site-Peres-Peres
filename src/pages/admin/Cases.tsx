import { useState, useEffect } from 'react'
import {
  getSuccessCases,
  createSuccessCase,
  updateSuccessCase,
  deleteSuccessCase,
} from '@/services/success_cases'
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

export default function AdminCases() {
  const [cases, setCases] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const { toast } = useToast()

  const loadData = async () => {
    try {
      setCases(await getSuccessCases())
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('success_cases', () => {
    loadData()
  })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    try {
      if (editing) await updateSuccessCase(editing.id, fd)
      else await createSuccessCase(fd)
      setIsOpen(false)
      toast({ title: 'Sucesso', description: 'Caso de sucesso salvo com sucesso.' })
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este caso?')) return
    try {
      await deleteSuccessCase(id)
      toast({ title: 'Sucesso', description: 'Caso excluído.' })
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
        <div>
          <h1 className="text-2xl font-bold text-black">Casos e Metodologia (Admin)</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Atenção: em cumprimento ao manual de comunicação, não veicular percentuais de redução
            nem casos sem comprovação documental.
          </p>
        </div>
        <Button
          onClick={() => openModal()}
          className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Registro
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Setor</TableHead>
              <TableHead>Redução</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.sector}</TableCell>
                <TableCell>{item.savings || '-'}</TableCell>
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
            {cases.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl bg-white text-black overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="font-bold">
              {editing ? 'Editar Registro' : 'Novo Registro'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input name="title" defaultValue={editing?.title} required />
              </div>
              <div className="space-y-2">
                <Label>Setor</Label>
                <Input name="sector" defaultValue={editing?.sector} />
              </div>
              <div className="space-y-2">
                <Label>Cliente (Opcional)</Label>
                <Input name="client_name" defaultValue={editing?.client_name} />
              </div>
              <div className="space-y-2">
                <Label>Imagem (Opcional)</Label>
                <Input type="file" name="image" accept="image/*" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição Técnica e Fundamento Legal</Label>
              <Textarea name="description" defaultValue={editing?.description} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Carga Inicial (Opcional)</Label>
                <Input type="number" name="before" defaultValue={editing?.before} />
              </div>
              <div className="space-y-2">
                <Label>Após Intervenção (Opcional)</Label>
                <Input type="number" name="after" defaultValue={editing?.after} />
              </div>
              <div className="space-y-2">
                <Label>Redução / Resultado</Label>
                <Input name="savings" defaultValue={editing?.savings} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Resultado Detalhado / Parecer</Label>
              <Textarea name="result" defaultValue={editing?.result} />
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
