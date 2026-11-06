import PocketBase from 'pocketbase'

// A variável do Skip só é injetada no build do Skip. No build externo (Cloudflare Pages)
// ela não existe, por isso a URL de reserva fica gravada no código: sem ela o cliente
// nasce sem endereço e o /admin falha em silêncio (caso 0.0.156/0.0.157/0.0.160).
const POCKETBASE_URL =
  import.meta.env.VITE_POCKETBASE_URL ||
  'https://peres-peres-e-e-a-t-f7e7a.shrd03.internal.goskip.dev'

const pb = new PocketBase(POCKETBASE_URL)
pb.autoCancellation(false)

// Ponto único de acesso ao banco: todo o app importa este cliente (e os tipos do SDK
// daqui), nunca o pacote pocketbase direto. A guarda (scripts/check-pocketbase-client.cjs,
// rodada no prebuild do package.json) falha o build se essa regra for quebrada.
export type { RecordModel, RecordSubscription } from 'pocketbase'
export { ClientResponseError } from 'pocketbase'

export default pb
