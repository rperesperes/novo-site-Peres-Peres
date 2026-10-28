import { GLOSSARY } from '@/lib/data'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { BookA } from 'lucide-react'

export default function Glossary() {
  // Sort alphabetically
  const sortedGlossary = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term))

  return (
    <div className="py-24 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-10 animate-fade-in-up">
          <div className="p-3 bg-neutral-100 rounded-lg border border-neutral-300">
            <BookA className="h-8 w-8 text-black" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-black">Glossário Tributário</h1>
            <p className="text-neutral-600 text-sm md:text-base">
              Conceitos fundamentais da legislação tributária e contabilidade consultiva.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-xl border border-neutral-200 shadow-sm">
          <Accordion type="single" collapsible className="w-full">
            {sortedGlossary.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-neutral-200 py-1"
              >
                <AccordionTrigger className="text-lg font-semibold hover:text-neutral-600 text-black hover:no-underline">
                  {item.term}
                </AccordionTrigger>
                <AccordionContent className="text-sm md:text-base text-neutral-700 leading-relaxed pb-4">
                  {item.definition}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  )
}
