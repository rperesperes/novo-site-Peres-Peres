import { useState, useEffect } from 'react'
import { getResources } from '@/services/resources'
import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileDown, FileSpreadsheet, Calculator, Clock, ArrowRight } from 'lucide-react'

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
        <div className="mb-16 text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-black">
            Recursos e Materiais Técnicos
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Publicações institucionais, roteiros de orientação e materiais estruturados pela equipe
            técnica da PERES PERES Consultoria e Contabilidade.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Chamada para futura área de calculadoras em endereço próprio */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold mb-2 text-black">
                Calculadoras e Ferramentas Práticas
              </h2>
              <p className="text-neutral-600 text-sm md:text-base">
                Ferramentas de cálculo fiscal com parâmetros oficiais e metodologia transparente.
              </p>
            </div>

            <Card className="border border-neutral-300 bg-neutral-50/60 shadow-sm overflow-hidden">
              <CardHeader className="bg-black text-white p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
                    <Calculator className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="font-serif text-xl text-white">
                      Área de Calculadoras Fiscais
                    </CardTitle>
                    <CardDescription className="text-neutral-400 text-xs">
                      Em desenvolvimento para ambiente próprio
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="flex items-start gap-3 p-4 rounded border border-neutral-200 bg-white">
                  <Clock className="h-5 w-5 text-neutral-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-neutral-600 space-y-1 leading-relaxed">
                    <span className="font-semibold text-black block">
                      Disponibilização em endereço próprio
                    </span>
                    <p>
                      Em respeito ao nosso manual de comunicação e diretrizes de compliance, as
                      calculadoras específicas (como apuração de Fator R e parametrizações
                      operacionais) estão sendo desenvolvidas em ambiente próprio, com fórmulas e
                      bases legais auditáveis, sem simulações genéricas de redução.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                    Módulos previstos:
                  </p>
                  <ul className="text-sm text-neutral-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
                      Calculadora de Fator R (Anexo III vs. Anexo V - Simples Nacional)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
                      Estimativa de retenções tributárias na fonte (IRRF, CSRF, INSS)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
                      Roteiro comparativo de regimes tributários aplicáveis
                    </li>
                  </ul>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full border-neutral-400 text-black hover:bg-neutral-100 font-medium"
                    disabled
                  >
                    Acesso disponível em breve no endereço oficial
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Downloads Side */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold mb-2 text-black">
                Materiais Educativos e Manuais
              </h2>
              <p className="text-neutral-600 text-sm md:text-base">
                Download de documentos orientativos e modelos elaborados pela nossa equipe técnica.
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
                    className="border border-neutral-200 hover:border-neutral-400 transition-colors bg-white shadow-sm"
                  >
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <div className="p-3 bg-neutral-100 text-black rounded-lg border border-neutral-200">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-serif text-black">{res.title}</CardTitle>
                        <CardDescription className="text-xs text-neutral-500">
                          {res.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button
                        asChild
                        variant="default"
                        className="w-full mt-2 bg-black hover:bg-neutral-800 text-white font-medium"
                      >
                        <a href={fileUrl || '#'} target="_blank" rel="noreferrer">
                          Baixar Documento <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
              {resources.length === 0 && (
                <div className="p-8 border border-dashed border-neutral-300 rounded-lg text-center text-neutral-500 text-sm">
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
