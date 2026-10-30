import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  Calculator,
  Users2,
  FileCheck,
  BarChart3,
  MessageSquareText,
  ShieldCheck,
  TrendingUp,
  BookOpen,
  Download,
  Phone,
} from 'lucide-react'
import rafaelImg from '@/assets/foto-melhorada-por-ia-892a9.png'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Bloco 3: O acompanhamento mensal, na prática (6 cards)
const ROTINAS_ACOMPANHAMENTO = [
  {
    title: 'Escrituração contábil',
    desc: 'Registro das operações do mês, conciliação de contas e balancetes conferidos. A base de tudo que você recebe depois.',
    icon: FileSpreadsheet,
  },
  {
    title: 'Apuração de tributos',
    desc: 'Cálculo de Simples Nacional, Lucro Presumido ou Lucro Real, com conferência de alíquotas, Fator R e benefícios aplicáveis ao seu CNAE.',
    icon: Calculator,
  },
  {
    title: 'Folha e eSocial',
    desc: 'Cálculo de folha, pró-labore, encargos, férias e rescisões, com envio e conferência das obrigações do eSocial e da DCTFWeb.',
    icon: Users2,
  },
  {
    title: 'Obrigações acessórias',
    desc: 'Declarações federais, estaduais e municipais entregues no prazo: DEFIS, PGDAS-D, EFD-Reinf, DCTFWeb e as demais aplicáveis à sua atividade.',
    icon: FileCheck,
  },
  {
    title: 'Fechamento e relatórios',
    desc: 'Fechamento mensal com DRE e balanço, entregues em linguagem que você usa para decidir, não só para o arquivo.',
    icon: BarChart3,
  },
  {
    title: 'Reunião de acompanhamento',
    desc: 'Conversa periódica sobre o resultado do mês, o que pesou no imposto e o que precisa de decisão sua.',
    icon: MessageSquareText,
  },
]

// Bloco 11: Segmentos e áreas de atuação (9 segmentos na ordem estrita do briefing)
const SEGMENTOS_ATUACAO = [
  'Clínicas e Profissionais da Saúde',
  'Startups e Empresas de Tecnologia',
  'Profissões Regulamentadas',
  'Holdings Familiares e Patrimoniais',
  'Educação e Treinamentos',
  'Publicidade e Comunicação',
  'Agências de Viagem',
  'E-commerces',
  'MEIs e Profissionais Liberais',
]

