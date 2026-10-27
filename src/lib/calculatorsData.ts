export interface CalculatorItem {
  id: string
  slug: string
  name: string
  shortDescription: string
  category: 'Regime Tributário' | 'Folha e Trabalhista' | 'Finanças e Tributos'
  legalBasis: string
  updatedAt: string
}

export interface CalculatorCategory {
  title: string
  description: string
  items: CalculatorItem[]
}

export const CALCULATORS: CalculatorItem[] = [
  // Bloco 1: Regime Tributário
  {
    id: 'simples-nacional-ou-lucro-presumido',
    slug: 'simples-nacional-ou-lucro-presumido',
    name: 'Simples Nacional ou Lucro Presumido',
    shortDescription:
      'Comparativo estimativo de carga tributária e encargos entre os regimes Simples Nacional e Lucro Presumido com apuração de alíquotas efetivas.',
    category: 'Regime Tributário',
    legalBasis:
      'Lei Complementar nº 123/2006 (Anexos I a V), Lei nº 9.249/1995, Lei nº 10.637/2002, Lei nº 10.833/2003 e LC nº 116/2003',
    updatedAt: 'Janeiro/2025',
  },
  {
    id: 'fator-r',
    slug: 'fator-r',
    name: 'Fator R',
    shortDescription:
      'Cálculo da relação entre folha de pagamento e receita bruta para enquadramento no Anexo III ou Anexo V.',
    category: 'Regime Tributário',
    legalBasis: 'art. 18, §§ 5º e 24, da LC 123/2006',
    updatedAt: 'Janeiro/2025',
  },
  {
    id: 'simples-nacional-hibrido',
    slug: 'simples-nacional-hibrido',
    name: 'Simples Nacional Híbrido',
    shortDescription:
      'Comparativo estimativo entre recolher ICMS e ISS dentro do DAS ou por fora, com apuração de alíquotas efetivas e segregação de receitas.',
    category: 'Regime Tributário',
    legalBasis: 'Lei Complementar nº 123/2006, art. 18 e seguintes, e Resolução CGSN nº 140/2018',
    updatedAt: 'Fevereiro/2025',
  },

  // Bloco 2: Folha e Trabalhista
  {
    id: 'custo-de-funcionario-clt',
    slug: 'custo-de-funcionario-clt',
    name: 'Custo de Funcionário CLT',
    shortDescription:
      'Cálculo detalhado do custo real de contratação CLT para a empresa: encargos patronais, FGTS, provisões de férias e 13º salário.',
    category: 'Folha e Trabalhista',
    legalBasis: 'Lei nº 8.212/1991, Lei nº 8.036/1990, LC nº 123/2006 e CLT',
    updatedAt: 'Janeiro/2025',
  },
  {
    id: 'pj-ou-clt',
    slug: 'pj-ou-clt',
    name: 'PJ ou CLT',
    shortDescription:
      'Comparativo em tempo real do custo total para a empresa e do valor líquido na mão do profissional nos cenários PJ e CLT.',
    category: 'Folha e Trabalhista',
    legalBasis: 'Lei nº 8.212/1991, Lei nº 8.036/1990, LC nº 123/2006 e tabela progressiva do IRRF',
    updatedAt: 'Fevereiro/2025',
  },
  {
    id: 'rescisao-trabalhista',
    slug: 'rescisao-trabalhista',
    name: 'Rescisão Trabalhista',
    shortDescription:
      'Estimativa das verbas rescisórias devidas conforme modalidade de desligamento e tempo de serviço.',
    category: 'Folha e Trabalhista',
    legalBasis: 'Artigos 477 a 486 da CLT e Portaria MTE nº 671/2021',
    updatedAt: 'Janeiro/2025',
  },
  {
    id: 'pro-labore-ou-dividendos',
    slug: 'pro-labore-ou-dividendos',
    name: 'Pró-labore ou Dividendos',
    shortDescription:
      'Avaliação de incidência de INSS, IRPF e distribuição isenta de lucros apurados pelos sócios.',
    category: 'Folha e Trabalhista',
    legalBasis: 'Art. 10 da Lei nº 9.249/1995 e Lei nº 8.212/1991',
    updatedAt: 'Janeiro/2025',
  },

  // Bloco 3: Finanças e Tributos
  {
    id: 'irpf-e-restituicao',
    slug: 'irpf-e-restituicao',
    name: 'IRPF e Restituição',
    shortDescription:
      'Estimativa de imposto de renda retido na fonte, faixas de tributação e potencial de restituição anual.',
    category: 'Finanças e Tributos',
    legalBasis: 'Instrução Normativa RFB nº 1.500/2014 e Lei nº 14.663/2023',
    updatedAt: 'Janeiro/2025',
  },
  {
    id: 'juros-de-mora-de-tributos',
    slug: 'juros-de-mora-de-tributos',
    name: 'Juros de Mora de Tributos',
    shortDescription:
      'Cálculo de acréscimos moratórios, multa de mora e taxa Selic acumulada sobre tributos federais em atraso.',
    category: 'Finanças e Tributos',
    legalBasis: 'Art. 61 da Lei nº 9.430/1996 e Art. 161 do Código Tributário Nacional',
    updatedAt: 'Janeiro/2025',
  },
  {
    id: 'juros-de-financiamento',
    slug: 'juros-de-financiamento',
    name: 'Juros de Financiamento',
    shortDescription:
      'Projeção das parcelas, amortização e custo efetivo total pelo sistema Price e Tabela SAC.',
    category: 'Finanças e Tributos',
    legalBasis: 'Resoluções do Banco Central do Brasil e Código Civil (Lei nº 10.406/2002)',
    updatedAt: 'Janeiro/2025',
  },
]

