import { Author, Card, Link, Symbol as PrismaSymbol } from '.prisma/client'
import { FetchClient, FetchResult } from '../fetcher/fetcher'
import { tryFetch } from '../fetcher/vendors'
import { parseUrl } from '../fetcher/vendors/base'
import prisma from '../prisma'

const bannedCharMatcher = /[^a-zA-Z0-9_\p{Letter}]/gu

const toAuthorName = (domain: string, domainAuthorName: string) => {
  const author = domainAuthorName.trim().replace(bannedCharMatcher, '_')
  // return `${author}:${domain}`
  return author
}

export const LinkService = {
  toSymbol(link: Link): string {
    return `@${link.url}`
  },

  /**
   * 給一個 url，返回對應的 link
   * 若 link 未存在，建立 link, author
   */
  async getOrCreateLink({ url, scraper }: { url: string; scraper?: FetchClient }): Promise<
    [
      Link & {
        author: Author | null
        card:
          | (Card & {
              symbol: PrismaSymbol
            })
          | null
      },
      { fetchResult: FetchResult },
    ]
  > {
    // TODO: 這個 url 尚未 resolved, 需要考慮 redirect、不同 url 指向同一個頁面的情況
    const parsed = parseUrl(url)
    const found = await prisma.link.findUnique({
      include: { author: true, card: { include: { symbol: true } } },
      where: { url: parsed.resolvedUrl },
    })

    if (found !== null) {
      return [found, { fetchResult: found.scraped as unknown as FetchResult }]
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
        scraped: res as any,
        author: author ? { connect: { id: author.id } } : undefined,
      },
      include: { card: { include: { symbol: true } }, author: true },
    })
    return [link, { fetchResult: res }]
  },
}
