migrate(
  (app) => {
    // Cria coleção interna de configurações do sistema para armazenar chaves e configurações operacionais
    // Apenas superusers têm acesso direto via API (regras null)
    const collection = new Collection({
      name: 'system_settings',
      type: 'base',
      listRule: null,
      viewRule: null,
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'key', type: 'text', required: true },
        { name: 'value', type: 'text', required: false },
        { name: 'description', type: 'text', required: false },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_system_settings_key ON system_settings (key)'],
    })
    app.save(collection)
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('system_settings')
      app.delete(collection)
    } catch (_) {}
  },
)
