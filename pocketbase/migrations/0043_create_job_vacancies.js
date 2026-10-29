migrate(
  (app) => {
    const collection = new Collection({
      name: 'job_vacancies',
      type: 'base',
      listRule: "@request.auth.id != '' || status = 'aberta'",
      viewRule: "@request.auth.id != '' || status = 'aberta'",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'area', type: 'text', required: true },
        {
          name: 'contract_type',
          type: 'select',
          required: true,
          values: ['CLT', 'Estágio', 'PJ', 'Temporário'],
          maxSelect: 1,
        },
        {
          name: 'modality',
          type: 'select',
          required: true,
          values: ['Presencial', 'Híbrido', 'Remoto'],
          maxSelect: 1,
        },
        { name: 'description', type: 'text', required: true },
        { name: 'responsibilities', type: 'text', required: false },
        { name: 'requirements', type: 'text', required: false },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['aberta', 'encerrada'],
          maxSelect: 1,
        },
        { name: 'display_order', type: 'number', required: false },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_job_vacancies_status_order ON job_vacancies (status, display_order)',
      ],
    })
    app.save(collection)

    // Semente inicial de exemplo / banco de talentos
    try {
      const record = new Record(collection)
      record.set('title', 'Assistente Contábil e Fiscal')
      record.set('area', 'Contábil e Tributária')
      record.set('contract_type', 'CLT')
      record.set('modality', 'Híbrido')
      record.set(
        'description',
        'Atuação no suporte às rotinas contábeis, conciliações bancárias e fiscais, apuração de tributos do Simples Nacional e Lucro Presumido, e atendimento consultivo inicial aos clientes sob supervisão de analistas e peritos.',
      )
      record.set(
        'responsibilities',
        '• Executar conciliações contábeis e financeiras com rigor técnico.\n• Auxiliar na apuração de impostos diretos e indiretos (Simples Nacional, PIS/COFINS, IRPJ/CSLL, ISS).\n• Elaborar e conferir declarações acessórias (SPED, DEFIS, DCTF, EFD-Reinf).\n• Apoiar na organização documental e atendimento ágil e cortês a clientes.',
      )
      record.set(
        'requirements',
        '• Cursando Ciências Contábeis (a partir do 4º semestre) ou formação concluída.\n• Conhecimento básico/intermediário em legislação tributária e normas contábeis brasileiras.\n• Boa comunicação escrita, postura ética e perfil analítico.\n• Domínio de Excel e facilidade com sistemas contábeis.',
      )
      record.set('status', 'aberta')
      record.set('display_order', 1)
      app.save(record)
    } catch (e) {
      console.log('Aviso ao semear vaga inicial:', e)
    }
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('job_vacancies')
      app.delete(collection)
    } catch (_) {}
  },
)
