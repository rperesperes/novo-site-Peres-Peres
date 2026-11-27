/**
 * Entry de pré-renderização estática (SSR) do site PERES PERES.
 *
 * NÃO é importado pelo app do navegador: é consumido apenas por
 * scripts/prerender.mjs, que executa este módulo dentro do Vite
 * (ssrLoadModule) para gerar o HTML estático de cada rota principal.
 *
 * Como o useSeo e os JSON-LDs das páginas rodam em useEffect (que não roda
 * no servidor), este módulo também expõe a tabela de SEO por rota, com os
 * MESMOS valores definidos em cada página, para o prerender injetar no
 * <head> do HTML gerado.
 */
import { Suspense } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { AppRoutes } from '@/AppRoutes'

export interface PrerenderedPage {
  /** HTML renderizado do corpo da rota (para dentro de <div id="root">). */
  html: string
  /** Valores que o useSeo da página define no navegador. */
  seo: { title: string; description: string; canonical: string; dateModified?: string }
  /** Etiquetas de compartilhamento social (og:*) da página. */
  share: { ogTitle: string; ogDescription: string; ogUrl: string }
  /** Caminhos dos JSON-LDs extras que a página registra via useEffect. */
  jsonLdIds: string[]
}

export const ROUTES = [
  '/',
  '/servicos',
  '/mei-completo',
  '/sobre',
  '/profissoes-regulamentadas/advogados',
  '/profissoes-regulamentadas/medicos',
  '/profissoes-regulamentadas/psicologos',
  '/profissoes-regulamentadas/engenheiros',
  '/profissoes-regulamentadas/arquitetos',
  '/contabilidade-para-agencias-de-publicidade',
  '/contabilidade-para-educacao-e-treinamentos',
  '/contabilidade-para-ecommerce',
  '/contabilidade-para-startups-e-tech',
  '/contabilidade-para-clinicas-medicas',
  '/contabilidade-para-agencias-de-viagem',
  '/holdings-familiares-e-patrimoniais',
  '/reforma-tributaria',
] as const

/**
 * Mesma tabela de SEO das páginas (useSeo é useEffect, invisível no SSR).
 * Mantenha em sincronia com o useSeo de cada página; o prerender falha o
 * build se os valores de canonical divergirem do que a página define.
 */
const SEO_BY_ROUTE: Record<
  string,
  {
    title: string
    description: string
    canonical: string
    ogTitle?: string
    ogDescription?: string
    /** Data da última revisão do conteúdo, ISO 8601 (sincronizada com o useSeo). */
    dateModified?: string
  }
