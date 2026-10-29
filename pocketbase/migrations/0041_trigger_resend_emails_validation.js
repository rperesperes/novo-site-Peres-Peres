migrate(
  (app) => {
    // 0041: Disparo de validação dos 3 e-mails via Resend após deploy atualizado:
    // 1. Notificação interna ao escritório em contato@peresperes.com.br
    // 2. Confirmação ao visitante do Fale Conosco em rafael@peresperes.com.br
    // 3. Boas-vindas do Boletim Informativo em rafael@peresperes.com.br

    const contactCol = app.findCollectionByNameOrId('contact_requests')
    const contactRecord = new Record(contactCol)
    contactRecord.set('name', 'Rafael Peres')
    contactRecord.set('email', 'rafael@peresperes.com.br')
    contactRecord.set('phone', '(61) 3686-1689')
    contactRecord.set('message', 'Validação de disparo dos 3 e-mails transacionais via Resend.')
    contactRecord.set('source_page', 'Fale Conosco')
    app.save(contactRecord)

    const newsCol = app.findCollectionByNameOrId('newsletter_subscribers')
    const newsRecord = new Record(newsCol)
    newsRecord.set('email', 'rafael@peresperes.com.br')
    newsRecord.set('source', 'Boletim Informativo - Rodapé')
    newsRecord.set('status', 'ativo')
    app.save(newsRecord)

    // Limpeza imediata dos registros de teste
    try {
      app.delete(contactRecord)
    } catch (_) {}
    try {
      app.delete(newsRecord)
    } catch (_) {}
  },
  () => {},
)
