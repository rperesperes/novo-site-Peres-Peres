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
  Megaphone,
  Receipt,
  FileSpreadsheet,
  Users2,
  Calculator,
  FileSignature,
  UserX,
  Scale,
  FileCheck,
  ShieldCheck,
  ChevronRight,
  Phone,
  ArrowRight,
} from 'lucide-react'

// 6 Desafios da Publicidade e Comunicacao (textos verbatim)
const DESAFIOS = [
  {
    title: 'Verba de mídia e comissão',
    icon: Receipt,
    text: 'O repasse de mídia e a comissão da agência são coisas diferentes na operação e precisam ser coisas diferentes na escrituração. Misturar os dois infla a base de cálculo do imposto e esconde a margem real do job, porque a agência passa a apurar tributo sobre valor que nunca foi dela.',
  },
  {
    title: 'Retenções na cadeia de prestadores',
    icon: FileSpreadsheet,
    text: 'O setor de comunicação tem regras próprias de retenção previdenciária sobre serviços terceirizados, e elas mexem diretamente no fluxo de caixa de cada job. Deixar de reter quando deve, ou reter sobre o que não deveria, gera contingência nos dois sentidos.',
  },
  {
    title: 'Freelancers, produtoras e creators',
    icon: Users2,
    text: 'O volume de pagamentos a redatores, diretores de arte, produtoras, influenciadores e creators exige disciplina de contratos, notas e retenções que a maioria das agências não tem. A ausência de documento correto em prestador é um dos maiores geradores de passivo do setor.',
  },
  {
    title: 'Precificação do job',
    icon: Calculator,
    text: 'Formar preço com tributo embutido, imposto retido pelo cliente e comissão definida é conta que precisa ser feita antes da proposta, não no fechamento do mês. Job precificado sem tributo é margem que o job nunca teve.',
  },
  {
    title: 'Contratos com clientes e com mídia',
    icon: FileSignature,
    text: 'Contratos de agenciamento, de veiculação e de repasse têm naturezas distintas e efeitos fiscais distintos. O contrato que a agência assina define o que é receita própria e o que é mero repasse, e essa definição precisa estar alinhada entre jurídico, comercial e contábil.',
  },
  {
    title: 'Societário entre sócios criativos',
    icon: UserX,
    text: 'A saída de um sócio em agência envolve carteira de clientes, marca, portfólio e continuidade do atendimento. São temas que o contrato social precisa prever antes da crise, porque depois que o sócio anunciou a saída, o poder de negociação muda de lado.',
  },
]

// 5 Frentes de Atuacao (textos verbatim na ordem exata: Tributaria, Contabil, Societaria, Financeira e de Gestao, Trabalhista)
const FRENTES_ATUACAO = [
  {
    frente: 'Tributária',
    destaque: true,
    badge: 'Nossa especialidade',
    text: 'separação correta entre verba de mídia e comissão na apuração, revisão das retenções sobre a cadeia de prestadores e acompanhamento da Reforma Tributária aplicada ao setor de comunicação.',
  },
  {
    frente: 'Contábil',
    destaque: false,
    text: 'escrituração que reflita a realidade de cada job, com conciliação entre orçamento aprovado, nota emitida, mídia repassada e caixa recebido, além de demonstrações que mostrem a margem real por cliente.',
  },
  {
    frente: 'Societária',
    destaque: false,
    text: 'estruturação societária da agência, contrato social com regras de saída de sócio, tratamento da carteira de clientes e da marca, e estruturação de novas frentes de negócio.',
  },
  {
    frente: 'Financeira e de Gestão',
    destaque: false,
    text: 'precificação de job com tributo na conta, leitura de margem por cliente e por campanha, e controle do fluxo de caixa diante do prazo entre veiculação, aprovação e pagamento.',
  },
  {
    frente: 'Trabalhista',
    destaque: false,
    text: 'organização da contratação de equipe interna e de rede de prestadores, revisão de riscos de vínculo com freelancers e creators, e conformidade no eSocial.',
  },
]

// 3 Razoes Por Que a PERES PERES (textos verbatim)
const POR_QUE_PERES_PERES = [
  {
    num: '1',
    title: 'Responsável técnico com dupla formação',
    icon: Scale,
    text: 'Rafael Peres Peres Nunes Altoé é contador (CRC 027704), advogado (OAB 87656), auditor (CNAI 10122) e professor. Contrato de mídia, risco trabalhista de freelancer e enquadramento tributário são lidos juntos, na mesma mesa.',
  },
  {
    num: '2',
    title: 'Capacidade de produzir prova técnica',
    icon: FileCheck,
    text: 'A equipe conta com perita contábil formada em perícia judicial e em cálculos trabalhistas. Em discussão sobre retenções, contratos de prestação ou passivo da cadeia criativa, a produção técnica é interna.',
  },
  {
    num: '3',
    title: 'Postura conservadora',
    icon: ShieldCheck,
    text: 'Não veiculamos promessa de percentual de economia. Cada diagnóstico parte de auditoria documental dos números da agência, e quando o enquadramento atual já é o correto, dizemos que é.',
  },
]

