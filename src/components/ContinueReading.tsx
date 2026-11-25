import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen } from 'lucide-react'

export interface ContinueReadingItem {
  title: string
  description: string
  to: string
  cta: string
}

interface ContinueReadingProps {
  /** Um ou mais cards, mesma ordem definida pela página que usa o bloco. */
  items: ContinueReadingItem[]
}

/**
 * Bloco "Continue lendo", padrão compartilhado das páginas de segmento e de
 * profissões regulamentadas: título + cards com título, descrição de uma linha
 * e botão de acesso. Renderizado ao final de cada página, antes do rodapé.
 */
export function ContinueReading({ items }: ContinueReadingProps) {
  return (
    <section
      aria-label="Continue lendo"
      className="py-12 md:py-16 bg-neutral-50 border-t border-neutral-200"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="max-w-3xl mb-8 space-y-2">
          <h3 className="text-2xl md:text-3xl font-sans font-bold text-black leading-tight">
            Continue lendo
          </h3>
          <p className="text-neutral-600 text-sm md:text-base leading-relaxed font-sans">
            Veja também estes conteúdos da PERES PERES Consultoria & Contabilidade:
          </p>
        </div>

        <div
          className={
            items.length > 2
              ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-stretch'
              : 'grid sm:grid-cols-2 gap-4 md:gap-6 items-stretch'
          }
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-colors rounded-xl p-6 flex flex-col"
            >
              <div className="h-10 w-10 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-4 shrink-0">
                <BookOpen className="h-5 w-5 text-black" />
              </div>
              <h4 className="text-lg font-sans font-bold text-black leading-snug mb-2">
                {item.title}
              </h4>
              <p className="text-sm text-neutral-600 leading-relaxed font-sans mb-5">
                {item.description}
              </p>
              <div className="mt-auto">
                <Link
                  to={item.to}
                  className="inline-flex items-center gap-1.5 bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-sm px-5 py-2.5 rounded-md font-sans transition-colors"
                >
                  {item.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
