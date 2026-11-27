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

// 6 linhas da tabela da agência de viagem (textos literais do briefing)
// Linha 6 é "preparada": sem número de CNAE preenchido, aguardando o código validado.
const CNAE_ROWS: CnaeRow[] = [
  {
    codigo: '7911-2/00',
    descricao: 'Agências de viagens',
    funcao: 'Atividade principal da agência que vende viagem, pacote, reserva de hotel e passagem.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'pelo Anexo III, por força do artigo 18, parágrafo quinto-B, inciso terceiro, da Lei Complementar 123 de 2006, com a redação dada pela Lei Complementar 147 de 2014.',
      },
      { label: 'Lucro Presumido', text: 'permitido.' },
      { label: 'Lucro Real', text: 'permitido.' },
    ],
    observacoes:
      'Até 2014 a atividade estava vedada ao Simples Nacional, e muitas agências antigas nunca refizeram a comparação de regime depois da mudança.',
    principal: true,
  },
  {
    codigo: '7912-1/00',
    descricao: 'Operadores turísticos',
    funcao:
      'Atividade principal de quem monta o pacote, combinando transporte, hospedagem, alimentação e atividades no destino.',
    regimes: [
      {
        label: '',
        text: 'Os mesmos da linha anterior, pela mesma base legal.',
      },
    ],
    observacoes:
      'Quem vende o próprio pacote tem receita de natureza diferente de quem apenas intermedeia, e essa diferença precisa aparecer na escrituração.',
    principal: true,
  },
  {
    codigo: '7990-2/00',
    descricao: 'Serviços de reservas e outros serviços de turismo não especificados anteriormente',
    funcao: 'Complementar, para reserva e serviço de apoio ao viajante.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes:
      'Código de apoio ao viajante, usado quando a atividade não se enquadra nas linhas anteriores.',
    principal: false,
  },
  {
    codigo: '7911-2/00 combinado com 8599-6/04',
    descricao: 'Treinamento em desenvolvimento profissional',
    funcao: 'Complementar, para agência que também vende treinamento e capacitação.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes: 'A receita de treinamento é serviço próprio, e não repasse.',
    principal: false,
  },
  {
    codigo: '7490-1/99',
    descricao: 'Outras atividades profissionais, científicas e técnicas',
    funcao: 'Residual, para serviço de assessoria e planejamento não classificado.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes: 'Código residual deve ser exceção, não regra.',
    principal: false,
  },
  {
    codigo: 'Código de transporte, quando a agência opera transporte próprio de passageiros',
    descricao: '',
    funcao: 'Complementar, só quando há frota própria.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes:
      'O transporte fretado por terceiro não gera esse código para a agência. Linha preparada, aguardando o código validado.',
    principal: false,
  },
]

// 2 caixas de destaque intermediárias (textos literais do briefing)
const DESTAQUES = [
  {
    title: 'A base do ISS é o preço do serviço, e isso inclui o que não é seu',
    text: 'A agência recebe do cliente o valor da passagem e do pacote e repassa ao fornecedor. A comissão é a receita própria. Ainda assim, a base de cálculo do ISS é o preço do serviço, na forma do artigo 7º da Lei Complementar 116 de 2003, e há projetos de lei complementar em tramitação para restringir essa base à comissão recebida e ao valor agregado pela agência ao custo, entre eles o Projeto de Lei Complementar 365 de 2017 e o 154 de 2019, nenhum deles aprovado. Enquanto isso não muda, a agência paga ISS sobre valor que apenas transita pelo seu caixa. É a principal distorção do setor, e entender isso muda a leitura do fluxo de caixa, não apenas a da guia.',
  },
  {
    title: 'O cadastro no Cadastur não é opcional',
    text: 'A prestação de serviços turísticos depende de inscrição no Cadastro de Prestadores de Serviços Turísticos, o Cadastur, no Ministério do Turismo, conforme a Lei 11.771 de 2008. Agência sem inscrição regular tem restrição para contratar com órgãos públicos, para operar determinados produtos e para acessar linhas de crédito do setor. O CNAE correto não substitui essa inscrição, e a escrituração precisa refletir a atividade que a agência efetivamente exerce.',
  },
]

