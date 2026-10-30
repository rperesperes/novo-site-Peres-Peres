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
  Brain,
  Scale,
  FileCheck,
  ShieldCheck,
  ChevronRight,
  Phone,
  UserCheck,
  Globe2,
  Calculator,
  Coins,
  Receipt,
  TrendingUp,
} from 'lucide-react'

// 6 Desafios do Psicólogo (textos verbatim)
const DESAFIOS = [
  {
    title: 'PJ, empresário individual ou pessoa física',
    icon: UserCheck,
    text: 'O MEI não é alternativa para o psicólogo, porque a atividade não consta entre as ocupações permitidas (Resolução CGSN nº 140/2018, Anexo XI). Os caminhos reais são atuar como pessoa física, constituir empresário individual ou abrir sociedade limitada, normalmente de sócio único. Cada formato tem regime, limite e efeito previdenciário próprio, e a decisão precisa ser tomada com números, não por indicação de colega.',
  },
  {
    title: 'Atendimento à distância e em outros estados',
    icon: Globe2,
    text: 'Paciente em outro estado muda a definição do município competente para o ISS da prestação de serviço. Parametrizar isso por hábito, sem verificar a regra aplicável, gera custo em dobro e risco de autuação do município.',
  },
  {
    title: 'Fator R e agenda clínica',
    icon: Calculator,
    text: 'Para quem a receita é a própria hora de atendimento, a relação entre folha e receita define a alíquota efetiva no Simples Nacional, e o cálculo é refeito mês a mês. A decisão de quanto pagar de pró-labore, tomada uma vez e esquecida, custa caro ao longo do ano.',
  },
  {
    title: 'Pró-labore e proteção previdenciária',
    icon: Coins,
    text: 'O psicólogo que atua como autônomo ou por PJ própria depende do pró-labore para contribuir ao INSS, manter aposentadoria e acessar auxílios. Retirar tudo como lucro isento barateia hoje e cobra caro amanhã, porque o tempo de contribuição não se recupera.',
  },
  {
    title: 'Convênios e plataformas de agenda',
    icon: Receipt,
    text: 'Repasses de convênio, plataformas de agendamento e pacotes de sessão precisam ser conciliados com a escrituração. O valor que entra na conta não é o valor da sessão, e essa diferença precisa estar visível na contabilidade.',
  },
  {
    title: 'Quando o consultório cresce',
    icon: TrendingUp,
    text: 'Adicionar outro profissional à PJ, contratar secretária, formar sociedade com colega ou abrir clínica coletiva muda o cenário societário e tributário. A estrutura precisa acompanhar o crescimento, e não o contrário.',
  },
]

// 5 Frentes de Atuação (textos verbatim na ordem Tributária, Contábil, Societária, Financeira e de Gestão, Trabalhista)
const FRENTES_ATUACAO = [
  {
    frente: 'Tributária',
    destaque: true,
    badge: 'Nossa especialidade',
    text: 'definição do formato de atuação e do regime, gestão mensal do Fator R no Simples Nacional e análise do efeito do ISS no atendimento à distância.',
  },
  {
    frente: 'Contábil',
    destaque: false,
    text: 'escrituração com controle de receita por paciente, por convênio e por plataforma, conciliação de repasses e demonstrações que reflitam o resultado real do consultório.',
  },
  {
    frente: 'Societária',
    destaque: false,
    text: 'constituição da sociedade limitada de sócio único, entrada de novo profissional na PJ, formação de sociedade entre psicólogos e estruturação da clínica coletiva.',
  },
  {
    frente: 'Financeira e de Gestão',
    destaque: false,
    text: 'leitura de retirada mensal efetiva, projeção de caixa com base na agenda, formação de preço da sessão e planejamento do momento de formalizar a PJ.',
  },
  {
    frente: 'Trabalhista',
    destaque: false,
    text: 'estruturação da contratação de secretária, estagiário e profissionais parceiros, com revisão de riscos e conformidade no eSocial quando há empregado.',
  },
]

// 3 Itens Por Que a PERES PERES (textos verbatim)
const POR_QUE_PERES_PERES = [
  {
    num: '1',
    title: 'Responsável técnico com dupla formação',
    icon: Scale,
    text: 'Rafael Peres Peres Nunes Altoé é contador (CRC 027704), advogado (OAB 87656), auditor (CNAI 10122) e professor. Regime tributário, contrato social e risco trabalhista do consultório são lidos juntos, na mesma mesa.',
  },
  {
    num: '2',
    title: 'Capacidade de produzir prova técnica',
    icon: FileCheck,
    text: 'A equipe conta com perita contábil formada em perícia judicial e em cálculos trabalhistas. Em discussão sobre retenções, repasses ou relação com profissional contratado, a produção técnica é interna.',
  },
  {
    num: '3',
    title: 'Postura conservadora',
    icon: ShieldCheck,
    text: 'Não veiculamos promessa de percentual de economia. Cada diagnóstico parte de auditoria documental dos números do profissional, e quando o formato atual já é o correto, dizemos que é.',
  },
]

