// Declarações ambiente para ferramentas de build carregadas pelo Node
// (tailwind.config.ts). Não afetam o código de browser em runtime.
declare module 'node:fs'
declare module 'node:path'
declare module 'node:child_process'
declare const process: {
  cwd(): string
  env: Record<string, string | undefined>
}
