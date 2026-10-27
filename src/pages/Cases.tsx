import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Scale, FileText, CheckCircle2, AlertCircle } from 'lucide-react'

export default function Cases() {
  const steps = [
    {
      num: '01',
      title: 'Auditoria Documental e Levantamento Contábil',
      desc: 'Mapeamento detalhado dos arquivos SPED (EFD-ICMS/IPI, EFD-Contribuições, ECF) e demonstrações contábeis para identificar inconsistências e oportunidades de conformidade.',
    },
    {
      num: '02',
      title: 'Cruzamento com Fontes Normativas Oficiais',
      desc: 'Análise de aderência à legislação federal, estadual e distrital, confrontada com precedentes consolidados e atos normativos publicados pela Receita Federal do Brasil.',
    },
    {
      num: '03',
      title: 'Emissão de Parecer Técnico Fundamentado',
      desc: 'Elaboração de relatório estritamente técnico, sem promessas de resultado fictícias, detalhando cenários de segurança jurídica e mitigação de riscos fiscais.',
    },
    {
      num: '04',
      title: 'Execução e Acompanhamento Procedimental',
      desc: 'Retificação ou transmissão de obrigações acessórias, elaboração de impugnações administrativas fundamentadas e monitoramento contínuo das alterações da jurisprudência.',
    },
  ]

  const pillars = [
    {
      title: 'Precedentes Vinculantes do STF e STJ',
      desc: 'Atuação pautada em teses com repercussão geral fixada pelo Supremo Tribunal Federal (ex.: Tema 69) e recursos repetitivos do Superior Tribunal de Justiça.',
    },
    {
      title: 'Atos Normativos e Soluções de Consulta COSIT',
      desc: 'Aplicação das interpretações emitidas pela Coordenação-Geral de Tributação da Receita Federal com eficácia vinculante em relação à fiscalização federal.',
    },
    {
      title: 'Jurisprudência Administrativa do CARF',
      desc: 'Observância às súmulas vinculantes vigentes do Conselho Administrativo de Recursos Fiscais e orientações da Câmara Superior de Recursos Fiscais com número e verificação oficial.',
    },
    {
      title: 'Normas Brasileiras de Contabilidade (NBC)',
      desc: 'Rigor técnico respaldado pelos padrões e resoluções do Conselho Federal de Contabilidade (CFC), resguardando a higidez das demonstrações contábeis.',
    },
  ]

  return (
    <div className="py-24 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-16 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 border border-neutral-300 bg-neutral-100 px-3 py-1 rounded text-xs font-mono text-neutral-700 uppercase tracking-wider mb-4">
            <Scale className="h-3.5 w-3.5 text-neutral-900" />
            Compliance e Responsabilidade
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-black">
            Metodologia de Trabalho e Embasamento Legal
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Na <strong>PERES PERES Consultoria e Contabilidade</strong>, a segurança jurídica
            precede qualquer iniciativa. Não atuamos com promessas de economia pré-fixadas nem
            percentuais fictícios: toda diretriz resulta de auditoria técnica individualizada.
          </p>
        </div>

        {/* Aviso de Conduta Ética */}
        <div className="mb-16 p-6 rounded-lg border border-neutral-300 bg-neutral-50 flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-neutral-800 shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm text-neutral-700 leading-relaxed">
            <p className="font-serif font-semibold text-black text-base">
              Compromisso com o Código de Ética e o Manual de Comunicação
            </p>
            <p>
              O escritório não veicula casos anônimos com números inventados, percentuais de
              economia tributária descontextualizados ou citações jurisprudenciais sem verificação
              legal. Todo trabalho é estruturado a partir da realidade fática de cada empresa, sob
              responsabilidade técnica formal perante o Conselho Regional de Contabilidade (CRC
              027704/O).
            </p>
          </div>
        </div>

        {/* Metodologia Passo a Passo */}
        <div className="mb-20 space-y-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-black mb-3">
              Fluxo Metodológico de Atuação
            </h2>
            <p className="text-neutral-600 text-sm md:text-base">
              Etapas estruturadas para assegurar higidez fiscal e clareza documental em cada
              projeto.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {steps.map((step) => (
              <Card key={step.num} className="border border-neutral-200 shadow-sm bg-white">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 bg-black text-white rounded">
                      {step.num}
                    </span>
                    <CardTitle className="font-serif text-lg text-black">{step.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600 leading-relaxed">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pilares do Embasamento Normativo */}
        <div className="mb-20 space-y-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-black mb-3">
              Fontes de Embasamento Técnico e Normativo
            </h2>
            <p className="text-neutral-600 text-sm md:text-base">
              Fundamentos verificáveis que respaldam diagnósticos, consultas e procedimentos
              contábeis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {pillars.map((pillar, i) => (
              <div
                key={i}
                className="p-6 rounded-lg border border-neutral-200 bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-neutral-900 shrink-0" />
                    <h3 className="font-serif font-semibold text-black text-base">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chamada para Ação */}
        <div className="p-8 md:p-12 rounded-xl bg-black text-white text-center space-y-6 border border-neutral-800">
          <FileText className="h-10 w-10 text-neutral-300 mx-auto" />
          <div className="space-y-2 max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-white">
              Deseja submeter sua operação a um diagnóstico técnico?
            </h3>
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
              Realizamos análise preliminar de livros fiscais e estrutura societária com total
              confidencialidade e rigor profissional.
            </p>
          </div>
          {/* Ponto focal único: botão primário */}
          <div>
            <Button
              size="lg"
              className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-base px-8 h-12"
              asChild
            >
              <Link to="/contato">Agendar Análise Técnica</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
