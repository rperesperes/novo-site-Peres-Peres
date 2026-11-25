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
  FileText,
  Landmark,
  Scale,
  ShieldCheck,
} from 'lucide-react'

const CONTATO_PATH = '/contato'

const PERDOADO = [
  {
    title: 'Cem por cento do débito federal',
    desc: 'principal, juros, multa e encargo legal da contribuição previdenciária do MEI com vencimento até 13 de outubro de 2026, na forma do artigo 13, parágrafo primeiro, inciso dez, da Lei Complementar 123 de 2006.',
  },
  {
    title: 'Inscrito ou não em dívida ativa',
    desc: 'alcança tanto os débitos cobrados pela Procuradoria-Geral da Fazenda Nacional quanto os que seguem administrados pela Receita Federal, e também dívidas parceladas, transacionadas, garantidas ou suspensas.',
  },
  {
    title: 'Sem necessidade de pedido',
    desc: 'a baixa é feita de ofício pelos sistemas, conforme a Portaria Conjunta RFB e PGFN número 740, de 22 de outubro de 2026.',
  },
  {
    title: 'Efeitos em 1º de janeiro de 2027',
    desc: 'as dívidas serão extintas nessa data. Até 31 de dezembro de 2026 a cobrança continua normal e as dívidas seguem válidas.',
  },
]

const SITUACOES = [
  {
    title: 'Continuo MEI e tenho dívidas antigas',
    desc: 'o perdão tende a ser vantajoso e é automático, mas a atenção se desloca para a pontualidade do DAS entre janeiro e junho de 2027.',
  },
  {
    title: 'Continuo MEI e estou perto de me aposentar',
    desc: 'aqui a análise é obrigatória, porque o efeito do perdão sobre tempo de contribuição e carência ainda depende de definição do INSS.',
  },
  {
    title: 'Baixei o CNPJ ou virei microempresa',
    desc: 'a condição dos seis meses não se aplica, e a dívida contraída no período em que era MEI é perdoada, salvo se o desenquadramento tiver efeito retroativo ao vencimento.',
  },
]

const PROXIMOS_PASSOS = [
  'Consultar as pendências no portal e-CAC da Receita Federal.',
  'Consultar as dívidas inscritas em Dívida Ativa no Portal Regularize.',
  'Verificar se existe parcelamento, e se ele é composto apenas da contribuição previdenciária ou também de ICMS e ISS.',
  'Se houver ação judicial discutindo a dívida, desistir da ação e protocolar requerimento no Portal de Serviços da Receita Federal ou no Regularize, porque nesse caso o perdão não é automático.',
  'Manter em dia o DAS de janeiro a junho de 2027, para quem continuar como MEI.',
  'Entregar as declarações DASN-SIMEI pendentes, inclusive de anos anteriores, porque essa obrigação continua valendo.',
]

const FAQ_ITEMS = [
  {
    question: 'Preciso fazer algum pedido para ter o perdão?',
    answer:
      'Em regra, não. A baixa é feita de ofício pelos sistemas, conforme a Portaria Conjunta RFB e PGFN número 740 de 2026. A exceção é a dívida discutida em ação judicial, pois nesse caso o perdão não é automático e exige desistência da ação e requerimento próprio.',
  },
  {
    question: 'O que acontece se eu não pagar o DAS de janeiro a junho de 2027?',
    answer:
      'O descumprimento cancela o perdão, previsto na Lei Complementar 238 de 2026, e recompõe integralmente a dívida perdoada, com abatimento dos valores já recolhidos. Os parcelamentos que haviam sido extintos não são reativados. A condição não se aplica a quem já deu baixa no CNPJ ou migrou para microempresa.',
  },
  {
    question: 'O perdão alcança ICMS e ISS?',
    answer:
      'Não. O perdão da Lei Complementar 238 de 2026 alcança a contribuição previdenciária do MEI. O ICMS e o ISS, mesmo quando cobrados no mesmo DAS, são tributos estaduais e municipais e continuam exigíveis pelo ente respectivo. No Distrito Federal, permanece exigível a parcela distrital, acrescida de juros e multa.',
  },
  {
    question: 'Eu estava com parcelamento, o que acontece com ele?',
    answer:
      'O perdão alcança dívidas parceladas. Parcelamentos compostos apenas pela contribuição previdenciária do MEI tendem a ser extintos. Quando o parcelamento inclui ICMS ou ISS, essas parcelas seguem exigíveis. Verifique a composição do seu parcelamento no e-CAC ou no Regularize.',
  },
  {
    question: 'Tenho valores já pagos, serão devolvidos?',
    answer:
      'Não. O perdão não autoriza a devolução de valores já pagos. Os pagamentos realizados são abatidos do débito, e o saldo restante é cancelado. Por isso, o cálculo do que resta a ser perdoado depende dos recolhimentos já feitos.',
  },
  {
    question: 'Estou com ação na Justiça sobre essa dívida, o que faço?',
    answer:
      'Nesse caso o perdão não é automático. É preciso desistir da ação e protocolar requerimento no Portal de Serviços da Receita Federal ou no Regularize, conforme a Portaria Conjunta RFB e PGFN número 740 de 2026. Como cada processo tem particularidades, a decisão deve ser avaliada com o advogado que acompanha o caso.',
  },
  {
    question: 'O perdão conta como tempo de contribuição para aposentadoria?',
    answer:
      'Ainda não há resposta definitiva. A Receita Federal e a Procuradoria-Geral da Fazenda Nacional informarão ao INSS a relação das competências perdoadas, mas os efeitos para tempo de contribuição, carência e benefícios serão definidos pelo INSS, órgão competente para essa análise.',
  },
]

