import { calcularINSSEmpregado, calcularIRRFEmpregado } from './folhaData'

// Lucros e dividendos distribuídos a sócio: parcela isenta de até R$ 50.000,00 por mês por empresa pagadora.
// Retenção na fonte de 10% sobre a parcela que exceder esse limite (Lei nº 9.249/1995, art. 10, com a
// alteração introduzida pela Lei nº 15.270/2025, com efeitos a partir de 1º/1/2026).
export const LIMITE_LUCROS_ISENTOS_MENSAL = 50000
export const ALIQUOTA_RETENCAO_LUCROS = 0.1

export interface ProLaboreDividendosInput {
  proLabore: number
  lucrosMes: number
  dependentes: number
}

export interface ProLaboreDividendosResult {
  inssProLabore: number
  irrfBrutoProLabore: number
  redutorLei15270: number
  irrfProLabore: number
  baseIrrfProLabore: number
  faixaAliquotaIrrf: number
  lucrosIsentos: number
  lucrosExcedentes: number
  retencaoLucros: number
  totalTributos: number
}

export function calcularProLaboreDividendos(
  input: ProLaboreDividendosInput,
): ProLaboreDividendosResult {
  const proLabore = Math.max(0, input.proLabore)
  const lucros = Math.max(0, input.lucrosMes)
  const dependentes = Math.max(0, Math.floor(input.dependentes))

  // Pró-labore: INSS pela tabela progressiva com teto e IRPF pela tabela mensal
  const inssProLabore = calcularINSSEmpregado(proLabore)
  const irrf = calcularIRRFEmpregado(proLabore, inssProLabore, dependentes)

  // Lucros e dividendos: parcela até o limite é isenta, o excedente sofre retenção de 10%
  const lucrosIsentos = Math.min(lucros, LIMITE_LUCROS_ISENTOS_MENSAL)
  const lucrosExcedentes = Math.max(0, lucros - LIMITE_LUCROS_ISENTOS_MENSAL)
  const retencaoLucros = lucrosExcedentes * ALIQUOTA_RETENCAO_LUCROS

  return {
    inssProLabore,
    irrfBrutoProLabore: irrf.irrfBruto,
    redutorLei15270: irrf.redutorLei15270,
    irrfProLabore: irrf.irrfFinal,
    baseIrrfProLabore: irrf.baseUsada,
    faixaAliquotaIrrf: irrf.faixaAliq,
    lucrosIsentos,
    lucrosExcedentes,
    retencaoLucros,
    totalTributos: inssProLabore + irrf.irrfFinal + retencaoLucros,
  }
}
