migrate(
  (app) => {
    const collection = new Collection({
      name: 'contact_requests',
      type: 'base',
      listRule: null,
      viewRule: null,
      createRule: '',
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'name', type: 'text' },
        { name: 'email', type: 'text', required: true },
        { name: 'phone', type: 'text' },
        { name: 'message', type: 'text' },
        { name: 'source_page', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_contact_requests_created ON contact_requests (created DESC)'],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('contact_requests')
    app.delete(collection)
  },
)
