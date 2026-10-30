import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FOLHA_TRABALHISTA_VIGENCIA,
  calcularINSSEmpregado,
  calcularIRRFEmpregado,
  SALARIO_MINIMO_2026,
} from '@/lib/folhaData'
import { getIndexEntries, IndexEntryRecord, resolveIndexValueForDate } from '@/services/indices'
import {
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Calculator,
  HelpCircle,
  AlertCircle,
  AlertTriangle,
  FileCheck2,
  Scale,
  Briefcase,
  Users,
  Building2,
  CheckCircle2,
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

export default function CustoDeFuncionarioCLTCalculator() {
  // Estado das entradas (valores iniciais realistas para exibição imediata)
  const [salarioBase, setSalarioBase] = useState<number>(4500)
  const [salarioInput, setSalarioInput] = useState<string>('4.500,00')
  const [dependentes, setDependentes] = useState<number>(0)
  const [dependentesInput, setDependentesInput] = useState<string>('0')
  const [isSimplesNacional, setIsSimplesNacional] = useState<boolean>(true)
  const [dataCompetencia, setDataCompetencia] = useState<string>('2026-01-01')

  // Série histórica de vigências do salário mínimo federal
  const [dbEntries, setDbEntries] = useState<IndexEntryRecord[]>([])

  // Adicionais trabalhistas
  const [hasInsalubridade, setHasInsalubridade] = useState<boolean>(false)
  const [grauInsalubridade, setGrauInsalubridade] = useState<number>(20) // 10%, 20% ou 40% sobre salário mínimo

  const [hasPericulosidade, setHasPericulosidade] = useState<boolean>(false) // 30% sobre salário base

  const [hasAdicionalNoturno, setHasAdicionalNoturno] = useState<boolean>(false)
  const [adicionalNoturnoValor, setAdicionalNoturnoValor] = useState<number>(0)
  const [adicionalNoturnoInput, setAdicionalNoturnoInput] = useState<string>('')

  // SEO: título da aba (máximo 60 caracteres) e meta description (máximo 155 caracteres)
  useEffect(() => {
    // 56 caracteres, começa com "calculadora custo funcionário clt"
    const pageTitle =
      'Calculadora de Custo de Funcionário CLT | PERES PERES Consultoria & Contabilidade'
    const pageDesc =
      'Calcule quanto custa um funcionário CLT para a empresa em tempo real: encargos patronais, FGTS, provisões de férias, 13º e descontos do empregado.'

    document.title = pageTitle
    let metaDescTag = document.querySelector('meta[name="description"]')
    if (!metaDescTag) {
      metaDescTag = document.createElement('meta')
      metaDescTag.setAttribute('name', 'description')
      document.head.appendChild(metaDescTag)
    }
    metaDescTag.setAttribute('content', pageDesc)

    // Carrega vigências do índice de Salário Mínimo Federal
    getIndexEntries('salario-minimo-federal')
      .then((entries) => {
        if (entries && entries.length > 0) {
          setDbEntries(entries)
        }
      })
      .catch((err) => console.log('Uso de vigência padrão salário mínimo:', err))

    // Registra contagem de acesso no painel administrativo
    import('@/services/calculator_accesses').then(({ trackCalculatorAccess }) => {
      trackCalculatorAccess('custo-de-funcionario-clt', 'Custo de Funcionário CLT')
    })
  }, [])

  // Handlers para os campos numéricos
  const handleSalarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseRawToNumber(e.target.value)
    setSalarioBase(num)
    setSalarioInput(formatRawInput(num))
  }

  const handleDependentesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    const val = raw ? parseInt(raw, 10) : 0
    const clamped = Math.min(20, Math.max(0, val))
    setDependentes(clamped)
    setDependentesInput(clamped.toString())
  }

  const handleNoturnoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseRawToNumber(e.target.value)
    setAdicionalNoturnoValor(num)
    setAdicionalNoturnoInput(formatRawInput(num))
  }

  // Cálculos em tempo real
  const calculation = useMemo(() => {
    // Resolução da vigência do salário mínimo para a competência informada
    const indexCheck = resolveIndexValueForDate(dbEntries, dataCompetencia)
    const isPeriodoSemDados = dbEntries.length > 0 ? indexCheck.isBeforeEarliest : false
    const primeiraVigenciaStr = indexCheck.earliestDate
      ? indexCheck.earliestDate.toLocaleDateString('pt-BR')
      : '01/01/2026'

    // Valor do salário mínimo aplicável (se houver entrada cadastrada no banco)
    let salarioMinimoAplicavel = SALARIO_MINIMO_2026
    if (indexCheck.found && indexCheck.entry) {
      const parsedVal = parseFloat(indexCheck.entry.value.replace(/[^\d,.]/g, '').replace(',', '.'))
      if (!isNaN(parsedVal) && parsedVal > 0) {
        salarioMinimoAplicavel = parsedVal
      }
    }

    // 1. Adicionais que integram a remuneração bruta
    let valorInsalubridade = 0
    if (hasInsalubridade) {
      valorInsalubridade = salarioMinimoAplicavel * (grauInsalubridade / 100)
    }

    let valorPericulosidade = 0
    if (hasPericulosidade) {
      valorPericulosidade = salarioBase * 0.3
    }

    const valorNoturno = hasAdicionalNoturno ? adicionalNoturnoValor : 0

    // Salário bruto total mensal (base de incidência para encargos e verbas)
    const salarioBrutoTotal = salarioBase + valorInsalubridade + valorPericulosidade + valorNoturno

    // Validação de piso nacional
    const isAbaixoSalarioMinimo = salarioBase > 0 && salarioBase < SALARIO_MINIMO_2026

    // 2. ENCARGOS E PROVISÕES DO LADO DA EMPRESA
    // - INSS Patronal: 20% ou ZERO quando Simples Nacional
    const aliqInssPatronal = isSimplesNacional ? 0 : 0.2
    const inssPatronalValor = salarioBrutoTotal * aliqInssPatronal

    // - FGTS mensal: 8%
    const fgtsMensalValor = salarioBrutoTotal * 0.08

    // - Provisão de 13º Salário: 1/12 (8,3333...%)
    const provisao13Valor = salarioBrutoTotal / 12

    // - Provisão de Férias com 1/3 Constitucional: (1/12) + (1/12 * 1/3) = 4/36 = 1/9 (11,1111...%)
    const provisaoFeriasValor = (salarioBrutoTotal * (4 / 3)) / 12

    // Encargos sobre as provisões (FGTS 8% + INSS Patronal se não-Simples)
    // FGTS sobre 13º e férias: 8% * (provisao13 + provisaoFerias)
    const fgtsSobreProvisoes = (provisao13Valor + provisaoFeriasValor) * 0.08
    const inssPatronalSobreProvisoes = isSimplesNacional
      ? 0
      : (provisao13Valor + provisaoFeriasValor) * 0.2

    // - Provisão da Multa Rescisória do FGTS (40% sobre o FGTS total acumulado):
    // FGTS mensal total gerado = FGTS direto + FGTS sobre 13º e férias
    const fgtsTotalMensalGerado = fgtsMensalValor + fgtsSobreProvisoes
    const provisaoMultaFgtsValor = fgtsTotalMensalGerado * 0.4

    // Total de Encargos e Provisões da Empresa (além do salário bruto)
    const totalEncargosEmpresaMensal =
      inssPatronalValor +
      fgtsMensalValor +
      provisao13Valor +
      provisaoFeriasValor +
      fgtsSobreProvisoes +
      inssPatronalSobreProvisoes +
      provisaoMultaFgtsValor

    // Total mensal que sai do bolso da empresa (remuneração bruta + encargos e provisões)
    const custoTotalEmpresaMensal = salarioBrutoTotal + totalEncargosEmpresaMensal

    // Custo anual para a empresa (12 meses de custo operacional completo)
    const custoTotalEmpresaAnual = custoTotalEmpresaMensal * 12

    // Multiplicador / percentual de custo sobre o salário bruto
    const percentualCustoAdicional =
      salarioBrutoTotal > 0 ? (totalEncargosEmpresaMensal / salarioBrutoTotal) * 100 : 0

    // 3. DESCONTOS DO LADO DO EMPREGADO (o que é descontado e salário líquido)
    const inssEmpregado = calcularINSSEmpregado(salarioBrutoTotal)
    const {
      irrfBruto: irrfEmpregadoBruto,
      redutorLei15270: redutorLei15270Empregado,
      irrfFinal: irrfEmpregado,
      baseUsada: baseIrrfUsada,
      faixaAliq: aliqIrrf,
    } = calcularIRRFEmpregado(salarioBrutoTotal, inssEmpregado, dependentes)

    const totalDescontosEmpregado = inssEmpregado + irrfEmpregado
    const salarioLiquidoEmpregado = Math.max(0, salarioBrutoTotal - totalDescontosEmpregado)

    return {
      isPeriodoSemDados,
      primeiraVigencia: primeiraVigenciaStr,
      salarioMinimoAplicavel,
      salarioBase,
      salarioBrutoTotal,
      valorInsalubridade,
      valorPericulosidade,
      valorNoturno,
      // Empresa
      aliqInssPatronal,
      inssPatronalValor,
      fgtsMensalValor,
      provisao13Valor,
      provisaoFeriasValor,
      fgtsSobreProvisoes,
      inssPatronalSobreProvisoes,
      provisaoMultaFgtsValor,
      totalEncargosEmpresaMensal,
      custoTotalEmpresaMensal,
      custoTotalEmpresaAnual,
      percentualCustoAdicional,
      // Empregado
      inssEmpregado,
      irrfEmpregadoBruto,
      redutorLei15270Empregado,
      irrfEmpregado,
      baseIrrfUsada,
      aliqIrrf,
      totalDescontosEmpregado,
      salarioLiquidoEmpregado,
    }
  }, [
    salarioBase,
    hasInsalubridade,
    grauInsalubridade,
    hasPericulosidade,
    hasAdicionalNoturno,
    adicionalNoturnoValor,
    isSimplesNacional,
    dependentes,
    dataCompetencia,
    dbEntries,
  ])

  // FAQ com CINCO perguntas e respostas curtas e diretas
  const faqs = [
    {
      q: 'Quanto custa um funcionário CLT além do salário bruto?',
      a: 'Em empresas do Simples Nacional (Anexos I, II e III), o custo adicional varia entre 35% e 45% acima do salário bruto, somando FGTS, férias, 13º e provisão rescisória. Em empresas do Lucro Presumido ou Lucro Real, o acréscimo alcança entre 65% e 80% devido ao INSS patronal de 20% e encargos de terceiros.',
    },
    {
      q: 'Por que o INSS patronal é zero para a maioria das empresas do Simples Nacional?',
      a: 'Porque a Contribuição Previdenciária Patronal (CPP) já está embutida na alíquota única do DAS recolhida mensalmente sobre a receita bruta (art. 13, VI, da LC 123/2006). Apenas empresas do Anexo IV recolhem o INSS patronal de 20% em guia separada (GPS/DARF Previdenciário).',
    },
    {
      q: 'Qual é a diferença entre o que a empresa gasta e o que o funcionário recebe líquido?',
      a: 'Do lado do empregado, são descontados o INSS (7,5% a 14% progressivo) e o IRRF na fonte (até 27,5%), reduzindo o valor creditado na conta bancária. Do lado da empresa, além do salário bruto contratado, há despesas obrigatórias de FGTS (8%), provisão de férias com 1/3, provisão de 13º salário e multa rescisória.',
    },
    {
      q: 'O que acontece se a empresa não provisionar férias e 13º mês a mês?',
      a: 'A empresa compromete severamente o fluxo de caixa. No mês de concessão de férias e nos meses de novembro e dezembro (pagamento do 13º), haverá uma sobrecarga financeira imediata de salários dobrados e recolhimentos adicionais, o que costuma forçar a contratação de crédito bancário com juros elevados.',
    },
    {
      q: 'Adicionais de insalubridade, periculosidade e noturno entram na base de FGTS e INSS?',
      a: 'Sim. Todos os adicionais de natureza salarial habituais integram a remuneração para todos os efeitos legais (Súmulas 139 e 264 do TST), incidindo FGTS (8%), INSS patronal, INSS do empregado, IRRF e refletindo obrigatoriamente no cálculo de férias e 13º salário.',
    },
  ]

  // Dados Estruturados JSON-LD: SoftwareApplication, BreadcrumbList e FAQPage
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://peresperes.com.br/calculadoras/custo-de-funcionario-clt#software',
        name: 'Calculadora de Custo de Funcionário CLT: Encargos e Salário Líquido',
        url: 'https://peresperes.com.br/calculadoras/custo-de-funcionario-clt',
        applicationCategory: 'FinancialApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        description:
          'Ferramenta para cálculo em tempo real de quanto custa um funcionário CLT para a empresa: INSS patronal, FGTS, provisões de férias, 13º salário e descontos.',
        provider: {
          '@type': 'AccountingService',
          name: 'PERES PERES Consultoria & Contabilidade',
          url: 'https://peresperes.com.br',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://peresperes.com.br/calculadoras/custo-de-funcionario-clt#breadcrumb',
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
            name: 'Custo de Funcionário CLT',
            item: 'https://peresperes.com.br/calculadoras/custo-de-funcionario-clt',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://peresperes.com.br/calculadoras/custo-de-funcionario-clt#faq',
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
      {/* 9. Dados estruturados JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="container mx-auto px-4 max-w-4xl">
        {/* 1. TRILHA E TÍTULO */}
        {/* Trilha: Início > Calculadoras > Custo de Funcionário CLT */}
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
          <span className="text-black font-medium">Custo de Funcionário CLT</span>
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
            Folha e Trabalhista • Planejamento de Custos
          </div>

          {/* Título principal EXATO exigido na especificação */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-5 leading-tight">
            Quanto custa um funcionário CLT para a empresa
          </h1>

          {/* Parágrafo curto de duas linhas explicando que a ferramenta soma salário e encargos mensais e anuais */}
          <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
            Esta ferramenta calcula a composição financeira completa da contratação celetista,
            somando o salário contratual, os encargos patronais e as provisões mensais e anuais
            obrigatórias para a empresa.
          </p>
        </header>

        {/* 2. BLOCO DA CALCULADORA INTERATIVA (única parte em JavaScript) */}
        <section
          aria-labelledby="calculadora-custo-heading"
          className="border border-neutral-200 bg-white rounded-xl shadow-sm p-6 md:p-8 mb-12"
        >
          <div className="flex items-center justify-between pb-6 border-b border-neutral-200 mb-6">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-neutral-900" />
              <h2
                id="calculadora-custo-heading"
                className="text-xl md:text-2xl font-bold text-black"
              >
                Simulação em Tempo Real
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
              Atualização Instantânea
            </span>
          </div>

          {/* Aviso quando período consultado é anterior à primeira vigência do índice */}
          {calculation.isPeriodoSemDados && (
            <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-amber-950">
                  Período sem dados no sistema para este índice
                </p>
                <p className="text-amber-800 mt-1">
                  A competência selecionada (
                  {calculation.primeiraVigencia
                    ? `anterior a ${calculation.primeiraVigencia}`
                    : 'informada'}
                  ) é anterior à primeira vigência cadastrada do salário mínimo federal no sistema.
                  O cálculo abaixo utiliza o parâmetro base atual (
                  {formatCurrencyBRL(calculation.salarioMinimoAplicavel)}) como referência
                  preventiva.
                </p>
              </div>
            </div>
          )}

          {/* Seletor de Competência da Folha (vigência histórica do Salário Mínimo) */}
          <div className="mb-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label
                htmlFor="input-competencia"
                className="block text-sm font-semibold text-neutral-900"
              >
                Competência de referência da folha
              </label>
              <p className="text-xs text-neutral-500">
                Determina a vigência oficial aplicável do salário mínimo federal e tabelas da
                previdência.
              </p>
            </div>
            <div className="w-full sm:w-56">
              <Input
                id="input-competencia"
                type="date"
                value={dataCompetencia}
                onChange={(e) => setDataCompetencia(e.target.value)}
                className="font-mono text-sm border-neutral-300 bg-white"
              />
            </div>
          </div>

          {/* Campos de entrada */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Campo 1: Salário bruto mensal */}
            <div>
              <label
                htmlFor="input-salario"
                className="block text-sm font-semibold text-neutral-900 mb-1.5"
              >
                Salário bruto mensal
              </label>
              <p className="text-xs text-neutral-500 mb-2">
                Remuneração base contratual registrada em carteira (CTPS).
              </p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-500 font-mono">
                  R$
                </span>
                <Input
                  id="input-salario"
                  type="text"
                  inputMode="numeric"
                  value={salarioInput}
                  onChange={handleSalarioChange}
                  placeholder="0,00"
                  className="pl-10 font-mono text-base border-neutral-300 focus-visible:ring-black"
                />
              </div>
            </div>

            {/* Campo 2: Dependentes para IRRF */}
            <div>
              <label
                htmlFor="input-dependentes"
                className="block text-sm font-semibold text-neutral-900 mb-1.5"
              >
                Dependentes para IRRF
              </label>
              <p className="text-xs text-neutral-500 mb-2">
                Número de dependentes legais para dedução de R$ 189,59 cada no imposto de renda.
              </p>
              <Input
                id="input-dependentes"
                type="number"
                min="0"
                max="20"
                value={dependentesInput}
                onChange={handleDependentesChange}
                placeholder="0"
                className="font-mono text-base border-neutral-300 focus-visible:ring-black"
              />
            </div>

            {/* Campo 3: Empresa optante pelo Simples Nacional (sim/não) */}
            <div className="md:col-span-2 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
              <label className="block text-sm font-semibold text-neutral-900 mb-1.5">
                A empresa é optante pelo Simples Nacional?
              </label>
              <p className="text-xs text-neutral-600 mb-3">
                No Simples Nacional (Anexos I, II, III e V), a Contribuição Previdenciária Patronal
                (CPP de 20%) é recolhida na guia única do DAS e não sobre a folha individual. No
                Lucro Presumido ou Lucro Real, há incidência de 20% de INSS patronal sobre a folha.
              </p>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer font-medium text-neutral-900">
                  <input
                    type="radio"
                    name="simplesNacional"
                    checked={isSimplesNacional}
                    onChange={() => setIsSimplesNacional(true)}
                    className="h-4 w-4 text-black focus:ring-black border-neutral-300"
                  />
                  <span>Sim (Optante pelo Simples Nacional, INSS patronal 0% na folha)</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer font-medium text-neutral-900">
                  <input
                    type="radio"
                    name="simplesNacional"
                    checked={!isSimplesNacional}
                    onChange={() => setIsSimplesNacional(false)}
                    className="h-4 w-4 text-black focus:ring-black border-neutral-300"
                  />
                  <span>Não (Lucro Presumido / Real, INSS patronal 20% sobre folha)</span>
                </label>
              </div>
            </div>

            {/* Campo 4: Adicionais (Insalubridade, Periculosidade ou Noturno) */}
            <div className="md:col-span-2 border border-neutral-200 rounded-lg p-4 bg-white space-y-4">
              <div>
                <span className="block text-sm font-semibold text-neutral-900">
                  Adicionais trabalhistas aplicáveis
                </span>
                <p className="text-xs text-neutral-500">
                  Marque se houver incidência de adicional legal que componha a base de cálculo da
                  remuneração.
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-neutral-100">
                {/* Insalubridade */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded bg-neutral-50 border border-neutral-200">
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasInsalubridade}
                      onChange={(e) => setHasInsalubridade(e.target.checked)}
                      className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black"
                    />
                    <span>Adicional de Insalubridade</span>
                  </label>

                  {hasInsalubridade && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-neutral-600">Grau:</span>
                      <select
                        value={grauInsalubridade}
                        onChange={(e) => setGrauInsalubridade(Number(e.target.value))}
                        className="h-8 px-2 text-xs bg-white border border-neutral-300 rounded font-sans"
                      >
                        <option value={10}>
                          Mínimo 10% ({formatCurrencyBRL(SALARIO_MINIMO_2026 * 0.1)})
                        </option>
                        <option value={20}>
                          Médio 20% ({formatCurrencyBRL(SALARIO_MINIMO_2026 * 0.2)})
                        </option>
                        <option value={40}>
                          Máximo 40% ({formatCurrencyBRL(SALARIO_MINIMO_2026 * 0.4)})
                        </option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Periculosidade */}
                <div className="flex items-center justify-between p-2.5 rounded bg-neutral-50 border border-neutral-200">
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasPericulosidade}
                      onChange={(e) => setHasPericulosidade(e.target.checked)}
                      className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black"
                    />
                    <span>Adicional de Periculosidade</span>
                  </label>
                  <span className="text-xs font-mono text-neutral-600">
                    30% sobre salário base ({formatCurrencyBRL(salarioBase * 0.3)})
                  </span>
                </div>

                {/* Noturno */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded bg-neutral-50 border border-neutral-200">
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasAdicionalNoturno}
                      onChange={(e) => setHasAdicionalNoturno(e.target.checked)}
                      className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black"
                    />
                    <span>Adicional Noturno habitual</span>
                  </label>

                  {hasAdicionalNoturno && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-600">Valor mensal:</span>
                      <div className="relative w-32">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-500">
                          R$
                        </span>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={adicionalNoturnoInput}
                          onChange={handleNoturnoChange}
                          placeholder="0,00"
                          className="h-8 pl-8 text-xs font-mono border-neutral-300"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RESULTADO SEPARADO: O QUE SAI DO BOLSO DA EMPRESA vs O QUE É DESCONTADO DO EMPREGADO */}
          <div className="space-y-6">
            {/* Bloco 1: O QUE SAI DO BOLSO DA EMPRESA */}
            <div className="border border-neutral-200 bg-neutral-50 rounded-xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 mb-5 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-neutral-900" />
                    <h3 className="text-lg md:text-xl font-bold text-black">
                      O que sai do bolso da empresa
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Salário bruto + encargos patronais + provisões trabalhistas mensais e anuais.
                  </p>
                </div>

                <div className="text-left sm:text-right bg-white px-3 py-1.5 rounded-lg border border-neutral-200">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block">
                    Custo Adicional
                  </span>
                  <span className="text-base font-mono font-bold text-black">
                    +{calculation.percentualCustoAdicional.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Destaque dos Totais Mensal e Anual com ponto focal #FAB319 */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                    Custo Total Mensal para a Empresa
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl md:text-4xl font-mono font-bold text-black">
                      {formatCurrencyBRL(calculation.custoTotalEmpresaMensal)}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-600 mt-1 block">
                    Salário ({formatCurrencyBRL(calculation.salarioBrutoTotal)}) + encargos e
                    provisões ({formatCurrencyBRL(calculation.totalEncargosEmpresaMensal)}).
                  </span>
                </div>

                <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                    Custo Total Anual para a Empresa
                  </span>
                  <div className="flex items-baseline gap-2">
                    {/* Ponto focal #FAB319 número 1 */}
                    <span className="text-3xl md:text-4xl font-mono font-bold bg-[#FAB319] text-black px-2 py-0.5 rounded">
                      {formatCurrencyBRL(calculation.custoTotalEmpresaAnual)}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-600 mt-1 block">
                    Projeção anual de 12 meses (inclui férias gozadas, 13º e encargos).
                  </span>
                </div>
              </div>

              {/* Detalhamento dos encargos patronais e provisões da empresa */}
              <div className="space-y-2 text-sm font-mono bg-white p-5 rounded-lg border border-neutral-200">
                <span className="font-sans font-semibold text-xs text-neutral-800 uppercase tracking-wider block pb-2 border-b border-neutral-100">
                  Discriminação dos encargos e provisões patronais:
                </span>

                <div className="flex justify-between items-center py-1.5 border-b border-neutral-100">
                  <div>
                    <span className="text-neutral-700">Salário Bruto Folha (Base):</span>
                    <span className="text-[11px] text-neutral-500 block font-sans">
                      Contratual{' '}
                      {calculation.valorInsalubridade +
                        calculation.valorPericulosidade +
                        calculation.valorNoturno >
                      0
                        ? '+ Adicionais'
                        : ''}
                    </span>
                  </div>
                  <span className="font-bold text-black">
                    {formatCurrencyBRL(calculation.salarioBrutoTotal)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-neutral-100">
                  <div>
                    <span className="text-neutral-700">
                      INSS Patronal (
                      {isSimplesNacional ? '0% - Simples Nacional' : '20% - Lucro Presumido/Real'}):
                    </span>
                    <span className="text-[11px] text-neutral-500 block font-sans">
                      {isSimplesNacional
                        ? 'Simples Nacional recolhe a cota patronal na guia única (DAS).'
                        : 'Recolhimento patronal previdenciário direto sobre folha (Lei 8.212/91).'}
                    </span>
                  </div>
                  <span className="font-bold text-black">
                    {formatCurrencyBRL(calculation.inssPatronalValor)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-neutral-100">
                  <div>
                    <span className="text-neutral-700">FGTS Mensal (8,00%):</span>
                    <span className="text-[11px] text-neutral-500 block font-sans">
                      Depósito obrigatório em conta vinculada do trabalhador (Lei 8.036/90).
                    </span>
                  </div>
                  <span className="font-bold text-black">
                    {formatCurrencyBRL(calculation.fgtsMensalValor)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-neutral-100">
                  <div>
                    <span className="text-neutral-700">Provisão de 13º Salário (1/12):</span>
                    <span className="text-[11px] text-neutral-500 block font-sans">
                      Parcela mensal equivalente a 8,33% da remuneração bruta.
                    </span>
                  </div>
                  <span className="font-bold text-black">
                    {formatCurrencyBRL(calculation.provisao13Valor)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-neutral-100">
                  <div>
                    <span className="text-neutral-700">
                      Provisão de Férias com Terço Constitucional (1/12 + 1/3):
                    </span>
                    <span className="text-[11px] text-neutral-500 block font-sans">
                      Parcela mensal de 11,11% (remuneração de férias acrescida de um terço).
                    </span>
                  </div>
                  <span className="font-bold text-black">
                    {formatCurrencyBRL(calculation.provisaoFeriasValor)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-neutral-100">
                  <div>
                    <span className="text-neutral-700">
                      FGTS sobre Provisões (8%)
                      {!isSimplesNacional ? ' + INSS Patronal sobre Provisões (20%)' : ''}:
                    </span>
                    <span className="text-[11px] text-neutral-500 block font-sans">
                      Incidência dos encargos devidos quando da quitação do 13º e das férias.
                    </span>
                  </div>
                  <span className="font-bold text-black">
                    {formatCurrencyBRL(
                      calculation.fgtsSobreProvisoes + calculation.inssPatronalSobreProvisoes,
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-neutral-100">
                  <div>
                    <span className="text-neutral-700">
                      Provisão da Multa Rescisória do FGTS (40%):
                    </span>
                    <span className="text-[11px] text-neutral-500 block font-sans">
                      40% sobre a base equivalente mensal do FGTS gerado (incluindo provisões).
                    </span>
                  </div>
                  <span className="font-bold text-black">
                    {formatCurrencyBRL(calculation.provisaoMultaFgtsValor)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3 text-base">
                  <span className="font-bold text-black">Total Mensal da Empresa:</span>
                  <span className="font-bold text-black text-lg">
                    {formatCurrencyBRL(calculation.custoTotalEmpresaMensal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bloco 2: O QUE É DESCONTADO DO EMPREGADO */}
            <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 pb-4 border-b border-neutral-200 mb-5">
                <Users className="h-5 w-5 text-neutral-900" />
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-black">
                    O que é descontado do empregado (Holerite / Salário Líquido)
                  </h3>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Retenções legais obrigatórias na fonte e montante líquido creditado.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                    Total de Descontos no Holerite
                  </span>
                  <span className="text-2xl md:text-3xl font-mono font-bold text-neutral-800">
                    {formatCurrencyBRL(calculation.totalDescontosEmpregado)}
                  </span>
                  <span className="text-xs text-neutral-500 mt-1 block">
                    INSS do Empregado + IRRF retido na fonte.
                  </span>
                </div>

                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                    Salário Líquido a Receber
                  </span>
                  <span className="text-2xl md:text-3xl font-mono font-bold text-black">
                    {formatCurrencyBRL(calculation.salarioLiquidoEmpregado)}
                  </span>
                  <span className="text-xs text-neutral-500 mt-1 block">
                    Valor final creditado ao trabalhador em conta bancária.
                  </span>
                </div>
              </div>

              {/* Detalhes dos descontos */}
              <div className="space-y-2 text-xs font-mono bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                <div className="flex justify-between items-center py-1 border-b border-neutral-200">
                  <div>
                    <span className="text-neutral-700">
                      INSS do Empregado (Tabela Progressiva):
                    </span>
                    <span className="text-[11px] text-neutral-500 block font-sans">
                      Alíquotas progressivas de 7,5% a 14% (Portaria Interministerial MPS/MF nº
                      13/2026).
                    </span>
                  </div>
                  <span className="font-semibold text-neutral-900">
                    - {formatCurrencyBRL(calculation.inssEmpregado)}
                  </span>
                </div>

                {calculation.redutorLei15270Empregado > 0 ? (
                  <>
                    <div className="flex justify-between items-center py-1 border-b border-neutral-200">
                      <div>
                        <span className="text-neutral-700">IRRF Tabela Progressiva (Bruto):</span>
                        <span className="text-[11px] text-neutral-500 block font-sans">
                          Base apurada: {formatCurrencyBRL(calculation.baseIrrfUsada)} com{' '}
                          {dependentes} dep. (alíquota: {(calculation.aliqIrrf * 100).toFixed(1)}%).
                        </span>
                      </div>
                      <span className="font-semibold text-neutral-900">
                        - {formatCurrencyBRL(calculation.irrfEmpregadoBruto)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-neutral-200 bg-amber-50/60 px-2 -mx-2 rounded">
                      <div>
                        <span className="text-emerald-800 font-semibold">
                          redutor da Lei 15.270:
                        </span>
                        <span className="text-[11px] text-neutral-600 block font-sans">
                          {calculation.salarioBrutoTotal <= 5000
                            ? 'Isenção integral garantida até R$ 5.000,00.'
                            : 'Redução proporcional da Lei nº 15.270/2025.'}
                        </span>
                      </div>
                      <span className="font-semibold text-emerald-700 font-mono">
                        + {formatCurrencyBRL(calculation.redutorLei15270Empregado)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-neutral-200">
                      <div>
                        <span className="text-neutral-700 font-medium">
                          IRRF Efetivo Retido na Fonte:
                        </span>
                      </div>
                      <span className="font-semibold text-neutral-900">
                        - {formatCurrencyBRL(calculation.irrfEmpregado)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-center py-1 border-b border-neutral-200">
                    <div>
                      <span className="text-neutral-700">IRRF Retido na Fonte:</span>
                      <span className="text-[11px] text-neutral-500 block font-sans">
                        Base apurada: {formatCurrencyBRL(calculation.baseIrrfUsada)} com{' '}
                        {dependentes} dep. (alíquota: {(calculation.aliqIrrf * 100).toFixed(1)}%).
                      </span>
                    </div>
                    <span className="font-semibold text-neutral-900">
                      - {formatCurrencyBRL(calculation.irrfEmpregado)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 text-sm">
                  <span className="font-bold text-black">Salário Líquido Efetivo:</span>
                  <span className="font-bold text-black">
                    {formatCurrencyBRL(calculation.salarioLiquidoEmpregado)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. MEMÓRIA DE CÁLCULO ABERTA (linha por linha, percentuais e valores calculados) */}
          <div className="mt-8 border border-neutral-200 rounded-lg p-5 bg-neutral-50">
            <div className="flex items-center gap-2 mb-3">
              <FileCheck2 className="h-4 w-4 text-neutral-800" />
              <h3 className="font-bold text-base text-black">
                Memória de Cálculo Aberta (Conferência Passo a Passo)
              </h3>
            </div>
            <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
              Todos os passos aritméticos calculados a partir dos dados preenchidos, permitindo que
              a sua equipe de departamento pessoal ou contabilidade refaça a conta na mão:
            </p>

            <div className="bg-white rounded border border-neutral-200 p-4 font-mono text-xs space-y-3 overflow-x-auto">
              <div className="pb-2 border-b border-neutral-100">
                <span className="font-semibold text-neutral-900 block font-sans mb-1">
                  Passo 1: Composição da Remuneração Bruta
                </span>
                <p className="text-neutral-700">
                  Salário Base Contratual = {formatCurrencyBRL(calculation.salarioBase)}
                </p>
                {calculation.valorInsalubridade > 0 && (
                  <p className="text-neutral-700">
                    + Adicional de Insalubridade ({grauInsalubridade}% do Salário Mínimo de{' '}
                    {formatCurrencyBRL(SALARIO_MINIMO_2026)}) ={' '}
                    {formatCurrencyBRL(calculation.valorInsalubridade)}
                  </p>
                )}
                {calculation.valorPericulosidade > 0 && (
                  <p className="text-neutral-700">
                    + Adicional de Periculosidade (30% do Salário Base) ={' '}
                    {formatCurrencyBRL(calculation.valorPericulosidade)}
                  </p>
                )}
                {calculation.valorNoturno > 0 && (
                  <p className="text-neutral-700">
                    + Adicional Noturno = {formatCurrencyBRL(calculation.valorNoturno)}
                  </p>
                )}
                <p className="font-bold text-black mt-1">
                  Base Remuneratória Total Mensal ={' '}
                  {formatCurrencyBRL(calculation.salarioBrutoTotal)}
                </p>
              </div>

              <div className="pb-2 border-b border-neutral-100">
                <span className="font-semibold text-neutral-900 block font-sans mb-1">
                  Passo 2: Encargos Patronais Imediatos da Folha
                </span>
                <p className="text-neutral-700">
                  INSS Patronal = {formatCurrencyBRL(calculation.salarioBrutoTotal)} ×{' '}
                  {(calculation.aliqInssPatronal * 100).toFixed(0)}% ={' '}
                  {formatCurrencyBRL(calculation.inssPatronalValor)}{' '}
                  {isSimplesNacional ? '(zero na folha, unificado no DAS)' : ''}
                </p>
                <p className="text-neutral-700">
                  FGTS Mensal = {formatCurrencyBRL(calculation.salarioBrutoTotal)} × 8,00% ={' '}
                  {formatCurrencyBRL(calculation.fgtsMensalValor)}
                </p>
              </div>

              <div className="pb-2 border-b border-neutral-100">
                <span className="font-semibold text-neutral-900 block font-sans mb-1">
                  Passo 3: Provisões Mensais de Férias e 13º Salário
                </span>
                <p className="text-neutral-700">
                  Provisão 13º Salário = {formatCurrencyBRL(calculation.salarioBrutoTotal)} ÷ 12 (ou
                  × 8,3333%) = {formatCurrencyBRL(calculation.provisao13Valor)}
                </p>
                <p className="text-neutral-700">
                  Provisão Férias + 1/3 = ({formatCurrencyBRL(calculation.salarioBrutoTotal)} ÷ 12)
                  + (({formatCurrencyBRL(calculation.salarioBrutoTotal)} ÷ 12) ÷ 3) ={' '}
                  {formatCurrencyBRL(calculation.provisaoFeriasValor)} (11,1111%)
                </p>
                <p className="text-neutral-700">
                  FGTS sobre Provisões = ({formatCurrencyBRL(calculation.provisao13Valor)} +{' '}
                  {formatCurrencyBRL(calculation.provisaoFeriasValor)}) × 8,00% ={' '}
                  {formatCurrencyBRL(calculation.fgtsSobreProvisoes)}
                </p>
                {!isSimplesNacional && (
                  <p className="text-neutral-700">
                    INSS Patronal sobre Provisões = (
                    {formatCurrencyBRL(calculation.provisao13Valor)} +{' '}
                    {formatCurrencyBRL(calculation.provisaoFeriasValor)}) × 20,00% ={' '}
                    {formatCurrencyBRL(calculation.inssPatronalSobreProvisoes)}
                  </p>
                )}
              </div>

              <div className="pb-2 border-b border-neutral-100">
                <span className="font-semibold text-neutral-900 block font-sans mb-1">
                  Passo 4: Provisão da Multa Rescisória do FGTS (Base Mensal)
                </span>
                <p className="text-neutral-700">
                  FGTS Mensal Efetivo Gerado = {formatCurrencyBRL(calculation.fgtsMensalValor)}{' '}
                  (FGTS salário) + {formatCurrencyBRL(calculation.fgtsSobreProvisoes)} (FGTS
                  provisões) ={' '}
                  {formatCurrencyBRL(calculation.fgtsMensalValor + calculation.fgtsSobreProvisoes)}
                </p>
                <p className="text-neutral-700">
                  Multa Rescisória 40% ={' '}
                  {formatCurrencyBRL(calculation.fgtsMensalValor + calculation.fgtsSobreProvisoes)}{' '}
                  × 40,00% = {formatCurrencyBRL(calculation.provisaoMultaFgtsValor)}
                </p>
              </div>

              <div className="pb-2 border-b border-neutral-100">
                <span className="font-semibold text-neutral-900 block font-sans mb-1">
                  Passo 5: Totalização do Custo para a Empresa
                </span>
                <p className="text-neutral-700">
                  Total Encargos e Provisões Mensais ={' '}
                  {formatCurrencyBRL(calculation.totalEncargosEmpresaMensal)}
                </p>
                <p className="font-bold text-black">
                  Custo Mensal da Empresa = {formatCurrencyBRL(calculation.salarioBrutoTotal)} +{' '}
                  {formatCurrencyBRL(calculation.totalEncargosEmpresaMensal)} ={' '}
                  {formatCurrencyBRL(calculation.custoTotalEmpresaMensal)}
                </p>
                <p className="font-bold text-black">
                  Custo Anual da Empresa = {formatCurrencyBRL(calculation.custoTotalEmpresaMensal)}{' '}
                  × 12 meses = {formatCurrencyBRL(calculation.custoTotalEmpresaAnual)}
                </p>
              </div>

              <div>
                <span className="font-semibold text-neutral-900 block font-sans mb-1">
                  Passo 6: Retenções do Empregado e Salário Líquido
                </span>
                <p className="text-neutral-700">
                  - INSS do Empregado (Portaria MPS/MF nº 13/2026):{' '}
                  {formatCurrencyBRL(calculation.inssEmpregado)}
                </p>
                <p className="text-neutral-700">
                  - IRRF apurado na tabela progressiva:{' '}
                  {formatCurrencyBRL(calculation.irrfEmpregadoBruto)}
                </p>
                <p className="text-emerald-800 font-semibold">
                  - redutor da Lei 15.270: {formatCurrencyBRL(calculation.redutorLei15270Empregado)}
                </p>
                <p className="text-neutral-700">
                  - IRRF retido na fonte final: {formatCurrencyBRL(calculation.irrfEmpregado)}
                </p>
                <p className="font-bold text-black pt-1">
                  Salário Líquido do Empregado = {formatCurrencyBRL(calculation.salarioBrutoTotal)}{' '}
                  − {formatCurrencyBRL(calculation.totalDescontosEmpregado)} ={' '}
                  {formatCurrencyBRL(calculation.salarioLiquidoEmpregado)}
                </p>
              </div>
            </div>
          </div>

          {/* Captura de e-mail */}
          <CalculatorEmailCapture calculatorName="Calculadora Custo de Funcionário CLT" />
        </section>

        {/* 4. TEXTO DE APROFUNDAMENTO EM HTML ESTÁTICO (NÃO gerado por script) */}
        <article className="prose prose-neutral max-w-none mb-16 space-y-12">
          {/* Subtítulo 1: O que compõe o custo de um funcionário */}
          <section aria-labelledby="o-que-compoe-o-custo">
            <h2
              id="o-que-compoe-o-custo"
              className="text-2xl md:text-3xl font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              O que compõe o custo de um funcionário
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                O custo real de um colaborador celetista não se limita ao salário nominal acordado
                em contrato ou registrado na carteira de trabalho (CTPS). No ordenamento jurídico e
                contábil brasileiro, a contratação de empregados sob o regime da Consolidação das
                Leis do Trabalho (Decreto-Lei nº 5.452/1943) gera uma estrutura de custos dividida
                em quatro blocos fundamentais:
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-6">
                <div className="border border-neutral-200 rounded-lg p-5 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-semibold text-neutral-800">
                      Bloco 01
                    </span>
                    <h3 className="font-bold text-base text-black">Remuneração Direta</h3>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    Composta pelo salário base mensal contratado e eventuais adicionais de natureza
                    salarial, tais como horas extras habituais, gratificações de função, adicional
                    noturno, adicional de periculosidade e insalubridade.
                  </p>
                </div>

                <div className="border border-neutral-200 rounded-lg p-5 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-semibold text-neutral-800">
                      Bloco 02
                    </span>
                    <h3 className="font-bold text-base text-black">Encargos Sociais Básicos</h3>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    Valores depositados mensalmente pela empresa sem desconto no contracheque do
                    empregado, com destaque para os 8% do Fundo de Garantia do Tempo de Serviço
                    (FGTS, Lei 8.036/1990) e o INSS patronal para empresas de regimes não
                    desonerados.
                  </p>
                </div>

                <div className="border border-neutral-200 rounded-lg p-5 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-semibold text-neutral-800">
                      Bloco 03
                    </span>
                    <h3 className="font-bold text-base text-black">Provisões Trabalhistas</h3>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    Valores diferidos que devem ser reservados mês a mês para fazer frente aos
                    desembolsos periódicos previstos em lei: a fração mensal de 1/12 do 13º salário,
                    a fração de 1/12 das férias acrescida de 1/3 constitucional e seus respectivos
                    encargos.
                  </p>
                </div>

                <div className="border border-neutral-200 rounded-lg p-5 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-semibold text-neutral-800">
                      Bloco 04
                    </span>
                    <h3 className="font-bold text-base text-black">Provisão Rescisória</h3>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    Reserva correspondente à multa indenizatória de 40% sobre os depósitos
                    acumulados do FGTS, devida na hipótese de dispensa sem justa causa, além de
                    custos com aviso prévio indenizado proporcional ao tempo de serviço.
                  </p>
                </div>
              </div>

              <p>
                A desconsideração de qualquer um desses blocos cria a ilusão contábil de que o
                funcionário custa apenas o montante expresso na folha de pagamento, gerando
                descasamento no fluxo de caixa corporativo e surpresas fiscais severas nos meses de
                encerramento do exercício.
              </p>
            </div>
          </section>

          {/* Subtítulo 2: Quais encargos incidem sobre a folha e quais não incidem */}
          <section aria-labelledby="quais-encargos-incidem">
            <h2
              id="quais-encargos-incidem"
              className="text-2xl md:text-3xl font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              Quais encargos incidem sobre a folha e quais não incidem
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                Compreender a natureza jurídica de cada verba paga ao trabalhador é mandatório para
                determinar a correta incidência de tributos e contribuições. A legislação
                trabalhista e previdenciária distingue com clareza as verbas salariais das verbas
                indenizatórias:
              </p>

              <div className="border border-neutral-200 rounded-xl overflow-hidden my-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs md:text-sm font-sans">
                    <thead className="bg-neutral-100 border-b border-neutral-200 text-neutral-900 font-mono uppercase text-xs">
                      <tr>
                        <th className="p-3 border-r border-neutral-200">Rubrica de Pagamento</th>
                        <th className="p-3 border-r border-neutral-200">Natureza Legal</th>
                        <th className="p-3 border-r border-neutral-200 text-center">
                          Incide FGTS (8%)
                        </th>
                        <th className="p-3 border-r border-neutral-200 text-center">
                          Incide INSS Patronal
                        </th>
                        <th className="p-3 text-center">Incide IRRF</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      <tr className="hover:bg-neutral-50">
                        <td className="p-3 border-r border-neutral-200 font-medium">
                          Salário Base Mensal
                        </td>
                        <td className="p-3 border-r border-neutral-200">Salarial</td>
                        <td className="p-3 border-r border-neutral-200 text-center font-bold text-neutral-900">
                          Sim
                        </td>
                        <td className="p-3 border-r border-neutral-200 text-center font-bold text-neutral-900">
                          Sim*
                        </td>
                        <td className="p-3 text-center font-bold text-neutral-900">Sim</td>
                      </tr>
                      <tr className="hover:bg-neutral-50">
                        <td className="p-3 border-r border-neutral-200 font-medium">
                          Horas Extras e Adicional Noturno
                        </td>
                        <td className="p-3 border-r border-neutral-200">Salarial</td>
                        <td className="p-3 border-r border-neutral-200 text-center font-bold text-neutral-900">
                          Sim
                        </td>
                        <td className="p-3 border-r border-neutral-200 text-center font-bold text-neutral-900">
                          Sim*
                        </td>
                        <td className="p-3 text-center font-bold text-neutral-900">Sim</td>
                      </tr>
                      <tr className="hover:bg-neutral-50">
                        <td className="p-3 border-r border-neutral-200 font-medium">
                          Insalubridade e Periculosidade
                        </td>
                        <td className="p-3 border-r border-neutral-200">Salarial</td>
                        <td className="p-3 border-r border-neutral-200 text-center font-bold text-neutral-900">
                          Sim
                        </td>
                        <td className="p-3 border-r border-neutral-200 text-center font-bold text-neutral-900">
                          Sim*
                        </td>
                        <td className="p-3 text-center font-bold text-neutral-900">Sim</td>
                      </tr>
                      <tr className="hover:bg-neutral-50">
                        <td className="p-3 border-r border-neutral-200 font-medium">
                          13º Salário e Férias Gozadas
                        </td>
                        <td className="p-3 border-r border-neutral-200">Salarial</td>
                        <td className="p-3 border-r border-neutral-200 text-center font-bold text-neutral-900">
                          Sim
                        </td>
                        <td className="p-3 border-r border-neutral-200 text-center font-bold text-neutral-900">
                          Sim*
                        </td>
                        <td className="p-3 text-center font-bold text-neutral-900">Sim</td>
                      </tr>
                      <tr className="hover:bg-neutral-50 bg-neutral-50/50">
                        <td className="p-3 border-r border-neutral-200 font-medium">
                          Vale-Transporte (em benefício)
                        </td>
                        <td className="p-3 border-r border-neutral-200">Indenizatória</td>
                        <td className="p-3 border-r border-neutral-200 text-center text-neutral-500">
                          Não
                        </td>
                        <td className="p-3 border-r border-neutral-200 text-center text-neutral-500">
                          Não
                        </td>
                        <td className="p-3 text-center text-neutral-500">Não</td>
                      </tr>
                      <tr className="hover:bg-neutral-50 bg-neutral-50/50">
                        <td className="p-3 border-r border-neutral-200 font-medium">
                          Auxílio-Alimentação (Lei 13.467/17)
                        </td>
                        <td className="p-3 border-r border-neutral-200">Indenizatória</td>
                        <td className="p-3 border-r border-neutral-200 text-center text-neutral-500">
                          Não
                        </td>
                        <td className="p-3 border-r border-neutral-200 text-center text-neutral-500">
                          Não
                        </td>
                        <td className="p-3 text-center text-neutral-500">Não</td>
                      </tr>
                      <tr className="hover:bg-neutral-50 bg-neutral-50/50">
                        <td className="p-3 border-r border-neutral-200 font-medium">
                          Férias Indenizadas na Rescisão
                        </td>
                        <td className="p-3 border-r border-neutral-200">Indenizatória</td>
                        <td className="p-3 border-r border-neutral-200 text-center text-neutral-500">
                          Não
                        </td>
                        <td className="p-3 border-r border-neutral-200 text-center text-neutral-500">
                          Não
                        </td>
                        <td className="p-3 text-center text-neutral-500">Não</td>
                      </tr>
                      <tr className="hover:bg-neutral-50 bg-neutral-50/50">
                        <td className="p-3 border-r border-neutral-200 font-medium">
                          Multa Rescisória de 40% do FGTS
                        </td>
                        <td className="p-3 border-r border-neutral-200">Indenizatória</td>
                        <td className="p-3 border-r border-neutral-200 text-center text-neutral-500">
                          Não
                        </td>
                        <td className="p-3 border-r border-neutral-200 text-center text-neutral-500">
                          Não
                        </td>
                        <td className="p-3 text-center text-neutral-500">Não</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="text-xs text-neutral-500 italic">
                * Para empresas optantes pelo Simples Nacional enquadradas nos Anexos I, II, III e
                V, a cota patronal previdenciária de 20% não é exigida na folha, sendo substituída
                pelo recolhimento unificado no DAS sobre a receita bruta mensal.
              </p>
            </div>
          </section>

          {/* Subtítulo 3: Como funciona o custo no Simples Nacional e por que o INSS patronal não aparece na folha */}
          <section aria-labelledby="como-funciona-no-simples">
            <h2
              id="como-funciona-no-simples"
              className="text-2xl md:text-3xl font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              Como funciona o custo no Simples Nacional e por que o INSS patronal não aparece na
              folha
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                Uma das principais dúvidas dos gestores de micro e pequenas empresas diz respeito à
                ausência do encargo patronal de 20% no recibo de pagamento do eSocial ou na GPS do
                empregado. Essa regra deriva expressamente da Lei Complementar nº 123/2006:
              </p>
              <p>
                O artigo 13, inciso VI, da Lei Complementar 123/2006 estabelece que o Simples
                Nacional engloba, mediante recolhimento único na guia DAS, a{' '}
                <strong>Contribuição Previdenciária Patronal (CPP)</strong> a cargo da pessoa
                jurídica, conforme prevista no art. 22 da Lei nº 8.212/1991. Dessa forma, as
                empresas de comércio (Anexo I), indústria (Anexo II) e a maioria das prestadoras de
                serviços (Anexos III e V) recolhem a contribuição patronal calculada como um
                percentual de sua receita bruta operacional, e não como uma alíquota fixa sobre a
                soma dos salários de seus empregados.
              </p>
              <div className="p-4 bg-neutral-100 border border-neutral-200 rounded-lg text-sm text-neutral-800">
                <p>
                  <strong>Atenção à exceção do Anexo IV:</strong> Empresas prestadoras de serviços
                  enquadradas no Anexo IV do Simples Nacional (tais como construção civil, obras de
                  engenharia, vigilância, limpeza e conservação) <em>não</em> contam com a CPP
                  unificada no DAS (art. 18, § 5º-C). Para essas atividades, mesmo no Simples
                  Nacional, o INSS patronal de 20% continua incidindo diretamente sobre a folha de
                  pagamento, além de RAT e contribuições incidentes.
                </p>
              </div>
              <p>
                Portanto, para empresas do Simples nos Anexos I a III, o custo de contratação CLT é
                significativamente menor do que em empresas do Lucro Presumido, mantendo-se limitado
                essencialmente ao FGTS mensal de 8% e às provisões legais de 13º, férias e rescisão.
              </p>
            </div>
          </section>

          {/* Subtítulo 4: Por que a provisão de férias e décimo terceiro precisa ser reservada todo mês */}
          <section aria-labelledby="por-que-provisao-mensal">
            <h2
              id="por-que-provisao-mensal"
              className="text-2xl md:text-3xl font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              Por que a provisão de férias e décimo terceiro precisa ser reservada todo mês
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                No regime de competência contábil, exigido pelas Normas Brasileiras de Contabilidade
                (NBC TG) e pelas práticas de gestão financeira prudencial, as despesas devem ser
                reconhecidas no período em que o trabalho foi efetivamente prestado, e não no
                momento do pagamento monetário.
              </p>
              <p>A cada mês trabalhado, o empregado adquire por direito legal:</p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>
                  <strong>1/12 avos de 13º salário:</strong> que será liquidado em duas parcelas, a
                  primeira até 30 de novembro e a segunda até 20 de dezembro;
                </li>
                <li>
                  <strong>1/12 avos de férias remuneradas com o terço constitucional:</strong> cujo
                  gozo e pagamento antecipado ocorrerão no período concessivo ao longo dos 12 meses
                  subsequentes ao período aquisitivo;
                </li>
                <li>
                  <strong>Encargos incidentes sobre essas parcelas diferidas:</strong> o FGTS de 8%
                  e, quando aplicável, a contribuição patronal previdenciária que incidirá no
                  momento da quitação.
                </li>
              </ul>
              <p>
                Quando o departamento financeiro negligencia essa reserva contábil e considera como
                custo mensal apenas a folha quitada no dia 5 útil, a empresa opera com lucro
                artificialmente inflado durante dez meses do ano. Ao chegar o encerramento do
                exercício em novembro e dezembro, o caixa sofre um choque de liquidez com
                desembolsos concentrados, frequentemente comprometendo o pagamento de fornecedores
                ou obrigando a tomada de capital de giro bancário a taxas de juros desnecessárias.
              </p>
            </div>
          </section>

          {/* Subtítulo 5: Erros comuns ao calcular custo de funcionário (PELO MENOS quatro exemplos práticos) */}
          <section aria-labelledby="erros-comuns-custo-funcionario">
            <h2
              id="erros-comuns-custo-funcionario"
              className="text-2xl md:text-3xl font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              Erros comuns ao calcular custo de funcionário
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                Equívocos na mensuração do custo da folha de pagamento são frequentes em empresas de
                todos os portes. Abaixo detalhamos quatro exemplos práticos recorrentes e o efeito
                financeiro de cada um no custo total da empresa:
              </p>

              <div className="space-y-4 my-6">
                {/* Exemplo 1 */}
                <div className="border border-neutral-200 rounded-lg p-5 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-semibold text-neutral-800">
                      Exemplo 01
                    </span>
                    <h3 className="font-bold text-base text-black">
                      Ignorar o terço constitucional e os encargos na provisão de férias
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-2">
                    Muitos orçamentos provisionam apenas 1/12 do salário nominal para férias,
                    esquecendo que o artigo 7º, inciso XVII, da Constituição Federal impõe o
                    acréscimo de 1/3 (33,33%) sobre a remuneração, além da incidência de 8% de FGTS
                    sobre a totalidade dessa soma.
                  </p>
                  <p className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded border border-neutral-200">
                    <strong>Efeito no custo total:</strong> Subavalia a provisão de férias em mais
                    de 37%. Em um salário de R$ 5.000,00, a provisão correta com terço e encargos é
                    de R$ 600,00 mensais, e não de R$ 416,67. O resultado é um passivo oculto anual
                    de mais de R$ 2.200,00 por colaborador.
                  </p>
                </div>

                {/* Exemplo 2 */}
                <div className="border border-neutral-200 rounded-lg p-5 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-semibold text-neutral-800">
                      Exemplo 02
                    </span>
                    <h3 className="font-bold text-base text-black">
                      Aplicar multiplicador genérico de 100% sem verificar o regime tributário da
                      empresa
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-2">
                    Utilizar a regra de bolso popular de que "o funcionário custa o dobro do
                    salário" (200% do salário) para uma microempresa do Simples Nacional dos Anexos
                    I, II ou III, que não recolhe INSS patronal nem alíquota de terceiros na folha.
                  </p>
                  <p className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded border border-neutral-200">
                    <strong>Efeito no custo total:</strong> Superestima o custo real de contratação
                    em mais de 50% a 60% do valor efetivo. No Simples Nacional, o acréscimo real
                    gira entre 35% e 42%. A empresa perde oportunidades de contratação e precifica
                    seus produtos e serviços acima do mercado por distorção de cálculo.
                  </p>
                </div>

                {/* Exemplo 3 */}
                <div className="border border-neutral-200 rounded-lg p-5 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-semibold text-neutral-800">
                      Exemplo 03
                    </span>
                    <h3 className="font-bold text-base text-black">
                      Não provisionar a multa rescisória de 40% do FGTS mês a mês
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-2">
                    Considerar apenas os 8% do FGTS mensal e ignorar que, na hipótese de rescisão
                    sem justa causa, a empresa deverá indenizar o colaborador com 40% de todo o
                    saldo acumulado durante o contrato de trabalho (art. 18, § 1º, da Lei
                    8.036/1990).
                  </p>
                  <p className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded border border-neutral-200">
                    <strong>Efeito no custo total:</strong> Gera um choque de caixa imprevisto no
                    momento do desligamento. A provisão equivalente mensal é de 3,2% sobre a base
                    remuneratória total. Em um contrato de três anos, a rescisão exigirá um
                    desembolso súbito de milhares de reais não reservados previamente.
                  </p>
                </div>

                {/* Exemplo 4 */}
                <div className="border border-neutral-200 rounded-lg p-5 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-semibold text-neutral-800">
                      Exemplo 04
                    </span>
                    <h3 className="font-bold text-base text-black">
                      Calcular encargos sobre o salário base excluindo adicionais habituais
                      (noturno, periculosidade, insalubridade)
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-2">
                    Calcular o FGTS, 13º e férias sobre o salário registrado em carteira, esquecendo
                    que adicionais pagos habitualmente integram o salário para todos os efeitos
                    (Súmulas 139 e 264 do TST), gerando reflexo obrigatório em todas as verbas.
                  </p>
                  <p className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded border border-neutral-200">
                    <strong>Efeito no custo total:</strong> Gera diferenças salariais retroativas,
                    multas do artigo 477 da CLT e risco de autuação fiscal pelo Ministério do
                    Trabalho e Emprego (MTE), além de subestimar o custo mensal daquele posto de
                    trabalho em até 30% a 40%.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </article>

        {/* 5. BLOCO DE VIGÊNCIA (visível citando a base legal exigida) */}
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
                As regras de cálculo, alíquotas patronais e tabelas aplicadas nesta calculadora
                observam rigorosamente os dispositivos vigentes da legislação brasileira:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-xs md:text-sm text-neutral-700">
                <li>
                  <strong>Portaria Interministerial MPS/MF nº 13/2026:</strong> nova tabela
                  progressiva de contribuição previdenciária dos segurados empregados (faixas até R$
                  1.621,00; R$ 2.902,84; R$ 4.354,27 e teto de R$ 8.475,55) e salário mínimo
                  nacional de R$ 1.621,00 como base da insalubridade;
                </li>
                <li>
                  <strong>Lei nº 15.270/2025:</strong> instituição da redução do imposto de renda
                  mensal (art. 3º-A da Lei nº 9.250/1995), com isenção total de IRRF para
                  rendimentos tributáveis de até R$ 5.000,00 e redutor proporcional decrescente até
                  R$ 7.350,00;
                </li>
                <li>
                  <strong>Lei nº 8.212/1991 (Lei Orgânica da Seguridade Social):</strong>{' '}
                  fundamentação da alíquota básica do INSS patronal de 20% e da contribuição
                  previdenciária dos segurados empregados;
                </li>
                <li>
                  <strong>Lei nº 8.036/1990 (Lei do FGTS):</strong> depósito mensal de 8% em conta
                  vinculada e previsão da indenização compensatória de 40% na rescisão imotivada
                  (art. 18, § 1º);
                </li>
                <li>
                  <strong>
                    Lei Complementar nº 123/2006 (Estatuto da Micro e Pequena Empresa):
                  </strong>{' '}
                  unificação da Contribuição Previdenciária Patronal (CPP) na guia única do DAS para
                  empresas optantes pelo Simples Nacional (art. 13, VI, e art. 18);
                </li>
                <li>
                  <strong>Tabela progressiva do IRRF vigente (exercício 2026):</strong> faixa isenta
                  até R$ 2.428,80, desconto simplificado mensal de R$ 607,20 (25% do limite de
                  isenção) e dedução por dependente de R$ 189,59;
                </li>
                <li>
                  <strong>Decreto-Lei nº 5.452/1943 (CLT):</strong> artigos 129 a 153 para o regime
                  de férias e Lei nº 4.090/1962 para a gratificação natalina (13º salário).
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. AVISO LEGAL DE ESTIMATIVA com link para /contato */}
        <section
          aria-labelledby="aviso-legal-title"
          className="border border-neutral-200 bg-neutral-50 rounded-xl p-6 mb-12"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-neutral-700 shrink-0 mt-0.5" />
            <div>
              <h3 id="aviso-legal-title" className="font-bold text-base text-black mb-1">
                Aviso Legal de Estimativa
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                O resultado gerado por esta ferramenta é uma estimativa matemática orientativa
                baseada nos parâmetros fornecidos e nas regras gerais da legislação trabalhista e
                tributária nacional. Os cálculos não substituem a análise detalhada e a auditoria de
                um profissional habilitado perante o Conselho Regional de Contabilidade, nem
                contemplam particularidades de convenções coletivas de trabalho (CCT), adicionais
                sindicais específicos ou planos de benefícios próprios. Para estruturação formal da
                folha de pagamento e parecer trabalhista da sua empresa, acesse a nossa página de{' '}
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

        {/* 7. FAQ: CINCO PERGUNTAS FREQUENTES COM RESPOSTAS CURTAS NO HTML ESTÁTICO */}
        <section aria-labelledby="faq-custo-funcionario-title" className="mb-14">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 border border-neutral-300 bg-neutral-100 px-3 py-1 rounded text-xs font-mono uppercase tracking-wider text-neutral-800 mb-2">
              <HelpCircle className="h-3.5 w-3.5 text-black" />
              Perguntas Frequentes
            </div>
            <h2
              id="faq-custo-funcionario-title"
              className="text-2xl md:text-3xl font-bold text-black"
            >
              Perguntas Frequentes sobre Custo de Funcionário CLT
            </h2>
            <p className="text-neutral-600 text-sm md:text-base">
              Esclarecimentos técnicos diretos sobre encargos patronais, retenções e planejamento de
              folha.
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

        {/* 8. CALCULADORAS RELACIONADAS COM TRÊS LINKS: Pró-labore ou Dividendos, PJ ou CLT e Rescisão Trabalhista */}
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
            {/* Link 1: Pró-labore ou Dividendos */}
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

            {/* Link 2: PJ ou CLT */}
            <Link
              to="/calculadoras/pj-ou-clt"
              className="group border border-neutral-200 bg-white hover:border-neutral-400 p-5 rounded-xl transition-all duration-200 flex flex-col justify-between shadow-sm"
            >
              <div>
                <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                  Folha e Trabalhista
                </span>
                <h3 className="font-bold text-base text-black mb-2 group-hover:underline">
                  PJ ou CLT
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Simulação comparativa de remuneração líquida e encargos entre contratação PJ e
                  CLT.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center text-xs font-medium text-black">
                Acessar simulador{' '}
                <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Link 3: Rescisão Trabalhista */}
            <Link
              to="/calculadoras/rescisao-trabalhista"
              className="group border border-neutral-200 bg-white hover:border-neutral-400 p-5 rounded-xl transition-all duration-200 flex flex-col justify-between shadow-sm"
            >
              <div>
                <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                  Folha e Trabalhista
                </span>
                <h3 className="font-bold text-base text-black mb-2 group-hover:underline">
                  Rescisão Trabalhista
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Estimativa das verbas rescisórias devidas conforme modalidade de desligamento e
                  tempo de serviço.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center text-xs font-medium text-black">
                Acessar simulador{' '}
                <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </section>

        {/* BLOCO DE CHAMADA PARA CONTATO COM O ESCRITÓRIO (Ponto focal #FAB319 número 2) */}
        <section
          aria-labelledby="cta-escritorio-title"
          className="bg-neutral-950 text-white rounded-2xl p-8 md:p-12 text-center"
        >
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="inline-block border border-neutral-800 px-3 py-1 rounded text-xs uppercase tracking-wider text-neutral-400 font-mono">
              PERES PERES Consultoria & Contabilidade
            </div>

            <h2
              id="cta-escritorio-title"
              className="text-2xl md:text-3xl font-bold text-white leading-tight"
            >
              Deseja estruturar o planejamento de folha e encargos da sua empresa?
            </h2>

            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
              Nossa equipe de consultoria trabalhista e departamento pessoal estrutura pareceres
              técnicos, auditoria de folha, enquadramento previdenciário e rotinas de eSocial com
              total conformidade legal e segurança jurídica.
            </p>

            {/* Ponto focal #FAB319 número 2 */}
            <div className="pt-3 flex justify-center">
              <Button
                asChild
                size="lg"
                className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-base h-12 px-8 shadow-sm"
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
