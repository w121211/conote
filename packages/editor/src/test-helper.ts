import { readFileSync } from 'fs'
import { splitByUrl } from './parser'

export function load(filepath: string): [string, string][] {
  return (
    splitByUrl(readFileSync(filepath, { encoding: 'utf8' }))
      .filter((e): e is [string, string] => e[0] !== undefined)
      // .map(e => [e[0], `\n${e[1].trim()}`])
      .map(e => [e[0], e[1].trim()])
  )
}

export class FakeChance {
  private i = 0

  public string(): string {
    const str = this.i.toString(36).padStart(3, '0')
    this.i += 1
    if (this.i >= 36 * 36 * 36) {
      this.i = 0
    }
    return str
  }

  public reset(): void {
    this.i = 0
  }
}

export function omitUndefined<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}
