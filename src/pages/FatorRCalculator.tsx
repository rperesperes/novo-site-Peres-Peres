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
  Calendar,
  Layers,
  ArrowUpDown,
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

// Formatador numérico monetário para moeda BRL
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

export default function FatorRCalculator() {
  // Estado das entradas (valores iniciais representativos para visualização imediata)
  const [folha, setFolha] = useState<number>(33600) // R$ 33.600,00
  const [receita, setReceita] = useState<number>(120000) // R$ 120.000,00

  // Strings exibidas nos inputs
  const [folhaInput, setFolhaInput] = useState<string>('33.600,00')
  const [receitaInput, setReceitaInput] = useState<string>('120.000,00')

  // SEO: título da aba (máximo 60 caracteres) começando por "Calculadora fator r" e meta description (máximo 155 caracteres)
  useEffect(() => {
    const pageTitle = 'Calculadora fator r: Anexo III ou V | PERES PERES' // 49 caracteres, começa por "Calculadora fator r"
    const pageDesc =
      'Calcule o Fator R do Simples Nacional em tempo real e descubra se sua empresa se enquadra no Anexo III ou Anexo V com base na LC 123/2006.' // 139 caracteres

    document.title = pageTitle
    let metaDescTag = document.querySelector('meta[name="description"]')
    if (!metaDescTag) {
      metaDescTag = document.createElement('meta')
      metaDescTag.setAttribute('name', 'description')
      document.head.appendChild(metaDescTag)
    }
    metaDescTag.setAttribute('content', pageDesc)
  }, [])

  const handleFolhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseRawToNumber(e.target.value)
    setFolha(num)
    setFolhaInput(formatRawInput(num))
  }

  const handleReceitaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseRawToNumber(e.target.value)
    setReceita(num)
    setReceitaInput(formatRawInput(num))
  }

  // Cálculos em tempo real
  const calculation = useMemo(() => {
    const hasValidReceita = receita > 0
    // Fator R = Folha / Receita
    const fatorR = hasValidReceita ? folha / receita : 0
    const fatorRPercent = fatorR * 100
    const isAnexoIII = fatorR >= 0.28 // 28%

    const folhaNecessariaPara28 = hasValidReceita ? 0.28 * receita : 0

    // Quanto falta para atingir 28% ou quanto tem de margem
    const folhaAdicionalNecessaria = Math.max(0, folhaNecessariaPara28 - folha)
    const margemFolha = Math.max(0, folha - folhaNecessariaPara28)

    return {
      hasValidReceita,
      fatorR,
      fatorRPercent,
      isAnexoIII,
      folhaNecessariaPara28,
      folhaAdicionalNecessaria,
      margemFolha,
    }
  }, [folha, receita])

  // Perguntas frequentes do FAQ
  const faqs = [
    {
      q: 'O que é o Fator R no Simples Nacional?',
      a: 'O Fator R é a relação percentual entre a folha de salários acumulada dos últimos 12 meses (incluindo pró-labore e encargos) e a receita bruta acumulada do mesmo período, determinando o anexo de tributação de prestadoras de serviços.',
    },
    {
      q: 'Quais atividades de serviço estão sujeitas ao Fator R?',
      a: 'Estão sujeitas atividades intelectuais, científicas, técnicas e de desenvolvimento, tais como programação e TI, medicina, odontologia, fisioterapia, engenharia, arquitetura, psicologia, consultorias e auditoria.',
    },
    {
      q: 'Como funciona a apuração do Fator R mês a mês?',
      a: 'A apuração é mensal e dinâmica. Em cada período de competência, somam-se a folha e a receita bruta dos 12 meses imediatamente anteriores para definir se a alíquota daquele mês incidirá pelo Anexo III ou pelo Anexo V.',
    },
    {
      q: 'Atingir 28% garante enquadramento automático no Anexo III?',
      a: 'Sim. Quando o resultado da divisão da folha pela receita bruta for igual ou superior a 0,28 (28,00%), o imposto devido no mês sobre as atividades elegíveis será calculado pelas tabelas do Anexo III.',
    },
    {
      q: 'O que acontece se a folha cair abaixo de 28% em determinado mês?',
      a: 'Caso a razão caia para menos de 0,28 no período de 12 meses apurado, a tributação daquele mês específico migra para o Anexo V, com alíquota inicial de 15,50% em vez de 6,00%.',
    },
  ]

  // Dados Estruturados JSON-LD
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://peresperes.com.br/calculadoras/fator-r#software',
        name: 'Calculadora de Fator R: Simples Nacional',
        url: 'https://peresperes.com.br/calculadoras/fator-r',
        applicationCategory: 'FinancialApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        description:
          'Ferramenta para cálculo em tempo real do Fator R do Simples Nacional, comparando enquadramento entre Anexo III e Anexo V conforme a LC 123/2006.',
        provider: {
          '@type': 'AccountingService',
          name: 'PERES PERES Consultoria e Contabilidade',
          url: 'https://peresperes.com.br',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://peresperes.com.br/calculadoras/fator-r#breadcrumb',
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
            name: 'Fator R',
            item: 'https://peresperes.com.br/calculadoras/fator-r',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://peresperes.com.br/calculadoras/fator-r#faq',
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
        {/* 1. TOPO DA PÁGINA */}
        {/* Trilha de navegação: Início > Calculadoras > Fator R */}
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
          <span className="text-black font-medium">Fator R</span>
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
            Regime Tributário • Simples Nacional
          </div>

          {/* Título principal (H1) exatamente como solicitado */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-black mb-5 leading-tight">
            Calculadora de Fator R: seu serviço cai no Anexo III ou Anexo V
          </h1>

          {/* Parágrafo de 2-3 linhas explicando o que a ferramenta faz e para quem serve */}
          <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
            Esta ferramenta calcula a proporção entre a folha de pagamento e a receita bruta
            acumulada nos últimos 12 meses para determinar o enquadramento fiscal de empresas de
            serviço optantes pelo Simples Nacional. Descubra se sua atividade é tributada pelas
            alíquotas do Anexo III ou pelas tabelas do Anexo V.
          </p>
        </header>

        {/* 2. BLOCO DA CALCULADORA (única parte que roda em JavaScript) */}
        <section
          aria-labelledby="calculadora-interativa-heading"
          className="border border-neutral-200 bg-white rounded-xl shadow-sm p-6 md:p-8 mb-12"
        >
          <div className="flex items-center justify-between pb-6 border-b border-neutral-200 mb-6">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-neutral-900" />
              <h2
                id="calculadora-interativa-heading"
                className="text-xl md:text-2xl font-serif font-bold text-black"
              >
                Simulação em Tempo Real
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
              Apuração dos últimos 12 meses
            </span>
          </div>

          {/* Formulário com os dois campos de entrada com máscara monetária em R$ */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label
                htmlFor="input-folha"
                className="block text-sm font-semibold text-neutral-900 mb-1.5"
              >
                Folha de salários dos últimos 12 meses (incluindo pró-labore)
              </label>
              <p className="text-xs text-neutral-500 mb-2">
                Soma de salários, pró-labore, 13º e encargos (FGTS e CPP) dos últimos doze meses.
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

            <div>
              <label
                htmlFor="input-receita"
                className="block text-sm font-semibold text-neutral-900 mb-1.5"
              >
                Receita bruta dos últimos 12 meses (RBT12)
              </label>
              <p className="text-xs text-neutral-500 mb-2">
                Total acumulado de faturamento e notas fiscais emitidas nos últimos doze meses.
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
          </div>

          {/* RESULTADO EM TEMPO REAL: 4 informações */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 mb-8">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-3">
              Resultado Apurado
            </span>

            {calculation.hasValidReceita ? (
              <div className="space-y-6">
                {/* 1 e 2: Fator R percentual e Anexo resultante */}
                <div className="grid sm:grid-cols-2 gap-4 pb-6 border-b border-neutral-200">
                  <div className="bg-white p-4 rounded-lg border border-neutral-200">
                    <span className="text-xs text-neutral-600 block mb-1">1. Fator R apurado</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl md:text-4xl font-mono font-bold text-black">
                        {calculation.fatorRPercent.toFixed(2)}%
                      </span>
                      <span className="text-xs font-mono text-neutral-500">
                        (coeficiente: {calculation.fatorR.toFixed(4)})
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500 mt-1 block">
                      Parâmetro legal de corte: 28,00%
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-neutral-200">
                    <span className="text-xs text-neutral-600 block mb-1">2. Anexo resultante</span>
                    <div className="flex items-center gap-2">
                      {/* Ponto focal 1: Destaque sutil com #FAB319 na identificação do enquadramento */}
                      <span className="inline-block bg-[#FAB319] text-black font-serif font-bold text-2xl md:text-3xl px-3 py-0.5 rounded">
                        {calculation.isAnexoIII ? 'Anexo III' : 'Anexo V'}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-700 mt-2 block">
                      {calculation.isAnexoIII
                        ? 'Fator R igual ou superior a 28,00% (0,28).'
                        : 'Fator R inferior a 28,00% (0,28).'}
                    </span>
                  </div>
                </div>

                {/* 3: Comparação da alíquota inicial */}
                <div className="bg-white p-4 rounded-lg border border-neutral-200">
                  <span className="text-xs text-neutral-600 block mb-2 font-semibold">
                    3. Comparação da alíquota inicial da 1ª faixa
                  </span>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div
                      className={`p-3 rounded border ${
                        calculation.isAnexoIII
                          ? 'border-neutral-900 bg-neutral-100 font-medium'
                          : 'border-neutral-200 bg-neutral-50'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-black">Anexo III (Alíquota inicial)</span>
                        <span className="font-mono font-bold text-base text-black">6,00%</span>
                      </div>
                      <p className="text-xs text-neutral-600">
                        Aplicável com Fator R ≥ 28%. Inclui CPP patronal unificada no DAS.
                      </p>
                    </div>

                    <div
                      className={`p-3 rounded border ${
                        !calculation.isAnexoIII
                          ? 'border-neutral-900 bg-neutral-100 font-medium'
                          : 'border-neutral-200 bg-neutral-50'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-black">Anexo V (Alíquota inicial)</span>
                        <span className="font-mono font-bold text-base text-black">15,50%</span>
                      </div>
                      <p className="text-xs text-neutral-600">
                        Aplicável com Fator R &lt; 28%. Incidência padrão inicial sem atingir a
                        razão mínima.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4: Quanto de folha de salários adicional seria necessário OU margem existente */}
                <div className="bg-white p-4 rounded-lg border border-neutral-200">
                  <span className="text-xs text-neutral-600 block mb-1 font-semibold">
                    4. Projeção de folha e margem de enquadramento
                  </span>

                  {!calculation.isAnexoIII ? (
                    <div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xs text-neutral-700 font-medium">
                          Folha de salários adicional necessária para atingir os 28%:
                        </span>
                        <span className="text-lg md:text-xl font-mono font-bold text-black">
                          {formatCurrencyBRL(calculation.folhaAdicionalNecessaria)}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        Para que o serviço migre para o Anexo III, a soma da folha nos últimos 12
                        meses precisa alcançar no mínimo{' '}
                        <strong>{formatCurrencyBRL(calculation.folhaNecessariaPara28)}</strong> (28%
                        de {formatCurrencyBRL(receita)}).
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-2">
                        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-300 mb-1">
                          Empresa já enquadrada no Anexo III
                        </span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-xs text-neutral-700 font-medium">
                            Margem de folha antes de sair do Anexo III:
                          </span>
                          <span className="text-lg md:text-xl font-mono font-bold text-black">
                            {formatCurrencyBRL(calculation.margemFolha)}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        A folha acumulada atual ({formatCurrencyBRL(folha)}) pode sofrer redução de
                        até {formatCurrencyBRL(calculation.margemFolha)} nos últimos 12 meses antes
                        que o Fator R fique abaixo do patamar de 28,00% (piso de{' '}
                        {formatCurrencyBRL(calculation.folhaNecessariaPara28)}).
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white border border-neutral-200 rounded text-sm text-neutral-600">
                Informe um valor de receita bruta dos últimos 12 meses superior a R$ 0,00 para
                visualizar o cálculo do Fator R e a memória aberta.
              </div>
            )}
          </div>

          {/* MEMÓRIA DE CÁLCULO ABERTO (linha por linha para refazer na mão) */}
          <div className="border border-neutral-200 rounded-lg p-5 bg-neutral-50">
            <div className="flex items-center gap-2 mb-3">
              <FileCheck2 className="h-4 w-4 text-neutral-800" />
              <h3 className="text-sm font-serif font-bold text-black uppercase tracking-wider">
                Memória de Cálculo Aberta
              </h3>
            </div>
            <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
              Demonstração explícita da aritmética aplicada para auditoria e conferência manual dos
              valores digitados:
            </p>

            <div className="font-mono text-xs md:text-sm bg-white border border-neutral-200 rounded p-4 space-y-2 text-neutral-800">
              <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Folha de Salários declarada (FS12):</span>
                <span className="font-semibold text-black">{formatCurrencyBRL(folha)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Receita Bruta declarada (RBT12):</span>
                <span className="font-semibold text-black">{formatCurrencyBRL(receita)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Fórmula do quociente (Folha ÷ Receita):</span>
                <span className="font-semibold text-black">
                  {formatCurrencyBRL(folha)} ÷ {formatCurrencyBRL(receita)} ={' '}
                  {calculation.hasValidReceita ? calculation.fatorR.toFixed(4) : '0,0000'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Conversão em percentual (× 100):</span>
                <span className="font-semibold text-black">
                  {calculation.fatorRPercent.toFixed(2)}%
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Condição legal (Art. 18, LC 123/2006):</span>
                <span className="font-semibold text-black">
                  {calculation.fatorRPercent.toFixed(2)}%{' '}
                  {calculation.isAnexoIII ? '≥ 28,00% → Anexo III' : '< 28,00% → Anexo V'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Piso de folha para 28% (0,28 × Receita):</span>
                <span className="font-semibold text-black">
                  0,28 × {formatCurrencyBRL(receita)} ={' '}
                  {formatCurrencyBRL(calculation.folhaNecessariaPara28)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-1">
                <span className="text-neutral-500">
                  {calculation.isAnexoIII
                    ? 'Margem admissível de redução (Folha − Piso):'
                    : 'Aporte de folha complementar (Piso − Folha):'}
                </span>
                <span className="font-semibold text-black">
                  {calculation.isAnexoIII
                    ? `${formatCurrencyBRL(folha)} − ${formatCurrencyBRL(
                        calculation.folhaNecessariaPara28,
                      )} = ${formatCurrencyBRL(calculation.margemFolha)}`
                    : `${formatCurrencyBRL(
                        calculation.folhaNecessariaPara28,
                      )} − ${formatCurrencyBRL(folha)} = ${formatCurrencyBRL(
                        calculation.folhaAdicionalNecessaria,
                      )}`}
                </span>
              </div>
            </div>
          </div>

          {/* Captura de e-mail */}
          <CalculatorEmailCapture calculatorName="Calculadora Fator R" />
        </section>

        {/* 3. TEXTO DE APROFUNDAMENTO (HTML estático renderizado no markup) */}
        <article className="prose prose-neutral max-w-none mb-16 space-y-12">
          {/* Subtítulo 1: O que é o Fator R */}
          <section aria-labelledby="o-que-e-fator-r">
            <h2
              id="o-que-e-fator-r"
              className="text-2xl md:text-3xl font-serif font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              O que é o Fator R
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                O Fator R é um mecanismo fiscal previsto no regime do Simples Nacional que
                condiciona a alíquota de determinadas atividades de prestação de serviços à
                intensidade de mão de obra empregada pela empresa. Ele estabelece uma proporção
                aritmética entre os gastos com folha de salários e a receita bruta auferida nos doze
                meses imediatamente anteriores ao período de apuração.
              </p>
              <p>
                O objetivo legislativo desse dispositivo é desonerar tributariamente as empresas de
                serviços que geram empregos diretos ou que remuneram seus sócios por meio de
                pró-labore formal submetido à incidência previdenciária. Quando os gastos com
                pessoal atingem ou superam a marca de 28% do faturamento, a legislação autoriza a
                migração do cálculo tributário para o Anexo III, cujas alíquotas são
                substancialmente menores do que as estipuladas no Anexo V.
              </p>
            </div>
          </section>

          {/* Subtítulo 2: Como o Fator R é calculado */}
          <section aria-labelledby="como-fator-r-e-calculado">
            <h2
              id="como-fator-r-e-calculado"
              className="text-2xl md:text-3xl font-serif font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              Como o Fator R é calculado
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                A determinação do Fator R decorre da divisão direta da folha de salários acumulada
                dos últimos doze meses pela receita bruta acumulada no mesmo período de doze meses.
                A fórmula por extenso expressa-se da seguinte maneira:
              </p>

              <div className="my-6 p-4 md:p-6 bg-neutral-100 border border-neutral-300 rounded-lg text-center font-mono text-sm md:text-base text-black font-semibold">
                Fator R = folha de salários dos últimos 12 meses, incluindo pró-labore ÷ receita
                bruta dos últimos 12 meses
              </div>

              <p>Representado algebricamente pela fórmula simplificada:</p>

              <div className="my-3 p-3 bg-neutral-50 border border-neutral-200 rounded text-center font-mono text-sm text-neutral-800">
                Fator R = FS12 ÷ RBT12
              </div>

              <p>
                O resultado decimal dessa divisão é então comparado com o índice fixo de{' '}
                <strong>0,28 (ou 28,00%)</strong>:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>
                  <strong>Fator R ≥ 0,28:</strong> as receitas de serviços enquadráveis no cálculo
                  são tributadas pelas alíquotas do <strong>Anexo III</strong> do Simples Nacional.
                </li>
                <li>
                  <strong>Fator R &lt; 0,28:</strong> as mesmas receitas passam a ser tributadas
                  pelas tabelas progressivas do <strong>Anexo V</strong>.
                </li>
              </ul>
              <p>
                Nos casos em que a empresa possui menos de doze meses de atividade operacional, a
                legislação determina a proporcionalização do faturamento e da folha de salários
                segundo os critérios previstos nas resoluções do Comitê Gestor do Simples Nacional
                (CGSN).
              </p>
            </div>
          </section>

          {/* Subtítulo 3: O que entra e o que não entra no cálculo da folha de salários */}
          <section aria-labelledby="o-que-entra-e-nao-entra">
            <h2
              id="o-que-entra-e-nao-entra"
              className="text-2xl md:text-3xl font-serif font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              O que entra e o que não entra no cálculo da folha de salários
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                A conformidade do cálculo depende estritamente da correta composição dos elementos
                que integram a folha de salários (FS12). Lançar valores indevidos ou omitir rubricas
                válidas compromete o enquadramento fiscal e gera inconsistências nas declarações
                transmitidas à Receita Federal:
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                {/* Entra */}
                <div className="border border-neutral-300 bg-white rounded-lg p-5">
                  <h3 className="font-serif font-bold text-lg text-black mb-3 pb-2 border-b border-neutral-200">
                    O que entra no cálculo da folha (FS12)
                  </h3>
                  <ul className="space-y-2 text-sm text-neutral-700 list-disc pl-5">
                    <li>
                      <strong>Salários e ordenados:</strong> remuneração de empregados registrados
                      sob o regime da CLT.
                    </li>
                    <li>
                      <strong>Pró-labore de sócios:</strong> remuneração formal paga aos sócios e
                      administradores que prestam serviços à sociedade.
                    </li>
                    <li>
                      <strong>13º Salário:</strong> valor integral e adiantamentos pagos a
                      trabalhadores nos doze meses.
                    </li>
                    <li>
                      <strong>Contribuição Previdenciária Patronal (CPP):</strong> valores
                      recolhidos pela empresa, quando aplicáveis.
                    </li>
                    <li>
                      <strong>FGTS:</strong> depósitos mensais do Fundo de Garantia do Tempo de
                      Serviço devidos e recolhidos.
                    </li>
                    <li>
                      <strong>Horas extras, adicionais e gratificações:</strong> verbas de natureza
                      salarial regular sujeitas à incidência de encargos.
                    </li>
                  </ul>
                </div>

                {/* Não entra */}
                <div className="border border-neutral-300 bg-white rounded-lg p-5">
                  <h3 className="font-serif font-bold text-lg text-black mb-3 pb-2 border-b border-neutral-200">
                    O que NÃO entra no cálculo da folha
                  </h3>
                  <ul className="space-y-2 text-sm text-neutral-700 list-disc pl-5">
                    <li>
                      <strong>Distribuição de lucros e dividendos:</strong> retiradas isentas
                      apuradas em balanço não possuem natureza de folha.
                    </li>
                    <li>
                      <strong>Bolsas de estágio:</strong> valores pagos a estagiários contratados
                      sob a Lei nº 11.788/2008.
                    </li>
                    <li>
                      <strong>Prestadores de serviços PJ:</strong> pagamentos feitos a outras
                      pessoas jurídicas ou terceirizados via nota fiscal.
                    </li>
                    <li>
                      <strong>Autônomos sem vínculo formal:</strong> pagamentos pontuais sem
                      caracterização de folha de salários continuada da atividade.
                    </li>
                    <li>
                      <strong>Reembolsos e diárias:</strong> ressarcimentos de despesas de viagens e
                      alimentação de caráter indenizatório.
                    </li>
                    <li>
                      <strong>Benefícios do PAT:</strong> auxílio-refeição e vale-transporte nos
                      limites e critérios do Programa de Alimentação do Trabalhador.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Subtítulo 4: A diferença prática entre o Anexo III e o Anexo V */}
          <section aria-labelledby="diferenca-pratica-anexo-iii-v">
            <h2
              id="diferenca-pratica-anexo-iii-v"
              className="text-2xl md:text-3xl font-serif font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              A diferença prática entre o Anexo III e o Anexo V
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                A distinção entre o Anexo III e o Anexo V reflete-se na carga tributária nominal e
                efetiva incidente sobre cada nota fiscal emitida. Enquanto o Anexo III inicia com
                uma alíquota de <strong>6,00%</strong> na primeira faixa de faturamento, o Anexo V
                inicia com <strong>15,50%</strong> para a mesma receita.
              </p>
              <p>
                Abaixo, a comparação integral das seis faixas de receita bruta anual e respectivas
                alíquotas nominais e parcelas a deduzir de ambos os anexos da Lei Complementar nº
                123/2006:
              </p>

              {/* TABELA HTML comparando faixas e alíquotas dos dois anexos */}
              <div className="my-6 border border-neutral-300 rounded-lg overflow-x-auto bg-white shadow-sm">
                <table className="w-full text-left text-xs md:text-sm border-collapse">
                  <thead>
                    <tr className="bg-neutral-100 border-b border-neutral-300 text-neutral-900 font-serif">
                      <th className="p-3 border-r border-neutral-200 font-bold">Faixa</th>
                      <th className="p-3 border-r border-neutral-200 font-bold">
                        Receita Bruta em 12 Meses (R$)
                      </th>
                      <th className="p-3 border-r border-neutral-200 font-bold bg-neutral-200/60">
                        Anexo III (Alíquota Nominal)
                      </th>
                      <th className="p-3 border-r border-neutral-200 font-bold">
                        Anexo III (Dedução)
                      </th>
                      <th className="p-3 border-r border-neutral-200 font-bold bg-neutral-200/60">
                        Anexo V (Alíquota Nominal)
                      </th>
                      <th className="p-3 font-bold">Anexo V (Dedução)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 font-mono text-neutral-800">
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3 border-r border-neutral-200 font-sans font-medium">
                        1ª Faixa
                      </td>
                      <td className="p-3 border-r border-neutral-200">Até 180.000,00</td>
                      <td className="p-3 border-r border-neutral-200 font-semibold bg-neutral-50">
                        6,00%
                      </td>
                      <td className="p-3 border-r border-neutral-200">R$ 0,00</td>
                      <td className="p-3 border-r border-neutral-200 font-semibold bg-neutral-50">
                        15,50%
                      </td>
                      <td className="p-3">R$ 0,00</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3 border-r border-neutral-200 font-sans font-medium">
                        2ª Faixa
                      </td>
                      <td className="p-3 border-r border-neutral-200">
                        De 180.000,01 a 360.000,00
                      </td>
                      <td className="p-3 border-r border-neutral-200 font-semibold bg-neutral-50">
                        11,20%
                      </td>
                      <td className="p-3 border-r border-neutral-200">R$ 9.360,00</td>
                      <td className="p-3 border-r border-neutral-200 font-semibold bg-neutral-50">
                        18,00%
                      </td>
                      <td className="p-3">R$ 4.500,00</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3 border-r border-neutral-200 font-sans font-medium">
                        3ª Faixa
                      </td>
                      <td className="p-3 border-r border-neutral-200">
                        De 360.000,01 a 720.000,00
                      </td>
                      <td className="p-3 border-r border-neutral-200 font-semibold bg-neutral-50">
                        13,50%
                      </td>
                      <td className="p-3 border-r border-neutral-200">R$ 17.640,00</td>
                      <td className="p-3 border-r border-neutral-200 font-semibold bg-neutral-50">
                        19,50%
                      </td>
                      <td className="p-3">R$ 9.900,00</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3 border-r border-neutral-200 font-sans font-medium">
                        4ª Faixa
                      </td>
                      <td className="p-3 border-r border-neutral-200">
                        De 720.000,01 a 1.800.000,00
                      </td>
                      <td className="p-3 border-r border-neutral-200 font-semibold bg-neutral-50">
                        16,00%
                      </td>
                      <td className="p-3 border-r border-neutral-200">R$ 35.640,00</td>
                      <td className="p-3 border-r border-neutral-200 font-semibold bg-neutral-50">
                        20,50%
                      </td>
                      <td className="p-3">R$ 17.100,00</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3 border-r border-neutral-200 font-sans font-medium">
                        5ª Faixa
                      </td>
                      <td className="p-3 border-r border-neutral-200">
                        De 1.800.000,01 a 3.600.000,00
                      </td>
                      <td className="p-3 border-r border-neutral-200 font-semibold bg-neutral-50">
                        21,00%
                      </td>
                      <td className="p-3 border-r border-neutral-200">R$ 125.640,00</td>
                      <td className="p-3 border-r border-neutral-200 font-semibold bg-neutral-50">
                        23,00%
                      </td>
                      <td className="p-3">R$ 62.100,00</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3 border-r border-neutral-200 font-sans font-medium">
                        6ª Faixa
                      </td>
                      <td className="p-3 border-r border-neutral-200">
                        De 3.600.000,01 a 4.800.000,00
                      </td>
                      <td className="p-3 border-r border-neutral-200 font-semibold bg-neutral-50">
                        33,00%
                      </td>
                      <td className="p-3 border-r border-neutral-200">R$ 648.000,00</td>
                      <td className="p-3 border-r border-neutral-200 font-semibold bg-neutral-50">
                        30,50%
                      </td>
                      <td className="p-3">R$ 540.000,00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-neutral-500 italic">
                * A alíquota efetiva a ser recolhida em cada guia DAS é obtida pela fórmula legal:
                (RBT12 × Alíquota Nominal − Parcela a Deduzir) ÷ RBT12.
              </p>
            </div>
          </section>

          {/* Subtítulo 5: Erros comuns ao calcular o Fator R */}
          <section aria-labelledby="erros-comuns-fator-r">
            <h2
              id="erros-comuns-fator-r"
              className="text-2xl md:text-3xl font-serif font-bold text-black mb-4 border-b border-neutral-200 pb-2"
            >
              Erros comuns ao calcular o Fator R
            </h2>
            <div className="space-y-4 text-neutral-700 text-base leading-relaxed">
              <p>
                Falhas de interpretação contábil na apuração do Fator R são recorrentes e provocam
                tanto o recolhimento excessivo de impostos quanto a geração de passivos tributários
                perante a Receita Federal do Brasil. Destacam-se quatro erros práticos:
              </p>

              <div className="space-y-4 my-6">
                {/* Erro 1 */}
                <div className="border border-neutral-200 rounded-lg p-5 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-semibold text-neutral-800">
                      Erro 01
                    </span>
                    <h3 className="font-serif font-bold text-base text-black">
                      Desconsiderar o pró-labore na soma da folha de salários
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-2">
                    Muitos gestores contabilizam apenas os salários de empregados celetistas e
                    esquecem que a remuneração formal dos sócios integra a folha de salários para
                    fins do Fator R.
                  </p>
                  <p className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded border border-neutral-200">
                    <strong>Efeito no enquadramento:</strong> Reduz artificialmente o montante da
                    folha nos 12 meses, fazendo com que a empresa apure um índice abaixo de 28% e
                    seja enquadrada indevidamente no Anexo V, recolhendo tributos com alíquotas
                    iniciais a partir de 15,50%.
                  </p>
                </div>

                {/* Erro 2 */}
                <div className="border border-neutral-200 rounded-lg p-5 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-semibold text-neutral-800">
                      Erro 02
                    </span>
                    <h3 className="font-serif font-bold text-base text-black">
                      Utilizar a receita de período fiscal divergente (ano-calendário)
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-2">
                    Calcular a base considerando o faturamento acumulado de janeiro a dezembro do
                    ano corrente em vez dos doze meses anteriores à data de competência da apuração.
                  </p>
                  <p className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded border border-neutral-200">
                    <strong>Efeito no enquadramento:</strong> Distorce a proporção matemática mês a
                    mês. Em meses do início do ano, o cálculo fica distorcido, resultando em
                    declarações incorretas no PGDAS-D e risco de glosa e autuação fiscal pela RFB.
                  </p>
                </div>

                {/* Erro 3 */}
                <div className="border border-neutral-200 rounded-lg p-5 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-semibold text-neutral-800">
                      Erro 03
                    </span>
                    <h3 className="font-serif font-bold text-base text-black">
                      Incluir distribuição de lucros ou pagamentos a PJ como folha de pagamento
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-2">
                    Lançar retiradas de lucros isentos de sócios ou contratos de prestação de
                    serviços terceirizados (notas de PJ) no cômputo da folha de pagamento.
                  </p>
                  <p className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded border border-neutral-200">
                    <strong>Efeito no enquadramento:</strong> Infla indevidamente a folha, gerando
                    um Fator R fictício acima de 28%. A empresa recolhe os tributos pelo Anexo III
                    de forma ilegítima, gerando passivo de tributos retroativos com multa de mora e
                    juros Selic.
                  </p>
                </div>

                {/* Erro 4 */}
                <div className="border border-neutral-200 rounded-lg p-5 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-semibold text-neutral-800">
                      Erro 04
                    </span>
                    <h3 className="font-serif font-bold text-base text-black">
                      Calcular a proporção com o faturamento isolado do mês corrente
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-2">
                    Dividir a folha mensal pelo faturamento mensal individual, desconsiderando a
                    regra legal expressa do acumulado dos 12 meses anteriores.
                  </p>
                  <p className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded border border-neutral-200">
                    <strong>Efeito no enquadramento:</strong> Cria oscilações artificiais severas.
                    Em meses com menor faturamento pontual, o fator dispara, enquanto em meses com
                    pico de emissão de notas o fator desaba, violando as regras da Receita Federal.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </article>

        {/* 4. BLOCO DE VIGÊNCIA (visível) */}
        <section
          aria-labelledby="vigencia-title"
          className="border border-neutral-200 bg-white rounded-xl p-6 mb-8 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <Scale className="h-5 w-5 text-neutral-800 shrink-0 mt-0.5" />
            <div>
              <h3 id="vigencia-title" className="font-serif font-bold text-base text-black mb-1">
                Vigência Normativa e Base Legal Aplicada
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                As tabelas, alíquotas e critérios de parametrização apresentados nesta calculadora
                seguem a legislação vigente na data de publicação, em estrita observância ao{' '}
                <strong>
                  artigo 18, parágrafos 5º e 24 (quinto e vigésimo quarto), da Lei Complementar nº
                  123, de 14 de dezembro de 2006
                </strong>
                , e suas alterações posteriores consolidadas pelo Comitê Gestor do Simples Nacional
                (CGSN).
              </p>
            </div>
          </div>
        </section>

        {/* 5. AVISO LEGAL */}
        <section
          aria-labelledby="aviso-legal-title"
          className="border border-neutral-200 bg-neutral-50 rounded-xl p-6 mb-12"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-neutral-700 shrink-0 mt-0.5" />
            <div>
              <h3 id="aviso-legal-title" className="font-serif font-bold text-base text-black mb-1">
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

        {/* 6. FAQ com CINCO perguntas sobre Fator R / Anexo III / Anexo V */}
        <section aria-labelledby="faq-fator-r-title" className="mb-14">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 border border-neutral-300 bg-neutral-100 px-3 py-1 rounded text-xs font-mono uppercase tracking-wider text-neutral-800 mb-2">
              <HelpCircle className="h-3.5 w-3.5 text-black" />
              Perguntas Frequentes
            </div>
            <h2
              id="faq-fator-r-title"
              className="text-2xl md:text-3xl font-serif font-bold text-black"
            >
              Dúvidas Técnicas sobre o Fator R
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

        {/* 7. BLOCO DE CALCULADORAS RELACIONADAS com três links */}
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
                  Comparativo estimativo de carga tributária e encargos entre os regimes.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center text-xs font-medium text-black">
                Acessar simulador{' '}
                <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

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
                  Avaliação de incidência de INSS, IRPF e distribuição isenta de lucros.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center text-xs font-medium text-black">
                Acessar simulador{' '}
                <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

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
                  Cálculo dos encargos mensais e anuais, provisões e custo total para a empresa.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center text-xs font-medium text-black">
                Acessar simulador{' '}
                <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </section>

        {/* 8. BLOCO FINAL de chamada para contato com o escritório */}
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
              Precisa de um diagnóstico tributário formal para sua empresa?
            </h2>

            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
              Nossa equipe estrutura pareceres contábeis, planejamento de pró-labore e auditoria de
              enquadramento no Simples Nacional com total segurança técnica e jurídica.
            </p>

            {/* Ponto focal 2: Botão em #FAB319 com texto preto */}
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
