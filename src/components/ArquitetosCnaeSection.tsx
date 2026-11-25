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

// 7 códigos da atividade do arquiteto (textos literais)
const CNAE_ROWS: CnaeRow[] = [
  {
    codigo: '7111-1/00',
    descricao: 'Serviços de arquitetura',
    funcao:
      'Atividade principal, para consultoria e serviços técnicos de arquitetura, incluindo projetos de prédios, projetos conceituais e de detalhamento, supervisão da execução de projeto, projetos de ordenação urbana e uso do solo e projetos de arquitetura paisagística.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'pelo Anexo V com Fator R, por força do artigo 18, parágrafo quinto-I, incisos quinto e sexto, da Lei Complementar 123 de 2006, com a redação da Lei Complementar 155 de 2016, migrando para o Anexo III quando o Fator R alcançar 28 por cento, na forma do parágrafo quinto-J.',
      },
      { label: 'Lucro Presumido', text: 'permitido.' },
      { label: 'Lucro Real', text: 'permitido.' },
    ],
    observacoes:
      'A nota oficial do IBGE exclui expressamente desta subclasse o desenho técnico, que fica no 7119-7/03, as atividades de design e de decoração de interiores, que ficam na classe 7410-2, e as atividades de plantio, tratamento e manutenção de jardins e gramados, que ficam no 8130-3/00.',
    principal: true,
  },
  {
    codigo: '7119-7/03',
    descricao: 'Serviços de desenho técnico relacionados à arquitetura e engenharia',
    funcao: 'Complementar, para detalhamento, modelagem e pranchas.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'enquadramento conforme o histórico da Solução de Consulta COSIT 20 de 2016, registrado nas observações, porque a subclasse teve tratamentos distintos ao longo do tempo.',
      },
      { label: 'Lucro Presumido', text: 'permitido.' },
      { label: 'Lucro Real', text: 'permitido.' },
    ],
    observacoes:
      'A Solução de Consulta COSIT 20 de 2016 registra que essa atividade foi vedada no Simples Nacional de julho de 2006 a novembro de 2010, tributada pelo Anexo III de dezembro de 2010 a dezembro de 2014 e, a partir de janeiro de 2015, pelo Anexo VI então vigente, extinto pela Lei Complementar 155 de 2016, com migração para o Anexo V. É área com risco concreto de autuação sobre períodos antigos.',
    principal: false,
  },
  {
    codigo: '7119-7/01',
    descricao: 'Serviços de cartografia, topografia e geodésia',
    funcao: 'Complementar, para levantamento e medição de terreno.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes:
      'Anexo V com Fator R, pela mesma base legal, é o enquadramento que a tabela de Engenheiros registra, e a atividade é típica de agrimensor, cabendo ao escritório de arquitetura quando há levantamento e medição de terreno.',
    principal: false,
  },
  {
    codigo: '7119-7/99',
    descricao:
      'Atividades técnicas relacionadas à engenharia e arquitetura não especificadas anteriormente',
    funcao: 'Residual, só quando a atividade não couber em subclasse específica.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes:
      'Código residual deve ser exceção, não regra, e antes do uso é preciso conferir a vedação por atividade do artigo 17 da Lei Complementar 123 de 2006.',
    principal: false,
  },
  {
    codigo: '7120-1/00',
    descricao: 'Testes e análises técnicas',
    funcao: 'Complementar, para ensaio de materiais e controle tecnológico.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes:
      'É preciso conferir o item de serviço na lei municipal, como a tabela de Engenheiros registra.',
    principal: false,
  },
  {
    codigo: '7112-0/00',
    descricao: 'Serviços de engenharia',
    funcao: 'Complementar, apenas se houver engenheiro habilitado no quadro.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes:
      'O uso pressupõe engenheiro habilitado no quadro, atuando como responsável técnico correspondente à atividade prestada.',
    principal: false,
  },
  {
    codigo: '8599-6/04',
    descricao: 'Treinamento em desenvolvimento profissional e gerencial',
    funcao: 'Complementar, para cursos, palestras e educação continuada.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes:
      'Frentes de ensino costumam exigir separação na escrituração, alinhamento que as seções irmãs também registram.',
    principal: false,
  },
]

