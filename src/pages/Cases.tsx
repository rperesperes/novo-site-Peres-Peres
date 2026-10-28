import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ShieldCheck,
  Briefcase,
  Building2,
  AlertTriangle,
  Wrench,
  Trophy,
  ArrowRight,
} from 'lucide-react'
import { REAL_CASES } from '@/lib/casesData'

export default function Cases() {
  return (
    <div className="bg-black text-neutral-100 min-h-screen py-16 md:py-24 font-sans selection:bg-[#FAB319] selection:text-black">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Cabeçalho da Seção de Casos */}
        <header className="mb-14 text-center max-w-3xl mx-auto animate-fade-in-up">
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
              <span>Responsabilidade Técnica: Rafael Peres Peres Nunes Altoé (CRC 027704/O)</span>
            </div>
          </div>
        </header>

        {/* Lista de Casos em Destaque (Cartões Próprios com 4 seções) */}
        <div className="space-y-12">
          {/* =========================================================
              CASO 1
             ========================================================= */}
          <Card className="border border-neutral-800 bg-neutral-900/95 text-neutral-100 shadow-xl overflow-hidden">
            <CardHeader className="p-6 md:p-8 border-b border-neutral-800 bg-neutral-950/60">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Badge className="bg-[#FAB319] text-black hover:bg-[#e0a116] text-xs font-bold font-mono px-3 py-1 uppercase tracking-wider">
                  CASO 1
                </Badge>
                <span className="text-xs text-neutral-400 font-mono">
                  Negociação e parcelamento de débitos tributários
                </span>
              </div>

              <CardTitle className="text-2xl md:text-3xl font-bold text-white leading-snug">
                CASO 1 — Negociação e parcelamento de débitos tributários
              </CardTitle>

              <div className="mt-3 p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/80 text-sm text-neutral-300">
                <span className="font-semibold text-white">Segmento:</span> clínica de estética e
                procedimentos estéticos, em operação desde 2008, com 15 colaboradores e prestadores
                — caso aplicável a qualquer segmento com passivo tributário acumulado.
              </div>
            </CardHeader>

            <CardContent className="p-6 md:p-8 space-y-8">
              {/* Contexto */}
              <section className="space-y-2.5">
                <div className="flex items-center gap-2.5 border-l-2 border-[#FAB319] pl-3">
                  <Building2 className="h-4 w-4 text-[#FAB319] shrink-0" />
                  <h2 className="text-lg md:text-xl font-bold text-white tracking-tight uppercase">
                    Contexto
                  </h2>
                </div>
                <p className="text-neutral-300 leading-relaxed text-base pl-3 md:pl-5">
                  Empresa em operação há mais de 15 anos, no Simples Nacional desde a fundação, sem
                  revisão periódica de enquadramento e sem acompanhamento financeiro, tributário e
                  de precificação. Operava sem análise comparativa de alternativas e recolhia
                  tributos por alíquota efetiva superior à necessária ao seu porte e à sua
                  atividade.
                </p>
              </section>

              {/* Desafio */}
              <section className="space-y-2.5 pt-4 border-t border-neutral-800/80">
                <div className="flex items-center gap-2.5 border-l-2 border-[#FAB319] pl-3">
                  <AlertTriangle className="h-4 w-4 text-[#FAB319] shrink-0" />
                  <h2 className="text-lg md:text-xl font-bold text-white tracking-tight uppercase">
                    Desafio
                  </h2>
                </div>
                <p className="text-neutral-300 leading-relaxed text-base pl-3 md:pl-5">
                  A empresa acumulou passivo tributário perante a União e o Distrito Federal, sem
                  qualquer renegociação ou parcelamento em curso. Somavam-se a isso declarações
                  atrasadas, com risco de exclusão de ofício do Simples Nacional (LC 123/2006, arts.
                  25 e 29), e três pendências de malha fiscal geradas por inconsistências entre o
                  declarado e o recolhido. O cenário elevava o risco de inscrição em dívida ativa e
                  de constrição patrimonial.
                </p>
              </section>

              {/* O que foi feito */}
              <section className="space-y-2.5 pt-4 border-t border-neutral-800/80">
                <div className="flex items-center gap-2.5 border-l-2 border-[#FAB319] pl-3">
                  <Wrench className="h-4 w-4 text-[#FAB319] shrink-0" />
                  <h2 className="text-lg md:text-xl font-bold text-white tracking-tight uppercase">
                    O que foi feito
                  </h2>
                </div>
                <p className="text-neutral-300 leading-relaxed text-base pl-3 md:pl-5">
                  Levantamento completo da situação fiscal, com análise de documentos contábeis,
                  guias de recolhimento e declarações apresentadas. Regularização integral das
                  declarações pendentes e solução das pendências de malha fiscal. Estruturação da
                  renegociação e do parcelamento dos débitos junto aos governos federal e distrital,
                  com prazo e valor de parcela compatibilizados ao fluxo de caixa da empresa, de
                  modo que a regularização não comprometesse a operação.
                </p>
              </section>

              {/* Resultado */}
              <section className="space-y-3 pt-4 border-t border-neutral-800/80">
                <div className="flex items-center gap-2.5 border-l-2 border-[#FAB319] pl-3">
                  <Trophy className="h-4 w-4 text-[#FAB319] shrink-0" />
                  <h2 className="text-lg md:text-xl font-bold text-white tracking-tight uppercase">
                    Resultado
                  </h2>
                </div>
                <div className="pl-3 md:pl-5 space-y-4">
                  <p className="text-neutral-300 leading-relaxed text-base">
                    Passivo de aproximadamente{' '}
                    <span className="inline-block font-bold text-black bg-[#FAB319] px-2.5 py-0.5 rounded shadow-sm">
                      R$ 4.000.000
                    </span>{' '}
                    convertido em parcelas compatíveis com o caixa, afastando o risco de inscrição
                    em dívida ativa e de constrição patrimonial. Eliminação das três pendências de
                    malha fiscal e do risco de exclusão de ofício. Emissão de guias mensais
                    regularizada, sem atrasos e sem multas.
                  </p>
                </div>
              </section>
            </CardContent>
          </Card>

          {/* =========================================================
              CASO 2
             ========================================================= */}
          <Card className="border border-neutral-800 bg-neutral-900/95 text-neutral-100 shadow-xl overflow-hidden">
            <CardHeader className="p-6 md:p-8 border-b border-neutral-800 bg-neutral-950/60">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Badge className="bg-[#FAB319] text-black hover:bg-[#e0a116] text-xs font-bold font-mono px-3 py-1 uppercase tracking-wider">
                  CASO 2
                </Badge>
                <span className="text-xs text-neutral-400 font-mono">Planejamento tributário</span>
              </div>

              <CardTitle className="text-2xl md:text-3xl font-bold text-white leading-snug">
                CASO 2 — Planejamento tributário: por que o Simples não era o regime mais barato
              </CardTitle>

              <div className="mt-3 p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/80 text-sm text-neutral-300">
                <span className="font-semibold text-white">Segmento:</span> clínicas médicas e de
                procedimentos na área da saúde. Caso exclusivo para esse setor.
              </div>
            </CardHeader>

            <CardContent className="p-6 md:p-8 space-y-8">
              {/* Contexto */}
              <section className="space-y-2.5">
                <div className="flex items-center gap-2.5 border-l-2 border-[#FAB319] pl-3">
                  <Building2 className="h-4 w-4 text-[#FAB319] shrink-0" />
                  <h2 className="text-lg md:text-xl font-bold text-white tracking-tight uppercase">
                    Contexto
                  </h2>
                </div>
                <p className="text-neutral-300 leading-relaxed text-base pl-3 md:pl-5">
                  Clínica de saúde que operava no Simples Nacional desde a fundação, por escolha
                  nunca revisada. A ausência de análise comparativa impedia saber se o regime
                  efetivamente correspondia à menor carga tributária possível para a atividade e o
                  porte da empresa.
                </p>
              </section>

              {/* Desafio */}
              <section className="space-y-2.5 pt-4 border-t border-neutral-800/80">
                <div className="flex items-center gap-2.5 border-l-2 border-[#FAB319] pl-3">
                  <AlertTriangle className="h-4 w-4 text-[#FAB319] shrink-0" />
                  <h2 className="text-lg md:text-xl font-bold text-white tracking-tight uppercase">
                    Desafio
                  </h2>
                </div>
                <p className="text-neutral-300 leading-relaxed text-base pl-3 md:pl-5">
                  A premissa comum no mercado é que o Simples Nacional é sempre o regime mais
                  econômico para pequenos negócios. Para clínicas, essa premissa falha por dois
                  motivos: a segregação de receitas e o fator R alteram significativamente a
                  alíquota efetiva (LC 123/2006, art. 18, §§ 5º-A e 5º-B), e o setor tem acesso a
                  benefício fiscal específico que o Simples não aproveita.
                </p>
              </section>

              {/* O que foi feito */}
              <section className="space-y-4 pt-4 border-t border-neutral-800/80">
                <div className="flex items-center gap-2.5 border-l-2 border-[#FAB319] pl-3">
                  <Wrench className="h-4 w-4 text-[#FAB319] shrink-0" />
                  <h2 className="text-lg md:text-xl font-bold text-white tracking-tight uppercase">
                    O que foi feito
                  </h2>
                </div>
                <div className="pl-3 md:pl-5 space-y-3.5 text-neutral-300 leading-relaxed text-base">
                  <p>
                    Simulação comparativa completa entre Simples Nacional, Lucro Presumido e Lucro
                    Real. O resultado apontou o Lucro Presumido como regime mais vantajoso.
                  </p>
                  <p>
                    A chave do caso foi identificar que a atividade da clínica se enquadra na
                    equiparação hospitalar, que autoriza presunção reduzida de 8% sobre a receita de
                    hospitalização, cirurgia e procedimentos ambulatoriais, com fundamento no art.
                    2º da Lei 7.450/1982, na Lei 12.101/2009 e na IN RFB 1.115/2012. Essa combinação
                    — Lucro Presumido mais equiparação hospitalar — é o que produz a economia, e não
                    o Lucro Presumido isolado.
                  </p>
                  <p>
                    Estruturação do plano de transição de regime, com segregação correta das
                    receitas e apuração da alíquota efetiva conforme a legislação do Simples no
                    período anterior à mudança.
                  </p>
                </div>
              </section>

              {/* Resultado */}
              <section className="space-y-4 pt-4 border-t border-neutral-800/80">
                <div className="flex items-center gap-2.5 border-l-2 border-[#FAB319] pl-3">
                  <Trophy className="h-4 w-4 text-[#FAB319] shrink-0" />
                  <h2 className="text-lg md:text-xl font-bold text-white tracking-tight uppercase">
                    Resultado
                  </h2>
                </div>
                <div className="pl-3 md:pl-5 space-y-3.5 text-neutral-300 leading-relaxed text-base">
                  <p>
                    Redução de aproximadamente{' '}
                    <span className="inline-block font-bold text-black bg-[#FAB319] px-2.5 py-0.5 rounded shadow-sm">
                      50%
                    </span>{' '}
                    da carga tributária em relação ao que vinha sendo recolhido no Simples Nacional,
                    com efeito direto na margem de lucro.
                  </p>
                  <p>
                    E o que o caso comprova, além do número: o regime mais barato é o que resulta da
                    simulação, não o mais popular. Para clínicas com receita e estrutura
                    compatíveis, o Lucro Presumido com equiparação hospitalar pode superar o Simples
                    com folga.
                  </p>
                </div>
              </section>
            </CardContent>
          </Card>
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
              (CRC 027704/O), com foco estrito em conformidade e segurança jurídica.
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
