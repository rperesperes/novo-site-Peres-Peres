migrate((app) => {
  // Seed Posts
  const postsCol = app.findCollectionByNameOrId('posts')
  const posts = [
    {
      title: 'Impactos da Reforma Tributária em 2026',
      slug: 'impactos-reforma-2026',
      category: 'Legislação',
      excerpt:
        'Uma análise profunda sobre o novo IVA Dual e como as empresas do DF devem se preparar.',
      status: 'published',
    },
    {
      title: 'Holding Familiar: Muito além da sucessão',
      slug: 'holding-familiar',
      category: 'Gestão Patrimonial',
      excerpt:
        'Descubra as vantagens tributárias na integralização de imóveis no capital social da holding.',
      status: 'published',
    },
    {
      title: 'Como funciona a Recuperação de Créditos (RCT)?',
      slug: 'recuperacao-creditos',
      category: 'Recuperação',
      excerpt:
        'Entenda os passos legais para recuperar impostos pagos indevidamente sem risco de autuação.',
      status: 'published',
    },
  ]
  for (const p of posts) {
    try {
      app.findFirstRecordByData('posts', 'slug', p.slug)
    } catch (_) {
      const record = new Record(postsCol)
      record.set('title', p.title)
      record.set('slug', p.slug)
      record.set('category', p.category)
      record.set('excerpt', p.excerpt)
      record.set('status', p.status)
      app.save(record)
    }
  }

  // Seed Resources
  const resCol = app.findCollectionByNameOrId('resources')
  const resources = [
    {
      title: 'Guia Prático: Holding Familiar 2026',
      description: 'E-book em PDF - 15 páginas',
      category: 'E-book',
    },
    {
      title: 'Planilha de Diagnóstico Simples Nacional',
      description: 'Template Excel (.xlsx)',
      category: 'Planilha',
    },
  ]
  for (const r of resources) {
    try {
      app.findFirstRecordByData('resources', 'title', r.title)
    } catch (_) {
      const record = new Record(resCol)
      record.set('title', r.title)
      record.set('description', r.description)
      record.set('category', r.category)
      app.save(record)
    }
  }

  // Seed Success Cases
  const casesCol = app.findCollectionByNameOrId('success_cases')
  const cases = [
    {
      title: 'Indústria: Redução via Súmula X do CARF',
      sector: 'Indústria',
      before: 1200000,
      after: 900000,
      savings: '25%',
      description:
        'Aplicação de jurisprudência pacificada do CARF resultou em exclusão de rubricas da base de cálculo do PIS/COFINS.',
    },
    {
      title: 'Varejo: Exclusão do ICMS',
      sector: 'Varejo',
      before: 500000,
      after: 350000,
      savings: '30%',
      description:
        'Recuperação de créditos baseada na "Tese do Século" do STF, ajustando a sistemática de recolhimento.',
    },
    {
      title: 'Serviços: Reenquadramento Tributário',
      sector: 'Serviços (TI)',
      before: 200000,
      after: 140000,
      savings: '30%',
      description:
        'Transição estratégica do Lucro Presumido para o Simples Nacional com Anexo adequado ao Fator R.',
    },
  ]
  for (const c of cases) {
    try {
      app.findFirstRecordByData('success_cases', 'title', c.title)
    } catch (_) {
      const record = new Record(casesCol)
      record.set('title', c.title)
      record.set('sector', c.sector)
      record.set('before', c.before)
      record.set('after', c.after)
      record.set('savings', c.savings)
      record.set('description', c.description)
      app.save(record)
    }
  }
})
