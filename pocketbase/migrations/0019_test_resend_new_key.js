migrate(
  (app) => {
    // 1. contact_requests (dispara 2 e-mails: escritório e visitante)
    const contactCol = app.findCollectionByNameOrId('contact_requests')
    const contactRecord = new Record(contactCol)
    contactRecord.set('name', 'Teste Resend Nova Chave')
    contactRecord.set('email', 'teste.resend@peresperes.com.br')
    contactRecord.set('phone', '(61) 3686-1689')
    contactRecord.set(
      'message',
      'Validação de envio dos 3 fluxos após atualização da chave de API do Resend no backend.',
    )
    contactRecord.set('source_page', 'Teste Automatizado Nova Chave')
    app.save(contactRecord)

    // 2. newsletter_subscribers (dispara 1 e-mail: boas-vindas ao assinante)
    const newsCol = app.findCollectionByNameOrId('newsletter_subscribers')
    const newsRecord = new Record(newsCol)
    newsRecord.set('email', 'newsletter.teste@peresperes.com.br')
    newsRecord.set('source', 'Boletim Tributário - Teste Nova Chave')
    app.save(newsRecord)
  },
  (app) => {
    try {
      const contacts = app.findRecordsByFilter(
        'contact_requests',
        "email = 'teste.resend@peresperes.com.br'",
        '',
        50,
        0,
      )
      for (let r of contacts) {
        app.delete(r)
      }
    } catch (_) {}
    try {
      const subs = app.findRecordsByFilter(
        'newsletter_subscribers',
        "email = 'newsletter.teste@peresperes.com.br'",
        '',
        50,
        0,
      )
      for (let r of subs) {
        app.delete(r)
      }
    } catch (_) {}
  },
)
