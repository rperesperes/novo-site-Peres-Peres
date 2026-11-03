// Hook de ciclo de vida para sincronizar o resumo da coleção 'indices'
// sempre que uma entrada de 'index_entries' for criada, atualizada ou excluída.
//
// REGRA: O valor vigente exibido em 'indices' é sempre o da entrada com a MAIOR
// data cronológica de início de vigência (effective_date) da série histórica,
// nunca o registro mais recentemente cadastrado ou editado. Inserir vigência
// retroativa apenas completa o histórico, sem substituir o vigente.

// Validação prévia de integridade: impede que um registro de Série 1178 seja gravado em 'taxa-selic' (SGS 4390)
// e vice-versa, protegendo contra inserções manuais ou acidentais via API.
onRecordCreateRequest((e) => {
  try {
    var rec = e.record
    var slug = rec.getString('index_slug')
    var notes = rec.getString('notes') || ''

    if (slug === 'taxa-selic') {
      if (notes.indexOf('1178') !== -1) {
        throw new BadRequestError(
          'Inconsistência de série: anotação da Série 1178 (Selic anualizada) não permitida na série mensal taxa-selic (SGS 4390).',
        )
      }
    } else if (slug === 'taxa-selic-anualizada-base-252') {
      if (notes.indexOf('4390') !== -1) {
        throw new BadRequestError(
          'Inconsistência de série: anotação da Série 4390 (Selic mensal) não permitida na série anualizada base 252 (SGS 1178).',
        )
      }
    }
  } catch (err) {
    if (err instanceof BadRequestError) {
      throw err
    }
    console.error('[validate_index_entries_create] erro:', err)
  } finally {
    e.next()
  }
}, 'index_entries')

onRecordUpdateRequest((e) => {
  try {
    var rec = e.record
    var slug = rec.getString('index_slug')
    var notes = rec.getString('notes') || ''

    if (slug === 'taxa-selic') {
      if (notes.indexOf('1178') !== -1) {
        throw new BadRequestError(
          'Inconsistência de série: anotação da Série 1178 (Selic anualizada) não permitida na série mensal taxa-selic (SGS 4390).',
        )
      }
    } else if (slug === 'taxa-selic-anualizada-base-252') {
      if (notes.indexOf('4390') !== -1) {
        throw new BadRequestError(
          'Inconsistência de série: anotação da Série 4390 (Selic mensal) não permitida na série anualizada base 252 (SGS 1178).',
        )
      }
    }
  } catch (err) {
    if (err instanceof BadRequestError) {
      throw err
    }
    console.error('[validate_index_entries_update] erro:', err)
  } finally {
    e.next()
  }
}, 'index_entries')

