import { MessageCircle } from 'lucide-react'
import { SITE_INFO } from '@/lib/data'

export function WhatsAppButton() {
  const isDefined =
    SITE_INFO.whatsapp && !SITE_INFO.whatsapp.includes('a definir') && /\d/.test(SITE_INFO.whatsapp)

  const message = encodeURIComponent('Olá, gostaria de agendar uma consultoria tributária.')
  const url = isDefined
    ? `https://wa.me/${SITE_INFO.whatsapp.replace(/\D/g, '')}?text=${message}`
    : '/contato'

  return (
    <a
      href={url}
      target={isDefined ? '_blank' : '_self'}
      rel={isDefined ? 'noopener noreferrer' : undefined}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white border-2 border-white/20 shadow-xl transition-all hover:scale-105 hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FAB319] focus:ring-offset-2 animate-fade-in-up"
      aria-label="Contato via WhatsApp"
      title={isDefined ? 'Fale conosco via WhatsApp' : 'Contato WhatsApp pendente de definição'}
    >
      <MessageCircle className="h-6 w-6 text-white" />
    </a>
  )
}
