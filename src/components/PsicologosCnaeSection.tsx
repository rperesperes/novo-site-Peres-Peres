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

// 4 códigos da atividade do psicólogo (textos literais)
const CNAE_ROWS: CnaeRow[] = [
  {
    codigo: '8650-0/03',
    descricao: 'Atividades de psicologia e psicanálise',
    funcao: 'Atividade principal da pessoa jurídica do psicólogo.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'permitido, com enquadramento de partida no Anexo III por força do artigo 18, parágrafo quinto-B, inciso vinte e um, da Lei Complementar 123 de 2006, migrando para o Anexo V quando o Fator R ficar abaixo de 28 por cento, na forma do parágrafo quinto-M.',
      },
      {
        label: 'Lucro Presumido',
        text: 'permitido, com presunção de 32 por cento para o IRPJ e para a CSLL.',
      },
      {
        label: 'Lucro Real',
        text: 'permitido.',
      },
    ],
    observacoes:
      'Este é o código da psicologia. O 8650-0/04 é fisioterapia e o 8650-0/02 é nutrição, e não devem ser usados por quem não exerce essas atividades.',
    principal: true,
  },
  {
    codigo: '7020-4/00',
    descricao: 'Consultoria em gestão empresarial',
    funcao: 'Complementar, para frente de consultoria organizacional.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes:
      'A consultoria organizacional não se confunde com a prática clínica, e a separação precisa aparecer na escrituração.',
    principal: false,
  },
  {
    codigo: '8599-6/04',
    descricao: 'Treinamento em desenvolvimento profissional e gerencial',
    funcao: 'Complementar, para cursos, palestras e supervisão.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes:
      'A supervisão de outros psicólogos costuma ser classificada aqui, e não como atendimento clínico.',
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
    observacoes: 'Código residual deve ser exceção, não regra.',
    principal: false,
  },
]

// 4 regimes tributários (textos literais)
const REGIMES_CARDS = [
  {
    title: 'MEI, vedado',
    text: 'A psicologia não consta das ocupações permitidas ao MEI no Anexo XI da Resolução CGSN 140 de 2018, com a redação da Resolução CGSN 165 de 2022, e o artigo 18-A da Lei Complementar 123 de 2006 exige a condição de empresário individual. Não existe psicólogo MEI. Os caminhos são atuar como pessoa física, constituir empresário individual ou abrir sociedade limitada, normalmente de sócio único.',
  },
  {
    title: 'Simples Nacional, permitido com regras próprias',
    text: 'A psicologia está no artigo 18, parágrafo quinto-B, inciso vinte e um, da Lei Complementar 123 de 2006, e o enquadramento de partida é o Anexo III. O Fator R decide a permanência: com folha igual ou superior a 28 por cento da receita dos últimos 12 meses, permanece no Anexo III; abaixo disso, migra para o Anexo V, na forma do parágrafo quinto-M. O cálculo é refeito mensalmente, então a decisão de quanto pagar de pró-labore altera a guia do mês seguinte. O ISS é recolhido fora do DAS, diretamente ao município.',
  },
  {
    title: 'Lucro Presumido, permitido',
    text: 'Presunção de 32 por cento para IRPJ e para CSLL, com IRPJ de 15 por cento mais adicional de 10 por cento sobre o que exceder 20 mil reais por mês, CSLL de 9 por cento, PIS de 0,65 por cento e COFINS de 3 por cento no regime cumulativo, e ISS de 2 por cento a 5 por cento. Vedações no artigo 13, inciso primeiro, e no artigo 14 da Lei 9.718 de 1998.',
  },
  {
    title: 'Lucro Real, permitido',
    text: 'Tributa o lucro efetivo, com PIS e COFINS não cumulativos de 9,25 por cento na forma da Lei 10.833 de 2003, IRPJ de 15 por cento mais adicional e CSLL de 9 por cento. Costuma ser a melhor escolha quando há muitas despesas dedutíveis, prejuízo ou margem comprimida, e é obrigatório acima do limite do Lucro Presumido.',
  },
]

// 5 itens do checklist antes de abrir a PJ (textos literais)
const CHECKLIST_ABERTURA = [
  'Confirmar que o CNAE escolhido é o 8650-0/03, e não um código vizinho de outra profissão da saúde.',
  'Verificar o registro da pessoa jurídica no Conselho Regional de Psicologia antes de assinar contrato com convênio ou escola.',
  'Separar o código de CNAE do item de serviço usado para o ISS municipal.',
  'Definir o pró-labore com base no Fator R, porque é ele que decide entre o Anexo III e o Anexo V.',
  'Simular o Simples com Fator R e o Presumido com presunção de 32 por cento antes de decidir o regime.',
]

export function PsicologosCnaeSection() {
  return (
    <section
      id="cnae-regime-iss"
      className="py-14 md:py-20 bg-neutral-50 border-b border-neutral-200"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="max-w-3xl mb-10">
          <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
            Enquadramento do consultório do psicólogo
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
            CNAE, regime tributário e ISS
          </h2>
        </div>

        {/* Parágrafo de abertura verbatim */}
        <p className="text-neutral-700 text-base md:text-lg leading-relaxed font-sans max-w-4xl mb-10">
          O CNAE não define sozinho quanto o psicólogo paga, e três confusões aparecem na abertura
          da pessoa jurídica. A primeira é usar o código de outra profissão da saúde, como
          fisioterapia ou nutrição, porque os códigos ficam próximos na lista. A segunda é tratar o
          CNAE como se fosse o item de serviço usado pelo município para cobrar o ISS. A terceira é
          esquecer que a pessoa jurídica que presta serviços de psicologia precisa de registro no
          Conselho Regional de Psicologia.
        </p>

        {/* SUBBLOCO 1: os códigos da atividade */}
        <h3 className="text-xl md:text-2xl font-sans font-bold text-black leading-snug mb-5">
          Os códigos da atividade
        </h3>

        <div className="overflow-x-auto rounded-xl border border-neutral-200 shadow-sm bg-white">
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
                  data-area="Psicologia"
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
                O registro no CRP vem antes do CNAE
              </h3>
              <p className="text-base md:text-lg leading-relaxed font-sans text-neutral-100">
                A pessoa jurídica que presta serviços de psicologia precisa de inscrição no Conselho
                Regional de Psicologia da jurisdição onde atua, por força da Resolução CFP 16 de
                2019, e a obrigação alcança também a sociedade limitada unipessoal. Sem esse
                registro, o CNPJ existe, emite nota e não está regular perante o conselho. Em muitos
                casos, o registro é condição para o convênio, para o contrato com escola e para o
                credenciamento em plano de saúde, e a falta dele aparece justamente no momento em
                que o cliente precisa do documento.
              </p>
            </div>
          </div>
        </div>

        {/* SUBBLOCO 3: regimes tributários, 4 cartões */}
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

        {/* SUBBLOCO 4: checklist antes de abrir a PJ, texto verbatim */}
        <div className="mt-12">
          <h3 className="text-xl md:text-2xl font-sans font-bold text-black leading-snug mb-5">
            O que fazer antes de abrir a pessoa jurídica
          </h3>
          <ol className="space-y-3 max-w-4xl">
            {CHECKLIST_ABERTURA.map((item, idx) => (
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
                className="inline-flex items-center gap-1.5 text-sm md:text-base font-semibold text-[#FAB319] hover:text-[#e0a116] underline decoration-[#FAB319] decoration-2 underline-offset-4 font-sans"
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
