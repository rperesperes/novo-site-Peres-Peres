import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Briefcase, ArrowRight, TrendingUp } from 'lucide-react'
import { SUCCESS_CASES, SuccessCase } from '@/lib/successCasesData'
import { ShareButtons } from '@/components/ShareButtons'
import { getPublicSuccessCases, SuccessCaseRecord } from '@/services/success_cases'

export default function Cases() {
  const [casesList, setCasesList] = useState<SuccessCase[]>(SUCCESS_CASES)

  useEffect(() => {
    let isMounted = true
    const loadFromDb = async () => {
      try {
        const records = await getPublicSuccessCases()
        if (isMounted && records && records.length > 0) {
          // Converter records da coleção para a estrutura SuccessCase esperada pelo template visual
          const mapped: SuccessCase[] = records.map((r: SuccessCaseRecord, index: number) => {
            const fallback = SUCCESS_CASES.find(
              (sc) => sc.slug === r.slug || sc.id === r.id || sc.caseNumber === index + 1,
            )
            const slug =
              r.slug ||
              fallback?.slug ||
              r.title
                .toLowerCase()
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
          })
          setCasesList(mapped)
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
    <div className="bg-white text-neutral-900 min-h-screen py-16 md:py-24 font-sans selection:bg-[#FAB319] selection:text-black">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Cabeçalho da Seção de Casos */}
        <header className="mb-12 text-center max-w-3xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 border border-neutral-300 bg-neutral-100 px-3.5 py-1.5 rounded text-xs font-mono text-neutral-800 uppercase tracking-wider mb-5">
            <Briefcase className="h-3.5 w-3.5 text-neutral-900" />
            Atuação Técnica Comprovada
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black tracking-tight">
            Casos de Sucesso
          </h1>

          {/* Parágrafo obrigatório sobre sigilo profissional e ausência de promessa de resultado */}
          <div className="p-5 md:p-6 rounded-xl border border-neutral-200 bg-neutral-50/80 text-left md:text-center space-y-3 shadow-sm">
            <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-sans">
              Os casos abaixo descrevem situações reais atendidas pelo escritório. Os nomes dos
              clientes são rigorosamente preservados por dever de sigilo profissional e em estrito
              respeito às normas éticas e à LGPD. Os resultados apresentados dependem das
              particularidades operacionais, fiscais e documentais de cada empresa, não constituindo
              promessa ou garantia de resultado futuro.
            </p>
            <div className="pt-2 border-t border-neutral-200 flex items-center justify-center gap-2 text-xs text-neutral-600">
              <ShieldCheck className="h-4 w-4 text-[#FAB319] shrink-0" />
              <span>Responsabilidade Técnica: Rafael Peres Peres Nunes Altoé (CRC 027704)</span>
            </div>
          </div>

          {/* Botões de compartilhamento no topo da página de lista */}
          <div className="mt-6 flex justify-center">
            <ShareButtons
              title="Casos de Sucesso | PERES PERES Consultoria & Contabilidade"
              url="https://peresperes.com.br/casos"
            />
          </div>
        </header>

        {/* Lista de Casos em Destaque: 1 Cartão por caso com Resumo, Benefícios e Botão para ler tudo */}
        <div className="space-y-8">
          {casesList.map((item) => (
            <Card
              key={item.id}
              className="border border-neutral-200 bg-white text-neutral-900 shadow-md hover:shadow-lg hover:border-neutral-300 transition-all overflow-hidden"
            >
              <CardHeader className="p-6 md:p-8 border-b border-neutral-200 bg-neutral-50/70">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <Badge className="bg-[#FAB319] text-black hover:bg-[#e0a116] text-xs font-bold font-mono px-3 py-1 uppercase tracking-wider shadow-sm">
                    {item.badgeText}
                  </Badge>
                  <span className="text-xs text-neutral-600 font-mono font-medium">
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

                <div className="mt-3 p-3.5 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-700">
                  <span className="font-semibold text-black">Segmento:</span> {item.segment}
                </div>
              </CardHeader>

              <CardContent className="p-6 md:p-8 space-y-6 bg-white">
                {/* Resumo do Caso (2-4 linhas) */}
                <div className="space-y-2">
                  <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                    Resumo do Caso
                  </h2>
                  <p className="text-base text-neutral-700 leading-relaxed">{item.summary}</p>
                </div>

                {/* Benefícios / Resultados Principais em Destaque */}
                <div className="pt-4 border-t border-neutral-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-900 font-bold">
                    <TrendingUp className="h-4 w-4 text-[#FAB319]" />
                    <span>Benefícios e Resultados em Destaque</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {item.highlightBenefits.map((benefit, bIdx) => (
                      <div
                        key={bIdx}
                        className="p-4 rounded-lg border border-neutral-200 bg-neutral-50/90 space-y-1.5"
                      >
                        <span className="text-xs text-neutral-600 font-mono block font-medium">
                          {benefit.label}
                        </span>
                        <div className="text-xl md:text-2xl font-bold text-black tracking-tight flex items-baseline gap-1">
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

                {/* Rodapé do Cartão: Botão para ler o caso completo */}
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
          ))}
        </div>

        {/* Bloco de Atendimento com ponto focal dourado #FAB319 */}
        <div className="mt-20 p-8 md:p-12 rounded-xl bg-neutral-950 text-white text-center space-y-6 border border-neutral-800 shadow-xl">
          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Submeta sua operação a uma avaliação técnica
            </h2>
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
              Análise preliminar individualizada sob responsabilidade formal de contador habilitado
              (CRC 027704), com foco estrito em conformidade e segurança jurídica.
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
