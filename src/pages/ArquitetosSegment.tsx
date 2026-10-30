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
  Calculator,
  Building2,
  FileCheck2,
  TrendingUp,
  Coins,
  Users2,
  Scale,
  FileCheck,
  ShieldCheck,
  ChevronRight,
  Phone,
  Compass,
} from 'lucide-react'

// 6 Desafios do Arquiteto (textos verbatim)
const DESAFIOS = [
  {
    title: 'Fator R e o risco de descer de anexo',
    icon: Calculator,
    text: 'A arquitetura é tributada no Anexo III do Simples Nacional, de alíquotas menores, e migra para o Anexo V quando o Fator R fica abaixo de 28%. Como o cálculo é refeito todo mês, um pró-labore desalinhado derruba o enquadramento, e a diferença aparece na guia seguinte.',
  },
  {
    title: 'Contratos com clientes e contratantes',
    icon: Building2,
    text: 'Projetos para pessoas físicas, construtoras, empresas e órgãos públicos trazem retenções de imposto de renda, contribuição previdenciária e ISS que variam conforme o contratante. O controle precisa bater com a escrituração, porque reter a mais prejudica o caixa e reter a menos gera contingência.',
  },
  {
    title: 'RRT, laudos e responsabilidade técnica',
    icon: FileCheck2,
    text: 'O registro de responsabilidade técnica no CAU, os laudos e os pareceres têm custo e tratamento fiscal que precisam estar na contabilidade da PJ, e não no bolso do profissional. A responsabilidade técnica do arquiteto também não se transfere com a estrutura societária, e isso precisa estar refletido na forma de contratação.',
  },
  {
    title: 'Projeto, parcelas e receita por etapa',
    icon: TrendingUp,
    text: 'Projeto cobrado em etapas, com parcelas vinculadas a entregas e aprovações, exige reconhecimento de receita no período correto, não no momento do caixa. Faturar por etapa com recebimento posterior distorce o resultado de todos os meses entre a entrega e o pagamento.',
  },
  {
    title: 'Pró-labore e proteção previdenciária',
    icon: Coins,
    text: 'O arquiteto que atua como autônomo ou por PJ própria depende do pró-labore para contribuir ao INSS e manter proteção previdenciária. Retirar tudo como lucro isento cria lacuna que não se recupera depois, e no caso da arquitetura há ainda o efeito do pró-labore sobre o Fator R.',
  },
  {
    title: 'Estrutura para sócios e sociedades de projeto',
    icon: Users2,
    text: 'Entrada de sócio, associação para concurso ou projeto de maior porte e definição de responsabilidade entre profissionais exigem estrutura societária que separe o risco do projeto do patrimônio pessoal. Sociedade mal desenhada expõe o patrimônio de todos os participantes.',
  },
]

// 5 Frentes de Atuação (textos verbatim na ordem Tributária, Contábil, Societária, Financeira e de Gestão, Trabalhista)
const FRENTES_ATUACAO = [
  {
    frente: 'Tributária',
    destaque: true,
    badge: 'Nossa especialidade',
    text: 'definição do regime, gestão mensal do Fator R para manter o enquadramento no Anexo III do Simples Nacional, análise das retenções por contratante e acompanhamento da Reforma Tributária aplicada a serviços técnicos.',
  },
  {
    frente: 'Contábil',
    destaque: false,
    text: 'escrituração com controle de receita por projeto, por etapa e por cliente, conciliação de retenções e notas emitidas, e demonstrações que reflitam o resultado real de cada projeto.',
  },
  {
    frente: 'Societária',
    destaque: false,
    text: 'constituição da sociedade limitada de sócio único, entrada e saída de sócio, formação de sociedade para projeto ou concurso e definição contratual de responsabilidade entre profissionais.',
  },
  {
    frente: 'Financeira e de Gestão',
    destaque: false,
    text: 'leitura de margem por projeto e por cliente, projeção de caixa diante do prazo entre entrega, aprovação e recebimento, formação de preço de projeto e dimensionamento da retirada mensal.',
  },
  {
    frente: 'Trabalhista',
    destaque: false,
    text: 'estruturação da contratação de equipe de apoio, desenhistas e parceiros, com revisão de riscos de vínculo e conformidade no eSocial quando há empregado.',
  },
]

// 3 Razões Por Que a PERES PERES (textos verbatim)
const POR_QUE_PERES_PERES = [
  {
    num: '1',
    title: 'Responsável técnico com dupla formação',
    icon: Scale,
    text: 'Rafael Peres Peres Nunes Altoé é contador (CRC 027704), advogado (OAB 87656), auditor (CNAI 10122) e professor. Regime tributário, contrato de projeto e risco de responsabilidade técnica são lidos juntos, na mesma mesa.',
  },
  {
    num: '2',
    title: 'Capacidade de produzir prova técnica',
    icon: FileCheck,
    text: 'A equipe conta com perita contábil formada em perícia judicial e em cálculos trabalhistas. Em discussão sobre retenções, reconhecimento de receita por etapa ou apuração de haveres entre sócios, a produção técnica é interna.',
  },
  {
    num: '3',
    title: 'Postura conservadora',
    icon: ShieldCheck,
    text: 'Não veiculamos promessa de percentual de economia. Cada diagnóstico parte de auditoria documental dos números do profissional, e quando o regime atual já é o correto, dizemos que é.',
  },
]

