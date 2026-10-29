import { Card, CardContent } from '@/components/ui/card'
import { Clock } from 'lucide-react'

interface AdminPlaceholderSectionProps {
  title: string
  description?: string
}

export default function AdminPlaceholderSection({
  title,
  description,
}: AdminPlaceholderSectionProps) {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{title}</h1>
        {description && <p className="text-sm text-neutral-400 font-sans">{description}</p>}
      </header>

      <Card className="border border-neutral-800 bg-neutral-900/90 text-white rounded-xl shadow-xl">
        <CardContent className="py-16 px-6 text-center space-y-4 max-w-md mx-auto">
          <div className="mx-auto w-12 h-12 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-[#FAB319]">
            <Clock className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white">Módulo em preparação</h2>
            <p className="text-sm text-neutral-300 leading-relaxed font-sans">
              Esta seção será habilitada em uma próxima etapa do projeto.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
