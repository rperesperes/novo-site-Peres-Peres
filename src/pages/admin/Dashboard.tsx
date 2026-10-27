import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { FileText, Download, Briefcase } from 'lucide-react'

export default function AdminDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-serif font-bold text-black mb-2">
          Painel Institucional • {user?.name || 'Administrador'}
        </h1>
        <p className="text-neutral-500 text-sm">
          Gerenciamento de conteúdos e publicações da PERES PERES Consultoria e Contabilidade.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link to="/admin/posts" className="block group">
          <Card className="border border-neutral-200 hover:border-black transition-colors cursor-pointer h-full bg-white">
            <CardHeader className="pb-2">
              <FileText className="h-8 w-8 text-neutral-800 mb-2 group-hover:scale-105 transition-transform" />
              <CardTitle className="text-xl font-serif">Blog e Artigos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-500">
                Gerencie informativos técnicos, artigos e orientações normativas.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/resources" className="block group">
          <Card className="border border-neutral-200 hover:border-black transition-colors cursor-pointer h-full bg-white">
            <CardHeader className="pb-2">
              <Download className="h-8 w-8 text-neutral-800 mb-2 group-hover:scale-105 transition-transform" />
              <CardTitle className="text-xl font-serif">Recursos e Materiais</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-500">
                Disponibilize cartilhas, roteiros e modelos para download.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/cases" className="block group">
          <Card className="border border-neutral-200 hover:border-black transition-colors cursor-pointer h-full bg-white">
            <CardHeader className="pb-2">
              <Briefcase className="h-8 w-8 text-neutral-800 mb-2 group-hover:scale-105 transition-transform" />
              <CardTitle className="text-xl font-serif">Metodologia e Registros</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-500">
                Gerencie precedentes e registros com embasamento técnico auditável.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