export const CALCULATOR_CATEGORIES: CalculatorCategory[] = [
  {
    title: 'Regime Tributário',
    description:
      'Ferramentas analíticas para avaliação de enquadramento, projeção de alíquotas efetivas e desonerações.',
    items: CALCULATORS.filter((c) => c.category === 'Regime Tributário'),
  },
  {
    title: 'Folha e Trabalhista',
    description:
      'Simulações de folha, encargos previdenciários patronais e conformidade nas relações de trabalho.',
    items: CALCULATORS.filter((c) => c.category === 'Folha e Trabalhista'),
  },
  {
    title: 'Finanças e Tributos',
    description:
      'Projeções financeiras, atualização de haveres pelo índice Selic e estimativas do imposto sobre a renda.',
    items: CALCULATORS.filter((c) => c.category === 'Finanças e Tributos'),
  },
]

export interface FAQItem {
  question: string
  answer: string
}

export const CALCULATORS_FAQS: FAQItem[] = [
  {
    question: 'As calculadoras substituem uma consultoria?',
    answer:
      'Não. As calculadoras fornecem estimativas matemáticas parametrizadas que servem como ponto de partida e orientação para a tomada de decisão. Cada pessoa jurídica possui particularidades fiscais, contratuais, societárias e creditícias que exigem auditoria detalhada. O próximo passo recomendável é a validação de cada cenário com um tributarista ou contador habilitado antes de qualquer alteração de regime ou procedimento contábil.',
  },
  {
    question: 'Com qual frequência as alíquotas e tabelas das calculadoras são revisadas?',
    answer:
      'Nossas ferramentas acompanham as alterações normativas publicadas no Diário Oficial da União, resoluções do Comitê Gestor do Simples Nacional (CGSN) e tabelas progressivas da Receita Federal do Brasil, mantendo o indicador de data da última revisão visível em cada cálculo.',
  },
  {
    question: 'Os dados digitados nas calculadoras ficam salvos nos servidores da PERES PERES?',
    answer:
      'Não. O processamento dos dados é executado em tempo de execução no próprio navegador do usuário. A PERES PERES Consultoria e Contabilidade não armazena balancetes, faturamentos, valores de salários ou informações fiscais inseridas nos formulários de estimativa.',
  },
  {
    question: 'Como é calculada a memória de cálculo apresentada nas ferramentas?',
    answer:
      'A memória de cálculo expõe os passos aritméticos e os dispositivos legais que fundamentam cada alíquota nominal, deduções e alíquotas efetivas, permitindo que a equipe contábil do próprio cliente audite e confira os critérios aplicados.',
  },
  {
    question:
      'As calculadoras consideram particularidades tributárias estaduais (ICMS) e municipais (ISS)?',
    answer:
      'As ferramentas de estimativa utilizam alíquotas de referência da legislação federal e coeficientes padrão. Regimes especiais, benefícios fiscais estaduais (como créditos outorgados de ICMS) ou alíquotas diferenciadas de ISS por município necessitam de verificação pontual no plano de trabalho da consultoria técnica.',
  },
]