// 5 Perguntas e Respostas do FAQ (textos verbatim)
const FAQ_ITEMS = [
  {
    question: 'Arquiteto pode ser MEI?',
    answer:
      'Não. A atividade de arquiteto não consta entre as ocupações permitidas ao MEI (Resolução CGSN nº 140/2018, Anexo XI), que é lista fechada. Abrir MEI com CNAE genérico para depois emitir RRT e prestar serviço de arquitetura não formaliza a situação e cria risco fiscal e de responsabilidade. Os caminhos possíveis são a atuação como pessoa física, o empresário individual ou a sociedade limitada.',
  },
  {
    question: 'Arquiteto deve optar pelo Simples Nacional?',
    answer:
      'Depende dos números, mas o ponto de partida é que a arquitetura é permitida no Simples e está entre as atividades tributadas no Anexo III, de alíquotas menores, desde que o Fator R se mantenha em 28% ou mais. Quando a margem é alta e as despesas dedutíveis são relevantes, o Lucro Presumido pode ser comparativamente melhor. A decisão precisa vir de simulação.',
  },
  {
    question: 'Como funciona o Fator R para o arquiteto na prática?',
    answer:
      'É a razão entre a folha de pagamento, incluindo o pró-labore, dos últimos 12 meses, e a receita bruta dos últimos 12 meses. Quando o resultado se mantém em 28% ou mais, a atividade permanece no Anexo III. Abaixo disso, migra para o Anexo V. Como o cálculo é refeito todo mês, o planejamento de pró-labore e de contratação é o que mantém o arquiteto no anexo mais vantajoso.',
  },
  {
    question:
      'Como tratar serviço prestado para construtora ou órgão público com retenções na nota?',
    answer:
      'Depende do contratante e da natureza do serviço. Retenções de imposto de renda, contribuição previdenciária e ISS têm regras próprias, e a conciliação entre o valor retido, o valor faturado e o valor recebido precisa estar na escrituração. Não existe percentual único aplicável a todos os contratos.',
  },
  {
    question: 'O RRT é despesa dedutível da PJ?',
    answer:
      'O RRT é custo inerente ao exercício da atividade e, como despesa da pessoa jurídica, deve ser lançado na contabilidade e não no bolso do profissional. A dedutibilidade para fins de apuração depende do regime adotado, e a classificação correta precisa ser feita conforme o regime da empresa.',
  },
]

// Outras profissões regulamentadas (médicos, advogados, psicólogos e engenheiros)
const OUTRAS_PROFISSOES = [
  { name: 'Médicos', link: '/profissoes-regulamentadas/medicos' },
  { name: 'Advogados', link: '/profissoes-regulamentadas/advogados' },
  { name: 'Psicólogos', link: '/profissoes-regulamentadas/psicologos' },
  { name: 'Engenheiros', link: '/profissoes-regulamentadas/engenheiros' },
]

// Demais segmentos atendidos pelo escritório
const OUTROS_SEGMENTOS = [
  { name: 'Clínicas Médicas e Saúde', link: '/contabilidade-para-clinicas-medicas' },
  { name: 'Startups e Empresas de Tecnologia', link: '/contabilidade-para-startups-e-tech' },
  { name: 'Holdings Familiares e Patrimoniais', link: '/holdings-familiares-e-patrimoniais' },
  { name: 'Educação e Treinamentos', link: '/contabilidade-para-educacao-e-treinamentos' },
  { name: 'Publicidade e Comunicação', link: '/contabilidade-para-agencias-de-publicidade' },
  { name: 'Agências de Viagem', link: '/contabilidade-para-agencias-de-viagem' },
  { name: 'E-commerce', link: '/contabilidade-para-ecommerce' },
  { name: 'MEIs e Profissionais Liberais', link: '/servicos#segmentos' },
]

