import { Card, Link, Author } from '@prisma/client'
import { FetchClient, FetchResult } from '../fetcher/fetcher'
import { tryFetch } from '../fetcher/vendors'
import { parseUrl } from '../fetcher/vendors/base'
import prisma from '../prisma'

const bannedCharMatcher = /[^a-zA-Z0-9_\p{Letter}]/gu

function toAuthorName(domain: string, domainAuthorName: string) {
  const author = domainAuthorName.trim().replace(bannedCharMatcher, '_')
  // return `${author}:${domain}`
  return author
}

export function linkToSymbol(link: Link): string {
  return `@${link.url}`
}

/**
 * 給一個url/symbol，從資料庫中返回該url/symbol對應的link
 * 若link未存在，建立link，同時建立oauthor
 */
export async function getOrCreateLink({
  scraper,
  url,
}: {
  scraper?: FetchClient
  url: string
}): Promise<[Link & { author: Author | null; card: Card | null }, { fetchResult: FetchResult }]> {
  // TODO: 這個url尚未resolved, 需要考慮redirect、不同url指向同一個頁面的情況
  const parsed = parseUrl(url)
  const found = await prisma.link.findUnique({
    include: { author: true, card: true },
    where: { url: parsed.resolvedUrl },
  })

  if (found !== null) {
    return [found, { fetchResult: found.scrapeData as unknown as FetchResult }]
  }

  // Link 未存在，嘗試 fetch 取得來源資訊，建立 link, cocard, oauthor 後返回
  // TODO: 可能在fetch後發現resolved-url已經存在
  let res: FetchResult = scraper ? await scraper.fetch(url) : await tryFetch(url)

  // TODO: Author 的辨識太低，而且沒有統一
  let author: Author | undefined
  if (res.authorName) {
    const authorName = toAuthorName(res.domain, res.authorName)
    author = await prisma.author.upsert({
      where: { name: authorName },
      create: { name: authorName },
      update: {},
    })
    res = { ...res, authorName }
  }

  const link = await prisma.link.create({
    data: {
      url: res.finalUrl,
      domain: res.domain,
      // sourceType: res.srcType,
      // sourceId: res.srcId,
      scrapeData: res as any,
      author: author ? { connect: { id: author.id } } : undefined,
    },
    include: { card: true, author: true },
  })
  return [link, { fetchResult: res }]
}
