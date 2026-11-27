import { useCallback, useEffect, useRef, useState } from 'react'
import { Link2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import SocialNetworkIcon from '@/components/SocialNetworkIcon'

interface ShareLineProps {
  /** Título da página, usado como texto sugerido no share das redes. */
  title: string
  /**
   * "dark" para fundo escuro (hero das páginas de segmento) e "light" para
   * fundo claro (página de Reforma Tributária). O azul do LinkedIn fica
   * disponível apenas no fundo claro, em que há contraste.
   */
  tone?: 'light' | 'dark'
  className?: string
}

interface ShareTarget {
  id: 'whatsapp' | 'linkedin' | 'facebook' | 'x' | 'telegram'
  label: string
  buildHref: (url: string, text: string) => string
  colored?: boolean
}

const TARGETS: ShareTarget[] = [
  {
    id: 'whatsapp',
    label: 'Compartilhar no WhatsApp',
    buildHref: (url, text) => `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    colored: true,
  },
  {
    id: 'linkedin',
    label: 'Compartilhar no LinkedIn',
    buildHref: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    colored: true,
  },
  {
    id: 'facebook',
    label: 'Compartilhar no Facebook',
    buildHref: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: 'x',
    label: 'Compartilhar no X',
    buildHref: (url, text) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    id: 'telegram',
    label: 'Compartilhar no Telegram',
    buildHref: (url, text) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
]

const COPY_FEEDBACK_MS = 2000

/**
 * Linha discreta de compartilhamento, exibida logo abaixo do parágrafo de
 * abertura das páginas de segmento, profissão e Reforma Tributária:
 * a palavra "Compartilhar" seguida de cinco botões redondos com ícone de
 * marca (WhatsApp, LinkedIn, Facebook, X, Telegram) e um botão para copiar
 * o link da página. Sem contador, sem script de terceiros, sem cookies.
 */
export default function ShareLine({ title, tone = 'light', className }: ShareLineProps) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [])

  const getPageUrl = useCallback(() => {
    return typeof window !== 'undefined' ? window.location.href : ''
  }, [])

  const openShare = (target: ShareTarget) => {
    const url = getPageUrl()
    if (!url) return
    window.open(target.buildHref(url, title), '_blank', 'noopener,noreferrer')
  }

  const copyLink = async () => {
    const url = getPageUrl()
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Fallback para contextos sem a API de clipboard assíncrona.
      const input = document.createElement('input')
      input.value = url
      input.setAttribute('readonly', '')
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
    setCopied(true)
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setCopied(false), COPY_FEEDBACK_MS)
  }

  const iconClass = 'h-4 w-4'

  return (
    <div
      className={cn('flex flex-wrap items-center gap-3', className)}
      role="group"
      aria-label={`Compartilhar a página ${title}`}
    >
      {copied ? (
        <span
          className={cn(
            'text-sm font-medium font-sans',
            tone === 'dark' ? 'text-[#4ADE80]' : 'text-[#1a7a3c]',
          )}
          role="status"
          aria-live="polite"
        >
          Link copiado
        </span>
      ) : (
        <span
          className={cn(
            'text-sm font-medium font-sans',
            tone === 'dark' ? 'text-neutral-400' : 'text-neutral-500',
          )}
        >
          Compartilhar
        </span>
      )}

      <div className="flex items-center gap-2">
        {TARGETS.map((target) => {
          const brandColored =
            target.id === 'whatsapp' || (target.id === 'linkedin' && tone === 'light')
          return (
            <button
              key={target.id}
              type="button"
              onClick={() => openShare(target)}
              aria-label={target.label}
              title={target.label}
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors',
                brandColored
                  ? target.id === 'linkedin'
                    ? 'border-[#0A66C2]/40 text-[#0A66C2] hover:bg-[#0A66C2]/10'
                    : 'border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10'
                  : tone === 'dark'
                    ? 'border-neutral-600 text-neutral-300 hover:border-neutral-400 hover:text-white'
                    : 'border-neutral-400 text-neutral-500 hover:border-neutral-600 hover:text-neutral-800',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAB319]/60',
              )}
            >
              <SocialNetworkIcon network={target.id} className={iconClass} />
            </button>
          )
        })}

        <button
          type="button"
          onClick={copyLink}
          aria-label="Copiar link"
          title="Copiar link"
          className={cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors',
            tone === 'dark'
              ? 'border-neutral-600 text-neutral-400 hover:border-neutral-400 hover:text-white'
              : 'border-neutral-400 text-neutral-500 hover:border-neutral-600 hover:text-neutral-800',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAB319]/60',
          )}
        >
          <Link2 className={iconClass} />
        </button>
      </div>
    </div>
  )
}
