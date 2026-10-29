import { useState, useMemo } from 'react'
import {
  Download,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  Loader2,
  Mail,
  RefreshCw,
  Power,
  ShieldCheck,
  Ban,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import {
  NewsletterSubscriberRecord,
  SubscriberStatus,
  updateSubscriberStatus,
} from '@/services/newsletter_subscribers'

interface NewsletterSubscribersTabProps {
  subscribers: NewsletterSubscriberRecord[]
  loading: boolean
  onReload: () => Promise<void>
}

export function NewsletterSubscribersTab({
  subscribers,
  loading,
  onReload,
}: NewsletterSubscribersTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'ativo' | 'desativado'>('all')
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [selectedSub, setSelectedSub] = useState<NewsletterSubscriberRecord | null>(null)
  const { toast } = useToast()

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

  // Filtragem
  const filteredSubscribers = useMemo(() => {
    return subscribers
      .filter((s) => {
        const itemStatus: SubscriberStatus = s.status === 'desativado' ? 'desativado' : 'ativo'
        if (statusFilter !== 'all' && itemStatus !== statusFilter) return false

        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase()
          const inEmail = (s.email || '').toLowerCase().includes(q)
          const inSource = (s.source || '').toLowerCase().includes(q)
          if (!inEmail && !inSource) return false
        }
        return true
      })
      .sort((a, b) => {
        const tA = new Date(a.created).getTime()
        const tB = new Date(b.created).getTime()
        return tB - tA
      })
  }, [subscribers, statusFilter, searchQuery])

  // Contadores
  const stats = useMemo(() => {
    const total = subscribers.length
    const active = subscribers.filter((s) => s.status !== 'desativado').length
    const deactivated = subscribers.filter((s) => s.status === 'desativado').length
    return { total, active, deactivated }
  }, [subscribers])

  // Alternar Ativo / Desativado
  const handleToggleStatus = async (sub: NewsletterSubscriberRecord) => {
    setActionLoadingId(sub.id)
    const currentStatus: SubscriberStatus = sub.status === 'desativado' ? 'desativado' : 'ativo'
    const newStatus: SubscriberStatus = currentStatus === 'ativo' ? 'desativado' : 'ativo'

    try {
      const updated = await updateSubscriberStatus(sub.id, newStatus)
      toast({
        title: newStatus === 'ativo' ? 'Assinante ativado' : 'Assinante desativado',
        description:
          newStatus === 'ativo'
            ? `O e-mail ${sub.email} está ativo para envios do Boletim Informativo.`
            : `O e-mail ${sub.email} foi marcado como desativado a pedido do destinatário.`,
      })
      await onReload()
      if (selectedSub?.id === sub.id) {
        setSelectedSub(updated)
      }
    } catch (err: any) {
      console.error('Erro ao alternar status do assinante:', err)
      toast({
        title: 'Erro ao alterar status',
        description: err?.message || 'Não foi possível atualizar o status do assinante.',
        variant: 'destructive',
      })
    } finally {
      setActionLoadingId(null)
    }
  }

  // Download CSV com filtro ativo/desativado/todos
  const handleDownloadCsv = (filterToExport: 'all' | 'ativo' | 'desativado') => {
    const toExport = subscribers.filter((s) => {
      const itemStatus: SubscriberStatus = s.status === 'desativado' ? 'desativado' : 'ativo'
      if (filterToExport === 'all') return true
      return itemStatus === filterToExport
    })

    if (toExport.length === 0) {
      toast({
        title: 'Nenhum registro para exportar',
        description: `Não há assinantes na categoria selecionada (${filterToExport}).`,
      })
      return
    }

    const headers = [
      'E-mail',
      'Status',
      'Data de Cadastro',
      'Data da Alteracao de Status',
      'Origem',
      'ID',
    ]

    const rows = toExport.map((s) => {
      const itemStatus: SubscriberStatus = s.status === 'desativado' ? 'desativado' : 'ativo'
      const createdStr = s.created ? new Date(s.created).toLocaleString('pt-BR') : ''
      const updatedStr = s.status_updated_at
        ? new Date(s.status_updated_at).toLocaleString('pt-BR')
        : s.updated
          ? new Date(s.updated).toLocaleString('pt-BR')
          : ''
      const escape = (val: string) => `"${(val || '').replace(/"/g, '""')}"`

      return [
        escape(s.email),
        escape(itemStatus === 'ativo' ? 'Ativo' : 'Desativado'),
        escape(createdStr),
        escape(updatedStr),
        escape(s.source || 'Rodapé (Boletim Informativo)'),
        escape(s.id),
      ].join(';')
    })

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const dateStamp = new Date().toISOString().split('T')[0]
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `assinantes_boletim_informativo_${filterToExport}_${dateStamp}.csv`,
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: 'Exportação concluída',
      description: `Arquivo CSV gerado com ${toExport.length} assinante(s) (${filterToExport}).`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Cards de Resumo dos Assinantes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-400 block uppercase tracking-wider">
              Total de Assinantes
            </span>
            <Mail className="h-4 w-4 text-[#FAB319]" />
          </div>
          <span className="text-2xl font-bold text-white mt-1 block">{stats.total}</span>
          <span className="text-[11px] text-neutral-500 font-sans mt-0.5 block">
            cadastros no Boletim Informativo
          </span>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-400 block uppercase tracking-wider">
              Assinantes Ativos
            </span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold text-emerald-400 mt-1 block">{stats.active}</span>
          <span className="text-[11px] text-neutral-500 font-sans mt-0.5 block">
            aptos a receber informativos periódicos
          </span>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-400 block uppercase tracking-wider">
              Desativados / Cancelados
            </span>
            <Ban className="h-4 w-4 text-red-400" />
          </div>
          <span className="text-2xl font-bold text-red-400 mt-1 block">{stats.deactivated}</span>
          <span className="text-[11px] text-neutral-500 font-sans mt-0.5 block">
            pediram pausa ou não receber
          </span>
        </div>
      </div>

      {/* Controles de Busca, Filtro e Download CSV */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3 shadow-lg">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Busca por e-mail */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por e-mail do assinante..."
              className="bg-neutral-950 border-neutral-800 text-white pl-9 h-10 text-xs focus:border-[#FAB319] placeholder:text-neutral-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filtro de Status */}
            <div className="flex items-center gap-1.5 bg-neutral-950 px-2 py-1 rounded-md border border-neutral-800">
              <Filter className="h-3.5 w-3.5 text-[#FAB319]" />
              <span className="text-[11px] text-neutral-400 font-mono uppercase">Situação:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="h-7 px-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-[#FAB319]"
              >
                <option value="all">Todos ({stats.total})</option>
                <option value="ativo">Ativos ({stats.active})</option>
                <option value="desativado">Desativados ({stats.deactivated})</option>
              </select>
            </div>

            {/* Menu de Download CSV */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadCsv(statusFilter)}
                className="border-neutral-800 bg-neutral-950 text-neutral-200 hover:bg-neutral-800 hover:text-white text-xs h-9"
                title={`Baixar CSV (${statusFilter === 'all' ? 'Todos' : statusFilter === 'ativo' ? 'Apenas Ativos' : 'Apenas Desativados'})`}
              >
                <Download className="h-3.5 w-3.5 mr-1.5 text-[#FAB319]" />
                Baixar CSV (
                {statusFilter === 'all'
                  ? 'Todos'
                  : statusFilter === 'ativo'
                    ? 'Ativos'
                    : 'Desativados'}
                )
              </Button>

              {statusFilter !== 'all' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownloadCsv('all')}
                  className="text-neutral-400 hover:text-white text-xs h-9 px-2"
                  title="Baixar lista completa com todos os status"
                >
                  Baixar Todos
                </Button>
              )}
            </div>
          </div>
        </div>

        {searchQuery && (
          <div className="flex items-center justify-between text-xs text-neutral-400 pt-1 border-t border-neutral-800">
            <span>
              Filtrando assinantes por <strong>"{searchQuery}"</strong> (
              {filteredSubscribers.length} encontrado{filteredSubscribers.length === 1 ? '' : 's'})
            </span>
            <button onClick={() => setSearchQuery('')} className="text-[#FAB319] hover:underline">
              Limpar busca
            </button>
          </div>
        )}
      </div>

      {/* Tabela de Assinantes */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-neutral-400 flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-[#FAB319]" />
            <p className="text-sm">Carregando assinantes do Boletim Informativo...</p>
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="py-16 px-6 text-center space-y-3 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">Nenhum assinante encontrado</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              {searchQuery || statusFilter !== 'all'
                ? 'Nenhum cadastro corresponde ao filtro atual. Tente alterar ou limpar a busca.'
                : 'Quando os visitantes se inscreverem no Boletim Informativo pelo rodapé ou formulários, os e-mails aparecerão aqui com data e horário completos.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-neutral-950/80 border-b border-neutral-800">
                <TableRow className="border-neutral-800 hover:bg-transparent">
                  <TableHead className="text-neutral-400 font-mono text-xs">E-mail</TableHead>
                  <TableHead className="text-neutral-400 font-mono text-xs">Situação</TableHead>
                  <TableHead className="text-neutral-400 font-mono text-xs">
                    Data e Hora do Cadastro
                  </TableHead>
                  <TableHead className="text-neutral-400 font-mono text-xs">
                    Última Alteração de Status
                  </TableHead>
                  <TableHead className="text-neutral-400 font-mono text-xs">Origem</TableHead>
                  <TableHead className="text-neutral-400 font-mono text-xs text-right">
                    Ação / Alternar Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.map((sub) => {
                  const isDeactivated = sub.status === 'desativado'
                  const lastChange = sub.status_updated_at || sub.updated

                  return (
                    <TableRow
                      key={sub.id}
                      className="border-neutral-800 hover:bg-neutral-800/40 transition-colors"
                    >
                      <TableCell className="font-medium text-white max-w-xs">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                          <span className="truncate font-sans text-xs" title={sub.email}>
                            {sub.email}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        {isDeactivated ? (
                          <Badge className="bg-red-950/80 text-red-300 border border-red-800 text-[11px] font-sans flex items-center gap-1 w-fit">
                            <XCircle className="h-3 w-3" /> Desativado
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[11px] font-sans flex items-center gap-1 w-fit">
                            <CheckCircle2 className="h-3 w-3" /> Ativo
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="font-mono text-xs text-neutral-300 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-neutral-500" />
                          {formatDate(sub.created)}
                        </div>
                      </TableCell>

                      <TableCell className="font-mono text-xs text-neutral-400 whitespace-nowrap">
                        {lastChange ? (
                          <div className="flex items-center gap-1" title={formatDate(lastChange)}>
                            <Clock className="h-3 w-3 text-neutral-500" />
                            {formatDate(lastChange)}
                          </div>
                        ) : (
                          <span className="text-neutral-600">-</span>
                        )}
                      </TableCell>

                      <TableCell className="text-xs text-neutral-400 max-w-[180px] truncate">
                        <span className="font-mono text-[11px]" title={sub.source}>
                          {sub.source || 'Rodapé (Boletim Informativo)'}
                        </span>
                      </TableCell>

                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={actionLoadingId === sub.id}
                            onClick={() => handleToggleStatus(sub)}
                            className={`h-8 px-2.5 text-xs font-sans border-neutral-800 ${
                              isDeactivated
                                ? 'bg-emerald-950/50 text-emerald-300 hover:bg-emerald-900/60 hover:text-emerald-200'
                                : 'bg-red-950/40 text-red-300 hover:bg-red-900/50 hover:text-red-200'
                            }`}
                            title={
                              isDeactivated
                                ? 'Reativar inscrição deste e-mail'
                                : 'Desativar inscrição (caso peça para não responder mais e-mail)'
                            }
                          >
                            {actionLoadingId === sub.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                            ) : (
                              <Power className="h-3.5 w-3.5 mr-1" />
                            )}
                            {isDeactivated ? 'Reativar' : 'Desativar'}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedSub(sub)}
                            className="text-neutral-400 hover:text-white hover:bg-neutral-800 h-8 px-2 text-xs font-sans"
                            title="Ver detalhes"
                          >
                            Ver
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

      {/* Modal de Detalhes do Assinante */}
      <Dialog open={!!selectedSub} onOpenChange={(open) => !open && setSelectedSub(null)}>
        <DialogContent className="max-w-md bg-neutral-900 border border-neutral-800 text-white">
          <DialogHeader className="border-b border-neutral-800 pb-3">
            <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-[#FAB319]">●</span> Assinante do Boletim Informativo
            </DialogTitle>
          </DialogHeader>

          {selectedSub && (
            <div className="space-y-4 pt-2 text-xs font-sans">
              <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 space-y-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">
                    E-mail do Assinante
                  </span>
                  <span className="text-sm font-semibold text-white break-all">
                    {selectedSub.email}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-900">
                  <span className="text-[10px] font-mono uppercase text-neutral-400">
                    Situação Atual:
                  </span>
                  {selectedSub.status === 'desativado' ? (
                    <Badge className="bg-red-950/80 text-red-300 border border-red-800 text-[11px] font-sans">
                      Desativado
                    </Badge>
                  ) : (
                    <Badge className="bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[11px] font-sans">
                      Ativo
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-900">
                  <span className="text-[10px] font-mono uppercase text-neutral-400">
                    Data e Hora do Cadastro:
                  </span>
                  <span className="text-neutral-200 font-mono text-[11px]">
                    {formatDate(selectedSub.created)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-900">
                  <span className="text-[10px] font-mono uppercase text-neutral-400">
                    Última Alteração de Status:
                  </span>
                  <span className="text-neutral-200 font-mono text-[11px]">
                    {formatDate(selectedSub.status_updated_at || selectedSub.updated)}
                  </span>
                </div>

                <div className="pt-2 border-t border-neutral-900">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">
                    Origem do Cadastro:
                  </span>
                  <span className="text-neutral-300 font-mono text-[11px] break-all">
                    {selectedSub.source || 'Rodapé (Boletim Informativo)'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={actionLoadingId === selectedSub.id}
                  onClick={() => handleToggleStatus(selectedSub)}
                  className={`text-xs h-8 border-neutral-700 ${
                    selectedSub.status === 'desativado'
                      ? 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50'
                      : 'bg-red-950/40 text-red-300 hover:bg-red-900/50'
                  }`}
                >
                  {selectedSub.status === 'desativado'
                    ? 'Reativar Assinante'
                    : 'Desativar Assinante'}
                </Button>

                <Button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-xs px-4 h-8"
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
