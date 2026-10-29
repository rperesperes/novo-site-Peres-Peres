migrate(
  (app) => {
    // 0034: Diagnóstico das variáveis de ambiente e disparo dos 3 e-mails transacionais
    let osResend = ''
    let osFrom = ''
    try {
      osResend = ($os.getenv('RESEND_API_KEY') || '').trim()
      osFrom = ($os.getenv('MAIL_FROM') || '').trim()
    } catch (e) {
      console.log('[DEBUG 0034] Erro em $os.getenv:', e)
    }

    let secretsResend = ''
    let secretsFrom = ''
    let secretsHasResend = false
    let secretsHasFrom = false
    try {
      if (typeof $secrets !== 'undefined') {
        secretsHasResend = $secrets.has ? $secrets.has('RESEND_API_KEY') : false
        secretsHasFrom = $secrets.has ? $secrets.has('MAIL_FROM') : false
        secretsResend = $secrets.get ? ($secrets.get('RESEND_API_KEY') || '').trim() : ''
        secretsFrom = $secrets.get ? ($secrets.get('MAIL_FROM') || '').trim() : ''
      }
    } catch (e) {
      console.log('[DEBUG 0034] Erro em $secrets:', e)
    }

    console.log(
      '[ENV CHECK 0034]',
      'osResendLen:',
      osResend.length,
      'osFrom:',
      osFrom,
      'secretsHasResend:',
      secretsHasResend,
      'secretsResendLen:',
      secretsResend.length,
      'secretsHasFrom:',
      secretsHasFrom,
      'secretsFrom:',
      secretsFrom,
    )

    // Gatilho 1 & 2: contact_requests (cria registro com rafael@peresperes.com.br)
    // Dispara:
    // (1) Notificação de novo contato para contato@peresperes.com.br
    // (2) Confirmação ao visitante do Fale Conosco para rafael@peresperes.com.br
    const contactCol = app.findCollectionByNameOrId('contact_requests')
    const contactRecord = new Record(contactCol)
    contactRecord.set('name', 'Rafael Peres')
    contactRecord.set('email', 'rafael@peresperes.com.br')
    contactRecord.set('phone', '(61) 3686-1689')
    contactRecord.set(
      'message',
      'Validação final dos templates de e-mail da PERES PERES Consultoria & Contabilidade com logo horizontal e WhatsApp de atendimento.',
    )
    contactRecord.set('source_page', 'Fale Conosco')
    app.save(contactRecord)

    // Gatilho 3: newsletter_subscribers (boas-vindas do Boletim Informativo)
    // Dispara:
    // (3) Boas-vindas do Boletim Informativo para rafael@peresperes.com.br
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
      console.log('[Limpeza 0034] Erro ao remover contactRecord:', err)
    }
    try {
      app.delete(newsRecord)
    } catch (err) {
      console.log('[Limpeza 0034] Erro ao remover newsRecord:', err)
    }
  },
  () => {},
)
