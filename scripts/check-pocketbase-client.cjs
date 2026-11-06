// Guarda do PocketBase: falha se algum arquivo do app importar ou instanciar o SDK fora de
// src/lib/pocketbase/client.ts, ou se o cliente compartilhado puder ficar sem URL.
// Uso: node scripts/check-pocketbase-client.cjs (sai com código 1 quando reprova).
// Roda no build por dois caminhos: o prebuild do package.json e o import em
// src/lib/pocketbase/guard.ts (chamado no topo do src/main.tsx), já que o
// vite.config.ts e o package.json são gerenciados pela plataforma e não aceitam edição.
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const srcDir = path.join(root, 'src')
const clientFile = path.join(root, 'src', 'lib', 'pocketbase', 'client.ts')

// Qualquer import (valor ou tipo) do pacote pocketbase fora do cliente é reprovado:
// os tipos RecordModel/RecordSubscription e o ClientResponseError são reexportados
// pelo próprio cliente compartilhado.
const IMPORT_PATTERNS = [
  /\bfrom\s+['"]pocketbase(\/[^'"]*)?['"]/,
  /\bimport\s*\(\s*['"]pocketbase(\/[^'"]*)?['"]/,
  /\brequire\s*\(\s*['"]pocketbase(\/[^'"]*)?['"]/,
  /\bimport\s+['"]pocketbase(\/[^'"]*)?['"]/,
]
const INSTANCE_PATTERN = /\bnew\s+PocketBase\b/

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name)) out.push(full)
  }
  return out
}

const problems = []

for (const file of walk(srcDir)) {
  if (path.resolve(file) === path.resolve(clientFile)) continue
  const source = fs.readFileSync(file, 'utf8')
  const rel = path.relative(root, file)
  if (IMPORT_PATTERNS.some((re) => re.test(source))) {
    problems.push(`${rel}: importa o SDK do PocketBase; importe de '@/lib/pocketbase/client'`)
  }
  if (INSTANCE_PATTERN.test(source)) {
    problems.push(`${rel}: instancia PocketBase; use o cliente compartilhado`)
  }
}

if (!fs.existsSync(clientFile)) {
  problems.push('src/lib/pocketbase/client.ts não existe')
} else {
  const client = fs.readFileSync(clientFile, 'utf8')
  if (!/import\.meta\.env\.VITE_POCKETBASE_URL\s*\|\|\s*'https:\/\/[^']+'/.test(client)) {
    problems.push(
      "src/lib/pocketbase/client.ts: a URL precisa de reserva https (VITE_POCKETBASE_URL || 'https://...')",
    )
  }
  if (!/new PocketBase\(POCKETBASE_URL\)/.test(client)) {
    problems.push('src/lib/pocketbase/client.ts: o cliente deve ser criado com POCKETBASE_URL')
  }
}

if (problems.length > 0) {
  console.error('Guarda do PocketBase reprovou o build:')
  for (const p of problems) console.error(`- ${p}`)
  process.exit(1)
}

console.log('Guarda do PocketBase: OK (um único cliente, com URL de reserva).')
