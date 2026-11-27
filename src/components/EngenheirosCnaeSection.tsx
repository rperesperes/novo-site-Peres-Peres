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

// 8 códigos da atividade do engenheiro (textos literais)
const CNAE_ROWS: CnaeRow[] = [
  {
    codigo: '7112-0/00',
    descricao: 'Serviços de engenharia',
    funcao:
      'Atividade principal, e praticamente sempre a correta para escritório de projeto, consultoria, supervisão, vistoria, perícia e laudo.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'pelo Anexo V, por força do artigo 18, parágrafo quinto-I, incisos quinto e sexto, da Lei Complementar 123 de 2006, com a redação da Lei Complementar 155 de 2016, migrando para o Anexo III quando o Fator R for igual ou superior a 28%, na forma do parágrafo quinto-J.',
      },
      { label: 'Lucro Presumido', text: 'permitido.' },
      { label: 'Lucro Real', text: 'permitido.' },
    ],
    observacoes:
      'A nota oficial do IBGE exclui expressamente desta subclasse os serviços de arquitetura, o desenho técnico, a perícia de segurança do trabalho, os testes e análises técnicas e a execução e a administração de obra no local.',
    principal: true,
  },
  {
    codigo: '7119-7/01',
    descricao: 'Serviços de cartografia, topografia e geodésia',
    funcao: 'Complementar, para levantamentos de obra e engenharia agrimensora.',
    regimes: [
      {
        label: '',
        text: 'Anexo V com Fator R, pela mesma base legal.',
      },
    ],
    observacoes: 'Típico de engenheiro agrimensor.',
    principal: false,
  },
  {
    codigo: '7119-7/02',
    descricao: 'Atividades de estudos geológicos',
    funcao: 'Complementar, para geotecnia, sondagem e estudos de solo.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'pelo Anexo V com Fator R, porque a geologia está expressamente no artigo 18, parágrafo quinto-I, inciso sexto, da Lei Complementar 123 de 2006, migrando para o Anexo III quando o Fator R alcançar 28%, na forma do parágrafo quinto-J.',
      },
      { label: 'Lucro Presumido', text: 'permitido.' },
      { label: 'Lucro Real', text: 'permitido.' },
    ],
    observacoes:
      'Usado em geotecnia, sondagem e estudos de solo, e costuma vir acompanhado do 7119-7/01 em levantamento de campo.',
    principal: false,
  },
  {
    codigo: '7119-7/03',
    descricao: 'Serviços de desenho técnico relacionados à arquitetura e engenharia',
    funcao: 'Complementar, para cadistas, detalhamento, modelagem e pranchas.',
    regimes: [],
    observacoes:
      'É a atividade com histórico de tratamento instável no Simples Nacional. A Solução de Consulta COSIT 20 de 2016 registra que ela foi vedada no Simples de julho de 2006 a novembro de 2010, tributada pelo Anexo III de dezembro de 2010 a dezembro de 2014 e, a partir de janeiro de 2015, pelo Anexo VI então vigente, extinto pela Lei Complementar 155 de 2016, com migração para o Anexo V. É área com risco concreto de autuação sobre períodos antigos.',
    principal: false,
  },
  {
    codigo: '7119-7/04',
    descricao: 'Serviços de perícia técnica relacionados à segurança do trabalho',
    funcao: 'Complementar, para laudos, avaliações e programas de segurança.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada, porque a lei não traz enquadramento específico para essa subclasse.',
      },
    ],
    observacoes:
      'A receita de laudo e de programa de segurança prestada por engenheiro de segurança tende ao Anexo V com Fator R quando é serviço técnico, e ao Anexo IV quando está vinculada à execução de obra, e essa distinção precisa ser feita caso a caso.',
    principal: false,
  },
  {
    codigo: '7120-1/00',
    descricao: 'Testes e análises técnicas',
    funcao: 'Complementar, para laboratórios, ensaios de materiais e controle tecnológico.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'pelo Anexo V com Fator R, porque testes e análises técnicas e tecnológicas estão expressamente no artigo 18, parágrafo quinto-I, inciso sexto, da Lei Complementar 123 de 2006, migrando para o Anexo III com Fator R de 28%.',
      },
      { label: 'Lucro Presumido', text: 'permitido.' },
      { label: 'Lucro Real', text: 'permitido.' },
    ],
    observacoes:
      'Típico de laboratório, ensaio de materiais e controle tecnológico, e exige conferência do item de serviço na lei do município, porque ensaio prestado para indústria pode ter tratamento de ISS diferente do serviço de engenharia.',
    principal: false,
  },
  {
    codigo: '7119-7/99',
    descricao:
      'Atividades técnicas relacionadas à engenharia e arquitetura não especificadas anteriormente',
    funcao: 'Residual, apenas quando a atividade não couber em outro código.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes:
      'É o código residual da classe e só deve ser usado quando a atividade não couber em nenhuma subclasse específica, conferindo antes se a receita não recai em vedação por atividade do artigo 17 da Lei Complementar 123 de 2006.',
    principal: false,
  },
  {
    codigo: '7490-1/99',
    descricao: 'Outras atividades profissionais, científicas e técnicas',
    funcao: 'Complementar.',
    regimes: [
      {
        label: '',
        text: 'Definir conforme a atividade efetivamente prestada.',
      },
    ],
    observacoes:
      'Residual de uso restrito. Código residual usado sem critério enfraquece a defesa em fiscalização, porque deixa de descrever o que a empresa faz.',
    principal: false,
  },
]

