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

// 7 códigos da atividade médica (textos literais)
const CNAE_ROWS: CnaeRow[] = [
  {
    codigo: '8630-5/03',
    descricao: 'Atividade médica ambulatorial restrita a consultas',
    funcao: 'Atividade principal do consultório e da pessoa jurídica unipessoal do médico.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'permitido, com enquadramento de partida no Anexo III por força do artigo 18, parágrafo quinto-B, inciso sétimo, da Lei Complementar 123 de 2006, migrando para o Anexo V quando o Fator R ficar abaixo de 28 por cento, na forma do parágrafo quinto-M.',
      },
      {
        label: 'Lucro Presumido',
        text: 'permitido, com presunção de 32 por cento para o IRPJ e para a CSLL, porque consulta médica não se enquadra como serviço hospitalar.',
      },
      {
        label: 'Lucro Real',
        text: 'permitido.',
      },
    ],
    observacoes:
      'É o código que corresponde à consulta, e não ao procedimento ou ao exame. O ISS é o item 4.01 da lista anexa à Lei Complementar 116 de 2003, com alíquota de 2 por cento a 5 por cento definida pelo município.',
    principal: true,
  },
  {
    codigo: '8630-5/02',
    descricao:
      'Atividade médica ambulatorial com recursos para realização de exames complementares',
    funcao: 'Complementar, para consultório ou clínica que realiza exames próprios.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes:
      'É um dos códigos que pode dar acesso ao diferencial do subbloco seguinte, sobre presunção reduzida, se a clínica atender aos requisitos da RDC Anvisa 50 de 2002 e estiver organizada como sociedade empresária.',
    principal: false,
  },
  {
    codigo: '8630-5/01',
    descricao:
      'Atividade médica ambulatorial com recursos para realização de procedimentos cirúrgicos',
    funcao: 'Complementar, para clínica que realiza procedimentos ambulatoriais.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes:
      'Altera a estrutura exigida pela vigilância sanitária, e isso tem efeito na contabilidade de equipamentos, insumos e créditos.',
    principal: false,
  },
  {
    codigo: '8630-5/99',
    descricao: 'Atividade médica ambulatorial não especificada anteriormente',
    funcao: 'Residual, apenas quando a atividade não couber em outro código.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes:
      'Código residual deve ser exceção, não regra, porque não descreve o que a clínica faz e enfraquece a defesa em fiscalização.',
    principal: false,
  },
  {
    codigo: '7020-4/00',
    descricao: 'Consultoria em gestão empresarial, exceto consultoria técnica específica',
    funcao: 'Complementar, para frente de gestão ou consultoria em saúde.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes: 'Ver o aviso do terceiro subbloco, sobre forma societária.',
    principal: false,
  },
  {
    codigo: '8599-6/04',
    descricao: 'Treinamento em desenvolvimento profissional e gerencial',
    funcao: 'Complementar, para cursos, palestras e educação continuada em saúde.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes: 'Ver o aviso do terceiro subbloco.',
    principal: false,
  },
  {
    codigo: '7490-1/99',
    descricao: 'Outras atividades profissionais, científicas e técnicas',
    funcao: 'Residual, para serviço técnico não classificado.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes: 'Usar apenas quando não houver código específico.',
    principal: false,
  },
]

// 4 regimes tributários (textos literais)
const REGIMES_CARDS = [
  {
    title: 'MEI, vedado',
    text: 'A medicina não consta das ocupações permitidas ao MEI no Anexo XI da Resolução CGSN 140 de 2018, e o artigo 18-A da Lei Complementar 123 de 2006 exige a condição de empresário individual. Não existe médico MEI. Os caminhos são atuar como pessoa física ou constituir pessoa jurídica própria.',
  },
  {
    title: 'Simples Nacional, permitido com regras próprias',
    text: 'A medicina está no artigo 18, parágrafo quinto-B, inciso sétimo, da Lei Complementar 123 de 2006, e o enquadramento de partida é o Anexo III. O Fator R define a permanência: com folha igual ou superior a 28 por cento da receita dos últimos 12 meses, a atividade permanece no Anexo III; abaixo disso, migra para o Anexo V, na forma do parágrafo quinto-M. O cálculo é refeito mensalmente, então decisão de pró-labore e de contratação altera a guia do mês seguinte. O ISS é recolhido fora do DAS, diretamente ao município.',
  },
  {
    title: 'Lucro Presumido, permitido',
    text: 'Presunção de 32 por cento para IRPJ e para CSLL na consulta médica, com IRPJ de 15 por cento mais adicional de 10 por cento sobre o que exceder 20 mil reais por mês, CSLL de 9 por cento, PIS de 0,65 por cento e COFINS de 3 por cento no regime cumulativo, e ISS de 2 por cento a 5 por cento. A presunção reduzida de 8 por cento depende dos requisitos do subbloco anterior e não se aplica automaticamente. Vedações no artigo 13, inciso primeiro, e no artigo 14 da Lei 9.718 de 1998, incluindo receita acima de 78 milhões de reais no ano anterior e sócio residente no exterior.',
  },
  {
    title: 'Lucro Real, permitido',
    text: 'Tributa o lucro efetivo, com PIS e COFINS não cumulativos de 9,25 por cento na forma da Lei 10.833 de 2003, IRPJ de 15 por cento mais adicional e CSLL de 9 por cento. Costuma ser a melhor escolha em ano de margem comprimida, prejuízo, ou quando há muitas despesas dedutíveis e crédito de PIS e COFINS sobre insumos, e é obrigatório acima do limite do Lucro Presumido.',
  },
]

