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

// 9 linhas da tabela de tecnologia (textos literais do briefing)
const CNAE_ROWS: CnaeRow[] = [
  {
    codigo: '6201-5/01',
    descricao: 'Desenvolvimento de programas de computador sob encomenda',
    funcao:
      'Atividade principal de quem desenvolve projeto sob contrato, para um cliente específico.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'pelo Anexo V, por força do artigo 18, parágrafo quinto-I, da Lei Complementar 123 de 2006, migrando ao Anexo III quando o Fator R alcançar 28 por cento, na forma do parágrafo quinto-J.',
      },
      { label: 'Lucro Presumido', text: 'permitido.' },
      { label: 'Lucro Real', text: 'permitido.' },
    ],
    observacoes: 'É o código de software por encomenda, e não de produto padronizado.',
  },
  {
    codigo: '6202-3/00',
    descricao: 'Desenvolvimento e licenciamento de programas de computador customizáveis',
    funcao: 'Atividade principal de quem licencia software que admite customização pelo cliente.',
    regimes: [{ label: '', text: 'Os mesmos da linha anterior.' }],
    observacoes: 'É o código típico de SaaS com configuração por cliente.',
  },
  {
    codigo: '6203-1/00',
    descricao: 'Desenvolvimento e licenciamento de programas de computador não customizáveis',
    funcao: 'Atividade principal de quem licencia produto padronizado, sem customização.',
    regimes: [{ label: '', text: 'Os mesmos da linha anterior.' }],
    observacoes: 'É o código de software de prateleira e de assinatura pura.',
  },
  {
    codigo: '6201-5/02',
    descricao: 'Web design',
    funcao: 'Complementar, para páginas, landing pages e front-end.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'pelo Anexo V, pela mesma base legal.',
      },
    ],
    observacoes:
      'Apesar do nome, este é o código de criação de página, e não de desenvolvimento de sistema.',
  },
  {
    codigo: '6204-0/00',
    descricao: 'Consultoria em tecnologia da informação',
    funcao: 'Complementar, para diagnóstico, arquitetura e planejamento sem desenvolvimento.',
    regimes: [
      {
        label: 'Simples Nacional',
        text: 'pelo Anexo V, pela mesma base legal.',
      },
    ],
    observacoes:
      'A Receita Federal, na Solução de Consulta COSIT 86, enquadra desenvolvimento e licenciamento de software, hospedagem na internet e manutenção de páginas eletrônicas no Anexo V, e não no Anexo III.',
  },
  {
    codigo: '6209-1/00',
    descricao: 'Suporte técnico, manutenção e outros serviços em tecnologia da informação',
    funcao: 'Complementar, para suporte, implantação e treinamento técnico.',
    regimes: [{ label: '', text: 'Definir conforme a atividade efetivamente prestada.' }],
    observacoes:
      'Receita de suporte e implantação precisa ser lida à luz do contrato, e a COSIT 86 ajuda a delimitar o enquadramento.',
  },
  {
    codigo: '6311-9/00',
    descricao:
      'Tratamento de dados, provedores de serviços de aplicação e serviços de hospedagem na internet',
    funcao: 'Complementar, para quem hospeda ou processa dado de terceiro.',
    regimes: [{ label: '', text: 'Definir conforme a atividade efetivamente prestada.' }],
    observacoes:
      'Hospedagem na internet é expressamente citada pela Solução de Consulta COSIT 86 como Anexo V.',
  },
  {
    codigo: '6319-4/00',
    descricao: 'Portais, provedores de conteúdo e outros serviços de informação na internet',
    funcao: 'Complementar, para portal, mídia digital e conteúdo.',
    regimes: [{ label: '', text: 'Definir conforme a atividade efetivamente prestada.' }],
    observacoes: 'Enquadramento depende da natureza da receita de conteúdo e da forma de cobrança.',
  },
  {
    codigo: '7020-4/00',
    descricao: 'Consultoria em gestão empresarial',
    funcao: 'Complementar, quando a startup vende consultoria de negócio e não de tecnologia.',
    regimes: [{ label: '', text: 'Definir conforme a atividade efetivamente prestada.' }],
    observacoes:
      'Código de serviço de gestão, sem relação com desenvolvimento, e receita segregada da de tecnologia.',
  },
]

// 2 caixas de destaque intermediárias (textos literais do briefing)
const DESTAQUES = [
  {
    title: 'O Supremo já decidiu qual tributo incide no software',
    text: 'Nas Ações Diretas de Inconstitucionalidade 1945 e 5659, julgadas pelo Plenário do Supremo Tribunal Federal em fevereiro de 2021, ficou assentado que não incide ICMS sobre o licenciamento ou a cessão de direito de uso de programas de computador, e que nessas operações incide o ISS. Os efeitos da decisão, em regra, correm a partir da publicação da ata de julgamento. Consequência prática: receita de software não é receita de mercadoria, e não se enquadra no Anexo I do Simples Nacional, que é o anexo do comércio. Empresa que trata licença de software como venda de produto erra o anexo, erra o ISS e erra a obrigação acessória estadual.',
  },
  {
    title: 'A pergunta que decide o anexo: onde o software é desenvolvido',
    text: 'A elaboração de programas de computador entra no Simples Nacional na hipótese de desenvolvimento no estabelecimento do optante. Startup que contrata desenvolvimento de terceiro, de freelancer ou de equipe no exterior e apenas revende o resultado tem situação distinta da que desenvolve internamente, e essa diferença precisa estar refletida na escrituração e no contrato. É a mesma lógica da segregação de receita: o que define o tributo é a natureza do que a empresa efetivamente faz, não o nome no cartão de visita.',
  },
]

