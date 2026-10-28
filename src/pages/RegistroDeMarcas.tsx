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
  Award,
  Layers,
  MessageSquare,
  Clock,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react'

export default function RegistroDeMarcas() {
  useEffect(() => {
    const pageTitle =
      'Registro e Acompanhamento de Marcas | PERES PERES Consultoria e Contabilidade'
    const pageDesc =
      'Pedido e acompanhamento do registro da sua marca junto ao INPI (Instituto Nacional da Propriedade Industrial), desde o protocolo até a concessão do registro definitivo.'

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
                  Registro de Marcas
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
            <Award className="h-3.5 w-3.5 text-[#FAB319]" />
            Serviço Especializado • PERES PERES
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            Registro e Acompanhamento de Marcas
          </h1>
        </header>

        {/* == Seção 1: O risco de deixar para depois == */}
        <section className="space-y-4">
          <div className="border-l-4 border-[#FAB319] pl-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FAB319] block mb-1">
              Prioridade Legal
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              O risco de deixar para depois
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
                  Você criou a marca, investiu no desenvolvimento e na divulgação. Enquanto o
                  registro não for protocolado, qualquer pessoa que iniciar o processo primeiro tem
                  preferência sobre ela. O direito de preferência no INPI se define pela data do
                  protocolo, não pela data em que a marca começou a ser usada. É por isso que esse
                  serviço tem uma característica diferente dos demais: o tempo trabalha contra.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* == Seção 2: O que está incluído == */}
        <section className="space-y-4 pt-4">
          <div className="border-l-4 border-[#FAB319] pl-4">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
              Escopo do Serviço
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              O que está incluído
            </h2>
          </div>

          <div className="p-6 md:p-8 rounded-2xl border border-neutral-800 bg-neutral-900/90 space-y-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 text-[#FAB319] shrink-0 mt-1" />
              <div className="space-y-4 text-base md:text-lg text-neutral-200 leading-relaxed font-sans">
                <p>
                  Pedido e acompanhamento do registro da sua marca junto ao INPI (Instituto Nacional
                  da Propriedade Industrial), desde o protocolo até a concessão do registro
                  definitivo.
                </p>
                <p>
                  Já estão incluídas as taxas oficiais cobradas pelo INPI referentes ao pedido e ao
                  primeiro decênio — os primeiros 10 anos de vigência da marca registrada.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* == Seção 3: Sobre a quantidade de classes == */}
        <section className="space-y-4 pt-4">
          <div className="border-l-4 border-[#FAB319] pl-4">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
              Proteção por Segmento
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Sobre a quantidade de classes
            </h2>
          </div>

          <div className="p-6 md:p-8 rounded-2xl border border-neutral-800 bg-neutral-900/90 space-y-4">
            <div className="flex items-start gap-3">
              <Layers className="h-6 w-6 text-[#FAB319] shrink-0 mt-1" />
              <div className="space-y-4 text-base md:text-lg text-neutral-200 leading-relaxed font-sans">
                <p>
                  Cada pedido de registro protege a marca em uma classe de atividade. Uma empresa
                  que atua em mais de um segmento precisa de mais de uma classe para ter a marca
                  protegida em todas as suas frentes. Os valores informados referem-se ao registro
                  em uma classe, e a quantidade desejada é selecionada no momento da contratação.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* == Seção 4: Sobre o prazo == */}
        <section className="space-y-4 pt-4">
          <div className="border-l-4 border-[#FAB319] pl-4">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
              Prazos e Tramitação
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Sobre o prazo
            </h2>
          </div>

          <div className="p-6 md:p-8 rounded-2xl border border-neutral-800 bg-neutral-900/90 space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="h-6 w-6 text-[#FAB319] shrink-0 mt-1" />
              <div className="space-y-4 text-base md:text-lg text-neutral-200 leading-relaxed font-sans">
                <p>
                  O processo é conduzido pelo INPI e tem etapas próprias, incluindo exame formal,
                  publicação para oposição de terceiros e exame de mérito. O prazo de concessão
                  depende do instituto, não do escritório — e acompanhamos cada uma dessas fases
                  para que você não perca prazo de resposta.
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
