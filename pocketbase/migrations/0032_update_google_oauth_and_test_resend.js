migrate(
  (app) => {
    // 0032: Atualização segura do provedor Google OAuth no PocketBase
    // Lê as credenciais exclusivamente de variáveis de ambiente ($os.getenv e $secrets)
    let clientId = ''
    let clientSecret = ''

    try {
      clientId = ($os.getenv('GOOGLE_CLIENT_ID') || '').trim()
      clientSecret = ($os.getenv('GOOGLE_CLIENT_SECRET') || '').trim()
    } catch (_) {}

    try {
      if (typeof $secrets !== 'undefined' && $secrets.get) {
        if (!clientId && $secrets.has && $secrets.has('GOOGLE_CLIENT_ID')) {
          clientId = ($secrets.get('GOOGLE_CLIENT_ID') || '').trim()
        }
        if (!clientSecret && $secrets.has && $secrets.has('GOOGLE_CLIENT_SECRET')) {
          clientSecret = ($secrets.get('GOOGLE_CLIENT_SECRET') || '').trim()
        }
      }
    } catch (_) {}

    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    const existingProviders = Array.isArray(users.oauth2?.providers) ? users.oauth2.providers : []
    const otherProviders = existingProviders.filter((p) => p && p.name !== 'google')

    if (clientId && clientSecret) {
      users.oauth2.enabled = true
      users.oauth2.providers = [
        ...otherProviders,
        {
          name: 'google',
          clientId: clientId,
          clientSecret: clientSecret,
          displayName: 'Google',
          authURL: '',
          tokenURL: '',
          userInfoURL: '',
          pkce: null,
        },
      ]
      app.save(users)
      console.log(
        '[Google OAuth 0032] Provedor Google atualizado com novas credenciais via variáveis de ambiente.',
      )
    } else {
      console.log(
        '[Google OAuth 0032] GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET não encontrados nas variáveis de ambiente. Mantendo configuração existente.',
      )
    }

    // Diagnóstico das variáveis do Resend
    let resendKey = ''
    let mailFrom = ''
    try {
      resendKey = ($os.getenv('RESEND_API_KEY') || '').trim()
      mailFrom = ($os.getenv('MAIL_FROM') || '').trim()
    } catch (_) {}

    try {
      if (typeof $secrets !== 'undefined' && $secrets.get) {
        if (!resendKey && $secrets.has && $secrets.has('RESEND_API_KEY')) {
          resendKey = ($secrets.get('RESEND_API_KEY') || '').trim()
        }
        if (!mailFrom && $secrets.has && $secrets.has('MAIL_FROM')) {
          mailFrom = ($secrets.get('MAIL_FROM') || '').trim()
        }
      }
    } catch (_) {}

    console.log(
      '[Env 0032 Check]',
      'resendKeyLen:',
      resendKey.length,
      'mailFrom:',
      mailFrom,
      'hasGoogleId:',
      Boolean(clientId),
      'hasGoogleSecret:',
      Boolean(clientSecret),
    )

    // =========================================================================
    // Disparo dos 3 e-mails reais do sistema:
    // 1. Notificação de contato ao escritório (contato@peresperes.com.br)
    // 2. Confirmação ao visitante do Fale Conosco (rafael@peresperes.com.br)
    // 3. Boas-vindas do Boletim Informativo (rafael@peresperes.com.br)
    // =========================================================================

    // Gatilho 1 & 2: contact_requests (cria registro com rafael@peresperes.com.br)
    const contactCol = app.findCollectionByNameOrId('contact_requests')
    const contactRecord = new Record(contactCol)
    contactRecord.set('name', 'Rafael Peres (Teste Oficial 0032)')
    contactRecord.set('email', 'rafael@peresperes.com.br')
    contactRecord.set('phone', '(61) 3686-1689')
    contactRecord.set(
      'message',
      'Disparo de teste real dos e-mails transacionais (escritório + confirmação visitante) via Resend.',
    )
    contactRecord.set('source_page', 'Teste Automatizado 0032')
    app.save(contactRecord)

    // Gatilho 3: newsletter_subscribers (boas-vindas ao assinante)
    const newsCol = app.findCollectionByNameOrId('newsletter_subscribers')
    const newsRecord = new Record(newsCol)
    newsRecord.set('email', 'rafael@peresperes.com.br')
    newsRecord.set('source', 'Boletim Informativo - Teste Oficial 0032')
    newsRecord.set('status', 'ativo')
    app.save(newsRecord)

    // Limpeza dos registros de teste (garante banco apenas com dados reais)
    try {
      app.delete(contactRecord)
    } catch (err) {
      console.log('[Limpeza 0032] Erro ao remover contactRecord:', err)
    }
    try {
      app.delete(newsRecord)
    } catch (err) {
      console.log('[Limpeza 0032] Erro ao remover newsRecord:', err)
    }
  },
  () => {},
)
