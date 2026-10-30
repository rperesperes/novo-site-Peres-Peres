import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  RefreshCcw,
  Users2,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Laptop,
  KeyRound,
  Award,
  UserCheck,
  Building,
  ScrollText,
  Scale,
  Sparkles,
  ShieldCheck,
  Wallet,
  TrendingUp,
  SearchCheck,
  Building2,
  Briefcase,
  GitMerge,
  History,
  LineChart,
  Stethoscope,
} from 'lucide-react'

// Itens da Consultoria Tributária
const TRIBUTARIA_ITEMS = [
  {
    title: 'Planejamento Tributário',
    desc: 'Estruturação estratégica personalizada para redução lícita de carga fiscal (elisão), simulação de cenários societários e aproveitamento de incentivos legais.',
  },
  {
    title: 'Análise e Enquadramento de Regime',
    desc: 'Estudo comparativo minucioso entre Simples Nacional, Lucro Presumido e Lucro Real, considerando faturamento, folha, margens operacionais e despesas dedutíveis.',
  },
  {
    title: 'Consultoria em Reforma Tributária',
    desc: 'Diagnóstico preparatório para a transição dos novos tributos sobre o consumo (IBS, CBS e Imposto Seletivo), prevenindo impactos na precificação e na cadeia de suprimentos.',
  },
  {
    title: 'Fator R e Simples Nacional',
    desc: 'Gestão contínua da relação folha/receita para enquadramento no Anexo III em vez do Anexo V, gerando economia expressiva para empresas de serviços intelectuais.',
  },
  {
    title: 'Instrução de Teses de Recuperação de Crédito',
    desc: 'Fundamentação jurídica e técnica de teses administrativas e judiciais consolidadas, mapeando direitos creditórios em conformidade com o STF, STJ e Receita Federal.',
  },
]

// Etapas da Recuperação de Créditos
const RECUPERACAO_STEPS = [
  {
    step: '01',
    title: 'Diagnóstico de Créditos Pagos Indevidamente',
    desc: 'Auditoria fiscal retrospectiva dos últimos 60 meses através do cruzamento eletrônico de arquivos SPED, ECF, DCTF, EFD-Contribuições, extratos do Simples Nacional e notas fiscais emitidas, identificando com precisão valores recolhidos a maior ou indevidamente.',
  },
  {
    step: '02',
    title: 'Análise de Teses Aplicáveis ao Negócio',
    desc: 'Verificação da aderência e segurança jurídica de teses tributárias pacíficas ao perfil e às operações reais da sua empresa, tais como segregação de receitas monofásicas (PIS/COFINS), exclusão do ICMS/ISS da base do PIS/COFINS, verbas indenizatórias na folha e outras oportunidades normatizadas.',
  },
  {
    step: '03',
    title: 'Acompanhamento do Processo de Restituição ou Compensação',
    desc: 'Execução técnica integral perante os sistemas oficiais da Receita Federal (PER/DCOMP) ou órgãos distritais/estaduais, com retificação das obrigações acessórias, emissão de parecer probatório e monitoramento até o efetivo depósito em conta corrente ou homologação da compensação.',
  },
]

// Pilares da Consultoria Trabalhista
const TRABALHISTA_ITEMS = [
  {
    title: 'Planejamento de Folha de Pagamento',
    desc: 'Estruturação estratégica dos encargos trabalhistas e previdenciários (INSS patronal, RAT/FAP e contribuições a terceiros), mitigando passivos e otimizando o custo total por colaborador.',
  },
  {
    title: 'Enquadramento de Sócios e Pró-Labore',
    desc: 'Adequação formal entre retiradas de pró-labore e distribuição de lucros isenta, garantindo conformidade com as regras da Receita Federal e proteção previdenciária aos administradores.',
  },
  {
    title: 'Revisão de Obrigações Trabalhistas',
    desc: 'Auditoria de conformidade com o eSocial, DCTFWeb, FGTS Digital e convenções coletivas de trabalho aplicáveis a Brasília e demais regiões, evitando autuações e contingências fiscais.',
  },
  {
    title: 'Apoio Técnico em Rescisões Contratuais',
    desc: 'Auditoria e cálculo minucioso de verbas rescisórias, estabilidades, homologações e documentos comprobatórios, prevenindo litígios perante a Justiça do Trabalho.',
  },
]

