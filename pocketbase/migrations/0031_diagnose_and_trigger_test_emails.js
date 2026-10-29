migrate(
  (app) => {
    // Diagnóstico detalhado de ambiente
    let osResend = ''
    let osFrom = ''
    try {
      osResend = $os.getenv('RESEND_API_KEY') || ''
      osFrom = $os.getenv('MAIL_FROM') || ''
    } catch (e) {
      console.log('[DEBUG 0031] Erro ao chamar $os.getenv:', e)
    }

    let secretsResend = ''
    let secretsFrom = ''
    let secretsHasResend = false
    try {
      if (typeof $secrets !== 'undefined') {
        secretsHasResend = $secrets.has ? $secrets.has('RESEND_API_KEY') : false
        secretsResend = $secrets.get ? $secrets.get('RESEND_API_KEY') || '' : ''
        secretsFrom = $secrets.get ? $secrets.get('MAIL_FROM') || '' : ''
      }
    } catch (e) {
      console.log('[DEBUG 0031] Erro ao chamar $secrets:', e)
    }

    console.log(
      '[DEBUG 0031 ENV]',
      'osResendLen:',
      osResend.length,
      'osFrom:',
      osFrom,
      'secretsHasResend:',
      secretsHasResend,
      'secretsResendLen:',
      secretsResend.length,
      'secretsFrom:',
      secretsFrom,
    )

    // 1. contact_requests (dispara 2 e-mails: escritório e visitante rafael@peresperes.com.br)
    const contactCol = app.findCollectionByNameOrId('contact_requests')
    const contactRecord = new Record(contactCol)
    contactRecord.set('name', 'Rafael Peres (Teste Verificação Final)')
    contactRecord.set('email', 'rafael@peresperes.com.br')
    contactRecord.set('phone', '(61) 3686-1689')
    contactRecord.set(
      'message',
      'Validação final de envio transacional via Resend com verificação de status 200.',
    )
    contactRecord.set('source_page', 'Teste Automatizado Verificação Final')
    app.save(contactRecord)

    // 2. newsletter_subscribers (dispara 1 e-mail: boas-vindas do Boletim Informativo para rafael@peresperes.com.br)
    const newsCol = app.findCollectionByNameOrId('newsletter_subscribers')
    const newsRecord = new Record(newsCol)
    newsRecord.set('email', 'rafael@peresperes.com.br')
    newsRecord.set('source', 'Boletim Informativo - Teste Verificação Final')
    newsRecord.set('status', 'ativo')
    app.save(newsRecord)

    // 3. Limpeza dos registros criados
    try {
      app.delete(contactRecord)
    } catch (_) {}
    try {
      app.delete(newsRecord)
    } catch (_) {}
  },
  () => {},
)