// 4 cartões de regimes tributários (textos literais do briefing)
const REGIMES_CARDS = [
  {
    title: 'MEI, verificar antes de assumir',
    text: 'A atividade de agência de viagem exige estrutura, inscrição no Cadastur e movimentação de valores de terceiros incompatível com o regime unipessoal simplificado. Antes de qualquer decisão, é preciso conferir a lista de ocupações do Anexo XI da Resolução CGSN 140 de 2018, porque o rol é restritivo e a atividade não se acomoda nele com naturalidade.',
  },
  {
    title: 'Simples Nacional, Anexo III',
    text: 'Agência de viagem e turismo está no artigo 18, parágrafo quinto-B, inciso terceiro, da Lei Complementar 123 de 2006, e é tributada pelo Anexo III, sem Fator R. A inclusão veio com a Lei Complementar 147 de 2014, com efeitos a partir de 2015, e é por isso que agências abertas antes disso costumam nunca ter simulado o Simples. O limite é de 4,8 milhões de reais por ano, do artigo 3º, inciso segundo, com sublimite de 3,6 milhões para ISS na forma do artigo 13-A. O ISS é recolhido fora do DAS.',
  },
  {
    title: 'Lucro Presumido, com atenção ao tipo de receita',
    text: 'Presunção de 32% para IRPJ e CSLL na receita de prestação de serviço, na forma do artigo 15, parágrafo primeiro, inciso terceiro, alínea a, e do artigo 20 da Lei 9.249 de 1995. A receita de intermediação é serviço e não se confunde com revenda de mercadoria, o que afasta a presunção de 8%. IRPJ de 15% mais adicional de 10% sobre o que exceder 20 mil reais por mês, na forma do artigo 3º, parágrafo primeiro, da Lei 9.430 de 1996, CSLL de 9%, PIS de 0,65% e COFINS de 3% no cumulativo, e ISS de 2% a 5% sobre o preço do serviço. Vedações no artigo 13, inciso primeiro, e no artigo 14 da Lei 9.718 de 1998.',
  },
  {
    title: 'Lucro Real, obrigatório acima do limite do Presumido',
    text: 'Tributa o lucro efetivo, com PIS e COFINS não cumulativos de 9,25% pela Lei 10.833 de 2003, IRPJ de 15% mais adicional e CSLL de 9%. Em agência com margem baixa e volume alto de repasse, é o regime que mostra o resultado real, e é onde a separação entre receita própria e repasse faz mais diferença na apuração.',
  },
]

// 3 armadilhas mais comuns (textos literais do briefing)
const ARMADILHAS = [
  'Lançar o valor total da passagem e do pacote como receita própria, inflando a base do Simples, do Presumido e do ISS.',
  'Somar receita de intermediação e receita de operação própria numa base única, quando têm naturezas distintas.',
  'Operar sem inscrição regular no Cadastur, e descobrir a restrição no momento de contratar com cliente público ou de acessar crédito do setor.',
]

export function AgenciasViagemCnaeSection() {
  return (
    <section
      id="cnae-regime-iss"
      className="py-14 md:py-20 bg-neutral-50 border-b border-neutral-200"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="max-w-3xl mb-10">
          <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
            Enquadramento da agência de viagem
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
            CNAE, regime tributário e ISS
          </h2>
        </div>

        {/* Parágrafo de abertura verbatim */}
        <p className="text-neutral-700 text-base md:text-lg leading-relaxed font-sans max-w-4xl mb-10">
          Na agência de viagem, o CNAE e o regime tributário são apenas parte do problema. O ponto
          que mais afeta o caixa é a base de cálculo do ISS, porque a agência movimenta valores que
          não são dela. Antes de qualquer decisão de regime, é preciso separar o que é receita
          própria e o que é repasse ao fornecedor.
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
                    {row.descricao && (
                      <span className="block text-xs md:text-sm text-neutral-700 leading-relaxed font-sans mt-1">
                        {row.descricao}
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
              <h3 className="text-lg md:text-xl font-sans font-bold text-white leading-snug">
                Código escolhido sem conferência aparece na fiscalização, não na abertura
              </h3>
              <p className="text-base md:text-lg leading-relaxed font-sans text-neutral-100">
                A verificação de enquadramento e dos requisitos de CNAE está incluída na abertura e
                na alteração de empresas.
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
