migrate(
  (app) => {
    // 1. contact_requests (dispara 2 e-mails: escritório contato@peresperes.com.br e confirmação visitante rafael@peresperes.com.br)
    const contactCol = app.findCollectionByNameOrId('contact_requests')
    const contactRecord = new Record(contactCol)
    contactRecord.set('name', 'Rafael Peres (Teste Verificação)')
    contactRecord.set('email', 'rafael@peresperes.com.br')
    contactRecord.set('phone', '(61) 3686-1689')
    contactRecord.set(
      'message',
      'Disparo de teste para rafael@peresperes.com.br após atualização das variáveis de ambiente.',
    )
    contactRecord.set('source_page', 'Teste Validação Resend')
    app.save(contactRecord)

    // 2. newsletter_subscribers (dispara 1 e-mail: boas-vindas do Boletim Informativo para rafael@peresperes.com.br)
    const newsCol = app.findCollectionByNameOrId('newsletter_subscribers')
    const newsRecord = new Record(newsCol)
    newsRecord.set('email', 'rafael@peresperes.com.br')
    newsRecord.set('source', 'Boletim Informativo - Teste Verificação')
    app.save(newsRecord)

    // 3. Limpeza imediata dos registros de teste do banco para manter o banco limpo
    try {
      app.delete(contactRecord)
    } catch (_) {}
    try {
      app.delete(newsRecord)
    } catch (_) {}
  },
  () => {},
)
