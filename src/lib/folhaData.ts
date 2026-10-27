// Parâmetros oficiais de folha e encargos trabalhistas vigentes em 2026
// Portaria Interministerial MPS/MF nº 13/2026 (INSS segurados empregados)
// Lei nº 15.270/2025 (Redutor de IRRF / Art. 3º-A da Lei nº 9.250/1995)
// Instrução Normativa RFB (Tabela mensal progressiva do IRRF 2026)

export const FOLHA_TRABALHISTA_VIGENCIA = {
  competencia: '2026',
  ultimaConferencia: 'Outubro/2026',
  rotuloConferencia: 'Parâmetros conferidos em outubro/2026',
  inssPortaria: 'Portaria Interministerial MPS/MF nº 13/2026',
  irrfLei: 'Lei nº 15.270/2025 e Lei nº 9.250/1995',
  salarioMinimoNacional: 1621.0,
  tetoInss: 8475.55,
  descontoSimplificadoMensalIRRF: 607.2,
  deducaoPorDependenteIRRF: 189.59,
}

// Tabela progressiva do INSS do Empregado (Portaria Interministerial MPS/MF nº 13/2026)
export interface FaixaINSS {
  limite: number
  aliq: number
}

export const INSS_FAIXAS_2026: FaixaINSS[] = [
  { limite: 1621.0, aliq: 0.075 },
  { limite: 2902.84, aliq: 0.09 },
  { limite: 4354.27, aliq: 0.12 },
  { limite: 8475.55, aliq: 0.14 },
]

// Tabela progressiva mensal do IRRF vigente em 2026
export interface FaixaIRRFMensal {
  limite: number
  aliq: number
  deducao: number
}

export const IRRF_FAIXAS_2026: FaixaIRRFMensal[] = [
  { limite: 2428.8, aliq: 0, deducao: 0 },
  { limite: 2826.65, aliq: 0.075, deducao: 182.16 },
  { limite: 3751.05, aliq: 0.15, deducao: 394.16 },
  { limite: 4664.68, aliq: 0.225, deducao: 675.49 },
  { limite: Infinity, aliq: 0.275, deducao: 908.73 },
]

export const DEDUCAO_DEPENDENTE_IRRF = FOLHA_TRABALHISTA_VIGENCIA.deducaoPorDependenteIRRF
export const DESCONTO_SIMPLIFICADO_IRRF = FOLHA_TRABALHISTA_VIGENCIA.descontoSimplificadoMensalIRRF
export const SALARIO_MINIMO_2026 = FOLHA_TRABALHISTA_VIGENCIA.salarioMinimoNacional

export function calcularINSSEmpregado(salario: number): number {
  if (salario <= 0) return 0

  let inssTotal = 0
  let faixaAnterior = 0

  for (let i = 0; i < INSS_FAIXAS_2026.length; i++) {
    const { limite, aliq } = INSS_FAIXAS_2026[i]
    if (salario > limite) {
      inssTotal += (limite - faixaAnterior) * aliq
      faixaAnterior = limite
    } else {
      inssTotal += (salario - faixaAnterior) * aliq
      faixaAnterior = salario
      break
    }
  }

  return inssTotal
}

export function calcularRedutorLei15270(rendimentoBruto: number, irrfBruto: number): number {
  if (rendimentoBruto <= 0 || irrfBruto <= 0) return 0

  // Art. 3º-A da Lei nº 9.250/1995 (incluído pela Lei nº 15.270/2025):
  // Faixa 1: até R$ 5.000,00 -> redução de até R$ 312,89 (de modo que o imposto devido seja zero)
  if (rendimentoBruto <= 5000) {
    return Math.min(irrfBruto, 312.89)
  }

  // Faixa 2: de R$ 5.000,01 até R$ 7.350,00 -> R$ 978,62 - (0,133145 * rendimentos)
  if (rendimentoBruto <= 7350) {
    const formulaReducao = 978.62 - 0.133145 * rendimentoBruto
    const reducaoCalculada = Math.max(0, formulaReducao)
    return Math.min(irrfBruto, reducaoCalculada)
  }

  // Acima de R$ 7.350,00 -> sem redução
  return 0
}

export function calcularIRRFEmpregado(
  salario: number,
  inssRetido: number,
  dependentes: number,
): {
  irrfBruto: number
  redutorLei15270: number
  irrfFinal: number
  baseUsada: number
  faixaAliq: number
} {
  if (salario <= 0) {
    return { irrfBruto: 0, redutorLei15270: 0, irrfFinal: 0, baseUsada: 0, faixaAliq: 0 }
  }

  // Opção 1: deduções legais (INSS + dependentes)
  const deducaoLegal = inssRetido + dependentes * DEDUCAO_DEPENDENTE_IRRF
  const baseLegal = Math.max(0, salario - deducaoLegal)

  // Opção 2: desconto simplificado legal (R$ 607,20 em 2026)
  const baseSimplificada = Math.max(0, salario - DESCONTO_SIMPLIFICADO_IRRF)

  // A Receita Federal aplica a mais vantajosa ao contribuinte (menor base de cálculo)
  const baseCalculo = Math.min(baseLegal, baseSimplificada)

  let irrfCalculado = 0
  let faixaAliq = 0

  for (let i = 0; i < IRRF_FAIXAS_2026.length; i++) {
    const f = IRRF_FAIXAS_2026[i]
    if (baseCalculo <= f.limite) {
      faixaAliq = f.aliq
      irrfCalculado = Math.max(0, baseCalculo * f.aliq - f.deducao)
      break
    }
  }

  // Redutor da Lei nº 15.270/2025 aplicado sobre o imposto apurado com base no rendimento
  const redutor = calcularRedutorLei15270(salario, irrfCalculado)
  const irrfFinal = Math.max(0, irrfCalculado - redutor)

  return {
    irrfBruto: irrfCalculado,
    redutorLei15270: redutor,
    irrfFinal,
    baseUsada: baseCalculo,
    faixaAliq,
  }
}
