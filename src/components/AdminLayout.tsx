import { useState, useEffect } from 'react'
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import {
  Briefcase,
  Mail,
  Calculator,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import logoNova from '@/assets/logo-nova-560w.png'

export const ADMIN_SECTIONS = [
  { id: 'cases', to: '/admin', icon: Briefcase, label: 'Casos de Sucesso' },
  { id: 'jobs', to: '/admin/jobs', icon: Briefcase, label: 'Vagas' },
  { id: 'emails', to: '/admin/emails', icon: Mail, label: 'E-mails Recebidos' },
  {
    id: 'calculators',
    to: '/admin/calculators',
    icon: Calculator,
    label: 'Calculadoras e Índices',
  },
  { id: 'settings', to: '/admin/settings', icon: Settings, label: 'Configurações' },
]

export default function AdminLayout() {
  const { user, loading, signOut } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('peres_admin_sidebar_collapsed') === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('peres_admin_sidebar_collapsed', String(isCollapsed))
    } catch {
      // Ignora falhas de localStorage em navegação privada
    }
  }, [isCollapsed])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 border-2 border-[#FAB319] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-neutral-300">Carregando painel administrativo...</span>
        </div>
      </div>
    )
  }

  // Redireciona usuários não logados para /entrar
  if (!user) {
    return <Navigate to="/entrar" replace state={{ from: location }} />
  }

  // Restrição estrita de autorização
  const allowedEmail = 'rafael@peresperes.com.br'
  const userEmail = (user.email || '').trim().toLowerCase()
  if (userEmail !== allowedEmail) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans p-4">
        <div className="max-w-md w-full bg-neutral-950 border border-red-900/80 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
          <div className="inline-flex p-3 rounded-full bg-red-950/80 text-red-400 border border-red-800">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-white">Acesso Restrito</h1>
          <p className="text-xs text-neutral-300 leading-relaxed">
            A conta <strong>{user.email}</strong> não possui autorização para acessar este painel. O
            acesso é restrito à equipe do escritório (<strong>{allowedEmail}</strong>).
          </p>
          <div className="pt-2">
            <Button
              type="button"
              onClick={() => signOut()}
              className="w-full bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold h-11"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair da conta
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const displayName = user.name || user.email || 'Rafael Peres Peres'

  // Determina qual item do menu está ativo
  const isItemActive = (to: string) => {
    if (to === '/admin') {
      return (
        location.pathname === '/admin' ||
        location.pathname === '/admin/' ||
        location.pathname.startsWith('/admin/cases')
      )
    }
    return location.pathname.startsWith(to)
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row font-sans selection:bg-[#FAB319] selection:text-black">
      {/* Barra superior no celular (menu recolhido) */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-black border-b border-neutral-800 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="block">
            <img
              src="/favicon.svg"
              alt="PERES PERES Consultoria & Contabilidade"
              className="h-7 w-7 object-contain"
            />
          </Link>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#FAB319] block">
              Painel Administrativo
            </span>
            <span className="text-xs font-semibold text-white truncate max-w-[190px] block">
              PERES PERES Consultoria &amp; Contabilidade
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white hover:bg-neutral-900"
          aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Menu Lateral Fixo com suporte a recolher/expandir */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 bg-black border-r border-neutral-800 flex flex-col transition-all duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0',
          mobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0',
          isCollapsed ? 'md:w-20' : 'md:w-72',
        )}
      >
        {/* Cabeçalho do menu lateral com botão de recolher/expandir no desktop */}
        <div
          className={cn(
            'border-b border-neutral-800/80 flex items-center transition-all duration-200',
            isCollapsed ? 'p-3 flex-col justify-center gap-2' : 'p-5 justify-between',
          )}
        >
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-2 w-full">
              <Link
                to="/admin"
                className="w-10 h-10 rounded-lg bg-neutral-900/90 border border-[#FAB319]/40 flex items-center justify-center overflow-hidden p-1.5 hover:border-[#FAB319] transition-colors"
                title="PERES PERES Consultoria & Contabilidade"
              >
                <img
                  src="/favicon.svg"
                  alt="PERES PERES Consultoria & Contabilidade"
                  className="w-full h-full object-contain"
                />
              </Link>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(false)}
                className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors"
                title="Expandir menu lateral"
                aria-label="Expandir menu lateral"
              >
                <ChevronRight className="h-4 w-4 text-[#FAB319]" />
              </Button>
            </div>
          ) : (
            <>
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#FAB319] block mb-2">
                  Área Administrativa
                </span>
                <Link to="/admin" className="block group">
                  <img
                    src={logoNova}
                    alt="PERES PERES Consultoria & Contabilidade"
                    className="h-8 w-auto max-w-[190px] object-contain group-hover:opacity-90 transition-opacity"
                  />
                </Link>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(true)}
                className="hidden md:inline-flex h-8 w-8 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg shrink-0 transition-colors"
                title="Recolher menu lateral"
                aria-label="Recolher menu lateral"
              >
                <ChevronLeft className="h-4 w-4 text-[#FAB319]" />
              </Button>
            </>
          )}
        </div>

        {/* Links de navegação com as seções solicitadas */}
        <nav
          className={cn(
            'flex-1 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden',
            isCollapsed ? 'px-2' : 'px-3',
          )}
        >
          {ADMIN_SECTIONS.map((item) => {
            const Icon = item.icon
            const active = isItemActive(item.to)
            return (
              <Link
                key={item.id}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                title={item.label}
                className={cn(
                  'flex items-center rounded-lg transition-all text-sm font-medium group relative',
                  isCollapsed ? 'justify-center p-3' : 'gap-3 px-3.5 py-3',
                  active
                    ? 'bg-[#FAB319] text-black font-semibold shadow-md'
                    : 'text-neutral-300 hover:bg-neutral-900 hover:text-white',
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0 transition-transform group-hover:scale-105',
                    active ? 'text-black' : 'text-[#FAB319]',
                  )}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                {/* Tooltip flutuante sutil quando recolhido */}
                {isCollapsed && <span className="sr-only">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Rodapé do menu lateral: Usuário logado + Botão de Sair */}
        <div
          className={cn(
            'border-t border-neutral-800 bg-neutral-950/80 transition-all duration-200',
            isCollapsed ? 'p-2 space-y-2 flex flex-col items-center' : 'p-4 space-y-3',
          )}
        >
          {isCollapsed ? (
            <>
              <div
                className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#FAB319]"
                title={`${displayName} (${userEmail})`}
              >
                <User className="h-4 w-4" />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="w-10 h-10 border-neutral-800 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 hover:text-white"
                onClick={() => {
                  setMobileMenuOpen(false)
                  signOut()
                }}
                title="Sair do Painel"
                aria-label="Sair do Painel"
              >
                <LogOut className="h-4 w-4 text-[#FAB319]" />
              </Button>
            </>
          ) : (
            <>
              <div className="px-2 py-1 min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                  Conectado como
                </span>
                <p className="text-xs font-semibold text-white truncate" title={displayName}>
                  {displayName}
                </p>
                <p className="text-[11px] text-neutral-400 font-mono truncate" title={userEmail}>
                  {userEmail}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full justify-start border-neutral-800 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 hover:text-white text-xs h-10"
                onClick={() => {
                  setMobileMenuOpen(false)
                  signOut()
                }}
              >
                <LogOut className="h-4 w-4 mr-2 text-[#FAB319]" />
                Sair do Painel
              </Button>
            </>
          )}
        </div>
      </aside>

      {/* Backdrop no mobile quando o menu estiver aberto */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Conteúdo principal */}
      <main className="flex-1 overflow-x-hidden min-h-screen bg-neutral-950 p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
