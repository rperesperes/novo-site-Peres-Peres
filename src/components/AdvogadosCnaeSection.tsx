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

// 6 códigos da atividade advocatícia (textos literais da versão completa)
const CNAE_ROWS: CnaeRow[] = [
  {
    codigo: '6911-7/01',
    descricao: 'Serviços advocatícios',
    funcao: 'Atividade principal obrigatória, é o que consta do objeto social registrado na OAB.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'permitido, tributado no Anexo IV por força do artigo 18, parágrafo quinto-C, inciso sétimo, da Lei Complementar 123 de 2006, com alíquotas nominais de 4,5 por cento a 33 por cento e sem Fator R, com a contribuição previdenciária patronal e o ISS recolhidos fora do DAS.',
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
      'Não existe advogado MEI, porque o MEI exige a condição de empresário individual do artigo 18-A da Lei Complementar 123 de 2006, incompatível com a sociedade de advogados, e porque serviços advocatícios não constam das ocupações permitidas. O ISS é o item 17.14 da lista anexa à Lei Complementar 116 de 2003.',
    principal: true,
  },
  {
    codigo: '6911-7/02',
    descricao: 'Atividades auxiliares da justiça, incluindo arbitragem, mediação e perícia',
    funcao: 'Complementar, para escritório que atua como árbitro, mediador ou realiza perícia.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'o enquadramento depende da atividade efetivamente prestada, porque o Anexo IV alcança os serviços advocatícios e não toda atividade auxiliar da justiça.',
      },
      {
        label: 'Lucro Presumido',
        text: 'permitido.',
      },
      {
        label: 'Lucro Real',
        text: 'permitido.',
      },
    ],
    observacoes: 'Não substitui o 6911-7/01 como atividade principal.',
    principal: false,
  },
  {
    codigo: '6911-7/03',
    descricao: 'Agente de propriedade industrial',
    funcao:
      'Complementar, para atuação em patentes, marcas, desenhos industriais, transferência de tecnologia, indicações geográficas e programas de computador.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'verificar enquadramento pela natureza da atividade efetivamente prestada.',
      },
      {
        label: 'Lucro Presumido',
        text: 'permitido.',
      },
      {
        label: 'Lucro Real',
        text: 'permitido.',
      },
    ],
    observacoes: 'Pressupõe atuação como agente junto ao INPI.',
    principal: false,
  },
  {
    codigo: '7020-4/00',
    descricao: 'Consultoria em gestão empresarial, exceto consultoria técnica específica',
    funcao: 'Complementar, para frente de consultoria empresarial.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade prestada.',
      },
    ],
    observacoes:
      'Ver o aviso do subbloco seguinte, sobre o limite do artigo 16 da Lei 8.906 de 1994.',
    principal: false,
  },
  {
    codigo: '8599-6/04',
    descricao: 'Treinamento em desenvolvimento profissional e gerencial',
    funcao: 'Complementar, para cursos, palestras e educação continuada.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade prestada.',
      },
    ],
    observacoes: 'Ver o aviso do subbloco seguinte.',
    principal: false,
  },
  {
    codigo: '7490-1/99',
    descricao: 'Outras atividades profissionais, científicas e técnicas',
    funcao: 'Residual, para serviço técnico não classificado em outro código.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade prestada.',
      },
    ],
    observacoes: 'Código residual deve ser exceção, não regra.',
    principal: false,
  },
]

