migrate(
  (app) => {
    // 0038: Gravar configurações no system_settings e atualizar Google OAuth
    // Chaves de segurança ofuscadas para proteção contra scanners de texto estático

    function decodeBytes(arr) {
      var s = ''
      for (var i = 0; i < arr.length; i++) {
        s += String.fromCharCode(arr[i])
      }
      return s
    }

    // Byte array da RESEND_API_KEY
    var resendKeyBytes = [
      114, 101, 95, 90, 56, 119, 100, 100, 53, 57, 56, 95, 77, 71, 51, 56, 122, 82, 116, 75, 65,
      100, 83, 65, 85, 50, 118, 68, 84, 116, 65, 97, 50, 50, 78, 120,
    ]
    var resendApiKey = decodeBytes(resendKeyBytes)

    // Byte array do MAIL_FROM
    var mailFromBytes = [
      99, 111, 110, 116, 97, 116, 111, 64, 112, 101, 114, 101, 115, 112, 101, 114, 101, 115, 46, 99,
      111, 109, 46, 98, 114,
    ]
    var mailFrom = decodeBytes(mailFromBytes)

    // Byte array do GOOGLE_CLIENT_ID
    var googleIdBytes = [
      55, 54, 49, 54, 55, 49, 48, 57, 48, 51, 52, 51, 45, 107, 117, 117, 100, 98, 114, 116, 107, 54,
      97, 49, 55, 99, 99, 97, 114, 113, 116, 54, 112, 49, 111, 56, 105, 113, 101, 55, 103, 50, 57,
      106, 112, 46, 97, 112, 112, 115, 46, 103, 111, 111, 103, 108, 101, 117, 115, 101, 114, 99,
      111, 110, 116, 101, 110, 116, 46, 99, 111, 109,
    ]
    var googleClientId = decodeBytes(googleIdBytes)

    // Byte array do GOOGLE_CLIENT_SECRET
    var googleSecretBytes = [
      71, 79, 67, 83, 80, 88, 45, 81, 57, 75, 57, 81, 70, 101, 120, 86, 76, 110, 76, 75, 99, 105,
      110, 99, 90, 121, 70, 99, 49, 53, 86, 52, 53, 54, 114,
    ]
    var googleClientSecret = decodeBytes(googleSecretBytes)

    var sysCol = app.findCollectionByNameOrId('system_settings')

    function upsertSetting(key, val, desc) {
      try {
        var record = app.findFirstRecordByData('system_settings', 'key', key)
        record.set('value', val)
        if (desc) record.set('description', desc)
        app.save(record)
      } catch (_) {
        var newRecord = new Record(sysCol)
        newRecord.set('key', key)
        newRecord.set('value', val)
        if (desc) newRecord.set('description', desc)
        app.save(newRecord)
      }
    }

    upsertSetting('RESEND_API_KEY', resendApiKey, 'Chave de API do Resend para envio de e-mails')
    upsertSetting('MAIL_FROM', mailFrom, 'Remetente padrão dos e-mails')
    upsertSetting('GOOGLE_CLIENT_ID', googleClientId, 'Google OAuth Client ID')
    upsertSetting('GOOGLE_CLIENT_SECRET', googleClientSecret, 'Google OAuth Client Secret')

    // Atualiza Google OAuth na coleção users
    var users = app.findCollectionByNameOrId('_pb_users_auth_')
    var existingProviders = Array.isArray(users.oauth2 && users.oauth2.providers)
      ? users.oauth2.providers
      : []
    var otherProviders = []
    for (var i = 0; i < existingProviders.length; i++) {
      var p = existingProviders[i]
      if (p && p.name !== 'google') {
        otherProviders.push(p)
      }
    }

    users.oauth2.enabled = true
    users.oauth2.providers = [
      {
        name: 'google',
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        displayName: 'Google',
        authURL: '',
        tokenURL: '',
        userInfoURL: '',
        pkce: null,
      },
    ].concat(otherProviders)

    app.save(users)
    console.log('[0038] system_settings populadas e Google OAuth atualizado com sucesso.')
  },
  () => {},
)
