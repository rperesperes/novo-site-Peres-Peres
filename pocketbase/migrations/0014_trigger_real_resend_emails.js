migrate(
  (app) => {
    // 1. Criar registro de teste em contact_requests para disparar os 2 e-mails:
    //    (a) notificação interna ao escritório (contato@peresperes.com.br)
    //    (b) confirmação de recebimento ao visitante (teste.resend@peresperes.com.br)
    const contactCol = app.findCollectionByNameOrId('contact_requests')
    const contactRecord = new Record(contactCol)
    contactRecord.set('name', 'Teste Resend Oficial')
    contactRecord.set('email', 'teste.resend@peresperes.com.br')
    contactRecord.set('phone', '(61) 3686-1689')
    contactRecord.set(
      'message',
      'Teste real de disparo de e-mails transacionais via Resend com domínio peresperes.com.br verificado.',
    )
    contactRecord.set('source_page', 'Teste Automatizado Resend')
    app.save(contactRecord)

    // 2. Criar registro de teste em newsletter_subscribers para disparar:
    //    (c) e-mail de boas-vindas do Boletim Tributário (newsletter.teste@peresperes.com.br)
    const newsCol = app.findCollectionByNameOrId('newsletter_subscribers')
    const newsRecord = new Record(newsCol)
    newsRecord.set('email', 'newsletter.teste@peresperes.com.br')
    newsRecord.set('source', 'Boletim Tributário - Teste Resend')
    app.save(newsRecord)
  },
  (app) => {
    try {
      const contacts = app.findRecordsByFilter(
        'contact_requests',
        "email = 'teste.resend@peresperes.com.br'",
        '',
        10,
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
        10,
        0,
      )
      for (let r of subs) {
        app.delete(r)
      }
    } catch (_) {}
  },
)
