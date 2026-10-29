migrate(
  (app) => {
    // 1. Atualizar newsletter_subscribers com status e status_updated_at
    try {
      const newsCol = app.findCollectionByNameOrId('newsletter_subscribers')
      if (!newsCol.fields.getByName('status')) {
        newsCol.fields.add(
          new SelectField({
            name: 'status',
            required: false,
            values: ['ativo', 'desativado'],
            maxSelect: 1,
          }),
        )
      }
      if (!newsCol.fields.getByName('status_updated_at')) {
        newsCol.fields.add(new DateField({ name: 'status_updated_at', required: false }))
      }
      app.save(newsCol)

      // Backfill de registros existentes caso haja algum sem status: definir como 'ativo'
      app
        .db()
        .newQuery(
          "UPDATE newsletter_subscribers SET status = 'ativo' WHERE status IS NULL OR status = ''",
        )
        .execute()
    } catch (e) {
      console.log('Erro ao atualizar campos de newsletter_subscribers:', e)
    }

    // 2. Atualizar indices com update_source e last_updated_at
    try {
      const indCol = app.findCollectionByNameOrId('indices')
      if (!indCol.fields.getByName('update_source')) {
        indCol.fields.add(
          new SelectField({
            name: 'update_source',
            required: false,
            values: ['manual', 'automatica'],
            maxSelect: 1,
          }),
        )
      }
      if (!indCol.fields.getByName('last_updated_at')) {
        indCol.fields.add(new DateField({ name: 'last_updated_at', required: false }))
      }
      app.save(indCol)
    } catch (e) {
      console.log('Erro ao atualizar campos de indices:', e)
    }
  },
  (app) => {
    try {
      const newsCol = app.findCollectionByNameOrId('newsletter_subscribers')
      newsCol.fields.removeByName('status')
      newsCol.fields.removeByName('status_updated_at')
      app.save(newsCol)
    } catch (_) {}

    try {
      const indCol = app.findCollectionByNameOrId('indices')
      indCol.fields.removeByName('update_source')
      indCol.fields.removeByName('last_updated_at')
      app.save(indCol)
    } catch (_) {}
  },
)
