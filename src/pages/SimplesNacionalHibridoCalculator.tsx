import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SIMPLES_NACIONAL_VIGENCIA } from '@/lib/simplesData'
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
  Percent,
  TrendingDown,
  Building2,
  Receipt,
  CheckCircle2,
  Split,
  Info,
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
import { CalculatorEmailCapture } from '@/components/CalculatorEmailCapture'

// Tipos de Anexo do Simples Nacional suportados
type AnexoSimples = 'anexoI' | 'anexoII' | 'anexoIII' | 'anexoIV' | 'anexoV'

interface FaixaConfig {
  limite: number
  aliqNominal: number
  deducao: number
  // Repartição percentual dos tributos na faixa conforme Anexos I a V da LC 123/2006
  icmsShare: number // percentual da alíquota correspondente a ICMS (ex: 34% no Anexo I)
  issShare: number // percentual correspondente a ISS (ex: 33.5% a 40% nos Anexos III, IV, V)
  federaisShare: number // tributos federais (IRPJ, CSLL, PIS, COFINS, CPP)
}

// Definição das faixas dos Anexos com as percentagens legais de partilha
const TABELAS_ANEXOS: Record<
  AnexoSimples,
  { nome: string; descricao: string; temICMS: boolean; temISS: boolean; faixas: FaixaConfig[] }
> = {
  anexoI: {
    nome: 'Anexo I - Comércio',
    descricao: 'Revenda de mercadorias no varejo ou atacado (recolhimento unificado de ICMS)',
    temICMS: true,
    temISS: false,
    faixas: [
      {
        limite: 180000,
        aliqNominal: 0.04,
        deducao: 0,
        icmsShare: 0.34,
        issShare: 0,
        federaisShare: 0.66,
      },
      {
        limite: 360000,
        aliqNominal: 0.073,
        deducao: 5940,
        icmsShare: 0.34,
        issShare: 0,
        federaisShare: 0.66,
      },
      {
        limite: 720000,
        aliqNominal: 0.095,
        deducao: 13860,
        icmsShare: 0.335,
        issShare: 0,
        federaisShare: 0.665,
      },
      {
        limite: 1800000,
        aliqNominal: 0.107,
        deducao: 22500,
        icmsShare: 0.335,
        issShare: 0,
        federaisShare: 0.665,
      },
      {
        limite: 3600000,
        aliqNominal: 0.143,
        deducao: 87300,
        icmsShare: 0.335,
        issShare: 0,
        federaisShare: 0.665,
      },
      {
        limite: 4800000,
        aliqNominal: 0.19,
        deducao: 378000,
        icmsShare: 0.0,
        issShare: 0,
        federaisShare: 1.0,
      }, // Faixa 6: ICMS já recolhido por fora no regime de transição/sublimite
    ],
  },
  anexoII: {
    nome: 'Anexo II - Indústria',
    descricao: 'Fabricação, transformação e industrialização de produtos (ICMS + IPI)',
    temICMS: true,
    temISS: false,
    faixas: [
      {
        limite: 180000,
        aliqNominal: 0.045,
        deducao: 0,
        icmsShare: 0.32,
        issShare: 0,
        federaisShare: 0.68,
      },
      {
        limite: 360000,
        aliqNominal: 0.078,
        deducao: 5940,
        icmsShare: 0.32,
        issShare: 0,
        federaisShare: 0.68,
      },
      {
        limite: 720000,
        aliqNominal: 0.1,
        deducao: 13860,
        icmsShare: 0.32,
        issShare: 0,
        federaisShare: 0.68,
      },
      {
        limite: 1800000,
        aliqNominal: 0.112,
        deducao: 22500,
        icmsShare: 0.32,
        issShare: 0,
        federaisShare: 0.68,
      },
      {
        limite: 3600000,
        aliqNominal: 0.147,
        deducao: 85500,
        icmsShare: 0.32,
        issShare: 0,
        federaisShare: 0.68,
      },
      {
        limite: 4800000,
        aliqNominal: 0.3,
        deducao: 720000,
        icmsShare: 0.0,
        issShare: 0,
        federaisShare: 1.0,
      }, // Faixa 6: sublimite
    ],
  },
  anexoIII: {
    nome: 'Anexo III - Serviços em Geral',
    descricao: 'Locação, instalação, manutenção e serviços intelectuais com Fator R ≥ 28%',
    temICMS: false,
    temISS: true,
    faixas: [
      {
        limite: 180000,
        aliqNominal: 0.06,
        deducao: 0,
        icmsShare: 0,
        issShare: 0.335,
        federaisShare: 0.665,
      },
      {
        limite: 360000,
        aliqNominal: 0.112,
        deducao: 9360,
        icmsShare: 0,
        issShare: 0.335,
        federaisShare: 0.665,
      },
      {
        limite: 720000,
        aliqNominal: 0.135,
        deducao: 17640,
        icmsShare: 0,
        issShare: 0.335,
        federaisShare: 0.665,
      },
      {
        limite: 1800000,
        aliqNominal: 0.16,
        deducao: 35640,
        icmsShare: 0,
        issShare: 0.325,
        federaisShare: 0.675,
      },
      {
        limite: 3600000,
        aliqNominal: 0.21,
        deducao: 125640,
        icmsShare: 0,
        issShare: 0.325,
        federaisShare: 0.675,
      },
      {
        limite: 4800000,
        aliqNominal: 0.33,
        deducao: 648000,
        icmsShare: 0,
        issShare: 0.0,
        federaisShare: 1.0,
      }, // Faixa 6: sublimite
    ],
  },
  anexoIV: {
    nome: 'Anexo IV - Serviços Específicos',
    descricao: 'Construção civil, vigilância, limpeza e advocacia (sem CPP no DAS)',
    temICMS: false,
    temISS: true,
    faixas: [
      {
        limite: 180000,
        aliqNominal: 0.045,
        deducao: 0,
        icmsShare: 0,
        issShare: 0.445,
        federaisShare: 0.555,
      },
      {
        limite: 360000,
        aliqNominal: 0.09,
        deducao: 8100,
        icmsShare: 0,
        issShare: 0.4,
        federaisShare: 0.6,
      },
      {
        limite: 720000,
        aliqNominal: 0.102,
        deducao: 12420,
        icmsShare: 0,
        issShare: 0.4,
        federaisShare: 0.6,
      },
      {
        limite: 1800000,
        aliqNominal: 0.14,
        deducao: 39780,
        icmsShare: 0,
        issShare: 0.4,
        federaisShare: 0.6,
      },
      {
        limite: 3600000,
        aliqNominal: 0.22,
        deducao: 183780,
        icmsShare: 0,
        issShare: 0.4,
        federaisShare: 0.6,
      },
      {
        limite: 4800000,
        aliqNominal: 0.33,
        deducao: 579780,
        icmsShare: 0,
        issShare: 0.0,
        federaisShare: 1.0,
      }, // Faixa 6: sublimite
    ],
  },
  anexoV: {
    nome: 'Anexo V - Serviços Intelectuais',
    descricao: 'Serviços técnicos, consultorias e engenharia com Fator R < 28%',
    temICMS: false,
    temISS: true,
    faixas: [
      {
        limite: 180000,
        aliqNominal: 0.155,
        deducao: 0,
        icmsShare: 0,
        issShare: 0.25,
        federaisShare: 0.75,
      },
      {
        limite: 360000,
        aliqNominal: 0.18,
        deducao: 4500,
        icmsShare: 0,
        issShare: 0.23,
        federaisShare: 0.77,
      },
      {
        limite: 720000,
        aliqNominal: 0.195,
        deducao: 9900,
        icmsShare: 0,
        issShare: 0.24,
        federaisShare: 0.76,
      },
      {
        limite: 1800000,
        aliqNominal: 0.205,
        deducao: 17100,
        icmsShare: 0,
        issShare: 0.21,
        federaisShare: 0.79,
      },
      {
        limite: 3600000,
        aliqNominal: 0.23,
        deducao: 62100,
        icmsShare: 0,
        issShare: 0.235,
        federaisShare: 0.765,
      },
      {
        limite: 4800000,
        aliqNominal: 0.305,
        deducao: 540000,
        icmsShare: 0,
        issShare: 0.0,
        federaisShare: 1.0,
      }, // Faixa 6: sublimite
    ],
  },
}

