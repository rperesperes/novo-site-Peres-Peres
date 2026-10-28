import { MessageCircle } from 'lucide-react'
import { SITE_INFO } from '@/lib/data'

export function WhatsAppButton() {
  const digits = (SITE_INFO.whatsapp || '').replace(/\D/g, '')
  const isRealNumber = Boolean(digits.length >= 10)

  if (!isRealNumber) {
    return null
  }

  const url =
    SITE_INFO.whatsappUrl ||
    `https://wa.me/${digits}?text=${encodeURIComponent('Olá, gostaria de agendar uma reunião.')}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white border-2 border-white/20 shadow-xl transition-all hover:scale-105 hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FAB319] focus:ring-offset-2 animate-fade-in-up"
      aria-label="Contato via WhatsApp"
      title="Fale conosco via WhatsApp"
    >
      <MessageCircle className="h-6 w-6 text-white" />
    </a>
  )
}
