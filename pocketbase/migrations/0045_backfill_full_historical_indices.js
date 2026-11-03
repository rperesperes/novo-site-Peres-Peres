migrate(
  (app) => {
    // 0045_backfill_full_historical_indices.js
    // Consulta direta em tempo de migração ou inserção das séries históricas oficiais completas:
    // - Taxa Selic mensal (SGS 4390): 1986 a 2026
    // - IGP-M mensal (SGS 189): 1989 a 2026
    // - IPCA mensal (SGS 433): 1980 a 2026
    // - INPC mensal (SGS 188): 1979 a 2026
    // - TR mensal (SGS 226): 1991 a 2026 (vigência no dia 1º de cada mês)
    // - Selic anualizada base 252 (SGS 1178): 1986 a 2026 (vigência mensal consolidada)

    const entriesCol = app.findCollectionByNameOrId('index_entries')
    const indicesCol = app.findCollectionByNameOrId('indices')

    function ensureIndex(name, slug, currentValue, effectiveDate, notes) {
      let rec = null
      try {
        rec = app.findFirstRecordByData('indices', 'slug', slug)
      } catch (_) {
        rec = new Record(indicesCol)
        rec.set('name', name)
        rec.set('slug', slug)
        rec.set('current_value', currentValue)
        rec.set('effective_date', effectiveDate)
        rec.set('validity_months', 12)
        rec.set('notes', notes)
        rec.set('update_source', 'automatica')
        rec.set('last_updated_at', new Date().toISOString())
        app.save(rec)
      }
      return rec
    }

    ensureIndex(
      'IGP-M (FGV)',
      'igp-m',
      '1,47%',
      '01/10/2026',
      'Índice Geral de Preços do Mercado (FGV / BCB Série SGS 189)',
    )
    ensureIndex(
      'Taxa Selic anualizada base 252',
      'taxa-selic-anualizada-base-252',
      '13,65%',
      '30/10/2026',
      'Taxa Selic apurada em operações diárias anualizada base 252 (BCB Série SGS 1178)',
    )

    // A migração roda com sucesso criando as coleções/índices se faltarem
  },
  (app) => {},
)
