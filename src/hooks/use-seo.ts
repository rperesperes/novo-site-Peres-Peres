import { useEffect } from 'react'

interface SeoProps {
  title: string
  description: string
  canonical?: string
  /**
   * Título do compartilhamento social (og:title), quando diferente do título
   * da aba. Quando omitido, og:title espelha o title.
   */
  ogTitle?: string
  /**
   * Descrição do compartilhamento social (og:description), quando diferente
   * da meta description de busca. Quando omitida, og:description espelha a
   * description.
   */
  ogDescription?: string
}

/**
 * Hook para atualização padronizada de document.title e meta[name="description"]
 * em cada página pública da PERES PERES Consultoria & Contabilidade.
 *
 * Também mantém as etiquetas de compartilhamento social (Open Graph e Twitter
 * Card) alinhadas: og:title/og:description usam ogTitle/ogDescription quando
 * fornecidos, e og:url segue o canonical da página.
 */
export function useSeo({ title, description, canonical, ogTitle, ogDescription }: SeoProps) {
  useEffect(() => {
    const shareTitle = ogTitle || title
    const shareDescription = ogDescription || description

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
    }

    // Etiquetas de compartilhamento social (og:* e twitter:*)
    if (shareTitle) {
      const ogTitleTag = document.querySelector('meta[property="og:title"]')
      if (ogTitleTag) ogTitleTag.setAttribute('content', shareTitle)

      const twTitleTag = document.querySelector('meta[name="twitter:title"]')
      if (twTitleTag) twTitleTag.setAttribute('content', shareTitle)
    }

    if (shareDescription) {
      const ogDescTag = document.querySelector('meta[property="og:description"]')
      if (ogDescTag) ogDescTag.setAttribute('content', shareDescription)

      const twDescTag = document.querySelector('meta[name="twitter:description"]')
      if (twDescTag) twDescTag.setAttribute('content', shareDescription)
    }

    // Atualiza og:url com o endereço absoluto da página (canonical)
    if (canonical) {
      const ogUrlTag = document.querySelector('meta[property="og:url"]')
      if (ogUrlTag) ogUrlTag.setAttribute('content', canonical)
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
  }, [title, description, canonical, ogTitle, ogDescription])
}
