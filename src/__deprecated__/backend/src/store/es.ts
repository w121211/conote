import { Client, ApiResponse, RequestParams } from '@elastic/elasticsearch'

const client = new Client({ node: 'http://es:9200' })

const INDEX_NAME = 'symbol-title'

// interface PageTitle {
//   template: Template
//   name: string
// }

// export async function indexTitle(title: PageTitle) {
//   await client.index({
//     index: INDEX_NAME,
//     body: {
//       template: title.template,
//       title: title.name,
//     },
//   })
// }

// async function run() {
//     await client.index({
//         index: "symbol-title",
//         body: {
//             template: "SOME_TEMPLATE",
//             title: "some name",
//         }
//     })

// }
// run()
//     .catch(function (e) {
//         console.error(e)
//     })

export async function searchPage(url: string) {
  /** 用url搜尋page，看是否已建立？ */
  throw new Error('')
}

async function searchTopic(term: string) {
  const prams: RequestParams.Search = {
    index: 'scraper-page',
    body: {
      query: {
        bool: {
          must: [
            // {match: {}}
            // { wildcard: { from_url: "*youtube*" } },
            // { wildcard: { from_url: "*channel*" } },
            // // { range: { created_at: { gte: after.toISOString() } } }
          ],
        },
      },
    },
  }
  const res: ApiResponse = await client.search(prams)
  return res
}

async function searchTicker(term: string) {
  const prams: RequestParams.Search = {
    index: 'scraper-page',
    body: {
      query: {
        bool: {
          must: [
            // {match: {}}
            // { wildcard: { from_url: "*youtube*" } },
            // { wildcard: { from_url: "*channel*" } },
            // // { range: { created_at: { gte: after.toISOString() } } }
          ],
        },
      },
    },
  }
  const res: ApiResponse = await client.search(prams)
  return res
}

export function searchAll(term: string) {
  /** 目前僅支援搜尋：topic, ticker,  */
  throw new Error('')
}
