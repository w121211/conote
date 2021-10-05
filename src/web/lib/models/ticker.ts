/**
 * RUN:
 * cd .../app/server
 * npx ts-node src/models/ticks.ts
 */
import * as fs from 'fs'
import * as path from 'path'
import _ from 'lodash'
import dotenv from 'dotenv'
// import dayjs from 'dayjs'
// import * as request from 'request'
import * as PA from '@prisma/client'

// dotenv.config()

// const DOWNLOAD_FOLDER = './downloads'
// const API_ROOT = 'https://cloud.iexapis.com/v1'
// const TOKEN = process.env.IEX_TOKEN
// // const API_ROOT = "https://sandbox.iexapis.com/stable"
// // const TOKEN = "Tsk_fb96b83c73fe46debd5e3b2ee5033c75"

// function getApiUrl(root: string, symbol: string, range: string) {
//   const urls = {
//     previous: `${root}/stock/${symbol}/previous`,
//     d5: `${root}/stock/${symbol}/chart/5d`,
//     m1: `${root}/stock/${symbol}/chart/m1`,
//     max: `${root}/stock/${symbol}/chart/max`,
//   }
//   return urls[range as keyof typeof urls]
// }

// const prisma = new PA.PrismaClient({
//   errorFormat: 'pretty',
//   // log: ['query', 'info', 'warn'],
// })

// function fetchAndSaveTicks(symbol: PA.Symbol, range = 'd5') {
//   /**
//    * range: "previous", "d5", "m1", "max"
//    */
//   console.log('連上IEX API抓取ticks')
//   const url = getApiUrl(API_ROOT, symbol.name, range)
//   const qs = {
//     token: TOKEN,
//     // screen_name: perm_data.screen_name,
//     // user_id: perm_data.user_id
//   }
//   const filename = `${symbol.name}_${range}_${dayjs().format('YYYYMMDDHHmm')}.json`

//   request.get({ url, qs: qs, json: true }, async function (err, resp, body) {
//     if (err) {
//       console.error('error:', err)
//       return
//     }
//     fs.writeFileSync(path.join(DOWNLOAD_FOLDER, filename), JSON.stringify(body))

//     // console.log(body)
//     const promises = body.map(function (e: any) {
//       return prisma.tick.create({
//         data: {
//           open: e.open,
//           close: e.close,
//           high: e.high,
//           low: e.low,
//           volume: e.volume,
//           change: e.change,
//           changePercent: e.changePercent,
//           at: new Date(e.date),
//           symbol: { connect: { id: symbol.id } },
//         },
//       })
//     })
//     await Promise.all(promises)
//   })
// }

// async function getTicks(symbolName: string) {
//   // 找ticker
//   const symbol = await prisma.symbol.findUnique({
//     where: { name: symbolName },
//   })
//   if (symbol === null) {
//     console.error(`Symbol not found: ${symbolName}`)
//     return
//   }
//   if (symbol.cat !== PA.SymbolCat.TICKER) {
//     console.error(`Symbol${symbolName} is not a ticker`)
//     return
//   }

//   // 查看目前的ticks更新到何時
//   const tick = await prisma.tick.findFirst({
//     where: { symbol: { id: symbol.id } },
//     orderBy: { at: 'desc' },
//   })

//   // 僅抓最新的部分
//   if (tick === null) {
//     await fetchAndSaveTicks(symbol, 'max')
//   } else {
//     const now = dayjs()
//     const diff = now.diff(dayjs(tick.at), 'day')
//     // if (diff > 5) await fetchAndSaveTicks(symbol, FetchSapn.M1)
//     console.log(tick)
//   }

//   // console.log(tk)

//   // return tk
// }

// async function main() {
//   // const symbols = ["BA", "AA"]
//   // const range = [2000, now()]  // start, end
//   // const symbolName = "TWTR"

//   console.log('依照給予的ticker抓最新的ticks')

//   if (!fs.existsSync(DOWNLOAD_FOLDER)) {
//     fs.mkdirSync(DOWNLOAD_FOLDER)
//   }

//   const symbols = JSON.parse(fs.readFileSync(path.join(DOWNLOAD_FOLDER, 'symbols.json'), 'utf8'))

//   console.log(symbols.length)

//   for (let i = 0; i < symbols.length; i++) {
//     if (i > 1) break

//     const name = symbols[i]['symbol']
//     // const ticks = await getTicks("TWTR")
//     try {
//       await prisma.symbol.create({
//         data: {
//           cat: PA.SymbolCat.TICKER,
//           name: name,
//         },
//       })
//     } catch (e) {
//       console.log(e)
//     }

//     const symbol = await prisma.symbol.findUnique({
//       where: {
//         name: name,
//       },
//     })
//     if (symbol) {
//       await fetchAndSaveTicks(symbol, 'max')
//       await new Promise(function (resolve) {
//         return setTimeout(resolve, 2000)
//       })
//     } else {
//       throw new Error(`No symbol found in DB ${symbol}`)
//     }
//   }
// }

// main()
//   .catch(function (e) {
//     throw e
//   })
//   .finally(async function () {
//     await prisma.$disconnect()
//   })
