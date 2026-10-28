import { Navigate, Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { LayoutDashboard, FileText, Download, Briefcase, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function AdminLayout() {
  const { user, loading, signOut } = useAuth()
  const location = useLocation()

  if (loading)
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/posts', icon: FileText, label: 'Blog' },
    { to: '/admin/resources', icon: Download, label: 'Recursos' },
    { to: '/admin/cases', icon: Briefcase, label: 'Diretrizes Técnicas' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-64 bg-black text-white flex flex-col md:min-h-screen shadow-xl z-10">
        <div className="p-6">
          <h2 className="text-sm font-bold text-white mb-1 leading-snug">
            PERES PERES Consultoria e Contabilidade
          </h2>
          <p className="text-xs text-neutral-400">Painel Administrativo</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-md transition-colors font-medium text-sm',
                  isActive
                    ? 'bg-[#FAB319] text-black font-semibold'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white',
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 mt-auto border-t border-gray-800">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={signOut}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sair
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden bg-gray-50">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
