import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { SegmentFaq } from '@/components/SegmentFaq'
import { useSeo } from '@/hooks/use-seo'
import { ProfessionExerciseForm } from '@/components/ProfessionExerciseForm'
import { MedicosCnaeSection } from '@/components/MedicosCnaeSection'
import { ContinueReading } from '@/components/ContinueReading'
import {
  Calculator,
  Coins,
  Scale,
  Stethoscope,
  Receipt,
  Building,
  FileCheck,
  ShieldCheck,
  ChevronRight,
  Phone,
  ArrowRight,
  UserCheck,
} from 'lucide-react'

// 6 Desafios do Médico (textos verbatim)
const DESAFIOS = [
  {
    title: 'Fator R na saúde',
    icon: Calculator,
    text: 'Folha e pró-labore definem se a atividade é tributada no Anexo III ou no Anexo V do Simples Nacional, e a diferença aparece todo mês. O Fator R é recalculado continuamente, então a decisão de quanto pagar de pró-labore tem efeito direto na alíquota, e quem olha isso apenas uma vez por ano paga mais do que deveria.',
  },
  {
    title: 'Pró-labore, distribuição de lucros e INSS',
    icon: Coins,
    text: 'Quanto retirar como pró-labore e quanto distribuir como lucro é decisão técnica, não escolha de conveniência. Ela mexe com imposto, com contribuição previdenciária, com aposentadoria e com o caixa disponível do médico, e as três coisas precisam ser olhadas juntas.',
  },
  {
    title: 'Pessoa física ou pessoa jurídica',
    icon: UserCheck,
    text: 'Atender como pessoa física e atender pela PJ não têm o mesmo efeito tributário nem o mesmo efeito previdenciário, e a escolha depende de quem paga, de quanto e de como. Receber de pessoa física, receber de hospital e receber de operadora são situações diferentes, e tratá-las com a mesma regra é erro recorrente.',
  },
  {
    title: 'MEI não é alternativa para o médico',
    icon: ShieldCheck,
    text: 'O MEI é restrito às ocupações expressamente listadas no Anexo XI da Resolução CGSN nº 140/2018, editado com base no art. 18-A da LC 123/2006, e a medicina não está entre elas. Além disso, o art. 18, § 5º-B, VII da LC 123/2006 trata a medicina como atividade de prestação de serviços tributada no Anexo III do Simples quando exercida por pessoa jurídica, hipótese incompatível com o regime unipessoal simplificado do MEI. Os caminhos reais são atuar como pessoa física ou constituir pessoa jurídica própria — sociedade limitada unipessoal ou sociedade de médicos — com enquadramento conforme o Fator R.',
  },
  {
    title: 'Plantões, consultório e telemedicina',
    icon: Stethoscope,
    text: 'Plantão em hospital, atendimento em consultório próprio, telemedicina e perícia geram receitas com tratamentos fiscais distintos. Sem escrituração organizada por fonte de receita, o imposto sai errado e o médico perde a capacidade de saber quanto ganha em cada frente.',
  },
  {
    title: 'Convênios, glosas e repasses',
    icon: Receipt,
    text: 'Prazos de repasse, retenções na fonte e glosas exigem controle financeiro que reflita o caixa real da PJ. O valor faturado não é o valor recebido, e essa diferença precisa estar visível na contabilidade.',
  },
  {
    title: 'Estrutura da PJ desde a abertura',
    icon: Building,
    text: 'Sociedade limitada de sócio único, enquadramento de CNAE, atividade registrada no conselho e responsabilidade patrimonial precisam ser desenhados na abertura. Corrigir estrutura depois custa mais caro do que desenhar antes, e alguns erros de constituição não têm solução retroativa.',
  },
]

// 5 Frentes de Atuação (textos verbatim na ordem Tributária, Contábil, Societária, Financeira e de Gestão, Trabalhista)
const FRENTES_ATUACAO = [
  {
    frente: 'Tributária',
    destaque: true,
    badge: 'Nossa especialidade',
    text: 'definição e revisão do regime, gestão mensal do Fator R e do enquadramento entre os Anexos III e V do Simples Nacional, comparação com Lucro Presumido e Lucro Real, e análise da fronteira entre pró-labore e distribuição de lucros.',
  },
  {
    frente: 'Contábil',
    destaque: false,
    text: 'escrituração separada por fonte de receita, com conciliação de convênio, particular, plantão e telemedicina, e demonstrações que reflitam o resultado real de cada frente.',
  },
  {
    frente: 'Societária',
    destaque: false,
    text: 'constituição da sociedade limitada de sócio único, definição do contrato social, adequação de CNAE e estruturação de acordos quando o médico passa a atuar com outros profissionais.',
  },
  {
    frente: 'Financeira e de Gestão',
    destaque: false,
    text: 'leitura de quanto o médico efetivamente retira por mês, projeção de caixa considerando prazos de repasse de convênio e formação de preço de consulta e procedimento.',
  },
  {
    frente: 'Trabalhista',
    destaque: false,
    text: 'enquadramento das pessoas que atuam no consultório, conformidade no eSocial e revisão de riscos quando o médico contrata equipe própria.',
  },
]

