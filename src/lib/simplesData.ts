// Tabelas dos Anexos do Simples Nacional e Parâmetros Tributários
// Lei Complementar nº 123/2006 (art. 18 e seguintes) e Resoluções CGSN

export const SIMPLES_NACIONAL_VIGENCIA = {
  ultimaRevisao: 'Outubro/2026',
  rotuloRevisao: 'Parâmetros conferidos em outubro/2026',
  baseLegal:
    'Lei Complementar nº 123/2006 (art. 18 e seguintes), Resolução CGSN nº 140/2018 e alterações posteriores',
  tetoReceitaBrutaAnual: 4800000,
  sublimiteEstadual: 3600000,
  notaTecnica:
    'Tabelas progressivas dos Anexos I a V da LC 123/2006 com apuração de alíquota efetiva e dedução de parcelas.',
}

export interface FaixaSimplesNacional {
  limite: number
  aliqNominal: number
  deducao: number
}

// Anexo I - Comércio
export const ANEXO_I_FAIXAS: FaixaSimplesNacional[] = [
  { limite: 180000, aliqNominal: 0.04, deducao: 0 },
  { limite: 360000, aliqNominal: 0.073, deducao: 5940 },
  { limite: 720000, aliqNominal: 0.095, deducao: 13860 },
  { limite: 1800000, aliqNominal: 0.107, deducao: 22500 },
  { limite: 3600000, aliqNominal: 0.143, deducao: 87300 },
  { limite: 4800000, aliqNominal: 0.19, deducao: 378000 },
]

// Anexo II - Indústria
export const ANEXO_II_FAIXAS: FaixaSimplesNacional[] = [
  { limite: 180000, aliqNominal: 0.045, deducao: 0 },
  { limite: 360000, aliqNominal: 0.078, deducao: 5940 },
  { limite: 720000, aliqNominal: 0.1, deducao: 13860 },
  { limite: 1800000, aliqNominal: 0.112, deducao: 22500 },
  { limite: 3600000, aliqNominal: 0.147, deducao: 85500 },
  { limite: 4800000, aliqNominal: 0.3, deducao: 720000 },
]

// Anexo III - Serviços (com Fator R >= 28% ou atividades vinculadas diretamente ao Anexo III)
export const ANEXO_III_FAIXAS: FaixaSimplesNacional[] = [
  { limite: 180000, aliqNominal: 0.06, deducao: 0 },
  { limite: 360000, aliqNominal: 0.112, deducao: 9360 },
  { limite: 720000, aliqNominal: 0.135, deducao: 17640 },
  { limite: 1800000, aliqNominal: 0.16, deducao: 35640 },
  { limite: 3600000, aliqNominal: 0.21, deducao: 125640 },
  { limite: 4800000, aliqNominal: 0.33, deducao: 648000 },
]

// Anexo IV - Serviços (obras, vigilância, limpeza, advocacia - CPP fora do DAS)
export const ANEXO_IV_FAIXAS: FaixaSimplesNacional[] = [
  { limite: 180000, aliqNominal: 0.045, deducao: 0 },
  { limite: 360000, aliqNominal: 0.09, deducao: 8100 },
  { limite: 720000, aliqNominal: 0.102, deducao: 12420 },
  { limite: 1800000, aliqNominal: 0.14, deducao: 39780 },
  { limite: 3600000, aliqNominal: 0.22, deducao: 183780 },
  { limite: 4800000, aliqNominal: 0.33, deducao: 579780 },
]

// Anexo V - Serviços (com Fator R < 28%)
export const ANEXO_V_FAIXAS: FaixaSimplesNacional[] = [
  { limite: 180000, aliqNominal: 0.155, deducao: 0 },
  { limite: 360000, aliqNominal: 0.18, deducao: 4500 },
  { limite: 720000, aliqNominal: 0.195, deducao: 9900 },
  { limite: 1800000, aliqNominal: 0.205, deducao: 17100 },
  { limite: 3600000, aliqNominal: 0.23, deducao: 62100 },
  { limite: 4800000, aliqNominal: 0.305, deducao: 540000 },
]
