import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useSeo } from '@/hooks/use-seo'
import {
  GraduationCap,
  Award,
  CalendarDays,
  Users2,
  BookOpen,
  Building,
  Scale,
  FileCheck,
  ShieldCheck,
  ChevronRight,
  Phone,
  ArrowRight,
} from 'lucide-react'

// 6 Desafios da Educacao (textos verbatim)
const DESAFIOS = [
  {
    title: 'Natureza da instituição e enquadramento',
    icon: GraduationCap,
    text: 'Escola de educação básica, curso livre, curso preparatório e treinamento corporativo não têm o mesmo tratamento. A classificação da atividade define a apuração, e instituição sem fins lucrativos tem regime próprio, distinto de escola com fins lucrativos.',
  },
  {
    title: 'Imunidade e certificação beneficente',
    icon: Award,
    text: 'A imunidade sobre impostos alcança instituição de educação sem fins lucrativos (art. 150, VI, "c", da Constituição Federal), desde que atendidos os requisitos constitucionais e legais, e não se estende a escola com fins lucrativos. Entidade beneficente que atua em educação tem certificação própria, que exige manutenção e comprovação contínua.',
  },
  {
    title: 'Sazonalidade e receita antecipada',
    icon: CalendarDays,
    text: 'Matrícula anual, semestralidade, pacote de curso e contrato de treinamento têm momento de reconhecimento de receita distinto do momento do caixa. Receber antes de prestar o serviço exige controle de receita antecipada, e é aqui que a escola perde a leitura correta do próprio resultado.',
  },
  {
    title: 'Folha docente e corpo técnico',
    icon: Users2,
    text: 'Professores CLT, professor horista, instrutor MEI e prestador PJ convivem na mesma escola, com tratamentos previdenciários e trabalhistas diferentes. A fronteira com vínculo empregatício é fonte constante de risco, e depende do modelo de contratação e da forma de execução.',
  },
  {
    title: 'Material didático, plataformas e conteúdo digital',
    icon: BookOpen,
    text: 'Compra de material, licença de plataforma, tecnologia educacional e produção de conteúdo próprio têm tratamento fiscal que depende de como a operação está estruturada. Classificar tudo como material de consumo é erro recorrente e custa caro em apuração.',
  },
  {
    title: 'Filiais, franquias e polos',
    icon: Building,
    text: 'Cada unidade adicional traz obrigações cadastrais, fiscais e trabalhistas próprias. A estrutura societária precisa separar risco entre unidades e permitir leitura de resultado por polo, sem transformar a expansão em passivo.',
  },
]

// 5 Frentes de Atuacao (textos verbatim na ordem exata: Tributaria, Contabil, Societaria, Financeira e de Gestao, Trabalhista)
const FRENTES_ATUACAO = [
  {
    frente: 'Tributária',
    destaque: true,
    badge: 'Nossa especialidade',
    text: 'definição do enquadramento tributário conforme a natureza da instituição, análise de requisitos de imunidade ou de certificação beneficente quando aplicável, e classificação correta dos serviços educacionais na apuração.',
  },
  {
    frente: 'Contábil',
    destaque: false,
    text: 'escrituração com controle de receita antecipada e de contrato de matrícula, além de demonstrações que reflitam o ciclo real do ano letivo e não apenas o caixa recebido.',
  },
  {
    frente: 'Societária',
    destaque: false,
    text: 'estruturação da instituição e das unidades, incluindo filiais, franquias e polos, com cláusulas contratuais adequadas ao modelo de expansão adotado.',
  },
  {
    frente: 'Financeira e de Gestão',
    destaque: false,
    text: 'orçamento anual alinhado ao calendário de matrícula, projeção de caixa por período letivo e leitura de margem por turma, por curso e por unidade.',
  },
  {
    frente: 'Trabalhista',
    destaque: false,
    text: 'organização da contratação de professores e instrutores, conformidade no eSocial e revisão de riscos de vínculo nos modelos de contratação de corpo docente.',
  },
]

