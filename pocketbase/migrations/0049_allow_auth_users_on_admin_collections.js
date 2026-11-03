migrate(
  (app) => {
    // 1. Atualizar regras de acesso de 'indices'
    try {
      const indicesCol = app.findCollectionByNameOrId('indices')
      indicesCol.listRule = "@request.auth.id != ''"
      indicesCol.viewRule = "@request.auth.id != ''"
      indicesCol.createRule = "@request.auth.id != ''"
      indicesCol.updateRule = "@request.auth.id != ''"
      indicesCol.deleteRule = "@request.auth.id != ''"
      app.save(indicesCol)
    } catch (e) {
      console.log('[Migration 0049] Erro ao atualizar regras de indices:', e)
    }

    // 2. Atualizar regras de acesso de 'index_entries'
    try {
      const entriesCol = app.findCollectionByNameOrId('index_entries')
      entriesCol.listRule = "@request.auth.id != ''"
      entriesCol.viewRule = "@request.auth.id != ''"
      entriesCol.createRule = "@request.auth.id != ''"
      entriesCol.updateRule = "@request.auth.id != ''"
      entriesCol.deleteRule = "@request.auth.id != ''"
      app.save(entriesCol)
    } catch (e) {
      console.log('[Migration 0049] Erro ao atualizar regras de index_entries:', e)
    }

    // 3. Atualizar regras de acesso de 'contact_requests'
    try {
      const contactCol = app.findCollectionByNameOrId('contact_requests')
      contactCol.listRule = "@request.auth.id != ''"
      contactCol.viewRule = "@request.auth.id != ''"
      contactCol.updateRule = "@request.auth.id != ''"
      contactCol.deleteRule = "@request.auth.id != ''"
      app.save(contactCol)
    } catch (e) {
      console.log('[Migration 0049] Erro ao atualizar regras de contact_requests:', e)
    }

    // 4. Atualizar regras de acesso de 'newsletter_subscribers'
    try {
      const newsCol = app.findCollectionByNameOrId('newsletter_subscribers')
      newsCol.listRule = "@request.auth.id != ''"
      newsCol.viewRule = "@request.auth.id != ''"
      newsCol.updateRule = "@request.auth.id != ''"
      newsCol.deleteRule = "@request.auth.id != ''"
      app.save(newsCol)
    } catch (e) {
      console.log('[Migration 0049] Erro ao atualizar regras de newsletter_subscribers:', e)
    }
  },
  (app) => {
    // Reverter regras com a restrição explícita anterior se necessário
    try {
      const indicesCol = app.findCollectionByNameOrId('indices')
      indicesCol.listRule =
        "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'"
      indicesCol.viewRule =
        "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'"
      app.save(indicesCol)
    } catch (_) {}

    try {
      const entriesCol = app.findCollectionByNameOrId('index_entries')
      entriesCol.listRule =
        "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'"
      entriesCol.viewRule =
        "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'"
      app.save(entriesCol)
    } catch (_) {}
  },
)
