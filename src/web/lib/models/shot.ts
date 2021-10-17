import { Shot, ShotChoice } from '.prisma/client'
import prisma from '../prisma'
import { parseSymbol } from './symbol'

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

// async function createShot({ ticker: string }: { ticker: string }): Promise<Shot> {
//   return prisma.shot.create({
//     data: {},
//   })
// }
