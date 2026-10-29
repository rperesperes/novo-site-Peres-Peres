import { useState, useEffect } from 'react'
import {
  getSuccessCases,
  createSuccessCase,
  updateSuccessCase,
  deleteSuccessCase,
  SuccessCaseRecord,
} from '@/services/success_cases'
import { useRealtime } from '@/hooks/use-realtime'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Plus, Edit, Trash2, CheckCircle2, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function AdminCases() {
  const [cases, setCases] = useState<SuccessCaseRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<SuccessCaseRecord | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null)

  // Campos do formulário
  const [formData, setFormData] = useState({
    title: '',
    segment: '',
    context: '',
    challenge: '',
    actions_taken: '',
    result: '',
    highlight_phrase: '',
    display_order: 1,
    status: 'published' as 'published' | 'hidden',
  })

  const { toast } = useToast()

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await getSuccessCases({ sort: 'display_order' })
      setCases(data)
    } catch (e: any) {
      console.error(e)
      toast({
        title: 'Erro ao carregar casos',
        description: e.message || 'Não foi possível carregar a lista do banco.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('success_cases', () => {
    loadData()
  })

  const openModal = (item: SuccessCaseRecord | null = null) => {
    setEditing(item)
    if (item) {
      setFormData({
        title: item.title || '',
        segment: item.segment || '',
        context: item.context || '',
        challenge: item.challenge || '',
        actions_taken: item.actions_taken || '',
        result: item.result || '',
        highlight_phrase: item.highlight_phrase || '',
        display_order: item.display_order ?? 1,
        status: (item.status === 'hidden' ? 'hidden' : 'published') as 'published' | 'hidden',
      })
    } else {
      const nextOrder =
        cases.length > 0 ? Math.max(...cases.map((c) => c.display_order || 0)) + 1 : 1
      setFormData({
        title: '',
        segment: '',
        context: '',
        challenge: '',
        actions_taken: '',
        result: '',
        highlight_phrase: '',
        display_order: nextOrder,
        status: 'published',
      })
    }
    setSaveSuccessNotice(null)
    setIsOpen(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveSuccessNotice(null)

    try {
      const slugValue =
        editing?.slug ||
        formData.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')

      const payload: Partial<SuccessCaseRecord> = {
        title: formData.title.trim(),
        segment: formData.segment.trim(),
        context: formData.context.trim(),
        challenge: formData.challenge.trim(),
        actions_taken: formData.actions_taken.trim(),
        result: formData.result.trim(),
        highlight_phrase: formData.highlight_phrase.trim(),
        display_order: Number(formData.display_order) || 1,
        status: formData.status,
        slug: slugValue,
        badge_text: editing?.badge_text || `CASO ${formData.display_order}`,
        badge_subtext: editing?.badge_subtext || formData.title.trim(),
      }

      if (editing) {
        await updateSuccessCase(editing.id, payload)
        setSaveSuccessNotice('Caso atualizado com sucesso no banco de dados!')
        toast({
          title: 'Caso atualizado',
          description: 'As alterações foram salvas com sucesso.',
        })
      } else {
        await createSuccessCase(payload)
        setSaveSuccessNotice('Novo caso cadastrado com sucesso no banco de dados!')
        toast({
          title: 'Caso criado',
          description: 'O novo caso foi gravado com sucesso no banco.',
        })
      }

      await loadData()
      setTimeout(() => {
        setIsOpen(false)
        setSaveSuccessNotice(null)
      }, 1000)
    } catch (err: any) {
      toast({
        title: 'Erro ao salvar caso',
        description: err.message || 'Ocorreu uma falha ao salvar no banco.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteSuccessCase(id)
      setDeleteConfirmId(null)
      toast({
        title: 'Caso excluído',
        description: 'O registro foi removido com sucesso do banco.',
      })
      await loadData()
    } catch (err: any) {
      toast({
        title: 'Erro ao excluir caso',
        description: err.message || 'Falha ao remover o registro.',
        variant: 'destructive',
      })
    }
  }

  const formatDate = (isoString?: string) => {
    if (!isoString) return '-'
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return isoString
    }
  }

  return (
    <div className="space-y-6">
      {/* Topo da seção: Título + Botão Novo Caso */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Casos de Sucesso
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 font-sans">
            Gerenciamento dos casos reais publicados no site institucional peresperes.com.br
          </p>
        </div>
        <Button
          onClick={() => openModal(null)}
          className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold shadow-md shrink-0 h-11 px-5"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Caso
        </Button>
      </div>

      {/* Tabela de Casos */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-neutral-400 flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-[#FAB319]" />
            <p className="text-sm">Carregando casos do banco de dados...</p>
          </div>
        ) : cases.length === 0 ? (
          /* Mensagem para lista vazia apontando para o botão Novo Caso */
          <div className="py-16 px-6 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
              <EyeOff className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">Nenhum caso foi criado</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
                Ainda não há casos cadastrados no banco de dados. Utilize o botão{' '}
                <strong className="text-white">Novo Caso</strong> no topo da página para criar o
                primeiro registro.
              </p>
            </div>
            <Button
              onClick={() => openModal(null)}
              className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-xs h-10 px-4"
            >
              <Plus className="mr-2 h-3.5 w-3.5" /> Criar Primeiro Caso
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-neutral-950/80 border-b border-neutral-800">
                <TableRow className="border-neutral-800 hover:bg-transparent">
                  <TableHead className="text-neutral-400 font-mono text-xs w-16">Ordem</TableHead>
                  <TableHead className="text-neutral-400 font-mono text-xs">Título</TableHead>
                  <TableHead className="text-neutral-400 font-mono text-xs">Segmento</TableHead>
                  <TableHead className="text-neutral-400 font-mono text-xs">Situação</TableHead>
                  <TableHead className="text-neutral-400 font-mono text-xs">
                    Última Alteração
                  </TableHead>
                  <TableHead className="text-neutral-400 font-mono text-xs text-right">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.map((item) => {
                  const isPublished = item.status !== 'hidden'
                  return (
                    <TableRow
                      key={item.id}
                      className="border-neutral-800 hover:bg-neutral-800/40 transition-colors"
                    >
                      <TableCell className="font-mono text-xs text-neutral-400">
                        #{item.display_order ?? 1}
                      </TableCell>
                      <TableCell
                        className="font-medium text-white max-w-xs truncate"
                        title={item.title}
                      >
                        {item.title}
                      </TableCell>
                      <TableCell
                        className="text-xs text-neutral-300 max-w-xs truncate"
                        title={item.segment || '-'}
                      >
                        {item.segment || '-'}
                      </TableCell>
                      <TableCell>
                        {isPublished ? (
                          <Badge className="bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[11px] font-sans font-medium flex items-center gap-1 w-fit">
                            <Eye className="h-3 w-3" /> Publicado
                          </Badge>
                        ) : (
                          <Badge className="bg-neutral-800 text-neutral-400 border border-neutral-700 text-[11px] font-sans font-medium flex items-center gap-1 w-fit">
                            <EyeOff className="h-3 w-3" /> Oculto
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-neutral-400">
                        {formatDate(item.updated || item.created)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openModal(item)}
                            className="text-neutral-300 hover:text-[#FAB319] hover:bg-neutral-800 h-8 px-2.5 text-xs font-sans"
                          >
                            <Edit className="h-3.5 w-3.5 mr-1" /> Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-950/40 h-8 px-2.5 text-xs font-sans"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" /> Excluir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="bg-neutral-900 border border-neutral-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-neutral-300 font-sans leading-relaxed">
            Tem certeza de que deseja excluir permanentemente este caso de sucesso? Esta ação não
            poderá ser desfeita.
          </p>
          <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t border-neutral-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              className="border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Sim, excluir caso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Criação / Edição do Formulário */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl bg-neutral-900 border border-neutral-800 text-white overflow-y-auto max-h-[92vh]">
          <DialogHeader className="border-b border-neutral-800 pb-4">
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#FAB319]">●</span>
              {editing ? 'Editar Caso de Sucesso' : 'Novo Caso de Sucesso'}
            </DialogTitle>
            {editing && (
              <div className="flex flex-wrap gap-4 text-xs font-mono text-neutral-400 pt-1">
                <span>Criado: {formatDate(editing.created)}</span>
                <span>Última alteração: {formatDate(editing.updated)}</span>
              </div>
            )}
          </DialogHeader>

          {saveSuccessNotice && (
            <div className="p-3.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{saveSuccessNotice}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-5 pt-2">
            {/* Título e Segmento */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-300">
                  Título do Caso <span className="text-red-400">*</span>
                </Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex.: CASO 1 — Negociação e parcelamento de débitos tributários"
                  required
                  className="bg-neutral-950 border-neutral-800 text-white focus:border-[#FAB319]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-300">
                  Segmento de Atuação <span className="text-red-400">*</span>
                </Label>
                <Input
                  value={formData.segment}
                  onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                  placeholder="Ex.: clínicas médicas e de procedimentos na área da saúde"
                  required
                  className="bg-neutral-950 border-neutral-800 text-white focus:border-[#FAB319]"
                />
              </div>
            </div>

            {/* Configurações de Exibição e Situação */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-neutral-950/60 border border-neutral-800">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-300">Ordem de Exibição</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 1 })
                  }
                  required
                  className="bg-neutral-900 border-neutral-800 text-white focus:border-[#FAB319]"
                />
                <span className="text-[11px] text-neutral-500 font-sans block">
                  Determina a posição de ordenação na lista (1 = primeiro).
                </span>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-300">Situação</Label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as 'published' | 'hidden',
                    })
                  }
                  className="w-full h-10 px-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-[#FAB319]"
                >
                  <option value="published">Publicado (visível no site)</option>
                  <option value="hidden">Oculto (apenas no painel)</option>
                </select>
                <span className="text-[11px] text-neutral-500 font-sans block">
                  Casos ocultos não aparecem nas páginas públicas do site.
                </span>
              </div>
            </div>

            {/* Frase de Destaque */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-300">
                Frase de Destaque / Resumo Principal
              </Label>
              <Textarea
                rows={2}
                value={formData.highlight_phrase}
                onChange={(e) => setFormData({ ...formData, highlight_phrase: e.target.value })}
                placeholder="Ex.: Redução de aproximadamente 50% da carga tributária com equiparação hospitalar."
                className="bg-neutral-950 border-neutral-800 text-white focus:border-[#FAB319] leading-relaxed"
              />
            </div>

            {/* Contexto */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-300">
                Contexto <span className="text-red-400">*</span>
              </Label>
              <Textarea
                rows={3}
                value={formData.context}
                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                placeholder="Histórico da empresa, regime inicial, tempo de mercado e situação prévia..."
                required
                className="bg-neutral-950 border-neutral-800 text-white focus:border-[#FAB319] leading-relaxed"
              />
              <span className="text-[11px] text-neutral-500 font-sans block">
                Aceita múltiplos parágrafos (pressione Enter para separar).
              </span>
            </div>

            {/* Desafio */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-300">
                Desafio <span className="text-red-400">*</span>
              </Label>
              <Textarea
                rows={3}
                value={formData.challenge}
                onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                placeholder="Principais obstáculos fiscais, pendências, riscos de malha ou exclusão..."
                required
                className="bg-neutral-950 border-neutral-800 text-white focus:border-[#FAB319] leading-relaxed"
              />
              <span className="text-[11px] text-neutral-500 font-sans block">
                Aceita múltiplos parágrafos.
              </span>
            </div>

            {/* O que foi feito */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-300">
                O que foi feito <span className="text-red-400">*</span>
              </Label>
              <Textarea
                rows={4}
                value={formData.actions_taken}
                onChange={(e) => setFormData({ ...formData, actions_taken: e.target.value })}
                placeholder="Detalhamento técnico da intervenção, simulações, fundamentos jurídicos aplicados..."
                required
                className="bg-neutral-950 border-neutral-800 text-white focus:border-[#FAB319] leading-relaxed"
              />
              <span className="text-[11px] text-neutral-500 font-sans block">
                Aceita múltiplos parágrafos.
              </span>
            </div>

            {/* Resultado */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-300">
                Resultado <span className="text-red-400">*</span>
              </Label>
              <Textarea
                rows={4}
                value={formData.result}
                onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                placeholder="Resultados práticos atingidos, economia gerada, afastamento de riscos e segurança..."
                required
                className="bg-neutral-950 border-neutral-800 text-white focus:border-[#FAB319] leading-relaxed"
              />
              <span className="text-[11px] text-neutral-500 font-sans block">
                Aceita múltiplos parágrafos.
              </span>
            </div>

            {/* Botões do Rodapé */}
            <DialogFooter className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => setIsOpen(false)}
                className="border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold h-11 px-6 shadow-md"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin text-black" />
                    <span>Gravando no banco...</span>
                  </>
                ) : (
                  <span>Salvar Caso</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
