// Migração 0047: Recalcula o resumo de todos os índices na coleção 'indices'
// a partir da série histórica em 'index_entries', garantindo que o resumo
// sempre aponte para a vigência com a MAIOR data cronológica de início (effective_date).
//
// Isso restaura o vigência do Salário Mínimo Federal para 01/01/2026 (R$ 1.621,00)
// mantendo intactas todas as entradas históricas cadastradas (inclusive a de 01/07/1994, R$ 64,79).
// Também verifica e preserva os pontos mais recentes dos demais índices (Selic, IGP-M, IPCA, INPC, TR).

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

    let indices = []
    try {
      indices = app.findRecordsByFilter('indices', '', 'name', 100, 0)
    } catch (e) {
      console.log('[Migration 0047] Falha ao listar indices:', e)
      return
    }

    const nowIso = new Date().toISOString()

    for (let i = 0; i < indices.length; i++) {
      const idx = indices[i]
      const slug = idx.getString('slug')

      let entries = []
      try {
        entries = app.findRecordsByFilter(
          'index_entries',
          "index_slug = '" + slug + "'",
          '',
          1000,
          0,
        )
      } catch (_) {}

      if (!entries || entries.length === 0) {
        continue
      }

      let latestEntry = null
      let latestTime = -Infinity

      for (let j = 0; j < entries.length; j++) {
        const entry = entries[j]
        const effDateStr = entry.getString('effective_date')
        const parsed = parseDateFlexible(effDateStr)
        const t = parsed ? parsed.getTime() : 0
        if (t > latestTime) {
          latestTime = t
          latestEntry = entry
        }
      }

      if (latestEntry) {
        const latestVal = latestEntry.getString('value')
        const latestDate = latestEntry.getString('effective_date')
        const latestSource = latestEntry.getString('source') || 'manual'
        const latestNotes = latestEntry.getString('notes')

        idx.set('current_value', latestVal)
        idx.set('effective_date', latestDate)
        idx.set('update_source', latestSource)
        idx.set('last_updated_at', nowIso)
        if (latestNotes) {
          idx.set('notes', latestNotes)
        }
        app.save(idx)
        console.log(
          '[Migration 0047] Índice ' +
            slug +
            ' recalculado para vigência: ' +
            latestDate +
            ' (' +
            latestVal +
            ')',
        )
      }
    }
  },
  (app) => {
    // Operação de reversão não necessária para recálculo de resumo baseado em histórico
  },
)
