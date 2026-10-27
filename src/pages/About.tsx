import { Card, CardContent } from '@/components/ui/card'
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

        {/* Bio Section com bloco neutro proporcional no lugar do retrato de terceiro */}
        <Card className="mb-16 border border-neutral-200 shadow-sm overflow-hidden bg-white">
          <div className="grid md:grid-cols-5 gap-0">
            <div className="md:col-span-2 bg-neutral-100 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-neutral-200">
              <div className="aspect-[4/5] w-full max-w-[240px] rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 flex flex-col items-center justify-center p-6 text-neutral-500">
                <div className="w-14 h-14 rounded-full bg-neutral-200 flex items-center justify-center mb-3 text-neutral-600">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <span className="font-serif font-semibold text-black text-sm mb-1">
                  Rafael Peres Peres Nunes Altoé
                </span>
                <span className="text-[11px] font-mono text-neutral-500 mb-2">
                  [Foto oficial a inserir]
                </span>
                <span className="text-[11px] text-neutral-400">
                  Proporção 4:5 reservada para fotografia real
                </span>
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
                  Pós-graduado em Direito Tributário pelo CERS, possui experiência na condução de
                  procedimentos administrativos fiscais, impugnações e defesas perante órgãos
                  fazendários, além de estruturação societária preventiva.
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

        {/* Team Section - Estrutura pronta para receber dados reais, sem repetições nem fotos genéricas */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4 flex items-center justify-center gap-3 text-black">
              <Users className="h-7 w-7 text-black" /> Estrutura da Equipe Técnica
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Atuação multidisciplinar integrada nas áreas de contabilidade, auditoria e
              conformidade fiscal, sob a coordenação técnica e responsabilidade do fundador.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 border border-dashed border-neutral-300 bg-neutral-50/60 flex flex-col justify-between">
              <div>
                <div className="aspect-square w-24 mx-auto rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-100 flex flex-col items-center justify-center text-center p-2 mb-4">
                  <Users className="h-6 w-6 text-neutral-400 mb-1" />
                  <span className="text-[10px] font-mono text-neutral-500">[1:1 foto real]</span>
                </div>
                <div className="text-center">
                  <h3 className="font-serif font-semibold text-base text-black mb-1">
                    [Nome do Profissional]
                  </h3>
                  <span className="text-xs font-mono text-neutral-500 block mb-2">
                    [Função / Cargo Técnico]
                  </span>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    [Mini currículo: formação acadêmica, área de especialização e atribuições no
                    escritório.]
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-200 text-center">
                <span className="text-[11px] font-mono text-neutral-400">
                  Pendente de preenchimento
                </span>
              </div>
            </Card>

            <Card className="p-6 border border-dashed border-neutral-300 bg-neutral-50/60 flex flex-col justify-between">
              <div>
                <div className="aspect-square w-24 mx-auto rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-100 flex flex-col items-center justify-center text-center p-2 mb-4">
                  <Users className="h-6 w-6 text-neutral-400 mb-1" />
                  <span className="text-[10px] font-mono text-neutral-500">[1:1 foto real]</span>
                </div>
                <div className="text-center">
                  <h3 className="font-serif font-semibold text-base text-black mb-1">
                    [Nome do Profissional]
                  </h3>
                  <span className="text-xs font-mono text-neutral-500 block mb-2">
                    [Função / Cargo Técnico]
                  </span>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    [Mini currículo: formação acadêmica, área de especialização e atribuições no
                    escritório.]
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-200 text-center">
                <span className="text-[11px] font-mono text-neutral-400">
                  Pendente de preenchimento
                </span>
              </div>
            </Card>

            <Card className="p-6 border border-dashed border-neutral-300 bg-neutral-50/60 flex flex-col justify-between">
              <div>
                <div className="aspect-square w-24 mx-auto rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-100 flex flex-col items-center justify-center text-center p-2 mb-4">
                  <Users className="h-6 w-6 text-neutral-400 mb-1" />
                  <span className="text-[10px] font-mono text-neutral-500">[1:1 foto real]</span>
                </div>
                <div className="text-center">
                  <h3 className="font-serif font-semibold text-base text-black mb-1">
                    [Nome do Profissional]
                  </h3>
                  <span className="text-xs font-mono text-neutral-500 block mb-2">
                    [Função / Cargo Técnico]
                  </span>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    [Mini currículo: formação acadêmica, área de especialização e atribuições no
                    escritório.]
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-200 text-center">
                <span className="text-[11px] font-mono text-neutral-400">
                  Pendente de preenchimento
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
