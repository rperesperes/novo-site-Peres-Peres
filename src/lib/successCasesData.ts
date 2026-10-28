export interface SuccessCaseSection {
  title: string
  content: string | string[]
}

export interface HighlightBenefit {
  label: string
  value: string
  description?: string
}

export interface SuccessCase {
  id: string
  caseNumber: number
  slug: string
  badgeText: string
  badgeSubtext: string
  title: string
  segment: string
  summary: string
  highlightBenefits: HighlightBenefit[]
  context: string
  challenge: string
  actionsTaken: string[]
  result: {
    highlightNumber?: string
    highlightPrefix?: string
    highlightSuffix?: string
    paragraphs: string[]
  }
}

export const SUCCESS_CASES: SuccessCase[] = [
  {
    id: 'caso-1',
    caseNumber: 1,
    slug: 'parcelamento-debitos-tributarios',
    badgeText: 'CASO 1',
    badgeSubtext: 'Negociação e parcelamento de débitos tributários',
    title: 'CASO 1 — Negociação e parcelamento de débitos tributários',
    segment:
      'clínica de estética e procedimentos estéticos, em operação desde 2008, com 15 colaboradores e prestadores — caso aplicável a qualquer segmento com passivo tributário acumulado.',
    summary:
      'Estruturação de renegociação fiscal e parcelamento de passivo tributário perante a União e o DF, compatibilizando prazos e parcelas ao fluxo de caixa sem comprometer as operações.',
    highlightBenefits: [
      {
        label: 'Passivo Convertido',
        value: 'R$ 4.000.000',
        description: 'em parcelas compatíveis com o caixa',
      },
      {
        label: 'Malhas Fiscais',
        value: '3 Pendências',
        description: 'eliminadas integralmente',
      },
      {
        label: 'Segurança da Empresa',
        value: 'Risco Afastado',
        description: 'sem dívida ativa ou exclusão de ofício',
      },
    ],
    context:
      'Empresa em operação há mais de 15 anos, no Simples Nacional desde a fundação, sem revisão periódica de enquadramento e sem acompanhamento financeiro, tributário e de precificação. Operava sem análise comparativa de alternativas e recolhia tributos por alíquota efetiva superior à necessária ao seu porte e à sua atividade.',
    challenge:
      'A empresa acumulou passivo tributário perante a União e o Distrito Federal, sem qualquer renegociação ou parcelamento em curso. Somavam-se a isso declarações atrasadas, com risco de exclusão de ofício do Simples Nacional (LC 123/2006, arts. 25 e 29), e três pendências de malha fiscal geradas por inconsistências entre o declarado e o recolhido. O cenário elevava o risco de inscrição em dívida ativa e de constrição patrimonial.',
    actionsTaken: [
      'Levantamento completo da situação fiscal, com análise de documentos contábeis, guias de recolhimento e declarações apresentadas. Regularização integral das declarações pendentes e solução das pendências de malha fiscal. Estruturação da renegociação e do parcelamento dos débitos junto aos governos federal e distrital, com prazo e valor de parcela compatibilizados ao fluxo de caixa da empresa, de modo que a regularização não comprometesse a operação.',
    ],
    result: {
      highlightNumber: 'R$ 4.000.000',
      highlightPrefix: 'Passivo de aproximadamente',
      highlightSuffix:
        'convertido em parcelas compatíveis com o caixa, afastando o risco de inscrição em dívida ativa e de constrição patrimonial. Eliminação das três pendências de malha fiscal e do risco de exclusão de ofício. Emissão de guias mensais regularizada, sem atrasos e sem multas.',
      paragraphs: [
        'Passivo de aproximadamente R$ 4.000.000 convertido em parcelas compatíveis com o caixa, afastando o risco de inscrição em dívida ativa e de constrição patrimonial. Eliminação das três pendências de malha fiscal e do risco de exclusão de ofício. Emissão de guias mensais regularizada, sem atrasos e sem multas.',
      ],
    },
  },
  {
    id: 'caso-2',
    caseNumber: 2,
    slug: 'planejamento-tributario-clinicas',
    badgeText: 'CASO 2',
    badgeSubtext: 'Planejamento tributário',
    title: 'CASO 2 — Planejamento tributário: por que o Simples não era o regime mais barato',
    segment:
      'clínicas médicas e de procedimentos na área da saúde. Caso exclusivo para esse setor.',
    summary:
      'Simulação comparativa detalhada comprovando que o Lucro Presumido combinado à equiparação hospitalar superou o Simples Nacional, reduzindo expressivamente os tributos devidos.',
    highlightBenefits: [
      {
        label: 'Carga Tributária',
        value: '~50% de redução',
        description: 'em relação ao recolhido no Simples Nacional',
      },
      {
        label: 'Equiparação Hospitalar',
        value: 'Base em 8%',
        description: 'presunção reduzida (Leis 7.450/82 e 12.101/09)',
      },
      {
        label: 'Margem Operacional',
        value: 'Ganho Direto',
        description: 'efeito imediato no lucro líquido do negócio',
      },
    ],
    context:
      'Clínica de saúde que operava no Simples Nacional desde a fundação, por escolha nunca revisada. A ausência de análise comparativa impedia saber se o regime efetivamente correspondia à menor carga tributária possível para a atividade e o porte da empresa.',
    challenge:
      'A premissa comum no mercado é que o Simples Nacional é sempre o regime mais econômico para pequenos negócios. Para clínicas, essa premissa falha por dois motivos: a segregação de receitas e o fator R alteram significativamente a alíquota efetiva (LC 123/2006, art. 18, §§ 5º-A e 5º-B), e o setor tem acesso a benefício fiscal específico que o Simples não aproveita.',
    actionsTaken: [
      'Simulação comparativa completa entre Simples Nacional, Lucro Presumido e Lucro Real. O resultado apontou o Lucro Presumido como regime mais vantajoso.',
      'A chave do caso foi identificar que a atividade da clínica se enquadra na equiparação hospitalar, que autoriza presunção reduzida de 8% sobre a receita de hospitalização, cirurgia e procedimentos ambulatoriais, com fundamento no art. 2º da Lei 7.450/1982, na Lei 12.101/2009 e na IN RFB 1.115/2012. Essa combinação — Lucro Presumido mais equiparação hospitalar — é o que produz a economia, e não o Lucro Presumido isolado.',
      'Estruturação do plano de transição de regime, com segregação correta das receitas e apuração da alíquota efetiva conforme a legislação do Simples no período anterior à mudança.',
    ],
    result: {
      highlightNumber: '50%',
      highlightPrefix: 'Redução de aproximadamente',
      highlightSuffix:
        'da carga tributária em relação ao que vinha sendo recolhido no Simples Nacional, com efeito direto na margem de lucro.',
      paragraphs: [
        'Redução de aproximadamente 50% da carga tributária em relação ao que vinha sendo recolhido no Simples Nacional, com efeito direto na margem de lucro.',
        'E o que o caso comprova, além do número: o regime mais barato é o que resulta da simulação, não o mais popular. Para clínicas com receita e estrutura compatíveis, o Lucro Presumido com equiparação hospitalar pode superar o Simples com folga.',
      ],
    },
  },
]
