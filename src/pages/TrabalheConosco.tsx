import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Briefcase,
  Users,
  Compass,
  Award,
  ChevronDown,
  ChevronUp,
  Mail,
  Copy,
  Check,
  Building2,
  Sparkles,
  TrendingUp,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react'
import { getPublicJobVacancies, type JobVacancyRecord } from '@/services/job_vacancies'

const CAREER_LEVELS = [
  {
    level: 'Assistente',
    role: 'Assistente Contábil / Fiscal / Jurídico',
    description:
      'Imersão técnica rigorosa na rotina operacional e fiscal. Espera-se curiosidade intelectual, atenção aos detalhes na conciliação e apuração de tributos, e compromisso absoluto com a qualidade documental.',
    expectations:
      'Bases sólidas de escrituração, apuração nos regimes do Simples Nacional e Lucro Presumido, e postura investigativa diante de inconsistências.',
    badge: 'Nível I — Formação e Execução',
  },
  {
    level: 'Analista',
    role: 'Analista Sênior / Consultor Tributário',
    description:
      'Autonomia técnica, condução de auditorias, elaboração de pareceres consultivos e interface direta com clientes e órgãos fazendários. Espera-se pensamento estratégico e capacidade de conectar norma contábil a teses jurídicas.',
    expectations:
      'Diagnósticos fiscais avançados, planejamento tributário preventivo, revisão de declarações complexas e liderança técnica na orientação de assistentes.',
    badge: 'Nível II — Autonomia e Estratégia',
  },
  {
    level: 'Diretor',
    role: 'Diretor Técnico / Sócio de Área',
    description:
      'Liderança de equipes, governança de clientes estratégicos, condução de reestruturações societárias e representação institucional do escritório. Espera-se visão de longo prazo e responsabilidade ética irrestrita.',
    expectations:
      'Tomada de decisão de alta complexidade, representação em procedimentos fiscais de grande porte, mentoria contínua da equipe e expansão da autoridade técnica da PERES PERES.',
    badge: 'Nível III — Liderança e Governança',
  },
]

