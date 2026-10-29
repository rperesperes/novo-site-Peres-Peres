migrate(
  (app) => {
    // 1. Atualizar contact_requests: adicionar campo archived e permitir list, view, update para admin
    try {
      const contactCol = app.findCollectionByNameOrId('contact_requests')
      if (!contactCol.fields.getByName('archived')) {
        contactCol.fields.add(new BoolField({ name: 'archived', required: false }))
      }
      // Regras de acesso: criacao publica, list/view/update/delete apenas usuario logado (admin rafael@peresperes.com.br)
      contactCol.listRule =
        "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'"
      contactCol.viewRule =
        "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'"
      contactCol.updateRule =
        "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'"
      contactCol.deleteRule =
        "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'"
      app.save(contactCol)
    } catch (e) {
      console.log('Erro ao atualizar contact_requests:', e)
    }

    // 2. Atualizar newsletter_subscribers: adicionar campo archived e permitir list, view, update para admin
    try {
      const newsCol = app.findCollectionByNameOrId('newsletter_subscribers')
      if (!newsCol.fields.getByName('archived')) {
        newsCol.fields.add(new BoolField({ name: 'archived', required: false }))
      }
      newsCol.listRule =
        "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'"
      newsCol.viewRule =
        "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'"
      newsCol.updateRule =
        "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'"
      newsCol.deleteRule =
        "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'"
      app.save(newsCol)
    } catch (e) {
      console.log('Erro ao atualizar newsletter_subscribers:', e)
    }

    // 3. Criar coleção indices
    try {
      let indicesCol
      try {
        indicesCol = app.findCollectionByNameOrId('indices')
      } catch (_) {
        indicesCol = new Collection({
          name: 'indices',
          type: 'base',
          listRule: "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'",
          viewRule: "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'",
          createRule: "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'",
          updateRule: "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'",
          deleteRule: "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'",
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'slug', type: 'text', required: true },
            { name: 'current_value', type: 'text' },
            { name: 'effective_date', type: 'text' },
            { name: 'validity_months', type: 'number' },
            { name: 'notes', type: 'text' },
            { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
            { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
          ],
          indexes: ['CREATE UNIQUE INDEX idx_indices_slug ON indices (slug)'],
        })
        app.save(indicesCol)
      }

      // Seed dos 5 índices iniciais (se não existirem)
      const initialIndices = [
        { name: 'Salário mínimo federal', slug: 'salario-minimo-federal' },
        { name: 'Taxa Selic', slug: 'taxa-selic' },
        { name: 'INPC', slug: 'inpc' },
        { name: 'IPCA', slug: 'ipca' },
        { name: 'Taxa referencial', slug: 'taxa-referencial' },
      ]

      for (const item of initialIndices) {
        try {
          app.findFirstRecordByData('indices', 'slug', item.slug)
        } catch (_) {
          const record = new Record(indicesCol)
          record.set('name', item.name)
          record.set('slug', item.slug)
          record.set('current_value', '') // vazio aguardando cadastro
          record.set('effective_date', '') // vazio aguardando cadastro
          record.set('validity_months', 12) // 12 meses como padrão
          record.set('notes', '')
          app.save(record)
        }
      }
    } catch (e) {
      console.log('Erro ao criar/popular coleção indices:', e)
    }

    // 4. Criar coleção calculator_accesses (registro de contagem de acessos das calculadoras)
    try {
      try {
        app.findCollectionByNameOrId('calculator_accesses')
      } catch (_) {
        const accessCol = new Collection({
          name: 'calculator_accesses',
          type: 'base',
          listRule: "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'",
          viewRule: "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'",
          createRule: '', // Público para gravar quando visitante usar calculadora
          updateRule: "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'",
          deleteRule: "@request.auth.id != '' && @request.auth.email = 'rafael@peresperes.com.br'",
          fields: [
            { name: 'calculator_slug', type: 'text', required: true },
            { name: 'calculator_name', type: 'text', required: true },
            { name: 'accessed_at', type: 'text' },
            { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
            { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
          ],
          indexes: [
            'CREATE INDEX idx_calc_acc_slug ON calculator_accesses (calculator_slug)',
            'CREATE INDEX idx_calc_acc_created ON calculator_accesses (created DESC)',
          ],
        })
        app.save(accessCol)
      }
    } catch (e) {
      console.log('Erro ao criar coleção calculator_accesses:', e)
    }
  },
  (app) => {
    try {
      const accessCol = app.findCollectionByNameOrId('calculator_accesses')
      app.delete(accessCol)
    } catch (_) {}
    try {
      const indicesCol = app.findCollectionByNameOrId('indices')
      app.delete(indicesCol)
    } catch (_) {}
  },
)
