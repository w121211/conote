import { CardState } from '.prisma/client'
import { NodeChange, TreeNode } from '../../../packages/docdiff/src'
import { Bullet } from '../../components/bullet/bullet'
import prisma from '../prisma'

export type CardStateBody = {
  prevStateId: string | null // initial state
  sourceCardId: string | null
  changes: NodeChange<Bullet>[]
  value: TreeNode<Bullet>[]
}

export type CardStateParsed = Omit<CardState, 'body'> & {
  body: CardStateBody
}

export const CardStateModel = {
  _encodeBody() {
    throw 'Not implemented'
  },

  _decodeBody() {
    throw 'Not implemented'
  },

  async get(id: string): Promise<CardStateParsed | null> {
    const state = await prisma.cardState.findFirst({
      where: { id },
    })
    return state ? this.parse(state) : null
  },

  async getLastCardState(cardId: string): Promise<CardStateParsed | null> {
    const state = await prisma.cardState.findFirst({
      where: { cardId },
      orderBy: { createdAt: 'desc' },
    })
    return state ? this.parse(state) : null
  },

  parse(state: CardState): CardStateParsed {
    return {
      ...state,
      body: state.body as unknown as CardStateBody,
    }
  },
}
