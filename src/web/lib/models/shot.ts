import { Author, Shot, ShotChoice, Symbol as PrismaSymbol } from '.prisma/client'
import prisma from '../prisma'
import { SymbolModel } from './symbol'

/**
 * Inline shot: !((shot:id))(@author $TARGET|[[Target]] #CHOICE)
 */

export type ShotBody = {
  comment?: string
  quote?: string
}

function isShotChoice(s: string): s is ShotChoice {
  return ['LONG', 'SHORT', 'HOLD'].includes(s)
}

export const ShotModel = {
  /**
   * 不會做 validation，這是為了保留 user 所輸入的內容，在 shot form 裡做檢驗、修正
   */
  parseInlineShotParams(params: string[]): {
    authorName?: string
    targetSymbol?: string
    choice?: ShotChoice
  } {
    const [_authorName, _targetSymbol, _choice] = params
    // const matchAuthor = reAuthor.exec(_authorName)
    // const matchSymbol = parseSymbol(_targetSymbol)
    return {
      authorName: _authorName,
      targetSymbol: _targetSymbol,
      choice: isShotChoice(_choice) ? _choice : undefined,
    }
  },

  toInlineShotString({
    author,
    choice,
    symbol,
    id,
  }: {
    author: string
    choice: ShotChoice
    symbol: string
    id?: string
  }): string {
    // const { symbolName, cardType } = parseSymbol(targetSymbol)
    if (id) {
      return `!((shot:${id}))(@${author} ${symbol} #${choice})`
    }
    return `!((shot))(@${author} ${symbol} #${choice})`
  },

  // export async function updateShot()

  /**
   * If symbol not exist, create symbol in the same time
   */
  async create({
    choice,
    symbol: symbolName,
    userId,
    authorId,
    body = {},
    linkId,
  }: {
    choice: ShotChoice
    symbol: string
    userId: string
    authorId?: string | null
    body?: ShotBody
    linkId?: string | null
  }): Promise<
    Shot & {
      author: Author | null
      symbol: PrismaSymbol
    }
  > {
    if (authorId) {
      if (linkId === undefined || linkId === null) {
        throw 'Create author shot require both authorId & linkId'
      }
    }
    if (linkId) {
      if (authorId === undefined || authorId === null) {
        throw 'Create author shot require both authorId & linkId'
      }
    }
    const symbol = await SymbolModel.getOrCreate(symbolName)
    return await prisma.shot.create({
      data: {
        choice,
        body,
        user: { connect: { id: userId } },
        author: authorId ? { connect: { id: authorId } } : undefined,
        link: linkId ? { connect: { id: linkId } } : undefined,
        symbol: { connect: { id: symbol.id } },
      },
      include: {
        author: true,
        symbol: true,
      },
    })
  },
}
