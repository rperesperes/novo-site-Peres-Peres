export interface RealCase {
  id: string
  slug: string
  title: string
  category: 'Regime tributário' | 'Recuperação de crédito' | 'Estruturação societária'
  date: string // formato ISO YYYY-MM-DD para ordenação precisa
  dateFormatted: string // visual em português
  summary: string // Resumo de duas linhas para o card
  companyContext: string // Contexto da empresa
  identifiedSituation: string // Situação identificada
  legalBasis: string // Fundamento legal aplicado
  actionsTaken: string // O que foi feito
  obtainedResult: string // Resultado obtido
}

export const REAL_CASES: RealCase[] = [
  {
    id: '1',
    slug: 'revisao-enquadramento-tributario-distribuidora',
    title: 'Revisão e Adequação de Enquadramento Tributário em Distribuidora Regional',
    category: 'Regime tributário',
    date: '2026-03-15',
    dateFormatted: '15 de março de 2026',
    summary:
      'Diagnóstico comparativo e modelagem tributária entre Lucro Real e Lucro Presumido para otimização de recolhimentos operacionais e estrita conformidade fiscal.',
    companyContext:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    identifiedSituation:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus.',
    legalBasis:
      'Nulla facilisi. Etiam cursus leo vel metus facilisis, sed interdum libero luctus. Cras scelerisque hendrerit turpis, at gravida arcu pellentesque vel. Proin auctor erat at erat commodo feugiat.',
    actionsTaken:
      'Suspendisse potenti. Mauris non erat convallis, convallis erat in, rhoncus elit. Vivamus vel turpis lorem. Pellentesque eu facilisis ante, nec commodo libero. Integer volutpat feugiat ipsum a tincidunt.',
    obtainedResult:
      'Fusce feugiat purus sed nibh aliquam, vitae pulvinar nisi sagittis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam bibendum elit sed nisl finibus, a porta eros tincidunt.',
  },
  {
    id: '2',
    slug: 'apuracao-creditos-pis-cofins-insumos',
    title: 'Apuração e Levantamento Administrativo de Créditos de PIS e COFINS sobre Insumos',
    category: 'Recuperação de crédito',
    date: '2026-02-20',
    dateFormatted: '20 de fevereiro de 2026',
    summary:
      'Auditoria de escriturações digitais e notas fiscais para apuração de créditos da não cumulatividade sobre insumos essenciais da atividade produtiva.',
    companyContext:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.',
    identifiedSituation:
      'Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra.',
    legalBasis:
      'Inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis.',
    actionsTaken:
      'Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet.',
    obtainedResult:
      'Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra.',
  },
  {
    id: '3',
    slug: 'reorganizacao-societaria-holding-patrimonial',
    title: 'Planejamento e Reorganização Societária com Constituição de Holding Patrimonial',
    category: 'Estruturação societária',
    date: '2026-01-10',
    dateFormatted: '10 de janeiro de 2026',
    summary:
      'Segregação estruturada de ativos operacionais e imobiliários voltada à governança corporativa, proteção patrimonial e planejamento sucessório.',
    companyContext:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus. Phasellus ultrices nulla quis nibh.',
    identifiedSituation:
      'Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi. Pellentesque fermentum dolor.',
    legalBasis:
      'Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc. Sed adipiscing ornare risus. Morbi est est, blandit sit amet, hendrerit sit amet, vulputate ac, quam.',
    actionsTaken:
      'Donec condimentum accumsan neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Morbi non quam nec dui luctus rutrum.',
    obtainedResult:
      'Nullam vulputate erat id purus. Curabitur accumsan feugiat augue. Proin feugiat adipiscing libero. Vivamus sollicitudin ipsum et ante. Morbi ut lacus et tellus cursus fermentum.',
  },
]
