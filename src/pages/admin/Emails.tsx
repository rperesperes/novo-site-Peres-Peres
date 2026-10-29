import { useState, useEffect, useMemo } from 'react'
import {
  getContactRequests,
  archiveContactRequest,
  ContactRequestRecord,
} from '@/services/contact_requests'
import {
  getNewsletterSubscribers,
  archiveNewsletterSubscriber,
  NewsletterSubscriberRecord,
} from '@/services/newsletter_subscribers'
import { useRealtime } from '@/hooks/use-realtime'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NewsletterSubscribersTab } from './NewsletterSubscribersTab'
import {
  Mail,
  Search,
  Archive,
  ArchiveRestore,
  Filter,
  ArrowUpDown,
  RefreshCw,
  Eye,
  MessageSquare,
  Sparkles,
  Loader2,
  Calendar,
  ExternalLink,
  Users,
} from 'lucide-react'

export type UnifiedEmailItem = {
  id: string
  kind: 'contact' | 'newsletter'
  email: string
  name?: string
  phone?: string
  message?: string
  source: string
  created: string
  archived: boolean
}

export default function AdminEmails() {
  const [contacts, setContacts] = useState<ContactRequestRecord[]>([])
  const [subscribers, setSubscribers] = useState<NewsletterSubscriberRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sourceFilter, setSourceFilter] = useState<'all' | 'contact' | 'newsletter' | 'calculator'>(
    'all',
  )
  const [showArchived, setShowArchived] = useState(false)
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
  const [selectedItem, setSelectedItem] = useState<UnifiedEmailItem | null>(null)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'subscribers'>('all')

  const { toast } = useToast()

  const loadData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true)
      else setLoading(true)

      const [contactList, subscriberList] = await Promise.all([
        getContactRequests({ includeArchived: true, sort: '-created' }),
        getNewsletterSubscribers({ includeArchived: true, sort: '-created' }),
      ])
      setContacts(contactList)
      setSubscribers(subscriberList)
    } catch (err: any) {
      console.error('Erro ao carregar e-mails e contatos:', err)
      toast({
        title: 'Erro ao carregar dados',
        description: err?.message || 'Falha ao buscar registros do banco de dados.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('contact_requests', () => {
    loadData()
  })

  useRealtime('newsletter_subscribers', () => {
    loadData()
  })

  // Unifica as duas listas em um único modelo de dados
  const unifiedItems: UnifiedEmailItem[] = useMemo(() => {
    const list: UnifiedEmailItem[] = []

    for (const c of contacts) {
      list.push({
        id: c.id,
        kind: 'contact',
        email: c.email,
        name: c.name,
        phone: c.phone,
        message: c.message,
        source: c.source_page || 'Página de Contato (/contato)',
        created: c.created,
        archived: Boolean(c.archived),
      })
    }

    for (const n of subscribers) {
      list.push({
        id: n.id,
        kind: 'newsletter',
        email: n.email,
        source: n.source || 'Rodapé (Boletim Informativo)',
        created: n.created,
        archived: Boolean(n.archived),
      })
    }

    return list
  }, [contacts, subscribers])

  // Filtragem e ordenação
  const filteredItems = useMemo(() => {
    return unifiedItems
      .filter((item) => {
        // Filtro de arquivados
        if (!showArchived && item.archived) return false
        if (showArchived && !item.archived) return false

        // Filtro por origem/tipo
        if (sourceFilter === 'contact') {
          if (item.kind !== 'contact') return false
        } else if (sourceFilter === 'newsletter') {
          if (item.kind !== 'newsletter') return false
        } else if (sourceFilter === 'calculator') {
          const s = (item.source || '').toLowerCase()
          if (!s.includes('calculadora') && !s.includes('/calculadoras')) return false
        }

        // Busca por e-mail, nome, telefone ou mensagem
        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase()
          const inEmail = item.email.toLowerCase().includes(q)
          const inName = (item.name || '').toLowerCase().includes(q)
          const inPhone = (item.phone || '').toLowerCase().includes(q)
          const inMessage = (item.message || '').toLowerCase().includes(q)
          const inSource = (item.source || '').toLowerCase().includes(q)
          if (!inEmail && !inName && !inPhone && !inMessage && !inSource) return false
        }

        return true
      })
      .sort((a, b) => {
        const timeA = new Date(a.created).getTime()
        const timeB = new Date(b.created).getTime()
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB
      })
  }, [unifiedItems, showArchived, sourceFilter, searchQuery, sortOrder])

  // Contadores
  const stats = useMemo(() => {
    const totalActive = unifiedItems.filter((i) => !i.archived).length
    const totalArchived = unifiedItems.filter((i) => i.archived).length
    const totalNewsletter = unifiedItems.filter(
      (i) => i.kind === 'newsletter' && !i.archived,
    ).length
    const totalContact = unifiedItems.filter((i) => i.kind === 'contact' && !i.archived).length

    return { totalActive, totalArchived, totalNewsletter, totalContact }
  }, [unifiedItems])

  const handleToggleArchive = async (item: UnifiedEmailItem) => {
    setActionLoadingId(item.id)
    const newArchived = !item.archived
    try {
      if (item.kind === 'contact') {
        await archiveContactRequest(item.id, newArchived)
      } else {
        await archiveNewsletterSubscriber(item.id, newArchived)
      }
      toast({
        title: newArchived ? 'Registro arquivado' : 'Registro desarquivado',
        description: newArchived
          ? 'O registro foi removido da listagem padrão.'
          : 'O registro retornou para a caixa de entrada.',
      })
      await loadData()
      if (selectedItem?.id === item.id) {
        setSelectedItem((prev) => (prev ? { ...prev, archived: newArchived } : null))
      }
    } catch (err: any) {
      console.error('Erro ao arquivar/desarquivar:', err)
      toast({
        title: 'Erro ao atualizar registro',
        description: err?.message || 'Não foi possível alterar a situação.',
        variant: 'destructive',
      })
    } finally {
      setActionLoadingId(null)
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

  const renderSourceBadge = (source: string, kind: 'contact' | 'newsletter') => {
    const s = source.toLowerCase()
    if (kind === 'newsletter') {
      return (
        <Badge className="bg-neutral-800 text-[#FAB319] border border-neutral-700 text-[11px] font-sans">
          Boletim Informativo
        </Badge>
      )
    }
    if (s.includes('calculadora') || s.includes('/calculadoras')) {
      return (
        <Badge className="bg-purple-950/80 text-purple-300 border border-purple-800 text-[11px] font-sans">
          Simulação / Calculadora
        </Badge>
      )
    }
    return (
      <Badge className="bg-blue-950/80 text-blue-300 border border-blue-800 text-[11px] font-sans">
        Fale Conosco
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Topo da seção */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            E-mails Recebidos
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 font-sans">
            Central de mensagens recebidas: Fale Conosco, assinaturas do Boletim e captação de
            simulações
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white text-xs h-9"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 mr-1.5 ${refreshing ? 'animate-spin text-[#FAB319]' : ''}`}
            />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Abas de Navegação */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="bg-neutral-900 border border-neutral-800 p-1">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-[#FAB319] data-[state=active]:text-black text-xs font-semibold"
            >
              <Mail className="h-3.5 w-3.5 mr-1.5" />
              Todos os E-mails Recebidos ({unifiedItems.length})
            </TabsTrigger>
            <TabsTrigger
              value="subscribers"
              className="data-[state=active]:bg-[#FAB319] data-[state=active]:text-black text-xs font-semibold"
            >
              <Users className="h-3.5 w-3.5 mr-1.5" />
              Assinantes do Boletim ({subscribers.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="subscribers" className="mt-6">
          <NewsletterSubscribersTab
            subscribers={subscribers}
            loading={loading}
            onReload={() => loadData(true)}
          />
        </TabsContent>

        <TabsContent value="all" className="mt-6 space-y-6">
          {/* Cards de Resumo */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4">
              <span className="text-[11px] font-mono text-neutral-400 block uppercase tracking-wider">
                Ativos na Caixa
              </span>
              <span className="text-2xl font-bold text-white mt-1 block">{stats.totalActive}</span>
              <span className="text-[11px] text-neutral-500 font-sans mt-0.5 block">
                aguardando ou em atendimento
              </span>
            </div>

            <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4">
              <span className="text-[11px] font-mono text-neutral-400 block uppercase tracking-wider">
                Fale Conosco
              </span>
              <span className="text-2xl font-bold text-blue-400 mt-1 block">
                {stats.totalContact}
              </span>
              <span className="text-[11px] text-neutral-500 font-sans mt-0.5 block">
                mensagens e solicitações
              </span>
            </div>

            <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4">
              <span className="text-[11px] font-mono text-neutral-400 block uppercase tracking-wider">
                Boletim Informativo
              </span>
              <span className="text-2xl font-bold text-[#FAB319] mt-1 block">
                {stats.totalNewsletter}
              </span>
              <span className="text-[11px] text-neutral-500 font-sans mt-0.5 block">
                assinantes inscritos
              </span>
            </div>

            <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4">
              <span className="text-[11px] font-mono text-neutral-400 block uppercase tracking-wider">
                Arquivados
              </span>
              <span className="text-2xl font-bold text-neutral-400 mt-1 block">
                {stats.totalArchived}
              </span>
              <span className="text-[11px] text-neutral-500 font-sans mt-0.5 block">
                fora da lista principal
              </span>
            </div>
          </div>

          {/* Barra de Filtros, Busca e Ordenação */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3 shadow-lg">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              {/* Busca por e-mail ou dados */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por e-mail, nome, telefone ou mensagem..."
                  className="bg-neutral-950 border-neutral-800 text-white pl-9 h-10 text-xs focus:border-[#FAB319] placeholder:text-neutral-500"
                />
              </div>

              {/* Filtro por Origem */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                <span className="text-xs text-neutral-400 flex items-center gap-1 font-mono uppercase tracking-wider shrink-0">
                  <Filter className="h-3 w-3 text-[#FAB319]" /> Origem:
                </span>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value as any)}
                  className="h-9 px-3 rounded-md bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-[#FAB319]"
                >
                  <option value="all">Todas as origens</option>
                  <option value="contact">Fale Conosco</option>
                  <option value="newsletter">Boletim Informativo</option>
                  <option value="calculator">Simulações de Calculadoras</option>
                </select>

                {/* Alternar Ordenação */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                  className="border-neutral-800 bg-neutral-950 text-neutral-300 hover:bg-neutral-800 text-xs h-9 shrink-0"
                  title="Alternar ordenação"
                >
                  <ArrowUpDown className="h-3.5 w-3.5 mr-1 text-[#FAB319]" />
                  {sortOrder === 'desc' ? 'Mais recentes primeiro' : 'Mais antigos primeiro'}
                </Button>

                {/* Alternar Caixa de Entrada vs Arquivados */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowArchived((prev) => !prev)}
                  className={`text-xs h-9 shrink-0 border-neutral-800 ${
                    showArchived
                      ? 'bg-[#FAB319] text-black font-semibold hover:bg-[#e0a116]'
                      : 'bg-neutral-950 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  {showArchived ? (
                    <>
                      <ArchiveRestore className="h-3.5 w-3.5 mr-1" /> Ver Ativos (
                      {stats.totalActive})
                    </>
                  ) : (
                    <>
                      <Archive className="h-3.5 w-3.5 mr-1" /> Ver Arquivados ({stats.totalArchived}
                      )
                    </>
                  )}
                </Button>
              </div>
            </div>

            {searchQuery && (
              <div className="flex items-center justify-between text-xs text-neutral-400 pt-1 border-t border-neutral-800">
                <span>
                  Filtrando por <strong>"{searchQuery}"</strong> ({filteredItems.length} encontrado
                  {filteredItems.length === 1 ? '' : 's'})
                </span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[#FAB319] hover:underline"
                >
                  Limpar busca
                </button>
              </div>
            )}
          </div>

          {/* Tabela de E-mails Recebidos */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="py-20 text-center text-neutral-400 flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-[#FAB319]" />
                <p className="text-sm">Carregando registros recebidos...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="py-16 px-6 text-center space-y-3 max-w-md mx-auto">
                <div className="w-12 h-12 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {showArchived ? 'Nenhum registro arquivado' : 'Nenhum e-mail recebido'}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  {showArchived
                    ? 'Os registros arquivados por meio do botão "Arquivar" aparecem aqui.'
                    : searchQuery || sourceFilter !== 'all'
                      ? 'Nenhum resultado corresponde aos filtros aplicados. Tente ajustar a busca.'
                      : 'Quando visitantes assinarem o Boletim ou enviarem o Fale Conosco, os dados aparecerão aqui em tempo real.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-neutral-950/80 border-b border-neutral-800">
                    <TableRow className="border-neutral-800 hover:bg-transparent">
                      <TableHead className="text-neutral-400 font-mono text-xs">
                        Data e Hora
                      </TableHead>
                      <TableHead className="text-neutral-400 font-mono text-xs">E-mail</TableHead>
                      <TableHead className="text-neutral-400 font-mono text-xs">
                        Remetente / Nome
                      </TableHead>
                      <TableHead className="text-neutral-400 font-mono text-xs">Origem</TableHead>
                      <TableHead className="text-neutral-400 font-mono text-xs">Telefone</TableHead>
                      <TableHead className="text-neutral-400 font-mono text-xs text-right">
                        Ações
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow
                        key={`${item.kind}-${item.id}`}
                        className="border-neutral-800 hover:bg-neutral-800/40 transition-colors"
                      >
                        <TableCell className="font-mono text-xs text-neutral-400 whitespace-nowrap">
                          {formatDate(item.created)}
                        </TableCell>
                        <TableCell className="font-medium text-white max-w-xs truncate">
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                            <span className="truncate" title={item.email}>
                              {item.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-neutral-300 max-w-[180px] truncate">
                          {item.name ? (
                            item.name
                          ) : (
                            <span className="text-neutral-500 italic">Não informado</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          <div className="flex flex-col gap-1 items-start">
                            {renderSourceBadge(item.source, item.kind)}
                            <span
                              className="text-[10px] text-neutral-400 truncate max-w-[190px] font-mono"
                              title={item.source}
                            >
                              {item.source}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-mono text-neutral-400 whitespace-nowrap">
                          {item.phone || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedItem(item)}
                              className="text-neutral-300 hover:text-white hover:bg-neutral-800 h-8 px-2.5 text-xs font-sans"
                              title="Ver detalhes"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1 text-[#FAB319]" /> Detalhes
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={actionLoadingId === item.id}
                              onClick={() => handleToggleArchive(item)}
                              className="text-neutral-400 hover:text-white hover:bg-neutral-800 h-8 px-2.5 text-xs font-sans"
                              title={item.archived ? 'Desarquivar' : 'Arquivar'}
                            >
                              {actionLoadingId === item.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : item.archived ? (
                                <>
                                  <ArchiveRestore className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                                  Desarquivar
                                </>
                              ) : (
                                <>
                                  <Archive className="h-3.5 w-3.5 mr-1 text-neutral-400" />
                                  Arquivar
                                </>
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes do Registro */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-2xl bg-neutral-900 border border-neutral-800 text-white">
          <DialogHeader className="border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-2 mb-1">
              {selectedItem && renderSourceBadge(selectedItem.source, selectedItem.kind)}
              {selectedItem?.archived && (
                <Badge className="bg-amber-950/80 text-amber-300 border border-amber-800 text-[10px] font-sans">
                  Arquivado
                </Badge>
              )}
            </div>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-[#FAB319]">●</span>
              Detalhes da Mensagem / Inscrição
            </DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4 pt-2 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-lg bg-neutral-950 border border-neutral-800">
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">
                    E-mail do Contato
                  </span>
                  <a
                    href={`mailto:${selectedItem.email}`}
                    className="text-white hover:text-[#FAB319] underline font-medium text-sm break-all"
                  >
                    {selectedItem.email}
                  </a>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">
                    Data e Hora do Cadastro
                  </span>
                  <span className="text-white font-mono flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-neutral-400" />
                    {formatDate(selectedItem.created)}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">
                    Nome Completo
                  </span>
                  <span className="text-white">{selectedItem.name || 'Não informado'}</span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">
                    Telefone / WhatsApp
                  </span>
                  <span className="text-white font-mono">
                    {selectedItem.phone || 'Não informado'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                  Página / URL de Origem
                </span>
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 break-all font-mono text-[11px] flex items-center justify-between gap-2">
                  <span>{selectedItem.source}</span>
                  {selectedItem.source.startsWith('http') && (
                    <a
                      href={selectedItem.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FAB319] hover:underline shrink-0"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {selectedItem.message && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                    Teor da Mensagem
                  </span>
                  <div className="p-3.5 rounded-lg bg-neutral-950 border-l-2 border-[#FAB319] border-neutral-800 text-neutral-200 leading-relaxed whitespace-pre-wrap">
                    {selectedItem.message}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleArchive(selectedItem)}
                  className="border-neutral-700 bg-neutral-950 text-neutral-200 hover:bg-neutral-800 text-xs"
                >
                  {selectedItem.archived ? (
                    <>
                      <ArchiveRestore className="h-3.5 w-3.5 mr-1 text-emerald-400" /> Desarquivar
                      registro
                    </>
                  ) : (
                    <>
                      <Archive className="h-3.5 w-3.5 mr-1 text-neutral-400" /> Arquivar registro
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-xs px-4"
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
