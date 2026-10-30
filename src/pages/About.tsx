import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, GraduationCap, Users, CheckCircle2, ExternalLink } from 'lucide-react'
import logoPadrao from '@/assets/logo-padrao-oficial-844b7.png'
import rafaelImg from '@/assets/foto-melhorada-por-ia-892a9.png'
import williamImg from '@/assets/copia-de-img8757-182f8.jpg'
import gabrielaImg from '@/assets/copia-de-img8782-9b4d0.jpg'
import clarissaImg from '@/assets/whatsapp-image-2026-10-29-at-15.24.44-54004.jpeg'

interface TeamMember {
  name: string
  role: string
  photo: string
  alt: string
  description: string
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Gabriela Feitosa',
    role: 'Contadora (CRC 031776) e Perita Contábil (CNPC 8224)',
    photo: gabrielaImg,
    alt: 'Gabriela Feitosa - Contadora (CRC 031776) e Perita Contábil (CNPC 8224)',
    description:
      'Pós graduanda em Perícia Contábil e Financeira pela Faculdade Brasileira de Contabilidade (FBC) e Bacharel em Ciências Contábeis (UnB). Concluiu o curso Veritas Perícia de Formação completa de Peritos Judiciais e Assistentes Técnicos em Cálculos Trabalhistas. Tem experiência em protocolo junto a tribunais e em execução financeira de órgãos públicos.',
  },
  {
    name: 'William Lisboa',
    role: 'Graduando em Ciências Contábeis (UnB)',
    photo: williamImg,
    alt: 'William Lisboa - Graduando em Ciências Contábeis (UnB)',
    description:
      'Formação profissional em Análise de Dados pelo Google. Atua na construção de relatórios e painéis analíticos, com domínio de Power BI e Microsoft Access, e tem experiência em controle de notas fiscais e em assistência de controladoria de mercado.',
  },
  {
    name: 'Clarissa Lebeis',
    role: 'Graduanda em Ciências Contábeis (UnB)',
    photo: clarissaImg,
    alt: 'Clarissa Lebeis - Graduanda em Ciências Contábeis (UnB)',
    description: 'Tem experiência na organização de eventos',
  },
]

