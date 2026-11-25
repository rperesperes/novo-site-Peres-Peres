import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSeo } from '@/hooks/use-seo'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  MessageSquare,
  Radar,
  Receipt,
  ShieldCheck,
} from 'lucide-react'

// Blocos de "O que está incluído"
const INCLUIDOS = [
  {
    icon: CalendarCheck,
    title: 'DAS em dia',
    desc: 'Envio mensal da guia e acompanhamento do pagamento.',
  },
  {
    icon: ClipboardCheck,
    title: 'Regularização e parcelamento',
    desc: 'Negociação de débitos antigos e recuperação da situação do CNPJ.',
  },
  {
    icon: FileText,
    title: 'Declaração anual',
    desc: 'Entrega da DASN-SIMEI dentro do prazo e sem inconsistências.',
  },
  {
    icon: Receipt,
    title: 'Notas fiscais',
    desc: 'Emissão de notas fiscais de serviço conforme o seu plano.',
  },
  {
    icon: Radar,
    title: 'Radar de pendências',
    desc: 'Verificação periódica de pendências federais, estaduais e municipais antes que virem bloqueio.',
  },
  {
    icon: MessageSquare,
    title: 'Atendimento consultivo',
    desc: 'Acesso a contador para dúvidas contábeis, tributárias e de organização financeira do negócio.',
  },
]

const PASSOS = [
  {
    step: '01',
    title: 'Conversa inicial',
    desc: 'Entendemos o momento do seu negócio, a sua atividade e o que precisa ser resolvido primeiro.',
  },
  {
    step: '02',
    title: 'Plano e documentação',
    desc: 'Você escolhe o plano adequado e envia a documentação necessária para começarmos.',
  },
  {
    step: '03',
    title: 'Acompanhamento mensal',
    desc: 'Um contador responsável acompanha as obrigações do mês e responde às suas dúvidas.',
  },
]

const PLANOS = [
  {
    id: 'essencial',
    name: 'Plano Essencial',
    price: 'R$ 39,90',
    highlight: false,
    items: [
      'Abertura do MEI',
      'Emissão mensal da guia DAS',
      'Emissão de até duas notas fiscais de serviço por mês',
      'Declaração anual do MEI',
    ],
  },
  {
    id: 'completo',
    name: 'Plano Completo',
    price: 'R$ 99,90',
    highlight: true,
    items: [
      'Abertura e alterações do MEI',
      'Emissão mensal da guia DAS',
      'Emissão ilimitada de notas fiscais de serviço',
      'Declaração anual do MEI',
      'Gestão de contas a pagar e a receber',
      'Regularização do MEI',
      'Parcelamento de contribuições em atraso',
      'Monitoramento de pendências',
      'Acompanhamento das mudanças na legislação',
      'Atendimento consultivo com contador',
    ],
  },
]

const FAQ_ITEMS = [
  {
    question: 'Quanto posso faturar como MEI?',
    answer:
      'O limite anual de faturamento do MEI é de R$ 81 mil em 2026, o equivalente a R$ 6.750 por mês. Para 2027 e 2028, a Lei Complementar 238 de 2026 prevê limites maiores, de R$ 110 mil e R$ 140 mil. Confira os valores na legislação vigente antes de tomar decisões.',
  },
  {
    question: 'O que acontece se eu ultrapassar o limite?',
    answer:
      'Se o faturamento do ano passar do limite, o MEI deixa de ser enquadrado como tal a partir do mês em que o excesso ocorreu, e a empresa precisa migrar para outro regime, em regra microempresa. Por isso, o planejamento deve acontecer antes do estouro, e não depois.',
  },
  {
    question: 'Posso ter empregado sendo MEI?',
    answer:
      'Sim, o MEI pode contratar um empregado, com salário de no máximo um salário mínimo ou o piso da categoria. A contratação gera obrigações trabalhistas e previdenciárias próprias, como FGTS e eSocial, e precisa ser acompanhada com cuidado.',
  },
  {
    question: 'O que é a declaração anual do MEI e o que acontece se eu não entregar?',
    answer:
      'A declaração anual do MEI, a DASN-SIMEI, informa o faturamento do ano anterior e deve ser entregue até 31 de maio. A entrega fora do prazo gera multa, e a falta de entrega pode gerar pendências que dificultam a regularidade do CNPJ.',
  },
  {
    question: 'Estou com DAS atrasado, o que faço?',
    answer:
      'O primeiro passo é levantar quais guias estão em aberto e conferir a situação do CNPJ. Em seguida, é possível quitar a guia com os juros e multa devidos ou negociar um parcelamento, conforme as regras vigentes. Quanto antes a situação for analisada, mais simples tende a ser a regularização.',
  },
  {
    question: 'Preciso emitir nota fiscal em toda venda?',
    answer:
      'Depende do tipo de operação. Vendas de produtos e prestações de serviço podem exigir documento fiscal, e a regra varia conforme a atividade, o cliente e o município ou estado. Um contador pode confirmar quais notas são obrigatórias no seu caso.',
  },
]

