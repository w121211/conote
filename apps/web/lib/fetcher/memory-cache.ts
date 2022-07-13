/**
 * A simple memory cache, mainly use for avoiding repeatly calls on the same urls during development
 */
import { readFileSync, writeFileSync } from 'fs'
import { LinkScrapedResult } from '../interfaces'

export class MemoryCache {
  private filepath: string
  private cache: Record<string, LinkScrapedResult> = {}

  constructor(cachePath: string) {
    this.filepath = cachePath
    try {
      this.cache = this.load(this.filepath)
    } catch (err) {
      console.log(`cache not found, create a new one`)
      //   console.log('No ')
    }
  }

  private load(filepath: string): Record<string, LinkScrapedResult> {
    console.log(`loading cache from ${filepath}`)
    return JSON.parse(readFileSync(filepath, { encoding: 'utf8' }))
  }

  public dump(): void {
    console.log(`Dump cache to ${this.filepath}`)
    writeFileSync(this.filepath, JSON.stringify(this.cache))
  }

  public get(url: string): LinkScrapedResult {
    if (url in this.cache) {
      console.log('hit cache: ' + url)
      return this.cache[url]
    }
    throw new Error('Cache not found:' + url)
  }

  public set(url: string, result: LinkScrapedResult): void {
    this.cache[url] = result
  }
}
