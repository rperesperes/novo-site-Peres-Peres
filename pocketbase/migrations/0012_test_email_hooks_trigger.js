migrate(
  (app) => {
    // Cria um registro de teste em contact_requests e remove logo em seguida
    const contactCol = app.findCollectionByNameOrId('contact_requests')
    const testRecord = new Record(contactCol)
    testRecord.set('name', 'Teste Verificação E-mail')
    testRecord.set('email', 'teste.verificacao@peresperes.com.br')
    testRecord.set('phone', '(61) 99999-9999')
    testRecord.set('message', 'Teste automatizado de acionamento do hook de e-mail.')
    testRecord.set('source_page', 'Teste de Integração')
    app.save(testRecord)

    // Cria um registro de teste em newsletter_subscribers e remove logo em seguida
    const newsCol = app.findCollectionByNameOrId('newsletter_subscribers')
    const testNews = new Record(newsCol)
    testNews.set('email', 'assinante.teste@peresperes.com.br')
    testNews.set('source', 'Teste de Integração')
    app.save(testNews)

    // Limpa os registros de teste
    try {
      app.delete(testRecord)
      app.delete(testNews)
    } catch (_) {}
  },
  () => {},
)
