import { NextApiRequest, NextApiResponse } from 'next'
import { AuthenticationError, UserInputError } from 'apollo-server-micro'
// import { compare, hash } from 'bcryptjs'
import { getSession, Session } from '@auth0/nextjs-auth0'
import { ResolverContext } from './apollo-client'
import prisma from '../lib/prisma'
import { QueryResolvers, MutationResolvers, Cocard, CardTemplate, LikeChoice } from './type-defs.graphqls'
import { searchAllSymbols } from '../lib/search/fuzzy'
import { getOrCreateLink } from '../lib/models/link'
import { getOrCreateCardByLink, getOrCreateCardBySymbol } from '../lib/models/card'
import { createWebCardBody } from '../lib/models/card-body'
import { getOrCreateUser } from '../lib/models/user'
import { createVote } from '../lib/models/vote'
import { deltaLike } from '../lib/helper'

function _toStringId<T extends { id: number }>(obj: T): T & { id: string } {
  return { ...obj, id: obj.id.toString() }
}

// function isLocalAuthenticated(req: NextApiRequest, res: NextApiResponse): Session {
//   try {
//     return getLoginSession(req)
//   } catch (error) {
//     console.log(error)
//     removeTokenCookie(res)
//     throw new AuthenticationError('')
//   }
// }

function isAuthenticated(req: NextApiRequest, res: NextApiResponse): { userId: string; email: string } {
  const session = getSession(req, res)
  if (session?.user && session.user.appUserId) {
    return { userId: session.user.appUserId, email: session.user.email }
  }
  throw new AuthenticationError('')
}

