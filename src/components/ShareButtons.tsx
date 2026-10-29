import { useState } from 'react'
import { Check, Copy, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ShareButtonsProps {
  url?: string
  title: string
  description?: string
  className?: string
  variant?: 'dark' | 'card'
}

export function ShareButtons({
  url,
  title,
  description = '',
  className = '',
  variant = 'dark',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl =
    url ||
    (typeof window !== 'undefined' ? window.location.href : 'https://peresperes.com.br/casos')

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = shareUrl
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch (err) {
      console.error('Erro ao copiar link:', err)
    }
  }

  // Deep links padrão:
  // WhatsApp: https://wa.me/?text=<encoded_text>
  const whatsappText = `${title}\n\nConfira este caso da PERES PERES Consultoria & Contabilidade:\n${shareUrl}`
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`

  // LinkedIn: shareOffsite standard URL
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    shareUrl,
  )}`

  const isCard = variant === 'card'

  return (
    <div
      className={`flex flex-wrap items-center gap-2.5 ${
        isCard
          ? 'bg-neutral-900/80 border border-neutral-800 p-3 rounded-lg'
          : 'bg-neutral-950/70 border border-neutral-800/80 p-3 rounded-xl'
      } ${className}`}
    >
      <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono uppercase tracking-wider pr-1">
        <Share2 className="h-3.5 w-3.5 text-[#FAB319]" />
        <span>Compartilhar:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* WhatsApp */}
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs font-sans font-medium bg-neutral-900 hover:bg-[#25D366]/20 hover:text-[#25D366] hover:border-[#25D366]/50 border-neutral-700 text-neutral-200 transition-colors"
        >
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Compartilhar no WhatsApp"
          >
            <svg
              className="mr-1.5 h-3.5 w-3.5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </Button>

        {/* LinkedIn */}
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs font-sans font-medium bg-neutral-900 hover:bg-[#0A66C2]/20 hover:text-[#0A66C2] hover:border-[#0A66C2]/50 border-neutral-700 text-neutral-200 transition-colors"
        >
          <a
            href={linkedinHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Compartilhar no LinkedIn"
          >
            <svg
              className="mr-1.5 h-3.5 w-3.5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
            LinkedIn
          </a>
        </Button>

        {/* Copiar Link */}
        <Button
          type="button"
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className={`h-8 px-3 text-xs font-sans font-medium border-neutral-700 transition-all ${
            copied
              ? 'bg-[#FAB319] text-black border-[#FAB319] hover:bg-[#FAB319] hover:text-black font-semibold'
              : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200'
          }`}
          aria-label="Copiar link"
        >
          {copied ? (
            <>
              <Check className="mr-1.5 h-3.5 w-3.5 text-black" />
              Link copiado
            </>
          ) : (
            <>
              <Copy className="mr-1.5 h-3.5 w-3.5 text-neutral-400" />
              Copiar link
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
