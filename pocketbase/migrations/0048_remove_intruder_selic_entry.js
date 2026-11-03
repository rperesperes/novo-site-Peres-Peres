// Migração 0048: Remoção idempotente do registro intruso da série Selic mensal (SGS 4390)
// e recálculo do resumo do índice Taxa Selic para a vigência cronológica mais recente restante (01/10/2026 = 1,07%).
//
// Contexto:
// A entrada de 30/10/2026 com valor 13,65% e anotação "Série 1178" pertence à Selic anualizada
// base 252 (SGS 1178) e foi gravada erroneamente na série mensal (taxa-selic / SGS 4390).
// Esta migração remove especificamente essa entrada intrusa da série mensal caso exista,
// preservando a série anualizada intacta e recalculando o resumo da Selic mensal.

migrate(
  (app) => {
    function parseDateFlexible(dateStr) {
      if (!dateStr) return null
      const s = String(dateStr).trim()
      if (!s) return null
      if (s.indexOf('/') !== -1) {
        const parts = s.split('/')
        if (parts.length === 3) {
          return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]))
        }
      } else if (s.indexOf('-') !== -1) {
        const p = s.split('-')
        if (p.length === 3) {
          return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]))
        }
        if (p.length === 2) {
          return new Date(Number(p[0]), Number(p[1]) - 1, 1)
        }
      }
      const d = new Date(s)
      return isNaN(d.getTime()) ? null : d
    }

    // 1. Localiza a entrada intrusa na série mensal da Taxa Selic:
    // Critérios precisos: index_slug = 'taxa-selic', effective_date = '30/10/2026', value ~ '13,65'
    // e notes contendo '1178'. Não toca em nenhuma outra entrada.
    let intruderEntries = []
    try {
      intruderEntries = app.findRecordsByFilter(
        'index_entries',
        "index_slug = 'taxa-selic' && effective_date = '30/10/2026'",
        '',
        10,
        0,
      )
    } catch (e) {
      console.log('[Migration 0048] Erro ao buscar entrada intrusa:', e)
    }

    let removedCount = 0
    for (let i = 0; i < intruderEntries.length; i++) {
      const entry = intruderEntries[i]
      const val = entry.getString('value')
      const notes = entry.getString('notes')

      // Verificação defensiva de segurança: só exclui se for o registro com valor 13,65 ou anotação Série 1178
      if (val.indexOf('13,65') !== -1 || notes.indexOf('1178') !== -1) {
        try {
          app.delete(entry)
          removedCount++
          console.log('[Migration 0048] Entrada intrusa excluída com sucesso:', entry.id)
        } catch (delErr) {
          console.error('[Migration 0048] Erro ao excluir entrada intrusa:', delErr)
        }
      }
    }

    console.log('[Migration 0048] Registros intrusos removidos:', removedCount)

    // 2. Recalcula o resumo do índice 'taxa-selic' a partir das entradas restantes da série
    let selicIndex = null
    try {
      selicIndex = app.findFirstRecordByData('indices', 'slug', 'taxa-selic')
    } catch (_) {}

    if (selicIndex) {
      let remainingEntries = []
      try {
        remainingEntries = app.findRecordsByFilter(
          'index_entries',
          "index_slug = 'taxa-selic'",
          '',
          1500,
          0,
        )
      } catch (_) {}

      if (remainingEntries.length > 0) {
        let latestEntry = null
        let latestTime = -Infinity

        for (let j = 0; j < remainingEntries.length; j++) {
          const ent = remainingEntries[j]
          const effDateStr = ent.getString('effective_date')
          const parsed = parseDateFlexible(effDateStr)
          const t = parsed ? parsed.getTime() : 0
          if (t > latestTime) {
            latestTime = t
            latestEntry = ent
          }
        }

        if (latestEntry) {
          const latestVal = latestEntry.getString('value')
          const latestDate = latestEntry.getString('effective_date')
          const latestSource = latestEntry.getString('source') || 'automatica'
          const latestNotes = latestEntry.getString('notes') || 'Oficial BCB Série SGS 4390'
          const nowIso = new Date().toISOString()

          selicIndex.set('current_value', latestVal)
          selicIndex.set('effective_date', latestDate)
          selicIndex.set('update_source', latestSource)
          selicIndex.set('notes', latestNotes)
          selicIndex.set('last_updated_at', nowIso)
          app.save(selicIndex)

          console.log(
            '[Migration 0048] Resumo da Taxa Selic recalculado para vigência ' +
              latestDate +
              ' com valor ' +
              latestVal,
          )
        }
      }
    }
  },
  (app) => {
    // Reversão não necessária para limpeza de dado corrompido / recalculo de resumo
  },
)
