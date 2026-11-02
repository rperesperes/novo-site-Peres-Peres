import PocketBase from 'pocketbase'

/**
 * URL do backend PocketBase no Skip Cloud.
 * Em desenvolvimento ou produção no Skip Cloud, import.meta.env.VITE_POCKETBASE_URL
 * aponta para o backend gerenciado. Caso não esteja definida (por exemplo, build estático
 * sem injeção de env), recorremos à URL oficial da instância provisionada para este projeto.
 */
export const DEFAULT_POCKETBASE_URL = 'https://peres-peres-e-e-a-t-f7e7a.shrd03.internal.goskip.dev'

export function resolvePocketBaseUrl(): string {
  const envUrl = (import.meta.env.VITE_POCKETBASE_URL || '').trim()
  if (envUrl && envUrl !== 'undefined' && envUrl !== 'null') {
    return envUrl
  }
  return DEFAULT_POCKETBASE_URL
}

export const pocketBaseUrl = resolvePocketBaseUrl()

const pb = new PocketBase(pocketBaseUrl)
pb.autoCancellation(false)

export default pb
