import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Calculator,
  HelpCircle,
  AlertCircle,
  FileCheck2,
  Scale,
  Users,
  GraduationCap,
  HeartPulse,
  Landmark,
  Receipt,
  PiggyBank,
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingDown,
  TrendingUp,
  MinusCircle,
  Percent,
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

// Converte texto digitado para valor numérico em reais
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

// Parâmetros legais da Tabela Progressiva Anual do IRPF vigente
// Lei nº 9.250/1995, Lei nº 11.482/2007 e Tabela Progressiva da RFB
export const DEDUCAO_ANUAL_POR_DEPENDENTE = 2275.08
export const LIMITE_ANUAL_EDUCACAO_POR_PESSOA = 3561.5
export const LIMITE_PERCENTUAL_PGBL = 0.12 // 12% dos rendimentos tributáveis
export const LIMITE_DESCONTO_SIMPLIFICADO = 16754.34 // 20% até R$ 16.754,34

export interface FaixaIRPF {
  faixa: number
  nome: string
  de: number
  ate: number // Infinity para a última faixa
  aliquota: number
  parcelaADeduzir: number
}

export const TABELA_PROGRESSIVA_ANUAL: FaixaIRPF[] = [
  {
    faixa: 1,
    nome: '1ª Faixa',
    de: 0,
    ate: 28467.2,
    aliquota: 0,
    parcelaADeduzir: 0,
  },
  {
    faixa: 2,
    nome: '2ª Faixa',
    de: 28467.2,
    ate: 33919.8,
    aliquota: 0.075,
    parcelaADeduzir: 2135.04,
  },
  {
    faixa: 3,
    nome: '3ª Faixa',
    de: 33919.8,
    ate: 45012.6,
    aliquota: 0.15,
    parcelaADeduzir: 4679.03,
  },
  {
    faixa: 4,
    nome: '4ª Faixa',
    de: 45012.6,
    ate: 55976.16,
    aliquota: 0.225,
    parcelaADeduzir: 8054.97,
  },
  {
    faixa: 5,
    nome: '5ª Faixa',
    de: 55976.16,
    ate: Infinity,
    aliquota: 0.275,
    parcelaADeduzir: 10853.78,
  },
]

// Função pura para apurar imposto faixa a faixa
function calcularImpostoPorFaixas(baseCalculo: number) {
  if (baseCalculo <= 0) {
    return {
      impostoTotal: 0,
      faixaAplicada: TABELA_PROGRESSIVA_ANUAL[0],
      detalheFaixas: TABELA_PROGRESSIVA_ANUAL.map((f) => ({
        faixa: f.faixa,
        nome: f.nome,
        de: f.de,
        ate: f.ate,
        aliquota: f.aliquota,
        baseTributadaNaFaixa: 0,
        impostoFaixa: 0,
      })),
    }
  }

  let impostoTotal = 0
  let faixaMarginal = TABELA_PROGRESSIVA_ANUAL[0]

  const detalheFaixas = TABELA_PROGRESSIVA_ANUAL.map((f) => {
    let baseTributadaNaFaixa = 0
    let impostoFaixa = 0

    if (baseCalculo > f.de) {
      faixaMarginal = f
      if (f.ate === Infinity) {
        baseTributadaNaFaixa = baseCalculo - f.de
      } else {
        baseTributadaNaFaixa = Math.min(baseCalculo, f.ate) - f.de
      }
      impostoFaixa = baseTributadaNaFaixa * f.aliquota
      impostoTotal += impostoFaixa
    }

    return {
      faixa: f.faixa,
      nome: f.nome,
      de: f.de,
      ate: f.ate,
      aliquota: f.aliquota,
      baseTributadaNaFaixa,
      impostoFaixa,
    }
  })

  return {
    impostoTotal,
    faixaAplicada: faixaMarginal,
    detalheFaixas,
  }
}

