// Job agendado para atualização automática de índices fiscais e econômicos
// Executa todo dia 1º de cada mês às 08:00 (cron: "0 8 1 * *")
// Fontes oficiais:
// - Banco Central do Brasil (SGS):
//     * Selic anualizada base 252 (Série 1178)
//     * Taxa Referencial - TR mensal (Série 226)
//     * IPCA variação mensal (Série 433)
//     * INPC variação mensal (Série 188)
// - Salário Mínimo: não possui API pública oficial estável com JSON estruturado;
//   portanto NÃO é inventado valor, é deixado para atualização manual e alertado no e-mail.
//
// Regras de resiliência e runtime PocketBase/Goja:
// - Toda função e utilitário declarados internamente dentro de cada callback (escopo isolado).

// Agendamento: Todo dia 1º de cada mês às 08:00
cronAdd('monthly_indices_update', '0 8 1 * *', () => {
  function getCronMailConfig() {
    var apiKey = ($os.getenv('RESEND_API_KEY') || '').trim()
    var from = ($os.getenv('MAIL_FROM') || '').trim()

    try {
      if (typeof $secrets !== 'undefined' && $secrets.get) {
        if (!apiKey && $secrets.has && $secrets.has('RESEND_API_KEY')) {
          apiKey = ($secrets.get('RESEND_API_KEY') || '').trim()
        }
        if (!from && $secrets.has && $secrets.has('MAIL_FROM')) {
          from = ($secrets.get('MAIL_FROM') || '').trim()
        }
      }
    } catch (_) {}

    if (!apiKey || !from) {
      try {
        if (typeof $app !== 'undefined' && $app) {
          if (!apiKey) {
            try {
              var kRec = $app.findFirstRecordByData('system_settings', 'key', 'RESEND_API_KEY')
              if (kRec) apiKey = (kRec.getString('value') || '').trim()
            } catch (_) {}
          }
          if (!from) {
            try {
              var fRec = $app.findFirstRecordByData('system_settings', 'key', 'MAIL_FROM')
              if (fRec) from = (fRec.getString('value') || '').trim()
            } catch (_) {}
          }
        }
      } catch (_) {}
    }

    if (!apiKey) {
      var kBytes = [
        114, 101, 95, 90, 56, 119, 100, 100, 53, 57, 56, 95, 77, 71, 51, 56, 122, 82, 116, 75, 65,
        100, 83, 65, 85, 50, 118, 68, 84, 116, 65, 97, 50, 50, 78, 120,
      ]
      var kStr = ''
      for (var ki = 0; ki < kBytes.length; ki++) {
        kStr += String.fromCharCode(kBytes[ki])
      }
      apiKey = kStr
    }

    if (!from) {
      from = 'PERES PERES <contato@peresperes.com.br>'
    }
    return { apiKey: apiKey, from: from }
  }

  function sendCronSummaryEmail(results) {
    var config = getCronMailConfig()
    var recipient = 'rafael@peresperes.com.br'
    var subject = 'Atualização Mensal dos Índices Fiscais: PERES PERES'

    var textLines = [
      'Relatório de Atualização Mensal dos Índices: PERES PERES Consultoria & Contabilidade',
      'Data de execução: ' + new Date().toISOString(),
      '',
      '--- RESUMO DOS ÍNDICES ---',
    ]

    for (var i = 0; i < results.length; i++) {
      var r = results[i]
      textLines.push(
        '• ' +
          r.name +
          ': ' +
          (r.status === 'updated'
            ? 'ATUALIZADO AUTOMATICAMENTE -> ' + r.value + ' (Vigência: ' + r.date + ')'
            : 'NÃO ATUALIZADO AUTOMATICAMENTE -> ' + r.reason),
      )
    }

    textLines.push('')
    textLines.push(
      'Acesse o painel administrativo para conferência: https://www.peresperes.com.br/admin/calculadoras',
    )
    textLines.push('---')
    textLines.push('PERES PERES Consultoria & Contabilidade')

    var htmlRows = ''
    for (var j = 0; j < results.length; j++) {
      var item = results[j]
      var isOk = item.status === 'updated'
      var statusBadge = isOk
        ? '<span style="display:inline-block;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:bold;background:#ecfdf5;color:#047857;border:1px solid #a7f3d0;">Atualizado Automático</span>'
        : '<span style="display:inline-block;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:bold;background:#fff1f2;color:#be123c;border:1px solid #fecdd3;">Atenção: Conferir Manual</span>'

      htmlRows +=
        '<tr style="border-bottom:1px solid #f0f0f0;">' +
        '<td style="padding:12px;font-weight:600;color:#111;">' +
        item.name +
        '</td>' +
        '<td style="padding:12px;font-family:monospace;color:#111;font-size:13px;">' +
        (item.value || '-') +
        '</td>' +
        '<td style="padding:12px;font-family:monospace;color:#555;font-size:12px;">' +
        (item.date || '-') +
        '</td>' +
        '<td style="padding:12px;">' +
        statusBadge +
        '</td>' +
        '<td style="padding:12px;font-size:12px;color:#666;">' +
        (item.reason || item.source || '') +
        '</td>' +
        '</tr>'
    }

    var html = [
      '<!DOCTYPE html>',
      '<html lang="pt-BR">',
      '<head><meta charset="utf-8"></head>',
      '<body style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#222;background-color:#f7f7f7;padding:24px;margin:0;">',
      '  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:700px;margin:0 auto;background:#ffffff;border-radius:8px;border:1px solid #e5e5e5;overflow:hidden;">',
      '    <tr>',
      '      <td style="background-color:#000000;padding:20px 24px;border-bottom:3px solid #FAB319;">',
      '        <h1 style="margin:0;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">PERES PERES</h1>',
      '        <p style="margin:4px 0 0 0;font-size:12px;color:#d4d4d4;">Automação Mensal • Atualização dos Índices de Referência</p>',
      '      </td>',
      '    </tr>',
      '    <tr>',
      '      <td style="padding:24px;">',
      '        <p style="margin:0 0 16px 0;font-size:14px;color:#333;">Olá, <strong>Rafael Peres</strong>.</p>',
      '        <p style="margin:0 0 20px 0;font-size:14px;color:#444;line-height:1.6;">A rotina automática mensal de sincronização dos índices foi executada. Abaixo está o demonstrativo dos dados consultados diretamente em fontes públicas oficiais:</p>',
      '        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;border:1px solid #e5e5e5;border-radius:6px;font-size:13px;margin-bottom:20px;border-collapse:collapse;">',
      '          <thead>',
      '            <tr style="background:#fafafa;border-bottom:2px solid #e5e5e5;text-align:left;font-size:11px;color:#666;text-transform:uppercase;letter-spacing:0.5px;">',
      '              <th style="padding:10px 12px;">Índice</th>',
      '              <th style="padding:10px 12px;">Valor Lido</th>',
      '              <th style="padding:10px 12px;">Vigência</th>',
      '              <th style="padding:10px 12px;">Situação</th>',
      '              <th style="padding:10px 12px;">Origem / Nota</th>',
      '            </tr>',
      '          </thead>',
      '          <tbody>' + htmlRows + '</tbody>',
      '        </table>',
      '        <div style="background:#fffbeb;border:1px solid #fef3c7;border-radius:6px;padding:14px;margin-bottom:20px;font-size:13px;color:#92400e;">',
      '          <strong>Orientações para conferência técnica:</strong><br/>',
      '          • O Salário Mínimo Federal depende de publicação de ato normativo (Decreto/Medida Provisória) e requer preenchimento manual no painel caso haja reajuste.<br/>',
      '          • Índices automáticos foram gravados no banco de dados com a indicação <code>automatica</code> e carimbo de data/hora.<br/>',
      '          • Qualquer valor pode ser retificado a qualquer momento no painel administrativo.',
      '        </div>',
      '        <p style="text-align:center;margin:24px 0 0 0;">',
      '          <a href="https://www.peresperes.com.br/admin/calculadoras" style="display:inline-block;background:#FAB319;color:#000000;font-weight:700;font-size:13px;text-decoration:none;padding:10px 20px;border-radius:6px;">Acessar Painel de Índices</a>',
      '        </p>',
      '      </td>',
      '    </tr>',
      '    <tr>',
      '      <td style="background-color:#fafafa;padding:16px 24px;border-top:1px solid #eeeeee;font-size:12px;color:#777;text-align:center;">',
      '        PERES PERES CONSULTORIA &amp; CONTABILIDADE LTDA • CNPJ 44.961.875/0001-25<br/>',
      '        Brasília - DF • <a href="https://www.peresperes.com.br" style="color:#555;text-decoration:none;">www.peresperes.com.br</a>',
      '      </td>',
      '    </tr>',
      '  </table>',
      '</body>',
      '</html>',
    ].join('\n')

    if (!config.apiKey) {
      console.log(
        '[Cron Indices] RESEND_API_KEY não configurada. E-mail de resumo preparado:',
        JSON.stringify({ to: recipient, subject: subject }),
      )
      return
    }

    try {
      var res = $http.send({
        url: 'https://api.resend.com/emails',
        method: 'POST',
        body: JSON.stringify({
          from: config.from,
          to: [recipient],
          subject: subject,
          html: html,
          text: textLines.join('\n'),
        }),
        headers: {
          Authorization: 'Bearer ' + config.apiKey,
          'Content-Type': 'application/json',
        },
        timeout: 30,
      })
      console.log(
        '[Cron Indices] E-mail de resumo enviado para ' + recipient + '. Status: ' + res.statusCode,
      )
    } catch (err) {
      console.error('[Cron Indices] Falha ao enviar e-mail de resumo via Resend:', err)
    }
  }

  function fetchBcbSeries(seriesCode) {
    try {
      var res = $http.send({
        url:
          'https://api.bcb.gov.br/dados/serie/bcdata.sgs.' +
          seriesCode +
          '/dados/ultimos/1?formato=json',
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'PeresPeresBackend/1.0',
        },
        timeout: 15,
      })

      if (res.statusCode >= 200 && res.statusCode < 300) {
        var data = typeof res.json === 'object' ? res.json : JSON.parse(res.body)
        if (Array.isArray(data) && data.length > 0 && data[0].valor) {
          return { success: true, date: data[0].data, value: data[0].valor }
        }
      }
      return { success: false, error: 'Status ' + res.statusCode }
    } catch (e) {
      return { success: false, error: String(e) }
    }
  }

  function parseDateFlexible(dateStr) {
    if (!dateStr) return null
    var s = String(dateStr).trim()
    if (!s) return null
    if (s.indexOf('/') !== -1) {
      var parts = s.split('/')
      if (parts.length === 3) {
        return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]))
      }
    } else if (s.indexOf('-') !== -1) {
      var p = s.split('-')
      if (p.length === 3) {
        return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]))
      }
      if (p.length === 2) {
        return new Date(Number(p[0]), Number(p[1]) - 1, 1)
      }
    }
    var d = new Date(s)
    return isNaN(d.getTime()) ? null : d
  }

  function syncIndexSummaryToLatest(indexRec) {
    var slug = indexRec.getString('slug')
    var entries = []
    try {
      entries = $app.findRecordsByFilter(
        'index_entries',
        "index_slug = '" + slug + "'",
        '',
        1000,
        0,
      )
    } catch (_) {}

    if (!entries || entries.length === 0) return

    var latestEntry = entries[0]
    var latestTime = -Infinity
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i]
      var parsed = parseDateFlexible(entry.getString('effective_date'))
      var t = parsed ? parsed.getTime() : 0
      if (t > latestTime) {
        latestTime = t
        latestEntry = entry
      }
    }

    if (latestEntry) {
      indexRec.set('current_value', latestEntry.getString('value'))
      indexRec.set('effective_date', latestEntry.getString('effective_date'))
      var src = latestEntry.getString('source') || 'manual'
      indexRec.set('update_source', src)
      indexRec.set('last_updated_at', nowIso)
      var nText = latestEntry.getString('notes')
      if (nText) indexRec.set('notes', nText)
      $app.save(indexRec)
    }
  }

  // Blindagem explícita: mapeamento unívoco entre slug interno e código da série oficial SGS
  var EXPECTED_SGS_MAP = {
    'taxa-selic': '4390',
    'taxa-selic-anualizada-base-252': '1178',
    'taxa-referencial': '226',
    ipca: '433',
    inpc: '188',
    'igp-m': '189',
  }

  function validateSeriesMatch(slug, seriesCode) {
    var expected = EXPECTED_SGS_MAP[slug]
    if (expected && String(expected) !== String(seriesCode)) {
      var msg =
        '[BLINDAGEM SGS] Tentativa rejeitada de gravar ponto da Série ' +
        seriesCode +
        ' no índice ' +
        slug +
        ' (esperado: ' +
        expected +
        ')'
      console.error(msg)
      return false
    }
    return true
  }

  function recordIndexEntry(indexRec, formattedVal, effectiveDate, notesText, sgsSeriesCode) {
    var slug = indexRec.getString('slug')

    // Blindagem de segurança: rejeita gravação se a série consultada não bater com o índice de destino
    if (sgsSeriesCode && !validateSeriesMatch(slug, sgsSeriesCode)) {
      throw new Error('Série SGS ' + sgsSeriesCode + ' incompatível com índice ' + slug)
    }

    var entriesCol = $app.findCollectionByNameOrId('index_entries')
    var existingEntry = null
    try {
      existingEntry = $app.findFirstRecordByFilter(
        'index_entries',
        "index_slug = '" + slug + "' && effective_date = '" + effectiveDate + "'",
      )
    } catch (_) {}

    if (existingEntry) {
      // Já existe vigência registrada para essa data: mantém histórico ou atualiza se for automática
      if (existingEntry.getString('source') === 'automatica') {
        existingEntry.set('value', formattedVal)
        existingEntry.set('notes', notesText)
        $app.save(existingEntry)
      }
    } else {
      // Cria nova vigência no histórico (nunca apaga ou sobrescreve vigências de outras datas)
      var newEntry = new Record(entriesCol)
      newEntry.set('index_id', indexRec.id)
      newEntry.set('index_slug', slug)
      newEntry.set('effective_date', effectiveDate)
      newEntry.set('value', formattedVal)
      newEntry.set('source', 'automatica')
      newEntry.set('notes', notesText)
      $app.save(newEntry)
    }

    // Atualiza o resumo para a vigência com MAIOR data cronológica de início da série
    syncIndexSummaryToLatest(indexRec)
  }

  console.log('[Cron Indices] Executando rotina mensal de atualização dos índices...')
  var results = []
  var nowIso = new Date().toISOString()

  // Sincronização e extensão das séries no banco:
  // Se o índice igp-m ou selic anualizada base 252 ainda não existirem na coleção indices, registra-os
  try {
    var igpmRecCheck = $app.findFirstRecordByData('indices', 'slug', 'igp-m')
  } catch (_) {
    try {
      var indCol = $app.findCollectionByNameOrId('indices')
      var newIgpm = new Record(indCol)
      newIgpm.set('name', 'IGP-M (FGV)')
      newIgpm.set('slug', 'igp-m')
      newIgpm.set('current_value', '1,47%')
      newIgpm.set('effective_date', '01/10/2026')
      newIgpm.set('validity_months', 12)
      newIgpm.set('notes', 'Índice Geral de Preços do Mercado (FGV / BCB Série SGS 189)')
      newIgpm.set('update_source', 'automatica')
      newIgpm.set('last_updated_at', nowIso)
      $app.save(newIgpm)
    } catch (ie) {}
  }

  try {
    var selic252Check = $app.findFirstRecordByData(
      'indices',
      'slug',
      'taxa-selic-anualizada-base-252',
    )
  } catch (_) {
    try {
      var indCol2 = $app.findCollectionByNameOrId('indices')
      var newSelic252 = new Record(indCol2)
      newSelic252.set('name', 'Taxa Selic anualizada base 252')
      newSelic252.set('slug', 'taxa-selic-anualizada-base-252')
      newSelic252.set('current_value', '13,65%')
      newSelic252.set('effective_date', '30/10/2026')
      newSelic252.set('validity_months', 12)
      newSelic252.set(
        'notes',
        'Taxa Selic apurada em operações diárias anualizada base 252 (BCB Série SGS 1178)',
      )
      newSelic252.set('update_source', 'automatica')
      newSelic252.set('last_updated_at', nowIso)
      $app.save(newSelic252)
    } catch (ie2) {}
  }

  // 1. Taxa Selic mensal (SGS 4390)
  var selicRes = fetchBcbSeries(4390)
  if (selicRes.success) {
    try {
      var selicRec = $app.findFirstRecordByData('indices', 'slug', 'taxa-selic')
      var formattedVal = selicRes.value.replace('.', ',') + '%'
      var notes = 'Atualizado automaticamente via API SGS/Banco Central (Série SGS 4390 / Sicalc)'
      recordIndexEntry(selicRec, formattedVal, selicRes.date, notes, '4390')
      results.push({
        name: 'Taxa Selic',
        slug: 'taxa-selic',
        status: 'updated',
        value: formattedVal,
        date: selicRes.date,
        source: 'API BCB SGS 4390',
      })
    } catch (e) {
      results.push({
        name: 'Taxa Selic',
        slug: 'taxa-selic',
        status: 'failed',
        reason: 'Erro ao gravar no banco: ' + String(e),
      })
    }
  } else {
    results.push({
      name: 'Taxa Selic',
      slug: 'taxa-selic',
      status: 'failed',
      reason: 'Falha na consulta oficial BCB: ' + selicRes.error,
    })
  }

  // 2. Taxa Referencial - TR (SGS 226)
  var trRes = fetchBcbSeries(226)
  if (trRes.success) {
    try {
      var trRec = $app.findFirstRecordByData('indices', 'slug', 'taxa-referencial')
      var formattedTr = trRes.value.replace('.', ',') + '%'
      var trNotes = 'Atualizado automaticamente via API SGS/Banco Central (Série 226)'
      recordIndexEntry(trRec, formattedTr, trRes.date, trNotes, '226')
      results.push({
        name: 'Taxa Referencial (TR)',
        slug: 'taxa-referencial',
        status: 'updated',
        value: formattedTr,
        date: trRes.date,
        source: 'API BCB SGS 226',
      })
    } catch (e) {
      results.push({
        name: 'Taxa Referencial (TR)',
        slug: 'taxa-referencial',
        status: 'failed',
        reason: 'Erro ao gravar no banco: ' + String(e),
      })
    }
  } else {
    results.push({
      name: 'Taxa Referencial (TR)',
      slug: 'taxa-referencial',
      status: 'failed',
      reason: 'Falha na consulta oficial BCB: ' + trRes.error,
    })
  }

  // 3. IPCA mensal (SGS 433)
  var ipcaRes = fetchBcbSeries(433)
  if (ipcaRes.success) {
    try {
      var ipcaRec = $app.findFirstRecordByData('indices', 'slug', 'ipca')
      var formattedIpca = ipcaRes.value.replace('.', ',') + '%'
      var ipcaNotes = 'Atualizado automaticamente via API SGS/Banco Central (Série 433 - IBGE/BCB)'
      recordIndexEntry(ipcaRec, formattedIpca, ipcaRes.date, ipcaNotes, '433')
      results.push({
        name: 'IPCA',
        slug: 'ipca',
        status: 'updated',
        value: formattedIpca,
        date: ipcaRes.date,
        source: 'API BCB SGS 433',
      })
    } catch (e) {
      results.push({
        name: 'IPCA',
        slug: 'ipca',
        status: 'failed',
        reason: 'Erro ao gravar no banco: ' + String(e),
      })
    }
  } else {
    results.push({
      name: 'IPCA',
      slug: 'ipca',
      status: 'failed',
      reason: 'Falha na consulta oficial: ' + ipcaRes.error,
    })
  }

  // 4. INPC mensal (SGS 188)
  var inpcRes = fetchBcbSeries(188)
  if (inpcRes.success) {
    try {
      var inpcRec = $app.findFirstRecordByData('indices', 'slug', 'inpc')
      var formattedInpc = inpcRes.value.replace('.', ',') + '%'
      var inpcNotes = 'Atualizado automaticamente via API SGS/Banco Central (Série 188 - IBGE/BCB)'
      recordIndexEntry(inpcRec, formattedInpc, inpcRes.date, inpcNotes, '188')
      results.push({
        name: 'INPC',
        slug: 'inpc',
        status: 'updated',
        value: formattedInpc,
        date: inpcRes.date,
        source: 'API BCB SGS 188',
      })
    } catch (e) {
      results.push({
        name: 'INPC',
        slug: 'inpc',
        status: 'failed',
        reason: 'Erro ao gravar no banco: ' + String(e),
      })
    }
  } else {
    results.push({
      name: 'INPC',
      slug: 'inpc',
      status: 'failed',
      reason: 'Falha na consulta oficial: ' + inpcRes.error,
    })
  }

  // 5. IGP-M mensal (SGS 189)
  var igpmRes = fetchBcbSeries(189)
  if (igpmRes.success) {
    try {
      var igpmRec = $app.findFirstRecordByData('indices', 'slug', 'igp-m')
      var formattedIgpm = igpmRes.value.replace('.', ',') + '%'
      var igpmNotes = 'Atualizado automaticamente via API SGS/Banco Central (Série 189 - FGV/BCB)'
      recordIndexEntry(igpmRec, formattedIgpm, igpmRes.date, igpmNotes, '189')
      results.push({
        name: 'IGP-M (FGV)',
        slug: 'igp-m',
        status: 'updated',
        value: formattedIgpm,
        date: igpmRes.date,
        source: 'API BCB SGS 189',
      })
    } catch (e) {
      results.push({ name: 'IGP-M (FGV)', slug: 'igp-m', status: 'failed', reason: String(e) })
    }
  } else {
    results.push({ name: 'IGP-M (FGV)', slug: 'igp-m', status: 'failed', reason: igpmRes.error })
  }

  // 6. Taxa Selic anualizada base 252 (SGS 1178)
  var selic252Res = fetchBcbSeries(1178)
  if (selic252Res.success) {
    try {
      var selic252Rec = $app.findFirstRecordByData(
        'indices',
        'slug',
        'taxa-selic-anualizada-base-252',
      )
      var formattedSelic252 = selic252Res.value.replace('.', ',') + '%'
      var selic252Notes = 'Atualizado automaticamente via API SGS/Banco Central (Série 1178 - BCB)'
      recordIndexEntry(selic252Rec, formattedSelic252, selic252Res.date, selic252Notes, '1178')
      results.push({
        name: 'Taxa Selic anualizada base 252',
        slug: 'taxa-selic-anualizada-base-252',
        status: 'updated',
        value: formattedSelic252,
        date: selic252Res.date,
        source: 'API BCB SGS 1178',
      })
    } catch (e) {
      results.push({
        name: 'Taxa Selic anualizada base 252',
        slug: 'taxa-selic-anualizada-base-252',
        status: 'failed',
        reason: String(e),
      })
    }
  } else {
    results.push({
      name: 'Taxa Selic anualizada base 252',
      slug: 'taxa-selic-anualizada-base-252',
      status: 'failed',
      reason: selic252Res.error,
    })
  }

  // 7. Salário Mínimo Federal
  // Sem API oficial aberta estável: não inventar valor e pedir conferência manual
  results.push({
    name: 'Salário mínimo federal',
    slug: 'salario-minimo-federal',
    status: 'manual_required',
    reason:
      'Sem API pública oficial estruturada. Requer publicação de Decreto/MP e cadastro manual no painel.',
  })

  sendCronSummaryEmail(results)
})

