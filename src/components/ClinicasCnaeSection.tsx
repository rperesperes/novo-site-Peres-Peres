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

// 8 códigos da clínica (textos literais do briefing)
const CNAE_ROWS: CnaeRow[] = [
  {
    codigo: '8630-5/01',
    descricao:
      'Atividade médica ambulatorial com recursos para realização de procedimentos cirúrgicos',
    funcao: 'Atividade principal de clínica que realiza procedimento cirúrgico ambulatorial.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'com enquadramento conforme a atividade e o Fator R.',
      },
      {
        label: 'Lucro Presumido',
        text: 'com possibilidade de presunção reduzida, atendidos os requisitos do segundo subbloco.',
      },
      { label: 'Lucro Real', text: 'permitido.' },
    ],
    observacoes:
      'Exige estrutura compatível com a vigilância sanitária, e é essa estrutura que sustenta a análise de equiparação.',
    principal: true,
  },
  {
    codigo: '8630-5/02',
    descricao:
      'Atividade médica ambulatorial com recursos para realização de exames complementares',
    funcao: 'Atividade principal de clínica com exames próprios.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'com enquadramento conforme a atividade e o Fator R.',
      },
      {
        label: 'Lucro Presumido',
        text: 'com possibilidade de presunção reduzida, atendidos os requisitos do segundo subbloco.',
      },
      { label: 'Lucro Real', text: 'permitido.' },
    ],
    observacoes:
      'É o código mais associado ao reconhecimento de presunção reduzida, quando o serviço é prestado em contexto assistencial e não apenas como execução técnica. A Solução de Consulta 6.039 da SRRF06 trata especificamente dessa hipótese.',
    principal: true,
  },
  {
    codigo: '8630-5/03',
    descricao: 'Atividade médica ambulatorial restrita a consultas',
    funcao: 'Atividade principal de consultório que só realiza consulta.',
    regimes: [
      { label: 'Simples Nacional', text: 'com Fator R.' },
      { label: 'Lucro Presumido', text: 'com presunção de 32 por cento para IRPJ e CSLL.' },
      { label: 'Lucro Real', text: 'permitido.' },
    ],
    observacoes:
      'Consulta médica isolada é expressamente excluída do conceito de serviço hospitalar, e por isso não acessa a presunção reduzida.',
    principal: true,
  },
  {
    codigo: '8640-2/07',
    descricao:
      'Serviços de diagnóstico por imagem sem uso de radiação ionizante, exceto ressonância magnética',
    funcao: 'Complementar, para clínica que realiza imagem própria.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'com enquadramento conforme a atividade e o Fator R.',
      },
      {
        label: 'Lucro Presumido',
        text: 'com presunção reduzida possível, atendidos os requisitos.',
      },
      { label: 'Lucro Real', text: 'permitido.' },
    ],
    observacoes:
      'É atividade de auxílio diagnóstico e está no rol da RDC Anvisa 50 de 2002, o que a coloca na discussão da presunção reduzida.',
    principal: false,
  },
  {
    codigo: '8640-2/99',
    descricao:
      'Atividades de serviços de complementação diagnóstica e terapêutica não especificadas anteriormente',
    funcao: 'Complementar, para espirometria, função pulmonar, oxigenoterapia e exames congêneres.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes:
      'Atividade residual de complementação diagnóstica e terapêutica, uso sujeito a conferência do serviço efetivamente prestado.',
    principal: false,
  },
  {
    codigo: '8630-5/04',
    descricao: 'Atividade odontológica',
    funcao: 'Complementar, apenas se a clínica também presta serviço odontológico.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes: 'Exige profissional habilitado e responsável técnico próprio.',
    principal: false,
  },
  {
    codigo: '8630-5/99',
    descricao: 'Atividade médica ambulatorial não especificada anteriormente',
    funcao: 'Residual, só quando a atividade não couber em subclasse específica.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes:
      'Residual de uso restrito, conferir a vedação por atividade e a natureza do serviço antes de usar.',
    principal: false,
  },
  {
    codigo: '7020-4/00 e 8599-6/04',
    descricao: 'Consultoria em gestão empresarial e treinamento em desenvolvimento profissional',
    funcao: 'Complementar, para frente de consultoria e de educação em saúde.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes:
      'A natureza da receita é distinta da receita assistencial, e a segregação precisa existir na escrituração.',
    principal: false,
  },
]

// 2 caixas de destaque intermediárias (textos literais do briefing)
const DESTAQUES = [
  {
    title: 'A presunção reduzida exige três requisitos, e um deles não está no CNAE',
    text: 'Para aplicar 8 por cento no IRPJ e 12 por cento na CSLL no Lucro Presumido, a clínica precisa cumprir três condições cumulativas, na forma do artigo 15, parágrafo primeiro, inciso terceiro, alínea a, e parágrafo segundo, da Lei 9.249 de 1995. A primeira é estar organizada como sociedade empresária, de direito e de fato, com registro na Junta Comercial e caráter empresarial efetivo. A segunda é atender às normas da Anvisa. A terceira é prestar o serviço em efetivo contexto assistencial, com suporte clínico e integração ao processo diagnóstico-terapêutico do paciente, e não apenas a execução técnica do procedimento. Consultas médicas simples estão excluídas do conceito. É o entendimento da Solução de Consulta COSIT 213 de 2026, da Solução de Consulta COSIT 175 de 2019 e da Solução de Consulta 6.039 da SRRF06. O ponto prático: clínica registrada no conselho de classe e constituída como sociedade simples, que apenas cede profissionais, não tem o elemento de empresa que a norma exige, e nesse formato a presunção reduzida não se sustenta.',
  },
  {
    title: 'A presunção reduzida muda também o PIS e a COFINS',
    text: 'A equiparação não afeta só o IRPJ e a CSLL. No Lucro Real, com apuração não cumulativa, materiais aplicados diretamente em procedimentos de saúde podem gerar crédito quando forem essenciais ou relevantes para a prestação do serviço, conforme a orientação do Superior Tribunal de Justiça sobre o conceito de insumo. No regime cumulativo, como regra, não há crédito sobre insumos. Por isso a análise de equiparação e a de creditamento precisam ser feitas juntas: uma decisão sobre regime tomada apenas olhando a alíquota da guia costuma ignorar o crédito que o outro regime permitiria.',
  },
]

