import { Card, CardState, Link, Symbol as PrismaSymbol, SymbolType } from '.prisma/client'
import { FetchClient } from '../fetcher/fetcher'
import prisma from '../prisma'
import { LinkService } from './link'
import { SymbolModel } from './symbol'

export type CardMeta = {
  template?: 'webpage' | 'ticker' | 'topic' | 'vs'
  redirects?: string[]
  duplicates?: string[]
  url?: string
  author?: string
  date?: string
  description?: string
  keywords?: string[]
  // lang?: string
  title?: string
}

export async function getLatestCardState(cardId: string): Promise<CardState | null> {
  return await prisma.cardState.findFirst({
    where: { cardId },
    orderBy: { createdAt: 'desc' },
  })
}

// function serializeContent() {
//   // TODO
// }

// function deserializeContent() {
//   // TODO
// }

export const CardModel = {
  async get({ id }: { id: string }): Promise<
    | null
    | (Omit<Card, 'meta'> & {
        link: Link | null
        meta: CardMeta
        state: CardState | null
      })
  > {
    const card = await prisma.card.findUnique({
      where: { id },
      include: { link: true },
    })
    if (card) {
      return {
        ...card,
        meta: card.meta as unknown as CardMeta,
        state: await getLatestCardState(card.id),
      }
    }
    return null
  },

  /**
   * Get card by symbol
   *
   * @throw symbol parse error
   */
  async getBySymbol(symbol: string): Promise<
    | (Omit<Card, 'meta'> & {
        link: Link | null
        meta: CardMeta
        state: CardState
      })
    | null
  > {
    const { name } = SymbolModel.parse(symbol)
    const result = await prisma.symbol.findUnique({
      where: { name },
      include: { card: { include: { link: true } } },
    })
    if (result?.card) {
      const card = result.card
      const state = await getLatestCardState(card.id)
      if (state === null) {
        throw '[conote-web] symbol-card state cannot be null'
      }
      return {
        ...card,
        link: card.link,
        meta: card.meta as unknown as CardMeta,
        state,
      }
    }
    return null
  },

  /**
   * Get or create a webpage-card by URL, if the URL not found in database, will try to scrape and then store
   * Newly created webpage-card will not have card-state and remains null.
   */
  async getOrCreateByUrl({ scraper, url }: { scraper?: FetchClient; url: string }): Promise<
    Omit<Card, 'meta'> & {
      link: Link
      symbol: PrismaSymbol
      meta: CardMeta
      state: CardState | null
    }
  > {
    const [link, { fetchResult }] = await LinkService.getOrCreateLink({ scraper, url })
    if (link.card) {
      return {
        ...link.card,
        link,
        meta: link.card.meta as unknown as CardMeta,
        state: await getLatestCardState(link.card.id),
      }
    }

    // Card not found, create one
    const meta: CardMeta = {
      template: 'webpage',
      url: link.url,
      author: fetchResult?.authorName,
      date: fetchResult?.date,
      description: fetchResult?.date,
      keywords: fetchResult?.keywords,
      title: fetchResult?.title,
    }
    const card = await prisma.card.create({
      data: {
        link: { connect: { id: link.id } },
        meta,
        symbol: {
          create: {
            type: SymbolType.URL,
            name: LinkService.toSymbol(link),
          },
        },
      },
      include: { link: true, symbol: true },
    })
    return {
      ...card,
      link,
      meta,
      state: null,
    }
  },
}
