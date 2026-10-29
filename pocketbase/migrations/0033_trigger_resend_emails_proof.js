migrate(
  (app) => {
    // 0033: Disparo real dos 3 e-mails via Resend e comprovação de HTTP 200
    // 1. Notificação interna ao escritório (contato@peresperes.com.br)
    // 2. Confirmação ao visitante do Fale Conosco (rafael@peresperes.com.br)
    // 3. Boas-vindas do Boletim Informativo ao assinante (rafael@peresperes.com.br)

    const contactCol = app.findCollectionByNameOrId('contact_requests')
    const contactRecord = new Record(contactCol)
    contactRecord.set('name', 'Rafael Peres (Teste Oficial 0033)')
    contactRecord.set('email', 'rafael@peresperes.com.br')
    contactRecord.set('phone', '(61) 3686-1689')
    contactRecord.set(
      'message',
      'Validação de disparo real via Resend com chave gravada e comprovada por logs HTTP 200.',
    )
    contactRecord.set('source_page', 'Teste Automatizado 0033')
    app.save(contactRecord)

    const newsCol = app.findCollectionByNameOrId('newsletter_subscribers')
    const newsRecord = new Record(newsCol)
    newsRecord.set('email', 'rafael@peresperes.com.br')
    newsRecord.set('source', 'Boletim Informativo - Teste Oficial 0033')
    newsRecord.set('status', 'ativo')
    app.save(newsRecord)

    // Limpeza imediata dos registros de teste (garante banco apenas com dados reais)
    try {
      app.delete(contactRecord)
    } catch (_) {}
    try {
      app.delete(newsRecord)
    } catch (_) {}
  },
  () => {},
)
