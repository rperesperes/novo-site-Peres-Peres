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
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-primary/5 rounded-lg">
            <BookA className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Glossário Tributário</h1>
            <p className="text-muted-foreground">
              Termos técnicos descomplicados para o empresário.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 md:p-8 rounded-xl border border-gray-100">
          <Accordion type="single" collapsible className="w-full">
            {sortedGlossary.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-gray-200"
              >
                <AccordionTrigger className="text-lg font-semibold hover:text-accent hover:no-underline">
                  {item.term}
                </AccordionTrigger>
                <AccordionContent className="text-base text-gray-700 leading-relaxed pb-4">
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