// 5 itens do checklist antes de abrir a pessoa jurídica (textos literais)
const CHECKLIST_ABERTURA = [
  'Definir se a atividade é consulta, procedimento ou exame, porque cada uma tem código e tratamento próprios.',
  'Verificar se a estrutura societária pretendida permite acessar a presunção reduzida no Lucro Presumido, antes de decidir o regime.',
  'Separar o código de CNAE do item de serviço usado para o ISS municipal.',
  'Conferir o registro no conselho de classe e o responsável técnico exigido pela vigilância sanitária.',
  'Simular o Simples com Fator R e o Presumido com a presunção correta, porque a comparação feita com a presunção errada inverte a conclusão.',
]

export function MedicosCnaeSection() {
  return (
    <section id="cnae-regime-iss" className="py-14 md:py-20 bg-white border-b border-neutral-200">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="max-w-3xl mb-10">
          <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
            Enquadramento da atividade médica
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
            CNAE, regime tributário e ISS
          </h2>
        </div>

        {/* Parágrafo de abertura verbatim */}
        <p className="text-neutral-700 text-base md:text-lg leading-relaxed font-sans max-w-4xl mb-10">
          O CNAE não define sozinho quanto o médico paga, e duas confusões aparecem com frequência
          na abertura da pessoa jurídica. A primeira é tratar o CNAE como se fosse o item de serviço
          usado pelo município para cobrar o ISS. A segunda é achar que todo serviço de saúde tem
          acesso à presunção reduzida do Lucro Presumido. Nenhuma das duas se sustenta.
        </p>

        {/* SUBBLOCO 1: os códigos da atividade médica */}
        <h3 className="text-xl md:text-2xl font-sans font-bold text-black leading-snug mb-5">
          Os códigos da atividade médica
        </h3>

        <div className="overflow-x-auto rounded-xl border border-neutral-200 shadow-sm">
          <Table className="min-w-[760px] font-sans">
            <TableHeader>
              <TableRow className="bg-black hover:bg-black border-neutral-800">
                <TableHead className="text-white font-semibold text-xs md:text-sm w-[26%]">
                  Código e descrição
                </TableHead>
                <TableHead className="text-white font-semibold text-xs md:text-sm w-[20%]">
                  Função (atividade principal ou complementar)
                </TableHead>
                <TableHead className="text-white font-semibold text-xs md:text-sm w-[30%]">
                  Regimes (Simples Nacional, Lucro Presumido e Lucro Real)
                </TableHead>
                <TableHead className="text-white font-semibold text-xs md:text-sm w-[24%]">
                  Observações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CNAE_ROWS.map((row) => (
                <TableRow
                  key={row.codigo}
                  aria-label={row.descricao}
                  data-area="Medicina"
                  data-funcao={row.principal ? 'atividade principal' : 'atividade complementar'}
                  className="align-top"
                >
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

        {/* SUBBLOCO 2: caixa de destaque, fundo escuro, detalhe dourado, texto verbatim */}
        <div className="mt-10 bg-black text-white rounded-xl p-6 md:p-8 border-l-4 border-[#FAB319] shadow-md">
          <div className="flex items-start gap-4">
            <ShieldCheck className="h-6 w-6 text-[#FAB319] shrink-0 mt-1" />
            <div className="space-y-3">
              <h3 className="text-lg md:text-xl font-sans font-bold text-white leading-snug">
                A presunção de 8 por cento não vale para consulta
              </h3>
              <p className="text-base md:text-lg leading-relaxed font-sans text-neutral-100">
                O percentual reduzido do Lucro Presumido é reservado a serviços hospitalares e a
                serviços de auxílio diagnóstico e terapia listados na Atribuição 4 da RDC Anvisa 50
                de 2002, e depende de a prestadora estar organizada como sociedade empresária e
                atender às normas da vigilância sanitária, na forma do artigo 15, parágrafo
                primeiro, inciso terceiro, alínea a, e parágrafo segundo, da Lei 9.249 de 1995. É o
                entendimento da Solução de Consulta Cosit 175 de 2019 e da Solução de Consulta Disit
                SRRF08 8001 de 2025. Consulta médica isolada não se enquadra nesse conceito, e a
                presunção aplicável é de 32 por cento. Para a CSLL, o percentual é de 12 por cento
                nas atividades com presunção de 8 por cento no IRPJ, e de 32 por cento nas demais,
                conforme o artigo 20 da mesma lei.
              </p>
            </div>
          </div>
        </div>

        {/* SUBBLOCO 3: a forma societária, texto verbatim */}
        <div className="mt-12">
          <h3 className="text-xl md:text-2xl font-sans font-bold text-black leading-snug mb-4">
            A forma societária muda o imposto antes do CNAE
          </h3>
          <p className="text-neutral-700 text-base md:text-lg leading-relaxed font-sans max-w-4xl">
            O parágrafo segundo do artigo 15 da Lei 9.249 de 1995 exige sociedade empresária para a
            presunção reduzida. Uma clínica organizada como sociedade simples, ainda que tenha os
            códigos corretos, pode não acessar o benefício. É a mesma lógica que faz o código de
            consultoria em gestão conviver mal com estruturas registradas em conselho de classe. Na
            prática, a decisão sobre o tipo societário, o registro no conselho e o CNAE precisa ser
            tomada em conjunto, e não em etapas separadas.
          </p>
        </div>

        {/* SUBBLOCO 4: regimes tributários, 4 cartões */}
        <div className="mt-12">
          <h3 className="text-xl md:text-2xl font-sans font-bold text-black leading-snug mb-6">
            Regimes tributários: o que é possível e o que não é
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

        {/* SUBBLOCO 5: checklist antes de abrir a pessoa jurídica */}
        <div className="mt-12">
          <h3 className="text-xl md:text-2xl font-sans font-bold text-black leading-snug mb-6">
            O que fazer antes de abrir a pessoa jurídica
          </h3>
          <ul className="space-y-4 max-w-4xl">
            {CHECKLIST_ABERTURA.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-0.5 h-6 w-6 rounded-full bg-[#FAB319] text-black text-xs font-bold flex items-center justify-center shrink-0 font-sans">
                  {idx + 1}
                </span>
                <span className="text-neutral-700 text-sm md:text-base leading-relaxed font-sans">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Caixa final de destaque com link para o serviço de Abertura e Encerramento de Empresas e para a página de Clínicas Médicas */}
        <div className="mt-10 bg-black text-white rounded-xl p-6 md:p-8 border-l-4 border-[#FAB319] shadow-md">
          <div className="flex items-start gap-4">
            <ShieldCheck className="h-6 w-6 text-[#FAB319] shrink-0 mt-1" />
            <div className="space-y-4">
              <p className="text-base md:text-lg leading-relaxed font-sans text-neutral-100">
                Código escolhido sem conferência aparece na fiscalização, não na abertura. A
                verificação de enquadramento e dos requisitos de CNAE está incluída na abertura e na
                alteração de empresas.
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  to="/servicos#servicos-avulsos"
                  className="inline-flex items-center gap-1.5 text-sm md:text-base font-semibold text-[#FAB319] hover:text-[#e0a116] underline decoration-[#FAB319] decoration-2 underline-offset-4 font-sans"
                >
                  Conheça o serviço de Abertura e Encerramento de Empresas
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contabilidade-para-clinicas-medicas"
                  className="inline-flex items-center gap-1.5 text-sm md:text-base font-semibold text-[#FAB319] hover:text-[#e0a116] underline decoration-[#FAB319] decoration-2 underline-offset-4 font-sans"
                >
                  Clínicas com estrutura hospitalar: a avaliação de equiparação hospitalar é tratada
                  no atendimento dedicado a clínicas médicas
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
