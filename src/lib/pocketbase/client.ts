import PocketBase from 'pocketbase'

// Endereço do backend PocketBase (Skip Cloud).
//
// No build do Skip a variável VITE_POCKETBASE_URL é injetada e tem prioridade.
// Em builds fora do Skip (ex.: Cloudflare Pages, a partir do GitHub), ela não
// existe: nesse caso usamos a URL de reserva abaixo, que aponta para o mesmo
// backend, acessível publicamente pelo navegador do visitante do site.
const POCKETBASE_FALLBACK_URL = 'https://peres-peres-e-e-a-t-f7e7a.shrd03.internal.goskip.dev'

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || POCKETBASE_FALLBACK_URL)
pb.autoCancellation(false)

export default pb
