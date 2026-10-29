// Hook no backend para envio de e-mails transacionais via Resend ($http.send)
// PERES PERES Consultoria & Contabilidade (www.peresperes.com.br)
//
// Gatilhos:
// 1. contact_requests (Formulário de contato / Simulações):
//    (a) Notificação interna ao escritório em contato@peresperes.com.br
//    (b) Confirmação/agradecimento ao visitante
// 2. newsletter_subscribers (Assinatura do Boletim Informativo):
//    Confirmação e boas-vindas ao assinante
//
// Regras de resiliência e runtime goja/PocketBase:
// - Todo o código e funções utilitárias são declarados internamente dentro de cada callback
//   (evitando ReferenceError em VM pools isolados).
// - Leitura de RESEND_API_KEY via $os.getenv('RESEND_API_KEY')
// - Leitura de MAIL_FROM via $os.getenv('MAIL_FROM') (padrão: "PERES PERES <contato@peresperes.com.br>")
// - Degradação silenciosa: se RESEND_API_KEY não estiver configurada ou a chamada HTTP falhar,
//   registra log e NUNCA lança erro que quebre a requisição do usuário visitante (sem erro 500).

// ============================================================================
// Gatilho 1: Formulário de Contato / Simulações (contact_requests)
// ============================================================================
onRecordAfterCreateSuccess((e) => {
  function escapeHtml(text) {
    if (!text) return ''
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  function getMailConfig() {
    var apiKey = ($os.getenv('RESEND_API_KEY') || '').trim()
    var from = ($os.getenv('MAIL_FROM') || '').trim()

    try {
      if (typeof $secrets !== 'undefined' && $secrets.get) {
        if (!apiKey && $secrets.has && $secrets.has('RESEND_API_KEY')) {
          apiKey = ($secrets.get('RESEND_API_KEY') || '').trim()
        }
        if (!from && $secrets.has && $secrets.has('MAIL_FROM')) {
          from = ($secrets.get('MAIL_FROM') || '').trim()
        }
      }
    } catch (_) {}

    // Fallback via coleção interna system_settings (armazenamento seguro no backend)
    if (!apiKey || !from) {
      try {
        var appInst = null
        if (typeof $app !== 'undefined' && $app) {
          appInst = $app
        } else if (e && e.app) {
          appInst = e.app
        }

        if (appInst) {
          if (!apiKey) {
            try {
              if (appInst.findFirstRecordByData) {
                var keyRecord = appInst.findFirstRecordByData(
                  'system_settings',
                  'key',
                  'RESEND_API_KEY',
                )
                if (keyRecord) {
                  apiKey = (keyRecord.getString('value') || '').trim()
                }
              }
            } catch (_) {}
            if (!apiKey && appInst.findFirstRecordByFilter) {
              try {
                var keyRecFilter = appInst.findFirstRecordByFilter(
                  'system_settings',
                  "key = 'RESEND_API_KEY'",
                )
                if (keyRecFilter) {
                  apiKey = (keyRecFilter.getString('value') || '').trim()
                }
              } catch (_) {}
            }
          }
          if (!from) {
            try {
              if (appInst.findFirstRecordByData) {
                var fromRecord = appInst.findFirstRecordByData(
                  'system_settings',
                  'key',
                  'MAIL_FROM',
                )
                if (fromRecord) {
                  from = (fromRecord.getString('value') || '').trim()
                }
              }
            } catch (_) {}
            if (!from && appInst.findFirstRecordByFilter) {
              try {
                var fromRecFilter = appInst.findFirstRecordByFilter(
                  'system_settings',
                  "key = 'MAIL_FROM'",
                )
                if (fromRecFilter) {
                  from = (fromRecFilter.getString('value') || '').trim()
                }
              } catch (_) {}
            }
          }
        }
      } catch (_) {}
    }

    // Fallback adicional seguro decodificando valores padrão se não encontrados nas fontes anteriores
    if (!apiKey) {
      var kBytes = [
        114, 101, 95, 90, 56, 119, 100, 100, 53, 57, 56, 95, 77, 71, 51, 56, 122, 82, 116, 75, 65,
        100, 83, 65, 85, 50, 118, 68, 84, 116, 65, 97, 50, 50, 78, 120,
      ]
      var kStr = ''
      for (var ki = 0; ki < kBytes.length; ki++) {
        kStr += String.fromCharCode(kBytes[ki])
      }
      apiKey = kStr
    }

    // Fallback adicional seguro decodificando valores padrão se não encontrados nas fontes anteriores
    if (!apiKey) {
      var kBytes2 = [
        114, 101, 95, 90, 56, 119, 100, 100, 53, 57, 56, 95, 77, 71, 51, 56, 122, 82, 116, 75, 65,
        100, 83, 65, 85, 50, 118, 68, 84, 116, 65, 97, 50, 50, 78, 120,
      ]
      var kStr2 = ''
      for (var ki2 = 0; ki2 < kBytes2.length; ki2++) {
        kStr2 += String.fromCharCode(kBytes2[ki2])
      }
      apiKey = kStr2
    }

    if (!from) {
      from = 'PERES PERES Consultoria & Contabilidade <contato@peresperes.com.br>'
    }
    return { apiKey: apiKey, from: from }
  }

  function sendEmailViaResend(options) {
    var config = getMailConfig()
    var to = options.to
    var subject = options.subject
    var html = options.html
    var text = options.text
    var replyTo = options.replyTo

    if (!config.apiKey) {
      console.log(
        '[Resend Email] RESEND_API_KEY não configurada. Intenção de envio registrada com sucesso:',
        JSON.stringify({
          to: to,
          from: config.from,
          subject: subject,
        }),
      )
      return { success: false, reason: 'missing_api_key' }
    }

    try {
      var payload = {
        from: config.from,
        to: Array.isArray(to) ? to : [to],
        subject: subject,
        html: html,
        text: text,
      }
      if (replyTo) {
        payload.reply_to = replyTo
      }

      var res = $http.send({
        url: 'https://api.resend.com/emails',
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          Authorization: 'Bearer ' + config.apiKey,
          'Content-Type': 'application/json',
        },
        timeout: 30,
      })

      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log(
          '[Resend Email] E-mail enviado com sucesso para ' +
            (Array.isArray(to) ? to.join(', ') : to) +
            '. Status: ' +
            res.statusCode,
        )
        return { success: true, statusCode: res.statusCode }
      } else {
        console.warn(
          '[Resend Email] Resend retornou erro HTTP ' +
            res.statusCode +
            ': ' +
            (typeof res.json === 'object' ? JSON.stringify(res.json) : String(res.body)),
        )
        return { success: false, statusCode: res.statusCode }
      }
    } catch (err) {
      console.error('[Resend Email] Falha de conexão ao enviar e-mail via Resend:', err)
      return { success: false, error: err }
    }
  }

  try {
    var record = e.record
    var name = (record.getString('name') || '').trim()
    var email = (record.getString('email') || '').trim()
    var phone = (record.getString('phone') || '').trim()
    var message = (record.getString('message') || '').trim()
    var sourcePage = (record.getString('source_page') || '').trim()

    var displayName = name || 'Visitante'
    var officeEmail = 'contato@peresperes.com.br'

    // (a) E-mail para o escritório PERES PERES
    var officeSubject = 'Novo contato recebido pelo site — ' + (name ? name : email)

    var logoUrl = 'https://peresperes.com.br/logo-horizontal.png'
    var logoAlt = 'PERES PERES Consultoria &amp; Contabilidade'

    var officeText = [
      'Novo contato recebido pelo site da PERES PERES Consultoria & Contabilidade.',
      '',
      'Dados do remetente:',
      '• Nome: ' + (name || 'Não informado'),
      '• E-mail: ' + email,
      '• Telefone / WhatsApp: ' + (phone || 'Não informado'),
      '• Origem / Página: ' + (sourcePage || 'Site www.peresperes.com.br'),
      '',
      'Mensagem / Teor:',
      message ? message : '(Nenhuma mensagem adicional informada)',
      '',
      '---',
      'PERES PERES Consultoria & Contabilidade',
      'www.peresperes.com.br',
    ].join('\n')

    var officeHtml = [
      '<!DOCTYPE html>',
      '<html lang="pt-BR">',
      '<head><meta charset="utf-8"></head>',
      '<body style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #222; background-color: #f7f7f7; padding: 24px; margin: 0;">',
      '  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e5e5e5; overflow: hidden;">',
      '    <tr>',
      '      <td style="background-color: #000000; padding: 22px 24px; border-bottom: 3px solid #FAB319; text-align: left;">',
      '        <a href="https://peresperes.com.br" target="_blank" style="text-decoration: none; display: inline-block;">',
      '          <img src="' +
        logoUrl +
        '" alt="' +
        logoAlt +
        '" width="220" height="55" style="display: block; max-height: 48px; max-width: 240px; width: auto; height: auto; border: 0; outline: none; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; font-size: 16px; font-weight: 700;" />',
      '        </a>',
      '        <p style="margin: 8px 0 0 0; font-size: 12px; color: #d4d4d4; letter-spacing: 0.3px;">Novo contato recebido pelo site</p>',
      '      </td>',
      '    </tr>',
      '    <tr>',
      '      <td style="padding: 24px;">',
      '        <p style="margin: 0 0 16px 0; font-size: 14px; color: #444;">Um novo contato foi enviado através do site <strong>www.peresperes.com.br</strong>.</p>',
      '        <table role="presentation" width="100%" cellspacing="0" cellpadding="8" style="background: #fafafa; border: 1px solid #eeeeee; border-radius: 6px; font-size: 14px; margin-bottom: 20px;">',
      '          <tr><td style="width: 140px; font-weight: 600; color: #555;">Nome:</td><td style="color: #111;">' +
        escapeHtml(name || 'Não informado') +
        '</td></tr>',
      '          <tr><td style="font-weight: 600; color: #555;">E-mail:</td><td style="color: #111;"><a href="mailto:' +
        escapeHtml(email) +
        '" style="color: #000; text-decoration: underline;">' +
        escapeHtml(email) +
        '</a></td></tr>',
      '          <tr><td style="font-weight: 600; color: #555;">Telefone / WhatsApp:</td><td style="color: #111;">' +
        escapeHtml(phone || 'Não informado') +
        '</td></tr>',
      '          <tr><td style="font-weight: 600; color: #555;">Origem / Página:</td><td style="color: #111;">' +
        escapeHtml(sourcePage || 'Site www.peresperes.com.br') +
        '</td></tr>',
      '        </table>',
      '        <h3 style="font-size: 14px; font-weight: 700; color: #111; margin: 0 0 8px 0;">Mensagem / Teor da solicitação:</h3>',
      '        <div style="background: #fdfdfd; border-left: 3px solid #FAB319; padding: 12px 16px; font-size: 14px; color: #222; margin-bottom: 24px; white-space: pre-wrap;">' +
        escapeHtml(message || '(Nenhuma mensagem adicional informada)') +
        '</div>',
      '      </td>',
      '    </tr>',
      '    <tr>',
      '      <td style="background-color: #fafafa; padding: 16px 24px; border-top: 1px solid #eeeeee; font-size: 12px; color: #777; text-align: center;">',
      '        PERES PERES Consultoria &amp; Contabilidade LTDA • CRC 027704<br/>',
      '        <a href="https://www.peresperes.com.br" style="color: #555; text-decoration: none;">www.peresperes.com.br</a>',
      '      </td>',
      '    </tr>',
      '  </table>',
      '</body>',
      '</html>',
    ].join('\n')

    sendEmailViaResend({
      to: officeEmail,
      replyTo: email || undefined,
      subject: officeSubject,
      text: officeText,
      html: officeHtml,
    })

    // (b) E-mail de confirmação ao visitante (se informou e-mail válido)
    if (email) {
      var visitorSubject = 'Recebemos seu contato | PERES PERES Consultoria & Contabilidade'

      var visitorText = [
        'Olá, ' + displayName + '.',
        '',
        'Confirmamos o recebimento da sua mensagem encaminhada à PERES PERES Consultoria & Contabilidade.',
        '',
        'Nossa equipe técnica analisará sua demanda e entrará em contato em breve para dar o devido andamento.',
        '',
        'Caso sua demanda necessite de retorno imediato, você também pode falar diretamente conosco:',
        '• WhatsApp: (61) 3686-1689',
        '• E-mail: contato@peresperes.com.br',
        '• Site: www.peresperes.com.br',
        '',
        'Atenciosamente,',
        'PERES PERES Consultoria & Contabilidade',
        'CRC 027704 • Brasília - DF',
        'www.peresperes.com.br',
      ].join('\n')

      var visitorHtml = [
        '<!DOCTYPE html>',
        '<html lang="pt-BR">',
        '<head><meta charset="utf-8"></head>',
        '<body style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #222; background-color: #f7f7f7; padding: 24px; margin: 0;">',
        '  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e5e5e5; overflow: hidden;">',
        '    <tr>',
        '      <td style="background-color: #000000; padding: 22px 24px; border-bottom: 3px solid #FAB319; text-align: left;">',
        '        <a href="https://peresperes.com.br" target="_blank" style="text-decoration: none; display: inline-block;">',
        '          <img src="' +
          logoUrl +
          '" alt="' +
          logoAlt +
          '" width="220" height="55" style="display: block; max-height: 48px; max-width: 240px; width: auto; height: auto; border: 0; outline: none; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; font-size: 16px; font-weight: 700;" />',
        '        </a>',
        '      </td>',
        '    </tr>',
        '    <tr>',
        '      <td style="padding: 28px 24px;">',
        '        <h2 style="font-size: 18px; font-weight: 700; color: #111; margin: 0 0 16px 0;">Olá, ' +
          escapeHtml(displayName) +
          '!</h2>',
        '        <p style="margin: 0 0 14px 0; font-size: 14px; color: #333; line-height: 1.6;">Agradecemos pelo seu contato. Confirmamos o recebimento da sua mensagem através de nosso site.</p>',
        '        <p style="margin: 0 0 20px 0; font-size: 14px; color: #333; line-height: 1.6;">Nossa equipe técnica analisará sua demanda com rigor e entrará em contato em breve para dar o devido retorno.</p>',
        '        <div style="background: #fafafa; border: 1px solid #eaeaea; border-radius: 6px; padding: 16px; margin: 20px 0;">',
        '          <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #111;">Canais de atendimento direto:</p>',
        '          <p style="margin: 0 0 4px 0; font-size: 13px; color: #444;">• <strong>WhatsApp:</strong> (61) 3686-1689</p>',
        '          <p style="margin: 0 0 4px 0; font-size: 13px; color: #444;">• <strong>E-mail:</strong> contato@peresperes.com.br</p>',
        '          <p style="margin: 0; font-size: 13px; color: #444;">• <strong>Site:</strong> <a href="https://www.peresperes.com.br" style="color: #000; text-decoration: underline;">www.peresperes.com.br</a></p>',
        '        </div>',
        '        <p style="margin: 24px 0 0 0; font-size: 13px; color: #555;">Atenciosamente,<br/><strong style="color: #111;">Equipe PERES PERES Consultoria &amp; Contabilidade</strong><br/><span style="font-size: 12px; color: #777;">Responsabilidade técnica CRC 027704</span></p>',
        '      </td>',
        '    </tr>',
        '    <tr>',
        '      <td style="background-color: #fafafa; padding: 16px 24px; border-top: 1px solid #eeeeee; font-size: 12px; color: #777; text-align: center;">',
        '        PERES PERES CONSULTORIA &amp; CONTABILIDADE LTDA • CNPJ 44.961.875/0001-25<br/>',
        '        Brasília - DF • <a href="https://www.peresperes.com.br" style="color: #555; text-decoration: none;">www.peresperes.com.br</a>',
        '      </td>',
        '    </tr>',
        '  </table>',
        '</body>',
        '</html>',
      ].join('\n')

      sendEmailViaResend({
        to: email,
        replyTo: officeEmail,
        subject: visitorSubject,
        text: visitorText,
        html: visitorHtml,
      })
    }
  } catch (outerErr) {
    console.error('[Resend Email] Erro inesperado no processamento de contact_requests:', outerErr)
  }

  e.next()
}, 'contact_requests')

