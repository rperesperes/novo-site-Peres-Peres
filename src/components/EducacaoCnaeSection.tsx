import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ShieldCheck, ArrowRight } from 'lucide-react'

type RegimeNota = {
  label: string
  text: string
}

type CnaeRow = {
  codigo: string
  descricao: string
  funcao: string
  regimes: RegimeNota[]
  observacoes: string
  principal: boolean
}

// 8 códigos da educação (textos literais do briefing)
const CNAE_ROWS: CnaeRow[] = [
  {
    codigo: '8513-9/00',
    descricao: 'Ensino fundamental',
    funcao: 'Atividade principal de escola de ensino fundamental.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'pelo Anexo III, por força do artigo 18, parágrafo quinto-B, inciso primeiro, da Lei Complementar 123 de 2006, exceto nas hipóteses dos incisos segundo e terceiro do parágrafo quinto-D.',
      },
      { label: 'Lucro Presumido', text: 'permitido.' },
      { label: 'Lucro Real', text: 'permitido.' },
    ],
    observacoes:
      'A exceção do parágrafo quinto-D precisa ser conferida antes de optar pelo Simples, porque ela desloca a receita para outro anexo.',
    principal: true,
  },
  {
    codigo: '8512-1/00',
    descricao: 'Ensino pré-escolar',
    funcao: 'Atividade principal de creche e pré-escola.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'pelo Anexo III, pela mesma base legal.',
      },
    ],
    observacoes:
      'Creche e pré-escola estão expressamente no inciso primeiro do parágrafo quinto-B.',
    principal: true,
  },
  {
    codigo: '8520-1/00',
    descricao: 'Ensino médio',
    funcao: 'Atividade principal de escola de ensino médio.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'pelo Anexo III, pela mesma base legal.',
      },
    ],
    observacoes:
      'É a etapa final da educação básica, com o mesmo enquadramento das etapas anteriores.',
    principal: true,
  },
  {
    codigo: '8599-6/04',
    descricao: 'Treinamento em desenvolvimento profissional e gerencial',
    funcao: 'Atividade principal de empresa de treinamento corporativo e educação continuada.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'pelo Anexo III, porque cursos gerenciais e escolas livres estão no inciso primeiro do parágrafo quinto-B.',
      },
    ],
    observacoes:
      'É o código típico de curso livre e treinamento in company, e não de escola de educação básica.',
    principal: true,
  },
  {
    codigo: '8599-6/99',
    descricao: 'Outras atividades de ensino não especificadas anteriormente',
    funcao:
      'Complementar ou principal, para aulas particulares e curso livre não classificado em código específico.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'pelo Anexo III, pela mesma base legal.',
      },
    ],
    observacoes:
      'A nota oficial do IBGE exclui desta subclasse o ensino de esportes, dança, artes cênicas, música e idiomas, que têm códigos próprios.',
    principal: false,
  },
  {
    codigo: '8593-7/00',
    descricao: 'Ensino de idiomas',
    funcao: 'Atividade principal de escola de idiomas.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'pelo Anexo III, porque escolas de línguas estrangeiras estão expressamente no inciso primeiro do parágrafo quinto-B.',
      },
    ],
    observacoes: 'Idiomas têm subclasse própria e não devem usar o código residual.',
    principal: false,
  },
  {
    codigo: '8591-1/00',
    descricao: 'Ensino de esportes',
    funcao: 'Complementar, para escolinha e atividade esportiva.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes: 'Ensino de esporte não se confunde com academia, que tem código próprio.',
    principal: false,
  },
  {
    codigo: '8592-9/03 e 8592-9/01',
    descricao: 'Ensino de música e ensino de dança',
    funcao: 'Complementar, para escola de arte e cultura.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes:
      'Artes estão no inciso primeiro do parágrafo quinto-B, mas o enquadramento precisa ser confirmado pela atividade declarada.',
    principal: false,
  },
]

// 2 caixas de destaque intermediárias (textos literais do briefing)
const DESTAQUES = [
  {
    title: 'A natureza jurídica vem antes do código',
    text: 'Instituição de educação sem fins lucrativos que atenda aos requisitos do artigo 14 do Código Tributário Nacional pode ter imunidade sobre impostos, na forma do artigo 150, inciso sexto, alínea c, da Constituição Federal. Escola com fins lucrativos não tem essa imunidade, e a diferença entre as duas não está no CNAE: está no estatuto, na destinação do resultado e na escrituração. Entidade beneficente que atua em educação tem ainda certificação própria, com manutenção e comprovação contínua. Optar pelo Simples Nacional por conveniência de alíquota pode custar a imunidade, e essa análise vem antes de qualquer decisão de regime.',
  },
  {
    title: 'Uma escola costuma ter três receitas, não uma',
    text: 'Mensalidade, taxa de matrícula e material didático têm naturezas distintas. A receita de serviço educacional e a receita de comercialização de material têm tratamento tributário diferente, e no Lucro Presumido a diferença de presunção é grande: o serviço fica em 32 por cento e o comércio de material didático em 8 por cento. Somar tudo numa base única faz a escola pagar imposto sobre presunção que não se aplica. A segregação precisa existir na escrituração e no contrato, com o custo do material identificado separadamente. O mesmo raciocínio vale para a escola que também franqueia a marca: receita de franquia é serviço, e não se confunde com o fornecimento de material ao franqueado.',
  },
]

