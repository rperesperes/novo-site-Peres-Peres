import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { WhatsAppButton } from './WhatsAppButton'
import { useHashScroll } from '@/hooks/use-hash-scroll'

export default function Layout() {
  const location = useLocation()

  // Salto para a âncora da URL: funciona tanto na navegação inicial (link
  // aberto em nova aba com hash) quanto na troca de rota dentro do app.
  useHashScroll()

  // Scroll to top on route change. O <title> das rotas com SEO próprio é
  // definido pela própria página (useSeo/document.title no componente da
  // página), em sincronia com a tabela SEO_BY_ROUTE do prerender: este
  // efeito roda DEPOIS do efeito da página e, por isso, NÃO pode
  // sobrescrever esses títulos (era o que deixava /servicos e
  // /reforma-tributaria com título genérico no HTML final, depois do JS).
  useEffect(() => {
    // Quando a URL tem hash, o salto para a âncora tem prioridade: a troca de
    // rota não volta ao topo antes do posicionamento no bloco.
    if (!location.hash) {
      window.scrollTo(0, 0)
    }

    // Rotas cujo título a própria página define (useSeo ou document.title no
    // componente): o Layout não interfere.
    const PAGE_MANAGED_TITLE_PATHS = new Set([
      '/',
      '/sobre',
      '/servicos',
      '/servicos/certificado-digital',
      '/servicos/registro-de-marcas',
      '/servicos/inteligencia-financeira',
      '/mei-completo',
      '/perdao-divida-mei',
      '/contato',
      '/entrar',
      '/calculadoras',
      '/contabilidade-para-clinicas-medicas',
      '/contabilidade-para-startups-e-tech',
      '/holdings-familiares-e-patrimoniais',
      '/contabilidade-para-educacao-e-treinamentos',
      '/contabilidade-para-agencias-de-publicidade',
      '/contabilidade-para-agencias-de-viagem',
      '/contabilidade-para-ecommerce',
      '/reforma-tributaria',
      '/profissoes-regulamentadas/medicos',
      '/profissoes-regulamentadas/advogados',
      '/profissoes-regulamentadas/psicologos',
      '/profissoes-regulamentadas/engenheiros',
      '/profissoes-regulamentadas/arquitetos',
    ])
    const layoutTitles: Record<string, string> = {
      '/casos': 'Casos Reais | PERES PERES Consultoria & Contabilidade',
      '/recursos': 'Recursos e Materiais | PERES PERES Consultoria & Contabilidade',
      '/politica-de-privacidade':
        'Política de Privacidade | PERES PERES Consultoria & Contabilidade',
    }

    if (layoutTitles[location.pathname]) {
      document.title = layoutTitles[location.pathname]
    } else if (
      !PAGE_MANAGED_TITLE_PATHS.has(location.pathname) &&
      !location.pathname.startsWith('/casos/') // CaseDetail define o próprio
    ) {
      // Página sem título próprio (ex.: NotFound e rotas desconhecidas).
      document.title = 'PERES PERES Consultoria & Contabilidade'
    }
  }, [location.pathname])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-20">
        {' '}
        {/* pt-20 to account for fixed header */}
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