export default function ArquitetosSegment() {
  useSeo({
    title: 'Contabilidade para Arquitetos | PJ, Fator R e RRT | PERES PERES',
    description:
      'Contabilidade e consultoria para arquitetos: PJ unipessoal, Fator R no Simples, retenções de contratantes e receita por projeto. Atendimento em Brasília e no Brasil.',
    canonical: 'https://peresperes.com.br/profissoes-regulamentadas/arquitetos',
  })

  // JSON-LD para Rich Snippet FAQPage e BreadcrumbList
  useEffect(() => {
    const scriptId = 'faq-jsonld-arquitetos'
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
              item: 'https://peresperes.com.br/servicos#segmentos',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Profissões Regulamentadas',
              item: 'https://peresperes.com.br/servicos#segmentos',
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: 'Arquitetos',
              item: 'https://peresperes.com.br/profissoes-regulamentadas/arquitetos',
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
          {/* Breadcrumb verbatim: Início > Segmentos > Profissões Regulamentadas > Arquitetos */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-neutral-400 mb-8 font-sans"
          >
            <Link to="/" className="hover:text-white transition-colors">
              Início
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-600" />
            <Link to="/servicos#segmentos" className="hover:text-white transition-colors">
              Segmentos
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-600" />
            <Link to="/servicos#segmentos" className="hover:text-white transition-colors">
              Profissões Regulamentadas
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-600" />
            <span className="text-[#FAB319] font-medium">Arquitetos</span>
          </nav>

          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 border border-neutral-700 bg-neutral-900/60 px-3 py-1 rounded text-xs tracking-wider uppercase text-neutral-300 font-sans">
              <Compass className="h-3.5 w-3.5 text-[#FAB319]" />
              Profissões Regulamentadas
            </div>

            {/* H1 hero verbatim */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white leading-tight max-w-4xl">
              Contabilidade e consultoria para arquitetos
            </h1>

            {/* Parágrafo de abertura verbatim */}
            <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-3xl leading-relaxed font-sans">
              O arquiteto que formaliza a própria pessoa jurídica, normalmente uma sociedade
              limitada de um único sócio, a chamada PJ unipessoal, concentra a decisão financeira no
              que cerca o projeto: regime tributário, retenções dos contratantes, RRT e a fronteira
              entre pró-labore e distribuição de lucros. A PERES PERES cuida da contabilidade mensal
              e dessa leitura.
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
          SEÇÃO 1: DESAFIOS DO ARQUITETO (6 cards)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Peculiaridades da arquitetura
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Desafios do arquiteto
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              A rotina tributária e societária do arquiteto exige critério técnico contínuo. Estas
              são as principais questões que impactam diretamente a rentabilidade e o caixa da
              atividade técnica.
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
          SEÇÃO 2: COMO ATUAMOS COM O ARQUITETO (5 itens)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Estrutura de atendimento
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Como atuamos com o arquiteto
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              O acompanhamento contábil mensal integra cinco frentes complementares, com foco na
              rotina da arquitetura, societária e fiscal.
            </p>
          </div>

          <div className="space-y-6">
            {/* Frente 1: Tributária em Destaque com selo "Nossa especialidade" */}
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

            {/* Frentes 2, 3, 4 e 5: Contábil, Societária, Financeira e de Gestão, Trabalhista */}
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

          {/* Link para /servicos com texto verbatim */}
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
              Critério, formação multidisciplinar e segurança técnica para decisões societárias e
              fiscais do arquiteto.
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
          SEÇÃO 4: FAQ (5 perguntas e respostas verbatim com rich snippet)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block font-sans">
              Perguntas frequentes
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Dúvidas recorrentes sobre contabilidade para arquitetos
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
          SEÇÃO 5: CONHEÇA AS OUTRAS PROFISSÕES REGULAMENTADAS
         ========================================================= */}
      <section className="py-12 md:py-16 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-8 space-y-2">
            <h3 className="text-2xl md:text-3xl font-sans font-bold text-black leading-tight">
              Conheça as outras profissões
            </h3>
            <p className="text-neutral-600 text-sm md:text-base leading-relaxed font-sans">
              Além de arquitetos, a PERES PERES oferece assessoria contábil e consultoria para
              profissionais regulamentados de diversas áreas:
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {OUTRAS_PROFISSOES.map((prof, idx) => (
              <Link
                key={idx}
                to={prof.link}
                className="bg-neutral-50 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-100/70 rounded-lg p-3.5 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#FAB319] shrink-0" />
                  <span className="text-sm font-sans font-medium text-neutral-900 leading-snug">
                    {prof.name}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-black transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          SEÇÃO 6: OUTROS SEGMENTOS ATENDIDOS
         ========================================================= */}
      <section className="py-12 md:py-16 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-8 space-y-2">
            <h3 className="text-2xl md:text-3xl font-sans font-bold text-black leading-tight">
              Conheça os outros segmentos
            </h3>
            <p className="text-neutral-600 text-sm md:text-base leading-relaxed font-sans">
              A PERES PERES oferece contabilidade mensal e consultoria especializada para diferentes
              nichos e modelos de negócio:
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {OUTROS_SEGMENTOS.map((seg, idx) => (
              <Link
                key={idx}
                to={seg.link}
                className="bg-white border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-100/70 rounded-lg p-3.5 flex items-center justify-between transition-colors group"
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
          SEÇÃO 7: CTA FINAL (textos verbatim)
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
