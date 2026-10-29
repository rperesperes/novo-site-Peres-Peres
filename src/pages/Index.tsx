import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  Award,
  Scale,
  FileText,
  RefreshCcw,
  Users2,
  Layers,
  TrendingUp,
} from 'lucide-react'
import rafaelImg from '@/assets/foto-melhorada-por-ia-892a9.png'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Quatro pilares de serviços (resumo para a Home)
const HOME_SERVICOS_PILARES = [
  {
    title: 'Consultoria Tributária',
    shortDesc:
      'Planejamento fiscal estratégico, enquadramento de regime, Fator R e orientação técnica na Reforma Tributária.',
    icon: FileText,
    link: '/servicos',
    linkText: 'Saiba mais sobre Consultoria Tributária',
  },
  {
    title: 'Recuperação de Créditos',
    shortDesc:
      'Diagnóstico minucioso dos últimos 5 anos, aplicação de teses consolidadas e restituição ou compensação administrativa.',
    icon: RefreshCcw,
    link: '/servicos',
    linkText: 'Saiba mais sobre Recuperação de Créditos',
  },
  {
    title: 'Consultoria Trabalhista',
    shortDesc:
      'Planejamento de folha de pagamento, adequação de pró-labore, conformidade no eSocial e apoio em rescisões.',
    icon: Users2,
    link: '/servicos',
    linkText: 'Saiba mais sobre Consultoria Trabalhista',
  },
  {
    title: 'Inteligência Financeira e Fluxo de Caixa',
    shortDesc:
      'Modelagem de cenários, dashboards de indicadores e projeção de caixa que traduzem a apuração contábil em decisão de negócio. Inclui revisão de precificação, análise de margem por serviço e planejamento de distribuição de lucros com eficiência tributária.',
    icon: TrendingUp,
    link: '/servicos/inteligencia-financeira',
    linkText: 'Saiba mais sobre Inteligência Financeira',
  },
]

// Três planos de acompanhamento (resumo de uma linha cada para a Home)
const HOME_PLANOS = [
  {
    name: 'Essential',
    tagline: 'Para empresas menores e mais simples com rotinas fiscais e contábeis essenciais.',
    badge: 'Enxuto',
  },
  {
    name: 'Premium',
    tagline:
      'O plano completo, com acompanhamento próximo, inteligência fiscal e micro consultorias periódicas.',
    badge: 'Mais Escolhido',
    highlight: true,
  },
  {
    name: 'On Demand',
    tagline:
      'Equipe multidisciplinar sob demanda para projetos pontuais, perícias e alta complexidade.',
    badge: 'Sob Medida',
  },
]

// Segmentos atendidos por escritório contábil em Brasília
const HOME_SEGMENTOS_ATUACAO = [
  'Clínicas e Profissionais da Saúde',
  'Profissões Regulamentadas',
  'Holdings Familiares e Patrimoniais',
  'E-commerces',
  'Agências de Viagem',
  'Educação e Treinamentos',
  'Publicidade e Comunicação',
]

