import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Calculator } from 'lucide-react'

export function TaxSimulator() {
  const [revenue, setRevenue] = useState('')
  const [regime, setRegime] = useState('')
  const [result, setResult] = useState<number | null>(null)

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    const revNum = parseFloat(revenue.replace(/\D/g, ''))
    if (isNaN(revNum)) return

    // Dummy calculation logic for demonstration
    let multiplier = 0.05
    if (regime === 'lucro_presumido') multiplier = 0.08
    if (regime === 'lucro_real') multiplier = 0.12

    setResult(revNum * multiplier)
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  }

  return (
    <Card className="w-full max-w-xl mx-auto border-primary/20 shadow-lg">
      <CardHeader className="bg-black text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Simulador de Eficiência Tributária
        </CardTitle>
        <CardDescription className="text-gray-400">
          Descubra o potencial de redução da sua carga tributária com base em nossa expertise.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="revenue">Faturamento Anual (Estimado R$)</Label>
            <Input
              id="revenue"
              placeholder="Ex: 5.000.000,00"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="regime">Regime Tributário Atual</Label>
            <Select onValueChange={setRegime} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o regime" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simples">Simples Nacional</SelectItem>
                <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
                <SelectItem value="lucro_real">Lucro Real</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-black font-bold"
          >
            Analisar Potencial
          </Button>
        </form>

        {result !== null && (
          <div className="mt-6 p-4 bg-emerald-50 rounded-md border border-emerald-200 animate-fade-in-up">
            <h4 className="font-semibold text-emerald-800 text-sm mb-1">
              Potencial de Economia Estimado*
            </h4>
            <p className="text-2xl font-bold text-emerald-700">{formatCurrency(result)} / ano</p>
            <p className="text-xs text-emerald-600 mt-2">
              *Este é um valor estimado baseado em médias do setor. Um planejamento personalizado é
              necessário para dados exatos.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
