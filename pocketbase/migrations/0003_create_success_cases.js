migrate(
  (app) => {
    const collection = new Collection({
      name: 'success_cases',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'client_name', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'result', type: 'text' },
        { name: 'sector', type: 'text' },
        { name: 'before', type: 'number' },
        { name: 'after', type: 'number' },
        { name: 'savings', type: 'text' },
        {
          name: 'image',
          type: 'file',
          maxSelect: 1,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('success_cases')
    app.delete(collection)
  },
)
