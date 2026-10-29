import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FOLHA_TRABALHISTA_VIGENCIA,
  calcularINSSEmpregado,
  calcularIRRFEmpregado,
} from '@/lib/folhaData'
import {
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Calculator,
  HelpCircle,
  AlertCircle,
  FileCheck2,
  Scale,
  Briefcase,
  Users,
  Building2,
  TrendingUp,
  Percent,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react'
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

// Tabelas dos Anexos do Simples Nacional (Lei Complementar nº 123/2006)
type AnexoSimplesType = 'anexoI' | 'anexoII' | 'anexoIII' | 'anexoIV' | 'anexoV'

interface FaixaSimples {
  limite: number
  aliqNominal: number
  deducao: number
}

const TABELAS_SIMPLES: Record<AnexoSimplesType, FaixaSimples[]> = {
  // Anexo I - Comércio
  anexoI: [
    { limite: 180000, aliqNominal: 0.04, deducao: 0 },
    { limite: 360000, aliqNominal: 0.073, deducao: 5940 },
    { limite: 720000, aliqNominal: 0.095, deducao: 13860 },
    { limite: 1800000, aliqNominal: 0.107, deducao: 22500 },
    { limite: 3600000, aliqNominal: 0.143, deducao: 87300 },
    { limite: 4800000, aliqNominal: 0.19, deducao: 378000 },
  ],
  // Anexo II - Indústria
  anexoII: [
    { limite: 180000, aliqNominal: 0.045, deducao: 0 },
    { limite: 360000, aliqNominal: 0.078, deducao: 5940 },
    { limite: 720000, aliqNominal: 0.1, deducao: 13860 },
    { limite: 1800000, aliqNominal: 0.112, deducao: 22500 },
    { limite: 3600000, aliqNominal: 0.147, deducao: 85500 },
    { limite: 4800000, aliqNominal: 0.3, deducao: 720000 },
  ],
  // Anexo III - Serviços (instalações, reparos, agências, desenvolvimento/TI com Fator R >= 28%)
  anexoIII: [
    { limite: 180000, aliqNominal: 0.06, deducao: 0 },
    { limite: 360000, aliqNominal: 0.112, deducao: 9360 },
    { limite: 720000, aliqNominal: 0.135, deducao: 17640 },
    { limite: 1800000, aliqNominal: 0.16, deducao: 35640 },
    { limite: 3600000, aliqNominal: 0.21, deducao: 125640 },
    { limite: 4800000, aliqNominal: 0.33, deducao: 648000 },
  ],
  // Anexo IV - Serviços (construção, vigilância, limpeza, advocacia - sem CPP no DAS)
  anexoIV: [
    { limite: 180000, aliqNominal: 0.045, deducao: 0 },
    { limite: 360000, aliqNominal: 0.09, deducao: 8100 },
    { limite: 720000, aliqNominal: 0.102, deducao: 12420 },
    { limite: 1800000, aliqNominal: 0.14, deducao: 39780 },
    { limite: 3600000, aliqNominal: 0.22, deducao: 183780 },
    { limite: 4800000, aliqNominal: 0.33, deducao: 579780 },
  ],
  // Anexo V - Serviços intelectuais/técnicos com Fator R < 28%
  anexoV: [
    { limite: 180000, aliqNominal: 0.155, deducao: 0 },
    { limite: 360000, aliqNominal: 0.18, deducao: 4500 },
    { limite: 720000, aliqNominal: 0.195, deducao: 9900 },
    { limite: 1800000, aliqNominal: 0.205, deducao: 17100 },
    { limite: 3600000, aliqNominal: 0.23, deducao: 62100 },
    { limite: 4800000, aliqNominal: 0.305, deducao: 540000 },
  ],
}

// Opções de atividades com anexo padrão correspondente
const ATIVIDADES_PJ = [
  {
    id: 'ti-desenvolvimento',
    nome: 'Tecnologia da Informação, Software e Dados',
    anexoPadrao: 'anexoIII' as AnexoSimplesType,
    detalhes: 'Sujeito a Fator R: Anexo III com folha ≥ 28% ou Anexo V se inferior',
  },
  {
    id: 'consultoria-gestao',
    nome: 'Consultoria Empresarial, Gestão e Treinamentos',
    anexoPadrao: 'anexoIII' as AnexoSimplesType,
    detalhes: 'Serviços intelectuais sujeitos à apuração de Fator R (LC 123/2006)',
  },
  {
    id: 'engenharia-arquitetura',
    nome: 'Engenharia, Arquitetura e Projetos Técnicos',
    anexoPadrao: 'anexoIII' as AnexoSimplesType,
    detalhes: 'Atividades regulamentadas (art. 18, § 5º-I da LC 123/2006)',
  },
  {
    id: 'marketing-comunicacao',
    nome: 'Marketing, Design, Publicidade e Conteúdo',
    anexoPadrao: 'anexoIII' as AnexoSimplesType,
    detalhes: 'Agenciamento, produção técnica e design gráfico',
  },
  {
    id: 'saude-profissionais',
    nome: 'Área da Saúde (Médicos, Psicólogos, Terapeutas)',
    anexoPadrao: 'anexoIII' as AnexoSimplesType,
    detalhes: 'Serviços de saúde vinculados ao Fator R da LC 123/2006',
  },
  {
    id: 'administrativo-apoio',
    nome: 'Serviços Administrativos, Financeiros e Apoio',
    anexoPadrao: 'anexoIII' as AnexoSimplesType,
    detalhes: 'Tributação direta pelo Anexo III da LC 123/2006',
  },
  {
    id: 'comercio-representacao',
    nome: 'Comércio / Vendas de Mercadorias',
    anexoPadrao: 'anexoI' as AnexoSimplesType,
    detalhes: 'Revenda de mercadorias no Anexo I',
  },
  {
    id: 'outra-atividade',
    nome: 'Outra Atividade Prestadora de Serviços',
    anexoPadrao: 'anexoIII' as AnexoSimplesType,
    detalhes: 'Selecione o anexo aplicável conforme classificação fiscal (CNAE)',
  },
]

export default function PJouCLTCalculator() {
  // 1. Entradas do formulário com valores padrão realistas para exibição imediata
  const [valorBruto, setValorBruto] = useState<number>(10000)
  const [valorBrutoInput, setValorBrutoInput] = useState<string>('10.000,00')

  const [isSimplesNacionalPJ, setIsSimplesNacionalPJ] = useState<boolean>(true)
  const [anexoSelecionado, setAnexoSelecionado] = useState<AnexoSimplesType>('anexoIII')
  const [atividadeSelecionada, setAtividadeSelecionada] = useState<string>('ti-desenvolvimento')

  const [dependentes, setDependentes] = useState<number>(0)
  const [dependentesInput, setDependentesInput] = useState<string>('0')

  // Regime da empresa contratante no cenário CLT (determina o INSS patronal de 20%)
  const [isEmpresaContratanteSimples, setIsEmpresaContratanteSimples] = useState<boolean>(true)

  // RBT12 estimada do PJ (receita bruta dos últimos 12 meses): padrão R$ 120.000,00
  const [rbt12Estimada, setRbt12Estimada] = useState<number>(120000)
  const [rbt12Input, setRbt12Input] = useState<string>('120.000,00')

  // Gastos operacionais mensais da PJ (contabilidade, certificado, taxas bancárias)
  const [custoOperacionalPJ, setCustoOperacionalPJ] = useState<number>(450)
  const [custoOperacionalPJInput, setCustoOperacionalPJInput] = useState<string>('450,00')

  // SEO: título da aba (máximo 60 caracteres) começando por "calculadora pj ou clt" e meta description (máximo 155 caracteres)
  useEffect(() => {
    // 53 caracteres, começa estritamente por "calculadora pj ou clt"
    const pageTitle = 'calculadora pj ou clt: quanto custa cada | PERES'
    // 147 caracteres, conciso e com palavras-chave relevantes
    const pageDesc =
      'Compare PJ ou CLT em tempo real: veja o custo total para a empresa, o valor líquido na mão do profissional, memória de cálculo e alíquotas efetivas.'

    document.title = pageTitle
    let metaDescTag = document.querySelector('meta[name="description"]')
    if (!metaDescTag) {
      metaDescTag = document.createElement('meta')
      metaDescTag.setAttribute('name', 'description')
      document.head.appendChild(metaDescTag)
    }
    metaDescTag.setAttribute('content', pageDesc)

    // Registra contagem de acesso no painel administrativo
    import('@/services/calculator_accesses').then(({ trackCalculatorAccess }) => {
      trackCalculatorAccess('pj-ou-clt', 'PJ ou CLT')
    })
  }, [])

  // Handlers para os campos numéricos
  const handleValorBrutoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseRawToNumber(e.target.value)
    setValorBruto(num)
    setValorBrutoInput(formatRawInput(num))
    // Atualiza RBT12 sugerida se for proporcional
    if (num > 0) {
      const novaRbt12 = num * 12
      setRbt12Estimada(novaRbt12)
      setRbt12Input(formatRawInput(novaRbt12))
    }
  }

  const handleRbt12Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseRawToNumber(e.target.value)
    setRbt12Estimada(num)
    setRbt12Input(formatRawInput(num))
  }

  const handleCustoOperacionalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseRawToNumber(e.target.value)
    setCustoOperacionalPJ(num)
    setCustoOperacionalPJInput(formatRawInput(num))
  }

  const handleDependentesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    const val = raw ? parseInt(raw, 10) : 0
    const clamped = Math.min(20, Math.max(0, val))
    setDependentes(clamped)
    setDependentesInput(clamped.toString())
  }

  const handleAtividadeChange = (novaAtividadeId: string) => {
    setAtividadeSelecionada(novaAtividadeId)
    const atv = ATIVIDADES_PJ.find((a) => a.id === novaAtividadeId)
    if (atv) {
      setAnexoSelecionado(atv.anexoPadrao)
    }
  }

  // Cálculos em tempo real para ambos os cenários
  const calculation = useMemo(() => {
    const bruto = valorBruto

    // ==========================================
    // 1. CENÁRIO CLT (CUSTO EMPRESA & LÍQUIDO)
    // ==========================================
    // Encargos da empresa:
    // - INSS patronal: 20% se não for Simples Nacional, ou 0% na folha se for Simples (unificado no DAS)
    const aliqInssPatronal = isEmpresaContratanteSimples ? 0 : 0.2
    const inssPatronalCLT = bruto * aliqInssPatronal

    // - FGTS mensal: 8%
    const fgtsMensalCLT = bruto * 0.08

    // - Provisão 13º Salário (1/12 = 8,3333%)
    const provisao13CLT = bruto / 12

    // - Provisão de Férias com 1/3 (1/12 + 1/36 = 4/36 = 1/9 = 11,1111%)
    const provisaoFeriasCLT = (bruto * (4 / 3)) / 12

    // - Encargos sobre provisões (FGTS 8% + INSS patronal 20% se não-Simples)
    const fgtsSobreProvisoesCLT = (provisao13CLT + provisaoFeriasCLT) * 0.08
    const inssPatronalSobreProvisoesCLT = isEmpresaContratanteSimples
      ? 0
      : (provisao13CLT + provisaoFeriasCLT) * 0.2

    // - Provisão da multa rescisória do FGTS (40% do FGTS total gerado no mês)
    const fgtsTotalGeradoCLT = fgtsMensalCLT + fgtsSobreProvisoesCLT
    const multaFgtsCLT = fgtsTotalGeradoCLT * 0.4

    // Total de encargos e provisões adicionais da empresa
    const totalEncargosEmpresaCLT =
      inssPatronalCLT +
      fgtsMensalCLT +
      provisao13CLT +
      provisaoFeriasCLT +
      fgtsSobreProvisoesCLT +
      inssPatronalSobreProvisoesCLT +
      multaFgtsCLT

    // Custo total mensal e anual para a empresa no CLT
    const custoEmpresaCLTMensal = bruto + totalEncargosEmpresaCLT
    const custoEmpresaCLTAnual = custoEmpresaCLTMensal * 12
    const percentualEncargosCLT = bruto > 0 ? (totalEncargosEmpresaCLT / bruto) * 100 : 0

    // Descontos do empregado no CLT:
    const inssEmpregadoCLT = calcularINSSEmpregado(bruto)
    const {
      irrfBruto: irrfBrutoCLT,
      redutorLei15270: redutorLei15270CLT,
      irrfFinal: irrfEmpregadoCLT,
      baseUsada: baseIrrfCLT,
      faixaAliq: aliqIrrfCLT,
    } = calcularIRRFEmpregado(bruto, inssEmpregadoCLT, dependentes)

    const totalDescontosEmpregadoCLT = inssEmpregadoCLT + irrfEmpregadoCLT
    const liquidoEmpregadoCLTMensal = Math.max(0, bruto - totalDescontosEmpregadoCLT)

    // Benefícios diferidos/anuais recebidos pelo CLT (férias com 1/3, 13º e FGTS anual)
    // O CLT recebe 12 salários mensais + 13º salário + 1/3 de férias, além de acumular FGTS
    const liquidoAnualDiretoCLT = liquidoEmpregadoCLTMensal * 12 + bruto + bruto / 3
    const fgtsAcumuladoAnualCLT = fgtsMensalCLT * 12

    // ==========================================
    // 2. CENÁRIO PJ (CUSTO EMPRESA & LÍQUIDO)
    // ==========================================
    // Para a empresa que contrata, o custo PJ é exatamente a nota fiscal emitida
    const custoEmpresaPJMensal = bruto
    const custoEmpresaPJAnual = bruto * 12

    // Tributos do lado da PJ
    let aliquotaEfetivaPJ = 0
    let aliquotaNominalPJ = 0
    let parcelaDeducaoPJ = 0
    let faixaIndicePJ = 1
    let regimePJNome = 'Simples Nacional'
    let tributosPJDetalhes: { nome: string; aliq: number; valor: number }[] = []

    if (isSimplesNacionalPJ) {
      const faixas = TABELAS_SIMPLES[anexoSelecionado]
      const rbt12 = rbt12Estimada > 0 ? rbt12Estimada : bruto * 12

      // Identifica a faixa
      let faixaSel = faixas[0]
      for (let i = 0; i < faixas.length; i++) {
        if (rbt12 <= faixas[i].limite) {
          faixaSel = faixas[i]
          faixaIndicePJ = i + 1
          break
        }
        if (i === faixas.length - 1) {
          faixaSel = faixas[i]
          faixaIndicePJ = i + 1
        }
      }

      aliquotaNominalPJ = faixaSel.aliqNominal
      parcelaDeducaoPJ = faixaSel.deducao

      // Fórmula efetiva da LC 123/2006: (RBT12 × Alíquota Nominal − Parcela a Deduzir) ÷ RBT12
      if (rbt12 > 0) {
        aliquotaEfetivaPJ = (rbt12 * aliquotaNominalPJ - parcelaDeducaoPJ) / rbt12
        if (aliquotaEfetivaPJ < 0) aliquotaEfetivaPJ = 0
      }

      const valorDAS = bruto * aliquotaEfetivaPJ
      regimePJNome = `Simples Nacional (${anexoSelecionado.toUpperCase().replace('ANEXO', 'Anexo ')})`

      tributosPJDetalhes = [
        {
          nome: 'Guia Única DAS (Simples Nacional)',
          aliq: aliquotaEfetivaPJ * 100,
          valor: valorDAS,
        },
      ]
    } else {
      // Lucro Presumido para Serviços:
      // IRPJ: presunção de 32% × alíquota de 15% (+ adicional de 10% sobre o que exceder R$ 20.000/mês de base)
      // CSLL: presunção de 32% × alíquota de 9%
      // PIS: 0,65%
      // COFINS: 3,00%
      // ISS: estimativa de 3,00% (alíquota média municipal)
      regimePJNome = 'Lucro Presumido'
      const baseIRPJMensal = bruto * 0.32
      const irpjBasico = baseIRPJMensal * 0.15
      const excedente20k = Math.max(0, baseIRPJMensal - 20000)
      const irpjAdicional = excedente20k * 0.1
      const totalIRPJ = irpjBasico + irpjAdicional

      const baseCSLLMensal = bruto * 0.32
      const totalCSLL = baseCSLLMensal * 0.09

      const totalPIS = bruto * 0.0065
      const totalCOFINS = bruto * 0.03
      const totalISS = bruto * 0.03 // ISS municipal médio 3%

      const totalTributosPresumido = totalIRPJ + totalCSLL + totalPIS + totalCOFINS + totalISS
      aliquotaEfetivaPJ = bruto > 0 ? totalTributosPresumido / bruto : 0

      tributosPJDetalhes = [
        {
          nome: 'IRPJ (base presumida 32% × 15% + adicional)',
          aliq: (totalIRPJ / bruto) * 100,
          valor: totalIRPJ,
        },
        {
          nome: 'CSLL (base presumida 32% × 9%)',
          aliq: (totalCSLL / bruto) * 100,
          valor: totalCSLL,
        },
        { nome: 'PIS cumulativo (0,65%)', aliq: 0.65, valor: totalPIS },
        { nome: 'COFINS cumulativa (3,00%)', aliq: 3.0, valor: totalCOFINS },
        { nome: 'ISS Municipal estimado (3,00%)', aliq: 3.0, valor: totalISS },
      ]
    }

    const totalTributosPJMensal = bruto * aliquotaEfetivaPJ
    const totalTributosPJAnual = totalTributosPJMensal * 12

    // Líquido na mão do profissional PJ = Valor Bruto − Tributos PJ − Despesas Operacionais PJ
    const liquidoProfissionalPJMensal = Math.max(
      0,
      bruto - totalTributosPJMensal - custoOperacionalPJ,
    )
    const liquidoProfissionalPJAnual = liquidoProfissionalPJMensal * 12

    // ==========================================
    // 3. COMPARAÇÃO E VANTAGEM RELATIVA
    // ==========================================
    // Para a empresa:
    const economiaEmpresaPJMensal = custoEmpresaCLTMensal - custoEmpresaPJMensal
    const economiaEmpresaPJAnual = economiaEmpresaPJMensal * 12
    const empresaMaisVantajoso = custoEmpresaPJMensal < custoEmpresaCLTMensal ? 'PJ' : 'CLT'

    // Para o profissional (comparação mensal direta de liquidez imediata):
    const diferencaLiquidoProfissionalMensal =
      liquidoProfissionalPJMensal - liquidoEmpregadoCLTMensal
    const profissionalMaisVantajosoMensal =
      liquidoProfissionalPJMensal > liquidoEmpregadoCLTMensal ? 'PJ' : 'CLT'

    // Multiplicador de equivalência: quanto a empresa precisa pagar em PJ para igualar o custo CLT
    // Ou quanto o profissional precisaria faturar em PJ para empatar com a CLT
    const percentualGanhoLiquidoPJ =
      liquidoEmpregadoCLTMensal > 0
        ? ((liquidoProfissionalPJMensal - liquidoEmpregadoCLTMensal) / liquidoEmpregadoCLTMensal) *
          100
        : 0

    return {
      bruto,
      // CLT Empresa
      aliqInssPatronal,
      inssPatronalCLT,
      fgtsMensalCLT,
      provisao13CLT,
      provisaoFeriasCLT,
      fgtsSobreProvisoesCLT,
      inssPatronalSobreProvisoesCLT,
      multaFgtsCLT,
      totalEncargosEmpresaCLT,
      custoEmpresaCLTMensal,
      custoEmpresaCLTAnual,
      percentualEncargosCLT,
      // CLT Empregado
      inssEmpregadoCLT,
      irrfBrutoCLT,
      redutorLei15270CLT,
      irrfEmpregadoCLT,
      baseIrrfCLT,
      aliqIrrfCLT,
      totalDescontosEmpregadoCLT,
      liquidoEmpregadoCLTMensal,
      liquidoAnualDiretoCLT,
      fgtsAcumuladoAnualCLT,
      // PJ Empresa
      custoEmpresaPJMensal,
      custoEmpresaPJAnual,
      // PJ Profissional
      regimePJNome,
      aliquotaEfetivaPJ,
      aliquotaNominalPJ,
      parcelaDeducaoPJ,
      faixaIndicePJ,
      totalTributosPJMensal,
      totalTributosPJAnual,
      tributosPJDetalhes,
      custoOperacionalPJ,
      liquidoProfissionalPJMensal,
      liquidoProfissionalPJAnual,
      // Comparativo
      economiaEmpresaPJMensal,
      economiaEmpresaPJAnual,
      empresaMaisVantajoso,
      diferencaLiquidoProfissionalMensal,
      profissionalMaisVantajosoMensal,
      percentualGanhoLiquidoPJ,
    }
  }, [
    valorBruto,
    isSimplesNacionalPJ,
    anexoSelecionado,
    isEmpresaContratanteSimples,
    rbt12Estimada,
    custoOperacionalPJ,
    dependentes,
  ])

  // FAQ com CINCO perguntas e respostas curtas estáticas no HTML
  const faqs = [
    {
      q: 'Qual é o valor mínimo de remuneração em que ser PJ começa a valer a pena?',
      a: 'A partir de R$ 6.000,00 a R$ 8.000,00 mensais a contratação PJ tende a entregar maior liquidez financeira ao profissional, pois as faixas superiores da CLT sofrem retenção progressiva de até 27,5% de IRRF mais teto do INSS, enquanto no Simples Nacional do Anexo III a alíquota efetiva inicial é de 6,00%.',
    },
    {
      q: 'O que a empresa deixa de recolher ao contratar um PJ?',
      a: 'A empresa deixa de recolher o FGTS mensal (8%), a contribuição patronal previdenciária de 20% (quando não optante pelo Simples), a multa rescisória de 40%, e fica dispensada do pagamento compulsório de 13º salário, férias acrescidas de 1/3 e aviso prévio indenizado.',
    },
    {
      q: 'O profissional PJ tem direito a seguro-desemprego ou FGTS?',
      a: 'Não. O prestador de serviços pessoa jurídica não é titular de conta vinculada do FGTS nem tem acesso ao benefício do seguro-desemprego em caso de rescisão de contrato, devendo constituir sua própria reserva financeira e plano de previdência complementar.',
    },
    {
      q: 'Como comprovar que uma contratação PJ não é pejotização fraudulenta?',
      a: 'A relação deve obedecer à autonomia técnica, jurídica e funcional, sem subordinação hierárquica, sem exigência de cumprimento estrito de jornada de trabalho e com possibilidade de atendimento a outros clientes mediante emissão regular de notas fiscais.',
    },
    {
      q: 'Como escolher entre o Anexo III e o Anexo V do Simples Nacional na PJ?',
      a: 'Para serviços intelectuais, de TI e consultorias, a escolha é regulada pelo Fator R (art. 18 da LC 123/2006). Se a folha de pagamento da PJ (incluindo o pró-labore do sócio) for igual ou superior a 28% do faturamento acumulado em 12 meses, tributa-se pelo Anexo III (alíquota a partir de 6%); se for inferior, pelo Anexo V (a partir de 15,5%).',
    },
  ]

  // Dados Estruturados JSON-LD: SoftwareApplication, BreadcrumbList e FAQPage
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://peresperes.com.br/calculadoras/pj-ou-clt#software',
        name: 'Calculadora PJ ou CLT: comparativo de custo e remuneração líquida',
        url: 'https://peresperes.com.br/calculadoras/pj-ou-clt',
        applicationCategory: 'FinancialApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        description:
          'Simulador comparativo em tempo real entre contratação PJ e CLT: custo para a empresa, valor líquido do profissional e memória de cálculo.',
        provider: {
          '@type': 'AccountingService',
          name: 'PERES PERES Consultoria e Contabilidade',
          url: 'https://peresperes.com.br',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://peresperes.com.br/calculadoras/pj-ou-clt#breadcrumb',
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
            name: 'PJ ou CLT',
            item: 'https://peresperes.com.br/calculadoras/pj-ou-clt',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://peresperes.com.br/calculadoras/pj-ou-clt#faq',
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
        {/* 1. TRILHA DE NAVEGAÇÃO: Início > Calculadoras > PJ ou CLT */}
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
          <span className="text-black font-medium">PJ ou CLT</span>
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

        {/* CABEÇALHO DA PÁGINA */}
        <header className="mb-10 max-w-3xl">
          <div className="inline-block border border-neutral-300 bg-neutral-100 text-neutral-800 text-xs font-mono uppercase tracking-wider px-3 py-1 rounded mb-4">
            Folha e Trabalhista • Planejamento Tributário
          </div>

          {/* Título principal solicitado */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-5 leading-tight">
            PJ ou CLT, quanto custa cada opção
          </h1>

          {/* Parágrafo curto de duas linhas explicando que a ferramenta compara o custo total para a empresa e o valor líquido na mão do profissional */}
          <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
            Esta ferramenta compara o custo total de contratação suportado pela empresa e o valor
            líquido efetivamente recebido pelo profissional em cada modelo de contratação.
          </p>
        </header>

        {/* 2. BLOCO DA CALCULADORA (única parte executada em JavaScript) */}
        <section
          aria-labelledby="calculadora-pj-clt-heading"
          className="border border-neutral-200 bg-white rounded-xl shadow-sm p-6 md:p-8 mb-12"
        >
          <div className="flex items-center justify-between pb-6 border-b border-neutral-200 mb-6">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-neutral-900" />
              <h2
                id="calculadora-pj-clt-heading"
                className="text-xl md:text-2xl font-bold text-black"
              >
                Simulação Comparativa em Tempo Real
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
              Atualização Instantânea
            </span>
          </div>

          {/* CAMPOS DE ENTRADA */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Campo 1: Valor bruto mensal */}
            <div>
              <label
                htmlFor="input-valor-bruto"
                className="block text-sm font-semibold text-neutral-900 mb-1.5"
              >
                Valor bruto mensal contratado
              </label>
              <p className="text-xs text-neutral-500 mb-2">
                Salário base na CLT ou honorários da nota fiscal de prestação de serviços como PJ.
              </p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-500 font-mono">
                  R$
                </span>
                <Input
                  id="input-valor-bruto"
                  type="text"
                  inputMode="numeric"
                  value={valorBrutoInput}
                  onChange={handleValorBrutoChange}
                  placeholder="0,00"
                  className="pl-10 font-mono text-base border-neutral-300 focus-visible:ring-black"
                />
              </div>
            </div>

            {/* Campo 2: Dependentes para IRRF */}
            <div>
              <label
                htmlFor="input-dependentes-irrf"
                className="block text-sm font-semibold text-neutral-900 mb-1.5"
              >
                Dependentes para IRRF (Cenário CLT)
              </label>
              <p className="text-xs text-neutral-500 mb-2">
                Número de dependentes legais para dedução de R$ 189,59 cada no imposto de renda da
                CLT.
              </p>
              <Input
                id="input-dependentes-irrf"
                type="number"
                min="0"
                max="20"
                value={dependentesInput}
                onChange={handleDependentesChange}
                placeholder="0"
                className="font-mono text-base border-neutral-300 focus-visible:ring-black"
              />
            </div>

            {/* Campo 3: Atividade exercida pelo profissional PJ */}
            <div>
              <label
                htmlFor="select-atividade"
                className="block text-sm font-semibold text-neutral-900 mb-1.5"
              >
                Atividade exercida pelo profissional
              </label>
              <p className="text-xs text-neutral-500 mb-2">
                Define a classificação fiscal e o anexo aplicável no Simples Nacional.
              </p>
              <select
                id="select-atividade"
                value={atividadeSelecionada}
                onChange={(e) => handleAtividadeChange(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-white border border-neutral-300 rounded-md font-sans text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black"
              >
                {ATIVIDADES_PJ.map((atv) => (
                  <option key={atv.id} value={atv.id}>
                    {atv.nome}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-neutral-500 mt-1 block">
                {ATIVIDADES_PJ.find((a) => a.id === atividadeSelecionada)?.detalhes}
              </span>
            </div>

            {/* Campo 4: Regime da PJ e Anexo do Simples Nacional */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-1.5">
                Regime tributário da PJ e Anexo
              </label>
              <p className="text-xs text-neutral-500 mb-2">
                Se o profissional tem inscrição no Simples Nacional e qual anexo é aplicado.
              </p>

              <div className="space-y-2">
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="regimePJ"
                      checked={isSimplesNacionalPJ}
                      onChange={() => setIsSimplesNacionalPJ(true)}
                      className="h-3.5 w-3.5 text-black"
                    />
                    <span>Simples Nacional</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="regimePJ"
                      checked={!isSimplesNacionalPJ}
                      onChange={() => setIsSimplesNacionalPJ(false)}
                      className="h-3.5 w-3.5 text-black"
                    />
                    <span>Lucro Presumido</span>
                  </label>
                </div>

                {isSimplesNacionalPJ ? (
                  <select
                    value={anexoSelecionado}
                    onChange={(e) => setAnexoSelecionado(e.target.value as AnexoSimplesType)}
                    className="w-full h-9 px-3 text-xs bg-white border border-neutral-300 rounded-md font-sans text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="anexoIII">
                      Anexo III (Serviços gerais ou TI com Fator R ≥ 28%)
                    </option>
                    <option value="anexoV">
                      Anexo V (Serviços intelectuais com Fator R &lt; 28%)
                    </option>
                    <option value="anexoIV">
                      Anexo IV (Construção civil, vigilância, advocacia)
                    </option>
                    <option value="anexoI">Anexo I (Comércio / Revenda)</option>
                    <option value="anexoII">Anexo II (Indústria)</option>
                  </select>
                ) : (
                  <div className="text-xs text-neutral-600 bg-neutral-50 p-2 rounded border border-neutral-200">
                    Lucro Presumido de serviços: IRPJ 15% (+10% adicional), CSLL 9%, PIS 0,65%,
                    COFINS 3% e ISS 3%.
                  </div>
                )}
              </div>
            </div>

            {/* Configurações avançadas: Regime da Contratante e Custos PJ */}
            <div className="md:col-span-2 pt-4 border-t border-neutral-200">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-3">
                Parâmetros Complementares do Comparativo
              </span>
              <div className="grid sm:grid-cols-3 gap-4">
                {/* Empresa contratante é Simples Nacional? */}
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <span className="block text-xs font-semibold text-neutral-900 mb-1">
                    Regime da Empresa Contratante (CLT)
                  </span>
                  <div className="space-y-1.5 pt-1">
                    <label className="flex items-center gap-1.5 text-xs text-neutral-800 cursor-pointer">
                      <input
                        type="radio"
                        name="contratanteSimples"
                        checked={isEmpresaContratanteSimples}
                        onChange={() => setIsEmpresaContratanteSimples(true)}
                        className="h-3.5 w-3.5 text-black"
                      />
                      <span>Simples Nacional (INSS patronal 0% na folha)</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-neutral-800 cursor-pointer">
                      <input
                        type="radio"
                        name="contratanteSimples"
                        checked={!isEmpresaContratanteSimples}
                        onChange={() => setIsEmpresaContratanteSimples(false)}
                        className="h-3.5 w-3.5 text-black"
                      />
                      <span>Lucro Presumido/Real (INSS patronal 20%)</span>
                    </label>
                  </div>
                </div>

                {/* Receita bruta 12 meses da PJ */}
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <span className="block text-xs font-semibold text-neutral-900 mb-1">
                    Receita Bruta 12 Meses PJ (RBT12)
                  </span>
                  <p className="text-[11px] text-neutral-500 mb-1.5">
                    Utilizada na fórmula da alíquota efetiva da LC 123/2006.
                  </p>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-500">
                      R$
                    </span>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={rbt12Input}
                      onChange={handleRbt12Change}
                      placeholder="0,00"
                      className="h-8 pl-8 text-xs font-mono border-neutral-300"
                    />
                  </div>
                </div>

                {/* Custos fixos operacionais da PJ */}
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <span className="block text-xs font-semibold text-neutral-900 mb-1">
                    Custos Operacionais Mensais da PJ
                  </span>
                  <p className="text-[11px] text-neutral-500 mb-1.5">
                    Contabilidade, certificado digital, taxas bancárias.
                  </p>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-500">
                      R$
                    </span>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={custoOperacionalPJInput}
                      onChange={handleCustoOperacionalChange}
                      placeholder="0,00"
                      className="h-8 pl-8 text-xs font-mono border-neutral-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RESULTADO DEVE MOSTRAR TRÊS BLOCOS EXATOS:
              (1) o custo total para a empresa em cada cenário
              (2) o valor líquido recebido pelo profissional em cada cenário
              (3) a diferença entre eles com a indicação de qual é mais vantajoso para cada lado */}
          <div className="space-y-6">
            {/* BLOCO (1): O CUSTO TOTAL PARA A EMPRESA EM CADA CENÁRIO */}
            <div className="border border-neutral-200 bg-neutral-50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 pb-4 border-b border-neutral-200 mb-5">
                <Building2 className="h-5 w-5 text-neutral-900" />
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-black">
                    1. Custo Total para a Empresa Contratante
                  </h3>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Comparação de desembolso mensal e anual entre a contratação celetista e a
                    contratação PJ.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {/* Cenário CLT para a Empresa */}
                <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                      Cenário CLT (Empresa)
                    </span>
                    <span className="text-xs font-mono font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                      +{calculation.percentualEncargosCLT.toFixed(1)}% de encargos
                    </span>
                  </div>
                  <div className="text-2xl md:text-3xl font-mono font-bold text-black">
                    {formatCurrencyBRL(calculation.custoEmpresaCLTMensal)}
                    <span className="text-xs font-sans font-normal text-neutral-500 ml-1">
                      /mês
                    </span>
                  </div>
                  <div className="text-xs font-mono text-neutral-600 mt-2 pt-2 border-t border-neutral-100">
                    Projeção anual:{' '}
                    <strong>{formatCurrencyBRL(calculation.custoEmpresaCLTAnual)}</strong>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Soma do salário base ({formatCurrencyBRL(calculation.bruto)}) com encargos
                    legais, FGTS e provisões de 13º e férias.
                  </p>
                </div>

                {/* Cenário PJ para a Empresa */}
                <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                      Cenário PJ (Empresa)
                    </span>
                    <span className="text-xs font-mono font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                      0% de encargos patronais
                    </span>
                  </div>
                  <div className="text-2xl md:text-3xl font-mono font-bold text-black">
                    {formatCurrencyBRL(calculation.custoEmpresaPJMensal)}
                    <span className="text-xs font-sans font-normal text-neutral-500 ml-1">
                      /mês
                    </span>
                  </div>
                  <div className="text-xs font-mono text-neutral-600 mt-2 pt-2 border-t border-neutral-100">
                    Projeção anual:{' '}
                    <strong>{formatCurrencyBRL(calculation.custoEmpresaPJAnual)}</strong>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Valor nominal estrito da nota fiscal de prestação de serviços emitida
                    mensalmente pelo profissional.
                  </p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-neutral-200 text-xs text-neutral-700 flex items-center justify-between">
                <span>Diferença de custo para a empresa:</span>
                <span className="font-mono font-bold text-black text-sm">
                  Economia de {formatCurrencyBRL(Math.abs(calculation.economiaEmpresaPJMensal))} ao
                  mês contratando PJ (
                  {formatCurrencyBRL(Math.abs(calculation.economiaEmpresaPJAnual))}/ano)
                </span>
              </div>
            </div>

            {/* BLOCO (2): O VALOR LÍQUIDO RECEBIDO PELO PROFISSIONAL EM CADA CENÁRIO */}
            <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 pb-4 border-b border-neutral-200 mb-5">
                <Users className="h-5 w-5 text-neutral-900" />
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-black">
                    2. Valor Líquido Recebido pelo Profissional
                  </h3>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Valor que efetivamente chega à conta bancária do profissional após retenções
                    legais e despesas operacionais.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {/* Líquido CLT */}
                <div className="bg-neutral-50 p-5 rounded-lg border border-neutral-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                      Líquido Mensal CLT (Holerite)
                    </span>
                    <span className="text-xs font-mono text-neutral-600">
                      Retenções: {formatCurrencyBRL(calculation.totalDescontosEmpregadoCLT)}
                    </span>
                  </div>
                  <div className="text-2xl md:text-3xl font-mono font-bold text-neutral-900">
                    {formatCurrencyBRL(calculation.liquidoEmpregadoCLTMensal)}
                    <span className="text-xs font-sans font-normal text-neutral-500 ml-1">
                      /mês
                    </span>
                  </div>
                  <div className="text-xs font-mono text-neutral-600 mt-2 pt-2 border-t border-neutral-200">
                    INSS: -{formatCurrencyBRL(calculation.inssEmpregadoCLT)} | IRRF: -
                    {formatCurrencyBRL(calculation.irrfEmpregadoCLT)}
                    {calculation.redutorLei15270CLT > 0 && (
                      <span className="text-emerald-700 block mt-0.5">
                        (redutor da Lei 15.270: +{formatCurrencyBRL(calculation.redutorLei15270CLT)}
                        )
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    * Além do líquido mensal, o CLT tem direito anual a 13º salário, férias com 1/3
                    e depósito compulsório de 8% de FGTS (
                    {formatCurrencyBRL(calculation.fgtsMensalCLT)}/mês).
                  </p>
                </div>

                {/* Líquido PJ */}
                <div className="bg-neutral-50 p-5 rounded-lg border border-neutral-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                      Líquido Mensal PJ (Na Mão)
                    </span>
                    <span className="text-xs font-mono text-neutral-600">
                      Alíq. efetiva: {(calculation.aliquotaEfetivaPJ * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-2xl md:text-3xl font-mono font-bold text-black">
                    {/* Ponto focal #FAB319 no valor líquido recebido pelo profissional PJ */}
                    <span className="bg-[#FAB319] text-black px-2 py-0.5 rounded">
                      {formatCurrencyBRL(calculation.liquidoProfissionalPJMensal)}
                    </span>
                    <span className="text-xs font-sans font-normal text-neutral-500 ml-1">
                      /mês
                    </span>
                  </div>
                  <div className="text-xs font-mono text-neutral-600 mt-2 pt-2 border-t border-neutral-200">
                    Tributos PJ: -{formatCurrencyBRL(calculation.totalTributosPJMensal)} | Custos
                    Fixos: -{formatCurrencyBRL(calculation.custoOperacionalPJ)}
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Projeção anual de rendimento líquido:{' '}
                    <strong>{formatCurrencyBRL(calculation.liquidoProfissionalPJAnual)}</strong>{' '}
                    (sem férias remuneradas ou 13º garantidos por lei).
                  </p>
                </div>
              </div>
            </div>

            {/* BLOCO (3): A DIFERENÇA ENTRE ELES COM A INDICAÇÃO DE QUAL É MAIS VANTAJOSO PARA CADA LADO */}
            <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 pb-4 border-b border-neutral-200 mb-5">
                <Scale className="h-5 w-5 text-neutral-900" />
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-black">
                    3. Comparativo de Vantagem Financeira e Diferença
                  </h3>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Indicação objetiva do modelo financeiramente mais favorável para a empresa e
                    para o profissional.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Vantagem para a Empresa */}
                <div className="p-4 rounded-lg border border-neutral-200 bg-neutral-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold">
                      Para a Empresa Contratante
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold font-mono px-2 py-0.5 rounded bg-black text-white">
                      <CheckCircle2 className="h-3 w-3 text-[#FAB319]" />
                      Mais vantajoso: {calculation.empresaMaisVantajoso}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-neutral-700 leading-relaxed">
                    A contratação em formato <strong>PJ</strong> custa{' '}
                    <strong>
                      {formatCurrencyBRL(Math.abs(calculation.economiaEmpresaPJMensal))} a menos por
                      mês
                    </strong>{' '}
                    (
                    <strong>
                      {formatCurrencyBRL(Math.abs(calculation.economiaEmpresaPJAnual))} a menos por
                      ano
                    </strong>
                    ), eliminando encargos de FGTS, INSS patronal e provisões de férias e 13º.
                  </p>
                </div>

                {/* Vantagem para o Profissional */}
                <div className="p-4 rounded-lg border border-neutral-200 bg-neutral-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold">
                      Para o Profissional (Liquidez Imediata)
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold font-mono px-2 py-0.5 rounded bg-[#FAB319] text-black">
                      <CheckCircle2 className="h-3 w-3 text-black" />
                      Mais vantajoso: {calculation.profissionalMaisVantajosoMensal}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-neutral-700 leading-relaxed">
                    No formato <strong>PJ</strong>, o profissional recebe{' '}
                    <strong>
                      {formatCurrencyBRL(Math.abs(calculation.diferencaLiquidoProfissionalMensal))}{' '}
                      a mais de liquidez líquida mensal
                    </strong>{' '}
                    (+{calculation.percentualGanhoLiquidoPJ.toFixed(1)}% em relação ao holerite
                    líquido CLT).
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-neutral-100 rounded-lg text-xs text-neutral-700 border border-neutral-200">
                <strong>Nota técnica sobre a equivalência anual:</strong> Para que a remuneração
                total anual seja rigorosamente equilibrada, o valor do contrato PJ deve ser cerca de{' '}
                <strong>30% a 40% superior</strong> ao salário nominal CLT, de modo a cobrir a
                ausência de 13º salário, férias de 30 dias com terço constitucional, depósitos do
                FGTS e custos de contabilidade.
              </div>
            </div>
          </div>

          {/* 3. MEMÓRIA DE CÁLCULO ABERTA (linha por linha, percentuais e valores substituídos) */}
          <div className="mt-8 border border-neutral-200 rounded-lg p-5 bg-neutral-50">
            <div className="flex items-center gap-2 mb-3">
              <FileCheck2 className="h-4 w-4 text-neutral-800" />
              <h3 className="font-bold text-base text-black">
                Memória de Cálculo Aberta (Passo a Passo com Tributos Aplicados)
              </h3>
            </div>
            <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
              Memória discriminada linha por linha com todos os tributos incidentes em cada modelo,
              permitindo auditoria pontual por contadores e gestores:
            </p>

            <div className="space-y-4 font-mono text-xs">
              {/* Memória Cenário CLT */}
              <div className="bg-white rounded border border-neutral-200 p-4 space-y-2.5 overflow-x-auto">
                <span className="font-sans font-bold text-sm text-neutral-900 block pb-1 border-b border-neutral-100">
                  Cenário CLT: Composição de Custo e Retenções
                </span>

                <div className="text-neutral-700 space-y-1">
                  <p>Salário Contratual Bruto = {formatCurrencyBRL(calculation.bruto)}</p>
                  <p>
                    + FGTS Mensal (Lei 8.036/90): {formatCurrencyBRL(calculation.bruto)} × 8,00% ={' '}
                    {formatCurrencyBRL(calculation.fgtsMensalCLT)}
                  </p>
                  <p>
                    + INSS Patronal (Lei 8.212/91): {formatCurrencyBRL(calculation.bruto)} ×{' '}
                    {(calculation.aliqInssPatronal * 100).toFixed(0)}% ={' '}
                    {formatCurrencyBRL(calculation.inssPatronalCLT)}{' '}
                    {isEmpresaContratanteSimples
                      ? '(Simples: CPP na guia DAS)'
                      : '(Lucro Presumido/Real)'}
                  </p>
                  <p>
                    + Provisão 13º Salário (1/12): {formatCurrencyBRL(calculation.bruto)} ÷ 12 ={' '}
                    {formatCurrencyBRL(calculation.provisao13CLT)}
                  </p>
                  <p>
                    + Provisão Férias + 1/3 Constitucional (4/36): (
                    {formatCurrencyBRL(calculation.bruto)} × 4/3) ÷ 12 ={' '}
                    {formatCurrencyBRL(calculation.provisaoFeriasCLT)}
                  </p>
                  <p>
                    + FGTS sobre Provisões (8%): ({formatCurrencyBRL(calculation.provisao13CLT)} +{' '}
                    {formatCurrencyBRL(calculation.provisaoFeriasCLT)}) × 8,00% ={' '}
                    {formatCurrencyBRL(calculation.fgtsSobreProvisoesCLT)}
                  </p>
                  {!isEmpresaContratanteSimples && (
                    <p>
                      + INSS Patronal s/ Provisões (20%): (
                      {formatCurrencyBRL(calculation.provisao13CLT)} +{' '}
                      {formatCurrencyBRL(calculation.provisaoFeriasCLT)}) × 20,00% ={' '}
                      {formatCurrencyBRL(calculation.inssPatronalSobreProvisoesCLT)}
                    </p>
                  )}
                  <p>
                    + Provisão Multa Rescisória FGTS (40%): (
                    {formatCurrencyBRL(calculation.fgtsMensalCLT)} +{' '}
                    {formatCurrencyBRL(calculation.fgtsSobreProvisoesCLT)}) × 40,00% ={' '}
                    {formatCurrencyBRL(calculation.multaFgtsCLT)}
                  </p>
                  <p className="font-bold text-black pt-1">
                    Custo Total Mensal para a Empresa (CLT) ={' '}
                    {formatCurrencyBRL(calculation.custoEmpresaCLTMensal)}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-100 text-neutral-700 space-y-1">
                  <p className="font-sans font-semibold text-xs text-neutral-900">
                    Descontos na Fonte do Profissional (CLT):
                  </p>
                  <p>
                    - INSS Empregado (Portaria Interministerial MPS/MF nº 13/2026): progressivo por
                    faixas = {formatCurrencyBRL(calculation.inssEmpregadoCLT)}
                  </p>
                  <p>
                    - IRRF Tabela Progressiva (Bruto): {formatCurrencyBRL(calculation.irrfBrutoCLT)}{' '}
                    (base de {formatCurrencyBRL(calculation.baseIrrfCLT)} com {dependentes} dep.,
                    alíquota {(calculation.aliqIrrfCLT * 100).toFixed(1)}%)
                  </p>
                  {calculation.redutorLei15270CLT > 0 && (
                    <p className="text-emerald-800 font-semibold">
                      - redutor da Lei 15.270: {formatCurrencyBRL(calculation.redutorLei15270CLT)}
                    </p>
                  )}
                  <p>
                    - IRRF Efetivo Retido na Fonte ={' '}
                    {formatCurrencyBRL(calculation.irrfEmpregadoCLT)}
                  </p>
                  <p className="font-bold text-black pt-1">
                    Salário Líquido Mensal no Holerite (CLT) ={' '}
                    {formatCurrencyBRL(calculation.liquidoEmpregadoCLTMensal)}
                  </p>
                </div>
              </div>

              {/* Memória Cenário PJ */}
              <div className="bg-white rounded border border-neutral-200 p-4 space-y-2.5 overflow-x-auto">
                <span className="font-sans font-bold text-sm text-neutral-900 block pb-1 border-b border-neutral-100">
                  Cenário PJ: Tributos Aplicados e Deduções ({calculation.regimePJNome})
                </span>

                <div className="text-neutral-700 space-y-1">
                  <p>
                    Faturamento Bruto Mensal da Nota Fiscal = {formatCurrencyBRL(calculation.bruto)}
                  </p>
                  <p>
                    Custo da Empresa Contratante (PJ) ={' '}
                    {formatCurrencyBRL(calculation.custoEmpresaPJMensal)} (sem encargos
                    trabalhistas)
                  </p>

                  {isSimplesNacionalPJ ? (
                    <>
                      <p>
                        Receita Bruta 12 Meses Utilizada (RBT12) ={' '}
                        {formatCurrencyBRL(rbt12Estimada)} (Faixa {calculation.faixaIndicePJ} do{' '}
                        {anexoSelecionado.toUpperCase().replace('ANEXO', 'Anexo ')})
                      </p>
                      <p>
                        Alíquota Nominal da Faixa ={' '}
                        {(calculation.aliquotaNominalPJ * 100).toFixed(2)}% | Parcela a Deduzir ={' '}
                        {formatCurrencyBRL(calculation.parcelaDeducaoPJ)}
                      </p>
                      <p>
                        Fórmula LC 123/2006: (RBT12 × Alíq. Nominal − Parcela Ded.) ÷ RBT12 = (
                        {formatCurrencyBRL(rbt12Estimada)} ×{' '}
                        {(calculation.aliquotaNominalPJ * 100).toFixed(2)}% −{' '}
                        {formatCurrencyBRL(calculation.parcelaDeducaoPJ)}) ÷{' '}
                        {formatCurrencyBRL(rbt12Estimada)} ={' '}
                        <strong>{(calculation.aliquotaEfetivaPJ * 100).toFixed(4)}%</strong>
                      </p>
                      <p>
                        Guia Única DAS = {formatCurrencyBRL(calculation.bruto)} ×{' '}
                        {(calculation.aliquotaEfetivaPJ * 100).toFixed(4)}% ={' '}
                        {formatCurrencyBRL(calculation.totalTributosPJMensal)}
                      </p>
                    </>
                  ) : (
                    <>
                      {calculation.tributosPJDetalhes.map((t, idx) => (
                        <p key={idx}>
                          - {t.nome} ({t.aliq.toFixed(2)}%): {formatCurrencyBRL(t.valor)}
                        </p>
                      ))}
                      <p>
                        Total de Tributos Federais e Municipais ={' '}
                        {formatCurrencyBRL(calculation.totalTributosPJMensal)} (alíquota efetiva
                        total: {(calculation.aliquotaEfetivaPJ * 100).toFixed(2)}%)
                      </p>
                    </>
                  )}

                  <p>
                    - Despesas Operacionais Fixas da PJ ={' '}
                    {formatCurrencyBRL(calculation.custoOperacionalPJ)}
                  </p>
                  <p className="font-bold text-black pt-1">
                    Rendimento Líquido Efetivo do Profissional (PJ) ={' '}
                    {formatCurrencyBRL(calculation.bruto)} −{' '}
                    {formatCurrencyBRL(calculation.totalTributosPJMensal)} −{' '}
                    {formatCurrencyBRL(calculation.custoOperacionalPJ)} ={' '}
                    {formatCurrencyBRL(calculation.liquidoProfissionalPJMensal)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Captura de e-mail */}
          <CalculatorEmailCapture calculatorName="Calculadora PJ ou CLT" />
        </section>

        {/* 4. TEXTO DE APROFUNDAMENTO EM HTML ESTÁTICO (NÃO gerado por script) */}
        <article className="prose prose-neutral max-w-none mb-16 space-y-12">
          {/* Subtítulo 1: O que muda entre PJ e CLT na prática */}
          <section aria-labelledby="o-que-muda-na-pratica">
            <h2
              id="o-que-muda-na-pratica"
              className="text-2xl md:text-3xl font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              O que muda entre PJ e CLT na prática
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                A distinção entre a contratação celetista (empregado com carteira assinada regido
                pelo Decreto-Lei nº 5.452/1943) e a contratação de prestação de serviços por pessoa
                jurídica (PJ, regulada pelo Código Civil e pela Lei nº 13.429/2017) vai muito além
                da matemática tributária. Trata-se de uma diferença estrutural de natureza jurídica,
                risco patrimonial e dinâmica operacional no dia a dia da empresa.
              </p>
              <p>
                No regime <strong>CLT</strong>, vigora o princípio protetivo do Direito do Trabalho,
                fundado na dependência econômica e jurídica do empregado perante o empregador. Estão
                compulsoriamente presentes os requisitos legais do artigo 3º da CLT: pessoa física,
                pessoalidade, não eventualidade, onerosidade e, elemento nuclear, a{' '}
                <strong>subordinação hierárquica</strong>. O trabalhador possui jornada pré-fixada,
                submete-se ao poder diretivo e disciplinar da empresa e conta com uma rede de
                garantias legais cogentes (salário mínimo, 13º salário, férias de 30 dias acrescidas
                de 1/3, FGTS, aviso prévio e seguro-desemprego).
              </p>
              <p>
                No modelo <strong>PJ</strong>, a relação jurídica estabelece-se entre duas entidades
                empresariais autônomas (contratante e contratada). O objeto do contrato é o
                resultado da entrega de um serviço técnico ou intelectual especializado, e não a
                disponibilização do tempo do indivíduo. Não há subordinação, não há controle de
                ponto, não há ingerência diretiva e a remuneração é pactuada livremente entre as
                partes via nota fiscal mercantil. O profissional assume a condição de empresário,
                suportando os riscos do seu negócio, sua tributação corporativa e seus custos
                operacionais.
              </p>
            </div>
          </section>

          {/* Subtítulo 2: O que a empresa deixa de pagar contratando PJ e o que ela assume de risco */}
          <section aria-labelledby="o-que-a-empresa-deixa-de-pagar">
            <h2
              id="o-que-a-empresa-deixa-de-pagar"
              className="text-2xl md:text-3xl font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              O que a empresa deixa de pagar contratando PJ e o que ela assume de risco
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                Do ponto de vista financeiro imediato, a empresa contratante obtém uma desoneração
                expressiva ao substituir ou estruturar postos de trabalho como PJ em vez de CLT. Ao
                firmar um contrato mercantil de prestação de serviços, a tomadora deixa de recolher
                e provisionar:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>
                  <strong>Encargos Previdenciários Patronais:</strong> 20% de cota básica de INSS
                  patronal sobre a remuneração bruta (para empresas fora do Simples Nacional), além
                  das alíquotas de RAT/FAP e contribuições devidas a terceiros (Sistema S,
                  Salário-Educação, INCRA);
                </li>
                <li>
                  <strong>Fundo de Garantia do Tempo de Serviço (FGTS):</strong> depósito
                  obrigatório mensal de 8% em conta vinculada do trabalhador (Lei nº 8.036/1990);
                </li>
                <li>
                  <strong>Provisões Salariais e Encargos Reflexos:</strong> o pagamento do 13º
                  salário integral (Lei nº 4.090/1962), a remuneração de férias anuais gozadas
                  acrescidas do terço constitucional e seus respectivos encargos;
                </li>
                <li>
                  <strong>Passivo Rescisório:</strong> a multa compensatória de 40% sobre todos os
                  depósitos acumulados do FGTS na hipótese de rescisão imotivada, além do aviso
                  prévio proporcional ao tempo de serviço (Lei nº 12.506/2011).
                </li>
              </ul>
              <p>
                Entretanto, em contrapartida a essa economia financeira, a empresa assume um{' '}
                <strong>risco trabalhista substancial</strong> caso a relação não preserve estrita
                autonomia. Na hipótese de uma reclamatória trabalhista com declaração de nulidade do
                contrato de prestação de serviços (artigo 9º da CLT), a Justiça do Trabalho condena
                a tomadora ao pagamento retroativo de todas as verbas do período imprescrito
                (últimos 5 anos), com juros e correção monetária, acrescido de multas dos artigos
                467 e 477 da CLT e do recolhimento das contribuições previdenciárias e fiscais
                omitidas perante a Receita Federal do Brasil.
              </p>
            </div>
          </section>

          {/* Subtítulo 3: O que o profissional ganha e perde em cada modelo */}
          <section aria-labelledby="o-que-o-profissional-ganha-e-perde">
            <h2
              id="o-que-o-profissional-ganha-e-perde"
              className="text-2xl md:text-3xl font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              O que o profissional ganha e perde em cada modelo
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                A decisão de atuar como pessoa jurídica ou manter-se como funcionário celetista
                exige uma análise prudente de perfil de carreira, momento financeiro e capacidade de
                autogestão. Cada modalidade apresenta vantagens e ônus determinantes:
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="border border-neutral-200 rounded-lg p-5 bg-white">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-semibold text-neutral-800">
                      Cenário CLT
                    </span>
                    <h3 className="font-bold text-base text-black">Vantagens e Limitações</h3>
                  </div>
                  <div className="space-y-2 text-xs md:text-sm text-neutral-700">
                    <p>
                      <strong className="text-black">Ganha:</strong> estabilidade contratual
                      relativa, previsibilidade de renda, férias remuneradas garantidas, 13º
                      salário, depósitos de FGTS com rendimento e garantia para aquisição
                      imobiliária, licença-maternidade/paternidade remunerada pela Previdência e
                      seguro-desemprego em desligamentos imotivados.
                    </p>
                    <p>
                      <strong className="text-black">Perde:</strong> liquidez imediata fortemente
                      corroída pela retenção de até 27,5% de IRRF na fonte e até 14% de INSS;
                      rigidez de horário e subordinação gerencial; vedação prática a prestar
                      serviços a concorrentes no mesmo horário de expediente.
                    </p>
                  </div>
                </div>

                <div className="border border-neutral-200 rounded-lg p-5 bg-white">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-semibold text-neutral-800">
                      Cenário PJ
                    </span>
                    <h3 className="font-bold text-base text-black">Vantagens e Limitações</h3>
                  </div>
                  <div className="space-y-2 text-xs md:text-sm text-neutral-700">
                    <p>
                      <strong className="text-black">Ganha:</strong> remuneração líquida
                      significativamente maior na mão mês a mês; tributação corporativa reduzida (a
                      partir de 6% no Simples Nacional contra até 27,5% no IRPF); liberdade para
                      atender múltiplos clientes simultaneamente e flexibilidade de horários e
                      método de trabalho.
                    </p>
                    <p>
                      <strong className="text-black">Perde:</strong> ausência de rede de proteção
                      trabalhista; zero depósito de FGTS; necessidade de planejar reservas para
                      períodos de férias não faturados; custos com contabilidade mensal, certificado
                      digital e taxa de fiscalização municipal; assunção dos riscos de cancelamento
                      contratual sem indenização de 40%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Subtítulo 4: Por que margem e anexo do Simples mudam a resposta */}
          <section aria-labelledby="por-que-margem-e-anexo-mudam">
            <h2
              id="por-que-margem-e-anexo-mudam"
              className="text-2xl md:text-3xl font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              Por que margem e anexo do Simples mudam a resposta
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                Um dos erros mais graves na tomada de decisão entre PJ e CLT é presumir que toda
                contratação PJ paga uma taxa fixa de imposto de 6%. Na realidade, a alíquota efetiva
                do Simples Nacional é progressiva e diretamente dependente do enquadramento no anexo
                correspondente da Lei Complementar nº 123/2006 e da apuração da receita bruta
                acumulada dos últimos 12 meses (RBT12).
              </p>
              <p>
                Para prestadores de serviços de natureza intelectual, científica ou tecnológica
                (como desenvolvimento de software, consultoria em TI, engenharia, medicina ou
                marketing), a lei estabelece a regra do <strong>Fator R</strong> (art. 18, §§ 5º-J e
                5º-M):
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>
                  Se a folha de pagamento da PJ (incluindo o pró-labore dos sócios e encargos
                  previdenciários) representar <strong>28,00% ou mais</strong> do faturamento
                  acumulado, a empresa é tributada pelo <strong>Anexo III</strong>, cuja alíquota
                  inicial é de 6,00% e a alíquota efetiva média raramente ultrapassa 9% a 12% para
                  faturamentos típicos;
                </li>
                <li>
                  Se a folha for inferior a 28,00%, a atividade migra compulsoriamente para o{' '}
                  <strong>Anexo V</strong>, cuja alíquota inicial é de <strong>15,50%</strong>,
                  podendo atingir mais de 20% a 23% nas faixas intermediárias.
                </li>
              </ul>
              <p>
                Nesse contexto, um profissional que fature R$ 15.000,00 como PJ no Anexo III
                recolherá aproximadamente 6% de DAS (R$ 900,00). No entanto, se o mesmo profissional
                for enquadrado inadvertidamente no Anexo V sem planejamento de pró-labore, seu
                recolhimento saltará para mais de 15,50% (R$ 2.325,00), além das taxas municipais e
                contábeis. Portanto, a margem de faturamento, a estrutura de folha e o anexo do
                Simples são variáveis determinantes que podem aproximar ou afastar a vantagem da PJ
                frente à CLT.
              </p>
            </div>
          </section>

          {/* Subtítulo 5: Riscos de pejotização, precedentes do TST sobre subordinação e análise caso a caso */}
          <section aria-labelledby="riscos-de-pejotizacao">
            <h2
              id="riscos-de-pejotizacao"
              className="text-2xl md:text-3xl font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              Riscos de pejotização, com menção a precedentes do TST sobre subordinação e a nota de
              que a análise deve ser feita caso a caso
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                O termo "pejotização" designa o fenômeno jurídico e fiscal pelo qual uma pessoa
                física é induzida ou orientada a constituir uma pessoa jurídica exclusivamente para
                prestar serviços a um único tomador, mascarando uma autêntica relação de emprego
                celetista com o intuito de reduzir a carga tributária e suprimir encargos
                trabalhistas.
              </p>
              <p>
                O artigo 9º da CLT preconiza expressamente que{' '}
                <em>
                  "serão nulos de pleno direito os atos praticados com o objetivo de desvirtuar,
                  impedir ou fraudar a aplicação dos preceitos contidos na presente Consolidação"
                </em>
                . No âmbito do Tribunal Superior do Trabalho (TST) e da jurisprudência consolidada
                dos Tribunais Regionais do Trabalho (TRTs), vigora de forma soberana o{' '}
                <strong>Princípio da Primazia da Realidade sobre a Forma</strong>: pouco importa o
                título conferido ao contrato ou o fato de a pessoa jurídica estar regularmente
                inscrita no CNPJ e emitindo notas fiscais; se no plano fático-comportamental
                restarem demonstrados os requisitos do vínculo de emprego, a relação celetista será
                judicialmente reconhecida.
              </p>
              <div className="p-4 bg-neutral-100 border border-neutral-200 rounded-lg text-sm text-neutral-800 space-y-2">
                <p className="font-semibold text-black">
                  Critérios e precedentes do Tribunal Superior do Trabalho (TST):
                </p>
                <p>
                  A jurisprudência do TST afere com especial rigor os indícios de subordinação
                  clássica e estrutural. São elementos frequentemente considerados determinantes
                  para a descaracterização da PJ e reconhecimento de vínculo celetista:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm text-neutral-700">
                  <li>
                    Imposição de cumprimento estrito de jornada, com controle de ponto ou horários
                    fixos de conexão e atendimento;
                  </li>
                  <li>
                    Subordinação hierárquica direta a supervisores internos da contratante, com
                    recebimento de ordens disciplinares e advertências;
                  </li>
                  <li>
                    Exigência de exclusividade na prestação de serviços e proibição tácita de
                    atendimento a clientes concorrentes;
                  </li>
                  <li>
                    Integração orgânica do profissional ao núcleo essencial da atividade-fim da
                    tomadora sem autonomia na condução de seus métodos;
                  </li>
                  <li>
                    Fornecimento integral dos instrumentos de trabalho (computadores, licenças de
                    software, e-mails corporativos sob domínio da tomadora).
                  </li>
                </ul>
              </div>
              <p>
                Embora o Supremo Tribunal Federal (STF), no julgamento do Tema 725 (ADPF 324) e da
                ADC 48, tenha chancelado a licitude da terceirização ampla de qualquer atividade-fim
                ou meio, as próprias decisões do Supremo ressalvam que essa validade pressupõe
                ausência de fraude material e efetiva autonomia contratual entre as partes.
              </p>
              <p className="font-medium text-neutral-900">
                Por essa razão, a análise sobre contratar ou atuar como PJ versus CLT não deve
                jamais se resumir a um comparativo numérico em planilhas. A decisão deve ser
                conduzida <strong>caso a caso</strong>, avaliando minuciosamente a rotina de
                trabalho pretendida, as convenções coletivas da categoria econômica e as balizas
                contratuais estruturadas pela assessoria jurídica e contábil.
              </p>
            </div>
          </section>
        </article>

        {/* 5. BLOCO DE VIGÊNCIA VISÍVEL CITANDO A BASE LEGAL EXIGIDA */}
        <section
          aria-labelledby="vigencia-title"
          className="border border-neutral-200 bg-white rounded-xl p-6 mb-8 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <Scale className="h-5 w-5 text-neutral-800 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 id="vigencia-title" className="font-bold text-base text-black">
                  Vigência Normativa e Base Legal Aplicada
                </h3>
                <span className="text-xs font-mono bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded border border-neutral-300">
                  {FOLHA_TRABALHISTA_VIGENCIA.rotuloConferencia}
                </span>
              </div>
              <p className="text-sm text-neutral-700 leading-relaxed">
                As regras aritméticas, parâmetros tributários e encargos patronais aplicados nesta
                ferramenta observam com rigor os seguintes diplomas legais vigentes:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs md:text-sm text-neutral-700">
                <li>
                  <strong>Portaria Interministerial MPS/MF nº 13/2026:</strong> nova tabela
                  progressiva de contribuição dos segurados empregados (faixas até R$ 1.621,00; R$
                  2.902,84; R$ 4.354,27 e teto de R$ 8.475,55);
                </li>
                <li>
                  <strong>Lei nº 15.270/2025:</strong> redução do imposto de renda mensal (art. 3º-A
                  da Lei nº 9.250/1995), com isenção integral para rendimentos tributáveis até R$
                  5.000,00 e redutor proporcional até R$ 7.350,00;
                </li>
                <li>
                  <strong>Lei nº 8.212 de 1991 (Lei Orgânica da Seguridade Social):</strong>{' '}
                  fundamentação da contribuição previdenciária patronal básica de 20% sobre a folha
                  de salários e das alíquotas progressivas devidas pelos segurados empregados;
                </li>
                <li>
                  <strong>
                    Lei nº 8.036 de 1990 (Lei do Fundo de Garantia do Tempo de Serviço):
                  </strong>{' '}
                  recolhimento mensal de 8% de FGTS e apuração da indenização compensatória de 40%
                  devida na dispensa imotivada (art. 18, § 1º);
                </li>
                <li>
                  <strong>
                    Lei Complementar nº 123 de 2006 (Estatuto Nacional da Microempresa e EPP):
                  </strong>{' '}
                  disciplina dos Anexos I a V, metodologia de alíquota efetiva progressiva com
                  parcelas a deduzir (art. 18) e unificação da Contribuição Previdenciária Patronal
                  no DAS;
                </li>
                <li>
                  <strong>Tabela Progressiva do IRRF Vigente (exercício 2026):</strong> isenção
                  mensal de R$ 2.428,80, desconto simplificado de R$ 607,20 e dedução de R$ 189,59
                  por dependente legal;
                </li>
                <li>
                  <strong>
                    Decreto-Lei nº 5.452 de 1943 (Consolidação das Leis do Trabalho) e Lei nº 13.429
                    de 2017:
                  </strong>{' '}
                  disposições sobre vínculos empregatícios, terço de férias e marcos regulatórios de
                  prestação de serviços a terceiros.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. AVISO LEGAL DE ESTIMATIVA com link para /contato deixando claro que a ferramenta não avalia risco trabalhista */}
        <section
          aria-labelledby="aviso-legal-title"
          className="border border-neutral-200 bg-neutral-50 rounded-xl p-6 mb-12"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-neutral-700 shrink-0 mt-0.5" />
            <div>
              <h3 id="aviso-legal-title" className="font-bold text-base text-black mb-1">
                Aviso Legal de Estimativa e Risco Trabalhista
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                Os resultados calculados por esta ferramenta são estimativas orientativas puramente
                aritméticas baseadas nos parâmetros informados e nas tabelas legais vigentes.{' '}
                <strong>
                  Esta ferramenta não avalia nem chancela o risco trabalhista decorrente da relação
                  mantida entre as partes.
                </strong>{' '}
                A caracterização de subordinação, pessoalidade e habitualidade depende do plano
                fático do dia a dia e está sujeita à fiscalização do Ministério do Trabalho e
                Emprego (MTE) e ao juízo da Justiça do Trabalho. Para uma avaliação jurídica e
                contábil personalizada do modelo de contratação da sua empresa, entre em contato com
                nossa equipe pela página de{' '}
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

        {/* 7. CINCO PERGUNTAS FREQUENTES COM RESPOSTAS CURTAS NO HTML ESTÁTICO */}
        <section aria-labelledby="faq-pj-clt-title" className="mb-14">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 border border-neutral-300 bg-neutral-100 px-3 py-1 rounded text-xs font-mono uppercase tracking-wider text-neutral-800 mb-2">
              <HelpCircle className="h-3.5 w-3.5 text-black" />
              Dúvidas Técnicas Frequentes
            </div>
            <h2 id="faq-pj-clt-title" className="text-2xl md:text-3xl font-bold text-black">
              Perguntas Frequentes sobre PJ ou CLT
            </h2>
            <p className="text-neutral-600 text-sm md:text-base">
              Esclarecimentos objetivos sobre tributos, segurança jurídica e viabilidade de modelos
              de contratação.
            </p>
          </div>

          <div className="border border-neutral-200 bg-white rounded-xl p-6 md:p-8 shadow-sm">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-neutral-200 last:border-b-0 pb-2"
                >
                  <AccordionTrigger className="text-left font-semibold text-base md:text-lg text-black hover:no-underline hover:text-neutral-700 py-3">
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

        {/* 8. CALCULADORAS RELACIONADAS COM TRÊS LINKS:
            - Custo de Funcionário CLT (/calculadoras/custo-de-funcionario-clt)
            - Pró-labore ou Dividendos (/calculadoras/pro-labore-ou-dividendos)
            - Fator R (/calculadoras/fator-r) */}
        <section aria-labelledby="calculadoras-relacionadas-title" className="mb-14">
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-1">
              Ferramentas Complementares
            </span>
            <h2
              id="calculadoras-relacionadas-title"
              className="text-xl md:text-2xl font-bold text-black"
            >
              Calculadoras Relacionadas
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {/* Link 1: Custo de Funcionário CLT */}
            <Link
              to="/calculadoras/custo-de-funcionario-clt"
              className="group border border-neutral-200 bg-white hover:border-neutral-400 p-5 rounded-xl transition-all duration-200 flex flex-col justify-between shadow-sm"
            >
              <div>
                <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                  Folha e Trabalhista
                </span>
                <h3 className="font-bold text-base text-black mb-2 group-hover:underline">
                  Custo de Funcionário CLT
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Cálculo detalhado do custo real de contratação CLT para a empresa: encargos
                  patronais, FGTS e provisões.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center text-xs font-medium text-black">
                Acessar simulador{' '}
                <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Link 2: Pró-labore ou Dividendos */}
            <Link
              to="/calculadoras/pro-labore-ou-dividendos"
              className="group border border-neutral-200 bg-white hover:border-neutral-400 p-5 rounded-xl transition-all duration-200 flex flex-col justify-between shadow-sm"
            >
              <div>
                <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                  Folha e Trabalhista
                </span>
                <h3 className="font-bold text-base text-black mb-2 group-hover:underline">
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

            {/* Link 3: Fator R */}
            <Link
              to="/calculadoras/fator-r"
              className="group border border-neutral-200 bg-white hover:border-neutral-400 p-5 rounded-xl transition-all duration-200 flex flex-col justify-between shadow-sm"
            >
              <div>
                <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                  Regime Tributário
                </span>
                <h3 className="font-bold text-base text-black mb-2 group-hover:underline">
                  Fator R
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Cálculo da relação entre folha de salários e receita bruta para enquadramento no
                  Anexo III ou Anexo V.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center text-xs font-medium text-black">
                Acessar simulador{' '}
                <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </section>

        {/* CHAMADA FINAL PARA CONTATO CONSULTIVO */}
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
              className="text-2xl md:text-3xl font-bold text-white leading-tight"
            >
              Deseja estruturar contratos PJ ou planejar a folha da sua empresa?
            </h2>

            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
              Nossa equipe técnica atua na modelagem fiscal e trabalhista de contratos corporativos,
              enquadramento no Simples Nacional e parametrização do eSocial com total segurança e
              conformidade normativa.
            </p>

            <div className="pt-3 flex justify-center">
              <Button
                asChild
                size="lg"
                className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-base h-12 px-8 shadow-sm"
              >
                <Link to="/contato">Agendar Análise Preliminar com Nossos Especialistas</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
