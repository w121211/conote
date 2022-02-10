import { Card, Link, Sym, SymType } from '@prisma/client'
import { FetchClient } from '../fetcher/fetch-client'
import prisma from '../prisma'
import { CardStateModel, CardStateParsed } from './card-state-model'
import { LinkService } from './link-model'
import { SymModel } from './sym-model'

export type CardPrarsed = Omit<Card, 'meta'> & {
  meta: CardMeta
  sym: Sym
  state: CardStateParsed | null
  link: Link | null
}

export type CardMeta = {
  template?: 'webpage' | 'ticker' | 'topic' | 'vs'
  redirects?: string[]
  duplicates?: string[]
  url?: string
  author?: string
  publishedAt?: string
  description?: string
  keywords?: string[]
  // lang?: string
  title?: string
  tickers?: string[]
}

export type RowCard = Card & { sym: Sym; link: Link | null }

export const CardModel = {
  async get(id: string): Promise<null | CardPrarsed> {
    const card = await prisma.card.findUnique({
      where: { id },
      include: {
        link: true,
        sym: true,
      },
    })
    if (card) {
      return {
        ...card,
        meta: card.meta as unknown as CardMeta,
        state: await CardStateModel.getLastCardState(card.id),
      }
    }
    return null
  },

  /**
   * Get card by symbol
   *
   * @throw symbol parse error
   */
  async getBySymbol(symbol: string): Promise<CardPrarsed | null> {
    const parsed = SymModel.parse(symbol)
    const sym = await prisma.sym.findUnique({
      where: { symbol: parsed.symbol },
      include: { card: { include: { link: true } } },
    })
    if (sym?.card) {
      const { card, ...restSym } = sym
      const state = await CardStateModel.getLastCardState(card.id)
      // if (state === null) {
      //   throw '[conote-web] symbol-card state cannot be null'
      // }
      return {
        ...card,
        meta: card.meta as unknown as CardMeta,
        state,
        sym: restSym,
      }
    }
    return null
  },

  /**
   * Get or create a webpage-card by URL, if the URL not found in database, will try to scrape and then store
   * Newly created webpage-card will not have card-state and remains null.
   */
  async getOrCreateByUrl({
    scraper,
    url,
  }: {
    scraper?: FetchClient
    url: string
  }): Promise<CardPrarsed & { link: Link }> {
    const [link, { fetchResult }] = await LinkService.getOrCreateLink({ scraper, url })
    if (link.card) {
      const { card, ...linkRest } = link
      return {
        ...card,
        link: linkRest,
        meta: card.meta as unknown as CardMeta,
        state: await CardStateModel.getLastCardState(card.id),
      }
    }

    // Card not found, create one
    const meta: CardMeta = {
      template: 'webpage',
      url: link.url,
      author: fetchResult?.authorName,
      publishedAt: fetchResult?.date,
      description: fetchResult?.description,
      keywords: fetchResult?.keywords,
      title: fetchResult?.title,
      tickers: fetchResult?.tickers,
    }
    const card = await prisma.card.create({
      data: {
        link: { connect: { id: link.id } },
        meta,
        sym: {
          create: {
            type: SymType.URL,
            symbol: LinkService.toSymbol(link),
          },
        },
      },
      include: { sym: true },
    })
    return {
      ...card,
      link,
      meta,
      state: null,
    }
  },

  parse(card: RowCard, cardState: CardStateParsed | null = null): CardPrarsed {
    const { link, sym } = card
    return {
      ...card,
      meta: card.meta as unknown as CardMeta,
      state: cardState,
      sym,
      link,
    }
  },
}
