import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SegmentFaq } from '@/components/SegmentFaq'
import { useSeo } from '@/hooks/use-seo'
import ShareLine from '@/components/ShareLine'
import { ContinueReading } from '@/components/ContinueReading'
import {
  ChevronRight,
  Phone,
  CalendarClock,
  Scale,
  ClipboardList,
  ShieldCheck,
  Landmark,
} from 'lucide-react'

// Linha do tempo: quatro marcos da transição (LC 214/2025)
const CRONOGRAMA = [
  {
    ano: '2026',
    titulo: 'Ano de teste',
    text: 'Fase de teste com IBS a 0,1% e CBS a 0,9% sem cobrança, na forma do artigo 348 da Lei Complementar 214 de 2025. A empresa emite documento fiscal com os novos tributos, mas sem recolhimento: o período serve para validar sistemas, cadastro e emissão.',
    destaque: true,
  },
  {
    ano: '2027',
    titulo: 'Fim do PIS e da COFINS, início da CBS',
    text: 'PIS e COFINS são extintos e a CBS entra em vigor, com IBS ainda em alíquota marginal. A apuração federal passa a seguir a lógica do novo sistema, e a transição começa a aparecer no preço e no crédito.',
  },
  {
    ano: '2029 a 2032',
    titulo: 'Redução gradual do ICMS e do ISS',
    text: 'ICMS e ISS são reduzidos de forma gradual e proporcional, ano a ano, enquanto IBS e CBS avançam na mesma medida. É a fase em que a convivência dos dois regimes mais exige controle de crédito e de preço.',
  },
  {
    ano: '2033',
    titulo: 'Modelo pleno',
    text: 'O novo sistema alcança o modelo pleno: IBS e CBS respondem pela tributação sobre o consumo, e o regime anterior encerra a transição. A partir daí, a estrutura de crédito e de preço precisa estar desenhada para o sistema definitivo.',
  },
]

// Perguntas frequentes (cinco perguntas curtas)
const FAQ_ITEMS = [
  {
    question: 'A reforma já começou?',
    answer:
      'Sim. A Lei Complementar 214 de 2025 está em vigor e a fase de teste de 2026, com IBS a 0,1% e CBS a 0,9% sem cobrança (art. 348), já faz parte da rotina fiscal das empresas.',
  },
  {
    question: 'Quando o PIS e a COFINS acabam?',
    answer:
      'Em 2027. A partir desse ano, a CBS substitui os dois tributos, e a apuração federal passa a seguir a lógica do novo sistema, com IBS ainda em alíquota marginal.',
  },
  {
    question: 'Quem está no Simples é afetado?',
    answer:
      'Sim, e de duas formas. O Simples continua existindo, mas a opção pela apuração de IBS e CBS pelo regime regular (LC 214/2025, com janelas ajustadas pela Resolução CGSN 186 e pela LC 227 de 2026) muda o crédito que o cliente recebe, e por isso é uma decisão comercial, não apenas fiscal.',
  },
  {
    question: 'O que é split payment?',
    answer:
      'É o recolhimento do tributo na própria liquidação financeira, separando o valor do imposto no momento do pagamento. A liberação começa gradualmente a partir de agosto de 2027, e a obrigatoriedade entre empresas está prevista para 2028, conforme o cronograma em discussão.',
  },
  {
    question: 'O que é Imposto Seletivo?',
    answer:
      'É um tributo adicional que incide sobre bens e serviços específicos, considerados prejudiciais à saúde ou ao meio ambiente, com alíquota própria e regras próprias de incidência (LC 214/2025).',
  },
]

