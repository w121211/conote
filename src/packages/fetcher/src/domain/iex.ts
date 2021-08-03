/**
 * 和一般的fetcher不同，這是專門用來call iex api，取得ticker symbols、prices等資料
 */
//  import * as fs from 'fs'
//  import * as path from 'path'
//  // import dayjs from 'dayjs'
import got from 'got'
//  import _ from 'lodash'


//  // const API_ROOT = "https://sandbox.iexapis.com/stable"
//  // const TOKEN = "Tsk_fb96b83c73fe46debd5e3b2ee5033c75"

const IEX_API_BASE = 'https://cloud.iexapis.com/stable'
const IEX_DOWNLOAD_FOLDER = './downloads'
const IEX_TOKEN = process.env.IEX_TOKEN

type Filename = {
  name: string
  datetime?: number
}

class DownloadFolderManager {
  downloadFolderPath: string

  constructor(downloadFolderPath: string) {
    this.downloadFolderPath = downloadFolderPath

       if (!fs.existsSync(DOWNLOAD_FOLDER)) {
         fs.mkdirSync(DOWNLOAD_FOLDER)
       }

  }

  private _toPath(name: Filename) {
    const filename = `${name.name}_`
    return path.join(downloadFolderPath)
  }

  saveFile(item: Record<string, any>, filename: Filename) {

  }

  getFile<T>(filename: Filename): T | undefined {
    const {name, datetime} = filename

    function _getFile(path: string): any {
      
    }

    if (datetime === undefined) {

    } else {
         const symbols = JSON.parse(fs.readFileSync(this._toPath(), 'utf8'))

    }

    // return {}
  }
}



export class IexClient {
  /**
   * @param range: "previous", "d5", "m1", "max"
   */
  private _toApiUrl(props: { base: string; symbol: string; range: 'previous' | 'd5' | 'm1' | 'max' }) {
    const { base, symbol, range } = props
    const urls = {
      previous: `${base}/stock/${symbol}/previous`,
      d5: `${base}/stock/${symbol}/chart/5d`,
      m1: `${base}/stock/${symbol}/chart/m1`,
      max: `${base}/stock/${symbol}/chart/max`,
    }
    return urls[range as keyof typeof urls]
  }

  /**
   * 取得所有symbols
   * @example https://cloud.iexapis.com/stable/ref-data/iex/symbols?token=IEX_TOKEN
   */
  public static async getAllSymbols(): Promise<any> {
    return await got
      .get(`${IEX_API_BASE}/ref-data/iex/symbols`, {
        searchParams: { token: IEX_TOKEN },
      })
      .json()
  }

  /**
   * 取得每個symbol的profile，需要花錢，謹慎使用
   * @see https://iexcloud.io/docs/api/#company
   * @example https://cloud.iexapis.com/stable/stock/aapl/company?token=IEX_TOKEN
   */
  public static async getProfile(props: { symbol: string }): Promise<any> {
    const { symbol } = props
    return await got
      .get(`${IEX_API_BASE}/stock/${symbol}/company`, {
        searchParams: { token: IEX_TOKEN },
      })
      .json()
  }


//  // async function getTicks(symbolName: string) {
//  //   // 找ticker
//  //   const symbol = await prisma.symbol.findUnique({
//  //     where: { name: symbolName },
//  //   })
//  //   if (symbol === null) {
//  //     console.error(`Symbol not found: ${symbolName}`)
//  //     return
//  //   }
//  //   if (symbol.cat !== PA.SymbolCat.TICKER) {
//  //     console.error(`Symbol${symbolName} is not a ticker`)
//  //     return
//  //   }

//  //   // 查看目前的ticks更新到何時
//  //   const tick = await prisma.tick.findFirst({
//  //     where: { symbol: { id: symbol.id } },
//  //     orderBy: { at: 'desc' },
//  //   })

//  //   // 僅抓最新的部分
//  //   if (tick === null) {
//  //     await fetchAndSaveTicks(symbol, 'max')
//  //   } else {
//  //     const now = dayjs()
//  //     const diff = now.diff(dayjs(tick.at), 'day')
//  //     // if (diff > 5) await fetchAndSaveTicks(symbol, FetchSapn.M1)
//  //     console.log(tick)
//  //   }

//  //   // console.log(tk)

//  //   // return tk
//  // }
}



function updateProfiles() {
  const local = new DownloadFolderManager()
  const symbols = getAllSymbols()
  for (const e of symbols) {
    if (!local.get({name: ['profile', e]})) {
      const profile = getProfile({symbol: e})
      const local.save({name: ['profile', e]}, profile)
    }
  }
}

function updateTicks() {
  const local = new DownloadFolderManager()
  const symbols = getAllSymbols()
  for (const e of symbols) {
    if (!local.get({name: ['profile', e]})) {
      const profile = getProfile({symbol: e})
      const local.save({name: ['profile', e]}, profile)
    }
  }
}



//  // async function main() {
//  //   // const symbols = ["BA", "AA"]
//  //   // const range = [2000, now()]  // start, end
//  //   // const symbolName = "TWTR"

//  //   console.log('依照給予的ticker抓最新的ticks')

//  //   if (!fs.existsSync(DOWNLOAD_FOLDER)) {
//  //     fs.mkdirSync(DOWNLOAD_FOLDER)
//  //   }

//  //   const symbols = JSON.parse(fs.readFileSync(path.join(DOWNLOAD_FOLDER, 'symbols.json'), 'utf8'))

//  //   console.log(symbols.length)

//  //   for (let i = 0; i < symbols.length; i++) {
//  //     if (i > 1) break

//  //     const name = symbols[i]['symbol']
//  //     // const ticks = await getTicks("TWTR")
//  //     try {
//  //       await prisma.symbol.create({
//  //         data: {
//  //           cat: PA.SymbolCat.TICKER,
//  //           name: name,
//  //         },
//  //       })
//  //     } catch (e) {
//  //       console.log(e)
//  //     }

//  //     const symbol = await prisma.symbol.findUnique({
//  //       where: {
//  //         name: name,
//  //       },
//  //     })
//  //     if (symbol) {
//  //       await fetchAndSaveTicks(symbol, 'max')
//  //       await new Promise(function (resolve) {
//  //         return setTimeout(resolve, 2000)
//  //       })
//  //     } else {
//  //       throw new Error(`No symbol found in DB ${symbol}`)
//  //     }
//  //   }
//  // }

//  // main()
//  //   .catch(function (e) {
//  //     throw e
//  //   })
//  //   .finally(async function () {
//  //     await prisma.$disconnect()
//  //   })


