migrate(
  (app) => {
    // 0035: Validação do envio real dos 3 e-mails via Resend usando a nova chave de API (re_Z8wdd...)
    // 1. Notificação interna ao escritório (contato@peresperes.com.br)
    // 2. Confirmação ao visitante do Fale Conosco (rafael@peresperes.com.br)
    // 3. Boas-vindas do Boletim Informativo ao assinante (rafael@peresperes.com.br)

    // Gatilho 1 & 2: contact_requests (cria registro com rafael@peresperes.com.br)
    const contactCol = app.findCollectionByNameOrId('contact_requests')
    const contactRecord = new Record(contactCol)
    contactRecord.set('name', 'Rafael Peres')
    contactRecord.set('email', 'rafael@peresperes.com.br')
    contactRecord.set('phone', '(61) 3686-1689')
    contactRecord.set(
      'message',
      'Validação de disparo de e-mails transacionais com a nova chave oficial do Resend.',
    )
    contactRecord.set('source_page', 'Fale Conosco')
    app.save(contactRecord)

    // Gatilho 3: newsletter_subscribers (cria registro com rafael@peresperes.com.br)
    const newsCol = app.findCollectionByNameOrId('newsletter_subscribers')
    const newsRecord = new Record(newsCol)
    newsRecord.set('email', 'rafael@peresperes.com.br')
    newsRecord.set('source', 'Boletim Informativo - Rodapé')
    newsRecord.set('status', 'ativo')
    app.save(newsRecord)

    // Limpeza imediata dos registros de teste (garante que nada sobra no banco)
    try {
      app.delete(contactRecord)
    } catch (err) {
      console.log('[Limpeza 0035] Erro ao remover contactRecord:', err)
    }
    try {
      app.delete(newsRecord)
    } catch (err) {
      console.log('[Limpeza 0035] Erro ao remover newsRecord:', err)
    }
  },
  () => {},
)
