import { ShieldCheck } from 'lucide-react'

type ReformaItem = {
  title: string
  text: string
}

const ABERTURA =
  'a página trata das duas mudanças que já valem, a trava do Simples e a tributação de dividendos. Falta a terceira, que começa em 2027 e atinge justamente a holding que vive de aluguel.'

const REFORMA_ITEMS: ReformaItem[] = [
  {
    title: 'O aluguel deixa de ser renda sem tributo',
    text: 'o aluguel recebido por pessoa jurídica nunca foi alcançado pelo ISS, porque a incidência sobre locação de imóveis ficou fora do imposto municipal, na esteira da lógica da Súmula Vinculante 31 e do RE 116.121/SP, que tratam de locação de bens móveis. Com o fim do PIS e da COFINS em 2027 e o início da CBS, a locação de imóveis passa a ter regime específico no artigo 261 da Lei Complementar 214 de 2025, com redução de 70%. O redutor social do artigo 260 não se aplica quando o locatário é pessoa jurídica. O efeito prático é direto: a renda de aluguel que hoje entra quase inteira passa a suportar tributo sobre a receita.',
  },
  {
    title: 'O contrato define quem paga',
    text: 'a lei aponta o contribuinte, não diz quem arca com o tributo em contrato assinado antes da mudança. Contrato de locação em curso sem cláusula de repasse tributário vira negociação entre as partes, e o locador costuma ser quem absorve. Revisar a cláusula antes de dezembro de 2026 é mais barato que renegociar depois.',
  },
  {
    title: 'A nota fiscal muda',
    text: 'desde 1º de dezembro de 2026, o locador do regime regular emite documento fiscal de cada aluguel recebido, com destaque de IBS e CBS. Quem aluga sem emitir documento precisa se organizar antes dessa data.',
  },
  {
    title: 'A trava do Simples continua igual',
    text: 'a reforma não abriu o Simples Nacional para holding. As vedações do artigo 3º, parágrafo quarto, e do artigo 17 da Lei Complementar 123 de 2006 seguem como estão. Quem esperava que 2027 trouxesse uma janela para holding no Simples não vai encontrar.',
  },
]

const NAO_FAZ = {
  title: 'O que esta seção não faz',
  text: 'Não afirma alíquota efetiva da locação, porque ela depende da regulamentação e do valor do aluguel. Não substitui a análise do contrato vigente. E não trata de imóvel mantido em uso na própria atividade, que não gera receita de locação.',
}

export function HoldingsReforma2027Section() {
  return (
    <div className="mt-12">
      <div className="max-w-3xl mb-10">
        <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
          Reforma tributária
        </span>
        <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
          O que a reforma muda na holding a partir de 2027
        </h2>
        <p className="text-neutral-700 text-base md:text-lg mt-3 leading-relaxed font-sans">
          {ABERTURA}
        </p>
      </div>

      <div className="space-y-6">
        {REFORMA_ITEMS.map((item, idx) => (
          <div
            key={idx}
            className="border border-neutral-200 rounded-xl p-6 bg-white hover:border-neutral-300 transition-colors"
          >
            <h3 className="text-xl font-sans font-bold text-black mb-3">{item.title}</h3>
            <p className="text-sm text-neutral-600 leading-relaxed font-sans">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-black text-white rounded-xl p-6 md:p-8 border-l-4 border-[#FAB319] shadow-md">
        <div className="flex items-start gap-4">
          <ShieldCheck className="h-6 w-6 text-[#FAB319] shrink-0 mt-1" />
          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-sans font-bold text-white leading-snug">
              {NAO_FAZ.title}
            </h3>
            <p className="text-base md:text-lg leading-relaxed font-sans text-neutral-100">
              {NAO_FAZ.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
