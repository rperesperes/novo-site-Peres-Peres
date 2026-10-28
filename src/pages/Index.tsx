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
} from 'lucide-react'
import rafaelImg from '@/assets/foto-melhorada-por-ia-892a9.png'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Três pilares de serviços (resumo curto para a Home)
const HOME_SERVICOS_PILARES = [
  {
    title: 'Consultoria Tributária',
    shortDesc:
      'Planejamento fiscal estratégico, enquadramento de regime, Fator R e orientação técnica na Reforma Tributária.',
    icon: FileText,
  },
  {
    title: 'Recuperação de Créditos',
    shortDesc:
      'Diagnóstico minucioso dos últimos 5 anos, aplicação de teses consolidadas e restituição ou compensação administrativa.',
    icon: RefreshCcw,
  },
  {
    title: 'Consultoria Trabalhista',
    shortDesc:
      'Planejamento de folha de pagamento, adequação de pró-labore, conformidade no eSocial e apoio em rescisões.',
    icon: Users2,
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

// Segmentos típicos atendidos por escritório contábil em Brasília
const HOME_SEGMENTOS_ATUACAO = [
  'Empresas de Serviços',
  'Comércio Varejista e Atacadista',
  'Clínicas e Profissionais da Saúde',
  'Startups e Empresas de Tecnologia',
  'Engenharia e Construção Civil',
  'Transporte e Logística',
  'Profissionais Liberais e PJ',
  'Holdings Familiares e Patrimoniais',
  'Educação e Treinamentos',
  'Restaurantes e Alimentação',
  'Corretoras e Serviços Financeiros',
  'Publicidade e Comunicação',
]

export default function Index() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section - Arquitetura monocromática elegante com ponto focal restrito no botão */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-black text-white border-b border-neutral-800">
        <div className="container mx-auto px-4 py-20 relative z-10 w-full">
          <div className="w-full space-y-8 animate-fade-in-up">
            <div className="inline-block border border-neutral-700 px-3 py-1 rounded text-xs tracking-wider uppercase text-neutral-300">
              PERES PERES Consultoria &amp; Contabilidade
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white leading-tight max-w-4xl">
              Consultoria e Contabilidade
              <br />
              de Brasília para todo o Brasil
            </h1>

            <p className="text-lg text-neutral-300 max-w-2xl leading-relaxed">
              Trabalhamos para que nossos clientes, empresas e donos de negócios, cresçam com
              segurança através de uma contabilidade de excelência.
            </p>

            {/* Ponto focal único da tela no Hero: Botão com #FAB319 */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                size="lg"
                className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-base h-12 px-8 border-none"
                asChild
              >
                <Link to="/contato">Agendar Reunião</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-neutral-700 bg-transparent hover:bg-neutral-900 text-base h-12 px-8"
                asChild
              >
                <Link to="/servicos">Conhecer Serviços</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Bloco Institucional 1 - Transição personalizada antes de Serviços */}
      <section className="py-16 md:py-20 bg-neutral-50/50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="font-sans text-xl sm:text-2xl md:text-3xl text-neutral-900 leading-relaxed font-normal">
            E como nenhum profissional e nenhuma empresa é igual a outra, buscamos conhecer a fundo,
            nos detalhes, a história, os desafios e as oportunidades de negócio de cada um dos
            nossos clientes. Este é o primeiro passo para o que nos propomos: oferecer o melhor.
          </p>
        </div>
      </section>

      {/* =========================================================
          PARTE 2.1: BLOCO DE SERVIÇOS (Três Pilares Resumidos)
         ========================================================= */}
      <section className="py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
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

          <div className="grid md:grid-cols-3 gap-6">
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
                  <CardContent className="space-y-4">
                    <CardDescription className="text-sm text-neutral-600 leading-relaxed">
                      {servico.shortDesc}
                    </CardDescription>
                    <div className="pt-2 border-t border-neutral-100">
                      <Link
                        to="/servicos"
                        className="inline-flex items-center text-xs font-semibold text-black hover:text-neutral-700 underline decoration-[#FAB319] decoration-2 underline-offset-4"
                      >
                        Saiba mais sobre {servico.title}
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
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
      <section className="py-20 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
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

          <div className="mt-10 text-center">
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
      <section className="py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block">
              Expertise Setorial em Brasília
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              Segmentos e Áreas de Atuação
            </h2>
            <p className="text-neutral-600 text-base leading-relaxed">
              Atendimento especializado com domínio das peculiaridades tributárias, trabalhistas e
              regulatórias de cada nicho econômico.
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

          <div className="mt-12 text-center">
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
      <section className="py-16 md:py-20 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="font-sans text-xl sm:text-2xl md:text-3xl text-neutral-900 leading-relaxed font-normal">
            Assim, realizando um bom trabalho, construímos verdadeiros relacionamentos de longo
            prazo, de confiança e prosperidade com os nossos clientes.
          </p>
        </div>
      </section>

      {/* Authority Profile Section - Liderança Técnica */}
      <section className="py-20 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5">
              {/* Retrato oficial do responsável técnico */}
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-neutral-200 shadow-md bg-neutral-100 group">
                <img
                  src={rafaelImg}
                  alt="Rafael Peres Peres Nunes Altoé - Contador Responsável CRC 027704/O"
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="inline-block border-l-2 border-[#FAB319] pl-3 mb-1">
                    <p className="font-bold text-lg text-white">Rafael Peres Peres Nunes Altoé</p>
                    <p className="text-xs text-neutral-300 font-mono">Contador • CRC 027704/O</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-black">
                Liderança Técnica e Acadêmica
              </h2>
              <p className="text-lg text-neutral-700 leading-relaxed font-sans text-justify">
                Sob a responsabilidade técnica de <strong>Rafael Peres Peres Nunes Altoé</strong>, a{' '}
                <strong>PERES PERES Consultoria e Contabilidade</strong> une a prática da
                contabilidade ao direito, em especial o tributário.
                <div>
                  <span>
                    <br />
                  </span>
                </div>
                <div>
                  <span>
                    Contador, advogado e professor, se dedica a demandas de Consultoria Tributária
                    empresarial há 10 anos.
                  </span>
                </div>
                <div>
                  <br />
                </div>
                <div>
                  Pós-graduado em Direito Tributário (CERS) e Bacharel em Ciências Contábeis (UCB).
                  Integrou o Grupo de Pesquisas Tributárias (CDESCMAT, da CLDF), o Grupo de Estudos,
                  Pesquisa e Análise Tributária (UniCEUB) e o Grupo de Estudos da Limitação e
                  Controle da Renúncia Fiscal (IDP). Foi monitor acadêmico das disciplinas de
                  Direito Tributário I, II e III no IDP junto aos professores e advogados Ivan
                  Allegretti, Onizia Pignataro e Alberto Medeiros
                </div>
              </p>

              <ul className="grid sm:grid-cols-2 gap-4 mt-6">
                {[
                  'Membro CDESCMAT/DF',
                  'Jornadas de Finanças Públicas (BA)',
                  'Atuação perante órgãos fazendários',
                  'Pesquisa em Direito Tributário',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-neutral-800">
                    <CheckCircle2 className="h-4 w-4 text-neutral-900 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <Button
                  variant="outline"
                  className="border-neutral-900 text-black hover:bg-neutral-100 text-sm font-medium"
                  asChild
                >
                  <Link to="/sobre">
                    Conhecer histórico profissional completo <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Institucional de Diretrizes e Embasamento */}
      <section className="py-20 bg-neutral-950 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 border border-neutral-800 px-3 py-1 rounded text-xs uppercase tracking-wider text-neutral-400 font-mono">
              <Scale className="h-3.5 w-3.5 text-neutral-300" />
              Diretrizes de Atuação
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Metodologia de Trabalho e Embasamento Normativo
            </h2>
            <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
              A <strong>PERES PERES Consultoria e Contabilidade</strong> adota postura estritamente
              conservadora e fundamentada. Não veiculamos promessas de resultado ou percentuais de
              economia genéricos: cada diagnóstico decorre de auditoria documental detalhada,
              lastreada nas regras da Receita Federal e decisões consolidadas dos tribunais
              superiores.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-base h-12 px-8"
                asChild
              >
                <Link to="/contato">Agendar Consulta Inicial</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-neutral-700 bg-transparent hover:bg-neutral-900 text-base h-12 px-8"
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
