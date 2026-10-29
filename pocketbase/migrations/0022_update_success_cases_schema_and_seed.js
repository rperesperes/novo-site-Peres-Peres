migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('success_cases')

    if (!col.fields.getByName('segment')) {
      col.fields.add(new TextField({ name: 'segment' }))
    }
    if (!col.fields.getByName('context')) {
      col.fields.add(new TextField({ name: 'context' }))
    }
    if (!col.fields.getByName('challenge')) {
      col.fields.add(new TextField({ name: 'challenge' }))
    }
    if (!col.fields.getByName('actions_taken')) {
      col.fields.add(new TextField({ name: 'actions_taken' }))
    }
    if (!col.fields.getByName('highlight_phrase')) {
      col.fields.add(new TextField({ name: 'highlight_phrase' }))
    }
    if (!col.fields.getByName('display_order')) {
      col.fields.add(new NumberField({ name: 'display_order', onlyInt: true }))
    }
    if (!col.fields.getByName('status')) {
      col.fields.add(
        new SelectField({
          name: 'status',
          values: ['published', 'hidden'],
          maxSelect: 1,
        }),
      )
    }
    if (!col.fields.getByName('slug')) {
      col.fields.add(new TextField({ name: 'slug' }))
    }
    if (!col.fields.getByName('badge_text')) {
      col.fields.add(new TextField({ name: 'badge_text' }))
    }
    if (!col.fields.getByName('badge_subtext')) {
      col.fields.add(new TextField({ name: 'badge_subtext' }))
    }
    if (!col.fields.getByName('highlight_number')) {
      col.fields.add(new TextField({ name: 'highlight_number' }))
    }

    // Regras de acesso:
    // listRule e viewRule: públicos para casos publicados ("status = 'published'"), ou qualquer autenticado (para o admin ver todos inclusive ocultos)
    col.listRule = "@request.auth.id != '' || status = 'published' || status = ''"
    col.viewRule = "@request.auth.id != '' || status = 'published' || status = ''"
    col.createRule = "@request.auth.id != ''"
    col.updateRule = "@request.auth.id != ''"
    col.deleteRule = "@request.auth.id != ''"

    app.save(col)

    // Seed dos dois casos reais do escritório (idempotente)
    const existing = app.findRecordsByFilter('success_cases', '', '', 10, 0)
    if (existing.length === 0) {
      // Caso 1
      const c1 = new Record(col)
      c1.set('title', 'CASO 1 — Negociação e parcelamento de débitos tributários')
      c1.set('slug', 'parcelamento-debitos-tributarios')
      c1.set('badge_text', 'CASO 1')
      c1.set('badge_subtext', 'Negociação e parcelamento de débitos tributários')
      c1.set(
        'segment',
        'clínica de estética e procedimentos estéticos, em operação desde 2008, com 15 colaboradores e prestadores — caso aplicável a qualquer segmento com passivo tributário acumulado.',
      )
      c1.set(
        'context',
        'Empresa em operação há mais de 15 anos, no Simples Nacional desde a fundação, sem revisão periódica de enquadramento e sem acompanhamento financeiro, tributário e de precificação. Operava sem análise comparativa de alternativas e recolhia tributos por alíquota efetiva superior à necessária ao seu porte e à sua atividade.',
      )
      c1.set(
        'challenge',
        'A empresa acumulou passivo tributário perante a União e o Distrito Federal, sem qualquer renegociação ou parcelamento em curso. Somavam-se a isso declarações atrasadas, com risco de exclusão de ofício do Simples Nacional (LC 123/2006, arts. 25 e 29), e três pendências de malha fiscal geradas por inconsistências entre o declarado e o recolhido. O cenário elevava o risco de inscrição em dívida ativa e de constrição patrimonial.',
      )
      c1.set(
        'actions_taken',
        'Levantamento completo da situação fiscal, com análise de documentos contábeis, guias de recolhimento e declarações apresentadas. Regularização integral das declarações pendentes e solução das pendências de malha fiscal. Estruturação da renegociação e do parcelamento dos débitos junto aos governos federal e distrital, com prazo e valor de parcela compatibilizados ao fluxo de caixa da empresa, de modo que a regularização não comprometesse a operação.',
      )
      c1.set(
        'result',
        'Passivo de aproximadamente R$ 4.000.000 convertido em parcelas compatíveis com o caixa, afastando o risco de inscrição em dívida ativa e de constrição patrimonial. Eliminação das três pendências de malha fiscal e do risco de exclusão de ofício. Emissão de guias mensais regularizada, sem atrasos e sem multas.',
      )
      c1.set(
        'highlight_phrase',
        'Passivo de aproximadamente R$ 4.000.000 convertido em parcelas compatíveis com o caixa, afastando o risco de inscrição em dívida ativa.',
      )
      c1.set('highlight_number', 'R$ 4.000.000')
      c1.set('display_order', 1)
      c1.set('status', 'published')
      app.save(c1)

      // Caso 2
      const c2 = new Record(col)
      c2.set(
        'title',
        'CASO 2 — Planejamento tributário: por que o Simples não era o regime mais barato',
      )
      c2.set('slug', 'planejamento-tributario-clinicas')
      c2.set('badge_text', 'CASO 2')
      c2.set('badge_subtext', 'Planejamento tributário')
      c2.set(
        'segment',
        'clínicas médicas e de procedimentos na área da saúde. Caso exclusivo para esse setor.',
      )
      c2.set(
        'context',
        'Clínica de saúde que operava no Simples Nacional desde a fundação, por escolha nunca revisada. A ausência de análise comparativa impedia saber se o regime efetivamente correspondia à menor carga tributária possível para a atividade e o porte da empresa.',
      )
      c2.set(
        'challenge',
        'A premissa comum no mercado é que o Simples Nacional é sempre o regime mais econômico para pequenos negócios. Para clínicas, essa premissa falha por dois motivos: a segregação de receitas e o fator R alteram significativamente a alíquota efetiva (LC 123/2006, art. 18, §§ 5º-A e 5º-B), e o setor tem acesso a benefício fiscal específico que o Simples não aproveita.',
      )
      c2.set(
        'actions_taken',
        'Simulação comparativa completa entre Simples Nacional, Lucro Presumido e Lucro Real. O resultado apontou o Lucro Presumido como regime mais vantajoso.\n\nA chave do caso foi identificar que a atividade da clínica se enquadra na equiparação hospitalar, que autoriza presunção reduzida de 8% sobre a receita de hospitalização, cirurgia e procedimentos ambulatoriais, com fundamento no art. 2º da Lei 7.450/1982, na Lei 12.101/2009 e na IN RFB 1.115/2012. Essa combinação — Lucro Presumido mais equiparação hospitalar — é o que produz a economia, e não o Lucro Presumido isolado.\n\nEstruturação do plano de transição de regime, com segregação correta das receitas e apuração da alíquota efetiva conforme a legislação do Simples no período anterior à mudança.',
      )
      c2.set(
        'result',
        'Redução de aproximadamente 50% da carga tributária em relação ao que vinha sendo recolhido no Simples Nacional, com efeito direto na margem de lucro.\n\nE o que o caso comprova, além do número: o regime mais barato é o que resulta da simulação, não o mais popular. Para clínicas com receita e estrutura compatíveis, o Lucro Presumido com equiparação hospitalar pode superar o Simples com folga.',
      )
      c2.set(
        'highlight_phrase',
        'Redução de aproximadamente 50% da carga tributária em relação ao que vinha sendo recolhido no Simples Nacional, com efeito direto na margem de lucro.',
      )
      c2.set('highlight_number', '50%')
      c2.set('display_order', 2)
      c2.set('status', 'published')
      app.save(c2)
    }
  },
  (app) => {
    // Reversão
  },
)
