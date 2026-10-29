migrate(
  (app) => {
    // Teste de leitura de variáveis de ambiente no PocketBase
    const osResendKey = ($os.getenv('RESEND_API_KEY') || '').trim()
    const osMailFrom = ($os.getenv('MAIL_FROM') || '').trim()
    let secretsResendKey = ''
    try {
      if (typeof $secrets !== 'undefined' && $secrets.get) {
        secretsResendKey = $secrets.get('RESEND_API_KEY') || ''
      }
    } catch (_) {}

    console.log(
      '[DEBUG ENV] osResendKey len:',
      osResendKey.length,
      'osMailFrom:',
      osMailFrom,
      'secretsResendKey len:',
      secretsResendKey.length,
    )

    // 1. Criar contact_requests
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

    // 2. Criar newsletter_subscribers
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