// Itens "O que muda na prática"
const MUDANCAS_PRATICA = [
  {
    icon: Landmark,
    title: 'Fim da cumulatividade',
    text: 'Crédito amplo sobre insumos e serviços: o imposto deixa de ficar retido na cadeia e passa a ser aproveitado em cada etapa, o que muda a leitura de custo em toda a cadeia de fornecedores.',
  },
  {
    icon: CalendarClock,
    title: 'Split payment',
    text: 'Recolhimento do tributo na liquidação financeira, com liberação gradual a partir de agosto de 2027 e obrigatoriedade entre empresas prevista para 2028, conforme o cronograma em discussão. O efeito imediato é sobre caixa e capital de giro.',
  },
  {
    icon: Scale,
    title: 'Fim do benefício estadual como argumento comercial',
    text: 'Benefícios estaduais concedidos no regime anterior deixam de ser diferencial competitivo na negociação, e a escolha de fornecedor volta a se decidir por preço, crédito e operação.',
  },
  {
    icon: ShieldCheck,
    title: 'Imposto Seletivo',
    text: 'Incidência adicional sobre bens e serviços específicos, com alíquota e regras próprias. Setores alcançados precisam revisar precificação e cadeia de crédito antes de o tributo valer.',
  },
  {
    icon: ClipboardList,
    title: 'Regimes diferenciados',
    text: 'Setores determinados têm tratamento diferenciado, com requisitos próprios de apuração, crédito e controle. O enquadramento depende do CNAE e da atividade real da empresa.',
  },
]

// Itens "O que fazer em 2026"
const AGENDA_2026 = [
  'Revisar a cadeia de fornecedores e o crédito que ela gera, para saber o que deixa de ser custo e o que continua.',
  'Simular preço com a CBS no lugar do PIS e da COFINS, antes de a cobrança valer de fato.',
  'Decidir sobre a opção de apurar IBS e CBS fora do DAS, com a janela e as regras da LC 214/2025, da Resolução CGSN 186 e da LC 227 de 2026.',
  'Revisar contrato com cláusula de repasse tributário, para que o efeito da transição não fique todo de um lado.',
]

