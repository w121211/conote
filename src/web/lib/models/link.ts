import { Card, Link, Oauthor } from '@prisma/client'
import { parseUrl, tryFetch, FetchClient, FetchResult } from '../../../packages/fetcher/src/index'
import prisma from '../prisma'

type ExtFetchResult = FetchResult & {
  oauthorName?: string
}

const bannedCharMatcher = /[^a-zA-Z0-9_\p{Letter}]/gu

function toOauthorName(domain: string, domainAuthorName: string) {
  const author = domainAuthorName.replace(bannedCharMatcher, '_')
  return `${author}:${domain}`
}

export function linkToSymbol(link: Link): string {
  return `[[${link.url}]]`
}

/**
 * 給一個url/symbol，從資料庫中返回該url/symbol對應的link
 * 若link未存在，建立link，同時建立oauthor
 */
export async function getOrCreateLink(props: {
  fetcher?: FetchClient
  url: string
}): Promise<[Link & { card: Card | null }, { fetchResult?: ExtFetchResult }]> {
  const { fetcher, url } = props

  // TODO: 這個url尚未resolved, 需要考慮redirect、不同url指向同一個頁面的情況
  const parsed = parseUrl(url)
  const found = await prisma.link.findUnique({
    include: { card: true },
    where: { url: parsed.resolvedUrl },
  })

  if (found !== null) {
    return [found, { fetchResult: found.fetchResult as unknown as ExtFetchResult }]
  }

  // Link未存在，嘗試fetch取得來源資訊，建立link, cocard, oauthor後返回
  // TODO: 可能在fetch後發現resolved-url已經存在
  let res: ExtFetchResult = fetcher ? await fetcher.fetch(url) : await tryFetch(url)

  // TODO: Oauthor的辨識太低，而且沒有統一
  let oauthor: Oauthor | undefined
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
      sourceType: res.srcType,
      sourceId: res.srcId,
      fetchResult: res as any,
      oauthor: oauthor ? { connect: { id: oauthor.id } } : undefined,
    },
    include: { card: true },
  })
  return [link, { fetchResult: res }]
}
