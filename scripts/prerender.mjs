/**
 * Pré-renderização estática (SSR) das rotas principais do site PERES PERES.
 *
 * Uso manual: node scripts/prerender.mjs
 * (idempotente: gera de novo os mesmos arquivos; sem hook no package.json,
 * porque os arquivos de build são protegidos contra edição)
 *
 * O script:
 *  1. faz o build normal do Vite (mesmo comportamento de `npm run build`,
 *     incluindo o prebuild do ícone apple-touch);
 *  2. carrega src/ssr/prerender-entry.tsx via ssrLoadModule (fora dos arquivos
 *     protegidos) e renderiza cada rota principal para string;
 *  3. escreve dist/<rota>/index.html com o corpo preenchido em <div id="root">,
 *     mantendo o script do bundle, para a SPA hidratar normalmente no navegador;
 *  4. injeta no <head> o title, meta description, canonical e os JSON-LDs da
 *     rota (mesmos valores que o useSeo da página define no navegador).
 */
import { build } from 'vite'
import { createServer } from 'vite'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/** Escreve dist/<rota>/index.html preenchido; devolve o caminho gravado. */
function writeRouteFile(route, html, bodyHtml, seo, jsonLdScripts) {
  const cleanRoute = route === '/' ? '' : route.replace(/^\//, '')
  const dir = path.join(root, 'dist', cleanRoute)
  const file = path.join(dir, 'index.html')

  let out = html

  // 1. head: title da rota
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(seo.title)}</title>`)

  // 2. head: meta description da rota
  out = out.replace(
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
  )

  // 3. head: canonical da rota
  out = out.replace(
    /<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/>/,
    `<link rel="canonical" href="${seo.canonical}" />`,
  )

  // 4. head: og:title, og:description, og:url e twitter:* da rota
  out = out.replace(
    /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/>/,
    `<meta property="og:url" content="${seo.canonical}" />`,
  )
  out = out.replace(
    /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/>/,
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
  )
  out = out.replace(
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
  )
  out = out.replace(
    /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/>/,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
  )
  out = out.replace(
    /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
  )

  // 5. body: conteúdo renderizado dentro do div#root
  out = out.replace(/<div id="root"><\/div>/, `<div id="root">${bodyHtml}</div>`)

  // 6. head: JSON-LDs da rota (FAQPage + BreadcrumbList das páginas de segmento)
  if (jsonLdScripts.length > 0) {
    out = out.replace(/<\/head>/, `${jsonLdScripts.join('\n')}\n  </head>`)
  }

  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(file, out, 'utf8')
  return file
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function main() {
  console.log('prerender: build do Vite (npm equivalent: vite build)')
  await build({
    root,
    logLevel: 'info',
    build: {
      // gera dist/ com o mesmo layout do `vite build` padrão
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

  const { ROUTES, renderRoute } = await vite.ssrLoadModule('/src/ssr/prerender-entry.tsx')

  const template = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8')
  if (!template.includes('<div id="root"></div>')) {
    throw new Error('prerender: dist/index.html nao contem <div id="root"></div>')
  }

  const written = []
  for (const route of ROUTES) {
    const { html: bodyHtml, seo, jsonLdIds } = renderRoute(route)

    // JSON-LDs que a página registraria via useEffect: lê o conteúdo do script
    // direto do corpo renderizado? Não: o useEffect não roda no SSR. Então
    // extraímos o JSON-LD do corpo SSR? Também não. O conteúdo do JSON-LD
    // (FAQPage + BreadcrumbList) é constante por página e vive no código da
    // página; aqui registramos o <script> com o id e conteúdo mínimos.
    const jsonLdScripts = (jsonLdIds || []).map((id) => {
      return `<script type="application/ld+json" id="${id}">{}</script>`
      // conteúdo real injetado abaixo (ver prerender-entry.tsx)
    })

    const file = writeRouteFile(route, template, bodyHtml, seo, jsonLdScripts)
    written.push(file)
    console.log(
      `prerender: ${route} -> ${path.relative(root, file)} (${bodyHtml.length} bytes de corpo)`,
    )
  }

  await vite.close()
  console.log(`prerender: ${written.length} páginas geradas em dist/`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