> = {
  '/': {
    title: 'PERES PERES Consultoria & Contabilidade em Brasília',
    description:
      'Contabilidade consultiva e estratégica para empresas, de Brasília para todo o Brasil. Responsável Rafael Peres Peres Nunes Altoé (CRC 027704).',
    canonical: 'https://peresperes.com.br/',
  },
  '/servicos': {
    title: 'Serviços Contábeis e Tributários | PERES PERES Consultoria & Contabilidade',
    description:
      'Conheça os serviços da PERES PERES Consultoria & Contabilidade em Brasília: consultoria tributária, recuperação de créditos, consultoria trabalhista, societária e planos de acompanhamento mensal.',
    canonical: 'https://peresperes.com.br/servicos',
    ogTitle: 'Serviços de Contabilidade Consultiva',
    ogDescription:
      'Serviços de contabilidade consultiva em Brasília e em todo o Brasil, com consultoria tributária, recuperação de créditos, área trabalhista e societária.',
  },
  '/mei-completo': {
    title: 'MEI Completo | PERES PERES Consultoria & Contabilidade',
    description:
      'Abertura, obrigações em dia e dúvidas respondidas por quem entende. Apoio para crescer ou para sair do MEI, com contador responsável técnico por trás de cada entrega. PERES PERES Consultoria & Contabilidade.',
    canonical: 'https://peresperes.com.br/mei-completo',
  },
  '/sobre': {
    title: 'Sobre Nós e Equipe Técnica | PERES PERES Consultoria & Contabilidade',
    description:
      'Conheça a história e o corpo técnico da PERES PERES Consultoria & Contabilidade em Brasília, sob responsabilidade de Rafael Peres Peres Nunes Altoé (CRC 027704).',
    canonical: 'https://peresperes.com.br/sobre',
    ogTitle: 'Sobre a PERES PERES',
    ogDescription:
      'A história e o corpo técnico da PERES PERES Consultoria & Contabilidade em Brasília, sob responsabilidade de Rafael Peres Peres Nunes Altoé, CRC 027704.',
  },
  '/profissoes-regulamentadas/advogados': {
    title: 'Contabilidade para Advogados e Escritórios de Advocacia',
    description:
      'Contabilidade para advogados: honorários, retenções, ISS por município e sociedade de advogados, com as regras explicadas sem surpresas no caixa.',
    canonical: 'https://peresperes.com.br/profissoes-regulamentadas/advogados',
    ogTitle: 'Contabilidade para Advogados e Sociedades de Advocacia',
    ogDescription:
      'Contabilidade para advogados e sociedades de advocacia, com honorários, retenções, ISS e regras do regime aplicadas ao dia a dia do escritório.',
  },
  '/profissoes-regulamentadas/medicos': {
    title: 'Contabilidade para Médicos: Simples, Fator R e Pró-labore',
    description:
      'Contabilidade para médicos: escolha de regime, Fator R, pró-labore e distribuição de lucros, com as regras aplicadas ao dia a dia do consultório.',
    canonical: 'https://peresperes.com.br/profissoes-regulamentadas/medicos',
  },
  '/profissoes-regulamentadas/psicologos': {
    title: 'Contabilidade para Psicólogos: CNAE, Simples e CRP',
    description:
      'Contabilidade para psicólogos: CNAE correto, enquadramento no Simples Nacional e obrigações junto ao CRP, explicados sem juridiquês.',
    canonical: 'https://peresperes.com.br/profissoes-regulamentadas/psicologos',
    ogTitle: 'Contabilidade para Psicólogos',
    ogDescription:
      'Contabilidade para psicólogos que atendem como pessoa jurídica, com CNAE correto, enquadramento no Simples Nacional e obrigações junto ao CRP.',
  },
  '/profissoes-regulamentadas/engenheiros': {
    title: 'Contabilidade para Engenheiros: CNAE, Fator R e Retenções',
    description:
      'Contabilidade para engenheiros: CNAE, Fator R, retenções em contratos com construtoras e órgãos públicos, com as regras aplicadas à rotina.',
    canonical: 'https://peresperes.com.br/profissoes-regulamentadas/engenheiros',
    ogTitle: 'Contabilidade para Engenheiros e Empresas de Engenharia',
    ogDescription:
      'Contabilidade para engenheiros e empresas de engenharia, com Fator R no Simples, retenções de contratantes e receita por medição aplicadas à rotina.',
  },
  '/profissoes-regulamentadas/arquitetos': {
    title: 'Contabilidade para Arquitetos: CNAE, Fator R e Retenções',
    description:
      'Contabilidade para arquitetos: CNAE, Fator R, retenções em projetos e responsabilidade técnica, com as regras aplicadas à rotina do escritório.',
    canonical: 'https://peresperes.com.br/profissoes-regulamentadas/arquitetos',
    ogTitle: 'Contabilidade para Arquitetos e Escritórios de Arquitetura',
    ogDescription:
      'Contabilidade para arquitetos e escritórios de arquitetura, com Fator R no Simples, retenções de clientes e receita por projeto aplicadas à rotina.',
  },
  '/contabilidade-para-agencias-de-publicidade': {
    title: 'Contabilidade para Agências de Publicidade: CNAE e ISS',
    description:
      'Contabilidade para agências de publicidade: CNAE, ISS, retenções de agenciamento e repasses, com as regras aplicadas ao caixa da agência.',
    canonical: 'https://peresperes.com.br/contabilidade-para-agencias-de-publicidade',
    ogTitle: 'Contabilidade para Agências de Publicidade',
    ogDescription:
      'Contabilidade para agências de publicidade, com separação de mídia e comissão, retenções da cadeia criativa e margem por job organizadas no caixa.',
  },
  '/contabilidade-para-educacao-e-treinamentos': {
    title: 'Contabilidade para Escolas e Cursos: CNAE e Imunidade',
    description:
      'Contabilidade para escolas e cursos: CNAE, imunidade, sazonalidade de matrículas e material didático, com as regras aplicadas à instituição.',
    canonical: 'https://peresperes.com.br/contabilidade-para-educacao-e-treinamentos',
    ogTitle: 'Contabilidade para Escolas e Cursos',
    ogDescription:
      'Contabilidade para escolas e cursos, com enquadramento, imunidade, sazonalidade de matrículas e folha docente tratados em linguagem clara.',
  },
  '/contabilidade-para-ecommerce': {
    title: 'Contabilidade para E-commerce: Regime, ICMS e Sublimite',
    description:
      'Contabilidade para e-commerce: escolha de regime, ICMS interestadual, ST, DIFAL e sublimite, com as regras aplicadas à operação real da loja.',
    canonical: 'https://peresperes.com.br/contabilidade-para-ecommerce',
    ogTitle: 'Contabilidade para E-commerce',
    ogDescription:
      'Contabilidade para e-commerce e lojas virtuais, com ICMS interestadual, DIFAL, marketplaces, estoque e precificação tratados sem cobranças indevidas.',
  },
  '/contabilidade-para-startups-e-tech': {
    title: 'Contabilidade para Startups e Tech: CNAE, SaaS e Vesting',
    description:
      'Contabilidade para startups e tech: CNAE, receita recorrente de SaaS, vesting de sócios e incentivos, com as regras aplicadas ao estágio da empresa.',
    canonical: 'https://peresperes.com.br/contabilidade-para-startups-e-tech',
    ogTitle: 'Contabilidade para Startups e Empresas de Tecnologia',
    ogDescription:
      'Contabilidade para startups e empresas de tecnologia, com enquadramento, SaaS, vesting de sócios e números prontos para o investidor.',
  },
  '/contabilidade-para-clinicas-medicas': {
    title: 'Contabilidade para Clínicas Médicas: Fator R e ISS',
    description:
      'Contabilidade para clínicas médicas: enquadramento, Fator R, ISS, convênios e repasses, com as regras aplicadas à operação da clínica.',
    canonical: 'https://peresperes.com.br/contabilidade-para-clinicas-medicas',
    ogTitle: 'Contabilidade para Clínicas Médicas',
    ogDescription:
      'Contabilidade para clínicas médicas, com Fator R no Simples, equiparação hospitalar, créditos sobre insumos e folha de profissionais em dia.',
  },
  '/contabilidade-para-agencias-de-viagem': {
    title: 'Contabilidade para Agências de Viagem: CNAE e Câmbio',
    description:
      'Contabilidade para agências de viagem: comissão x repasse, câmbio, pacotes antecipados e cancelamentos, com regras de ISS e de retenção explicadas.',
    canonical: 'https://peresperes.com.br/contabilidade-para-agencias-de-viagem',
    ogTitle: 'Contabilidade para Agências de Viagem',
    ogDescription:
      'Contabilidade para agências de viagem, com separação entre comissão e repasse, câmbio, pacotes antecipados e cancelamentos tratados com regras claras.',
  },
  '/reforma-tributaria': {
    title: 'Reforma Tributária: o que muda para a sua empresa até 2033',
    description:
      'Cronograma da Reforma Tributária, escolha do Simples para IBS e CBS, split payment e o que fazer em 2026, explicados pela PERES PERES Consultoria & Contabilidade.',
    canonical: 'https://peresperes.com.br/reforma-tributaria',
    ogTitle: 'Reforma Tributária: o que muda para a sua empresa até 2033',
    ogDescription:
      'Cronograma da transição, escolha do Simples para IBS e CBS e os passos de 2026 que definem crédito, preço e caixa da sua empresa nos próximos anos.',
    dateModified: '2026-11-27',
  },
  '/holdings-familiares-e-patrimoniais': {
    title: 'Holding Familiar e Patrimonial: Sucessão, ITCMD e Regime',
    description:
      'Contabilidade para holdings familiares e patrimoniais: desenho da estrutura, ITCMD, sucessão e regime, com as regras aplicadas ao patrimônio da família.',
    canonical: 'https://peresperes.com.br/holdings-familiares-e-patrimoniais',
    ogTitle: 'Estruturação de Holdings Familiares e Planejamento Patrimonial',
    ogDescription:
      'Estruturação de holdings familiares com desenho societário, sucessão e impacto fiscal avaliados juntos, para planejar família e patrimônio sem improviso.',
  },
}

