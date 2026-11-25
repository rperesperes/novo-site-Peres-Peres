// Bloco "Forma de exercício da profissão", compartilhado pelas páginas de profissões regulamentadas.

type ProfessionExerciseFormProps = {
  title: string
  intro: string
  extraItems: [string, string]
}

const CARDS = [
  {
    title: 'Pessoa física',
    text: 'Atua em nome próprio, com CPF, e emite nota fiscal ou recibo conforme a regra do município. O rendimento é tributado na declaração de ajuste anual, com recolhimento mensal sobre o que recebe de pessoa física e retenção na fonte quando o tomador é pessoa jurídica. A contribuição previdenciária incide sobre os honorários. Não há obrigação de escrituração contábil.',
  },
  {
    title: 'Pessoa jurídica em sociedade limitada unipessoal',
    text: 'CNPJ próprio, com regime tributário definido entre Simples Nacional, Lucro Presumido e Lucro Real, e obrigações acessórias. A retirada se divide entre pró-labore, tributado e base da contribuição previdenciária, e distribuição de lucros. Permite deduzir despesas da atividade, contratar empregados e separar o patrimônio pessoal do empresarial.',
  },
]

const TABLE_ROWS = [
  {
    label: 'Nota fiscal',
    pf: 'Em nome próprio, conforme regra municipal',
    pj: 'Pelo CNPJ, com ISS e retenções',
  },
  {
    label: 'Imposto de renda',
    pf: 'Tabela progressiva do imposto de renda da pessoa física com carnê-leão',
    pj: 'Simples nos Anexos III, IV ou V, Presumido ou Real',
  },
  {
    label: 'Previdência',
    pf: 'Sobre os honorários recebidos',
    pj: 'Sobre o pró-labore',
  },
  {
    label: 'Retirada',
    pf: 'O honorário é renda pessoal',
    pj: 'Pró-labore e distribuição de lucros',
  },
  {
    label: 'Escrituração',
    pf: 'Sem obrigação contábil formal',
    pj: 'Escrituração, demonstrações e obrigações acessórias',
  },
  {
    label: 'Custo mensal',
    pf: 'Menor',
    pj: 'Inclui contabilidade e conformidade',
  },
  {
    label: 'Responsabilidade',
    pf: 'Pessoal e ilimitada',
    pj: 'Limitada ao capital, com ressalvas legais',
  },
]

const FIXED_ITEMS = [
  'Faturamento previsto para os próximos doze meses, com cenários.',
  'Alíquota de ISS do município e retenções praticadas pelos tomadores.',
  'Se os clientes exigem nota fiscal de pessoa jurídica.',
  'Necessidade de contratar empregados ou admitir sócios.',
  'Proteção patrimonial e sucessão.',
  'Custo de manutenção da pessoa jurídica.',
]

const FINAL_TEXT =
  'Não existe resposta única. A definição exige projeção de faturamento, teste de cenários e verificação das regras do conselho de classe e do município. Também é preciso avaliar se o formato não caracteriza vínculo de emprego disfarçado, quando há um único tomador e subordinação. Esta página apresenta critérios técnicos, não recomendação individualizada.'

export function ProfessionExerciseForm({ title, intro, extraItems }: ProfessionExerciseFormProps) {
  const decisionItems = [...FIXED_ITEMS, ...extraItems]

  return (
    <section
      aria-labelledby="forma-exercicio-titulo"
      className="py-14 md:py-20 bg-neutral-950 text-white border-b border-neutral-800 font-sans"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-wider text-[#FAB319] font-semibold block mb-2 font-sans">
            Forma de exercício da profissão
          </span>
          <h2
            id="forma-exercicio-titulo"
            className="text-3xl md:text-4xl font-sans font-bold text-white leading-tight"
          >
            {title}
          </h2>
          <p className="text-neutral-300 text-base md:text-lg mt-3 leading-relaxed font-sans">
            {intro}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {CARDS.map((card) => (
            <article
              key={card.title}
              className="flex flex-col rounded-xl border border-neutral-800 bg-neutral-900 p-6 md:p-8"
            >
              <h3 className="text-xl font-sans font-bold text-white leading-snug mb-3">
                {card.title}
              </h3>
              <p className="text-sm md:text-base text-neutral-300 leading-relaxed font-sans">
                {card.text}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 overflow-x-auto rounded-xl border border-neutral-800">
          <table className="w-full text-left text-sm md:text-base font-sans">
            <caption className="sr-only">Comparação entre pessoa física e pessoa jurídica</caption>
            <thead className="bg-neutral-900">
              <tr>
                <th scope="col" className="p-4 font-semibold text-[#FAB319]">
                  Critério
                </th>
                <th scope="col" className="p-4 font-semibold text-[#FAB319]">
                  Pessoa física
                </th>
                <th scope="col" className="p-4 font-semibold text-[#FAB319]">
                  Pessoa jurídica
                </th>
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((row) => (
                <tr key={row.label} className="border-t border-neutral-800">
                  <th scope="row" className="p-4 font-semibold text-white align-top">
                    {row.label}
                  </th>
                  <td className="p-4 text-neutral-300 align-top">{row.pf}</td>
                  <td className="p-4 text-neutral-300 align-top">{row.pj}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12">
          <h3 className="text-xl md:text-2xl font-sans font-bold text-white mb-5">
            O que define a escolha
          </h3>
          <ol className="list-decimal pl-6 space-y-3 text-neutral-300 text-sm md:text-base leading-relaxed font-sans marker:text-[#FAB319] marker:font-semibold">
            {decisionItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>

        <div className="mt-12 rounded-xl border-l-4 border-[#FAB319] bg-neutral-900 p-6 md:p-8">
          <p className="text-base md:text-lg text-white leading-relaxed font-sans">{FINAL_TEXT}</p>
        </div>
      </div>
    </section>
  )
}
