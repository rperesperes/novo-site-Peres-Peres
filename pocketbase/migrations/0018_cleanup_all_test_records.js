migrate(
  (app) => {
    // Remoção dos registros de teste de ambas as migrações (0016 e 0017)
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
  () => {},
)