// 5 Perguntas e Respostas do FAQ (textos verbatim)
const FAQ_ITEMS = [
  {
    question: 'A agência tributa sobre a verba de mídia ou só sobre a comissão?',
    answer:
      'Depende de como a operação está estruturada: quem é a parte no contrato com o veículo, quem fatura e em que condição o repasse acontece. Contrato mal desenhado faz a agência apurar imposto sobre valor que é repasse, e isso é corrigível com ajuste de contrato e de parametrização, desde que feito de forma organizada.',
  },
  {
    question: 'A agência precisa reter INSS dos prestadores? Sobre o quê?',
    answer:
      'O setor de comunicação tem regras próprias de retenção previdenciária sobre serviços terceirizados, e a resposta depende da atividade do prestador, do CNAE da agência e da forma do contrato. É um dos pontos que mais geram autuação no setor, e precisa de rotina mensal organizada, não de improviso.',
  },
  {
    question: 'Como precificar o job sem perder margem tributária?',
    answer:
      'Incluindo o tributo na composição do preço desde a proposta, considerando a retenção que o cliente vai fazer, a comissão da agência e o custo dos prestadores. Preço formado só sobre custo criativo esconde um imposto que vai sair do caixa no fechamento.',
  },
  {
    question: 'Contratar influenciador e creator tem risco trabalhista?',
    answer:
      'Tem, quando a relação na prática tem pessoalidade, habitualidade e subordinação, mesmo com contrato de prestação de serviços assinado. O desenho do contrato e a rotina de execução precisam ser compatíveis com o que se pretende formalizar.',
  },
  {
    question: 'Vocês atendem agências fora de Brasília?',
    answer:
      'Sim. A sede é em Brasília/DF, com atendimento em todo o Brasil, de forma presencial ou remota.',
  },
]

// Demais segmentos atendidos pelo escritorio
const OUTROS_SEGMENTOS = [
  { name: 'Clínicas Médicas e Saúde', link: '/contabilidade-para-clinicas-medicas' },
  { name: 'Startups e Empresas de Tecnologia', link: '/contabilidade-para-startups-e-tech' },
  { name: 'Holdings Familiares e Patrimoniais', link: '/holdings-familiares-e-patrimoniais' },
  { name: 'Educação e Treinamentos', link: '/contabilidade-para-educacao-e-treinamentos' },
  { name: 'Profissões Regulamentadas', link: '/servicos#segmentos' },
  { name: 'Agências de Viagem', link: '/servicos#segmentos' },
  { name: 'E-commerces', link: '/servicos#segmentos' },
  { name: 'MEIs e Profissionais Liberais', link: '/servicos#segmentos' },
]

export default function PublicidadeComunicacaoSegment() {
  useSeo({
    title: 'Contabilidade para Agências de Publicidade | Consultoria em Brasília | PERES PERES',
    description:
      'Contabilidade e consultoria para agências de publicidade e comunicação: mídia, comissão, retenções da cadeia criativa e margem do job. Atendimento em Brasília e no Brasil.',
    canonical: 'https://peresperes.com.br/contabilidade-para-agencias-de-publicidade',
  })

  // JSON-LD para Rich Snippet FAQPage e BreadcrumbList
  useEffect(() => {
    const scriptId = 'faq-jsonld-publicidade-comunicacao'
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
              name: 'Publicidade e Comunicação',
              item: 'https://peresperes.com.br/contabilidade-para-agencias-de-publicidade',
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
            <span className="text-[#FAB319] font-medium">Publicidade e Comunicação</span>
          </nav>

          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 border border-neutral-700 bg-neutral-900/60 px-3 py-1 rounded text-xs tracking-wider uppercase text-neutral-300 font-sans">
              <Megaphone className="h-3.5 w-3.5 text-[#FAB319]" />
              Segmento Especializado
            </div>

            {/* H1 obrigatorio */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white leading-tight max-w-4xl">
              Contabilidade e consultoria para agências de publicidade e comunicação
            </h1>

            {/* Paragrafo de abertura verbatim */}
            <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-3xl leading-relaxed font-sans">
              Agências de publicidade e empresas de comunicação trabalham com repasse de mídia,
              comissão, retenções específicas e uma cadeia de prestadores criativos. É um modelo em
              que a escrituração mal parametrizada distorce tanto o imposto quanto a margem real de
              cada job. A PERES PERES atende esse segmento com contabilidade mensal organizada e
              consultoria aplicada à rotina da agência, da proposta ao fechamento.
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
              Precisa avaliar repasse de mídia, retenções da cadeia criativa ou precificação de
              jobs? Converse diretamente com nossos especialistas.
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
          SECAO 1: DESAFIOS DA PUBLICIDADE E COMUNICACAO (6 cards)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Peculiaridades do setor
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Desafios da publicidade e comunicação
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              A rotina de agências e produtoras combina repasse de mídia, contratação de múltiplos
              prestadores criativos e regras tributárias específicas.
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
          SECAO 2: COMO ATUAMOS NA AGÊNCIA (5 itens)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Estrutura de atendimento
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Como atuamos na agência
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              O acompanhamento contábil mensal integra cinco frentes complementares, com foco na
              rotina operacional, financeira e societária da agência.
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
              trabalhistas e fiscais da agência.
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
              Dúvidas recorrentes sobre contabilidade para agências de publicidade
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
              Além de publicidade e comunicação, a PERES PERES oferece contabilidade e consultoria
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
