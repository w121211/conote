/** 一個簡易的cache，用於開發時避免重複call同樣的url */
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { FetchResult } from './index'

export class LocalCache {
  private filepath: string
  private cache: Record<string, FetchResult> = {}

  constructor(cachePath: string) {
    this.filepath = cachePath
    try {
      this.cache = this.load(this.filepath)
    } catch (err) {
      console.log(`cache not found, create a new one`)
      //   console.log('No ')
    }
  }

  private load(filepath: string): Record<string, FetchResult> {
    console.log(`loading cache from ${filepath}`)
    return JSON.parse(readFileSync(filepath, { encoding: 'utf8' }))
  }

  public dump(): void {
    console.log(`Dump cache to ${this.filepath}`)
    writeFileSync(this.filepath, JSON.stringify(this.cache))
  }

  public get(url: string): FetchResult {
    if (url in this.cache) {
      console.log('hit cache: ' + url)
      return this.cache[url]
    }
    throw new Error('Cache not found:' + url)
  }

  public set(url: string, result: FetchResult): void {
    this.cache[url] = result
  }
}