const Query: Required<QueryResolvers<ResolverContext>> = {
  // tagHints: (parent, { term }, { prisma }) => {
  //   return null
  // },
  // tickerHints: (parent, { term }, { prisma }) => {
  //   return null
  // },
  // eventHints: (parent, { term }, { prisma }) => {
  //   return null
  // },

  searchAll(_parent, { term }, _context, _info) {
    return searchAllSymbols(term)
  },

  searchTopic(_parent, { term }, _context, _info) {
    return searchAllSymbols(term)
  },

  async latestCards(_parent, { afterId }, _context, _info) {
    // const maxDate = dayjs().startOf('d').subtract(7, 'd')
    const cards = await prisma.cocard.findMany({
      take: 30,
      skip: afterId ? 1 : 0,
      where: {
        // createdAt: { gte: maxDate.toDate() },
        // symbols: symbolId ? { some: { id: parseInt(symbolId) } } : undefined,
      },
      orderBy: { updatedAt: 'desc' },
      cursor: afterId ? { id: parseInt(afterId) } : undefined,
      // TODO: 這裡含body會過於heavy
      include: { link: true, body: true },
    })
    return cards.map<Cocard>(e => ({
      ...e,
      id: e.id.toString(),
      template: e.template as CardTemplate,
      link: { ...e.link, id: e.link.id.toString() },
      body: { ...e.body, id: e.body.id.toString() },
    }))
  },

  async link(_parent, { url }, _context, _info) {
    const link = await prisma.link.findUnique({
      where: { url },
    })
    if (link) return _toStringId(link)
    return null
  },

  async cocard(_parent, { url, symbol }, _context, _info) {
    if (symbol) {
      const card = await getOrCreateCardBySymbol(symbol)
      return {
        ..._toStringId(card),
        template: card.template as CardTemplate,
        link: _toStringId(card.link),
        body: _toStringId(card.body),
      }
    }
    if (url) {
      // 找不到即創新cocard
      const [link] = await getOrCreateLink(url)
      const card = await getOrCreateCardByLink(link)
      return {
        ..._toStringId(card),
        template: card.template as CardTemplate,
        link: _toStringId(card.link),
        body: _toStringId(card.body),
      }
    }
    throw new Error('Not found')
  },

  selfcard(_parent, _args, _context, _info) {
    throw new Error('Not implemented')
    // return prisma.selfcard.findUnique({
    //   where: { id: parseInt(id) },
    //   include: { symbol: true, body: true },
    // })
  },

  ocard(_parent, _args, _context, _info) {
    throw new Error('Not implemented')
    /** 若沒有 1. card 2. symbol -> 都建新的 */
    // const symbol = await prisma.symbol.findOne({ where: { name: symbolName } })
    // if (symbol === null)
    //   throw new Error("Symbol not found")
    // throw new ApolloError('Symbol not found', 'NO_SYMBOL');
    // const oauthor = await prisma.oauthor.findUnique({ where: { name: oauthorName } })
    // if (oauthor === null) throw new Error('Oauthor not found')
    // const [symbol] = await getOrCreateSymbol(symbolName)

    // return null
    // return await prisma.ocard.upsert({
    //   where: id ? { id: parseInt(id) } : { oauthorName_symbolName: { oauthorName, symbolName, } },
    //   create: {
    //     template: PA.CardTemplate.TICKER,
    //     oauthor: { connect: { id: oauthor.id } },
    //     symbol: { connect: { id: symbol.id } },
    //   },
    //   update: {},
    //   include: { symbol: true, body: true },
    // })
  },

  mycard(_parent, _args, _context, _info) {
    // if (!req.userId) throw new AuthenticationError('must authenticate')
    // // return null
    // if (symbolName === '') throw new UserInputError('must gve ia symbol')
    // return prisma.selfcard.findUnique({
    //   where: {
    //     userId_symbolName: {
    //       userId: req.userId,
    //       symbolName,
    //     },
    //   },
    //   include: { symbol: true, body: true },
    // })
    throw new Error('Not implemented')
  },

  // comments: (parent, { pageId, afterId }, { prisma }) => {
  //   return prisma.comment.findMany({
  //     where: { pageId: parseInt(pageId), isProp: false },
  //     orderBy: { createdAt: "desc" },
  //     include: { count: true, replies: true },
  //     cursor: afterId ? { id: parseInt(afterId) } : undefined,
  //     take: 20
  //   })
  // },

  async anchor(_parent, { id }, _context, _info) {
    const anchor = await prisma.anchor.findUnique({
      where: { id: parseInt(id) },
      include: { count: true },
    })
    if (anchor && anchor.count) {
      return { ..._toStringId(anchor), count: _toStringId(anchor.count) }
    }
    return null
  },

  async comment(_parent, { id }, _context, _info) {
    console.log(id, parseInt(id))
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
      include: {
        count: true,
        poll: { include: { count: true } },
      },
    })
    if (comment && comment.count && comment.poll && comment.poll.count) {
      return {
        ..._toStringId(comment),
        count: _toStringId(comment.count),
        // count: _toStringId(comment.count),
        poll: comment.poll ? { ..._toStringId(comment.poll), count: _toStringId(comment.poll.count) } : null,
      }
    } else if (comment && comment.count && comment.poll === null) {
      return {
        ..._toStringId(comment),
        count: _toStringId(comment.count),
        poll: null,
      }
    }
    return null
  },

  async replies(_parent, { commentId, afterId }, _context, _info) {
    console.log(commentId)
    const replies = await prisma.reply.findMany({
      where: { commentId: parseInt(commentId) },
      orderBy: { createdAt: 'desc' },
      include: { count: true },
      cursor: afterId ? { id: parseInt(afterId) } : undefined,
      take: 100,
    })
    return replies.map(e => {
      if (e.count) {
        return { ..._toStringId(e), count: _toStringId(e.count) }
      }
      throw new Error()
    })
  },

  // roboPolls: async (parent, { symbolName }, { prisma }) => {
  //   const maxDate = dayjs().startOf("d").subtract(7, "d")
  //   // TODO: 應該要經過「挑選」，只挑重要的出來
  //   const polls = await prisma.poll.findMany({
  //     take: 100,
  //     where: {
  //       createdAt: { gte: maxDate.toDate() },
  //       symbols: symbolId ? { some: { id: parseInt(symbolId) } } : undefined,
  //     },
  //     orderBy: { createdAt: "desc" },
  //     include: {
  //       symbols: true,
  //       count: true,
  //       choices: true,
  //       posts: { include: { count: true } },
  //     },
  //     cursor: afterId ? { id: parseInt(afterId) } : undefined,
  //   })
  //   // prisma-bug-hack：假如傳回來的post-id與afterId相同，代表已經沒有更多post
  //   if (polls.length === 1 && polls[0].id === parseInt(afterId))
  //     return []
  //   return polls
  // },

  // latestPolls: async (parent, { symbolId, afterId }, { prisma }) => {
  //   const maxDate = dayjs().startOf("d").subtract(7, "d")
  //   // TODO: 應該要經過「挑選」，只挑重要的出來
  //   const polls = await prisma.poll.findMany({
  //     take: 100,
  //     where: {
  //       createdAt: { gte: maxDate.toDate() },
  //       symbols: symbolId ? { some: { id: parseInt(symbolId) } } : undefined,
  //     },
  //     orderBy: { createdAt: "desc" },
  //     include: {
  //       symbols: true,
  //       count: true,
  //       choices: true,
  //       posts: { include: { count: true, votes: true } },
  //     },
  //     cursor: afterId ? { id: parseInt(afterId) } : undefined,
  //   })
  //   // prisma-bug-hack：假如傳回來的post-id與afterId相同，代表已經沒有更多post
  //   if (polls.length === 1 && polls[0].id === parseInt(afterId))
  //     return []
  //   return polls
  // },

  // repliedPosts: (parent, { parentId, afterId }, { prisma }) => {
  //   // const maxDate = dayjs().startOf("d").subtract(7, "d")

  //   // await prisma.postCount.findMany({
  //   //   where: {
  //   //     post: {
  //   //       parentId: parseInt(parentId),
  //   //       cat: PostCat.REPLY
  //   //     }
  //   //   },
  //   //   orderBy: { nUps: "desc" },
  //   //   include: {
  //   //     post: true
  //   //   }
  //   // })
  //   // TODO: `orderBy`要按照按讚數來排序
  //   return prisma.post.findMany({
  //     take: 30,
  //     where: {
  //       // createdAt: { gte: maxDate.toDate() },
  //       cat: PostCat.REPLY,
  //     },
  //     orderBy: {
  //       createdAt: "desc",
  //     },
  //     include: {
  //       symbols: true,
  //       count: true,
  //       poll: { include: { count: true } },
  //     },
  //     // cursor: { id: afterId }
  //   })
  // },

  // myPosts: (parent, args, { prisma, req }) => {
  //   // TODO: @me: 發文、按讚的、投過票的、comment的
  //   return prisma.post.findMany({
  //     take: 30,
  //     orderBy: { createdAt: "desc" },
  //     where: { userId: req.userId },
  //     include: {
  //       symbols: true,
  //       count: true,
  //       poll: {
  //         include: { count: true }
  //       },
  //     },
  //   })
  // },

  // // symbolPosts: (parent, { symbolId, after = null }, { prisma }) => {
  // //   // return prisma.symbol.findOne({ where: { id: symbolId } })
  // //   //   .posts({ first: 30 })
  // //   return prisma.post.findMany({ where: { symbols: { every: { id: symbolId } } } })
  // // },

  // risingPosts: (parent, args, ctx) => {
  //   return []
  // },

  // trendPosts: (parent, args, ctx) => {
  //   return []
  // },

  // post: (parent, { id }, { prisma }) => {
  //   return prisma.post.findOne({
  //     where: { id: parseInt(id) },
  //     include: {
  //       symbols: true,
  //       count: true,
  //       poll: { include: { count: true } },
  //       // parent: { select: { id: true, cat: true, title: true } },
  //       // children: { select: { id: true, cat: true, title: true } }
  //     },
  //   })
  // },

  // symbol: (parent, { name }, { prisma }) => {
  //   return prisma.symbol.findOne({ where: { name } })
  // },

  // ticks: (parent, { symbolId, afterId }, { prisma }) => {
  //   return prisma.tick.findMany({
  //     take: 100,
  //     where: { symbolId },
  //     orderBy: { at: "desc" },
  //     cursor: { id: afterId }
  //   })
  // },

  async me(_parent, _args, { req, res }, _info) {
    const { email } = isAuthenticated(req, res)
    const user = await getOrCreateUser(email)
    // await prisma.user.findUnique({ where: { id: userId } })
    return user
  },

  async myAnchorLikes(_parent, { after }, { req, res }, _info) {
    const { userId } = isAuthenticated(req, res)
    const likes = await prisma.anchorLike.findMany({ where: { userId }, take: 50 })
    return likes.map(e => ({ ..._toStringId(e), choice: e.choice as LikeChoice }))
  },

  async myCommentLikes(_parent, { after }, { req, res }, _info) {
    const { userId } = isAuthenticated(req, res)
    const likes = await prisma.commentLike.findMany({ where: { userId }, take: 50 })
    return likes.map(e => ({ ..._toStringId(e), choice: e.choice as LikeChoice }))
  },

  async myReplyLikes(_parent, { after }, { req, res }, _info) {
    // return prisma.replyLike.findMany({ where: { userId: req.userId }, take: 50 })
    const { userId } = isAuthenticated(req, res)
    const likes = await prisma.replyLike.findMany({ where: { userId }, take: 50 })
    return likes.map(e => ({ ..._toStringId(e), choice: e.choice as LikeChoice }))
  },

  async myVotes(_parent, { after }, { req, res }, _info) {
    const { userId } = isAuthenticated(req, res)
    const votes = await prisma.vote.findMany({ where: { userId }, take: 50 })
    return votes.map(e => ({ ..._toStringId(e) }))
  },

  // myFollows: (parent, { after }, { prisma, req }) => {
  //   return prisma.follow.findMany({ where: { userId: req.userId, followed: true } })
  // },
}

