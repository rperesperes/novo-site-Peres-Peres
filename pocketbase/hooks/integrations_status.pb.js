// Hook no backend para o painel /admin > Configurações:
// informa SOMENTE se as integrações estão configuradas, sem jamais
// expor o valor das chaves guardadas na coleção protegida system_settings
// (RESEND_API_KEY, MAIL_FROM, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET).
// Requer autenticação e libera a leitura apenas para o e-mail do Rafael.

// Rota customizada: prefixo /backend/v1/ é obrigatório para rotas novas
// (o namespace /api/ é reservado do PocketBase para rotas novas).
routerAdd(
  'GET',
  '/backend/v1/integrations-status',
  (e) => {
    const auth = e.requestInfo().auth
    const email = auth ? (auth.getString('email') || '').trim().toLowerCase() : ''
    if (email !== 'rafael@peresperes.com.br') {
      throw new ForbiddenError(
        'Acesso restrito à administração da PERES PERES Consultoria & Contabilidade.',
      )
    }

    const status = {
      email: { configured: false, missing: [] },
      google: { configured: false, missing: [] },
    }

    const checkKey = function (key, group) {
      let value = ''
      try {
        const rec = e.app.findFirstRecordByData('system_settings', 'key', key)
        value = (rec.getString('value') || '').trim()
      } catch (_) {}
      if (!value) {
        status[group].missing.push(key)
      }
    }

    checkKey('RESEND_API_KEY', 'email')
    checkKey('MAIL_FROM', 'email')
    checkKey('GOOGLE_CLIENT_ID', 'google')
    checkKey('GOOGLE_CLIENT_SECRET', 'google')

    status.email.configured = status.email.missing.length === 0
    status.google.configured = status.google.missing.length === 0

    return e.json(200, status)
  },
  $apis.requireAuth(),
)
