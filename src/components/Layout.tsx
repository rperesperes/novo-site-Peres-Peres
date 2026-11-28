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

  // Scroll to top on route change. O Layout NÃO define document.title nem
  // nenhuma outra etiqueta de head (description, og:*, twitter:*, canonical,
  // lang): cada página é a fonte única do próprio SEO, em sincronia com a
  // tabela SEO_BY_ROUTE do prerender. Rotas sem página de SEO própria (ex.:
  // NotFound) ficam com o título do index.html, e é isso mesmo.
  useEffect(() => {
    // Quando a URL tem hash, o salto para a âncora tem prioridade: a troca de
    // rota não volta ao topo antes do posicionamento no bloco.
    if (!location.hash) {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.hash])

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
