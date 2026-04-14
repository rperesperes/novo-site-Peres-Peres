import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, GraduationCap, Scale, Users } from 'lucide-react'

export default function About() {
  return (
    <div className="py-12 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <Badge variant="outline" className="mb-4 border-secondary text-secondary">
            Expertise & E-E-A-T
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Nossa Autoridade Técnica</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A Peres & Peres é construída sobre uma fundação sólida de excelência acadêmica e prática
            profissional rigorosa na contabilidade tributária.
          </p>
        </div>

        {/* Bio Section */}
        <Card className="mb-16 border-none shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-5 gap-0">
            <div className="md:col-span-2 bg-muted relative min-h-[400px]">
              <img
                src="https://img.usecurling.com/ppl/large?gender=male&seed=rafael"
                alt="Rafael Peres Peres"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="md:col-span-3 p-8 lg:p-12 bg-white flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-primary mb-2">
                Rafael Peres Peres Nunes Altoé
              </h2>
              <p className="text-accent font-semibold mb-6 uppercase tracking-wider text-sm">
                Contador Responsável • CRC 027704/O
              </p>

              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Com uma trajetória marcada pela união entre a contabilidade prática e o rigor do
                  Direito Tributário, Rafael é uma referência técnica no Distrito Federal e atua em
                  múltiplos estados do Brasil.
                </p>
                <p>
                  Especialista (Pós-graduado) em Direito Tributário pelo renomado CERS, possui vasta
                  experiência em contencioso administrativo, defesas em autos de infração e
                  estruturação de planejamentos tributários complexos.
                </p>
                <p>
                  Sua atuação não se restringe aos escritórios: possui ativa participação acadêmica,
                  integrando o grupo de estudos CDESCMAT no Distrito Federal, e contribuindo para
                  pesquisas acadêmicas em instituições de ponta como UniCEUB e IDP.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t">
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-6 w-6 text-secondary shrink-0" />
                  <div>
                    <h4 className="font-semibold text-primary">Pós-Graduação</h4>
                    <p className="text-sm text-muted-foreground">Direito Tributário (CERS)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BookOpen className="h-6 w-6 text-secondary shrink-0" />
                  <div>
                    <h4 className="font-semibold text-primary">Pesquisa Acadêmica</h4>
                    <p className="text-sm text-muted-foreground">UniCEUB & IDP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Team Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <Users className="h-8 w-8 text-secondary" /> Equipe Multidisciplinar
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Contamos com profissionais altamente qualificados, incluindo advogados tributaristas,
              economistas e auditores, operando sob a estrita responsabilidade técnica de nosso
              fundador.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((member) => (
              <Card key={member} className="text-center p-6 border-none shadow-md">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-2 border-muted">
                  <img
                    src={`https://img.usecurling.com/ppl/medium?seed=${member + 10}`}
                    alt="Team member"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-lg">Membro Equipe {member}</h3>
                <p className="text-sm text-secondary font-medium mb-3">Auditor Sênior</p>
                <p className="text-sm text-muted-foreground">
                  Especialista na análise de obrigações acessórias e SPED Fiscal.
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
