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
  Layers,
  TrendingDown,
  Building2,
  Receipt,
  Percent,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

// Tipos de atividade
type ActivityType = 'comercio' | 'industria' | 'servico'

// Formatador monetário BRL
function formatCurrencyBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// Converte texto digitado para número
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

// Tabelas dos Anexos do Simples Nacional (LC 123/2006)
// Anexo I - Comércio
const ANEXO_I_FAIXAS = [
  { limite: 180000, aliqNominal: 0.04, deducao: 0 },
  { limite: 360000, aliqNominal: 0.073, deducao: 5940 },
  { limite: 720000, aliqNominal: 0.095, deducao: 13860 },
  { limite: 1800000, aliqNominal: 0.107, deducao: 22500 },
  { limite: 3600000, aliqNominal: 0.143, deducao: 87300 },
  { limite: 4800000, aliqNominal: 0.19, deducao: 378000 },
]

// Anexo II - Indústria
const ANEXO_II_FAIXAS = [
  { limite: 180000, aliqNominal: 0.045, deducao: 0 },
  { limite: 360000, aliqNominal: 0.078, deducao: 5940 },
  { limite: 720000, aliqNominal: 0.1, deducao: 13860 },
  { limite: 1800000, aliqNominal: 0.112, deducao: 22500 },
  { limite: 3600000, aliqNominal: 0.147, deducao: 85500 },
  { limite: 4800000, aliqNominal: 0.3, deducao: 720000 },
]

// Anexo III - Serviços (com Fator R >= 28% ou atividades vinculadas diretamente ao Anexo III)
const ANEXO_III_FAIXAS = [
  { limite: 180000, aliqNominal: 0.06, deducao: 0 },
  { limite: 360000, aliqNominal: 0.112, deducao: 9360 },
  { limite: 720000, aliqNominal: 0.135, deducao: 17640 },
  { limite: 1800000, aliqNominal: 0.16, deducao: 35640 },
  { limite: 3600000, aliqNominal: 0.21, deducao: 125640 },
  { limite: 4800000, aliqNominal: 0.33, deducao: 648000 },
]

// Anexo V - Serviços (com Fator R < 28%)
const ANEXO_V_FAIXAS = [
  { limite: 180000, aliqNominal: 0.155, deducao: 0 },
  { limite: 360000, aliqNominal: 0.18, deducao: 4500 },
  { limite: 720000, aliqNominal: 0.195, deducao: 9900 },
  { limite: 1800000, aliqNominal: 0.205, deducao: 17100 },
  { limite: 3600000, aliqNominal: 0.23, deducao: 62100 },
  { limite: 4800000, aliqNominal: 0.305, deducao: 540000 },
]