// 4 cartões de regimes tributários (textos literais)
const REGIMES_CARDS = [
  {
    title: 'MEI, vedado',
    text: 'Engenharia não consta das ocupações permitidas ao MEI no Anexo XI da Resolução CGSN 140 de 2018, e o instituto pressupõe a condição de empresário individual do artigo 18-A da Lei Complementar 123 de 2006.',
  },
  {
    title: 'Simples Nacional, limitado a 4,8 milhões',
    text: 'O limite é de 4,8 milhões de reais por ano, do artigo 3º, inciso segundo, com sublimite de 3,6 milhões para recolhimento de ICMS e ISS na forma do artigo 13-A. O enquadramento depende do tipo de receita, conforme os subblocos anteriores.',
  },
  {
    title: 'Lucro Presumido, com uma exceção que vale muito',
    text: 'A regra geral para prestação de serviços é presunção de 32% para o IRPJ e para a CSLL. A exceção é a construção civil: na empreitada total, com fornecimento de todos os materiais indispensáveis incorporados à obra, a presunção cai para 8% no IRPJ e 12% na CSLL, na forma dos artigos 15 e 20 da Lei 9.249 de 1995. Na empreitada parcial, ou na empreitada apenas de mão de obra, os percentuais voltam a 32%. O entendimento está consolidado na Solução de Consulta COSIT 119, de 2019, e foi atualizado na Solução de Consulta COSIT 80, de 2025, que revisitou os entendimentos anteriores. IRPJ de 15% mais adicional de 10% sobre o que exceder 20 mil reais por mês, na forma do artigo 3º, parágrafo primeiro, da Lei 9.430 de 1996, CSLL de 9%, PIS de 0,65% e COFINS de 3% no cumulativo, e ISS de 2% a 5%. Vedações no artigo 13, inciso primeiro, e no artigo 14 da Lei 9.718 de 1998.',
  },
  {
    title: 'Lucro Real, obrigatório acima do limite do Presumido',
    text: 'Tributa o lucro efetivo, com PIS e COFINS não cumulativos de 9,25% pela Lei 10.833 de 2003, IRPJ de 15% mais adicional e CSLL de 9%. É especialmente atrativo em margem comprimida, prejuízo ou volume alto de insumos, porque na construção civil o não cumulativo permite crédito sobre insumos e serviços, o que o cumulativo não permite.',
  },
]

// 3 armadilhas mais comuns (textos literais)
const ARMADILHAS = [
  'Usar o código de engenharia para faturar obra, o que gera divergência de ISS e retira o lastro cadastral da presunção reduzida.',
  'Projetar interiores com o código de arquitetura, quando a nota oficial do IBGE remete decoração e design de interiores a outra classe.',
  'Aplicar Fator R sobre receita de Anexo IV, que não tem Fator R e tem a contribuição previdenciária patronal fora do DAS.',
]

