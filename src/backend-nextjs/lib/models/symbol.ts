import * as PA from '@prisma/client'
import prisma from '../prisma'
// import { createTickerCocard } from './card';

export const SYMBOL_DOMAIN = '_'

const reTicker = /^\$[A-Z0-9]+$/
const reTopic = /^\[\[[^\]]+\]\]$/

function parse(symbolName: string): { name: string; cat: PA.SymbolCat; oauthoName?: string } {
  let cat: PA.SymbolCat
  let oauthoName: string | undefined

  if (symbolName.match(reTicker) !== null) {
    cat = PA.SymbolCat.TICKER
  } else if (symbolName.match(reTopic) !== null) {
    cat = PA.SymbolCat.TOPIC
  } else {
    throw new Error(`尚未支援的symbol format${symbolName}`)
  }
  return { name: symbolName, cat, oauthoName }
}

export function urlToSymbol(url: string): string | null {
  // TODO: 需檢驗這是否符合symbol格式
  // 若是symbo-url則返回symbol，否則返回null
  if (url.startsWith('//')) {
    return url.substr(2)
  } else {
    return null
  }
}

export function symbolToUrl(symbolName: string): string {
  const parsed = parse(symbolName)
  return `//${parsed.name}`
}

export async function getOrCreateSymbol(symbolName: string): Promise<[PA.Symbol, { created: boolean }]> {
  /** 創新symbol時，"不會"同步創link, cocard（這部分放在`getOrCreateCardBySymbol()`)*/

  // 找symbol
  const res = await prisma.symbol.findUnique({ where: { name: symbolName } })
  if (res) {
    return [res, { created: false }]
  }

  // 找不到symbol，創一個
  const parsed = parse(symbolName)
  const symbol = await prisma.symbol.create({ data: { name: parsed.name, cat: parsed.cat } })
  return [symbol, { created: true }]
}
