migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    users.oauth2.enabled = true
    users.oauth2.providers = [
      {
        name: 'google',
        clientId: '761671090343-kuudbrtk6a17ccarqt6p1o8iqe7g29jp.apps.googleusercontent.com',
        clientSecret: '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',
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
    users.oauth2.providers = []
    users.oauth2.enabled = false
    app.save(users)
  },
)
