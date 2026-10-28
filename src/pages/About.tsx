import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, GraduationCap, Users } from 'lucide-react'
import logoPadrao from '@/assets/logo-padrao-oficial-844b7.png'
import rafaelImg from '@/assets/foto-melhorada-por-ia-892a9.png'
import williamImg from '@/assets/copia-de-img8757-182f8.jpg'
import gabrielaImg from '@/assets/copia-de-img8782-9b4d0.jpg'

interface TeamMember {
  name: string
  role: string
  photo?: string
  initials?: string
  alt: string
  description?: string[]
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Gabriela Feitosa',
    role: 'Contadora e Perita Contábil',
    photo: gabrielaImg,
    alt: 'Gabriela Feitosa - Contadora e Perita Contábil',
  },
  {
    name: 'William Lisboa',
    role: 'Graduando em Ciências Contábeis - UnB',
    photo: williamImg,
    alt: 'William Lisboa - Graduando em Ciências Contábeis na Universidade de Brasília (UnB)',
    description: [
      'Estudante de contabilidade e profissional da área contábil, com atuação no departamento contábil e experiência em Contabilidade Gerencial e Análise de Dados aplicada à gestão financeira e administrativa.',
      'Graduando em Ciências Contábeis pela Universidade de Brasília (UnB), com previsão de conclusão em 2026, possui também formação profissional em Análise de Dados pelo Google.',
      'Ao longo de sua trajetória profissional, desenvolveu habilidades em análise de dados, produção de relatórios contábeis e liderança, que lhe conferem perfil analítico, domínio de ferramentas de organização e tratamento de dados, além de sólida compreensão dos princípios contábeis.',
    ],
  },
  {
    name: 'Clarissa Lebeis',
    role: 'Graduanda em Ciências Contábeis - UnB',
    initials: 'CL',
    alt: 'Clarissa Lebeis - Graduanda em Ciências Contábeis na Universidade de Brasília (UnB)',
  },
]

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
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black">
            Nossa Atuação e Estrutura Técnica
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            A <strong>PERES PERES Consultoria e Contabilidade</strong> estrutura suas atividades
            sobre fundamentação jurídica estrita, conformidade regulatória e contabilidade
            estratégica para empresas e grupos familiares.
          </p>
        </div>

        {/* Bio Section do Responsável Técnico com Fotografia */}
        <Card className="mb-16 border border-neutral-200 shadow-sm overflow-hidden bg-white">
          <div className="grid md:grid-cols-5 gap-0">
            <div className="md:col-span-2 bg-neutral-900 p-6 sm:p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-neutral-200">
              <div className="relative aspect-[4/5] w-full max-w-[260px] rounded-lg overflow-hidden border border-neutral-800 shadow-md bg-neutral-950">
                <img
                  src={rafaelImg}
                  alt="Rafael Peres Peres Nunes Altoé - Contador Responsável Técnico CRC 027704/O"
                  loading="lazy"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-xs uppercase tracking-wider text-neutral-400 font-mono">
                  Responsável Técnico
                </p>
                <p className="text-xs text-[#FAB319] font-semibold mt-0.5">CRC 027704/O</p>
              </div>
            </div>
            <div className="md:col-span-3 p-8 lg:p-12 bg-white flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-black mb-2">Rafael Peres Peres Nunes Altoé</h2>
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-black font-semibold uppercase tracking-wider text-xs border border-neutral-300 bg-neutral-100 inline-block px-3 py-1 rounded">
                  Contador Responsável Técnico
                </span>
                <span className="text-neutral-900 font-mono text-xs border border-[#FAB319] bg-[#FAB319]/15 inline-block px-3 py-1 rounded font-bold">
                  CRC 027704/O
                </span>
              </div>

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
                    <h4 className="font-semibold text-black text-sm">Pós-Graduação</h4>
                    <p className="text-xs text-neutral-600">Direito Tributário (CERS)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 border border-neutral-200 bg-neutral-100 rounded shrink-0">
                    <BookOpen className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black text-sm">Pesquisa Acadêmica</h4>
                    <p className="text-xs text-neutral-600">UniCEUB & IDP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Seção da Equipe Técnica */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 border border-neutral-300 bg-neutral-100 px-3 py-1 rounded text-xs uppercase tracking-wider text-neutral-800 font-mono mb-3">
              <Users className="h-3.5 w-3.5 text-neutral-700" />
              Corpo Técnico
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">Nossa Equipe</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
              Profissionais dedicados à governança fiscal, contabilidade consultiva e auditoria,
              atuando de forma integrada sob a coordenação do responsável técnico.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member) => (
              <Card
                key={member.name}
                className="overflow-hidden border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
              >
                {/* Área de Retrato Padronizada (proporção retrato 4:5 consistente) */}
                <div className="relative aspect-[4/5] w-full bg-neutral-100 overflow-hidden border-b border-neutral-200">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.alt}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    /* Placeholder elegante e institucional para quem ainda não possui foto */
                    <div
                      className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-white p-6 relative overflow-hidden"
                      aria-label={`Representação de ${member.name}`}
                    >
                      {/* Detalhe de fundo decorativo com o amarelo institucional */}
                      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#FAB319]/10 rounded-full blur-2xl" />
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full border-2 border-[#FAB319] bg-neutral-900 flex items-center justify-center mb-4 shadow-inner">
                          <span className="font-bold text-2xl tracking-wider text-[#FAB319]">
                            {member.initials}
                          </span>
                        </div>
                        <span className="text-xs uppercase font-mono tracking-widest text-neutral-400">
                          PERES PERES
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Linha de acento amarela institucional sutil no rodapé da imagem */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FAB319] opacity-80" />
                </div>

                {/* Conteúdo do Card */}
                <div className="p-6 flex-1 flex flex-col justify-between text-center">
                  <div>
                    <h3 className="font-semibold text-xl text-black mb-1.5 group-hover:text-neutral-900 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs md:text-sm text-neutral-600 leading-snug">
                      {member.role}
                    </p>
                    {member.description && (
                      <div className="mt-4 pt-4 border-t border-neutral-100 text-left space-y-2.5 text-xs text-neutral-600 leading-relaxed">
                        {member.description.map((paragraph, pIdx) => (
                          <p key={pIdx}>{paragraph}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