const CONTATO_PATH = '/contato'

export default function MeiCompleto() {
  useSeo({
    title: 'MEI Completo | PERES PERES Consultoria & Contabilidade',
    description:
      'MEI com contador de verdade por trás: obrigações em dia, DAS, declaração anual, notas fiscais e orientação sobre o limite de faturamento. PERES PERES Consultoria & Contabilidade.',
  })

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return (
    <div className="bg-background min-h-dvh text-foreground">
      {/* =========================================================
          BLOCO 1: ABERTURA
         ========================================================= */}
      <section className="bg-neutral-950 text-white py-16 md:py-24 border-b border-neutral-800">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <span className="inline-flex items-center gap-2 border border-neutral-700 px-3 py-1 rounded text-xs uppercase tracking-wider text-neutral-300">
            <ShieldCheck className="h-3.5 w-3.5 text-[#FAB319]" aria-hidden="true" />
            Microempreendedor Individual
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">MEI Completo</h1>
          <p className="text-base md:text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            O MEI com contador de verdade por trás: obrigações em dia, dúvidas respondidas por quem
            entende e apoio na hora de crescer ou de sair do MEI.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Button
              type="button"
              onClick={() => scrollToSection('planos')}
              className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold px-8 h-12 text-base shadow-sm"
            >
              Ver planos
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-[#FAB319] bg-transparent text-white hover:bg-white/10 hover:text-white font-semibold px-8 h-12 text-base"
            >
              <Link to={CONTATO_PATH}>Falar com um contador</Link>
            </Button>
          </div>
          <p className="text-xs md:text-sm text-neutral-400 leading-relaxed pt-4">
            Frente de atendimento da PERES PERES Consultoria & Contabilidade, com responsabilidade
            técnica de Rafael Peres Peres Nunes Altoé, CRC 027704.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl py-16 space-y-24">
        {/* =========================================================
            BLOCO 2: DOIS CAMINHOS
           ========================================================= */}
        <section aria-labelledby="momento-titulo" className="space-y-8">
          <div className="border-l-4 border-[#FAB319] pl-4 md:pl-6">
            <h2 id="momento-titulo" className="text-2xl md:text-4xl font-bold text-black">
              Em qual momento você está
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => scrollToSection('servicos-incluidos')}
              className="group flex flex-col items-start gap-3 rounded-xl border border-neutral-200 bg-white p-6 md:p-8 text-left shadow-sm transition-colors hover:border-[#FAB319] focus-visible:border-[#FAB319] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAB319]/60"
            >
              <span className="flex w-full items-start justify-between gap-2">
                <span className="text-lg md:text-xl font-semibold text-black leading-snug">
                  Quero abrir ou regularizar meu MEI
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 mt-0.5 text-[#FAB319] transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="text-sm md:text-base text-neutral-600 leading-relaxed">
                Para quem vai formalizar a atividade, está com DAS atrasado, com declaração pendente
                ou com o CNPJ irregular.
              </span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('limite-faturamento')}
              className="group flex flex-col items-start gap-3 rounded-xl border border-neutral-200 bg-white p-6 md:p-8 text-left shadow-sm transition-colors hover:border-[#FAB319] focus-visible:border-[#FAB319] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAB319]/60"
            >
              <span className="flex w-full items-start justify-between gap-2">
                <span className="text-lg md:text-xl font-semibold text-black leading-snug">
                  Meu MEI cresceu e preciso de orientação
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 mt-0.5 text-[#FAB319] transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="text-sm md:text-base text-neutral-600 leading-relaxed">
                Para quem está perto do limite de faturamento, recebeu notificação, precisa migrar
                para microempresa ou quer avaliar se o regime ainda compensa.
              </span>
            </button>
          </div>
        </section>

        {/* =========================================================
            BLOCO 3: O QUE ESTÁ INCLUÍDO
           ========================================================= */}
        <section id="servicos-incluidos" className="scroll-mt-24 space-y-8">
          <div className="border-l-4 border-[#FAB319] pl-4 md:pl-6">
            <h2 className="text-2xl md:text-4xl font-bold text-black">O que está incluído</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INCLUIDOS.map((item) => (
              <Card key={item.title} className="border-neutral-200 shadow-sm">
                <CardHeader className="pb-2">
                  <item.icon className="h-6 w-6 text-[#FAB319] mb-2" aria-hidden="true" />
                  <CardTitle className="text-lg font-semibold text-black">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* =========================================================
            BLOCO 4: COMO FUNCIONA
           ========================================================= */}
        <section aria-labelledby="como-funciona-titulo" className="space-y-8">
          <div className="border-l-4 border-[#FAB319] pl-4 md:pl-6">
            <h2 id="como-funciona-titulo" className="text-2xl md:text-4xl font-bold text-black">
              Como funciona
            </h2>
          </div>

          <ol className="grid md:grid-cols-3 gap-4">
            {PASSOS.map((passo) => (
              <li
                key={passo.step}
                className="rounded-xl bg-neutral-950 text-white p-6 md:p-8 space-y-3 shadow-xl"
              >
                <span className="text-sm font-mono font-semibold text-[#FAB319]">{passo.step}</span>
                <h3 className="text-lg font-semibold text-white">{passo.title}</h3>
                <p className="text-sm text-neutral-300 leading-relaxed">{passo.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* =========================================================
            BLOCO 5: PLANOS DE ACOMPANHAMENTO MENSAL
           ========================================================= */}
        <section id="planos" className="scroll-mt-24 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              Planos de acompanhamento mensal
            </h2>
            <p className="text-neutral-700 text-sm md:text-base leading-relaxed">
              O que muda entre os planos é o escopo do acompanhamento, não o padrão do atendimento.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {PLANOS.map((plano) => (
              <Card
                key={plano.id}
                className={`flex flex-col justify-between ${
                  plano.highlight
                    ? 'border-2 border-neutral-950 bg-neutral-950 text-white shadow-xl'
                    : 'border border-neutral-200 bg-white shadow-sm'
                }`}
              >
                <div>
                  <CardHeader className="pb-4 space-y-3">
                    {plano.highlight && (
                      <span className="inline-flex w-fit text-[11px] uppercase tracking-wider px-2.5 py-1 rounded font-semibold bg-[#FAB319] text-black">
                        Mais indicado
                      </span>
                    )}
                    <CardTitle
                      className={`text-2xl font-bold ${plano.highlight ? 'text-white' : 'text-black'}`}
                    >
                      {plano.name}
                    </CardTitle>
                    <p className="flex flex-wrap items-baseline gap-1">
                      <span
                        className={`text-3xl md:text-4xl font-bold ${
                          plano.highlight ? 'text-[#FAB319]' : 'text-black'
                        }`}
                      >
                        {plano.price}
                      </span>
                      <span
                        className={`text-sm ${plano.highlight ? 'text-neutral-300' : 'text-neutral-600'}`}
                      >
                        por mês
                      </span>
                    </p>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <h3
                      className={`text-xs uppercase tracking-wider font-semibold mb-3 ${
                        plano.highlight ? 'text-neutral-400' : 'text-neutral-500'
                      }`}
                    >
                      O que inclui
                    </h3>
                    <ul className="space-y-2.5">
                      {plano.items.map((item) => (
                        <li
                          key={item}
                          className={`flex items-start gap-2.5 text-sm leading-snug ${
                            plano.highlight ? 'text-neutral-200' : 'text-neutral-700'
                          }`}
                        >
                          <CheckCircle2
                            className="h-4 w-4 shrink-0 mt-0.5 text-[#FAB319]"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </div>

                <div
                  className={`p-6 pt-4 border-t ${
                    plano.highlight ? 'border-neutral-800' : 'border-neutral-100'
                  }`}
                >
                  <Button
                    asChild
                    className={`w-full font-semibold h-11 text-sm ${
                      plano.highlight
                        ? 'bg-[#FAB319] hover:bg-[#e0a116] text-black'
                        : 'bg-black hover:bg-neutral-800 text-white'
                    }`}
                  >
                    <Link to={CONTATO_PATH}>
                      Falar com um contador{' '}
                      <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <p className="text-center text-xs md:text-sm text-neutral-600 leading-relaxed max-w-3xl mx-auto">
            Os valores são mensais. O escopo de cada plano é exatamente o descrito nos itens de cada
            cartão.
          </p>
        </section>

        {/* =========================================================
            BLOCO 6: LIMITE DE FATURAMENTO
           ========================================================= */}
        <section
          id="limite-faturamento"
          className="scroll-mt-24 bg-neutral-950 text-white rounded-2xl p-8 md:p-12 border border-neutral-800 shadow-xl"
        >
          <div className="max-w-3xl mx-auto space-y-5">
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              O limite do MEI está mudando
            </h2>
            <p className="text-neutral-300 text-sm md:text-base leading-relaxed">
              O teto anual de faturamento do MEI em 2026 é de <strong>R$ 81 mil</strong>, o
              equivalente a <strong>R$ 6.750 por mês</strong>. A Lei Complementar 238 de 2026 elevou
              o limite para <strong>R$ 110 mil em 2027</strong> e{' '}
              <strong>R$ 140 mil em 2028</strong>.
            </p>
            <p className="text-neutral-300 text-sm md:text-base leading-relaxed">
              No ano de abertura do CNPJ, o limite é proporcional aos meses de atividade.
            </p>
            <p className="flex gap-2 rounded-lg border border-[#FAB319]/40 bg-neutral-900 p-4 text-sm text-neutral-300 leading-relaxed">
              <span className="font-semibold text-[#FAB319]">Atenção:</span>
              <span>
                confira os valores na legislação vigente antes de tomar qualquer decisão, porque as
                regras podem ser alteradas.
              </span>
            </p>
            <p className="text-base md:text-lg font-semibold text-white leading-relaxed">
              Crescer acima do limite não é problema, desde que a migração para microempresa seja
              planejada antes do estouro.
            </p>
          </div>
        </section>

        {/* =========================================================
            BLOCO 7: FAQ
           ========================================================= */}
        <section aria-labelledby="faq-titulo" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block">
              Perguntas frequentes
            </span>
            <h2 id="faq-titulo" className="text-3xl md:text-4xl font-bold text-black leading-tight">
              Dúvidas sobre o MEI
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {FAQ_ITEMS.map((item, idx) => (
              <AccordionItem
                key={item.question}
                value={`item-${idx}`}
                className="bg-white border border-neutral-200 rounded-lg px-6 py-1 data-[state=open]:border-neutral-300 shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold text-base sm:text-lg text-black hover:no-underline py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-neutral-700 leading-relaxed pb-4 pt-1">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* =========================================================
            BLOCO 8: CHAMADA FINAL
           ========================================================= */}
        <section className="bg-black text-white p-8 md:p-12 rounded-2xl text-center border border-neutral-800 shadow-xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              Conhecer o escritório custa uma conversa
            </h2>
            <div className="pt-4 flex justify-center">
              <Button
                size="lg"
                asChild
                className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold px-8 h-12 text-base shadow-sm"
              >
                <Link to={CONTATO_PATH}>Falar com um contador</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