// 3 Razoes Por Que a PERES PERES (textos verbatim)
const POR_QUE_PERES_PERES = [
  {
    num: '1',
    title: 'Responsável técnico com dupla formação',
    icon: Scale,
    text: 'Rafael Peres Peres Nunes Altoé é contador (CRC 027704), advogado (OAB 87656), auditor (CNAI 10122) e professor. Quem ensina entende a rotina de quem ensina, e a estrutura da instituição envolve decisão societária e decisão tributária na mesma operação.',
  },
  {
    num: '2',
    title: 'Capacidade de produzir prova técnica',
    icon: FileCheck,
    text: 'A equipe conta com perita contábil formada em perícia judicial e em cálculos trabalhistas. Em discussão sobre natureza de contratação de docente ou sobre composição de receita, a produção técnica é interna.',
  },
  {
    num: '3',
    title: 'Postura conservadora',
    icon: ShieldCheck,
    text: 'Não veiculamos promessa de percentual de economia. Cada diagnóstico parte de auditoria documental dos números da instituição, e quando determinada tese não se sustenta, dizemos que não se sustenta.',
  },
]

// 5 Perguntas e Respostas do FAQ (textos verbatim)
const FAQ_ITEMS = [
  {
    question: 'Escola e curso livre são tributados da mesma forma?',
    answer:
      'Não. A natureza da instituição muda o tratamento. Escola com fins lucrativos é contribuinte normal e pode ser optante do Simples Nacional, conforme a atividade. Instituição de educação sem fins lucrativos pode alcançar a imunidade sobre impostos prevista no art. 150, VI, "c", da Constituição Federal, desde que atenda aos requisitos constitucionais e legais. Curso livre com fins lucrativos não tem imunidade.',
  },
  {
    question: 'Escola sem fins lucrativos é sempre imune?',
    answer:
      'Não. A imunidade depende do atendimento dos requisitos constitucionais e legais, e precisa ser comprovada e mantida. Entidade beneficente de assistência social que atua em educação tem, adicionalmente, certificação própria com exigências contínuas.',
  },
  {
    question: 'Como tratar instrutores contratados como MEI?',
    answer:
      'Depende de como a contratação acontece na prática. MEI é figura com limites de faturamento e de atividade, e a contratação de instrutor com pessoalidade, habitualidade e subordinação cria risco de reconhecimento de vínculo, independentemente do documento assinado. O desenho do contrato e a rotina de execução precisam ser compatíveis.',
  },
  {
    question: 'Como organizar o caixa de uma escola com sazonalidade de matrícula?',
    answer:
      'Separando o que é receita recebida do que é receita ainda não prestada. Matrícula anual paga em parcelas, semestralidade e pacote de curso precisam de controle de receita antecipada, com orçamento anual alinhado ao calendário letivo e projeção de caixa por período, não apenas pelo mês corrente.',
  },
  {
    question: 'Como estruturar filiais, franquias ou polos?',
    answer:
      'Cada unidade tem obrigações cadastrais, fiscais e trabalhistas próprias, e a estrutura societária precisa refletir o modelo escolhido. A decisão entre filial, unidade própria em sociedade separada, franquia ou polo credenciado tem efeito fiscal, trabalhista e de responsabilidade, e deve ser tomada antes da abertura.',
  },
]

// Demais segmentos atendidos pelo escritorio
const OUTROS_SEGMENTOS = [
  { name: 'Clínicas Médicas e Saúde', link: '/contabilidade-para-clinicas-medicas' },
  { name: 'Startups e Empresas de Tecnologia', link: '/contabilidade-para-startups-e-tech' },
  { name: 'Holdings Familiares e Patrimoniais', link: '/holdings-familiares-e-patrimoniais' },
  { name: 'Publicidade e Comunicação', link: '/contabilidade-para-agencias-de-publicidade' },
  { name: 'Profissões Regulamentadas', link: '/servicos#segmentos' },
  { name: 'Agências de Viagem', link: '/servicos#segmentos' },
  { name: 'E-commerces', link: '/servicos#segmentos' },
  { name: 'MEIs e Profissionais Liberais', link: '/servicos#segmentos' },
]

