import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, CheckCircle2, ShieldCheck, Scale, Search, FileCheck, Layers } from 'lucide-react'

export default function Cases() {
  const steps = [
    {
      num: '01',
      icon: Search,
      title: 'Diagnóstico Inicial e Levantamento de Escopo',
      desc: 'Compreensão aprofundada da estrutura societária, modelo operacional e histórico fiscal da empresa. Mapeamento das rotinas contábeis para identificar necessidades de conformidade e pontos de atenção perante a legislação.',
    },
    {
      num: '02',
      icon: Layers,
      title: 'Auditoria e Análise Documental Rigorosa',
      desc: 'Exame minucioso de arquivos digitais e escriturações (SPED Fiscal, EFD-Contribuições, ECD, ECF), notas fiscais, memórias de cálculo e livros contábeis, garantindo correspondência documental entre o fato contábil e a obrigação tributária.',
    },
    {
      num: '03',
      icon: Scale,
      title: 'Confronto com a Base Normativa Vigente',
      desc: 'Submissão de cada apontamento ao ordenamento jurídico aplicável: leis complementares, atos normativos e soluções de consulta da Receita Federal do Brasil, resoluções fazendárias e decisões judiciais transitadas em julgado com efeito vinculante.',
    },
    {
      num: '04',
      icon: FileCheck,
      title: 'Apresentação de Parecer Técnico Fundamentado',
      desc: 'Entrega de relatório formal instruído com fundamentação legal e contábil, detalhamento das memórias de cálculo, matriz de riscos e recomendações práticas para a tomada de decisão consciente da governança do cliente.',
    },
  ]

  const documents = [
    {
      title: 'Escriturações Digitais do SPED',
      desc: 'EFD-ICMS/IPI, EFD-Contribuições, ECD (Escrituração Contábil Digital) e ECF (Escrituração Contábil Fiscal) dos períodos pertinentes.',
    },
    {
      title: 'Documentos Fiscais Eletrônicos',
      desc: 'Arquivos XML de Notas Fiscais Eletrônicas (NF-e, NFS-e, CT-e) e respectivas ordens e memórias de lançamento contábil.',
    },
    {
      title: 'Demonstrações Financeiras e Contábeis',
      desc: 'Balanço Patrimonial, Demonstração do Resultado do Exercício (DRE), balancetes analíticos mensais e relatórios de conciliação.',
    },
    {
      title: 'Atos Societários e Contratos Específicos',
      desc: 'Contratos sociais, alterações consolidadas, estatutos e instrumentos jurídicos operacionais com relevância para a caracterização fiscal.',
    },
  ]

  const normativeBases = [
    {
      title: 'Legislação Federal, Estadual e Municipal',
      desc: 'Constituição Federal, Código Tributário Nacional (Lei nº 5.172/1966), leis complementares e leis ordinárias correlatas.',
    },
    {
      title: 'Atos e Soluções de Consulta da Receita Federal',
      desc: 'Instruções normativas vigentes e Soluções de Consulta da Coordenação-Geral de Tributação (COSIT) com eficácia vinculante em relação à administração tributária.',
    },
    {
      title: 'Jurisprudência com Precedente Vinculante',
      desc: 'Acórdãos do Supremo Tribunal Federal sob regime de repercussão geral e do Superior Tribunal de Justiça sob rito dos recursos repetitivos devidamente qualificados por número de tema.',
    },
    {
      title: 'Normas Brasileiras de Contabilidade (NBC)',
      desc: 'Padrões técnicos e resoluções emitidos pelo Conselho Federal de Contabilidade (CFC), resguardando fidedignidade e comparabilidade das demonstrações contábeis.',
    },
  ]

  return (
    <div className="py-24 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Cabeçalho Institucional */}
        <div className="mb-16 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 border border-neutral-300 bg-neutral-100 px-3 py-1 rounded text-xs font-mono text-neutral-700 uppercase tracking-wider mb-4">
            <Scale className="h-3.5 w-3.5 text-neutral-900" />
            Diretrizes e Metodologia de Trabalho
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-black">
            Metodologia e Embasamento Normativo
          </h1>
          <p className="text-lg md:text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed">
            Na <strong>PERES PERES Consultoria e Contabilidade</strong>, cada trabalho decorre de
            análise documental individualizada, rigorosa e conservadora. Não utilizamos percentuais
            pré-fixados nem promessas de resultado: nossa atuação é estritamente técnica, voltada à
            higidez fiscal e à segurança da governança.
          </p>
        </div>

        {/* Nota de Conduta e Responsabilidade Técnica */}
        <div className="mb-16 p-6 rounded-lg border border-neutral-300 bg-neutral-50 flex items-start gap-4">
          <ShieldCheck className="h-6 w-6 text-neutral-900 shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm text-neutral-700 leading-relaxed">
            <p className="font-serif font-semibold text-black text-base">
              Rigor Técnico e Responsabilidade Formal (CRC 027704/O)
            </p>
            <p>
              Em obediência ao Código de Ética Profissional do Contador e às normas regulatórias,
              nossos diagnósticos apoiam-se exclusivamente na escrituração e na documentação real da
              empresa, com fundamentação legal expressa e verificável. Não veiculamos casos anônimos
              fictícios, nem estimativas sem lastro contábil.
            </p>
          </div>
        </div>

        {/* Metodologia de Diagnóstico */}
        <div className="mb-20 space-y-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-black mb-3">
              Como o Escritório Conduz o Diagnóstico
            </h2>
            <p className="text-neutral-600 text-sm md:text-base">
              Etapas claras e auditáveis que orientam cada etapa do trabalho técnico.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <Card key={step.num} className="border border-neutral-200 bg-white shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 bg-black text-white rounded">
                        {step.num}
                      </span>
                      <Icon className="h-5 w-5 text-neutral-700" />
                      <CardTitle className="font-serif text-lg text-black">{step.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-neutral-700 leading-relaxed">{step.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Documentação Analisada */}
        <div className="mb-20 space-y-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-black mb-3">
              Documentos e Escriturações Analisados
            </h2>
            <p className="text-neutral-600 text-sm md:text-base">
              A verificação técnica apoia-se em fontes documentais primárias da empresa.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {documents.map((doc, i) => (
              <div
                key={i}
                className="p-6 rounded-lg border border-neutral-200 bg-white flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-neutral-900 shrink-0" />
                    <h3 className="font-serif font-semibold text-black text-base">{doc.title}</h3>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed">{doc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Base Normativa Utilizada */}
        <div className="mb-20 space-y-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-black mb-3">
              Fontes Normativas e Critérios Legais
            </h2>
            <p className="text-neutral-600 text-sm md:text-base">
              Fundamentos jurídicos e contábeis que sustentam nossas análises e pareceres.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {normativeBases.map((base, i) => (
              <div
                key={i}
                className="p-6 rounded-lg border border-neutral-200 bg-white flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-neutral-900 shrink-0" />
                    <h3 className="font-serif font-semibold text-black text-base">{base.title}</h3>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed">{base.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Apresentação do Resultado ao Cliente */}
        <div className="mb-20 p-8 rounded-xl border border-neutral-300 bg-neutral-50 space-y-4">
          <h2 className="text-2xl font-serif font-bold text-black">
            Como Apresentamos o Resultado ao Cliente
          </h2>
          <p className="text-sm md:text-base text-neutral-700 leading-relaxed">
            Ao final do diagnóstico, o cliente recebe um <strong>Parecer Técnico Conclusivo</strong>
            , acompanhado de:
          </p>
          <ul className="grid sm:grid-cols-2 gap-3 text-sm text-neutral-700 pt-2">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-900 mt-2 shrink-0" />
              <span>
                Demonstrativo pormenorizado das inconsistências documentais identificadas.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-900 mt-2 shrink-0" />
              <span>Memória de cálculo detalhada com base em critérios técnicos verificáveis.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-900 mt-2 shrink-0" />
              <span>
                Matriz de segurança jurídica e mitigação de contingências perante o Fisco.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-900 mt-2 shrink-0" />
              <span>
                Plano de ação formal para retificação ou regularização de obrigações acessórias.
              </span>
            </li>
          </ul>
        </div>

        {/* Ponto focal: Chamada para ação com botão #FAB319 */}
        <div className="p-8 md:p-12 rounded-xl bg-black text-white text-center space-y-6 border border-neutral-800">
          <FileText className="h-10 w-10 text-neutral-300 mx-auto" />
          <div className="space-y-2 max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-white">
              Submeta sua operação a um diagnóstico técnico individualizado
            </h3>
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
              Atendimento confidencial sob a responsabilidade técnica de Rafael Peres Peres Nunes
              Altoé (CRC 027704/O).
            </p>
          </div>
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
