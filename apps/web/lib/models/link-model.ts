import { Author, Card, Link, Sym } from '@prisma/client'
import { FetchClient, FetchResult } from '../fetcher/fetch-client'
import { tryFetch } from '../fetcher/vendors'
import prisma from '../prisma'

const bannedCharMatcher = /[^a-zA-Z0-9_\p{Letter}]/gu

const toAuthorName = (domain: string, domainAuthorName: string) => {
  const author = domainAuthorName.trim().replace(bannedCharMatcher, '_')
  // return `${author}:${domain}`
  return author
}

type LinkParsed = Omit<Link, 'scraped'> & {
  author: Author | null
  card: (Card & { sym: Sym }) | null
  scraped: FetchResult
}

export const LinkService = {
  toSymbol(link: Link): string {
    return `@${link.url}`
  },

  async _find(url: string): Promise<LinkParsed | null> {
    const found = await prisma.link.findUnique({
      include: { author: true, card: { include: { sym: true } } },
      where: { url },
    })
    if (found) {
      return {
        ...found,
        scraped: found.scraped as unknown as FetchResult,
      }
    }
    return null
  },

  /**
   * Given a url, get or fetch/create a link (also author)
   * @returns Prisma.Link
   *
   */
  async getOrCreateLink({
    url,
    scraper,
  }: {
    url: string
    scraper?: FetchClient
  }): Promise<[LinkParsed, { fetchResult: FetchResult }]> {
    // 先嘗試 unresolved url, 需要考慮 redirect、不同 url 指向同一個頁面的情況
    let found = await this._find(url)
    if (found) {
      return [found, { fetchResult: found.scraped }]
    }

    // Link 未存在，嘗試 fetch 取得來源資訊，建立 link, cocard, oauthor 後返回
    // TODO: 可能在fetch後發現resolved-url已經存在
    let res: FetchResult = scraper ? await scraper.fetch(url) : await tryFetch(url)
    found = await this._find(res.finalUrl)
    if (found) {
      return [found, { fetchResult: found.scraped }]
    }

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
      include: { card: { include: { sym: true } }, author: true },
    })
    return [
      {
        ...link,
        scraped: link.scraped as unknown as FetchResult,
      },
      { fetchResult: res },
    ]
  },
}