export default function PerdaoDividaMei() {
  useSeo({
    title: 'Perdão das dívidas do MEI | PERES PERES Consultoria & Contabilidade',
    description:
      'Entenda o perdão das dívidas da contribuição previdenciária do MEI previsto na Lei Complementar 238 de 2026: o que é perdoado, o que não é, a condição dos seis meses e a contrapartida ainda em aberto. PERES PERES Consultoria & Contabilidade.',
  })

  return (
    <div className="bg-background min-h-dvh text-foreground">
      {/* =========================================================
          BLOCO 1: ABERTURA
         ========================================================= */}
      <section className="bg-neutral-950 text-white py-16 md:py-24 border-b border-neutral-800">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <span className="inline-flex items-center gap-2 border border-neutral-700 px-3 py-1 rounded text-xs uppercase tracking-wider text-neutral-300">
            <ShieldCheck className="h-3.5 w-3.5 text-[#FAB319]" aria-hidden="true" />
            Lei Complementar 238 de 2026
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            Perdão das dívidas do MEI
          </h1>
          <p className="text-base md:text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            A Lei Complementar 238 de 2026 perdoou as dívidas da contribuição previdenciária do MEI
            vencidas até 13 de outubro de 2026. O perdão é automático, mas tem condição, prazo e uma
            contrapartida que precisa ser avaliada.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Button
              asChild
              className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold px-8 h-12 text-base shadow-sm"
            >
              <Link to={CONTATO_PATH}>Falar com um contador</Link>
            </Button>
          </div>
          <p className="text-xs md:text-sm text-neutral-400 leading-relaxed pt-4">
            Conteúdo da PERES PERES Consultoria & Contabilidade, responsável técnico Rafael Peres
            Peres Nunes Altoé, CRC 027704.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl py-16 space-y-24">
        {/* =========================================================
            BLOCO 2: O QUE É PERDOADO
           ========================================================= */}
        <section aria-labelledby="perdoado-titulo" className="space-y-8">
          <div className="border-l-4 border-[#FAB319] pl-4 md:pl-6">
            <h2 id="perdoado-titulo" className="text-2xl md:text-4xl font-bold text-black">
              O que é perdoado
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {PERDOADO.map((item) => (
              <Card key={item.title} className="border-neutral-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CalendarCheck className="h-6 w-6 text-[#FAB319] mb-2" aria-hidden="true" />
                  <CardTitle className="text-lg font-semibold text-black">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* =========================================================
            BLOCO 3: O QUE NÃO É PERDOADO
           ========================================================= */}
        <section
          aria-labelledby="nao-perdoado-titulo"
          className="bg-neutral-950 text-white rounded-2xl p-8 md:p-12 border border-neutral-800 shadow-xl"
        >
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center gap-3">
              <Landmark className="h-6 w-6 text-[#FAB319] shrink-0" aria-hidden="true" />
              <h2 id="nao-perdoado-titulo" className="text-2xl md:text-4xl font-bold text-white">
                O que não é perdoado
              </h2>
            </div>
            <p className="text-neutral-300 text-sm md:text-base leading-relaxed">
              O ICMS e o ISS cobrados no mesmo DAS não são alcançados, porque são tributos estaduais
              e municipais, e continuam sendo cobrados pelo ente respectivo mesmo estando no mesmo
              documento de arrecadação. No Distrito Federal, permanece exigível a parcela distrital,
              acrescida de juros e multa. O perdão também não autoriza devolução de valores já
              pagos: os pagamentos são abatidos e o saldo restante é cancelado.
            </p>
          </div>
        </section>

        {/* =========================================================
            BLOCO 4: A CONDIÇÃO QUE MANTÉM O PERDÃO
           ========================================================= */}
        <section aria-labelledby="condicao-titulo" className="space-y-8">
          <div className="border-l-4 border-[#FAB319] pl-4 md:pl-6">
            <h2 id="condicao-titulo" className="text-2xl md:text-4xl font-bold text-black">
              A condição que mantém o perdão
            </h2>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-6 md:p-8 shadow-sm">
            <p className="text-neutral-700 text-sm md:text-base leading-relaxed">
              Quem continuar formalmente enquadrado como MEI precisa pagar em dia o DAS dos meses de
              janeiro a junho de 2027. O descumprimento cancela o perdão, recompõe integralmente a
              dívida perdoada, abatendo os valores recolhidos, e os parcelamentos que haviam sido
              extintos não são reativados. A condição não se aplica a quem já deu baixa no CNPJ ou
              migrou para microempresa.
            </p>
          </div>
        </section>

        {/* =========================================================
            BLOCO 5: A CONTRAPARTIDA EM ABERTO
           ========================================================= */}
        <section
          aria-labelledby="contrapartida-titulo"
          className="rounded-2xl border border-[#FAB319]/40 bg-neutral-950 text-white p-8 md:p-12 shadow-xl"
        >
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center gap-3">
              <Scale className="h-6 w-6 text-[#FAB319] shrink-0" aria-hidden="true" />
              <h2 id="contrapartida-titulo" className="text-2xl md:text-4xl font-bold text-white">
                A contrapartida que ainda está em aberto
              </h2>
            </div>
            <p className="text-neutral-300 text-sm md:text-base leading-relaxed">
              A Receita Federal e a Procuradoria-Geral da Fazenda Nacional informarão ao INSS a
              relação das competências perdoadas, mas os efeitos para contagem de tempo de
              contribuição, carência e aquisição de benefícios serão definidos pelo INSS, órgão
              competente para essa análise. Ou seja, não existe hoje resposta definitiva sobre o
              aproveitamento desses meses.
            </p>
            <p className="text-neutral-300 text-sm md:text-base leading-relaxed">
              O DAS-MEI é a via mais barata de contribuir para o INSS, com valor inferior à metade
              do que se pagaria como autônomo ou profissional liberal, e essa comparação precisa
              entrar na conta antes de qualquer decisão.
            </p>
          </div>
        </section>

        {/* =========================================================
            BLOCO 6: EM QUAL SITUAÇÃO VOCÊ ESTÁ
           ========================================================= */}
        <section aria-labelledby="situacao-titulo" className="space-y-8">
          <div className="border-l-4 border-[#FAB319] pl-4 md:pl-6">
            <h2 id="situacao-titulo" className="text-2xl md:text-4xl font-bold text-black">
              Em qual situação você está
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {SITUACOES.map((item) => (
              <Card key={item.title} className="border-neutral-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-black leading-snug">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* =========================================================
            BLOCO 7: O QUE FAZER AGORA
           ========================================================= */}
        <section aria-labelledby="fazer-titulo" className="space-y-8">
          <div className="border-l-4 border-[#FAB319] pl-4 md:pl-6">
            <h2 id="fazer-titulo" className="text-2xl md:text-4xl font-bold text-black">
              O que fazer agora
            </h2>
          </div>
          <ul className="space-y-3">
            {PROXIMOS_PASSOS.map((passo) => (
              <li
                key={passo}
                className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-white p-4 md:p-5 text-sm md:text-base text-neutral-700 leading-relaxed shadow-sm"
              >
                <CheckCircle2
                  className="h-5 w-5 shrink-0 mt-0.5 text-[#FAB319]"
                  aria-hidden="true"
                />
                <span>{passo}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* =========================================================
            BLOCO 8: FAQ
           ========================================================= */}
        <section aria-labelledby="faq-titulo" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block">
              Perguntas frequentes
            </span>
            <h2 id="faq-titulo" className="text-3xl md:text-4xl font-bold text-black leading-tight">
              Dúvidas sobre o perdão
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
            AVISO DE DATA DE REFERÊNCIA
           ========================================================= */}
        <aside
          aria-label="Data de referência do conteúdo"
          className="flex gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-xs md:text-sm text-neutral-600 leading-relaxed"
        >
          <FileText className="h-4 w-4 shrink-0 mt-0.5 text-[#FAB319]" aria-hidden="true" />
          <p>
            Conteúdo com data de referência em novembro de 2026, com base na Lei Complementar 238 de
            2026, na Portaria Conjunta RFB e PGFN 740 de 2026 e nas orientações publicadas pela
            Receita Federal e pela Procuradoria-Geral da Fazenda Nacional. A legislação e os
            procedimentos podem ser alterados.
          </p>
        </aside>

        {/* =========================================================
            BLOCO 9: CHAMADA FINAL
           ========================================================= */}
        <section className="bg-black text-white p-8 md:p-12 rounded-2xl text-center border border-neutral-800 shadow-xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              Conhecer o escritório custa uma conversa
            </h2>
            <div className="pt-4 flex justify-center">
              <Button
                asChild
                className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold px-8 h-12 text-base shadow-sm"
              >
                <Link to={CONTATO_PATH}>
                  Falar com um contador
                  <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