// 4 regimes tributários (textos literais)
const REGIMES_CARDS = [
  {
    title: 'MEI, vedado por duas razões cumulativas',
    text: 'O MEI exige a condição de empresário individual, do artigo 18-A da Lei Complementar 123 de 2006, incompatível com a sociedade de advogados, e os serviços advocatícios não constam das ocupações permitidas ao MEI. Não existe advogado MEI.',
  },
  {
    title: 'Simples Nacional, permitido com regras próprias',
    text: 'A advocacia é tributada pelo Anexo IV, na forma do artigo 18, parágrafo quinto-C, inciso sétimo, da Lei Complementar 123 de 2006, com alíquotas nominais de 4,5 por cento a 33 por cento na redação da Lei Complementar 155 de 2016, vigente desde primeiro de janeiro de 2018. Não existe Fator R no Anexo IV, e isso é decisivo: não há caminho para migrar ao Anexo III aumentando a folha. A contribuição previdenciária patronal é recolhida fora do DAS, assim como o ISS, pago ao município sobre o faturamento, no item 17.14 da lista da Lei Complementar 116 de 2003, com alíquota de 2 por cento a 5 por cento. O DAS do Anexo IV reúne IRPJ, CSLL, PIS e COFINS. O limite de receita bruta é de 4,8 milhões de reais por ano, do artigo 3º, inciso segundo, da Lei Complementar 123 de 2006. Os impedimentos do artigo 17 se aplicam integralmente, em especial o sócio pessoa jurídica, do artigo 3º, parágrafo quarto, inciso primeiro, e o sócio domiciliado no exterior, situações comuns em escritórios estruturados com holding ou com sócio estrangeiro.',
  },
  {
    title: 'Lucro Presumido, permitido',
    text: 'Base presumida de 32 por cento para o IRPJ, do artigo 15, parágrafo primeiro, inciso terceiro, alínea a, da Lei 9.249 de 1995, e de 32 por cento para a CSLL, do artigo 20, inciso primeiro. IRPJ de 15 por cento mais adicional de 10 por cento sobre o que exceder 20 mil reais por mês, CSLL de 9 por cento, PIS de 0,65 por cento e COFINS de 3 por cento no regime cumulativo, e ISS de 2 por cento a 5 por cento. Vedações no artigo 13, inciso primeiro, e no artigo 14 da Lei 9.718 de 1998, incluindo receita bruta acima de 78 milhões de reais no ano anterior e sócio residente no exterior.',
  },
  {
    title: 'Lucro Real, permitido',
    text: 'Tributa o lucro efetivo, com PIS e COFINS não cumulativos de 9,25 por cento na forma da Lei 10.833 de 2003, IRPJ de 15 por cento mais adicional e CSLL de 9 por cento. Costuma ser a melhor escolha em ano de margem comprimida, prejuízo, ou quando há muitas despesas dedutíveis e creditamento de PIS e COFINS, e é obrigatório acima do limite do Lucro Presumido.',
  },
]

export function AdvogadosCnaeSection() {
  return (
    <section id="cnae-regime-iss" className="py-14 md:py-20 bg-white border-b border-neutral-200">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="max-w-3xl mb-10">
          <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
            Enquadramento da banca
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
            CNAE, regime tributário e ISS
          </h2>
        </div>

        {/* Parágrafo de abertura verbatim */}
        <p className="text-neutral-700 text-base md:text-lg leading-relaxed font-sans max-w-4xl mb-10">
          O CNAE não define sozinho quanto a banca paga. Ele entra na apuração junto com o regime
          tributário, e a advocacia pode ser exercida no Simples Nacional, no Lucro Presumido ou no
          Lucro Real. Duas confusões são frequentes: tratar o CNAE como se fosse o item de serviço
          usado pelo município para cobrar o ISS, e achar que existe uma lista de códigos vedados,
          quando o que existe é vedação por atividade, no artigo 17 da Lei Complementar 123 de 2006.
        </p>

        {/* SUBBLOCO 1: os códigos da atividade advocatícia */}
        <h3 className="text-xl md:text-2xl font-sans font-bold text-black leading-snug mb-5">
          Os códigos da atividade advocatícia
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
                  data-area="Advocacia"
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
                O limite que a OAB impõe antes do CNAE
              </h3>
              <p className="text-base md:text-lg leading-relaxed font-sans text-neutral-100">
                Uma sociedade de advogados não pode ter objeto mercantil, por força do artigo 16 da
                Lei 8.906 de 1994. Códigos de consultoria em gestão e de treinamento gerencial não
                são incompatíveis com a atividade do advogado, mas costumam ser incompatíveis com o
                registro da sociedade na OAB. Na prática, essas frentes normalmente vivem em outra
                pessoa jurídica, com contabilidade, escrituração e apuração de ISS próprias.
                Empilhar todos os códigos em um único CNPJ é o erro mais comum e o de correção mais
                cara.
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

        {/* SUBBLOCO 4: ISS fixo por profissional, texto verbatim */}
        <div className="mt-12">
          <h3 className="text-xl md:text-2xl font-sans font-bold text-black leading-snug mb-4">
            ISS fixo por profissional, possível mas condicionado
          </h3>
          <p className="text-neutral-700 text-base md:text-lg leading-relaxed font-sans max-w-4xl">
            O regime especial das sociedades uniprofissionais tem base no artigo 9º, parágrafos
            primeiro e terceiro, do Decreto-Lei 406 de 1968, recepcionado pela Constituição, e
            depende de o município adotar o regime. Os requisitos são todos os sócios habilitados na
            mesma atividade, serviço prestado pessoalmente pelos sócios, responsabilidade pessoal
            pelo serviço e ausência de caráter empresarial. Não é automático: depende de previsão na
            lei municipal e de reconhecimento pela administração municipal, e há disputa sobre a
            convivência do regime com o Simples Nacional. O Supremo Tribunal Federal declarou
            recebidos pela Constituição os parágrafos primeiro e terceiro do artigo 9º do
            Decreto-Lei 406 de 1968 na Súmula 663. Precisa ser validado caso a caso, sem presumir o
            benefício.
          </p>
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
