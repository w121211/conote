import { CardState } from '@prisma/client'
import { NodeBody, NodeChange, TreeNode, TreeService } from '@conote/docdiff'
import { Bullet } from '../../components/bullet/bullet'
import prisma from '../prisma'

export type CardStateBody = {
  prevStateId: string | null // initial state
  changes: NodeChange<Bullet>[]
  value: TreeNode<Bullet>[]
  // sourceCardId: string | null
  fromCardId?: string // doc is created from which during editing, not strong binding
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