// 4 cartões de regimes tributários (textos literais do briefing)
const REGIMES_CARDS = [
  {
    title: 'MEI, verificar antes de assumir',
    text: 'O Anexo XI da Resolução CGSN 140 de 2018 traz lista restritiva de ocupações, e a atividade de desenvolvimento de software precisa ser conferida nela antes de qualquer decisão. Na prática, o desenvolvimento de sistema raramente se enquadra nas ocupações da lista, e o caminho usual é a sociedade limitada, normalmente de sócio único.',
  },
  {
    title: 'Simples Nacional, Anexo V com Fator R',
    text: 'A receita de desenvolvimento e licenciamento de software é tributada pelo Anexo V, com migração ao Anexo III quando a folha e o pró-labore alcançam 28 por cento da receita dos últimos 12 meses, na forma do artigo 18, parágrafo quinto-J, da Lei Complementar 123 de 2006. O Anexo V começa em alíquota nominal mais alta, e com receita de 600 mil reais em doze meses a alíquota efetiva fica em torno de 17,85 por cento no V, contra cerca de 10,56 por cento no III. Comparar os dois sem calcular o Fator R é o erro mais caro do setor. O limite é de 4,8 milhões de reais por ano, com sublimite de 3,6 milhões para ISS na forma do artigo 13-A.',
  },
  {
    title: 'Lucro Presumido, com atenção ao percentual',
    text: 'A regra de presunção para prestação de serviços é de 32 por cento para o IRPJ e para a CSLL, na forma do artigo 15, parágrafo primeiro, inciso terceiro, alínea a, e do artigo 20 da Lei 9.249 de 1995. Receita de licenciamento de software não se confunde com receita de revenda de mercadoria, e por isso não cabe aplicar a presunção de 8 por cento reservada ao comércio. IRPJ de 15 por cento mais adicional de 10 por cento sobre o que exceder 20 mil reais por mês, na forma do artigo 3º, parágrafo primeiro, da Lei 9.430 de 1996, CSLL de 9 por cento, PIS de 0,65 por cento e COFINS de 3 por cento no cumulativo, e ISS de 2 por cento a 5 por cento. Vedações no artigo 13, inciso primeiro, e no artigo 14 da Lei 9.718 de 1998.',
  },
  {
    title: 'Lucro Real, e aqui existe um incentivo que só ele alcança',
    text: 'O Lucro Real tributa o lucro efetivo, com PIS e COFINS não cumulativos de 9,25 por cento pela Lei 10.833 de 2003, IRPJ de 15 por cento mais adicional e CSLL de 9 por cento. É o único regime que permite aproveitar os incentivos à inovação tecnológica dos artigos 17 a 26 da Lei 11.196 de 2005, que autorizam a exclusão de parte dos dispêndios em pesquisa e desenvolvimento tecnológico da base do IRPJ e da CSLL, com adicional em determinadas hipóteses. Empresa optante pelo Simples não acessa esse benefício. Para startup intensiva em desenvolvimento, essa comparação pode inverter a conclusão de regime.',
  },
]

// 3 armadilhas mais comuns (textos literais do briefing)
const ARMADILHAS = [
  'Enquadrar receita de licenciamento de software no Anexo I, tratando software como mercadoria, quando o Supremo já assentou que incide ISS e não ICMS.',
  'Usar um único código para projeto sob encomenda e para produto padronizado, quando o contrato define naturezas diferentes de receita.',
  'Escolher o regime pelo Anexo V sem calcular o Fator R, e pagar mais do que pagaria no Anexo III por simples falta de simulação.',
]

export function StartupsCnaeSection() {
  return (
    <section
      id="cnae-regime-iss"
      className="py-14 md:py-20 bg-neutral-50 border-b border-neutral-200"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="max-w-3xl mb-10">
          <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
            Enquadramento da startup
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
            CNAE, regime tributário e ISS
          </h2>
        </div>

        {/* Parágrafo de abertura verbatim */}
        <p className="text-neutral-700 text-base md:text-lg leading-relaxed font-sans max-w-4xl mb-10">
          Em tecnologia, o código de atividade não é detalhe cadastral: ele decide se a receita vai
          ao Anexo III ou ao Anexo V do Simples Nacional, e a diferença entre os dois chega a mais
          de sete pontos percentuais de alíquota efetiva no mesmo faturamento. A boa notícia é que a
          dúvida sobre qual tributo incide no software já foi resolvida pelo Supremo Tribunal
          Federal. A ruim é que quase todo mundo escolhe o código errado por analogia.
        </p>

        {/* SUBBLOCO 1: os códigos da tecnologia */}
        <h3 className="text-xl md:text-2xl font-sans font-bold text-black leading-snug mb-5">
          Os códigos da tecnologia
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
