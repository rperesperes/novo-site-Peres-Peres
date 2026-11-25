import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ArrowLeft, BookOpen, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CALCULATORS } from '@/lib/calculatorsData'
import {
  calcularProLaboreDividendos,
  LIMITE_LUCROS_ISENTOS_MENSAL,
} from '@/lib/proLaboreDividendosData'
import { DEDUCAO_DEPENDENTE_IRRF, SALARIO_MINIMO_2026 } from '@/lib/folhaData'

const CALCULATOR = CALCULATORS.find((c) => c.slug === 'pro-labore-ou-dividendos')

const formatBRL = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const parseNumber = (raw: string) => {
  const normalized = raw.replace(/\./g, '').replace(',', '.')
  const value = Number(normalized)
  return Number.isFinite(value) && value >= 0 ? value : 0
}

export default function ProLaboreDividendosCalculator() {
  const [proLaboreRaw, setProLaboreRaw] = useState('')
  const [lucrosRaw, setLucrosRaw] = useState('')
  const [dependentesRaw, setDependentesRaw] = useState('0')

  const proLabore = parseNumber(proLaboreRaw)
  const lucros = parseNumber(lucrosRaw)
  const dependentes = Math.floor(parseNumber(dependentesRaw))

  const resultado = useMemo(
    () => calcularProLaboreDividendos({ proLabore, lucrosMes: lucros, dependentes }),
    [proLabore, lucros, dependentes],
  )

  useEffect(() => {
    if (!CALCULATOR) return
    document.title = `${CALCULATOR.name}, simulação | PERES PERES Consultoria & Contabilidade`
    import('@/services/calculator_accesses').then(({ trackCalculatorAccess }) => {
      trackCalculatorAccess(CALCULATOR.slug, CALCULATOR.name)
    })
  }, [])

  if (!CALCULATOR) return null

  return (
    <div className="py-12 md:py-16 bg-background min-h-dvh">
      <div className="container mx-auto px-4 max-w-4xl">
        <nav
          aria-label="Trilha de navegação"
          className="flex items-center gap-2 text-xs md:text-sm text-neutral-500 mb-8"
        >
          <Link to="/" className="hover:text-black transition-colors">
            Início
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-neutral-400" aria-hidden="true" />
          <Link to="/calculadoras" className="hover:text-black transition-colors">
            Calculadoras
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-neutral-400" aria-hidden="true" />
          <span className="text-black font-medium">{CALCULATOR.name}</span>
        </nav>

        <div className="mb-6">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-neutral-600 hover:text-black p-0 h-auto text-xs flex items-center gap-1.5"
          >
            <Link to="/calculadoras">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Voltar ao hub de calculadoras
            </Link>
          </Button>
        </div>

        <div className="border border-neutral-200 bg-white rounded-xl p-8 md:p-12 shadow-sm mb-8">
          <div className="inline-block border border-neutral-300 bg-neutral-100 text-neutral-800 text-xs font-mono uppercase tracking-wider px-3 py-1 rounded mb-4">
            {CALCULATOR.category}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 leading-tight">
            {CALCULATOR.name}
          </h1>
          <p className="text-base text-neutral-700 leading-relaxed mb-8">
            {CALCULATOR.shortDescription}
          </p>

          <form className="grid gap-6 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label htmlFor="pro-labore">Pró-labore mensal (R$)</Label>
              <Input
                id="pro-labore"
                inputMode="decimal"
                autoComplete="off"
                placeholder="Ex.: 5.000,00"
                value={proLaboreRaw}
                onChange={(e) => setProLaboreRaw(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lucros-mes">
                Lucros e dividendos pagos no mês por esta empresa (R$)
              </Label>
              <Input
                id="lucros-mes"
                inputMode="decimal"
                autoComplete="off"
                placeholder="Ex.: 60.000,00"
                value={lucrosRaw}
                onChange={(e) => setLucrosRaw(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dependentes">Número de dependentes para IRRF</Label>
              <Input
                id="dependentes"
                inputMode="numeric"
                autoComplete="off"
                value={dependentesRaw}
                onChange={(e) => setDependentesRaw(e.target.value)}
              />
            </div>
          </form>
          <p className="text-xs text-neutral-500 mt-4">
            Salário mínimo de referência: {formatBRL(SALARIO_MINIMO_2026)}. Dedução por dependente:{' '}
            {formatBRL(DEDUCAO_DEPENDENTE_IRRF)}. Limite mensal isento de lucros por empresa
            pagadora: {formatBRL(LIMITE_LUCROS_ISENTOS_MENSAL)}.
          </p>
        </div>

        <section aria-labelledby="resultado-titulo" className="mb-8">
          <h2 id="resultado-titulo" className="text-xl font-bold text-black mb-4">
            Resultado
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border border-neutral-200 bg-white shadow-sm">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-base text-black mb-1">INSS sobre pró-labore</h3>
                <p className="text-2xl font-bold text-black">
                  {formatBRL(resultado.inssProLabore)}
                </p>
              </CardContent>
            </Card>
            <Card className="border border-neutral-200 bg-white shadow-sm">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-base text-black mb-1">
                  Imposto de renda sobre pró-labore
                </h3>
                <p className="text-2xl font-bold text-black">
                  {formatBRL(resultado.irrfProLabore)}
                </p>
              </CardContent>
            </Card>
            <Card className="border border-neutral-200 bg-white shadow-sm">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-base text-black mb-1">
                  Retenção de 10% sobre lucros excedentes
                </h3>
                <p className="text-2xl font-bold text-black">
                  {formatBRL(resultado.retencaoLucros)}
                </p>
              </CardContent>
            </Card>
          </div>
          <dl className="mt-6 grid sm:grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-neutral-500">Lucros isentos (até o limite mensal)</dt>
              <dd className="font-medium text-neutral-900">{formatBRL(resultado.lucrosIsentos)}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Lucros tributados (excedente)</dt>
              <dd className="font-medium text-neutral-900">
                {formatBRL(resultado.lucrosExcedentes)}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Total de tributos estimados</dt>
              <dd className="font-medium text-neutral-900">{formatBRL(resultado.totalTributos)}</dd>
            </div>
          </dl>
        </section>

        <Card className="border border-neutral-200 bg-white shadow-sm mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 mb-3">
              <BookOpen className="h-5 w-5 text-neutral-800 shrink-0 mt-0.5" aria-hidden="true" />
              <h2 className="font-semibold text-base text-black">Memória de cálculo</h2>
            </div>
            <ol className="list-decimal pl-6 space-y-3 text-sm text-neutral-700 leading-relaxed">
              <li>
                <strong>INSS sobre pró-labore:</strong> tabela progressiva do INSS do empregado, com
                teto de contribuição. Valor apurado: {formatBRL(resultado.inssProLabore)}.
              </li>
              <li>
                <strong>Imposto de renda sobre pró-labore:</strong> base de cálculo de{' '}
                {formatBRL(resultado.baseIrrfProLabore)} (a mais vantajosa entre as deduções legais
                e o desconto simplificado), alíquota de{' '}
                {(resultado.faixaAliquotaIrrf * 100).toLocaleString('pt-BR')}%, imposto bruto de{' '}
                {formatBRL(resultado.irrfBrutoProLabore)} e redutor da Lei nº 15.270/2025 de{' '}
                {formatBRL(resultado.redutorLei15270)}. Valor apurado:{' '}
                {formatBRL(resultado.irrfProLabore)}.
              </li>
              <li>
                <strong>Parcela isenta dos lucros e dividendos:</strong> até{' '}
                {formatBRL(LIMITE_LUCROS_ISENTOS_MENSAL)} por mês por empresa pagadora, equivalente
                a {formatBRL(resultado.lucrosIsentos)} neste cálculo, sem retenção.
              </li>
              <li>
                <strong>Parcela tributada dos lucros e dividendos:</strong> o excedente de{' '}
                {formatBRL(resultado.lucrosExcedentes)} sofre retenção na fonte de 10%, resultando
                em {formatBRL(resultado.retencaoLucros)}.
              </li>
            </ol>
            <div className="flex items-start gap-3 mt-6 pt-4 border-t border-neutral-200">
              <Clock className="h-5 w-5 text-neutral-800 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs text-neutral-600 leading-relaxed">
                Base legal: Lei nº 8.212/1991, art. 10 da Lei nº 9.249/1995 e Lei nº 15.270/2025,
                com efeitos a partir de 1º/1/2026. Resultados são referenciais e não substituem a
                análise de um profissional habilitado perante o Conselho Regional de Contabilidade.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="bg-neutral-950 text-white rounded-xl p-8 text-center space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Necessita dessa análise tributária imediatamente?
          </h2>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Nossa equipe técnica atende empresas de todo o país para diagnósticos fiscais e
            planejamento tributário personalizado com parecer formal.
          </p>
          <div className="pt-2">
            <Button
              asChild
              className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-sm px-6 py-2.5 h-auto"
            >
              <Link to="/contato">Agendar Análise com Especialista</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
