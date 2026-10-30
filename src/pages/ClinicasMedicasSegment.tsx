import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useSeo } from '@/hooks/use-seo'
import {
  Calculator,
  Building,
  Coins,
  Cpu,
  Layers,
  Users2,
  FileCheck,
  Scale,
  ShieldCheck,
  ChevronRight,
  Phone,
  ArrowRight,
  Stethoscope,
} from 'lucide-react'

// 6 Desafios da Clínica Médica (textos verbatim)
const DESAFIOS = [
  {
    title: 'Enquadramento e Fator R',
    icon: Calculator,
    text: 'A atividade médica é permitida no Simples Nacional (LC 123/2006, art. 17, V, "e"). A clínica é tributada no Anexo III ou no Anexo V conforme o Fator R, a relação entre folha e receita dos últimos 12 meses. Fator R de 28% ou mais conduz ao Anexo III, de alíquota menor. Como o cálculo é refeito todo mês, decisões de contratação e de pró-labore mudam a guia do mês seguinte.',
  },
  {
    title: 'Equiparação hospitalar',
    icon: Building,
    text: 'Clínicas com estrutura de internação ou atendimento em regime hospitalar podem ser equiparadas a hospital para efeitos de PIS e COFINS, com base na Lei nº 10.865/2004. O enquadramento altera o regime de apuração e o aproveitamento de créditos sobre insumos. É análise técnica caso a caso, que depende da estrutura física, do tipo de atendimento e da documentação da clínica, e que a maioria dos escritórios não avalia.',
  },
  {
    title: 'Pró-labore, distribuição de lucros e INSS',
    icon: Coins,
    text: 'A divisão entre pró-labore e distribuição de lucros define a contribuição previdenciária dos médicos sócios, o valor disponível para retirada e a proteção previdenciária de cada um. É decisão técnica recorrente, não escolha de conveniência.',
  },
  {
    title: 'Equipamentos, reformas e insumos',
    icon: Cpu,
    text: 'O crédito de tributos sobre equipamentos, reformas e insumos depende do regime adotado. No Simples Nacional não há crédito desses tributos para a clínica, no Lucro Presumido o aproveitamento é limitado e no Lucro Real é mais amplo. A comparação entre regimes precisa considerar esse efeito, não apenas a alíquota da guia.',
  },
  {
    title: 'Convênios e operadoras',
    icon: Layers,
    text: 'Retenções, glosas e prazos de repasse das operadoras afetam o caixa e exigem conciliação entre o valor repassado e a receita escriturada. Sem esse controle, o faturamento registrado deixa de refletir o que efetivamente entrou.',
  },
  {
    title: 'Corpo clínico sem vínculo societário',
    icon: Users2,
    text: 'A presença de médicos que atendem na clínica sem participação societária exige estruturação prévia, com definição de contrato, de responsabilidades e de tratamento fiscal. Resolver isso depois da fiscalização custa mais caro do que desenhar antes.',
  },
]

// 5 Frentes de Atuação (textos verbatim)
const FRENTES_ATUACAO = [
  {
    frente: 'Tributária',
    destaque: true,
    badge: 'Nossa especialidade',
    text: 'Gestão mensal do Fator R e do enquadramento entre os Anexos III e V do Simples Nacional, comparação com Lucro Presumido e Lucro Real, avaliação de equiparação hospitalar e acompanhamento da Reforma Tributária aplicada a serviços de saúde.',
  },
  {
    frente: 'Contábil',
    destaque: false,
    text: 'Escrituração adequada à rotina da clínica, com conciliação de receitas por convênio, por atendimento particular e por procedimento, e demonstrações que servem para decisão e para apresentação a banco e a operadora.',
  },
  {
    frente: 'Societária',
    destaque: false,
    text: 'Estruturação da participação dos médicos sócios, elaboração de acordo de sócios e definição do formato contratual dos profissionais que atendem sem vínculo societário.',
  },
  {
    frente: 'Financeira e de Gestão',
    destaque: false,
    text: 'Leitura de margem por procedimento, controle de glosas e de prazos de repasse, formação de preço da tabela própria e projeção de caixa da clínica.',
  },
  {
    frente: 'Trabalhista',
    destaque: false,
    text: 'Folha da equipe técnica, enquadramento sindical, conformidade no eSocial e acompanhamento dos riscos de vínculo com profissionais que atuam na clínica.',
  },
]

