import { base } from './base'
import { youtube } from './youtube'
import { FetchResult } from '../fetch-client'

export type DomainFetchFunction = (url: string, domain?: string) => Promise<FetchResult>

export class DomainNotFitError extends Error {
  constructor(message?: string) {
    super(message) // 'Error' breaks prototype chain here
    Object.setPrototypeOf(this, DomainNotFitError.prototype) // restore prototype chain
  }
}

// fallbacks, execute sequentially
const fetchers: DomainFetchFunction[] = [youtube, base]

export const tryFetch = async (url: string): Promise<FetchResult> => {
  for (const fetcher of fetchers) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await fetcher(url)
    } catch (err) {
      if (err instanceof DomainNotFitError) {
        continue
      } else {
        console.error(err)
        break
      }
    }
  }
  throw new Error(`Fetch error: ${url}`)
}
