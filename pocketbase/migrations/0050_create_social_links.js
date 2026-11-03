migrate(
  (app) => {
    // Coleção de links de redes sociais do rodapé, configuráveis no /admin.
    // Leitura PÚBLICA (o site consulta sem login) e escrita restrita a
    // usuários autenticados (o painel só aceita o e-mail do Rafael).
    // Registro único: um documento guarda o link de cada rede.
    // Se já existir (rerun ou dado de outra rodada), remove antes de recriar.
    try {
      const existing = app.findCollectionByNameOrId('social_links')
      app.delete(existing)
    } catch (_) {
      // Ainda não existe, nada a remover.
    }

    const collection = new Collection({
      name: 'social_links',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      fields: [
        { name: 'instagram', type: 'text', max: 500 },
        { name: 'facebook', type: 'text', max: 500 },
        { name: 'tiktok', type: 'text', max: 500 },
        { name: 'x', type: 'text', max: 500 },
        { name: 'pinterest', type: 'text', max: 500 },
        { name: 'threads', type: 'text', max: 500 },
        { name: 'youtube', type: 'text', max: 500 },
        { name: 'linkedin', type: 'text', max: 500 },
        { name: 'twitch', type: 'text', max: 500 },
        { name: 'kwai', type: 'text', max: 500 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('social_links'))
    } catch (_) {
      // Nada a reverter.
    }
  },
)
