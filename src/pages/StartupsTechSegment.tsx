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
  Layers,
  Code2,
  PieChart,
  LineChart,
  Sparkles,
  Users2,
  Scale,
  FileCheck,
  ShieldCheck,
  ChevronRight,
  Phone,
  Rocket,
  ArrowRight,
} from 'lucide-react'

// 6 Desafios da Startup e da Empresa de Tecnologia (textos verbatim)
const DESAFIOS = [
  {
    title: 'Enquadramento em movimento',
    icon: Layers,
    text: 'Receita recorrente, margem alta e folha enxuta mudam completamente a conta entre Simples Nacional, Lucro Presumido e Lucro Real. O melhor regime no mês da fundação raramente é o melhor no terceiro ano, e a migração tem prazo e efeito fiscal próprios.',
  },
  {
    title: 'Tributação de SaaS e software',
    icon: Code2,
    text: 'A fronteira entre licença, assinatura e serviço tem consequências sobre ISS, ICMS e PIS/COFINS. A parametrização feita errado no início cobra caro depois, e revisar o enquadramento dos produtos costuma ser mais barato do que corrigir anos de apuração.',
  },
  {
    title: 'Stock options, vesting e participação',
    icon: PieChart,
    text: 'Planos de opção e vesting de fundadores e colaboradores têm reflexos fiscais e societários que precisam ser desenhados antes do primeiro exercício, não quando o primeiro colaborador exerce a opção.',
  },
  {
    title: 'Números prontos para o investidor',
    icon: LineChart,
    text: 'Rodada de investimento exige demonstrações organizadas, histórico contábil consistente e due diligence limpa. Improvisar na véspera é perder tempo na negociação e desgastar o valuation.',
  },
  {
    title: 'Créditos e incentivos à inovação',
    icon: Sparkles,
    text: 'Dispêndios com pesquisa, desenvolvimento e inovação podem gerar benefícios que a maioria dos escritórios não mapeia. O ponto de partida é a classificação correta dos dispêndios na contabilidade.',
  },
  {
    title: 'Contratação e equipes técnicas',
    icon: Users2,
    text: 'A combinação de sócios fundadores, colaboradores CLT, prestadores PJ e, em muitos casos, trabalho remoto entre estados cria riscos trabalhistas, previdenciários e de retenções que precisam de rotina estruturada, não de improviso.',
  },
]

// 5 Frentes de Atuação (textos verbatim na ordem exata: Tributária, Contábil, Societária, Financeira e de Gestão, Trabalhista)
const FRENTES_ATUACAO = [
  {
    frente: 'Tributária',
    destaque: true,
    badge: 'Nossa especialidade',
    text: 'definição e revisão periódica do regime de tributação, enquadramento dos produtos entre licença, assinatura e serviço, mapeamento de créditos e incentivos e acompanhamento da Reforma Tributária aplicada a tecnologia.',
  },
  {
    frente: 'Contábil',
    destaque: false,
    text: 'escrituração construída desde a fundação com padrão de due diligence, com conciliação de receita recorrente, contratos de assinatura e receita por projeto.',
  },
  {
    frente: 'Societária',
    destaque: false,
    text: 'estruturação societária inicial, tabela de capitalização, vesting de fundadores e colaboradores, instrumentos de stock options e preparação da estrutura para novas rodadas.',
  },
  {
    frente: 'Financeira e de Gestão',
    destaque: false,
    text: 'leitura de burn rate, runway e margem por produto, demonstrações prontas para investidor e projeções de caixa que sustentam a tese da rodada.',
  },
  {
    frente: 'Trabalhista',
    destaque: false,
    text: 'estruturação da contratação de equipes técnicas, conformidade no eSocial e revisão de riscos em modelos de trabalho remoto e prestação entre estados.',
  },
]

// 3 Razões Por Que a PERES PERES (textos verbatim)
const POR_QUE_PERES_PERES = [
  {
    num: '1',
    title: 'Responsável técnico com dupla formação',
    icon: Scale,
    text: 'Rafael Peres Peres Nunes Altoé é contador (CRC 027704), advogado (OAB 87656), auditor (CNAI 10122) e professor. O vesting, o instrumento de stock options e o enquadramento tributário são lidos juntos, na mesma mesa.',
  },
  {
    num: '2',
    title: 'Capacidade de produzir prova técnica',
    icon: FileCheck,
    text: 'A equipe conta com perita contábil formada em perícia judicial e em cálculos trabalhistas. Quando a operação precisa de laudo, parecer ou demonstração técnica para investidor ou auditoria, a produção é interna.',
  },
  {
    num: '3',
    title: 'Postura conservadora',
    icon: ShieldCheck,
    text: 'Não veiculamos promessa de percentual de economia. Cada diagnóstico parte de auditoria documental dos números da empresa, e quando o estudo não sustenta determinada tese, dizemos que não sustenta.',
  },
]