// 4 cartões de regimes tributários (textos literais do briefing)
const REGIMES_CARDS = [
  {
    title: 'MEI, vedado',
    text: 'Atividades de ensino de escola não constam das ocupações permitidas ao MEI no Anexo XI da Resolução CGSN 140 de 2018. A exceção é o professor autônomo que atua como pessoa física ou como empresário individual, hipótese distinta de escola, e o enquadramento precisa ser conferido porque a lista de ocupações é restritiva.',
  },
  {
    title: 'Simples Nacional, Anexo III',
    text: 'As atividades do artigo 18, parágrafo quinto-B, inciso primeiro, da Lei Complementar 123 de 2006 são tributadas pelo Anexo III, sem Fator R, exceto as hipóteses dos incisos segundo e terceiro do parágrafo quinto-D, que precisam ser verificadas. O limite é de 4,8 milhões de reais por ano, do artigo 3º, inciso segundo, com sublimite de 3,6 milhões para ICMS e ISS na forma do artigo 13-A. O ISS é recolhido fora do DAS, diretamente ao município.',
  },
  {
    title: 'Lucro Presumido, com segregação de receita',
    text: 'Presunção de 32 por cento para IRPJ e CSLL na receita de serviço educacional, e de 8 por cento na receita de comércio de material didático, na forma do artigo 15, parágrafo primeiro, inciso segundo, da Lei 9.249 de 1995, para a receita de revenda de mercadorias. IRPJ de 15 por cento mais adicional de 10 por cento sobre o que exceder 20 mil reais por mês, na forma do artigo 3º, parágrafo primeiro, da Lei 9.430 de 1996, CSLL de 9 por cento, PIS de 0,65 por cento e COFINS de 3 por cento no cumulativo, e ISS de 2 por cento a 5 por cento sobre a receita de serviço. Vedações no artigo 13, inciso primeiro, e no artigo 14 da Lei 9.718 de 1998.',
  },
  {
    title: 'Lucro Real, permitido e obrigatório acima do limite',
    text: 'Tributa o lucro efetivo, com PIS e COFINS não cumulativos de 9,25 por cento pela Lei 10.833 de 2003, IRPJ de 15 por cento mais adicional e CSLL de 9 por cento. Em instituição com folha docente alta e margem apertada, costuma ser o regime que revela o resultado real, e é onde a segregação de receita e o controle de receita antecipada fazem mais diferença.',
  },
]

// 3 armadilhas mais comuns (textos literais do briefing)
const ARMADILHAS = [
  'Somar mensalidade, matrícula e material didático numa base única, aplicando presunção de serviço a receita de mercadoria.',
  'Optar pelo Simples sem verificar se a opção afasta a imunidade da entidade sem fins lucrativos.',
  'Reconhecer receita de matrícula anual no momento do caixa, e não no momento da prestação do serviço, distorcendo o resultado do exercício.',
]