// 3 Razões Por Que a PERES PERES (textos verbatim)
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
    text: 'A equipe conta com perita contábil formada em perícia judicial e em cálculos trabalhistas. Em discussão sobre retenções, repasses de convênio ou relação com profissional contratado, a produção técnica é interna.',
  },
  {
    num: '3',
    title: 'Postura conservadora',
    icon: ShieldCheck,
    text: 'Não veiculamos promessa de percentual de economia. Cada análise parte de diagnóstico documental dos números do médico, e quando o regime atual já é o correto, dizemos que é.',
  },
]

// 6 Perguntas e Respostas do FAQ (textos verbatim)
const FAQ_ITEMS = [
  {
    question: 'Médico pode ser MEI?',
    answer:
      'Não. A medicina não consta do Anexo XI da Resolução CGSN nº 140/2018, lista fechada de ocupações autorizadas ao MEI. A via correta é a pessoa jurídica, como sociedade limitada unipessoal no Simples Nacional.',
  },
  {
    question: 'Qual o CNAE de médico?',
    answer:
      'O código mais comum para a atividade médica é 8630-5/03, atividade médica ambulatorial restrita a consultas. Clínicas com procedimentos usam códigos da classe 8630-5, e o enquadramento correto é verificado antes da abertura.',
  },
  {
    question: 'Como funciona o Fator R para médicos?',
    answer:
      'É a razão entre a folha de pagamento, incluindo o pró-labore, e a receita bruta dos últimos 12 meses. Com resultado igual ou superior a 28%, a medicina fica no Anexo III do Simples; abaixo disso, no Anexo V. O cálculo é refeito todo mês.',
  },
  {
    question: 'Qual o anexo do Simples para medicina?',
    answer:
      'A atividade médica é permitida no Simples Nacional (LC 123/2006, art. 17, V, "e") e é tributada no Anexo III ou no Anexo V, conforme o Fator R (LC 123/2006, art. 18, § 5º-B, VII).',
  },
  {
    question: 'Consulta médica tem presunção reduzida?',
    answer:
      'Não. No Lucro Presumido, a presunção de lucro de serviços é de 32% (Lei nº 9.249/1995, art. 15), e a medicina não tem percentual reduzido. A leitura de presunção reduzida costuma se confundir com o Fator R, que só vale dentro do Simples Nacional.',
  },
  {
    question: 'Médico pode emitir nota para plano de saúde?',
    answer:
      'Pode. A PJ do médico emite nota fiscal de serviços para a operadora pelo valor do repasse recebido, e a conciliação entre glosas, retenções e repasses precisa estar na escrituração do mês.',
  },
]

