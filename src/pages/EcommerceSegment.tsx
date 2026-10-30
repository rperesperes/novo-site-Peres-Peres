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
  ShoppingCart,
  Receipt,
  Store,
  RotateCcw,
  Boxes,
  Calculator,
  TrendingUp,
  Scale,
  FileCheck,
  ShieldCheck,
  ChevronRight,
  Phone,
  ArrowRight,
} from 'lucide-react'

// 6 Desafios do E-commerce (textos verbatim)
const DESAFIOS = [
  {
    title: 'ICMS interestadual, ST e DIFAL',
    icon: Receipt,
    text: 'Vender para outro estado envolve ICMS interestadual, substituição tributária quando a mercadoria está no regime e diferencial de alíquota ao consumidor final. Tratado de forma genérica, esse conjunto gera autuação e margem negativa em pedido que parecia lucrativo na hora da venda.',
  },
  {
    title: 'Marketplaces e split de recebimento',
    icon: Store,
    text: 'O marketplace intermediou, descontou comissão, reteve o que a regra determina e repassou o líquido. Cada plataforma tem seu próprio extrato, seu próprio prazo e sua própria composição de desconto. Conciliar isso com a escrituração exige controle dedicado, e é onde a receita registrada deixa de refletir a receita real.',
  },
  {
    title: 'Devolução, troca e perda',
    icon: RotateCcw,
    text: 'Estorno de venda, mercadoria devolvida, avaria e estoque perdido na logística têm tratamento fiscal distinto. Lançamento errado distorce imposto e resultado, e devolução tratada como simples estorno costuma esconder perda que existe.',
  },
  {
    title: 'Estoque e custo real por produto',
    icon: Boxes,
    text: 'Com múltiplos canais, centros de distribuição e frete embutido no preço, calcular custo médio e margem real por SKU é o que separa quem cresce de quem cresce sem lucro. Loja que não sabe a margem por produto não sabe qual produto está financiando qual.',
  },
  {
    title: 'Precificação com tributo',
    icon: Calculator,
    text: 'Preço definido pelo marketplace, pela comparação ou pelo concorrente, sem considerar a carga tributária real da operação, é a causa mais comum de escala que não gera caixa. Vender mais com margem negativa amplia o prejuízo, não o negócio.',
  },
  {
    title: 'Regime e faturamento crescente',
    icon: TrendingUp,
    text: 'O e-commerce cresce em degraus, e a migração entre Simples Nacional, Lucro Presumido e Lucro Real tem prazo e efeito fiscal próprios. Descobrir o limite depois de ultrapassá-lo significa apurar retroativamente o que já foi vendido.',
  },
]

// 5 Frentes de Atuacao (textos verbatim na ordem exata: Tributaria, Contabil, Societaria, Financeira e de Gestao, Trabalhista)
const FRENTES_ATUACAO = [
  {
    frente: 'Tributária',
    destaque: true,
    badge: 'Nossa especialidade',
    text: 'definição do regime, análise de ICMS interestadual, substituição tributária e diferencial de alíquota conforme os estados de destino, e acompanhamento da Reforma Tributária aplicada ao comércio eletrônico.',
  },
  {
    frente: 'Contábil',
    destaque: false,
    text: 'escrituração que concilia pedido, extrato do marketplace, nota emitida, frete, devolução e caixa recebido, com receita registrada pelo valor correto e não pelo repasse líquido.',
  },
  {
    frente: 'Societária',
    destaque: false,
    text: 'estruturação da operação e das unidades, definição de inscrições estaduais por estado de atuação e escolha do modelo de expansão para novos canais e novas praças.',
  },
  {
    frente: 'Financeira e de Gestão',
    destaque: false,
    text: 'custo médio e margem real por SKU, precificação com tributo na composição do preço, leitura de resultado por canal e projeção de caixa considerando o prazo de repasse de cada plataforma.',
  },
  {
    frente: 'Trabalhista',
    destaque: false,
    text: 'organização da equipe de operação e logística, contratação de prestadores e revisão de riscos de vínculo em modelos de separação, embalagem e entrega.',
  },
]

// 3 Razoes Por Que a PERES PERES (textos verbatim)
const POR_QUE_PERES_PERES = [
  {
    num: '1',
    title: 'Responsável técnico com dupla formação',
    icon: Scale,
    text: 'Rafael Peres Peres Nunes Altoé é contador (CRC 027704), advogado (OAB 87656), auditor (CNAI 10122) e professor. Regime tributário, contrato com marketplace e risco trabalhista da operação são lidos juntos, na mesma mesa.',
  },
  {
    num: '2',
    title: 'Capacidade de produzir prova técnica',
    icon: FileCheck,
    text: 'A equipe conta com perita contábil formada em perícia judicial e em cálculos trabalhistas. Em discussão sobre margem, apuração de ICMS ou passivo da operação, a produção técnica é interna.',
  },
  {
    num: '3',
    title: 'Postura conservadora',
    icon: ShieldCheck,
    text: 'Não veiculamos promessa de percentual de economia. Cada diagnóstico parte de auditoria documental dos números da loja, e quando o regime atual já é o correto, dizemos que é.',
  },
]

