import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { SUCCESS_CASES } from '@/lib/successCasesData'
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
  ArrowLeft,
  ShieldCheck,
  Building2,
  AlertTriangle,
  Wrench,
  Trophy,
  Scale,
  Search,
  CheckCircle2,
} from 'lucide-react'
import { ShareButtons } from '@/components/ShareButtons'
import NotFound from '@/pages/NotFound'

export default function CaseDetail() {
  const { slug } = useParams<{ slug: string }>()

  // Primeiro busca no novo acervo de casos estruturados
  const successCase = SUCCESS_CASES.find((c) => c.slug === slug)
  // Caso não encontre, busca no acervo complementar anterior
  const legacyCase = !successCase ? REAL_CASES.find((c) => c.slug === slug) : null

  useEffect(() => {
    if (successCase) {
      document.title = `${successCase.title} | PERES PERES Consultoria e Contabilidade`
    } else if (legacyCase) {
      document.title = `${legacyCase.title} | PERES PERES Consultoria e Contabilidade`
    }
  }, [successCase, legacyCase])

  if (!successCase && !legacyCase) {
    return <NotFound />
  }

  // Renderização de caso principal (CASO 1 ou CASO 2 com texto integral preservado)
  if (successCase) {
    const currentUrl = `https://peresperes.com.br/casos/${successCase.slug}`

    return (
      <article className="bg-black text-neutral-100 min-h-screen py-12 md:py-20 font-sans selection:bg-[#FAB319] selection:text-black">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb: Início > Casos de Sucesso > Caso Atual */}
          <div className="mb-8">
            <Breadcrumb>
              <BreadcrumbList className="text-xs md:text-sm text-neutral-400">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/" className="hover:text-white transition-colors">
                      Início
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-neutral-600" />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/casos" className="hover:text-white transition-colors">
                      Casos de Sucesso
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-neutral-600" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium text-white line-clamp-1 max-w-[220px] md:max-w-md">
                    {successCase.badgeText}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Botão claro de volta para /casos no topo */}
          <div className="mb-6">
            <Link
              to="/casos"
              className="inline-flex items-center text-xs md:text-sm text-neutral-400 hover:text-[#FAB319] transition-colors group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Voltar para a lista de casos</span>
            </Link>
          </div>

          {/* Topo do caso: Badges, Título, Segmento */}
          <header className="mb-10 pb-8 border-b border-neutral-800 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-[#FAB319] text-black hover:bg-[#e0a116] text-xs font-bold font-mono px-3 py-1 uppercase tracking-wider">
                {successCase.badgeText}
              </Badge>
              <span className="text-xs text-neutral-400 font-mono">{successCase.badgeSubtext}</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
              {successCase.title}
            </h1>

            <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-900/80 text-sm text-neutral-300">
              <span className="font-semibold text-white">Segmento:</span> {successCase.segment}
            </div>

            {/* Parágrafo de sigilo e responsabilidade técnica */}
            <div className="p-4 md:p-5 rounded-lg border border-neutral-800 bg-neutral-900/60 space-y-2">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-[#FAB319] shrink-0 mt-0.5" />
                <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                  <strong>Nota de sigilo profissional:</strong> Os nomes dos clientes são
                  rigorosamente preservados por dever de sigilo profissional e em estrito respeito
                  às normas éticas e à LGPD. Os resultados apresentados dependem das
                  particularidades de cada empresa, não constituindo promessa ou garantia de
                  resultado futuro.
                </p>
              </div>
              <div className="pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400 font-mono">
                Responsabilidade Técnica: Rafael Peres Peres Nunes Altoé (CRC 027704/O)
              </div>
            </div>

            {/* Compartilhamento no topo da página de caso */}
            <div className="pt-2">
              <ShareButtons title={`${successCase.title} | PERES PERES`} url={currentUrl} />
            </div>
          </header>

          {/* Conteúdo integral do caso: As 4 seções exatas */}
          <div className="space-y-10">
            {/* Contexto */}
            <section className="p-6 md:p-8 rounded-xl border border-neutral-800 bg-neutral-900/90 shadow-lg space-y-4">
              <div className="flex items-center gap-2.5 border-l-2 border-[#FAB319] pl-3">
                <Building2 className="h-5 w-5 text-[#FAB319] shrink-0" />
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight uppercase">
                  Contexto
                </h2>
              </div>
              <p className="text-neutral-300 leading-relaxed text-base pl-3 md:pl-5">
                {successCase.context}
              </p>
            </section>

            {/* Desafio */}
            <section className="p-6 md:p-8 rounded-xl border border-neutral-800 bg-neutral-900/90 shadow-lg space-y-4">
              <div className="flex items-center gap-2.5 border-l-2 border-[#FAB319] pl-3">
                <AlertTriangle className="h-5 w-5 text-[#FAB319] shrink-0" />
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight uppercase">
                  Desafio
                </h2>
              </div>
              <p className="text-neutral-300 leading-relaxed text-base pl-3 md:pl-5">
                {successCase.challenge}
              </p>
            </section>

            {/* O que foi feito */}
            <section className="p-6 md:p-8 rounded-xl border border-neutral-800 bg-neutral-900/90 shadow-lg space-y-4">
              <div className="flex items-center gap-2.5 border-l-2 border-[#FAB319] pl-3">
                <Wrench className="h-5 w-5 text-[#FAB319] shrink-0" />
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight uppercase">
                  O que foi feito
                </h2>
              </div>
              <div className="pl-3 md:pl-5 space-y-3.5 text-neutral-300 leading-relaxed text-base">
                {successCase.actionsTaken.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>
            </section>

            {/* Resultado */}
            <section className="p-6 md:p-8 rounded-xl border border-neutral-800 bg-neutral-900/90 shadow-lg space-y-4">
              <div className="flex items-center gap-2.5 border-l-2 border-[#FAB319] pl-3">
                <Trophy className="h-5 w-5 text-[#FAB319] shrink-0" />
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight uppercase">
                  Resultado
                </h2>
              </div>
              <div className="pl-3 md:pl-5 space-y-4 text-neutral-300 leading-relaxed text-base">
                {successCase.result.highlightNumber ? (
                  <>
                    <p>
                      {successCase.result.highlightPrefix}{' '}
                      <span className="inline-block font-bold text-black bg-[#FAB319] px-2.5 py-0.5 rounded shadow-sm">
                        {successCase.result.highlightNumber}
                      </span>{' '}
                      {successCase.result.highlightSuffix}
                    </p>
                    {successCase.result.paragraphs.slice(1).map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </>
                ) : (
                  successCase.result.paragraphs.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Bloco de Compartilhamento no rodapé do caso */}
          <div className="mt-12 p-6 rounded-xl border border-neutral-800 bg-neutral-950/80 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Gostou deste caso? Compartilhe com sua rede:
            </h3>
            <ShareButtons title={`${successCase.title} | PERES PERES`} url={currentUrl} />
          </div>

          {/* Rodapé do caso: Navegação e CTA */}
          <footer className="mt-10 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              variant="outline"
              asChild
              className="border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 hover:text-white"
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

  // Renderização legada para os casos complementares em REAL_CASES (caso o usuário acesse)
  const legacySections = [
    {
      title: 'Contexto da empresa',
      icon: Building2,
      content: legacyCase!.companyContext,
    },
    {
      title: 'Situação identificada',
      icon: Search,
      content: legacyCase!.identifiedSituation,
    },
    {
      title: 'Fundamento legal aplicado',
      icon: Scale,
      content: legacyCase!.legalBasis,
    },
    {
      title: 'O que foi feito',
      icon: Wrench,
      content: legacyCase!.actionsTaken,
    },
    {
      title: 'Resultado obtido',
      icon: CheckCircle2,
      content: legacyCase!.obtainedResult,
    },
  ]

  const legacyUrl = `https://peresperes.com.br/casos/${legacyCase!.slug}`

  return (
    <article className="bg-black text-neutral-100 min-h-screen py-12 md:py-16 font-sans selection:bg-[#FAB319] selection:text-black">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb: Início > Casos > nome do caso */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList className="text-xs md:text-sm text-neutral-400">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="hover:text-white transition-colors">
                    Início
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-neutral-600" />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/casos" className="hover:text-white transition-colors">
                    Casos de Sucesso
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-neutral-600" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-white line-clamp-1 max-w-[240px] md:max-w-md">
                  {legacyCase!.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Botão voltar */}
        <div className="mb-6">
          <Link
            to="/casos"
            className="inline-flex items-center text-xs md:text-sm text-neutral-400 hover:text-[#FAB319] transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Voltar para a lista de casos</span>
          </Link>
        </div>

        {/* Topo do caso: Título, Categoria, Data */}
        <header className="mb-10 pb-8 border-b border-neutral-800 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-[#FAB319] text-black hover:bg-[#e0a116] text-xs font-bold font-mono px-2.5 py-1">
              {legacyCase!.category}
            </Badge>
            <span className="text-xs text-neutral-400 font-mono">
              Publicado em {legacyCase!.dateFormatted}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {legacyCase!.title}
          </h1>

          <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-900/60 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-[#FAB319] shrink-0 mt-0.5" />
            <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
              <strong>Nota de sigilo profissional:</strong> Dados cadastrais, razão social e
              informações identificadoras foram rigorosamente anonimizados em conformidade com o
              Código de Ética Profissional do Contador e a Lei Geral de Proteção de Dados (LGPD).
            </p>
          </div>

          <div className="pt-2">
            <ShareButtons title={`${legacyCase!.title} | PERES PERES`} url={legacyUrl} />
          </div>
        </header>

        {/* Corpo do caso */}
        <div className="space-y-8">
          {legacySections.map((section, idx) => {
            const Icon = section.icon
            return (
              <section
                key={section.title}
                className="p-6 md:p-8 rounded-lg border border-neutral-800 bg-neutral-900/90 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-neutral-800">
                  <div className="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-[#FAB319]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                      Bloco 0{idx + 1}
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-white">{section.title}</h2>
                  </div>
                </div>

                <div className="text-neutral-300 text-base leading-relaxed">
                  <p>{section.content}</p>
                </div>
              </section>
            )
          })}
        </div>

        {/* Compartilhamento final */}
        <div className="mt-12 p-6 rounded-xl border border-neutral-800 bg-neutral-950/80 space-y-3">
          <ShareButtons title={`${legacyCase!.title} | PERES PERES`} url={legacyUrl} />
        </div>

        {/* Rodapé do caso: Navegação e CTA */}
        <footer className="mt-10 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            variant="outline"
            asChild
            className="border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 hover:text-white"
          >
            <Link to="/casos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para todos os casos
            </Link>
          </Button>

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
