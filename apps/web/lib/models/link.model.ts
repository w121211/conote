import type { Link, Sym } from '@prisma/client'
import { FetchClient } from '../fetcher/fetch-client'
import { tryFetch } from '../fetcher/vendors'
import type { LinkParsed, LinkScrapedResult } from '../interfaces'
import prisma from '../prisma'

class LinkModel {
  private async find(url: string): Promise<LinkParsed | null> {
    const link = await prisma.link.findUnique({
      where: { url },
    })
    return link ? this.parse(link) : null
  }

  /**
   * If url is found, return the link
   * If url is not found, fetch the url
   * - If final url is found in current links, return the link
   * - If final url is not found, create the link and return
   *
   * TODO
   * - [] Redirect, different urls refers to the same page
   * - [] If final url is found in current links, return the link -> May also update scraped result
   */
  async getOrCreateLink(
    url: string,
    scraper?: FetchClient,
  ): Promise<[LinkParsed, { scraped: LinkScrapedResult }]> {
    const linkByUrl = await this.find(url)
    if (linkByUrl) return [linkByUrl, { scraped: linkByUrl.scraped }]

    // TODO: found resolved-url is existed in database after fetch
    const scraped: LinkScrapedResult = scraper
        ? await scraper.fetch(url)
        : await tryFetch(url),
      linkByFinalUrl = await this.find(scraped.finalUrl)

    if (linkByFinalUrl)
      return [linkByFinalUrl, { scraped: linkByFinalUrl.scraped }]

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
        url: scraped.finalUrl,
        domain: scraped.domain,
        scraped,
      },
    })

    return [this.parse(link), { scraped }]
  }

  parse(link: Link): LinkParsed {
    return {
      ...link,
      scraped: link.scraped as unknown as LinkScrapedResult,
    }
  }
}

export const linkModel = new LinkModel()
