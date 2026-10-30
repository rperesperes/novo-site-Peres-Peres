import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  ArrowLeft,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  PackageCheck,
  MessageSquare,
} from 'lucide-react'

export default function InteligenciaFinanceira() {
  useEffect(() => {
    const pageTitle =
      'Inteligência Financeira e Fluxo de Caixa | PERES PERES Consultoria & Contabilidade'
    const pageDesc =
      'Modelagem de cenários, dashboards de indicadores e projeção de caixa que traduzem a apuração contábil em decisão de negócio.'

    document.title = pageTitle

    let metaDescTag = document.querySelector('meta[name="description"]')
    if (!metaDescTag) {
      metaDescTag = document.createElement('meta')
      metaDescTag.setAttribute('name', 'description')
      document.head.appendChild(metaDescTag)
    }
    metaDescTag.setAttribute('content', pageDesc)

    window.scrollTo(0, 0)
  }, [])

  const itensOQueFazemos = [
    {
      title: 'Modelagem de cenários e projeção de caixa.',
      text: 'Projeção de entradas e saídas para os próximos meses, com cenários conservador e otimista, para antecipar necessidade de capital de giro ou identificar excedente com antecedência.',
    },
    {
      title: 'Dashboards de indicadores.',
      text: 'Painéis com os indicadores que importam para a sua operação — margem bruta, ponto de equilíbrio, ticket médio, inadimplência, concentração de receita — atualizados a partir dos seus próprios dados contábeis.',
    },
    {
      title: 'Análise de margem por produto, serviço ou cliente.',
      text: 'Identificação do que efetivamente dá lucro e do que consome estrutura sem retorno, com base na alocação de custos e despesas.',
    },
    {
      title: 'Revisão de precificação.',
      text: 'Reconstrução do preço a partir do custo real, da carga tributária incidente e da margem pretendida — incluindo o efeito do regime tributário sobre cada faixa de preço.',
    },
    {
      title: 'Planejamento de distribuição de lucros.',
      text: 'Simulação do impacto tributário das diferentes formas de retirada — pró-labore, distribuição de lucros, aluguel, serviços — com base nas regras vigentes.',
    },
    {
      title: 'Acompanhamento periódico.',
      text: 'Reuniões com análise comparativa entre o projetado e o realizado, ajuste de rota e registro das decisões tomadas.',
    },
  ]

  return (
    <article className="bg-black text-white min-h-screen py-12 md:py-20 font-sans selection:bg-[#FAB319] selection:text-black">
      <div className="container mx-auto px-4 max-w-4xl space-y-12">
        {/* Trilha de navegação (Breadcrumb) */}
        <nav aria-label="Trilha de navegação">
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
                  <Link to="/servicos" className="hover:text-white transition-colors">
                    Serviços
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-neutral-600" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-white">
                  Inteligência Financeira
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </nav>

        {/* Link de volta topo */}
        <div>
          <Link
            to="/servicos"
            className="inline-flex items-center text-xs md:text-sm text-neutral-400 hover:text-[#FAB319] transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Voltar para a página de Serviços</span>
          </Link>
        </div>

        {/* == Bloco de abertura / Cabeçalho == */}
        <header className="space-y-6 border-b border-neutral-800 pb-10">
          <div className="inline-flex items-center gap-2 border border-neutral-800 bg-neutral-900/90 px-3.5 py-1.5 rounded text-xs font-mono uppercase tracking-wider text-neutral-300">
            <TrendingUp className="h-3.5 w-3.5 text-[#FAB319]" />
            Serviço Especializado • PERES PERES
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            Inteligência Financeira e Fluxo de Caixa
          </h1>
        </header>

        {/* == Seção 1 — "O problema que este serviço resolve" == */}
        <section className="space-y-4">
          <div className="border-l-4 border-[#FAB319] pl-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FAB319] block mb-1">
              Diagnóstico Estratégico
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              O problema que este serviço resolve
            </h2>
          </div>

          <div className="relative overflow-hidden rounded-2xl border-2 border-[#FAB319]/80 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black p-6 md:p-8 shadow-2xl">
            <div
              className="absolute -top-16 -right-16 w-56 h-56 bg-[#FAB319]/10 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />
            <div className="relative z-10 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#FAB319]/15 border border-[#FAB319]/40 text-[#FAB319] shrink-0 mt-0.5 shadow-sm">
                <AlertCircle className="h-6 w-6 text-[#FAB319]" />
              </div>
              <div className="space-y-3">
                <p className="text-base md:text-lg text-neutral-100 leading-relaxed font-sans">
                  A maioria das empresas descobre a falta de caixa quando ela já aconteceu.
                  Faturamento alto com margem apertada, precificação definida por intuição,
                  distribuição de lucros feita sem simulação de impacto tributário e nenhuma visão
                  de quanto realmente sobra por produto ou por cliente. O resultado aparece no
                  extrato, tarde demais para decidir.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* == Seção 2 — "O que fazemos" == */}
        <section className="space-y-6 pt-4">
          <div className="border-l-4 border-[#FAB319] pl-4">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
              Escopo de Atuação
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              O que fazemos
            </h2>
          </div>

          <div className="p-6 md:p-8 rounded-2xl border border-neutral-800 bg-neutral-900/90 space-y-5">
            <ul className="space-y-4">
              {itensOQueFazemos.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3.5 text-base md:text-lg text-neutral-200 leading-relaxed font-sans"
                >
                  <CheckCircle2 className="h-5 w-5 text-[#FAB319] shrink-0 mt-1" />
                  <div>
                    <strong className="text-white font-semibold">{item.title}</strong>{' '}
                    <span>{item.text}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* == Seção 3 — "O que você recebe" == */}
        <section className="space-y-4 pt-4">
          <div className="border-l-4 border-[#FAB319] pl-4">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
              Entregas Práticas
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              O que você recebe
            </h2>
          </div>

          <div className="p-6 md:p-8 rounded-2xl border border-neutral-800 bg-neutral-900/90 space-y-4">
            <div className="flex items-start gap-3">
              <PackageCheck className="h-6 w-6 text-[#FAB319] shrink-0 mt-1" />
              <div className="space-y-4 text-base md:text-lg text-neutral-200 leading-relaxed font-sans">
                <p>
                  Visão antecipada de caixa em vez de surpresa no extrato. Clareza sobre qual parte
                  da operação sustenta o resultado. Decisão de retirada tomada com simulação, não
                  com estimativa. E a ligação explícita, que hoje falta em quase todo escritório de
                  contabilidade: o dado contábil servindo à decisão, não apenas à obrigação
                  acessória.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* == Fechamento / Ações == */}
        <footer className="pt-8 border-t border-neutral-800 space-y-6">
          <div className="p-8 md:p-10 rounded-2xl bg-neutral-950 border border-neutral-800 text-center space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold h-12 px-8 text-base shadow-md"
              >
                <a
                  href="https://wa.me/556136861689"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Falar com o escritório</span>
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                asChild
                className="w-full sm:w-auto border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 hover:text-white h-12 px-6 text-base"
              >
                <Link to="/servicos" className="inline-flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Voltar para Serviços</span>
                </Link>
              </Button>
            </div>

            <div className="pt-2 text-xs text-neutral-500 font-mono">
              WhatsApp: (61) 3686-1689 • Atendimento Nacional 100% Online
            </div>
          </div>
        </footer>
      </div>
    </article>
  )
}