// 4 cartões de regimes tributários (textos literais)
const REGIMES_CARDS = [
  {
    title: 'MEI, vedado',
    text: 'Arquitetura não consta das ocupações permitidas ao MEI, e o instituto pressupõe a condição de empresário individual do artigo 18-A da Lei Complementar 123 de 2006.',
  },
  {
    title: 'Simples Nacional, com dois enquadramentos possíveis',
    text: 'Projeto e serviços técnicos de arquitetura ficam no Anexo V com Fator R, e migram ao Anexo III quando a folha alcança 28 por cento da receita dos últimos 12 meses, na forma do artigo 18, parágrafo quinto-J. Já a execução de obra, a execução de projetos, o paisagismo e a decoração de interiores ficam no Anexo IV, por força do parágrafo quinto-C, inciso primeiro, hipótese em que a contribuição previdenciária patronal é recolhida fora do DAS, à alíquota de 20 por cento sobre a folha, e não existe Fator R. Uma empresa que projeta e executa tem receita nos dois anexos no mesmo mês. O limite é de 4,8 milhões de reais por ano, do artigo 3º, inciso segundo, com sublimite de 3,6 milhões para ICMS e ISS na forma do artigo 13-A.',
  },
  {
    title: 'Lucro Presumido, permitido com uma exceção relevante',
    text: 'A regra geral é presunção de 32 por cento para IRPJ e CSLL. Na construção civil, a empreitada total com fornecimento de todos os materiais incorporados à obra tem presunção de 8 por cento no IRPJ e 12 por cento na CSLL, na forma dos artigos 15 e 20 da Lei 9.249 de 1995. Na empreitada parcial ou apenas de mão de obra, os percentuais voltam a 32 por cento. O entendimento está na Solução de Consulta COSIT 119, de 2019, atualizada pela Solução de Consulta COSIT 80, de 2025. IRPJ de 15 por cento mais adicional de 10 por cento sobre o que exceder 20 mil reais por mês, na forma do artigo 3º, parágrafo primeiro, da Lei 9.430 de 1996, CSLL de 9 por cento, PIS de 0,65 por cento e COFINS de 3 por cento no cumulativo, e ISS de 2 por cento a 5 por cento. Vedações no artigo 13, inciso primeiro, e no artigo 14 da Lei 9.718 de 1998.',
  },
  {
    title: 'Lucro Real, obrigatório acima do limite do Presumido',
    text: 'Tributa o lucro efetivo, com PIS e COFINS não cumulativos de 9,25 por cento pela Lei 10.833 de 2003, IRPJ de 15 por cento mais adicional e CSLL de 9 por cento. É atrativo em margem comprimida, prejuízo ou volume alto de insumos, e na construção civil o não cumulativo permite crédito sobre insumos e serviços.',
  },
]

// 3 armadilhas mais comuns (textos literais)
const ARMADILHAS = [
  'Projetar interiores com o código principal, quando decoração e design de interiores ficam em outra classe.',
  'Executar paisagismo de plantio e manutenção com código de projeto, sem o secundário correspondente.',
  'Aplicar Fator R sobre receita de Anexo IV, que não tem Fator R e tem a contribuição previdenciária patronal fora do DAS.',
]

