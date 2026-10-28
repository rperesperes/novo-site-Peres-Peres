import { Shield, ChevronRight } from 'lucide-react'

const SECTIONS_NAV = [
  { id: 'secao-1', number: '1', title: 'Identificação do Controlador' },
  { id: 'secao-2', number: '2', title: 'Dados que Coletamos e os Motivos da Coleta' },
  { id: 'secao-3', number: '3', title: 'Compartilhamento de Dados Pessoais com Terceiros' },
  { id: 'secao-4', number: '4', title: 'Transferência Internacional de Dados' },
  { id: 'secao-5', number: '5', title: 'Quanto Tempo Seus Dados Serão Armazenados' },
  { id: 'secao-6', number: '6', title: 'Bases Legais para o Tratamento de Dados Pessoais' },
  { id: 'secao-7', number: '7', title: 'Direitos do Usuário' },
  { id: 'secao-8', number: '8', title: 'Medidas de Segurança' },
  { id: 'secao-9', number: '9', title: 'Menores de Idade' },
  { id: 'secao-10', number: '10', title: 'Reclamação a uma Autoridade de Controle' },
  { id: 'secao-11', number: '11', title: 'Alterações nesta Política' },
  { id: 'secao-12', number: '12', title: 'Como Entrar em Contato Conosco' },
]

