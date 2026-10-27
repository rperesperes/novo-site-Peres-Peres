import { SERVICES } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calculator, RefreshCcw, Shield, Scale, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

// Map icons dynamically
const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Calculator':
      return <Calculator className="h-8 w-8 text-black" />
    case 'RefreshCcw':
      return <RefreshCcw className="h-8 w-8 text-black" />
    case 'Shield':
      return <Shield className="h-8 w-8 text-black" />
    case 'Scale':
      return <Scale className="h-8 w-8 text-black" />
    default:
      return <Calculator className="h-8 w-8 text-black" />
  }
}

export default function Services() {
  return (
    <div className="py-24 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-16 text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-black">
            Áreas de Atuação Especializada
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Atuação técnica pautada nas normas contábeis brasileiras e na legislação vigente,
            assegurando higidez e governança fiscal contínua.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {SERVICES.map((service, i) => (
            <Card
              key={i}
              className="border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
            >
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <div className="p-3 bg-neutral-100 rounded-lg border border-neutral-200 shrink-0">
                  {getIcon(service.icon)}
                </div>
                <div>
                  <CardTitle className="text-xl font-serif mb-2 text-black">
                    {service.title}
                  </CardTitle>
                  <p className="text-neutral-600 text-sm leading-relaxed">{service.description}</p>
                </div>
              </CardHeader>
              <CardContent className="pt-0 flex justify-end">
                <Button
                  variant="link"
                  className="text-black font-semibold hover:text-neutral-700 p-0 underline decoration-[#FAB319] decoration-2 underline-offset-4 text-sm"
                  asChild
                >
                  <Link to="/contato">
                    Solicitar Análise Técnica <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-black text-white p-8 md:p-12 rounded-xl text-center border border-neutral-800">
          <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-white">
            Demanda técnica específica para seu segmento?
          </h3>
          <p className="text-neutral-400 mb-8 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Estruturamos pareceres e diagnósticos contábeis e tributários personalizados, com
            estrita observância ao sigilo e às normas legais aplicáveis.
          </p>
          {/* Ponto focal único da tela: botão primário #FAB319 */}
          <Button
            size="lg"
            className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold px-8 h-12 text-base"
            asChild
          >
            <Link to="/contato">Agendar Análise Preliminar</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