export default function SimplesNacionalOuLucroPresumidoCalculator() {
  // Entradas do formulário com valores padrão realistas
  const [faturamentoMensal, setFaturamentoMensal] = useState<number>(50000)
  const [faturamentoInput, setFaturamentoInput] = useState<string>('50.000,00')

  const [atividade, setAtividade] = useState<ActivityType>('servico')

  const [folhaMensal, setFolhaMensal] = useState<number>(15000)
  const [folhaInput, setFolhaInput] = useState<string>('15.000,00')

  const [margemLucro, setMargemLucro] = useState<number>(25)
  const [margemLucroInput, setMargemLucroInput] = useState<string>('25')

  const [aliqISS, setAliqISS] = useState<number>(3) // Percentual entre 2 e 5%
  const [aliqISSInput, setAliqISSInput] = useState<string>('3')

  const [aliqICMS, setAliqICMS] = useState<number>(18) // ICMS estadual médio padrão para comércio/indústria
  const [aliqICMSInput, setAliqICMSInput] = useState<string>('18')

  // SEO: Título da aba <= 60 caracteres e meta description <= 155 caracteres
  useEffect(() => {
    const pageTitle = 'Simples ou Lucro Presumido: qual paga menos | PERES' // 51 caracteres
    const pageDesc =
      'Compare a carga tributária do Simples Nacional e do Lucro Presumido em tempo real. Veja alíquotas efetivas, memória de cálculo e economia anual.' // 145 caracteres

    document.title = pageTitle

    let metaDescTag = document.querySelector('meta[name="description"]')
    if (!metaDescTag) {
      metaDescTag = document.createElement('meta')
      metaDescTag.setAttribute('name', 'description')
      document.head.appendChild(metaDescTag)
    }
    metaDescTag.setAttribute('content', pageDesc)
  }, [])

  // Handlers para inputs
  const handleFaturamentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseRawToNumber(e.target.value)
    setFaturamentoMensal(num)
    setFaturamentoInput(formatRawInput(num))
  }

  const handleFolhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseRawToNumber(e.target.value)
    setFolhaMensal(num)
    setFolhaInput(formatRawInput(num))
  }

  const handleMargemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value.replace(/[^0-9.]/g, ''))
    if (!isNaN(val) && val >= 0 && val <= 100) {
      setMargemLucro(val)
      setMargemLucroInput(e.target.value)
    }
  }

  const handleISSChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value.replace(/[^0-9.]/g, ''))
    if (!isNaN(val) && val >= 0 && val <= 5) {
      setAliqISS(val)
      setAliqISSInput(e.target.value)
    }
  }

  const handleICMSChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value.replace(/[^0-9.]/g, ''))
    if (!isNaN(val) && val >= 0 && val <= 35) {
      setAliqICMS(val)
      setAliqICMSInput(e.target.value)
    }
  }

  // Cálculos completos em tempo real
  const calculation = useMemo(() => {
    const rbt12 = faturamentoMensal * 12
    const fs12 = folhaMensal * 12
    const hasReceita = faturamentoMensal > 0

    // 1. CÁLCULO SIMPLES NACIONAL
    let anexoNome = 'Anexo III'
    let faixas = ANEXO_III_FAIXAS
    let fatorR = 0
    let fatorRPercent = 0
    let isAnexoIIIviaFatorR = false

    if (atividade === 'comercio') {
      anexoNome = 'Anexo I'
      faixas = ANEXO_I_FAIXAS
    } else if (atividade === 'industria') {
      anexoNome = 'Anexo II'
      faixas = ANEXO_II_FAIXAS
    } else {
      // Serviço: aplica lógica do Fator R (FS12 / RBT12)
      fatorR = rbt12 > 0 ? fs12 / rbt12 : 0
      fatorRPercent = fatorR * 100
      isAnexoIIIviaFatorR = fatorR >= 0.28
      if (isAnexoIIIviaFatorR) {
        anexoNome = 'Anexo III (Fator R ≥ 28%)'
        faixas = ANEXO_III_FAIXAS
      } else {
        anexoNome = 'Anexo V (Fator R < 28%)'
        faixas = ANEXO_V_FAIXAS
      }
    }

    // Localizar a faixa no Simples Nacional
    let faixaSelecionada = faixas[0]
    let faixaIndice = 1
    for (let i = 0; i < faixas.length; i++) {
      if (rbt12 <= faixas[i].limite) {
        faixaSelecionada = faixas[i]
        faixaIndice = i + 1
        break
      }
      if (i === faixas.length - 1) {
        faixaSelecionada = faixas[i]
        faixaIndice = i + 1
      }
    }

    const aliqNominalSN = faixaSelecionada.aliqNominal
    const parcelaDeducaoSN = faixaSelecionada.deducao

    // Alíquota efetiva = (RBT12 × Alíquota Nominal − Parcela a Deduzir) ÷ RBT12
    let aliqEfetivaSN = 0
    if (rbt12 > 0) {
      aliqEfetivaSN = (rbt12 * aliqNominalSN - parcelaDeducaoSN) / rbt12
      if (aliqEfetivaSN < 0) aliqEfetivaSN = 0
    }

    const simplesNacionalMensal = faturamentoMensal * aliqEfetivaSN
    const simplesNacionalAnual = simplesNacionalMensal * 12
    const cargaSNPercent = hasReceita ? (simplesNacionalMensal / faturamentoMensal) * 100 : 0
    const ultrapassaTetoSN = rbt12 > 4800000

    // 2. CÁLCULO LUCRO PRESUMIDO
    // Presunções da Lei 9.249/1995:
    // Comércio e Indústria: 8% IRPJ, 12% CSLL
    // Serviço: 32% IRPJ, 32% CSLL
    let presuncaoIRPJRate = 0.32
    let presuncaoCSLLRate = 0.32

    if (atividade === 'comercio' || atividade === 'industria') {
      presuncaoIRPJRate = 0.08
      presuncaoCSLLRate = 0.12
    }

    // Base de cálculo presumida mensal
    const baseIRPJMensal = faturamentoMensal * presuncaoIRPJRate
    const baseCSLLMensal = faturamentoMensal * presuncaoCSLLRate

    // IRPJ: 15% sobre a base + adicional de 10% sobre o que exceder R$ 20.000,00 no mês
    const irpjBasico = baseIRPJMensal * 0.15
    const excedente20k = Math.max(0, baseIRPJMensal - 20000)
    const irpjAdicional = excedente20k * 0.1
    const totalIRPJ = irpjBasico + irpjAdicional

    // CSLL: 9% sobre a base presumida
    const totalCSLL = baseCSLLMensal * 0.09

    // PIS e COFINS cumulativos (Leis 10.637/2002 e 10.833/2003):
    // PIS: 0,65% sobre faturamento
    // COFINS: 3,00% sobre faturamento
    const totalPIS = faturamentoMensal * 0.0065
    const totalCOFINS = faturamentoMensal * 0.03

    // Imposto local: ISS para serviço ou ICMS presumido para comércio/indústria
    let tributoLocalNome = 'ISS'
    let tributoLocalRate = aliqISS / 100
    let totalTributoLocal = 0

    if (atividade === 'servico') {
      tributoLocalNome = 'ISS'
      tributoLocalRate = aliqISS / 100
      totalTributoLocal = faturamentoMensal * tributoLocalRate
    } else {
      tributoLocalNome = 'ICMS'
      // No Lucro Presumido, o ICMS é não-cumulativo (débito - crédito).
      // Em estimativas contábeis padrão, o valor líquido estimado sobre o faturamento
      // costuma corresponder à margem aplicada sobre a alíquota ou valor efetivo direto.
      // Aqui usamos a taxa informada com o abatimento implícito de insumos/custo mercadoria (margem):
      // Valor agregado = Faturamento × (Margem / 100), ICMS estimado = Valor agregado × (aliqICMS / 100)
      const icmsEfetivoEstimado = (aliqICMS / 100) * (margemLucro / 100)
      tributoLocalRate = icmsEfetivoEstimado
      totalTributoLocal = faturamentoMensal * icmsEfetivoEstimado
    }

    // Encargo patronal no Lucro Presumido (INSS Patronal 20% + RAT/Terceiros aprox 5,8% = 25,8% a 28%)
    // No Simples Nacional dos Anexos I, II e III, a CPP está inclusa no DAS. No Presumido ela incide sobre a folha.
    const inssPatronalFolhaPresumido = folhaMensal * 0.2 // INSS patronal base de 20%

    // Total Lucro Presumido mensal e anual (tributos sobre a receita + encargos)
    const totalTributosPresumidoMensal =
      totalIRPJ + totalCSLL + totalPIS + totalCOFINS + totalTributoLocal
    const totalPresumidoComFolhaMensal = totalTributosPresumidoMensal + inssPatronalFolhaPresumido
    const totalPresumidoMensal = totalTributosPresumidoMensal
    const totalPresumidoAnual = totalPresumidoMensal * 12

    const cargaPresumidoPercent = hasReceita ? (totalPresumidoMensal / faturamentoMensal) * 100 : 0

    // 3. COMPARAÇÃO E ECONOMIA
    const diferencaMensal = Math.abs(simplesNacionalMensal - totalPresumidoMensal)
    const diferencaAnual = diferencaMensal * 12

    let regimeVencedor: 'simples' | 'presumido' | 'empate' = 'empate'
    if (simplesNacionalMensal < totalPresumidoMensal) {
      regimeVencedor = 'simples'
    } else if (totalPresumidoMensal < simplesNacionalMensal) {
      regimeVencedor = 'presumido'
    }

    return {
      hasReceita,
      rbt12,
      fs12,
      fatorR,
      fatorRPercent,
      isAnexoIIIviaFatorR,
      anexoNome,
      faixaIndice,
      aliqNominalSN,
      parcelaDeducaoSN,
      aliqEfetivaSN,
      simplesNacionalMensal,
      simplesNacionalAnual,
      cargaSNPercent,
      ultrapassaTetoSN,
      presuncaoIRPJRate,
      presuncaoCSLLRate,
      baseIRPJMensal,
      baseCSLLMensal,
      irpjBasico,
      excedente20k,
      irpjAdicional,
      totalIRPJ,
      totalCSLL,
      totalPIS,
      totalCOFINS,
      tributoLocalNome,
      tributoLocalRate,
      totalTributoLocal,
      inssPatronalFolhaPresumido,
      totalPresumidoMensal,
      totalPresumidoAnual,
      totalPresumidoComFolhaMensal,
      cargaPresumidoPercent,
      diferencaMensal,
      diferencaAnual,
      regimeVencedor,
    }
  }, [faturamentoMensal, folhaMensal, atividade, margemLucro, aliqISS, aliqICMS])

  // FAQ com 5 perguntas curtas e diretas
  const faqs = [
    {
      q: 'Qual a principal diferença entre Simples Nacional e Lucro Presumido?',
      a: 'O Simples Nacional unifica oito tributos em guia única (DAS) com alíquota progressiva sobre a receita bruta. No Lucro Presumido, cada imposto (IRPJ, CSLL, PIS, COFINS e ISS/ICMS) é apurado separadamente através de bases de presunção fixadas em lei.',
    },
    {
      q: 'Quando o Lucro Presumido costuma ser mais vantajoso que o Simples Nacional?',
      a: 'O Lucro Presumido costuma ser mais vantajoso para empresas de serviços com baixo custo de folha (que cairiam no Anexo V com alíquota de 15,5% a 30,5%) ou para empresas com receita bruta elevada nas faixas superiores do Simples.',
    },
    {
      q: 'Como a folha de salários influencia a escolha entre os regimes?',
      a: 'No Simples (Anexos I, II e III), a contribuição previdenciária patronal já está embutida no DAS. No Lucro Presumido, a empresa deve recolher o INSS patronal de 20% mais RAT e terceiros sobre a folha, o que encarece o regime para quem tem muitos funcionários.',
    },
    {
      q: 'Qual é o limite de faturamento anual para permanecer no Simples Nacional?',
      a: 'O teto nacional é de R$ 4,8 milhões de receita bruta acumulada em 12 meses. Há também o sublimite estadual de R$ 3,6 milhões para recolhimento conjunto de ICMS e ISS dentro do DAS.',
    },
    {
      q: 'É possível mudar de regime tributário no meio do ano?',
      a: 'Não. A opção pelo regime tributário é irretratável para todo o ano-calendário e deve ser formalizada anualmente em janeiro, ressalvadas hipóteses legais de exclusão de ofício.',
    },
  ]

  // Schema JSON-LD
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id':
          'https://peresperes.com.br/calculadoras/simples-nacional-ou-lucro-presumido#software',
        name: 'Calculadora Simples Nacional ou Lucro Presumido: qual paga menos imposto',
        url: 'https://peresperes.com.br/calculadoras/simples-nacional-ou-lucro-presumido',
        applicationCategory: 'FinancialApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        description:
          'Ferramenta para cálculo e comparação da carga tributária entre Simples Nacional e Lucro Presumido em tempo real.',
        provider: {
          '@type': 'AccountingService',
          name: 'PERES PERES Consultoria e Contabilidade',
          url: 'https://peresperes.com.br',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id':
          'https://peresperes.com.br/calculadoras/simples-nacional-ou-lucro-presumido#breadcrumb',
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
            name: 'Simples Nacional ou Lucro Presumido',
            item: 'https://peresperes.com.br/calculadoras/simples-nacional-ou-lucro-presumido',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://peresperes.com.br/calculadoras/simples-nacional-ou-lucro-presumido#faq',
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
      {/* Dados Estruturados JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="container mx-auto px-4 max-w-4xl">
        {/* 1. Trilha de Navegação (Breadcrumb) */}
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
          <span className="text-black font-medium">Simples Nacional ou Lucro Presumido</span>
        </nav>

        {/* Botão de retorno */}
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

        {/* 2. Cabeçalho com o título e parágrafo de 2 a 3 linhas */}
        <header className="mb-10 max-w-3xl">
          <div className="inline-block border border-neutral-300 bg-neutral-100 text-neutral-800 text-xs font-mono uppercase tracking-wider px-3 py-1 rounded mb-4">
            Regime Tributário • Planejamento Fiscal
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-black mb-5 leading-tight">
            Simples Nacional ou Lucro Presumido: qual paga menos imposto
          </h1>

          <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
            Esta ferramenta calcula e compara a carga tributária real entre o Simples Nacional e o
            Lucro Presumido a partir do faturamento, atividade e folha de pagamento da sua empresa.
            Identifique em tempo real qual regime gera menor recolhimento mensal e a projeção de
            economia anual estimada.
          </p>
        </header>

        {/* 3. BLOCO DA CALCULADORA (executado em tempo real em JavaScript) */}
        <section
          aria-labelledby="calculadora-heading"
          className="border border-neutral-200 bg-white rounded-xl shadow-sm p-6 md:p-8 mb-12"
        >
          <div className="flex items-center justify-between pb-6 border-b border-neutral-200 mb-6">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-neutral-900" />
              <h2
                id="calculadora-heading"
                className="text-xl md:text-2xl font-serif font-bold text-black"
              >
                Simulação em Tempo Real
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
              Parâmetros Mensais e Anualizados
            </span>
          </div>

          {/* Campos de entrada */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Campo 1: Faturamento mensal médio */}
            <div>
              <label
                htmlFor="input-faturamento"
                className="block text-sm font-semibold text-neutral-900 mb-1.5"
              >
                Faturamento mensal médio
              </label>
              <p className="text-xs text-neutral-500 mb-2">
                Receita bruta mensal projetada (base para RBT12 = faturamento × 12).
              </p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-500 font-mono">
                  R$
                </span>
                <Input
                  id="input-faturamento"
                  type="text"
                  inputMode="numeric"
                  value={faturamentoInput}
                  onChange={handleFaturamentoChange}
                  placeholder="0,00"
                  className="pl-10 font-mono text-base border-neutral-300 focus-visible:ring-black"
                />
              </div>
            </div>

            {/* Campo 2: Atividade da empresa */}
            <div>
              <label
                htmlFor="select-atividade"
                className="block text-sm font-semibold text-neutral-900 mb-1.5"
              >
                Atividade principal
              </label>
              <p className="text-xs text-neutral-500 mb-2">
                Define os Anexos do Simples e o percentual de presunção do IRPJ/CSLL.
              </p>
              <select
                id="select-atividade"
                value={atividade}
                onChange={(e) => setAtividade(e.target.value as ActivityType)}
                className="w-full h-10 px-3 py-2 text-sm bg-white border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black font-sans text-neutral-900"
              >
                <option value="servico">Prestação de Serviços (Presunção 32%)</option>
                <option value="comercio">Comércio Varejista / Atacadista (Presunção 8%)</option>
                <option value="industria">Indústria / Fabricação (Presunção 8%)</option>
              </select>
            </div>

            {/* Campo 3: Folha de salários mensal */}
            <div>
              <label
                htmlFor="input-folha"
                className="block text-sm font-semibold text-neutral-900 mb-1.5"
              >
                Folha de salários mensal
              </label>
              <p className="text-xs text-neutral-500 mb-2">
                Soma de salários, pró-labore e encargos mensais (avalia o Fator R no serviço).
              </p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-500 font-mono">
                  R$
                </span>
                <Input
                  id="input-folha"
                  type="text"
                  inputMode="numeric"
                  value={folhaInput}
                  onChange={handleFolhaChange}
                  placeholder="0,00"
                  className="pl-10 font-mono text-base border-neutral-300 focus-visible:ring-black"
                />
              </div>
            </div>

            {/* Campo 4: Margem de lucro estimada (%) */}
            <div>
              <label
                htmlFor="input-margem"
                className="block text-sm font-semibold text-neutral-900 mb-1.5"
              >
                Margem de lucro estimada (%)
              </label>
              <p className="text-xs text-neutral-500 mb-2">
                Percentual do lucro líquido esperado sobre a receita bruta total.
              </p>
              <div className="relative">
                <Input
                  id="input-margem"
                  type="number"
                  min="0"
                  max="100"
                  value={margemLucroInput}
                  onChange={handleMargemChange}
                  placeholder="25"
                  className="pr-8 font-mono text-base border-neutral-300 focus-visible:ring-black"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-500 font-mono">
                  %
                </span>
              </div>
            </div>

            {/* Campo 5: Alíquota local (ISS para serviço ou ICMS para comércio/indústria) */}
            {atividade === 'servico' ? (
              <div>
                <label
                  htmlFor="input-iss"
                  className="block text-sm font-semibold text-neutral-900 mb-1.5"
                >
                  Alíquota municipal de ISS (%)
                </label>
                <p className="text-xs text-neutral-500 mb-2">
                  Alíquota cobrada pelo município da prestação (Lei Complementar 116/2003: 2% a 5%).
                </p>
                <div className="relative">
                  <Input
                    id="input-iss"
                    type="number"
                    min="2"
                    max="5"
                    step="0.5"
                    value={aliqISSInput}
                    onChange={handleISSChange}
                    placeholder="3"
                    className="pr-8 font-mono text-base border-neutral-300 focus-visible:ring-black"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-500 font-mono">
                    %
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <label
                  htmlFor="input-icms"
                  className="block text-sm font-semibold text-neutral-900 mb-1.5"
                >
                  Alíquota estadual de ICMS interno (%)
                </label>
                <p className="text-xs text-neutral-500 mb-2">
                  Alíquota de ICMS praticada no estado de atuação (ex.: 17% a 20%).
                </p>
                <div className="relative">
                  <Input
                    id="input-icms"
                    type="number"
                    min="0"
                    max="35"
                    value={aliqICMSInput}
                    onChange={handleICMSChange}
                    placeholder="18"
                    className="pr-8 font-mono text-base border-neutral-300 focus-visible:ring-black"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-500 font-mono">
                    %
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 4. RESULTADO COM AS 4 INFORMAÇÕES EXIGIDAS */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 mb-8">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-3">
              Quadro Comparativo de Carga Tributária
            </span>

            {calculation.hasReceita ? (
              <div className="space-y-6">
                {/* DESTAQUE PRINCIPAL: QUAL REGIME PAGA MENOS E ECONOMIA ANUAL (Ponto focal #FAB319) */}
                <div className="border border-neutral-200 bg-white rounded-xl p-5 md:p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                        4. Veredito Comparativo e Economia
                      </span>
                      <h3 className="text-xl md:text-2xl font-serif font-bold text-black flex items-center gap-2">
                        {calculation.regimeVencedor === 'simples' ? (
                          <>
                            O {/* Ponto focal #FAB319 número 1 */}
                            <span className="bg-[#FAB319] text-black px-2.5 py-0.5 rounded font-bold">
                              Simples Nacional
                            </span>{' '}
                            paga menos tributo
                          </>
                        ) : calculation.regimeVencedor === 'presumido' ? (
                          <>
                            O {/* Ponto focal #FAB319 número 1 */}
                            <span className="bg-[#FAB319] text-black px-2.5 py-0.5 rounded font-bold">
                              Lucro Presumido
                            </span>{' '}
                            paga menos tributo
                          </>
                        ) : (
                          'Ambos os regimes apresentam carga tributária equivalente'
                        )}
                      </h3>
                      <p className="text-xs md:text-sm text-neutral-600 mt-1">
                        {calculation.regimeVencedor === 'simples'
                          ? `Diferença mensal favorável de ${formatCurrencyBRL(
                              calculation.diferencaMensal,
                            )} no recolhimento tributário.`
                          : calculation.regimeVencedor === 'presumido'
                            ? `Diferença mensal favorável de ${formatCurrencyBRL(
                                calculation.diferencaMensal,
                              )} no recolhimento tributário.`
                            : 'Variação inferior a R$ 0,01 entre os modelos analisados.'}
                      </p>
                    </div>

                    <div className="text-left md:text-right shrink-0 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                      <span className="text-xs text-neutral-600 block mb-1">
                        Economia anual estimada
                      </span>
                      <span className="text-2xl md:text-3xl font-mono font-bold text-black">
                        {formatCurrencyBRL(calculation.diferencaAnual)}
                      </span>
                      <span className="text-[11px] text-neutral-500 block mt-0.5 font-mono">
                        (projeção de 12 competências)
                      </span>
                    </div>
                  </div>

                  {calculation.ultrapassaTetoSN && (
                    <div className="mt-4 p-3 bg-neutral-100 border border-neutral-300 rounded text-xs text-neutral-800 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-black shrink-0 mt-0.5" />
                      <div>
                        <strong>Atenção ao teto do Simples Nacional:</strong> A receita projetada
                        anual ({formatCurrencyBRL(calculation.rbt12)}) excede o limite de R$
                        4.800.000,00 da LC 123/2006. A empresa estaria sujeita à exclusão do Simples
                        Nacional, tornando o Lucro Presumido obrigatório ou mandatório para essa
                        faixa.
                      </div>
                    </div>
                  )}
                </div>

                {/* 1 e 2: DAS Simples Nacional vs Total Tributos Lucro Presumido */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* CARD SIMPLES NACIONAL */}
                  <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3">
                        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-600">
                          1. Simples Nacional (DAS Estimado)
                        </span>
                        <span className="text-[11px] bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 font-mono text-neutral-800">
                          {calculation.anexoNome}
                        </span>
                      </div>

                      <div className="mb-4">
                        <span className="text-xs text-neutral-500 block mb-1">
                          DAS mensal estimado:
                        </span>
                        <span className="text-3xl font-mono font-bold text-black block">
                          {formatCurrencyBRL(calculation.simplesNacionalMensal)}
                        </span>
                        <span className="text-xs text-neutral-600 mt-1 block">
                          Projeção anual:{' '}
                          <strong>{formatCurrencyBRL(calculation.simplesNacionalAnual)}</strong>
                        </span>
                      </div>

                      {/* Informação 3: Carga tributária percentual no Simples */}
                      <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs space-y-1 mb-4">
                        <div className="flex justify-between font-mono">
                          <span className="text-neutral-600">3. Carga tributária efetiva:</span>
                          <span className="font-bold text-black">
                            {calculation.cargaSNPercent.toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between font-mono text-neutral-500 text-[11px]">
                          <span>Alíquota nominal da faixa ({calculation.faixaIndice}ª faixa):</span>
                          <span>{(calculation.aliqNominalSN * 100).toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between font-mono text-neutral-500 text-[11px]">
                          <span>Parcela a deduzir:</span>
                          <span>{formatCurrencyBRL(calculation.parcelaDeducaoSN)}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-neutral-500 leading-relaxed border-t border-neutral-100 pt-3">
                      Inclui IRPJ, CSLL, PIS, COFINS, CPP patronal e tributo local unificados em
                      documento único de arrecadação.
                    </p>
                  </div>

                  {/* CARD LUCRO PRESUMIDO COM ABERTURA DOS TRIBUTOS */}
                  <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3">
                        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-600">
                          2. Lucro Presumido (Total Tributos)
                        </span>
                        <span className="text-[11px] bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 font-mono text-neutral-800">
                          Presunção: {(calculation.presuncaoIRPJRate * 100).toFixed(0)}%
                        </span>
                      </div>

                      <div className="mb-4">
                        <span className="text-xs text-neutral-500 block mb-1">
                          Total mensal de tributos:
                        </span>
                        <span className="text-3xl font-mono font-bold text-black block">
                          {formatCurrencyBRL(calculation.totalPresumidoMensal)}
                        </span>
                        <span className="text-xs text-neutral-600 mt-1 block">
                          Projeção anual:{' '}
                          <strong>{formatCurrencyBRL(calculation.totalPresumidoAnual)}</strong>
                        </span>
                      </div>

                      {/* Informação 3: Carga tributária percentual no Presumido */}
                      <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs space-y-1 mb-4">
                        <div className="flex justify-between font-mono">
                          <span className="text-neutral-600">
                            3. Carga tributária sobre receita:
                          </span>
                          <span className="font-bold text-black">
                            {calculation.cargaPresumidoPercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>

                      {/* Abertura dos tributos no Lucro Presumido */}
                      <div className="space-y-1.5 text-xs font-mono border-t border-neutral-200 pt-3 mb-2">
                        <div className="flex justify-between py-0.5">
                          <span className="text-neutral-600">IRPJ (15% + adic. 10%):</span>
                          <span className="font-semibold text-black">
                            {formatCurrencyBRL(calculation.totalIRPJ)}
                          </span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-neutral-600">CSLL (9% sobre presunção):</span>
                          <span className="font-semibold text-black">
                            {formatCurrencyBRL(calculation.totalCSLL)}
                          </span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-neutral-600">PIS (0,65% cumulativo):</span>
                          <span className="font-semibold text-black">
                            {formatCurrencyBRL(calculation.totalPIS)}
                          </span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-neutral-600">COFINS (3,00% cumulativo):</span>
                          <span className="font-semibold text-black">
                            {formatCurrencyBRL(calculation.totalCOFINS)}
                          </span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-neutral-600">
                            {calculation.tributoLocalNome} (
                            {(calculation.tributoLocalRate * 100).toFixed(2)}%):
                          </span>
                          <span className="font-semibold text-black">
                            {formatCurrencyBRL(calculation.totalTributoLocal)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-neutral-500 leading-relaxed border-t border-neutral-100 pt-2">
                      * Apuração individualizada por guia DARF e tributo municipal/estadual. Não
                      inclui encargos patronais sobre folha.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white border border-neutral-200 rounded text-sm text-neutral-600">
                Informe um faturamento mensal superior a R$ 0,00 para calcular a comparação entre os
                regimes tributários.
              </div>
            )}
          </div>

          {/* 6. MEMÓRIA DE CÁLCULO ABERTA (linha por linha com números digitados) */}
          <div className="border border-neutral-200 rounded-lg p-5 bg-neutral-50">
            <div className="flex items-center gap-2 mb-3">
              <FileCheck2 className="h-4 w-4 text-neutral-800" />
              <h3 className="text-sm font-serif font-bold text-black uppercase tracking-wider">
                Memória de Cálculo Aberta
              </h3>
            </div>
            <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
              Demonstração matemática transparente de cada etapa do cálculo para conferência e
              auditoria independente:
            </p>

            <div className="font-mono text-xs md:text-sm bg-white border border-neutral-200 rounded p-4 space-y-4 text-neutral-800">
              {/* Seção Simples Nacional na memória */}
              <div>
                <span className="font-bold text-black block mb-2 pb-1 border-b border-neutral-200">
                  Etapa 1: Apuração do Simples Nacional (LC 123/2006)
                </span>
                <div className="space-y-1.5 pl-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:justify-between py-0.5">
                    <span className="text-neutral-500">
                      Receita Bruta dos últimos 12 meses (RBT12 ={' '}
                      {formatCurrencyBRL(faturamentoMensal)} × 12):
                    </span>
                    <span className="font-semibold text-black">
                      {formatCurrencyBRL(calculation.rbt12)}
                    </span>
                  </div>
                  {atividade === 'servico' && (
                    <div className="flex flex-col sm:flex-row sm:justify-between py-0.5">
                      <span className="text-neutral-500">
                        Fator R apurado (Folha 12m ÷ RBT12 = {formatCurrencyBRL(calculation.fs12)} ÷{' '}
                        {formatCurrencyBRL(calculation.rbt12)}):
                      </span>
                      <span className="font-semibold text-black">
                        {calculation.fatorRPercent.toFixed(2)}% (
                        {calculation.isAnexoIIIviaFatorR ? '≥ 28% → Anexo III' : '< 28% → Anexo V'})
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row sm:justify-between py-0.5">
                    <span className="text-neutral-500">
                      Enquadramento do anexo e faixa de faturamento:
                    </span>
                    <span className="font-semibold text-black">
                      {calculation.anexoNome} • {calculation.faixaIndice}ª Faixa
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-0.5">
                    <span className="text-neutral-500">
                      Alíquota nominal da faixa e parcela a deduzir:
                    </span>
                    <span className="font-semibold text-black">
                      {(calculation.aliqNominalSN * 100).toFixed(2)}% e{' '}
                      {formatCurrencyBRL(calculation.parcelaDeducaoSN)}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-0.5">
                    <span className="text-neutral-500">
                      Fórmula da Alíquota Efetiva: (RBT12 × Alíq. Nominal − Parcela) ÷ RBT12
                    </span>
                    <span className="font-semibold text-black">
                      ({formatCurrencyBRL(calculation.rbt12)} ×{' '}
                      {(calculation.aliqNominalSN * 100).toFixed(2)}% −{' '}
                      {formatCurrencyBRL(calculation.parcelaDeducaoSN)}) ÷{' '}
                      {formatCurrencyBRL(calculation.rbt12)} ={' '}
                      {(calculation.aliqEfetivaSN * 100).toFixed(4)}%
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-0.5 border-t border-neutral-100 font-bold">
                    <span className="text-black">
                      Guia DAS do mês = Faturamento Mensal × Alíquota Efetiva:
                    </span>
                    <span className="text-black">
                      {formatCurrencyBRL(faturamentoMensal)} ×{' '}
                      {(calculation.aliqEfetivaSN * 100).toFixed(4)}% ={' '}
                      {formatCurrencyBRL(calculation.simplesNacionalMensal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seção Lucro Presumido na memória */}
              <div>
                <span className="font-bold text-black block mb-2 pb-1 border-b border-neutral-200">
                  Etapa 2: Apuração do Lucro Presumido (Lei 9.249/1995 e correlatas)
                </span>
                <div className="space-y-1.5 pl-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:justify-between py-0.5">
                    <span className="text-neutral-500">
                      Base presumida do IRPJ ({formatCurrencyBRL(faturamentoMensal)} ×{' '}
                      {(calculation.presuncaoIRPJRate * 100).toFixed(0)}%):
                    </span>
                    <span className="font-semibold text-black">
                      {formatCurrencyBRL(calculation.baseIRPJMensal)}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-0.5">
                    <span className="text-neutral-500">
                      IRPJ Básico (15% de {formatCurrencyBRL(calculation.baseIRPJMensal)}):
                    </span>
                    <span className="font-semibold text-black">
                      {formatCurrencyBRL(calculation.irpjBasico)}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-0.5">
                    <span className="text-neutral-500">
                      Adicional IRPJ (10% sobre excedente a R$ 20.000,00 ={' '}
                      {formatCurrencyBRL(calculation.excedente20k)}):
                    </span>
                    <span className="font-semibold text-black">
                      {formatCurrencyBRL(calculation.irpjAdicional)}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-0.5">
                    <span className="text-neutral-500">
                      Base presumida da CSLL ({formatCurrencyBRL(faturamentoMensal)} ×{' '}
                      {(calculation.presuncaoCSLLRate * 100).toFixed(0)}%):
                    </span>
                    <span className="font-semibold text-black">
                      {formatCurrencyBRL(calculation.baseCSLLMensal)}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-0.5">
                    <span className="text-neutral-500">
                      CSLL (9% de {formatCurrencyBRL(calculation.baseCSLLMensal)}):
                    </span>
                    <span className="font-semibold text-black">
                      {formatCurrencyBRL(calculation.totalCSLL)}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-0.5">
                    <span className="text-neutral-500">
                      PIS cumulativo (0,65% de {formatCurrencyBRL(faturamentoMensal)}):
                    </span>
                    <span className="font-semibold text-black">
                      {formatCurrencyBRL(calculation.totalPIS)}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-0.5">
                    <span className="text-neutral-500">
                      COFINS cumulativo (3,00% de {formatCurrencyBRL(faturamentoMensal)}):
                    </span>
                    <span className="font-semibold text-black">
                      {formatCurrencyBRL(calculation.totalCOFINS)}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-0.5">
                    <span className="text-neutral-500">
                      Tributo local ({calculation.tributoLocalNome} a{' '}
                      {(calculation.tributoLocalRate * 100).toFixed(2)}%):
                    </span>
                    <span className="font-semibold text-black">
                      {formatCurrencyBRL(calculation.totalTributoLocal)}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-0.5 border-t border-neutral-100 font-bold">
                    <span className="text-black">Soma total de tributos no Lucro Presumido:</span>
                    <span className="text-black">
                      {formatCurrencyBRL(calculation.totalIRPJ)} +{' '}
                      {formatCurrencyBRL(calculation.totalCSLL)} +{' '}
                      {formatCurrencyBRL(calculation.totalPIS)} +{' '}
                      {formatCurrencyBRL(calculation.totalCOFINS)} +{' '}
                      {formatCurrencyBRL(calculation.totalTributoLocal)} ={' '}
                      {formatCurrencyBRL(calculation.totalPresumidoMensal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seção Comparativo final na memória */}
              <div>
                <span className="font-bold text-black block mb-2 pb-1 border-b border-neutral-200">
                  Etapa 3: Comparação e Cálculo da Economia
                </span>
                <div className="space-y-1.5 pl-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:justify-between py-0.5">
                    <span className="text-neutral-500">
                      Diferença tributária mensal (|Simples − Presumido|):
                    </span>
                    <span className="font-semibold text-black">
                      |{formatCurrencyBRL(calculation.simplesNacionalMensal)} −{' '}
                      {formatCurrencyBRL(calculation.totalPresumidoMensal)}| ={' '}
                      {formatCurrencyBRL(calculation.diferencaMensal)}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-0.5">
                    <span className="text-neutral-500">
                      Economia Anualizada ({formatCurrencyBRL(calculation.diferencaMensal)} × 12):
                    </span>
                    <span className="font-semibold text-black">
                      {formatCurrencyBRL(calculation.diferencaAnual)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. TEXTO DE APROFUNDAMENTO ESTÁTICO EM HTML COM SUBTÍTULOS EXIGIDOS */}
        <article className="prose prose-neutral max-w-none mb-16 space-y-12">
          {/* Subtítulo 1: Como o Simples Nacional é calculado (com fórmula) */}
          <section aria-labelledby="como-simples-e-calculado">
            <h2
              id="como-simples-e-calculado"
              className="text-2xl md:text-3xl font-serif font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              Como o Simples Nacional é calculado
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                O Simples Nacional é um regime tributário simplificado e unificado instituído pela
                Lei Complementar nº 123/2006. Ele reúne em uma única guia de recolhimento mensal (o
                Documento de Arrecadação do Simples Nacional — DAS) até oito tributos federais,
                estaduais e municipais: IRPJ, CSLL, PIS/Pasep, COFINS, IPI, CPP (Contribuição
                Patronal Previdenciária), ICMS e ISS.
              </p>
              <p>
                A metodologia de apuração não utiliza uma alíquota fixa sobre a nota fiscal emitida.
                O valor devido é apurado mediante a apuração da <strong>Alíquota Efetiva</strong>,
                obtida a partir da Receita Bruta Acumulada nos doze meses imediatamente anteriores
                (RBT12), aplicando-se a alíquota nominal e a dedução da faixa correspondente nos
                Anexos I a V da LC 123/2006:
              </p>

              <div className="my-6 p-4 md:p-6 bg-neutral-100 border border-neutral-300 rounded-lg text-center font-mono text-sm md:text-base text-black font-semibold">
                Alíquota Efetiva = (RBT12 × Alíquota Nominal − Parcela a Deduzir) ÷ RBT12
              </div>

              <p>
                Com a obtenção do percentual efetivo, o imposto devido no mês é calculado
                multiplicando-se essa taxa pela receita auferida no mês da apuração:
              </p>

              <div className="my-3 p-3 bg-neutral-50 border border-neutral-200 rounded text-center font-mono text-sm text-neutral-800">
                Valor do DAS = Receita Bruta Mensal × Alíquota Efetiva
              </div>

              <p>
                Para as empresas de serviços sujeitas ao <strong>Fator R</strong>, a proporção entre
                os gastos de folha de salários dos últimos doze meses (FS12) e a receita acumulada
                (RBT12) determina se o recolhimento ocorrerá pelo <strong>Anexo III</strong> (quando
                a relação for igual ou superior a 28%) ou pelo <strong>Anexo V</strong> (quando
                inferior a 28%), o que impacta significativamente o custo tributário.
              </p>
            </div>
          </section>

          {/* Subtítulo 2: Como o Lucro Presumido é calculado (com fórmula e tabela de presunções) */}
          <section aria-labelledby="como-lucro-presumido-e-calculado">
            <h2
              id="como-lucro-presumido-e-calculado"
              className="text-2xl md:text-3xl font-serif font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              Como o Lucro Presumido é calculado
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                O Lucro Presumido é uma modalidade de tributação simplificada disciplinada pela Lei
                nº 9.249/1995 e pelo Regulamento do Imposto de Renda. Em vez de apurar o lucro
                contábil exato através de todas as receitas e despesas operacionais da empresa, a
                legislação fiscal prefixa uma margem percentual de lucro estimada (a presunção)
                sobre a qual incidirão o Imposto de Renda (IRPJ) e a Contribuição Social sobre o
                Lucro Líquido (CSLL).
              </p>
              <p>
                A fórmula de cálculo do lucro tributável presumido expressa-se pela aplicação do
                coeficiente legal sobre a receita bruta do período:
              </p>

              <div className="my-6 p-4 md:p-6 bg-neutral-100 border border-neutral-300 rounded-lg text-center font-mono text-sm md:text-base text-black font-semibold">
                Base Presumida = Receita Bruta Mensal/Trimestral × Coeficiente de Presunção Legal
              </div>

              <p>
                Sobre essa base de presunção, incide a alíquota básica de{' '}
                <strong>15% de IRPJ</strong> mais o adicional de <strong>10%</strong> sobre a
                parcela da base que ultrapassar o patamar de R$ 20.000,00 por mês (ou R$ 60.000,00
                no trimestre). A <strong>CSLL</strong> incide à alíquota de <strong>9%</strong>{' '}
                sobre a sua base presumida própria.
              </p>

              <p>Abaixo, a tabela legal dos coeficientes de presunção por atividade:</p>

              {/* Tabela de presunções por atividade */}
              <div className="my-6 border border-neutral-300 rounded-lg overflow-x-auto bg-white shadow-sm">
                <table className="w-full text-left text-xs md:text-sm border-collapse">
                  <thead>
                    <tr className="bg-neutral-100 border-b border-neutral-300 text-neutral-900 font-serif">
                      <th className="p-3 border-r border-neutral-200 font-bold">
                        Atividade Econômica
                      </th>
                      <th className="p-3 border-r border-neutral-200 font-bold text-center">
                        Presunção IRPJ (Art. 15, Lei 9.249/95)
                      </th>
                      <th className="p-3 font-bold text-center">
                        Presunção CSLL (Art. 20, Lei 9.249/95)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 font-mono text-neutral-800">
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3 border-r border-neutral-200 font-sans font-medium">
                        Comércio varejista e atacadista de mercadorias
                      </td>
                      <td className="p-3 border-r border-neutral-200 text-center font-bold">
                        8,00%
                      </td>
                      <td className="p-3 text-center font-bold">12,00%</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3 border-r border-neutral-200 font-sans font-medium">
                        Atividade industrial e fabricação de produtos
                      </td>
                      <td className="p-3 border-r border-neutral-200 text-center font-bold">
                        8,00%
                      </td>
                      <td className="p-3 text-center font-bold">12,00%</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3 border-r border-neutral-200 font-sans font-medium">
                        Transporte de cargas (exceto passageiros)
                      </td>
                      <td className="p-3 border-r border-neutral-200 text-center font-bold">
                        8,00%
                      </td>
                      <td className="p-3 text-center font-bold">12,00%</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3 border-r border-neutral-200 font-sans font-medium">
                        Serviços hospitalares e diagnósticos médicos qualificados
                      </td>
                      <td className="p-3 border-r border-neutral-200 text-center font-bold">
                        8,00%
                      </td>
                      <td className="p-3 text-center font-bold">12,00%</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3 border-r border-neutral-200 font-sans font-medium">
                        Transporte de passageiros
                      </td>
                      <td className="p-3 border-r border-neutral-200 text-center font-bold">
                        16,00%
                      </td>
                      <td className="p-3 text-center font-bold">12,00%</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3 border-r border-neutral-200 font-sans font-medium">
                        Prestação de serviços em geral (profissionais liberais, consultorias,
                        engenharia, TI)
                      </td>
                      <td className="p-3 border-r border-neutral-200 text-center font-bold">
                        32,00%
                      </td>
                      <td className="p-3 text-center font-bold">32,00%</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3 border-r border-neutral-200 font-sans font-medium">
                        Intermediação de negócios, corretagem e administração de bens
                      </td>
                      <td className="p-3 border-r border-neutral-200 text-center font-bold">
                        32,00%
                      </td>
                      <td className="p-3 text-center font-bold">32,00%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                Além do IRPJ e da CSLL, as empresas no Lucro Presumido recolhem as contribuições
                federais sobre o faturamento pelo regime cumulativo (Leis 10.637/2002 e
                10.833/2003): <strong>PIS a 0,65%</strong> e <strong>COFINS a 3,00%</strong>, sem
                direito ao aproveitamento de créditos operacionais. Para serviços incide o{' '}
                <strong>ISS municipal</strong> (entre 2% e 5%) e para comércio e indústria incide o{' '}
                <strong>ICMS estadual</strong> não-cumulativo.
              </p>
            </div>
          </section>

          {/* Subtítulo 3: Comparação lado a lado em tabela */}
          <section aria-labelledby="comparacao-lado-a-lado">
            <h2
              id="comparacao-lado-a-lado"
              className="text-2xl md:text-3xl font-serif font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              Comparação lado a lado em tabela
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                A tabela a seguir confronta as variáveis estruturais, operacionais e de recolhimento
                entre o Simples Nacional e o Lucro Presumido para subsidiar a escolha fiscal da
                empresa:
              </p>

              <div className="my-6 border border-neutral-300 rounded-lg overflow-x-auto bg-white shadow-sm">
                <table className="w-full text-left text-xs md:text-sm border-collapse">
                  <thead>
                    <tr className="bg-neutral-100 border-b border-neutral-300 text-neutral-900 font-serif">
                      <th className="p-3 border-r border-neutral-200 font-bold">
                        Critério Avaliado
                      </th>
                      <th className="p-3 border-r border-neutral-200 font-bold">
                        Simples Nacional
                      </th>
                      <th className="p-3 font-bold">Lucro Presumido</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 text-neutral-800">
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3 border-r border-neutral-200 font-semibold font-sans">
                        Guia de Pagamento
                      </td>
                      <td className="p-3 border-r border-neutral-200">
                        Guia única unificada mensal (DAS)
                      </td>
                      <td className="p-3">
                        Guias individualizadas por tributo (DARF para cada tributo e guia local)
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3 border-r border-neutral-200 font-semibold font-sans">
                        Alíquotas
                      </td>
                      <td className="p-3 border-r border-neutral-200">
                        Progressivas por faixas de receita acumulada (RBT12)
                      </td>
                      <td className="p-3">Fixas sobre a base de presunção legal</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3 border-r border-neutral-200 font-semibold font-sans">
                        INSS Patronal sobre a Folha
                      </td>
                      <td className="p-3 border-r border-neutral-200">
                        Incluso no DAS nos Anexos I, II e III (isento de cota patronal individual)
                      </td>
                      <td className="p-3">
                        Não incluso. Recolhe 20% de cota patronal + RAT + terceiros (aprox. 25,8% a
                        28% sobre a folha)
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3 border-r border-neutral-200 font-semibold font-sans">
                        PIS e COFINS
                      </td>
                      <td className="p-3 border-r border-neutral-200">
                        Embutidos na alíquota unificada do DAS
                      </td>
                      <td className="p-3">
                        0,65% de PIS e 3,00% de COFINS (regime cumulativo sobre faturamento)
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3 border-r border-neutral-200 font-semibold font-sans">
                        Limite de Faturamento Anual
                      </td>
                      <td className="p-3 border-r border-neutral-200">
                        Até R$ 4,8 milhões (com sublimite de R$ 3,6 milhões para ICMS/ISS)
                      </td>
                      <td className="p-3">Até R$ 78 milhões no ano-calendário anterior</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3 border-r border-neutral-200 font-semibold font-sans">
                        Obrigações Acessórias
                      </td>
                      <td className="p-3 border-r border-neutral-200">
                        Simplificadas (PGDAS-D, DEFIS, eSocial)
                      </td>
                      <td className="p-3">
                        Complexas (EFD-Contribuições, ECF, ECD, DCTFWeb, EFD-Reinf)
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3 border-r border-neutral-200 font-semibold font-sans">
                        Distribuição de Lucros
                      </td>
                      <td className="p-3 border-r border-neutral-200">
                        Isenta de IRPF com escrituração contábil regular
                      </td>
                      <td className="p-3">
                        Isenta de IRPF com base no lucro contábil apurado ou no limite da presunção
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Subtítulo 4: Quando o Lucro Presumido costuma vencer (efeito da folha de salários e da margem) */}
          <section aria-labelledby="quando-lucro-presumido-vence">
            <h2
              id="quando-lucro-presumido-vence"
              className="text-2xl md:text-3xl font-serif font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              Quando o Lucro Presumido costuma vencer
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                A vitória financeira do Lucro Presumido frente ao Simples Nacional costuma ocorrer
                em cenários específicos definidos por duas forças motrizes: o volume da{' '}
                <strong>folha de salários</strong> e o nível de{' '}
                <strong>margem de lucro efetiva</strong> da operação:
              </p>

              <div className="space-y-4 my-6">
                <div className="border border-neutral-200 rounded-lg p-5 bg-white">
                  <h3 className="font-serif font-bold text-base text-black mb-2">
                    1. Serviços com folha de salários reduzida (Fator R &lt; 28%)
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-2">
                    Empresas prestadoras de serviços intelectuais (como desenvolvedores de software,
                    consultores, médicos e engenheiros) que operam com poucos funcionários ou
                    pró-labore modesto não conseguem atingir os 28% exigidos para o Anexo III. No
                    Simples Nacional, elas caem no <strong>Anexo V</strong>, com alíquota inicial de
                    15,50% que ultrapassa rapidamente 20% a 23% nas faixas superiores.
                  </p>
                  <p className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded border border-neutral-200">
                    <strong>Por que o Presumido vence:</strong> A carga federal fixa de tributos no
                    Lucro Presumido para serviços soma aproximadamente 11,33% (IRPJ 4,8% a 6,8% +
                    CSLL 2,88% + PIS 0,65% + COFINS 3%), que acrescida de 2% a 5% de ISS totaliza
                    entre 13,33% e 16,33%. Como a folha é baixa, o custo do INSS patronal adicional
                    não anula a economia gerada.
                  </p>
                </div>

                <div className="border border-neutral-200 rounded-lg p-5 bg-white">
                  <h3 className="font-serif font-bold text-base text-black mb-2">
                    2. Empresas nas faixas finais do Simples Nacional (acima de R$ 1,8 milhão anual)
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-2">
                    Conforme o faturamento acumulado cresce e atinge a 4ª, 5ª e 6ª faixas do
                    Simples, as alíquotas efetivas aumentam sensivelmente (podendo alcançar 19% no
                    comércio e mais de 25% nos serviços).
                  </p>
                  <p className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded border border-neutral-200">
                    <strong>Por que o Presumido vence:</strong> No Lucro Presumido, as alíquotas não
                    são progressivas. Uma empresa com faturamento elevado estabiliza seu percentual
                    de imposto sobre a receita, tornando o custo global inferior ao do Simples
                    Nacional consolidado.
                  </p>
                </div>

                <div className="border border-neutral-200 rounded-lg p-5 bg-white">
                  <h3 className="font-serif font-bold text-base text-black mb-2">
                    3. Margens de lucro reais muito superiores à presunção legal
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-2">
                    Quando a empresa de comércio opera com margens de lucro elevadas (ex.: 25% a
                    30%), a presunção fiscal de 8% da Lei 9.249/1995 permite tributar o IRPJ e a
                    CSLL sobre uma parcela muito menor do ganho real, protegendo o restante dos
                    rendimentos como distribuição isenta de dividendos aos sócios.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Subtítulo 5: Limites do Simples Nacional (teto de receita e o que acontece ao exceder) */}
          <section aria-labelledby="limites-do-simples-nacional">
            <h2
              id="limites-do-simples-nacional"
              className="text-2xl md:text-3xl font-serif font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              Limites do Simples Nacional e regras de exclusão
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                A legislação do Simples Nacional impõe tetos rigorosos de receita bruta para a
                manutenção da pessoa jurídica no regime simplificado:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>
                  <strong>Teto Geral Nacional:</strong> R$ 4.800.000,00 de receita bruta acumulada
                  em doze meses (artigo 3º, inciso II, da LC 123/2006).
                </li>
                <li>
                  <strong>Sublimite Estadual e Municipal:</strong> R$ 3.600.000,00 de receita bruta
                  acumulada em doze meses para recolhimento unificado de ICMS e ISS dentro do DAS
                  (artigo 19 da LC 123/2006).
                </li>
              </ul>

              <div className="my-6 p-5 bg-neutral-50 border border-neutral-200 rounded-lg space-y-3">
                <h3 className="font-serif font-bold text-base text-black">
                  O que acontece ao ultrapassar os limites legais:
                </h3>
                <div className="space-y-2 text-sm text-neutral-700">
                  <p>
                    <strong>1. Exceder o sublimite de R$ 3,6 milhões até R$ 4,8 milhões:</strong> A
                    empresa continua recolhendo os tributos federais (IRPJ, CSLL, PIS, COFINS e CPP)
                    pelo DAS do Simples Nacional, mas é obrigada a recolher o ICMS ou o ISS por
                    fora, de forma autônoma, sujeitando-se às regras do regime normal estadual ou
                    municipal e às obrigações acessórias correspondentes (como SPED Fiscal).
                  </p>
                  <p>
                    <strong>2. Excesso de até 20% do teto geral (até R$ 5,76 milhões):</strong> A
                    exclusão do Simples Nacional produzirá efeitos a partir do primeiro dia do
                    ano-calendário subsequente ao do excesso.
                  </p>
                  <p>
                    <strong>
                      3. Excesso superior a 20% do teto geral (acima de R$ 5,76 milhões):
                    </strong>{' '}
                    A exclusão é imediata, retroativa ao primeiro dia do mês subsequente àquele em
                    que se verificar o excesso, exigindo a migração compulsória para o Lucro
                    Presumido ou Lucro Real com recálculo retroativo de tributos.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </article>

        {/* 8. BLOCO DE VIGÊNCIA VISÍVEL COM A BASE LEGAL COMPLETA */}
        <section
          aria-labelledby="vigencia-title"
          className="border border-neutral-200 bg-white rounded-xl p-6 mb-8 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <Scale className="h-5 w-5 text-neutral-800 shrink-0 mt-0.5" />
            <div>
              <h3 id="vigencia-title" className="font-serif font-bold text-base text-black mb-1">
                Vigência Normativa e Fundamentação Legal Completa
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                As fórmulas de cálculo, coeficientes analíticos e tabelas progressivas aplicadas
                nesta ferramenta fundamentam-se estritamente nos seguintes dispositivos legais
                vigentes:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-xs md:text-sm text-neutral-700 font-mono">
                <li>
                  <strong>Lei Complementar nº 123/2006:</strong> Artigos 18 e respectivos Anexos I,
                  II, III e V (tabelas progressivas do Simples Nacional e sistemática de alíquota
                  efetiva).
                </li>
                <li>
                  <strong>Lei nº 9.249/1995:</strong> Artigo 15 e seguintes (regras de apuração e
                  coeficientes de presunção do IRPJ e CSLL no Lucro Presumido).
                </li>
                <li>
                  <strong>Leis nº 10.637/2002 e 10.833/2003:</strong> Sistemática cumulativa de PIS
                  (0,65%) e COFINS (3,00%) incidentes sobre a receita bruta.
                </li>
                <li>
                  <strong>Lei Complementar nº 116/2003:</strong> Disciplina do Imposto sobre
                  Serviços de Qualquer Natureza (ISS) com alíquotas municipais fixadas entre o piso
                  de 2,00% e o teto de 5,00%.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 9. AVISO LEGAL DE ESTIMATIVA COM LINK PARA /contato */}
        <section
          aria-labelledby="aviso-legal-title"
          className="border border-neutral-200 bg-neutral-50 rounded-xl p-6 mb-12"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-neutral-700 shrink-0 mt-0.5" />
            <div>
              <h3 id="aviso-legal-title" className="font-serif font-bold text-base text-black mb-1">
                Aviso Legal de Estimativa e Responsabilidade Técnica
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                Os resultados gerados por esta ferramenta constituem projeções matemáticas
                referenciais e estimativas analíticas orientativas. A ferramenta não substitui a
                análise aprofundada e o parecer técnico individualizado de um profissional
                habilitado perante o Conselho Regional de Contabilidade. Variáveis como créditos de
                ICMS, regimes de substituição tributária, retenções na fonte e particularidades
                cadastrais de cada município exigem auditoria fiscal específica. Para estruturar o
                planejamento tributário formal do seu negócio, acesse a nossa página de{' '}
                <Link
                  to="/contato"
                  className="font-semibold text-black underline underline-offset-2 hover:text-neutral-700 transition-colors"
                >
                  contato com o escritório
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* 10. FAQ COM 5 PERGUNTAS E RESPOSTAS CURTAS E DIRETAS */}
        <section aria-labelledby="faq-section-title" className="mb-14">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 border border-neutral-300 bg-neutral-100 px-3 py-1 rounded text-xs font-mono uppercase tracking-wider text-neutral-800 mb-2">
              <HelpCircle className="h-3.5 w-3.5 text-black" />
              Perguntas Frequentes
            </div>
            <h2
              id="faq-section-title"
              className="text-2xl md:text-3xl font-serif font-bold text-black"
            >
              Dúvidas Técnicas sobre a Comparação Tributária
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

        {/* 11. CALCULADORAS RELACIONADAS COM OS TRÊS LINKS EXIGIDOS */}
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
            {/* Link 1: Fator R */}
            <Link
              to="/calculadoras/fator-r"
              className="group border border-neutral-200 bg-white hover:border-neutral-400 p-5 rounded-xl transition-all duration-200 flex flex-col justify-between shadow-sm"
            >
              <div>
                <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                  Regime Tributário
                </span>
                <h3 className="font-serif font-bold text-base text-black mb-2 group-hover:underline">
                  Fator R
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Cálculo da relação folha/receita para enquadramento do serviço no Anexo III ou
                  Anexo V.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center text-xs font-medium text-black">
                Acessar simulador{' '}
                <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Link 2: Simples Nacional Híbrido */}
            <Link
              to="/calculadoras/simples-nacional-hibrido"
              className="group border border-neutral-200 bg-white hover:border-neutral-400 p-5 rounded-xl transition-all duration-200 flex flex-col justify-between shadow-sm"
            >
              <div>
                <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                  Regime Tributário
                </span>
                <h3 className="font-serif font-bold text-base text-black mb-2 group-hover:underline">
                  Simples Nacional Híbrido
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Estimativa de recolhimento segregado para atividades mistas de comércio, indústria
                  e serviços.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center text-xs font-medium text-black">
                Acessar simulador{' '}
                <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Link 3: Pró-labore ou Dividendos */}
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
          </div>
        </section>

        {/* 12. BLOCO DE CHAMADA PARA CONTATO COM O ESCRITÓRIO (Ponto focal #FAB319 número 2) */}
        <section
          aria-labelledby="cta-escritorio-title"
          className="bg-neutral-950 text-white rounded-2xl p-8 md:p-12 text-center"
        >
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="inline-block border border-neutral-800 px-3 py-1 rounded text-xs uppercase tracking-wider text-neutral-400 font-mono">
              PERES PERES Consultoria e Contabilidade
            </div>

            <h2
              id="cta-escritorio-title"
              className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight"
            >
              Deseja um estudo tributário comparativo formal para sua empresa?
            </h2>

            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
              Nossa equipe estrutura pareceres contábeis detalhados, simulações de transição de
              regime e auditoria de créditos com total conformidade técnica e segurança perante a
              Receita Federal.
            </p>

            {/* Ponto focal #FAB319 número 2 */}
            <div className="pt-3 flex justify-center">
              <Button
                asChild
                size="lg"
                className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-base h-12 px-8 shadow-sm"
              >
                <Link to="/contato">Agendar Estudo com Nossa Equipe Tributária</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
