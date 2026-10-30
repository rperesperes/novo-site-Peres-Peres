import { useState } from 'react'
import {
  IndexRecord,
  IndexEntryRecord,
  createIndexEntry,
  updateIndexEntry,
  deleteIndexEntry,
  checkIndexExpiration,
} from '@/services/indices'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  History,
  Bot,
  UserCheck,
  Edit2,
  Trash2,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

interface IndexSeriesCardProps {
  item: IndexRecord & ReturnType<typeof checkIndexExpiration>
  entries: IndexEntryRecord[]
  onRefresh: () => Promise<void>
  formatDate: (iso?: string | null) => string
}

export function IndexSeriesCard({ item, entries, onRefresh, formatDate }: IndexSeriesCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<IndexEntryRecord | null>(null)

  // Form states
  const [newEffectiveDate, setNewEffectiveDate] = useState('')
  const [newValue, setNewValue] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()

  const isExpired = item.isExpired
  const isMissing = item.isMissing || entries.length === 0

  const handleOpenAdd = () => {
    setNewEffectiveDate('')
    setNewValue('')
    setNewNotes('')
    setIsAddOpen(true)
  }

  const handleOpenEdit = (entry: IndexEntryRecord) => {
    setEditingEntry(entry)
    setNewEffectiveDate(entry.effective_date)
    setNewValue(entry.value)
    setNewNotes(entry.notes || '')
    setIsEditOpen(true)
  }

  const handleCreateEntry = async () => {
    if (!newEffectiveDate.trim() || !newValue.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Informe a data de início da vigência e o valor/alíquota.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsSubmitting(true)
      await createIndexEntry({
        index_id: item.id,
        index_slug: item.slug,
        effective_date: newEffectiveDate.trim(),
        value: newValue.trim(),
        notes: newNotes.trim(),
        source: 'manual',
      })

      toast({
        title: 'Nova vigência adicionada!',
        description: `Vigência iniciada em ${newEffectiveDate.trim()} cadastrada no histórico.`,
      })
      setIsAddOpen(false)
      await onRefresh()
    } catch (err: any) {
      console.error('Erro ao cadastrar vigência:', err)
      toast({
        title: 'Erro ao cadastrar',
        description: err?.message || 'Falha ao salvar nova vigência.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateEntry = async () => {
    if (!editingEntry) return
    if (!newEffectiveDate.trim() || !newValue.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Informe a data de início da vigência e o valor/alíquota.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsSubmitting(true)
      await updateIndexEntry(
        editingEntry.id,
        {
          effective_date: newEffectiveDate.trim(),
          value: newValue.trim(),
          notes: newNotes.trim(),
          source: 'manual',
        },
        item.id,
        item.slug,
      )

      toast({
        title: 'Vigência atualizada!',
        description: 'Alterações salvas com origem manual no histórico.',
      })
      setIsEditOpen(false)
      setEditingEntry(null)
      await onRefresh()
    } catch (err: any) {
      console.error('Erro ao atualizar vigência:', err)
      toast({
        title: 'Erro ao atualizar',
        description: err?.message || 'Falha ao salvar alterações.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteEntry = async (entry: IndexEntryRecord) => {
    if (
      !window.confirm(
        `Deseja realmente remover a vigência de ${entry.effective_date} (${entry.value}) do histórico?`,
      )
    ) {
      return
    }

    try {
      await deleteIndexEntry(entry.id, item.id, item.slug)
      toast({
        title: 'Vigência removida',
        description: 'O registro foi excluído da série histórica.',
      })
      await onRefresh()
    } catch (err: any) {
      console.error('Erro ao excluir vigência:', err)
      toast({
        title: 'Erro ao excluir',
        description: err?.message || 'Falha ao remover registro.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div
      className={`rounded-xl p-5 border transition-all ${
        isExpired
          ? 'bg-red-950/30 border-red-700/80 shadow-md shadow-red-950/30'
          : isMissing
            ? 'bg-neutral-900 border-neutral-800'
            : 'bg-neutral-900/90 border-neutral-800'
      }`}
    >
      {/* Cabeçalho do Card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-base font-bold text-white tracking-tight">{item.name}</h3>
            {isExpired ? (
              <Badge className="bg-red-600 text-white border-0 text-[10px] font-sans font-bold flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> VENCIDO / DESATUALIZADO
              </Badge>
            ) : isMissing ? (
              <Badge className="bg-neutral-800 text-neutral-400 border border-neutral-700 text-[10px] font-sans">
                Aguardando Cadastro
              </Badge>
            ) : (
              <Badge className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-sans flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Vigente ({item.monthsRemaining} meses
                restantes)
              </Badge>
            )}

            <Badge
              variant="outline"
              className="text-[10px] font-mono border-neutral-700 text-neutral-300"
            >
              {entries.length} vigência{entries.length === 1 ? '' : 's'} na série
            </Badge>
          </div>

          <p className="text-xs text-neutral-400 mt-1 font-sans flex items-center gap-2 flex-wrap">
            <span>
              Identificador interno: <span className="font-mono text-[#FAB319]">{item.slug}</span>
            </span>
            <span className="text-neutral-600">•</span>
            <span className="text-neutral-500 font-mono">
              Última atualização: {formatDate(item.last_updated_at || item.updated)}
            </span>
            <span className="text-neutral-600">•</span>
            <span className="inline-flex items-center gap-1">
              {item.update_source === 'automatica' ? (
                <Badge className="bg-blue-950/80 text-blue-300 border border-blue-800 text-[10px] font-sans">
                  <Bot className="h-3 w-3 mr-1" /> Mais recente: Automática
                </Badge>
              ) : (
                <Badge className="bg-neutral-800 text-neutral-300 border border-neutral-700 text-[10px] font-sans">
                  <UserCheck className="h-3 w-3 mr-1" /> Mais recente: Manual
                </Badge>
              )}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            onClick={handleOpenAdd}
            className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-xs h-9 px-3.5 shadow-md flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" /> Adicionar Nova Vigência
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setExpanded(!expanded)}
            className="border-neutral-800 bg-neutral-950 text-neutral-300 hover:bg-neutral-800 text-xs h-9 px-3 flex items-center gap-1.5"
          >
            <History className="h-3.5 w-3.5 text-[#FAB319]" />
            {expanded ? (
              <>
                Ocultar Série <ChevronUp className="h-3.5 w-3.5 ml-1" />
              </>
            ) : (
              <>
                Ver Série Histórica ({entries.length}) <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Destaque da Vigência Atual Mais Recente */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4 border-b border-neutral-850">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
            Valor Vigente Mais Recente
          </span>
          <div className="text-lg font-bold text-white font-mono">
            {item.current_value || (
              <span className="text-neutral-500 text-sm font-sans">Nenhum</span>
            )}
          </div>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
            Início da Vigência
          </span>
          <div className="text-sm font-semibold text-neutral-200 font-mono">
            {item.effective_date || (
              <span className="text-neutral-500 font-sans">Não cadastrada</span>
            )}
          </div>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
            Validade do Índice
          </span>
          <div className="text-sm font-medium text-neutral-300">
            {item.validity_months || 12} meses
            {item.expiryDate && (
              <span className="text-xs text-neutral-500 block font-mono">
                Até {item.expiryDate.toLocaleDateString('pt-BR')}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
            Observações / Origem
          </span>
          <div
            className="text-xs text-neutral-300 truncate"
            title={item.notes || 'Sem observações'}
          >
            {item.notes || <span className="text-neutral-500">Sem notas</span>}
          </div>
        </div>
      </div>

      {/* Tabela da Série Histórica Completa */}
      {expanded && (
        <div className="pt-4 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
              <History className="h-3.5 w-3.5 text-[#FAB319]" />
              Série Histórica de Vigências ({entries.length} período
              {entries.length === 1 ? '' : 's'})
            </h4>
            <span className="text-[11px] text-neutral-400 font-sans">
              Ordenada pela data de início da vigência (mais recente no topo)
            </span>
          </div>

          {entries.length === 0 ? (
            <div className="py-8 text-center text-neutral-500 text-xs bg-neutral-950/60 rounded-lg border border-neutral-800">
              Nenhuma vigência cadastrada ainda para este índice. Clique em &quot;Adicionar Nova
              Vigência&quot; acima.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-950">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-900/60 text-neutral-400 font-mono text-[11px] uppercase">
                    <th className="py-2.5 px-3">Início de Vigência</th>
                    <th className="py-2.5 px-3">Valor / Alíquota</th>
                    <th className="py-2.5 px-3">Origem</th>
                    <th className="py-2.5 px-3">Data / Hora Cadastro</th>
                    <th className="py-2.5 px-3">Observações / Fundamento</th>
                    <th className="py-2.5 px-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-850 font-sans">
                  {entries.map((entry, idx) => {
                    const isLatest = idx === 0
                    return (
                      <tr
                        key={entry.id}
                        className={`hover:bg-neutral-900/40 transition-colors ${
                          isLatest ? 'bg-amber-950/15' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 font-mono font-medium text-white flex items-center gap-1.5">
                          {entry.effective_date}
                          {isLatest && (
                            <Badge className="bg-[#FAB319] text-black text-[9px] font-bold px-1.5 py-0 h-4">
                              Atual
                            </Badge>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-white text-sm">
                          {entry.value}
                        </td>
                        <td className="py-2.5 px-3">
                          {entry.source === 'automatica' ? (
                            <Badge className="bg-blue-950 text-blue-300 border border-blue-800 text-[10px]">
                              <Bot className="h-3 w-3 mr-1" /> Automática
                            </Badge>
                          ) : (
                            <Badge className="bg-neutral-800 text-neutral-300 border border-neutral-700 text-[10px]">
                              <UserCheck className="h-3 w-3 mr-1" /> Manual
                            </Badge>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-neutral-400 text-[11px]">
                          {formatDate(entry.created)}
                        </td>
                        <td
                          className="py-2.5 px-3 text-neutral-300 text-xs max-w-xs truncate"
                          title={entry.notes}
                        >
                          {entry.notes || '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right space-x-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(entry)}
                            className="h-7 px-2 text-neutral-400 hover:text-white hover:bg-neutral-800"
                            title="Editar esta vigência"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEntry(entry)}
                            className="h-7 px-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800"
                            title="Remover vigência do histórico"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal Adicionar Nova Vigência */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Plus className="h-4 w-4 text-[#FAB319]" />
              Adicionar Nova Vigência: {item.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <p className="text-xs text-neutral-400">
              Cadastre um novo período para o índice sem apagar o histórico de vigências anteriores.
              Se for posterior às anteriores, passará a ser a vigência mais recente.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-neutral-300">
                Início da Vigência (DD/MM/AAAA ou AAAA-MM-DD) *
              </label>
              <Input
                value={newEffectiveDate}
                onChange={(e) => setNewEffectiveDate(e.target.value)}
                placeholder="Ex.: 01/01/2026 ou 2026-02-01"
                className="bg-neutral-950 border-neutral-800 text-white text-xs h-9 focus:border-[#FAB319]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-neutral-300">
                Valor ou Alíquota *
              </label>
              <Input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Ex.: R$ 1.621,00 ou 10,75%"
                className="bg-neutral-950 border-neutral-800 text-white text-xs h-9 focus:border-[#FAB319]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-neutral-300">
                Fundamento Legal / Observação (opcional)
              </label>
              <Input
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Ex.: Decreto Federal nº..., Resolução Copom..."
                className="bg-neutral-950 border-neutral-800 text-white text-xs h-9 focus:border-[#FAB319]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddOpen(false)}
              className="border-neutral-800 text-neutral-300 hover:bg-neutral-800 text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleCreateEntry}
              className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Gravando...
                </>
              ) : (
                'Salvar Nova Vigência'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Editar Vigência Existente */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Edit2 className="h-4 w-4 text-[#FAB319]" />
              Corrigir Vigência: {item.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <p className="text-xs text-neutral-400">
              Retifique as informações deste período histórico. A origem deste registro será marcada
              como <span className="text-neutral-200 font-semibold">manual</span>.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-neutral-300">
                Início da Vigência *
              </label>
              <Input
                value={newEffectiveDate}
                onChange={(e) => setNewEffectiveDate(e.target.value)}
                placeholder="DD/MM/AAAA ou AAAA-MM-DD"
                className="bg-neutral-950 border-neutral-800 text-white text-xs h-9 focus:border-[#FAB319]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-neutral-300">
                Valor ou Alíquota *
              </label>
              <Input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Ex.: R$ 1.621,00 ou 10,75%"
                className="bg-neutral-950 border-neutral-800 text-white text-xs h-9 focus:border-[#FAB319]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-neutral-300">
                Fundamento Legal / Observação (opcional)
              </label>
              <Input
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Ex.: Retificação manual com base no DOU..."
                className="bg-neutral-950 border-neutral-800 text-white text-xs h-9 focus:border-[#FAB319]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              className="border-neutral-800 text-neutral-300 hover:bg-neutral-800 text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleUpdateEntry}
              className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Salvando...
                </>
              ) : (
                'Salvar Retificação'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
