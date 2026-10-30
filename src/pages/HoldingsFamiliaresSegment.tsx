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
  Coins,
  FileText,
  Users2,
  FileCheck2,
  BookOpenCheck,
  Scale,
  FileCheck,
  ShieldCheck,
  ChevronRight,
  Phone,
  Landmark,
  ArrowRight,
} from 'lucide-react'

// 6 Desafios da Estruturacao Patrimonial (textos verbatim)
const DESAFIOS = [
  {
    title: 'Desenho da estrutura',
    icon: Layers,
    text: 'Tipo societário, formato das participações, usufruto, administração e cláusulas de proteção têm efeitos fiscais e sucessórios distintos. A estrutura que funciona para um patrimônio imobiliário raramente é a mesma que funciona para participações em empresas operacionais.',
  },
  {
    title: 'Tributação na hora da integralização',
    icon: Coins,
    text: 'A transferência de bens para a holding não é operação neutra por definição. Imóveis, participações e outros ativos podem gerar discussão sobre incidência tributária no momento da entrada, e o desenho correto da operação é o que evita esse custo depois, quando ele já não tem solução contratual.',
  },
  {
    title: 'Doação, sucessão e inventário',
    icon: FileText,
    text: 'A antecipação da sucessão envolve doação, com efeitos próprios, e o inventário posterior tem custo e prazo que dependem de como a estrutura foi montada. Comparar o custo da estruturação com o custo do inventário que ela evita é a análise mínima antes de decidir.',
  },
  {
    title: 'Governança e conflito entre herdeiros',
    icon: Users2,
    text: 'A holding é também instrumento de governança: define quem administra, como se decide, quem entra e como se sai. Estrutura desenhada apenas para reduzir imposto, sem regra de governança, costuma terminar em disputa judicial entre herdeiros.',
  },
  {
    title: 'Integralização e sucessão feitas pela metade',
    icon: FileCheck2,
    text: 'Holding constituída com bem integralizado sem registro, sem avaliação adequada ou sem atualização do contrato social é estrutura que existe no papel e não protege no mundo real. A execução formal é parte da solução, não detalhe.',
  },
  {
    title: 'Manutenção e escrituração',
    icon: BookOpenCheck,
    text: 'Depois de constituída, a holding precisa de escrituração, apuração e obrigações acessórias em dia. Holding sem contabilidade regular deixa de ser proteção patrimonial e passa a ser passivo tributário com nome diferente.',
  },
]

// 5 Frentes de Atuacao (textos verbatim na ordem exata: Tributaria, Contabil, Societaria, Financeira e de Gestao, Trabalhista)
const FRENTES_ATUACAO = [
  {
    frente: 'Tributária',
    destaque: true,
    badge: 'Nossa especialidade',
    text: 'análise do impacto fiscal da integralização, doações e sucessão, comparação entre cenários e definição de desenho que considere o custo tributário da entrada e da saída dos bens.',
  },
  {
    frente: 'Contábil',
    destaque: false,
    text: 'escrituração da holding e das empresas participantes, com demonstrações que reflitam corretamente as participações societárias e a movimentação patrimonial.',
  },
  {
    frente: 'Societária',
    destaque: false,
    text: 'elaboração do contrato social e das cláusulas de governança, doação de quotas com reserva de usufruto, acordo de sócios e instrumentos de planejamento sucessório, incluindo a avaliação técnica exigida na integralização de bens.',
  },
  {
    frente: 'Financeira e de Gestão',
    destaque: false,
    text: 'leitura do custo de manutenção da estrutura e comparação com o custo do inventário que ela evita, além de organização do fluxo de rendimentos dos bens que compõem a holding.',
  },
  {
    frente: 'Trabalhista',
    destaque: false,
    text: 'enquadramento das pessoas que atuam na administração da holding e nas empresas participantes, com atenção ao pró-labore dos administradores.',
  },
]

