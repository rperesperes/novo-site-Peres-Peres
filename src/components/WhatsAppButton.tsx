import { MessageCircle } from 'lucide-react'
import { SITE_INFO } from '@/lib/data'

export function WhatsAppButton() {
  const message = encodeURIComponent('Olá, gostaria de agendar uma consultoria tributária.')
  const url = `https://wa.me/${SITE_INFO.phone.replace(/\D/g, '')}?text=${message}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-black shadow-lg transition-transform hover:scale-110 hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 animate-fade-in-up"
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  )
}
