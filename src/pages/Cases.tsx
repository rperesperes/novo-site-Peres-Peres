import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Briefcase, ArrowRight, TrendingUp } from 'lucide-react'
import { SUCCESS_CASES } from '@/lib/successCasesData'
import { REAL_CASES } from '@/lib/casesData'
import { ShareButtons } from '@/components/ShareButtons'

export default function Cases() {
  return (
    <div className="bg-black text-neutral-100 min-h-screen py-16 md:py-24 font-sans selection:bg-[#FAB319] selection:text-black">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Cabeçalho da Seção de Casos */}
        <header className="mb-12 text-center max-w-3xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 border border-neutral-700 bg-neutral-900/80 px-3.5 py-1.5 rounded text-xs font-mono text-neutral-300 uppercase tracking-wider mb-5">
            <Briefcase className="h-3.5 w-3.5 text-[#FAB319]" />
            Atuação Técnica Comprovada
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            Casos de Sucesso
          </h1>

          {/* Parágrafo obrigatório sobre sigilo profissional e ausência de promessa de resultado */}
          <div className="p-5 md:p-6 rounded-xl border border-neutral-800 bg-neutral-900/90 text-left md:text-center space-y-3 shadow-lg">
            <p className="text-base md:text-lg text-neutral-300 leading-relaxed font-sans">
              Os casos abaixo descrevem situações reais atendidas pelo escritório. Os nomes dos
              clientes são rigorosamente preservados por dever de sigilo profissional e em estrito
              respeito às normas éticas e à LGPD. Os resultados apresentados dependem das
              particularidades operacionais, fiscais e documentais de cada empresa, não constituindo
              promessa ou garantia de resultado futuro.
            </p>
            <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-center gap-2 text-xs text-neutral-400">
              <ShieldCheck className="h-4 w-4 text-[#FAB319] shrink-0" />
              <span>Responsabilidade Técnica: Rafael Peres Peres Nunes Altoé (CRC 027704)</span>
            </div>
          </div>

          {/* Botões de compartilhamento no topo da página de lista */}
          <div className="mt-6 flex justify-center">
            Responsabilidade Técnica: Rafael Peres Peres Nunes Altoé (CRC 027704)
          </div>
        </header>

        {/* Lista de Casos em Destaque: 1 Cartão por caso com Resumo, Benefícios e Botão para ler tudo */}
        <div className="space-y-8">
          {SUCCESS_CASES.map((item) => (
            <Card
              key={item.id}
              className="border border-neutral-800 bg-neutral-900/95 text-neutral-100 shadow-xl overflow-hidden hover:border-neutral-700 transition-colors"
            >
              <CardHeader className="p-6 md:p-8 border-b border-neutral-800 bg-neutral-950/60">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <Badge className="bg-[#FAB319] text-black hover:bg-[#e0a116] text-xs font-bold font-mono px-3 py-1 uppercase tracking-wider">
                    {item.badgeText}
                  </Badge>
                  <span className="text-xs text-neutral-400 font-mono">{item.badgeSubtext}</span>
                </div>

                <CardTitle className="text-2xl md:text-3xl font-bold text-white leading-snug">
                  <Link
                    to={`/casos/${item.slug}`}
                    className="hover:text-[#FAB319] transition-colors"
                  >
                    {item.title}
                  </Link>
                </CardTitle>

                <div className="mt-3 p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/80 text-sm text-neutral-300">
                  <span className="font-semibold text-white">Segmento:</span> {item.segment}
                </div>
              </CardHeader>

              <CardContent className="p-6 md:p-8 space-y-6">
                {/* Resumo do Caso (2-4 linhas) */}
                <div className="space-y-2">
                  <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                    Resumo do Caso
                  </h2>
                  <p className="text-base text-neutral-200 leading-relaxed">{item.summary}</p>
                </div>

                {/* Benefícios / Resultados Principais em Destaque */}
                <div className="pt-4 border-t border-neutral-800/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#FAB319]">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Benefícios e Resultados em Destaque</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {item.highlightBenefits.map((benefit, bIdx) => (
                      <div
                        key={bIdx}
                        className="p-4 rounded-lg border border-neutral-800 bg-neutral-950/70 space-y-1.5"
                      >
                        <span className="text-xs text-neutral-400 font-mono block">
                          {benefit.label}
                        </span>
                        <div className="text-xl md:text-2xl font-bold text-[#FAB319] tracking-tight">
                          {benefit.value}
                        </div>
                        {benefit.description && (
                          <p className="text-xs text-neutral-400 leading-relaxed">
                            {benefit.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rodapé do Cartão: Botão para ler o caso completo */}
                <div className="pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <Button
                    asChild
                    className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold h-11 px-6 shadow-md transition-all group"
                  >
                    <Link to={`/casos/${item.slug}`}>
                      <span>Ler o caso completo</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>

                  <Link
                    to={`/casos/${item.slug}`}
                    className="text-xs text-neutral-400 hover:text-neutral-200 underline underline-offset-4 text-center sm:text-right"
                  >
                    Ver detalhes técnicos, contexto e fundamentos
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Seção Adicional: Outros Casos de Atuação Técnica (mantendo o acervo existente) */}
        {REAL_CASES.length > 0 && (
          <div className="mt-20 pt-12 border-t border-neutral-800 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Outros Casos e Áreas de Atuação
              </h2>
              <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
                Exemplos de diagnósticos, levantamentos e reorganizações societárias conduzidos pela
                equipe técnica.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {REAL_CASES.map((caseItem) => (
                <Card
                  key={caseItem.id}
                  className="flex flex-col justify-between border border-neutral-800 bg-neutral-900/90 text-neutral-100 shadow-md hover:border-neutral-700 transition-colors"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge className="bg-neutral-800 text-neutral-200 border border-neutral-700 hover:bg-neutral-700 text-xs font-normal">
                        {caseItem.category}
                      </Badge>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {caseItem.dateFormatted}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-bold text-white leading-snug line-clamp-2">
                      <Link
                        to={`/casos/${caseItem.slug}`}
                        className="hover:text-[#FAB319] transition-colors"
                      >
                        {caseItem.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pb-4">
                    <p className="text-xs md:text-sm text-neutral-400 leading-relaxed line-clamp-2">
                      {caseItem.summary}
                    </p>
                  </CardContent>

                  <div className="p-6 pt-2 border-t border-neutral-800/80">
                    <Link
                      to={`/casos/${caseItem.slug}`}
                      className="inline-flex items-center text-xs font-semibold text-[#FAB319] hover:underline group"
                    >
                      Ver detalhes
                      <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Bloco de Atendimento com ponto focal amarelo #FAB319 */}
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