// 5 Perguntas e Respostas do FAQ (textos verbatim)
const FAQ_ITEMS = [
  {
    question: 'Qual regime tributário é melhor para uma startup?',
    answer:
      'Depende dos números: receita recorrente, margem, folha e projeção de crescimento. Receita recorrente com margem alta e folha enxuta frequentemente torna o Lucro Presumido ou o Lucro Real mais vantajoso do que o Simples Nacional, mas a resposta só existe com simulação sobre os números reais da empresa.',
  },
  {
    question: 'Como a SaaS deve ser tributada?',
    answer:
      'A fronteira entre licença de software, assinatura e prestação de serviço tem consequências sobre ISS, ICMS e PIS/COFINS, e a regulamentação varia conforme o município e o modelo de negócio. O enquadramento correto dos produtos é decisão que precisa ser tomada antes da parametrização do faturamento, não depois.',
  },
  {
    question: 'Como a startup deve se preparar para uma rodada de investimento?',
    answer:
      'Com histórico contábil consistente, demonstrações organizadas, contratos societários em ordem e posição fiscal limpa. A due diligence vai olhar tudo isso, e cada inconsistência encontrada vira argumento de negociação contra a empresa.',
  },
  {
    question: 'Como estruturar vesting e stock options sem risco fiscal?',
    answer:
      'O desenho precisa considerar os reflexos tributários no momento da concessão, do cumprimento do vesting e do exercício da opção, além da forma societária de cada instrumento. Estruturar depois do primeiro exercício costuma gerar custo que seria evitável.',
  },
  {
    question: 'Vocês atendem startups fora de Brasília?',
    answer:
      'Sim. A sede é em Brasília/DF, com atendimento em todo o Brasil, de forma presencial ou remota, incluindo empresas com times distribuídos.',
  },
]

// Demais segmentos atendidos pelo escritório
const OUTROS_SEGMENTOS = [
  { name: 'Advogados (Profissões Regulamentadas)', link: '/profissoes-regulamentadas/advogados' },
  { name: 'Médicos (Profissões Regulamentadas)', link: '/profissoes-regulamentadas/medicos' },
  { name: 'Clínicas Médicas e Saúde', link: '/contabilidade-para-clinicas-medicas' },
  { name: 'Holdings Familiares e Patrimoniais', link: '/holdings-familiares-e-patrimoniais' },
  { name: 'Educação e Treinamentos', link: '/contabilidade-para-educacao-e-treinamentos' },
  { name: 'Publicidade e Comunicação', link: '/contabilidade-para-agencias-de-publicidade' },
  { name: 'Agências de Viagem', link: '/contabilidade-para-agencias-de-viagem' },
  { name: 'E-commerce', link: '/contabilidade-para-ecommerce' },
  { name: 'MEIs e Profissionais Liberais', link: '/servicos#segmentos' },
]

export default function StartupsTechSegment() {
  useSeo({
    title: 'Contabilidade para Startups e Tech | Consultoria em Brasília | PERES PERES',
    description:
      'Contabilidade e consultoria para startups e empresas de tecnologia: enquadramento, SaaS, vesting e números prontos para investidor. Atendimento em Brasília e no Brasil.',
    canonical: 'https://peresperes.com.br/contabilidade-para-startups-e-tech',
  })

  // JSON-LD para Rich Snippet FAQPage e BreadcrumbList
  useEffect(() => {
    const scriptId = 'faq-jsonld-startups-tech'
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
              name: 'Startups e Empresas de Tecnologia',
              item: 'https://peresperes.com.br/contabilidade-para-startups-e-tech',
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
            <span className="text-[#FAB319] font-medium">Startups e Empresas de Tecnologia</span>
          </nav>

          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 border border-neutral-700 bg-neutral-900/60 px-3 py-1 rounded text-xs tracking-wider uppercase text-neutral-300 font-sans">
              <Rocket className="h-3.5 w-3.5 text-[#FAB319]" />
              Segmento Especializado
            </div>

            {/* H1 obrigatório */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white leading-tight max-w-4xl">
              Contabilidade e consultoria para startups e empresas de tecnologia
            </h1>

            {/* Parágrafo de abertura verbatim */}
            <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-3xl leading-relaxed font-sans">
              Uma startup vende para o investidor, acima de tudo, confiabilidade nos números. A
              PERES PERES cuida da contabilidade mensal e da leitura tributária, societária e
              financeira da operação, do MVP à captação, com números organizados para a due
              diligence e decisões fiscais tomadas antes que virem custo.
            </p>

            {/* Chamada para ação no Hero */}
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
          BANNER INFORMATIVO DE TRANSIÇÃO
         ========================================================= */}
      <section className="bg-neutral-50 border-b border-neutral-200 py-4">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-neutral-700 font-sans">
            <span className="font-medium text-neutral-900">
              Estruturando um MVP, desenhando vesting ou preparando rodada de investimento? Converse
              diretamente com nossos especialistas.
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
          SEÇÃO 1: DESAFIOS DA STARTUP E DA EMPRESA DE TECNOLOGIA (6 cards)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Peculiaridades do setor
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Desafios da startup e da empresa de tecnologia
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              A velocidade de crescimento e a sofisticação societária das empresas de tecnologia
              exigem leitura técnica preventiva em cada fase do negócio.
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
          SEÇÃO 2: COMO ATUAMOS NA STARTUP (5 itens)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Estrutura de atendimento
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Como atuamos na startup
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              O acompanhamento contábil mensal integra cinco frentes complementares, com foco na
              dinâmica de crescimento e due diligence da operação.
            </p>
          </div>

          <div className="space-y-6">
            {/* Frente 1: Consultoria Tributária em Destaque */}
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
          SEÇÃO 3: POR QUE A PERES PERES (3 itens)
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
              fiscais e estratégicas da startup.
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
          SEÇÃO 4: FAQ (5 perguntas e respostas com rich snippet)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block font-sans">
              Perguntas frequentes
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Dúvidas recorrentes sobre contabilidade para startups e tech
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
          SEÇÃO 5: OUTROS SEGMENTOS ATENDIDOS
         ========================================================= */}
      <section className="py-12 md:py-16 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-8 space-y-2">
            <h3 className="text-2xl md:text-3xl font-sans font-bold text-black leading-tight">
              Conheça os outros segmentos
            </h3>
            <p className="text-neutral-600 text-sm md:text-base leading-relaxed font-sans">
              Além de startups e empresas de tecnologia, a PERES PERES oferece contabilidade e
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
          SEÇÃO 6: CTA FINAL
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
