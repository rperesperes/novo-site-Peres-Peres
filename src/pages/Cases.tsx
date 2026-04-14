import { CASES } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { Scale, TrendingDown } from 'lucide-react'

export default function Cases() {
  const chartConfig = {
    before: { label: 'Carga Inicial (R$)', color: 'hsl(var(--chart-4))' },
    after: { label: 'Após Intervenção (R$)', color: 'hsl(var(--chart-2))' },
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Casos de Sucesso</h1>
          <p className="text-xl text-muted-foreground">
            Resultados tangíveis obtidos através de forte embasamento legal e jurisprudencial.
            <br className="hidden md:block" />
            *Dados sensíveis anonimizados por razões de compliance e LGPD.
          </p>
        </div>

        <div className="grid gap-12">
          {CASES.map((kase) => {
            const chartData = [
              { name: 'Antes', valor: kase.before, fill: 'var(--color-before)' },
              { name: 'Depois', valor: kase.after, fill: 'var(--color-after)' },
            ]

            return (
              <Card key={kase.id} className="overflow-hidden border-none shadow-lg">
                <div className="grid md:grid-cols-2">
                  <div className="p-8 flex flex-col justify-center bg-white">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold w-fit mb-4">
                      {kase.sector}
                    </div>
                    <CardTitle className="text-2xl mb-4 text-primary leading-tight">
                      {kase.title}
                    </CardTitle>
                    <CardDescription className="text-base text-gray-600 mb-6">
                      {kase.description}
                    </CardDescription>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 bg-green-50 p-4 rounded-lg border border-green-100">
                        <TrendingDown className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-900">Redução Efetiva</p>
                          <p className="text-2xl font-bold text-green-700">{kase.savings}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground p-2">
                        <Scale className="h-4 w-4 shrink-0" />
                        <span>
                          Fundamentação validada em jurisprudência superior (STF/STJ/CARF).
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-8 border-l border-slate-100 flex flex-col justify-center">
                    <h4 className="text-center font-semibold text-sm text-slate-500 mb-6 uppercase tracking-wider">
                      Comparativo de Carga Tributária Anual
                    </h4>
                    <div className="h-[250px] w-full">
                      <ChartContainer config={chartConfig} className="w-full h-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="#e2e8f0"
                            />
                            <XAxis
                              dataKey="name"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: '#64748b' }}
                            />
                            <YAxis
                              tickFormatter={(value) => `R$ ${value / 1000}k`}
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: '#64748b', fontSize: 12 }}
                            />
                            <ChartTooltip
                              content={
                                <ChartTooltipContent
                                  formatter={(val) => `R$ ${Number(val).toLocaleString('pt-BR')}`}
                                />
                              }
                            />
                            <Bar dataKey="valor" radius={[4, 4, 0, 0]} barSize={60} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