// 3 Razões Por Que a PERES PERES (textos verbatim)
const POR_QUE_PERES_PERES = [
  {
    num: '1',
    title: 'Responsável técnico com dupla formação',
    icon: Scale,
    text: 'Rafael Peres Peres Nunes Altoé é contador (CRC 027704), advogado (OAB 87656), auditor (CNAI 10122) e professor. A estrutura da clínica envolve decisão societária e decisão tributária ao mesmo tempo, e as duas leituras estão na mesma mesa.',
  },
  {
    num: '2',
    title: 'Capacidade de produzir prova técnica',
    icon: FileCheck,
    text: 'A equipe conta com perita contábil formada em perícia judicial e em cálculos trabalhistas. Quando a clínica precisa de laudo, parecer ou demonstração técnica, a produção é interna.',
  },
  {
    num: '3',
    title: 'Postura conservadora',
    icon: ShieldCheck,
    text: 'Não veiculamos promessa de percentual de economia. Cada diagnóstico parte de auditoria documental dos números da clínica, e quando o estudo não sustenta determinada tese, dizemos que não sustenta.',
  },
]

// 5 Perguntas e Respostas do FAQ (textos verbatim)
const FAQ_ITEMS = [
  {
    question: 'Clínica médica pode ser Simples Nacional?',
    answer:
      'Sim. A atividade médica é permitida no Simples Nacional (LC 123/2006, art. 17, V, "e"). A clínica é tributada nos Anexos III ou V, conforme o Fator R. A escolha entre Simples, Lucro Presumido e Lucro Real depende dos números da clínica: faturamento, folha, margem e volume de despesas com insumos e equipamentos.',
  },
  {
    question: 'O que é Fator R e por que ele importa tanto para clínica médica?',
    answer:
      'É a razão entre a folha de pagamento e a receita bruta dos últimos 12 meses. Quando o resultado é igual ou superior a 28%, a clínica é tributada no Anexo III, com alíquotas menores. Abaixo disso, no Anexo V. O percentual é recalculado mês a mês, então contratação, pró-labore e distribuição de lucros afetam a guia do mês seguinte.',
  },
  {
    question: 'O que é equiparação hospitalar e vale a pena para a minha clínica?',
    answer:
      'É o enquadramento em que clínicas com estrutura de internação ou atendimento em regime hospitalar são tratadas como hospital para efeitos de PIS e COFINS, com base na Lei nº 10.865/2004. Pode alterar o regime de apuração e o aproveitamento de créditos sobre insumos, mas depende da estrutura física, do tipo de atendimento e da documentação, e deve ser avaliada tecnicamente caso a caso.',
  },
  {
    question: 'A clínica aproveita crédito sobre equipamentos e insumos?',
    answer:
      'Depende do regime. No Simples Nacional não há crédito desses tributos. No Lucro Presumido o aproveitamento é limitado. No Lucro Real é mais amplo, e o crédito é recorrentemente perdido por erro de enquadramento dos insumos.',
  },
  {
    question: 'Vocês atendem clínicas em todo o Brasil ou só em Brasília?',
    answer:
      'A sede é em Brasília/DF, com atendimento em todo o Brasil, de forma presencial ou remota.',
  },
]

