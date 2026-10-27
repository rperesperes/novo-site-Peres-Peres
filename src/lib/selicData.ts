// Série histórica mensal da taxa Selic oficial apurada pelo Banco Central do Brasil (Série SGS 4390)
// e Receita Federal do Brasil (Sicalc).
// A chave é no formato AAAA-MM (ex: '2025-01') e o valor é a taxa percentual do mês (% a.m.).
// Vigência de referência documentada na ferramenta: atualizada com base na série oficial divulgada.

export const SELIC_SERIE_VIGENCIA = {
  competenciaConsolidada: 'Setembro/2026',
  taxaMaisRecente: 1.08,
  ultimaConferencia: 'Outubro/2026',
  rotuloConferencia: 'Parâmetros conferidos em outubro/2026',
  rotuloConsolidacao: 'Consolidada até setembro/2026',
  baseLegal:
    'Art. 61 da Lei nº 9.430/1996, Art. 13 da Lei nº 9.065/1995 e Art. 84 da Lei nº 8.981/1995',
  fonteOficial: 'Banco Central do Brasil (Série SGS 4390) e Receita Federal do Brasil (Sicalc)',
}

export interface SelicMonthlyEntry {
  yearMonth: string // "YYYY-MM"
  year: number
  month: number // 1 a 12
  monthLabel: string // "Janeiro/2025"
  rate: number // percentual ao mês, ex: 1.01 para 1,01%
}

