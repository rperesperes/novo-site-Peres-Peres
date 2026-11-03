// Hook de ciclo de vida para sincronizar o resumo da coleção 'indices'
// sempre que uma entrada de 'index_entries' for criada, atualizada ou excluída.
//
// REGRA: O valor vigente exibido em 'indices' é sempre o da entrada com a MAIOR
// data cronológica de início de vigência (effective_date) da série histórica,
// nunca o registro mais recentemente cadastrado ou editado. Inserir vigência
// retroativa apenas completa o histórico, sem substituir o vigente.

onRecordAfterCreateSuccess((e) => {
  try {
    var rec = e.record
    var indexSlug = rec.getString('index_slug')
    var fallbackIndexId = rec.getString('index_id')

    if (indexSlug || fallbackIndexId) {
      var indexRec = null
      if (indexSlug) {
        try {
          indexRec = $app.findFirstRecordByData('indices', 'slug', indexSlug)
        } catch (_) {}
      }
      if (!indexRec && fallbackIndexId) {
        try {
          indexRec = $app.findRecordById('indices', fallbackIndexId)
        } catch (_) {}
      }

      if (indexRec) {
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

        var nowIso = new Date().toISOString()

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
            indexRec.set('current_value', latestEntry.getString('value'))
            indexRec.set('effective_date', latestEntry.getString('effective_date'))
            var src = latestEntry.getString('source') || 'manual'
            indexRec.set('update_source', src)
            indexRec.set('last_updated_at', nowIso)
            var notesText = latestEntry.getString('notes')
            if (notesText) {
              indexRec.set('notes', notesText)
            }
            $app.save(indexRec)
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
    var indexSlug = rec.getString('index_slug')
    var fallbackIndexId = rec.getString('index_id')

    if (indexSlug || fallbackIndexId) {
      var indexRec = null
      if (indexSlug) {
        try {
          indexRec = $app.findFirstRecordByData('indices', 'slug', indexSlug)
        } catch (_) {}
      }
      if (!indexRec && fallbackIndexId) {
        try {
          indexRec = $app.findRecordById('indices', fallbackIndexId)
        } catch (_) {}
      }

      if (indexRec) {
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

        var nowIso = new Date().toISOString()

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
            indexRec.set('current_value', latestEntry.getString('value'))
            indexRec.set('effective_date', latestEntry.getString('effective_date'))
            var src = latestEntry.getString('source') || 'manual'
            indexRec.set('update_source', src)
            indexRec.set('last_updated_at', nowIso)
            var notesText = latestEntry.getString('notes')
            if (notesText) {
              indexRec.set('notes', notesText)
            }
            $app.save(indexRec)
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
    var indexSlug = rec.getString('index_slug')
    var fallbackIndexId = rec.getString('index_id')

    if (indexSlug || fallbackIndexId) {
      var indexRec = null
      if (indexSlug) {
        try {
          indexRec = $app.findFirstRecordByData('indices', 'slug', indexSlug)
        } catch (_) {}
      }
      if (!indexRec && fallbackIndexId) {
        try {
          indexRec = $app.findRecordById('indices', fallbackIndexId)
        } catch (_) {}
      }

      if (indexRec) {
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

        var nowIso = new Date().toISOString()

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
            indexRec.set('current_value', latestEntry.getString('value'))
            indexRec.set('effective_date', latestEntry.getString('effective_date'))
            var src = latestEntry.getString('source') || 'manual'
            indexRec.set('update_source', src)
            indexRec.set('last_updated_at', nowIso)
            var notesText = latestEntry.getString('notes')
            if (notesText) {
              indexRec.set('notes', notesText)
            }
            $app.save(indexRec)
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