/** JSON-LDs extras que cada página registra via useEffect (id do script). */
const JSONLD_IDS_BY_ROUTE: Record<string, string[]> = {
  '/profissoes-regulamentadas/advogados': ['faq-jsonld-advogados'],
  '/profissoes-regulamentadas/medicos': ['faq-jsonld-medicos'],
  '/profissoes-regulamentadas/psicologos': ['faq-jsonld-psicologos'],
  '/profissoes-regulamentadas/engenheiros': ['faq-jsonld-engenheiros'],
  '/profissoes-regulamentadas/arquitetos': ['faq-jsonld-arquitetos'],
  '/contabilidade-para-agencias-de-publicidade': ['faq-jsonld-publicidade-comunicacao'],
  '/contabilidade-para-educacao-e-treinamentos': ['faq-jsonld-educacao-treinamentos'],
  '/contabilidade-para-ecommerce': ['faq-jsonld-ecommerce'],
  '/contabilidade-para-startups-e-tech': ['faq-jsonld-startups-tech'],
  '/contabilidade-para-clinicas-medicas': ['faq-jsonld-clinicas-medicas'],
  '/contabilidade-para-agencias-de-viagem': ['faq-jsonld-agencias-viagem'],
  '/holdings-familiares-e-patrimoniais': ['faq-jsonld-holdings-familiares'],
  '/reforma-tributaria': ['faq-jsonld-reforma-tributaria'],
}

