migrate(
  (app) => {
    // 1. Limpeza de registros de teste em contact_requests
    try {
      const contacts = app.findRecordsByFilter(
        'contact_requests',
        "email = 'teste.resend@peresperes.com.br' || email = 'teste.resend2@peresperes.com.br'",
        '',
        100,
        0,
      )
      for (let r of contacts) {
        app.delete(r)
      }
    } catch (_) {}

    // 2. Limpeza de registros de teste em newsletter_subscribers
    try {
      const subs = app.findRecordsByFilter(
        'newsletter_subscribers',
        "email = 'newsletter.teste@peresperes.com.br' || email = 'newsletter.teste2@peresperes.com.br'",
        '',
        100,
        0,
      )
      for (let r of subs) {
        app.delete(r)
      }
    } catch (_) {}
  },
  () => {},
)
