import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useSeo } from '@/hooks/use-seo'
import { ProfessionExerciseForm } from '@/components/ProfessionExerciseForm'
import { AdvogadosCnaeSection } from '@/components/AdvogadosCnaeSection'
import { ContinueReading } from '@/components/ContinueReading'
import { SegmentFaq } from '@/components/SegmentFaq'
import {
  Scale,
  Receipt,
  MapPin,
  Building2,
  Users,
  TrendingUp,
  FileCheck,
  ShieldCheck,
  ChevronRight,
  Phone,
} from 'lucide-react'

// 6 Desafios do Escritório de Advocacia (textos verbatim)
const DESAFIOS = [
  {
    title: 'Honorários com retenção na fonte',
    icon: Receipt,
    text: 'Contratos com empresas e com órgãos públicos trazem retenção de IR e de contribuição previdenciária que precisa ser controlada e conciliada com a escrituração, mês a mês. Reter quando não deveria, ou deixar de reter quando a regra exige, gera contingência nos dois sentidos.',
  },
  {
    title: 'Honorários sucumbenciais',
    icon: Scale,
    text: 'Os honorários de sucumbência são direito autônomo do advogado e não se confundem com os honorários contratuais (Lei nº 8.906/1994, art. 22). Isso não significa que a escrituração possa tratá-los como receita igual à do contrato: o recebimento envolve encargos, custas e, em muitos casos, rateio com o cliente, e exige controle dedicado.',
  },
  {
    title: 'ISS e atuação em municípios diferentes',
    icon: MapPin,
    text: 'O ISS sobre serviços advocatícios é devido ao município competente, e a competência depende do estabelecimento prestador e das regras municipais. Patrocinar causas fora do domicílio do escritório muda a alíquota e o município competente, e parametrizar errado gera custo em dobro.',
  },
  {
    title: 'Sociedade de advogados e opção pelo Simples',
    icon: Building2,
    text: 'A sociedade de advogados tem registro obrigatório na OAB e não pode assumir forma mercantil (Lei nº 8.906/1994, art. 15). Desde a LC nº 147/2014, a sociedade de advogados pode optar pelo Simples Nacional, mas o enquadramento é sempre no Anexo IV (LC 123/2006, art. 18, § 5º-C, VII), em que a contribuição previdenciária patronal fica fora do DAS e precisa ser recolhida separadamente. Não há Fator R na advocacia, e a escolha entre atuar como pessoa física, como sociedade de advogados ou como sociedade limitada muda completamente a alíquota efetiva, decisão que precisa ser tomada antes da constituição, considerando a incidência da contribuição patronal fora do Simples.',
  },
  {
    title: 'Sócios, associados e correspondentes',
    icon: Users,
    text: 'O pagamento a advogado associado, a correspondente de outra comarca e a estagiário exige estrutura documental e fiscal correta. Contratação sem desenho adequado gera risco trabalhista e tributário, e o documento assinado, sozinho, não afasta a discussão quando a prática é diferente.',
  },
  {
    title: 'Estrutura e crescimento do escritório',
    icon: TrendingUp,
    text: 'LTDA de sócio único, entrada de novo sócio, abertura de filial em outro estado e o desenho patrimonial do escritório próprio são decisões societárias que têm efeito fiscal e de responsabilidade. Crescer sem estruturar transforma o escritório em um conjunto de contratos desconectados.',
  },
]

// 5 Frentes de Atuação (textos verbatim na ordem Tributária, Contábil, Societária, Financeira e de Gestão, Trabalhista)
const FRENTES_ATUACAO = [
  {
    frente: 'Tributária',
    destaque: true,
    badge: 'Nossa especialidade',
    text: 'definição do regime conforme o formato da atuação, enquadramento no Anexo IV do Simples Nacional quando essa for a opção, cálculo do DAS somado à contribuição previdenciária patronal recolhida fora do Simples, tratamento de honorários contratuais e sucumbenciais, e acompanhamento da Reforma Tributária aplicada a serviços advocatícios.',
  },
  {
    frente: 'Contábil',
    destaque: false,
    text: 'escrituração separada por origem de receita, com conciliação de honorários contratuais, sucumbenciais, custas e retenções, e demonstrações que reflitam o resultado real do escritório.',
  },
  {
    frente: 'Societária',
    destaque: false,
    text: 'constituição da sociedade limitada de sócio único, constituição e alterações da sociedade de advogados, entrada e saída de sócios, abertura de filial e acordos de sócios com regras de saída.',
  },
  {
    frente: 'Financeira e de Gestão',
    destaque: false,
    text: 'leitura de margem por área de atuação e por cliente, projeção de caixa diante do prazo entre êxito, alvará e recebimento, e definição de política de retirada dos sócios.',
  },
  {
    frente: 'Trabalhista',
    destaque: false,
    text: 'estruturação da contratação de associados, correspondentes, estagiários e equipe administrativa, com revisão de riscos e conformidade no eSocial.',
  },
]

