import { useState, useEffect, useMemo } from 'react'
import {
  getIndices,
  IndexRecord,
  checkIndexExpiration,
  getIndexEntriesCounts,
  IndexEntryRecord,
  parseDateFlexible,
} from '@/services/indices'
import { IndexSeriesCard } from './IndexSeriesCard'
import { getCalculatorAccesses, CalculatorAccessRecord } from '@/services/calculator_accesses'
import { CALCULATORS } from '@/lib/calculatorsData'
import { useRealtime } from '@/hooks/use-realtime'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Calculator,
  TrendingUp,
  AlertTriangle,
  Clock,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Loader2,
  Filter,
  BarChart3,
  Layers,
} from 'lucide-react'

export default function AdminCalculators() {
  const [activeTab, setActiveTab] = useState<'calculators' | 'indices'>('calculators')

  // Aba Calculadoras
  const [accesses, setAccesses] = useState<CalculatorAccessRecord[]>([])
  const [loadingAccesses, setLoadingAccesses] = useState(true)
  const [periodFilter, setPeriodFilter] = useState<'all' | 'today' | '7days' | '30days' | 'year'>(
    'all',
  )
  const [calcSort, setCalcSort] = useState<'most_accessed' | 'name' | 'recent'>('most_accessed')

  // Aba Índices
  const [indices, setIndices] = useState<IndexRecord[]>([])
  const [indexCountsMap, setIndexCountsMap] = useState<Record<string, number>>({})
  const [loadingIndices, setLoadingIndices] = useState(true)
  const [errorIndices, setErrorIndices] = useState<string | null>(null)
  const [errorAccesses, setErrorAccesses] = useState<string | null>(null)

  const { toast } = useToast()

  // Carrega acessos das calculadoras
  const loadAccesses = async (period = periodFilter) => {
    try {
      setLoadingAccesses(true)
      setErrorAccesses(null)
      const data = await getCalculatorAccesses(period)
      setAccesses(data)
    } catch (err: any) {
      console.error('Erro ao buscar acessos das calculadoras:', err)
      const msg = err?.message || 'Falha ao buscar registros de uso das calculadoras.'
      setErrorAccesses(msg)
      toast({
        title: 'Erro ao carregar estatísticas',
        description: msg,
        variant: 'destructive',
      })
    } finally {
      setLoadingAccesses(false)
    }
  }

  // Carrega índices com resiliência: busca os índices principais primeiro e contagens de forma desacoplada
  const loadIndices = async () => {
    try {
      setLoadingIndices(true)
      setErrorIndices(null)
      // Carrega a coleção de índices primeiro
      const data = await getIndices()
      setIndices(data)

      // Em segundo plano, busca contagens sem que uma lentidão nelas impeça a listagem
      try {
        const counts = await getIndexEntriesCounts()
        setIndexCountsMap(counts)
      } catch (countsErr) {
        console.warn('Contagens de vigências não puderam ser carregadas de imediato:', countsErr)
      }
    } catch (err: any) {
      console.error('Erro ao buscar índices:', err)
      const msg = err?.message || 'Falha ao buscar índices cadastrados no banco de dados.'
      setErrorIndices(msg)
      toast({
        title: 'Erro ao carregar índices',
        description: msg,
        variant: 'destructive',
      })
    } finally {
      setLoadingIndices(false)
    }
  }

  useEffect(() => {
    loadAccesses(periodFilter)
    loadIndices()
  }, [])

  useRealtime('calculator_accesses', () => {
    loadAccesses(periodFilter)
  })

  useRealtime('indices', () => {
    loadIndices()
  })

  // Para index_entries, só recarrega contagens ou índices quando necessário
  useRealtime('index_entries', () => {
    loadIndices()
  })

  // Agrupamento dos acessos por calculadora
  const calculatorStats = useMemo(() => {
    const map = new Map<string, { count: number; lastAccessed: string | null }>()

    for (const acc of accesses) {
      const existing = map.get(acc.calculator_slug) || { count: 0, lastAccessed: null }
      existing.count += 1
      if (!existing.lastAccessed || new Date(acc.created) > new Date(existing.lastAccessed)) {
        existing.lastAccessed = acc.created
      }
      map.set(acc.calculator_slug, existing)
    }

    const items = CALCULATORS.map((c) => {
      const st = map.get(c.slug) || { count: 0, lastAccessed: null }
      return {
        ...c,
        accessCount: st.count,
        lastAccessedAt: st.lastAccessed,
      }
    })

    if (calcSort === 'most_accessed') {
      items.sort((a, b) => b.accessCount - a.accessCount)
    } else if (calcSort === 'name') {
      items.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
    } else if (calcSort === 'recent') {
      items.sort((a, b) => {
        const timeA = a.lastAccessedAt ? new Date(a.lastAccessedAt).getTime() : 0
        const timeB = b.lastAccessedAt ? new Date(b.lastAccessedAt).getTime() : 0
        return timeB - timeA
      })
    }

    return items
  }, [accesses, calcSort])

  // Resumo do topo para Calculadoras
  const summaryCalc = useMemo(() => {
    const total = accesses.length
    let mostUsed: { name: string; count: number } | null = null

    for (const c of calculatorStats) {
      if (c.accessCount > 0 && (!mostUsed || c.accessCount > mostUsed.count)) {
        mostUsed = { name: c.name, count: c.accessCount }
      }
    }

    return {
      totalAccesses: total,
      mostUsedName: mostUsed ? mostUsed.name : 'Nenhum acesso registrado no período',
      mostUsedCount: mostUsed ? mostUsed.count : 0,
      activeCalculators: CALCULATORS.length,
    }
  }, [accesses, calculatorStats])

  // Verificação de índices vencidos
  const indicesStatus = useMemo(() => {
    let expiredCount = 0
    let emptyCount = 0

    const list = indices.map((idx) => {
      const check = checkIndexExpiration(idx)
      if (check.isExpired) expiredCount++
      if (check.isMissing) emptyCount++
      return {
        ...idx,
        ...check,
      }
    })

    return { list, expiredCount, emptyCount }
  }, [indices])

  const handlePeriodChange = (val: 'all' | 'today' | '7days' | '30days' | 'year') => {
    setPeriodFilter(val)
    loadAccesses(val)
  }

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return 'Nunca acessada'
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
      {/* Topo da página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Calculadoras e Índices
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 font-sans">
            Métricas de utilização das ferramentas interativas e manutenção dos índices fiscais de
            referência
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as any)}
        className="space-y-6"
      >
        <TabsList className="bg-neutral-900 border border-neutral-800 p-1 rounded-xl">
          <TabsTrigger
            value="calculators"
            className="data-[state=active]:bg-[#FAB319] data-[state=active]:text-black text-xs font-semibold px-4 py-2"
          >
            <Calculator className="h-4 w-4 mr-2" /> Calculadoras ({CALCULATORS.length})
          </TabsTrigger>
          <TabsTrigger
            value="indices"
            className="data-[state=active]:bg-[#FAB319] data-[state=active]:text-black text-xs font-semibold px-4 py-2 relative"
          >
            <TrendingUp className="h-4 w-4 mr-2" /> Índices ({indices.length})
            {indicesStatus.expiredCount > 0 && (
              <span className="ml-2 px-1.5 py-0.2 rounded-full text-[10px] bg-red-600 text-white font-bold">
                {indicesStatus.expiredCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ========================================================================= */}
        {/* ABA 1: CALCULADORAS */}
        {/* ========================================================================= */}
        <TabsContent value="calculators" className="space-y-6">
          {/* Resumo no topo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                  Total de Acessos
                </span>
                <BarChart3 className="h-4 w-4 text-[#FAB319]" />
              </div>
              <div className="text-3xl font-bold text-white mt-2">{summaryCalc.totalAccesses}</div>
              <p className="text-xs text-neutral-400 mt-1 font-sans">
                {periodFilter === 'all'
                  ? 'Todo o histórico registrado'
                  : periodFilter === 'today'
                    ? 'Acessos registrados hoje'
                    : periodFilter === '7days'
                      ? 'Nos últimos 7 dias'
                      : periodFilter === '30days'
                        ? 'Nos últimos 30 dias'
                        : 'No último ano'}
              </p>
            </div>

            <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 shadow-lg md:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                  Calculadora Mais Utilizada
                </span>
                <Layers className="h-4 w-4 text-[#FAB319]" />
              </div>
              <div
                className="text-xl font-bold text-[#FAB319] mt-2 truncate"
                title={summaryCalc.mostUsedName}
              >
                {summaryCalc.mostUsedName}
              </div>
              <p className="text-xs text-neutral-400 mt-1 font-sans">
                {summaryCalc.mostUsedCount > 0 ? (
                  <>
                    <strong className="text-white">{summaryCalc.mostUsedCount}</strong> utilizaç
                    {summaryCalc.mostUsedCount === 1 ? 'ão' : 'ões'} registrada
                    {summaryCalc.mostUsedCount === 1 ? '' : 's'} no período selecionado.
                  </>
                ) : (
                  'Aguardando novos registros de simulação pelos visitantes.'
                )}
              </p>
            </div>
          </div>

          {/* Barra de Filtro de Período e Ordenação */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs text-neutral-400 flex items-center gap-1 font-mono uppercase tracking-wider shrink-0">
                <Filter className="h-3.5 w-3.5 text-[#FAB319]" /> Período:
              </span>
              <div className="flex items-center gap-1">
                {[
                  { id: 'all', label: 'Todo o histórico' },
                  { id: 'today', label: 'Hoje' },
                  { id: '7days', label: '7 dias' },
                  { id: '30days', label: '30 dias' },
                  { id: 'year', label: '1 ano' },
                ].map((p) => (
                  <Button
                    key={p.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePeriodChange(p.id as any)}
                    className={`text-xs h-8 px-2.5 border-neutral-800 ${
                      periodFilter === p.id
                        ? 'bg-[#FAB319] text-black font-semibold hover:bg-[#e0a116]'
                        : 'bg-neutral-950 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    {p.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-neutral-400 font-mono uppercase tracking-wider">
                Ordenar:
              </span>
              <select
                value={calcSort}
                onChange={(e) => setCalcSort(e.target.value as any)}
                className="h-8 px-2.5 rounded-md bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-[#FAB319]"
              >
                <option value="most_accessed">Mais acessadas primeiro</option>
                <option value="recent">Último acesso recente</option>
                <option value="name">Nome (A - Z)</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => loadAccesses()}
                disabled={loadingAccesses}
                className="border-neutral-800 bg-neutral-950 text-neutral-300 hover:bg-neutral-800 text-xs h-8"
                title="Recarregar acessos"
              >
                <RefreshCw
                  className={`h-3 w-3 ${loadingAccesses ? 'animate-spin text-[#FAB319]' : ''}`}
                />
              </Button>
            </div>
          </div>

          {/* Alerta de erro na aba de calculadoras se a consulta falhar */}
          {errorAccesses && (
            <div className="p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-200 flex items-start justify-between gap-3 shadow-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">Falha ao consultar estatísticas</h4>
                  <p className="text-xs text-red-300 mt-1 leading-relaxed">{errorAccesses}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadAccesses()}
                className="border-red-800 bg-red-900/40 text-red-100 hover:bg-red-800 hover:text-white text-xs h-8 shrink-0"
              >
                Tentar novamente
              </Button>
            </div>
          )}

          {/* Tabela de Calculadoras */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
            {loadingAccesses ? (
              <div className="py-20 text-center text-neutral-400 flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-[#FAB319]" />
                <p className="text-sm">Carregando métricas das calculadoras...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-neutral-950/80 border-b border-neutral-800">
                    <TableRow className="border-neutral-800 hover:bg-transparent">
                      <TableHead className="text-neutral-400 font-mono text-xs">
                        Calculadora
                      </TableHead>
                      <TableHead className="text-neutral-400 font-mono text-xs">
                        Categoria
                      </TableHead>
                      <TableHead className="text-neutral-400 font-mono text-xs text-center">
                        Total de Acessos
                      </TableHead>
                      <TableHead className="text-neutral-400 font-mono text-xs">
                        Último Acesso
                      </TableHead>
                      <TableHead className="text-neutral-400 font-mono text-xs text-right">
                        Link Público
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {calculatorStats.map((item) => (
                      <TableRow
                        key={item.id}
                        className="border-neutral-800 hover:bg-neutral-800/40 transition-colors"
                      >
                        <TableCell>
                          <div className="space-y-0.5">
                            <span className="font-semibold text-white block text-sm">
                              {item.name}
                            </span>
                            <span className="text-xs text-neutral-400 font-sans line-clamp-1 max-w-md">
                              {item.shortDescription}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-neutral-800 text-neutral-300 border border-neutral-700 text-[11px] font-sans">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold ${
                              item.accessCount > 0
                                ? 'bg-amber-950/80 text-[#FAB319] border border-amber-800'
                                : 'bg-neutral-950 text-neutral-500 border border-neutral-800'
                            }`}
                          >
                            {item.accessCount}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-neutral-400 whitespace-nowrap">
                          {formatDate(item.lastAccessedAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="text-[#FAB319] hover:text-white hover:bg-neutral-800 text-xs h-8 px-2 font-sans"
                          >
                            <a
                              href={`/calculadoras/${item.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1"
                            >
                              Ver <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ========================================================================= */}
        {/* ABA 2: ÍNDICES */}
        {/* ========================================================================= */}
        <TabsContent value="indices" className="space-y-6">
          {/* Alerta de erro de conexão com o banco de dados */}
          {errorIndices && (
            <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 flex items-start justify-between gap-3 shadow-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">
                    Falha ao consultar índices no banco de dados
                  </h4>
                  <p className="text-xs text-red-300 mt-1 leading-relaxed">{errorIndices}</p>
                  <p className="text-[11px] text-red-400 mt-1">
                    Os registros do banco de dados não puderam ser recuperados. Clique no botão ao
                    lado para tentar recarregar.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadIndices()}
                className="border-red-800 bg-red-900/40 text-red-100 hover:bg-red-800 hover:text-white text-xs h-8 shrink-0"
              >
                Recarregar índices
              </Button>
            </div>
          )}

          {/* Alerta no topo quando houver índices e não houver erro */}
          {!errorIndices &&
            indices.length > 0 &&
            (indicesStatus.expiredCount > 0 ? (
              <div className="p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-200 flex items-start gap-3 shadow-lg">
                <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">
                    Atenção: {indicesStatus.expiredCount} índice
                    {indicesStatus.expiredCount === 1 ? ' está vencido' : 's estão vencidos'}
                  </h4>
                  <p className="text-xs text-red-300 mt-1 leading-relaxed">
                    Os índices destacados em vermelho ultrapassaram o prazo de validade configurado
                    (padrão de 12 meses) a partir de sua última data de vigência. Atualize os
                    valores e a data para restaurar a conformidade técnica.
                  </p>
                </div>
              </div>
            ) : indicesStatus.emptyCount > 0 ? (
              <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-200 flex items-start gap-3 shadow-lg">
                <Clock className="h-5 w-5 text-[#FAB319] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {indicesStatus.emptyCount} índice
                    {indicesStatus.emptyCount === 1 ? '' : 's'} aguardando preenchimento inicial
                  </h4>
                  <p className="text-xs text-amber-300 mt-1 leading-relaxed">
                    Os índices oficiais iniciam com campos vazios para que o responsável técnico
                    cadastre os valores oficiais e suas respectivas datas de vigência diretamente no
                    painel.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-800 text-emerald-200 flex items-start gap-3 shadow-lg">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">
                    Todos os índices estão dentro do prazo de validade
                  </h4>
                  <p className="text-xs text-emerald-300 mt-1 leading-relaxed">
                    Nenhum índice cadastrado encontra-se vencido. As estimativas das calculadoras
                    estão operando com parâmetros regulares.
                  </p>
                </div>
              </div>
            ))}

          {/* Lista de Índices com Série Histórica de Vigências */}
          <div className="space-y-4">
            {loadingIndices ? (
              <div className="py-20 text-center text-neutral-400 flex flex-col items-center justify-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl">
                <Loader2 className="h-6 w-6 animate-spin text-[#FAB319]" />
                <p className="text-sm">Carregando índices e séries históricas...</p>
              </div>
            ) : indicesStatus.list.length === 0 ? (
              /* Se não houver índices mas não houve erro */
              <div className="p-12 text-center bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
                <AlertTriangle className="h-8 w-8 text-[#FAB319] mx-auto" />
                <h4 className="text-base font-bold text-white">
                  Nenhum índice retornado pelo banco
                </h4>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  {errorIndices
                    ? 'Ocorreu um erro ao carregar os dados. Verifique a mensagem acima.'
                    : 'A consulta ao banco de dados foi concluída com sucesso, mas a coleção está vazia.'}
                </p>
                <Button
                  onClick={() => loadIndices()}
                  variant="outline"
                  className="border-neutral-700 bg-neutral-950 text-white hover:bg-neutral-800 text-xs h-9"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-[#FAB319]" />
                  Recarregar
                </Button>
              </div>
            ) : (
              indicesStatus.list.map((item) => {
                const count = indexCountsMap[item.slug] || 0
                return (
                  <IndexSeriesCard
                    key={item.id}
                    item={item}
                    initialCount={count}
                    onRefresh={loadIndices}
                    formatDate={formatDate}
                  />
                )
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
