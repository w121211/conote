import { Card, Link, Sym, SymType } from '@prisma/client'
import { CardMetaInput as GQLCardMetaInput } from 'graphql-let/__generated__/__types__'
import { FetchClient } from '../fetcher/fetch-client'
import prisma from '../prisma'
import { CardStateModel, CardStateParsed } from './card-state-model'
import { LinkService } from './link-model'
import { SymModel } from './sym-model'

export type CardMeta = {
  author?: string
  // description?: string
  duplicates?: string[]
  keywords?: string[]
  // lang?: string
  publishedAt?: string
  // redirects?: string[]
  redirect?: string
  // template?: 'webpage' | 'ticker' | 'topic' | 'vs'
  tickers?: string[]
  title?: string
  url?: string
}

export type CardPrarsed = Omit<Card, 'meta'> & {
  meta: CardMeta
  sym: Sym
  state: CardStateParsed | null
  link: Link | null
}

export type PrismaCard = Card & {
  sym: Sym
  link: Link | null
}

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
   * Get or create a webpage-card by URL
   * If the given URL not found in database, try to scrape and then store.
   * Newly created webpage-card does not have card-state.
   *
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
    const symbol = LinkService.toSymbol(link)
    const meta: CardMeta = {
      author: fetchResult?.authorName,
      // description: fetchResult?.description,
      keywords: fetchResult?.keywords,
      publishedAt: fetchResult?.date,
      // template: 'webpage',
      tickers: fetchResult?.tickers,
      title: fetchResult?.title,
      url: link.url,
    }
    const card = await prisma.card.create({
      data: {
        link: { connect: { id: link.id } },
        meta,
        sym: {
          create: {
            type: SymType.URL,
            symbol,
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

  parse(card: PrismaCard, cardState: CardStateParsed | null = null): CardPrarsed {
    const { link, sym } = card
    return {
      ...card,
      meta: card.meta as unknown as CardMeta,
      state: cardState,
      sym,
      link,
    }
  },

  async udpateCardSymbol(id: string, newSymbol: string): Promise<CardPrarsed> {
    const card = await this.get(id)
    if (card === null) {
      throw 'card not found'
    }
    if (card.sym.symbol === newSymbol) {
      return card
    }
    const sym = await SymModel.update(card.symId, newSymbol)
    return {
      ...card,
      sym,
    }
  },

  async udpateCardMeta(id: string, newCardMeta: GQLCardMetaInput): Promise<CardPrarsed> {
    const newCard = await prisma.card.update({
      data: { meta: newCardMeta },
      include: {
        link: true,
        sym: true,
      },
      where: { id },
    })

    return this.parse(newCard)
  },
}
