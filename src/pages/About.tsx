import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, GraduationCap, Users } from 'lucide-react'
import logoPadrao from '@/assets/logo-padrao-oficial-844b7.png'

export default function About() {
  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="flex justify-center mb-8">
            <div className="bg-black p-6 rounded-xl inline-block border border-neutral-800">
              <img
                src={logoPadrao}
                alt="PERES PERES Consultoria e Contabilidade"
                className="h-16 w-auto object-contain"
              />
            </div>
          </div>
          <Badge
            variant="outline"
            className="mb-4 border-neutral-800 text-neutral-800 bg-neutral-100"
          >
            Governança e Rigor Técnico
          </Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-black">
            Nossa Atuação e Estrutura Técnica
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            A <strong>PERES PERES Consultoria e Contabilidade</strong> estrutura suas atividades
            sobre fundamentação jurídica estrita, conformidade regulatória e contabilidade
            estratégica para empresas e grupos familiares.
          </p>
        </div>

        {/* Bio Section com moldura neutra sem texto explicativo dentro */}
        <Card className="mb-16 border border-neutral-200 shadow-sm overflow-hidden bg-white">
          <div className="grid md:grid-cols-5 gap-0">
            <div className="md:col-span-2 bg-neutral-100 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-neutral-200">
              <div
                className="aspect-[4/5] w-full max-w-[240px] rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 flex items-center justify-center"
                aria-label="Espaço reservado para retrato fotográfico"
              >
                <div className="w-14 h-14 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-400">
                  <GraduationCap className="h-7 w-7" />
                </div>
              </div>
            </div>
            <div className="md:col-span-3 p-8 lg:p-12 bg-white flex flex-col justify-center">
              <h2 className="text-3xl font-serif font-bold text-black mb-2">
                Rafael Peres Peres Nunes Altoé
              </h2>
              <p className="text-black font-semibold mb-6 uppercase tracking-wider text-xs border border-neutral-300 bg-neutral-100 inline-block px-3 py-1 rounded self-start">
                Contador Responsável • CRC 027704/O
              </p>

              <div className="space-y-4 text-neutral-700 leading-relaxed font-sans text-sm md:text-base">
                <p>
                  Com trajetória pautada pela integração entre a contabilidade consultiva e o rigor
                  do Direito Tributário, atua diretamente no Distrito Federal e em âmbito nacional.
                </p>
                <p>
                  Pós-graduado em Direito Tributário pelo CERS, conduz procedimentos administrativos
                  fiscais, impugnações e defesas perante órgãos fazendários, além de estruturação
                  societária preventiva e governança contábil.
                </p>
                <p>
                  Mantém presença em ambientes de debate técnico e pesquisa, integrando o grupo de
                  estudos CDESCMAT no Distrito Federal e participando de iniciativas acadêmicas
                  junto a instituições de ensino superior como UniCEUB e IDP.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-neutral-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 border border-neutral-200 bg-neutral-100 rounded shrink-0">
                    <GraduationCap className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-black text-sm">Pós-Graduação</h4>
                    <p className="text-xs text-neutral-600">Direito Tributário (CERS)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 border border-neutral-200 bg-neutral-100 rounded shrink-0">
                    <BookOpen className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-black text-sm">
                      Pesquisa Acadêmica
                    </h4>
                    <p className="text-xs text-neutral-600">UniCEUB & IDP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Team Section - Espaço preparado para receber nome, função e mini currículo reais, com nota discreta */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4 flex items-center justify-center gap-3 text-black">
              <Users className="h-7 w-7 text-black" /> Estrutura da Equipe Técnica
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
              Atuação multidisciplinar integrada nas áreas de contabilidade, auditoria e
              conformidade fiscal, sob a coordenação e responsabilidade técnica do titular.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="p-8 border border-neutral-200 bg-neutral-50/60 shadow-sm text-center">
              <div
                className="aspect-square w-24 mx-auto rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-100 flex items-center justify-center mb-6"
                aria-label="Espaço reservado para foto da equipe"
              >
                <Users className="h-8 w-8 text-neutral-400" />
              </div>
              <h3 className="font-serif font-semibold text-xl text-black mb-2">
                Equipe Multidisciplinar
              </h3>
              <p className="text-xs uppercase font-mono tracking-wider text-neutral-500 mb-4">
                Corpo Técnico e Consultivo
              </p>
              <p className="text-sm text-neutral-700 leading-relaxed max-w-lg mx-auto mb-6">
                Espaço estruturado para apresentação individual dos profissionais integrantes da
                nossa equipe técnica, detalhando nome, função, registro profissional e mini
                currículo acadêmico e corporativo.
              </p>
              <div className="pt-4 border-t border-neutral-200">
                <span className="text-xs text-neutral-500 italic">
                  Os perfis completos dos integrantes da equipe técnica serão publicados em breve.
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
