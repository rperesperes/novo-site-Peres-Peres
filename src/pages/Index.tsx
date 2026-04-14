import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ShieldCheck, Award, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { SERVICES, CASES } from '@/lib/data'
import logoIcon from '@/assets/logo-pp-google-workspace-13730.png'

export default function Index() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black mt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://img.usecurling.com/p/1920/1080?q=modern%20law%20office&color=black"
            alt="Escritório"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground text-sm font-semibold border border-primary/30">
              <img src={logoIcon} alt="PP" className="h-5 w-auto rounded-sm" />
              E-E-A-T Certified Authority
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Contabilidade Tributária em Brasília:
              <br />
              <span className="text-primary">Expertise e Segurança</span> para o seu Negócio.
            </h1>
            <p className="text-lg text-gray-300 max-w-xl">
              Liderada por Rafael Peres Peres Nunes Altoé, oferecemos soluções jurídicas e contábeis
              de alto nível em planejamento e recuperação tributária em todo o Brasil.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white text-base h-12 px-8"
                asChild
              >
                <Link to="/contato">Agendar Consultoria Gratuita</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-black border-white bg-white hover:bg-gray-100 text-base h-12 px-8"
                asChild
              >
                <Link to="/sobre">Conhecer a Equipe</Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-gray-300">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">CRC Ativo</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Briefcase className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">+10 Anos de Exp.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authority Profile Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5 relative">
              <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-2xl relative z-10 border-4 border-white">
                <img
                  src="https://img.usecurling.com/ppl/large?gender=male&seed=rafael"
                  alt="Rafael Peres Peres"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-primary rounded-lg z-0"></div>
            </div>
            <div className="md:col-span-7 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Liderança Técnica e Acadêmica</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Sob a responsabilidade técnica de <strong>Rafael Peres Peres Nunes Altoé</strong>{' '}
                (CRC 027704/O), nosso escritório combina rigor técnico e inovação. Pós-graduado em
                Direito Tributário (CERS), com atuação destacada em grupos de pesquisa acadêmica
                (UniCEUB, IDP) e participação em fóruns internacionais.
              </p>
              <ul className="grid sm:grid-cols-2 gap-4 mt-8">
                {[
                  'Membro CDESCMAT/DF',
                  'Jornadas de Finanças Públicas (BA)',
                  'Especialista em CARF',
                  'Articulista Tributário',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 font-medium text-black">
                    <CheckCircle2 className="h-5 w-5 text-secondary" /> {item}
                  </li>
                ))}
              </ul>
              <div className="pt-6">
                <Button
                  variant="link"
                  className="text-primary hover:text-primary/80 p-0 font-semibold text-lg group"
                  asChild
                >
                  <Link to="/sobre">
                    Ler biografia completa{' '}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Áreas de Atuação Especializada</h2>
            <p className="text-muted-foreground text-lg">
              Foco em resultados mensuráveis e segurança jurídica para o seu patrimônio corporativo
              e familiar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, index) => (
              <Card
                key={index}
                className="border-none shadow-md hover:shadow-xl transition-shadow duration-300 bg-white group"
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                    <ShieldCheck className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Cases Carousel */}
      <section className="py-20 bg-black text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Casos de Sucesso Reais
              </h2>
              <p className="text-gray-400 max-w-xl text-lg">
                Resultados comprovados (anonimizados por compliance) demonstrando nossa capacidade
                de gerar caixa via inteligência tributária.
              </p>
            </div>
            <Button
              variant="outline"
              className="hidden md:flex text-black bg-white hover:bg-gray-100 border-none"
              asChild
            >
              <Link to="/casos">Ver Todos os Casos</Link>
            </Button>
          </div>

          <Carousel className="w-full" opts={{ align: 'start' }}>
            <CarouselContent className="-ml-4">
              {CASES.map((kase) => (
                <CarouselItem key={kase.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="bg-white/5 border-white/10 text-white h-full flex flex-col">
                    <CardHeader>
                      <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                        {kase.sector}
                      </div>
                      <CardTitle className="text-xl text-white">{kase.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-between">
                      <p className="text-white/70 mb-6 line-clamp-3">{kase.description}</p>
                      <div className="bg-white/10 p-4 rounded-md">
                        <div className="text-sm text-white/60 mb-1">Redução de Carga</div>
                        <div className="text-3xl font-bold text-secondary">{kase.savings}</div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-2 mt-8 md:hidden">
              <CarouselPrevious className="relative inset-0 translate-x-0 translate-y-0 h-10 w-10 text-black" />
              <CarouselNext className="relative inset-0 translate-x-0 translate-y-0 h-10 w-10 text-black" />
            </div>
          </Carousel>
        </div>
      </section>
    </div>
  )
}