export default function ReformaTributaria() {
  useSeo({
    title: 'Reforma Tributária: o que muda para a sua empresa até 2033',
    description:
      'Cronograma da Reforma Tributária, escolha do Simples para IBS e CBS, split payment e o que fazer em 2026, explicados pela PERES PERES Consultoria & Contabilidade.',
    canonical: 'https://peresperes.com.br/reforma-tributaria',
    ogTitle: 'Reforma Tributária: o que muda para a sua empresa até 2033',
    ogDescription:
      'Cronograma da transição, escolha do Simples para IBS e CBS e os passos de 2026 que definem crédito, preço e caixa da sua empresa nos próximos anos.',
  })

  // JSON-LD FAQPage e BreadcrumbList
  useEffect(() => {
    const scriptId = 'faq-jsonld-reforma-tributaria'
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null
    if (!scriptTag) {
      scriptTag = document.createElement('script')
      scriptTag.id = scriptId
      scriptTag.type = 'application/ld+json'
      document.head.appendChild(scriptTag)
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Início',
              item: 'https://peresperes.com.br/',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Reforma Tributária',
              item: 'https://peresperes.com.br/reforma-tributaria',
            },
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: FAQ_ITEMS.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        },
      ],
    }

    scriptTag.textContent = JSON.stringify(structuredData)

    return () => {
      const el = document.getElementById(scriptId)
      if (el) {
        el.remove()
      }
    }
  }, [])

  return (
    <div className="flex flex-col w-full font-sans bg-white">
      {/* =========================================================
          SEÇÃO 1: HERO
         ========================================================= */}
      <section className="relative bg-black text-white border-b border-neutral-800 pt-8 pb-16 md:pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-neutral-400 mb-8 font-sans"
          >
            <Link to="/" className="hover:text-white transition-colors">
              Início
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-600" />
            <span className="text-[#FAB319] font-medium">Reforma Tributária</span>
          </nav>

          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 border border-neutral-700 bg-neutral-900/60 px-3 py-1 rounded text-xs tracking-wider uppercase text-neutral-300 font-sans">
              Análise da transição
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white leading-tight max-w-4xl">
              Reforma Tributária
            </h1>

            <p className="text-xl sm:text-2xl md:text-3xl font-sans font-semibold text-neutral-200 max-w-3xl leading-snug">
              o que muda para a sua empresa até 2033
            </p>

            {/* Parágrafo de abertura */}
            <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-3xl leading-relaxed font-sans">
              A Reforma Tributária não se resume à troca de PIS, COFINS, ICMS e ISS pelo IBS e pela
              CBS. Ela altera a forma de calcular crédito, de precificar, de emitir documento fiscal
              e de apurar tributo, com regras de transição que convivem com o regime antigo por
              vários anos. Quem se antecipa escolhe onde se posicionar; quem espera descobre o
              impacto na primeira nota emitida.
            </p>

            <ShareLine
              title="Reforma Tributária: o que muda para a sua empresa até 2033"
              tone="light"
              className="pt-1"
            />

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                size="lg"
                className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-base h-12 px-8 border-none font-sans"
                asChild
              >
                <Link to="/contato">Falar sobre o meu caso</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SEÇÃO 2: O CRONOGRAMA (linha do tempo)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Transição da Lei Complementar 214 de 2025
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              O cronograma
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              A transição se estende por oito anos e passa por quatro marcos. Cada fase muda uma
              parte diferente da rotina fiscal, e a leitura de crédito e preço precisa acompanhar
              cada uma delas.
            </p>
          </div>

          <ol className="relative border-l-2 border-neutral-200 ml-3 space-y-10">
            {CRONOGRAMA.map((marco, idx) => (
              <li key={idx} className="ml-8 relative">
                <span
                  className={
                    marco.destaque
                      ? 'absolute -left-[2.55rem] top-1 h-4 w-4 rounded-full bg-[#FAB319] border-4 border-white'
                      : 'absolute -left-[2.55rem] top-1 h-4 w-4 rounded-full bg-neutral-900 border-4 border-white'
                  }
                />
                <span className="inline-flex items-center gap-2 mb-2">
                  <span className="text-2xl md:text-3xl font-sans font-bold text-black leading-none">
                    {marco.ano}
                  </span>
                  <span className="text-sm md:text-base font-sans font-semibold text-neutral-700">
                    {marco.titulo}
                  </span>
                </span>
                <p className="text-sm md:text-base text-neutral-600 leading-relaxed font-sans max-w-3xl">
                  {marco.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* =========================================================
          SEÇÃO 3: O PONTO QUE DECIDE 2027 (caixa de destaque)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-black text-white rounded-2xl p-6 sm:p-8 md:p-10 border-l-4 border-[#FAB319] shadow-sm space-y-5">
            <h2 className="text-2xl md:text-3xl font-sans font-bold leading-tight">
              O ponto que decide 2027: a escolha do Simples
            </h2>
            <p className="text-base md:text-lg text-neutral-300 leading-relaxed font-sans">
              A Lei Complementar 214 de 2025 permitiu à microempresa e à empresa de pequeno porte
              optar por apurar IBS e CBS pelo regime regular sem sair do Simples nos demais
              tributos. Na prática, a empresa continua pagando o DAS e passa a emitir documento
              fiscal com IBS e CBS na forma do regime regular.
            </p>
            <p className="text-base md:text-lg text-neutral-300 leading-relaxed font-sans">
              A Resolução CGSN 186 antecipou o prazo de opção para setembro. A Lei Complementar 227
              de 2026 manteve setembro e alterou abril para março na segunda janela.
            </p>
            <p className="text-base md:text-lg text-neutral-300 leading-relaxed font-sans">
              A opção é semestral, vale só para IBS e CBS e é irretratável no semestre depois de
              iniciada. E há um efeito sobre o cliente: quem não faz a opção gera ao cliente do
              regime regular crédito limitado ao valor destacado no documento fiscal.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          SEÇÃO 4: PRAZO QUE VENCE AGORA (caixa de destaque)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 border-2 border-black shadow-sm space-y-5">
            <h2 className="text-2xl md:text-3xl font-sans font-bold text-black leading-tight">
              Prazo que vence agora
            </h2>
            <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-sans">
              A opção feita em setembro de 2026 pode ser cancelada até 30 de novembro de 2026, e o
              efeito começa em janeiro de 2027. Quem optou e não reviu a decisão até essa data fica
              com ela para o primeiro semestre.
            </p>
            <p className="text-neutral-600 text-sm md:text-base leading-relaxed font-sans">
              Se a sua empresa fez a opção e ainda não reavaliou o efeito sobre crédito, preço e
              caixa, essa janela é o momento de decidir com os números na mesa.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          SEÇÃO 5: O QUE MUDA NA PRÁTICA (5 itens)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Efeitos sobre a operação
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              O que muda na prática
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              Além do cronograma, cinco mudanças alteram a rotina de apuração, precificação e
              contrato de empresas de todos os portes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {MUDANCAS_PRATICA.map((item, idx) => {
              const Icon = item.icon
              return (
                <Card
                  key={idx}
                  className="border border-neutral-200 shadow-sm hover:border-neutral-300 transition-colors bg-white flex flex-col h-full p-6"
                >
                  <div className="h-10 w-10 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-4 shrink-0">
                    <Icon className="h-5 w-5 text-black" />
                  </div>
                  <h3 className="text-lg font-sans font-bold text-black leading-snug mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed font-sans">{item.text}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          SEÇÃO 6: O QUE FAZER EM 2026 (4 itens)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              Agenda da empresa neste ano
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
              O que fazer em 2026
            </h2>
            <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
              Quatro decisões concentram o impacto de 2026 sobre crédito, preço e caixa nos anos
              seguintes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {AGENDA_2026.map((item, idx) => (
              <div
                key={idx}
                className="border border-neutral-200 rounded-xl p-6 bg-white hover:border-neutral-300 transition-colors flex gap-4"
              >
                <span className="shrink-0 h-9 w-9 rounded-md bg-black text-[#FAB319] flex items-center justify-center font-mono text-sm font-bold">
                  {idx + 1}
                </span>
                <p className="text-sm md:text-base text-neutral-700 leading-relaxed font-sans">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          SEÇÃO 7: O QUE ESTA PÁGINA NÃO FAZ (caixa de destaque)
         ========================================================= */}
      <section className="py-14 md:py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-black text-white rounded-2xl p-6 sm:p-8 md:p-10 border-l-4 border-[#FAB319] shadow-sm space-y-4">
            <h2 className="text-2xl md:text-3xl font-sans font-bold leading-tight">
              O que esta página não faz
            </h2>
            <p className="text-base md:text-lg text-neutral-300 leading-relaxed font-sans">
              Esta página não substitui a análise do caso concreto, não afirma alíquota de
              referência de IBS ou de CBS porque ela ainda depende de resolução do Comitê Gestor, e
              não trata de período anterior a 2026.
            </p>
            <p className="text-sm md:text-base text-neutral-400 leading-relaxed font-sans">
              Diagnóstico de impacto, simulação de preço e decisão sobre a opção do Simples partem
              dos números da sua empresa, em reunião com a nossa equipe.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          SEÇÃO 8: PERGUNTAS FREQUENTES
         ========================================================= */}
      <SegmentFaq heading="Perguntas frequentes sobre a Reforma Tributária" items={FAQ_ITEMS} />

      {/* =========================================================
          SEÇÃO 9: CTA FINAL
         ========================================================= */}
      <section className="py-14 md:py-20 bg-neutral-950 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-white leading-tight">
            Conhecer o escritório custa uma conversa.
          </h2>

          <p className="text-base md:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed font-sans">
            A primeira reunião serve para a gente olhar o seu caso e dizer o que enxerga.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-base h-12 px-8 border-none font-sans"
              asChild
            >
              <Link to="/contato">Falar sobre o meu caso</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white font-medium text-base h-12 px-8 font-sans"
              asChild
            >
              <a href="https://wa.me/556136861689" target="_blank" rel="noopener noreferrer">
                <Phone className="mr-2 h-4 w-4" />
                WhatsApp (61) 3686-1689
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* =========================================================
          SEÇÃO 10: CONTINUE LENDO
         ========================================================= */}
      <ContinueReading
        items={[
          {
            title: 'Serviços',
            description:
              'Planos de acompanhamento mensal, consultoria tributária, recuperação de créditos, área trabalhista e societária da PERES PERES.',
            to: '/servicos',
            cta: 'Ver Serviços',
          },
          {
            title: 'Abertura e alteração de empresas',
            description:
              'Constituição, alteração e desenho societário com enquadramento de CNAE e escolha de regime tributário avaliados desde a abertura.',
            to: '/servicos#abertura-e-alteracao-de-empresas',
            cta: 'Ver Abertura e alteração de empresas',
          },
        ]}
      />
    </div>
  )
}