export default function Index() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section - Arquitetura monocromática elegante com ponto focal restrito no botão */}
      <section className="relative flex items-center justify-center overflow-hidden bg-black text-white border-b border-neutral-800 min-h-[55vh] md:min-h-[60vh]">
        <div className="container mx-auto px-4 py-16 md:py-20 relative z-10 w-full">
          <div className="w-full space-y-6 md:space-y-7 animate-fade-in-up">
            <div className="inline-block border border-neutral-700 px-3 py-1 rounded text-xs tracking-wider uppercase text-neutral-300">
              PERES PERES Consultoria &amp; Contabilidade
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white leading-tight max-w-4xl">
              Consultoria e Contabilidade
              <br />
              de Brasília para todo o Brasil
            </h1>

            <p className="text-base md:text-lg text-neutral-300 max-w-2xl leading-relaxed">
              Desde 2017, trabalhamos para que nossos clientes, empresas e donos de negócios,
              cresçam com segurança através de uma contabilidade de excelência.
            </p>

            {/* Ponto focal único da tela no Hero: Botão com #FAB319 centralizado */}
            <div className="flex justify-center pt-2">
              <Button
                size="lg"
                className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-base h-12 px-8 border-none"
                asChild
              >
                <Link to="/contato">Agendar Consulta Inicial</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Bloco Institucional 1 - Transição personalizada antes de Serviços */}
      <section className="py-8 md:py-10 bg-neutral-50/50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="font-sans text-xl sm:text-2xl md:text-3xl text-neutral-900 leading-relaxed font-normal">
            E como nenhum profissional e nenhuma empresa é igual a outra,{' '}
            <strong>buscamos conhecer a fundo</strong>, nos detalhes,{' '}
            <strong>a história, os desafios e as oportunidades de negócio</strong> de cada um dos
            nossos clientes. Este é o primeiro passo para o que nos propomos:{' '}
            <strong className="underline">oferecer o melhor</strong>.
          </p>
        </div>
      </section>

      {/* =========================================================
          PARTE 2.1: BLOCO DE SERVIÇOS (Três Pilares Resumidos)
         ========================================================= */}
      <section className="py-10 md:py-12 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block mb-2">
                Nossos Pilares Técnicos
              </span>
              <h2 className="text-3xl md:text-4xl font-sans font-bold text-black">
                Soluções Estratégicas em Consultoria
              </h2>
              <p className="text-neutral-600 text-base md:text-lg mt-3 leading-relaxed">
                Abordagem pautada em conformidade legal, auditoria documental e inteligência
                tributária estruturada.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-neutral-900 text-black hover:bg-neutral-100 shrink-0 text-sm font-medium"
              asChild
            >
              <Link to="/servicos">
                Ver todos os serviços <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOME_SERVICOS_PILARES.map((servico, idx) => {
              const Icon = servico.icon
              return (
                <Card
                  key={idx}
                  className="border border-neutral-200 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col justify-between"
                >
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-black" />
                    </div>
                    <CardTitle className="text-xl text-black leading-snug">
                      {servico.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                    <CardDescription className="text-sm text-neutral-600 leading-relaxed">
                      {servico.shortDesc}
                    </CardDescription>
                    <div className="pt-2 border-t border-neutral-100">
                      <Link
                        to={servico.link}
                        className="inline-flex items-center text-xs font-semibold text-black hover:text-neutral-700 underline decoration-[#FAB319] decoration-2 underline-offset-4"
                      >
                        {servico.linkText} →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          PARTE 2.2: BLOCO DE PLANOS (Essential, Premium, On Demand)
         ========================================================= */}
      <section className="py-10 md:py-12 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10 space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block">
              Formatos de Contratação
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-black">Planos de Acompanhamento</h2>
            <p className="text-neutral-600 text-base leading-relaxed">
              Estruturas de assessoria desenhadas para acompanhar a evolução e as demandas fiscais
              da sua operação.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {HOME_PLANOS.map((plano, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-xl border flex flex-col justify-between transition-all duration-200 ${
                  plano.highlight
                    ? 'border-2 border-black bg-neutral-50 shadow-md relative'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded font-semibold ${
                        plano.highlight
                          ? 'bg-[#FAB319] text-black'
                          : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                      }`}
                    >
                      {plano.badge}
                    </span>
                    <Layers className="h-4 w-4 text-neutral-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-2">{plano.name}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-6">{plano.tagline}</p>
                </div>

                <div className="pt-4 border-t border-neutral-200">
                  <Link
                    to="/servicos#planos"
                    className="inline-flex items-center text-xs font-semibold text-black hover:text-neutral-700 underline decoration-[#FAB319] decoration-2 underline-offset-4"
                  >
                    Ver detalhes do plano {plano.name}
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button
              className="bg-black hover:bg-neutral-800 text-white font-semibold text-sm px-6 h-11"
              asChild
            >
              <Link to="/servicos#planos">
                Comparar o que inclui cada plano completo <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* =========================================================
          PARTE 2.3: BLOCO DE ÁREAS DE ATUAÇÃO (Tags/Chips de Segmentos)
         ========================================================= */}
      <section className="py-10 md:py-12 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-7 md:mb-8 space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block">
              Expertise Setorial em Brasília
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              Segmentos e Áreas de Atuação
            </h2>
            <p className="text-neutral-600 text-base leading-relaxed">
              Atendimento com domínio das peculiaridades tributárias, trabalhistas e regulatórias,
              <br />
              especialmente dos seguintes nichos:
            </p>
          </div>

          {/* Tags / Chips / Badges de Segmentos */}
          <div className="flex flex-wrap justify-center gap-2.5 md:gap-3 max-w-4xl mx-auto">
            {HOME_SEGMENTOS_ATUACAO.map((segmento, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-300 text-xs md:text-sm py-2 px-4 font-normal shadow-sm transition-colors cursor-default"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#FAB319] mr-2 inline-block shrink-0" />
                {segmento}
              </Badge>
            ))}
          </div>

          <div className="mt-8 md:mt-10 text-center">
            <Button
              variant="outline"
              className="border-neutral-900 text-black hover:bg-neutral-100 text-sm font-medium px-6 h-11"
              asChild
            >
              <Link to="/servicos">
                Ver página completa de serviços e atuação <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Bloco Institucional 2 - Relacionamento de longo prazo antes da chamada final */}
      <section className="py-8 md:py-10 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="font-sans text-xl sm:text-2xl md:text-3xl text-neutral-900 leading-relaxed font-normal">
            Assim, realizando um bom trabalho, construímos{' '}
            <span className="underline">verdadeiros relacionamentos</span> de{' '}
            <strong>longo prazo</strong>, de <strong>confiança e prosperidade</strong> com os nossos
            clientes.
          </p>
        </div>
      </section>

      {/* Authority Profile Section - Liderança Técnica */}
      <section className="py-10 md:py-14 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-5">
              {/* Retrato oficial do responsável técnico */}
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-neutral-200 shadow-md bg-neutral-100 group">
                <img
                  src={rafaelImg}
                  alt="Rafael Peres Peres Nunes Altoé - Contador Responsável CRC 027704"
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="inline-block border-l-2 border-[#FAB319] pl-3 mb-1">
                    <p className="font-bold text-lg text-white">Rafael Peres Peres Nunes Altoé</p>
                    <p className="text-xs text-neutral-300 font-mono">
                      Contador Tributarista • CRC 027704 CNAI 10122
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 space-y-4 md:space-y-5">
              <h2 className="text-3xl md:text-4xl font-bold text-black">
                Liderança Técnica e Acadêmica
              </h2>
              <div className="text-base md:text-lg text-neutral-700 leading-relaxed font-sans text-justify space-y-3">
                <p>
                  Sob a responsabilidade técnica de <strong>Rafael Peres Peres Nunes Altoé</strong>,
                  a <strong>PERES PERES Consultoria e Contabilidade</strong> une a prática da
                  contabilidade ao direito, em especial o tributário.
                </p>
                <p>
                  Contador (CRC 027704), advogado (OAB 87656), perito, auditor (CNAI 10122) e
                  professor, se dedica a demandas de Consultoria Tributária empresarial há 10 anos.
                </p>
                <p>
                  Pós-graduado em Direito Tributário (CERS) e Bacharel em Ciências Contábeis (UCB).
                  Integrou o Grupo de Pesquisas Tributárias (CDESCMAT, da CLDF), o Grupo de Estudos,
                  Pesquisa e Análise Tributária (UniCEUB) e o Grupo de Estudos da Limitação e
                  Controle da Renúncia Fiscal (IDP). Foi monitor acadêmico das disciplinas de
                  Direito Tributário I, II e III no IDP junto aos professores e advogados Ivan
                  Allegretti, Onizia Pignataro e Alberto Medeiros
                </p>
              </div>

              <ul className="grid sm:grid-cols-2 gap-3 mt-4">
                {[
                  'Membro da Comissão de Contabilidade Tributária do CRC-DF',
                  'Membro da Comissão de Assuntos Tributários da OAB-DF',
                  'Atuação perante órgãos fazendários',
                  'Pesquisa em Direito Tributário',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-neutral-800">
                    <CheckCircle2 className="h-4 w-4 text-neutral-900 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <Button
                  variant="outline"
                  className="border-neutral-900 text-black hover:bg-neutral-100 text-sm font-medium"
                  asChild
                >
                  <Link to="/sobre">
                    Conheça nossa equipe e trajetória profissional{' '}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Institucional de Diretrizes e Embasamento */}
      <section className="py-10 md:py-14 bg-neutral-950 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 border border-neutral-800 px-3 py-1 rounded text-xs uppercase tracking-wider text-neutral-400 font-mono">
              <Scale className="h-3.5 w-3.5 text-neutral-300" />
              Diretrizes de Atuação
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Metodologia de Trabalho e Embasamento Normativo
            </h2>
            <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
              A <strong>PERES PERES Consultoria &amp; Contabilidade</strong> adota postura
              estritamente conservadora e fundamentada. Não veiculamos promessas de resultado ou
              percentuais de economia genéricos: cada diagnóstico decorre de auditoria documental
              detalhada, lastreada nas regras da Receita Federal e decisões consolidadas dos
              tribunais superiores.
            </p>
            <div className="pt-2 flex justify-center">
              <Button
                size="lg"
                className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-base h-12 px-8"
                asChild
              >
                <Link to="/contato">Agendar Reunião</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