// Formatador monetário BRL
function formatCurrencyBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// Converte texto digitado para número monetário
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

export default function SimplesNacionalHibridoCalculator() {
  // 1. Estado dos campos de entrada com valores padrão realistas
  const [receitaMensal, setReceitaMensal] = useState<number>(80000)
  const [receitaInput, setReceitaInput] = useState<string>('80.000,00')

  const [percentualICMS, setPercentualICMS] = useState<number>(60) // 60% mercadorias com ICMS
  const [percentualICMSInput, setPercentualICMSInput] = useState<string>('60')

  const [percentualISS, setPercentualISS] = useState<number>(40) // 40% serviços com ISS
  const [percentualISSInput, setPercentualISSInput] = useState<string>('40')

  const [anexoSelecionado, setAnexoSelecionado] = useState<AnexoSimples>('anexoI')

  // Alíquotas aplicáveis no recolhimento por fora (regime normal estadual / municipal)
  const [aliqICMSPorFora, setAliqICMSPorFora] = useState<number>(18) // ICMS estadual médio padrão (18%)
  const [aliqICMSPorForaInput, setAliqICMSPorForaInput] = useState<string>('18')

  const [aliqISSPorFora, setAliqISSPorFora] = useState<number>(3) // ISS municipal (geralmente entre 2% e 5%)
  const [aliqISSPorForaInput, setAliqISSPorForaInput] = useState<string>('3')

  // SEO: título da aba (máximo 60 caracteres) começando por "calculadora simples nacional hibrido"
  // e meta description (máximo 155 caracteres)
  useEffect(() => {
    // 59 caracteres
    const pageTitle = 'calculadora simples nacional hibrido: icms e iss | PERES'
    // 151 caracteres
    const pageDesc =
      'Compare tributar ICMS e ISS dentro ou fora do Simples Nacional em tempo real. Veja alíquotas efetivas, segregação de receitas e memória de cálculo.'

    document.title = pageTitle
    let metaDescTag = document.querySelector('meta[name="description"]')
    if (!metaDescTag) {
      metaDescTag = document.createElement('meta')
      metaDescTag.setAttribute('name', 'description')
      document.head.appendChild(metaDescTag)
    }
    metaDescTag.setAttribute('content', pageDesc)
  }, [])

  // Handlers
  const handleReceitaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseRawToNumber(e.target.value)
    setReceitaMensal(num)
    setReceitaInput(formatRawInput(num))
  }

  const handlePercentualICMSChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value.replace(/[^0-9.]/g, ''))
    if (!isNaN(val) && val >= 0 && val <= 100) {
      setPercentualICMS(val)
      setPercentualICMSInput(e.target.value)
    }
  }

  const handlePercentualISSChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value.replace(/[^0-9.]/g, ''))
    if (!isNaN(val) && val >= 0 && val <= 100) {
      setPercentualISS(val)
      setPercentualISSInput(e.target.value)
    }
  }

  const handleAliqICMSPorForaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value.replace(/[^0-9.]/g, ''))
    if (!isNaN(val) && val >= 0 && val <= 35) {
      setAliqICMSPorFora(val)
      setAliqICMSPorForaInput(e.target.value)
    }
  }

  const handleAliqISSPorForaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value.replace(/[^0-9.]/g, ''))
    if (!isNaN(val) && val >= 0 && val <= 5) {
      setAliqISSPorFora(val)
      setAliqISSPorForaInput(e.target.value)
    }
  }

  // Cálculos completos em tempo real
  const calculation = useMemo(() => {
    const hasReceita = receitaMensal > 0
    const rbt12 = receitaMensal * 12

    const anexoInfo = TABELAS_ANEXOS[anexoSelecionado]
    const faixas = anexoInfo.faixas

    // Identificar a faixa de enquadramento da empresa na tabela legal do Simples Nacional
    let faixa = faixas[0]
    let faixaNumero = 1
    for (let i = 0; i < faixas.length; i++) {
      if (rbt12 <= faixas[i].limite) {
        faixa = faixas[i]
        faixaNumero = i + 1
        break
      }
      if (i === faixas.length - 1) {
        faixa = faixas[i]
        faixaNumero = i + 1
      }
    }

    const aliqNominal = faixa.aliqNominal
    const parcelaDeducao = faixa.deducao

    // Alíquota efetiva geral do DAS na forma atual:
    // Alíquota efetiva = (RBT12 × Alíquota Nominal − Parcela a Deduzir) ÷ RBT12
    let aliqEfetivaDASGeral = 0
    if (rbt12 > 0) {
      aliqEfetivaDASGeral = (rbt12 * aliqNominal - parcelaDeducao) / rbt12
      if (aliqEfetivaDASGeral < 0) aliqEfetivaDASGeral = 0
    }

    // Repartição tributária da faixa:
    // No Anexo I e II, há percentual de ICMS; nos Anexos III, IV e V há percentual de ISS.
    // Em caso de atividade mista avaliada com a calculadora, calculamos a fração de ICMS e ISS
    // contida no DAS com base na repartição legal do anexo ou proporção ponderada das receitas.
    const icmsShareLegal = faixa.icmsShare
    const issShareLegal = faixa.issShare
    const federaisShareLegal = faixa.federaisShare

    // Parcela de ICMS e ISS dentro da alíquota efetiva do DAS
    const aliqEfetivaICMSNoDAS = aliqEfetivaDASGeral * icmsShareLegal
    const aliqEfetivaISSNoDAS = aliqEfetivaDASGeral * issShareLegal
    const aliqEfetivaFederaisNoDAS = aliqEfetivaDASGeral * federaisShareLegal

    // Volumes financeiros de receita
    const pICMS = Math.min(100, Math.max(0, percentualICMS)) / 100
    const pISS = Math.min(100, Math.max(0, percentualISS)) / 100

    const receitaMercadoriasICMS = receitaMensal * pICMS
    const receitaServicosISS = receitaMensal * pISS
    const receitaOutras = Math.max(0, receitaMensal - (receitaMercadoriasICMS + receitaServicosISS))

    // ----------------------------------------------------
    // CENÁRIO 1: FORMA ATUAL (TUDO DENTRO DO SIMPLES / DAS)
    // ----------------------------------------------------
    // Todos os tributos recolhidos no DAS integralmente sobre a receita total
    const dasTotalMensal = receitaMensal * aliqEfetivaDASGeral
    const dasTotalAnual = dasTotalMensal * 12

    // Parcela estimada correspondente a ICMS, ISS e Federais dentro do DAS atual
    // Ponderado pela natureza da receita digitada
    const valorICMSNoDASAtual = anexoInfo.temICMS
      ? receitaMercadoriasICMS * aliqEfetivaICMSNoDAS
      : receitaMercadoriasICMS * (aliqEfetivaDASGeral * 0.335) // referência aproximada se mista
    const valorISSNoDASAtual = anexoInfo.temISS
      ? receitaServicosISS * aliqEfetivaISSNoDAS
      : receitaServicosISS * (aliqEfetivaDASGeral * 0.335)
    const valorFederaisNoDASAtual = Math.max(
      0,
      dasTotalMensal - (valorICMSNoDASAtual + valorISSNoDASAtual),
    )

    // ----------------------------------------------------
    // CENÁRIO 2: HÍBRIDO (ICMS E ISS RECOLHIDOS POR FORA)
    // ----------------------------------------------------
    // Quando a empresa opta ou é obrigada a recolher ICMS e ISS por fora (ex: sublimite de R$ 3,6M,
    // benefícios estaduais com crédito presumido, incentivo municipal ou segregação de receitas do art. 18):
    // 1) A alíquota do Simples Nacional que incide sobre a receita segregada expurga a fração do ICMS/ISS.
    // O DAS restante é composto estritamente pelos tributos federais (IRPJ, CSLL, PIS, COFINS, CPP).
    const aliqEfetivaDASSegregadoFederais =
      aliqEfetivaDASGeral * (1 - (icmsShareLegal + issShareLegal))

    // DAS Federal mensal recalculado:
    // As receitas de ICMS e ISS têm a incidência apenas dos tributos federais no DAS
    const dasFederalMensal = receitaMensal * aliqEfetivaDASSegregadoFederais

    // 2) Recolhimento do ICMS por fora:
    // Alíquota estadual informada incidente sobre a base de mercadorias
    const taxaICMSFora = (aliqICMSPorFora || 0) / 100
    const icmsPorForaMensal = receitaMercadoriasICMS * taxaICMSFora

    // 3) Recolhimento do ISS por fora:
    // Alíquota municipal informada incidente sobre a base de serviços
    const taxaISSFora = (aliqISSPorFora || 0) / 100
    const issPorForaMensal = receitaServicosISS * taxaISSFora

    // Custo tributário total do cenário Híbrido
    const totalTributosHibridoMensal = dasFederalMensal + icmsPorForaMensal + issPorForaMensal
    const totalTributosHibridoAnual = totalTributosHibridoMensal * 12

    // Alíquota efetiva global no cenário híbrido
    const aliqEfetivaHibridoGlobal = hasReceita
      ? (totalTributosHibridoMensal / receitaMensal) * 100
      : 0

    // ----------------------------------------------------
    // COMPARAÇÃO E ANÁLISE DE VANTAGEM
    // ----------------------------------------------------
    const diferencaMensal = Math.abs(dasTotalMensal - totalTributosHibridoMensal)
    const diferencaAnual = diferencaMensal * 12

    let cenarioMaisVantajoso: 'dentro' | 'fora' | 'empate' = 'empate'
    if (dasTotalMensal < totalTributosHibridoMensal) {
      cenarioMaisVantajoso = 'dentro'
    } else if (totalTributosHibridoMensal < dasTotalMensal) {
      cenarioMaisVantajoso = 'fora'
    }

    const economiaPercentual =
      dasTotalMensal > 0
        ? (Math.abs(dasTotalMensal - totalTributosHibridoMensal) / dasTotalMensal) * 100
        : 0

    return {
      hasReceita,
      rbt12,
      faixaNumero,
      aliqNominal,
      parcelaDeducao,
      aliqEfetivaDASGeral,
      icmsShareLegal,
      issShareLegal,
      federaisShareLegal,
      aliqEfetivaICMSNoDAS,
      aliqEfetivaISSNoDAS,
      aliqEfetivaFederaisNoDAS,
      aliqEfetivaDASSegregadoFederais,
      receitaMercadoriasICMS,
      receitaServicosISS,
      receitaOutras,
      // Cenário 1
      dasTotalMensal,
      dasTotalAnual,
      valorICMSNoDASAtual,
      valorISSNoDASAtual,
      valorFederaisNoDASAtual,
      // Cenário 2
      dasFederalMensal,
      icmsPorForaMensal,
      issPorForaMensal,
      totalTributosHibridoMensal,
      totalTributosHibridoAnual,
      aliqEfetivaHibridoGlobal,
      // Comparativo
      diferencaMensal,
      diferencaAnual,
      cenarioMaisVantajoso,
      economiaPercentual,
    }
  }, [
    receitaMensal,
    percentualICMS,
    percentualISS,
    anexoSelecionado,
    aliqICMSPorFora,
    aliqISSPorFora,
  ])

  // FAQ estática com CINCO perguntas e respostas diretas sobre Simples Nacional Híbrido
  const faqs = [
    {
      q: 'O que caracteriza a tributação do Simples Nacional híbrido?',
      a: 'O Simples Nacional híbrido ocorre quando a empresa recolhe os tributos federais unificados na guia DAS e, simultaneamente, apura e recolhe o ICMS (estadual) ou o ISS (municipal) por fora, aplicando as regras gerais do regime normal estadual ou municipal.',
    },
    {
      q: 'Quando a segregação de ICMS e ISS fora do DAS é obrigatória?',
      a: 'A segregação é mandatória quando a empresa ultrapassa o sublimite estadual de faturamento de R$ 3,6 milhões no ano-calendário, ou em regimes específicos de substituição tributária (ICMS-ST), isenções locais concedidas pelo ente federativo ou operações com tributação monofásica.',
    },
    {
      q: 'Vale a pena tirar o ICMS e o ISS do DAS voluntariamente?',
      a: 'Geralmente não vale a pena para o comércio ou serviço padrão, pois as alíquotas normais de ICMS (17% a 22%) e ISS (2% a 5%) costumam ser superiores à parcela embutida no DAS (que varia de 1,2% a 4,5%). A vantagem surge quando o cliente exige crédito integral de ICMS ou quando há incentivos fiscais estaduais com crédito outorgado.',
    },
    {
      q: 'Como fica o cálculo do DAS sobre a receita segregada?',
      a: 'A receita da operação segregada permanece integrando o cálculo da alíquota efetiva geral (para fixação da faixa do Simples), mas, no momento de gerar o PGDAS-D, o sistema desconsidera a parcela percentual destinada ao ICMS ou ao ISS, cobrando apenas a fração dos tributos federais.',
    },
    {
      q: 'Tirar o ICMS do Simples permite transferir crédito integral ao comprador?',
      a: 'Sim. Ao recolher o ICMS por fora pelo regime normal (débito e crédito), as notas fiscais emitidas passam a destacar a alíquota cheia do ICMS (12%, 18% etc.), permitindo que indústrias e clientes do Lucro Real se apropriem integralmente do crédito tributário da mercadoria.',
    },
  ]

  // Dados estruturados JSON-LD (SoftwareApplication, BreadcrumbList e FAQPage)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://peresperes.com.br/calculadoras/simples-nacional-hibrido#software',
        name: 'Calculadora Simples Nacional Híbrido: ICMS e ISS no DAS ou por Fora',
        url: 'https://peresperes.com.br/calculadoras/simples-nacional-hibrido',
        applicationCategory: 'FinancialApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        description:
          'Ferramenta para cálculo e comparação em tempo real entre recolher ICMS e ISS dentro do DAS ou por fora no Simples Nacional.',
        provider: {
          '@type': 'AccountingService',
          name: 'PERES PERES Consultoria e Contabilidade',
          url: 'https://peresperes.com.br',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://peresperes.com.br/calculadoras/simples-nacional-hibrido#breadcrumb',
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
            name: 'Simples Nacional Híbrido',
            item: 'https://peresperes.com.br/calculadoras/simples-nacional-hibrido',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://peresperes.com.br/calculadoras/simples-nacional-hibrido#faq',
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
        {/* 1. TRILHA: Início > Calculadoras > Simples Nacional Híbrido */}
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
          <span className="text-black font-medium">Simples Nacional Híbrido</span>
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
            Regime Tributário • Segregação de Receitas
          </div>

          {/* 2. TÍTULO PRINCIPAL (H1, EXATO): "Simples Nacional híbrido, vale a pena tirar ICMS e ISS do DAS" */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-black mb-5 leading-tight">
            Simples Nacional híbrido, vale a pena tirar ICMS e ISS do DAS
          </h1>

          {/* 3. PARÁGRAFO CURTO DE DUAS LINHAS explicando que a ferramenta compara o recolhimento dentro do DAS com o recolhimento por fora */}
          <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
            Esta ferramenta compara o recolhimento conjunto de ICMS e ISS na guia unificada do DAS
            com o recolhimento segregado por fora, apurando alíquotas efetivas, impacto na base de
            cálculo e economia líquida.
          </p>
        </header>

        {/* 4. BLOCO DA CALCULADORA com resultado em tempo real */}
        <section
          aria-labelledby="calculadora-hibrido-heading"
          className="border border-neutral-200 bg-white rounded-xl shadow-sm p-6 md:p-8 mb-12"
        >
          <div className="flex items-center justify-between pb-6 border-b border-neutral-200 mb-6">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-neutral-900" />
              <h2
                id="calculadora-hibrido-heading"
                className="text-xl md:text-2xl font-serif font-bold text-black"
              >
                Simulação em Tempo Real
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
              LC 123/2006 • Resolução CGSN
            </span>
          </div>

          {/* Campos de entrada */}
          <div className="space-y-6 mb-8">
            {/* Campo 1: Receita bruta mensal */}
            <div>
              <label
                htmlFor="input-receita"
                className="block text-sm font-semibold text-neutral-900 mb-1.5"
              >
                Receita bruta mensal estimada
              </label>
              <p className="text-xs text-neutral-500 mb-2">
                Faturamento mensal da empresa (utilizado para estimar a base anual RBT12 de 12
                meses).
              </p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-500 font-mono">
                  R$
                </span>
                <Input
                  id="input-receita"
                  type="text"
                  inputMode="numeric"
                  value={receitaInput}
                  onChange={handleReceitaChange}
                  placeholder="0,00"
                  className="pl-10 font-mono text-base border-neutral-300 focus-visible:ring-black"
                />
              </div>
            </div>

            {/* Campo 4: Anexo do Simples em que a empresa está enquadrada (Anexos I a V) */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-1.5">
                Anexo do Simples Nacional de enquadramento (LC 123/2006)
              </label>
              <p className="text-xs text-neutral-500 mb-2">
                Selecione o anexo principal da atividade para carregar as faixas e a repartição dos
                tributos.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {(Object.keys(TABELAS_ANEXOS) as AnexoSimples[]).map((chave) => {
                  const anexo = TABELAS_ANEXOS[chave]
                  const isSelected = anexoSelecionado === chave
                  return (
                    <button
                      key={chave}
                      type="button"
                      onClick={() => setAnexoSelecionado(chave)}
                      className={`text-left p-3 rounded-lg border text-xs transition-all ${
                        isSelected
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                          : 'border-neutral-200 bg-white hover:border-neutral-400 text-neutral-800'
                      }`}
                    >
                      <div className="font-semibold text-sm mb-1">{anexo.nome}</div>
                      <div
                        className={`line-clamp-2 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}
                      >
                        {anexo.descricao}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Campos 2 e 3: Percentuais de receita sujeitos a ICMS e ISS */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="input-perc-icms"
                  className="block text-sm font-semibold text-neutral-900 mb-1.5"
                >
                  Percentual da receita com ICMS (%)
                </label>
                <p className="text-xs text-neutral-500 mb-2">
                  Parcela do faturamento correspondente a mercadorias/produtos sujeitos a ICMS.
                </p>
                <div className="relative">
                  <Input
                    id="input-perc-icms"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={percentualICMSInput}
                    onChange={handlePercentualICMSChange}
                    className="pr-8 font-mono text-base border-neutral-300 focus-visible:ring-black"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-500 font-mono">
                    %
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 mt-1 font-mono">
                  Base monetária estimada: {formatCurrencyBRL(calculation.receitaMercadoriasICMS)}
                </div>
              </div>

              <div>
                <label
                  htmlFor="input-perc-iss"
                  className="block text-sm font-semibold text-neutral-900 mb-1.5"
                >
                  Percentual da receita com ISS (%)
                </label>
                <p className="text-xs text-neutral-500 mb-2">
                  Parcela do faturamento correspondente a serviços municipais sujeitos a ISS.
                </p>
                <div className="relative">
                  <Input
                    id="input-perc-iss"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={percentualISSInput}
                    onChange={handlePercentualISSChange}
                    className="pr-8 font-mono text-base border-neutral-300 focus-visible:ring-black"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-500 font-mono">
                    %
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 mt-1 font-mono">
                  Base monetária estimada: {formatCurrencyBRL(calculation.receitaServicosISS)}
                </div>
              </div>
            </div>

            {/* Campo 5: Alíquotas de ICMS e ISS aplicáveis por fora */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
              <div>
                <label
                  htmlFor="input-aliq-icms-fora"
                  className="block text-sm font-semibold text-neutral-900 mb-1.5"
                >
                  Alíquota de ICMS aplicável por fora (%)
                </label>
                <p className="text-xs text-neutral-500 mb-2">
                  Alíquota do regime estadual (débito/crédito ou benefício presumido do seu Estado).
                </p>
                <div className="relative">
                  <Input
                    id="input-aliq-icms-fora"
                    type="number"
                    min="0"
                    max="35"
                    step="0.5"
                    value={aliqICMSPorForaInput}
                    onChange={handleAliqICMSPorForaChange}
                    className="pr-8 font-mono text-base border-neutral-300 focus-visible:ring-black"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-500 font-mono">
                    %
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="input-aliq-iss-fora"
                  className="block text-sm font-semibold text-neutral-900 mb-1.5"
                >
                  Alíquota de ISS aplicável por fora (%)
                </label>
                <p className="text-xs text-neutral-500 mb-2">
                  Alíquota fixada pelo município sede da prestação (Lei Complementar 116/2003: 2% a
                  5%).
                </p>
                <div className="relative">
                  <Input
                    id="input-aliq-iss-fora"
                    type="number"
                    min="0"
                    max="5"
                    step="0.5"
                    value={aliqISSPorForaInput}
                    onChange={handleAliqISSPorForaChange}
                    className="pr-8 font-mono text-base border-neutral-300 focus-visible:ring-black"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-500 font-mono">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. RESULTADO com alíquotas efetivas, valores mensal/anual e diferença */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                Comparativo de Cenários em Tempo Real
              </span>
              <span className="text-xs font-mono bg-neutral-200 text-neutral-800 px-2.5 py-0.5 rounded">
                Faixa {calculation.faixaNumero} do{' '}
                {TABELAS_ANEXOS[anexoSelecionado].nome.split(' - ')[0]}
              </span>
            </div>

            {/* Destaque do Cenário Mais Vantajoso */}
            <div className="p-4 rounded-lg border mb-6 bg-white border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase text-neutral-500 block mb-1">
                  Veredito da Simulação
                </span>
                <div className="flex items-center gap-2">
                  {/* Ponto focal com amarelo #FAB319 */}
                  <span className="inline-block bg-[#FAB319] text-black font-serif font-bold text-lg md:text-xl px-3 py-1 rounded">
                    {calculation.cenarioMaisVantajoso === 'dentro'
                      ? 'Mais vantajoso: Manter ICMS e ISS DENTRO do DAS'
                      : calculation.cenarioMaisVantajoso === 'fora'
                        ? 'Mais vantajoso: Recolher ICMS e ISS FORA do DAS (Híbrido)'
                        : 'Cenários com carga tributária equivalente'}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 mt-2">
                  {calculation.cenarioMaisVantajoso === 'dentro'
                    ? 'O recolhimento unificado no DAS apresenta menor custo total face às alíquotas por fora informadas.'
                    : calculation.cenarioMaisVantajoso === 'fora'
                      ? 'A segregação das receitas e recolhimento por fora reduz o desembolso tributário total da operação.'
                      : 'A carga tributária mensal entre ambos os modelos é idêntica.'}
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 w-full sm:w-auto">
                <span className="text-xs text-neutral-500 block">Diferença apurada</span>
                <div className="font-mono font-bold text-xl md:text-2xl text-black">
                  {formatCurrencyBRL(calculation.diferencaMensal)}
                  <span className="text-xs font-normal text-neutral-500"> /mês</span>
                </div>
                <span className="text-xs font-mono text-neutral-600 block mt-0.5">
                  {formatCurrencyBRL(calculation.diferencaAnual)} ao ano
                </span>
              </div>
            </div>

            {/* Grid Comparativo dos Dois Cenários */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Cenário 1: Forma Atual (Tudo Dentro do DAS) */}
              <div
                className={`p-5 rounded-xl border bg-white transition-all ${
                  calculation.cenarioMaisVantajoso === 'dentro'
                    ? 'border-neutral-900 shadow-sm ring-1 ring-neutral-900'
                    : 'border-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                    Cenário 01 • Atual
                  </span>
                  {calculation.cenarioMaisVantajoso === 'dentro' && (
                    <span className="text-[11px] bg-neutral-900 text-white px-2 py-0.5 rounded font-medium">
                      Menor Custo
                    </span>
                  )}
                </div>
                <h3 className="font-serif font-bold text-lg text-black mb-1">
                  ICMS e ISS Dentro do DAS
                </h3>
                <p className="text-xs text-neutral-600 mb-4">
                  Recolhimento integral e simplificado pela guia única do Simples Nacional.
                </p>

                <div className="space-y-3 pt-3 border-t border-neutral-100">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-neutral-600">Alíquota efetiva do DAS:</span>
                    <span className="font-mono font-bold text-base text-black">
                      {(calculation.aliqEfetivaDASGeral * 100).toFixed(2)}%
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-neutral-600">Valor mensal do DAS:</span>
                    <span className="font-mono font-bold text-lg text-black">
                      {formatCurrencyBRL(calculation.dasTotalMensal)}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline text-xs text-neutral-500 pt-1 border-t border-dashed border-neutral-150">
                    <span>Projeção anual (12 meses):</span>
                    <span className="font-mono font-semibold text-neutral-800">
                      {formatCurrencyBRL(calculation.dasTotalAnual)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cenário 2: Híbrido (ICMS e ISS Por Fora) */}
              <div
                className={`p-5 rounded-xl border bg-white transition-all ${
                  calculation.cenarioMaisVantajoso === 'fora'
                    ? 'border-neutral-900 shadow-sm ring-1 ring-neutral-900'
                    : 'border-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                    Cenário 02 • Híbrido
                  </span>
                  {calculation.cenarioMaisVantajoso === 'fora' && (
                    <span className="text-[11px] bg-neutral-900 text-white px-2 py-0.5 rounded font-medium">
                      Menor Custo
                    </span>
                  )}
                </div>
                <h3 className="font-serif font-bold text-lg text-black mb-1">
                  ICMS e ISS Por Fora do DAS
                </h3>
                <p className="text-xs text-neutral-600 mb-4">
                  DAS apenas com tributos federais + guias estaduais e municipais por fora.
                </p>

                <div className="space-y-3 pt-3 border-t border-neutral-100">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-neutral-600">Alíquota efetiva global:</span>
                    <span className="font-mono font-bold text-base text-black">
                      {calculation.aliqEfetivaHibridoGlobal.toFixed(2)}%
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-neutral-600">Custo tributário mensal total:</span>
                    <span className="font-mono font-bold text-lg text-black">
                      {formatCurrencyBRL(calculation.totalTributosHibridoMensal)}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline text-xs text-neutral-500 pt-1 border-t border-dashed border-neutral-150">
                    <span>Projeção anual (12 meses):</span>
                    <span className="font-mono font-semibold text-neutral-800">
                      {formatCurrencyBRL(calculation.totalTributosHibridoAnual)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Composição detalhada do cenário Híbrido */}
            <div className="mt-4 p-4 rounded-lg bg-neutral-100 border border-neutral-200">
              <span className="text-xs font-mono uppercase text-neutral-700 block mb-2 font-semibold">
                Detalhamento dos recolhimentos no cenário Híbrido:
              </span>
              <div className="grid sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded border border-neutral-200">
                  <span className="text-neutral-500 block mb-0.5">1. DAS Federal residual</span>
                  <div className="font-mono font-bold text-sm text-black">
                    {formatCurrencyBRL(calculation.dasFederalMensal)}
                  </div>
                  <span className="text-[10px] text-neutral-500">
                    Alíq: {(calculation.aliqEfetivaDASSegregadoFederais * 100).toFixed(2)}% s/ total
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded border border-neutral-200">
                  <span className="text-neutral-500 block mb-0.5">2. ICMS recolhido por fora</span>
                  <div className="font-mono font-bold text-sm text-black">
                    {formatCurrencyBRL(calculation.icmsPorForaMensal)}
                  </div>
                  <span className="text-[10px] text-neutral-500">
                    Alíq: {aliqICMSPorFora}% s/{' '}
                    {formatCurrencyBRL(calculation.receitaMercadoriasICMS)}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded border border-neutral-200">
                  <span className="text-neutral-500 block mb-0.5">3. ISS recolhido por fora</span>
                  <div className="font-mono font-bold text-sm text-black">
                    {formatCurrencyBRL(calculation.issPorForaMensal)}
                  </div>
                  <span className="text-[10px] text-neutral-500">
                    Alíq: {aliqISSPorFora}% s/ {formatCurrencyBRL(calculation.receitaServicosISS)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 6. MEMÓRIA DE CÁLCULO ABERTA linha por linha com os números digitados */}
          <div className="border border-neutral-200 rounded-xl p-6 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <FileCheck2 className="h-5 w-5 text-neutral-900" />
              <h3 className="font-serif font-bold text-lg text-black">
                Memória de Cálculo Aberta (Passo a Passo Auditável)
              </h3>
            </div>
            <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
              Confira os parâmetros aritméticos aplicados para auditar a conta na ponta do lápis,
              conforme a Lei Complementar nº 123/2006 e resoluções do CGSN.
            </p>

            <div className="space-y-6">
              {/* Etapa 1 */}
              <div className="border-l-2 border-neutral-900 pl-4 space-y-1.5">
                <span className="text-xs font-mono font-bold uppercase text-neutral-700">
                  Passo 1 • Apuração da Alíquota Efetiva Geral do DAS
                </span>
                <p className="text-xs text-neutral-600">
                  A base de cálculo é apurada com a receita dos últimos 12 meses (RBT12 ={' '}
                  {formatCurrencyBRL(calculation.rbt12)}), enquadrando a empresa na Faixa{' '}
                  {calculation.faixaNumero} do {TABELAS_ANEXOS[anexoSelecionado].nome}.
                </p>
                <div className="bg-neutral-50 p-3 rounded font-mono text-xs text-neutral-800 space-y-1 border border-neutral-200">
                  <div>
                    • Alíquota nominal da faixa: {(calculation.aliqNominal * 100).toFixed(2)}%
                  </div>
                  <div>
                    • Parcela a deduzir da faixa: {formatCurrencyBRL(calculation.parcelaDeducao)}
                  </div>
                  <div className="pt-1 text-black font-semibold">
                    • Fórmula: (RBT12 × Alíq. Nominal − Parcela) ÷ RBT12
                  </div>
                  <div>
                    • Aplicação: ({formatCurrencyBRL(calculation.rbt12)} ×{' '}
                    {(calculation.aliqNominal * 100).toFixed(2)}% −{' '}
                    {formatCurrencyBRL(calculation.parcelaDeducao)}) ÷{' '}
                    {formatCurrencyBRL(calculation.rbt12)}
                  </div>
                  <div className="text-neutral-950 font-bold pt-1">
                    = Alíquota Efetiva do DAS: {(calculation.aliqEfetivaDASGeral * 100).toFixed(4)}%
                  </div>
                </div>
              </div>

              {/* Etapa 2 */}
              <div className="border-l-2 border-neutral-900 pl-4 space-y-1.5">
                <span className="text-xs font-mono font-bold uppercase text-neutral-700">
                  Passo 2 • Composição Interna do DAS e Parcela de ICMS / ISS
                </span>
                <p className="text-xs text-neutral-600">
                  A tabela legal estabelece o rateio da alíquota efetiva entre os tributos federais,
                  estaduais e municipais:
                </p>
                <div className="bg-neutral-50 p-3 rounded font-mono text-xs text-neutral-800 space-y-1 border border-neutral-200">
                  <div>
                    • Parcela de Tributos Federais (IRPJ, CSLL, PIS, COFINS, CPP):{' '}
                    {(calculation.federaisShareLegal * 100).toFixed(2)}%
                  </div>
                  <div>
                    • Parcela de ICMS legal na faixa:{' '}
                    {(calculation.icmsShareLegal * 100).toFixed(2)}%
                  </div>
                  <div>
                    • Parcela de ISS legal na faixa: {(calculation.issShareLegal * 100).toFixed(2)}%
                  </div>
                  <div className="pt-1 border-t border-neutral-200">
                    • Alíquota efetiva dos federais no DAS:{' '}
                    {(
                      calculation.aliqEfetivaDASGeral *
                      calculation.federaisShareLegal *
                      100
                    ).toFixed(4)}
                    %
                  </div>
                  <div>
                    • Alíquota efetiva do ICMS no DAS:{' '}
                    {(calculation.aliqEfetivaICMSNoDAS * 100).toFixed(4)}%
                  </div>
                  <div>
                    • Alíquota efetiva do ISS no DAS:{' '}
                    {(calculation.aliqEfetivaISSNoDAS * 100).toFixed(4)}%
                  </div>
                </div>
              </div>

              {/* Etapa 3 */}
              <div className="border-l-2 border-neutral-900 pl-4 space-y-1.5">
                <span className="text-xs font-mono font-bold uppercase text-neutral-700">
                  Passo 3 • Segregação de Receitas e Recálculo da Base (Cenário Híbrido)
                </span>
                <p className="text-xs text-neutral-600">
                  Ao retirar o ICMS e o ISS do DAS, a base do Simples passa a tributar apenas a
                  parcela federal sobre o faturamento total:
                </p>
                <div className="bg-neutral-50 p-3 rounded font-mono text-xs text-neutral-800 space-y-1 border border-neutral-200">
                  <div>
                    • Receita de ICMS ({percentualICMS}%):{' '}
                    {formatCurrencyBRL(calculation.receitaMercadoriasICMS)}
                  </div>
                  <div>
                    • Receita de ISS ({percentualISS}%):{' '}
                    {formatCurrencyBRL(calculation.receitaServicosISS)}
                  </div>
                  <div>
                    • DAS Federal residual: {formatCurrencyBRL(receitaMensal)} ×{' '}
                    {(calculation.aliqEfetivaDASSegregadoFederais * 100).toFixed(4)}% ={' '}
                    {formatCurrencyBRL(calculation.dasFederalMensal)}
                  </div>
                  <div>
                    • ICMS por fora: {formatCurrencyBRL(calculation.receitaMercadoriasICMS)} ×{' '}
                    {aliqICMSPorFora}% = {formatCurrencyBRL(calculation.icmsPorForaMensal)}
                  </div>
                  <div>
                    • ISS por fora: {formatCurrencyBRL(calculation.receitaServicosISS)} ×{' '}
                    {aliqISSPorFora}% = {formatCurrencyBRL(calculation.issPorForaMensal)}
                  </div>
                  <div className="text-neutral-950 font-bold pt-1 border-t border-neutral-200">
                    = Custo Total Híbrido: {formatCurrencyBRL(calculation.dasFederalMensal)} +{' '}
                    {formatCurrencyBRL(calculation.icmsPorForaMensal)} +{' '}
                    {formatCurrencyBRL(calculation.issPorForaMensal)} ={' '}
                    {formatCurrencyBRL(calculation.totalTributosHibridoMensal)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Captura de e-mail */}
          <CalculatorEmailCapture calculatorName="Calculadora Simples Nacional Híbrido" />
        </section>

        {/* 7. TEXTO DE APROFUNDAMENTO em HTML estático com os subtítulos exigidos na ORDEM EXATA */}
        <article className="prose prose-neutral max-w-none mb-14 space-y-10">
          {/* Subtítulo 1 */}
          <section aria-labelledby="o-que-e-simples-hibrido">
            <h2
              id="o-que-e-simples-hibrido"
              className="text-2xl md:text-3xl font-serif font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              o que é o Simples Nacional híbrido e por que ele existe
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                O modelo informalmente denominado <strong>Simples Nacional híbrido</strong> consiste
                na coexistência de regimes tributários para uma mesma pessoa jurídica: enquanto os
                tributos federais (IRPJ, CSLL, PIS, COFINS e, a depender do anexo, a Contribuição
                Patronal Previdenciária) continuam a ser apurados e recolhidos de forma unificada
                pelo Documento de Arrecadação do Simples Nacional (DAS), o ICMS (imposto sobre
                circulação de mercadorias, estadual) ou o ISS (imposto sobre serviços, municipal)
                passam a ser recolhidos por fora do sistema integrado.
              </p>
              <p>
                Esse mecanismo existe na arquitetura tributária brasileira por duas razões
                fundamentais: primeiro, para acomodar a autonomia federativa de estados e
                municípios, que possuem regras de sublimites de receita e benefícios específicos;
                segundo, para permitir que empresas em crescimento gradual ou que atuam em cadeias
                produtivas complexas consigam se relacionar comercialmente com grandes clientes sem
                sofrer as travas creditícias impostas pelo Simples padrão.
              </p>
            </div>
          </section>

          {/* Subtítulo 2 */}
          <section aria-labelledby="o-que-mudou-com-a-segregacao">
            <h2
              id="o-que-mudou-com-a-segregacao"
              className="text-2xl md:text-3xl font-serif font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              o que mudou com a segregação de receitas de ICMS e ISS
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                Com a evolução da Lei Complementar nº 123/2006 e a consolidação das resoluções do
                Comitê Gestor do Simples Nacional (CGSN), a segregação de receitas deixou de ser uma
                exceção obscura e passou a dispor de parametrização clara no Programa Gerador do DAS
                (PGDAS-D). A empresa informa detalhadamente quais parcelas de seu faturamento
                decorrem de mercadorias com isenção estadual, imunidade, substituição tributária
                (ICMS-ST) ou recolhimento normal por fora dos sublimites.
              </p>
              <p>
                A grande mudança prática está na fórmula de apuração: ao segregar as receitas de
                ICMS ou ISS, a alíquota nominal do Simples é expurgada do percentual correspondente
                àquele tributo estadual ou municipal na respectiva faixa, recalculando a guia
                unificada apenas para os tributos federais. O imposto estadual ou municipal passa
                então a seguir a escrituração fiscal tradicional (Sped Fiscal, EFD-ICMS/IPI ou
                declarações do ISS municipal), com guias próprias (DARE, DAE, GNRE ou DAM).
              </p>
            </div>
          </section>

          {/* Subtítulo 3 */}
          <section aria-labelledby="quem-costuma-ganhar-e-perder">
            <h2
              id="quem-costuma-ganhar-e-perder"
              className="text-2xl md:text-3xl font-serif font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              quem costuma ganhar e quem costuma perder
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                A segregação do ICMS e do ISS por fora do DAS não é uma solução neutra; ela produz
                vencedores e perdedores evidentes a depender do perfil operacional e da clientela:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 my-4">
                <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                  <h3 className="font-serif font-bold text-base text-black mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-neutral-800" />
                    Quem costuma ganhar
                  </h3>
                  <ul className="text-xs text-neutral-700 space-y-2 leading-relaxed">
                    <li>
                      <strong>Empresas B2B que vendem para o Lucro Real:</strong> podem transferir
                      crédito integral de ICMS ao comprador, tornando seus produtos competitivos.
                    </li>
                    <li>
                      <strong>Atividades com créditos presumidos estaduais:</strong> empresas
                      situadas em estados que concedem incentivos fiscais de ICMS com carga efetiva
                      reduzida (ex.: 1% a 3%) contra os 3,5% a 4% do Simples.
                    </li>
                    <li>
                      <strong>Empresas com produtos no ICMS-ST ou Monofásicos:</strong> deixam de
                      recolher duas vezes o imposto que já foi retido na indústria.
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                  <h3 className="font-serif font-bold text-base text-black mb-2 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-neutral-800" />
                    Quem costuma perder
                  </h3>
                  <ul className="text-xs text-neutral-700 space-y-2 leading-relaxed">
                    <li>
                      <strong>Comércio varejista que vende para o consumidor final (B2C):</strong> o
                      cliente pessoa física não aproveita crédito tributário, e a alíquota cheia do
                      ICMS (18% a 22%) eleva dramaticamente o preço final.
                    </li>
                    <li>
                      <strong>Prestadores de serviço puro com margens elevadas:</strong> pagar o ISS
                      de 5% por fora somado aos federais do DAS quase sempre resulta em carga global
                      superior ao Anexo III padrão.
                    </li>
                    <li>
                      <strong>Empresas com baixa estrutura administrativa:</strong> o custo contábil
                      e a complexidade de entregar Sped Fiscal, GIA e conciliações anulam qualquer
                      economia fiscal pequena.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Subtítulo 4 */}
          <section aria-labelledby="creditos-de-icms-para-o-cliente">
            <h2
              id="creditos-de-icms-para-o-cliente"
              className="text-2xl md:text-3xl font-serif font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              o efeito no crédito de ICMS do cliente da empresa
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                No regime tradicional do Simples Nacional, quando uma microempresa ou empresa de
                pequeno porte comercializa mercadorias tributadas para uma indústria ou comércio
                enquadrado no Lucro Presumido ou Lucro Real, o comprador só tem direito a se
                creditar do percentual exato de ICMS informado no campo de dados adicionais da nota
                fiscal (geralmente entre 1,25% e 3,95%, conforme a faixa do Anexo I).
              </p>
              <p>
                Esse repasse reduzido de crédito atua como uma barreira comercial: muitas indústrias
                e redes corporativas recusam fornecedores do Simples porque comprar deles implica
                perder a maior parte do crédito de ICMS (que seria de 12%, 18% ou 20% no regime
                normal).
              </p>
              <p>
                Ao adotar a tributação híbrida com o ICMS recolhido por fora pelo regime normal de
                débito e crédito,{' '}
                <strong>
                  a empresa do Simples passa a emitir notas com destaque regular do ICMS à alíquota
                  cheia estadual
                </strong>
                . O cliente passa a se creditar integralmente do imposto, eliminando a desvantagem
                competitiva nas negociações com grandes compradores corporativos.
              </p>
            </div>
          </section>

          {/* Subtítulo 5: com PELO MENOS QUATRO exemplos práticos e o efeito de cada um */}
          <section aria-labelledby="erros-comuns-avaliacao-hibrido">
            <h2
              id="erros-comuns-avaliacao-hibrido"
              className="text-2xl md:text-3xl font-serif font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              erros comuns na avaliação do híbrido
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                A decisão de retirar tributos do DAS é repleta de armadilhas fiscais. Analisar
                apenas a alíquota nominal sem auditar a cadeia operacional costuma gerar prejuízos
                expressivos. Abaixo estão quatro erros práticos frequentes e seus respectivos
                efeitos:
              </p>

              <div className="space-y-4 my-6">
                {/* Erro 1 */}
                <div className="border border-neutral-200 rounded-lg p-5 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-semibold text-neutral-800">
                      Erro 01
                    </span>
                    <h3 className="font-serif font-bold text-base text-black">
                      Comparar a alíquota cheia do ICMS (18%) sem contabilizar créditos de entrada
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-2">
                    O empresário conclui apressadamente que pagar 18% de ICMS por fora é inviável
                    quando comparado aos 3,5% do DAS, esquecendo que no regime por fora o ICMS é
                    não-cumulativo (débito sobre saídas menos créditos sobre compras de insumos e
                    mercadorias).
                  </p>
                  <p className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded border border-neutral-200">
                    <strong>Efeito prático:</strong> A empresa descarta precipitadamente uma opção
                    que poderia ser vantajosa caso possuísse alto volume de compras tributadas com
                    créditos para compensação, perdendo competitividade frente a concorrentes.
                  </p>
                </div>

                {/* Erro 2 */}
                <div className="border border-neutral-200 rounded-lg p-5 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-semibold text-neutral-800">
                      Erro 02
                    </span>
                    <h3 className="font-serif font-bold text-base text-black">
                      Ignorar o custo das obrigações acessórias do regime normal
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-2">
                    Acreditar que recolher ICMS por fora envolve apenas emitir uma guia a mais no
                    mês, desconsiderando a obrigatoriedade de escrituração do Sped Fiscal
                    (EFD-ICMS/IPI), emissão de livro fiscal e controle de estoque permanente (Bloco
                    K).
                  </p>
                  <p className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded border border-neutral-200">
                    <strong>Efeito prático:</strong> Gera passivos expressivos por atraso ou
                    inconsistência nas declarações estaduais, multas punitivas do Fisco estadual e
                    aumento no honorário contábil operacional que supera a suposta economia
                    tributária.
                  </p>
                </div>

                {/* Erro 3 */}
                <div className="border border-neutral-200 rounded-lg p-5 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-semibold text-neutral-800">
                      Erro 03
                    </span>
                    <h3 className="font-serif font-bold text-base text-black">
                      Subestimar o impacto do sublimite estadual de R$ 3,6 milhões
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-2">
                    Empresas que faturam entre R$ 3,6 milhões e R$ 4,8 milhões anuais são
                    compulsoriamente expulsas do recolhimento de ICMS e ISS no Simples por
                    ultrapassarem o sublimite, mas muitos gestores continuam gerando o DAS integral
                    por erro de parametrização no PGDAS-D.
                  </p>
                  <p className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded border border-neutral-200">
                    <strong>Efeito prático:</strong> A empresa sofre autuação fiscal da Secretaria
                    da Fazenda estadual com exigência do ICMS integral retroativo, juros Selic e
                    multa de ofício de até 100%, além de precisar retificar anos de declarações
                    fiscais.
                  </p>
                </div>

                {/* Erro 4 */}
                <div className="border border-neutral-200 rounded-lg p-5 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-semibold text-neutral-800">
                      Erro 04
                    </span>
                    <h3 className="font-serif font-bold text-base text-black">
                      Esquecer a bitributação em mercadorias sujeitas à Substituição Tributária
                      (ICMS-ST)
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-2">
                    Revender produtos cujo ICMS já foi recolhido antecipadamente pelo fabricante via
                    ST sem fazer a segregação expressa da receita no momento de preencher o DAS
                    mensal.
                  </p>
                  <p className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded border border-neutral-200">
                    <strong>Efeito prático:</strong> Pagamento em duplicidade de ICMS (uma vez
                    embutido no custo da compra e outra dentro da guia do Simples), gerando sangria
                    silenciosa de caixa que só pode ser recuperada via processo administrativo de
                    restituição.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </article>

        {/* 8. BLOCO DE VIGÊNCIA visível citando a base legal */}
        <section
          aria-labelledby="vigencia-hibrido-title"
          className="border border-neutral-200 bg-white rounded-xl p-6 mb-8 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <Scale className="h-5 w-5 text-neutral-800 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3
                  id="vigencia-hibrido-title"
                  className="font-serif font-bold text-base text-black"
                >
                  Vigência Normativa e Base Legal Aplicada
                </h3>
                <span className="text-xs font-mono bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded border border-neutral-300">
                  {SIMPLES_NACIONAL_VIGENCIA.rotuloRevisao}
                </span>
              </div>
              <p className="text-sm text-neutral-700 leading-relaxed">
                As regras de cálculo, faixas de receita e critérios de segregação apresentados nesta
                ferramenta fundamentam-se na{' '}
                <strong>
                  Lei Complementar nº 123, de 14 de dezembro de 2006, art. 18 e seguintes
                </strong>
                , e na <strong>Resolução CGSN nº 140/2018 (e alterações posteriores)</strong> do
                Comitê Gestor do Simples Nacional vigente sobre a segregação de receitas e
                sublimites estaduais.
              </p>
            </div>
          </div>
        </section>

        {/* 9. AVISO LEGAL de estimativa com link para a página de contato (/contato) */}
        <section
          aria-labelledby="aviso-legal-hibrido-title"
          className="border border-neutral-200 bg-neutral-50 rounded-xl p-6 mb-12"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-neutral-700 shrink-0 mt-0.5" />
            <div>
              <h3
                id="aviso-legal-hibrido-title"
                className="font-serif font-bold text-base text-black mb-1"
              >
                Aviso de Conformidade Legal
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                O resultado gerado por esta ferramenta é uma estimativa matemática orientativa e não
                substitui a análise formal e o parecer técnico de um profissional habilitado perante
                o Conselho Regional de Contabilidade. Para estruturação de planejamento tributário e
                conferência de suas obrigações acessórias, acesse a nossa página de{' '}
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

        {/* 10. FAQ com CINCO perguntas sobre o tema no HTML estático */}
        <section aria-labelledby="faq-hibrido-title" className="mb-14">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 border border-neutral-300 bg-neutral-100 px-3 py-1 rounded text-xs font-mono uppercase tracking-wider text-neutral-800 mb-2">
              <HelpCircle className="h-3.5 w-3.5 text-black" />
              Perguntas Frequentes
            </div>
            <h2
              id="faq-hibrido-title"
              className="text-2xl md:text-3xl font-serif font-bold text-black"
            >
              Dúvidas Técnicas sobre o Simples Nacional Híbrido
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

        {/* 11. CALCULADORAS RELACIONADAS com TRÊS links + bloco de chamada para contato */}
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
            {/* Link 1: Simples Nacional ou Lucro Presumido */}
            <Link
              to="/calculadoras/simples-nacional-ou-lucro-presumido"
              className="group border border-neutral-200 bg-white hover:border-neutral-400 p-5 rounded-xl transition-all duration-200 flex flex-col justify-between shadow-sm"
            >
              <div>
                <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                  Regime Tributário
                </span>
                <h3 className="font-serif font-bold text-base text-black mb-2 group-hover:underline">
                  Simples Nacional ou Lucro Presumido
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Comparativo estimativo de carga tributária e encargos entre os regimes com
                  apuração de alíquotas efetivas.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center text-xs font-medium text-black">
                Acessar simulador{' '}
                <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Link 2: Fator R */}
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
                  Cálculo da relação entre folha de pagamento e receita bruta para enquadramento no
                  Anexo III ou Anexo V.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center text-xs font-medium text-black">
                Acessar simulador{' '}
                <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Link 3: Custo de Funcionário CLT */}
            <Link
              to="/calculadoras/custo-de-funcionario-clt"
              className="group border border-neutral-200 bg-white hover:border-neutral-400 p-5 rounded-xl transition-all duration-200 flex flex-col justify-between shadow-sm"
            >
              <div>
                <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                  Folha e Trabalhista
                </span>
                <h3 className="font-serif font-bold text-base text-black mb-2 group-hover:underline">
                  Custo de Funcionário CLT
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Cálculo detalhado do custo real de contratação para a empresa: encargos patronais,
                  FGTS e provisões.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center text-xs font-medium text-black">
                Acessar simulador{' '}
                <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </section>

        {/* Bloco de chamada final apontando para a seção Consultoria Tributária em /servicos */}
        <section
          aria-labelledby="cta-final-hibrido-title"
          className="bg-neutral-950 text-white rounded-2xl p-8 md:p-12 text-center"
        >
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="inline-block border border-neutral-800 px-3 py-1 rounded text-xs uppercase tracking-wider text-neutral-400 font-mono">
              Consultoria Tributária • PERES PERES
            </div>

            <h2
              id="cta-final-hibrido-title"
              className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight"
            >
              Deseja auditar sua segregação de receitas com um especialista?
            </h2>

            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
              Nossa equipe estrutura pareceres formais de enquadramento, auditoria de créditos
              acumulados de ICMS, sublimites estaduais e planejamento tributário personalizado para
              garantir eficiência e conformidade fiscal sem recolhimento em duplicidade.
            </p>

            {/* Ponto focal com amarelo #FAB319 apontando para a seção Consultoria Tributária na página de serviços */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-base h-12 px-8 shadow-sm w-full sm:w-auto"
              >
                <Link to="/servicos#consultoria-tributaria">
                  Conhecer Nossa Consultoria Tributária
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-neutral-700 bg-transparent text-white hover:bg-neutral-900 hover:text-white font-medium text-base h-12 px-6 w-full sm:w-auto"
              >
                <Link to="/contato">Fale com um Especialista</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
