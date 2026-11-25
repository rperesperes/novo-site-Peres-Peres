import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Altura de reserva do cabeçalho fixo (h-16 = 4rem = 64px) + folga.
// Os blocos com âncora usam as classes `scroll-mt-24`, mas o salto manual
// (navegação inicial com hash, quando o navegador não rola sozinho) usa este
// offset para o título nunca ficar escondido atrás do header.
const HEADER_OFFSET = 96

/**
 * Rola a página até o elemento do hash da URL.
 * Roda na navegação inicial (link aberto direto em nova aba), quando a troca de
 * rota mantém o mesmo pathname com hash novo e quando o hash muda na mesma rota.
 * Se não houver hash, garante o topo da página (comportamento padrão de SPA).
 */
export function useHashScroll() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0)
      return
    }

    // remove o "#" do início e decodifica (%20 etc.)
    const id = decodeURIComponent(location.hash.slice(1))
    if (!id) return

    let attempts = 0
    const tryScroll = () => {
      const el = document.getElementById(id)
      if (!el) {
        // o conteúdo pode ainda não estar montado (dados assíncronos); tenta de novo
        if (attempts < 10) {
          attempts += 1
          window.setTimeout(tryScroll, 100)
        }
        return
      }

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
      // foco programático para leitores de tela (o elemento tem tabIndex={-1})
      el.focus({ preventScroll: true })
    }

    // espera um frame para o React montar a rota antes de medir posições
    const raf = window.requestAnimationFrame(tryScroll)
    return () => {
      window.cancelAnimationFrame(raf)
    }
  }, [location.pathname, location.hash])
}
