import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { WhatsAppButton } from './WhatsAppButton'

export default function Layout() {
  const location = useLocation()

  // Scroll to top and set document title on route change
  useEffect(() => {
    window.scrollTo(0, 0)

    const titles: Record<string, string> = {
      '/': 'Consultoria e Contabilidade Tributária em Brasília | PERES PERES Consultoria e Contabilidade',
      '/sobre': 'Sobre Nós | PERES PERES Consultoria e Contabilidade',
      '/servicos': 'Áreas de Atuação | PERES PERES Consultoria e Contabilidade',
      '/casos': 'Diretrizes e Metodologia | PERES PERES Consultoria e Contabilidade',
      '/blog': 'Blog Tributário | PERES PERES Consultoria e Contabilidade',
      '/recursos': 'Recursos e Materiais | PERES PERES Consultoria e Contabilidade',
      '/glossario': 'Glossário Tributário | PERES PERES Consultoria e Contabilidade',
      '/contato': 'Contato | PERES PERES Consultoria e Contabilidade',
      '/calculadoras': 'Calculadoras | PERES PERES Consultoria e Contabilidade',
    }

    document.title = titles[location.pathname] || 'PERES PERES Consultoria e Contabilidade'
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
