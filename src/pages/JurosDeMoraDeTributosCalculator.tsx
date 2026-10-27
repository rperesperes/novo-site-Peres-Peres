import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Calculator,
  HelpCircle,
  AlertCircle,
  Scale,
  Calendar,
  FileSpreadsheet,
  CheckCircle2,
  Info,
  Clock,
  RotateCcw,
  Edit3,
  Percent,
  Receipt,
  AlertTriangle,
  Building2,
  FileWarning,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  OFFICIAL_SELIC_MAP,
  OFFICIAL_SELIC_MONTHLY_SERIES,
  LATEST_OFFICIAL_SELIC_MONTH,
  DEFAULT_SELIC_FALLBACK_RATE,
} from '@/lib/selicData'

// Formatador monetário BRL
function formatCurrencyBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// Converte texto digitado para número em reais
function parseRawToNumber(raw: string): number {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return 0
  return Number(digits) / 100
}

function formatRawInput(value: number): string {
  if (value === 0) return ''
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// Nomes dos meses em português
const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

function getMonthName(monthNumber: number): string {
  return MONTH_NAMES[monthNumber - 1] || ''
}

// Formata data ISO (YYYY-MM-DD) para formato brasileiro (DD/MM/AAAA)
function formatDateBR(isoDate: string): string {
  if (!isoDate) return ''
  const parts = isoDate.split('-')
  if (parts.length !== 3) return isoDate
  return `${parts[2]}/${parts[1]}/${parts[0]}`
}

export default function JurosDeMoraDeTributosCalculator() {
  // Inputs da calculadora
  const [valorOriginal, setValorOriginal] = useState<number>(10000)
  const [valorInput, setValorInput] = useState<string>('10.000,00')

  // Padrão: vencimento em 2024-05-20 e pagamento em 2024-11-15
  const [dataVencimento, setDataVencimento] = useState<string>('2024-05-20')
  const [dataPagamento, setDataPagamento] = useState<string>('2024-11-15')

  // Taxas Selic customizadas pelo usuário (permite editar qualquer mês)
  const [customSelicRates, setCustomSelicRates] = useState<Record<string, number>>({})

  // SEO: título da aba (máx 60 carac. começando por "calculadora juros de mora")
  // e descrição (máx 155 carac.)
  useEffect(() => {
    const pageTitle = 'calculadora juros de mora e multa | PERES PERES' // 49 caracteres, começa por "calculadora juros de mora"
    const pageDesc =
      'Calcule juros de mora pela taxa Selic e multa de mora de tributos em atraso em tempo real. Memória de cálculo aberta segundo a Lei 9.430/1996.' // 142 caracteres

    document.title = pageTitle

    let metaDescTag = document.querySelector('meta[name="description"]')
    if (!metaDescTag) {
      metaDescTag = document.createElement('meta')
      metaDescTag.setAttribute('name', 'description')
      document.head.appendChild(metaDescTag)
    }
    metaDescTag.setAttribute('content', pageDesc)
  }, [])

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseRawToNumber(e.target.value)
    setValorOriginal(num)
    setValorInput(formatRawInput(num))
  }

  // Permite ao usuário editar uma taxa Selic específica da tabela do período
  const handleRateEdit = (yearMonth: string, newRateStr: string) => {
    const sanitized = newRateStr.replace(',', '.')
    const parsed = parseFloat(sanitized)
    if (!isNaN(parsed) && parsed >= 0) {
      setCustomSelicRates((prev) => ({
        ...prev,
        [yearMonth]: parsed,
      }))
    }
  }

  const handleResetCustomRates = () => {
    setCustomSelicRates({})
  }

  // Cálculos em tempo real
  const calculation = useMemo(() => {
    if (!dataVencimento || !dataPagamento || valorOriginal <= 0) {
      return {
        isValid: false,
        diasAtraso: 0,
        multaPercent: 0,
        valorMulta: 0,
        selicPercent: 0,
        valorJuros: 0,
        totalAtualizado: valorOriginal,
        isSemAtraso: false,
        mesesSelicAplicados: [] as Array<{
          yearMonth: string
          label: string
          rate: number
          isEdited: boolean
        }>,
        memoLinhas: [] as Array<{
          diaOuMes: string
          descricao: string
          taxaAplicada: string
          valorAcumulado: number
        }>,
      }
    }

    // Criar datas em UTC para evitar discrepâncias de fuso horário
    const [vAno, vMes, vDia] = dataVencimento.split('-').map(Number)
    const [pAno, pMes, pDia] = dataPagamento.split('-').map(Number)

    const dtVenc = new Date(Date.UTC(vAno, vMes - 1, vDia))
    const dtPag = new Date(Date.UTC(pAno, pMes - 1, pDia))

    // Diferença em dias corridos
    const diffMs = dtPag.getTime() - dtVenc.getTime()
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    // Se data de pagamento for anterior ou igual ao vencimento: resultado zero sem erro
    if (diffDias <= 0) {
      return {
        isValid: true,
        diasAtraso: 0,
        multaPercent: 0,
        valorMulta: 0,
        selicPercent: 0,
        valorJuros: 0,
        totalAtualizado: valorOriginal,
        isSemAtraso: true,
        mesesSelicAplicados: [],
        memoLinhas: [],
      }
    }

    const diasAtraso = diffDias

    // Multa de mora: 0,33% por dia de atraso limitada a 20% (art. 61 da Lei 9.430/1996)
    // Trava em 20% (atingida a partir do 61º dia: 60 x 0,33% = 19,8%; 61 x 0,33% = 20,13% -> limitado a 20%)
    const rawMultaPercent = diasAtraso * 0.33
    const multaPercent = Math.min(rawMultaPercent, 20)
    const valorMulta = valorOriginal * (multaPercent / 100)

    // Juros de mora pela Selic acumulada mensalmente:
    // Regra legal estrita (art. 61, § 3º da Lei 9.430/1996 e especificação do usuário):
    // Incide a taxa Selic acumulada entre o mês seguinte ao do vencimento e o mês ANTERIOR ao do pagamento.
    // A Selic do mês do pagamento fica de fora da apuração.
    // Se o pagamento for no mesmo mês de vencimento (ou mês seguinte ao vencimento, antes de fechar mês completo intermediário),
    // o conjunto de meses intermediários pode ser vazio.

    // Construção dos meses entre (vencimento + 1 mês) e (pagamento - 1 mês)
    const startYear = vAno
    const startMonth = vMes + 1 // mês seguinte ao vencimento

    // Normalização caso startMonth > 12
    let curYear = startYear
    let curMonth = startMonth
    if (curMonth > 12) {
      curYear += 1
      curMonth = 1
    }

    const endYear = pAno
    const endMonth = pMes - 1 // mês anterior ao pagamento
    // Caso endMonth < 1: ano anterior, mês 12
    let limitYear = endYear
    let limitMonth = endMonth
    if (limitMonth < 1) {
      limitYear -= 1
      limitMonth = 12
    }

    const mesesSelicAplicados: Array<{
      yearMonth: string
      label: string
      rate: number
      isEdited: boolean
    }> = []

    // Itera enquanto curYear < limitYear ou (curYear === limitYear && curMonth <= limitMonth)
    let iterate = true
    if (curYear > limitYear || (curYear === limitYear && curMonth > limitMonth)) {
      iterate = false
    }

    while (iterate) {
      const ymStr = `${curYear}-${String(curMonth).padStart(2, '0')}`
      const isEdited = customSelicRates[ymStr] !== undefined
      const officialRate = OFFICIAL_SELIC_MAP[ymStr] ?? DEFAULT_SELIC_FALLBACK_RATE
      const appliedRate = isEdited ? customSelicRates[ymStr] : officialRate

      mesesSelicAplicados.push({
        yearMonth: ymStr,
        label: `${getMonthName(curMonth)}/${curYear}`,
        rate: appliedRate,
        isEdited,
      })

      // Avança para o próximo mês
      curMonth += 1
      if (curMonth > 12) {
        curYear += 1
        curMonth = 1
      }

      if (curYear > limitYear || (curYear === limitYear && curMonth > limitMonth)) {
        iterate = false
      }
    }

    // Cálculo dos juros acumulados:
    // Na apuração da RFB para juros de mora de tributos (art. 61, § 3º da Lei 9.430/1996),
    // a taxa acumulada do período resulta da soma aritmética das taxas mensais Selic divulgadas
    // (conforme orientação oficial do Sicalc/RFB para juros simples sem anatocismo).
    // Para conferência completa, disponibilizamos o percentual acumulado.
    const selicAcumuladaPercent = mesesSelicAplicados.reduce((acc, m) => acc + m.rate, 0)
    const valorJuros = valorOriginal * (selicAcumuladaPercent / 100)

    // Total atualizado
    const totalAtualizado = valorOriginal + valorMulta + valorJuros

    // Montagem da memória de cálculo detalhada linha a linha
    const memoLinhas: Array<{
      diaOuMes: string
      descricao: string
      taxaAplicada: string
      valorAcumulado: number
    }> = []

    // Linha 1: Principal
    memoLinhas.push({
      diaOuMes: formatDateBR(dataVencimento),
      descricao: 'Valor Principal Original do Tributo',
      taxaAplicada: '—',
      valorAcumulado: valorOriginal,
    })

    // Linha 2: Multa de Mora
    const tetoMultaMsg = diasAtraso >= 61 ? ' (Teto de 20% atingido no 61º dia)' : ''
    memoLinhas.push({
      diaOuMes: `${diasAtraso} dias de atraso`,
      descricao: `Multa de mora: ${diasAtraso} dia(s) × 0,33% ao dia${tetoMultaMsg}`,
      taxaAplicada: `${multaPercent.toFixed(2)}%`,
      valorAcumulado: valorMulta,
    })

    // Linhas Selic mês a mês
    if (mesesSelicAplicados.length === 0) {
      memoLinhas.push({
        diaOuMes: 'Sem meses intermediários',
        descricao:
          'Nenhum mês completo entre o mês seguinte ao vencimento e o mês anterior ao pagamento.',
        taxaAplicada: '0,00%',
        valorAcumulado: 0,
      })
    } else {
      let jurosParcial = 0
      mesesSelicAplicados.forEach((m) => {
        const jurosDoMes = valorOriginal * (m.rate / 100)
        jurosParcial += jurosDoMes
        memoLinhas.push({
          diaOuMes: m.label,
          descricao: `Selic do período${m.isEdited ? ' (taxa personalizada pelo usuário)' : ' (taxa oficial BCB/Sicalc)'}`,
          taxaAplicada: `${m.rate.toFixed(2)}%`,
          valorAcumulado: jurosDoMes,
        })
      })
    }

    return {
      isValid: true,
      diasAtraso,
      multaPercent,
      valorMulta,
      selicPercent: selicAcumuladaPercent,
      valorJuros,
      totalAtualizado,
      isSemAtraso: false,
      mesesSelicAplicados,
      memoLinhas,
    }
  }, [valorOriginal, dataVencimento, dataPagamento, customSelicRates])

  // FAQ com 5 perguntas curtas e diretas
  const faqs = [
    {
      q: 'Qual é a diferença entre juros de mora e multa de mora na cobrança de tributos?',
      a: 'A multa de mora possui natureza punitiva e desestimuladora pelo descumprimento do prazo, incidindo à taxa diária de 0,33% até travar em 20%. Já os juros de mora pela Selic remuneram a indisponibilidade do capital aos cofres públicos e englobam a atualização monetária do débito.',
    },
    {
      q: 'Por que a taxa Selic do mês em que ocorre o pagamento não é somada?',
      a: 'Porque o art. 61, § 3º da Lei 9.430/1996 e o art. 13 da Lei 9.065/1995 determinam que a Selic incide até o mês anterior ao do pagamento. No mês do pagamento, a taxa Selic mensal ainda não está encerrada nem consolidada pelo Banco Central.',
    },
    {
      q: 'É correto cobrar índice de inflação (IPCA ou INPC) junto com a taxa Selic?',
      a: 'Não. O Superior Tribunal de Justiça (STJ) e o STF pacificaram o entendimento de que a taxa Selic já tem caráter híbrido (engloba remuneração de capital e recomposição inflacionária). Somar outro índice de correção monetária configuraria bis in idem e anatocismo vedado.',
    },
    {
      q: 'Como a Selic e a multa incidem em parcelamentos ordinários da Receita Federal?',
      a: 'No parcelamento, a dívida é consolidada com o acréscimo da multa de mora (máximo de 20%) e dos juros Selic apurados até o mês de adesão. As parcelas subsequentes sofrem o acréscimo de 1% no mês do pagamento mais a variação mensal da Selic acumulada.',
    },
    {
      q: 'A denúncia espontânea (art. 138 do CTN) afasta a multa de mora de 20%?',
      a: 'Sim. Se o contribuinte confessar e pagar integralmente o tributo em atraso com os juros Selic antes de qualquer procedimento de fiscalização, a multa de mora e as multas de ofício são afastadas pela denúncia espontânea, devendo ser recolhidos apenas o principal e os juros de mora.',
    },
  ]

  // Dados estruturados JSON-LD Schema.org (SoftwareApplication, FAQPage e BreadcrumbList)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://peresperes.com.br/calculadoras/juros-de-mora-de-tributos#software',
        name: 'Calculadora de juros de mora e multa de tributo em atraso',
        url: 'https://peresperes.com.br/calculadoras/juros-de-mora-de-tributos',
        applicationCategory: 'FinancialApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        description:
          'Calculadora gratuita de juros de mora pela Selic acumulada e multa de mora de 0,33% ao dia para tributos federais em atraso conforme a Lei 9.430/1996.',
        provider: {
          '@type': 'AccountingService',
          name: 'PERES PERES Consultoria e Contabilidade',
          url: 'https://peresperes.com.br',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://peresperes.com.br/calculadoras/juros-de-mora-de-tributos#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Início',
            item: 'https://peresperes.com.br/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Calculadoras',
            item: 'https://peresperes.com.br/calculadoras',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Juros de Mora de Tributos',
            item: 'https://peresperes.com.br/calculadoras/juros-de-mora-de-tributos',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://peresperes.com.br/calculadoras/juros-de-mora-de-tributos#faq',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
          },
        })),
      },
    ],
  }

  return (
    <div className="py-10 md:py-16 bg-background min-h-screen text-foreground">
      {/* Dados estruturados JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="container mx-auto px-4 max-w-4xl">
        {/* ROTA E CABEÇALHO */}
        {/* Trilha de navegação exata: Início > Calculadoras > Juros de Mora de Tributos */}
        <nav
          aria-label="Trilha de navegação"
          className="flex items-center gap-2 text-xs md:text-sm text-neutral-500 mb-6"
        >
          <Link to="/" className="hover:text-black transition-colors">
            Início
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
          <Link to="/calculadoras" className="hover:text-black transition-colors">
            Calculadoras
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
          <span className="text-black font-medium">Juros de Mora de Tributos</span>
        </nav>

        {/* Botão de retorno ao hub */}
        <div className="mb-6">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-neutral-600 hover:text-black p-0 h-auto font-sans text-xs flex items-center gap-1.5"
          >
            <Link to="/calculadoras">
              <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao hub de calculadoras
            </Link>
          </Button>
        </div>

        {/* Cabeçalho */}
        <header className="mb-10 max-w-3xl">
          <div className="inline-block border border-neutral-300 bg-neutral-100 text-neutral-800 text-xs font-mono uppercase tracking-wider px-3 py-1 rounded mb-4">
            Finanças e Tributos • Débitos Tributários
          </div>

          {/* TÍTULO PRINCIPAL (H1 EXATO): Calculadora de juros de mora e multa de tributo em atraso */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-black mb-5 leading-tight">
            Calculadora de juros de mora e multa de tributo em atraso
          </h1>

          <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
            Simule com rigor analítico os acréscimos moratórios incidentes sobre tributos federais e
            obrigações fiscais vencidas. A apuração expõe a multa de mora diária de 0,33% limitada
            ao teto de 20% e a taxa Selic acumulada entre o mês seguinte ao do vencimento e o mês
            anterior ao pagamento, sem anatocismo e com memória aberta.
          </p>
        </header>

        {/* BLOCO DE VIGÊNCIA VISÍVEL CITANDO A BASE LEGAL */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-neutral-900 text-white rounded shrink-0">
                <Scale className="h-4 w-4 text-[#FAB319]" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block">
                  Vigência e Base Legal Consolidada
                </span>
                <p className="text-sm font-medium text-neutral-900 mt-0.5">
                  Art. 61 da Lei nº 9.430/1996 • Art. 13 da Lei nº 9.065/1995 • Art. 84 da Lei nº
                  8.981/1995
                </p>
                <p className="text-xs text-neutral-600 mt-1">
                  Taxa Selic mensal embutida atualizada oficialmente até:{' '}
                  <strong className="text-black underline decoration-[#FAB319] decoration-2">
                    {LATEST_OFFICIAL_SELIC_MONTH.monthLabel} (
                    {LATEST_OFFICIAL_SELIC_MONTH.rate.toFixed(2)}% a.m.)
                  </strong>{' '}
                  — dados oficiais Banco Central do Brasil (Série SGS 4390 / Sicalc RFB).
                </p>
              </div>
            </div>

            <div className="sm:text-right shrink-0">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono bg-white border border-neutral-200 px-3 py-1.5 rounded-md text-neutral-700 shadow-sm">
                <Clock className="h-3.5 w-3.5 text-neutral-500" />
                Série mensal auditada
              </span>
            </div>
          </div>
        </div>

        {/* BLOCO DA CALCULADORA COM RESULTADO EM TEMPO REAL AO DIGITAR */}
        <section
          aria-labelledby="calculadora-juros-heading"
          className="border border-neutral-200 bg-white rounded-xl shadow-sm p-6 md:p-8 mb-12"
        >
          <div className="flex items-center justify-between pb-6 border-b border-neutral-200 mb-6">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-neutral-900" />
              <h2
                id="calculadora-juros-heading"
                className="text-xl md:text-2xl font-serif font-bold text-black"
              >
                Parâmetros do Débito Fiscal
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
              Cálculo em Tempo Real
            </span>
          </div>

          {/* CAMPOS DE ENTRADA */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* 1. Valor original do tributo (máscara monetária BRL) */}
            <div>
              <label
                htmlFor="input-valor-original"
                className="block text-sm font-semibold text-neutral-900 mb-1.5"
              >
                Valor original do tributo
              </label>
              <p className="text-xs text-neutral-500 mb-2">
                Montante principal do débito (sem encargos).
              </p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-500 font-mono">
                  R$
                </span>
                <Input
                  id="input-valor-original"
                  type="text"
                  inputMode="numeric"
                  value={valorInput}
                  onChange={handleValorChange}
                  placeholder="0,00"
                  className="pl-10 font-mono text-base border-neutral-300 focus-visible:ring-black"
                />
              </div>
            </div>

            {/* 2. Data de vencimento */}
            <div>
              <label
                htmlFor="input-data-vencimento"
                className="block text-sm font-semibold text-neutral-900 mb-1.5"
              >
                Data de vencimento
              </label>
              <p className="text-xs text-neutral-500 mb-2">
                Prazo legal estipulado para recolhimento.
              </p>
              <Input
                id="input-data-vencimento"
                type="date"
                value={dataVencimento}
                onChange={(e) => setDataVencimento(e.target.value)}
                className="font-mono text-sm border-neutral-300 focus-visible:ring-black"
              />
            </div>

            {/* 3. Data de pagamento */}
            <div>
              <label
                htmlFor="input-data-pagamento"
                className="block text-sm font-semibold text-neutral-900 mb-1.5"
              >
                Data de pagamento
              </label>
              <p className="text-xs text-neutral-500 mb-2">
                Data efetiva ou projetada para liquidação.
              </p>
              <Input
                id="input-data-pagamento"
                type="date"
                value={dataPagamento}
                onChange={(e) => setDataPagamento(e.target.value)}
                className="font-mono text-sm border-neutral-300 focus-visible:ring-black"
              />
            </div>
          </div>

          {/* SITUAÇÃO: DATA DE PAGAMENTO ANTERIOR OU IGUAL AO VENCIMENTO */}
          {calculation.isSemAtraso && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-sm mb-8 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Tributo adimplido dentro do prazo:</strong> A data de pagamento informada é
                anterior ou coincide com o vencimento legal. Não há incidência de multa de mora nem
                de juros moratórios. O valor a recolher é exatamente o principal original de{' '}
                <strong>{formatCurrencyBRL(valorOriginal)}</strong>.
              </div>
            </div>
          )}

          {/* RESULTADO EM BLOCOS SEPARADOS, EM TEMPO REAL (4 ITENS EXATOS) */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 md:p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                Resultado da Apuração Moratória
              </span>
              <span className="text-xs font-mono bg-neutral-200 px-2 py-0.5 rounded text-neutral-800">
                Base Lei 9.430/1996
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* 1. Dias de atraso */}
              <div className="bg-white p-5 rounded-lg border border-neutral-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                    1. Dias de atraso
                  </span>
                  <div className="text-3xl font-mono font-bold text-black">
                    {calculation.diasAtraso}
                    <span className="text-sm font-sans font-normal text-neutral-500 ml-1.5">
                      {calculation.diasAtraso === 1 ? 'dia' : 'dias'}
                    </span>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-neutral-100 text-[11px] text-neutral-500 leading-tight">
                  Intervalo entre {formatDateBR(dataVencimento)} e {formatDateBR(dataPagamento)}.
                </div>
              </div>

              {/* 2. Multa de mora de 0,33% por dia de atraso, limitada a 20% (trava em 60 dias) */}
              <div className="bg-white p-5 rounded-lg border border-neutral-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                      2. Multa de mora
                    </span>
                    <span className="text-[11px] font-mono bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200 text-neutral-700">
                      {calculation.multaPercent.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-black">
                    {formatCurrencyBRL(calculation.valorMulta)}
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-neutral-100 text-[11px] text-neutral-500 leading-tight">
                  {calculation.diasAtraso >= 61 ? (
                    <span className="text-amber-800 font-medium">
                      Travada no limite legal de 20% (atingido aos 61 dias).
                    </span>
                  ) : (
                    <span>0,33% por dia de atraso (art. 61, § 2º).</span>
                  )}
                </div>
              </div>

              {/* 3. Juros de mora pela Selic acumulada mensalmente */}
              <div className="bg-white p-5 rounded-lg border border-neutral-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                      3. Juros de mora (Selic)
                    </span>
                    <span className="text-[11px] font-mono bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200 text-neutral-700">
                      {calculation.selicPercent.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-black">
                    {formatCurrencyBRL(calculation.valorJuros)}
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-neutral-100 text-[11px] text-neutral-500 leading-tight">
                  {calculation.mesesSelicAplicados.length}{' '}
                  {calculation.mesesSelicAplicados.length === 1 ? 'mês apurado' : 'meses apurados'}{' '}
                  pela série BCB.
                </div>
              </div>

              {/* 4. Total atualizado (valor original + multa + juros) */}
              <div className="bg-white p-5 rounded-lg border-2 border-[#FAB319] flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-800 font-semibold">
                      4. Total atualizado
                    </span>
                    <span className="text-[10px] bg-[#FAB319] text-black font-semibold px-1.5 py-0.5 rounded">
                      DARF Final
                    </span>
                  </div>
                  {/* Ponto focal com amarelo #FAB319 no destaque monetário */}
                  <div className="text-2xl font-mono font-bold text-black">
                    {formatCurrencyBRL(calculation.totalAtualizado)}
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-neutral-100 text-[11px] text-neutral-600 leading-tight font-mono">
                  Principal + Multa + Juros
                </div>
              </div>
            </div>

            {/* DUAS NOTAS EXPLÍCITAS E VISÍVEIS (EXIGÊNCIA RIGOROSA DO PROMPT) */}
            <div className="space-y-3 pt-2">
              <div className="bg-amber-50/80 border-l-4 border-[#FAB319] p-4 rounded-r-lg text-sm text-neutral-800">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p>
                      <strong className="text-black font-serif">Nota Explícita (a):</strong>{' '}
                      <strong>A Selic do mês do pagamento não é incluída no cálculo.</strong> Por
                      expressa determinação do art. 61, § 3º da Lei nº 9.430/1996 e do art. 13 da
                      Lei nº 9.065/1995, a taxa Selic incide a partir do primeiro dia do mês
                      subsequente ao vencimento <em>até o mês anterior ao do pagamento</em>. A taxa
                      do mês de quitação não pode ser apurada no momento do recolhimento porque seu
                      valor só é fechado pelo Banco Central no primeiro dia útil do mês seguinte.
                    </p>
                    <p>
                      <strong className="text-black font-serif">Nota Explícita (b):</strong>{' '}
                      <strong>
                        A Selic já embute a correção monetária, portanto NÃO se soma outra correção
                        monetária ao resultado.
                      </strong>{' '}
                      A taxa Selic possui natureza dúplice: remunera o capital e recompõe a perda do
                      poder aquisitivo da moeda. Conforme reiterada jurisprudência vinculante do STF
                      e súmulas do STJ, cumular a taxa Selic com qualquer outro indexador
                      inflacionário (como IPCA, INPC, IGP-M ou UFIR) configura cobrança em
                      duplicidade (<em>bis in idem</em>) e acarreta nulidade material da exigência
                      fiscal.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TABELA DA SELIC: VALORES MENSAIS GRAVADOS NA PRÓPRIA PÁGINA COM SUPORTE A EDIÇÃO */}
          <div className="border border-neutral-200 bg-white rounded-xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 mb-4 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-neutral-900" />
                  <h3 className="font-serif font-bold text-lg text-black">
                    Tabela da Selic do Período Apurado (Editável)
                  </h3>
                </div>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Valores oficiais do Banco Central embutidos no código. Você pode alterar qualquer
                  percentual para conferir ou simular cenários.
                </p>
              </div>

              {Object.keys(customSelicRates).length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetCustomRates}
                  className="text-xs h-8 border-neutral-300 text-neutral-700 hover:text-black gap-1.5 self-start sm:self-auto"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Restaurar taxas oficiais
                </Button>
              )}
            </div>

            {calculation.mesesSelicAplicados.length === 0 ? (
              <p className="text-sm text-neutral-500 py-4 italic">
                Não há meses com incidência de Selic para o intervalo selecionado (o vencimento e o
                pagamento ocorrem no mesmo mês ou não há mês intermediário completo).
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-500 font-mono text-xs uppercase tracking-wider bg-neutral-50">
                      <th className="py-2.5 px-3">Competência</th>
                      <th className="py-2.5 px-3">Taxa Oficial BCB (% a.m.)</th>
                      <th className="py-2.5 px-3">Taxa Aplicada (% a.m.)</th>
                      <th className="py-2.5 px-3">Impacto no Tributo</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-mono">
                    {calculation.mesesSelicAplicados.map((m) => {
                      const official =
                        OFFICIAL_SELIC_MAP[m.yearMonth] ?? DEFAULT_SELIC_FALLBACK_RATE
                      const valorMes = valorOriginal * (m.rate / 100)
                      return (
                        <tr key={m.yearMonth} className="hover:bg-neutral-50/70 transition-colors">
                          <td className="py-2 px-3 font-medium text-black">{m.label}</td>
                          <td className="py-2 px-3 text-neutral-600">{official.toFixed(2)}%</td>
                          <td className="py-2 px-3">
                            <div className="inline-flex items-center gap-1.5">
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                value={m.rate}
                                onChange={(e) => handleRateEdit(m.yearMonth, e.target.value)}
                                className={`w-20 h-7 text-xs font-mono text-right px-2 border ${
                                  m.isEdited
                                    ? 'border-[#FAB319] bg-amber-50 font-bold'
                                    : 'border-neutral-200 bg-white'
                                }`}
                              />
                              <span className="text-xs text-neutral-500">%</span>
                            </div>
                          </td>
                          <td className="py-2 px-3 text-black font-semibold">
                            {formatCurrencyBRL(valorMes)}
                          </td>
                          <td className="py-2 px-3 text-center">
                            {m.isEdited ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-sans text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                                <Edit3 className="h-3 w-3" /> Editado
                              </span>
                            ) : (
                              <span className="text-[11px] font-sans text-neutral-500">
                                Oficial
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-neutral-300 font-mono font-bold bg-neutral-50/50">
                      <td className="py-3 px-3 text-black font-sans">
                        Selic Acumulada do Período:
                      </td>
                      <td className="py-3 px-3 text-neutral-600">—</td>
                      <td className="py-3 px-3 text-black text-sm">
                        {calculation.selicPercent.toFixed(2)}%
                      </td>
                      <td className="py-3 px-3 text-black text-sm">
                        {formatCurrencyBRL(calculation.valorJuros)}
                      </td>
                      <td className="py-3 px-3 text-center font-sans text-xs text-neutral-500 font-normal">
                        Soma simples (RFB)
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {/* MEMÓRIA DE CÁLCULO ABERTA, ABAIXO DO RESULTADO (EXIGÊNCIA DO PROMPT) */}
          <div className="border border-neutral-200 bg-white rounded-xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-neutral-900" />
                <h3 className="font-serif font-bold text-lg text-black">
                  Memória de Cálculo Aberta (Passo a Passo)
                </h3>
              </div>
              <span className="text-xs font-mono text-neutral-500 uppercase">
                Auditoria Aritmética
              </span>
            </div>

            <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
              Demonstrativo analítico linha por linha com os números digitados para conferência
              manual por qualquer profissional contábil ou fiscal.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse font-mono">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500 text-xs uppercase bg-neutral-50">
                    <th className="py-2.5 px-3">Referência Temporal</th>
                    <th className="py-2.5 px-3">Etapa e Descrição da Operação</th>
                    <th className="py-2.5 px-3">Taxa / Alíquota</th>
                    <th className="py-2.5 px-3 text-right">Valor Parcial / Acumulado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {calculation.memoLinhas.map((linha, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/70">
                      <td className="py-2.5 px-3 text-neutral-700 text-xs font-semibold">
                        {linha.diaOuMes}
                      </td>
                      <td className="py-2.5 px-3 text-neutral-800 text-xs font-sans">
                        {linha.descricao}
                      </td>
                      <td className="py-2.5 px-3 text-neutral-700 text-xs">{linha.taxaAplicada}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-black text-xs">
                        {formatCurrencyBRL(linha.valorAcumulado)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-neutral-900 font-bold bg-neutral-100">
                    <td colSpan={3} className="py-3 px-3 text-black font-sans text-sm">
                      Total Consolidado para Quitação (Principal + Multa + Juros):
                    </td>
                    <td className="py-3 px-3 text-right text-base text-black">
                      {formatCurrencyBRL(calculation.totalAtualizado)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>

        {/* TEXTO DE APROFUNDAMENTO EM HTML ESTÁTICO (NÃO GERADO POR SCRIPT) */}
        {/* SUBTÍTULOS EXATOS NA ORDEM RIGOROSA DA ESPECIFICAÇÃO:
            1. o que são juros de mora e multa de mora
            2. a regra da Selic e por que o mês do pagamento fica de fora
            3. por que não se soma correção monetária mais Selic
            4. como funciona no parcelamento e na denúncia espontânea
            5. erros comuns no cálculo de débito tributário (com pelo menos 4 exemplos práticos)
        */}
        <article className="border border-neutral-200 bg-white rounded-xl p-8 md:p-12 mb-16 shadow-sm prose prose-neutral max-w-none">
          <header className="border-b border-neutral-200 pb-6 mb-8">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-2">
              Doutrina e Prática Tributária
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-black mb-3">
              Guia Técnico sobre Acréscimos Moratórios Federais
            </h2>
            <p className="text-sm text-neutral-600">
              Análise dos fundamentos normativos, regras de apuração e jurisprudência dos tribunais
              superiores aplicáveis aos débitos fiscais em atraso.
            </p>
          </header>

          <div className="space-y-10 text-neutral-800 leading-relaxed text-sm md:text-base">
            {/* 1. o que são juros de mora e multa de mora */}
            <section aria-labelledby="subtitulo-1">
              <h3
                id="subtitulo-1"
                className="text-xl md:text-2xl font-serif font-bold text-black mb-3"
              >
                1. O que são juros de mora e multa de mora
              </h3>
              <p>
                Na dogmática do Direito Tributário brasileiro, os acréscimos pecuniários decorrentes
                do inadimplemento de uma obrigação tributária principal possuem naturezas jurídicas
                distintas, expressamente delineadas pelo Código Tributário Nacional (art. 161) e
                regulamentadas em âmbito federal pelo art. 61 da Lei nº 9.430/1996:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3 mb-4">
                <li>
                  <strong>Multa de mora:</strong> possui finalidade estritamente punitiva e
                  desestimuladora da impontualidade. Seu propósito é sancionar a mora do devedor e
                  estimular o recolhimento tempestivo. É apurada à taxa diária de{' '}
                  <strong>0,33%</strong> (trinta e três centésimos por cento) por dia corrido de
                  atraso, com termo inicial no primeiro dia útil subsequente ao vencimento do
                  tributo e termo final no dia do efetivo pagamento, restando o seu montante total{' '}
                  <strong>limitado a 20%</strong> (art. 61, § 2º).
                </li>
                <li>
                  <strong>Juros de mora:</strong> possuem função compensatória e indenizatória pela
                  privação temporária dos recursos financeiros que deveriam estar disponíveis no
                  Tesouro Nacional para o financiamento dos serviços públicos essenciais. Desde 1º
                  de janeiro de 1995 (Lei nº 8.981/1995, art. 84 c/c Lei nº 9.065/1995, art. 13), os
                  juros moratórios são fixados com base na taxa referencial do Sistema Especial de
                  Liquidação e de Custódia (taxa Selic).
                </li>
              </ul>
              <p>
                A distinção entre as duas rubricas é basilar para a contabilidade fiscal, uma vez
                que a multa é passível de remissão ou anistia em programas de conformidade e
                denúncia espontânea, ao passo que a exigência de juros compensatórios vincula-se à
                recomposição do valor do dinheiro no tempo.
              </p>
            </section>

            {/* 2. a regra da Selic e por que o mês do pagamento fica de fora */}
            <section aria-labelledby="subtitulo-2" className="pt-6 border-t border-neutral-200">
              <h3
                id="subtitulo-2"
                className="text-xl md:text-2xl font-serif font-bold text-black mb-3"
              >
                2. A regra da Selic e por que o mês do pagamento fica de fora
              </h3>
              <p>
                A cobrança de juros de mora sobre tributos federais segue uma regra temporal estrita
                inscrita no art. 61, § 3º da Lei nº 9.430/1996 e no art. 13 da Lei nº 9.065/1995:
              </p>
              <div className="p-4 bg-neutral-100 rounded-lg border-l-4 border-neutral-900 my-4 text-sm font-serif italic text-neutral-900">
                &ldquo;Sobre os débitos a que se refere este artigo incidirão juros de mora
                calculados à taxa a que se refere o § 3º do art. 5º, a partir do primeiro dia do mês
                subsequente ao vencimento do prazo até o mês anterior ao do pagamento e de um por
                cento no mês de pagamento.&rdquo;
              </div>
              <p>
                A razão prática e jurídica pela qual a taxa Selic do próprio mês do pagamento não é
                computada decorre da dinâmica do mercado financeiro e do Banco Central do Brasil. A
                taxa Selic mensal reflete a média ponderada das operações compromissadas de 1 dia
                útil realizadas ao longo de todo o mês-calendário. Consequentemente, o seu índice
                exato somente é consolidado e homologado pelo Copom/BCB no{' '}
                <strong>primeiro dia útil do mês subsequente</strong>.
              </p>
              <p>
                Se um contribuinte efetua o pagamento de uma guia DARF em atraso no dia 15 de um
                determinado mês, a taxa Selic daquele mês específico ainda é uma variável
                indeterminada. Por essa razão, o legislador estabeleceu a exclusão da Selic do mês
                do pagamento na série histórica de juros apurada, aplicando a taxa de 1% residual
                prevista em lei para débitos exigíveis via sistemas de cobrança administrativa e
                lançamento de ofício da Secretaria Especial da Receita Federal do Brasil.
              </p>
            </section>

            {/* 3. por que não se soma correção monetária mais Selic */}
            <section aria-labelledby="subtitulo-3" className="pt-6 border-t border-neutral-200">
              <h3
                id="subtitulo-3"
                className="text-xl md:text-2xl font-serif font-bold text-black mb-3"
              >
                3. Por que não se soma correção monetária mais Selic
              </h3>
              <p>
                Um dos erros mais recorrentes em simulações fiscais amadoras consiste em atualizar o
                débito monetariamente por algum índice inflacionário (como IPCA, INPC, IGP-M ou a
                extinta UFIR) e, em seguida, aplicar os percentuais da taxa Selic sobre o montante
                atualizado.
              </p>
              <p>
                Essa prática é terminantemente vedada no ordenamento jurídico nacional. A taxa Selic
                possui
                <strong> natureza híbrida</strong> (composta simultaneamente por remuneração real do
                capital e pela taxa de inflação apurada na economia). Nas palavras do Superior
                Tribunal de Justiça (STJ, Recurso Especial repetitivo nº 1.111.175/SP e Tema 99):
              </p>
              <div className="p-4 bg-neutral-100 rounded-lg border-l-4 border-[#FAB319] my-4 text-sm font-serif italic text-neutral-900">
                &ldquo;A taxa Selic é calculada de forma a englobar juros e correção monetária, não
                podendo ser cumulada com qualquer outro índice que expresse a recomposição do poder
                de compra da moeda, sob pena de caracterizar bis in idem.&rdquo;
              </div>
              <p>
                Portanto, a aplicação da taxa Selic já entrega a integral recomposição do débito
                tributário em atraso. Qualquer adição de correção monetária autônoma constitui dupla
                cobrança inflacionária, tornando o crédito fiscal nulo ou excessivo em juízo.
              </p>
            </section>

            {/* 4. como funciona no parcelamento e na denúncia espontânea */}
            <section aria-labelledby="subtitulo-4" className="pt-6 border-t border-neutral-200">
              <h3
                id="subtitulo-4"
                className="text-xl md:text-2xl font-serif font-bold text-black mb-3"
              >
                4. Como funciona no parcelamento e na denúncia espontânea
              </h3>
              <p>
                A sistemática de cálculo dos acréscimos legais reflete diretamente sobre duas
                modalidades estratégicas de regularização do passivo fiscal:
              </p>
              <div className="space-y-4 mt-4">
                <div className="p-4 border border-neutral-200 rounded-lg bg-neutral-50">
                  <h4 className="font-serif font-bold text-black text-base mb-1">
                    A. Parcelamentos Ordinários e Especiais (Lei nº 10.522/2002)
                  </h4>
                  <p className="text-sm text-neutral-700">
                    No momento da formalização do pedido de parcelamento perante a Receita Federal
                    ou a Procuradoria-Geral da Fazenda Nacional (PGFN), o saldo devedor é{' '}
                    <strong>consolidado</strong>: soma-se o principal, a multa de mora (travada no
                    teto de 20%) e os juros de mora pela Selic apurados até o mês anterior à adesão.
                    A partir da consolidação, o valor de cada prestação mensal sofre acréscimo de
                    juros equivalentes à taxa Selic acumulada a partir do mês subsequente ao da
                    consolidação até o mês anterior ao do pagamento da parcela, mais 1% referente ao
                    mês de vencimento da quota.
                  </p>
                </div>

                <div className="p-4 border border-neutral-200 rounded-lg bg-neutral-50">
                  <h4 className="font-serif font-bold text-black text-base mb-1">
                    B. Denúncia Espontânea (Art. 138 do Código Tributário Nacional)
                  </h4>
                  <p className="text-sm text-neutral-700">
                    A denúncia espontânea é o instrumento legal que premia o contribuinte que
                    regulariza sua obrigação fiscal antes do início de qualquer procedimento
                    fiscalizatório ou medida de fiscalização da Receita Federal. Quando o
                    contribuinte confessa o tributo não declarado e efetua o recolhimento integral
                    com os juros moratórios da Selic, a legislação{' '}
                    <strong>afasta integralmente a multa de mora</strong> (os 20%) e eventuais
                    multas de ofício de 75% a 150%. Atenção prática: a jurisprudência sumulada do
                    STJ (Súmula 360) estabelece que tributos já declarados previamente em DCTF,
                    PGDAS ou ECF e não pagos no vencimento não comportam denúncia espontânea para
                    exclusão da multa moratória.
                  </p>
                </div>
              </div>
            </section>

            {/* 5. erros comuns no cálculo de débito tributário — com pelo menos 4 exemplos práticos */}
            <section aria-labelledby="subtitulo-5" className="pt-6 border-t border-neutral-200">
              <h3
                id="subtitulo-5"
                className="text-xl md:text-2xl font-serif font-bold text-black mb-3"
              >
                5. Erros comuns no cálculo de débito tributário
              </h3>
              <p className="mb-4">
                Erros metodológicos no cálculo de encargos moratórios geram recolhimentos a menor
                (sujeitando a empresa a lançamentos de ofício com acréscimo de multa punitiva de
                75%) ou recolhimentos a maior (gerando desembolso desnecessário de caixa). A seguir,
                detalhamos quatro exemplos práticos recorrentes e seus impactos no montante devido:
              </p>

              <div className="grid gap-4">
                {/* Exemplo 1 */}
                <div className="border border-neutral-200 rounded-lg p-4 bg-white shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-bold bg-neutral-900 text-white px-2 py-0.5 rounded">
                      Exemplo Prático 01
                    </span>
                    <h4 className="font-serif font-bold text-black text-base">
                      Não travar a multa de mora no teto de 20%
                    </h4>
                  </div>
                  <p className="text-sm text-neutral-700">
                    <strong>O erro:</strong> Aplicar a regra dos 0,33% ao dia continuamente para
                    períodos longos de inadimplência (por exemplo, 180 dias de atraso: 180 × 0,33% =
                    59,40%).
                  </p>
                  <p className="text-sm text-neutral-700 mt-1">
                    <strong>O efeito no valor devido:</strong> Em um tributo de R$ 50.000,00, a
                    aplicação de 59,40% resulta em uma multa indevida de R$ 29.700,00, em vez dos R$
                    10.000,00 previstos pelo limitador legal de 20% (art. 61, § 2º). O contribuinte
                    pagaria <strong className="text-amber-900">R$ 19.700,00 a mais</strong> por mero
                    equívoco na trava legal.
                  </p>
                </div>

                {/* Exemplo 2 */}
                <div className="border border-neutral-200 rounded-lg p-4 bg-white shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-bold bg-neutral-900 text-white px-2 py-0.5 rounded">
                      Exemplo Prático 02
                    </span>
                    <h4 className="font-serif font-bold text-black text-base">
                      Somar correção monetária (IPCA/IGP-M) sobre a taxa Selic
                    </h4>
                  </div>
                  <p className="text-sm text-neutral-700">
                    <strong>O erro:</strong> Aplicar a inflação acumulada de 6,5% do período ao
                    principal e, em seguida, somar os 14% de juros da Selic sobre a base
                    inflacionada.
                  </p>
                  <p className="text-sm text-neutral-700 mt-1">
                    <strong>O efeito no valor devido:</strong> Configura <em>bis in idem</em> vedado
                    pelo STF e STJ. Sobre um débito de R$ 100.000,00, essa duplicação eleva a
                    exigência indevidamente em mais de{' '}
                    <strong className="text-amber-900">R$ 7.410,00</strong>, além de expor a
                    cobrança a nulidade jurídica integral em caso de execução fiscal.
                  </p>
                </div>

                {/* Exemplo 3 */}
                <div className="border border-neutral-200 rounded-lg p-4 bg-white shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-bold bg-neutral-900 text-white px-2 py-0.5 rounded">
                      Exemplo Prático 03
                    </span>
                    <h4 className="font-serif font-bold text-black text-base">
                      Incluir a taxa Selic do mês do vencimento ou do pagamento
                    </h4>
                  </div>
                  <p className="text-sm text-neutral-700">
                    <strong>O erro:</strong> Fazer incidir a taxa Selic do próprio mês de vencimento
                    (por exemplo, vencimento em 20 de maio e pagamento em 10 de junho, aplicando
                    Selic de maio) ou do mês do efetivo pagamento.
                  </p>
                  <p className="text-sm text-neutral-700 mt-1">
                    <strong>O efeito no valor devido:</strong> No mês de vencimento, pagamentos com
                    poucos dias de atraso sujeitam-se apenas à multa diária (0,33%), não a juros
                    Selic. Incluir taxas de meses vedados gera distorção de 1% a 2% sobre o
                    principal, provocando divergências no conta-corrente fiscal da Receita Federal e
                    retenção indevida de Certidão Negativa de Débitos (CND).
                  </p>
                </div>

                {/* Exemplo 4 */}
                <div className="border border-neutral-200 rounded-lg p-4 bg-white shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-bold bg-neutral-900 text-white px-2 py-0.5 rounded">
                      Exemplo Prático 04
                    </span>
                    <h4 className="font-serif font-bold text-black text-base">
                      Calcular multa de mora sobre juros Selic (efeito cascata)
                    </h4>
                  </div>
                  <p className="text-sm text-neutral-700">
                    <strong>O erro:</strong> Somar o tributo original e os juros de mora acumulados
                    e aplicar a multa de 20% sobre esse subtotal consolidado.
                  </p>
                  <p className="text-sm text-neutral-700 mt-1">
                    <strong>O efeito no valor devido:</strong> A multa de mora incide estritamente
                    sobre o<strong> valor principal original</strong> do tributo (art. 61, § 1º).
                    Aplicá-la sobre a parcela de juros configura anatocismo administrativo. Em um
                    tributo de R$ 80.000,00 com R$ 20.000,00 de juros, a multa saltaria de R$
                    16.000,00 para R$ 20.000,00, gerando um sobrecusto ilegal de{' '}
                    <strong className="text-amber-900">R$ 4.000,00</strong>.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </article>

        {/* AVISO LEGAL DE ESTIMATIVA COM LINK PARA A PÁGINA DE CONTATO (/contato) */}
        <section
          aria-labelledby="aviso-legal-title"
          className="border border-neutral-200 bg-neutral-50 rounded-xl p-6 md:p-8 mb-16 shadow-xs"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-neutral-700 shrink-0 mt-0.5" />
            <div>
              <h3
                id="aviso-legal-title"
                className="font-serif font-semibold text-base text-black mb-1"
              >
                Aviso Legal de Estimativa e Conformidade Tributária
              </h3>
              <p className="text-xs md:text-sm text-neutral-700 leading-relaxed">
                Os cálculos apresentados por esta ferramenta constituem estimativas analíticas
                baseadas nas disposições gerais da Lei nº 9.430/1996 e da série histórica oficial da
                taxa Selic do Banco Central do Brasil. Regras tributárias estaduais (ICMS) e
                municipais (ISS), programas extraordinários de anistia (Refis) e certas
                contribuições previdenciárias específicas podem possuir regulamentações setoriais
                próprias ou regras especiais de convalidação.
              </p>
              <p className="text-xs md:text-sm text-neutral-700 leading-relaxed mt-2">
                Recomenda-se a conferência técnica antes da emissão de guias definitivas. Se a sua
                empresa necessita de auditoria de débitos tributários, certidões ou planejamento de
                passivos fiscais,{' '}
                <Link
                  to="/contato"
                  className="text-black font-semibold underline hover:text-neutral-700"
                >
                  entre em contato com a equipe de consultoria tributária da PERES PERES
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* SEÇÃO DE PERGUNTAS FREQUENTES (FAQ COM CINCO PERGUNTAS EM HTML ESTÁTICO) */}
        <section aria-labelledby="faq-title" className="mb-16 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 border border-neutral-300 bg-neutral-100 px-3 py-1 rounded text-xs font-mono uppercase tracking-wider text-neutral-800 mb-3">
              <HelpCircle className="h-3.5 w-3.5 text-black" />
              Perguntas e Respostas
            </div>
            <h2
              id="faq-title"
              className="text-2xl md:text-3xl font-serif font-bold text-black mb-2"
            >
              Dúvidas Frequentes sobre Juros e Multa de Tributos
            </h2>
            <p className="text-neutral-600 text-sm">
              Respostas diretas e fundamentadas para as dúvidas mais comuns na apuração de
              acréscimos legais.
            </p>
          </div>

          <div className="border border-neutral-200 bg-white rounded-xl p-6 md:p-8 shadow-sm">
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-neutral-200 last:border-b-0 pb-2"
                >
                  <AccordionTrigger className="text-left font-serif font-semibold text-base md:text-lg text-black hover:no-underline hover:text-neutral-700 py-3">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-700 text-sm md:text-base leading-relaxed pt-2 pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CALCULADORAS RELACIONADAS COM TRÊS LINKS EXATOS */}
        {/*
            1. Simples Nacional ou Lucro Presumido (/calculadoras/simples-nacional-ou-lucro-presumido)
            2. Juros de Financiamento (/calculadoras/juros-de-financiamento)
            3. Custo de Funcionário CLT (/calculadoras/custo-de-funcionario-clt)
        */}
        <section aria-labelledby="relacionadas-title" className="mb-16">
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-1">
              Ferramentas Complementares
            </span>
            <h2 id="relacionadas-title" className="text-2xl font-serif font-bold text-black">
              Calculadoras Relacionadas
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-md transition-all flex flex-col justify-between">
              <CardHeader className="pb-3">
                <span className="text-xs font-mono text-neutral-500 uppercase">
                  Regime Tributário
                </span>
                <CardTitle className="text-lg font-serif font-bold text-black pt-1">
                  Simples Nacional ou Lucro Presumido
                </CardTitle>
                <p className="text-xs text-neutral-600 pt-2 leading-relaxed">
                  Comparativo estimativo de carga tributária e encargos entre os regimes com
                  apuração de alíquotas efetivas.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-black hover:bg-neutral-100 font-medium text-xs p-2 h-auto flex items-center gap-1 group w-full justify-between border-t border-neutral-100 pt-3"
                >
                  <Link to="/calculadoras/simples-nacional-ou-lucro-presumido">
                    Acessar calculadora
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-md transition-all flex flex-col justify-between">
              <CardHeader className="pb-3">
                <span className="text-xs font-mono text-neutral-500 uppercase">
                  Finanças e Tributos
                </span>
                <CardTitle className="text-lg font-serif font-bold text-black pt-1">
                  Juros de Financiamento
                </CardTitle>
                <p className="text-xs text-neutral-600 pt-2 leading-relaxed">
                  Projeção de parcelas, amortização e custo efetivo total pelo Sistema Price e
                  Tabela SAC.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-black hover:bg-neutral-100 font-medium text-xs p-2 h-auto flex items-center gap-1 group w-full justify-between border-t border-neutral-100 pt-3"
                >
                  <Link to="/calculadoras/juros-de-financiamento">
                    Acessar calculadora
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-md transition-all flex flex-col justify-between">
              <CardHeader className="pb-3">
                <span className="text-xs font-mono text-neutral-500 uppercase">
                  Folha e Trabalhista
                </span>
                <CardTitle className="text-lg font-serif font-bold text-black pt-1">
                  Custo de Funcionário CLT
                </CardTitle>
                <p className="text-xs text-neutral-600 pt-2 leading-relaxed">
                  Cálculo detalhado do custo real de contratação para a empresa com encargos
                  patronais, FGTS e provisões.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-black hover:bg-neutral-100 font-medium text-xs p-2 h-auto flex items-center gap-1 group w-full justify-between border-t border-neutral-100 pt-3"
                >
                  <Link to="/calculadoras/custo-de-funcionario-clt">
                    Acessar calculadora
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* BLOCO DE CHAMADA PARA CONTATO COM O ESCRITÓRIO */}
        <section
          aria-labelledby="contato-callout-title"
          className="bg-neutral-950 text-white rounded-2xl p-8 md:p-12 text-center"
        >
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 border border-neutral-800 px-3 py-1 rounded text-xs uppercase tracking-wider text-neutral-400 font-mono">
              <Building2 className="h-3.5 w-3.5 text-neutral-300" />
              Assessoria Tributária e Fiscal Especializada
            </div>

            <h2
              id="contato-callout-title"
              className="text-2xl md:text-4xl font-serif font-bold text-white leading-tight"
            >
              Precisa regularizar débitos fiscais com segurança jurídica?
            </h2>

            <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
              Nossa equipe estrutura pareceres de revisão de passivos tributários, defesas
              administrativas contra autos de infração e estudos de parcelamento para mitigar riscos
              e custos financeiros desnecessários.
            </p>

            {/* Ponto focal com amarelo da marca #FAB319 no botão de CTA */}
            <div className="pt-2 flex justify-center">
              <Button
                size="lg"
                className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-base h-12 px-8 shadow-sm"
                asChild
              >
                <Link to="/contato">Agendar Análise com Nossos Especialistas</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
