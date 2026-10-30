import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Briefcase, ArrowRight, TrendingUp } from 'lucide-react'
import { SUCCESS_CASES, SuccessCase } from '@/lib/successCasesData'
import { ShareButtons } from '@/components/ShareButtons'
import { getPublicSuccessCases, SuccessCaseRecord } from '@/services/success_cases'

import { useSeo } from '@/hooks/use-seo'

export default function Cases() {
  useSeo({
    title: 'Casos de Sucesso | PERES PERES Consultoria & Contabilidade',
    description:
      'Veja casos reais de consultoria tributária, recuperação de créditos e estruturação societária conduzidos pela PERES PERES Consultoria & Contabilidade.',
    canonical: 'https://peresperes.com.br/casos',
  })

  const [casesList, setCasesList] = useState<SuccessCase[]>(SUCCESS_CASES)

  useEffect(() => {
    let isMounted = true
    const loadFromDb = async () => {
      try {
        const records = await getPublicSuccessCases()
        if (!isMounted) return

        // Converter records do banco de dados
        const dbCases: SuccessCase[] = (records || []).map(
          (r: SuccessCaseRecord, index: number) => {
            const fallback = SUCCESS_CASES.find((sc) => sc.slug === r.slug || sc.id === r.id)
            const slug =
              r.slug ||
              fallback?.slug ||
              r.title
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '')

            const actionsParagraphs = r.actions_taken
              ? r.actions_taken.split(/\n\s*\n/).filter(Boolean)
              : fallback?.actionsTaken || []

            const resultParagraphs = r.result
              ? r.result.split(/\n\s*\n/).filter(Boolean)
              : fallback?.result.paragraphs || []

            return {
              id: r.id,
              caseNumber: r.display_order ?? index + 1,
              slug,
              badgeText:
                r.badge_text || fallback?.badgeText || `CASO ${r.display_order ?? index + 1}`,
              badgeSubtext: r.badge_subtext || fallback?.badgeSubtext || r.title,
              title: r.title,
              segment: r.segment || fallback?.segment || '',
              summary: r.highlight_phrase || fallback?.summary || r.context?.slice(0, 200) || '',
              highlightBenefits: fallback?.highlightBenefits || [
                {
                  label: 'Resultado Alcançado',
                  value: r.highlight_number || 'Comprovado',
                  description: r.highlight_phrase || 'Conformidade e segurança jurídica',
                },
              ],
              context: r.context || fallback?.context || '',
              challenge: r.challenge || fallback?.challenge || '',
              actionsTaken: actionsParagraphs,
              result: {
                highlightNumber: r.highlight_number || fallback?.result.highlightNumber,
                highlightPrefix: fallback?.result.highlightPrefix,
                highlightSuffix: fallback?.result.highlightSuffix,
                paragraphs: resultParagraphs,
              },
            }
          },
        )

        // Preservar casos estáticos que ainda não existam no banco por slug
        const dbSlugs = new Set(dbCases.map((c) => c.slug))
        const remainingStatic = SUCCESS_CASES.filter((sc) => !dbSlugs.has(sc.slug))

        const combined = [...dbCases, ...remainingStatic].sort(
          (a, b) => a.caseNumber - b.caseNumber,
        )

        if (combined.length > 0) {
          setCasesList(combined)
        }
      } catch (err) {
        console.warn('Fallback para casos estáticos locais:', err)
      }
    }
    loadFromDb()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="bg-white text-neutral-900 min-h-screen font-sans selection:bg-[#FAB319] selection:text-black">
      {/* Primeira seção completa com FUNDO PRETO — do topo até o botão de compartilhar */}
      <section className="bg-black text-white pt-16 pb-16 md:pt-20 md:pb-20 border-b border-neutral-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <header className="text-center max-w-3xl mx-auto animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white tracking-tight">
              Casos de <span className="text-[#FAB319]">Sucesso</span>
            </h1>

            {/* Parágrafo obrigatório sobre sigilo profissional e ausência de promessa de resultado */}
            <div className="p-5 md:p-6 rounded-xl border border-neutral-800 bg-neutral-900/90 text-left md:text-center space-y-3 shadow-lg">
              <p className="text-base md:text-lg text-neutral-300 leading-relaxed font-sans">
                Os casos abaixo descrevem situações reais atendidas pelo escritório. Os nomes dos
                clientes são rigorosamente preservados por dever de sigilo profissional e em estrito
                respeito às normas éticas e à LGPD. Os resultados apresentados dependem das
                particularidades operacionais, fiscais e documentais de cada empresa, não
                constituindo promessa ou garantia de resultado futuro.
              </p>
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-center gap-2 text-xs text-neutral-400">
                <ShieldCheck className="h-4 w-4 text-[#FAB319] shrink-0" />
                <span>Responsabilidade Técnica: Rafael Peres Peres Nunes Altoé (CRC 027704)</span>
              </div>
            </div>

            {/* Botões de compartilhamento no topo da página de lista */}
            <div className="mt-8 flex justify-center">
              <ShareButtons
                title="Casos de Sucesso | PERES PERES Consultoria & Contabilidade"
                url="https://peresperes.com.br/casos"
              />
            </div>
          </header>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl py-16 md:py-24">
        {/* Lista de Casos com layouts variados para evitar repetição visual */}
        <div className="space-y-12">
          {casesList.map((item, index) => {
            const variant = index % 3

            // VARIANTE 0: Formato Destaque Horizontal (2 Colunas: Metadados/Resumo à esquerda, Benefícios à direita)
            if (variant === 0) {
              return (
                <Card
                  key={item.id}
                  className="border border-neutral-200 bg-white text-neutral-900 shadow-md hover:shadow-xl hover:border-neutral-300 transition-all overflow-hidden rounded-2xl"
                >
                  <div className="grid md:grid-cols-12 gap-0">
                    <div className="p-6 md:p-8 md:col-span-7 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-200">
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5 mb-3">
                          <Badge className="bg-[#FAB319] text-black hover:bg-[#e0a116] text-xs font-bold font-mono px-3 py-1 uppercase tracking-wider shadow-sm">
                            {item.badgeText}
                          </Badge>
                          <span className="text-xs text-neutral-500 font-mono">
                            {item.badgeSubtext}
                          </span>
                        </div>

                        <CardTitle className="text-2xl md:text-3xl font-bold text-black leading-snug mb-3">
                          <Link
                            to={`/casos/${item.slug}`}
                            className="hover:text-neutral-700 transition-colors"
                          >
                            {item.title}
                          </Link>
                        </CardTitle>

                        <div className="inline-block px-3 py-1 rounded bg-neutral-100 text-xs text-neutral-700 mb-4 font-medium border border-neutral-200">
                          <span className="font-semibold text-black">Segmento:</span> {item.segment}
                        </div>

                        <div className="space-y-1.5 mb-6">
                          <h2 className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                            Resumo do Caso
                          </h2>
                          <p className="text-sm md:text-base text-neutral-700 leading-relaxed font-sans">
                            {item.summary}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                        <Button
                          asChild
                          className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold h-10 px-5 shadow-sm transition-all group"
                        >
                          <Link to={`/casos/${item.slug}`}>
                            <span>Ler o caso completo</span>
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>

                    <div className="p-6 md:p-8 md:col-span-5 bg-neutral-50/80 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-900 font-bold mb-4">
                          <TrendingUp className="h-4 w-4 text-[#FAB319]" />
                          <span>Métricas & Destaques</span>
                        </div>

                        <div className="space-y-3">
                          {item.highlightBenefits.map((benefit, bIdx) => (
                            <div
                              key={bIdx}
                              className="p-3.5 rounded-xl border border-neutral-200 bg-white space-y-1 shadow-sm"
                            >
                              <span className="text-[11px] text-neutral-500 font-mono block font-medium">
                                {benefit.label}
                              </span>
                              <div className="text-lg md:text-xl font-bold text-black tracking-tight">
                                <span className="text-[#c68c0c]">{benefit.value}</span>
                              </div>
                              {benefit.description && (
                                <p className="text-xs text-neutral-600 leading-relaxed">
                                  {benefit.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-200">
                        <Link
                          to={`/casos/${item.slug}`}
                          className="text-xs text-neutral-600 hover:text-black underline underline-offset-4 block text-center"
                        >
                          Ver detalhes técnicos e fundamentos
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            }

            // VARIANTE 1: Formato Compacto com Painel Superior de Resultados
            if (variant === 1) {
              return (
                <Card
                  key={item.id}
                  className="border border-neutral-200 bg-white text-neutral-900 shadow-md hover:shadow-xl hover:border-neutral-300 transition-all overflow-hidden rounded-2xl"
                >
                  <div className="bg-neutral-900 text-white p-5 md:p-6 border-b border-neutral-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <Badge className="bg-[#FAB319] text-black hover:bg-[#FAB319] text-xs font-bold font-mono px-3 py-1 uppercase tracking-wider">
                          {item.badgeText}
                        </Badge>
                        <span className="text-xs text-neutral-400 font-mono">
                          {item.badgeSubtext}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-300">
                        <span className="text-[#FAB319] font-mono">SEGMENTO:</span> {item.segment}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6 md:p-8 space-y-6">
                    <div className="max-w-3xl">
                      <CardTitle className="text-2xl md:text-3xl font-bold text-black leading-snug mb-3">
                        <Link
                          to={`/casos/${item.slug}`}
                          className="hover:text-neutral-700 transition-colors"
                        >
                          {item.title}
                        </Link>
                      </CardTitle>
                      <p className="text-base text-neutral-700 leading-relaxed">{item.summary}</p>
                    </div>

                    <div className="pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {item.highlightBenefits.map((benefit, bIdx) => (
                          <div
                            key={bIdx}
                            className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 hover:bg-neutral-50 transition-colors"
                          >
                            <span className="text-xs text-neutral-500 font-mono block mb-1">
                              {benefit.label}
                            </span>
                            <div className="text-xl font-bold text-black mb-1">
                              <span className="text-[#c68c0c]">{benefit.value}</span>
                            </div>
                            {benefit.description && (
                              <p className="text-xs text-neutral-600 leading-relaxed">
                                {benefit.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                      <Button
                        asChild
                        className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold h-11 px-6 shadow-sm transition-all group"
                      >
                        <Link to={`/casos/${item.slug}`}>
                          <span>Ler o caso completo</span>
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>

                      <Link
                        to={`/casos/${item.slug}`}
                        className="text-xs text-neutral-600 hover:text-black underline underline-offset-4 text-center sm:text-right"
                      >
                        Ver detalhes técnicos, contexto e fundamentos
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            }

            // VARIANTE 2: Formato Clássico com borda acentuada dourada à esquerda
            return (
              <Card
                key={item.id}
                className="border-l-4 border-l-[#FAB319] border-y border-r border-neutral-200 bg-white text-neutral-900 shadow-md hover:shadow-xl hover:border-neutral-300 transition-all overflow-hidden rounded-2xl"
              >
                <CardHeader className="p-6 md:p-8 border-b border-neutral-100 bg-white">
                  <div className="flex flex-wrap items-center gap-3 mb-2.5">
                    <Badge className="bg-[#FAB319] text-black hover:bg-[#e0a116] text-xs font-bold font-mono px-3 py-1 uppercase tracking-wider shadow-sm">
                      {item.badgeText}
                    </Badge>
                    <span className="text-xs text-neutral-500 font-mono font-medium">
                      {item.badgeSubtext}
                    </span>
                  </div>

                  <CardTitle className="text-2xl md:text-3xl font-bold text-black leading-snug">
                    <Link
                      to={`/casos/${item.slug}`}
                      className="hover:text-neutral-700 transition-colors"
                    >
                      {item.title}
                    </Link>
                  </CardTitle>

                  <p className="text-xs text-neutral-600 font-mono mt-1">
                    <strong className="text-black uppercase font-bold">Segmento atendido:</strong>{' '}
                    {item.segment}
                  </p>
                </CardHeader>

                <CardContent className="p-6 md:p-8 space-y-6 bg-white">
                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
                    <h2 className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold mb-1">
                      Resumo da Atuação
                    </h2>
                    <p className="text-base text-neutral-800 leading-relaxed">{item.summary}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-900 font-bold">
                      <TrendingUp className="h-4 w-4 text-[#FAB319]" />
                      <span>Resultados Alcançados</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      {item.highlightBenefits.map((benefit, bIdx) => (
                        <div
                          key={bIdx}
                          className="p-4 rounded-xl border border-neutral-200 bg-white shadow-sm space-y-1"
                        >
                          <span className="text-xs text-neutral-500 font-mono block font-medium">
                            {benefit.label}
                          </span>
                          <div className="text-xl md:text-2xl font-bold text-black tracking-tight">
                            <span className="text-[#c68c0c]">{benefit.value}</span>
                          </div>
                          {benefit.description && (
                            <p className="text-xs text-neutral-600 leading-relaxed">
                              {benefit.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <Button
                      asChild
                      className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold h-11 px-6 shadow-sm transition-all group"
                    >
                      <Link to={`/casos/${item.slug}`}>
                        <span>Ler o caso completo</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>

                    <Link
                      to={`/casos/${item.slug}`}
                      className="text-xs text-neutral-600 hover:text-black underline underline-offset-4 text-center sm:text-right"
                    >
                      Ver detalhes técnicos, contexto e fundamentos
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bloco de Atendimento com ponto focal dourado #FAB319 */}
        <div className="mt-20 p-8 md:p-12 rounded-xl bg-neutral-950 text-white text-center space-y-6 border border-neutral-800 shadow-xl">
          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Submeta seu negócio a uma avaliação técnica
            </h2>
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
              Análise preliminar individualizada sob responsabilidade formal de contador habilitado
              e equipe técnica multidisciplinar, com foco em conformidade e segurança jurídica.
            </p>
          </div>
          <div>
            <Link
              to="/contato"
              className="inline-flex items-center justify-center rounded-md text-sm font-semibold h-11 px-8 bg-[#FAB319] hover:bg-[#e0a116] text-black transition-colors"
            >
              Agendar Reunião
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
