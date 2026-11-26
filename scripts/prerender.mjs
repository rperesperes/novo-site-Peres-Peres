/**
 * Pré-renderização estática (SSR) das rotas principais do site PERES PERES.
 *
 * Uso manual: node scripts/prerender.mjs
 * (idempotente: roda o build e gera de novo os mesmos arquivos; sem hook no
 * package.json, porque os arquivos de build são protegidos contra edição)
 *
 * O script:
 *  1. faz o build normal do Vite (mesmo comportamento de `npm run build`);
 *  2. carrega src/ssr/prerender-entry.tsx via ssrLoadModule (fora dos arquivos
 *     protegidos) e renderiza cada rota principal para string;
 *  3. escreve dist/<rota>/index.html com o corpo preenchido em <div id="root">,
 *     mantendo o script do bundle, para a SPA hidratar normalmente no navegador;
 *  4. injeta no <head> o title, meta description, canonical e os JSON-LDs da
 *     rota (mesmos valores que o useSeo da página define no navegador).
 *
 * Rotas com falha de renderização são puladas com aviso, sem abortar as demais.
 */
import { build, createServer } from 'vite'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const escapeHtml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * Substitui uma tag no head tolerando variação de ordem de atributos e de
 * aspas (o build do Vite pode minificar/reescrever o template).
 * `headPattern` casa a tag inteira; usa o flag "s" para atributos multilinha.
 */
function replaceTag(out, tagRegex, replacement) {
  const next = out.replace(tagRegex, replacement)
  if (next === out) {
    console.warn(`prerender: aviso: padrão não encontrado no head: ${tagRegex}`)
  }
  return next
}

/** Escreve dist/<rota>/index.html preenchido; devolve o caminho gravado. */
function writeRouteFile(route, html, bodyHtml, seo, jsonLdScripts) {
  const cleanRoute = route === '/' ? '' : route.replace(/^\//, '')
  const dir = path.join(root, 'dist', cleanRoute)
  const file = path.join(dir, 'index.html')

  let out = html

  // 1. head: title da rota
  out = replaceTag(
    out,
    /<title\b[^>]*>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(seo.title)}</title>`,
  )

  // 2. head: meta description da rota
  out = replaceTag(
    out,
    /<meta\b[^>]*name=["']description["'][^>]*>/i,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
  )

  // 3. head: canonical da rota
  out = replaceTag(
    out,
    /<link\b[^>]*rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${seo.canonical}" />`,
  )

  // 4. head: og:title, og:description, og:url e twitter:* da rota
  out = replaceTag(
    out,
    /<meta\b[^>]*property=["']og:url["'][^>]*>/i,
    `<meta property="og:url" content="${seo.canonical}" />`,
  )
  out = replaceTag(
    out,
    /<meta\b[^>]*property=["']og:title["'][^>]*>/i,
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
  )
  out = replaceTag(
    out,
    /<meta\b[^>]*property=["']og:description["'][^>]*>/i,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
  )
  out = replaceTag(
    out,
    /<meta\b[^>]*name=["']twitter:title["'][^>]*>/i,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
  )
  out = replaceTag(
    out,
    /<meta\b[^>]*name=["']twitter:description["'][^>]*>/i,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
  )

  // 5. body: conteúdo renderizado dentro do div#root (vazio ou já preenchido
  //    por uma execução anterior, para o script ser reexecutável).
  out = out.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${bodyHtml}</div>`)

  // 6. head: JSON-LDs da rota (FAQPage + BreadcrumbList das páginas de segmento)
  if (jsonLdScripts.length > 0) {
    out = replaceTag(out, /<\/head>/i, `${jsonLdScripts.join('\n')}\n  </head>`)
  }

  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(file, out, 'utf8')
  return file
}

async function main() {
  console.log('prerender: build do Vite (npm equivalent: vite build)')
  await build({
    root,
    logLevel: 'info',
    build: {
      emptyOutDir: true,
    },
  })

  console.log('prerender: criando servidor Vite em middlewareMode para SSR')
  const vite = await createServer({
    root,
    logLevel: 'error',
    server: { middlewareMode: true },
    appType: 'custom',
    // O entry SSR resolve '@/...' pelo mesmo alias do app
    resolve: { conditions: ['import', 'module', 'browser|default'] },
  })

  const { ROUTES, renderRoute, JSONLD_CONTENT_BY_ID } = await vite.ssrLoadModule(
    '/src/ssr/prerender-entry.tsx',
  )
  const jsonLdContentById = JSONLD_CONTENT_BY_ID || {}

  const template = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8')
  if (!/<div id="root">\s*<\/div>/.test(template)) {
    throw new Error('prerender: dist/index.html nao contem <div id="root"></div>')
  }

  const written = []
  const skipped = []
  for (const route of ROUTES) {
    try {
      const { html: bodyHtml, seo, jsonLdIds } = renderRoute(route)

      // JSON-LDs reais por rota: lê o conteúdo dos scripts com o id conhecido
      // diretamente do HTML SSR do corpo? O useEffect não roda no SSR; então o
      // conteúdo vive no módulo da página, e o entry SSR o importa (ver
      // JSONLD_CONTENT_BY_ID em prerender-entry.tsx).
      const jsonLdScripts = (jsonLdIds || []).map((id) => {
        const content = jsonLdContentById[id]
        if (!content) {
          console.warn(`prerender: aviso: JSON-LD ${id} sem conteúdo mapeado; script vazio`)
          return `<script type="application/ld+json" id="${id}">{}</script>`
        }
        return `<script type="application/ld+json" id="${id}">${content}</script>`
      })

      const file = writeRouteFile(route, template, bodyHtml, seo, jsonLdScripts)
      written.push(file)
      console.log(
        `prerender: ${route} -> ${path.relative(root, file)} (${bodyHtml.length} bytes de corpo)`,
      )
    } catch (err) {
      // Rota com problema (ex. rede no PocketBase) não derruba as demais.
      skipped.push(route)
      console.warn(`prerender: aviso: rota ${route} pulada: ${err?.message || err}`)
    }
  }

  await vite.close()
  console.log(`prerender: ${written.length} páginas geradas em dist/`)
  if (skipped.length > 0) {
    console.warn(`prerender: rotas puladas: ${skipped.join(', ')}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
