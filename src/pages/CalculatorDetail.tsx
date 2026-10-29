import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CALCULATORS } from '@/lib/calculatorsData'
import {
  ChevronRight,
  ArrowLeft,
  Wrench,
  ShieldAlert,
  BookOpen,
  Clock,
  FileCheck2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import NotFound from './NotFound'

export default function CalculatorDetail() {
  const { slug } = useParams<{ slug: string }>()

  const calculator = CALCULATORS.find((c) => c.slug === slug)

  useEffect(() => {
    if (!calculator) return

    const pageTitle = `${calculator.name}, em desenvolvimento | PERES PERES Consultoria & Contabilidade`
    const pageDesc = `${calculator.name}: ferramenta em desenvolvimento pela PERES PERES Consultoria & Contabilidade. Em breve, simulação com memória de cálculo aberta e base legal.`

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
      trackCalculatorAccess(calculator.slug, calculator.name)
    })
  }, [calculator])

  if (!calculator) {
    return <NotFound />
  }

  // Schema JSON-LD específico da ferramenta em desenvolvimento
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${calculator.name} | PERES PERES Consultoria & Contabilidade`,
    description: calculator.shortDescription,
    breadcrumb: {
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
        {
          '@type': 'ListItem',
          position: 3,
          name: calculator.name,
          item: `https://peresperes.com.br/calculadoras/${calculator.slug}`,
        },
      ],
    },
  }

  return (
    <div className="py-12 md:py-16 bg-background min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Trilha de navegação (Breadcrumb) */}
        <nav
          aria-label="Trilha de navegação"
          className="flex items-center gap-2 text-xs md:text-sm text-neutral-500 mb-8"
        >
          <Link to="/" className="hover:text-black transition-colors">
            Início
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
          <Link to="/calculadoras" className="hover:text-black transition-colors">
            Calculadoras
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
          <span className="text-black font-medium">{calculator.name}</span>
        </nav>

        {/* Voltar para Calculadoras */}
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

        {/* Cabeçalho do Card */}
        <div className="border border-neutral-200 bg-white rounded-xl p-8 md:p-12 shadow-sm mb-8">
          <div className="inline-block border border-neutral-300 bg-neutral-100 text-neutral-800 text-xs font-mono uppercase tracking-wider px-3 py-1 rounded mb-4">
            {calculator.category}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 leading-tight">
            {calculator.name}
          </h1>

          <p className="text-base md:text-lg text-neutral-700 leading-relaxed mb-8">
            {calculator.shortDescription}
          </p>

          {/* Nota de Desenvolvimento */}
          <div className="bg-neutral-50 border-l-4 border-[#FAB319] p-5 rounded-r-lg mb-8">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded bg-neutral-900 text-white shrink-0 mt-0.5">
                <Wrench className="h-4 w-4 text-[#FAB319]" />
              </div>
              <div>
                <h2 className="font-semibold text-base text-black mb-1">
                  Ferramenta em desenvolvimento
                </h2>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  A equipe técnica da <strong>PERES PERES Consultoria &amp; Contabilidade</strong>{' '}
                  está finalizando a parametrização dos coeficientes analíticos e das regras de
                  cálculo desta ferramenta. Em breve, a simulação interativa com abertura integral
                  da memória de cálculo e exportação de relatório estará disponível.
                </p>
              </div>
            </div>
          </div>

          {/* Ficha técnica da ferramenta */}
          <div className="grid sm:grid-cols-2 gap-4 pt-6 border-t border-neutral-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-neutral-100 text-black rounded border border-neutral-200 shrink-0">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-neutral-500 block">
                  Base Legal Aplicada
                </span>
                <span className="text-sm font-medium text-neutral-800">
                  {calculator.legalBasis}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-neutral-100 text-black rounded border border-neutral-200 shrink-0">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-neutral-500 block">
                  Revisão Normativa
                </span>
                <span className="text-sm font-medium text-neutral-800">{calculator.updatedAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bloco de Rigor Metodológico e Orientação */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Card className="border border-neutral-200 bg-white shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <FileCheck2 className="h-5 w-5 text-neutral-800 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-base text-black mb-1">
                    Memória de cálculo aberta
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Quando disponibilizada, cada simulação apresentará os passos aritméticos e os
                    fundamentos normativos detalhados, permitindo auditoria pontual por sua equipe
                    contábil.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-200 bg-white shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-neutral-800 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-base text-black mb-1">Estimativa preliminar</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Resultados calculados são referenciais e não substituem a análise formal de um
                    profissional habilitado perante o Conselho Regional de Contabilidade.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chamada para atendimento técnico imediato */}
        <div className="bg-neutral-950 text-white rounded-xl p-8 text-center space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Necessita dessa análise tributária imediatamente?
          </h2>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Nossa equipe técnica atende empresas de todo o país para diagnósticos fiscais e
            planejamento tributário personalizado com parecer formal.
          </p>
          <div className="pt-2">
            <Button
              asChild
              className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-sm px-6 py-2.5 h-auto"
            >
              <Link to="/contato">Agendar Análise com Especialista</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
