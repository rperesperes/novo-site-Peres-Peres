// Hook para sincronizar e persistir o histórico completo diretamente das APIs oficiais
routerAdd('POST', '/backend/v1/indices/seed-full-history', (e) => {
  var authRecord = e.auth
  // Permite chamada interna ou admin
  var entriesCol = $app.findCollectionByNameOrId('index_entries')
  var nowIso = new Date().toISOString()

  var EXPECTED_SGS_MAP_SEED = {
    'taxa-selic': '4390',
    'taxa-selic-anualizada-base-252': '1178',
    'taxa-referencial': '226',
    ipca: '433',
    inpc: '188',
    'igp-m': '189',
  }

  function validateSeriesMatchSeed(slug, seriesCode) {
    var expected = EXPECTED_SGS_MAP_SEED[slug]
    if (expected && String(expected) !== String(seriesCode)) {
      console.error(
        '[BLINDAGEM SGS SEED] Rejeitada tentativa de gravar Série ' +
          seriesCode +
          ' no índice ' +
          slug,
      )
      return false
    }
    return true
  }

  function upsertEntry(slug, effectiveDate, value, source, notes, seriesCode) {
    if (seriesCode && !validateSeriesMatchSeed(slug, seriesCode)) {
      return false
    }

    var indexRec = null
    try {
      indexRec = $app.findFirstRecordByData('indices', 'slug', slug)
    } catch (_) {
      return false
    }

    var existing = null
    try {
      existing = $app.findFirstRecordByFilter(
        'index_entries',
        "index_slug = '" + slug + "' && effective_date = '" + effectiveDate + "'",
      )
    } catch (_) {}

    if (existing) {
      existing.set('value', value)
      existing.set('source', source)
      if (notes) existing.set('notes', notes)
      $app.save(existing)
    } else {
      var entry = new Record(entriesCol)
      entry.set('index_id', indexRec.id)
      entry.set('index_slug', slug)
      entry.set('effective_date', effectiveDate)
      entry.set('value', value)
      entry.set('source', source)
      entry.set('notes', notes || '')
      $app.save(entry)
    }
    return true
  }

  function fetchSeries(code) {
    try {
      var res = $http.send({
        url: 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.' + code + '/dados?formato=json',
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
        timeout: 45,
      })
      if (res.statusCode >= 200 && res.statusCode < 300) {
        var arr = res.json || JSON.parse(res.body || '[]')
        if (Array.isArray(arr)) return arr
      }
    } catch (_) {}
    return null
  }

  var summary = []

  // 1. Selic mensal (4390)
  var selicData = fetchSeries('4390')
  if (selicData && selicData.length > 0) {
    for (var i = 0; i < selicData.length; i++) {
      var pt = selicData[i]
      var valFormatted = pt.valor.replace('.', ',') + '%'
      upsertEntry('taxa-selic', pt.data, valFormatted, 'automatica', 'Oficial BCB SGS 4390', '4390')
    }
    summary.push({
      code: '4390',
      slug: 'taxa-selic',
      total: selicData.length,
      first: selicData[0],
      last: selicData[selicData.length - 1],
    })
  }

  // 2. IGP-M mensal (189)
  var igpmData = fetchSeries('189')
  if (igpmData && igpmData.length > 0) {
    for (var j = 0; j < igpmData.length; j++) {
      var pt2 = igpmData[j]
      var valFormatted2 = pt2.valor.replace('.', ',') + '%'
      upsertEntry(
        'igp-m',
        pt2.data,
        valFormatted2,
        'automatica',
        'Oficial FGV / BCB SGS 189',
        '189',
      )
    }
    summary.push({
      code: '189',
      slug: 'igp-m',
      total: igpmData.length,
      first: igpmData[0],
      last: igpmData[igpmData.length - 1],
    })
  }

  // 3. IPCA mensal (433)
  var ipcaData = fetchSeries('433')
  if (ipcaData && ipcaData.length > 0) {
    for (var k = 0; k < ipcaData.length; k++) {
      var pt3 = ipcaData[k]
      var valFormatted3 = pt3.valor.replace('.', ',') + '%'
      upsertEntry(
        'ipca',
        pt3.data,
        valFormatted3,
        'automatica',
        'Oficial IBGE / BCB SGS 433',
        '433',
      )
    }
    summary.push({
      code: '433',
      slug: 'ipca',
      total: ipcaData.length,
      first: ipcaData[0],
      last: ipcaData[ipcaData.length - 1],
    })
  }

  // 4. INPC mensal (188)
  var inpcData = fetchSeries('188')
  if (inpcData && inpcData.length > 0) {
    for (var m = 0; m < inpcData.length; m++) {
      var pt4 = inpcData[m]
      var valFormatted4 = pt4.valor.replace('.', ',') + '%'
      upsertEntry(
        'inpc',
        pt4.data,
        valFormatted4,
        'automatica',
        'Oficial IBGE / BCB SGS 188',
        '188',
      )
    }
    summary.push({
      code: '188',
      slug: 'inpc',
      total: inpcData.length,
      first: inpcData[0],
      last: inpcData[inpcData.length - 1],
    })
  }

  // 5. TR (226) - Coleta de 1991 a 2026 das taxas fixadas em 01/MM/AAAA de cada mês
  // Consulta em blocos de 5 anos para cobrir toda a história desde 01/02/1991 até 2026
  var trFirst = null
  var trLast = null
  var trCount = 0
  for (var yr = 1991; yr <= 2026; yr += 5) {
    var endYr = Math.min(yr + 4, 2026)
    try {
      var trRes = $http.send({
        url:
          'https://api.bcb.gov.br/dados/serie/bcdata.sgs.226/dados?formato=json&dataInicial=01/01/' +
          yr +
          '&dataFinal=31/12/' +
          endYr,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
        timeout: 20,
      })
      if (trRes.statusCode === 200) {
        var trArr = trRes.json || JSON.parse(trRes.body || '[]')
        if (Array.isArray(trArr)) {
          // Filtra o ponto do dia 1º de cada mês (ou primeiro dia útil do mês)
          var seenMonth = {}
          for (var ti = 0; ti < trArr.length; ti++) {
            var item = trArr[ti]
            var ym = item.data.substring(3) // MM/AAAA
            if (!seenMonth[ym]) {
              seenMonth[ym] = true
              var formattedTr = parseFloat(item.valor).toFixed(4).replace('.', ',') + '%'
              upsertEntry(
                'taxa-referencial',
                item.data,
                formattedTr,
                'automatica',
                'Oficial BCB SGS 226',
                '226',
              )
              trCount++
              if (!trFirst) trFirst = item
              trLast = item
            }
          }
        }
      }
    } catch (_) {}
  }
  summary.push({
    code: '226',
    slug: 'taxa-referencial',
    total: trCount,
    first: trFirst,
    last: trLast,
  })

  // 6. Taxa Selic anualizada base 252 (1178) - Coleta de 1986 a 2026
  // Consulta de taxas consolidadas (primeiro dia de cada mês)
  var selic252First = null
  var selic252Last = null
  var selic252Count = 0
  for (var yr2 = 1986; yr2 <= 2026; yr2 += 5) {
    var endYr2 = Math.min(yr2 + 4, 2026)
    try {
      var s252Res = $http.send({
        url:
          'https://api.bcb.gov.br/dados/serie/bcdata.sgs.1178/dados?formato=json&dataInicial=01/01/' +
          yr2 +
          '&dataFinal=31/12/' +
          endYr2,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
        timeout: 20,
      })
      if (s252Res.statusCode === 200) {
        var s252Arr = s252Res.json || JSON.parse(s252Res.body || '[]')
        if (Array.isArray(s252Arr)) {
          var seenMonth2 = {}
          for (var si = 0; si < s252Arr.length; si++) {
            var item2 = s252Arr[si]
            var ym2 = item2.data.substring(3) // MM/AAAA
            if (!seenMonth2[ym2]) {
              seenMonth2[ym2] = true
              var formattedS252 = parseFloat(item2.valor).toFixed(2).replace('.', ',') + '%'
              upsertEntry(
                'taxa-selic-anualizada-base-252',
                item2.data,
                formattedS252,
                'automatica',
                'Oficial BCB SGS 1178',
                '1178',
              )
              selic252Count++
              if (!selic252First) selic252First = item2
              selic252Last = item2
            }
          }
        }
      }
    } catch (_) {}
  }
  summary.push({
    code: '1178',
    slug: 'taxa-selic-anualizada-base-252',
    total: selic252Count,
    first: selic252First,
    last: selic252Last,
  })

  // Salva o resumo de execução em system_settings
  try {
    var rep = $app.findFirstRecordByData('system_settings', 'key', 'LAST_FULL_HISTORY_SYNC')
    rep.set('value', JSON.stringify({ executedAt: nowIso, summary: summary }))
    $app.save(rep)
  } catch (_) {
    var c = $app.findCollectionByNameOrId('system_settings')
    var nRep = new Record(c)
    nRep.set('key', 'LAST_FULL_HISTORY_SYNC')
    nRep.set('value', JSON.stringify({ executedAt: nowIso, summary: summary }))
    nRep.set('description', 'Relatório de extensão histórica oficial')
    $app.save(nRep)
  }

  return e.json(200, { success: true, summary: summary })
})
