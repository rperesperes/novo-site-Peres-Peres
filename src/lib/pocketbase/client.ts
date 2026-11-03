import PocketBase, { ClientResponseError } from 'pocketbase'

// Único ponto do app que importa o SDK do PocketBase. Todo o resto importa daqui
// (scripts/check-pocketbase-client.cjs reprova qualquer outro import no build).
export type { RecordModel, RecordSubscription } from 'pocketbase'
export { ClientResponseError }

// Endereço público do backend Skip Cloud. É a reserva para builds sem
// VITE_POCKETBASE_URL (ex.: Cloudflare Pages, onde o .env não é enviado).
const POCKETBASE_URL =
  import.meta.env.VITE_POCKETBASE_URL ||
  'https://peres-peres-e-e-a-t-f7e7a.shrd03.internal.goskip.dev'

const pb = new PocketBase(POCKETBASE_URL)
pb.autoCancellation(false)

export default pb