// 3 Razões Por Que a PERES PERES (textos verbatim)
const POR_QUE_PERES_PERES = [
  {
    num: '1',
    title: 'Responsável técnico com dupla formação',
    icon: Scale,
    text: 'Rafael Peres Peres Nunes Altoé é contador (CRC 027704), advogado (OAB 87656), auditor (CNAI 10122) e professor. Ele atua nas duas frentes que o escritório de advocacia exige ao mesmo tempo: a leitura tributária do regime e a leitura societária da constituição.',
  },
  {
    num: '2',
    title: 'Capacidade de produzir prova técnica',
    icon: FileCheck,
    text: 'A equipe conta com perita contábil formada em perícia judicial e em cálculos trabalhistas. Em discussão sobre honorários, retenções, apuração de haveres entre sócios ou laudo em processo, a produção técnica é interna.',
  },
  {
    num: '3',
    title: 'Postura conservadora',
    icon: ShieldCheck,
    text: 'Não veiculamos promessa de percentual de economia. Cada análise parte de diagnóstico documental dos números do escritório, e quando o formato atual já é o adequado, dizemos que é.',
  },
]

// 6 Perguntas e Respostas do FAQ (textos verbatim)
const FAQ_ITEMS = [
  {
    question: 'Advogado pode ser MEI?',
    answer:
      'Não. A advocacia não consta do Anexo XI da Resolução CGSN nº 140/2018, lista fechada de ocupações autorizadas ao MEI. As vias possíveis são a atuação como pessoa física, a sociedade de advogados registrada na OAB ou a sociedade limitada, cada uma com regime e exigências próprios.',
  },
  {
    question: 'Advogado pode ser sócio de outra empresa?',
    answer:
      'Pode. Não há vedação ao advogado como sócio de empresa de outro segmento, e a participação em outras pessoas jurídicas é comum. O que a Lei nº 8.906/1994, art. 15, restringe é a forma da sociedade de advogados, que não pode assumir natureza mercantil de atividade estranha à advocacia.',
  },
  {
    question: 'Qual o regime tributário de uma sociedade de advogados?',
    answer:
      'Desde a LC nº 147/2014, a sociedade de advogados pode optar pelo Simples Nacional e é tributada no Anexo IV (LC 123/2006, art. 18, § 5º-C, VII), com a contribuição previdenciária patronal recolhida fora do DAS. Em regime normal, aplica-se o Lucro Presumido, com presunção de 32% para serviços (Lei nº 9.249/1995, art. 15).',
  },
  {
    question: 'Qual o CNAE de escritório de advocacia?',
    answer:
      'O CNAE principal é 6911-7/01, serviços de advocacia. Os códigos secundários dependem das atividades acessórias do escritório, e a tabela desta página lista os mais comuns antes da escolha do enquadramento.',
  },
  {
    question: 'Advogado pode optar pelo Simples Nacional?',
    answer:
      'Depende do formato. A sociedade de advogados pode optar desde a LC nº 147/2014 e fica no Anexo IV, com contribuição patronal fora do DAS. A sociedade unipessoal de advocacia (Lei nº 13.338/2016) segue o mesmo enquadramento do Anexo IV.',
  },
  {
    question: 'Como é feito o registro na OAB da sociedade?',
    answer:
      'O registro do ato constitucional é feito na OAB do estado da sede, com a inscrição OAB de todos os sócios (Lei nº 8.906/1994, art. 15). É esse registro que caracteriza a sociedade de advogados e define o enquadramento como sociedade simples.',
  },
]

