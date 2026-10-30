import { useEffect } from 'react'

interface SeoProps {
  title: string
  description: string
  canonical?: string
}

/**
 * Hook para atualização padronizada de document.title e meta[name="description"]
 * em cada página pública da PERES PERES Consultoria & Contabilidade.
 */
export function useSeo({ title, description, canonical }: SeoProps) {
  useEffect(() => {
    // Atualiza title
    if (title) {
      document.title = title
    }

    // Atualiza ou insere meta description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]')
      if (!metaDesc) {
        metaDesc = document.createElement('meta')
        metaDesc.setAttribute('name', 'description')
        document.head.appendChild(metaDesc)
      }
      metaDesc.setAttribute('content', description)

      // Atualiza og:description
      let ogDesc = document.querySelector('meta[property="og:description"]')
      if (ogDesc) {
        ogDesc.setAttribute('content', description)
      }
    }

    // Atualiza og:title
    if (title) {
      let ogTitle = document.querySelector('meta[property="og:title"]')
      if (ogTitle) {
        ogTitle.setAttribute('content', title)
      }
    }

    // Atualiza link canonical se informado
    if (canonical) {
      let linkCan = document.querySelector('link[rel="canonical"]')
      if (!linkCan) {
        linkCan = document.createElement('link')
        linkCan.setAttribute('rel', 'canonical')
        document.head.appendChild(linkCan)
      }
      linkCan.setAttribute('href', canonical)
    }
  }, [title, description, canonical])
}
