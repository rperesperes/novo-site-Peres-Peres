export const SITE_INFO = {
  name: 'Peres & Peres Contabilidade',
  phone: '+55 61 9999-9999',
  email: 'contato@peres-peres.com.br',
  address: 'SCN Quadra 2 Bloco D, Brasília - DF, 70712-903',
  crc: 'CRC 027704/O',
}

export const SERVICES = [
  {
    title: 'Planejamento Tributário',
    description:
      'Análise aprofundada para escolha do regime mais vantajoso, visando a redução legal da carga tributária.',
    icon: 'Calculator',
  },
  {
    title: 'Recuperação de Créditos',
    description:
      'Identificação e restituição de tributos pagos a maior ou indevidamente nos últimos 5 anos.',
    icon: 'RefreshCcw',
  },
  {
    title: 'Holding Familiar',
    description:
      'Estruturação societária para proteção patrimonial e eficiência na sucessão hereditária.',
    icon: 'Shield',
  },
  {
    title: 'Contencioso Administrativo',
    description: 'Defesa especializada em autos de infração perante o CARF e conselhos regionais.',
    icon: 'Scale',
  },
]

export const CASES = [
  {
    id: '1',
    title: 'Indústria: Redução via Súmula X do CARF',
    sector: 'Indústria',
    before: 1200000,
    after: 900000,
    savings: '25%',
    description:
      'Aplicação de jurisprudência pacificada do CARF resultou em exclusão de rubricas da base de cálculo do PIS/COFINS.',
  },
  {
    id: '2',
    title: 'Varejo: Exclusão do ICMS',
    sector: 'Varejo',
    before: 500000,
    after: 350000,
    savings: '30%',
    description:
      'Recuperação de créditos baseada na "Tese do Século" do STF, ajustando a sistemática de recolhimento.',
  },
  {
    id: '3',
    title: 'Serviços: Reenquadramento Tributário',
    sector: 'Serviços (TI)',
    before: 200000,
    after: 140000,
    savings: '30%',
    description:
      'Transição estratégica do Lucro Presumido para o Simples Nacional com Anexo adequado ao Fator R.',
  },
]

export const BLOG_POSTS = [
  {
    id: '1',
    title: 'Impactos da Reforma Tributária em 2026',
    category: 'Legislação',
    date: '10 Abr 2026',
    excerpt:
      'Uma análise profunda sobre o novo IVA Dual e como as empresas do DF devem se preparar.',
  },
  {
    id: '2',
    title: 'Holding Familiar: Muito além da sucessão',
    category: 'Gestão Patrimonial',
    date: '25 Mar 2026',
    excerpt:
      'Descubra as vantagens tributárias na integralização de imóveis no capital social da holding.',
  },
  {
    id: '3',
    title: 'Como funciona a Recuperação de Créditos (RCT)?',
    category: 'Recuperação',
    date: '12 Fev 2026',
    excerpt:
      'Entenda os passos legais para recuperar impostos pagos indevidamente sem risco de autuação.',
  },
]

export const GLOSSARY = [
  {
    term: 'CARF',
    definition:
      'Conselho Administrativo de Recursos Fiscais. Órgão colegiado do Ministério da Fazenda que julga recursos de ofício e voluntários de decisão de primeira instância.',
  },
  {
    term: 'Elisão Fiscal',
    definition:
      'Prática lícita de planejamento tributário, buscando a menor carga tributária possível dentro da lei.',
  },
  {
    term: 'Evasão Fiscal',
    definition:
      'Prática ilícita de sonegação de impostos. Totalmente contrária aos princípios da Peres & Peres.',
  },
  {
    term: 'Fator R',
    definition:
      'Cálculo utilizado no Simples Nacional para determinar se uma empresa de serviços será tributada pelo Anexo III ou V.',
  },
  {
    term: 'RCT',
    definition:
      'Recuperação de Créditos Tributários. Processo administrativo ou judicial para reaver impostos pagos indevidamente.',
  },
]
