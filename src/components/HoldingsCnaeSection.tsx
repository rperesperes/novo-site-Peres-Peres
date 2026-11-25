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
}

// 6 linhas da tabela da holding (textos literais do briefing)
// Linha 5 é "preparada": sem número de CNAE preenchido, aguardando o código validado.
const CNAE_ROWS: CnaeRow[] = [
  {
    codigo: '6462-0/00',
    descricao: 'Holdings de instituições não financeiras',
    funcao:
      'Atividade principal de quem detém o controle de capital de um grupo de empresas com atividades preponderantemente não financeiras, com ou sem funções de gestão.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'vedado, por força do artigo 3º, parágrafo quarto, inciso sétimo, da Lei Complementar 123 de 2006, que impede a opção por quem participa do capital de outra pessoa jurídica.',
      },
      { label: 'Lucro Presumido', text: 'permitido.' },
      { label: 'Lucro Real', text: 'permitido.' },
    ],
    observacoes: 'É o código de holding de controle, e não de holding de renda.',
  },
  {
    codigo: '6463-8/00',
    descricao: 'Outras sociedades de participação, exceto holdings',
    funcao:
      'Atividade principal de quem detém participações societárias sem exercer controle sobre as investidas.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'vedado pela mesma razão.',
      },
      { label: 'Lucro Presumido', text: 'permitido.' },
      { label: 'Lucro Real', text: 'permitido.' },
    ],
    observacoes:
      'A diferença entre esta linha e a anterior é o controle, e ela importa mais para a governança do que para o tributo.',
  },
  {
    codigo: '6461-1/00',
    descricao: 'Holdings de instituições financeiras',
    funcao: 'Atividade principal de quem controla instituições predominantemente financeiras.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes:
      'Estrutura sujeita a regulação própria, e a análise tributária não se resolve só pelo CNAE.',
  },
  {
    codigo: '6810-2/02',
    descricao: 'Aluguel de imóveis próprios, quando a holding é imobiliária de renda',
    funcao: 'Atividade principal da holding patrimonial que vive de aluguel.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'vedado, por força do artigo 17, inciso décimo quinto, da Lei Complementar 123 de 2006, que veda a locação de imóveis próprios.',
      },
      {
        label: 'Lucro Presumido',
        text: 'permitido, com presunção de 32 por cento sobre a receita de aluguel, na forma do artigo 15, parágrafo primeiro, inciso terceiro, da Lei 9.249 de 1995.',
      },
      { label: 'Lucro Real', text: 'permitido.' },
    ],
    observacoes:
      'É o código mais comum em holding familiar de imóveis, e é justamente o que fecha a porta do Simples.',
  },
  {
    codigo:
      'Administração e gestão de patrimônio próprio, quando a holding apenas organiza bens sem alugar nem controlar empresas',
    descricao: '',
    funcao: 'Complementar.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes: 'Linha preparada, aguardando o código validado.',
  },
  {
    codigo: '7490-1/99',
    descricao: 'Outras atividades profissionais, científicas e técnicas',
    funcao: 'Residual, para serviço de assessoria e gestão não classificado.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes: 'Código residual deve ser exceção, não regra.',
  },
]

// 2 caixas de destaque intermediárias (textos literais do briefing)
const DESTAQUES = [
  {
    title: 'Duas travas, não uma, tiram a holding do Simples',
    text: 'A primeira trava está no artigo 3º, parágrafo quarto, inciso sétimo, da Lei Complementar 123 de 2006: quem participa do capital de outra pessoa jurídica não pode optar pelo Simples Nacional. Isso atinge toda holding de participação, porque deter cotas é a razão de existir dela. A segunda trava está no artigo 17, inciso décimo quinto, da mesma lei: locação de imóveis próprios é vedada ao Simples. Isso atinge a holding imobiliária de renda. As duas vedações são independentes, e uma holding que faz as duas coisas é barrada duas vezes. Na prática, quem abre holding contando com o Simples está contando com um regime que a lei não permite, e a descoberta costuma acontecer na primeira guia.',
  },
  {
    title: 'O que mudou no cálculo em 2026',
    text: 'Até 2025, a conta da holding se fazia quase toda sobre a economia de IRPF na distribuição de lucros. Desde 1º de janeiro de 2026, a Lei 15.270 de 2025 restabeleceu a incidência de imposto de renda retido na fonte de 10 por cento sobre lucros e dividendos pagos a pessoa física residente acima de 50 mil reais por mês, por empresa pagadora. Isso não elimina a holding, mas muda a aritmética: o cálculo precisa ser refeito com a regra vigente, e não com o modelo de isenção plena que vigorou por quase três décadas. Projeção feita antes de 2026 e nunca revista é o erro mais comum em estruturas patrimoniais.',
  },
]

