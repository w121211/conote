import * as PA from '@prisma/client'
import prisma from '../prisma'
<<<<<<< HEAD
import { parseUrl, fetch, FetchResult } from '../../../lib/fetcher/src/index'
=======
import { parseUrl, fetch, FetchClient, FetchResult } from '../../../lib/fetcher/src/index'
>>>>>>> backend-dev

interface ExtFetchResult extends FetchResult {
  oauthorName?: string
}

function toOauthorName(domain: string, domainAuthorName: string) {
  return `${domainAuthorName}:${domain}`
}

<<<<<<< HEAD
export async function getOrCreateLink(url: string): Promise<[PA.Link, { fetched: ExtFetchResult }]> {
=======
export async function getOrCreateLink(
  url: string,
  fetcher?: FetchClient,
): Promise<[PA.Link, { fetched: ExtFetchResult }]> {
>>>>>>> backend-dev
  /**
   * 給予一個URL，從資料庫中返回該URL對應的link
   * 若link未存在，建立link，同時建立oauthor
   */
  // TODO: 這個url尚未resolved, 需要考慮redirect、不同url指向同一個頁面的情況
  const parsed = parseUrl(url)
  const found = await prisma.link.findUnique({ where: { url: parsed.url } })

  if (found !== null) {
    return [found, { fetched: (found.meta as unknown) as ExtFetchResult }]
  }

  // Link未存在，嘗試fetch取得來源資訊，建立link, cocard, oauthor後返回
  // TODO: 可能在fetch後發現resolved-url已經存在
<<<<<<< HEAD
  let fetched: ExtFetchResult = await fetch(url)
=======
  let fetched: ExtFetchResult = fetcher ? await fetcher.fetch(url) : await fetch(url)
>>>>>>> backend-dev

  // TODO: Oauthor的辨識太低，而且沒有統一
  let oauthor: PA.Oauthor | undefined
  if (fetched.authorName) {
    const oauthorName = toOauthorName(fetched.domain, fetched.authorName)
    oauthor = await prisma.oauthor.upsert({
      where: { name: oauthorName },
      create: { name: oauthorName },
      update: {},
    })
    fetched = { ...fetched, oauthorName }
  }

  const link = await prisma.link.create({
    data: {
      url: fetched.resolvedUrl,
      domain: fetched.domain,
      srcId: fetched.srcId,
      srcType: fetched.srcType as any,
      meta: fetched as any,
      oauthor: oauthor ? { connect: { id: oauthor.id } } : undefined,
    },
  })

  return [link, { fetched }]
}

// export async function createLink(
//   parsed: ParsedUrl,
//   srcType?: PA.SrcType,
//   srcId?: string,
//   contentAuthorId?: string,
// ): Promise<PA.Link | null> {
//   return await prisma.link.create({
//     data: {
//       url: parsed.url,
//       domain: parsed.domain,
//       srcType,
//       srcId,
//       // contentAuthorId,
//     },
//   })
// }