// 3 Razoes Por Que a PERES PERES (textos verbatim)
const POR_QUE_PERES_PERES = [
  {
    num: '1',
    title: 'Responsável técnico com dupla formação',
    icon: Scale,
    text: 'Rafael Peres Peres Nunes Altoé é contador (CRC 027704), advogado (OAB 87656), auditor (CNAI 10122) e professor. Holding é, por definição, uma operação que exige leitura societária e tributária ao mesmo tempo, e as duas formações estão na mesma mesa.',
  },
  {
    num: '2',
    title: 'Capacidade de produzir prova técnica',
    icon: FileCheck,
    text: 'A equipe conta com perita contábil formada em perícia judicial e em cálculos trabalhistas. A avaliação de bens na integralização e a apuração de haveres exigem laudo técnico, e essa produção é interna.',
  },
  {
    num: '3',
    title: 'Postura conservadora',
    icon: ShieldCheck,
    text: 'Não veiculamos promessa de percentual de economia. Cada diagnóstico parte de auditoria documental do patrimônio e dos números da família, e quando a estrutura não se justifica, dizemos que não se justifica.',
  },
]

// 5 Perguntas e Respostas do FAQ (textos verbatim)
const FAQ_ITEMS = [
  {
    question: 'Vale a pena constituir uma holding familiar?',
    answer:
      'Depende do patrimônio, do perfil dos bens, da quantidade de herdeiros e do objetivo da família. A holding faz sentido quando organiza a sucessão, reduz conflito e evita um custo maior no futuro. Quando o patrimônio é pequeno, o custo de manutenção pode superar o benefício, e é isso que a análise precisa mostrar antes de qualquer constituição.',
  },
  {
    question: 'Como funciona a transferência de imóveis para a holding?',
    answer:
      'Os imóveis são integralizados ao capital social, com avaliação e registro, e a operação exige atenção à incidência tributária e à documentação de cada matrícula. A definição do desenho antes da operação é o que evita custo e retrabalho no cartório e no registro.',
  },
  {
    question: 'A holding substitui o testamento?',
    answer:
      'Não. A holding organiza e antecipa a sucessão pela via societária, com regras de governança e transmissão de quotas. O testamento disciplina o que está fora da estrutura. As duas ferramentas são complementares, não excludentes.',
  },
  {
    question: 'Qual o custo de manutenção da holding?',
    answer:
      'Há custo de constituição, de avaliação e registro, e custo recorrente de contabilidade, apuração e obrigações acessórias. A decisão deve comparar esse custo com o que a estrutura evita em inventário, conflito e carga tributária futura.',
  },
  {
    question: 'Holding reduz imposto imediatamente?',
    answer:
      'Não necessariamente. O ganho da estruturação está no desenho da sucessão, na organização patrimonial e na eficiência da transmissão, e não em uma redução automática de carga. Qualquer efeito tributário depende do caso concreto e precisa ser demonstrado antes da operação.',
  },
]

// Demais segmentos atendidos pelo escritorio
const OUTROS_SEGMENTOS = [
  { name: 'Advogados (Profissões Regulamentadas)', link: '/profissoes-regulamentadas/advogados' },
  { name: 'Médicos (Profissões Regulamentadas)', link: '/profissoes-regulamentadas/medicos' },
  { name: 'Psicólogos (Profissões Regulamentadas)', link: '/profissoes-regulamentadas/psicologos' },
  {
    name: 'Engenheiros (Profissões Regulamentadas)',
    link: '/profissoes-regulamentadas/engenheiros',
  },
  { name: 'Clínicas Médicas e Saúde', link: '/contabilidade-para-clinicas-medicas' },
  { name: 'Startups e Empresas de Tecnologia', link: '/contabilidade-para-startups-e-tech' },
  { name: 'Educação e Treinamentos', link: '/contabilidade-para-educacao-e-treinamentos' },
  { name: 'Publicidade e Comunicação', link: '/contabilidade-para-agencias-de-publicidade' },
  { name: 'Agências de Viagem', link: '/contabilidade-para-agencias-de-viagem' },
  { name: 'E-commerce', link: '/contabilidade-para-ecommerce' },
  { name: 'MEIs e Profissionais Liberais', link: '/servicos#segmentos' },
]

