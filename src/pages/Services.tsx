import { SERVICES } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calculator, RefreshCcw, Shield, Scale, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

// Map icons dynamically
const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Calculator':
      return <Calculator className="h-8 w-8 text-secondary" />
    case 'RefreshCcw':
      return <RefreshCcw className="h-8 w-8 text-secondary" />
    case 'Shield':
      return <Shield className="h-8 w-8 text-secondary" />
    case 'Scale':
      return <Scale className="h-8 w-8 text-secondary" />
    default:
      return <Calculator className="h-8 w-8 text-secondary" />
  }
}

export default function Services() {
  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Nossas Especialidades</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Atuação técnica aprofundada para garantir a conformidade e a eficiência financeira da
            sua empresa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {SERVICES.map((service, i) => (
            <Card
              key={i}
              className="border-none shadow-md hover:shadow-xl transition-all duration-300"
            >
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <div className="p-4 bg-secondary/10 rounded-xl">{getIcon(service.icon)}</div>
                <div>
                  <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                  <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
              </CardHeader>
              <CardContent className="pt-0 flex justify-end">
                <Button variant="ghost" className="text-primary hover:text-accent p-0" asChild>
                  <Link to="/contato">
                    Solicitar Análise <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-primary text-white p-8 md:p-12 rounded-2xl text-center">
          <h3 className="text-2xl font-bold mb-4">Precisa de uma solução não listada?</h3>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Nossa equipe está preparada para analisar cenários tributários complexos e específicos
            do seu setor de atuação.
          </p>
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-white" asChild>
            <Link to="/contato">Fale com um Especialista</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
