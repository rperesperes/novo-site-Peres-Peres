import { TaxSimulator } from '@/components/TaxSimulator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileDown, FileSpreadsheet } from 'lucide-react'

export default function Resources() {
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
              <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="p-3 bg-primary/10 text-primary rounded-lg group-hover:bg-primary/20 transition-colors">
                    <FileDown className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-black">
                      Guia Prático: Holding Familiar 2026
                    </CardTitle>
                    <CardDescription>E-book em PDF - 15 páginas</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="default"
                    className="w-full mt-2 bg-secondary hover:bg-secondary/90 text-white"
                  >
                    Baixar E-book
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="p-3 bg-primary/10 text-primary rounded-lg group-hover:bg-primary/20 transition-colors">
                    <FileSpreadsheet className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-black">
                      Planilha de Diagnóstico Simples Nacional
                    </CardTitle>
                    <CardDescription>Template Excel (.xlsx)</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="default"
                    className="w-full mt-2 bg-secondary hover:bg-secondary/90 text-white"
                  >
                    Baixar Planilha
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
