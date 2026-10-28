import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { WhatsAppButton } from './WhatsAppButton'
import { CALCULATORS } from '@/lib/calculatorsData'

export default function Layout() {
  const location = useLocation()

  // Scroll to top and set document title on route change
  useEffect(() => {
    window.scrollTo(0, 0)

    const titles: Record<string, string> = {
      '/': 'Consultoria e Contabilidade Tributária em Brasília | PERES PERES Consultoria e Contabilidade',
      '/sobre': 'Sobre Nós | PERES PERES Consultoria e Contabilidade',
      '/servicos': 'Serviços e Planos Contábeis | PERES PERES Consultoria e Contabilidade',
      '/casos': 'Casos Reais | PERES PERES Consultoria e Contabilidade',
      '/recursos': 'Recursos e Materiais | PERES PERES Consultoria e Contabilidade',
      '/glossario': 'Glossário Tributário | PERES PERES Consultoria e Contabilidade',
      '/contato': 'Fale com o Escritório | PERES PERES Consultoria e Contabilidade',
      '/calculadoras':
        'Calculadoras Tributárias e Trabalhistas Gratuitas | PERES PERES Consultoria e Contabilidade',
    }

    if (location.pathname.startsWith('/casos/')) {
      // Título da aba seguindo o padrão "Nome da página | PERES PERES Consultoria e Contabilidade"
      document.title = 'Caso Real | PERES PERES Consultoria e Contabilidade'
    } else if (location.pathname === '/calculadoras') {
      document.title = titles['/calculadoras']
    } else if (location.pathname.startsWith('/calculadoras/')) {
      const slug = location.pathname.replace('/calculadoras/', '').trim()
      const foundCalc = CALCULATORS.find((c) => c.slug === slug)
      if (foundCalc) {
        // Se for uma das calculadoras funcionais, seus próprios componentes definem seu title otimizado
        if (slug === 'fator-r') {
          document.title = 'Calculadora fator r: Anexo III ou V | PERES PERES'
        } else if (slug === 'simples-nacional-ou-lucro-presumido') {
          document.title = 'Simples ou Lucro Presumido: qual paga menos | PERES'
        } else if (slug === 'simples-nacional-hibrido') {
          document.title = 'calculadora simples nacional hibrido: icms e iss | PERES'
        } else if (slug === 'custo-de-funcionario-clt') {
          document.title = 'calculadora custo funcionário clt: encargos | PERES'
        } else if (slug === 'pj-ou-clt') {
          document.title = 'calculadora pj ou clt: comparativo | PERES PERES'
        } else if (slug === 'juros-de-mora-de-tributos') {
          document.title = 'calculadora juros de mora selic: tributos | PERES'
        } else if (slug === 'irpf-e-restituicao') {
          document.title = 'calculadora irpf e restituição: 2026 | PERES PERES'
        } else if (slug === 'juros-de-financiamento') {
          document.title = 'calculadora juros financiamento: price e sac | PERES'
        } else {
          document.title = `${foundCalc.name}, em desenvolvimento | PERES PERES Consultoria e Contabilidade`
        }
      } else {
        document.title = 'Calculadora | PERES PERES Consultoria e Contabilidade'
      }
    } else {
      document.title = titles[location.pathname] || 'PERES PERES Consultoria e Contabilidade'
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