export function EducacaoCnaeSection() {
  return (
    <section
      id="cnae-regime-iss"
      className="py-14 md:py-20 bg-neutral-50 border-b border-neutral-200"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="max-w-3xl mb-10">
          <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
            Enquadramento da instituição de ensino
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
            CNAE, regime tributário e ISS
          </h2>
        </div>

        {/* Parágrafo de abertura verbatim */}
        <p className="text-neutral-700 text-base md:text-lg leading-relaxed font-sans max-w-4xl mb-10">
          Em educação, o código de atividade raramente é o problema principal. O que decide quanto a
          instituição paga é a natureza jurídica, com ou sem fins lucrativos, e a separação entre as
          receitas de natureza diferente que a escola costuma somar numa base só. Antes de escolher
          o CNAE, é preciso saber o que a instituição é e o que ela efetivamente cobra.
        </p>

        {/* SUBBLOCO 1: os códigos da educação */}
        <h3 className="text-xl md:text-2xl font-sans font-bold text-black leading-snug mb-5">
          Os códigos da educação
        </h3>

        <div className="overflow-x-auto rounded-xl border border-neutral-200 shadow-sm bg-white">
          <Table className="min-w-[760px] font-sans">
            <TableHeader>
              <TableRow className="bg-black hover:bg-black border-neutral-800">
                <TableHead className="text-white font-semibold text-xs md:text-sm w-[26%]">
                  Código e descrição
                </TableHead>
                <TableHead className="text-white font-semibold text-xs md:text-sm w-[20%]">
                  Função
                </TableHead>
                <TableHead className="text-white font-semibold text-xs md:text-sm w-[30%]">
                  Regimes
                </TableHead>
                <TableHead className="text-white font-semibold text-xs md:text-sm w-[24%]">
                  Observações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CNAE_ROWS.map((row) => (
                <TableRow key={row.codigo} className="align-top">
                  <TableCell className="align-top pt-4 pb-4">
                    <span className="block text-sm md:text-base font-bold text-black font-sans">
                      {row.codigo}
                    </span>
                    <span className="block text-xs md:text-sm text-neutral-700 leading-relaxed font-sans mt-1">
                      {row.descricao}
                    </span>
                  </TableCell>
                  <TableCell className="align-top pt-4 pb-4 text-xs md:text-sm text-neutral-600 leading-relaxed font-sans">
                    {row.funcao}
                  </TableCell>
                  <TableCell className="align-top pt-4 pb-4">
                    <ul className="space-y-1.5">
                      {row.regimes.map((regime, i) => (
                        <li
                          key={i}
                          className="text-xs md:text-sm text-neutral-600 leading-relaxed font-sans"
                        >
                          {regime.label && (
                            <span className="font-semibold text-black">{regime.label}: </span>
                          )}
                          {regime.text}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="align-top pt-4 pb-4 text-xs md:text-sm text-neutral-600 leading-relaxed font-sans">
                    {row.observacoes}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* SUBBLOCOS 2 e 3: caixas de destaque, textos verbatim */}
        {DESTAQUES.map((destaque, idx) => (
          <div
            key={idx}
            className="mt-10 bg-black text-white rounded-xl p-6 md:p-8 border-l-4 border-[#FAB319] shadow-md"
          >
            <div className="flex items-start gap-4">
              <ShieldCheck className="h-6 w-6 text-[#FAB319] shrink-0 mt-1" />
              <div className="space-y-3">
                <h3 className="text-lg md:text-xl font-sans font-bold text-white leading-snug">
                  {destaque.title}
                </h3>
                <p className="text-base md:text-lg leading-relaxed font-sans text-neutral-100">
                  {destaque.text}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* SUBBLOCO 4: regimes tributários, 4 cartões */}
        <div className="mt-12">
          <h3 className="text-xl md:text-2xl font-sans font-bold text-black leading-snug mb-6">
            Regimes tributários
          </h3>

          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {REGIMES_CARDS.map((card, idx) => (
              <div
                key={idx}
                className="border border-neutral-200 rounded-xl p-6 bg-white hover:border-neutral-300 transition-colors flex flex-col"
              >
                <h4 className="text-lg font-sans font-bold text-black leading-snug mb-3">
                  {card.title}
                </h4>
                <p className="text-sm text-neutral-600 leading-relaxed font-sans">{card.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SUBBLOCO 5: armadilhas */}
        <div className="mt-12">
          <h3 className="text-xl md:text-2xl font-sans font-bold text-black leading-snug mb-5">
            As três armadilhas mais comuns
          </h3>
          <ol className="space-y-3 max-w-4xl">
            {ARMADILHAS.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="shrink-0 h-6 w-6 rounded-full bg-black text-[#FAB319] text-xs font-bold flex items-center justify-center font-sans mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-sm md:text-base text-neutral-700 leading-relaxed font-sans">
                  {item}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Caixa final de destaque com link para o serviço de Abertura e Encerramento de Empresas */}
        <div className="mt-10 bg-black text-white rounded-xl p-6 md:p-8 border-l-4 border-[#FAB319] shadow-md">
          <div className="flex items-start gap-4">
            <ShieldCheck className="h-6 w-6 text-[#FAB319] shrink-0 mt-1" />
            <div className="space-y-4">
              <p className="text-base md:text-lg leading-relaxed font-sans text-neutral-100">
                Código escolhido sem conferência aparece na fiscalização, não na abertura. A
                verificação de enquadramento e dos requisitos de CNAE está incluída na abertura e na
                alteração de empresas.
              </p>
              <Link
                to="/servicos#servicos-avulsos"
                className="inline-flex items-center gap-1.5 text-sm md:text-base font-semibold text-[#FAB319] hover:text-[#e0a116] underline decoration-[#FAB319] decoration-2 underline-offset-4 font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAB319] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
              >
                Conheça o serviço de Abertura e Encerramento de Empresas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
