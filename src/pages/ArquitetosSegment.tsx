import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { SegmentFaq } from '@/components/SegmentFaq'
import { useSeo } from '@/hooks/use-seo'
import { ProfessionExerciseForm } from '@/components/ProfessionExerciseForm'
import { ArquitetosCnaeSection } from '@/components/ArquitetosCnaeSection'
import { ContinueReading } from '@/components/ContinueReading'
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
    text: 'A arquitetura e urbanismo é tributada no Anexo III do Simples Nacional (LC 123/2006, art. 18, § 5º-B, XVIII), de alíquotas menores, e migra para o Anexo V quando o Fator R fica abaixo de 28%. Como o cálculo é refeito todo mês, um pró-labore desalinhado derruba o enquadramento, e a diferença aparece na guia seguinte.',
  },
  {
    title: 'Contratos com clientes e contratantes',
    icon: Building2,
    text: 'Projetos para pessoas físicas, construtoras, empresas e órgãos públicos trazem retenções de imposto de renda, contribuição previdenciária e ISS que variam conforme o contratante. O controle precisa bater com a escrituração, porque reter a mais prejudica o caixa e reter a menos gera contingência.',
  },
  {
    title: 'RRT, laudos e responsabilidade técnica',
    icon: FileCheck2,
    text: 'O registro de responsabilidade técnica no CAU, os laudos e os pareceres têm custo e tratamento fiscal que precisam estar na contabilidade da PJ, e não no bolso do profissional. A responsabilidade técnica do arquiteto é pessoal e permanece vinculada ao profissional habilitado responsável pelo RRT no CAU, independentemente da estrutura societária adotada, e isso precisa estar refletido na forma de contratação e na definição de quem assina tecnicamente cada projeto.',
  },
  {
    title: 'Projeto, parcelas e receita por etapa',
    icon: TrendingUp,
    text: 'Projeto cobrado em etapas, com parcelas vinculadas a entregas e aprovações, exige reconhecimento de receita no período correto, não no momento do caixa. Faturar por etapa com recebimento posterior distorce o resultado de todos os meses entre a entrega e o pagamento.',
  },
  {
    title: 'Pró-labore e proteção previdenciária',
    icon: Coins,
    text: 'Retirar tudo como distribuição de lucros, sem pró-labore, cria lacuna que não se recupera depois, e no caso da arquitetura há ainda o efeito do pró-labore sobre o Fator R. O arquiteto que atua como autônomo ou por PJ própria depende do pró-labore para contribuir ao INSS e manter proteção previdenciária. Acima de 50 mil reais por mês por empresa pagadora, a distribuição sofre retenção de 10% na fonte, conforme a Lei 15.270 de 2025.',
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
    text: 'Não veiculamos promessa de percentual de economia. Cada análise parte de diagnóstico documental dos números do profissional, e quando o regime atual já é o correto, dizemos que é.',
  },
]

