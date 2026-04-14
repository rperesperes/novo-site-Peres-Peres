import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { FileText, Download, Briefcase } from 'lucide-react'

export default function AdminDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Bem-vindo, {user?.name || 'Admin'}</h1>
        <p className="text-gray-500">
          Selecione uma área abaixo para gerenciar o conteúdo do site.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link to="/admin/posts" className="block group">
          <Card className="hover:border-yellow-400 transition-colors cursor-pointer h-full">
            <CardHeader className="pb-2">
              <FileText className="h-8 w-8 text-yellow-500 mb-2 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-xl">Blog</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Gerencie artigos, jurisprudências e notícias.</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/resources" className="block group">
          <Card className="hover:border-yellow-400 transition-colors cursor-pointer h-full">
            <CardHeader className="pb-2">
              <Download className="h-8 w-8 text-yellow-500 mb-2 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-xl">Recursos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Disponibilize e-books e planilhas para download.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/cases" className="block group">
          <Card className="hover:border-yellow-400 transition-colors cursor-pointer h-full">
            <CardHeader className="pb-2">
              <Briefcase className="h-8 w-8 text-yellow-500 mb-2 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-xl">Casos de Sucesso</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Adicione novos resultados e cases da empresa.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
