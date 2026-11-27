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
  /**
   * Data da última revisão do conteúdo, em ISO 8601 (YYYY-MM-DD). Marcada
   * para buscadores como meta article:modified_time e og:updated_time, e
   * mantida em sincronia com a tabela SEO_BY_ROUTE do prerender.
   */
  dateModified?: string
}

/**
 * Hook para atualização padronizada de document.title e meta[name="description"]
 * em cada página pública da PERES PERES Consultoria & Contabilidade.
 *
 * Também mantém as etiquetas de compartilhamento social (Open Graph e Twitter
 * Card) alinhadas: og:title/og:description usam ogTitle/ogDescription quando
 * fornecidos, e og:url segue o canonical da página. Quando a página informa
 * dateModified (ISO 8601), espelha a data em og:updated_time e
 * article:modified_time.
 */
export function useSeo({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  dateModified,
}: SeoProps) {
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

    // Data de modificação do conteúdo, para buscadores (article:modified_time
    // e og:updated_time), quando a página informa uma.
    if (dateModified) {
      let articleModifiedTag = document.querySelector('meta[name="article:modified_time"]')
      if (!articleModifiedTag) {
        articleModifiedTag = document.createElement('meta')
        articleModifiedTag.setAttribute('name', 'article:modified_time')
        document.head.appendChild(articleModifiedTag)
      }
      articleModifiedTag.setAttribute('content', dateModified)

      let ogUpdatedTag = document.querySelector('meta[property="og:updated_time"]')
      if (!ogUpdatedTag) {
        ogUpdatedTag = document.createElement('meta')
        ogUpdatedTag.setAttribute('property', 'og:updated_time')
        document.head.appendChild(ogUpdatedTag)
      }
      ogUpdatedTag.setAttribute('content', dateModified)
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
  }, [title, description, canonical, ogTitle, ogDescription, dateModified])
}
