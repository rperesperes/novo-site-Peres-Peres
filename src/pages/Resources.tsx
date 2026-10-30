import { useState, useEffect } from 'react'
import { getResources } from '@/services/resources'
import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileDown, FileSpreadsheet, Calculator, ArrowRight, Clock } from 'lucide-react'

import { useSeo } from '@/hooks/use-seo'

export default function Resources() {
  useSeo({
    title: 'Recursos e Materiais Gratuitos | PERES PERES Consultoria & Contabilidade',
    description:
      'Baixe guias, modelos e materiais técnicos sobre tributação, gestão contábil e obrigações fiscais preparados pela PERES PERES Consultoria & Contabilidade.',
    canonical: 'https://peresperes.com.br/recursos',
  })

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
        <div className="mb-16 text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            Recursos e Materiais Técnicos
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Publicações institucionais, roteiros de orientação e materiais estruturados pela equipe
            técnica da PERES PERES Consultoria e Contabilidade.
          </p>
        </div>

        <div className="space-y-16">
          {/* Bloco curto de Calculadoras */}
          <div className="border border-neutral-200 bg-neutral-50/60 rounded-xl p-8 md:p-10 shadow-sm">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded bg-neutral-900 text-white">
                  <Calculator className="h-5 w-5" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-black">Calculadoras</h2>
              </div>
              <p className="text-neutral-700 text-base md:text-lg leading-relaxed mb-6">
                As ferramentas interativas e calculadoras técnicas do escritório estão
                disponibilizadas em endereço próprio para parametrização contábil e fiscal.
              </p>
              <div>
                <Button
                  asChild
                  className="bg-black hover:bg-neutral-800 text-white font-medium px-6 py-2.5 h-auto inline-flex items-center gap-2"
                >
                  <Link to="/calculadoras">
                    Acessar Calculadoras <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Seção de materiais para download mantida abaixo */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-black">
                Materiais Educativos e Manuais
              </h2>
              <p className="text-neutral-600 text-sm md:text-base">
                Download de documentos orientativos e modelos elaborados pela nossa equipe técnica.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {resources.map((res) => {
                const fileUrl = res.file ? pb.files.getUrl(res, res.file) : res.link
                const Icon = res.category?.toLowerCase().includes('planilha')
                  ? FileSpreadsheet
                  : FileDown

                return (
                  <Card
                    key={res.id}
                    className="border border-neutral-200 hover:border-neutral-400 transition-colors bg-white shadow-sm flex flex-col justify-between"
                  >
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <div className="p-3 bg-neutral-100 text-black rounded-lg border border-neutral-200 shrink-0">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-black">{res.title}</CardTitle>
                        <CardDescription className="text-xs text-neutral-500">
                          {res.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                        <Badge
                          variant="secondary"
                          className="bg-neutral-100 text-neutral-600 border border-neutral-200 font-normal px-2.5 py-1 text-xs flex items-center gap-1.5"
                        >
                          <Clock className="h-3 w-3 text-neutral-400" />
                          Em breve
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              {resources.length === 0 && (
                <div className="col-span-full p-8 border border-dashed border-neutral-300 rounded-lg text-center text-neutral-500 text-sm">
                  Nenhum material adicional disponível para download no momento.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
