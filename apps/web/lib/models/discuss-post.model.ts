import { DiscussPost } from '@prisma/client'
import prisma from '../prisma'

class DiscussPostModel {
  async create(
    userId: string,
    discussId: string,
    content: string,
  ): Promise<DiscussPost> {
    return await prisma.discussPost.create({
      data: {
        user: { connect: { id: userId } },
        discuss: { connect: { id: discussId } },
        content,
      },
    })
  }
}

export const discussModel = new DiscussPostModel()
