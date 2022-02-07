import { Discuss } from '@prisma/client'
import prisma from '../prisma'

export const DiscussModel = {
  async getAll(): Promise<Discuss[]> {
    console.log('Retreiving all discusses from database...')

    let discusses: Discuss[] = []
    let cursor: string | undefined = undefined

    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const res: Discuss[] = await prisma.discuss.findMany({
        take: 100,
        skip: cursor ? 1 : undefined, // skip cursor itself
        orderBy: { createdAt: 'asc' },
        cursor: cursor ? { id: cursor } : undefined,
      })
      if (res.length === 0) {
        break
      }
      discusses = discusses.concat(res)
      cursor = res[res.length - 1].id
    }
    return discusses
  },
}
