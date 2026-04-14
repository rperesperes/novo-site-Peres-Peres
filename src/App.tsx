import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import NotFound from './pages/NotFound'

// Pages
import Index from './pages/Index'
import About from './pages/About'
import Services from './pages/Services'
import Cases from './pages/Cases'
import Blog from './pages/Blog'
import Glossary from './pages/Glossary'
import Resources from './pages/Resources'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/servicos" element={<Services />} />
          <Route path="/casos" element={<Cases />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<Blog />} />{' '}
          {/* Simplification: reuse index view for detail or handle inside */}
          <Route path="/glossario" element={<Glossary />} />
          <Route path="/recursos" element={<Resources />} />
          <Route path="/contato" element={<Resources />} />{' '}
          {/* Routing Contato to Resources for Simulator demo */}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
