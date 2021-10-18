import { Author, Card, Shot, ShotChoice } from '.prisma/client'
import prisma from '../prisma'

export type ShotContent = {
  comment?: string
  quote?: string
}

/**
 * !((shot))(@someone $TARGET #CHOICE)
 */
export function toShotInlineText({
  id,
  author,
  choice,
  targetSymbol,
}: {
  id?: string
  author: string
  choice: ShotChoice
  targetSymbol: string
}): string {
  // const { symbolName, cardType } = parseSymbol(targetSymbol)
  if (id) {
    return `!((shot:${id}))(@${author} ${targetSymbol} #${choice})`
  }
  return `!((shot))(${targetSymbol} @${author} #${choice})`
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
