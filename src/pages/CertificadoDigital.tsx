import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  HardDrive,
  KeyRound,
  MessageSquare,
  ShieldCheck,
  Video,
} from 'lucide-react'

export default function CertificadoDigital() {
  useEffect(() => {
    const pageTitle = 'Certificado Digital | PERES PERES Consultoria e Contabilidade'
    const pageDesc =
      'O certificado digital é uma ferramenta que permite assinar documentos, procurações e contratos de forma digital com validade jurídica, emitir notas fiscais, e acessar os principais sistemas do governo.'

    document.title = pageTitle

    let metaDescTag = document.querySelector('meta[name="description"]')
    if (!metaDescTag) {
      metaDescTag = document.createElement('meta')
      metaDescTag.setAttribute('name', 'description')
      document.head.appendChild(metaDescTag)
    }
    metaDescTag.setAttribute('content', pageDesc)

    // Scroll para o topo na montagem
    window.scrollTo(0, 0)
  }, [])

  const steps = [
    {
      num: '01',
      title: 'Confirmação e Contato',
      description:
        'Em até 1 dia útil após a confirmação do pagamento, entramos em contato por WhatsApp ou telefone para agendar a videochamada de emissão.',
    },
    {
      num: '02',
      title: 'Agendamento Rápido',
      description: 'Em muitos casos, o agendamento sai para o dia útil seguinte ao pagamento.',
    },
    {
      num: '03',
      title: 'Videochamada e Disponibilização',
      description:
        'Se tudo transcorrer normalmente, o certificado já pode ser utilizado no mesmo dia da videochamada.',
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
                  Certificado Digital
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

        {/* == Bloco de abertura == */}
        <header className="space-y-6 border-b border-neutral-800 pb-10">
          <div className="inline-flex items-center gap-2 border border-neutral-800 bg-neutral-900/90 px-3.5 py-1.5 rounded text-xs font-mono uppercase tracking-wider text-neutral-300">
            <KeyRound className="h-3.5 w-3.5 text-[#FAB319]" />
            Serviço Especializado • PERES PERES
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            CERTIFICADO DIGITAL
          </h1>

          <p className="text-base md:text-xl text-neutral-300 leading-relaxed font-sans max-w-3xl">
            O certificado digital é uma ferramenta que permite assinar documentos, procurações e
            contratos de forma digital com validade jurídica, emitir notas fiscais, e acessar os
            principais sistemas do governo com mais recursos e menos burocracia.
          </p>
        </header>

        {/* == Subtítulo: "Antes de escolher, confira se você pode emitir de forma online" == */}
        <section className="space-y-4">
          <div className="border-l-4 border-[#FAB319] pl-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FAB319] block mb-1">
              Requisitos Obrigatórios
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Antes de escolher, confira se você pode emitir de forma online
            </h2>
          </div>

          {/* Bloco de destaque visualmente diferenciado */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-[#FAB319]/80 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black p-6 md:p-8 shadow-2xl">
            {/* Brilho acetinado de fundo decorativo com a cor institucional #FAB319 */}
            <div
              className="absolute -top-16 -right-16 w-56 h-56 bg-[#FAB319]/10 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />
            <div className="relative z-10 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#FAB319]/15 border border-[#FAB319]/40 text-[#FAB319] shrink-0 mt-0.5 shadow-sm">
                <AlertTriangle className="h-6 w-6 text-[#FAB319]" />
              </div>
              <div className="space-y-2">
                <span className="inline-block text-xs font-mono font-bold uppercase tracking-wider text-[#FAB319] bg-black/60 px-2.5 py-1 rounded border border-[#FAB319]/30">
                  Advertência Importante
                </span>
                <p className="text-base md:text-lg text-neutral-100 leading-relaxed font-sans">
                  Nossos certificados são emitidos 100% a distância, sem atendimento presencial. Por
                  isso, é obrigatório ter CNH (Carteira Nacional de Habilitação) ou ter emitido
                  outro certificado digital nos últimos 2 anos. Sem um desses requisitos, a emissão
                  online não pode ser concluída.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* == Subtítulo: "Qual modelo escolher" == */}
        <section className="space-y-6 pt-4">
          <div className="border-l-4 border-[#FAB319] pl-4">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
              Modelos Disponíveis
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Qual modelo escolher
            </h2>
          </div>

          {/* Grid de 2 cartões lado a lado responsivo */}
          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {/* Cartão 1 — A1 */}
            <Card className="flex flex-col justify-between border border-neutral-800 bg-neutral-900/90 text-white rounded-xl shadow-lg hover:border-neutral-700 transition-colors">
              <div>
                <CardHeader className="p-6 md:p-8 pb-4 border-b border-neutral-800">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider bg-[#FAB319] text-black px-2.5 py-1 rounded">
                      Modelo A1
                    </span>
                    <HardDrive className="h-5 w-5 text-[#FAB319]" />
                  </div>
                  <CardTitle className="text-xl md:text-2xl font-bold text-white leading-snug">
                    A1 — arquivo no seu computador
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8 pt-6 space-y-4">
                  <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
                    O certificado é um arquivo digital que você baixa e guarda onde quiser. Quem
                    tiver o arquivo e a senha pode usar o certificado. Validade de 1 ano.
                    Recomendamos guardar uma cópia em Google Drive, OneDrive ou Dropbox — perdido o
                    arquivo, é necessário adquirir um novo certificado.
                  </p>
                </CardContent>
              </div>
              <div className="p-6 md:p-8 pt-0">
                <div className="rounded-lg bg-neutral-950/80 border border-neutral-800 p-3 text-xs text-neutral-400 flex items-center justify-between">
                  <span className="font-mono">Validade:</span>
                  <span className="text-white font-semibold font-mono">1 ano</span>
                </div>
              </div>
            </Card>

            {/* Cartão 2 — A3 */}
            <Card className="flex flex-col justify-between border border-neutral-800 bg-neutral-900/90 text-white rounded-xl shadow-lg hover:border-neutral-700 transition-colors">
              <div>
                <CardHeader className="p-6 md:p-8 pb-4 border-b border-neutral-800">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider bg-neutral-800 text-neutral-200 border border-neutral-700 px-2.5 py-1 rounded">
                      Modelo A3
                    </span>
                    <KeyRound className="h-5 w-5 text-[#FAB319]" />
                  </div>
                  <CardTitle className="text-xl md:text-2xl font-bold text-white leading-snug">
                    A3 — token ou pendrive
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8 pt-6 space-y-4">
                  <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
                    O certificado fica armazenado em uma mídia física, e só pode ser usado por quem
                    estiver com o token conectado ao computador. Validade de até 3 anos —
                    trabalhamos com a configuração de melhor custo-benefício, que é a de 3 anos.
                  </p>
                </CardContent>
              </div>
              <div className="p-6 md:p-8 pt-0">
                <div className="rounded-lg bg-neutral-950/80 border border-neutral-800 p-3 text-xs text-neutral-400 flex items-center justify-between">
                  <span className="font-mono">Validade:</span>
                  <span className="text-white font-semibold font-mono">
                    Até 3 anos (melhor custo-benefício)
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* == Subtítulo: "Como funciona a emissão" == */}
        <section className="space-y-6 pt-4">
          <div className="border-l-4 border-[#FAB319] pl-4">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
              Etapas do Processo
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Como funciona a emissão
            </h2>
          </div>

          <div className="p-6 md:p-8 rounded-2xl border border-neutral-800 bg-neutral-900/70 space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              {steps.map((st) => (
                <div
                  key={st.num}
                  className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#FAB319] bg-black px-2.5 py-1 rounded border border-[#FAB319]/30">
                        ETAPA {st.num}
                      </span>
                      {st.num === '01' && <MessageSquare className="h-4 w-4 text-neutral-400" />}
                      {st.num === '02' && <ChevronRight className="h-4 w-4 text-neutral-400" />}
                      {st.num === '03' && <Video className="h-4 w-4 text-neutral-400" />}
                    </div>
                    <h3 className="text-base font-semibold text-white">{st.title}</h3>
                    <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                      {st.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Frase final de acompanhamento */}
            <div className="pt-6 border-t border-neutral-800/80 flex items-center gap-3 text-neutral-200">
              <ShieldCheck className="h-5 w-5 text-[#FAB319] shrink-0" />
              <p className="text-sm md:text-base font-medium text-white">
                Acompanhamos cada etapa do processo, do pagamento à instalação.
              </p>
            </div>
          </div>
        </section>

        {/* == Fechamento == */}
        <footer className="pt-8 border-t border-neutral-800 space-y-6">
          <div className="p-8 md:p-10 rounded-2xl bg-neutral-950 border border-neutral-800 text-center space-y-6 shadow-xl">
            <div className="space-y-2 max-w-xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Pronto para emitir o seu certificado?
              </h3>
              <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
                Fale diretamente com nossa equipe para tirar dúvidas sobre o modelo ideal e iniciar
                a emissão online com segurança.
              </p>
            </div>

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
