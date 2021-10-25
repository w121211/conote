import { Author, Card, Shot, ShotChoice } from '.prisma/client'
import prisma from '../prisma'

/**
 * Inline shot: !((shot:id))(@author $TARGET|[[Target]] #CHOICE)
 */

export type ShotContent = {
  comment?: string
  quote?: string
}

function isShotChoice(s: string): s is ShotChoice {
  return ['LONG', 'SHORT', 'HOLD'].includes(s)
}

/**
 * 不會做 validation，這是為了保留 user 所輸入的內容，在 shot form 裡做檢驗、修正
 */
export function parseInlineShotParams(params: string[]): {
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
}

export function toInlineShotString({
  author,
  choice,
  targetSymbol,
  id,
}: {
  author: string
  choice: ShotChoice
  targetSymbol: string
  id?: string
}): string {
  // const { symbolName, cardType } = parseSymbol(targetSymbol)
  if (id) {
    return `!((shot:${id}))(@${author} ${targetSymbol} #${choice})`
  }
  return `!((shot))(@${author} ${targetSymbol} #${choice})`
}

// export async function updateShot()

export async function createShot({
  choice,
  targetCardId,
  userId,
  authorId,
  content,
  linkId,
}: {
  choice: ShotChoice
  targetCardId: string
  userId: string
  authorId?: string | null
  content?: ShotContent
  linkId?: string | null
}): Promise<
  Shot & {
    author: Author | null
    target: Card
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
  return await prisma.shot.create({
    data: {
      choice,
      content: content ?? {},
      user: { connect: { id: userId } },
      author: authorId ? { connect: { id: authorId } } : undefined,
      link: linkId ? { connect: { id: linkId } } : undefined,
      target: { connect: { id: targetCardId } },
    },
    include: {
      author: true,
      target: true,
    },
  })
}
