migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('contact_requests')
    const record = new Record(collection)
    record.set('name', 'Teste Lead - PERES PERES')
    record.set('email', 'lead.teste@peresperes.com.br')
    record.set('phone', '(61) 98765-4321')
    record.set('message', 'Teste de validação de envio real no PocketBase Skip Cloud')
    record.set('source_page', 'Página de Contato (/contato)')
    app.save(record)
  },
  (app) => {
    // no-op revert
  },
)