// Histórico mensal oficial desde 2015 até os meses mais recentes consolidados
export const OFFICIAL_SELIC_MONTHLY_SERIES: SelicMonthlyEntry[] = [
  // 2015
  { yearMonth: '2015-01', year: 2015, month: 1, monthLabel: 'Janeiro/2015', rate: 0.94 },
  { yearMonth: '2015-02', year: 2015, month: 2, monthLabel: 'Fevereiro/2015', rate: 0.82 },
  { yearMonth: '2015-03', year: 2015, month: 3, monthLabel: 'Março/2015', rate: 1.04 },
  { yearMonth: '2015-04', year: 2015, month: 4, monthLabel: 'Abril/2015', rate: 0.95 },
  { yearMonth: '2015-05', year: 2015, month: 5, monthLabel: 'Maio/2015', rate: 0.99 },
  { yearMonth: '2015-06', year: 2015, month: 6, monthLabel: 'Junho/2015', rate: 1.07 },
  { yearMonth: '2015-07', year: 2015, month: 7, monthLabel: 'Julho/2015', rate: 1.18 },
  { yearMonth: '2015-08', year: 2015, month: 8, monthLabel: 'Agosto/2015', rate: 1.11 },
  { yearMonth: '2015-09', year: 2015, month: 9, monthLabel: 'Setembro/2015', rate: 1.11 },
  { yearMonth: '2015-10', year: 2015, month: 10, monthLabel: 'Outubro/2015', rate: 1.11 },
  { yearMonth: '2015-11', year: 2015, month: 11, monthLabel: 'Novembro/2015', rate: 1.06 },
  { yearMonth: '2015-12', year: 2015, month: 12, monthLabel: 'Dezembro/2015', rate: 1.16 },

  // 2016
  { yearMonth: '2016-01', year: 2016, month: 1, monthLabel: 'Janeiro/2016', rate: 1.06 },
  { yearMonth: '2016-02', year: 2016, month: 2, monthLabel: 'Fevereiro/2016', rate: 1.0 },
  { yearMonth: '2016-03', year: 2016, month: 3, monthLabel: 'Março/2016', rate: 1.16 },
  { yearMonth: '2016-04', year: 2016, month: 4, monthLabel: 'Abril/2016', rate: 1.06 },
  { yearMonth: '2016-05', year: 2016, month: 5, monthLabel: 'Maio/2016', rate: 1.11 },
  { yearMonth: '2016-06', year: 2016, month: 6, monthLabel: 'Junho/2016', rate: 1.16 },
  { yearMonth: '2016-07', year: 2016, month: 7, monthLabel: 'Julho/2016', rate: 1.11 },
  { yearMonth: '2016-08', year: 2016, month: 8, monthLabel: 'Agosto/2016', rate: 1.22 },
  { yearMonth: '2016-09', year: 2016, month: 9, monthLabel: 'Setembro/2016', rate: 1.11 },
  { yearMonth: '2016-10', year: 2016, month: 10, monthLabel: 'Outubro/2016', rate: 1.05 },
  { yearMonth: '2016-11', year: 2016, month: 11, monthLabel: 'Novembro/2016', rate: 1.04 },
  { yearMonth: '2016-12', year: 2016, month: 12, monthLabel: 'Dezembro/2016', rate: 1.12 },

  // 2017
  { yearMonth: '2017-01', year: 2017, month: 1, monthLabel: 'Janeiro/2017', rate: 1.09 },
  { yearMonth: '2017-02', year: 2017, month: 2, monthLabel: 'Fevereiro/2017', rate: 0.87 },
  { yearMonth: '2017-03', year: 2017, month: 3, monthLabel: 'Março/2017', rate: 1.05 },
  { yearMonth: '2017-04', year: 2017, month: 4, monthLabel: 'Abril/2017', rate: 0.79 },
  { yearMonth: '2017-05', year: 2017, month: 5, monthLabel: 'Maio/2017', rate: 0.93 },
  { yearMonth: '2017-06', year: 2017, month: 6, monthLabel: 'Junho/2017', rate: 0.81 },
  { yearMonth: '2017-07', year: 2017, month: 7, monthLabel: 'Julho/2017', rate: 0.8 },
  { yearMonth: '2017-08', year: 2017, month: 8, monthLabel: 'Agosto/2017', rate: 0.8 },
  { yearMonth: '2017-09', year: 2017, month: 9, monthLabel: 'Setembro/2017', rate: 0.64 },
  { yearMonth: '2017-10', year: 2017, month: 10, monthLabel: 'Outubro/2017', rate: 0.64 },
  { yearMonth: '2017-11', year: 2017, month: 11, monthLabel: 'Novembro/2017', rate: 0.57 },
  { yearMonth: '2017-12', year: 2017, month: 12, monthLabel: 'Dezembro/2017', rate: 0.54 },

  // 2018
  { yearMonth: '2018-01', year: 2018, month: 1, monthLabel: 'Janeiro/2018', rate: 0.58 },
  { yearMonth: '2018-02', year: 2018, month: 2, monthLabel: 'Fevereiro/2018', rate: 0.47 },
  { yearMonth: '2018-03', year: 2018, month: 3, monthLabel: 'Março/2018', rate: 0.53 },
  { yearMonth: '2018-04', year: 2018, month: 4, monthLabel: 'Abril/2018', rate: 0.52 },
  { yearMonth: '2018-05', year: 2018, month: 5, monthLabel: 'Maio/2018', rate: 0.52 },
  { yearMonth: '2018-06', year: 2018, month: 6, monthLabel: 'Junho/2018', rate: 0.52 },
  { yearMonth: '2018-07', year: 2018, month: 7, monthLabel: 'Julho/2018', rate: 0.54 },
  { yearMonth: '2018-08', year: 2018, month: 8, monthLabel: 'Agosto/2018', rate: 0.57 },
  { yearMonth: '2018-09', year: 2018, month: 9, monthLabel: 'Setembro/2018', rate: 0.47 },
  { yearMonth: '2018-10', year: 2018, month: 10, monthLabel: 'Outubro/2018', rate: 0.54 },
  { yearMonth: '2018-11', year: 2018, month: 11, monthLabel: 'Novembro/2018', rate: 0.49 },
  { yearMonth: '2018-12', year: 2018, month: 12, monthLabel: 'Dezembro/2018', rate: 0.49 },

  // 2019
  { yearMonth: '2019-01', year: 2019, month: 1, monthLabel: 'Janeiro/2019', rate: 0.54 },
  { yearMonth: '2019-02', year: 2019, month: 2, monthLabel: 'Fevereiro/2019', rate: 0.49 },
  { yearMonth: '2019-03', year: 2019, month: 3, monthLabel: 'Março/2019', rate: 0.47 },
  { yearMonth: '2019-04', year: 2019, month: 4, monthLabel: 'Abril/2019', rate: 0.52 },
  { yearMonth: '2019-05', year: 2019, month: 5, monthLabel: 'Maio/2019', rate: 0.54 },
  { yearMonth: '2019-06', year: 2019, month: 6, monthLabel: 'Junho/2019', rate: 0.47 },
  { yearMonth: '2019-07', year: 2019, month: 7, monthLabel: 'Julho/2019', rate: 0.57 },
  { yearMonth: '2019-08', year: 2019, month: 8, monthLabel: 'Agosto/2019', rate: 0.5 },
  { yearMonth: '2019-09', year: 2019, month: 9, monthLabel: 'Setembro/2019', rate: 0.46 },
  { yearMonth: '2019-10', year: 2019, month: 10, monthLabel: 'Outubro/2019', rate: 0.48 },
  { yearMonth: '2019-11', year: 2019, month: 11, monthLabel: 'Novembro/2019', rate: 0.38 },
  { yearMonth: '2019-12', year: 2019, month: 12, monthLabel: 'Dezembro/2019', rate: 0.37 },

  // 2020
  { yearMonth: '2020-01', year: 2020, month: 1, monthLabel: 'Janeiro/2020', rate: 0.38 },
  { yearMonth: '2020-02', year: 2020, month: 2, monthLabel: 'Fevereiro/2020', rate: 0.29 },
  { yearMonth: '2020-03', year: 2020, month: 3, monthLabel: 'Março/2020', rate: 0.34 },
  { yearMonth: '2020-04', year: 2020, month: 4, monthLabel: 'Abril/2020', rate: 0.28 },
  { yearMonth: '2020-05', year: 2020, month: 5, monthLabel: 'Maio/2020', rate: 0.24 },
  { yearMonth: '2020-06', year: 2020, month: 6, monthLabel: 'Junho/2020', rate: 0.21 },
  { yearMonth: '2020-07', year: 2020, month: 7, monthLabel: 'Julho/2020', rate: 0.19 },
  { yearMonth: '2020-08', year: 2020, month: 8, monthLabel: 'Agosto/2020', rate: 0.16 },
  { yearMonth: '2020-09', year: 2020, month: 9, monthLabel: 'Setembro/2020', rate: 0.16 },
  { yearMonth: '2020-10', year: 2020, month: 10, monthLabel: 'Outubro/2020', rate: 0.16 },
  { yearMonth: '2020-11', year: 2020, month: 11, monthLabel: 'Novembro/2020', rate: 0.15 },
  { yearMonth: '2020-12', year: 2020, month: 12, monthLabel: 'Dezembro/2020', rate: 0.16 },

  // 2021
  { yearMonth: '2021-01', year: 2021, month: 1, monthLabel: 'Janeiro/2021', rate: 0.15 },
  { yearMonth: '2021-02', year: 2021, month: 2, monthLabel: 'Fevereiro/2021', rate: 0.13 },
  { yearMonth: '2021-03', year: 2021, month: 3, monthLabel: 'Março/2021', rate: 0.2 },
  { yearMonth: '2021-04', year: 2021, month: 4, monthLabel: 'Abril/2021', rate: 0.21 },
  { yearMonth: '2021-05', year: 2021, month: 5, monthLabel: 'Maio/2021', rate: 0.27 },
  { yearMonth: '2021-06', year: 2021, month: 6, monthLabel: 'Junho/2021', rate: 0.31 },
  { yearMonth: '2021-07', year: 2021, month: 7, monthLabel: 'Julho/2021', rate: 0.36 },
  { yearMonth: '2021-08', year: 2021, month: 8, monthLabel: 'Agosto/2021', rate: 0.43 },
  { yearMonth: '2021-09', year: 2021, month: 9, monthLabel: 'Setembro/2021', rate: 0.44 },
  { yearMonth: '2021-10', year: 2021, month: 10, monthLabel: 'Outubro/2021', rate: 0.49 },
  { yearMonth: '2021-11', year: 2021, month: 11, monthLabel: 'Novembro/2021', rate: 0.59 },
  { yearMonth: '2021-12', year: 2021, month: 12, monthLabel: 'Dezembro/2021', rate: 0.77 },

  // 2022
  { yearMonth: '2022-01', year: 2022, month: 1, monthLabel: 'Janeiro/2022', rate: 0.73 },
  { yearMonth: '2022-02', year: 2022, month: 2, monthLabel: 'Fevereiro/2022', rate: 0.76 },
  { yearMonth: '2022-03', year: 2022, month: 3, monthLabel: 'Março/2022', rate: 0.93 },
  { yearMonth: '2022-04', year: 2022, month: 4, monthLabel: 'Abril/2022', rate: 0.83 },
  { yearMonth: '2022-05', year: 2022, month: 5, monthLabel: 'Maio/2022', rate: 1.03 },
  { yearMonth: '2022-06', year: 2022, month: 6, monthLabel: 'Junho/2022', rate: 1.02 },
  { yearMonth: '2022-07', year: 2022, month: 7, monthLabel: 'Julho/2022', rate: 1.03 },
  { yearMonth: '2022-08', year: 2022, month: 8, monthLabel: 'Agosto/2022', rate: 1.17 },
  { yearMonth: '2022-09', year: 2022, month: 9, monthLabel: 'Setembro/2022', rate: 1.07 },
  { yearMonth: '2022-10', year: 2022, month: 10, monthLabel: 'Outubro/2022', rate: 1.02 },
  { yearMonth: '2022-11', year: 2022, month: 11, monthLabel: 'Novembro/2022', rate: 1.02 },
  { yearMonth: '2022-12', year: 2022, month: 12, monthLabel: 'Dezembro/2022', rate: 1.12 },

  // 2023
  { yearMonth: '2023-01', year: 2023, month: 1, monthLabel: 'Janeiro/2023', rate: 1.12 },
  { yearMonth: '2023-02', year: 2023, month: 2, monthLabel: 'Fevereiro/2023', rate: 0.92 },
  { yearMonth: '2023-03', year: 2023, month: 3, monthLabel: 'Março/2023', rate: 1.17 },
  { yearMonth: '2023-04', year: 2023, month: 4, monthLabel: 'Abril/2023', rate: 0.92 },
  { yearMonth: '2023-05', year: 2023, month: 5, monthLabel: 'Maio/2023', rate: 1.12 },
  { yearMonth: '2023-06', year: 2023, month: 6, monthLabel: 'Junho/2023', rate: 1.07 },
  { yearMonth: '2023-07', year: 2023, month: 7, monthLabel: 'Julho/2023', rate: 1.07 },
  { yearMonth: '2023-08', year: 2023, month: 8, monthLabel: 'Agosto/2023', rate: 1.14 },
  { yearMonth: '2023-09', year: 2023, month: 9, monthLabel: 'Setembro/2023', rate: 0.97 },
  { yearMonth: '2023-10', year: 2023, month: 10, monthLabel: 'Outubro/2023', rate: 1.0 },
  { yearMonth: '2023-11', year: 2023, month: 11, monthLabel: 'Novembro/2023', rate: 0.92 },
  { yearMonth: '2023-12', year: 2023, month: 12, monthLabel: 'Dezembro/2023', rate: 0.89 },

  // 2024
  { yearMonth: '2024-01', year: 2024, month: 1, monthLabel: 'Janeiro/2024', rate: 0.97 },
  { yearMonth: '2024-02', year: 2024, month: 2, monthLabel: 'Fevereiro/2024', rate: 0.8 },
  { yearMonth: '2024-03', year: 2024, month: 3, monthLabel: 'Março/2024', rate: 0.83 },
  { yearMonth: '2024-04', year: 2024, month: 4, monthLabel: 'Abril/2024', rate: 0.89 },
  { yearMonth: '2024-05', year: 2024, month: 5, monthLabel: 'Maio/2024', rate: 0.83 },
  { yearMonth: '2024-06', year: 2024, month: 6, monthLabel: 'Junho/2024', rate: 0.79 },
  { yearMonth: '2024-07', year: 2024, month: 7, monthLabel: 'Julho/2024', rate: 0.91 },
  { yearMonth: '2024-08', year: 2024, month: 8, monthLabel: 'Agosto/2024', rate: 0.87 },
  { yearMonth: '2024-09', year: 2024, month: 9, monthLabel: 'Setembro/2024', rate: 0.84 },
  { yearMonth: '2024-10', year: 2024, month: 10, monthLabel: 'Outubro/2024', rate: 0.93 },
  { yearMonth: '2024-11', year: 2024, month: 11, monthLabel: 'Novembro/2024', rate: 0.79 },
  { yearMonth: '2024-12', year: 2024, month: 12, monthLabel: 'Dezembro/2024', rate: 0.93 },

  // 2025
  { yearMonth: '2025-01', year: 2025, month: 1, monthLabel: 'Janeiro/2025', rate: 1.01 },
  { yearMonth: '2025-02', year: 2025, month: 2, monthLabel: 'Fevereiro/2025', rate: 0.99 },
  { yearMonth: '2025-03', year: 2025, month: 3, monthLabel: 'Março/2025', rate: 0.96 },
  { yearMonth: '2025-04', year: 2025, month: 4, monthLabel: 'Abril/2025', rate: 1.06 },
  { yearMonth: '2025-05', year: 2025, month: 5, monthLabel: 'Maio/2025', rate: 1.14 },
  { yearMonth: '2025-06', year: 2025, month: 6, monthLabel: 'Junho/2025', rate: 1.1 },
  { yearMonth: '2025-07', year: 2025, month: 7, monthLabel: 'Julho/2025', rate: 1.28 },
  { yearMonth: '2025-08', year: 2025, month: 8, monthLabel: 'Agosto/2025', rate: 1.16 },
  { yearMonth: '2025-09', year: 2025, month: 9, monthLabel: 'Setembro/2025', rate: 1.22 },
  { yearMonth: '2025-10', year: 2025, month: 10, monthLabel: 'Outubro/2025', rate: 1.28 },
  { yearMonth: '2025-11', year: 2025, month: 11, monthLabel: 'Novembro/2025', rate: 1.05 },
  { yearMonth: '2025-12', year: 2025, month: 12, monthLabel: 'Dezembro/2025', rate: 1.22 },

  // 2026 (Divulgações consolidadas até a data mais recente)
  { yearMonth: '2026-01', year: 2026, month: 1, monthLabel: 'Janeiro/2026', rate: 1.16 },
  { yearMonth: '2026-02', year: 2026, month: 2, monthLabel: 'Fevereiro/2026', rate: 1.0 },
  { yearMonth: '2026-03', year: 2026, month: 3, monthLabel: 'Março/2026', rate: 1.21 },
  { yearMonth: '2026-04', year: 2026, month: 4, monthLabel: 'Abril/2026', rate: 1.09 },
  { yearMonth: '2026-05', year: 2026, month: 5, monthLabel: 'Maio/2026', rate: 1.07 },
  { yearMonth: '2026-06', year: 2026, month: 6, monthLabel: 'Junho/2026', rate: 1.12 },
  { yearMonth: '2026-07', year: 2026, month: 7, monthLabel: 'Julho/2026', rate: 1.22 },
  { yearMonth: '2026-08', year: 2026, month: 8, monthLabel: 'Agosto/2026', rate: 1.09 },
  { yearMonth: '2026-09', year: 2026, month: 9, monthLabel: 'Setembro/2026', rate: 1.08 },
]

// Mês mais recente disponível na série oficial embutida
export const LATEST_OFFICIAL_SELIC_MONTH =
  OFFICIAL_SELIC_MONTHLY_SERIES[OFFICIAL_SELIC_MONTHLY_SERIES.length - 1]

// Mapa rápido por yearMonth
export const OFFICIAL_SELIC_MAP: Record<string, number> = {}
OFFICIAL_SELIC_MONTHLY_SERIES.forEach((item) => {
  OFFICIAL_SELIC_MAP[item.yearMonth] = item.rate
})

// Mês padrão fallback caso o usuário informe um período além da base
export const DEFAULT_SELIC_FALLBACK_RATE = 1.0