/**
 * Renderiza uma rota em string HTML (SSR) e devolve corpo + SEO da rota.
 * Executado dentro do Vite via ssrLoadModule, uma vez por rota.
 */
export function renderRoute(path: string): PrerenderedPage {
  const seo = SEO_BY_ROUTE[path]
  if (!seo) {
    throw new Error(`prerender: rota sem SEO mapeado: ${path}`)
  }

  let html = ''
  try {
    html = renderToString(
      <Suspense fallback={null}>
        <StaticRouter location={path}>
          <AppRoutes />
        </StaticRouter>
      </Suspense>,
    )
  } catch (err) {
    // Sem corpo, o prerender falha: um HTML só de head seria pior que o atual.
    throw new Error(`prerender: falha ao renderizar ${path}: ${(err as Error)?.message}`)
  }

  if (!html || html.replace(/<[^>]*>/g, '').trim().length < 200) {
    throw new Error(
      `prerender: HTML de ${path} veio sem conteúdo textual real (verifique se o App montou a rota)`,
    )
  }

  return {
    html,
    seo,
    share: {
      ogTitle: seo.ogTitle || seo.title,
      ogDescription: seo.ogDescription || seo.description,
      ogUrl: seo.canonical,
    },
    jsonLdIds: JSONLD_IDS_BY_ROUTE[path] || [],
  }
}
