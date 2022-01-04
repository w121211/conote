import { resolve } from 'path'
import { FetchClient } from './fetcher/fetcher'

const fetchClientPropertyName = `__prevent-name-collision__fetcher`

type GlobalThisWithFetchClient = typeof globalThis & {
  [fetchClientPropertyName]: FetchClient
}

function getFetchClient(): FetchClient {
  if (process.env.NODE_ENV === `production`) {
    return new FetchClient()
  } else {
    const newGlobalThis = globalThis as GlobalThisWithFetchClient
    if (!newGlobalThis[fetchClientPropertyName]) {
      newGlobalThis[fetchClientPropertyName] = new FetchClient(resolve(process.cwd(), '.fetcher_local_cache.dump.json'))
    }
    return newGlobalThis[fetchClientPropertyName]
  }
}

const fetcher = getFetchClient()

export default fetcher
