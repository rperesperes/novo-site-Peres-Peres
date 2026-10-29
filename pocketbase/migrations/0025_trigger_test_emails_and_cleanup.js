migrate(
  (app) => {
    // Disparar envio real de CADA template existente (3: notificação ao escritório, confirmação Fale Conosco, boas-vindas do boletim)
    // Destinatário solicitado: rafael@peresperes.com.br
    // 1. contact_requests (dispara notificação ao escritório em contato@peresperes.com.br E confirmação ao visitante em rafael@peresperes.com.br)
    const contactCol = app.findCollectionByNameOrId('contact_requests')
    const contactRecord = new Record(contactCol)
    contactRecord.set('name', 'Rafael Peres (Teste Layout)')
    contactRecord.set('email', 'rafael@peresperes.com.br')
    contactRecord.set('phone', '(61) 3686-1689')
    contactRecord.set(
      'message',
      'Mensagem de teste solicitada pelo usuário para revisão de layouts e informações dos templates de e-mail (Fale Conosco e Notificação Interna).',
    )
    contactRecord.set('source_page', 'Ambiente de Teste /admin/emails')
    app.save(contactRecord)

    // 2. newsletter_subscribers (dispara boas-vindas do Boletim Informativo para rafael@peresperes.com.br)
    const newsCol = app.findCollectionByNameOrId('newsletter_subscribers')
    const newsRecord = new Record(newsCol)
    newsRecord.set('email', 'rafael@peresperes.com.br')
    newsRecord.set('source', 'Boletim Informativo - Teste Layout')
    newsRecord.set('status', 'ativo')
    app.save(newsRecord)

    // 3. Limpeza imediata após disparo para não deixar registros de teste nas coleções newsletter_subscribers e contact_requests
    try {
      app.delete(contactRecord)
    } catch (e) {
      console.log('Erro ao limpar contactRecord de teste:', e)
    }

    try {
      app.delete(newsRecord)
    } catch (e) {
      console.log('Erro ao limpar newsRecord de teste:', e)
    }
  },
  () => {},
)