// 5 Perguntas e Respostas do FAQ (textos verbatim)
const FAQ_ITEMS = [
  {
    question: 'E-commerce deve ser Simples Nacional?',
    answer:
      'Depende do faturamento, da margem, da atividade e do cumprimento dos requisitos legais. O Simples costuma fazer sentido no início da operação, quando o faturamento ainda está dentro do limite e a margem é compatível. Com crescimento e margem apertada, a simulação entre os regimes precisa ser refeita, porque o regime que era vantajoso no primeiro ano pode não ser mais no terceiro.',
  },
  {
    question: 'Como funciona a tributação de venda para outro estado?',
    answer:
      'Envolve ICMS interestadual, diferencial de alíquota ao consumidor final e, quando a mercadoria está no regime, substituição tributária. O resultado depende da mercadoria, do estado de destino e da condição do adquirente, e o cálculo precisa ser feito por operação, não por média geral.',
  },
  {
    question: 'Como conciliar repasses de marketplace na contabilidade?',
    answer:
      'Conciliando o valor bruto da venda com o extrato da plataforma, que mostra comissão, retenções, frete e prazo de repasse. O valor que entra na conta não é o valor da venda, e registrar apenas o repasse líquido esconde a receita real e a comissão paga.',
  },
  {
    question: 'Como precificar produto considerando os tributos?',
    answer:
      'Partindo da carga tributária efetiva da operação, e não da alíquota nominal do regime. Preço formado sobre custo mais margem, sem tributo, frete e comissão na conta, é preço que não sustenta a operação quando o volume cresce.',
  },
  {
    question: 'Vendo por marketplace, preciso de inscrição estadual em outros estados?',
    answer:
      'Depende. A exigência varia conforme a existência de operação naquele território, o modelo de logística, a condição do adquirente e a legislação do estado de destino. Não existe resposta única, e a definição precisa ser feita estado a estado, conforme onde a loja efetivamente opera.',
  },
]

// Demais segmentos atendidos pelo escritorio
const OUTROS_SEGMENTOS = [
  { name: 'Advogados (Profissões Regulamentadas)', link: '/profissoes-regulamentadas/advogados' },
  { name: 'Médicos (Profissões Regulamentadas)', link: '/profissoes-regulamentadas/medicos' },
  { name: 'Clínicas Médicas e Saúde', link: '/contabilidade-para-clinicas-medicas' },
  { name: 'Startups e Empresas de Tecnologia', link: '/contabilidade-para-startups-e-tech' },
  { name: 'Holdings Familiares e Patrimoniais', link: '/holdings-familiares-e-patrimoniais' },
  { name: 'Educação e Treinamentos', link: '/contabilidade-para-educacao-e-treinamentos' },
  { name: 'Publicidade e Comunicação', link: '/contabilidade-para-agencias-de-publicidade' },
  { name: 'Agências de Viagem', link: '/contabilidade-para-agencias-de-viagem' },
  { name: 'MEIs e Profissionais Liberais', link: '/servicos#segmentos' },
]

export default function EcommerceSegment() {
  useSeo({
    title: 'Contabilidade para E-commerce | Consultoria Tributária em Brasília | PERES PERES',
    description:
      'Contabilidade e consultoria para e-commerce e lojas virtuais: ICMS interestadual, DIFAL, marketplaces, estoque e precificação. Atendimento em Brasília e no Brasil.',
    canonical: 'https://peresperes.com.br/contabilidade-para-ecommerce',
  })

  // JSON-LD para Rich Snippet FAQPage e BreadcrumbList
  useEffect(() => {
    const scriptId = 'faq-jsonld-ecommerce'
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
              name: 'E-commerce',
              item: 'https://peresperes.com.br/contabilidade-para-ecommerce',
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
            <span className="text-[#FAB319] font-medium">E-commerce</span>
          </nav>

          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 border border-neutral-700 bg-neutral-900/60 px-3 py-1 rounded text-xs tracking-wider uppercase text-neutral-300 font-sans">
              <ShoppingCart className="h-3.5 w-3.5 text-[#FAB319]" />
              Segmento Especializado
            </div>

            {/* H1 obrigatorio */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white leading-tight max-w-4xl">
              Contabilidade e consultoria para e-commerces e lojas virtuais
            </h1>

            {/* Paragrafo de abertura verbatim */}
            <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-3xl leading-relaxed font-sans">
              No e-commerce, a operação não é só venda. É regime fiscal por estado, substituição
              tributária, diferencial de alíquota, marketplace, logística e devolução. A PERES PERES
              organiza a contabilidade mensal de lojas virtuais com a leitura tributária que esse
              modelo exige, porque no comércio eletrônico o erro de parametrização não fica na
              planilha. Ele aparece na margem de cada pedido.
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
              Precisa avaliar ICMS interestadual, conciliação de marketplaces ou precificação de
              produtos? Converse diretamente com nossos especialistas.
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
          SECAO 1: DESAFIOS DO E-COMMERCE (6 cards)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Peculiaridades do setor
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Desafios do e-commerce
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              A operação do comércio eletrônico combina regras interestaduais de ICMS, conciliação
              de repasses com múltiplos canais e controle rigoroso de estoque e devoluções.
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
          SECAO 2: COMO ATUAMOS NO E-COMMERCE (5 itens)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Estrutura de atendimento
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Como atuamos no e-commerce
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              O acompanhamento contábil mensal integra cinco frentes complementares, com foco na
              rotina fiscal, logística e financeira do comércio eletrônico.
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
              fiscais e operacionais do e-commerce.
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
              Dúvidas recorrentes sobre contabilidade para e-commerce
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
              Além de e-commerces e lojas virtuais, a PERES PERES oferece contabilidade e
              consultoria especializada para diferentes nichos e modelos de negócio:
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