export default function TrabalheConosco() {
  const [vacancies, setVacancies] = useState<JobVacancyRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedVacancyId, setExpandedVacancyId] = useState<string | null>(null)
  const [copiedVacancyId, setCopiedVacancyId] = useState<string | null>(null)
  const [generalCopied, setGeneralCopied] = useState(false)

  const RECRUITMENT_EMAIL = 'rafael@peresperes.com.br'

  useEffect(() => {
    let mounted = true
    const loadData = async () => {
      try {
        const data = await getPublicJobVacancies()
        if (mounted) {
          setVacancies(data)
          // Se houver apenas uma vaga, já abre por padrão para conveniência
          if (data.length === 1) {
            setExpandedVacancyId(data[0].id)
          }
        }
      } catch (err) {
        console.error('Erro ao buscar vagas abertas:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadData()
    return () => {
      mounted = false
    }
  }, [])

  const handleCopyEmail = (vacancyId?: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(RECRUITMENT_EMAIL)
      } else {
        // Fallback clássico
        const textarea = document.createElement('textarea')
        textarea.value = RECRUITMENT_EMAIL
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
    } catch (err) {
      console.error('Falha ao copiar para o clipboard:', err)
    }

    if (vacancyId) {
      setCopiedVacancyId(vacancyId)
      setTimeout(() => {
        setCopiedVacancyId(null)
      }, 3000)
    } else {
      setGeneralCopied(true)
      setTimeout(() => {
        setGeneralCopied(false)
      }, 3000)
    }
  }

  const handleApplyMailto = (vacancyTitle?: string) => {
    const subject = vacancyTitle
      ? `Candidatura: ${vacancyTitle} — PERES PERES`
      : 'Currículo Espontâneo — PERES PERES'
    const mailtoUrl = `mailto:${RECRUITMENT_EMAIL}?subject=${encodeURIComponent(subject)}`

    try {
      window.location.href = mailtoUrl
    } catch (err) {
      console.warn('Mailto falhou, utilizando cópia como alternativa silenciosa:', err)
    }
  }

  return (
    <div className="bg-black text-neutral-100 min-h-screen py-16 md:py-24 font-sans selection:bg-[#FAB319] selection:text-black">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header institucional da página */}
        <div className="text-center mb-16 md:mb-20 animate-fade-in-up">
          <Badge
            variant="outline"
            className="mb-4 border-[#FAB319]/40 text-[#FAB319] bg-[#FAB319]/10 px-3.5 py-1 text-xs tracking-wider uppercase font-mono"
          >
            Carreira e Desenvolvimento Técnico
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white tracking-tight">
            Trabalhe na <span className="text-[#FAB319]">PERES PERES</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            Construímos uma contabilidade consultiva e jurídica de alto rigor em Brasília. Buscamos
            profissionais apaixonados pela exatidão técnica, pela investigação e pelo crescimento
            fundamentado no mérito demonstrado.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* BLOCO 1: CULTURA E QUEM SOMOS                                             */}
        {/* ========================================================================= */}
        <section className="mb-20 md:mb-28">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[#FAB319]">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-neutral-400 block">
                Nossa Cultura
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Como pensamos, trabalhamos e cuidamos das pessoas
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-neutral-950 border-neutral-800 p-6 sm:p-7 flex flex-col justify-between hover:border-neutral-700 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#FAB319] mb-5">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5">Rigor técnico sem atalhos</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Não acreditamos em soluções mágicas ou contabilidade que apenas emite guias. Cada
                  cálculo, enquadramento e parecer passa por fundamentação legal estrita, unindo a
                  ciência contábil ao Direito Tributário.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-900">
                <span className="text-xs text-[#FAB319] font-medium flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Segurança jurídica real
                </span>
              </div>
            </Card>

            <Card className="bg-neutral-950 border-neutral-800 p-6 sm:p-7 flex flex-col justify-between hover:border-neutral-700 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#FAB319] mb-5">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5">
                  Ambiente acolhedor e transparente
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Eliminamos a hierarquia engessada e o tom corporativo artificial. As portas estão
                  sempre abertas para debater teses, tirar dúvidas e propor melhorias nos processos.
                  Aqui você é ouvido desde o primeiro dia.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-900">
                <span className="text-xs text-[#FAB319] font-medium flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Cooperação contínua
                </span>
              </div>
            </Card>

            <Card className="bg-neutral-950 border-neutral-800 p-6 sm:p-7 flex flex-col justify-between hover:border-neutral-700 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#FAB319] mb-5">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5">
                  Incentivo genuíno aos estudos
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Contabilidade e legislação tributária mudam todos os dias. Estimulamos e
                  respeitamos o calendário acadêmico, graduações, pós-graduações e exames de
                  certificação (CFC, OAB, peritagem e auditoria).
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-900">
                <span className="text-xs text-[#FAB319] font-medium flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Aprendizado permanente
                </span>
              </div>
            </Card>
          </div>

          <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-neutral-950 via-neutral-900/60 to-neutral-950 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">Nossos valores fundamentais</p>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl">
                Ética intransigente, respeito ao tempo e aos negócios dos clientes, clareza na
                comunicação e paixão pelo detalhe que faz a diferença.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="border-neutral-700 bg-neutral-900 text-neutral-200 hover:text-white hover:bg-neutral-800 shrink-0 text-xs"
            >
              <Link to="/sobre">
                Conheça nossa história e equipe <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BLOCO 2: PLANO DE CARREIRA E CRESCIMENTO                                   */}
        {/* ========================================================================= */}
        <section className="mb-20 md:mb-28">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[#FAB319]">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-neutral-400 block">
                Plano de Carreira
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Evolução por competência demonstrada, não por tempo de casa
              </h2>
            </div>
          </div>

          <p className="text-sm md:text-base text-neutral-400 mb-10 max-w-3xl leading-relaxed">
            Na PERES PERES, você não precisa esperar anos na mesma cadeira para dar o próximo passo.
            A progressão técnica é orientada pelo domínio das matérias, autonomia na entrega, rigor
            de análise e postura de liderança.
          </p>

          {/* Linha do tempo visual dos 3 níveis */}
          <div className="relative">
            {/* Linha conectora vertical em telas menores, horizontal em desktop */}
            <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-[#FAB319]/20 via-[#FAB319] to-[#FAB319]/20 -translate-y-1/2 z-0" />

            <div className="grid lg:grid-cols-3 gap-8 relative z-10">
              {CAREER_LEVELS.map((career, index) => (
                <div
                  key={career.level}
                  className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-[#FAB319]/50 transition-all shadow-lg group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono uppercase tracking-widest text-[#FAB319] font-semibold bg-[#FAB319]/10 px-2.5 py-1 rounded border border-[#FAB319]/30">
                        {career.badge}
                      </span>
                      <span className="text-2xl font-bold font-mono text-neutral-600 group-hover:text-[#FAB319] transition-colors">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1">{career.level}</h3>
                    <p className="text-xs text-neutral-400 font-medium mb-4">{career.role}</p>

                    <div className="space-y-3 text-xs md:text-sm text-neutral-300 leading-relaxed">
                      <p>{career.description}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-900 bg-neutral-900/40 -mx-6 -mb-6 p-6 rounded-b-2xl">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      O que se espera:
                    </p>
                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                      {career.expectations}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-4">
            <p className="text-xs md:text-sm text-neutral-400">
              ⭐ <strong className="text-white">Premissa inegociável:</strong> Avaliações periódicas
              focadas em entregas reais, feedback contínuo estruturado e plano de estudo
              individualizado para cada membro do time.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BLOCO 3: VAGAS ABERTAS E BANCO DE TALENTOS                                */}
        {/* ========================================================================= */}
        <section id="vagas" className="scroll-mt-24">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[#FAB319]">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-neutral-400 block">
                  Oportunidades
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Posições abertas no escritório
                </h2>
              </div>
            </div>

            <Badge
              variant="outline"
              className="border-neutral-700 text-neutral-300 bg-neutral-900 px-3 py-1 text-xs"
            >
              {loading
                ? 'Consultando vagas...'
                : vacancies.length === 1
                  ? '1 vaga aberta'
                  : `${vacancies.length} vagas abertas`}
            </Badge>
          </div>

          {loading ? (
            <div className="p-12 text-center bg-neutral-950 border border-neutral-800 rounded-2xl">
              <div className="h-6 w-6 border-2 border-[#FAB319] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-neutral-400">Carregando oportunidades disponíveis...</p>
            </div>
          ) : vacancies.length === 0 ? (
            /* Estado quando não há vagas abertas: convite espontâneo */
            <Card className="bg-neutral-950 border-neutral-800 p-8 sm:p-10 text-center">
              <div className="max-w-xl mx-auto space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#FAB319] mx-auto">
                  <Award className="h-7 w-7" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  Não temos vagas abertas no momento
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Mesmo sem posições imediatas divulgadas, estamos sempre atentos a profissionais
                  com brilho nos olhos e sólido rigor técnico para compor nosso banco de talentos.
                  Envie seu currículo com uma breve apresentação.
                </p>

                <div className="pt-4 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    type="button"
                    onClick={() => handleApplyMailto()}
                    className="w-full sm:w-auto bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold px-6"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar currículo espontâneo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleCopyEmail()}
                    className="w-full sm:w-auto border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 hover:text-white"
                  >
                    {generalCopied ? (
                      <>
                        <Check className="h-4 w-4 mr-2 text-green-400" />
                        E-mail copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2 text-neutral-400" />
                        Copiar {RECRUITMENT_EMAIL}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            /* Lista de vagas abertas */
            <div className="space-y-6">
              {vacancies.map((vacancy) => {
                const isExpanded = expandedVacancyId === vacancy.id
                const isCopied = copiedVacancyId === vacancy.id

                return (
                  <Card
                    key={vacancy.id}
                    className="bg-neutral-950 border-neutral-800 overflow-hidden transition-all hover:border-neutral-700"
                  >
                    {/* Cabeçalho da vaga */}
                    <div className="p-6 sm:p-7">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge className="bg-[#FAB319] text-black font-semibold text-[11px] hover:bg-[#FAB319]">
                              Vaga Aberta
                            </Badge>
                            <Badge
                              variant="outline"
                              className="border-neutral-700 text-neutral-300 text-[11px] bg-neutral-900"
                            >
                              {vacancy.area}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="border-neutral-700 text-neutral-300 text-[11px] bg-neutral-900"
                            >
                              {vacancy.contract_type}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="border-[#FAB319]/40 text-[#FAB319] text-[11px] bg-[#FAB319]/10"
                            >
                              {vacancy.modality}
                            </Badge>
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold text-white">
                            {vacancy.title}
                          </h3>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setExpandedVacancyId(isExpanded ? null : vacancy.id)}
                          className="text-neutral-300 hover:text-white hover:bg-neutral-900 text-xs shrink-0 self-start md:self-auto"
                        >
                          {isExpanded ? (
                            <>
                              Ocultar detalhes <ChevronUp className="h-4 w-4 ml-1.5" />
                            </>
                          ) : (
                            <>
                              Ver descrição completa <ChevronDown className="h-4 w-4 ml-1.5" />
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Resumo da descrição (sempre visível) */}
                      <p className="text-sm text-neutral-300 leading-relaxed font-sans line-clamp-3 md:line-clamp-none">
                        {vacancy.description}
                      </p>
                    </div>

                    {/* Bloco expandido com responsabilidades e requisitos */}
                    {isExpanded && (
                      <div className="border-t border-neutral-800 bg-neutral-900/30 p-6 sm:p-7 space-y-6 animate-fade-in">
                        {vacancy.responsibilities && (
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FAB319]" />
                              Responsabilidades e Atividades
                            </h4>
                            <div className="text-xs md:text-sm text-neutral-300 leading-relaxed whitespace-pre-line pl-3.5 border-l border-neutral-800">
                              {vacancy.responsibilities}
                            </div>
                          </div>
                        )}

                        {vacancy.requirements && (
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FAB319]" />
                              Requisitos e Qualificações
                            </h4>
                            <div className="text-xs md:text-sm text-neutral-300 leading-relaxed whitespace-pre-line pl-3.5 border-l border-neutral-800">
                              {vacancy.requirements}
                            </div>
                          </div>
                        )}

                        {/* Bloco de Candidatura */}
                        <div className="mt-8 pt-6 border-t border-neutral-800 bg-black/60 rounded-xl p-5 sm:p-6 border border-neutral-800">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <p className="text-xs font-mono uppercase tracking-wider text-[#FAB319] mb-1">
                                Candidatura para esta vaga
                              </p>
                              <p className="text-sm font-semibold text-white mb-1">
                                Envie seu currículo diretamente para nossa coordenação
                              </p>
                              <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5 text-neutral-400" />
                                <span className="font-mono text-neutral-200">
                                  {RECRUITMENT_EMAIL}
                                </span>
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
                              <Button
                                type="button"
                                onClick={() => handleApplyMailto(vacancy.title)}
                                className="w-full sm:w-auto bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-xs h-10 px-5 shadow-sm"
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Enviar currículo
                              </Button>

                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleCopyEmail(vacancy.id)}
                                className="w-full sm:w-auto border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 hover:text-white text-xs h-10 px-4"
                              >
                                {isCopied ? (
                                  <>
                                    <Check className="h-4 w-4 mr-1.5 text-green-400" />
                                    E-mail copiado!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-4 w-4 mr-1.5 text-neutral-400" />
                                    Copiar e-mail
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                )
              })}

              {/* Bloco espontâneo secundário */}
              <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800/80 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left space-y-0.5">
                  <p className="text-sm font-semibold text-white">
                    Não encontrou a vaga ideal para o seu perfil?
                  </p>
                  <p className="text-xs text-neutral-400">
                    Você pode enviar seu currículo espontaneamente para{' '}
                    <strong className="text-neutral-200 font-mono">{RECRUITMENT_EMAIL}</strong>.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleCopyEmail()}
                  className="border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 hover:text-white text-xs shrink-0"
                >
                  {generalCopied ? 'E-mail copiado!' : 'Copiar e-mail para contato'}
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