export function ArquitetosCnaeSection() {
  return (
    <section
      id="cnae-regime-iss"
      className="py-14 md:py-20 bg-neutral-50 border-b border-neutral-200"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="max-w-3xl mb-10">
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
            CNAE, regime tributário e ISS
          </h2>
        </div>

        {/* Parágrafo de abertura verbatim */}
        <p className="text-neutral-700 text-base md:text-lg leading-relaxed font-sans max-w-4xl mb-10">
          O código de arquitetura não cobre tudo o que o escritório costuma fazer, e é aí que nasce
          o erro mais comum da área. Projeto de interiores, decoração, paisagismo executado e
          desenho técnico têm códigos próprios, e o principal não os alcança. Antes de cadastrar, é
          preciso saber o que o escritório entrega de fato.
        </p>

        {/* SUBBLOCO 1: os códigos da arquitetura */}
        <h3 className="text-xl md:text-2xl font-sans font-bold text-black leading-snug mb-5">
          Os códigos da arquitetura
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
                            <span className="font-semibold text-black">{regime.label} </span>
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

        {/* SUBBLOCO 2: caixa de destaque, o que o código principal não cobre */}
        <div className="mt-10 bg-black text-white rounded-xl p-6 md:p-8 border-l-4 border-[#FAB319] shadow-md">
          <div className="flex items-start gap-4">
            <ShieldCheck className="h-6 w-6 text-[#FAB319] shrink-0 mt-1" />
            <div className="space-y-3">
              <h3 className="text-lg md:text-xl font-sans font-bold text-white leading-snug">
                O que o código principal não cobre
              </h3>
              <p className="text-base md:text-lg leading-relaxed font-sans text-neutral-100">
                O 7111-1/00 não alcança decoração de interiores, design e execução de paisagismo.
                Escritório que projeta interiores com o código principal fatura atividade que o
                cadastro não reconhece, e o município cobra ISS pelo item de serviço, que também
                precisa estar correto. O caminho é incluir os secundários correspondentes antes de
                emitir a primeira nota dessa frente.
              </p>
            </div>
          </div>
        </div>

        {/* SUBBLOCO 3: caixa de destaque, o nome da sociedade tem regra própria */}
        <div className="mt-10 bg-black text-white rounded-xl p-6 md:p-8 border-l-4 border-[#FAB319] shadow-md">
          <div className="flex items-start gap-4">
            <ShieldCheck className="h-6 w-6 text-[#FAB319] shrink-0 mt-1" />
            <div className="space-y-3">
              <h3 className="text-lg md:text-xl font-sans font-bold text-white leading-snug">
                O nome da sociedade tem regra própria
              </h3>
              <p className="text-base md:text-lg leading-relaxed font-sans text-neutral-100">
                O artigo 7º da Lei 12.378 de 2010 considera exercício ilegal da profissão a pessoa
                física ou jurídica que presta serviços privativos de arquiteto e urbanista sem
                registro no Conselho de Arquitetura e Urbanismo, e o artigo 11 veda o uso das
                expressões arquitetura ou urbanismo, ou designação similar, na razão social ou no
                nome fantasia de sociedade que não possuir arquiteto e urbanista entre os sócios com
                poder de gestão ou entre os empregados permanentes. O critério geral de registro de
                empresa está no artigo 1º da Lei 6.839 de 1980, que adota a atividade básica como
                parâmetro. Uma sociedade que atue em arquitetura e engenharia precisa de registro no
                CAU e no CREA, cada um pela respectiva atividade básica, com responsável técnico
                indicado, e a arquitetura exige Registro de Responsabilidade Técnica próprio.
              </p>
            </div>
          </div>
        </div>

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

        {/* SUBBLOCO 5: caixa de destaque, enquadramento não pacificado */}
        <div className="mt-10 bg-black text-white rounded-xl p-6 md:p-8 border-l-4 border-[#FAB319] shadow-md">
          <div className="flex items-start gap-4">
            <ShieldCheck className="h-6 w-6 text-[#FAB319] shrink-0 mt-1" />
            <div className="space-y-3">
              <h3 className="text-lg md:text-xl font-sans font-bold text-white leading-snug">
                O enquadramento não está pacificado na lei
              </h3>
              <p className="text-base md:text-lg leading-relaxed font-sans text-neutral-100">
                Existe conflito textual no artigo 18 da Lei Complementar 123 de 2006. O parágrafo
                quinto-B lista atividades que seriam tributadas diretamente pelo Anexo III e faz
                referência expressa a arquitetura e urbanismo, enquanto o parágrafo quinto-I e o
                parágrafo quinto-J colocam a mesma atividade no Anexo V sujeita ao Fator R. O
                entendimento aplicado pela fiscalização e pela Resolução CGSN 140 de 2018 é o do
                Anexo V com Fator R, mas o tema comporta consulta tributária específica antes de
                consolidar o enquadramento.
              </p>
            </div>
          </div>
        </div>

        {/* SUBBLOCO 6: ISS */}
        <div className="mt-12">
          <h3 className="text-xl md:text-2xl font-sans font-bold text-black leading-snug mb-4">
            ISS: três regras que mexem no caixa
          </h3>
          <p className="text-neutral-700 text-base md:text-lg leading-relaxed font-sans max-w-4xl">
            Projeto e consultoria ficam nos subitens 7.01 e 7.03 da lista anexa à Lei Complementar
            116 de 2003, a execução de obra fica no 7.02 e o acompanhamento e a fiscalização de
            obras ficam no 7.19. O artigo 7º, parágrafo segundo, inciso primeiro, da mesma lei
            exclui da base do ISS, nos itens 7.02 e 7.05, o valor dos materiais fornecidos pelo
            prestador, e essa dedução precisa ser conferida na lei do município antes de aplicar. O
            regime de alíquota fixa da sociedade uniprofissional, do artigo 9º, parágrafos primeiro
            e terceiro, do Decreto-Lei 406 de 1968, teve virada jurisprudencial: a Primeira Seção do
            Superior Tribunal de Justica, no Tema 1.323, nos Recursos Especiais 2.162.486 e
            2.162.487, ambos de São Paulo, Relator Ministro Afrânio Vilela, julgados em 8 de outubro
            de 2025, fixou que a forma de responsabilidade limitada não impede, por si só, o regime
            de alíquota fixa, desde que haja prestação pessoal dos serviços pelos sócios,
            responsabilidade técnica individual e ausência de estrutura empresarial que
            descaracterize o caráter pessoal. A Súmula 663 do Supremo Tribunal Federal declarou
            recebidos pela Constituição os parágrafos primeiro e terceiro do artigo 9º do
            Decreto-Lei 406 de 1968.
          </p>
        </div>

        {/* SUBBLOCO 7: armadilhas */}
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
