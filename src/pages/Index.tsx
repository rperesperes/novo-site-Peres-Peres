import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ShieldCheck, Award, BookOpen, Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { SERVICES } from '@/lib/data'

export default function Index() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section - Arquitetura monocromática elegante com ponto focal único no botão */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-black text-white mt-20 border-b border-neutral-800">
        <div className="container mx-auto px-4 py-20 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8 animate-fade-in-up">
            <div className="inline-block border border-neutral-700 px-3 py-1 rounded text-xs tracking-wider uppercase text-neutral-300">
              PERES PERES Consultoria e Contabilidade
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
              Consultoria e Contabilidade Tributária em Brasília:{' '}
              <span className="underline decoration-[#FAB319] decoration-4 underline-offset-8">
                Rigor Técnico
              </span>{' '}
              e Segurança Jurídica.
            </h1>

            <p className="text-lg text-neutral-300 max-w-xl leading-relaxed">
              Sob a responsabilidade de Rafael Peres Peres Nunes Altoé, atuamos na estruturação,
              governança fiscal e contabilidade consultiva em conformidade com o ordenamento
              vigente.
            </p>

            {/* Ponto focal único da tela: Botão com #FAB319 */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                size="lg"
                className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-base h-12 px-8 border-none"
                asChild
              >
                <Link to="/contato">Agendar Consultoria</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-neutral-700 bg-transparent hover:bg-neutral-900 text-base h-12 px-8"
                asChild
              >
                <Link to="/casos">Conhecer a Metodologia</Link>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-6 border-t border-neutral-800">
              <div className="flex items-center gap-2 text-neutral-300">
                <Award className="h-5 w-5 text-neutral-400" />
                <span className="text-sm font-medium">CRC 027704/O Ativo</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <Scale className="h-5 w-5 text-neutral-400" />
                <span className="text-sm font-medium">Atuação Nacional</span>
              </div>
            </div>
          </div>

          {/* Placeholder neutro no Hero sem fotos genéricas de banco */}
          <div className="lg:col-span-5">
            <div className="aspect-[4/3] rounded-lg border border-neutral-800 bg-neutral-950 p-8 flex flex-col justify-between shadow-2xl">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono">
                  [Espaço reservado para foto institucional da sede]
                </span>
                <div className="h-px bg-neutral-800 w-full" />
                <p className="font-serif text-xl text-white font-medium">
                  Atendimento estratégico em governança e contabilidade de alta precisão.
                </p>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Placeholder reservado na proporção 4:3 para inserção da fotografia oficial do
                  escritório em Brasília.
                </p>
              </div>
              <div className="pt-6 border-t border-neutral-800 flex justify-between items-center text-xs text-neutral-400">
                <span>SCN Quadra 2, Brasília - DF</span>
                <span>Dimensão: 16:9 / 4:3</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authority Profile Section - Com placeholder neutro proporcional no lugar do retrato ilustrado */}
      <section className="py-20 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5">
              {/* Placeholder neutro na proporção 4:5 para fotografia real */}
              <div className="aspect-[4/5] rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-100 flex flex-col items-center justify-center p-8 text-center text-neutral-600 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center mb-4 text-neutral-500">
                  <Award className="h-8 w-8" />
                </div>
                <p className="font-serif font-semibold text-lg text-black mb-1">
                  Rafael Peres Peres Nunes Altoé
                </p>
                <p className="text-xs font-mono text-neutral-500 mb-3">[Foto oficial a inserir]</p>
                <p className="text-xs text-neutral-500 max-w-xs">
                  Proporção 4:5 reservada para o retrato fotográfico oficial do responsável técnico.
                </p>
              </div>
            </div>

            <div className="md:col-span-7 space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-black">
                Liderança Técnica e Acadêmica
              </h2>
              <p className="text-lg text-neutral-700 leading-relaxed font-sans">
                Sob a responsabilidade técnica de <strong>Rafael Peres Peres Nunes Altoé</strong>{' '}
                (CRC 027704/O), a <strong>PERES PERES Consultoria e Contabilidade</strong> une o
                rigor da prática contábil à densidade teórica do Direito Tributário. Pós-graduado em
                Direito Tributário (CERS), possui participação ativa em grupos de pesquisa acadêmica
                (UniCEUB, IDP) e congressos especializados.
              </p>

              <ul className="grid sm:grid-cols-2 gap-4 mt-6">
                {[
                  'Membro CDESCMAT/DF',
                  'Jornadas de Finanças Públicas (BA)',
                  'Atuação perante órgãos fazendários',
                  'Articulista e pesquisador em Direito Tributário',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-neutral-800">
                    <CheckCircle2 className="h-4 w-4 text-neutral-900 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <Button
                  variant="outline"
                  className="border-neutral-900 text-black hover:bg-neutral-100 text-sm font-medium"
                  asChild
                >
                  <Link to="/sobre">
                    Conhecer histórico profissional completo <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-black">
              Áreas de Atuação Especializada
            </h2>
            <p className="text-neutral-600 text-lg leading-relaxed">
              Atuação técnica orientada estritamente às normas contábeis brasileiras e à legislação
              tributária aplicável a cada setor.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, index) => (
              <Card
                key={index}
                className="border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white"
              >
                <CardHeader>
                  <div className="h-10 w-10 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-3">
                    <ShieldCheck className="h-5 w-5 text-black" />
                  </div>
                  <CardTitle className="text-xl font-serif text-black">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-neutral-600 leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Institucional de Metodologia em substituição ao carrossel de casos */}
      <section className="py-20 bg-neutral-950 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 border border-neutral-800 px-3 py-1 rounded text-xs uppercase tracking-wider text-neutral-400 font-mono">
              <BookOpen className="h-3.5 w-3.5 text-[#FAB319]" />
              Manual de Comunicação e Compliance
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
              Metodologia de Trabalho e Embasamento Normativo
            </h2>
            <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
              A <strong>PERES PERES Consultoria e Contabilidade</strong> adota postura estritamente
              conservadora e fundamentada. Não veiculamos promessas de resultado ou percentuais de
              economia genéricos: cada diagnóstico decorre de auditoria documental detalhada,
              lastreada nas regras da Receita Federal e decisões consolidadas dos tribunais
              superiores.
            </p>
            <div className="pt-4 flex justify-center">
              <Button
                size="lg"
                className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-base h-12 px-8"
                asChild
              >
                <Link to="/casos">Conhecer Diretrizes e Metodologia</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
