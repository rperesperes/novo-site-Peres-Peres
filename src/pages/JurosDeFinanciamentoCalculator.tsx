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
  ArrowUpDown,
  Coins,
  TrendingDown,
  ChevronDown,
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
import { CalculatorEmailCapture } from '@/components/CalculatorEmailCapture'

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

export interface AmortizationRow {
  installmentNumber: number
  installmentValue: number
  interest: number
  amortization: number
  balance: number
}

export interface AmortizationSchedule {
  rows: AmortizationRow[]
  firstInstallment: number
  lastInstallment: number
  totalInterest: number
  totalPaid: number
}

// Gera a tabela completa para o Sistema Price (Tabela Francesa)
export function computePriceSchedule(
  principal: number,
  monthlyRatePercent: number,
  months: number,
): AmortizationSchedule {
  if (principal <= 0 || months <= 0) {
    return {
      rows: [],
      firstInstallment: 0,
      lastInstallment: 0,
      totalInterest: 0,
      totalPaid: 0,
    }
  }

  const i = monthlyRatePercent / 100

  // Se taxa for zero (caso limite)
  if (i === 0) {
    const installment = principal / months
    const rows: AmortizationRow[] = []
    let balance = principal
    for (let k = 1; k <= months; k++) {
      balance = Math.max(0, balance - installment)
      rows.push({
        installmentNumber: k,
        installmentValue: installment,
        interest: 0,
        amortization: installment,
        balance,
      })
    }
    return {
      rows,
      firstInstallment: installment,
      lastInstallment: installment,
      totalInterest: 0,
      totalPaid: principal,
    }
  }

  // Parcela fixa Price = PV * [i * (1+i)^n] / [(1+i)^n - 1]
  const factor = Math.pow(1 + i, months)
  const installmentValue = principal * ((i * factor) / (factor - 1))

  const rows: AmortizationRow[] = []
  let balance = principal
  let totalInterest = 0
  let totalPaid = 0

  for (let k = 1; k <= months; k++) {
    const interest = balance * i
    let amortization = installmentValue - interest
    let nextBalance = balance - amortization

    // Ajuste de arredondamento na última parcela para zerar saldo
    if (k === months || nextBalance < 0.005) {
      amortization = balance
      nextBalance = 0
    }

    const currentInstallment = interest + amortization
    totalInterest += interest
    totalPaid += currentInstallment

    rows.push({
      installmentNumber: k,
      installmentValue: currentInstallment,
      interest,
      amortization,
      balance: Math.max(0, nextBalance),
    })

    balance = nextBalance
  }

  return {
    rows,
    firstInstallment: rows[0]?.installmentValue ?? installmentValue,
    lastInstallment: rows[rows.length - 1]?.installmentValue ?? installmentValue,
    totalInterest,
    totalPaid,
  }
}

// Gera a tabela completa para o Sistema de Amortização Constante (SAC)
export function computeSACSchedule(
  principal: number,
  monthlyRatePercent: number,
  months: number,
): AmortizationSchedule {
  if (principal <= 0 || months <= 0) {
    return {
      rows: [],
      firstInstallment: 0,
      lastInstallment: 0,
      totalInterest: 0,
      totalPaid: 0,
    }
  }

  const i = monthlyRatePercent / 100
  const constantAmortization = principal / months

  const rows: AmortizationRow[] = []
  let balance = principal
  let totalInterest = 0
  let totalPaid = 0

  for (let k = 1; k <= months; k++) {
    const interest = balance * i
    let amortization = constantAmortization
    let nextBalance = balance - amortization

    if (k === months || nextBalance < 0.005) {
      amortization = balance
      nextBalance = 0
    }

    const currentInstallment = amortization + interest
    totalInterest += interest
    totalPaid += currentInstallment

    rows.push({
      installmentNumber: k,
      installmentValue: currentInstallment,
      interest,
      amortization,
      balance: Math.max(0, nextBalance),
    })

    balance = nextBalance
  }

  return {
    rows,
    firstInstallment: rows[0]?.installmentValue ?? 0,
    lastInstallment: rows[rows.length - 1]?.installmentValue ?? 0,
    totalInterest,
    totalPaid,
  }
}

