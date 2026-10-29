import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CALCULATOR_CATEGORIES, CALCULATORS, CALCULATORS_FAQS } from '@/lib/calculatorsData'
import {
  ChevronRight,
  ArrowRight,
  Calculator,
  Scale,
  Calendar,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export default function CalculatorsHub() {
  useEffect(() => {
    const pageTitle =
      'Calculadoras Tributárias e Trabalhistas Gratuitas | PERES PERES Consultoria & Contabilidade'
    const pageDesc =
      'Simuladores tributários e trabalhistas gratuitos com memória de cálculo aberta e fundamentação legal: Fator R, Simples Nacional, Lucro Presumido e encargos.'

    document.title = pageTitle

    let metaDescTag = document.querySelector('meta[name="description"]')
    if (!metaDescTag) {
      metaDescTag = document.createElement('meta')
      metaDescTag.setAttribute('name', 'description')
      document.head.appendChild(metaDescTag)
    }
    metaDescTag.setAttribute('content', pageDesc)
  }, [])

  // Dados estruturados Schema.org: ItemList (Coleção das 9 calculadoras), FAQPage e BreadcrumbList
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
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
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Calculadoras tributárias, trabalhistas e contábeis gratuitas',
        description:
          'Coleção de calculadoras e simuladores tributários, trabalhistas e contábeis para estimativa de cenários fiscais.',
        numberOfItems: CALCULATORS.length,
        itemListElement: CALCULATORS.map((calc, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: calc.name,
          url: `https://peresperes.com.br/calculadoras/${calc.slug}`,
          description: calc.shortDescription,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: CALCULATORS_FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  }

  return (
    <div className="py-12 md:py-20 bg-background min-h-screen">
      {/* Script JSON-LD injetado no DOM */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      <div className="container mx-auto px-4 max-w-6xl">
        {/* 1. Trilha de navegação no topo: Início > Calculadoras */}
        <nav
          aria-label="Trilha de navegação"
          className="flex items-center gap-2 text-xs md:text-sm text-neutral-500 mb-8"
        >
          <Link to="/" className="hover:text-black transition-colors">
            Início
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
          <span className="text-black font-medium">Calculadoras</span>
        </nav>

        {/* 2 & 3. Título único (H1) e Parágrafo de apresentação */}
        <header className="mb-14 max-w-4xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 border border-neutral-300 bg-neutral-100 px-3 py-1 rounded text-xs font-mono uppercase tracking-wider text-neutral-800 mb-4">
            <Calculator className="h-3.5 w-3.5 text-black" />
            Ferramentas Técnicas Abertas
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-black mb-6 leading-tight">
            Calculadoras tributárias, trabalhistas e contábeis gratuitas
          </h1>

          <div className="space-y-4 text-neutral-700 text-base md:text-lg leading-relaxed">
            <p>
              Desenvolvemos estas ferramentas gratuitas de estimativa para oferecer clareza e
              previsibilidade a empresários, gestores e profissionais liberais na tomada de decisões
              estratégicas.
            </p>
            <p>
              Cada simulador apresenta a memória de cálculo aberta e a base legal estritamente
              aplicada aos dispositivos vigentes na legislação brasileira.
            </p>
            <div className="flex items-start gap-3 p-4 bg-neutral-100 border border-neutral-200 rounded-lg text-sm text-neutral-800">
              <AlertCircle className="h-5 w-5 text-neutral-700 shrink-0 mt-0.5" />
              <p>
                <strong>Aviso de conformidade técnica:</strong> os resultados gerados são
                estimativas e não substituem a análise detalhada de um profissional devidamente
                habilitado perante o Conselho Regional de Contabilidade.
              </p>
            </div>
          </div>
        </header>

        {/* 4. Cards organizados em três blocos por categoria */}
        <div className="space-y-16 mb-20">
          {CALCULATOR_CATEGORIES.map((category, catIdx) => (
            <section
              key={category.title}
              aria-labelledby={`categoria-${catIdx}`}
              className="border-t border-neutral-200 pt-10"
            >
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-semibold uppercase tracking-widest text-neutral-500">
                    Bloco 0{catIdx + 1}
                  </span>
                </div>
                <h2
                  id={`categoria-${catIdx}`}
                  className="text-2xl md:text-3xl font-bold text-black mb-2"
                >
                  {category.title}
                </h2>
                <p className="text-neutral-600 text-sm md:text-base">{category.description}</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((calc) => (
                  <Card
                    key={calc.id}
                    className="border border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between text-xs text-neutral-500 mb-2 font-mono">
                        <span>{calc.category}</span>
                        <span className="text-[11px] bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                          {calc.updatedAt}
                        </span>
                      </div>
                      <CardTitle className="text-lg md:text-xl font-bold text-black leading-snug">
                        {calc.name}
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm text-neutral-600 leading-relaxed pt-2">
                        {calc.shortDescription}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                        <span
                          className="text-[11px] text-neutral-500 truncate max-w-[170px]"
                          title={calc.legalBasis}
                        >
                          {calc.legalBasis}
                        </span>
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="text-black hover:bg-neutral-100 font-medium text-xs p-2 h-auto flex items-center gap-1 group shrink-0"
                        >
                          <Link to={`/calculadoras/${calc.slug}`}>
                            Acessar{' '}
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* 6. Bloco após os cards chamado "Por que os números daqui são confiáveis" */}
        <section
          aria-labelledby="confiabilidade-title"
          className="border border-neutral-200 bg-neutral-50 rounded-2xl p-8 md:p-12 mb-20 shadow-sm"
        >
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-2">
              Metodologia e Rigor Técnico
            </span>
            <h2
              id="confiabilidade-title"
              className="text-2xl md:text-4xl font-bold text-black mb-4"
            >
              Por que os números daqui são confiáveis
            </h2>
            <p className="text-neutral-700 text-base md:text-lg leading-relaxed">
              Diferente de simuladores genéricos que ocultam fórmulas e aplicam aproximações
              arbitrárias, nossas ferramentas operam sob as mesmas premissas técnicas aplicadas aos
              pareceres formais da <strong>PERES PERES Consultoria &amp; Contabilidade</strong>.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-4">
            <div className="bg-white p-6 rounded-xl border border-neutral-200">
              <div className="p-3 bg-neutral-100 rounded-lg w-fit mb-4">
                <Scale className="h-5 w-5 text-black" />
              </div>
              <h3 className="font-semibold text-lg text-black mb-2">Citação da base legal</h3>
              <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
                Cada cálculo é fundamentado no dispositivo normativo correspondente (Leis
                Complementares, Decretos, Instruções Normativas da RFB e resoluções vigentes),
                garantindo validade material.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-neutral-200">
              <div className="p-3 bg-neutral-100 rounded-lg w-fit mb-4">
                <Calendar className="h-5 w-5 text-black" />
              </div>
              <h3 className="font-semibold text-lg text-black mb-2">Atualização das tabelas</h3>
              <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
                Informamos expressamente o mês e ano de revisão das alíquotas, faixas e
                coeficientes. Mudanças legislativas e novas tabelas são refletidas periodicamente em
                nosso repositório.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-neutral-200">
              <div className="p-3 bg-neutral-100 rounded-lg w-fit mb-4">
                <FileSpreadsheet className="h-5 w-5 text-black" />
              </div>
              <h3 className="font-semibold text-lg text-black mb-2">Memória de cálculo aberta</h3>
              <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
                Exibição integral das etapas da operação aritmética, dedução de parcelas a deduzir e
                alíquotas efetivas, viabilizando a auditoria e a conferência por qualquer contador
                ou auditor.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Seção de perguntas frequentes com CINCO perguntas */}
        <section aria-labelledby="faq-title" className="mb-20 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 border border-neutral-300 bg-neutral-100 px-3 py-1 rounded text-xs font-mono uppercase tracking-wider text-neutral-800 mb-3">
              <HelpCircle className="h-3.5 w-3.5 text-black" />
              Dúvidas Técnicas Frequentes
            </div>
            <h2 id="faq-title" className="text-3xl md:text-4xl font-bold text-black mb-3">
              Perguntas Frequentes sobre as Calculadoras
            </h2>
            <p className="text-neutral-600 text-sm md:text-base">
              Esclarecimentos sobre limites de uso, premissas de cálculo e orientações consultivas.
            </p>
          </div>

          <div className="border border-neutral-200 bg-white rounded-xl p-6 md:p-8 shadow-sm">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {CALCULATORS_FAQS.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-neutral-200 last:border-b-0 pb-2"
                >
                  <AccordionTrigger className="text-left font-semibold text-base md:text-lg text-black hover:no-underline hover:text-neutral-700 py-3">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-700 text-sm md:text-base leading-relaxed pt-2 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* 8. Bloco final de chamada para contato com botão apontando para a página de contato existente */}
        <section
          aria-labelledby="contato-callout-title"
          className="bg-neutral-950 text-white rounded-2xl p-8 md:p-12 text-center"
        >
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 border border-neutral-800 px-3 py-1 rounded text-xs uppercase tracking-wider text-neutral-400 font-mono">
              <MessageSquare className="h-3.5 w-3.5 text-neutral-300" />
              Atendimento Consultivo
            </div>

            <h2
              id="contato-callout-title"
              className="text-2xl md:text-4xl font-bold text-white leading-tight"
            >
              Deseja validar seus cenários com um tributarista?
            </h2>

            <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
              Nossa equipe estrutura pareceres formais, diagnósticos de enquadramento tributário e
              estudos comparativos personalizados para assegurar conformidade e segurança jurídica.
            </p>

            {/* Ponto focal #FAB319 no botão de CTA */}
            <div className="pt-2 flex justify-center">
              <Button
                size="lg"
                className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-base h-12 px-8 shadow-sm"
                asChild
              >
                <Link to="/contato">Agendar Análise Preliminar</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