// Outras profissões regulamentadas (mesmo padrão de rotas protegidas da página de Médicos)
const OUTRAS_PROFISSOES = [
  { name: 'Médicos', link: '/profissoes-regulamentadas/medicos' },
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

export default function AdvogadosSegment() {
  useSeo({
    title: 'Contabilidade para Advogados e Escritórios de Advocacia',
    description:
      'Contabilidade para advogados: honorários, retenções, ISS por município e sociedade de advogados, com as regras explicadas sem surpresas no caixa.',
    canonical: 'https://peresperes.com.br/profissoes-regulamentadas/advogados',
    ogTitle: 'Contabilidade para Advogados e Sociedades de Advocacia',
    ogDescription:
      'Contabilidade para advogados e sociedades de advocacia, com honorários, retenções, ISS e regras do regime aplicadas ao dia a dia do escritório.',
  })

  // JSON-LD para Rich Snippet FAQPage e BreadcrumbList
  useEffect(() => {
    const scriptId = 'faq-jsonld-advogados'
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
              name: 'Advogados',
              item: 'https://peresperes.com.br/profissoes-regulamentadas/advogados',
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
          {/* Breadcrumb verbatim: Início > Áreas de atuação > Profissões Regulamentadas > Advogados */}
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
            <span className="text-[#FAB319] font-medium">Advogados</span>
          </nav>

          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 border border-neutral-700 bg-neutral-900/60 px-3 py-1 rounded text-xs tracking-wider uppercase text-neutral-300 font-sans">
              <Scale className="h-3.5 w-3.5 text-[#FAB319]" />
              Profissões Regulamentadas
            </div>

            {/* H1 hero verbatim */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white leading-tight max-w-4xl">
              Contabilidade e consultoria para advogados
            </h1>

            {/* Parágrafo de abertura verbatim */}
            <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-3xl leading-relaxed font-sans">
              O advogado que estrutura sua pessoa jurídica, em geral uma sociedade limitada de sócio
              único, a chamada PJ unipessoal, precisa lidar com uma rotina tributária que o
              exercício da advocacia torna específica: honorários com retenção, sucumbência, ISS por
              município e a escolha de regime que muda a alíquota efetiva. A PERES PERES cuida da
              contabilidade mensal e da leitura tributária do escritório de advocacia.
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

      {/* FRASE DE TRANSIÇÃO: estrutura patrimonial do advogado, sem link */}
      <section className="bg-neutral-50 border-b border-neutral-200 py-4">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="text-sm text-neutral-700 font-sans">
            A estrutura patrimonial do advogado é decisão separada da sociedade de advogados e é
            tratada em atendimento próprio.
          </p>
        </div>
      </section>

      <ProfessionExerciseForm
        title="Advogado como pessoa física ou sociedade de advocacia?"
        intro="A advocacia pode ser exercida em nome próprio, como pessoa física, ou por meio de sociedade de advogados ou de sociedade unipessoal de advocacia, ambas previstas no artigo 15 da Lei 8.906 de 1994, com a redação dada pela Lei 13.247 de 2016, e registradas no Conselho Seccional da OAB. Não existe a opção de MEI: a atividade não consta do Anexo XI da Resolução CGSN 140 de 2018, com redação da Resolução CGSN 165 de 2022, e o artigo 16 do Estatuto impede o exercício da advocacia em forma empresarial."
        extraItems={[
          'Se a opção pelo Simples Nacional levará a sociedade ao Anexo IV, em que o DAS não inclui a contribuição previdenciária patronal, recolhida separadamente, conforme a Lei Complementar 123 de 2006 com a alteração da Lei Complementar 147 de 2014.',
          'Se o município reconhece o ISS fixo da sociedade uniprofissional, hipótese admitida pelo Superior Tribunal de Justiça no Tema 1.323, julgado pela Primeira Seção em 2025, e pela Súmula 663 do Supremo Tribunal Federal, que declarou recebidos pela Constituição os parágrafos 1 e 3 do artigo 9 do Decreto-Lei 406 de 1968.',
        ]}
      />

      {/* SEÇÃO: CNAE, REGIME TRIBUTÁRIO E ISS (componente dedicado) */}
      <AdvogadosCnaeSection />

      {/* =========================================================
          SEÇÃO 1: DESAFIOS DO ESCRITÓRIO (6 cards)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Peculiaridades da advocacia
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Desafios do escritório
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              A rotina tributária e societária do advogado exige critério técnico contínuo. Estas
              são as principais questões que impactam diretamente a rentabilidade e o caixa do
              escritório.
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
          SEÇÃO 2: COMO ATUAMOS NO ESCRITÓRIO (5 itens)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Estrutura de atendimento
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Como atuamos no escritório
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              O acompanhamento contábil mensal integra cinco frentes complementares, com foco na
              rotina jurídica, societária e fiscal.
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
              fiscais do advogado.
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
              Além de advogados, a PERES PERES oferece assessoria contábil e consultoria para
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
        heading="Dúvidas recorrentes sobre contabilidade para advogados"
        items={FAQ_ITEMS}
      />

      <ContinueReading
        items={[
          {
            title: 'Abertura e alteração de empresas',
            description:
              'Constituição da sociedade de advogados ou da PJ unipessoal do advogado, com escolha do regime tributário e registro na OAB avaliados antes do pedido na Junta Comercial.',
            to: '/servicos#abertura-e-alteracao-de-empresas',
            cta: 'Ver Abertura e alteração de empresas',
          },
          {
            title: 'Serviços',
            description:
              'Conheça os serviços tributários e de contabilidade mensal da PERES PERES Consultoria & Contabilidade, do acompanhamento rotineiro à consultoria especializada.',
            to: '/servicos#planos-de-acompanhamento',
            cta: 'Ver Serviços',
          },
        ]}
      />
    </div>
  )
}