export default function Index() {
  return (
    <div className="flex flex-col w-full font-sans">
      {/* =========================================================
          BLOCO 1 [PRESERVAR 1]: HERO ATUAL COMPLETO
         ========================================================= */}
      <section className="relative flex items-center justify-center overflow-hidden bg-black text-white border-b border-neutral-800 min-h-[55vh] md:min-h-[60vh]">
        <div className="container mx-auto px-4 py-16 md:py-20 relative z-10 w-full">
          <div className="w-full space-y-6 md:space-y-7 animate-fade-in-up">
            <div className="inline-block border border-neutral-700 px-3 py-1 rounded text-xs tracking-wider uppercase text-neutral-300 font-sans">
              PERES PERES Consultoria &amp; Contabilidade
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white leading-tight max-w-4xl">
              Consultoria e Contabilidade
              <br />
              de Brasília para todo o Brasil
            </h1>

            <p className="text-base md:text-lg text-neutral-300 max-w-2xl leading-relaxed font-sans">
              Desde 2017, trabalhamos para que nossos clientes, empresas e donos de negócios,
              cresçam com segurança através de uma contabilidade de excelência.
            </p>

            <div className="flex flex-wrap items-center justify-start gap-4 pt-2">
              <Button
                size="lg"
                className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-base h-12 px-8 border-none font-sans"
                asChild
              >
                <Link to="/contato">Agendar Reunião</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-neutral-700 bg-transparent text-white hover:bg-neutral-900 hover:text-white font-medium text-base h-12 px-8 font-sans"
                asChild
              >
                <Link to="/servicos">Conhecer Serviços</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BLOCO 2 [PRESERVAR 2]: PARÁGRAFO DE PERSONALIZAÇÃO
         ========================================================= */}
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
          BLOCO 3 [NOVO]: O ACOMPANHAMENTO MENSAL, NA PRÁTICA
         ========================================================= */}
      <section className="py-12 md:py-16 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl mb-10">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Rotina contábil
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              O acompanhamento mensal, na prática
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              Não é &quot;contabilidade em dia&quot; no abstrato. É isto que acontece todos os meses
              na sua empresa.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ROTINAS_ACOMPANHAMENTO.map((item, idx) => {
              const Icon = item.icon
              return (
                <Card
                  key={idx}
                  className="border border-neutral-200 shadow-sm hover:border-neutral-300 transition-colors bg-white flex flex-col justify-between"
                >
                  <CardHeader className="pb-3">
                    <div className="h-10 w-10 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-3">
                      <Icon className="h-5 w-5 text-black" />
                    </div>
                    <CardTitle className="text-lg font-sans font-bold text-black leading-snug">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-10 p-5 rounded-lg bg-neutral-50 border border-neutral-200 max-w-4xl mx-auto text-center">
            <p className="text-sm md:text-base text-neutral-800 font-sans font-medium leading-relaxed">
              E cada uma dessas rotinas é conduzida por quem também faz consultoria. É por isso que
              o que aparece no fechamento vira conversa, e não só número.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          BLOCO 4 [NOVO]: A CONSULTORIA COMO MÉTODO
         ========================================================= */}
      <section className="py-12 md:py-16 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block font-sans">
              Método de trabalho
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Consultoria não é um serviço à parte. É como trabalhamos.
            </h2>
            <div className="space-y-4 text-base md:text-lg text-neutral-700 leading-relaxed font-sans">
              <p>
                Todo cliente PERES PERES tem consultoria, inclusive no plano mais enxuto. Ela não é
                um projeto vendido depois, nem um pacote adicional. É o olhar técnico que acompanha
                a sua rotina mensal.
              </p>
              <p>
                Um escritório puramente operacional entrega guia de imposto. O nosso lê o seu mês e
                aponta o que está custando dinheiro: um enquadramento que ficou errado, uma folha
                mal estruturada, um crédito que não foi aproveitado, um preço que não cobre o
                tributo real.
              </p>
              <p>
                Essa leitura acontece em cinco frentes. A tributária é a nossa especialidade e o
                nosso diferencial. As outras quatro existem porque um negócio não se decide só pelo
                imposto.
              </p>
            </div>

            <div className="pt-4">
              <div className="p-6 rounded-lg bg-white border-l-4 border-l-[#FAB319] border border-neutral-200 shadow-sm">
                <p className="text-lg md:text-xl font-sans font-bold text-black leading-snug">
                  Você não contrata cinco consultorias separadas. Contrata uma equipe que olha o seu
                  negócio por cinco ângulos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BLOCO 5 [NOVO]: AS CINCO FRENTES DE CONSULTORIA
         ========================================================= */}
      <section className="py-12 md:py-16 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl mb-10">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Estrutura técnica
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Cinco frentes. Uma especialidade.
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              A consultoria tributária é o nosso eixo técnico, o que nos diferencia no mercado. As
              frentes contábil, societária, financeira e de gestão e trabalhista completam a leitura
              do negócio.
            </p>
          </div>

          <div className="space-y-6">
            {/* 5.1 DESTAQUE: Consultoria Tributária */}
            <div className="border-2 border-black rounded-xl p-6 md:p-8 bg-neutral-50 shadow-sm relative">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <Badge className="bg-[#FAB319] text-black hover:bg-[#FAB319] font-sans font-semibold text-xs px-3 py-1 uppercase tracking-wider">
                  Nossa especialidade
                </Badge>
                <span className="text-xs text-neutral-500 font-sans font-medium uppercase tracking-wider">
                  Eixo principal
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-sans font-bold text-black mb-3">
                Consultoria Tributária
              </h3>

              <p className="text-neutral-700 text-base md:text-lg leading-relaxed font-sans mb-4">
                Planejamento fiscal estratégico, escolha e revisão de regime tributário, análise de
                Fator R, avaliação de teses e recuperação de créditos dos últimos 5 anos.
                Acompanhamento técnico da Reforma Tributária (EC 132/2023 e leis complementares)
                para antecipar o impacto no seu setor antes que ele chegue na guia.
              </p>

              <div className="bg-white p-4 rounded-lg border border-neutral-200 mb-5">
                <p className="text-sm md:text-base text-neutral-900 font-sans">
                  <strong>O que você leva:</strong> decisões de regime fundamentadas em números
                  seus, não em simulação genérica, e um plano de ação com prazo.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-sm font-sans font-medium text-black">
                <Link
                  to="/servicos"
                  className="hover:text-neutral-700 underline decoration-[#FAB319] decoration-2 underline-offset-4"
                >
                  Consultoria Tributária
                </Link>
                <span className="text-neutral-300">·</span>
                <Link
                  to="/servicos"
                  className="hover:text-neutral-700 underline decoration-[#FAB319] decoration-2 underline-offset-4"
                >
                  Recuperação de Créditos
                </Link>
                <span className="text-neutral-300">·</span>
                <Link
                  to="/contato"
                  className="hover:text-neutral-700 underline decoration-[#FAB319] decoration-2 underline-offset-4"
                >
                  Reforma Tributária
                </Link>
              </div>
            </div>

            {/* 5.2, 5.3, 5.4, 5.5: Cards padrão de mesma altura */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Consultoria Contábil */}
              <div className="border border-neutral-200 rounded-xl p-6 bg-white hover:border-neutral-300 transition-colors flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-sans font-bold text-black mb-1">
                    Consultoria Contábil
                  </h3>
                  <p className="text-xs text-neutral-500 font-sans font-medium uppercase tracking-wider mb-4">
                    A leitura técnica do seu resultado
                  </p>
                  <p className="text-sm text-neutral-600 leading-relaxed font-sans mb-4">
                    Análise de demonstrações, revisão de plano de contas e de critérios de
                    reconhecimento, diagnóstico de distorções no balanço e apoio em decisões
                    societárias, como constituição, alteração contratual, integralização,
                    distribuição de lucros e reorganização.
                  </p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <p className="text-xs text-neutral-800 font-sans leading-relaxed">
                    <strong>O que você leva:</strong> demonstrações que servem para decidir e para
                    apresentar a banco, investidor ou comprador.
                  </p>
                </div>
              </div>

              {/* Estruturação Societária */}
              <div className="border border-neutral-200 rounded-xl p-6 bg-white hover:border-neutral-300 transition-colors flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-sans font-bold text-black mb-1">
                    Estruturação Societária
                  </h3>
                  <p className="text-xs text-neutral-500 font-sans font-medium uppercase tracking-wider mb-4">
                    Estrutura, sócios e sucessão
                  </p>
                  <p className="text-sm text-neutral-600 leading-relaxed font-sans mb-4">
                    Desenho e revisão da estrutura societária da empresa e do grupo: escolha do tipo
                    societário, constituição, alterações contratuais, integralização de capital,
                    entrada e saída de sócios, acordo de sócios, distribuição de lucros, cisão,
                    incorporação e fusão. Também abrange a organização de holdings familiares e
                    patrimoniais e o planejamento sucessório, com leitura conjunta do impacto
                    tributário de cada arranjo.
                  </p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <p className="text-xs text-neutral-800 font-sans leading-relaxed">
                    <strong>O que você leva:</strong> uma estrutura societária que sustenta o
                    crescimento e a sucessão sem gerar passivo tributário ou conflito entre sócios.
                  </p>
                </div>
              </div>

              {/* Consultoria Financeira e de Gestão */}
              <div className="border border-neutral-200 rounded-xl p-6 bg-white hover:border-neutral-300 transition-colors flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-sans font-bold text-black mb-1">
                    Consultoria Financeira e de Gestão
                  </h3>
                  <p className="text-xs text-neutral-500 font-sans font-medium uppercase tracking-wider mb-4">
                    Caixa, margem e decisão
                  </p>
                  <p className="text-sm text-neutral-600 leading-relaxed font-sans mb-4">
                    Estruturação de fluxo de caixa, análise de capital de giro, formação de preço
                    com o tributo dentro da conta, projeções e cenários, e apoio na avaliação de
                    investimento e de crédito. Também atua na gestão do negócio: indicadores de
                    desempenho, orçamento anual, controle de custos, análise de rentabilidade por
                    produto e por cliente, e apoio na tomada de decisão com base em números
                    gerenciais.
                  </p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <p className="text-xs text-neutral-800 font-sans leading-relaxed">
                    <strong>O que você leva:</strong> clareza sobre quanto o seu negócio realmente
                    ganha, onde está perdendo margem e quanto pode suportar de despesa, dívida ou
                    expansão.
                  </p>
                </div>
              </div>

              {/* Consultoria Trabalhista */}
              <div className="border border-neutral-200 rounded-xl p-6 bg-white hover:border-neutral-300 transition-colors flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-sans font-bold text-black mb-1">
                    Consultoria Trabalhista
                  </h3>
                  <p className="text-xs text-neutral-500 font-sans font-medium uppercase tracking-wider mb-4">
                    Folha, vínculo e risco
                  </p>
                  <p className="text-sm text-neutral-600 leading-relaxed font-sans mb-4">
                    Estruturação de folha e política de pró-labore, enquadramento sindical e de
                    convenção coletiva, conformidade no eSocial, análise de riscos de pejotização e
                    de vínculo, e apoio em rescisões e negociações.
                  </p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <p className="text-xs text-neutral-800 font-sans leading-relaxed">
                    <strong>O que você leva:</strong> folha enxuta dentro da legalidade e menos
                    exposição em fiscalização e reclamação trabalhista.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BLOCO 6 [NOVO]: PLANOS DE CONTABILIDADE E CONSULTORIA MENSAL
         ========================================================= */}
      <section className="py-12 md:py-16 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block font-sans">
              Formatos de contratação
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Planos de contabilidade e consultoria mensal
            </h2>
            <p className="text-neutral-700 text-base md:text-lg leading-relaxed font-sans">
              Todo plano inclui contabilidade completa e consultoria nas cinco frentes. O que muda é
              a intensidade, a frequência e a profundidade dessa consultoria.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {/* Plano Essential */}
            <div className="p-6 md:p-7 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 transition-colors flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans uppercase tracking-wider px-2.5 py-0.5 rounded font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200">
                    Enxuto
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-sans font-bold text-black mb-1">Essential</h3>
                  <p className="text-sm text-neutral-600 font-sans leading-relaxed">
                    Para empresas menores e mais simples, com rotinas fiscais e contábeis
                    essenciais.
                  </p>
                </div>

                <div className="pt-2 space-y-3 text-xs md:text-sm text-neutral-700 font-sans leading-relaxed border-t border-neutral-100">
                  <p>
                    <strong className="text-black block mb-0.5">Contabilidade completa:</strong>
                    escrituração, apuração de tributos, folha e eSocial, obrigações acessórias,
                    fechamento com DRE e balanço.
                  </p>
                  <p>
                    <strong className="text-black block mb-0.5">Consultoria incluída:</strong>
                    análise de enquadramento tributário na entrada e a cada mudança relevante de
                    faturamento ou atividade; revisão de folha e pró-labore; alertas de risco
                    identificados no fechamento; respostas a dúvidas pontuais ao longo do mês.
                  </p>
                  <p>
                    <strong className="text-black block mb-0.5">Limite claro:</strong> a consultoria
                    acontece dentro da rotina mensal. Projetos com escopo próprio, recuperação de
                    créditos, revisão de teses, perícias e operações societárias, são orçados à
                    parte, com desconto para clientes do plano.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-100">
                <Button
                  variant="outline"
                  className="w-full border-neutral-900 text-black hover:bg-neutral-100 text-sm font-sans"
                  asChild
                >
                  <Link to="/contato">Falar sobre o Essential</Link>
                </Button>
              </div>
            </div>

            {/* Plano Premium */}
            <div className="p-6 md:p-7 rounded-xl border-2 border-black bg-white shadow-md relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans uppercase tracking-wider px-2.5 py-0.5 rounded font-semibold bg-[#FAB319] text-black">
                    Mais escolhido
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-sans font-bold text-black mb-1">Premium</h3>
                  <p className="text-sm text-neutral-600 font-sans leading-relaxed">
                    O plano completo: acompanhamento próximo, inteligência fiscal e consultorias
                    periódicas.
                  </p>
                </div>

                <div className="pt-2 space-y-3 text-xs md:text-sm text-neutral-700 font-sans leading-relaxed border-t border-neutral-100">
                  <p>
                    <strong className="text-black block mb-0.5">Contabilidade completa:</strong>
                    tudo do Essential, escrituração, apuração de tributos, folha e eSocial,
                    obrigações acessórias, fechamento com DRE e balanço, com acompanhamento próximo
                    da equipe.
                  </p>
                  <p>
                    <strong className="text-black block mb-0.5">
                      Consultoria incluída, em maior profundidade e periodicidade:
                    </strong>
                    reuniões periódicas de acompanhamento com pauta técnica; revisão recorrente de
                    regime, Fator R e estrutura de folha; análise de cenários e simulações
                    tributárias durante o ano; acompanhamento ativo da Reforma Tributária aplicado
                    ao seu setor; leitura financeira do resultado, com margem, caixa e formação de
                    preço; e apoio contábil e societário em decisões de crescimento.
                  </p>
                  <p>
                    <strong className="text-black block mb-0.5">
                      Consultoria nas cinco frentes:
                    </strong>
                    com periodicidade definida em contrato.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-100">
                <Button
                  className="w-full bg-black hover:bg-neutral-800 text-white font-medium text-sm font-sans"
                  asChild
                >
                  <Link to="/contato">Falar sobre o Premium</Link>
                </Button>
              </div>
            </div>

            {/* Plano On Demand */}
            <div className="p-6 md:p-7 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 transition-colors flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans uppercase tracking-wider px-2.5 py-0.5 rounded font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200">
                    Sob medida
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-sans font-bold text-black mb-1">On Demand</h3>
                  <p className="text-sm text-neutral-600 font-sans leading-relaxed">
                    Equipe multidisciplinar sob demanda para projetos pontuais, perícias e alta
                    complexidade.
                  </p>
                </div>

                <div className="pt-2 space-y-3 text-xs md:text-sm text-neutral-700 font-sans leading-relaxed border-t border-neutral-100">
                  <p>
                    <strong className="text-black block mb-0.5">Para quem precisa de:</strong>
                    recuperação de créditos, revisão de teses, perícia contábil, due diligence,
                    reorganização societária, planejamento sucessório e patrimonial, ou projetos de
                    Reforma Tributária com escopo próprio.
                  </p>
                  <p>
                    <strong className="text-black block mb-0.5">Como funciona:</strong>
                    escopo, prazo e entregáveis definidos em proposta. Pode ser contratado
                    isoladamente ou combinado ao acompanhamento mensal.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-100">
                <Button
                  variant="outline"
                  className="w-full border-neutral-900 text-black hover:bg-neutral-100 text-sm font-sans"
                  asChild
                >
                  <Link to="/contato">Falar sobre projetos pontuais</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-10 max-w-3xl mx-auto space-y-6 text-center">
            <div className="p-5 rounded-lg bg-white border border-neutral-200 shadow-sm">
              <p className="text-base md:text-lg text-neutral-900 font-sans font-semibold leading-relaxed">
                Se você chegou aqui procurando só &quot;contabilidade&quot;, comece pelo Essential.
                Ele já inclui consultoria, é assim que trabalhamos.
              </p>
            </div>

            <div>
              <Button
                variant="outline"
                className="border-neutral-900 text-black hover:bg-neutral-100 font-semibold text-sm px-6 h-11 font-sans"
                asChild
              >
                <Link to="/servicos">
                  Comparar o que inclui cada plano <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BLOCO 7 [NOVO]: DIRETRIZES DE ATUAÇÃO
         ========================================================= */}
      <section className="py-12 md:py-16 bg-neutral-950 text-white border-b border-neutral-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 border border-neutral-800 px-3 py-1 rounded text-xs uppercase tracking-wider text-neutral-400 font-sans">
              <ShieldCheck className="h-3.5 w-3.5 text-[#FAB319]" />
              Postura técnica
            </div>

            <h2 className="text-3xl md:text-4xl font-sans font-bold text-white leading-tight">
              Diretrizes de atuação
            </h2>

            <div className="space-y-4 text-base md:text-lg text-neutral-300 leading-relaxed font-sans">
              <p>
                A PERES PERES adota postura estritamente conservadora e fundamentada. Não veiculamos
                promessas de resultado nem percentuais de economia genéricos: cada diagnóstico
                decorre de auditoria documental detalhada, lastreada nas regras da Receita Federal e
                em decisões consolidadas dos tribunais superiores.
              </p>
              <p>
                Na prática, isso significa que a nossa recomendação pode ser não fazer nada. Se o
                estudo não sustenta a tese, dizemos que não a sustenta, e explicamos por quê.
              </p>
            </div>

            <div className="pt-4">
              <div className="p-6 rounded-lg bg-neutral-900 border-l-4 border-l-[#FAB319] border border-neutral-800">
                <p className="text-lg md:text-xl font-sans font-bold text-white leading-snug">
                  Consultoria que só concorda com o cliente não é consultoria. É atendimento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BLOCO 8 [PRESERVAR 3]: PARÁGRAFO DE RELACIONAMENTO
         ========================================================= */}
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

      {/* =========================================================
          BLOCO 9 [PRESERVAR 4]: LIDERANÇA TÉCNICA E ACADÊMICA
         ========================================================= */}
      <section className="py-10 md:py-14 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-5">
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-neutral-200 shadow-md bg-neutral-100 group">
                <img
                  src={rafaelImg}
                  alt="Rafael Peres Peres Nunes Altoé - Contador Responsável CRC 027704"
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="inline-block border-l-2 border-[#FAB319] pl-3 mb-1">
                    <p className="font-bold text-lg text-white font-sans">
                      Rafael Peres Peres Nunes Altoé
                    </p>
                    <p className="text-xs text-neutral-300 font-sans">
                      Contador Tributarista • CRC 027704 CNAI 10122
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 space-y-4 md:space-y-5">
              <h2 className="text-3xl md:text-4xl font-bold text-black font-sans">
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
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-neutral-800 font-sans"
                  >
                    <CheckCircle2 className="h-4 w-4 text-neutral-900 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <Button
                  variant="outline"
                  className="border-neutral-900 text-black hover:bg-neutral-100 text-sm font-medium font-sans"
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

      {/* =========================================================
          BLOCO 10 [NOVO]: REFORMA TRIBUTÁRIA
         ========================================================= */}
      <section className="py-12 md:py-16 bg-neutral-100 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white border-2 border-neutral-900 rounded-2xl p-8 md:p-10 shadow-sm space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#FAB319]/20 border border-[#FAB319] text-black px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider font-sans">
              Diagnóstico Setorial
            </div>

            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Reforma Tributária: o que muda para a sua empresa
            </h2>

            <div className="space-y-4 text-base md:text-lg text-neutral-700 leading-relaxed font-sans">
              <p>
                A substituição de PIS, COFINS, ICMS e ISS pelo IBS e pela CBS altera crédito,
                precificação e fluxo de caixa de praticamente todo negócio. A transição é longa e
                cheia de janelas, e quem se antecipa escolhe onde se posicionar.
              </p>
              <p>
                Fazemos um diagnóstico do impacto da Reforma no seu setor, com simulação sobre os
                seus próprios números.
              </p>
            </div>

            <div className="pt-2">
              <Button
                size="lg"
                className="bg-black hover:bg-neutral-800 text-white font-semibold text-base h-12 px-8 font-sans"
                asChild
              >
                <Link to="/contato">
                  Solicitar diagnóstico da Reforma Tributária{' '}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BLOCO 11 [NOVO / ATUALIZADO]: SEGMENTOS E ÁREAS DE ATUAÇÃO
         ========================================================= */}
      <section className="py-12 md:py-16 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Segmentos e áreas de atuação
            </h2>
            <p className="text-neutral-600 text-base md:text-lg leading-relaxed font-sans">
              Atendimento especializado com domínio das peculiaridades tributárias, trabalhistas e
              regulatórias de cada nicho, o que muda a leitura de cada frente de consultoria.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {SEGMENTOS_ATUACAO.map((segmento, idx) => (
              <div
                key={idx}
                className="bg-neutral-50 border border-neutral-200 hover:border-neutral-300 rounded-lg p-3.5 flex items-center gap-2.5 transition-colors"
              >
                <span className="h-2 w-2 rounded-full bg-[#FAB319] shrink-0" />
                <span className="text-sm font-sans font-medium text-neutral-900 leading-snug">
                  {segmento}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button
              variant="outline"
              className="border-neutral-900 text-black hover:bg-neutral-100 text-sm font-medium px-6 h-11 font-sans"
              asChild
            >
              <Link to="/servicos">
                Ver página completa de serviços e atuação <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* =========================================================
          BLOCO 12 [NOVO]: PROVA SOCIAL (estritamente com placeholders)
         ========================================================= */}
      <section className="py-12 md:py-16 bg-neutral-50 border-b border-neutral-200"></section>

      {/* =========================================================
          BLOCO 13 [NOVO]: FERRAMENTAS E CONTEÚDO TÉCNICO (3 cards)
         ========================================================= */}
      <section className="py-12 md:py-16 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl mb-10">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Material gratuito
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              Ferramentas e conteúdo técnico
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              Material gratuito e atualizado para quem quer entender a própria situação antes de
              contratar.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: Calculadoras Tributárias */}
            <Card className="border border-neutral-200 shadow-sm hover:border-neutral-300 transition-colors bg-white flex flex-col justify-between">
              <CardHeader>
                <div className="h-10 w-10 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-3">
                  <TrendingUp className="h-5 w-5 text-black" />
                </div>
                <CardTitle className="text-xl font-sans font-bold text-black leading-snug">
                  Calculadoras Tributárias
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                  Simples Nacional, Lucro Presumido, Fator R, rescisão e pró-labore.
                </p>
                <div className="pt-3 border-t border-neutral-100">
                  <Link
                    to="/calculadoras"
                    className="inline-flex items-center text-xs font-semibold text-black hover:text-neutral-700 underline decoration-[#FAB319] decoration-2 underline-offset-4 font-sans"
                  >
                    Acessar calculadoras →
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Blog (mesma aba, sem target="_blank") */}
            <Card className="border border-neutral-200 shadow-sm hover:border-neutral-300 transition-colors bg-white flex flex-col justify-between">
              <CardHeader>
                <div className="h-10 w-10 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-3">
                  <BookOpen className="h-5 w-5 text-black" />
                </div>
                <CardTitle className="text-xl font-sans font-bold text-black leading-snug">
                  Blog
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                  Legislação, jurisprudência e mudanças normativas comentadas.
                </p>
                <div className="pt-3 border-t border-neutral-100">
                  <a
                    href="https://blog.peresperes.com.br"
                    className="inline-flex items-center text-xs font-semibold text-black hover:text-neutral-700 underline decoration-[#FAB319] decoration-2 underline-offset-4 font-sans"
                  >
                    Acessar artigos do blog →
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Recursos e Materiais */}
            <Card className="border border-neutral-200 shadow-sm hover:border-neutral-300 transition-colors bg-white flex flex-col justify-between">
              <CardHeader>
                <div className="h-10 w-10 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-3">
                  <Download className="h-5 w-5 text-black" />
                </div>
                <CardTitle className="text-xl font-sans font-bold text-black leading-snug">
                  Recursos e Materiais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                  Guias e checklists para download.
                </p>
                <div className="pt-3 border-t border-neutral-100">
                  <Link
                    to="/recursos"
                    className="inline-flex items-center text-xs font-semibold text-black hover:text-neutral-700 underline decoration-[#FAB319] decoration-2 underline-offset-4 font-sans"
                  >
                    Ver materiais gratuitos →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* =========================================================
          BLOCO 14 [NOVO]: CTA FINAL
         ========================================================= */}
      <section className="py-14 md:py-20 bg-neutral-950 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-white leading-tight">
            Conhecer o escritório custa uma conversa.
          </h2>

          <p className="text-base md:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed font-sans">
            Se você já tem contabilidade e quer uma segunda leitura técnica, ou se está começando e
            precisa de uma estrutura desde o início, a primeira reunião serve para isso. Sem
            apresentação de vendas: a gente olha o seu caso e diz o que enxerga.
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