// 6 Perguntas e Respostas do FAQ (textos verbatim)
const FAQ_ITEMS = [
  {
    question: 'Arquiteto pode ser MEI?',
    answer:
      'Não. A arquitetura e urbanismo não consta do Anexo XI da Resolução CGSN nº 140/2018, lista fechada de ocupações autorizadas ao MEI. A via correta é a pessoa jurídica, normalmente a sociedade limitada unipessoal optante pelo Simples Nacional.',
  },
  {
    question: 'Qual o CNAE de arquitetura?',
    answer:
      'O código principal é 7110-3/00, serviços de arquitetura e urbanismo. Códigos secundários podem ser incluídos conforme os serviços oferecidos, e a tabela desta página lista os mais comuns antes da escolha do enquadramento.',
  },
  {
    question: 'Arquiteto pode usar arquitetura no nome da empresa?',
    answer:
      'Pode, desde que a empresa tenha registro no CAU e sócios ou responsáveis técnicos com formação e registro profissional, condição exigida para o uso do termo na razão social (Lei 12.378/2010).',
  },
  {
    question: 'Qual o anexo do Simples?',
    answer:
      'A arquitetura é tributada no Anexo III do Simples Nacional (LC 123/2006, art. 18, § 5º-B, XVIII), desde que o Fator R se mantenha em 28% ou mais. Abaixo desse percentual, a tributação migra para o Anexo V, de alíquotas maiores.',
  },
  {
    question: 'Projeto de interiores tem código próprio?',
    answer:
      'Tem. O CNAE 7410-2/99, design de interiores, cobre o projeto de interiores quando o serviço se limita ao design de ambientes. Quando há projeto arquitetônico de obra, o código é o 7110-3/00, e a combinação precisa refletir o que a empresa realmente executa.',
  },
  {
    question: 'Arquiteto precisa de registro no CAU?',
    answer:
      'Sim. A pessoa jurídica que presta serviços de arquitetura e urbanismo precisa de registro no CAU, com responsável técnico (Lei 12.378/2010). O RRT da empresa acompanha cada projeto, e os códigos de CNAE precisam ser compatíveis com as atividades registradas.',
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
  { name: 'Educação e Treinamentos', link: '/contabilidade-para-educacao-e-treinamentos' },
  { name: 'Publicidade e Comunicação', link: '/contabilidade-para-agencias-de-publicidade' },
  { name: 'Agências de Viagem', link: '/contabilidade-para-agencias-de-viagem' },
  { name: 'E-commerce', link: '/contabilidade-para-ecommerce' },
  { name: 'MEIs e Profissionais Liberais', link: '/servicos#segmentos' },
]

export default function ArquitetosSegment() {
  useSeo({
    title: 'Contabilidade para Arquitetos: CNAE, Fator R e Retenções',
    description:
      'Contabilidade para arquitetos com PJ, Fator R no Simples, retenções de clientes e receita por projeto: como lidar com a carga fiscal sem surpresas.',
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
              name: 'Áreas de atuação',
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
          {/* Breadcrumb verbatim: Início > Áreas de atuação > Profissões Regulamentadas > Arquitetos */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-neutral-400 mb-8 font-sans"
          >
            <Link to="/" className="hover:text-white transition-colors">
              Início
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-600" />
            <Link to="/servicos#segmentos" className="hover:text-white transition-colors">
              Áreas de atuação
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
              O arquiteto que abre a própria pessoa jurídica, normalmente uma sociedade limitada de
              um único sócio, a chamada PJ unipessoal, concentra a decisão financeira no que cerca o
              projeto: regime tributário, retenções dos contratantes, RRT e a fronteira entre
              pró-labore e distribuição de lucros. A PERES PERES cuida da contabilidade mensal e
              dessa leitura.
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

      <ProfessionExerciseForm
        title="Arquiteto como pessoa física ou pessoa jurídica?"
        intro="A arquitetura pode ser exercida em nome próprio, como pessoa física, com registro no conselho de classe e anotação de responsabilidade técnica, ou por meio de pessoa jurídica. A receita por projeto entregue e a receita por acompanhamento de obra têm tratamentos distintos quanto a retenções e à forma de apuração no período. Não existe a opção de MEI para a atividade."
        extraItems={[
          'Se a receita será por projeto entregue ou por acompanhamento de obra, porque o tratamento das retenções muda entre os dois formatos.',
          'O volume de despesas com equipe, softwares, maquetes e deslocamento, dedutíveis apenas na pessoa jurídica.',
        ]}
      />

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
          SEÇÃO CNAE, REGIME TRIBUTÁRIO E ISS (entre desafios e como atuamos)
         ========================================================= */}
      <ArquitetosCnaeSection />

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
          SEÇÃO 6: OUTRAS ÁREAS DE ATUAÇÃO
         ========================================================= */}
      <section className="py-12 md:py-16 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-8 space-y-2">
            <h3 className="text-2xl md:text-3xl font-sans font-bold text-black leading-tight">
              Conheça as outras áreas de atuação
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

      {/* =========================================================
          SEÇÃO 8: CONTINUE LENDO (2 cards)
         ========================================================= */}
      <SegmentFaq
        heading="Dúvidas recorrentes sobre contabilidade para arquitetos"
        items={FAQ_ITEMS}
      />

      <ContinueReading
        items={[
          {
            title: 'Engenheiros',
            description:
              'Atuação nas duas frentes, projeto e obra, com os registros no CREA e no CAU tratados junto com o regime tributário da pessoa jurídica.',
            to: '/profissoes-regulamentadas/engenheiros',
            cta: 'Ver página de Engenheiros',
          },
          {
            title: 'Abertura e alteração de empresas',
            description:
              'Constituição da PJ do arquiteto ou da sociedade de arquitetos, com enquadramento de CNAE, registro no CAU e escolha do regime tributário avaliados desde a abertura.',
            to: '/servicos#abertura-e-alteracao-de-empresas',
            cta: 'Ver Abertura e alteração de empresas',
          },
        ]}
      />
    </div>
  )
}
