import { Author, Rate, RateChoice, Sym } from '@prisma/client'
import prisma from '../prisma'
import { SymModel } from './sym'

export type RateBody = {
  comment?: string
  quote?: string
}

export const RateModel = {
  /**
   * If symbol not exist, create symbol in the same time
   */
  async create({
    choice,
    symbol,
    userId,
    authorId,
    body = {},
    linkId,
  }: {
    choice: RateChoice
    symbol: string
    userId: string
    authorId?: string | null
    body?: RateBody
    linkId?: string | null
  }): Promise<
    Rate & {
      author: Author | null
      sym: Sym
    }
  > {
    if (authorId) {
      if (linkId === undefined || linkId === null) {
        throw 'Create author rate require both authorId & linkId'
      }
    }
    if (linkId) {
      if (authorId === undefined || authorId === null) {
        throw 'Create author rate require both authorId & linkId'
      }
    }
    const sym = await SymModel.getOrCreate(symbol)
    return await prisma.rate.create({
      data: {
        choice,
        body,
        user: { connect: { id: userId } },
        author: authorId ? { connect: { id: authorId } } : undefined,
        link: linkId ? { connect: { id: linkId } } : undefined,
        sym: { connect: { id: sym.id } },
      },
      include: {
        author: true,
        sym: true,
      },
    })
  },
}