export default function JurosDeFinanciamentoCalculator() {
  // Campos de entrada com valores padrão realistas
  // Valor financiado padrão: R$ 200.000,00
  const [valorFinanciado, setValorFinanciado] = useState<number>(200000)
  const [valorFinanciadoInput, setValorFinanciadoInput] = useState<string>('200.000,00')

  // Taxa de juros mensal padrão: 0,95% a.m. (aprox. 12% a.a.)
  const [taxaJurosMensal, setTaxaJurosMensal] = useState<number>(0.95)
  const [taxaJurosMensalInput, setTaxaJurosMensalInput] = useState<string>('0,95')

  // Prazo em meses padrão: 120 meses (10 anos)
  const [prazoMeses, setPrazoMeses] = useState<number>(120)

  // Sistema de amortização selecionado para a tabela detalhada e foco (Price ou SAC)
  const [selectedSystem, setSelectedSystem] = useState<'price' | 'sac'>('price')

  // SEO: título da aba (máx 60 caracteres começando por "calculadora juros de financiamento")
  // e descrição (máx 155 caracteres)
  useEffect(() => {
    const pageTitle = 'calculadora juros de financiamento Price e SAC | PERES' // 54 caracteres
    const pageDesc =
      'Compare parcelas, juros e evolução do saldo devedor entre Price e SAC em tempo real. Veja a memória de cálculo aberta e saiba qual custa menos.' // 144 caracteres

    document.title = pageTitle

    let metaDescTag = document.querySelector('meta[name="description"]')
    if (!metaDescTag) {
      metaDescTag = document.createElement('meta')
      metaDescTag.setAttribute('name', 'description')
      document.head.appendChild(metaDescTag)
    }
    metaDescTag.setAttribute('content', pageDesc)
  }, [])

  // Handlers dos campos
  const handleValorFinanciadoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseRawToNumber(e.target.value)
    setValorFinanciado(num)
    setValorFinanciadoInput(formatRawInput(num))
  }

  const handleTaxaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(',', '.')
    setTaxaJurosMensalInput(e.target.value)
    const parsed = parseFloat(rawVal)
    if (!isNaN(parsed) && parsed >= 0) {
      setTaxaJurosMensal(parsed)
    } else if (rawVal === '') {
      setTaxaJurosMensal(0)
    }
  }

  const handlePrazoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10)
    if (isNaN(val) || val <= 0) {
      setPrazoMeses(0)
    } else {
      // Limite seguro de 420 meses (35 anos, padrão SFH)
      setPrazoMeses(Math.min(val, 420))
    }
  }

  // Cálculos em tempo real para os dois sistemas
  const calculations = useMemo(() => {
    const price = computePriceSchedule(valorFinanciado, taxaJurosMensal, prazoMeses)
    const sac = computeSACSchedule(valorFinanciado, taxaJurosMensal, prazoMeses)

    // Diferença de juros entre Price e SAC
    const diffJuros = price.totalInterest - sac.totalInterest
    const isPriceMaisCaro = diffJuros > 0.01
    const isSacMaisCaro = diffJuros < -0.01
    const isIguais = Math.abs(diffJuros) <= 0.01

    let sistemaMenorCusto: 'SAC' | 'Price' | 'Equivalente' = 'SAC'
    let textoMenorCusto = 'O sistema SAC custa menos'
    if (isPriceMaisCaro) {
      sistemaMenorCusto = 'SAC'
      textoMenorCusto = `O sistema SAC custa menos: economia de ${formatCurrencyBRL(diffJuros)} em juros.`
    } else if (isSacMaisCaro) {
      sistemaMenorCusto = 'Price'
      textoMenorCusto = `O sistema Price custa menos: economia de ${formatCurrencyBRL(Math.abs(diffJuros))} em juros.`
    } else {
      sistemaMenorCusto = 'Equivalente'
      textoMenorCusto = 'Ambos os sistemas apresentam o mesmo total de juros.'
    }

    // Taxa anual equivalente efetiva: (1 + i)^12 - 1
    const iMensal = taxaJurosMensal / 100
    const taxaAnualEfetiva = (Math.pow(1 + iMensal, 12) - 1) * 100

    return {
      price,
      sac,
      diffJuros: Math.abs(diffJuros),
      isPriceMaisCaro,
      isSacMaisCaro,
      isIguais,
      sistemaMenorCusto,
      textoMenorCusto,
      taxaAnualEfetiva,
    }
  }, [valorFinanciado, taxaJurosMensal, prazoMeses])

  // FAQ com 5 perguntas curtas e diretas sobre financiamentos
  const faqs = [
    {
      q: 'Qual é a principal diferença entre o sistema Price e o sistema SAC?',
      a: 'No sistema Price (Tabela Francesa), as parcelas são fixas do início ao fim, mas a amortização é pequena no começo e cresce com o tempo. No SAC (Sistema de Amortização Constante), o valor amortizado da dívida é idêntico em todas as parcelas, fazendo com que as prestações comecem maiores e diminuam mensalmente.',
    },
    {
      q: 'Por que o sistema SAC sempre acumula menos juros no final do prazo?',
      a: 'Porque no SAC a dívida principal é reduzida em ritmo mais acelerado desde o primeiro mês. Como os juros mensais incidem sempre sobre o saldo devedor remanescente, um saldo devedor que cai mais rápido gera bases menores de cálculo de juros ao longo de todo o contrato.',
    },
    {
      q: 'O que é o Custo Efetivo Total (CET) e por que ele é mais relevante que a taxa de juros?',
      a: 'O CET expressa a taxa real e completa do financiamento, englobando juros, seguros obrigatórios (MIP e DFI), tarifas cadastrais, taxas de administração e tributos (IOF). Uma instituição pode oferecer uma taxa nominal menor, mas impor seguros e tarifas elevados que tornam o CET mais caro.',
    },
    {
      q: 'Posso migrar de Price para SAC ou fazer amortização extraordinária durante o contrato?',
      a: 'A amortização antecipada extraordinária é um direito garantido pelo Código de Defesa do Consumidor com abatimento proporcional dos juros futuros em qualquer sistema. Já a alteração do sistema de amortização (Price para SAC ou vice-versa) depende de repactuação com a instituição credora ou portabilidade de crédito.',
    },
    {
      q: 'Quando vale a pena optar pelo sistema Price em vez do SAC?',
      a: 'A Price costuma ser escolhida quando a renda comprovada do proponente não é suficiente para aprovar a primeira parcela do SAC (que é cerca de 20% a 30% mais alta) ou quando o comprador necessita de previsibilidade de fluxo de caixa mensal fixo no início da operação.',
    },
  ]

  // Dados estruturados JSON-LD Schema.org (SoftwareApplication, FAQPage e BreadcrumbList)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://peresperes.com.br/calculadoras/juros-de-financiamento#software',
        name: 'Calculadora de juros de financiamento Price e SAC',
        url: 'https://peresperes.com.br/calculadoras/juros-de-financiamento',
        applicationCategory: 'FinancialApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        description:
          'Calculadora gratuita de financiamento comparando os sistemas Price e SAC com parcelas, juros totais, evolução do saldo devedor e memória de cálculo.',
        provider: {
          '@type': 'AccountingService',
          name: 'PERES PERES Consultoria e Contabilidade',
          url: 'https://peresperes.com.br',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://peresperes.com.br/calculadoras/juros-de-financiamento#breadcrumb',
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
            name: 'Juros de Financiamento',
            item: 'https://peresperes.com.br/calculadoras/juros-de-financiamento',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://peresperes.com.br/calculadoras/juros-de-financiamento#faq',
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

  // Tabela selecionada para visualização detalhada
  const activeSchedule = selectedSystem === 'price' ? calculations.price : calculations.sac

  return (
    <div className="py-10 md:py-16 bg-background min-h-screen text-foreground">
      {/* Dados estruturados JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="container mx-auto px-4 max-w-4xl">
        {/* TRILHA DE NAVEGAÇÃO EXATA: Início > Calculadoras > Juros de Financiamento */}
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
          <span className="text-black font-medium">Juros de Financiamento</span>
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

        {/* CABEÇALHO */}
        <header className="mb-10 max-w-3xl">
          <div className="inline-block border border-neutral-300 bg-neutral-100 text-neutral-800 text-xs font-mono uppercase tracking-wider px-3 py-1 rounded mb-4">
            Finanças e Tributos • Crédito Imobiliário e Financiamentos
          </div>

          {/* TÍTULO PRINCIPAL (H1 EXATO DO USUÁRIO): Calculadora de financiamento, veja quanto você paga de juros */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-black mb-5 leading-tight">
            Calculadora de financiamento, veja quanto você paga de juros
          </h1>

          {/* PARÁGRAFO CURTO DE 2 LINHAS EXPLICANDO O COMPARATIVO PRICE VS SAC */}
          <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
            Compare em tempo real as parcelas e o custo total de juros entre os sistemas de
            amortização Price e SAC. Descubra qual modelo custa menos para o seu contrato e
            visualize a evolução integral do saldo devedor mês a mês.
          </p>
        </header>

        {/* BLOCO DE VIGÊNCIA E RESSALVA TÉCNICA VISÍVEL */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-neutral-900 text-white rounded shrink-0">
                <Scale className="h-4 w-4 text-[#FAB319]" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block">
                  Premissas Aritméticas e Resoluções CMN/Bacen
                </span>
                <p className="text-sm font-medium text-neutral-900 mt-0.5">
                  Sistemas Price (Tabela Francesa) e SAC (Amortização Constante) • Resoluções Bacen
                  nº 3.517/2007 e 4.881/2020
                </p>
                <p className="text-xs text-neutral-600 mt-1">
                  <strong>Aviso de Vigência e CET:</strong> Esta ferramenta calcula puramente os
                  juros e a amortização do principal contratado. Ela <strong>não inclui</strong>{' '}
                  seguros obrigatórios (MIP e DFI), tarifas cadastrais mensais nem tributos (IOF),
                  de modo que o{' '}
                  <strong>
                    Custo Efetivo Total (CET) real da instituição financeira é sempre superior à
                    taxa contratada
                  </strong>
                  .
                </p>
              </div>
            </div>

            <div className="sm:text-right shrink-0">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono bg-white border border-neutral-200 px-3 py-1.5 rounded-md text-neutral-700 shadow-sm">
                <Clock className="h-3.5 w-3.5 text-neutral-500" />
                Matemática financeira pura
              </span>
            </div>
          </div>
        </div>

        {/* BLOCO DA CALCULADORA COM RESULTADO EM TEMPO REAL AO DIGITAR */}
        <section
          aria-labelledby="calculadora-financiamento-heading"
          className="border border-neutral-200 bg-white rounded-xl shadow-sm p-6 md:p-8 mb-12"
        >
          <div className="flex items-center justify-between pb-6 border-b border-neutral-200 mb-6">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-neutral-900" />
              <h2
                id="calculadora-financiamento-heading"
                className="text-xl md:text-2xl font-serif font-bold text-black"
              >
                Parâmetros do Financiamento
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
              Cálculo em Tempo Real
            </span>
          </div>

          {/* CAMPOS DE ENTRADA */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {/* 1. Valor financiado (máscara BRL) */}
            <div className="md:col-span-1">
              <label
                htmlFor="input-valor-financiado"
                className="block text-sm font-semibold text-neutral-900 mb-1.5"
              >
                Valor financiado
              </label>
              <p className="text-xs text-neutral-500 mb-2">Montante do principal contratado.</p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-500 font-mono">
                  R$
                </span>
                <Input
                  id="input-valor-financiado"
                  type="text"
                  inputMode="numeric"
                  value={valorFinanciadoInput}
                  onChange={handleValorFinanciadoChange}
                  placeholder="0,00"
                  className="pl-10 font-mono text-base border-neutral-300 focus-visible:ring-black"
                />
              </div>
            </div>

            {/* 2. Taxa de juros mensal */}
            <div>
              <label
                htmlFor="input-taxa-mensal"
                className="block text-sm font-semibold text-neutral-900 mb-1.5"
              >
                Taxa de juros mensal
              </label>
              <p className="text-xs text-neutral-500 mb-2">
                Taxa mensal (% a.m.). Anual eq.: {calculations.taxaAnualEfetiva.toFixed(2)}% a.a.
              </p>
              <div className="relative">
                <Input
                  id="input-taxa-mensal"
                  type="text"
                  value={taxaJurosMensalInput}
                  onChange={handleTaxaChange}
                  placeholder="0,00"
                  className="pr-8 font-mono text-base border-neutral-300 focus-visible:ring-black"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-500 font-mono">
                  %
                </span>
              </div>
            </div>

            {/* 3. Prazo em meses */}
            <div>
              <label
                htmlFor="input-prazo-meses"
                className="block text-sm font-semibold text-neutral-900 mb-1.5"
              >
                Prazo em meses
              </label>
              <p className="text-xs text-neutral-500 mb-2">
                Quantidade total de parcelas (ex.: 120, 240, 360).
              </p>
              <Input
                id="input-prazo-meses"
                type="number"
                min="1"
                max="420"
                value={prazoMeses || ''}
                onChange={handlePrazoChange}
                placeholder="120"
                className="font-mono text-base border-neutral-300 focus-visible:ring-black"
              />
            </div>

            {/* 4. Sistema de amortização para visualização da tabela */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-1.5">
                Sistema em destaque
              </label>
              <p className="text-xs text-neutral-500 mb-2">Tabela analítica detalhada.</p>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-100 rounded-lg border border-neutral-200">
                <button
                  type="button"
                  onClick={() => setSelectedSystem('price')}
                  className={`text-xs font-mono py-1.5 rounded-md transition-colors font-medium ${
                    selectedSystem === 'price'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-neutral-700 hover:text-black'
                  }`}
                >
                  Price (Fixa)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSystem('sac')}
                  className={`text-xs font-mono py-1.5 rounded-md transition-colors font-medium ${
                    selectedSystem === 'sac'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-neutral-700 hover:text-black'
                  }`}
                >
                  SAC (Decrescente)
                </button>
              </div>
            </div>
          </div>

          {/* DESTAQUE DO VENCEDOR: QUAL CUSTA MENOS */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 text-sm mb-8 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-serif text-base text-emerald-950 block">
                {calculations.textoMenorCusto}
              </strong>
              <p className="text-xs text-emerald-800 mt-1">
                No sistema SAC, o montante total pago é de{' '}
                <strong>{formatCurrencyBRL(calculations.sac.totalPaid)}</strong> contra{' '}
                <strong>{formatCurrencyBRL(calculations.price.totalPaid)}</strong> no Price, gerando
                uma redução absoluta de {formatCurrencyBRL(calculations.diffJuros)} em juros
                acumulados para o mesmo principal e prazo.
              </p>
            </div>
          </div>

          {/* RESULTADO COMPARATIVO EM CARDS: PRICE VS SAC (4 PONTOS OBRIGATÓRIOS) */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 md:p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                Quadro Comparativo: Price vs SAC
              </span>
              <span className="text-xs font-mono bg-neutral-200 px-2 py-0.5 rounded text-neutral-800">
                Resultado em Tempo Real
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Card Sistema Price */}
              <div
                className={`p-6 rounded-xl border bg-white transition-all ${
                  selectedSystem === 'price'
                    ? 'border-neutral-900 shadow-md ring-1 ring-black'
                    : 'border-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block">
                      Sistema Francês
                    </span>
                    <h3 className="text-xl font-serif font-bold text-black">Tabela Price</h3>
                  </div>
                  <span className="text-xs font-mono bg-neutral-100 px-2.5 py-1 rounded border border-neutral-200 text-neutral-700">
                    Parcelas Fixas
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                      <span>1. Primeira Parcela:</span>
                      <span>Última Parcela:</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-mono font-bold text-black">
                        {formatCurrencyBRL(calculations.price.firstInstallment)}
                      </span>
                      <span className="text-xl font-mono font-bold text-black">
                        {formatCurrencyBRL(calculations.price.lastInstallment)}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      Prestação constante do 1º ao {prazoMeses}º mês.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-100">
                    <span className="text-xs text-neutral-500 block mb-1">
                      2. Total de juros pagos:
                    </span>
                    <span className="text-2xl font-mono font-bold text-neutral-900">
                      {formatCurrencyBRL(calculations.price.totalInterest)}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-neutral-100">
                    <span className="text-xs text-neutral-500 block mb-1">
                      3. Total pago (principal + juros):
                    </span>
                    <span className="text-2xl font-mono font-bold text-black">
                      {formatCurrencyBRL(calculations.price.totalPaid)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Sistema SAC */}
              <div
                className={`p-6 rounded-xl border bg-white transition-all ${
                  selectedSystem === 'sac'
                    ? 'border-neutral-900 shadow-md ring-1 ring-black'
                    : 'border-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block">
                      Amortização Constante
                    </span>
                    <h3 className="text-xl font-serif font-bold text-black">Sistema SAC</h3>
                  </div>
                  <span className="text-xs font-mono bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded border border-emerald-200 font-semibold">
                    Menor Juro Total
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                      <span>1. Primeira Parcela:</span>
                      <span>Última Parcela:</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-mono font-bold text-black">
                        {formatCurrencyBRL(calculations.sac.firstInstallment)}
                      </span>
                      <span className="text-xl font-mono font-bold text-emerald-700">
                        {formatCurrencyBRL(calculations.sac.lastInstallment)}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      Começa maior e diminui mês a mês até o {prazoMeses}º mês.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-100">
                    <span className="text-xs text-neutral-500 block mb-1">
                      2. Total de juros pagos:
                    </span>
                    <span className="text-2xl font-mono font-bold text-emerald-700">
                      {formatCurrencyBRL(calculations.sac.totalInterest)}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-neutral-100">
                    <span className="text-xs text-neutral-500 block mb-1">
                      3. Total pago (principal + juros):
                    </span>
                    <span className="text-2xl font-mono font-bold text-black">
                      {formatCurrencyBRL(calculations.sac.totalPaid)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Diferença de juros entre Price e SAC */}
            <div className="mt-6 p-5 bg-white border-2 border-[#FAB319] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-700 font-semibold block mb-0.5">
                  4. Diferença de juros acumulados (Price vs SAC)
                </span>
                <p className="text-sm text-neutral-700">
                  {calculations.isPriceMaisCaro ? (
                    <>
                      Ao optar pelo <strong>SAC</strong>, você economiza exatamente{' '}
                      <strong className="text-black underline decoration-[#FAB319] decoration-2">
                        {formatCurrencyBRL(calculations.diffJuros)}
                      </strong>{' '}
                      em juros ao longo dos {prazoMeses} meses.
                    </>
                  ) : calculations.isSacMaisCaro ? (
                    <>
                      Ao optar pelo <strong>Price</strong>, você economiza{' '}
                      <strong className="text-black">
                        {formatCurrencyBRL(calculations.diffJuros)}
                      </strong>{' '}
                      em juros.
                    </>
                  ) : (
                    'Não há diferença de juros entre os dois sistemas no cenário informado.'
                  )}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-mono text-neutral-500 uppercase block">
                  Economia no SAC
                </span>
                <span className="text-2xl font-mono font-bold text-black">
                  {formatCurrencyBRL(calculations.diffJuros)}
                </span>
              </div>
            </div>
          </div>

          {/* TABELA DE EVOLUÇÃO DO SALDO DEVEDOR: RESUMO COM AS PARCELAS EM ORDEM */}
          <div className="border border-neutral-200 bg-white rounded-xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 mb-4 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-neutral-900" />
                  <h3 className="font-serif font-bold text-lg text-black">
                    Evolução do Saldo Devedor ({selectedSystem === 'price' ? 'Price' : 'SAC'})
                  </h3>
                </div>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Resumo das parcelas em ordem cronológica com decomposição em amortização, juros e
                  saldo devedor residual. Todas as {prazoMeses} parcelas estão listadas abaixo com
                  rolagem vertical controlada.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-neutral-500">Visualizando:</span>
                <span className="text-xs font-mono font-bold bg-neutral-100 border border-neutral-300 px-2.5 py-1 rounded">
                  {selectedSystem === 'price' ? 'Tabela Price' : 'Tabela SAC'}
                </span>
              </div>
            </div>

            {activeSchedule.rows.length === 0 ? (
              <p className="text-sm text-neutral-500 py-4 italic">
                Insira valores válidos de valor financiado e prazo para gerar a evolução.
              </p>
            ) : (
              <div className="overflow-x-auto max-h-[440px] overflow-y-auto border border-neutral-200 rounded-lg">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="sticky top-0 bg-neutral-100 z-10">
                    <tr className="border-b border-neutral-300 text-neutral-600 font-mono text-xs uppercase tracking-wider">
                      <th className="py-2.5 px-3 w-16 text-center">Nº</th>
                      <th className="py-2.5 px-3">Parcela</th>
                      <th className="py-2.5 px-3">Juros</th>
                      <th className="py-2.5 px-3">Amortização</th>
                      <th className="py-2.5 px-3 text-right">Saldo Devedor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-mono text-xs">
                    {activeSchedule.rows.map((row) => (
                      <tr
                        key={row.installmentNumber}
                        className="hover:bg-neutral-50 transition-colors"
                      >
                        <td className="py-2 px-3 text-center text-neutral-500 font-semibold">
                          {row.installmentNumber}
                        </td>
                        <td className="py-2 px-3 font-semibold text-black">
                          {formatCurrencyBRL(row.installmentValue)}
                        </td>
                        <td className="py-2 px-3 text-amber-800">
                          {formatCurrencyBRL(row.interest)}
                        </td>
                        <td className="py-2 px-3 text-emerald-800">
                          {formatCurrencyBRL(row.amortization)}
                        </td>
                        <td className="py-2 px-3 text-right text-neutral-800 font-medium">
                          {formatCurrencyBRL(row.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="sticky bottom-0 bg-neutral-100 z-10 font-mono font-bold text-xs border-t-2 border-neutral-300">
                    <tr>
                      <td className="py-3 px-3 text-center text-black font-sans">Total</td>
                      <td className="py-3 px-3 text-black">
                        {formatCurrencyBRL(activeSchedule.totalPaid)}
                      </td>
                      <td className="py-3 px-3 text-amber-900">
                        {formatCurrencyBRL(activeSchedule.totalInterest)}
                      </td>
                      <td className="py-3 px-3 text-emerald-900">
                        {formatCurrencyBRL(valorFinanciado)}
                      </td>
                      <td className="py-3 px-3 text-right text-black font-sans">R$ 0,00 quitado</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {/* MEMÓRIA DE CÁLCULO ABERTA (EXIGÊNCIA DO PROMPT) */}
          <div className="border border-neutral-200 bg-white rounded-xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-neutral-900" />
                <h3 className="font-serif font-bold text-lg text-black">
                  Memória de Cálculo Aberta (Fórmulas e Números Digitados)
                </h3>
              </div>
              <span className="text-xs font-mono text-neutral-500 uppercase">
                Auditoria Aritmética
              </span>
            </div>

            <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
              Demonstrativo das fórmulas de matemática financeira aplicadas estritamente aos números
              informados (Valor Principal PV = {formatCurrencyBRL(valorFinanciado)}, taxa mensal i ={' '}
              {taxaJurosMensal.toFixed(2)}% a.m., prazo n = {prazoMeses} meses).
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Memória Price */}
              <div className="p-4 border border-neutral-200 rounded-lg bg-neutral-50 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                  <span className="font-serif font-bold text-sm text-black">
                    1. Sistema Price (Prestação Fixa)
                  </span>
                  <span className="bg-neutral-200 px-2 py-0.5 rounded text-[11px]">
                    Fórmula Francesa
                  </span>
                </div>
                <div className="p-3 bg-white border border-neutral-200 rounded text-neutral-800">
                  <strong>Fórmula geral:</strong>
                  <div className="mt-1 font-serif text-sm">
                    PMT = PV × [ i × (1 + i)<sup>n</sup> ] / [ (1 + i)<sup>n</sup> − 1 ]
                  </div>
                </div>
                <div className="space-y-1.5 text-neutral-700">
                  <div>
                    • <strong>PV (Principal):</strong> {formatCurrencyBRL(valorFinanciado)}
                  </div>
                  <div>
                    • <strong>i (Taxa unitária):</strong> {(taxaJurosMensal / 100).toFixed(6)} (
                    {taxaJurosMensal}% / 100)
                  </div>
                  <div>
                    • <strong>n (Meses):</strong> {prazoMeses}
                  </div>
                  <div>
                    •{' '}
                    <strong>
                      Fator (1 + i)<sup>n</sup>:
                    </strong>{' '}
                    {Math.pow(1 + taxaJurosMensal / 100, prazoMeses).toFixed(6)}
                  </div>
                  <div>
                    • <strong>PMT (Parcela fixa calculada):</strong>{' '}
                    <strong className="text-black text-sm">
                      {formatCurrencyBRL(calculations.price.firstInstallment)}
                    </strong>
                  </div>
                  <div>
                    • <strong>Juros Mês 1:</strong> PV × i = {formatCurrencyBRL(valorFinanciado)} ×{' '}
                    {(taxaJurosMensal / 100).toFixed(4)} ={' '}
                    {formatCurrencyBRL(valorFinanciado * (taxaJurosMensal / 100))}
                  </div>
                  <div>
                    • <strong>Amortização Mês 1:</strong> PMT − Juros ={' '}
                    {formatCurrencyBRL(
                      calculations.price.firstInstallment -
                        valorFinanciado * (taxaJurosMensal / 100),
                    )}
                  </div>
                  <div>
                    • <strong>Total Pago (n × PMT):</strong>{' '}
                    <strong className="text-black">
                      {formatCurrencyBRL(calculations.price.totalPaid)}
                    </strong>
                  </div>
                  <div>
                    • <strong>Total de Juros (Total − PV):</strong>{' '}
                    <strong className="text-amber-900">
                      {formatCurrencyBRL(calculations.price.totalInterest)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Memória SAC */}
              <div className="p-4 border border-neutral-200 rounded-lg bg-neutral-50 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                  <span className="font-serif font-bold text-sm text-black">
                    2. Sistema SAC (Amortização Constante)
                  </span>
                  <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded text-[11px] font-semibold">
                    Cota Constante
                  </span>
                </div>
                <div className="p-3 bg-white border border-neutral-200 rounded text-neutral-800">
                  <strong>Fórmulas gerais:</strong>
                  <div className="mt-1 font-serif text-sm">
                    A = PV / n &nbsp;|&nbsp; J<sub>k</sub> = Saldo<sub>k−1</sub> × i &nbsp;|&nbsp;
                    PMT<sub>k</sub> = A + J<sub>k</sub>
                  </div>
                </div>
                <div className="space-y-1.5 text-neutral-700">
                  <div>
                    • <strong>PV (Principal):</strong> {formatCurrencyBRL(valorFinanciado)}
                  </div>
                  <div>
                    • <strong>n (Meses):</strong> {prazoMeses}
                  </div>
                  <div>
                    • <strong>Amortização constante (A = PV / n):</strong>{' '}
                    <strong className="text-black">
                      {prazoMeses > 0 ? formatCurrencyBRL(valorFinanciado / prazoMeses) : 'R$ 0,00'}
                    </strong>
                  </div>
                  <div>
                    • <strong>Juros Mês 1 (PV × i):</strong>{' '}
                    {formatCurrencyBRL(valorFinanciado * (taxaJurosMensal / 100))}
                  </div>
                  <div>
                    •{' '}
                    <strong>
                      Parcela 1 (A + J<sub>1</sub>):
                    </strong>{' '}
                    <strong className="text-black text-sm">
                      {formatCurrencyBRL(calculations.sac.firstInstallment)}
                    </strong>
                  </div>
                  <div>
                    • <strong>Juros Mês {prazoMeses} (Último Saldo × i):</strong>{' '}
                    {formatCurrencyBRL(
                      calculations.sac.lastInstallment -
                        (prazoMeses > 0 ? valorFinanciado / prazoMeses : 0),
                    )}
                  </div>
                  <div>
                    • <strong>Parcela {prazoMeses} (Última):</strong>{' '}
                    <strong className="text-emerald-800 text-sm">
                      {formatCurrencyBRL(calculations.sac.lastInstallment)}
                    </strong>
                  </div>
                  <div>
                    • <strong>Total de Juros Acumulados:</strong>{' '}
                    <strong className="text-emerald-900">
                      {formatCurrencyBRL(calculations.sac.totalInterest)}
                    </strong>
                  </div>
                  <div>
                    • <strong>Diferença de Juros (Price − SAC):</strong>{' '}
                    <strong className="text-black">
                      {formatCurrencyBRL(calculations.diffJuros)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Captura de e-mail */}
          <CalculatorEmailCapture calculatorName="Calculadora Juros de Financiamento" />
        </section>

        {/* TEXTO DE APROFUNDAMENTO EM HTML ESTÁTICO (NÃO GERADO POR SCRIPT) */}
        {/* SUBTÍTULOS EXATOS NA ORDEM RIGOROSA DA ESPECIFICAÇÃO:
            1. a diferença entre Price e SAC
            2. por que o SAC tem parcela inicial maior e total de juros menor
            3. o que é o CET e por que ele importa mais que a taxa contratada
            4. como seguros e tarifas entram no custo real do financiamento
            5. erros comuns ao comparar financiamentos (com pelo menos quatro exemplos práticos)
        */}
        <article className="border border-neutral-200 bg-white rounded-xl p-8 md:p-12 mb-16 shadow-sm prose prose-neutral max-w-none">
          <header className="border-b border-neutral-200 pb-6 mb-8">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-2">
              Doutrina Financeira e Engenharia de Crédito
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-black mb-3">
              Guia Técnico sobre Sistemas de Amortização e Custo Real de Financiamentos
            </h2>
            <p className="text-sm text-neutral-600">
              Análise dos sistemas de amortização vigentes no Sistema Financeiro Nacional,
              composição do Custo Efetivo Total e armadilhas contratuais comuns.
            </p>
          </header>

          <div className="space-y-10 text-neutral-800 leading-relaxed text-sm md:text-base">
            {/* 1. a diferença entre Price e SAC */}
            <section aria-labelledby="subtitulo-price-sac">
              <h3
                id="subtitulo-price-sac"
                className="text-xl md:text-2xl font-serif font-bold text-black mb-3"
              >
                1. A diferença entre Price e SAC
              </h3>
              <p>
                No mercado de crédito brasileiro — especialmente no financiamento imobiliário e em
                operações de longo prazo reguladas pelo Sistema Financeiro da Habitação (SFH) e pelo
                Sistema de Financiamento Imobiliário (SFI) —, existem duas metodologias consagradas
                de reembolso de capital:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3 mb-4">
                <li>
                  <strong>Sistema Price (Tabela Francesa):</strong> Caracteriza-se por manter o
                  valor da prestação nominal <strong>constante</strong> durante todo o horizonte do
                  contrato (desconsiderada a correção monetária por índices como TR ou IPCA). Como a
                  prestação é fixa e os juros incidem sobre o saldo devedor, a composição interna da
                  parcela varia de forma inversa: nos primeiros meses, a fatia destinada ao
                  pagamento de juros é predominante (frequentemente superior a 80% da prestação),
                  restando uma amortização mínima do saldo principal. À medida que o saldo devedor
                  diminui lentamente, o valor dos juros decresce e a cota de amortização se expande.
                </li>
                <li>
                  <strong>Sistema SAC (Sistema de Amortização Constante):</strong> Como o próprio
                  nome indica, o montante destinado a abater a dívida principal é{' '}
                  <strong>rigorosamente constante</strong> em todas as parcelas (obtido pela divisão
                  do capital financiado pelo número total de meses). Consequentemente, como os juros
                  mensais são apurados sobre um saldo devedor que despenca de forma linear e rápida,
                  as parcelas começam mais altas no início e <strong>decrescem mês a mês</strong>{' '}
                  até o último pagamento.
                </li>
              </ul>
              <p>
                Enquanto o sistema Price prioriza a previsibilidade imediata de um desembolso fixo,
                o sistema SAC prioriza a velocidade de quitação do principal e a redução do custo
                financeiro total da operação.
              </p>
            </section>

            {/* 2. por que o SAC tem parcela inicial maior e total de juros menor */}
            <section
              aria-labelledby="subtitulo-sac-juros"
              className="pt-6 border-t border-neutral-200"
            >
              <h3
                id="subtitulo-sac-juros"
                className="text-xl md:text-2xl font-serif font-bold text-black mb-3"
              >
                2. Por que o SAC tem parcela inicial maior e total de juros menor
              </h3>
              <p>
                A aparente contradição entre a primeira parcela mais salgada do SAC e o seu menor
                custo total de juros decorre diretamente da velocidade com que o principal da dívida
                é liquidado.
              </p>
              <p>
                Na matemática financeira, a taxa de juros nunca incide sobre o total já contratado,
                mas estritamente sobre o <strong>saldo devedor remanescente</strong> verificado no
                início de cada período. Compare as duas dinâmicas em um financiamento de R$
                300.000,00 em 360 meses a 0,80% a.m.:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 my-4 font-mono text-xs">
                <div className="p-4 bg-neutral-100 rounded-lg border border-neutral-200">
                  <span className="font-serif font-bold text-sm text-black block mb-2">
                    Cenário Price (Prestação R$ 2.544)
                  </span>
                  <p className="text-neutral-700">
                    • Juros no 1º mês: R$ 2.400,00 (94,3% da parcela)
                  </p>
                  <p className="text-neutral-700">• Amortização real no 1º mês: apenas R$ 144,00</p>
                  <p className="text-neutral-900 font-semibold mt-1">
                    • Saldo devedor após 1 ano: R$ 298.050 (quase intacto)
                  </p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="font-serif font-bold text-sm text-emerald-950 block mb-2">
                    Cenário SAC (1ª Prestação R$ 3.233)
                  </span>
                  <p className="text-emerald-900">• Juros no 1º mês: R$ 2.400,00</p>
                  <p className="text-emerald-900">
                    • Amortização real no 1º mês: R$ 833,33 (constante)
                  </p>
                  <p className="text-emerald-950 font-semibold mt-1">
                    • Saldo devedor após 1 ano: R$ 290.000 (R$ 10.000 abatidos)
                  </p>
                </div>
              </div>
              <p>
                Como no SAC o proponente amortiza desde o dia um uma fatia substancial do principal
                (R$ 833,33 todo mês contra míseros R$ 144,00 no Price), no mês 24 o saldo devedor do
                SAC já está muito inferior ao da Price. Juros menores sobre saldos menores geram um
                efeito bola de neve favorável ao tomador: parcelas cada vez mais leves e uma
                economia de dezenas ou centenas de milhares de reais ao final do contrato.
              </p>
            </section>

            {/* 3. o que é o CET e por que ele importa mais que a taxa contratada */}
            <section aria-labelledby="subtitulo-cet" className="pt-6 border-t border-neutral-200">
              <h3
                id="subtitulo-cet"
                className="text-xl md:text-2xl font-serif font-bold text-black mb-3"
              >
                3. O que é o CET e por que ele importa mais que a taxa contratada
              </h3>
              <p>
                O <strong>Custo Efetivo Total (CET)</strong> é o indicador oficial normatizado pelo
                Conselho Monetário Nacional (CMN) por meio da Resolução Bacen nº 3.517/2007
                (atualizada pela Resolução nº 4.881/2020) que sintetiza, em uma única taxa
                percentual anual e mensal, todos os fluxos de desembolso exigidos pela instituição
                concedente do crédito.
              </p>
              <p>
                Comparar propostas bancárias observando unicamente a &ldquo;taxa de juros
                nominal&rdquo; é um dos equívocos mais lesivos ao patrimônio do tomador. Bancos e
                cooperativas utilizam com frequência a estratégia da taxa de fachada: ofertam uma
                taxa nominal reduzida (por exemplo, 9,5% ao ano), mas embutem tarifas de avaliação
                de garantia desproporcionais, custos mensais de manutenção de conta e apólices de
                seguro com prêmios superfaturados.
              </p>
              <div className="p-4 bg-neutral-100 rounded-lg border-l-4 border-neutral-900 my-4 text-sm font-serif italic text-neutral-900">
                &ldquo;O CET representa a taxa interna de retorno (TIR) que iguala o valor líquido
                disponibilizado ao tomador à soma de todas as prestações e encargos exigidos ao
                longo do contrato.&rdquo;
              </div>
              <p>
                Uma instituição financeira &ldquo;A&rdquo; com juros de 10,2% ao ano pode entregar
                um CET de 10,9% ao ano, enquanto a instituição &ldquo;B&rdquo; que divulga juros de
                9,8% ao ano pode ter um CET real de 11,8% ao ano em decorrência de tarifas e seguros
                abusivos. O indicador decisivo de contratação deve ser sempre o menor CET, nunca a
                menor taxa nominal.
              </p>
            </section>

            {/* 4. como seguros e tarifas entram no custo real do financiamento */}
            <section
              aria-labelledby="subtitulo-seguros-tarifas"
              className="pt-6 border-t border-neutral-200"
            >
              <h3
                id="subtitulo-seguros-tarifas"
                className="text-xl md:text-2xl font-serif font-bold text-black mb-3"
              >
                4. Como seguros e tarifas entram no custo real do financiamento
              </h3>
              <p>
                Em um contrato financeiro de longo prazo, a parcela que sai da sua conta não é
                composta apenas por juros e amortização. Na prática bancária, a prestação global
                agrega até quatro outros componentes monetários obrigatórios:
              </p>
              <div className="space-y-4 my-4">
                <div className="p-4 border border-neutral-200 rounded-lg bg-neutral-50">
                  <h4 className="font-serif font-bold text-black text-base mb-1">
                    A. Seguro MIP (Morte e Invalidez Permanente)
                  </h4>
                  <p className="text-sm text-neutral-700">
                    Seguro de contratação compulsória no SFH. A alíquota do MIP é progressiva e
                    calculada com base na idade do proponente (ou na média ponderada da renda dos
                    compradores). Quanto maior a idade do mutuário, maior o coeficiente percentual,
                    podendo fazer a parcela mensal encarecer substancialmente ao longo dos anos.
                  </p>
                </div>

                <div className="p-4 border border-neutral-200 rounded-lg bg-neutral-50">
                  <h4 className="font-serif font-bold text-black text-base mb-1">
                    B. Seguro DFI (Danos Físicos ao Imóvel)
                  </h4>
                  <p className="text-sm text-neutral-700">
                    Garante a integridade do bem hipotecado ou alienado fiduciariamente contra
                    sinistros de desmoronamento, incêndio, explosão ou alagamento. Incide sobre o
                    valor de avaliação do imóvel e permanece fixo ou atualizado monetariamente.
                  </p>
                </div>

                <div className="p-4 border border-neutral-200 rounded-lg bg-neutral-50">
                  <h4 className="font-serif font-bold text-black text-base mb-1">
                    C. Taxa de Administração de Contrato (TAC / Manutenção Mensal)
                  </h4>
                  <p className="text-sm text-neutral-700">
                    Cobrança mensal fixa (geralmente entre R$ 25,00 e R$ 50,00 por mês) autorizada
                    pelo Bacen no SFH. Embora pareça insignificante, em 360 meses uma taxa de R$
                    40,00 representa R$ 14.400,00 adicionados ao custo da operação sem amortizar um
                    único centavo da dívida.
                  </p>
                </div>

                <div className="p-4 border border-neutral-200 rounded-lg bg-neutral-50">
                  <h4 className="font-serif font-bold text-black text-base mb-1">
                    D. Tributos (IOF) e Tarifas de Avaliação Inicial
                  </h4>
                  <p className="text-sm text-neutral-700">
                    O Imposto sobre Operações Financeiras (IOF) incide em financiamentos
                    corporativos e de veículos (sendo isento para pessoas físicas na aquisição de
                    imóveis residenciais). Entretanto, despesas como vistoria de engenharia, tarifa
                    de confecção de contrato e certidões cartorárias frequentemente são financiadas
                    junto com o principal, inflando o saldo sobre o qual incidirão juros por anos.
                  </p>
                </div>
              </div>
            </section>

            {/* 5. erros comuns ao comparar financiamentos (com pelo menos quatro exemplos práticos) */}
            <section
              aria-labelledby="subtitulo-erros-comuns"
              className="pt-6 border-t border-neutral-200"
            >
              <h3
                id="subtitulo-erros-comuns"
                className="text-xl md:text-2xl font-serif font-bold text-black mb-3"
              >
                5. Erros comuns ao comparar financiamentos
              </h3>
              <p className="mb-4">
                Decisões de crédito mal estruturadas comprometem o orçamento familiar e empresarial
                por décadas. A seguir, detalhamos quatro exemplos práticos de distorções recorrentes
                e seus efeitos econômicos objetivos:
              </p>

              <div className="grid gap-4">
                {/* Exemplo 1 */}
                <div className="border border-neutral-200 rounded-lg p-4 bg-white shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-bold bg-neutral-900 text-white px-2 py-0.5 rounded">
                      Exemplo Prático 01
                    </span>
                    <h4 className="font-serif font-bold text-black text-base">
                      Olhar apenas a primeira parcela e escolher Price sem avaliar o custo total
                    </h4>
                  </div>
                  <p className="text-sm text-neutral-700">
                    <strong>O erro:</strong> O comprador compara um financiamento de R$ 400.000,00
                    em 360 meses com taxa de 10% a.a. No SAC, a primeira parcela é de R$ 4.444,00,
                    enquanto na Price é de R$ 3.510,00. Atraído pela parcela inicial R$ 934,00
                    menor, escolhe a Price.
                  </p>
                  <p className="text-sm text-neutral-700 mt-1">
                    <strong>O efeito financeiro:</strong> Ao longo dos 30 anos, ele pagará R$
                    1.263.600 no total pelo sistema Price, contra R$ 1.002.000 pelo SAC. Para
                    aliviar a parcela inicial nos primeiros anos, desembolsou{' '}
                    <strong className="text-amber-900">R$ 261.600,00 a mais</strong> em juros sem
                    perceber, montante suficiente para adquirir outro imóvel de pequeno porte.
                  </p>
                </div>

                {/* Exemplo 2 */}
                <div className="border border-neutral-200 rounded-lg p-4 bg-white shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-bold bg-neutral-900 text-white px-2 py-0.5 rounded">
                      Exemplo Prático 02
                    </span>
                    <h4 className="font-serif font-bold text-black text-base">
                      Ignorar a venda casada de seguros do banco e não cotar apólice avulsa
                    </h4>
                  </div>
                  <p className="text-sm text-neutral-700">
                    <strong>O erro:</strong> O tomador aceita a apólice de seguro habitacional
                    (MIP/DFI) oferecida diretamente pelo banco concedente do crédito sem exercer a
                    faculdade legal (prevista na Circular Susep nº 111/2007) de apresentar uma
                    apólice externa individual.
                  </p>
                  <p className="text-sm text-neutral-700 mt-1">
                    <strong>O efeito financeiro:</strong> Para mutuários com mais de 45 anos, as
                    seguradoras ligadas aos grandes bancos chegam a cobrar de 2 a 3 vezes mais que o
                    mercado livre. Em um saldo de R$ 500.000,00, a diferença de R$ 180,00 por mês
                    representa uma perda acumulada de{' '}
                    <strong className="text-amber-900">mais de R$ 64.800,00</strong> em prêmios
                    excessivos ao longo de 30 anos.
                  </p>
                </div>

                {/* Exemplo 3 */}
                <div className="border border-neutral-200 rounded-lg p-4 bg-white shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-bold bg-neutral-900 text-white px-2 py-0.5 rounded">
                      Exemplo Prático 03
                    </span>
                    <h4 className="font-serif font-bold text-black text-base">
                      Comparar taxas nominais sem confrontar o Custo Efetivo Total (CET)
                    </h4>
                  </div>
                  <p className="text-sm text-neutral-700">
                    <strong>O erro:</strong> Escolher o Banco X porque sua taxa nominal anunciada é
                    de 8,9% a.a., enquanto o Banco Y pede 9,3% a.a. Contudo, o Banco X exige tarifa
                    mensal de pacote de serviços de R$ 65,00, seguro MIP mais caro e taxa de
                    avaliação de R$ 3.800,00 financiada.
                  </p>
                  <p className="text-sm text-neutral-700 mt-1">
                    <strong>O efeito financeiro:</strong> O CET do Banco X fecha em 10,4% a.a.,
                    enquanto o CET do Banco Y é de apenas 9,8% a.a. O cliente assina um contrato
                    acreditando ter economizado, mas terá um dispêndio global{' '}
                    <strong className="text-amber-900">R$ 28.500,00 superior</strong> ao longo do
                    prazo contratual.
                  </p>
                </div>

                {/* Exemplo 4 */}
                <div className="border border-neutral-200 rounded-lg p-4 bg-white shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-bold bg-neutral-900 text-white px-2 py-0.5 rounded">
                      Exemplo Prático 04
                    </span>
                    <h4 className="font-serif font-bold text-black text-base">
                      Amortizar prazo versus amortizar valor da prestação sem estratégia
                    </h4>
                  </div>
                  <p className="text-sm text-neutral-700">
                    <strong>O erro:</strong> Ao receber um bônus, PLR ou herança e fazer amortização
                    extraordinária no banco, o tomador opta automaticamente por &ldquo;reduzir o
                    valor da parcela mensal&rdquo; mantendo o prazo original de 30 anos, em vez de
                    &ldquo;reduzir o número de parcelas (prazo restante)&rdquo;.
                  </p>
                  <p className="text-sm text-neutral-700 mt-1">
                    <strong>O efeito financeiro:</strong> Uma amortização antecipada de R$ 30.000,00
                    que reduz o prazo em 48 meses elimina integralmente quatro anos de juros futuros
                    e taxas mensais, economizando cerca de{' '}
                    <strong className="text-emerald-900">R$ 55.000,00 em juros</strong>. Se aplicada
                    para diminuir apenas a parcela, o saldo continua exposto aos juros pelo prazo
                    máximo, reduzindo a economia para menos da metade.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </article>

        {/* AVISO LEGAL DE ESTIMATIVA COM LINK PARA A PÁGINA DE CONTATO (/contato) */}
        <section
          aria-labelledby="aviso-legal-financiamento-title"
          className="border border-neutral-200 bg-neutral-50 rounded-xl p-6 md:p-8 mb-16 shadow-xs"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-neutral-700 shrink-0 mt-0.5" />
            <div>
              <h3
                id="aviso-legal-financiamento-title"
                className="font-serif font-semibold text-base text-black mb-1"
              >
                Aviso Legal de Estimativa e Simulação Financeira
              </h3>
              <p className="text-xs md:text-sm text-neutral-700 leading-relaxed">
                Os resultados demonstrados por esta calculadora são simulações matemáticas
                analíticas de caráter estritamente estimativo. A ferramenta não substitui a planilha
                oficial de simulação nem a minuta contratual formal emitida pela instituição
                financeira ou agente de crédito concedente. Variações de índices de correção
                monetária (TR, IPCA ou IGP-M), custos de seguros obrigatórios (MIP e DFI), tributos
                (IOF) e tarifas cadastrais de cada banco alteram o valor definitivo das parcelas e
                do CET.
              </p>
              <p className="text-xs md:text-sm text-neutral-700 leading-relaxed mt-2">
                Recomendamos sempre solicitar a Planilha de Custo Efetivo Total (CET) detalhada
                antes de firmar qualquer compromisso financeiro. Se você ou sua empresa necessita de
                assessoria técnica contábil para auditoria de contratos bancários ou planejamento
                patrimonial,{' '}
                <Link
                  to="/contato"
                  className="text-black font-semibold underline hover:text-neutral-700"
                >
                  entre em contato com a equipe de consultoria da PERES PERES
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* SEÇÃO DE PERGUNTAS FREQUENTES (FAQ COM CINCO PERGUNTAS EM HTML ESTÁTICO) */}
        <section aria-labelledby="faq-financiamento-title" className="mb-16 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 border border-neutral-300 bg-neutral-100 px-3 py-1 rounded text-xs font-mono uppercase tracking-wider text-neutral-800 mb-3">
              <HelpCircle className="h-3.5 w-3.5 text-black" />
              Perguntas e Respostas
            </div>
            <h2
              id="faq-financiamento-title"
              className="text-2xl md:text-3xl font-serif font-bold text-black mb-2"
            >
              Dúvidas Frequentes sobre Juros de Financiamento
            </h2>
            <p className="text-neutral-600 text-sm">
              Esclarecimentos técnicos diretos sobre os sistemas Price, SAC e gestão de dívidas de
              longo prazo.
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

        {/* CALCULADORAS RELACIONADAS COM EXATAMENTE TRÊS LINKS:
            1. Juros de Mora de Tributos (/calculadoras/juros-de-mora-de-tributos)
            2. PJ ou CLT (/calculadoras/pj-ou-clt)
            3. Simples Nacional ou Lucro Presumido (/calculadoras/simples-nacional-ou-lucro-presumido)
        */}
        <section aria-labelledby="relacionadas-financiamento-title" className="mb-16">
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-1">
              Ferramentas Complementares
            </span>
            <h2
              id="relacionadas-financiamento-title"
              className="text-2xl font-serif font-bold text-black"
            >
              Calculadoras Relacionadas
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* 1. Juros de Mora de Tributos */}
            <Card className="border border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-md transition-all flex flex-col justify-between">
              <CardHeader className="pb-3">
                <span className="text-xs font-mono text-neutral-500 uppercase">
                  Finanças e Tributos
                </span>
                <CardTitle className="text-lg font-serif font-bold text-black pt-1">
                  Juros de Mora de Tributos
                </CardTitle>
                <p className="text-xs text-neutral-600 pt-2 leading-relaxed">
                  Cálculo em tempo real de juros pela taxa Selic e multa de 0,33% ao dia sobre
                  tributos federais em atraso com memória aberta.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-black hover:bg-neutral-100 font-medium text-xs p-2 h-auto flex items-center gap-1 group w-full justify-between border-t border-neutral-100 pt-3"
                >
                  <Link to="/calculadoras/juros-de-mora-de-tributos">
                    Acessar calculadora
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* 2. PJ ou CLT */}
            <Card className="border border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-md transition-all flex flex-col justify-between">
              <CardHeader className="pb-3">
                <span className="text-xs font-mono text-neutral-500 uppercase">
                  Folha e Trabalhista
                </span>
                <CardTitle className="text-lg font-serif font-bold text-black pt-1">
                  PJ ou CLT
                </CardTitle>
                <p className="text-xs text-neutral-600 pt-2 leading-relaxed">
                  Comparativo do custo total para a empresa e do valor líquido na mão do
                  profissional nos cenários de contratação PJ e CLT.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-black hover:bg-neutral-100 font-medium text-xs p-2 h-auto flex items-center gap-1 group w-full justify-between border-t border-neutral-100 pt-3"
                >
                  <Link to="/calculadoras/pj-ou-clt">
                    Acessar calculadora
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* 3. Simples Nacional ou Lucro Presumido */}
            <Card className="border border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-md transition-all flex flex-col justify-between">
              <CardHeader className="pb-3">
                <span className="text-xs font-mono text-neutral-500 uppercase">
                  Regime Tributário
                </span>
                <CardTitle className="text-lg font-serif font-bold text-black pt-1">
                  Simples Nacional ou Lucro Presumido
                </CardTitle>
                <p className="text-xs text-neutral-600 pt-2 leading-relaxed">
                  Comparativo estimativo de carga tributária e encargos entre os regimes Simples
                  Nacional e Lucro Presumido com alíquotas efetivas.
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
          </div>
        </section>

        {/* BLOCO FINAL DE CHAMADA PARA CONTATO COM O ESCRITÓRIO */}
        <section
          aria-labelledby="contato-financiamento-callout-title"
          className="bg-neutral-950 text-white rounded-2xl p-8 md:p-12 text-center"
        >
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 border border-neutral-800 px-3 py-1 rounded text-xs uppercase tracking-wider text-neutral-400 font-mono">
              <Building2 className="h-3.5 w-3.5 text-neutral-300" />
              Consultoria Financeira e Tributária Especializada
            </div>

            <h2
              id="contato-financiamento-callout-title"
              className="text-2xl md:text-4xl font-serif font-bold text-white leading-tight"
            >
              Precisa avaliar custos bancários ou reestruturar dívidas?
            </h2>

            <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
              Nossa equipe estrutura pareceres de viabilidade financeira, auditoria de encargos
              bancários e planejamento tributário estratégico para assegurar a melhor eficiência de
              capital para você ou sua empresa.
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
