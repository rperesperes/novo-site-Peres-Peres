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

// 5 linhas da tabela do e-commerce (textos literais do briefing)
// Linhas 2 a 5 são "preparadas": sem número de CNAE preenchido, aguardando validação.
const CNAE_ROWS: CnaeRow[] = [
  {
    codigo: '4791-1/00',
    descricao: 'Comércio varejista de mercadorias em geral, realizado por meio de internet',
    funcao:
      'Atividade principal da loja virtual que vende por conta própria, com ou sem estoque próprio.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'pelo Anexo I, porque a receita é de revenda de mercadorias.',
      },
      {
        label: 'Lucro Presumido',
        text: 'com presunção de 8 por cento para o IRPJ e de 12 por cento para a CSLL, na forma do artigo 15, parágrafo primeiro, incisos primeiro e terceiro, da Lei 9.249 de 1995, e do artigo 20 da mesma lei.',
      },
      { label: 'Lucro Real', text: 'permitido.' },
    ],
    observacoes:
      'É o código genérico da venda pela internet, usado quando não há código de produto específico.',
    principal: true,
  },
  {
    codigo:
      'Código do ramo de comércio correspondente ao produto vendido, por exemplo comércio varejista de vestuário, de cosméticos, de eletrônicos ou de móveis',
    descricao: '',
    funcao: 'Complementar, e é obrigatório quando a loja vende categoria específica.',
    regimes: [
      {
        label: '',
        text: 'Os mesmos da linha anterior, porque a natureza da receita é a mesma.',
      },
    ],
    observacoes:
      'Linha preparada com as quatro colunas, aguardando os códigos validados do ramo de cada cliente.',
    principal: false,
  },
  {
    codigo:
      'Código de intermediação de negócios, para marketplace e plataforma que apenas aproxima vendedor e comprador',
    descricao: '',
    funcao: 'Atividade principal de quem intermedeia, e não de quem vende.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes:
      'A receita é de comissão, e não de mercadoria, o que muda o anexo do Simples e o regime do ICMS. Linha pronta, aguardando o código validado.',
    principal: true,
  },
  {
    codigo: 'Código de transporte e logística, quando a loja entrega com frota própria',
    descricao: '',
    funcao: 'Complementar, só quando há entrega realizada pela própria empresa.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes:
      'Entrega por transportadora terceirizada não gera esse código para a loja. Linha pronta, aguardando o código validado.',
    principal: false,
  },
  {
    codigo:
      'Código de comércio atacadista, quando a loja vende para outra empresa e não para consumidor final',
    descricao: '',
    funcao: 'Complementar.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes:
      'A distinção entre varejo e atacado não é cadastral, muda o tratamento do ICMS e a obrigação acessória estadual.',
    principal: false,
  },
]

// 2 caixas de destaque intermediárias (textos literais do briefing)
const DESTAQUES = [
  {
    title: 'Uma loja pode ter três regimes dentro do mesmo DAS',
    text: 'O Simples Nacional trata de forma diferente a receita de mercadoria sujeita a substituição tributária. Quando a loja é substituída tributária, essa receita deve ser informada de forma destacada, para que o aplicativo de cálculo a desconsidere da base do ICMS, na forma da Resolução CGSN 140 de 2018. Essas receitas, porém, continuam compondo a base dos demais tributos do Simples. Quando a loja é substituta tributária, o ICMS devido por substituição é recolhido à parte, fora do DAS, por força do artigo 13, inciso décimo terceiro, da Lei Complementar 123 de 2006. Somar tudo numa guia só é o erro que gera autuação estadual.',
  },
  {
    title: 'O ICMS interestadual depende do estado, não do CNAE',
    text: 'Vender para consumidor final de outro estado envolve regras estaduais de diferencial de alíquota e de substituição tributária, e elas mudam conforme o destino e o produto. O Supremo Tribunal Federal, no Recurso Extraordinário 970.821, Tema 517, firmou entendimento sobre a não exigência do diferencial de alíquota à parte dos optantes do Simples Nacional, e a Lei Complementar 190 de 2022 alterou o cenário normativo posteriormente. Como há divergência entre estados e decisões administrativas em sentidos diferentes, essa análise precisa ser feita caso a caso, com a legislação do estado de destino vigente no momento da operação. Não existe resposta única aplicável a todo o país, e desconfie de quem ofereça uma.',
  },
]