// Demais segmentos atendidos pelo escritório
const OUTROS_SEGMENTOS = [
  { name: 'Médicos e Profissionais da Saúde', link: '/contabilidade-para-medicos' },
  { name: 'Startups e Empresas de Tecnologia', link: '/servicos' },
  { name: 'Profissões Regulamentadas', link: '/servicos' },
  { name: 'Holdings Familiares e Patrimoniais', link: '/servicos' },
  { name: 'Educação e Treinamentos', link: '/servicos' },
  { name: 'Publicidade e Comunicação', link: '/servicos' },
  { name: 'Agências de Viagem', link: '/servicos' },
  { name: 'E-commerces', link: '/servicos' },
  { name: 'MEIs e Profissionais Liberais', link: '/servicos' },
]

export default function ClinicasMedicasSegment() {
  useSeo({
    title: 'Contabilidade para Clínicas Médicas | Consultoria Tributária em Brasília | PERES PERES',
    description:
      'Contabilidade e consultoria para clínicas médicas: gestão do Fator R no Simples Nacional, equiparação hospitalar e créditos sobre insumos. Atendimento em Brasília e no Brasil.',
    canonical: 'https://peresperes.com.br/contabilidade-para-clinicas-medicas',
  })

  // JSON-LD para Rich Snippet FAQPage e BreadcrumbList
  useEffect(() => {
    const scriptId = 'faq-jsonld-clinicas-medicas'
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
              name: 'Clínicas Médicas',
              item: 'https://peresperes.com.br/contabilidade-para-clinicas-medicas',
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
            <span className="text-[#FAB319] font-medium">Clínicas Médicas</span>
          </nav>

          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 border border-neutral-700 bg-neutral-900/60 px-3 py-1 rounded text-xs tracking-wider uppercase text-neutral-300 font-sans">
              <Stethoscope className="h-3.5 w-3.5 text-[#FAB319]" />
              Segmento Especializado
            </div>

            {/* H1 obrigatório */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white leading-tight max-w-4xl">
              Contabilidade e consultoria tributária para clínicas médicas
            </h1>

            {/* Parágrafo de abertura verbatim */}
            <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-3xl leading-relaxed font-sans">
              Clínicas médicas operam com carga tributária alta, folha de equipe técnica relevante e
              um regime próprio de enquadramento, em que o Fator R define a alíquota do Simples
              Nacional mês a mês. A PERES PERES atende esse segmento com contabilidade mensal
              completa e consultoria tributária aplicada à rotina da clínica, incluindo a avaliação
              de equiparação hospitalar quando a estrutura atende aos requisitos.
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
          BANNER INFORMATIVO DE TRANSIÇÃO: CONSULTÓRIO / MÉDICO PF
         ========================================================= */}
      <section className="bg-neutral-50 border-b border-neutral-200 py-4">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-neutral-700 font-sans">
            <span className="font-medium text-neutral-900">
              É médico atuando em consultório próprio ou como pessoa física? Veja a página de
              Médicos.
            </span>
            <Link
              to="/contabilidade-para-medicos"
              className="inline-flex items-center gap-1.5 font-semibold text-black hover:text-neutral-700 underline decoration-[#FAB319] decoration-2 underline-offset-4 shrink-0"
            >
              Acessar página de Médicos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          SEÇÃO 1: DESAFIOS DA CLÍNICA MÉDICA (6 cards)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Peculiaridades do setor
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Desafios da clínica médica
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              A rotina tributária e societária de uma clínica exige leitura técnica constante. Estas
              são as principais questões que impactam diretamente a rentabilidade e o caixa do
              negócio.
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
          SEÇÃO 2: COMO ATUAMOS NA CLÍNICA MÉDICA (5 itens)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Estrutura de atendimento
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Como atuamos na clínica médica
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              O acompanhamento contábil mensal integra cinco frentes complementares, com foco na
              rotina assistencial e administrativa da clínica.
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
              Ver planos de acompanhamento (Essential, Premium e On Demand) →
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
              fiscais da clínica.
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
              Dúvidas recorrentes sobre contabilidade para clínicas médicas
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
              Além de clínicas médicas, a PERES PERES oferece contabilidade e consultoria
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
