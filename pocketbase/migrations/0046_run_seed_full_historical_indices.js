migrate(
  (app) => {
    // 0046_run_seed_full_historical_indices.js
    // Sincroniza e estende para trás no banco index_entries todo o histórico oficial retornado pela API SGS do Banco Central:
    // - Taxa Selic mensal (SGS 4390): desde agosto/1986
    // - IGP-M mensal (SGS 189): desde junho/1989
    // - IPCA mensal (SGS 433): desde janeiro/1980
    // - INPC mensal (SGS 188): desde abril/1979
    // - Taxa Referencial TR (SGS 226): desde fevereiro/1991
    // - Taxa Selic anualizada base 252 (SGS 1178): desde junho/1986

    const entriesCol = app.findCollectionByNameOrId('index_entries')
    const indicesCol = app.findCollectionByNameOrId('indices')

    function upsertEntry(slug, effectiveDate, value, source, notes) {
      let indexRec = null
      try {
        indexRec = app.findFirstRecordByData('indices', 'slug', slug)
      } catch (_) {
        return false
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
      return true
    }

    // 1. Selic mensal (4390)
    try {
      const res = $http.send({
        url: 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.4390/dados?formato=json',
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'PeresPeresBackend/1.0',
        },
        timeout: 45,
      })
      if (res.statusCode === 200) {
        const arr = res.json || JSON.parse(res.body || '[]')
        if (Array.isArray(arr)) {
          for (let i = 0; i < arr.length; i++) {
            const pt = arr[i]
            const valFmt = pt.valor.replace('.', ',') + '%'
            upsertEntry('taxa-selic', pt.data, valFmt, 'automatica', 'Oficial BCB Série SGS 4390')
          }
        }
      }
    } catch (e) {
      console.error('Erro ao buscar SGS 4390 na migração:', e)
    }

    // 2. IGP-M mensal (189)
    try {
      const res = $http.send({
        url: 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.189/dados?formato=json',
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'PeresPeresBackend/1.0',
        },
        timeout: 45,
      })
      if (res.statusCode === 200) {
        const arr = res.json || JSON.parse(res.body || '[]')
        if (Array.isArray(arr)) {
          for (let j = 0; j < arr.length; j++) {
            const pt = arr[j]
            const valFmt = pt.valor.replace('.', ',') + '%'
            upsertEntry('igp-m', pt.data, valFmt, 'automatica', 'Oficial FGV / BCB Série SGS 189')
          }
        }
      }
    } catch (e) {
      console.error('Erro ao buscar SGS 189 na migração:', e)
    }

    // 3. IPCA mensal (433)
    try {
      const res = $http.send({
        url: 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados?formato=json',
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'PeresPeresBackend/1.0',
        },
        timeout: 45,
      })
      if (res.statusCode === 200) {
        const arr = res.json || JSON.parse(res.body || '[]')
        if (Array.isArray(arr)) {
          for (let k = 0; k < arr.length; k++) {
            const pt = arr[k]
            const valFmt = pt.valor.replace('.', ',') + '%'
            upsertEntry('ipca', pt.data, valFmt, 'automatica', 'Oficial IBGE / BCB Série SGS 433')
          }
        }
      }
    } catch (e) {
      console.error('Erro ao buscar SGS 433 na migração:', e)
    }

    // 4. INPC mensal (188)
    try {
      const res = $http.send({
        url: 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.188/dados?formato=json',
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'PeresPeresBackend/1.0',
        },
        timeout: 45,
      })
      if (res.statusCode === 200) {
        const arr = res.json || JSON.parse(res.body || '[]')
        if (Array.isArray(arr)) {
          for (let m = 0; m < arr.length; m++) {
            const pt = arr[m]
            const valFmt = pt.valor.replace('.', ',') + '%'
            upsertEntry('inpc', pt.data, valFmt, 'automatica', 'Oficial IBGE / BCB Série SGS 188')
          }
        }
      }
    } catch (e) {
      console.error('Erro ao buscar SGS 188 na migração:', e)
    }

    // 5. TR mensal (226): 1991 a 2026
    for (let yr = 1991; yr <= 2026; yr += 5) {
      const endYr = Math.min(yr + 4, 2026)
      try {
        const res = $http.send({
          url:
            'https://api.bcb.gov.br/dados/serie/bcdata.sgs.226/dados?formato=json&dataInicial=01/01/' +
            yr +
            '&dataFinal=31/12/' +
            endYr,
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'User-Agent': 'PeresPeresBackend/1.0',
          },
          timeout: 20,
        })
        if (res.statusCode === 200) {
          const arr = res.json || JSON.parse(res.body || '[]')
          if (Array.isArray(arr)) {
            const seenMonth = {}
            for (let ti = 0; ti < arr.length; ti++) {
              const item = arr[ti]
              const ym = item.data.substring(3)
              if (!seenMonth[ym]) {
                seenMonth[ym] = true
                const formattedTr = parseFloat(item.valor).toFixed(4).replace('.', ',') + '%'
                upsertEntry(
                  'taxa-referencial',
                  item.data,
                  formattedTr,
                  'automatica',
                  'Oficial BCB Série SGS 226',
                )
              }
            }
          }
        }
      } catch (_) {}
    }

    // 6. Taxa Selic anualizada base 252 (1178): 1986 a 2026
    for (let yr2 = 1986; yr2 <= 2026; yr2 += 5) {
      const endYr2 = Math.min(yr2 + 4, 2026)
      try {
        const res = $http.send({
          url:
            'https://api.bcb.gov.br/dados/serie/bcdata.sgs.1178/dados?formato=json&dataInicial=01/01/' +
            yr2 +
            '&dataFinal=31/12/' +
            endYr2,
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'User-Agent': 'PeresPeresBackend/1.0',
          },
          timeout: 20,
        })
        if (res.statusCode === 200) {
          const arr = res.json || JSON.parse(res.body || '[]')
          if (Array.isArray(arr)) {
            const seenMonth2 = {}
            for (let si = 0; si < arr.length; si++) {
              const item2 = arr[si]
              const ym2 = item2.data.substring(3)
              if (!seenMonth2[ym2]) {
                seenMonth2[ym2] = true
                const formattedS252 = parseFloat(item2.valor).toFixed(2).replace('.', ',') + '%'
                upsertEntry(
                  'taxa-selic-anualizada-base-252',
                  item2.data,
                  formattedS252,
                  'automatica',
                  'Oficial BCB Série SGS 1178',
                )
              }
            }
          }
        }
      } catch (_) {}
    }
  },
  (app) => {},
)
