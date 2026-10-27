/* Main entry point for the application - renders the root React component */
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './main.css'

// Garante que o acesso a cssRules em stylesheets cross-origin não lance SecurityError não tratada
if (typeof window !== 'undefined' && typeof CSSStyleSheet !== 'undefined') {
  try {
    const proto = CSSStyleSheet.prototype
    const descriptor = Object.getOwnPropertyDescriptor(proto, 'cssRules')
    if (descriptor && typeof descriptor.get === 'function') {
      const originalGet = descriptor.get
      Object.defineProperty(proto, 'cssRules', {
        configurable: descriptor.configurable,
        enumerable: descriptor.enumerable,
        get() {
          try {
            return originalGet.call(this)
          } catch (e: any) {
            // Em caso de SecurityError por cross-origin, retorna lista vazia segura
            if (e?.name === 'SecurityError' || String(e?.message).includes('cssRules')) {
              return [] as unknown as CSSRuleList
            }
            throw e
          }
        },
      })
    }
  } catch {
    // Silencia qualquer falha ao proteger o descriptor
  }
}

// @skip-protected: Do not remove. Required for React rendering.
createRoot(document.getElementById('root')!).render(<App />)