onRecordAfterCreateSuccess((e) => {
  try {
    var rec = e.record
    var slugOrId = rec.getString('index_slug') || rec.getString('index_id')
    if (slugOrId) {
      var indexRec = null
      try {
        indexRec = $app.findFirstRecordByData('indices', 'slug', slugOrId)
      } catch (_) {}
      if (!indexRec) {
        try {
          indexRec = $app.findRecordById('indices', slugOrId)
        } catch (_) {}
      }

      if (indexRec) {
        var slug = indexRec.getString('slug')
        var nowIso = new Date().toISOString()
        var entries = []
        try {
          entries = $app.findRecordsByFilter(
            'index_entries',
            "index_slug = '" + slug + "'",
            '',
            1500,
            0,
          )
        } catch (_) {}

        if (!entries || entries.length === 0) {
          indexRec.set('current_value', '')
          indexRec.set('effective_date', '')
          indexRec.set('update_source', 'manual')
          indexRec.set('last_updated_at', nowIso)
          $app.save(indexRec)
        } else {
          function parseDateFlexiblePB(dateStr) {
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

          var latestEntry = null
          var latestTime = -Infinity
          for (var i = 0; i < entries.length; i++) {
            var ent = entries[i]
            var effDateStr = ent.getString('effective_date')
            var parsed = parseDateFlexiblePB(effDateStr)
            var t = parsed ? parsed.getTime() : 0
            if (t > latestTime) {
              latestTime = t
              latestEntry = ent
            }
          }

          if (latestEntry) {
            var currVal = indexRec.getString('current_value')
            var currEff = indexRec.getString('effective_date')
            var newVal = latestEntry.getString('value')
            var newEff = latestEntry.getString('effective_date')
            var newSrc = latestEntry.getString('source') || 'manual'
            var newNotes = latestEntry.getString('notes') || ''

            if (currVal !== newVal || currEff !== newEff) {
              indexRec.set('current_value', newVal)
              indexRec.set('effective_date', newEff)
              indexRec.set('update_source', newSrc)
              indexRec.set('last_updated_at', nowIso)
              if (newNotes) {
                indexRec.set('notes', newNotes)
              }
              $app.save(indexRec)
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('[sync_index_entries_summary] erro no create:', err)
  } finally {
    e.next()
  }
}, 'index_entries')

onRecordAfterUpdateSuccess((e) => {
  try {
    var rec = e.record
    var slugOrId = rec.getString('index_slug') || rec.getString('index_id')
    if (slugOrId) {
      var indexRec = null
      try {
        indexRec = $app.findFirstRecordByData('indices', 'slug', slugOrId)
      } catch (_) {}
      if (!indexRec) {
        try {
          indexRec = $app.findRecordById('indices', slugOrId)
        } catch (_) {}
      }

      if (indexRec) {
        var slug = indexRec.getString('slug')
        var nowIso = new Date().toISOString()
        var entries = []
        try {
          entries = $app.findRecordsByFilter(
            'index_entries',
            "index_slug = '" + slug + "'",
            '',
            1500,
            0,
          )
        } catch (_) {}

        if (!entries || entries.length === 0) {
          indexRec.set('current_value', '')
          indexRec.set('effective_date', '')
          indexRec.set('update_source', 'manual')
          indexRec.set('last_updated_at', nowIso)
          $app.save(indexRec)
        } else {
          function parseDateFlexiblePB(dateStr) {
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

          var latestEntry = null
          var latestTime = -Infinity
          for (var i = 0; i < entries.length; i++) {
            var ent = entries[i]
            var effDateStr = ent.getString('effective_date')
            var parsed = parseDateFlexiblePB(effDateStr)
            var t = parsed ? parsed.getTime() : 0
            if (t > latestTime) {
              latestTime = t
              latestEntry = ent
            }
          }

          if (latestEntry) {
            var currVal = indexRec.getString('current_value')
            var currEff = indexRec.getString('effective_date')
            var newVal = latestEntry.getString('value')
            var newEff = latestEntry.getString('effective_date')
            var newSrc = latestEntry.getString('source') || 'manual'
            var newNotes = latestEntry.getString('notes') || ''

            if (currVal !== newVal || currEff !== newEff) {
              indexRec.set('current_value', newVal)
              indexRec.set('effective_date', newEff)
              indexRec.set('update_source', newSrc)
              indexRec.set('last_updated_at', nowIso)
              if (newNotes) {
                indexRec.set('notes', newNotes)
              }
              $app.save(indexRec)
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('[sync_index_entries_summary] erro no update:', err)
  } finally {
    e.next()
  }
}, 'index_entries')

onRecordAfterDeleteSuccess((e) => {
  try {
    var rec = e.record
    var slugOrId = rec.getString('index_slug') || rec.getString('index_id')
    if (slugOrId) {
      var indexRec = null
      try {
        indexRec = $app.findFirstRecordByData('indices', 'slug', slugOrId)
      } catch (_) {}
      if (!indexRec) {
        try {
          indexRec = $app.findRecordById('indices', slugOrId)
        } catch (_) {}
      }

      if (indexRec) {
        var slug = indexRec.getString('slug')
        var nowIso = new Date().toISOString()
        var entries = []
        try {
          entries = $app.findRecordsByFilter(
            'index_entries',
            "index_slug = '" + slug + "'",
            '',
            1500,
            0,
          )
        } catch (_) {}

        if (!entries || entries.length === 0) {
          indexRec.set('current_value', '')
          indexRec.set('effective_date', '')
          indexRec.set('update_source', 'manual')
          indexRec.set('last_updated_at', nowIso)
          $app.save(indexRec)
        } else {
          function parseDateFlexiblePB(dateStr) {
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

          var latestEntry = null
          var latestTime = -Infinity
          for (var i = 0; i < entries.length; i++) {
            var ent = entries[i]
            var effDateStr = ent.getString('effective_date')
            var parsed = parseDateFlexiblePB(effDateStr)
            var t = parsed ? parsed.getTime() : 0
            if (t > latestTime) {
              latestTime = t
              latestEntry = ent
            }
          }

          if (latestEntry) {
            var currVal = indexRec.getString('current_value')
            var currEff = indexRec.getString('effective_date')
            var newVal = latestEntry.getString('value')
            var newEff = latestEntry.getString('effective_date')
            var newSrc = latestEntry.getString('source') || 'manual'
            var newNotes = latestEntry.getString('notes') || ''

            if (currVal !== newVal || currEff !== newEff) {
              indexRec.set('current_value', newVal)
              indexRec.set('effective_date', newEff)
              indexRec.set('update_source', newSrc)
              indexRec.set('last_updated_at', nowIso)
              if (newNotes) {
                indexRec.set('notes', newNotes)
              }
              $app.save(indexRec)
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('[sync_index_entries_summary] erro no delete:', err)
  } finally {
    e.next()
  }
}, 'index_entries')

// Rota dedicada de importação em lote de vigências
// Executada no backend em uma transação única ou lote rápido,
// recalculando o resumo uma única vez ao término.
routerAdd('POST', '/backend/v1/indices/batch-import', (e) => {
  try {
    var reqInfo = e.requestInfo()
    var body = reqInfo && reqInfo.body ? reqInfo.body : {}
    var indexSlug = body.index_slug
    var indexId = body.index_id
    var items = body.items || []
    var duplicateResolution = body.duplicate_resolution || 'update'

    if (!indexSlug && !indexId) {
      return e.json(400, { error: 'index_slug ou index_id é obrigatório.' })
    }

    if (!items || items.length === 0) {
      return e.json(400, { error: 'Nenhum item fornecido para importação.' })
    }

    var indexRec = null
    if (indexSlug) {
      try {
        indexRec = $app.findFirstRecordByData('indices', 'slug', indexSlug)
      } catch (_) {}
    }
    if (!indexRec && indexId) {
      try {
        indexRec = $app.findRecordById('indices', indexId)
      } catch (_) {}
    }

    if (!indexRec) {
      return e.json(404, { error: 'Índice não encontrado.' })
    }

    var slug = indexRec.getString('slug')
    var resolvedIndexId = indexRec.getString('id')
    var entriesCol = $app.findCollectionByNameOrId('index_entries')

    // Mapa de vigências já cadastradas para este índice
    var existingEntries = []
    try {
      existingEntries = $app.findRecordsByFilter(
        'index_entries',
        "index_slug = '" + slug + "'",
        '',
        1500,
        0,
      )
    } catch (_) {}

    var dateToRecordMap = {}
    for (var i = 0; i < existingEntries.length; i++) {
      var d = String(existingEntries[i].getString('effective_date')).trim()
      if (d) {
        dateToRecordMap[d] = existingEntries[i]
      }
    }

    var createdCount = 0
    var updatedCount = 0
    var skippedCount = 0
    var errors = []

    $app.runInTransaction((txApp) => {
      for (var j = 0; j < items.length; j++) {
        var it = items[j]
        var effDate = String(it.effective_date || '').trim()
        var val = String(it.value || '').trim()
        var notes = String(it.notes || '').trim()
        var action = it.action || 'create'

        if (!effDate || !val) {
          errors.push('Linha ' + (j + 1) + ': data ou valor em branco.')
          continue
        }

        // Blindagem no lote: rejeita ponto cruzado entre Selic mensal e anualizada
        if (slug === 'taxa-selic' && notes.indexOf('1178') !== -1) {
          errors.push(
            'Linha ' +
              (j + 1) +
              ': anotação referencia Série 1178 em índice taxa-selic (SGS 4390). Registro recusado.',
          )
          continue
        }
        if (slug === 'taxa-selic-anualizada-base-252' && notes.indexOf('4390') !== -1) {
          errors.push(
            'Linha ' +
              (j + 1) +
              ': anotação referencia Série 4390 em índice taxa-selic-anualizada-base-252 (SGS 1178). Registro recusado.',
          )
          continue
        }

        var existingRec = dateToRecordMap[effDate]

        if (existingRec) {
          if (action === 'skip' || duplicateResolution === 'skip') {
            skippedCount++
            continue
          }
          // Atualiza registro existente
          try {
            existingRec.set('value', val)
            if (notes) {
              existingRec.set('notes', notes)
            }
            existingRec.set('source', 'manual')
            txApp.save(existingRec)
            updatedCount++
          } catch (updateErr) {
            errors.push('Erro ao atualizar vigência ' + effDate + ': ' + updateErr)
          }
        } else {
          // Cria novo registro
          try {
            var newRec = new Record(entriesCol)
            newRec.set('index_id', resolvedIndexId)
            newRec.set('index_slug', slug)
            newRec.set('effective_date', effDate)
            newRec.set('value', val)
            newRec.set('notes', notes)
            newRec.set('source', 'manual')
            txApp.save(newRec)
            createdCount++
            dateToRecordMap[effDate] = newRec
          } catch (createErr) {
            errors.push('Erro ao criar vigência ' + effDate + ': ' + createErr)
          }
        }
      }
    })

    // Sincroniza o resumo do índice uma única vez ao término da transação
    function parseDateFlexiblePBInRoute(dateStr) {
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

    var allUpdatedEntries = []
    try {
      allUpdatedEntries = $app.findRecordsByFilter(
        'index_entries',
        "index_slug = '" + slug + "'",
        '',
        1500,
        0,
      )
    } catch (_) {}

    var nowIsoFinal = new Date().toISOString()
    if (!allUpdatedEntries || allUpdatedEntries.length === 0) {
      indexRec.set('current_value', '')
      indexRec.set('effective_date', '')
      indexRec.set('update_source', 'manual')
      indexRec.set('last_updated_at', nowIsoFinal)
      $app.save(indexRec)
    } else {
      var latestEntryFinal = null
      var latestTimeFinal = -Infinity
      for (var k = 0; k < allUpdatedEntries.length; k++) {
        var entFinal = allUpdatedEntries[k]
        var effDateStrFinal = entFinal.getString('effective_date')
        var parsedFinal = parseDateFlexiblePBInRoute(effDateStrFinal)
        var tFinal = parsedFinal ? parsedFinal.getTime() : 0
        if (tFinal > latestTimeFinal) {
          latestTimeFinal = tFinal
          latestEntryFinal = entFinal
        }
      }

      if (latestEntryFinal) {
        indexRec.set('current_value', latestEntryFinal.getString('value'))
        indexRec.set('effective_date', latestEntryFinal.getString('effective_date'))
        var srcFinal = latestEntryFinal.getString('source') || 'manual'
        indexRec.set('update_source', srcFinal)
        indexRec.set('last_updated_at', nowIsoFinal)
        var notesTextFinal = latestEntryFinal.getString('notes')
        if (notesTextFinal) {
          indexRec.set('notes', notesTextFinal)
        }
        $app.save(indexRec)
      }
    }

    return e.json(200, {
      success: true,
      createdCount: createdCount,
      updatedCount: updatedCount,
      skippedCount: skippedCount,
      errors: errors,
    })
  } catch (globalErr) {
    console.error('[batch-import] Falha global:', globalErr)
    return e.json(500, {
      error: 'Erro no processamento do lote: ' + (globalErr.message || globalErr),
    })
  }
})