// Itens de Inteligência Financeira e Fluxo de Caixa
const INTELIGENCIA_FINANCEIRA_ITEMS = [
  {
    title: 'Modelagem de Cenários e Projeção de Caixa',
    desc: 'Projeção de entradas e saídas para os próximos meses, com cenários conservador e otimista, antecipando capital de giro ou identificando excedente.',
  },
  {
    title: 'Dashboards de Indicadores',
    desc: 'Painéis com margem bruta, ponto de equilíbrio, ticket médio, inadimplência e concentração de receita a partir dos dados contábeis.',
  },
  {
    title: 'Análise de Margem por Produto ou Serviço',
    desc: 'Identificação do que efetivamente dá lucro e do que consome estrutura sem retorno, com base na alocação de custos e despesas.',
  },
  {
    title: 'Revisão de Precificação e Margem',
    desc: 'Reconstrução de preços com base no custo real, carga tributária e margem pretendida, avaliando o impacto do regime tributário.',
  },
  {
    title: 'Planejamento de Distribuição de Lucros',
    desc: 'Simulação do impacto fiscal das diferentes formas de retirada (pró-labore, lucros, aluguel, serviços) para máxima eficiência.',
  },
  {
    title: 'Acompanhamento Periódico e Ajuste de Rota',
    desc: 'Reuniões de alinhamento com análise comparativa entre projetado e realizado, fundamentando decisões de negócio.',
  },
]

// Segmentos e áreas de atuação
const SEGMENTOS_ATUACAO = [
  {
    nome: 'Médicos (Profissões Regulamentadas)',
    desc: 'Contabilidade e consultoria para médicos: PJ unipessoal, Simples Nacional, Fator R, pró-labore e distribuição de lucros.',
    link: '/profissoes-regulamentadas/medicos',
    linkText: 'Saiba mais informações',
    destaque: true,
  },
  {
    nome: 'Clínicas e Profissionais da Saúde',
    desc: 'Gestão contábil e consultoria tributária com domínio do Fator R no Simples Nacional, equiparação hospitalar e segregação de receitas para redução lícita de tributos.',
    link: '/contabilidade-para-clinicas-medicas',
    linkText: 'Saiba mais informações',
    destaque: false,
  },
  {
    nome: 'Startups e Empresas de Tecnologia',
    desc: 'Estruturação contábil para negócios digitais, SaaS, captação de investimentos, incentivos fiscais e transição segura de regimes tributários.',
    link: '/contabilidade-para-startups-e-tech',
    linkText: 'Saiba mais informações',
  },
  {
    nome: 'Profissões Regulamentadas',
    desc: 'Atendimento direcionado a sociedades uniprofissionais, escritórios de advocacia, engenharia, arquitetura e consultoria, com apuração correta de ISS e IRPJ.',
    link: '/contato',
    linkText: 'Solicitar atendimento',
  },
  {
    nome: 'Holdings Familiares e Patrimoniais',
    desc: 'Planejamento patrimonial e sucessório, proteção de bens e otimização da carga tributária na locação e na alienação de imóveis.',
    link: '/holdings-familiares-e-patrimoniais',
    linkText: 'Saiba mais informações',
  },
  {
    nome: 'Educação e Treinamentos',
    desc: 'Assessoria contábil para instituições de ensino, escolas, cursos livres e infoprodutores, com enquadramento de atividades e aproveitamento de isenções.',
    link: '/contabilidade-para-educacao-e-treinamentos',
    linkText: 'Saiba mais informações',
  },
  {
    nome: 'Publicidade e Comunicação',
    desc: 'Contabilidade estratégica para agências de publicidade, marketing digital, produção audiovisual e veículos de comunicação, com tratamento de repasses e retenções.',
    link: '/contabilidade-para-agencias-de-publicidade',
    linkText: 'Saiba mais informações',
  },
  {
    nome: 'Agências de Viagem',
    desc: 'Contabilidade e consultoria especializada em comissão, repasse a fornecedores, câmbio, pacotes antecipados e tratamento de cancelamentos.',
    link: '/contabilidade-para-agencias-de-viagem',
    linkText: 'Saiba mais informações',
  },
  {
    nome: 'E-commerces',
    desc: 'Contabilidade para comércio eletrônico com domínio de regras de DIFAL, ICMS interestadual, marketplaces e substituição tributária.',
    link: '/contabilidade-para-ecommerce',
    linkText: 'Saiba mais informações',
  },
  {
    nome: 'MEIs e Profissionais Liberais',
    desc: 'Orientação técnica, conformidade cadastral, desenquadramento planejado e migração estruturada para microempresa (ME).',
    link: '/contato',
    linkText: 'Solicitar atendimento',
  },
]