// 5 Perguntas e Respostas do FAQ (textos verbatim)
const FAQ_ITEMS = [
  {
    question: 'Psicólogo pode ser MEI?',
    answer:
      'Não. A atividade de psicólogo não consta entre as ocupações permitidas ao MEI (Resolução CGSN nº 140/2018, Anexo XI), e o CNAE da atividade, 8650-0/03, não é autorizado para esse enquadramento. Abrir MEI com CNAE genérico para depois atender como psicólogo não formaliza a situação e cria risco fiscal. Os caminhos possíveis são a atuação como pessoa física, o empresário individual ou a sociedade limitada, e a escolha entre eles depende de faturamento, despesas e objetivo profissional.',
  },
  {
    question: 'Como tributar atendimento por videochamada para paciente de outro estado?',
    answer:
      'O ponto central é definir o município competente para o ISS da prestação de serviço, e essa definição depende da regra aplicável ao caso e do local da prestação. Não é uma regra única para todas as situações, e o atendimento à distância exige parametrização específica para não gerar cobrança em duplicidade nem omissão de recolhimento.',
  },
  {
    question: 'Como funciona o Fator R na prática?',
    answer:
      'É a razão entre a folha de pagamento, incluindo o pró-labore, dos últimos 12 meses, e a receita bruta dos últimos 12 meses. Resultado igual ou superior a 28% enquadra no Anexo III, de alíquotas menores. Abaixo disso, no Anexo V. O cálculo é refeito todo mês, então mudanças de pró-labore e contratação alteram a guia do mês seguinte.',
  },
  {
    question: 'Quanto de pró-labore devo retirar?',
    answer:
      'O valor precisa considerar dois efeitos ao mesmo tempo: o Fator R, que define o anexo do Simples Nacional e depende da folha em relação à receita, e a proteção previdenciária, que depende da contribuição sobre o pró-labore. Existe um ponto de equilíbrio entre pagar menos hoje e garantir contribuição para o futuro, e ele é diferente para cada faturamento.',
  },
  {
    question: 'Vocês emitem as guias e entregam as obrigações?',
    answer:
      'Sim. O acompanhamento mensal inclui apuração dos tributos, emissão das guias, entrega das obrigações acessórias e conferência dos repasses recebidos, com leitura do resultado do mês e não apenas do cumprimento da obrigação.',
  },
]

// Outras profissões regulamentadas (mesmo padrão das páginas de Médicos e Advogados)
const OUTRAS_PROFISSOES = [
  { name: 'Médicos', link: '/profissoes-regulamentadas/medicos' },
  { name: 'Advogados', link: '/profissoes-regulamentadas/advogados' },
  { name: 'Engenheiros', link: '/profissoes-regulamentadas/engenheiros' },
  { name: 'Arquitetos', link: '/profissoes-regulamentadas/arquitetos' },
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

export default function PsicologosSegment() {
  useSeo({
    title: 'Contabilidade para Psicólogos | PJ, Fator R e Retiradas | PERES PERES',
    description:
      'Contabilidade e consultoria para psicólogos: PJ unipessoal, Fator R, pró-labore e atendimento online. Atendimento em Brasília e no Brasil.',
    canonical: 'https://peresperes.com.br/profissoes-regulamentadas/psicologos',
  })

  // JSON-LD para Rich Snippet FAQPage e BreadcrumbList
  useEffect(() => {
    const scriptId = 'faq-jsonld-psicologos'
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
              name: 'Psicólogos',
              item: 'https://peresperes.com.br/profissoes-regulamentadas/psicologos',
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
          {/* Breadcrumb verbatim: Início > Segmentos > Profissões Regulamentadas > Psicólogos */}
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
            <span className="text-[#FAB319] font-medium">Psicólogos</span>
          </nav>

          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 border border-neutral-700 bg-neutral-900/60 px-3 py-1 rounded text-xs tracking-wider uppercase text-neutral-300 font-sans">
              <Brain className="h-3.5 w-3.5 text-[#FAB319]" />
              Profissões Regulamentadas
            </div>

            {/* H1 hero verbatim */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white leading-tight max-w-4xl">
              Contabilidade e consultoria para psicólogos
            </h1>

            {/* Parágrafo de abertura verbatim */}
            <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-3xl leading-relaxed font-sans">
              O psicólogo que formaliza sua pessoa jurídica, normalmente uma sociedade limitada de
              um só sócio, a chamada PJ unipessoal, ganha em organização e em margem, mas assume
              decisões técnicas que o formato não resolve sozinho: regime tributário, pró-labore e o
              enquadramento certo para quem vive da própria agenda de atendimentos. A PERES PERES
              cuida da contabilidade mensal e dessas decisões.
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
          SEÇÃO 1: DESAFIOS DO PSICÓLOGO (6 cards verbatim)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Peculiaridades da psicologia
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Desafios do psicólogo
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              A rotina tributária e societária do psicólogo exige critério técnico contínuo. Estas
              são as principais questões que impactam diretamente a rentabilidade e o caixa do
              consultório.
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
          SEÇÃO 2: COMO ATUAMOS COM O PSICÓLOGO (5 frentes verbatim)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Estrutura de atendimento
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Como atuamos com o psicólogo
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              O acompanhamento contábil mensal integra cinco frentes complementares, com foco na
              rotina clínica, societária e fiscal.
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
          SEÇÃO 3: POR QUE A PERES PERES (3 itens verbatim)
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
              fiscais do psicólogo.
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
              Dúvidas recorrentes sobre contabilidade para psicólogos
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
              Além de psicólogos, a PERES PERES oferece assessoria contábil e consultoria para
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