export default function IRPFeRestituicaoCalculator() {
  // Entradas da calculadora
  // 1. Rendimentos tributáveis do ano
  const [rendimentos, setRendimentos] = useState<number>(120000)
  const [rendimentosInput, setRendimentosInput] = useState<string>('120.000,00')

  // 2. Número de dependentes
  const [dependentes, setDependentes] = useState<number>(1)

  // 3. Despesas dedutíveis separadas em três campos:
  // 3a. Saúde (sem limite legal)
  const [saude, setSaude] = useState<number>(6000)
  const [saudeInput, setSaudeInput] = useState<string>('6.000,00')

  // 3b. Educação (limite anual de R$ 3.561,50 por pessoa)
  const [educacao, setEducacao] = useState<number>(4500)
  const [educacaoInput, setEducacaoInput] = useState<string>('4.500,00')

  // 3c. Previdência (oficial sem limite; privada PGBL limitada a 12% dos rendimentos tributáveis)
  const [previdencia, setPrevidencia] = useState<number>(11000)
  const [previdenciaInput, setPrevidenciaInput] = useState<string>('11.000,00')
  const [tipoPrevidencia, setTipoPrevidencia] = useState<'oficial' | 'privada'>('oficial')

  // 4. Total de imposto já retido na fonte no ano (IRRF)
  const [irrfRetido, setIrrfRetido] = useState<number>(18500)
  const [irrfRetidoInput, setIrrfRetidoInput] = useState<string>('18.500,00')

  // SEO: título da aba (máx 60 caracteres começando por "calculadora irpf") e meta description (máx 155 caracteres)
  useEffect(() => {
    const pageTitle = 'calculadora irpf e restituição | PERES PERES' // 47 caracteres
    const pageDesc =
      'Calcule seu IRPF anual e restituição em tempo real. Deduções legais, alíquota efetiva e memória aberta pela tabela progressiva da Receita Federal.' // 149 caracteres

    document.title = pageTitle

    let metaDescTag = document.querySelector('meta[name="description"]')
    if (!metaDescTag) {
      metaDescTag = document.createElement('meta')
      metaDescTag.setAttribute('name', 'description')
      document.head.appendChild(metaDescTag)
    }
    metaDescTag.setAttribute('content', pageDesc)
  }, [])

  // Handlers dos campos com máscara BRL
  const handleRendimentosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseRawToNumber(e.target.value)
    setRendimentos(num)
    setRendimentosInput(formatRawInput(num))
  }

  const handleSaudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseRawToNumber(e.target.value)
    setSaude(num)
    setSaudeInput(formatRawInput(num))
  }

  const handleEducacaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseRawToNumber(e.target.value)
    setEducacao(num)
    setEducacaoInput(formatRawInput(num))
  }

  const handlePrevidenciaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseRawToNumber(e.target.value)
    setPrevidencia(num)
    setPrevidenciaInput(formatRawInput(num))
  }

  const handleIrrfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseRawToNumber(e.target.value)
    setIrrfRetido(num)
    setIrrfRetidoInput(formatRawInput(num))
  }

  const handleDependentesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10)
    if (isNaN(val) || val < 0) {
      setDependentes(0)
    } else {
      setDependentes(Math.min(val, 20)) // Trava razoável de dependentes
    }
  }

  // Cálculos em tempo real
  const calculation = useMemo(() => {
    // 1. Limite legal de dependentes: R$ 2.275,08 por dependente
    const deducaoDependentesTotal = dependentes * DEDUCAO_ANUAL_POR_DEPENDENTE

    // 2. Limite legal de educação: R$ 3.561,50 por pessoa (contribuinte + dependentes)
    const pessoasAptasEducacao = 1 + dependentes
    const tetoEducacaoCalculado = pessoasAptasEducacao * LIMITE_ANUAL_EDUCACAO_POR_PESSOA
    const educacaoEfetivaDeducao = Math.min(educacao, tetoEducacaoCalculado)
    const educacaoGlosa = Math.max(0, educacao - tetoEducacaoCalculado)

    // 3. Saúde: 100% dedutível sem limite legal
    const saudeEfetivaDeducao = saude

    // 4. Previdência:
    // Oficial (INSS): sem limite
    // Privada (PGBL): limitada a 12% dos rendimentos tributáveis
    const tetoPrevidenciaPrivada = rendimentos * LIMITE_PERCENTUAL_PGBL
    let previdenciaEfetivaDeducao = previdencia
    let previdenciaGlosa = 0

    if (tipoPrevidencia === 'privada') {
      previdenciaEfetivaDeducao = Math.min(previdencia, tetoPrevidenciaPrivada)
      previdenciaGlosa = Math.max(0, previdencia - tetoPrevidenciaPrivada)
    }

    // Total de deduções legais do Modelo Completo
    const totalDeducoesCompleto =
      deducaoDependentesTotal +
      educacaoEfetivaDeducao +
      saudeEfetivaDeducao +
      previdenciaEfetivaDeducao

    // Base de cálculo Modelo Completo (não pode ser negativa)
    const baseCalculoCompleto = Math.max(0, rendimentos - totalDeducoesCompleto)

    // Imposto devido pelo Modelo Completo
    const resultadoCompleto = calcularImpostoPorFaixas(baseCalculoCompleto)
    const impostoDevidoCompleto = resultadoCompleto.impostoTotal

    // Comparativo: Modelo Simplificado (20% limitado a R$ 16.754,34)
    const descontoSimplificado = Math.min(rendimentos * 0.2, LIMITE_DESCONTO_SIMPLIFICADO)
    const baseCalculoSimplificado = Math.max(0, rendimentos - descontoSimplificado)
    const resultadoSimplificado = calcularImpostoPorFaixas(baseCalculoSimplificado)
    const impostoDevidoSimplificado = resultadoSimplificado.impostoTotal

    // Modelo mais vantajoso para o contribuinte (menor imposto devido)
    const modeloMaisVantajoso: 'completo' | 'simplificado' =
      impostoDevidoCompleto <= impostoDevidoSimplificado ? 'completo' : 'simplificado'
    const economiaModeloVantajoso = Math.abs(impostoDevidoCompleto - impostoDevidoSimplificado)

    // Efeito da dedução por dependente no imposto:
    // Quanto 1 dependente reduz? Se houver dependentes, calculamos o imposto com (dependentes - 1)
    // para aferir exatamente o impacto marginal da dedução de dependente sobre o imposto devido
    const deducaoDependentesMenosUm = Math.max(0, dependentes - 1) * DEDUCAO_ANUAL_POR_DEPENDENTE
    const totalDeducoesSemUmDep =
      deducaoDependentesMenosUm +
      educacaoEfetivaDeducao +
      saudeEfetivaDeducao +
      previdenciaEfetivaDeducao
    const baseCalculoSemUmDep = Math.max(0, rendimentos - totalDeducoesSemUmDep)
    const impostoSemUmDep = calcularImpostoPorFaixas(baseCalculoSemUmDep).impostoTotal
    const reducaoPorDependente = Math.max(0, impostoSemUmDep - impostoDevidoCompleto)
    const reducaoTotalDependentes = dependentes > 0 ? reducaoPorDependente * dependentes : 0

    // Alíquota efetiva (Imposto Devido / Rendimentos Tributáveis)
    const aliquotaEfetiva = rendimentos > 0 ? (impostoDevidoCompleto / rendimentos) * 100 : 0
    const aliquotaEfetivaSimplificado =
      rendimentos > 0 ? (impostoDevidoSimplificado / rendimentos) * 100 : 0

    // Comparação com o imposto retido na fonte (IRRF)
    // Saldo = Retido - Devido
    // Se saldo > 0: RESTITUIÇÃO A RECEBER
    // Se saldo < 0: IMPOSTO A PAGAR
    // Se saldo == 0: SALDO ZERADO
    const saldoCompleto = irrfRetido - impostoDevidoCompleto
    const valorRestituicao = saldoCompleto > 0 ? saldoCompleto : 0
    const valorImpostoAPagar = saldoCompleto < 0 ? Math.abs(saldoCompleto) : 0
    const isSaldoZerado = Math.abs(saldoCompleto) < 0.01

    let statusResultado: 'restituicao' | 'pagar' | 'zerado' = 'zerado'
    if (saldoCompleto > 0.01) {
      statusResultado = 'restituicao'
    } else if (saldoCompleto < -0.01) {
      statusResultado = 'pagar'
    }

    // Saldo no simplificado também para comparativo
    const saldoSimplificado = irrfRetido - impostoDevidoSimplificado

    return {
      rendimentos,
      dependentes,
      deducaoDependentesTotal,
      educacao,
      tetoEducacaoCalculado,
      educacaoEfetivaDeducao,
      educacaoGlosa,
      saude,
      saudeEfetivaDeducao,
      previdencia,
      tipoPrevidencia,
      tetoPrevidenciaPrivada,
      previdenciaEfetivaDeducao,
      previdenciaGlosa,
      totalDeducoesCompleto,
      baseCalculoCompleto,
      resultadoCompleto,
      impostoDevidoCompleto,
      descontoSimplificado,
      baseCalculoSimplificado,
      resultadoSimplificado,
      impostoDevidoSimplificado,
      modeloMaisVantajoso,
      economiaModeloVantajoso,
      aliquotaEfetiva,
      aliquotaEfetivaSimplificado,
      irrfRetido,
      saldoCompleto,
      valorRestituicao,
      valorImpostoAPagar,
      isSaldoZerado,
      statusResultado,
      saldoSimplificado,
      reducaoPorDependente,
      reducaoTotalDependentes,
    }
  }, [rendimentos, dependentes, saude, educacao, previdencia, tipoPrevidencia, irrfRetido])

  // FAQ estática com CINCO perguntas curtas e diretas
  const faqs = [
    {
      q: 'Qual a diferença entre imposto retido na fonte e imposto devido no IRPF?',
      a: 'O imposto retido na fonte (IRRF) é uma antecipação mensal obrigatória recolhida pelo empregador ou pagador. Já o imposto devido é apurado anualmente na Declaração de Ajuste Anual após todas as deduções legais. Se o retido for maior que o devido, você recebe restituição; se for menor, paga a diferença.',
    },
    {
      q: 'Quem tem direito a receber restituição do Imposto de Renda?',
      a: 'Qualquer contribuinte que tenha sofrido retenção de IRRF ao longo do ano em montante superior ao imposto apurado na declaração anual. As deduções legais (dependentes, despesas médicas, instrução e previdência) reduzem a base tributável e potencializam o valor a restituir.',
    },
    {
      q: 'Quando vale a pena optar pelo Modelo Completo em vez do Simplificado?',
      a: 'O Modelo Completo é vantajoso sempre que a soma de suas despesas dedutíveis comprovadas (saúde, educação, previdência e dependentes) superar o desconto padrão de 20% dos rendimentos tributáveis (limitado a R$ 16.754,34). Nossa calculadora compara ambos automaticamente.',
    },
    {
      q: 'Existe algum limite de dedução para gastos com saúde médica?',
      a: 'Não. Pela legislação brasileira (art. 8º da Lei nº 9.250/1995), despesas médicas com médicos, dentistas, psicólogos, fisioterapeutas, exames e hospitais não possuem teto de dedução, desde que comprovadas por recibos idôneos ou notas fiscais com CPF/CNPJ do prestador.',
    },
    {
      q: 'Como funciona a dedução de previdência privada PGBL e VGBL?',
      a: 'Apenas os planos na modalidade PGBL (Plano Gerador de Benefício Livre) e previdência oficial são dedutíveis da base de cálculo do IRPF, até o limite de 12% dos rendimentos tributáveis anuais do declarante. Planos VGBL não são dedutíveis da base de cálculo.',
    },
  ]

  // Dados estruturados JSON-LD Schema.org (SoftwareApplication + FAQPage + BreadcrumbList)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://peresperes.com.br/calculadoras/irpf-e-restituicao#software',
        name: 'Calculadora de IRPF e Restituição',
        url: 'https://peresperes.com.br/calculadoras/irpf-e-restituicao',
        applicationCategory: 'FinancialApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        description:
          'Calculadora online gratuita de Imposto de Renda Pessoa Física e Restituição com deduções legais, alíquota efetiva, memória aberta e comparativo entre modelo simplificado e completo.',
        provider: {
          '@type': 'AccountingService',
          name: 'PERES PERES Consultoria e Contabilidade',
          url: 'https://peresperes.com.br',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://peresperes.com.br/calculadoras/irpf-e-restituicao#breadcrumb',
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
            name: 'IRPF e Restituição',
            item: 'https://peresperes.com.br/calculadoras/irpf-e-restituicao',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://peresperes.com.br/calculadoras/irpf-e-restituicao#faq',
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
      {/* 12. Dados estruturados JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="container mx-auto px-4 max-w-4xl">
        {/* 1. TOPO DA PÁGINA */}
        {/* Trilha de navegação: Início > Calculadoras > IRPF e Restituição */}
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
          <span className="text-black font-medium">IRPF e Restituição</span>
        </nav>

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

        <header className="mb-10 max-w-3xl">
          <div className="inline-block border border-neutral-300 bg-neutral-100 text-neutral-800 text-xs font-mono uppercase tracking-wider px-3 py-1 rounded mb-4">
            Finanças e Tributos • Pessoa Física
          </div>

          {/* Título principal (H1) exatamente como solicitado */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-black mb-5 leading-tight">
            Calculadora de IRPF, quanto você vai pagar ou receber de restituição
          </h1>

          <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
            Simule em tempo real o valor do Imposto de Renda da Pessoa Física devido no ano, aplique
            os limites oficiais de deduções legais e descubra se você terá restituição a receber ou
            saldo a pagar na Declaração de Ajuste Anual da Receita Federal.
          </p>
        </header>

        {/* 2. BLOCO DA CALCULADORA INTERATIVA (resultado em tempo real) */}
        <section
          aria-labelledby="calculadora-irpf-heading"
          className="border border-neutral-200 bg-white rounded-xl shadow-sm p-6 md:p-8 mb-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-neutral-200 mb-6 gap-2">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-neutral-900" />
              <h2
                id="calculadora-irpf-heading"
                className="text-xl md:text-2xl font-serif font-bold text-black"
              >
                Simulação de IRPF e Restituição Anual
              </h2>
            </div>
            {/* Bloco de vigência destacado no cabeçalho da calculadora */}
            <span className="text-xs font-mono bg-neutral-100 border border-neutral-300 text-neutral-800 px-2.5 py-1 rounded uppercase tracking-wider font-semibold">
              ano-calendário 2025 / exercício 2026
            </span>
          </div>

          {/* CAMPOS DE ENTRADA */}
          <div className="space-y-6 mb-8">
            {/* Rendimentos tributáveis e Imposto retido */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="input-rendimentos"
                  className="block text-sm font-semibold text-neutral-900 mb-1"
                >
                  Rendimentos tributáveis do ano
                </label>
                <p className="text-xs text-neutral-500 mb-2">
                  Total bruto anual de salários, pró-labore, aposentadorias ou aluguéis recebidos.
                </p>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-500 font-mono">
                    R$
                  </span>
                  <Input
                    id="input-rendimentos"
                    type="text"
                    inputMode="numeric"
                    value={rendimentosInput}
                    onChange={handleRendimentosChange}
                    placeholder="0,00"
                    className="pl-10 font-mono text-base border-neutral-300 focus-visible:ring-black"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="input-irrf-retido"
                  className="block text-sm font-semibold text-neutral-900 mb-1"
                >
                  Total de imposto já retido na fonte no ano (IRRF)
                </label>
                <p className="text-xs text-neutral-500 mb-2">
                  Soma do IR retido nos contracheques (informe de rendimentos) ou recolhido via
                  Carnê-Leão.
                </p>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-500 font-mono">
                    R$
                  </span>
                  <Input
                    id="input-irrf-retido"
                    type="text"
                    inputMode="numeric"
                    value={irrfRetidoInput}
                    onChange={handleIrrfChange}
                    placeholder="0,00"
                    className="pl-10 font-mono text-base border-neutral-300 focus-visible:ring-black"
                  />
                </div>
              </div>
            </div>

            {/* Dependentes */}
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-0.5">
                  <label
                    htmlFor="input-dependentes"
                    className="flex items-center gap-2 text-sm font-semibold text-neutral-900"
                  >
                    <Users className="h-4 w-4 text-neutral-700" />
                    Número de dependentes legais
                  </label>
                  <p className="text-xs text-neutral-500">
                    Dedução anual fixa de <strong>R$ 2.275,08</strong> por dependente (filhos até 21
                    ou 24 anos universitários, cônjuge, pais).
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    id="input-dependentes"
                    type="number"
                    min="0"
                    max="20"
                    value={dependentes}
                    onChange={handleDependentesChange}
                    className="w-24 text-center font-mono font-bold text-base border-neutral-300 focus-visible:ring-black bg-white"
                  />
                  <span className="text-xs font-mono text-neutral-600">
                    = {formatCurrencyBRL(calculation.deducaoDependentesTotal)} abatidos
                  </span>
                </div>
              </div>
            </div>

            {/* Três campos de despesas dedutíveis: Saúde, Educação e Previdência */}
            <div className="border border-neutral-200 rounded-lg p-5 bg-white space-y-4">
              <div className="border-b border-neutral-100 pb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block">
                  Deduções Legais do Modelo Completo
                </span>
                <h3 className="font-serif font-bold text-base text-black">
                  Despesas dedutíveis comprovadas
                </h3>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                {/* 1. Saúde */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="input-saude"
                      className="text-xs font-semibold text-neutral-900 flex items-center gap-1.5"
                    >
                      <HeartPulse className="h-3.5 w-3.5 text-neutral-700" />
                      Despesas médicas (Saúde)
                    </label>
                    <span className="text-[10px] font-mono bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded border border-neutral-200">
                      Sem limite
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mb-2 leading-snug">
                    Consultas, exames, internações, dentistas e planos de saúde.
                  </p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-neutral-500 font-mono">
                      R$
                    </span>
                    <Input
                      id="input-saude"
                      type="text"
                      inputMode="numeric"
                      value={saudeInput}
                      onChange={handleSaudeChange}
                      placeholder="0,00"
                      className="pl-9 font-mono text-sm border-neutral-300 focus-visible:ring-black"
                    />
                  </div>
                </div>

                {/* 2. Educação */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="input-educacao"
                      className="text-xs font-semibold text-neutral-900 flex items-center gap-1.5"
                    >
                      <GraduationCap className="h-3.5 w-3.5 text-neutral-700" />
                      Despesas com educação
                    </label>
                    <span className="text-[10px] font-mono bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded border border-neutral-200">
                      Teto: R$ 3.561,50/pessoa
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mb-2 leading-snug">
                    Mensalidades de ensino infantil, fundamental, médio e superior.
                  </p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-neutral-500 font-mono">
                      R$
                    </span>
                    <Input
                      id="input-educacao"
                      type="text"
                      inputMode="numeric"
                      value={educacaoInput}
                      onChange={handleEducacaoChange}
                      placeholder="0,00"
                      className="pl-9 font-mono text-sm border-neutral-300 focus-visible:ring-black"
                    />
                  </div>
                  {calculation.educacaoGlosa > 0 && (
                    <p className="text-[11px] text-amber-800 font-mono mt-1.5 bg-amber-50 p-1.5 rounded border border-amber-200">
                      Teto atingido: limitado a{' '}
                      {formatCurrencyBRL(calculation.tetoEducacaoCalculado)} (
                      {formatCurrencyBRL(calculation.educacaoGlosa)} excedente).
                    </p>
                  )}
                </div>

                {/* 3. Previdência */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="input-previdencia"
                      className="text-xs font-semibold text-neutral-900 flex items-center gap-1.5"
                    >
                      <PiggyBank className="h-3.5 w-3.5 text-neutral-700" />
                      Previdência
                    </label>
                    <span className="text-[10px] font-mono bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded border border-neutral-200">
                      {tipoPrevidencia === 'oficial' ? 'INSS sem limite' : 'PGBL até 12%'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-[11px] text-neutral-600 flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="tipoPrevidencia"
                        checked={tipoPrevidencia === 'oficial'}
                        onChange={() => setTipoPrevidencia('oficial')}
                        className="accent-black"
                      />
                      Oficial (INSS)
                    </label>
                    <label className="text-[11px] text-neutral-600 flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="tipoPrevidencia"
                        checked={tipoPrevidencia === 'privada'}
                        onChange={() => setTipoPrevidencia('privada')}
                        className="accent-black"
                      />
                      Privada (PGBL)
                    </label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-neutral-500 font-mono">
                      R$
                    </span>
                    <Input
                      id="input-previdencia"
                      type="text"
                      inputMode="numeric"
                      value={previdenciaInput}
                      onChange={handlePrevidenciaChange}
                      placeholder="0,00"
                      className="pl-9 font-mono text-sm border-neutral-300 focus-visible:ring-black"
                    />
                  </div>
                  {tipoPrevidencia === 'privada' && calculation.previdenciaGlosa > 0 && (
                    <p className="text-[11px] text-amber-800 font-mono mt-1.5 bg-amber-50 p-1.5 rounded border border-amber-200">
                      Teto PGBL (12%): limitado a{' '}
                      {formatCurrencyBRL(calculation.tetoPrevidenciaPrivada)} (
                      {formatCurrencyBRL(calculation.previdenciaGlosa)} excedente).
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 3. RESULTADO EM TEMPO REAL */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 md:p-8 mb-8">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-3">
              Resultado em Tempo Real • Apuração Anual
            </span>

            {/* DESTAQUE PRINCIPAL: SALDO (RESTITUIÇÃO / IMPOSTO A PAGAR / ZERADO) */}
            <div className="p-6 rounded-xl border mb-6 bg-white shadow-sm border-neutral-300">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-xs font-mono uppercase text-neutral-600 block mb-1">
                    Situação da Declaração de Ajuste Anual
                  </span>
                  <div className="flex items-center gap-3">
                    {calculation.statusResultado === 'restituicao' && (
                      <>
                        <span className="inline-block bg-[#FAB319] text-black font-serif font-bold text-2xl md:text-3xl px-3.5 py-1 rounded">
                          RESTITUIÇÃO A RECEBER
                        </span>
                      </>
                    )}
                    {calculation.statusResultado === 'pagar' && (
                      <>
                        <span className="inline-block bg-neutral-900 text-white font-serif font-bold text-2xl md:text-3xl px-3.5 py-1 rounded">
                          IMPOSTO A PAGAR
                        </span>
                      </>
                    )}
                    {calculation.statusResultado === 'zerado' && (
                      <>
                        <span className="inline-block bg-neutral-200 text-black font-serif font-bold text-2xl md:text-3xl px-3.5 py-1 rounded">
                          SALDO ZERADO
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 mt-2">
                    {calculation.statusResultado === 'restituicao' &&
                      'O valor retido na fonte ao longo do ano superou o imposto apurado após as deduções legais.'}
                    {calculation.statusResultado === 'pagar' &&
                      'O valor retido na fonte foi insuficiente para cobrir o imposto total devido apurado nas faixas.'}
                    {calculation.statusResultado === 'zerado' &&
                      'O valor retido na fonte coincide exatamente com o imposto apurado após as deduções.'}
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="text-xs font-mono text-neutral-500 uppercase block mb-1">
                    {calculation.statusResultado === 'restituicao'
                      ? 'Valor a ser restituído pela RFB'
                      : calculation.statusResultado === 'pagar'
                        ? 'Valor adicional a recolher (DARF)'
                        : 'Saldo em aberto'}
                  </span>
                  <div className="font-mono text-3xl md:text-4xl font-bold text-black">
                    {calculation.statusResultado === 'restituicao'
                      ? formatCurrencyBRL(calculation.valorRestituicao)
                      : calculation.statusResultado === 'pagar'
                        ? formatCurrencyBRL(calculation.valorImpostoAPagar)
                        : formatCurrencyBRL(0)}
                  </div>
                  <span className="text-xs text-neutral-500 mt-1 block">
                    Retenção informada: {formatCurrencyBRL(calculation.irrfRetido)}
                  </span>
                </div>
              </div>
            </div>

            {/* QUADRO DE INDICADORES: Base de cálculo, Imposto Devido, Alíquota Efetiva e Efeito de Dependentes */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Indicador 1: Base de cálculo após deduções */}
              <div className="bg-white p-4 rounded-lg border border-neutral-200">
                <span className="text-xs text-neutral-600 block mb-1">Base de Cálculo Anual</span>
                <div className="text-xl md:text-2xl font-mono font-bold text-black">
                  {formatCurrencyBRL(calculation.baseCalculoCompleto)}
                </div>
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  Rendimentos ({formatCurrencyBRL(rendimentos)}) − Deduções (
                  {formatCurrencyBRL(calculation.totalDeducoesCompleto)})
                </span>
              </div>

              {/* Indicador 2: Imposto devido pela tabela progressiva */}
              <div className="bg-white p-4 rounded-lg border border-neutral-200">
                <span className="text-xs text-neutral-600 block mb-1">Imposto Devido Anual</span>
                <div className="text-xl md:text-2xl font-mono font-bold text-black">
                  {formatCurrencyBRL(calculation.impostoDevidoCompleto)}
                </div>
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  Faixa máxima: {calculation.resultadoCompleto.faixaAplicada.nome} (
                  {(calculation.resultadoCompleto.faixaAplicada.aliquota * 100).toFixed(1)}%)
                </span>
              </div>

              {/* Indicador 3: Alíquota efetiva */}
              <div className="bg-white p-4 rounded-lg border border-neutral-200">
                <span className="text-xs text-neutral-600 block mb-1">Alíquota Efetiva Real</span>
                <div className="text-xl md:text-2xl font-mono font-bold text-black">
                  {calculation.aliquotaEfetiva.toFixed(2)}%
                </div>
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  Imposto devido sobre a renda total bruta anual
                </span>
              </div>

              {/* Indicador 4: Efeito da dedução por dependente no imposto */}
              <div className="bg-white p-4 rounded-lg border border-neutral-200">
                <span className="text-xs text-neutral-600 block mb-1">Efeito dos Dependentes</span>
                <div className="text-xl md:text-2xl font-mono font-bold text-black">
                  {calculation.dependentes > 0
                    ? `−${formatCurrencyBRL(calculation.reducaoTotalDependentes)}`
                    : 'R$ 0,00'}
                </div>
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  {calculation.dependentes > 0
                    ? `Economia de ${formatCurrencyBRL(calculation.reducaoPorDependente)} por cada dependente`
                    : 'Nenhum dependente informado'}
                </span>
              </div>
            </div>

            {/* COMPARATIVO RÁPIDO: COMPLETO VS SIMPLIFICADO */}
            <div className="p-4 bg-white rounded-lg border border-neutral-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs md:text-sm">
              <div className="space-y-0.5">
                <span className="font-semibold text-black flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-neutral-800" />
                  Modelo recomendado para sua declaração:{' '}
                  <span className="font-bold underline uppercase">
                    {calculation.modeloMaisVantajoso === 'completo'
                      ? 'Declaração Completa (Deduções Legais)'
                      : 'Declaração Simplificada (Desconto de 20%)'}
                  </span>
                </span>
                <p className="text-neutral-600">
                  {calculation.modeloMaisVantajoso === 'completo'
                    ? `Suas deduções legais (${formatCurrencyBRL(calculation.totalDeducoesCompleto)}) superam o desconto padrão simplificado (${formatCurrencyBRL(calculation.descontoSimplificado)}), gerando economia de ${formatCurrencyBRL(calculation.economiaModeloVantajoso)} no imposto devido.`
                    : `O desconto simplificado padrão de 20% (${formatCurrencyBRL(calculation.descontoSimplificado)}) é superior às suas deduções legais (${formatCurrencyBRL(calculation.totalDeducoesCompleto)}), gerando economia de ${formatCurrencyBRL(calculation.economiaModeloVantajoso)}.`}
                </p>
              </div>
              <div className="shrink-0 bg-neutral-100 p-2.5 rounded border border-neutral-200 text-center font-mono text-xs">
                <div>
                  Imposto no Simplificado:{' '}
                  {formatCurrencyBRL(calculation.impostoDevidoSimplificado)}
                </div>
                <div>
                  Imposto no Completo: {formatCurrencyBRL(calculation.impostoDevidoCompleto)}
                </div>
              </div>
            </div>
          </div>

          {/* 4. MEMÓRIA DE CÁLCULO ABERTA FAIXA POR FAIXA */}
          <div className="border border-neutral-200 rounded-lg p-5 bg-neutral-50">
            <div className="flex items-center gap-2 mb-3">
              <FileCheck2 className="h-4 w-4 text-neutral-800" />
              <h3 className="text-sm font-serif font-bold text-black uppercase tracking-wider">
                Memória de Cálculo Aberta Faixa por Faixa
              </h3>
            </div>
            <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
              Demonstração detalhada das deduções e da aplicação progressiva faixa a faixa da tabela
              anual da Receita Federal sobre a base de cálculo apurada, permitindo conferência
              manual:
            </p>

            {/* Abertura das Deduções */}
            <div className="font-mono text-xs md:text-sm bg-white border border-neutral-200 rounded p-4 space-y-2 text-neutral-800 mb-4">
              <div className="font-sans font-bold text-xs uppercase tracking-wider text-neutral-500 pb-1 border-b border-neutral-100">
                1. Apuração da Base de Cálculo
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">(+) Rendimentos tributáveis declarados:</span>
                <span className="font-semibold text-black">{formatCurrencyBRL(rendimentos)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">
                  (−) Dedução de dependentes ({dependentes} × R$ 2.275,08):
                </span>
                <span className="font-semibold text-black">
                  −{formatCurrencyBRL(calculation.deducaoDependentesTotal)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">
                  (−) Despesas de saúde (100% sem limite legal):
                </span>
                <span className="font-semibold text-black">
                  −{formatCurrencyBRL(calculation.saudeEfetivaDeducao)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">
                  (−) Despesas de instrução/educação
                  {calculation.educacaoGlosa > 0
                    ? ` (limitadas a ${formatCurrencyBRL(calculation.tetoEducacaoCalculado)})`
                    : ''}
                  :
                </span>
                <span className="font-semibold text-black">
                  −{formatCurrencyBRL(calculation.educacaoEfetivaDeducao)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">
                  (−) Previdência{' '}
                  {tipoPrevidencia === 'oficial' ? 'oficial (sem limite)' : 'privada PGBL'}
                  {tipoPrevidencia === 'privada' && calculation.previdenciaGlosa > 0
                    ? ` (limitada a 12%: ${formatCurrencyBRL(calculation.tetoPrevidenciaPrivada)})`
                    : ''}
                  :
                </span>
                <span className="font-semibold text-black">
                  −{formatCurrencyBRL(calculation.previdenciaEfetivaDeducao)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-neutral-100 font-bold bg-neutral-50 px-2 rounded">
                <span className="text-neutral-800">(=) Total de deduções aplicadas:</span>
                <span className="text-black">
                  {formatCurrencyBRL(calculation.totalDeducoesCompleto)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 font-bold bg-neutral-100 px-2 rounded">
                <span className="text-black">(=) Base de cálculo tributável:</span>
                <span className="text-black text-sm md:text-base">
                  {formatCurrencyBRL(calculation.baseCalculoCompleto)}
                </span>
              </div>
            </div>

            {/* Aplicação da Tabela Faixa a Faixa */}
            <div className="font-mono text-xs bg-white border border-neutral-200 rounded p-4 space-y-3 text-neutral-800 mb-4">
              <div className="font-sans font-bold text-xs uppercase tracking-wider text-neutral-500 pb-1 border-b border-neutral-100">
                2. Incidência Progressiva Faixa por Faixa da Tabela Anual
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-600 font-sans">
                      <th className="py-2 pr-2">Faixa</th>
                      <th className="py-2 px-2">Intervalo Legal</th>
                      <th className="py-2 px-2">Alíquota</th>
                      <th className="py-2 px-2">Base Tributada na Faixa</th>
                      <th className="py-2 pl-2 text-right">Imposto Apurado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {calculation.resultadoCompleto.detalheFaixas.map((df) => (
                      <tr key={df.faixa} className="hover:bg-neutral-50">
                        <td className="py-2 pr-2 font-semibold text-black">{df.nome}</td>
                        <td className="py-2 px-2 text-neutral-600">
                          {df.ate === Infinity
                            ? `Acima de ${formatCurrencyBRL(df.de)}`
                            : `${formatCurrencyBRL(df.de)} a ${formatCurrencyBRL(df.ate)}`}
                        </td>
                        <td className="py-2 px-2 font-semibold">
                          {(df.aliquota * 100).toFixed(1)}%
                        </td>
                        <td className="py-2 px-2">{formatCurrencyBRL(df.baseTributadaNaFaixa)}</td>
                        <td className="py-2 pl-2 text-right font-semibold text-black">
                          {formatCurrencyBRL(df.impostoFaixa)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-neutral-300 font-bold bg-neutral-50 text-black">
                      <td colSpan={4} className="py-2.5 px-2">
                        Total do Imposto Devido (Soma das faixas)
                      </td>
                      <td className="py-2.5 pl-2 text-right text-sm">
                        {formatCurrencyBRL(calculation.impostoDevidoCompleto)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="text-[11px] text-neutral-500 pt-1 font-sans">
                * Também pode ser auditado pela fórmula abreviada da RFB:{' '}
                <span className="font-mono">
                  Base ({formatCurrencyBRL(calculation.baseCalculoCompleto)}) × Alíquota (
                  {(calculation.resultadoCompleto.faixaAplicada.aliquota * 100).toFixed(1)}%) −
                  Parcela a Deduzir (
                  {formatCurrencyBRL(calculation.resultadoCompleto.faixaAplicada.parcelaADeduzir)})
                  = {formatCurrencyBRL(calculation.impostoDevidoCompleto)}
                </span>
                .
              </div>
            </div>

            {/* Fechamento do Saldo */}
            <div className="font-mono text-xs md:text-sm bg-white border border-neutral-200 rounded p-4 space-y-2 text-neutral-800">
              <div className="font-sans font-bold text-xs uppercase tracking-wider text-neutral-500 pb-1 border-b border-neutral-100">
                3. Comparação com o Imposto Retido e Fechamento do Saldo
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">
                  (+) Imposto de Renda Retido na Fonte (IRRF):
                </span>
                <span className="font-semibold text-black">
                  {formatCurrencyBRL(calculation.irrfRetido)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">(−) Imposto devido apurado na declaração:</span>
                <span className="font-semibold text-black">
                  −{formatCurrencyBRL(calculation.impostoDevidoCompleto)}
                </span>
              </div>
              <div
                className={`flex flex-col sm:flex-row sm:justify-between py-2 font-bold px-2 rounded ${
                  calculation.statusResultado === 'restituicao'
                    ? 'bg-[#FAB319]/25 text-black'
                    : calculation.statusResultado === 'pagar'
                      ? 'bg-neutral-100 text-black'
                      : 'bg-neutral-50 text-black'
                }`}
              >
                <span>
                  (=) Saldo apurado (
                  {calculation.statusResultado === 'restituicao'
                    ? 'Restituição a receber'
                    : calculation.statusResultado === 'pagar'
                      ? 'Imposto a pagar'
                      : 'Saldo zerado'}
                  ):
                </span>
                <span className="text-sm md:text-base">
                  {calculation.statusResultado === 'restituicao' &&
                    `+${formatCurrencyBRL(calculation.valorRestituicao)}`}
                  {calculation.statusResultado === 'pagar' &&
                    `−${formatCurrencyBRL(calculation.valorImpostoAPagar)}`}
                  {calculation.statusResultado === 'zerado' && formatCurrencyBRL(0)}
                </span>
              </div>
            </div>
          </div>

          {/* Captura de e-mail */}
          <CalculatorEmailCapture calculatorName="Calculadora IRPF e Restituição" />
        </section>

        {/* 6. TEXTO DE APROFUNDAMENTO EM HTML ESTÁTICO COM SUBTÍTULOS EXATOS NESSA ORDEM */}
        <article className="prose prose-neutral max-w-none mb-16 space-y-12">
          {/* Subtítulo 1: como funciona a tabela progressiva do IRPF */}
          <section aria-labelledby="como-funciona-a-tabela-progressiva-do-irpf">
            <h2
              id="como-funciona-a-tabela-progressiva-do-irpf"
              className="text-2xl md:text-3xl font-serif font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              como funciona a tabela progressiva do IRPF
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                A tabela progressiva do Imposto sobre a Renda da Pessoa Física (IRPF) é o
                instrumento tributário estruturado sob o princípio constitucional da capacidade
                contributiva. Seu funcionamento baseia-se na aplicação de alíquotas marginais
                crescentes conforme o volume de rendimentos do contribuinte avança pelas faixas
                estabelecidas na legislação.
              </p>
              <p>
                Isso significa que o imposto não incide uniformemente com a mesma alíquota sobre a
                totalidade dos rendimentos. A renda é fatiada em intervalos: o montante que se situa
                dentro da faixa de isenção permanece com alíquota zero; apenas a parcela que
                ultrapassa esse patamar é tributada à alíquota de 7,5%; o que excede a segunda faixa
                sofre incidência de 15%, e assim sucessivamente até o teto marginal de 27,5%.
              </p>
              <p>
                Abaixo está a <strong>Tabela Progressiva Anual do IRPF vigente</strong>{' '}
                (ano-calendário 2025 / exercício 2026), com suas cinco faixas, alíquotas nominais e
                parcelas a deduzir oficiais da Secretaria Especial da Receita Federal do Brasil:
              </p>

              {/* Tabela completa em HTML estático */}
              <div className="my-6 border border-neutral-300 rounded-lg overflow-x-auto bg-white shadow-sm">
                <table className="w-full text-left text-xs md:text-sm border-collapse">
                  <thead>
                    <tr className="bg-neutral-100 border-b border-neutral-300 text-neutral-900 font-serif">
                      <th className="p-3 border-r border-neutral-200 font-bold">Faixa</th>
                      <th className="p-3 border-r border-neutral-200 font-bold">
                        Base de Cálculo Anual (R$)
                      </th>
                      <th className="p-3 border-r border-neutral-200 font-bold bg-neutral-200/60">
                        Alíquota (%)
                      </th>
                      <th className="p-3 font-bold">Parcela a Deduzir do IRPF (R$)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 font-mono text-neutral-800">
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3 border-r border-neutral-200 font-sans font-medium">
                        1ª Faixa (Isenção)
                      </td>
                      <td className="p-3 border-r border-neutral-200">Até R$ 28.467,20</td>
                      <td className="p-3 border-r border-neutral-200 font-semibold bg-neutral-50">
                        Isento (0,0%)
                      </td>
                      <td className="p-3">R$ 0,00</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3 border-r border-neutral-200 font-sans font-medium">
                        2ª Faixa
                      </td>
                      <td className="p-3 border-r border-neutral-200">
                        De R$ 28.467,21 até R$ 33.919,80
                      </td>
                      <td className="p-3 border-r border-neutral-200 font-semibold bg-neutral-50">
                        7,5%
                      </td>
                      <td className="p-3">R$ 2.135,04</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3 border-r border-neutral-200 font-sans font-medium">
                        3ª Faixa
                      </td>
                      <td className="p-3 border-r border-neutral-200">
                        De R$ 33.919,81 até R$ 45.012,60
                      </td>
                      <td className="p-3 border-r border-neutral-200 font-semibold bg-neutral-50">
                        15,0%
                      </td>
                      <td className="p-3">R$ 4.679,03</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3 border-r border-neutral-200 font-sans font-medium">
                        4ª Faixa
                      </td>
                      <td className="p-3 border-r border-neutral-200">
                        De R$ 45.012,61 até R$ 55.976,16
                      </td>
                      <td className="p-3 border-r border-neutral-200 font-semibold bg-neutral-50">
                        22,5%
                      </td>
                      <td className="p-3">R$ 8.054,97</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3 border-r border-neutral-200 font-sans font-medium">
                        5ª Faixa
                      </td>
                      <td className="p-3 border-r border-neutral-200">Acima de R$ 55.976,16</td>
                      <td className="p-3 border-r border-neutral-200 font-semibold bg-neutral-50">
                        27,5%
                      </td>
                      <td className="p-3">R$ 10.853,78</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-neutral-600 leading-relaxed">
                A coluna da <strong>Parcela a Deduzir</strong> funciona como um atalho algébrico
                oficial: ao multiplicar a base tributável total pela alíquota nominal de sua faixa
                mais alta e subtrair a parcela a deduzir correspondente, obtém-se com exatidão o
                mesmo resultado aritmético da soma do imposto calculado faixa por faixa
                individualmente.
              </p>
            </div>
          </section>

          {/* Subtítulo 2: o que pode ser deduzido e o que não pode */}
          <section aria-labelledby="o-que-pode-ser-deduzido-e-o-que-nao-pode">
            <h2
              id="o-que-pode-ser-deduzido-e-o-que-nao-pode"
              className="text-2xl md:text-3xl font-serif font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              o que pode ser deduzido e o que não pode
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                No modelo de Declaração por Deduções Legais (Modelo Completo), a legislação autoriza
                o abatimento de despesas indispensáveis ocorridas no ano-calendário, reduzindo
                diretamente a base de cálculo tributável. No entanto, a Receita Federal estabelece
                regras estritas de comprovação documental e tetos máximos para determinadas
                naturezas de dispêndio.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                {/* O que PODE ser deduzido */}
                <div className="border border-neutral-300 bg-white rounded-lg p-5">
                  <h3 className="font-serif font-bold text-lg text-black mb-3 pb-2 border-b border-neutral-200">
                    O que PODE ser deduzido
                  </h3>
                  <ul className="space-y-2.5 text-sm text-neutral-700 list-disc pl-5">
                    <li>
                      <strong>Despesas médicas e odontológicas:</strong> pagamentos a médicos,
                      dentistas, psicólogos, fisioterapeutas, fonoaudiólogos, terapeutas
                      ocupacionais, hospitais e exames laboratoriais.{' '}
                      <em>Sem limite legal de valor.</em>
                    </li>
                    <li>
                      <strong>Dependentes legais:</strong> dedução fixa anual de{' '}
                      <strong>R$ 2.275,08 por dependente</strong> qualificado perante a lei (filhos
                      até 21 anos, até 24 se universitários ou técnicos, cônjuges ou companheiros).
                    </li>
                    <li>
                      <strong>Despesas com instrução:</strong> educação infantil (creches e
                      pré-escolas), ensino fundamental, médio, técnico e graduação/pós-graduação do
                      titular e dependentes, limitada ao{' '}
                      <strong>teto de R$ 3.561,50 por pessoa ao ano</strong>.
                    </li>
                    <li>
                      <strong>Previdência oficial (INSS):</strong> contribuições previdenciárias
                      descontadas em folha ou recolhidas como autônomo, dedutíveis integralmente sem
                      teto.
                    </li>
                    <li>
                      <strong>Previdência privada PGBL:</strong> aportes efetuados em planos na
                      modalidade PGBL (ou FAPI), dedutíveis até o{' '}
                      <strong>limite de 12% dos rendimentos tributáveis</strong>.
                    </li>
                    <li>
                      <strong>Pensão alimentícia judicial:</strong> valores pagos em cumprimento de
                      decisão judicial ou escritura pública de divórcio consensual (100% dedutível
                      para o alimentante).
                    </li>
                    <li>
                      <strong>Livro-caixa do profissional autônomo:</strong> despesas de custeio
                      necessárias à percepção da receita profissional (aluguel de consultório, água,
                      luz, insumos de trabalho).
                    </li>
                  </ul>
                </div>

                {/* O que NÃO PODE ser deduzido */}
                <div className="border border-neutral-300 bg-white rounded-lg p-5">
                  <h3 className="font-serif font-bold text-lg text-black mb-3 pb-2 border-b border-neutral-200">
                    O que NÃO PODE ser deduzido
                  </h3>
                  <ul className="space-y-2.5 text-sm text-neutral-700 list-disc pl-5">
                    <li>
                      <strong>Cursos livres, idiomas e preparatórios:</strong> despesas com cursos
                      de inglês, reforço escolar, cursinhos pré-vestibulares ou preparatórios para
                      concursos públicos.
                    </li>
                    <li>
                      <strong>Material escolar e uniformes:</strong> aquisição de livros didáticos,
                      computadores, tablets, cadernos, transporte escolar ou vestuário.
                    </li>
                    <li>
                      <strong>Medicamentos e vacinas comprados em farmácias:</strong> remédios de
                      uso contínuo comprados em balcão, ainda que acompanhados de receita médica (só
                      são dedutíveis se integrarem a fatura hospitalar).
                    </li>
                    <li>
                      <strong>Previdência privada VGBL:</strong> a modalidade Vida Gerador de
                      Benefício Livre é classificada como seguro de pessoa e não admite abatimento
                      na base de cálculo.
                    </li>
                    <li>
                      <strong>Óculos, lentes de contato e aparelhos auditivos:</strong> despesas com
                      armações, lentes e aparelhos sem nota integrada a procedimento
                      cirúrgico/médico específico.
                    </li>
                    <li>
                      <strong>Aluguel residencial pago:</strong> locação de moradia própria não é
                      despesa dedutível (ao contrário do aluguel de consultório do profissional
                      autônomo no livro-caixa).
                    </li>
                    <li>
                      <strong>Pensão alimentícia informal:</strong> quantias repassadas a filhos ou
                      ex-cônjuge por acordo meramente verbal, sem homologação perante o Poder
                      Judiciário ou cartório.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Subtítulo 3: modelo simplificado contra completo, e quais os limites de cada um */}
          <section aria-labelledby="modelo-simplificado-contra-completo">
            <h2
              id="modelo-simplificado-contra-completo"
              className="text-2xl md:text-3xl font-serif font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              modelo simplificado contra completo, e quais os limites de cada um
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                Ao preencher a Declaração de Ajuste Anual, o contribuinte pode optar livremente pelo
                formato de apuração que lhe resulte em menor imposto a pagar ou em maior restituição
                a receber: a <strong>Declaração por Opção pelo Desconto Simplificado</strong> ou a{' '}
                <strong>Declaração por Deduções Legais (Modelo Completo)</strong>.
              </p>
              <p>
                As distinções operacionais e os limites financeiros de cada modalidade são
                detalhados a seguir:
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="p-5 border border-neutral-200 bg-neutral-50 rounded-lg">
                  <div className="inline-block bg-neutral-900 text-white text-xs font-mono uppercase px-2.5 py-0.5 rounded mb-2">
                    Modelo Simplificado
                  </div>
                  <h3 className="font-serif font-bold text-lg text-black mb-2">
                    Desconto Padrão de 20%
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-3">
                    Substitui todas as deduções legais permitidas por um desconto padrão fixado em{' '}
                    <strong>20% sobre a soma dos rendimentos tributáveis</strong>, independentemente
                    de qualquer comprovação documental de despesas médicas ou educacionais.
                  </p>
                  <div className="bg-white p-3 rounded border border-neutral-200 text-xs font-mono text-neutral-800 space-y-1">
                    <div>
                      <strong>Teto legal do desconto:</strong> R$ 16.754,34
                    </div>
                    <div>
                      <strong>Comprovação exigida:</strong> Nenhuma despesa precisa de recibo.
                    </div>
                    <div>
                      <strong>Indicação:</strong> Contribuintes sem dependentes e com baixos gastos
                      com saúde e instrução.
                    </div>
                  </div>
                </div>

                <div className="p-5 border border-neutral-200 bg-neutral-50 rounded-lg">
                  <div className="inline-block bg-neutral-900 text-white text-xs font-mono uppercase px-2.5 py-0.5 rounded mb-2">
                    Modelo Completo
                  </div>
                  <h3 className="font-serif font-bold text-lg text-black mb-2">
                    Deduções Legais Comprovadas
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-3">
                    Aplica integralmente todas as deduções admitidas pela legislação (dependentes,
                    despesas médicas, instrução, previdência oficial e PGBL), exigindo guarda dos
                    comprovantes fiscais pelo prazo decadencial de cinco anos.
                  </p>
                  <div className="bg-white p-3 rounded border border-neutral-200 text-xs font-mono text-neutral-800 space-y-1">
                    <div>
                      <strong>Teto de deduções:</strong> Sem teto global (saúde é ilimitada).
                    </div>
                    <div>
                      <strong>Comprovação exigida:</strong> Recibos com CPF/CNPJ de todos os
                      prestadores.
                    </div>
                    <div>
                      <strong>Indicação:</strong> Quem tem dependentes ou gastou mais de R$
                      16.754,34 em deduções no ano.
                    </div>
                  </div>
                </div>
              </div>

              <p>
                <strong>Regra de ouro comparativa:</strong> se a soma das suas deduções legais
                comprovadas for <em>maior</em> do que 20% dos seus rendimentos tributáveis (ou
                superar o teto de R$ 16.754,34), o <strong>Modelo Completo</strong> será mais
                vantajoso. Caso a soma das suas despesas seja <em>menor</em> do que esse teto de
                20%, o <strong>Modelo Simplificado</strong> garantirá o menor valor de imposto ou a
                maior restituição.
              </p>
            </div>
          </section>

          {/* Subtítulo 4: quem é obrigado a entregar a declaração */}
          <section aria-labelledby="quem-e-obrigado-a-entregar-a-declaracao">
            <h2
              id="quem-e-obrigado-a-entregar-a-declaracao"
              className="text-2xl md:text-3xl font-serif font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              quem é obrigado a entregar a declaração
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                A entrega da Declaração de Ajuste Anual do IRPF é obrigatória para todo cidadão
                residente no Brasil que se enquadre em pelo menos um dos critérios estabelecidos
                pela Receita Federal do Brasil para o exercício fiscal correspondente.
              </p>
              <p>
                Para o ano-base recente, são obrigadas a apresentar a declaração as pessoas físicas
                que, no decorrer do ano-calendário:
              </p>

              <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-bold text-black shrink-0 mt-0.5">
                    01
                  </span>
                  <p className="text-sm text-neutral-800">
                    <strong>Rendimentos tributáveis:</strong> receberam rendimentos tributáveis
                    (salários, aposentadoria, pró-labore, aluguéis) cuja soma anual superou{' '}
                    <strong>R$ 30.639,90</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-bold text-black shrink-0 mt-0.5">
                    02
                  </span>
                  <p className="text-sm text-neutral-800">
                    <strong>Rendimentos isentos e não tributáveis:</strong> receberam rendimentos
                    isentos, não tributáveis ou tributados exclusivamente na fonte (indenizações
                    trabalhistas, rendimento de poupança, herança, lucros e dividendos distribuídos)
                    acima de <strong>R$ 200.000,00</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-bold text-black shrink-0 mt-0.5">
                    03
                  </span>
                  <p className="text-sm text-neutral-800">
                    <strong>Ganho de capital e operações em bolsa:</strong> obtiveram ganho de
                    capital na alienação de bens ou direitos sujeito à incidência do imposto, ou
                    realizaram operações em bolsas de valores, de mercadorias e de futuros cuja soma
                    anual de vendas superou <strong>R$ 40.000,00</strong> ou com apuração de ganhos
                    líquidos sujeitos a tributação.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-bold text-black shrink-0 mt-0.5">
                    04
                  </span>
                  <p className="text-sm text-neutral-800">
                    <strong>Atividade rural:</strong> obtiveram receita bruta em atividade rural
                    superior a <strong>R$ 153.199,50</strong> ou pretendem compensar prejuízos de
                    anos anteriores ou do próprio ano-calendário.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-bold text-black shrink-0 mt-0.5">
                    05
                  </span>
                  <p className="text-sm text-neutral-800">
                    <strong>Bens e direitos patrimoniais:</strong> tiveram a posse ou a propriedade
                    de bens ou direitos (imóveis, veículos, contas bancárias, aplicações
                    financeiras) de valor total superior a <strong>R$ 800.000,00</strong> em 31 de
                    dezembro.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-bold text-black shrink-0 mt-0.5">
                    06
                  </span>
                  <p className="text-sm text-neutral-800">
                    <strong>Condição de residente no Brasil:</strong> passaram à condição de
                    residente no Brasil em qualquer mês do ano-calendário e encontravam-se nessa
                    condição em 31 de dezembro.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Subtítulo 5: erros comuns na declaração (com pelo menos quatro exemplos práticos e consequências) */}
          <section aria-labelledby="erros-comuns-na-declaracao">
            <h2
              id="erros-comuns-na-declaracao"
              className="text-2xl md:text-3xl font-serif font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              erros comuns na declaração
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                Erros e inconsistências no preenchimento do Imposto de Renda são as principais
                causas de retenção na temida malha fina fiscal da Receita Federal, gerando atraso na
                liberação da restituição, perda do desconto legal e imposição de pesadas multas
                tributárias.
              </p>
              <p>
                Apresentamos quatro dos erros práticos mais recorrentes e a consequência direta de
                cada um perante o Fisco federal:
              </p>

              <div className="space-y-4 my-6">
                {/* Erro 1 */}
                <div className="border border-neutral-200 rounded-lg p-5 bg-white shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-semibold text-neutral-800">
                      Erro 01
                    </span>
                    <h3 className="font-serif font-bold text-base text-black">
                      Omitir rendimentos auferidos pelos dependentes incluídos na declaração
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-2">
                    O contribuinte inclui o filho como dependente para aproveitar a dedução de R$
                    2.275,08 e as despesas de instrução, mas omite a bolsa de estágio remunerada ou
                    o salário de jovem aprendiz auferido pelo dependente ao longo do ano.
                  </p>
                  <p className="text-xs text-neutral-700 bg-neutral-50 p-2.5 rounded border border-neutral-200">
                    <strong>Consequência imediata:</strong> Retenção imediata na malha fina por
                    cruzamento com a DIRF/eSocial da empresa pagadora do dependente. A RFB recalcula
                    o imposto somando as duas rendas, reduzindo a restituição esperada ou gerando
                    DARF com juros Selic e multa de mora de 0,33% ao dia.
                  </p>
                </div>

                {/* Erro 2 */}
                <div className="border border-neutral-200 rounded-lg p-5 bg-white shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-semibold text-neutral-800">
                      Erro 02
                    </span>
                    <h3 className="font-serif font-bold text-base text-black">
                      Lançar despesas médicas sem recibo idôneo ou com divergência na DMED
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-2">
                    Declarar pagamentos a profissionais de saúde e clínicas sem guardar recibos com
                    identificação formal (CPF/CRM do médico) ou declarar valores diferentes daqueles
                    que o consultório informou à Receita Federal através da Declaração de Serviços
                    Médicos (DMED).
                  </p>
                  <p className="text-xs text-neutral-700 bg-neutral-50 p-2.5 rounded border border-neutral-200">
                    <strong>Consequência imediata:</strong> Intimação formal pela Receita Federal
                    para apresentar toda a documentação comprobatória. Caso o contribuinte não
                    comprove o gasto, a dedução é sumariamente glosada e aplicada{' '}
                    <strong>multa de ofício de 75%</strong> sobre o imposto que deixou de ser pago.
                  </p>
                </div>

                {/* Erro 3 */}
                <div className="border border-neutral-200 rounded-lg p-5 bg-white shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-semibold text-neutral-800">
                      Erro 03
                    </span>
                    <h3 className="font-serif font-bold text-base text-black">
                      Classificar plano VGBL como PGBL para tentar deduzir na base de cálculo
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-2">
                    Aportar recursos em plano de previdência privada VGBL e declará-lo indevidamente
                    na ficha de "Pagamentos Efetuados" sob o código de PGBL para abater até 12% da
                    base de cálculo.
                  </p>
                  <p className="text-xs text-neutral-700 bg-neutral-50 p-2.5 rounded border border-neutral-200">
                    <strong>Consequência imediata:</strong> Glosa automática pelo cruzamento de
                    dados com a e-Financeira enviada pela seguradora ou banco. O contribuinte perde
                    a dedução indevida, o saldo de restituição diminui e incide cobrança suplementar
                    de imposto com juros moratórios.
                  </p>
                </div>

                {/* Erro 4 */}
                <div className="border border-neutral-200 rounded-lg p-5 bg-white shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-semibold text-neutral-800">
                      Erro 04
                    </span>
                    <h3 className="font-serif font-bold text-base text-black">
                      Perder o prazo de transmissão da declaração anual de ajuste
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-2">
                    Deixar de transmitir a declaração até as 23h59min do último dia útil do prazo
                    oficial estabelecido anualmente pela Secretaria da Receita Federal (geralmente
                    fim de maio).
                  </p>
                  <p className="text-xs text-neutral-700 bg-neutral-50 p-2.5 rounded border border-neutral-200">
                    <strong>Consequência imediata:</strong> Imposição automática de{' '}
                    <strong>multa por atraso na entrega (MAED)</strong> de no mínimo R$ 165,74 e até
                    20% do imposto devido, além de bloqueio e situação cadastral "Pendente de
                    Regularização" no CPF, impedindo empréstimos e emissão de passaporte.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </article>

        {/* 7. BLOCO DE VIGÊNCIA VISÍVEL CITANDO A BASE LEGAL */}
        <section
          aria-labelledby="vigencia-title"
          className="border border-neutral-200 bg-white rounded-xl p-6 mb-8 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <Scale className="h-5 w-5 text-neutral-800 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 id="vigencia-title" className="font-serif font-bold text-base text-black">
                  Vigência Normativa e Base Legal Aplicada
                </h3>
                <span className="text-[11px] font-mono bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded border border-neutral-300 font-semibold">
                  ano-calendário 2025 / exercício 2026
                </span>
                <span className="text-xs font-mono bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded border border-neutral-300">
                  Parâmetros conferidos em fevereiro/2026
                </span>
              </div>
              <p className="text-sm text-neutral-700 leading-relaxed">
                As deduções legais parametrizadas nesta ferramenta fundamentam-se no{' '}
                <strong>artigo 8º da Lei nº 9.250, de 26 de dezembro de 1995</strong> (com a redação
                dada pela Lei nº 11.482/2007 e alterações posteriores). A tributação progressiva
                segue a{' '}
                <strong>Tabela Progressiva Anual da Receita Federal do Brasil vigente</strong>{' '}
                (ano-calendário 2025 / exercício 2026), com faixa de isenção anual de R$ 28.467,20,
                dedução anual por dependente fixada em R$ 2.275,08, teto anual individual de
                despesas de instrução de R$ 3.561,50 e limite de 20% (até R$ 16.754,34) para a opção
                pelo desconto simplificado.
              </p>
            </div>
          </div>
        </section>

        {/* 8. AVISO LEGAL DE ESTIMATIVA COM LINK PARA /contato */}
        <section
          aria-labelledby="aviso-legal-title"
          className="border border-neutral-200 bg-neutral-50 rounded-xl p-6 mb-12"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-neutral-700 shrink-0 mt-0.5" />
            <div>
              <h3 id="aviso-legal-title" className="font-serif font-bold text-base text-black mb-1">
                Aviso de Estimativa e Conformidade Técnica
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                O resultado gerado por esta ferramenta é uma estimativa matemática orientativa e não
                substitui a auditoria fiscal detalhada e o parecer técnico de um contador habilitado
                perante o Conselho Regional de Contabilidade. Para estruturação de planejamento
                tributário para pessoa física ou regularização de declarações em malha fina, acesse
                a nossa página de{' '}
                <Link
                  to="/contato"
                  className="font-semibold text-black underline underline-offset-2 hover:text-neutral-700 transition-colors"
                >
                  contato
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* 9. FAQ COM CINCO PERGUNTAS EM HTML ESTÁTICO */}
        <section aria-labelledby="faq-irpf-title" className="mb-14">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 border border-neutral-300 bg-neutral-100 px-3 py-1 rounded text-xs font-mono uppercase tracking-wider text-neutral-800 mb-2">
              <HelpCircle className="h-3.5 w-3.5 text-black" />
              Perguntas Frequentes
            </div>
            <h2
              id="faq-irpf-title"
              className="text-2xl md:text-3xl font-serif font-bold text-black"
            >
              Dúvidas Técnicas sobre IRPF e Restituição
            </h2>
          </div>

          <div className="border border-neutral-200 bg-white rounded-xl p-6 md:p-8 shadow-sm">
            <Accordion type="single" collapsible className="w-full space-y-4">
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

        {/* 10. BLOCO DE CALCULADORAS RELACIONADAS COM TRÊS LINKS EXATOS */}
        <section aria-labelledby="calculadoras-relacionadas-title" className="mb-14">
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-1">
              Ferramentas Complementares
            </span>
            <h2
              id="calculadoras-relacionadas-title"
              className="text-xl md:text-2xl font-serif font-bold text-black"
            >
              Calculadoras Relacionadas
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {/* Link 1: Pró-labore ou Dividendos */}
            <Link
              to="/calculadoras/pro-labore-ou-dividendos"
              className="group border border-neutral-200 bg-white hover:border-neutral-400 p-5 rounded-xl transition-all duration-200 flex flex-col justify-between shadow-sm"
            >
              <div>
                <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                  Folha e Trabalhista
                </span>
                <h3 className="font-serif font-bold text-base text-black mb-2 group-hover:underline">
                  Pró-labore ou Dividendos
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Avaliação de incidência de INSS, IRPF e distribuição isenta de lucros apurados
                  pelos sócios.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center text-xs font-medium text-black">
                Acessar simulador{' '}
                <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Link 2: Juros de Mora de Tributos */}
            <Link
              to="/calculadoras/juros-de-mora-de-tributos"
              className="group border border-neutral-200 bg-white hover:border-neutral-400 p-5 rounded-xl transition-all duration-200 flex flex-col justify-between shadow-sm"
            >
              <div>
                <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                  Finanças e Tributos
                </span>
                <h3 className="font-serif font-bold text-base text-black mb-2 group-hover:underline">
                  Juros de Mora de Tributos
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Cálculo em tempo real de juros pela Selic e multa de 0,33% ao dia para tributos em
                  atraso.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center text-xs font-medium text-black">
                Acessar simulador{' '}
                <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Link 3: PJ ou CLT */}
            <Link
              to="/calculadoras/pj-ou-clt"
              className="group border border-neutral-200 bg-white hover:border-neutral-400 p-5 rounded-xl transition-all duration-200 flex flex-col justify-between shadow-sm"
            >
              <div>
                <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                  Folha e Trabalhista
                </span>
                <h3 className="font-serif font-bold text-base text-black mb-2 group-hover:underline">
                  PJ ou CLT
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Comparativo em tempo real do custo para a empresa e valor líquido na mão do
                  profissional.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center text-xs font-medium text-black">
                Acessar simulador{' '}
                <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </section>

        {/* 10b. BLOCO FINAL PADRÃO DE CHAMADA PARA CONTATO COM O ESCRITÓRIO */}
        <section
          aria-labelledby="cta-final-title"
          className="bg-neutral-950 text-white rounded-2xl p-8 md:p-12 text-center"
        >
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="inline-block border border-neutral-800 px-3 py-1 rounded text-xs uppercase tracking-wider text-neutral-400 font-mono">
              PERES PERES Consultoria e Contabilidade
            </div>

            <h2
              id="cta-final-title"
              className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight"
            >
              Precisa de auxílio contábil para sua Declaração de IRPF?
            </h2>

            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
              Nossa equipe estrutura auditoria completa de documentos, simulação dos modelos
              completo e simplificado, e acompanhamento contra retenções em malha fina.
            </p>

            {/* Ponto focal: Botão em #FAB319 com texto preto */}
            <div className="pt-3 flex justify-center">
              <Button
                asChild
                size="lg"
                className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-base h-12 px-8 shadow-sm"
              >
                <Link to="/contato">Agendar Análise com a Equipe Técnica</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