export function EngenheirosCnaeSection() {
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
          Nenhuma atividade tem tantos códigos vizinhos quanto a engenharia, e o efeito de escolher
          o errado não é cadastral, é tributário. O mesmo escritório pode ter receita em dois anexos
          diferentes do Simples Nacional no mesmo mês, porque projeto e execução de obra têm
          enquadramentos distintos. Antes de escolher o código, é preciso saber o que a empresa faz
          de fato.
        </p>

        {/* SUBBLOCO 1: os códigos da engenharia */}
        <h3 className="text-xl md:text-2xl font-sans font-bold text-black leading-snug mb-5">
          Os códigos da engenharia
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

        {/* SUBBLOCO 2: caixa de destaque, obra */}
        <div className="mt-10 bg-black text-white rounded-xl p-6 md:p-8 border-l-4 border-[#FAB319] shadow-md">
          <div className="flex items-start gap-4">
            <ShieldCheck className="h-6 w-6 text-[#FAB319] shrink-0 mt-1" />
            <div className="space-y-3">
              <h3 className="text-lg md:text-xl font-sans font-bold text-white leading-snug">
                Se a empresa executa obra, o regime muda
              </h3>
              <p className="text-base md:text-lg leading-relaxed font-sans text-neutral-100">
                A nota oficial do IBGE exclui a execução e a administração de obra no local da
                subclasse 7112-0/00, e essas atividades ficam na Seção F. Emitir nota de construção
                com o código de engenharia gera divergência de ISS entre alíquota de serviço e
                alíquota de construção, e retira o lastro cadastral necessário à presunção reduzida
                do Lucro Presumido. Os códigos mais frequentes nessa frente são 4120-4/00,
                construção de edifícios; 4211-1/01, construção de rodovias e ferrovias; 4221-9/00,
                construção de redes de abastecimento de água, coleta de esgoto e construções
                correlatas; 4299-5/99, outras obras de engenharia civil; e 4399-1/99, serviços
                especializados para construção não especificados anteriormente.
              </p>
            </div>
          </div>
        </div>

        {/* SUBBLOCO 3: dois enquadramentos do Simples */}
        <div className="mt-12">
          <h3 className="text-xl md:text-2xl font-sans font-bold text-black leading-snug mb-4">
            Os dois enquadramentos do Simples na mesma empresa
          </h3>
          <p className="text-neutral-700 text-base md:text-lg leading-relaxed font-sans max-w-4xl">
            A construção de imóveis e obras de engenharia em geral, inclusive sob subempreitada, a
            execução de projetos e os serviços de paisagismo e de decoração de interiores ficam no
            Anexo IV, por força do artigo 18, parágrafo quinto-C, inciso primeiro, da Lei
            Complementar 123 de 2006. Nesse anexo a contribuição previdenciária patronal não está
            incluída no DAS e é recolhida separadamente, à alíquota de 20% sobre a folha, e não
            existe Fator R. Já arquitetura e urbanismo, engenharia, medição, cartografia,
            topografia, geologia, geodésia, testes e análises técnicas, pesquisa, design, desenho e
            agronomia ficam no Anexo V, por força do parágrafo quinto-I, incisos quinto e sexto, e
            migram ao Anexo III quando o Fator R alcança 28%, na forma do parágrafo quinto-J. A
            Resolução CGSN 140 de 2018 reproduz esse enquadramento no artigo 25, inciso quinto,
            alíneas q e r. Consequência prática: uma empresa que projeta e executa tem receita nos
            dois anexos no mesmo mês, e aplicar Fator R sobre receita de Anexo IV, ou somar tudo em
            uma alíquota única, recolhe a menor ou a maior, com ajuste e multa em qualquer dos
            casos.
          </p>
        </div>

        {/* SUBBLOCO 4: caixa de destaque, conflito textual */}
        <div className="mt-10 bg-black text-white rounded-xl p-6 md:p-8 border-l-4 border-[#FAB319] shadow-md">
          <div className="flex items-start gap-4">
            <ShieldCheck className="h-6 w-6 text-[#FAB319] shrink-0 mt-1" />
            <div className="space-y-3">
              <h3 className="text-lg md:text-xl font-sans font-bold text-white leading-snug">
                O enquadramento não está pacificado na lei
              </h3>
              <p className="text-base md:text-lg leading-relaxed font-sans text-neutral-100">
                Existe conflito textual real no artigo 18 da Lei Complementar 123 de 2006. O
                parágrafo quinto-B lista atividades que seriam tributadas diretamente pelo Anexo III
                e faz referência a arquitetura e urbanismo, enquanto o parágrafo quinto-I e o
                parágrafo quinto-J colocam a mesma atividade no Anexo V sujeita ao Fator R. Há ainda
                um segundo ponto de atrito, entre a expressão execução de projetos do parágrafo
                quinto-C, inciso primeiro, que remete ao Anexo IV, e o enquadramento da atividade de
                projeto no Anexo V. O entendimento aplicado pela fiscalização e pela Resolução CGSN
                140 de 2018 é o do Anexo V com Fator R, mas o tema comporta consulta tributária
                específica, e o caminho seguro é a consulta formal antes de consolidar o
                enquadramento do cliente.
              </p>
            </div>
          </div>
        </div>

        {/* SUBBLOCO 5: regimes tributários, 4 cartões */}
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
            prestador, e essa é a fronteira mais questionada pela fiscalização municipal, o que
            exige conferir a lei do município do cliente antes de aplicar a dedução. Por fim, o
            regime de alíquota fixa da sociedade uniprofissional, do artigo 9º, parágrafos primeiro
            e terceiro, do Decreto-Lei 406 de 1968, depende de previsão e de reconhecimento
            municipal. A Primeira Seção do Superior Tribunal de Justiça, no Tema 1.323, nos Recursos
            Especiais 2.162.486 e 2.162.487, ambos de São Paulo, Relator Ministro Afrânio Vilela,
            julgados em 8 de outubro de 2025, fixou que a forma de responsabilidade limitada não
            impede, por si só, o regime de alíquota fixa, desde que observados cumulativamente
            prestação pessoal dos serviços pelos sócios, responsabilidade técnica individual e
            ausência de estrutura empresarial que descaracterize o caráter pessoal.
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