// Outras profissões regulamentadas (páginas planejadas)
const OUTRAS_PROFISSOES = [
  { name: 'Advogados', link: '/profissoes-regulamentadas/advogados' },
  { name: 'Psicólogos', link: '/profissoes-regulamentadas/psicologos' },
  { name: 'Engenheiros', link: '/profissoes-regulamentadas/engenheiros' },
  { name: 'Arquitetos', link: '/profissoes-regulamentadas/arquitetos' },
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

export default function MedicosSegment() {
  useSeo({
    title: 'Contabilidade para Médicos: Simples, Fator R e Pró-labore',
    description:
      'Contabilidade para médicos com PJ, Simples Nacional, Fator R, pró-labore e distribuição de lucros: como reduzir a carga sem risco de autuação.',
    canonical: 'https://peresperes.com.br/profissoes-regulamentadas/medicos',
  })

  // JSON-LD para Rich Snippet FAQPage e BreadcrumbList
  useEffect(() => {
    const scriptId = 'faq-jsonld-medicos'
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
              name: 'Médicos',
              item: 'https://peresperes.com.br/profissoes-regulamentadas/medicos',
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
          {/* Breadcrumb verbatim: Início > Áreas de atuação > Profissões Regulamentadas > Médicos */}
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
            <span className="text-[#FAB319] font-medium">Médicos</span>
          </nav>

          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 border border-neutral-700 bg-neutral-900/60 px-3 py-1 rounded text-xs tracking-wider uppercase text-neutral-300 font-sans">
              <Stethoscope className="h-3.5 w-3.5 text-[#FAB319]" />
              Profissões Regulamentadas
            </div>

            {/* H1 hero verbatim */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white leading-tight max-w-4xl">
              Contabilidade e consultoria para médicos
            </h1>

            {/* Parágrafo de abertura verbatim */}
            <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-3xl leading-relaxed font-sans">
              O médico que abre sua pessoa jurídica, em geral uma sociedade limitada de um único
              sócio, a chamada PJ unipessoal, descobre que a decisão que mais impacta o bolso não é
              a abertura em si, e sim o que vem depois: regime tributário, pró-labore e a fronteira
              entre distribuição de lucros e contribuição previdenciária. A PERES PERES cuida da
              contabilidade mensal e acompanha essas decisões todos os meses.
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
          BANNER INFORMATIVO DE TRANSIÇÃO: CLÍNICAS MÉDICAS
         ========================================================= */}
      <section className="bg-neutral-50 border-b border-neutral-200 py-4">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-neutral-700 font-sans">
            <span className="font-medium text-neutral-900">
              É dono de clínica ou consultório com equipe? Veja a página de Clínicas Médicas.
            </span>
            <Link
              to="/contabilidade-para-clinicas-medicas"
              className="inline-flex items-center gap-1.5 font-semibold text-black hover:text-neutral-700 underline decoration-[#FAB319] decoration-2 underline-offset-4 shrink-0"
            >
              Acessar Clínicas Médicas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <ProfessionExerciseForm
        title="Médico como pessoa física ou pessoa jurídica?"
        intro="A medicina pode ser exercida em nome próprio, como pessoa física, ou por meio de pessoa jurídica, em regra uma sociedade limitada unipessoal. Não existe a opção de MEI: a atividade não consta do Anexo XI da Resolução CGSN 140 de 2018, com redação da Resolução CGSN 165 de 2022. A escolha altera a tributação da receita do consultório, as retenções praticadas por tomadores pessoa jurídica e a possibilidade de deduzir as despesas da atividade."
        extraItems={[
          'O volume de despesas do consultório, como aluguel, secretária, equipamentos e materiais, que só são dedutíveis na pessoa jurídica.',
          'O Fator R, porque a medicina no Simples Nacional fica no Anexo III ou no Anexo V conforme a folha dos últimos doze meses alcançar 28% da receita.',
        ]}
      />

      {/* =========================================================
          SEÇÃO 1: DESAFIOS DO MÉDICO (6 cards)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Peculiaridades da atividade médica
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Desafios do médico
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              A rotina tributária e societária do médico exige critério técnico contínuo. Estas são
              as principais questões que impactam diretamente a rentabilidade e o caixa da atividade
              médica.
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

      {/* SEÇÃO: CNAE, REGIME TRIBUTÁRIO E ISS (componente dedicado) */}
      <MedicosCnaeSection />

      {/* =========================================================
          SEÇÃO 2: COMO ATUAMOS COM O MÉDICO (5 itens)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Estrutura de atendimento
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Como atuamos com o médico
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              O acompanhamento contábil mensal integra cinco frentes complementares, com foco na
              rotina médica, societária e fiscal.
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
              fiscais do médico.
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
              Além de médicos, a PERES PERES oferece assessoria contábil e consultoria para
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
        heading="Dúvidas recorrentes sobre contabilidade para médicos"
        items={FAQ_ITEMS}
      />

      <ContinueReading
        items={[
          {
            title: 'Clínicas médicas',
            description:
              'Quando a clínica se equipara a hospital, como fica o regime tributário e o que muda na estrutura quando entram exames e equipe de apoio.',
            to: '/contabilidade-para-clinicas-medicas',
            cta: 'Ver Clínicas médicas',
          },
          {
            title: 'Abertura e alteração de empresas',
            description:
              'Constituição da PJ do médico ou da sociedade de médicos, com enquadramento de CNAE, registro no CRM e escolha do regime tributário avaliados desde a abertura.',
            to: '/servicos#abertura-e-alteracao-de-empresas',
            cta: 'Ver Abertura e alteração de empresas',
          },
        ]}
      />
    </div>
  )
}