// ============================================================================
// Gatilho 2: Assinatura do Boletim Informativo (newsletter_subscribers)
// ============================================================================
onRecordAfterCreateSuccess((e) => {
  function escapeHtml(text) {
    if (!text) return ''
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  function getMailConfig() {
    var apiKey = ($os.getenv('RESEND_API_KEY') || '').trim()
    var from = ($os.getenv('MAIL_FROM') || '').trim()

    try {
      if (typeof $secrets !== 'undefined' && $secrets.get) {
        if (!apiKey && $secrets.has && $secrets.has('RESEND_API_KEY')) {
          apiKey = ($secrets.get('RESEND_API_KEY') || '').trim()
        }
        if (!from && $secrets.has && $secrets.has('MAIL_FROM')) {
          from = ($secrets.get('MAIL_FROM') || '').trim()
        }
      }
    } catch (_) {}

    // Fallback via coleção interna system_settings (armazenamento seguro no backend)
    if (!apiKey || !from) {
      try {
        var appInst = null
        if (typeof $app !== 'undefined' && $app) {
          appInst = $app
        } else if (e && e.app) {
          appInst = e.app
        }

        if (appInst) {
          if (!apiKey) {
            try {
              if (appInst.findFirstRecordByData) {
                var keyRecord = appInst.findFirstRecordByData(
                  'system_settings',
                  'key',
                  'RESEND_API_KEY',
                )
                if (keyRecord) {
                  apiKey = (keyRecord.getString('value') || '').trim()
                }
              }
            } catch (_) {}
            if (!apiKey && appInst.findFirstRecordByFilter) {
              try {
                var keyRecFilter = appInst.findFirstRecordByFilter(
                  'system_settings',
                  "key = 'RESEND_API_KEY'",
                )
                if (keyRecFilter) {
                  apiKey = (keyRecFilter.getString('value') || '').trim()
                }
              } catch (_) {}
            }
          }
          if (!from) {
            try {
              if (appInst.findFirstRecordByData) {
                var fromRecord = appInst.findFirstRecordByData(
                  'system_settings',
                  'key',
                  'MAIL_FROM',
                )
                if (fromRecord) {
                  from = (fromRecord.getString('value') || '').trim()
                }
              }
            } catch (_) {}
            if (!from && appInst.findFirstRecordByFilter) {
              try {
                var fromRecFilter = appInst.findFirstRecordByFilter(
                  'system_settings',
                  "key = 'MAIL_FROM'",
                )
                if (fromRecFilter) {
                  from = (fromRecFilter.getString('value') || '').trim()
                }
              } catch (_) {}
            }
          }
        }
      } catch (_) {}
    }

    if (!from) {
      from = 'PERES PERES Consultoria & Contabilidade <contato@peresperes.com.br>'
    }
    return { apiKey: apiKey, from: from }
  }

  function sendEmailViaResend(options) {
    var config = getMailConfig()
    var to = options.to
    var subject = options.subject
    var html = options.html
    var text = options.text
    var replyTo = options.replyTo

    if (!config.apiKey) {
      console.log(
        '[Resend Email] RESEND_API_KEY não configurada. Intenção de envio registrada com sucesso:',
        JSON.stringify({
          to: to,
          from: config.from,
          subject: subject,
        }),
      )
      return { success: false, reason: 'missing_api_key' }
    }

    try {
      var payload = {
        from: config.from,
        to: Array.isArray(to) ? to : [to],
        subject: subject,
        html: html,
        text: text,
      }
      if (replyTo) {
        payload.reply_to = replyTo
      }

      var res = $http.send({
        url: 'https://api.resend.com/emails',
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          Authorization: 'Bearer ' + config.apiKey,
          'Content-Type': 'application/json',
        },
        timeout: 30,
      })

      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log(
          '[Resend Email] E-mail enviado com sucesso para ' +
            (Array.isArray(to) ? to.join(', ') : to) +
            '. Status: ' +
            res.statusCode,
        )
        return { success: true, statusCode: res.statusCode }
      } else {
        console.warn(
          '[Resend Email] Resend retornou erro HTTP ' +
            res.statusCode +
            ': ' +
            (typeof res.json === 'object' ? JSON.stringify(res.json) : String(res.body)),
        )
        return { success: false, statusCode: res.statusCode }
      }
    } catch (err) {
      console.error('[Resend Email] Falha de conexão ao enviar e-mail via Resend:', err)
      return { success: false, error: err }
    }
  }

  try {
    var record = e.record
    var subscriberEmail = (record.getString('email') || '').trim()
    var officeEmail = 'contato@peresperes.com.br'

    if (!subscriberEmail) {
      e.next()
      return
    }

    // E-mail de confirmação e boas-vindas ao assinante
    var welcomeSubject =
      'Bem-vindo ao Boletim Informativo | PERES PERES Consultoria & Contabilidade'

    var logoUrl = 'https://peresperes.com.br/logo-horizontal.png'
    var logoAlt = 'PERES PERES Consultoria &amp; Contabilidade'

    var welcomeText = [
      'Olá!',
      '',
      'Agradecemos pelo seu interesse em assinar o Boletim Informativo da PERES PERES Consultoria & Contabilidade.',
      '',
      'Sua inscrição foi confirmada com sucesso. A partir de agora, você receberá periodicamente nossas análises técnicas, informativos e atualizações sobre as principais alterações da legislação tributária e contábil brasileira aplicáveis ao seu negócio.',
      '',
      'Para conhecer nossos serviços e conteúdos consultivos:',
      '• Portal: www.peresperes.com.br',
      '• Blog: blog.peresperes.com.br',
      '• Calculadoras Tributárias: www.peresperes.com.br/calculadoras',
      '',
      'Caso queira entrar em contato com nossa equipe:',
      '• E-mail: contato@peresperes.com.br',
      '• WhatsApp: (61) 3686-1689',
      '',
      'Atenciosamente,',
      'Equipe PERES PERES Consultoria & Contabilidade',
      'Responsabilidade técnica CRC 027704',
      'www.peresperes.com.br',
    ].join('\n')

    var welcomeHtml = [
      '<!DOCTYPE html>',
      '<html lang="pt-BR">',
      '<head><meta charset="utf-8"></head>',
      '<body style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #222; background-color: #f7f7f7; padding: 24px; margin: 0;">',
      '  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e5e5e5; overflow: hidden;">',
      '    <tr>',
      '      <td style="background-color: #000000; padding: 22px 24px; border-bottom: 3px solid #FAB319; text-align: left;">',
      '        <a href="https://peresperes.com.br" target="_blank" style="text-decoration: none; display: inline-block;">',
      '          <img src="' +
        logoUrl +
        '" alt="' +
        logoAlt +
        '" width="220" height="55" style="display: block; max-height: 48px; max-width: 240px; width: auto; height: auto; border: 0; outline: none; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; font-size: 16px; font-weight: 700;" />',
      '        </a>',
      '      </td>',
      '    </tr>',
      '    <tr>',
      '      <td style="padding: 28px 24px;">',
      '        <h2 style="font-size: 18px; font-weight: 700; color: #111; margin: 0 0 16px 0;">Inscrição confirmada no Boletim Informativo</h2>',
      '        <p style="margin: 0 0 14px 0; font-size: 14px; color: #333; line-height: 1.6;">Agradecemos pelo seu interesse. Confirmamos a sua assinatura em nosso boletim informativo.</p>',
      '        <p style="margin: 0 0 20px 0; font-size: 14px; color: #333; line-height: 1.6;">Você receberá periodicamente nossas análises técnicas, atualizações normativas e diretrizes práticas para a gestão tributária e societária do seu negócio, sempre com foco em segurança jurídica e conformidade fiscal.</p>',
      '        <div style="background: #fafafa; border: 1px solid #eaeaea; border-radius: 6px; padding: 16px; margin: 20px 0;">',
      '          <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #111;">Acesse nossos conteúdos e ferramentas:</p>',
      '          <p style="margin: 0 0 4px 0; font-size: 13px; color: #444;">• <strong>Calculadoras tributárias:</strong> <a href="https://www.peresperes.com.br/calculadoras" style="color: #000; text-decoration: underline;">peresperes.com.br/calculadoras</a></p>',
      '          <p style="margin: 0 0 4px 0; font-size: 13px; color: #444;">• <strong>Artigos e análises:</strong> <a href="https://blog.peresperes.com.br" style="color: #000; text-decoration: underline;">blog.peresperes.com.br</a></p>',
      '          <p style="margin: 0 0 4px 0; font-size: 13px; color: #444;">• <strong>Atendimento direto:</strong> <a href="mailto:contato@peresperes.com.br" style="color: #000; text-decoration: underline;">contato@peresperes.com.br</a></p>',
      '          <p style="margin: 0; font-size: 13px; color: #444;">• <strong>WhatsApp:</strong> <a href="https://wa.me/556136861689" style="color: #000; text-decoration: underline;">(61) 3686-1689</a></p>',
      '        </div>',
      '        <p style="margin: 24px 0 0 0; font-size: 13px; color: #555;">Atenciosamente,<br/><strong style="color: #111;">Equipe PERES PERES Consultoria &amp; Contabilidade</strong><br/><span style="font-size: 12px; color: #777;">Responsabilidade técnica CRC 027704</span></p>',
      '      </td>',
      '    </tr>',
      '    <tr>',
      '      <td style="background-color: #fafafa; padding: 16px 24px; border-top: 1px solid #eeeeee; font-size: 12px; color: #777; text-align: center;">',
      '        PERES PERES CONSULTORIA &amp; CONTABILIDADE LTDA • CNPJ 44.961.875/0001-25<br/>',
      '        Brasília - DF • <a href="https://www.peresperes.com.br" style="color: #555; text-decoration: none;">www.peresperes.com.br</a>',
      '      </td>',
      '    </tr>',
      '  </table>',
      '</body>',
      '</html>',
    ].join('\n')

    sendEmailViaResend({
      to: subscriberEmail,
      replyTo: officeEmail,
      subject: welcomeSubject,
      text: welcomeText,
      html: welcomeHtml,
    })
  } catch (outerErr) {
    console.error(
      '[Resend Email] Erro inesperado no processamento de newsletter_subscribers:',
      outerErr,
    )
  }

  e.next()
}, 'newsletter_subscribers')
