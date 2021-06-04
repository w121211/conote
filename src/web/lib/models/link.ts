import * as PA from '@prisma/client'
import prisma from '../prisma'
import { parseUrl, tryFetch, FetchClient, FetchResult } from '../../../packages/fetcher/src/index'

interface ExtFetchResult extends FetchResult {
  oauthorName?: string
}

function toOauthorName(domain: string, domainAuthorName: string) {
  return `${domainAuthorName}:${domain}`
}

export async function getOrCreateLink(
  url: string,
  fetcher?: FetchClient,
): Promise<[PA.Link, { fetchResult: ExtFetchResult }]> {
  /**
   * 給予一個URL，從資料庫中返回該URL對應的link
   * 若link未存在，建立link，同時建立oauthor
   */
  // TODO: 這個url尚未resolved, 需要考慮redirect、不同url指向同一個頁面的情況
  const parsed = parseUrl(url)
  const found = await prisma.link.findUnique({ where: { url: parsed.resolvedUrl } })

  if (found !== null) {
    return [found, { fetchResult: found.meta as unknown as ExtFetchResult }]
  }

  // Link未存在，嘗試fetch取得來源資訊，建立link, cocard, oauthor後返回
  // TODO: 可能在fetch後發現resolved-url已經存在
  let res: ExtFetchResult = fetcher ? await fetcher.fetch(url) : await tryFetch(url)

  // TODO: Oauthor的辨識太低，而且沒有統一
  let oauthor: PA.Oauthor | undefined
  if (res.authorName) {
    const oauthorName = toOauthorName(res.domain, res.authorName)
    oauthor = await prisma.oauthor.upsert({
      where: { name: oauthorName },
      create: { name: oauthorName },
      update: {},
    })
    res = { ...res, oauthorName }
  }

  const link = await prisma.link.create({
    data: {
      url: res.resolvedUrl,
      domain: res.domain,
      srcId: res.srcId,
      srcType: res.srcType as any,
      meta: res as any,
      oauthor: oauthor ? { connect: { id: oauthor.id } } : undefined,
    },
  })

  return [link, { fetchResult: res }]
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
