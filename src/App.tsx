import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import NotFound from './pages/NotFound'

// Pages
import Index from './pages/Index'
import { AuthProvider } from './hooks/use-auth'
import AdminLayout from './components/AdminLayout'
import AdminCases from './pages/admin/Cases'
import AdminJobs from './pages/admin/Jobs'
import AdminEmails from './pages/admin/Emails'
import AdminCalculators from './pages/admin/Calculators'
import AdminPlaceholderSection from './pages/admin/AdminPlaceholderSection'
import About from './pages/About'
import TrabalheConosco from './pages/TrabalheConosco'
import Services from './pages/Services'
import Cases from './pages/Cases'
import CaseDetail from './pages/CaseDetail'

import Resources from './pages/Resources'
import Contact from './pages/Contact'
import CalculatorsHub from './pages/CalculatorsHub'
import CalculatorDetail from './pages/CalculatorDetail'
import FatorRCalculator from './pages/FatorRCalculator'
import SimplesNacionalOuLucroPresumidoCalculator from './pages/SimplesNacionalOuLucroPresumidoCalculator'
import CustoDeFuncionarioCLTCalculator from './pages/CustoDeFuncionarioCLTCalculator'
import CertificadoDigital from './pages/CertificadoDigital'
import RegistroDeMarcas from './pages/RegistroDeMarcas'
import InteligenciaFinanceira from './pages/InteligenciaFinanceira'
import PJouCLTCalculator from './pages/PJouCLTCalculator'
import SimplesNacionalHibridoCalculator from './pages/SimplesNacionalHibridoCalculator'
import JurosDeMoraDeTributosCalculator from './pages/JurosDeMoraDeTributosCalculator'
import IRPFeRestituicaoCalculator from './pages/IRPFeRestituicaoCalculator'
import JurosDeFinanciamentoCalculator from './pages/JurosDeFinanciamentoCalculator'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Entrar from './pages/Entrar'
import ClinicasMedicasSegment from './pages/ClinicasMedicasSegment'
import StartupsTechSegment from './pages/StartupsTechSegment'
import HoldingsFamiliaresSegment from './pages/HoldingsFamiliaresSegment'
import EducacaoTreinamentosSegment from './pages/EducacaoTreinamentosSegment'

function CaseDetailRedirect() {
  const { slug } = useParams<{ slug: string }>()
  return <Navigate to={`/casos/${slug || ''}`} replace />
}

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
            <Route path="/trabalhe-conosco" element={<TrabalheConosco />} />
            <Route path="/servicos" element={<Services />} />
            <Route path="/servicos/certificado-digital" element={<CertificadoDigital />} />
            <Route path="/servicos/registro-de-marcas" element={<RegistroDeMarcas />} />
            <Route path="/servicos/inteligencia-financeira" element={<InteligenciaFinanceira />} />
            <Route path="/casos" element={<Cases />} />
            <Route path="/casos/:slug" element={<CaseDetail />} />
            <Route path="/casos-de-sucesso" element={<Navigate to="/casos" replace />} />
            <Route path="/casos-de-sucesso/:slug" element={<CaseDetailRedirect />} />
            <Route path="/cases" element={<Navigate to="/casos" replace />} />
            <Route path="/calculators" element={<Navigate to="/calculadoras" replace />} />
            <Route path="/recursos" element={<Resources />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/entrar" element={<Entrar />} />
            <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
            <Route
              path="/privacidade"
              element={<Navigate to="/politica-de-privacidade" replace />}
            />
            <Route
              path="/contabilidade-para-clinicas-medicas"
              element={<ClinicasMedicasSegment />}
            />
            <Route path="/contabilidade-para-startups-e-tech" element={<StartupsTechSegment />} />
            <Route
              path="/holdings-familiares-e-patrimoniais"
              element={<HoldingsFamiliaresSegment />}
            />
            <Route
              path="/contabilidade-para-educacao-e-treinamentos"
              element={<EducacaoTreinamentosSegment />}
            />
            <Route path="/calculadoras" element={<CalculatorsHub />} />
            <Route path="/calculadoras/fator-r" element={<FatorRCalculator />} />
            <Route
              path="/calculadoras/simples-nacional-ou-lucro-presumido"
              element={<SimplesNacionalOuLucroPresumidoCalculator />}
            />
            <Route
              path="/calculadoras/custo-de-funcionario-clt"
              element={<CustoDeFuncionarioCLTCalculator />}
            />
            <Route path="/calculadoras/pj-ou-clt" element={<PJouCLTCalculator />} />
            <Route
              path="/calculadoras/simples-nacional-hibrido"
              element={<SimplesNacionalHibridoCalculator />}
            />
            <Route
              path="/calculadoras/juros-de-mora-de-tributos"
              element={<JurosDeMoraDeTributosCalculator />}
            />
            <Route
              path="/calculadoras/irpf-e-restituicao"
              element={<IRPFeRestituicaoCalculator />}
            />
            <Route
              path="/calculadoras/juros-de-financiamento"
              element={<JurosDeFinanciamentoCalculator />}
            />
            <Route path="/calculadoras/:slug" element={<CalculatorDetail />} />
          </Route>
          <Route path="/login" element={<Navigate to="/entrar" replace />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminCases />} />
            <Route path="cases" element={<AdminCases />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="vagas" element={<AdminJobs />} />
            <Route path="emails" element={<AdminEmails />} />
            <Route path="calculators" element={<AdminCalculators />} />
            <Route
              path="settings"
              element={
                <AdminPlaceholderSection
                  title="Configurações"
                  description="Parâmetros institucionais, chaves de integração e dados do escritório"
                />
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AuthProvider>
)

export default App
