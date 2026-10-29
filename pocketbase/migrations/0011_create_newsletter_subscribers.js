migrate(
  (app) => {
    const collection = new Collection({
      name: 'newsletter_subscribers',
      type: 'base',
      listRule: null,
      viewRule: null,
      createRule: '',
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'email', type: 'text', required: true },
        { name: 'source', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_newsletter_subscribers_created ON newsletter_subscribers (created DESC)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('newsletter_subscribers')
      app.delete(collection)
    } catch (_) {}
  },
)