// 4 cartões de regimes tributários (textos literais do briefing)
const REGIMES_CARDS = [
  {
    title: 'MEI, vedado',
    text: 'Holding não é ocupação permitida ao MEI, e o instituto pressupõe a condição de empresário individual e ausência de participação societária. Não existe holding MEI.',
  },
  {
    title: 'Simples Nacional, vedado em regra',
    text: 'As duas vedações do subbloco anterior barram a opção na maioria dos casos. Existem estruturas em que a atividade preponderante não é participação nem locação, e essas precisam ser avaliadas individualmente, porque a vedação é por atividade e não pelo nome da empresa. Presumir que a holding está fora do Simples sem verificar, ou presumir que está dentro sem verificar, são erros simétricos e ambos caros.',
  },
  {
    title: 'Lucro Presumido, o regime usual',
    text: 'Presunção de 32 por cento sobre a receita de aluguel, na forma do artigo 15, parágrafo primeiro, inciso terceiro, da Lei 9.249 de 1995, com IRPJ de 15 por cento mais adicional de 10 por cento sobre o que exceder 20 mil reais por mês, na forma do artigo 3º, parágrafo primeiro, da Lei 9.430 de 1996, CSLL de 9 por cento, PIS de 0,65 por cento e COFINS de 3 por cento no cumulativo. Vedações no artigo 13, inciso primeiro, e no artigo 14 da Lei 9.718 de 1998. É o regime mais usado em holding patrimonial, e o que costuma ser comparado com o cenário de manter o imóvel na pessoa física.',
  },
  {
    title: 'Lucro Real, quando a estrutura exige',
    text: 'Tributa o lucro efetivo, com PIS e COFINS não cumulativos de 9,25 por cento pela Lei 10.833 de 2003, IRPJ de 15 por cento mais adicional e CSLL de 9 por cento. Em holding com despesa relevante, depreciação de imóvel, juros de financiamento ou prejuízo acumulado, o Real pode ser melhor que o Presumido, e é obrigatório acima do limite do Presumido. Nesta escolha, a simulação com números reais da família é indispensável.',
  },
]

// 3 armadilhas mais comuns (textos literais do briefing)
const ARMADILHAS = [
  'Abrir holding para economizar imposto sem simular o cenário com a regra de 2026, comparando com a alternativa de manter o bem na pessoa física.',
  'Descobrir a vedação do Simples depois da abertura, quando o enquadramento já foi comunicado e a primeira guia já foi calculada no regime errado.',
  'Confundir holding de participação com holding de locação, e escolher o CNAE por analogia em vez de pela atividade efetiva, comprometendo a defesa em fiscalização.',
]

export function HoldingsCnaeSection() {
  return (
    <section
      id="cnae-vedacoes-regime"
      className="py-14 md:py-20 bg-neutral-50 border-b border-neutral-200"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="max-w-3xl mb-10">
          <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
            Enquadramento da holding
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
            CNAE, vedações e regime tributário
          </h2>
        </div>

        {/* Parágrafo de abertura (texto ajustado do briefing, sem travessão) */}
        <p className="text-neutral-700 text-base md:text-lg leading-relaxed font-sans max-w-4xl mb-10">
          Na holding, o código de atividade é a tradução cadastral de uma escolha societária. O
          efeito tributário depende do que a holding faz: se controla empresas, se apenas detém
          participação, se aluga imóvel próprio ou se administra patrimônio. O código precisa
          refletir essa escolha, porque é ela que define o regime possível e, no Simples Nacional,
          define também se a empresa pode optar.
        </p>

        {/* SUBBLOCO 1: os códigos da holding */}
        <h3 className="text-xl md:text-2xl font-sans font-bold text-black leading-snug mb-5">
          Os códigos da holding
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
                Holding não resolve problema contábil, resolve problema de organização patrimonial
              </h3>
              <p className="text-base md:text-lg leading-relaxed font-sans text-neutral-100">
                Estrutura montada apenas para reduzir tributo, sem finalidade econômica que a
                sustente, é exatamente o desenho que a fiscalização questiona.
              </p>
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
