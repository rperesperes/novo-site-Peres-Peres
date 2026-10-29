migrate(
  (app) => {
    // Limpeza dos registros de teste criados para teste de e-mail
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
      const news = app.findRecordsByFilter(
        'newsletter_subscribers',
        "email = 'newsletter.teste@peresperes.com.br'",
        '',
        10,
        0,
      )
      for (let r of news) {
        app.delete(r)
      }
    } catch (_) {}
  },
  () => {},
)
