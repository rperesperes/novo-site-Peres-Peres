import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import NotFound from './pages/NotFound'

// Pages
import Index from './pages/Index'
import { AuthProvider } from './hooks/use-auth'
import Login from './pages/admin/Login'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import AdminPosts from './pages/admin/Posts'
import AdminResources from './pages/admin/Resources'
import AdminCases from './pages/admin/Cases'
import About from './pages/About'
import Services from './pages/Services'
import Cases from './pages/Cases'
import CaseDetail from './pages/CaseDetail'
import Blog from './pages/Blog'
import Glossary from './pages/Glossary'
import Resources from './pages/Resources'
import Contact from './pages/Contact'
import CalculatorsHub from './pages/CalculatorsHub'
import CalculatorDetail from './pages/CalculatorDetail'
import FatorRCalculator from './pages/FatorRCalculator'
import SimplesNacionalOuLucroPresumidoCalculator from './pages/SimplesNacionalOuLucroPresumidoCalculator'

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/servicos" element={<Services />} />
            <Route path="/casos" element={<Cases />} />
            <Route path="/casos/:slug" element={<CaseDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<Blog />} />{' '}
            {/* Simplification: reuse index view for detail or handle inside */}
            <Route path="/glossario" element={<Glossary />} />
            <Route path="/recursos" element={<Resources />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/calculadoras" element={<CalculatorsHub />} />
            <Route path="/calculadoras/fator-r" element={<FatorRCalculator />} />
            <Route
              path="/calculadoras/simples-nacional-ou-lucro-presumido"
              element={<SimplesNacionalOuLucroPresumidoCalculator />}
            />
            <Route path="/calculadoras/:slug" element={<CalculatorDetail />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="resources" element={<AdminResources />} />
            <Route path="cases" element={<AdminCases />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AuthProvider>
)

export default App
