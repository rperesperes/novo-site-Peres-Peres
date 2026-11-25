import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export interface SegmentFaqItem {
  question: string
  answer: string
}

interface SegmentFaqProps {
  heading: string
  items: SegmentFaqItem[]
}

/**
 * Seção "Perguntas frequentes" das páginas de área e profissão.
 * Padrão visual único nas doze páginas: acordeão com a primeira pergunta aberta.
 */
export function SegmentFaq({ heading, items }: SegmentFaqProps) {
  return (
    <section className="py-14 md:py-20 bg-neutral-50 border-b border-neutral-200">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block font-sans">
            Perguntas frequentes
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-black leading-tight">
            {heading}
          </h2>
        </div>

        <Accordion type="single" collapsible defaultValue="faq-0" className="w-full space-y-3">
          {items.map((item, idx) => (
            <AccordionItem
              key={idx}
              value={`faq-${idx}`}
              className="bg-white border border-neutral-200 rounded-lg px-6 py-1 data-[state=open]:border-neutral-300 shadow-sm"
            >
              <AccordionTrigger className="text-left font-sans font-semibold text-base sm:text-lg text-black hover:no-underline py-4">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="font-sans text-sm sm:text-base text-neutral-700 leading-relaxed pb-4 pt-1">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
