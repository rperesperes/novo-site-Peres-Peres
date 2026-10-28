import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { REAL_CASES } from '@/lib/casesData'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ShieldCheck, Calendar, Briefcase } from 'lucide-react'

export default function Cases() {
  // Ordenados do mais recente para o mais antigo (data decrescente)
  const sortedCases = useMemo(() => {
    return [...REAL_CASES].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [])

  return (
    <div className="py-16 md:py-24 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Cabeçalho da Seção de Casos */}
        <header className="mb-14 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-neutral-300 bg-neutral-100 px-3 py-1 rounded text-xs font-mono text-neutral-700 uppercase tracking-wider mb-4">
            <Briefcase className="h-3.5 w-3.5 text-neutral-900" />
            Atuação Técnica Comprovada
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-5 text-black">Casos Reais</h1>

          {/* Introdução curta de 2-3 linhas explicando o sigilo e anonimização */}
          <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-sans">
            Casos reais conduzidos pela PERES PERES Consultoria e Contabilidade, demonstrando a
            aplicação técnica da legislação e a higidez contábil. Por dever de sigilo profissional e
            em estrito respeito à Lei Geral de Proteção de Dados (LGPD), todas as informações
            sensíveis e identificadoras dos clientes foram devidamente anonimizadas.
          </p>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-500">
            <ShieldCheck className="h-4 w-4 text-neutral-800" />
            <span>Responsabilidade Técnica: Rafael Peres Peres Nunes Altoé (CRC 027704/O)</span>
          </div>
        </header>

        {/* Grade de Cards de Casos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedCases.map((caseItem) => (
            <Card
              key={caseItem.id}
              className="flex flex-col justify-between border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge className="bg-black text-white hover:bg-neutral-800 text-xs font-normal">
                    {caseItem.category}
                  </Badge>
                  <span className="flex items-center gap-1 text-[11px] text-neutral-500 font-mono">
                    <Calendar className="h-3 w-3" />
                    {caseItem.dateFormatted}
                  </span>
                </div>
                <CardTitle className="text-xl font-bold text-black leading-snug line-clamp-2">
                  <Link
                    to={`/casos/${caseItem.slug}`}
                    className="hover:text-neutral-700 transition-colors"
                  >
                    {caseItem.title}
                  </Link>
                </CardTitle>
              </CardHeader>

              <CardContent className="pb-4">
                {/* Resumo de duas linhas */}
                <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2">
                  {caseItem.summary}
                </p>
              </CardContent>

              <CardFooter className="pt-2 border-t border-neutral-100">
                <Link
                  to={`/casos/${caseItem.slug}`}
                  className="inline-flex items-center text-sm font-semibold text-black hover:text-neutral-700 group transition-colors"
                >
                  Ler caso completo
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Bloco de Atendimento com ponto focal amarelo #FAB319 */}
        <div className="mt-20 p-8 md:p-12 rounded-xl bg-black text-white text-center space-y-6 border border-neutral-800">
          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Submeta sua operação a uma avaliação técnica
            </h2>
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
              Análise preliminar individualizada sob responsabilidade formal de contador habilitado
              (CRC 027704/O), com foco estrito em conformidade e segurança jurídica.
            </p>
          </div>
          <div>
            <Link
              to="/contato"
              className="inline-flex items-center justify-center rounded-md text-sm font-semibold h-11 px-8 bg-[#FAB319] hover:bg-[#e0a116] text-black transition-colors"
            >
              Agendar Consultoria Técnica
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
