import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { REAL_CASES } from '@/lib/casesData'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Search,
  Scale,
  Wrench,
  CheckCircle2,
} from 'lucide-react'
import NotFound from '@/pages/NotFound'

export default function CaseDetail() {
  const { slug } = useParams<{ slug: string }>()
  const caseItem = REAL_CASES.find((c) => c.slug === slug)

  useEffect(() => {
    if (caseItem) {
      document.title = `${caseItem.title} | PERES PERES Consultoria e Contabilidade`
    }
  }, [caseItem])

  if (!caseItem) {
    return <NotFound />
  }

  const sections = [
    {
      title: 'Contexto da empresa',
      icon: Building2,
      content: caseItem.companyContext,
    },
    {
      title: 'Situação identificada',
      icon: Search,
      content: caseItem.identifiedSituation,
    },
    {
      title: 'Fundamento legal aplicado',
      icon: Scale,
      content: caseItem.legalBasis,
    },
    {
      title: 'O que foi feito',
      icon: Wrench,
      content: caseItem.actionsTaken,
    },
    {
      title: 'Resultado obtido',
      icon: CheckCircle2,
      content: caseItem.obtainedResult,
    },
  ]

  return (
    <article className="py-12 md:py-16 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb: Início > Casos > nome do caso */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList className="text-xs md:text-sm text-neutral-600">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="hover:text-black transition-colors">
                    Início
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/casos" className="hover:text-black transition-colors">
                    Casos
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-black line-clamp-1 max-w-[240px] md:max-w-md">
                  {caseItem.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Topo do caso: Título, Categoria, Data */}
        <header className="mb-10 pb-8 border-b border-neutral-200">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-black text-white hover:bg-neutral-800 text-xs font-normal px-2.5 py-1">
              {caseItem.category}
            </Badge>
            <div className="flex items-center gap-1.5 text-xs text-neutral-600">
              <Calendar className="h-3.5 w-3.5" />
              <span>Publicado em {caseItem.dateFormatted}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-black leading-tight mb-6">
            {caseItem.title}
          </h1>

          <div className="p-4 rounded-lg border border-neutral-200 bg-neutral-50 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-neutral-900 shrink-0 mt-0.5" />
            <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-sans">
              <strong>Nota de sigilo profissional:</strong> Dados cadastrais, razão social e
              informações identificadoras foram anonimizados em conformidade com o Código de Ética
              Profissional do Contador e a Lei Geral de Proteção de Dados (LGPD).
            </p>
          </div>
        </header>

        {/* Corpo do caso: Os 5 blocos na ordem exata */}
        <div className="space-y-10">
          {sections.map((section, idx) => {
            const Icon = section.icon
            return (
              <section
                key={section.title}
                className="p-6 md:p-8 rounded-lg border border-neutral-200 bg-white shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-neutral-100">
                  <div className="w-8 h-8 rounded bg-neutral-100 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-neutral-800" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block">
                      Bloco 0{idx + 1}
                    </span>
                    <h2 className="text-xl md:text-2xl font-serif font-bold text-black">
                      {section.title}
                    </h2>
                  </div>
                </div>

                <div className="prose prose-neutral max-w-none text-neutral-800 text-base leading-relaxed font-serif">
                  <p>{section.content}</p>
                </div>
              </section>
            )
          })}
        </div>

        {/* Rodapé do caso: Navegação e CTA */}
        <footer className="mt-12 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            variant="outline"
            asChild
            className="border-neutral-300 text-black hover:bg-neutral-100"
          >
            <Link to="/casos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para todos os casos
            </Link>
          </Button>

          {/* Ponto focal com botão amarelo #FAB319 */}
          <Button
            asChild
            className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold border-none px-6"
          >
            <Link to="/contato">Agendar Análise Técnica</Link>
          </Button>
        </footer>
      </div>
    </article>
  )
}