export default function EducacaoTreinamentosSegment() {
  useSeo({
    title: 'Contabilidade para Escolas e Cursos | Consultoria em Brasília | PERES PERES',
    description:
      'Contabilidade e consultoria para escolas, cursos e negócios de educação: enquadramento, imunidade, sazonalidade de matrícula e folha docente. Atendimento em Brasília e no Brasil.',
    canonical: 'https://peresperes.com.br/contabilidade-para-educacao-e-treinamentos',
  })

  // JSON-LD para Rich Snippet FAQPage e BreadcrumbList
  useEffect(() => {
    const scriptId = 'faq-jsonld-educacao-treinamentos'
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null
    if (!scriptTag) {
      scriptTag = document.createElement('script')
      scriptTag.id = scriptId
      scriptTag.type = 'application/ld+json'
      document.head.appendChild(scriptTag)
    }

    const structuredData = {
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
              name: 'Segmentos',
              item: 'https://peresperes.com.br/servicos',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Educação e Treinamentos',
              item: 'https://peresperes.com.br/contabilidade-para-educacao-e-treinamentos',
            },
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: FAQ_ITEMS.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        },
      ],
    }

    scriptTag.textContent = JSON.stringify(structuredData)

    return () => {
      const el = document.getElementById(scriptId)
      if (el) {
        el.remove()
      }
    }
  }, [])

  return (
    <div className="flex flex-col w-full font-sans bg-white">
      {/* =========================================================
          BREADCRUMB & HERO
         ========================================================= */}
      <section className="relative bg-black text-white border-b border-neutral-800 pt-8 pb-16 md:pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs md:text-sm text-neutral-400 mb-8 font-sans"
          >
            <Link to="/" className="hover:text-white transition-colors">
              Início
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-600" />
            <Link to="/servicos" className="hover:text-white transition-colors">
              Segmentos
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-600" />
            <span className="text-[#FAB319] font-medium">Educação e Treinamentos</span>
          </nav>

          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 border border-neutral-700 bg-neutral-900/60 px-3 py-1 rounded text-xs tracking-wider uppercase text-neutral-300 font-sans">
              <GraduationCap className="h-3.5 w-3.5 text-[#FAB319]" />
              Segmento Especializado
            </div>

            {/* H1 obrigatorio */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white leading-tight max-w-4xl">
              Contabilidade e consultoria para escolas, cursos e negócios de educação
            </h1>

            {/* Paragrafo de abertura verbatim */}
            <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-3xl leading-relaxed font-sans">
              Escolas, cursos e negócios de treinamento operam com sazonalidade de matrícula, folha
              de corpo docente e contratos de prestação de serviço educacional, e cada um desses
              elementos tem reflexo tributário e trabalhista próprio. A PERES PERES atende esse
              segmento com contabilidade mensal organizada e consultoria aplicada à rotina da
              instituição, do enquadramento à estruturação de unidades.
            </p>

            {/* Chamada para acao no Hero */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                size="lg"
                className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-base h-12 px-8 border-none font-sans"
                asChild
              >
                <Link to="/contato">Agendar reunião</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-neutral-700 bg-transparent text-white hover:bg-neutral-900 hover:text-white font-medium text-base h-12 px-8 font-sans"
                asChild
              >
                <Link to="/servicos">Ver planos de acompanhamento</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BANNER INFORMATIVO DE TRANSICAO
         ========================================================= */}
      <section className="bg-neutral-50 border-b border-neutral-200 py-4">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-neutral-700 font-sans">
            <span className="font-medium text-neutral-900">
              Precisa avaliar enquadramento tributário, imunidade ou contratação de corpo docente?
              Converse diretamente com nossos especialistas.
            </span>
            <Link
              to="/contato"
              className="inline-flex items-center gap-1.5 font-semibold text-black hover:text-neutral-700 underline decoration-[#FAB319] decoration-2 underline-offset-4 shrink-0"
            >
              Falar com especialista
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECAO 1: DESAFIOS DA EDUCACAO (6 cards)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Peculiaridades do setor
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Desafios da educação
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              A rotina de escolas e cursos combina sazonalidade de caixa, multiplicidade de vínculos
              de instrutores e regras tributárias específicas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {DESAFIOS.map((item, idx) => {
              const Icon = item.icon
              return (
                <Card
                  key={idx}
                  className="border border-neutral-200 shadow-sm hover:border-neutral-300 transition-colors bg-white flex flex-col h-full p-6"
                >
                  <div className="h-10 w-10 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-4 shrink-0">
                    <Icon className="h-5 w-5 text-black" />
                  </div>
                  <h3 className="text-lg font-sans font-bold text-black leading-snug mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed font-sans">{item.text}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECAO 2: COMO ATUAMOS NA EDUCACAO (5 itens)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Estrutura de atendimento
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Como atuamos na educação
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              O acompanhamento contábil mensal integra cinco frentes complementares, com foco na
              rotina pedagógica, administrativa e societária da instituição.
            </p>
          </div>

          <div className="space-y-6">
            {/* Frente 1: Consultoria Tributaria em Destaque */}
            {FRENTES_ATUACAO.filter((f) => f.destaque).map((frente, idx) => (
              <div
                key={idx}
                className="border-2 border-black rounded-xl p-6 md:p-8 bg-white shadow-sm relative"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <Badge className="bg-[#FAB319] text-black hover:bg-[#FAB319] font-sans font-semibold text-xs px-3 py-1 uppercase tracking-wider">
                    {frente.badge}
                  </Badge>
                  <span className="text-xs text-neutral-500 font-sans font-medium uppercase tracking-wider">
                    Eixo principal
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-sans font-bold text-black mb-3">
                  {frente.frente}
                </h3>

                <p className="text-neutral-700 text-base md:text-lg leading-relaxed font-sans">
                  {frente.text}
                </p>
              </div>
            ))}

            {/* Frentes 2, 3, 4 e 5: Cards em Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {FRENTES_ATUACAO.filter((f) => !f.destaque).map((frente, idx) => (
                <div
                  key={idx}
                  className="border border-neutral-200 rounded-xl p-6 bg-white hover:border-neutral-300 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-sans font-bold text-black mb-3">{frente.frente}</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                      {frente.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Link para planos */}
          <div className="mt-8 text-center sm:text-left">
            <Link
              to="/servicos"
              className="inline-flex items-center text-sm font-semibold text-black hover:text-neutral-700 underline decoration-[#FAB319] decoration-2 underline-offset-4 font-sans"
            >
              Ver planos de acompanhamento →
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECAO 3: POR QUE A PERES PERES (3 itens)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Diferenciais técnicos
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Por que a PERES PERES
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              Critério, formação multidisciplinar e segurança técnica para decisões societárias,
              trabalhistas e fiscais da instituição educacional.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {POR_QUE_PERES_PERES.map((item, idx) => {
              const Icon = item.icon
              return (
                <Card
                  key={idx}
                  className="border border-neutral-200 shadow-sm hover:border-neutral-300 transition-colors bg-white flex flex-col h-full p-6 justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-10 w-10 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-black" />
                      </div>
                      <span className="font-mono text-xs font-bold text-neutral-400">
                        0{item.num}
                      </span>
                    </div>
                    <h3 className="text-lg font-sans font-bold text-black leading-snug mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                      {item.text}
                    </p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECAO 4: FAQ (5 perguntas e respostas com rich snippet)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block font-sans">
              Perguntas frequentes
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Dúvidas recorrentes sobre contabilidade para escolas e cursos
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {FAQ_ITEMS.map((item, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="bg-white border border-neutral-200 rounded-lg px-6 py-1 data-[state=open]:border-neutral-300 shadow-sm"
              >
                <AccordionTrigger className="text-left font-sans font-semibold text-base sm:text-lg text-black hover:no-underline py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="font-sans text-sm sm:text-base text-neutral-700 leading-relaxed pb-4 pt-1">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* =========================================================
          SECAO 5: OUTROS SEGMENTOS ATENDIDOS
         ========================================================= */}
      <section className="py-12 md:py-16 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-8 space-y-2">
            <h3 className="text-2xl md:text-3xl font-sans font-bold text-black leading-tight">
              Conheça os outros segmentos
            </h3>
            <p className="text-neutral-600 text-sm md:text-base leading-relaxed font-sans">
              Além de educação e treinamentos, a PERES PERES oferece contabilidade e consultoria
              especializada para diferentes nichos e modelos de negócio:
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {OUTROS_SEGMENTOS.map((seg, idx) => (
              <Link
                key={idx}
                to={seg.link}
                className="bg-neutral-50 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-100/70 rounded-lg p-3.5 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#FAB319] shrink-0" />
                  <span className="text-sm font-sans font-medium text-neutral-900 leading-snug">
                    {seg.name}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-black transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECAO 6: CTA FINAL
         ========================================================= */}
      <section className="py-14 md:py-20 bg-neutral-950 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-white leading-tight">
            Conhecer o escritório custa uma conversa.
          </h2>

          <p className="text-base md:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed font-sans">
            A primeira reunião serve para a gente olhar o seu caso e dizer o que enxerga.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-base h-12 px-8 border-none font-sans"
              asChild
            >
              <Link to="/contato">Agendar reunião</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white font-medium text-base h-12 px-8 font-sans"
              asChild
            >
              <a href="https://wa.me/556136861689" target="_blank" rel="noopener noreferrer">
                <Phone className="mr-2 h-4 w-4" />
                WhatsApp (61) 3686-1689
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
