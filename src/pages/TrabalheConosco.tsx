import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Briefcase,
  Award,
  ChevronDown,
  ChevronUp,
  Mail,
  Copy,
  Check,
  Target,
  CheckCircle2,
  FileCheck,
  Lightbulb,
  BookOpen,
  Share2,
} from 'lucide-react'
import { getPublicJobVacancies, type JobVacancyRecord } from '@/services/job_vacancies'

const ESSENTIAL_BEHAVIORS = [
  {
    title: 'Organização',
    description: 'Tarefa registrada, arquivo nomeado e entrega no prazo combinado.',
    icon: FileCheck,
    number: '01',
  },
  {
    title: 'Iniciativa (não é Autonomia ou Independência)',
    description: 'Propor soluções A ou B. Nunca apenas apontar o problema.',
    icon: Lightbulb,
    number: '02',
  },
  {
    title: 'Conhecimento',
    description: 'Fundamentação técnica antes da opinião, sempre com fonte.',
    icon: BookOpen,
    number: '03',
  },
  {
    title: 'Contribuição (interna e externa)',
    description: 'Compartilhar o que aprendeu com o caso para o restante da equipe.',
    icon: Share2,
    number: '04',
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
    <div className="bg-white text-neutral-900 min-h-screen py-16 md:py-24 font-sans selection:bg-[#FAB319] selection:text-black">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header institucional da página */}
        <div className="text-center mb-16 md:mb-20 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-black tracking-tight">
            Trabalhe na PERES PERES
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Somos um escritório de contabilidade e consultoria tributária em Brasília, com equipe
            enxuta e organização por cliente. Procuramos gente que gosta de entender o caso a fundo,
            de investigar o problema antes de responder, e que quer crescer pelo que entrega, não
            necessariamente pelo tempo de casa.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* BLOCO 1: NOSSA IDENTIDADE                                                 */}
        {/* ========================================================================= */}
        <section className="mb-20 md:mb-28">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-neutral-100 border border-neutral-200 text-black">
              <Target className="h-5 w-5 text-[#FAB319]" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-neutral-500 block">
                Diretrizes Estratégicas
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-black">Nossa Identidade</h2>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-5 rounded-xl bg-neutral-50/80 border border-neutral-200/80 hover:border-neutral-300 transition-all flex flex-col justify-start">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#FAB319]" />
                  <span className="text-xs font-mono uppercase tracking-wider font-bold text-black bg-[#FAB319]/20 text-[#855d00] px-2.5 py-0.5 rounded border border-[#FAB319]/30">
                    Propósito
                  </span>
                </div>
                <p className="text-sm md:text-base text-neutral-800 leading-relaxed font-sans">
                  Contribuir para o crescimento sustentável das empresas e dos sonhos por trás
                  delas.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-neutral-50/80 border border-neutral-200/80 hover:border-neutral-300 transition-all flex flex-col justify-start">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#FAB319]" />
                  <span className="text-xs font-mono uppercase tracking-wider font-bold text-black bg-[#FAB319]/20 text-[#855d00] px-2.5 py-0.5 rounded border border-[#FAB319]/30">
                    Visão
                  </span>
                </div>
                <p className="text-sm md:text-base text-neutral-800 leading-relaxed font-sans">
                  Ser escritório referência em consultoria contábil em nível Brasil até 2028.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-neutral-50/80 border border-neutral-200/80 hover:border-neutral-300 transition-all flex flex-col justify-start">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#FAB319]" />
                  <span className="text-xs font-mono uppercase tracking-wider font-bold text-black bg-[#FAB319]/20 text-[#855d00] px-2.5 py-0.5 rounded border border-[#FAB319]/30">
                    Valores
                  </span>
                </div>
                <p className="text-sm md:text-base text-neutral-800 leading-relaxed font-sans">
                  Comunicação clara, Confiança, Conhecimento técnico, Organização e
                  Profissionalismo.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-neutral-50/80 border border-neutral-200/80 hover:border-neutral-300 transition-all flex flex-col justify-start">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#FAB319]" />
                </div>
                <p className="text-sm md:text-base text-neutral-800 leading-relaxed font-sans">
                  Ouvir os empreendedores e estudar as melhores soluções.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-neutral-200 text-center sm:text-left bg-neutral-50 rounded-xl p-4 sm:p-5 border border-neutral-200 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#FAB319] shrink-0" />
              <p className="text-sm md:text-base font-semibold text-black tracking-tight">
                Quanto maior for o nosso objetivo, mais importante será o nosso time.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BLOCO 2: COMPORTAMENTOS ESSENCIAIS                                        */}
        {/* ========================================================================= */}
        <section className="mb-20 md:mb-28">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-lg bg-neutral-100 border border-neutral-200 text-black">
              <CheckCircle2 className="h-5 w-5 text-[#FAB319]" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-neutral-500 block">
                Critérios de Atuação
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-black">
                Comportamentos essenciais
              </h2>
            </div>
          </div>

          <p className="text-sm md:text-base text-neutral-600 mb-8 max-w-3xl leading-relaxed">
            São quatro, e é por eles que você será avaliado aqui.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ESSENTIAL_BEHAVIORS.map((behavior) => {
              const Icon = behavior.icon
              return (
                <Card
                  key={behavior.title}
                  className="bg-white border-neutral-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-neutral-300 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-black group-hover:border-[#FAB319] transition-colors">
                        <Icon className="h-5 w-5 text-[#FAB319]" />
                      </div>
                      <span className="text-xs font-mono font-bold text-neutral-400 group-hover:text-black transition-colors">
                        {behavior.number}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-black mb-2 leading-snug">
                      {behavior.title}
                    </h3>
                    <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
                      {behavior.description}
                    </p>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BLOCO 3: VAGAS ABERTAS E BANCO DE TALENTOS                                */}
        {/* ========================================================================= */}
        <section id="vagas" className="scroll-mt-24 mb-16 md:mb-20">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-neutral-100 border border-neutral-200 text-black">
                <Briefcase className="h-5 w-5 text-[#FAB319]" />
              </div>
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-neutral-500 block">
                  Oportunidades
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-black">
                  Posições abertas no escritório
                </h2>
              </div>
            </div>

            <Badge
              variant="outline"
              className="border-neutral-300 text-neutral-800 bg-neutral-100 px-3 py-1 text-xs"
            >
              {loading
                ? 'Consultando vagas...'
                : vacancies.length === 1
                  ? '1 vaga aberta'
                  : `${vacancies.length} vagas abertas`}
            </Badge>
          </div>

          {loading ? (
            <div className="p-12 text-center bg-white border border-neutral-200 rounded-2xl shadow-sm">
              <div className="h-6 w-6 border-2 border-[#FAB319] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-neutral-600">Carregando oportunidades disponíveis...</p>
            </div>
          ) : vacancies.length === 0 ? (
            /* Estado quando não há vagas abertas: convite espontâneo */
            <Card className="bg-white border-neutral-200 p-8 sm:p-10 text-center shadow-sm">
              <div className="max-w-xl mx-auto space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-black mx-auto">
                  <Award className="h-7 w-7 text-[#FAB319]" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-black">
                  Não temos vagas abertas no momento
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Mesmo sem posições imediatas divulgadas, estamos sempre atentos a profissionais
                  com brilho nos olhos e sólido rigor técnico para compor nosso banco de talentos.
                  Envie seu currículo com uma breve apresentação.
                </p>

                <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    type="button"
                    onClick={() => handleApplyMailto()}
                    className="w-full sm:w-auto bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold px-6 shadow-sm"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar currículo espontâneo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleCopyEmail()}
                    className="w-full sm:w-auto border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 hover:text-black"
                  >
                    {generalCopied ? (
                      <>
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                        E-mail copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2 text-neutral-500" />
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
                    className="bg-white border-neutral-200 overflow-hidden transition-all hover:border-neutral-300 shadow-sm hover:shadow-md"
                  >
                    {/* Cabeçalho da vaga */}
                    <div className="p-6 sm:p-7">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge className="bg-[#FAB319] text-black font-semibold text-[11px] hover:bg-[#FAB319] shadow-sm">
                              Vaga Aberta
                            </Badge>
                            <Badge
                              variant="outline"
                              className="border-neutral-300 text-neutral-700 text-[11px] bg-neutral-100"
                            >
                              {vacancy.area}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="border-neutral-300 text-neutral-700 text-[11px] bg-neutral-100"
                            >
                              {vacancy.contract_type}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="border-[#FAB319] text-neutral-900 font-medium text-[11px] bg-[#FAB319]/15"
                            >
                              {vacancy.modality}
                            </Badge>
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold text-black">
                            {vacancy.title}
                          </h3>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setExpandedVacancyId(isExpanded ? null : vacancy.id)}
                          className="text-neutral-700 hover:text-black hover:bg-neutral-100 text-xs shrink-0 self-start md:self-auto"
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
                      <p className="text-sm text-neutral-700 leading-relaxed font-sans line-clamp-3 md:line-clamp-none">
                        {vacancy.description}
                      </p>
                    </div>

                    {/* Bloco expandido com responsabilidades e requisitos */}
                    {isExpanded && (
                      <div className="border-t border-neutral-200 bg-neutral-50/70 p-6 sm:p-7 space-y-6 animate-fade-in">
                        {vacancy.responsibilities && (
                          <div>
                            <h4 className="text-sm font-semibold text-black mb-2 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FAB319]" />
                              Responsabilidades e Atividades
                            </h4>
                            <div className="text-xs md:text-sm text-neutral-700 leading-relaxed whitespace-pre-line pl-3.5 border-l-2 border-neutral-300">
                              {vacancy.responsibilities}
                            </div>
                          </div>
                        )}

                        {vacancy.requirements && (
                          <div>
                            <h4 className="text-sm font-semibold text-black mb-2 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FAB319]" />
                              Requisitos e Qualificações
                            </h4>
                            <div className="text-xs md:text-sm text-neutral-700 leading-relaxed whitespace-pre-line pl-3.5 border-l-2 border-neutral-300">
                              {vacancy.requirements}
                            </div>
                          </div>
                        )}

                        {/* Bloco de Candidatura */}
                        <div className="mt-8 pt-6 border-t border-neutral-200 bg-white rounded-xl p-5 sm:p-6 border border-neutral-200 shadow-sm">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <p className="text-xs font-mono uppercase tracking-wider text-[#b8800b] font-semibold mb-1">
                                Candidatura para esta vaga
                              </p>
                              <p className="text-sm font-semibold text-black mb-1">
                                Envie seu currículo diretamente para nossa coordenação
                              </p>
                              <p className="text-xs text-neutral-600 flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5 text-neutral-500" />
                                <span className="font-mono text-neutral-900 font-semibold">
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
                                className="w-full sm:w-auto border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 hover:text-black text-xs h-10 px-4"
                              >
                                {isCopied ? (
                                  <>
                                    <Check className="h-4 w-4 mr-1.5 text-green-600" />
                                    E-mail copiado!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-4 w-4 mr-1.5 text-neutral-500" />
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
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 text-center flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="text-left space-y-0.5">
                  <p className="text-sm font-semibold text-black">
                    Não encontrou a vaga ideal para o seu perfil?
                  </p>
                  <p className="text-xs text-neutral-600">
                    Você pode enviar seu currículo espontaneamente para{' '}
                    <strong className="text-neutral-900 font-mono">{RECRUITMENT_EMAIL}</strong>.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleCopyEmail()}
                  className="border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 hover:text-black text-xs shrink-0 shadow-sm"
                >
                  {generalCopied ? 'E-mail copiado!' : 'Copiar e-mail para contato'}
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* BLOCO DE ENCERRAMENTO                                                     */}
        {/* ========================================================================= */}
        <section className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 sm:p-8 text-left shadow-sm">
          <h3 className="text-lg md:text-xl font-bold text-black mb-3">
            Avaliamos capacidade de entrega antes de formação
          </h3>
          <p className="text-sm md:text-base text-neutral-700 leading-relaxed">
            Trabalhamos com um time enxuto, organizado por clientes e projetos, não por
            departamentos. Na prática, isso significa que o que conta aqui é a capacidade de
            resolver: rigor na apuração, organização documental, comunicação clara e vontade de
            estudar. Aceitamos graduação em andamento e formações de outras áreas, porque repertório
            diverso melhora a análise. O que não é negociável é o padrão técnico da entrega.
          </p>
        </section>
      </div>
    </div>
  )
}