// Planos de Acompanhamento
const PLANOS = [
  {
    id: 'essential',
    name: 'Essential',
    subtitle: 'Para empresas menores e mais simples',
    badge: 'Conformidade Ágil',
    highlight: false,
    description:
      'Desenvolvido para micro e pequenas empresas, prestadores de serviços e negócios com operações diretas que demandam contabilidade regular impecável, cumprimento rigoroso de prazos e segurança fiscal sem complexidade desnecessária.',
    includes: [
      'Escrituração contábil e fiscal completa nos padrões vigentes',
      'Processamento mensal de folha de pagamento e pró-labore dos sócios',
      'Emissão pontual de guias tributárias (DAS, DARFs, FGTS e eSocial)',
      'Envio de obrigações acessórias federais e distritais (DCTFWeb, DEFIS/ECF)',
      'Balancetes e demonstrações contábeis anuais obrigatórias',
      'Canal de atendimento direto para dúvidas rotineiras de faturamento e certidões',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    subtitle: 'O plano completo, com acompanhamento próximo e micro consultorias',
    badge: 'Mais Escolhido',
    highlight: true,
    description:
      'Solução robusta e proativa para empresas em expansão que exigem acompanhamento consultivo contínuo, micro consultorias periódicas para tomada de decisão estratégica e inteligência tributária aplicada ao dia a dia do negócio.',
    includes: [
      'Todas as entregas contábeis, fiscais e trabalhistas do plano Essential',
      'Micro consultorias e reuniões técnicas periódicas de alinhamento com a diretoria',
      'Monitoramento contínuo do Fator R e planejamento preventivo de regimes',
      'Relatórios gerenciais mensais de desempenho econômico e índices financeiros',
      'Revisão contínua de parametrização tributária e retenções na fonte',
      'Consultoria para contratações estratégicas, pró-labore e distribuição de lucros',
      'Acompanhamento de certidões negativas (CNDs) e regularidade fiscal em tempo real',
    ],
  },
  {
    id: 'on-demand',
    name: 'On Demand',
    subtitle: 'Equipe multidisciplinar sob demanda',
    badge: 'Alta Complexidade',
    highlight: false,
    description:
      'Modelo sob medida para operações complexas, demandas extraordinárias ou reestruturações societárias e tributárias que exigem a mobilização pontual de profissionais multidisciplinares e pareceres técnicos de alta especialização.',
    includes: [
      'Equipe multidisciplinar alocada para projetos pontuais ou sazonais',
      'Auditorias contábeis específicas e perícias extrajudiciais (ver Serviços Avulsos)',
      'Reestruturação societária, holding patrimonial e planejamento sucessório',
      'Defesas técnicas em contencioso administrativo e resposta a notificações fiscais',
      'Diagnósticos aprofundados para transição e impacto da Reforma Tributária',
      'Due diligence contábil e tributária para processos de fusão, cisão ou aquisição',
    ],
  },
]

// Servicos Avulsos: Bloco A: Projetos com escopo proprio
const SERVICOS_PROJETOS_ESCOPO = [
  {
    id: 'auditoria',
    icon: SearchCheck,
    title: 'Auditoria',
    modalidades: ['Contábil', 'Financeira', 'Tributária', 'Operacional'],
    description:
      'Exame independente e aprofundado das demonstrações contábeis, controles internos e procedimentos operacionais, com emissão de relatório circunstanciado e recomendações técnicas.',
    notaEscopo:
      'Projeto com escopo próprio, cronograma dedicado e equipe multidisciplinar dimensionada à demanda.',
  },
  {
    id: 'abertura-encerramento',
    icon: Building2,
    title: 'Abertura e Encerramento de Empresas',
    description:
      'Constituição, alteração e baixa de pessoas jurídicas de todos os tipos, inclusive abertura e encerramento de filiais, com verificação prévia do enquadramento tributário e dos requisitos do CNAE.',
  },
  {
    id: 'processos-administrativos-judiciais',
    icon: Briefcase,
    title: 'Assistência em Processos Administrativos e Judiciais',
    description:
      'Atuação perante processos administrativos fiscais e demandas judiciais que envolvam questões contábeis, fiscais ou trabalhistas: elaboração de manifestações, impugnações, recursos e pareceres técnicos de apoio.',
  },
  {
    id: 'reorganizacao-societaria',
    icon: GitMerge,
    title: 'Operações de Reorganização Societária',
    description:
      'Assessoria integral em cisão, fusão e incorporação, incluindo assessoria contábil e financeira, due diligence (auditoria prévia), assessoria e planejamento tributário da operação, do desenho inicial ao registro final.',
  },
  {
    id: 'reprocessamento-obrigacoes-folhas',
    icon: History,
    title: 'Reprocessamento de Obrigações e Folhas',
    description:
      'Reprocessamento de obrigações fiscais e trabalhistas e de folhas de pagamento de períodos anteriores, para correção de apurações, regularização de pendências e saneamento de passivo.',
  },
  {
    id: 'estudos-viabilidade',
    icon: LineChart,
    title: 'Estudos de Viabilidade',
    description:
      'Estudo de viabilidade para novos negócios, produtos ou serviços, com projeções financeiras, análise de carga tributária, formação de preço, capital de giro necessário e cenários de resultado.',
  },
]

// Servicos Avulsos: Bloco B: Servicos operacionais pontuais (itens existentes mantidos)
const SERVICOS_OPERACIONAIS_PONTUAIS = [
  {
    icon: GraduationCap,
    title: 'Cursos e Treinamentos',
    description:
      'Capacitações in company sobre rotinas fiscais, faturamento correto, emissão de notas fiscais e boas práticas contábeis.',
  },
  {
    icon: Laptop,
    title: 'Sistemas de Gestão',
    description:
      'Consultoria na seleção, parametrização de regras fiscais e implantação integrada de softwares ERP e de gestão financeira.',
  },
  {
    icon: KeyRound,
    title: 'Certificado Digital',
    description:
      'Suporte na emissão e renovação segura de certificados e-CNPJ e e-CPF para sócios e representantes legais da sua empresa.',
    link: '/servicos/certificado-digital',
    linkText: 'Ver mais sobre Certificado Digital',
  },
  {
    icon: Award,
    title: 'Registro e Acompanhamento de Marcas',
    description:
      'Assessoria na busca prévia, depósito e monitoramento de processos de registro de marca perante o INPI com proteção jurídica.',
    link: '/servicos/registro-de-marcas',
    linkText: 'Ver mais sobre Registro de Marcas',
  },
  {
    icon: UserCheck,
    title: 'Imposto de Renda de Pessoa Física',
    description:
      'Elaboração e cruzamento detalhado da Declaração de Ajuste Anual (DIRPF), apuração de ganho de capital, renda variável e espólio.',
  },
  {
    icon: Building,
    title: 'Pacote MEI Anual',
    description:
      'Regularização cadastral do Microempreendedor Individual, envio da DASN-SIMEI, controle de limites e plano de migração para ME.',
  },
  {
    icon: ScrollText,
    title: 'Elaboração e Revisão de Contratos',
    description:
      'Elaboração, alteração e revisão de contratos sociais, acordos de sócios, atas societárias e termos comerciais com foco fiscal.',
  },
  {
    icon: Scale,
    title: 'Perícias Judiciais e Extrajudiciais',
    description:
      'Elaboração de laudos e pareceres contábeis independentes para conciliações societárias, apuração de haveres e liquidação de quotas.',
  },
  {
    icon: Wallet,
    title: 'BPO Financeiro',
    description:
      'Assessoria na gestão operacional das rotinas financeiras da empresa, com conciliação de contas, controle de recebimentos e pagamentos e organização do fluxo financeiro.',
  },
]

export default function Services() {
  useEffect(() => {
    const pageTitle = 'Serviços Contábeis e Tributários | PERES PERES Consultoria & Contabilidade'
    const pageDesc =
      'Conheça os serviços da PERES PERES Consultoria & Contabilidade em Brasília: consultoria tributária, recuperação de créditos, consultoria trabalhista, societária e planos de acompanhamento mensal.'

    document.title = pageTitle

    let metaDescTag = document.querySelector('meta[name="description"]')
    if (!metaDescTag) {
      metaDescTag = document.createElement('meta')
      metaDescTag.setAttribute('name', 'description')
      document.head.appendChild(metaDescTag)
    }
    metaDescTag.setAttribute('content', pageDesc)
  }, [])

  return (
    <div className="bg-background min-h-screen text-foreground">
      {/* Hero da Página de Serviços */}
      <section className="bg-neutral-950 text-white py-16 md:py-24 border-b border-neutral-800">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
            Nossos Serviços e Planos de Atuação
          </h1>
          <p className="text-base md:text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            Atuação técnica de alto rigor pautada nas normas contábeis brasileiras (NBC), na
            legislação tributária vigente e em jurisprudência consolidada, garantindo governança
            fiscal, segurança jurídica e eficiência operacional contínua para sua empresa.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs md:text-sm text-neutral-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#FAB319]" /> Responsabilidade Técnica Formal
            </span>
            <span className="text-neutral-600 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#FAB319]" /> Atendimento em Brasília e Nacional
            </span>
            <span className="text-neutral-600 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#FAB319]" /> Metodologia Preventiva e Ética
            </span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl py-16 space-y-24">
        {/* =========================================================
            BLOCO 1: CONSULTORIA TRIBUTÁRIA
           ========================================================= */}
        <section id="consultoria-tributaria" className="scroll-mt-24 space-y-8">
          <div className="border-l-4 border-[#FAB319] pl-4 md:pl-6">
            <h2 className="text-2xl md:text-4xl font-bold text-black">Consultoria Tributária</h2>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-6 md:p-8 shadow-sm space-y-6">
            <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-sans">
              A <strong>Consultoria Tributária</strong> da <strong>PERES PERES</strong> é orientada
              por rigor técnico, visão preventiva e estrita aderência à legislação fiscal brasileira
              e aos entendimentos dos tribunais superiores e órgãos fazendários. Sob a liderança do
              responsável técnico <strong>Rafael Peres Peres Nunes Altoé (CRC 027704)</strong>,
              nossa metodologia afasta teses arriscadas ou soluções mágicas: realizamos uma imersão
              estruturada na cadeia produtiva do cliente para identificar oportunidades lícitas de
              elisão fiscal, sanear passivos potenciais e preparar a corporação para os impactos
              estruturais das reformas legais em curso no Distrito Federal e em âmbito nacional.
            </p>

            <div className="pt-4 border-t border-neutral-100">
              <h3 className="font-semibold text-lg text-black mb-4">O que inclui:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {TRIBUTARIA_ITEMS.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-neutral-50 border border-neutral-200/80 hover:border-neutral-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded bg-black text-[#FAB319] shrink-0 mt-0.5">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-black text-sm mb-1">{item.title}</h4>
                        <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            BLOCO 2: RECUPERAÇÃO DE CRÉDITOS
           ========================================================= */}
        <section id="recuperacao-de-creditos" className="scroll-mt-24 space-y-8">
          <div className="border-l-4 border-[#FAB319] pl-4 md:pl-6">
            <h2 className="text-2xl md:text-4xl font-bold text-black">Recuperação de Créditos</h2>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-6 md:p-8 shadow-sm space-y-6">
            <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-sans">
              A complexidade das obrigações tributárias e as sucessivas alterações normativas
              frequentemente levam as empresas a recolher tributos em duplicidade ou com bases de
              cálculo indevidas. Nosso serviço de <strong>Recuperação de Créditos</strong> atua na
              revisão minuciosa das apurações passadas dos últimos cinco anos, empregando auditoria
              documental e cruzamento eletrônico de dados fiscais para identificar e quantificar
              valores recolhidos a maior, viabilizando o seu retorno ao fluxo de caixa com absoluta
              higidez probatória perante a Receita Federal do Brasil e os órgãos fazendários
              distritais e estaduais.
            </p>

            <div className="pt-4 border-t border-neutral-100 space-y-4">
              <h3 className="font-semibold text-lg text-black mb-4">Como conduzimos o processo:</h3>
              <div className="grid md:grid-cols-3 gap-5">
                {RECUPERACAO_STEPS.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-lg bg-neutral-50 border border-neutral-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs font-bold text-[#FAB319] bg-black px-2 py-0.5 rounded">
                          ETAPA {step.step}
                        </span>
                        <RefreshCcw className="h-4 w-4 text-neutral-400" />
                      </div>
                      <h4 className="font-semibold text-black text-base mb-2">{step.title}</h4>
                      <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            BLOCO 3: CONSULTORIA TRABALHISTA
           ========================================================= */}
        <section id="consultoria-trabalhista" className="scroll-mt-24 space-y-8">
          <div className="border-l-4 border-[#FAB319] pl-4 md:pl-6">
            <h2 className="text-2xl md:text-4xl font-bold text-black">Consultoria Trabalhista</h2>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-6 md:p-8 shadow-sm space-y-6">
            <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-sans">
              As exigências do eSocial, do FGTS Digital e das convenções coletivas tornam a gestão
              de pessoal um dos principais focos de risco fiscal e passivo trabalhista para os
              empresários. A <strong>Consultoria Trabalhista</strong> da{' '}
              <strong>PERES PERES</strong> estrutura a rotina do departamento pessoal de forma
              preventiva, assegurando o correto cumprimento dos preceitos da CLT e das normas
              previdenciárias vigentes. Alinhamos a segurança jurídica da empresa ao equilíbrio
              econômico dos contratos, evitando autuações fiscais e contingências que possam
              comprometer a saúde financeira do negócio.
            </p>

            <div className="pt-4 border-t border-neutral-100">
              <h3 className="font-semibold text-lg text-black mb-4">O que inclui:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {TRABALHISTA_ITEMS.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-neutral-50 border border-neutral-200/80 hover:border-neutral-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded bg-black text-[#FAB319] shrink-0 mt-0.5">
                        <Users2 className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-black text-sm mb-1">{item.title}</h4>
                        <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            BLOCO: INTELIGÊNCIA FINANCEIRA E FLUXO DE CAIXA
           ========================================================= */}
        <section id="inteligencia-financeira" className="scroll-mt-24 space-y-8">
          <div className="border-l-4 border-[#FAB319] pl-4 md:pl-6">
            <h2 className="text-2xl md:text-4xl font-bold text-black">
              Inteligência Financeira e Fluxo de Caixa
            </h2>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-6 md:p-8 shadow-sm space-y-6">
            <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-sans">
              Modelagem de cenários, dashboards de indicadores e projeção de caixa que traduzem a
              apuração contábil em decisão de negócio. Inclui revisão de precificação, análise de
              margem por serviço e planejamento de distribuição de lucros com eficiência tributária.
            </p>

            <div className="pt-4 border-t border-neutral-100">
              <h3 className="font-semibold text-lg text-black mb-4">O que inclui:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {INTELIGENCIA_FINANCEIRA_ITEMS.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-neutral-50 border border-neutral-200/80 hover:border-neutral-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded bg-black text-[#FAB319] shrink-0 mt-0.5">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-black text-sm mb-1">{item.title}</h4>
                        <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-sm text-neutral-600">
                Conheça a metodologia completa, o problema que este serviço resolve e o que você
                recebe.
              </p>
              <Button
                asChild
                className="bg-black hover:bg-neutral-800 text-white font-semibold text-sm shrink-0"
              >
                <Link
                  to="/servicos/inteligencia-financeira"
                  className="inline-flex items-center gap-1.5"
                >
                  <span>Saiba mais sobre Inteligência Financeira</span>
                  <ArrowRight className="h-4 w-4 text-[#FAB319]" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* =========================================================
            BLOCO: SEGMENTOS E ÁREAS DE ATUAÇÃO
           ========================================================= */}
        <section id="segmentos" className="scroll-mt-24 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              Segmentos e Áreas de Atuação
            </h2>
            <p className="text-neutral-600 text-sm md:text-base leading-relaxed">
              Atendimento e soluções com domínio das peculiaridades contábeis, financeiras,
              tributárias, trabalhistas e regulatórias, especialmente dos seguintes ninhos:
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {SEGMENTOS_ATUACAO.map((item) => (
              <Card
                key={item.nome}
                className={`flex flex-col justify-between transition-all duration-300 ${
                  item.destaque
                    ? 'border-2 border-black bg-white shadow-xl relative ring-1 ring-black/5'
                    : 'border border-neutral-200 bg-white shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="h-10 w-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                        {item.destaque ? (
                          <Stethoscope className="h-5 w-5 text-black" />
                        ) : (
                          <Building2 className="h-5 w-5 text-black" />
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-black font-sans">
                      {item.nome}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </CardContent>
                </div>
                <div className="p-6 pt-4 border-t border-neutral-100">
                  <Button
                    asChild
                    variant="outline"
                    className={`w-full font-semibold h-10 text-xs md:text-sm ${
                      item.destaque
                        ? 'border-black text-black hover:bg-neutral-100'
                        : 'border-neutral-200 text-neutral-800 hover:bg-neutral-50'
                    }`}
                  >
                    <Link
                      to={item.link}
                      className="inline-flex items-center justify-center gap-1.5"
                    >
                      <span>{item.linkText}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* =========================================================
            BLOCO 4: PLANOS DE ACOMPANHAMENTO
           ========================================================= */}
        <section id="planos" className="scroll-mt-24 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block">
              Modalidades de Atendimento Contínuo
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-black">Planos de Acompanhamento</h2>
            <p className="text-neutral-600 text-sm md:text-base leading-relaxed">
              Modelos estruturados de assessoria contábil, fiscal e trabalhista dimensionados para
              as diferentes fases de maturidade e complexidade da sua empresa.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 items-stretch">
            {PLANOS.map((plano) => (
              <Card
                key={plano.id}
                className={`flex flex-col justify-between transition-all duration-300 ${
                  plano.highlight
                    ? 'border-2 border-black bg-white shadow-xl relative ring-1 ring-black/5'
                    : 'border border-neutral-200 bg-white shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded font-semibold ${
                          plano.highlight
                            ? 'bg-[#FAB319] text-black'
                            : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                        }`}
                      >
                        {plano.badge}
                      </span>
                    </div>
                    <CardTitle className="text-2xl font-bold text-black">{plano.name}</CardTitle>
                    <p className="text-xs font-medium text-neutral-600 min-h-[32px]">
                      {plano.subtitle}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-5 pt-0">
                    <p className="text-xs md:text-sm text-neutral-600 leading-relaxed border-b border-neutral-100 pb-4">
                      {plano.description}
                    </p>

                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold mb-3">
                        O que inclui:
                      </h4>
                      <ul className="space-y-2.5">
                        {plano.includes.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 text-xs md:text-sm text-neutral-700"
                          >
                            <CheckCircle2
                              className={`h-4 w-4 shrink-0 mt-0.5 ${
                                plano.highlight ? 'text-black font-bold' : 'text-neutral-500'
                              }`}
                            />
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </div>

                <div className="p-6 pt-4 border-t border-neutral-100">
                  <Button
                    asChild
                    className={`w-full font-semibold h-11 text-sm ${
                      plano.highlight
                        ? 'bg-[#FAB319] hover:bg-[#e0a116] text-black shadow-sm'
                        : 'bg-black hover:bg-neutral-800 text-white'
                    }`}
                  >
                    <Link to="/contato">
                      Solicitar Atendimento <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* =========================================================
            BLOCO 5: SERVIÇOS AVULSOS
           ========================================================= */}
        <section id="servicos-avulsos" className="scroll-mt-24 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block">
              Demandas Pontuais e Especializadas
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-black font-sans">
              Serviços Avulsos
            </h2>
            <p className="text-neutral-600 text-sm md:text-base leading-relaxed font-sans">
              Atendimentos específicos contratados de forma individual para solucionar necessidades
              técnicas, societárias e documentais sem exigência de contrato mensal.
            </p>
          </div>

          {/* Micro-título Bloco A: Projetos com escopo próprio */}
          <div className="space-y-6">
            <div className="border-l-4 border-black pl-4">
              <h3 className="text-xl md:text-2xl font-bold text-black font-sans">
                Projetos com escopo próprio
              </h3>
              <p className="text-xs md:text-sm text-neutral-600 font-sans mt-1">
                Demandas estruturadas com diagnóstico prévio, metodologia técnica dedicada e
                cronograma sob medida.
              </p>
            </div>

            {/* Destaque para Auditoria (A1) com as quatro modalidades e nota de escopo próprio */}
            <Card className="border-2 border-black bg-neutral-50/50 shadow-sm">
              <CardHeader className="p-5 md:p-6 pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-black text-[#FAB319] flex items-center justify-center shrink-0">
                      <SearchCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg md:text-xl font-bold text-black font-sans">
                        Auditoria
                      </CardTitle>
                      <p className="text-xs text-neutral-600 font-sans">
                        Contábil, Financeira, Tributária e Operacional
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded font-semibold bg-neutral-200 text-neutral-800 self-start sm:self-auto">
                    Escopo Próprio
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-5 md:p-6 pt-0 space-y-4">
                <p className="text-xs md:text-sm text-neutral-700 leading-relaxed font-sans">
                  Exame independente e aprofundado das demonstrações contábeis, controles internos e
                  procedimentos operacionais, com emissão de relatório circunstanciado e
                  recomendações técnicas.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {['Contábil', 'Financeira', 'Tributária', 'Operacional'].map((mod, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-neutral-200 rounded-md px-3 py-2 text-center text-xs font-semibold text-neutral-800 font-sans"
                    >
                      {mod}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-neutral-500 font-sans pt-1 border-t border-neutral-200">
                  Nota: Projeto conduzido sob cronograma dedicado, com alocação técnica
                  multidisciplinar conforme a complexidade e a extensão dos trabalhos.
                </div>
              </CardContent>
            </Card>

            {/* Demais itens do Bloco A (A2 a A6) em grade de 3 colunas no desktop */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
              {SERVICOS_PROJETOS_ESCOPO.filter((s) => s.id !== 'auditoria').map((servico) => {
                const Icon = servico.icon
                return (
                  <Card
                    key={servico.id}
                    className="border border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <CardHeader className="p-5 pb-3">
                      <div className="h-10 w-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-3">
                        <Icon className="h-5 w-5 text-black" />
                      </div>
                      <CardTitle className="text-base font-semibold text-black leading-snug font-sans">
                        {servico.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                        {servico.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Micro-título Bloco B: Serviços operacionais pontuais */}
          <div className="space-y-6 pt-4 border-t border-neutral-200">
            <div className="border-l-4 border-black pl-4">
              <h3 className="text-xl md:text-2xl font-bold text-black font-sans">
                Serviços operacionais pontuais
              </h3>
              <p className="text-xs md:text-sm text-neutral-600 font-sans mt-1">
                Atendimentos focados em rotinas específicas, emissões, regularizações cadastrais e
                conformidade pontual.
              </p>
            </div>

            {/* Itens existentes mantidos, em grade de 3 colunas no desktop */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
              {SERVICOS_OPERACIONAIS_PONTUAIS.map((servico, idx) => {
                const Icon = servico.icon
                return (
                  <Card
                    key={idx}
                    className="border border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <CardHeader className="p-5 pb-3">
                      <div className="h-10 w-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-3">
                        <Icon className="h-5 w-5 text-black" />
                      </div>
                      <CardTitle className="text-base font-semibold text-black leading-snug font-sans">
                        {servico.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-neutral-600 leading-relaxed mb-3 font-sans">
                        {servico.description}
                      </p>
                      {servico.link && (
                        <div className="pt-2 border-t border-neutral-100">
                          <Link
                            to={servico.link}
                            className="inline-flex items-center text-xs font-semibold text-black hover:text-[#FAB319] transition-colors group font-sans"
                          >
                            <span>{servico.linkText}</span>
                            <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            BLOCO 6: CHAMADA PARA A PÁGINA DE CONTATO (/contato)
           ========================================================= */}
        <section className="bg-black text-white p-8 md:p-12 rounded-2xl text-center border border-neutral-800 shadow-xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 border border-neutral-700 px-3 py-1 rounded text-xs font-mono uppercase tracking-wider text-neutral-300">
              <ShieldCheck className="h-3.5 w-3.5 text-[#FAB319]" />
              Atendimento Consultivo em Brasília
            </div>
            <h3 className="text-2xl md:text-4xl font-bold text-white">
              Demanda técnica específica para o seu negócio?
            </h3>
            <p className="text-neutral-300 text-sm md:text-base leading-relaxed">
              Estruturamos pareceres, diagnósticos contábeis e planejamentos tributários
              personalizados sob a responsabilidade técnica direta de{' '}
              <strong>Rafael Peres Peres Nunes Altoé (CRC 027704)</strong>, com sigilo profissional
              estrito e fundamentação legal.
            </p>
            <div className="pt-4 flex justify-center">
              <Button
                size="lg"
                className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold px-8 h-12 text-base shadow-sm"
                asChild
              >
                <Link to="/contato">Agendar Reunião</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