export default function PrivacyPolicy() {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      window.history.pushState(null, '', `#${id}`)
    }
  }

  return (
    <div className="bg-black text-neutral-100 min-h-screen py-12 md:py-20 font-sans">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Cabeçalho do documento */}
        <header className="mb-12 border-b border-neutral-800 pb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 border border-neutral-700 bg-neutral-900/80 px-3 py-1 rounded text-xs font-mono uppercase tracking-wider text-neutral-300 mb-6">
            <Shield className="h-3.5 w-3.5 text-[#FAB319]" />
            Conformidade LGPD • Lei 13.709/2018
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            POLÍTICA DE PRIVACIDADE
          </h1>

          <p className="text-sm font-medium text-[#FAB319] mb-8">
            Atualizada em 28 de outubro de 2026.
          </p>

          <div className="space-y-4 text-base md:text-lg text-neutral-300 leading-relaxed">
            <p>
              Nós cuidamos da proteção dos seus dados pessoais e, por isso, disponibilizamos esta
              política de privacidade em nosso site. Ela contém informações importantes sobre quem
              deve utilizar nosso site, quais dados coletamos e o que fazemos com eles, seus
              direitos em relação aos seus dados pessoais e como entrar em contato conosco.
            </p>
            <p>
              Ao coletar e utilizar dados pessoais, agimos na qualidade de controlador e estamos
              sujeitos às disposições da Lei Federal n. 13.709/2018, Lei Geral de Proteção de Dados
              Pessoais, LGPD.
            </p>
          </div>
        </header>

        {/* Índice Clicável no Topo */}
        <nav
          aria-label="Índice da Política de Privacidade"
          className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-6 md:p-8 mb-16 shadow-lg backdrop-blur-xs"
        >
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-5">
            <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FAB319]" />
              Índice de Seções
            </h2>
            <span className="text-xs font-mono text-neutral-400">12 itens</span>
          </div>

          <ol className="grid sm:grid-cols-2 gap-2 text-sm">
            {SECTIONS_NAV.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={(e) => scrollToSection(e, section.id)}
                  className="group flex items-start gap-2.5 p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-all duration-150"
                >
                  <span className="font-mono text-xs font-bold text-[#FAB319] shrink-0 mt-0.5 w-5 text-right">
                    {section.number}.
                  </span>
                  <span className="leading-snug group-hover:underline decoration-[#FAB319] underline-offset-4">
                    {section.title}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-neutral-500 group-hover:text-[#FAB319] ml-auto shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Corpo do Documento */}
        <main className="space-y-12 leading-relaxed text-neutral-300">
          {/* =========================================================
              SEÇÃO 1 (VERBATIM)
             ========================================================= */}
          <section
            id="secao-1"
            className="scroll-mt-28 space-y-4 pt-4 border-t border-neutral-800/80"
          >
            <div className="border-l-2 border-[#FAB319] pl-3.5">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                Seção 1
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                IDENTIFICAÇÃO DO CONTROLADOR
              </h2>
            </div>
            <p className="text-neutral-300 leading-relaxed">
              O controlador dos dados pessoais tratados neste site é Escritório PERES PERES
              Consultoria e Contabilidade LTDA, CNPJ 44.961.875/0001-25, inscrita no CF/DF sob o n.
              0810995100100, registrada como sociedade limitada perante o Conselho Federal de
              Contabilidade sob o n. DF-003366, com sede em Brasília, Distrito Federal, e
              responsabilidade técnica do contador Rafael Peres Peres Nunes Altoé, CRC 027704/O. O
              site institucional está disponível em www.peresperes.com.br e o blog em
              blog.peresperes.com.br.
            </p>
          </section>

          {/* =========================================================
              SEÇÃO 2 (VERBATIM)
             ========================================================= */}
          <section
            id="secao-2"
            className="scroll-mt-28 space-y-6 pt-8 border-t border-neutral-800/80"
          >
            <div className="border-l-2 border-[#FAB319] pl-3.5">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                Seção 2
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                DADOS QUE COLETAMOS E OS MOTIVOS DA COLETA
              </h2>
            </div>

            <div className="space-y-3">
              <h3 className="text-base md:text-lg font-semibold text-neutral-100">
                2.1. Dados pessoais fornecidos expressamente pelo usuário
              </h3>
              <ul className="space-y-3 pl-2 sm:pl-4">
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-sm font-semibold text-[#FAB319] shrink-0 mt-0.5">
                    a)
                  </span>
                  <span>
                    <strong className="text-white">Formulário de contato:</strong> nome completo,
                    e-mail, telefone ou WhatsApp e teor da mensagem. Finalidade: responder à
                    solicitação, prestar esclarecimentos e, quando for o caso, elaborar proposta de
                    serviços.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-sm font-semibold text-[#FAB319] shrink-0 mt-0.5">
                    b)
                  </span>
                  <span>
                    <strong className="text-white">Assinatura do Boletim Tributário:</strong>{' '}
                    e-mail. Finalidade: envio de informativos técnicos sobre legislação e
                    jurisprudência tributária.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-sm font-semibold text-[#FAB319] shrink-0 mt-0.5">
                    c)
                  </span>
                  <span>
                    <strong className="text-white">Relação contratual de cliente:</strong> dados
                    cadastrais, fiscais, contábeis, trabalhistas e financeiros necessários à
                    execução dos serviços contratados. Finalidade: cumprimento do contrato e das
                    obrigações legais e regulatórias inerentes à atividade contábil.
                  </span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-base md:text-lg font-semibold text-neutral-100">
                2.2. Dados coletados automaticamente
              </h3>
              <p>
                Ao navegar pelo site, são coletados dados de navegação, como endereço IP, tipo de
                dispositivo e navegador, páginas visitadas, data e hora de acesso, origem do acesso
                e interações com o conteúdo. Finalidade: medir audiência, compreender como o
                conteúdo é utilizado e aperfeiçoar o site.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base md:text-lg font-semibold text-neutral-100">
                2.3. Dados sensíveis
              </h3>
              <p>
                Não serão coletados dados sensíveis de nossos usuários, assim entendidos aqueles
                definidos nos arts. 11 e seguintes da LGPD. Não há coleta de dados sobre origem
                racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a
                organização de caráter religioso, filosófico ou político, dado referente à saúde ou
                à vida sexual, dado genético ou biométrico vinculado a pessoa natural. Eventual dado
                sensível necessário à execução de serviço contábil ou trabalhista contratado será
                tratado exclusivamente para essa finalidade, com fundamento no cumprimento de
                obrigação legal ou regulatória e na execução do contrato.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-semibold text-neutral-100">2.4. Cookies</h3>
              <p>
                Cookies são pequenos arquivos de texto baixados automaticamente em seu dispositivo
                quando você acessa e navega por um site. Servem, basicamente, para identificar
                dispositivos, atividades e preferências, e para viabilizar o funcionamento de
                recursos. Os cookies não permitem que qualquer arquivo ou informação sejam extraídos
                do disco rígido do usuário, nem que se tenha acesso a informações pessoais que não
                tenham partido do usuário ou da forma como utiliza os recursos do site.
              </p>

              <div className="space-y-3 pl-2 sm:pl-4 text-sm md:text-base">
                <p>
                  <strong className="text-white">2.4.1. Cookies necessários:</strong> são aqueles
                  indispensáveis ao funcionamento do site, como os que mantêm a sessão e a segurança
                  da navegação. Não podem ser desativados sem prejuízo da funcionalidade.
                </p>
                <p>
                  <strong className="text-white">2.4.2. Cookies de análise:</strong> utilizamos o
                  Google Analytics para medir audiência e compreender o uso do conteúdo. Esses
                  cookies registram dados de navegação de forma agregada e são ativados somente após
                  o consentimento do usuário.
                </p>
                <p>
                  <strong className="text-white">2.4.3. Cookies de marketing:</strong> utilizamos o
                  Meta Pixel para mensurar o desempenho de campanhas publicitárias e alcançar
                  públicos de interesse. Esses cookies identificam o dispositivo do visitante e
                  podem ser utilizados pelo Meta para personalização de anúncios em seus serviços.
                  São ativados somente após o consentimento do usuário.
                </p>
                <p>
                  <strong className="text-white">2.4.4. Gestão de cookies:</strong> assim que acessa
                  o site, o usuário visualiza a opção de aceitar ou recusar os cookies de análise e
                  de marketing, com o mesmo destaque visual entre as duas escolhas. Os cookies de
                  análise e de marketing permanecem bloqueados até o consentimento. O usuário pode
                  retirar o consentimento a qualquer momento, alterando a escolha na caixa de
                  preferências de cookies disponível no site ou desativando os cookies nas
                  configurações do seu navegador. Ao desativá-los, é importante ter em mente que a
                  experiência poderá ser prejudicada, uma vez que informações utilizadas para
                  personalizá-la deixarão de ser utilizadas.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-base md:text-lg font-semibold text-neutral-100">
                2.5. Coleta de dados não previstos expressamente
              </h3>
              <p>
                Eventualmente, outros tipos de dados não previstos expressamente nesta Política
                poderão ser coletados, desde que fornecidos com o consentimento do usuário ou que a
                coleta seja permitida com fundamento legal. Em qualquer caso, a coleta e as
                atividades de tratamento dela decorrentes serão informadas aos usuários do site.
              </p>
            </div>
          </section>

          {/* =========================================================
              SEÇÃO 3 (VERBATIM)
             ========================================================= */}
          <section
            id="secao-3"
            className="scroll-mt-28 space-y-4 pt-8 border-t border-neutral-800/80"
          >
            <div className="border-l-2 border-[#FAB319] pl-3.5">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                Seção 3
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                COMPARTILHAMENTO DE DADOS PESSOAIS COM TERCEIROS
              </h2>
            </div>

            <p>
              Não comercializamos dados pessoais. O compartilhamento ocorre apenas com os operadores
              necessários à operação do site e à execução dos serviços:
            </p>

            <ul className="space-y-2.5 pl-2 sm:pl-4">
              <li className="flex items-start gap-2.5">
                <span className="font-mono text-sm font-semibold text-[#FAB319] shrink-0 mt-0.5">
                  a)
                </span>
                <span>
                  Google, por meio do Google Analytics e do Google Search Console, para medição de
                  audiência e desempenho de busca;
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-mono text-sm font-semibold text-[#FAB319] shrink-0 mt-0.5">
                  b)
                </span>
                <span>
                  Meta, por meio do Meta Pixel, para mensuração de campanhas publicitárias;
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-mono text-sm font-semibold text-[#FAB319] shrink-0 mt-0.5">
                  c)
                </span>
                <span>Hostinger, para hospedagem do blog;</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-mono text-sm font-semibold text-[#FAB319] shrink-0 mt-0.5">
                  d)
                </span>
                <span>
                  provedores de serviços contábeis, fiscais e de software de gestão utilizados na
                  execução dos serviços contratados;
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-mono text-sm font-semibold text-[#FAB319] shrink-0 mt-0.5">
                  e)
                </span>
                <span>
                  autoridades públicas, quando houver determinação legal, regulatória ou ordem de
                  autoridade competente.
                </span>
              </li>
            </ul>

            <p className="pt-2 text-neutral-300">
              Todos os operadores tratam os dados conforme as instruções do controlador e conforme
              regimes contratuais de proteção de dados.
            </p>
          </section>

          {/* =========================================================
              SEÇÃO 4 (VERBATIM)
             ========================================================= */}
          <section
            id="secao-4"
            className="scroll-mt-28 space-y-4 pt-8 border-t border-neutral-800/80"
          >
            <div className="border-l-2 border-[#FAB319] pl-3.5">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                Seção 4
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                TRANSFERÊNCIA INTERNACIONAL DE DADOS
              </h2>
            </div>

            <p className="text-neutral-300 leading-relaxed">
              Alguns dos operadores indicados acima, especialmente Google e Meta, processam dados em
              servidores localizados fora do Brasil, notadamente nos Estados Unidos da América.
              Essas transferências ocorrem com fundamento no consentimento do titular, no
              cumprimento de obrigações contratuais e em cláusulas contratuais específicas de
              proteção de dados adotadas pelos fornecedores, nos termos dos arts. 33 e seguintes da
              LGPD.
            </p>
          </section>

          {/* =========================================================
              SEÇÃO 5 (CONFORME ESPECIFICAÇÃO LGPD)
             ========================================================= */}
          <section
            id="secao-5"
            className="scroll-mt-28 space-y-4 pt-8 border-t border-neutral-800/80"
          >
            <div className="border-l-2 border-[#FAB319] pl-3.5">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                Seção 5
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                QUANTO TEMPO SEUS DADOS SERÃO ARMAZENADOS
              </h2>
            </div>

            <p className="text-neutral-300 leading-relaxed">
              Os dados pessoais coletados são armazenados apenas pelo tempo estritamente necessário
              para o alcance das finalidades informadas nesta Política de Privacidade e para o
              cumprimento de obrigações legais e regulatórias às quais o controlador está vinculado,
              em especial as obrigações fiscais, tributárias, contábeis e trabalhistas previstas na
              legislação brasileira.
            </p>
            <p className="text-neutral-300 leading-relaxed">
              Encerrada a finalidade que justificou o tratamento ou expirados os prazos legais e
              regulatórios de guarda obrigatória, os dados pessoais serão devidamente descartados
              por meios seguros ou anonimizados para fins estatísticos internos, nos termos da Lei
              Geral de Proteção de Dados Pessoais (LGPD).
            </p>
          </section>

          {/* =========================================================
              SEÇÃO 6 (CONFORME ESPECIFICAÇÃO)
             ========================================================= */}
          <section
            id="secao-6"
            className="scroll-mt-28 space-y-6 pt-8 border-t border-neutral-800/80"
          >
            <div className="border-l-2 border-[#FAB319] pl-3.5">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                Seção 6
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                BASES LEGAIS PARA O TRATAMENTO DE DADOS PESSOAIS
              </h2>
            </div>

            <p className="text-neutral-300 leading-relaxed">
              O tratamento de dados pessoais realizado pelo escritório ocorre em estrita
              conformidade com as hipóteses autorizadoras previstas na LGPD e com as normas que
              regem o exercício da contabilidade:
            </p>

            <div className="space-y-4 pl-2 sm:pl-4">
              <div className="space-y-2">
                <h3 className="text-base md:text-lg font-semibold text-neutral-100">
                  6.1. Sigilo profissional
                </h3>
                <p className="text-neutral-300 leading-relaxed">
                  Os dados pessoais de clientes recebidos em razão da prestação de serviços
                  contábeis e de consultoria são igualmente protegidos e tratados sob o dever de
                  sigilo profissional do contador, previsto expressamente no Código de Ética
                  Profissional do Contador (NBC PG 01) e no art. 1.177 do Código Civil. As
                  informações obtidas em razão da atividade contábil somente podem ser reveladas nas
                  hipóteses taxativamente autorizadas por lei, por determinação expressa de
                  autoridade competente ou mediante autorização prévia e escrita do cliente.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base md:text-lg font-semibold text-neutral-100">
                  6.2. Consentimento
                </h3>
                <p className="text-neutral-300 leading-relaxed">
                  O consentimento livre, informado e inequívoco do titular constitui a base legal
                  para o uso de cookies de análise e de marketing e para a inscrição no recebimento
                  de boletins informativos e comunicações de conteúdo técnico. O consentimento pode
                  ser revogado a qualquer tempo pelo titular.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base md:text-lg font-semibold text-neutral-100">
                  6.3. Cumprimento de obrigação legal ou regulatória
                </h3>
                <p className="text-neutral-300 leading-relaxed">
                  O cumprimento de obrigação legal ou regulatória imposta por lei ou por órgãos
                  fiscalizadores e arrecadadores serve de base legal para o tratamento e conservação
                  dos dados necessários ao atendimento das obrigações contábeis, fiscais,
                  previdenciárias e trabalhistas inerentes à atuação do escritório.
                </p>
              </div>
            </div>
          </section>

          {/* =========================================================
              SEÇÃO 7 (CONFORME ESPECIFICAÇÃO)
             ========================================================= */}
          <section
            id="secao-7"
            className="scroll-mt-28 space-y-6 pt-8 border-t border-neutral-800/80"
          >
            <div className="border-l-2 border-[#FAB319] pl-3.5">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                Seção 7
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                DIREITOS DO USUÁRIO
              </h2>
            </div>

            <p className="text-neutral-300 leading-relaxed">
              Nos termos do art. 18 da Lei Geral de Proteção de Dados Pessoais (LGPD), o titular dos
              dados pessoais tem direito de obter do controlador, a qualquer momento e mediante
              requisição expressa:
            </p>

            <ul className="space-y-2.5 pl-2 sm:pl-4">
              <li className="flex items-start gap-2.5">
                <span className="text-[#FAB319] font-bold mt-0.5">•</span>
                <span>Confirmação da existência de tratamento;</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#FAB319] font-bold mt-0.5">•</span>
                <span>Acesso aos dados pessoais tratados;</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#FAB319] font-bold mt-0.5">•</span>
                <span>Correção de dados incompletos, inexatos ou desatualizados;</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#FAB319] font-bold mt-0.5">•</span>
                <span>
                  Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou
                  tratados em desconformidade com o disposto na LGPD;
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#FAB319] font-bold mt-0.5">•</span>
                <span>
                  Portabilidade dos dados a outro fornecedor de serviço ou produto, observados os
                  segredos comercial e industrial;
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#FAB319] font-bold mt-0.5">•</span>
                <span>
                  Eliminação dos dados pessoais tratados com o consentimento do titular, ressalvadas
                  as hipóteses legais de conservação previstas na LGPD;
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#FAB319] font-bold mt-0.5">•</span>
                <span>
                  Informação das entidades públicas e privadas com as quais o controlador realizou
                  uso compartilhado de dados;
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#FAB319] font-bold mt-0.5">•</span>
                <span>
                  Informação sobre a possibilidade de não fornecer consentimento e sobre as
                  consequências da negativa;
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#FAB319] font-bold mt-0.5">•</span>
                <span>Revogação do consentimento, nos termos da legislação aplicável.</span>
              </li>
            </ul>

            <div className="pt-2">
              <h3 className="text-base md:text-lg font-semibold text-neutral-100 mb-2">
                7.1. Como o titular pode exercer seus direitos
              </h3>
              <p className="text-neutral-300 leading-relaxed">
                O titular pode exercer quaisquer dos seus direitos de forma gratuita e simplificada,
                bastando enviar sua solicitação pelos canais de contato indicados no item 12 desta
                Política.
              </p>
            </div>
          </section>

          {/* =========================================================
              SEÇÃO 8 (CONFORME ESPECIFICAÇÃO)
             ========================================================= */}
          <section
            id="secao-8"
            className="scroll-mt-28 space-y-4 pt-8 border-t border-neutral-800/80"
          >
            <div className="border-l-2 border-[#FAB319] pl-3.5">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                Seção 8
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                MEDIDAS DE SEGURANÇA
              </h2>
            </div>

            <p className="text-neutral-300 leading-relaxed">
              Adotamos medidas técnicas e organizacionais razoáveis e adequadas aos padrões do
              mercado para proteger os dados pessoais contra acessos não autorizados, situações
              acidentais ou ilícitas de destruição, perda, alteração, comunicação ou qualquer forma
              de tratamento inadequado ou ilícito.
            </p>
            <p className="text-neutral-300 leading-relaxed">
              Embora o controlador empenhe esforços constantes para resguardar a privacidade e a
              integridade das informações tratadas, nenhum sistema ou transmissão de dados pela
              internet é integralmente inviolável, razão pela qual não é possível garantir segurança
              absoluta contra todas as ameaças possíveis.
            </p>
          </section>

          {/* =========================================================
              SEÇÃO 9 (CONFORME ESPECIFICAÇÃO)
             ========================================================= */}
          <section
            id="secao-9"
            className="scroll-mt-28 space-y-4 pt-8 border-t border-neutral-800/80"
          >
            <div className="border-l-2 border-[#FAB319] pl-3.5">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                Seção 9
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                MENORES DE IDADE
              </h2>
            </div>

            <p className="text-neutral-300 leading-relaxed">
              O site da PERES PERES é voltado precipuamente ao público empresarial e profissional.
              Não coletamos intencionalmente dados pessoais de crianças ou adolescentes por meio do
              site.
            </p>
            <p className="text-neutral-300 leading-relaxed">
              Eventual tratamento de dados pessoais de crianças e adolescentes indispensável à
              execução de contratos contábeis ou de rotinas trabalhistas e previdenciárias de
              clientes será realizado em estrita conformidade com os arts. 14 e seguintes da LGPD,
              no melhor interesse do menor e com o consentimento específico de pelo menos um dos
              pais ou responsável legal, quando legalmente aplicável.
            </p>
          </section>

          {/* =========================================================
              SEÇÃO 10 (CONFORME ESPECIFICAÇÃO)
             ========================================================= */}
          <section
            id="secao-10"
            className="scroll-mt-28 space-y-4 pt-8 border-t border-neutral-800/80"
          >
            <div className="border-l-2 border-[#FAB319] pl-3.5">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                Seção 10
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                RECLAMAÇÃO A UMA AUTORIDADE DE CONTROLE
              </h2>
            </div>

            <p className="text-neutral-300 leading-relaxed">
              Sem prejuízo de qualquer outra via de recurso administrativo ou judicial, caso o
              titular dos dados entenda que o tratamento de seus dados pessoais violou as
              disposições da LGPD ou da legislação de proteção de dados aplicável, tem o direito de
              apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD) e aos demais
              órgãos públicos competentes.
            </p>
          </section>

          {/* =========================================================
              SEÇÃO 11 (CONFORME ESPECIFICAÇÃO)
             ========================================================= */}
          <section
            id="secao-11"
            className="scroll-mt-28 space-y-4 pt-8 border-t border-neutral-800/80"
          >
            <div className="border-l-2 border-[#FAB319] pl-3.5">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                Seção 11
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                ALTERAÇÕES NESTA POLÍTICA
              </h2>
            </div>

            <p className="text-neutral-300 leading-relaxed">
              Esta Política de Privacidade poderá ser modificada ou atualizada a qualquer tempo,
              especialmente para adaptá-la a eventuais alterações legislativas, regulamentares ou às
              melhores práticas adotadas pelo escritório.
            </p>
            <p className="text-neutral-300 leading-relaxed">
              Quaisquer alterações serão publicadas nesta página com a respectiva nova data de
              atualização no topo do documento. Recomendamos a consulta periódica desta página para
              se manter informado sobre o tratamento dos seus dados pessoais.
            </p>
          </section>

          {/* =========================================================
              SEÇÃO 12 (CONFORME ESPECIFICAÇÃO)
             ========================================================= */}
          <section
            id="secao-12"
            className="scroll-mt-28 space-y-6 pt-8 border-t border-neutral-800/80"
          >
            <div className="border-l-2 border-[#FAB319] pl-3.5">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                Seção 12
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                COMO ENTRAR EM CONTATO CONOSCO
              </h2>
            </div>

            <p className="text-neutral-300 leading-relaxed">
              Para esclarecer qualquer dúvida sobre esta Política de Privacidade ou sobre o
              tratamento de seus dados pessoais, bem como para exercer os direitos previstos no art.
              18 da LGPD, o titular pode entrar em contato com o encarregado pelo tratamento de
              dados pessoais:
            </p>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-3">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  Encarregado pelo tratamento de dados pessoais
                </p>
                <p className="text-lg font-semibold text-white mt-0.5">
                  Rafael Peres Peres Nunes Altoé
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-800 grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-neutral-400 block text-xs">E-mail:</span>
                  <a
                    href="mailto:contato@peresperes.com.br"
                    className="text-[#FAB319] hover:underline font-medium"
                  >
                    contato@peresperes.com.br
                  </a>
                </div>
                <div>
                  <span className="text-neutral-400 block text-xs">WhatsApp:</span>
                  <a
                    href="https://wa.me/556136861689"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FAB319] hover:underline font-medium"
                  >
                    (61) 3686-1689
                  </a>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 text-xs text-neutral-400 leading-relaxed">
                As solicitações formuladas pelo titular serão respondidas no prazo de até 15
                (quinze) dias, contados da data do requerimento, nos termos do art. 19 da Lei Geral
                de Proteção de Dados Pessoais (LGPD).
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
