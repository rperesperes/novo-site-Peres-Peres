import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ShieldCheck, Award, Scale, Building2 } from 'lucide-react'
import rafaelImg from '@/assets/foto-melhorada-por-ia-892a9.png'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { SERVICES } from '@/lib/data'

export default function Index() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section - Arquitetura monocromática elegante com ponto focal restrito no botão */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-black text-white border-b border-neutral-800">
        <div className="container mx-auto px-4 py-20 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8 animate-fade-in-up">
            <div className="inline-block border border-neutral-700 px-3 py-1 rounded text-xs tracking-wider uppercase text-neutral-300">
              PERES PERES Consultoria e Contabilidade
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
              Consultoria e Contabilidade Tributária em Brasília
            </h1>

            <p className="text-lg text-neutral-300 max-w-xl leading-relaxed">
              Sob a responsabilidade técnica de Rafael Peres Peres Nunes Altoé (CRC 027704/O),
              oferecemos governança fiscal, planejamento contábil e consultoria tributária em
              estrita conformidade com a legislação brasileira.
            </p>

            {/* Ponto focal único da tela no Hero: Botão com #FAB319 */}
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
                <Link to="/servicos">Conhecer Serviços</Link>
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

          {/* Moldura neutra no Hero sem texto explicativo interno */}
          <div className="lg:col-span-5">
            <div
              className="aspect-[4/3] rounded-lg border border-neutral-800 bg-neutral-950 p-8 flex flex-col justify-between shadow-2xl"
              aria-label="Espaço institucional"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-neutral-500 font-mono">
                  SCN Quadra 2, Brasília - DF
                </span>
                <Building2 className="h-5 w-5 text-neutral-600" />
              </div>
              <div className="h-px bg-neutral-800 w-full my-6" />
              <div className="space-y-3">
                <p className="font-serif text-xl text-white font-medium">
                  Atendimento em governança e contabilidade tributária.
                </p>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Planejamento tributário, recuperação de indébitos e contencioso administrativo com
                  responsabilidade formal.
                </p>
              </div>
              <div className="pt-6 border-t border-neutral-800 flex justify-between items-center text-xs text-neutral-500">
                <span>Distrito Federal</span>
                <span>Atendimento Presencial e Nacional</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authority Profile Section - Moldura neutra proporcional sem rótulo de rascunho */}
      <section className="py-20 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5">
              {/* Retrato oficial do responsável técnico */}
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-neutral-200 shadow-md bg-neutral-100 group">
                <img
                  src={rafaelImg}
                  alt="Rafael Peres Peres Nunes Altoé - Contador Responsável CRC 027704/O"
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="inline-block border-l-2 border-[#FAB319] pl-3 mb-1">
                    <p className="font-serif font-bold text-lg text-white">
                      Rafael Peres Peres Nunes Altoé
                    </p>
                    <p className="text-xs text-neutral-300 font-mono">Contador • CRC 027704/O</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-black">
                Liderança Técnica e Acadêmica
              </h2>
              <p className="text-lg text-neutral-700 leading-relaxed font-sans">
                Sob a responsabilidade técnica de <strong>Rafael Peres Peres Nunes Altoé</strong>{' '}
                (CRC 027704/O), a <strong>PERES PERES Consultoria e Contabilidade</strong> une a
                prática contábil ao Direito Tributário. Pós-graduado em Direito Tributário (CERS),
                possui participação em grupos de pesquisa acadêmica (UniCEUB, IDP) e atuação
                consultiva contínua perante órgãos fazendários.
              </p>

              <ul className="grid sm:grid-cols-2 gap-4 mt-6">
                {[
                  'Membro CDESCMAT/DF',
                  'Jornadas de Finanças Públicas (BA)',
                  'Atuação perante órgãos fazendários',
                  'Pesquisa em Direito Tributário',
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

      {/* Seção Institucional de Diretrizes e Embasamento */}
      <section className="py-20 bg-neutral-950 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 border border-neutral-800 px-3 py-1 rounded text-xs uppercase tracking-wider text-neutral-400 font-mono">
              <Scale className="h-3.5 w-3.5 text-neutral-300" />
              Diretrizes de Atuação
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
                <Link to="/servicos">Conhecer Nossas Áreas de Atuação</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
