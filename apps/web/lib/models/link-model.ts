import { Link, Sym } from '@prisma/client'
import { FetchClient, FetchResult } from '../fetcher/fetch-client'
import { tryFetch } from '../fetcher/vendors'
import prisma from '../prisma'

type LinkParsed = Omit<Link, 'scraped'> & {
  sym: Sym | null
  scraped: FetchResult
}

class LinkModel {
  private async find(url: string): Promise<LinkParsed | null> {
    const found = await prisma.link.findUnique({
      include: { sym: true },
      where: { url },
    })
    if (found) {
      return {
        ...found,
        scraped: found.scraped as unknown as FetchResult,
      }
    }
    return null
  }

  /**
   * If url is found, return link
   * If url is not found, fetch the url and create a link and return
   *
   * TODO: consider redirect, different urls refers to the same page
   */
  async getOrCreateLink({
    url,
    scraper,
  }: {
    url: string
    scraper?: FetchClient
  }): Promise<[LinkParsed, { fetchResult: FetchResult }]> {
    const linkByUrl = await this.find(url)
    if (linkByUrl) {
      return [linkByUrl, { fetchResult: linkByUrl.scraped }]
    }

    // TODO: found resolved-url is existed in database after fetch
    const fetchResult: FetchResult = scraper
        ? await scraper.fetch(url)
        : await tryFetch(url),
      linkByFinalUrl = await this.find(fetchResult.finalUrl)

    if (linkByFinalUrl) {
      return [linkByFinalUrl, { fetchResult: linkByFinalUrl.scraped }]
    }

    // TODO: if fetch result contains authors
    // let author: Author | undefined
    // if (res.authorName) {
    //   const authorName = toAuthorName(res.domain, res.authorName)
    //   author = await prisma.author.upsert({
    //     where: { name: authorName },
    //     create: { name: authorName },
    //     update: {},
    //   })
    //   res = { ...res, authorName }
    // }

    const link = await prisma.link.create({
      data: {
        url: fetchResult.finalUrl,
        domain: fetchResult.domain,
        // sourceType: res.srcType,
        // sourceId: res.srcId,
        scraped: fetchResult as any,
      },
      include: { sym: true },
    })

    return [
      {
        ...link,
        scraped: link.scraped as unknown as FetchResult,
      },
      { fetchResult: fetchResult },
    ]
  }
}

export const linkModel = new LinkModel()
