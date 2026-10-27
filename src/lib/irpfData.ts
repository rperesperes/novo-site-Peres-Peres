// Parâmetros oficiais da Tabela Progressiva Anual do IRPF
// Exercício 2026 / Ano-calendário 2025
// Art. 8º da Lei nº 9.250/1995 e Tabela Progressiva Anual da Receita Federal do Brasil

export const IRPF_ANUAL_VIGENCIA = {
  anoCalendario: 2025,
  exercicio: 2026,
  rotuloExercicio: 'ano-calendário 2025 / exercício 2026',
  ultimaConferencia: 'Outubro/2026',
  rotuloConferencia: 'Parâmetros conferidos em outubro/2026',
  baseLegal: 'Art. 8º da Lei nº 9.250/1995 e Tabela Progressiva Anual da RFB (exercício 2026)',
  deducaoAnualPorDependente: 2275.08,
  limiteAnualEducacaoPorPessoa: 3561.5,
  limitePercentualPGBL: 0.12,
  limiteDescontoSimplificado: 16754.34,
  percentualDescontoSimplificado: 0.2,
  faixaIsencaoAnual: 28467.2,
}

export interface FaixaIRPF {
  numero: number
  nome: string
  limiteInferior: number
  limiteSuperior: number
  aliquota: number
  parcelaDeduzir: number
  faixaTexto: string
}

export const DEDUCAO_ANUAL_POR_DEPENDENTE = IRPF_ANUAL_VIGENCIA.deducaoAnualPorDependente
export const LIMITE_ANUAL_EDUCACAO_POR_PESSOA = IRPF_ANUAL_VIGENCIA.limiteAnualEducacaoPorPessoa
export const LIMITE_PERCENTUAL_PGBL = IRPF_ANUAL_VIGENCIA.limitePercentualPGBL
export const LIMITE_DESCONTO_SIMPLIFICADO = IRPF_ANUAL_VIGENCIA.limiteDescontoSimplificado

export const TABELA_PROGRESSIVA_ANUAL: FaixaIRPF[] = [
  {
    numero: 1,
    nome: 'Faixa 1 (Isenta)',
    limiteInferior: 0,
    limiteSuperior: 28467.2,
    aliquota: 0,
    parcelaDeduzir: 0,
    faixaTexto: 'Até R$ 28.467,20',
  },
  {
    numero: 2,
    nome: 'Faixa 2 (7,5%)',
    limiteInferior: 28467.2,
    limiteSuperior: 33919.8,
    aliquota: 0.075,
    parcelaDeduzir: 2135.04,
    faixaTexto: 'De R$ 28.467,21 até R$ 33.919,80',
  },
  {
    numero: 3,
    nome: 'Faixa 3 (15,0%)',
    limiteInferior: 33919.8,
    limiteSuperior: 45012.6,
    aliquota: 0.15,
    parcelaDeduzir: 4679.03,
    faixaTexto: 'De R$ 33.919,81 até R$ 45.012,60',
  },
  {
    numero: 4,
    nome: 'Faixa 4 (22,5%)',
    limiteInferior: 45012.6,
    limiteSuperior: 55976.16,
    aliquota: 0.225,
    parcelaDeduzir: 8054.97,
    faixaTexto: 'De R$ 45.012,61 até R$ 55.976,16',
  },
  {
    numero: 5,
    nome: 'Faixa 5 (27,5%)',
    limiteInferior: 55976.16,
    limiteSuperior: Infinity,
    aliquota: 0.275,
    parcelaDeduzir: 10853.78,
    faixaTexto: 'Acima de R$ 55.976,16',
  },
]
