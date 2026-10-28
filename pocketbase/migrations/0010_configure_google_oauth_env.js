migrate(
  (app) => {
    const clientId = $os.getenv('GOOGLE_CLIENT_ID') || ''
    const clientSecret = $os.getenv('GOOGLE_CLIENT_SECRET') || ''

    if (!clientId || !clientSecret) {
      console.log(
        'Google OAuth: GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET não configurados no ambiente.',
      )
      return
    }

    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    const existingProviders = Array.isArray(users.oauth2?.providers) ? users.oauth2.providers : []
    const otherProviders = existingProviders.filter((p) => p && p.name !== 'google')

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
  },
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    const existingProviders = Array.isArray(users.oauth2?.providers) ? users.oauth2.providers : []
    users.oauth2.providers = existingProviders.filter((p) => p && p.name !== 'google')
    if (users.oauth2.providers.length === 0) {
      users.oauth2.enabled = false
    }
    app.save(users)
  },
)