export default function About() {
  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black">
            Nossa Atuação e Estrutura Técnica
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            A <strong>PERES PERES Consultoria &amp; Contabilidade</strong> estrutura suas atividades
            sobre fundamentação jurídica estrita, conformidade regulatória e contabilidade
            estratégica para empresas e grupos familiares.
          </p>
        </div>

        {/* Bio Section do Responsável Técnico com Fotografia */}
        <Card className="mb-16 border border-neutral-200 shadow-sm overflow-hidden bg-white">
          <div className="grid md:grid-cols-12 gap-0">
            <div className="md:col-span-4 bg-neutral-900 p-6 sm:p-7 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-neutral-200">
              <div className="relative aspect-[4/5] w-full max-w-[210px] rounded-lg overflow-hidden border border-neutral-800 shadow-md bg-neutral-950">
                <img
                  src={rafaelImg}
                  alt="Rafael Peres Peres Nunes Altoé - Contador Responsável Técnico CRC 027704"
                  loading="lazy"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="mt-4 w-full max-w-[210px] text-center border-t border-neutral-800/80 pt-3">
                <p className="text-xs uppercase tracking-wider text-neutral-400 font-mono">
                  Responsável Técnico
                </p>
                <p className="text-sm font-semibold text-white mt-1">
                  Rafael Peres Peres Nunes Altoé
                </p>
                <p className="text-xs text-[#FAB319] font-semibold mt-1 leading-snug">
                  CRC 027704, OAB 87656 e CNAI 10122
                </p>
                <a
                  href="http://lattes.cnpq.br/9472564752604269"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors mt-2"
                >
                  <span>CV Lattes</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
            <div className="md:col-span-8 p-6 sm:p-8 lg:p-10 bg-white flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-black mb-1">Rafael Peres Peres Nunes Altoé</h2>
              <p className="text-sm md:text-base font-medium text-neutral-700 mb-5">
                Contador • Advogado • Perito • Auditor • Professor
              </p>

              <div className="space-y-3.5 text-neutral-700 leading-relaxed font-sans text-sm md:text-base">
                <p>
                  Sob a responsabilidade técnica de Rafael Peres Peres Nunes Altoé, a PERES PERES
                  Consultoria &amp; Contabilidade une a prática da contabilidade ao Direito, em
                  especial o Direito Tributário, com atuação em Brasília e em âmbito nacional.
                </p>
                <p>
                  Contador (CRC 027704), advogado (OAB 87656), perito, auditor (CNAI 10122) e
                  professor, dedica-se à Consultoria Tributária empresarial há 10 anos. Conduz
                  procedimentos administrativos fiscais, impugnações e defesas perante órgãos
                  fazendários, além de estruturação societária preventiva e governança contábil.
                </p>
                <p>
                  Pós-graduado em Direito Tributário (CERS) e bacharel em Ciências Contábeis (UCB).
                  Integrou o Grupo de Pesquisas Tributárias do CDESCMAT da CLDF, o Grupo de Estudos,
                  Pesquisa e Análise Tributária da UniCEUB e o Grupo de Estudos da Limitação e
                  Controle da Renúncia Fiscal do IDP. Foi monitor acadêmico das disciplinas de
                  Direito Tributário I, II e III no IDP, junto aos professores Ivan Allegretti,
                  Onizia Pignataro e Alberto Medeiros.
                </p>
              </div>

              {/* Lista de destaque */}
              <ul className="grid sm:grid-cols-2 gap-2.5 mt-5">
                {[
                  'Membro da Comissão de Contabilidade Tributária do CRC-DF',
                  'Membro da Comissão de Assuntos Tributários da OAB-DF',
                  'Atuação perante órgãos fazendários',
                  'Pesquisa em Direito Tributário',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-neutral-800">
                    <CheckCircle2 className="h-4 w-4 text-neutral-900 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-neutral-200">
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

        {/* Nossa História */}
        <section className="mt-20 mb-20 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">Nossa História</h2>
          <div className="space-y-4 text-neutral-700 leading-relaxed font-sans text-sm md:text-base">
            <p>
              Em 2017, nasce em Brasília a PERES PERES Consultoria &amp; Contabilidade com uma
              proposta que segue a mesma desde o primeiro dia: fazer contabilidade de um jeito
              diferente do convencional.
            </p>
            <p>
              Acreditamos na contabilidade que vai além das exigências mínimas previstas em lei.
              Calcular os tributos devidos no mês e preencher as declarações obrigatórias é o começo
              do trabalho, não o fim. O que entregamos é a leitura técnica desses números: o que
              eles revelam sobre a margem, sobre o risco fiscal e sobre as decisões que a empresa
              precisa tomar.
            </p>
            <p>
              Acompanhamos as mudanças constantes da legislação e as novas ferramentas disponíveis
              no mercado para oferecer soluções ajustadas à realidade de cada cliente, tecnicamente
              corretas e compatíveis com a estrutura e o porte do negócio.
            </p>
          </div>
        </section>

        {/* Nosso Diferencial */}
        <section className="mb-20 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">Nosso Diferencial</h2>
          <div className="space-y-4 text-neutral-700 leading-relaxed font-sans text-sm md:text-base">
            <p>
              A PERES PERES une a prática da contabilidade ao Direito, em especial o tributário. O
              escritório é conduzido por profissional com registro duplo: contador (CRC 027704) e
              advogado (OAB 87656), com atuação como perito, auditor (CNAI 10122) e professor.
            </p>
            <p>
              Na prática, isso significa que a norma contábil e a tese jurídica são analisadas pela
              mesma pessoa, e não por departamentos diferentes que não se falam. Quando o fisco
              autua, essa diferença importa.
            </p>
          </div>
        </section>

        {/* Seção da Equipe Técnica */}
        <section id="equipe" className="mt-20 scroll-mt-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 border border-neutral-300 bg-neutral-100 px-3 py-1 rounded text-xs uppercase tracking-wider text-neutral-800 font-mono mb-3">
              <Users className="h-3.5 w-3.5 text-neutral-700" />
              Corpo Técnico
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">Nossa Equipe</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
              Profissionais dedicados à governança fiscal, contabilidade consultiva, auditoria e
              perícia, atuando de forma integrada sob a coordenação do responsável técnico.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member) => (
              <Card
                key={member.name}
                className="overflow-hidden border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group"
              >
                {/* Área de Retrato Padronizada (proporção retrato 4:5 consistente) */}
                <div className="relative aspect-[4/5] w-full bg-neutral-100 overflow-hidden border-b border-neutral-200">
                  <img
                    src={member.photo}
                    alt={member.alt}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Linha de acento amarela institucional sutil no rodapé da imagem */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FAB319] opacity-80" />
                </div>

                {/* Conteúdo do Card Padronizado */}
                <div className="p-6 flex-1 flex flex-col text-center">
                  <h3 className="font-semibold text-xl text-black mb-1.5 group-hover:text-neutral-900 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs md:text-sm font-medium text-neutral-700 leading-snug min-h-[2.5rem] flex items-center justify-center">
                    {member.role}
                  </p>
                  <p className="mt-3 pt-3 border-t border-neutral-100 text-xs md:text-sm text-neutral-600 leading-relaxed text-center flex-1">
                    {member.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
