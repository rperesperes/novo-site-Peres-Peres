migrate(
  (app) => {
    // 1. contact_requests (dispara 2 e-mails)
    const contactCol = app.findCollectionByNameOrId('contact_requests')
    const contactRecord = new Record(contactCol)
    contactRecord.set('name', 'Teste Resend Nova Chave 2')
    contactRecord.set('email', 'teste.resend2@peresperes.com.br')
    contactRecord.set('phone', '(61) 3686-1689')
    contactRecord.set('message', 'Validação de disparo real de e-mails transacionais via Resend.')
    contactRecord.set('source_page', 'Teste Automatizado Resend 2')
    app.save(contactRecord)

    // 2. newsletter_subscribers (dispara 1 e-mail)
    const newsCol = app.findCollectionByNameOrId('newsletter_subscribers')
    const newsRecord = new Record(newsCol)
    newsRecord.set('email', 'newsletter.teste2@peresperes.com.br')
    newsRecord.set('source', 'Boletim Tributário - Teste 2')
    app.save(newsRecord)
  },
  (app) => {
    try {
      const contacts = app.findRecordsByFilter(
        'contact_requests',
        "email = 'teste.resend2@peresperes.com.br'",
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
        "email = 'newsletter.teste2@peresperes.com.br'",
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