const Mutation: Required<MutationResolvers<ResolverContext>> = {
  async createWebCardBody(_parent, { cardId, data }, { req, res }, _info) {
    const { userId } = isAuthenticated(req, res)
    const body = await createWebCardBody(parseInt(cardId), data.text, userId)
    return _toStringId(body)
  },

  // createMycard: async function (parent, { symbolName, data }, { prisma, req }) {
  //   const cocard = await prisma.cocard.findUnique({ where: { linkUrl: symbolToUrl(symbolName) } })
  //   if (cocard === null) throw new Error('Symbol not found, fail to create ticker-mycard')
  //   // TODO:  需要確認comment的meta，又或者在這裡才加入meta
  //   const card = await prisma.selfcard.create({
  //     data: {
  //       template: PA.CardTemplate.TICKER,
  //       user: { connect: { id: req.userId } },
  //       symbol: { connect: { name: symbolName } },
  //       body: { create: { text: '', user: { connect: { id: req.userId } } } },
  //     },
  //   })
  //   // 無法直接include（prisma的bug）
  //   return await prisma.selfcard.findUnique({
  //     where: { id: card.id },
  //     include: { symbol: true, body: true },
  //   })
  // },

  // createOcard: async function (parent, { symbolName, oauthorName, data }, { prisma, req }) {
  //   const cocard = await prisma.cocard.findOne({ where: { linkUrl: symbolToUrl(symbolName) } })
  //   if (cocard === null)
  //     throw new Error('Symbol not found, fail to create ticker-ocard')
  //   const card = await prisma.ocard.create({
  //     data: {
  //       template: PA.CardTemplate.TICKER,
  //       oauthor: { connect: { name: oauthorName } },
  //       symbol: { connect: { name: symbolName } },
  //       comments: {
  //         create: data.map((e: CommentInput) => ({
  //           // TODO: meta資料要檢查完才能存進資料庫
  //           meta: { mark: e.mark, src: e.src },
  //           text: e.text,
  //           user: { connect: { id: req.userId } },
  //           // 同時間port至cocard
  //           cocard: { connect: { id: cocard.id } },
  //           count: { create: {} },
  //         }))
  //       }
  //     },
  //   })
  //   // 無法直接include（prisma的bug）
  //   return await prisma.ocard.findOne({
  //     where: { id: card.id },
  //     include: {
  //       symbol: true,
  //       comments: { include: { count: true } },
  //     },
  //   })
  // },

  // createComments: function (parent, { cardId, cardType, symbolName, data }, { prisma, req }) {
  //   /**
  //    * TODO:
  //    * - update/delete前comments的情形
  //    * - 需要確認comment的meta，又或者在這裡才加入meta
  //    * - Create poll
  //    */
  //   // 讓`ocard`, `selfcard`的comments同步連結至`cocard`
  //   let conn: Record<string, { connect: { id?: number, linkUrl?: string } }> = {}
  //   if (cardType === 'Cocard') {
  //     conn['cocard'] = { connect: { id: parseInt(cardId) } }
  //   } else if (cardType === 'Ocard' && symbolName) {
  //     conn['ocard'] = { connect: { id: parseInt(cardId) } }
  //     conn['cocard'] = { connect: { linkUrl: symbolToUrl(symbolName) } }
  //   } else if (cardType === 'Selfcard') {
  //     conn['selfcard'] = { connect: { id: parseInt(cardId) } }
  //     conn['cocard'] = { connect: { linkUrl: symbolToUrl(symbolName) } }
  //   } else {
  //     throw new Error('Unrecognized `cardType`')
  //   }
  //   return prisma.$transaction(data.map((e: CommentInput) => prisma.comment.create({
  //     data: {
  //       // TODO: meta需要包含source, ...
  //       meta: { mark: e.mark },
  //       text: e.text,
  //       user: { connect: { id: req.userId } },
  //       // symbols: { connect: (data.symbolIds as string[]).map(x => ({ name: x })) },
  //       count: { create: {} },
  //       ...conn,
  //     },
  //     include: {
  //       symbols: true,
  //       count: true,
  //       // replies: true,
  //       // poll: true,
  //     },
  //   })))
  // },

  async createReply(_parent, { commentId, data }, { req, res }, _info) {
    const { userId } = isAuthenticated(req, res)
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
      include: { count: true },
    })
    if (comment === null) {
      throw new Error(`Cannot find comment: id=${commentId}`)
    }
    // if (post.status !== PostStatus.ACTIVE)
    //   throw new Error("post is not active")
    // await prisma.commentCount.update({
    //   data: { nReplies: comment.count.nComments + 1 },
    //   where: { commentId: comment.id }
    // })
    const reply = await prisma.reply.create({
      data: {
        text: data.text,
        user: { connect: { id: userId } },
        comment: { connect: { id: parseInt(commentId) } },
        count: { create: {} },
      },
      include: { count: true },
    })
    if (reply.count === null) {
      throw new Error('Prisma error')
    }
    return { ..._toStringId(reply), count: _toStringId(reply.count) }
  },

  async createAnchorLike(_parent, { anchorId, data }, { req, res }, _info) {
    const { userId } = isAuthenticated(req, res)
    const count = await prisma.anchorCount.findUnique({ where: { anchorId: parseInt(anchorId) } })
    if (count === null) {
      throw new Error('Prisma error')
    }
    const like = await prisma.anchorLike.create({
      data: {
        choice: data.choice,
        user: { connect: { id: userId } },
        anchor: { connect: { id: parseInt(anchorId) } },
      },
    })
    const { deltaUp, deltaDown } = deltaLike(like)
    const updatedCount = await prisma.anchorCount.update({
      data: {
        nUps: count.nUps + deltaUp,
        nDowns: count.nDowns + deltaDown,
      },
      where: { anchorId: like.anchorId },
    })
    return { like: { ..._toStringId(like), choice: like.choice as LikeChoice }, count: _toStringId(updatedCount) }
  },

  async updateAnchorLike(_parent, { id, data }, { req, res }, _info) {
    const { userId } = isAuthenticated(req, res)
    const prevLike = await prisma.anchorLike.findUnique({ where: { id: parseInt(id) } })
    if (prevLike === null || prevLike?.userId !== userId || data.choice === prevLike.choice) {
      throw new Error('No matched data')
    }
    const count = await prisma.anchorCount.findUnique({ where: { anchorId: prevLike.anchorId } })
    if (count === null) {
      throw new Error('Prisma error, update fail')
    }
    const like = await prisma.anchorLike.update({
      data: { choice: data.choice },
      where: { id: prevLike.id },
    })
    const { deltaUp, deltaDown } = deltaLike(like, prevLike)
    const updatedCount = await prisma.anchorCount.update({
      data: {
        nUps: count.nUps + deltaUp,
        nDowns: count.nDowns + deltaDown,
      },
      where: { anchorId: like.anchorId },
    })
    return { like: { ..._toStringId(like), choice: like.choice as LikeChoice }, count: _toStringId(updatedCount) }
  },

  async createCommentLike(_parent, { commentId, data }, { req, res }, _info) {
    const { userId } = isAuthenticated(req, res)
    const count = await prisma.commentCount.findUnique({ where: { commentId: parseInt(commentId) } })
    if (count === null) {
      throw new Error('Prisma error')
    }
    const like = await prisma.commentLike.create({
      data: {
        choice: data.choice,
        user: { connect: { id: userId } },
        comment: { connect: { id: parseInt(commentId) } },
      },
    })
    const { deltaUp, deltaDown } = deltaLike(like)
    const updatedCount = await prisma.commentCount.update({
      data: {
        nUps: count.nUps + deltaUp,
        nDowns: count.nDowns + deltaDown,
      },
      where: { commentId: like.commentId },
    })
    return { like: { ..._toStringId(like), choice: like.choice as LikeChoice }, count: _toStringId(updatedCount) }
  },

  async updateCommentLike(_parent, { id, data }, { req, res }, _info) {
    const { userId } = isAuthenticated(req, res)
    const prevLike = await prisma.commentLike.findUnique({ where: { id: parseInt(id) } })
    if (prevLike === null || prevLike?.userId !== userId || data.choice === prevLike.choice) {
      throw new Error('No matched data')
    }
    const count = await prisma.commentCount.findUnique({ where: { commentId: prevLike.commentId } })
    if (count === null) {
      throw new Error('Prisma error, update fail')
    }
    const like = await prisma.commentLike.update({
      data: { choice: data.choice },
      where: { id: prevLike.id },
    })
    const { deltaUp, deltaDown } = deltaLike(like, prevLike)
    const updatedCount = await prisma.commentCount.update({
      data: {
        nUps: count.nUps + deltaUp,
        nDowns: count.nDowns + deltaDown,
      },
      where: { commentId: like.commentId },
    })
    return { like: { ..._toStringId(like), choice: like.choice as LikeChoice }, count: _toStringId(updatedCount) }
  },

  async createReplyLike(_parent, { replyId, data }, { req, res }, _info) {
    const { userId } = isAuthenticated(req, res)
    const count = await prisma.replyCount.findUnique({ where: { replyId: parseInt(replyId) } })
    if (count === null) {
      throw new Error('Prisma error')
    }
    const like = await prisma.replyLike.create({
      data: {
        choice: data.choice,
        user: { connect: { id: userId } },
        reply: { connect: { id: parseInt(replyId) } },
      },
    })
    const { deltaUp, deltaDown } = deltaLike(like)
    const updatedCount = await prisma.replyCount.update({
      data: {
        nUps: count.nUps + deltaUp,
        nDowns: count.nDowns + deltaDown,
      },
      where: { replyId: like.replyId },
    })
    return { like: { ..._toStringId(like), choice: like.choice as LikeChoice }, count: _toStringId(updatedCount) }
  },

  async updateReplyLike(_parent, { id, data }, { req, res }, _info) {
    const { userId } = isAuthenticated(req, res)
    const prevLike = await prisma.replyLike.findUnique({ where: { id: parseInt(id) } })
    if (prevLike === null || prevLike?.userId !== userId || data.choice === prevLike.choice) {
      throw new Error('No matched data')
    }
    const count = await prisma.replyCount.findUnique({ where: { replyId: prevLike.replyId } })
    if (count === null) {
      throw new Error('Prisma error, update fail')
    }
    const like = await prisma.replyLike.update({
      data: { choice: data.choice },
      where: { id: prevLike.id },
    })
    const { deltaUp, deltaDown } = deltaLike(like, prevLike)
    const updatedCount = await prisma.replyCount.update({
      data: {
        nUps: count.nUps + deltaUp,
        nDowns: count.nDowns + deltaDown,
      },
      where: { replyId: like.replyId },
    })
    return { like: { ..._toStringId(like), choice: like.choice as LikeChoice }, count: _toStringId(updatedCount) }
  },

  async createVote(_parent, { pollId, choiceIdx }, { req, res }, _info) {
    const { userId } = isAuthenticated(req, res)
    const vote = await createVote({ choiceIdx, pollId: parseInt(pollId), userId })
    return _toStringId(vote)
  },

  // async signIn(_parent, { email, password }, { res }, _info) {
  //   console.log(res)
  //   const user = await prisma.user.findUnique({
  //     where: { email },
  //   })
  //   if (user && (await compare(password, user.password))) {
  //     setLoginSession(res, { userId: user.id })

  //     console.log(`User ${user.email} sign in succeess`)

  //     return { token: 'false-token', user }
  //   }

  //   throw new UserInputError('Could not find a match for username and password')
  //   // const valid = await compare(password, user.password)
  //   // if (!valid) throw new UserInputError('Could not find a match for username and password')

  //   // const token = sign({ userId: user.id }, APP_SECRET)
  //   // res.cookie('token', `Bearer ${token}`, {
  //   //   httpOnly: true,
  //   //   maxAge: 1000 * 60 * 60 * 24,
  //   //   // secure: true,  // https only
  //   // })
  //   // const token = sign({ id: user.id }, APP_SECRET, { algorithm: 'HS256', expiresIn: '1d' })
  // },

  // async signUp(_parent, { email, password }, { res }, _info) {
  //   removeTokenCookie(res)

  //   const user = await prisma.user.create({
  //     data: {
  //       email,
  //       password: await hash(password, 10),
  //       // profile: { create: {} },
  //       // dailyProfile: { create: {} },
  //     },
  //   })
  //   return user
  // },

  // signOut(_parent, _args, { res }, _info) {
  //   removeTokenCookie(res)
  //   return true
  // },

  // ------

  // updateVote: (parent, { pollId, data }, { prisma, req }) => {
  //   return prisma.pollVote.update({ userId: req.userId, ...data })
  // },

  // updateComment: (parent, { id, data }, { prisma, req }) => {
  //   return prisma.comment.update({
  //     data: { content: data.cotent },
  //     where: { id: parseInt(id) }
  //   })
  // },

  // createVotePost: async function (parent, { pollId, choiceId, data }, { prisma, req }) {
  //   return prisma.post.create({
  //     data: {
  //       cat: data.cat,
  //       text: data.text,
  //       user: { connect: { id: req.userId } },
  //       poll: pollId ? { connect: { id: parseInt(pollId) } } : undefined,
  //       symbols: { connect: (data.symbolIds as string[]).map(x => ({ name: x })) },
  //       count: { create: {} },
  //       votes: {
  //         create: [
  //           {
  //             user: { connect: { id: req.userId } },
  //             poll: { connect: { id: parseInt(pollId) } },
  //             choice: { connect: { id: parseInt(choiceId) } }
  //           }
  //         ]
  //       }
  //     },
  //     include: {
  //       count: true,
  //       symbols: true,
  //       votes: true,
  //       // poll: true,
  //     },
  //   })
  // },

  // createPoll: async (parent, { data }, { prisma, req }) => {
  //   const start = dayjs().startOf('d')
  //   const end = start.add(data.nDays, 'd')
  //   return prisma.poll.create({
  //     data: {
  //       cat: data.cat,
  //       title: data.title,
  //       text: data.text,
  //       start: start.toDate(),
  //       end: end.toDate(),
  //       nDays: data.nDays,
  //       choices: {
  //         create: data.choices.map((e: String) => (
  //           {
  //             text: e,
  //             user: { connect: { id: req.userId } }
  //           }
  //         ))
  //       },
  //       user: { connect: { id: req.userId } },
  //       count: { create: {} },
  //       symbols: { connect: (data.symbolIds as string[]).map(e => ({ name: e })) },
  //     },
  //     include: {
  //       choices: true,
  //       symbols: true,
  //       count: true,
  //       posts: { include: { count: true } },
  //     },
  //   })
  // },

  // createPollLike: async (parent, { pollId, data }, { prisma, req }) => {
  //   const like = await prisma.pollLike.create({
  //     data: {
  //       choice: data.choice,
  //       user: { connect: { id: req.userId } },
  //       poll: { connect: { id: parseInt(pollId) } },
  //     }
  //   })
  //   const count = await prisma.pollCount.findOne({ where: { pollId: like.pollId } })
  //   if (count === null) throw new Error('Something went wrong')

  //   const delta = deltaLike(like)
  //   const updatedCount = await prisma.pollCount.update({
  //     data: {
  //       nUps: count.nUps + delta.dUps,
  //       nDowns: count.nDowns + delta.dDowns,
  //     },
  //     where: { pollId: like.pollId }
  //   })
  //   return { like, count: updatedCount }
  // },

  // updatePollLike: async (parent, { id, data }, { prisma, req }) => {
  //   const oldLike = await prisma.pollLike.findOne({
  //     where: { id: parseInt(id) }
  //   })
  //   if (oldLike === null || data.choice === oldLike.choice)
  //     throw new Error('No matched data')

  //   const like = await prisma.pollLike.update({
  //     data: { choice: data.choice },
  //     where: { id: oldLike.id }
  //   })

  //   const delta = deltaLike(like, oldLike)
  //   const count = await prisma.pollCount.findOne({ where: { pollId: like.pollId } })
  //   if (count === null) throw new Error('Something went wrong')

  //   const updatedCount = await prisma.pollCount.update({
  //     data: {
  //       nUps: count.nUps + delta.dUps,
  //       nDowns: count.nDowns + delta.dDowns,
  //     },
  //     where: { pollId: like.pollId }
  //   })
  //   return { like, count: updatedCount }
  // },

  // createCommit: (parent, { data }, { prisma, req }) => {
  //   // invite random reviewers by creating commitReview
  //   return prisma.comment.create({ userId: req.userId, ...data })
  // },

  // updateCommit: (parent, { id, data }, { prisma, req }) => {
  //   return prisma.comment.create({ userId: req.userId, ...data })
  // },

  // updateCommitReview: (parent, { id, data }, { prisma, req }) => {
  //   return prisma.comment.create({ userId: req.userId, ...data })
  // },

  // applyCommitReview: (parent, { id, data }, { prisma, req }) => {
  //   return prisma.comment.create({ userId: req.userId, ...data })
  // },

  // createFollow: (parent, { symbolId, data }, { prisma, req }) => {
  //   return prisma.comment.create({ userId: req.userId, ...data })
  // },

  // updateFollow: (parent, { symbolId, data }, { prisma, req }) => {
  //   return prisma.comment.create({ userId: req.userId, ...data })
  // },
}

export default { Query, Mutation }