// 4 cartões de regimes tributários (textos literais do briefing)
const REGIMES_CARDS = [
  {
    title: 'Simples Nacional, com Fator R',
    text: 'A clínica em atividade médica é tributada pelo Anexo III quando a folha e o pró-labore alcançam 28 por cento da receita dos últimos 12 meses, e migra para o Anexo V abaixo disso. Como o cálculo é refeito todo mês, a decisão de contratar e o valor do pró-labore alteram a guia do mês seguinte. O limite é de 4,8 milhões de reais por ano, com sublimite de 3,6 milhões para o ISS na forma do artigo 13-A da Lei Complementar 123 de 2006. O ISS é recolhido fora do DAS, diretamente ao município.',
  },
  {
    title: 'Lucro Presumido, com dois cenários possíveis',
    text: 'Sem equiparação, a presunção é de 32 por cento para IRPJ e CSLL. Com equiparação reconhecida, cai para 8 por cento no IRPJ e 12 por cento na CSLL. A diferença na base de cálculo é de 75 por cento no IRPJ e de 62,5 por cento na CSLL, e é justamente por isso que o enquadramento precisa de documentação que o sustente: contrato social, alvará, notas fiscais, prontuários e registros assistenciais. IRPJ de 15 por cento mais adicional de 10 por cento sobre o que exceder 20 mil reais por mês, na forma do artigo 3º, parágrafo primeiro, da Lei 9.430 de 1996, CSLL de 9 por cento, PIS de 0,65 por cento e COFINS de 3 por cento no cumulativo, e ISS de 2 por cento a 5 por cento.',
  },
  {
    title: 'Lucro Real, onde o crédito aparece',
    text: 'Tributa o lucro efetivo, com PIS e COFINS não cumulativos de 9,25 por cento pela Lei 10.833 de 2003, IRPJ de 15 por cento mais adicional e CSLL de 9 por cento. Em clínica com folha alta, margem apertada e volume relevante de insumos, o não cumulativo pode compensar a alíquota maior, e é o regime em que a equiparação e o creditamento produzem o maior efeito conjunto. É obrigatório acima do limite do Presumido.',
  },
  {
    title: 'MEI, vedado',
    text: 'Medicina não consta das ocupações permitidas ao MEI no Anexo XI da Resolução CGSN 140 de 2018, e o regime pressupõe a condição de empresário individual. O caminho é pessoa física ou pessoa jurídica própria.',
  },
]

// 3 armadilhas mais comuns (textos literais do briefing)
const ARMADILHAS = [
  'Aplicar a presunção de 8 por cento tendo o código correto, mas sendo sociedade simples sem registro na Junta Comercial e sem estrutura empresarial.',
  'Faturar consulta e procedimento com o mesmo código, e tratar toda a receita como se tivesse o mesmo enquadramento.',
  'Reconhecer receita de convênio pelo valor faturado, e não pelo valor repassado após glosa, distorcendo a base de cálculo e o resultado.',
]

export function ClinicasCnaeSection() {
  return (
    <section
      id="cnae-equiparacao-regime"
      className="py-14 md:py-20 bg-neutral-50 border-b border-neutral-200"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="max-w-3xl mb-10">
          <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
            Enquadramento da clínica
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
            CNAE, equiparação hospitalar e regime tributário
          </h2>
        </div>

        {/* Parágrafo de abertura verbatim */}
        <p className="text-neutral-700 text-base md:text-lg leading-relaxed font-sans max-w-4xl mb-10">
          Na clínica, o código de atividade é o começo da análise, não o fim. O que decide quanto a
          clínica paga é a combinação entre o que ela faz de fato, o tipo societário que ela assumiu
          e o enquadramento tributário que disso resulta. Duas clínicas com o mesmo CNAE podem ter
          presunção de 8 por cento e de 32 por cento no Lucro Presumido, dependendo de como estão
          organizadas.
        </p>

        {/* SUBBLOCO 1: os códigos da clínica */}
        <h3 className="text-xl md:text-2xl font-sans font-bold text-black leading-snug mb-5">
          Os códigos da clínica
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
                    {row.principal && (
                      <span className="inline-block mt-2 text-[10px] uppercase tracking-wider font-semibold text-black bg-[#FAB319] px-1.5 py-0.5 rounded font-sans">
                        Atividade principal
                      </span>
                    )}
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

        {/* SUBBLOCOS 2 e 3: caixas de destaque, fundo escuro, detalhe dourado, textos verbatim */}
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
              <h3 className="text-lg md:text-xl font-sans font-bold text-white leading-snug">
                A equiparação não se presume
              </h3>
              <p className="text-base md:text-lg leading-relaxed font-sans text-neutral-100">
                Ela precisa corresponder à operação real, e é documentada com estrutura física,
                alvarás, contratos, notas, contabilidade e registros assistenciais. A verificação de
                enquadramento e dos requisitos de CNAE está incluída na abertura e na alteração de
                empresas.
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
