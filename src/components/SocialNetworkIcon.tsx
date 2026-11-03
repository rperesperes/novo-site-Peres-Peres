import { Instagram, Facebook, Youtube, Linkedin, Twitch, AtSign, Globe } from 'lucide-react'
import type { SocialNetworkId } from '@/services/social_links'

interface SocialNetworkIconProps {
  network: SocialNetworkId
  className?: string
}

/**
 * Ícone de cada rede social do rodapé e do painel.
 * Redes presentes na biblioteca lucide usam os ícones dela; as demais
 * recebem SVG próprio (X, TikTok e Pinterest em traço cheio, Threads como
 * arroba e Kwai como monograma K, no mesmo estilo de traço).
 */
export function SocialNetworkIcon({ network, className }: SocialNetworkIconProps) {
  switch (network) {
    case 'instagram':
      return <Instagram className={className} />
    case 'facebook':
      return <Facebook className={className} />
    case 'youtube':
      return <Youtube className={className} />
    case 'linkedin':
      return <Linkedin className={className} />
    case 'twitch':
      return <Twitch className={className} />
    case 'threads':
      return <AtSign className={className} />
    case 'x':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.19-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.91 1.57-1.3 3.69-1.94 5.68-1.6.03.63-.02 1.26-.02 1.89-.01.5-.01 1 .02 1.5-.53-.17-1.1-.22-1.66-.16-1.19.13-2.27.81-2.93 1.81-.57.88-.83 1.98-.74 3.06.11 1.24.73 2.41 1.68 3.2.9.75 2.09 1.11 3.26.98 1.23-.11 2.36-.76 3.06-1.76.31-.45.53-.97.65-1.51.16-.71.12-1.44.12-2.16V.02h2.75z" />
        </svg>
      )
    case 'pinterest':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
        </svg>
      )
    case 'kwai':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M9 4.5v15" />
          <path d="M17.5 4.5 10.8 12l6.7 7.5" />
        </svg>
      )
    default:
      return <Globe className={className} />
  }
}

export default SocialNetworkIcon