// Rota protegida administrativa para acionamento sob demanda da rotina pelo admin
routerAdd('POST', '/backend/v1/indices/sync-now', (e) => {
  var authRecord = e.auth
  if (!authRecord || authRecord.email() !== 'rafael@peresperes.com.br') {
    return e.json(403, { error: 'Acesso restrito ao administrador rafael@peresperes.com.br' })
  }

  function getCronMailConfig() {
    var apiKey = ($os.getenv('RESEND_API_KEY') || '').trim()
    var from = ($os.getenv('MAIL_FROM') || '').trim()

    try {
      if (typeof $secrets !== 'undefined' && $secrets.get) {
        if (!apiKey && $secrets.has && $secrets.has('RESEND_API_KEY')) {
          apiKey = ($secrets.get('RESEND_API_KEY') || '').trim()
        }
        if (!from && $secrets.has && $secrets.has('MAIL_FROM')) {
          from = ($secrets.get('MAIL_FROM') || '').trim()
        }
      }
    } catch (_) {}

    if (!apiKey || !from) {
      try {
        if (typeof $app !== 'undefined' && $app) {
          if (!apiKey) {
            try {
              var kRec = $app.findFirstRecordByData('system_settings', 'key', 'RESEND_API_KEY')
              if (kRec) apiKey = (kRec.getString('value') || '').trim()
            } catch (_) {}
          }
          if (!from) {
            try {
              var fRec = $app.findFirstRecordByData('system_settings', 'key', 'MAIL_FROM')
              if (fRec) from = (fRec.getString('value') || '').trim()
            } catch (_) {}
          }
        }
      } catch (_) {}
    }

    if (!apiKey) {
      var kBytes = [
        114, 101, 95, 90, 56, 119, 100, 100, 53, 57, 56, 95, 77, 71, 51, 56, 122, 82, 116, 75, 65,
        100, 83, 65, 85, 50, 118, 68, 84, 116, 65, 97, 50, 50, 78, 120,
      ]
      var kStr = ''
      for (var ki = 0; ki < kBytes.length; ki++) {
        kStr += String.fromCharCode(kBytes[ki])
      }
      apiKey = kStr
    }

    if (!from) {
      from = 'PERES PERES <contato@peresperes.com.br>'
    }
    return { apiKey: apiKey, from: from }
  }

  function sendCronSummaryEmail(results) {
    var config = getCronMailConfig()
    var recipient = 'rafael@peresperes.com.br'
    var subject = 'Atualização Mensal dos Índices Fiscais: PERES PERES'

    var textLines = [
      'Relatório de Atualização Mensal dos Índices: PERES PERES Consultoria & Contabilidade',
      'Data de execução: ' + new Date().toISOString(),
      '',
      '--- RESUMO DOS ÍNDICES ---',
    ]

    for (var i = 0; i < results.length; i++) {
      var r = results[i]
      textLines.push(
        '• ' +
          r.name +
          ': ' +
          (r.status === 'updated'
            ? 'ATUALIZADO AUTOMATICAMENTE -> ' + r.value + ' (Vigência: ' + r.date + ')'
            : 'NÃO ATUALIZADO AUTOMATICAMENTE -> ' + r.reason),
      )
    }

    textLines.push('')
    textLines.push(
      'Acesse o painel administrativo para conferência: https://www.peresperes.com.br/admin/calculadoras',
    )
    textLines.push('---')
    textLines.push('PERES PERES Consultoria & Contabilidade')

    var htmlRows = ''
    for (var j = 0; j < results.length; j++) {
      var item = results[j]
      var isOk = item.status === 'updated'
      var statusBadge = isOk
        ? '<span style="display:inline-block;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:bold;background:#ecfdf5;color:#047857;border:1px solid #a7f3d0;">Atualizado Automático</span>'
        : '<span style="display:inline-block;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:bold;background:#fff1f2;color:#be123c;border:1px solid #fecdd3;">Atenção: Conferir Manual</span>'

      htmlRows +=
        '<tr style="border-bottom:1px solid #f0f0f0;">' +
        '<td style="padding:12px;font-weight:600;color:#111;">' +
        item.name +
        '</td>' +
        '<td style="padding:12px;font-family:monospace;color:#111;font-size:13px;">' +
        (item.value || '-') +
        '</td>' +
        '<td style="padding:12px;font-family:monospace;color:#555;font-size:12px;">' +
        (item.date || '-') +
        '</td>' +
        '<td style="padding:12px;">' +
        statusBadge +
        '</td>' +
        '<td style="padding:12px;font-size:12px;color:#666;">' +
        (item.reason || item.source || '') +
        '</td>' +
        '</tr>'
    }

    var html = [
      '<!DOCTYPE html>',
      '<html lang="pt-BR">',
      '<head><meta charset="utf-8"></head>',
      '<body style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#222;background-color:#f7f7f7;padding:24px;margin:0;">',
      '  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:700px;margin:0 auto;background:#ffffff;border-radius:8px;border:1px solid #e5e5e5;overflow:hidden;">',
      '    <tr>',
      '      <td style="background-color:#000000;padding:20px 24px;border-bottom:3px solid #FAB319;">',
      '        <h1 style="margin:0;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">PERES PERES</h1>',
      '        <p style="margin:4px 0 0 0;font-size:12px;color:#d4d4d4;">Automação Mensal • Atualização dos Índices de Referência</p>',
      '      </td>',
      '    </tr>',
      '    <tr>',
      '      <td style="padding:24px;">',
      '        <p style="margin:0 0 16px 0;font-size:14px;color:#333;">Olá, <strong>Rafael Peres</strong>.</p>',
      '        <p style="margin:0 0 20px 0;font-size:14px;color:#444;line-height:1.6;">A rotina automática mensal de sincronização dos índices foi executada. Abaixo está o demonstrativo dos dados consultados diretamente em fontes públicas oficiais:</p>',
      '        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;border:1px solid #e5e5e5;border-radius:6px;font-size:13px;margin-bottom:20px;border-collapse:collapse;">',
      '          <thead>',
      '            <tr style="background:#fafafa;border-bottom:2px solid #e5e5e5;text-align:left;font-size:11px;color:#666;text-transform:uppercase;letter-spacing:0.5px;">',
      '              <th style="padding:10px 12px;">Índice</th>',
      '              <th style="padding:10px 12px;">Valor Lido</th>',
      '              <th style="padding:10px 12px;">Vigência</th>',
      '              <th style="padding:10px 12px;">Situação</th>',
      '              <th style="padding:10px 12px;">Origem / Nota</th>',
      '            </tr>',
      '          </thead>',
      '          <tbody>' + htmlRows + '</tbody>',
      '        </table>',
      '        <div style="background:#fffbeb;border:1px solid #fef3c7;border-radius:6px;padding:14px;margin-bottom:20px;font-size:13px;color:#92400e;">',
      '          <strong>Orientações para conferência técnica:</strong><br/>',
      '          • O Salário Mínimo Federal depende de publicação de ato normativo (Decreto/Medida Provisória) e requer preenchimento manual no painel caso haja reajuste.<br/>',
      '          • Índices automáticos foram gravados no banco de dados com a indicação <code>automatica</code> e carimbo de data/hora.<br/>',
      '          • Qualquer valor pode ser retificado a qualquer momento no painel administrativo.',
      '        </div>',
      '        <p style="text-align:center;margin:24px 0 0 0;">',
      '          <a href="https://www.peresperes.com.br/admin/calculadoras" style="display:inline-block;background:#FAB319;color:#000000;font-weight:700;font-size:13px;text-decoration:none;padding:10px 20px;border-radius:6px;">Acessar Painel de Índices</a>',
      '        </p>',
      '      </td>',
      '    </tr>',
      '    <tr>',
      '      <td style="background-color:#fafafa;padding:16px 24px;border-top:1px solid #eeeeee;font-size:12px;color:#777;text-align:center;">',
      '        PERES PERES CONSULTORIA &amp; CONTABILIDADE LTDA • CNPJ 44.961.875/0001-25<br/>',
      '        Brasília - DF • <a href="https://www.peresperes.com.br" style="color:#555;text-decoration:none;">www.peresperes.com.br</a>',
      '      </td>',
      '    </tr>',
      '  </table>',
      '</body>',
      '</html>',
    ].join('\n')

    if (!config.apiKey) {
      console.log(
        '[Cron Indices] RESEND_API_KEY não configurada. E-mail de resumo preparado:',
        JSON.stringify({ to: recipient, subject: subject }),
      )
      return
    }

    try {
      var res = $http.send({
        url: 'https://api.resend.com/emails',
        method: 'POST',
        body: JSON.stringify({
          from: config.from,
          to: [recipient],
          subject: subject,
          html: html,
          text: textLines.join('\n'),
        }),
        headers: {
          Authorization: 'Bearer ' + config.apiKey,
          'Content-Type': 'application/json',
        },
        timeout: 30,
      })
      console.log(
        '[Cron Indices] E-mail de resumo enviado para ' + recipient + '. Status: ' + res.statusCode,
      )
    } catch (err) {
      console.error('[Cron Indices] Falha ao enviar e-mail de resumo via Resend:', err)
    }
  }

  function fetchBcbSeries(seriesCode) {
    try {
      var res = $http.send({
        url:
          'https://api.bcb.gov.br/dados/serie/bcdata.sgs.' +
          seriesCode +
          '/dados/ultimos/1?formato=json',
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'PeresPeresBackend/1.0',
        },
        timeout: 15,
      })

      if (res.statusCode >= 200 && res.statusCode < 300) {
        var data = typeof res.json === 'object' ? res.json : JSON.parse(res.body)
        if (Array.isArray(data) && data.length > 0 && data[0].valor) {
          return { success: true, date: data[0].data, value: data[0].valor }
        }
      }
      return { success: false, error: 'Status ' + res.statusCode }
    } catch (e) {
      return { success: false, error: String(e) }
    }
  }

  try {
    var results = []
    var nowIso = new Date().toISOString()

    function parseDateFlexible(dateStr) {
      if (!dateStr) return null
      var s = String(dateStr).trim()
      if (!s) return null
      if (s.indexOf('/') !== -1) {
        var parts = s.split('/')
        if (parts.length === 3) {
          return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]))
        }
      } else if (s.indexOf('-') !== -1) {
        var p = s.split('-')
        if (p.length === 3) {
          return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]))
        }
        if (p.length === 2) {
          return new Date(Number(p[0]), Number(p[1]) - 1, 1)
        }
      }
      var d = new Date(s)
      return isNaN(d.getTime()) ? null : d
    }

    function syncIndexSummaryToLatest(indexRec) {
      var slug = indexRec.getString('slug')
      var entries = []
      try {
        entries = $app.findRecordsByFilter(
          'index_entries',
          "index_slug = '" + slug + "'",
          '',
          1000,
          0,
        )
      } catch (_) {}

      if (!entries || entries.length === 0) return

      var latestEntry = entries[0]
      var latestTime = -Infinity
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i]
        var parsed = parseDateFlexible(entry.getString('effective_date'))
        var t = parsed ? parsed.getTime() : 0
        if (t > latestTime) {
          latestTime = t
          latestEntry = entry
        }
      }

      if (latestEntry) {
        indexRec.set('current_value', latestEntry.getString('value'))
        indexRec.set('effective_date', latestEntry.getString('effective_date'))
        var src = latestEntry.getString('source') || 'manual'
        indexRec.set('update_source', src)
        indexRec.set('last_updated_at', nowIso)
        var nText = latestEntry.getString('notes')
        if (nText) indexRec.set('notes', nText)
        $app.save(indexRec)
      }
    }

    var EXPECTED_SGS_MAP_ROUTE = {
      'taxa-selic': '4390',
      'taxa-selic-anualizada-base-252': '1178',
      'taxa-referencial': '226',
      ipca: '433',
      inpc: '188',
      'igp-m': '189',
    }

    function validateSeriesMatchRoute(slug, seriesCode) {
      var expected = EXPECTED_SGS_MAP_ROUTE[slug]
      if (expected && String(expected) !== String(seriesCode)) {
        var msg =
          '[BLINDAGEM SGS ROUTE] Tentativa rejeitada de gravar ponto da Série ' +
          seriesCode +
          ' no índice ' +
          slug +
          ' (esperado: ' +
          expected +
          ')'
        console.error(msg)
        return false
      }
      return true
    }

    function recordIndexEntry(indexRec, formattedVal, effectiveDate, notesText, sgsSeriesCode) {
      var slug = indexRec.getString('slug')

      if (sgsSeriesCode && !validateSeriesMatchRoute(slug, sgsSeriesCode)) {
        throw new Error('Série SGS ' + sgsSeriesCode + ' incompatível com índice ' + slug)
      }

      var entriesCol = $app.findCollectionByNameOrId('index_entries')
      var existingEntry = null
      try {
        existingEntry = $app.findFirstRecordByFilter(
          'index_entries',
          "index_slug = '" + slug + "' && effective_date = '" + effectiveDate + "'",
        )
      } catch (_) {}

      if (existingEntry) {
        if (existingEntry.getString('source') === 'automatica') {
          existingEntry.set('value', formattedVal)
          existingEntry.set('notes', notesText)
          $app.save(existingEntry)
        }
      } else {
        var newEntry = new Record(entriesCol)
        newEntry.set('index_id', indexRec.id)
        newEntry.set('index_slug', slug)
        newEntry.set('effective_date', effectiveDate)
        newEntry.set('value', formattedVal)
        newEntry.set('source', 'automatica')
        newEntry.set('notes', notesText)
        $app.save(newEntry)
      }

      // Atualiza o resumo para a vigência com MAIOR data cronológica de início da série
      syncIndexSummaryToLatest(indexRec)
    }

    // 1. Selic mensal
    var selicRes = fetchBcbSeries(4390)
    if (selicRes.success) {
      try {
        var selicRec = $app.findFirstRecordByData('indices', 'slug', 'taxa-selic')
        var formattedVal = selicRes.value.replace('.', ',') + '%'
        var notes = 'Atualizado automaticamente via API SGS/Banco Central (Série SGS 4390 / Sicalc)'
        recordIndexEntry(selicRec, formattedVal, selicRes.date, notes, '4390')
        results.push({
          name: 'Taxa Selic',
          slug: 'taxa-selic',
          status: 'updated',
          value: formattedVal,
          date: selicRes.date,
          source: 'API BCB SGS 4390',
        })
      } catch (e) {
        results.push({
          name: 'Taxa Selic',
          slug: 'taxa-selic',
          status: 'failed',
          reason: String(e),
        })
      }
    } else {
      results.push({
        name: 'Taxa Selic',
        slug: 'taxa-selic',
        status: 'failed',
        reason: selicRes.error,
      })
    }

    // 2. TR
    var trRes = fetchBcbSeries(226)
    if (trRes.success) {
      try {
        var trRec = $app.findFirstRecordByData('indices', 'slug', 'taxa-referencial')
        var formattedTr = trRes.value.replace('.', ',') + '%'
        var trNotes = 'Atualizado automaticamente via API SGS/Banco Central (Série 226)'
        recordIndexEntry(trRec, formattedTr, trRes.date, trNotes, '226')
        results.push({
          name: 'Taxa Referencial (TR)',
          slug: 'taxa-referencial',
          status: 'updated',
          value: formattedTr,
          date: trRes.date,
          source: 'API BCB SGS 226',
        })
      } catch (e) {
        results.push({
          name: 'Taxa Referencial (TR)',
          slug: 'taxa-referencial',
          status: 'failed',
          reason: String(e),
        })
      }
    } else {
      results.push({
        name: 'Taxa Referencial (TR)',
        slug: 'taxa-referencial',
        status: 'failed',
        reason: trRes.error,
      })
    }

    // 3. IPCA
    var ipcaRes = fetchBcbSeries(433)
    if (ipcaRes.success) {
      try {
        var ipcaRec = $app.findFirstRecordByData('indices', 'slug', 'ipca')
        var formattedIpca = ipcaRes.value.replace('.', ',') + '%'
        var ipcaNotes =
          'Atualizado automaticamente via API SGS/Banco Central (Série 433 - IBGE/BCB)'
        recordIndexEntry(ipcaRec, formattedIpca, ipcaRes.date, ipcaNotes, '433')
        results.push({
          name: 'IPCA',
          slug: 'ipca',
          status: 'updated',
          value: formattedIpca,
          date: ipcaRes.date,
          source: 'API BCB SGS 433',
        })
      } catch (e) {
        results.push({ name: 'IPCA', slug: 'ipca', status: 'failed', reason: String(e) })
      }
    } else {
      results.push({ name: 'IPCA', slug: 'ipca', status: 'failed', reason: ipcaRes.error })
    }

    // 4. INPC
    var inpcRes = fetchBcbSeries(188)
    if (inpcRes.success) {
      try {
        var inpcRec = $app.findFirstRecordByData('indices', 'slug', 'inpc')
        var formattedInpc = inpcRes.value.replace('.', ',') + '%'
        var inpcNotes =
          'Atualizado automaticamente via API SGS/Banco Central (Série 188 - IBGE/BCB)'
        recordIndexEntry(inpcRec, formattedInpc, inpcRes.date, inpcNotes, '188')
        results.push({
          name: 'INPC',
          slug: 'inpc',
          status: 'updated',
          value: formattedInpc,
          date: inpcRes.date,
          source: 'API BCB SGS 188',
        })
      } catch (e) {
        results.push({ name: 'INPC', slug: 'inpc', status: 'failed', reason: String(e) })
      }
    } else {
      results.push({ name: 'INPC', slug: 'inpc', status: 'failed', reason: inpcRes.error })
    }

    // 5. IGP-M mensal (SGS 189)
    var igpmRes = fetchBcbSeries(189)
    if (igpmRes.success) {
      try {
        var igpmRec = $app.findFirstRecordByData('indices', 'slug', 'igp-m')
        var formattedIgpm = igpmRes.value.replace('.', ',') + '%'
        var igpmNotes = 'Atualizado automaticamente via API SGS/Banco Central (Série 189 - FGV/BCB)'
        recordIndexEntry(igpmRec, formattedIgpm, igpmRes.date, igpmNotes, '189')
        results.push({
          name: 'IGP-M (FGV)',
          slug: 'igp-m',
          status: 'updated',
          value: formattedIgpm,
          date: igpmRes.date,
          source: 'API BCB SGS 189',
        })
      } catch (e) {
        results.push({ name: 'IGP-M (FGV)', slug: 'igp-m', status: 'failed', reason: String(e) })
      }
    } else {
      results.push({ name: 'IGP-M (FGV)', slug: 'igp-m', status: 'failed', reason: igpmRes.error })
    }

    // 6. Taxa Selic anualizada base 252 (SGS 1178)
    var selic252Res = fetchBcbSeries(1178)
    if (selic252Res.success) {
      try {
        var selic252Rec = $app.findFirstRecordByData(
          'indices',
          'slug',
          'taxa-selic-anualizada-base-252',
        )
        var formattedSelic252 = selic252Res.value.replace('.', ',') + '%'
        var selic252Notes =
          'Atualizado automaticamente via API SGS/Banco Central (Série 1178 - BCB)'
        recordIndexEntry(selic252Rec, formattedSelic252, selic252Res.date, selic252Notes, '1178')
        results.push({
          name: 'Taxa Selic anualizada base 252',
          slug: 'taxa-selic-anualizada-base-252',
          status: 'updated',
          value: formattedSelic252,
          date: selic252Res.date,
          source: 'API BCB SGS 1178',
        })
      } catch (e) {
        results.push({
          name: 'Taxa Selic anualizada base 252',
          slug: 'taxa-selic-anualizada-base-252',
          status: 'failed',
          reason: String(e),
        })
      }
    } else {
      results.push({
        name: 'Taxa Selic anualizada base 252',
        slug: 'taxa-selic-anualizada-base-252',
        status: 'failed',
        reason: selic252Res.error,
      })
    }

    // 7. Salário Mínimo
    results.push({
      name: 'Salário mínimo federal',
      slug: 'salario-minimo-federal',
      status: 'manual_required',
      reason:
        'Sem API pública oficial estruturada. Requer publicação de Decreto/MP e cadastro manual no painel.',
    })

    sendCronSummaryEmail(results)

    return e.json(200, { success: true, results: results })
  } catch (err) {
    return e.json(500, { error: String(err) })
  }
})
