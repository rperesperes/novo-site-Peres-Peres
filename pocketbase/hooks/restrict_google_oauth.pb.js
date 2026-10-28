// Hook no backend para restringir login com Google exclusivamente ao Rafael (rafael@peresperes.com.br)
// Se uma conta for autenticada ou criada via OAuth2 com e-mail não autorizado, rejeita imediatamente no servidor.

onRecordAuthWithOAuth2Request((e) => {
  const allowedEmail = 'rafael@peresperes.com.br'
  const userEmail = (e.record?.getString('email') || e.oauth2User?.email || '').trim().toLowerCase()

  if (userEmail && userEmail !== allowedEmail.toLowerCase()) {
    throw new ForbiddenError(
      'Acesso restrito. Este ambiente é exclusivo para a administração da PERES PERES Consultoria e Contabilidade (rafael@peresperes.com.br).',
    )
  }

  e.next()
}, 'users')