// 4 cartões de regimes tributários (textos literais do briefing)
const REGIMES_CARDS = [
  {
    title: 'MEI, possível apenas em hipóteses restritas',
    text: 'O comércio varejista em geral consta das ocupações permitidas ao MEI no Anexo XI da Resolução CGSN 140 de 2018, com limite de receita de 81 mil reais em 2026, elevado para 110 mil reais em 2027 pela Lei Complementar 238 de 2026. O limite baixo e a ausência de estrutura para múltiplos canais fazem do MEI solução de início de operação, e não de loja em crescimento. A migração para microempresa precisa ser planejada antes do estouro, e não depois.',
  },
  {
    title: 'Simples Nacional, Anexo I na revenda',
    text: 'A receita de revenda de mercadorias é tributada pelo Anexo I. Se a loja industrializa o que vende, a receita de industrialização própria vai ao Anexo II. O limite é de 4,8 milhões de reais por ano, do artigo 3º, inciso segundo, da Lei Complementar 123 de 2006, com sublimite de 3,6 milhões para recolhimento de ICMS e ISS na forma do artigo 13-A, e os artigos 19 e 20 tratam do excesso de limite. Acima do sublimite, o ICMS passa a ser recolhido fora do DAS, e esse é o ponto em que a maioria das lojas descobre o problema tarde.',
  },
  {
    title: 'Lucro Presumido, presunção de 8 por cento',
    text: 'Na revenda de mercadorias e na atividade industrial, a presunção é de 8 por cento para o IRPJ e de 12 por cento para a CSLL, na forma do artigo 15, parágrafo primeiro, incisos primeiro e terceiro, e do artigo 20, ambos da Lei 9.249 de 1995. IRPJ de 15 por cento mais adicional de 10 por cento sobre o que exceder 20 mil reais por mês, na forma do artigo 3º, parágrafo primeiro, da Lei 9.430 de 1996, CSLL de 9 por cento, PIS de 0,65 por cento e COFINS de 3 por cento no cumulativo, e ICMS conforme a legislação estadual. Vedações no artigo 13, inciso primeiro, e no artigo 14 da Lei 9.718 de 1998. Atenção: receita de comissão por intermediação é serviço, com presunção de 32 por cento, e não se mistura com a receita de mercadoria.',
  },
  {
    title: 'Lucro Real, atrativo em margem apertada',
    text: 'Tributa o lucro efetivo, com PIS e COFINS não cumulativos de 9,25 por cento pela Lei 10.833 de 2003, IRPJ de 15 por cento mais adicional e CSLL de 9 por cento. No comércio eletrônico, o não cumulativo permite crédito sobre aquisição de mercadoria para revenda, frete e embalagem, o que costuma compensar em operação de margem baixa e volume alto.',
  },
]

// 3 armadilhas mais comuns (textos literais do briefing)
const ARMADILHAS = [
  'Não destacar a receita sujeita a substituição tributária, e pagar ICMS dentro do DAS sobre mercadoria que já foi tributada na origem.',
  'Recolher ICMS de substituição dentro da guia do Simples, quando a lei manda recolher à parte.',
  'Ultrapassar o sublimite de 3,6 milhões sem planejar a saída do ICMS do DAS, e descobrir o efeito no mês seguinte ao estouro.',
]

export function EcommerceCnaeSection() {
  return (
    <section
      id="cnae-regime-icms"
      className="py-14 md:py-20 bg-neutral-50 border-b border-neutral-200"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="max-w-3xl mb-10">
          <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
            Enquadramento da loja virtual
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
            CNAE, regime tributário e ICMS
          </h2>
        </div>

        {/* Parágrafo de abertura verbatim */}
        <p className="text-neutral-700 text-base md:text-lg leading-relaxed font-sans max-w-4xl mb-10">
          No e-commerce, o CNAE é só o começo. O que realmente define quanto a loja paga é onde o
          produto está na cadeia de circulação, se ele está sujeito a substituição tributária e em
          quais estados a operação acontece. Uma loja pode ter o código certo e ainda assim pagar
          imposto errado todos os meses.
        </p>

        {/* SUBBLOCO 1: os códigos da operação */}
        <h3 className="text-xl md:text-2xl font-sans font-bold text-black leading-snug mb-5">
          Os códigos da operação
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
