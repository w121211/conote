import { general } from './general'
import { youtube } from './youtube'
import { FetchResult } from '../index'

export type DomainFetchFunction = (url: string, domain?: string) => Promise<FetchResult>

export class DomainNotFitError extends Error {
  constructor(message?: string) {
    super(message) // 'Error' breaks prototype chain here
    Object.setPrototypeOf(this, DomainNotFitError.prototype) // restore prototype chain
  }
}

// 依序嘗試執行，若失敗則嘗試下一個
const fetchFns: DomainFetchFunction[] = [youtube, general]

export async function tryFetch(url: string): Promise<FetchResult> {
  for (const e of fetchFns) {
    try {
      return await e(url)
    } catch (err) {
      //   console.error(err)
      if (err instanceof DomainNotFitError) continue
      else break
    }
  }
  throw new Error()
}
