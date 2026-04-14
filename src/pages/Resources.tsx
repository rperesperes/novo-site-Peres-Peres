import { useState, useEffect } from 'react'
import { getResources } from '@/services/resources'
import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'
import { TaxSimulator } from '@/components/TaxSimulator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileDown, FileSpreadsheet } from 'lucide-react'

export default function Resources() {
  const [resources, setResources] = useState<any[]>([])

  const loadData = async () => {
    try {
      setResources(await getResources())
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('resources', () => {
    loadData()
  })

  return (
    <div className="py-24 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold mb-4 text-black">Recursos & Ferramentas</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Utilize nossas ferramentas interativas e materiais educativos para dar o primeiro passo
            na otimização da sua gestão fiscal.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Simulator Side */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-black">Simulador Tributário</h2>
              <p className="text-muted-foreground">
                Preencha os dados básicos para uma estimativa inicial, sem compromisso.
              </p>
            </div>
            <TaxSimulator />
          </div>

          {/* Downloads Side */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-black">Materiais Educativos</h2>
              <p className="text-muted-foreground">
                Faça o download gratuito de nossos e-books e planilhas de controle estruturados pela
                equipe técnica.
              </p>
            </div>

            <div className="grid gap-4">
              {resources.map((res) => {
                const fileUrl = res.file ? pb.files.getUrl(res, res.file) : res.link
                const Icon = res.category?.toLowerCase().includes('planilha')
                  ? FileSpreadsheet
                  : FileDown

                return (
                  <Card
                    key={res.id}
                    className="hover:border-yellow-500 transition-colors cursor-pointer group"
                  >
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <div className="p-3 bg-primary/20 text-black rounded-lg group-hover:bg-primary transition-colors">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-black">{res.title}</CardTitle>
                        <CardDescription>{res.description}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button
                        asChild
                        variant="default"
                        className="w-full mt-2 bg-black hover:bg-gray-800 text-white"
                      >
                        <a href={fileUrl || '#'} target="_blank" rel="noreferrer">
                          Baixar Material
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
              {resources.length === 0 && (
                <p className="text-sm text-gray-500">Nenhum recurso disponível no momento.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
