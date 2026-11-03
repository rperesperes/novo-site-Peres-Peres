migrate(
  (app) => {
    // Amplia a coleção social_links para as 14 redes do rodapé.
    // Estados possíveis na aplicação:
    //  1) Banco vivo: a 0050 criou a coleção com as 10 redes originais e
    //     já existe registro com dados reais. Aqui apenas acrescentamos as
    //     4 colunas novas (Tumblr, Reddit, Medium, Substack).
    //  2) Replay em banco novo: a 0050 roda primeiro e deixa a coleção com
    //     as 10 redes; o mesmo caminho do item 1 completa as 4 que faltam.
    //  3) Banco sem a coleção (cópia parcial): cria completa com as 14.
    // A migração também recupera o dado real do usuário: o link do LinkedIn
    // da empresa foi salvo no campo facebook, mas aponta para linkedin.com.
    const redesNovas = ['tumblr', 'reddit', 'medium', 'substack']

    let col = null
    try {
      col = app.findCollectionByNameOrId('social_links')
    } catch (_) {
      col = null
    }

    if (!col) {
      col = new Collection({
        name: 'social_links',
        type: 'base',
        listRule: '',
        viewRule: '',
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
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
          { name: 'tumblr', type: 'text', max: 500 },
          { name: 'reddit', type: 'text', max: 500 },
          { name: 'medium', type: 'text', max: 500 },
          { name: 'substack', type: 'text', max: 500 },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      })
      app.save(col)
    } else {
      let alterou = false
      for (const nome of redesNovas) {
        if (!col.fields.getByName(nome)) {
          col.fields.add(new TextField({ name: nome, max: 500 }))
          alterou = true
        }
      }
      if (alterou) app.save(col)
    }

    // Correção de dados: se o campo facebook guarda um link de linkedin.com
    // e o campo linkedin está vazio, move o link para o campo certo.
    try {
      const registros = app.findRecordsByFilter(
        'social_links',
        "facebook ~ 'linkedin.com'",
        '',
        500,
        0,
      )
      for (const registro of registros) {
        const noFacebook = registro.getString('facebook')
        const noLinkedin = registro.getString('linkedin')
        if (noFacebook && !noLinkedin) {
          registro.set('linkedin', noFacebook)
          registro.set('facebook', '')
          app.save(registro)
        }
      }
    } catch (e) {
      console.log('Aviso ao corrigir link do LinkedIn em social_links:', e)
    }
  },
  (app) => {
    // Reverte: remove as 4 colunas novas e devolve ao campo facebook o link
    // de linkedin.com que esta migração moveu para o campo linkedin.
    try {
      const col = app.findCollectionByNameOrId('social_links')
      let alterou = false
      for (const nome of ['tumblr', 'reddit', 'medium', 'substack']) {
        if (col.fields.getByName(nome)) {
          col.fields.removeByName(nome)
          alterou = true
        }
      }
      if (alterou) app.save(col)
    } catch (_) {
      // Nada a reverter.
    }
    try {
      const registros = app.findRecordsByFilter(
        'social_links',
        "linkedin ~ 'linkedin.com'",
        '',
        500,
        0,
      )
      for (const registro of registros) {
        const noLinkedin = registro.getString('linkedin')
        const noFacebook = registro.getString('facebook')
        if (noLinkedin && !noFacebook) {
          registro.set('facebook', noLinkedin)
          registro.set('linkedin', '')
          app.save(registro)
        }
      }
    } catch (_) {
      // Nada a reverter.
    }
  },
)
