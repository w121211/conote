/**
 * Fuzzy search for page title, ticker, etc （用memory實現）
 */
// import _ from 'lodash'
// import dayjs from 'dayjs'
import Fuse from 'fuse.js'
import { Symbol as PrismaSymbol } from '@prisma/client'
import prisma from '../prisma'

// 將資料庫取出的資料存在記憶體中（定時更新），用於fuzzy search
// TODO: 改存在Redis
let symbols: PrismaSymbol[] | null = null
let symbolFuse: Fuse<PrismaSymbol>
let topicFuseUpdatedAt: Date | null = null
let tickerTitles: string[] | null = null

// const prisma = new PA.PrismaClient({
//   errorFormat: 'pretty',
//   log: ['query', 'info', 'warn'],
// })

// async function getAllTickers() {
//   const titles: string[] = [];
//   let cursor: number | null = null;
//   // eslint-disable-next-line no-constant-condition
//   while (true) {
//     let results;
//     if (cursor !== null) {
//       results = await prisma.page.findMany({
//         take: 10,
//         where: { template: { equals: 'TICKER' } },
//         orderBy: { id: 'asc' },
//         cursor: { id: cursor },
//       });
//     } else {
//       results = await prisma.page.findMany({
//         take: 10,
//         where: { template: { equals: 'TICKER' } },
//         orderBy: { id: 'asc' },
//       });
//     }
//     if (results.length === 0) break;
//     titles.concat(results.map(e => e.title));
//     cursor = results[-1].id;
//   }
//   return titles;
// }

export async function getAllSymbols(): Promise<PrismaSymbol[]> {
  console.log('Loading symbols from database...')

  let symbols: PrismaSymbol[] = []
  let cursor: number | undefined = undefined

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const res: PrismaSymbol[] = await prisma.symbol.findMany({
      take: 100,
      // skip cursor
      skip: cursor ? 1 : undefined,
      orderBy: { id: 'asc' },
      cursor: cursor ? { id: cursor } : undefined,
    })
    if (res.length === 0) {
      break
    }
    symbols = symbols.concat(res)
    cursor = res[res.length - 1].id
  }
  return symbols
}

export async function searchAllSymbols(term: string): Promise<string[]> {
  if (symbols === null) {
    symbols = await getAllSymbols()
    // console.log(symbols)
    symbolFuse = new Fuse(symbols, {
      includeScore: true,
      keys: ['name'],
    })
  }
  return symbolFuse.search(term).map(e => e.item.name)
}