export default function HoldingsFamiliaresSegment() {
  useSeo({
    title: 'Holdings Familiares e Patrimoniais | Consultoria em Brasília | PERES PERES',
    description:
      'Estruturação de holdings familiares e patrimoniais: desenho societário, sucessão e impacto fiscal avaliados juntos. Atendimento em Brasília e em todo o Brasil.',
    canonical: 'https://peresperes.com.br/holdings-familiares-e-patrimoniais',
  })

  // JSON-LD para Rich Snippet FAQPage e BreadcrumbList
  useEffect(() => {
    const scriptId = 'faq-jsonld-holdings-familiares'
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
              name: 'Holdings Familiares e Patrimoniais',
              item: 'https://peresperes.com.br/holdings-familiares-e-patrimoniais',
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
            <span className="text-[#FAB319] font-medium">Holdings Familiares e Patrimoniais</span>
          </nav>

          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 border border-neutral-700 bg-neutral-900/60 px-3 py-1 rounded text-xs tracking-wider uppercase text-neutral-300 font-sans">
              <Landmark className="h-3.5 w-3.5 text-[#FAB319]" />
              Segmento Especializado
            </div>

            {/* H1 obrigatorio */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white leading-tight max-w-4xl">
              Estruturação de holdings familiares e planejamento patrimonial
            </h1>

            {/* Paragrafo de abertura verbatim */}
            <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-3xl leading-relaxed font-sans">
              Patrimônio construído em uma geração pode virar litígio e passivo tributário na
              seguinte. A estruturação de holding é o instrumento para organizar bens, empresas e
              sucessão, mas só entrega resultado quando o desenho societário e o impacto fiscal são
              avaliados juntos, na mesma operação.
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
              A estruturação da holding é conduzida dentro da frente de Estruturação Societária.
            </span>
            <Link
              to="/servicos#servicos-avulsos"
              className="inline-flex items-center gap-1.5 font-semibold text-black hover:text-neutral-700 underline decoration-[#FAB319] decoration-2 underline-offset-4 shrink-0"
            >
              Conhecer a frente societária
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECAO 1: DESAFIOS DA ESTRUTURACAO PATRIMONIAL (6 cards)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Peculiaridades do setor
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Desafios da estruturação patrimonial
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              A organização de bens familiares e a antecipação sucessória demandam leitura
              multidisciplinar para assegurar proteção efetiva e evitar custos desnecessários.
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
          SECAO 2: COMO ATUAMOS NA HOLDING FAMILIAR (5 itens)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Estrutura de atendimento
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Como atuamos na holding familiar
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              O acompanhamento da PERES PERES integra cinco frentes complementares, com foco na
              perenidade do patrimônio e na prevenção de litígios.
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

          {/* Links para servicos e estruturacao societaria */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 text-sm font-sans">
            <Link
              to="/servicos"
              className="inline-flex items-center font-semibold text-black hover:text-neutral-700 underline decoration-[#FAB319] decoration-2 underline-offset-4"
            >
              Ver planos de acompanhamento →
            </Link>
            <span className="hidden sm:inline text-neutral-300">|</span>
            <Link
              to="/servicos#servicos-avulsos"
              className="inline-flex items-center text-neutral-700 hover:text-black underline decoration-neutral-300 hover:decoration-black decoration-1 underline-offset-4"
            >
              A estruturação da holding é conduzida dentro da frente de Estruturação Societária.
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
              Segurança técnica, laudos internos e independência para estruturar arranjos
              patrimoniais perenes.
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
              Dúvidas recorrentes sobre holdings familiares e patrimoniais
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
              Além de holdings familiares e patrimoniais, a PERES PERES oferece contabilidade e
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
