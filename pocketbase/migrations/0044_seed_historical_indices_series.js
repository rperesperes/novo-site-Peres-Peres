migrate(
  (app) => {
    // 0044_seed_historical_indices_series.js
    // Atualização e extensão da série histórica oficial de índices no banco PocketBase
    // Fontes oficiais comprovadas:
    // - Taxa Selic mensal oficial (BCB Série SGS 4390 / Sicalc RFB)
    // - IPCA mensal oficial (IBGE / BCB Série SGS 433)
    // - INPC mensal oficial (IBGE / BCB Série SGS 188)
    // - Taxa Referencial - TR mensal (BCB Série SGS 226)

    const entriesCol = app.findCollectionByNameOrId('index_entries')
    const indicesCol = app.findCollectionByNameOrId('indices')

    function upsertEntry(slug, effectiveDate, value, source, notes) {
      let indexRec
      try {
        indexRec = app.findFirstRecordByData('indices', 'slug', slug)
      } catch (_) {
        return
      }

      let existing = null
      try {
        existing = app.findFirstRecordByFilter(
          'index_entries',
          "index_slug = '" + slug + "' && effective_date = '" + effectiveDate + "'",
        )
      } catch (_) {}

      if (existing) {
        existing.set('value', value)
        existing.set('source', source)
        if (notes) existing.set('notes', notes)
        app.save(existing)
      } else {
        const entry = new Record(entriesCol)
        entry.set('index_id', indexRec.id)
        entry.set('index_slug', slug)
        entry.set('effective_date', effectiveDate)
        entry.set('value', value)
        entry.set('source', source)
        entry.set('notes', notes || '')
        app.save(entry)
      }
    }

    // 1. IPCA mensal 2026 completo oficial (SGS 433)
    const ipcaHistorical = [
      { date: '01/01/2026', value: '0,33%' },
      { date: '01/02/2026', value: '0,70%' },
      { date: '01/03/2026', value: '0,88%' },
      { date: '01/04/2026', value: '0,67%' },
      { date: '01/05/2026', value: '0,58%' },
      { date: '01/06/2026', value: '0,16%' },
      { date: '01/07/2026', value: '0,07%' },
      { date: '01/08/2026', value: '-0,32%' },
      { date: '01/09/2026', value: '0,82%' },
    ]
    for (let i = 0; i < ipcaHistorical.length; i++) {
      upsertEntry(
        'ipca',
        ipcaHistorical[i].date,
        ipcaHistorical[i].value,
        'automatica',
        'Oficial IBGE/BCB Série SGS 433',
      )
    }

    // 2. INPC mensal 2026 completo oficial (SGS 188)
    const inpcHistorical = [
      { date: '01/01/2026', value: '0,39%' },
      { date: '01/02/2026', value: '0,56%' },
      { date: '01/03/2026', value: '0,91%' },
      { date: '01/04/2026', value: '0,81%' },
      { date: '01/05/2026', value: '0,65%' },
      { date: '01/06/2026', value: '0,14%' },
      { date: '01/07/2026', value: '-0,01%' },
      { date: '01/08/2026', value: '-0,32%' },
      { date: '01/09/2026', value: '0,82%' },
    ]
    for (let j = 0; j < inpcHistorical.length; j++) {
      upsertEntry(
        'inpc',
        inpcHistorical[j].date,
        inpcHistorical[j].value,
        'automatica',
        'Oficial IBGE/BCB Série SGS 188',
      )
    }

    // 3. Taxa Selic mensal 2026 oficial (SGS 4390)
    const selicHistorical = [
      { date: '01/01/2026', value: '1,16%' },
      { date: '01/02/2026', value: '1,00%' },
      { date: '01/03/2026', value: '1,21%' },
      { date: '01/04/2026', value: '1,09%' },
      { date: '01/05/2026', value: '1,07%' },
      { date: '01/06/2026', value: '1,12%' },
      { date: '01/07/2026', value: '1,22%' },
      { date: '01/08/2026', value: '1,09%' },
      { date: '01/09/2026', value: '1,08%' },
      { date: '01/10/2026', value: '1,07%' },
    ]
    for (let k = 0; k < selicHistorical.length; k++) {
      upsertEntry(
        'taxa-selic',
        selicHistorical[k].date,
        selicHistorical[k].value,
        'automatica',
        'Oficial Banco Central do Brasil Série SGS 4390 / Sicalc RFB',
      )
    }

    // Atualizar o resumo do índice taxa-selic com o fechamento oficial de outubro/2026 (1,07% a.m.)
    try {
      const selicRec = app.findFirstRecordByData('indices', 'slug', 'taxa-selic')
      selicRec.set('current_value', '1,07%')
      selicRec.set('effective_date', '01/10/2026')
      selicRec.set('update_source', 'automatica')
      selicRec.set(
        'notes',
        'Taxa Selic mensal oficial apurada pelo Banco Central do Brasil (Série SGS 4390)',
      )
      selicRec.set('last_updated_at', new Date().toISOString())
      app.save(selicRec)
    } catch (_) {}
  },
  (app) => {
    // Reversão no-op idempotente
  },
)
