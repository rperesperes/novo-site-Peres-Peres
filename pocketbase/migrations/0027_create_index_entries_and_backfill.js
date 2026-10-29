migrate(
  (app) => {
    // 1. Criar coleção index_entries para histórico de vigências
    let entriesCol
    try {
      entriesCol = app.findCollectionByNameOrId('index_entries')
    } catch (_) {
      const indicesCol = app.findCollectionByNameOrId('indices')
      entriesCol = new Collection({
        name: 'index_entries',
        type: 'base',
        listRule: "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'",
        viewRule: "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'",
        createRule: "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'",
        updateRule: "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'",
        deleteRule: "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'",
        fields: [
          {
            name: 'index_id',
            type: 'relation',
            required: true,
            collectionId: indicesCol.id,
            cascadeDelete: true,
            maxSelect: 1,
          },
          { name: 'index_slug', type: 'text', required: true },
          { name: 'effective_date', type: 'text', required: true },
          { name: 'value', type: 'text', required: true },
          {
            name: 'source',
            type: 'select',
            required: false,
            values: ['manual', 'automatica'],
            maxSelect: 1,
          },
          { name: 'notes', type: 'text' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: [
          'CREATE INDEX idx_entries_index_id ON index_entries (index_id)',
          'CREATE INDEX idx_entries_index_slug ON index_entries (index_slug)',
          'CREATE INDEX idx_entries_effective_date ON index_entries (effective_date DESC)',
          'CREATE UNIQUE INDEX idx_entries_slug_date ON index_entries (index_slug, effective_date)',
        ],
      })
      app.save(entriesCol)
    }

    // 2. Backfill: migrar vigências atuais dos 5 índices que já possuem valor preenchido
    try {
      const indices = app.findRecordsByFilter(
        'indices',
        "current_value != '' && effective_date != ''",
        '',
        50,
        0,
      )
      for (const idx of indices) {
        const slug = idx.getString('slug')
        const val = idx.getString('current_value')
        const effDate = idx.getString('effective_date')
        const src = idx.getString('update_source') || 'manual'
        const notes = idx.getString('notes') || ''

        if (val && effDate) {
          try {
            // Verificar se já existe
            app.findFirstRecordByFilter(
              'index_entries',
              "index_slug = '" + slug + "' && effective_date = '" + effDate + "'",
            )
          } catch (_) {
            const entry = new Record(entriesCol)
            entry.set('index_id', idx.id)
            entry.set('index_slug', slug)
            entry.set('effective_date', effDate)
            entry.set('value', val)
            entry.set('source', src)
            entry.set('notes', notes)
            app.save(entry)
          }
        }
      }
    } catch (e) {
      console.log('Erro no backfill de index_entries:', e)
    }
  },
  (app) => {
    try {
      const entriesCol = app.findCollectionByNameOrId('index_entries')
      app.delete(entriesCol)
    } catch (_) {}
  },
)
