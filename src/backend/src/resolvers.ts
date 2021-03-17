/**
 * TEST: npm run dev; http://localhost:4000/graphql
 */
import dayjs from 'dayjs'
import { compare, hash } from 'bcryptjs'
import { sign, JsonWebTokenError } from 'jsonwebtoken'
import { GraphQLScalarType, Kind } from 'graphql'
import { GraphQLResolverMap } from 'apollo-graphql'
import { AuthenticationError, UserInputError } from 'apollo-server'
import { GraphQLDateTime } from 'graphql-iso-date'
import * as PA from '@prisma/client'
import { APP_SECRET } from './main'
import { TextEditor } from '../../lib/editor/src'
import { Context } from './context'
import { searchAllSymbol } from './store/fuzzy'
import { symbolToUrl, urlToSymbol } from './models/symbol'
import { getOrCreateLink } from './models/link'
import { getOrCreateCardByLink, getOrCreateCardBySymbol, createCardBody } from './models/card'

// function parsePostCount(count: PostCount): ST.PostCount {
//   if (!count.poll)
//     return {
//       ...count,
//       id: count.id.toString(),
//       poll: undefined,
//     }
//   const poll = JSON.parse(count.poll) as ST.PollCount
//   delete count.poll
//   return {
//     ...count,
//     id: count.id.toString(),
//     poll,
//   }
// }

function deltaLike(
  like: PA.AnchorLike | PA.CommentLike | PA.ReplyLike,
  oldLike?: PA.AnchorLike | PA.CommentLike | PA.ReplyLike,
) {
  let dUps = 0,
    dDowns = 0
  if (oldLike) {
    switch (oldLike.choice) {
      case PA.LikeChoice.DOWN:
        dDowns -= 1
        break
      case PA.LikeChoice.UP:
        dUps -= 1
        break
    }
  }
  switch (like.choice) {
    case PA.LikeChoice.DOWN:
      dDowns += 1
      break
    case PA.LikeChoice.UP:
      dUps += 1
      break
  }
  return { dDowns, dUps }
}

export const resolvers: GraphQLResolverMap<Context> = {
  DateTime: GraphQLDateTime as GraphQLScalarType,

  Query: {
    // tagHints: (parent, { term }, { prisma }) => {
    //   return null
    // },
    // tickerHints: (parent, { term }, { prisma }) => {
    //   return null
    // },
    // eventHints: (parent, { term }, { prisma }) => {
    //   return null
    // },

    searchAll: function (parent, { term }, { prisma, req }): Promise<string[]> {
      return searchAllSymbol(term)
    },

    latestCards: async function (parent, { afterId }, { prisma }): Promise<PA.Cocard[]> {
      const maxDate = dayjs().startOf('d').subtract(7, 'd')
      const cards = await prisma.cocard.findMany({
        take: 30,
        skip: afterId ? 1 : 0,
        where: {
          createdAt: { gte: maxDate.toDate() },
          // symbols: symbolId ? { some: { id: parseInt(symbolId) } } : undefined,
        },
        orderBy: { updatedAt: 'desc' },
        cursor: afterId ? { id: parseInt(afterId) } : undefined,
        // TODO: 這裡含body會過於heavy
        include: { link: true, body: true },
      })
      // console.log(cards)
      return cards.map(e => ({ ...e, meta: JSON.stringify(e.meta) }))
    },

    cocard: async function (parent, { url }, { prisma }): Promise<PA.Cocard> {
      const symbol = urlToSymbol(url)
      let card: PA.Cocard
      if (symbol !== null) {
        card = await getOrCreateCardBySymbol(symbol)
      } else {
        const [link] = await getOrCreateLink(url)
        card = await getOrCreateCardByLink(link)
      }
      return { ...card, meta: JSON.stringify(card.meta) }
    },

    selfcard: function (parent, { id }, { prisma }) {
      throw new Error('Not implemented')
      // return prisma.selfcard.findUnique({
      //   where: { id: parseInt(id) },
      //   include: { symbol: true, body: true },
      // })
    },

    ocard: async function (parent, { id, oauthorName, symbolName }, { prisma }) {
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

    mycard: function (parent, { symbolName }, { prisma, req }) {
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

    anchor: function (parent, { id }, { prisma }): Promise<PA.Anchor | null> {
      return prisma.anchor.findUnique({
        where: { id: parseInt(id) },
        include: { count: true },
      })
    },

    comment: function (parent, { id }, { prisma }): Promise<PA.Comment | null> {
      return prisma.comment.findUnique({
        where: { id: parseInt(id) },
        include: { count: true, poll: { include: { count: true } } },
      })
    },

    replies: function (parent, { commentId, afterId }, { prisma }): Promise<PA.Reply[]> {
      return prisma.reply.findMany({
        where: { commentId: parseInt(commentId) },
        orderBy: { createdAt: 'desc' },
        include: { count: true },
        cursor: afterId ? { id: parseInt(afterId) } : undefined,
        take: 20,
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

    me: function (parent, args, { prisma, req }): Promise<PA.User | null> {
      return prisma.user.findUnique({ where: { id: req.userId } })
    },

    myAnchorLikes: function (parent, { after }, { prisma, req }): Promise<PA.AnchorLike[]> {
      return prisma.anchorLike.findMany({ where: { userId: req.userId }, take: 50 })
    },

    myCommentLikes: function (parent, { after }, { prisma, req }): Promise<PA.CommentLike[]> {
      return prisma.commentLike.findMany({ where: { userId: req.userId }, take: 50 })
    },

    myReplyLikes: function (parent, { after }, { prisma, req }): Promise<PA.ReplyLike[]> {
      return prisma.replyLike.findMany({ where: { userId: req.userId }, take: 50 })
    },

    myVotes: function (parent, { after }, { prisma, req }): Promise<PA.Vote[]> {
      return prisma.vote.findMany({
        take: 50,
        where: { userId: req.userId },
      })
    },

    // myFollows: (parent, { after }, { prisma, req }) => {
    //   return prisma.follow.findMany({ where: { userId: req.userId, followed: true } })
    // },
  },

  Mutation: {
    createCardBody: async function (parent, { cardId, data }, { prisma, req }): Promise<PA.CardBody> {
      const card = await prisma.cocard.findUnique({
        where: { id: parseInt(cardId) },
        include: { body: true },
      })
      if (card === null || req.userId === undefined) {
        throw new Error('Card not found, fail to create card body')
      }

      const editor = new TextEditor(card.body.text, card.linkUrl)
      editor.setBody(data.text)
      editor.flush()

      // TODO: 1. 只有web-card才需要處理nested 2. 這裡的logic可以移到card.ts
      for (const [cardlabel, markerlines] of editor.getNestedMarkerLines()) {
        // eslint-disable-next-line no-await-in-loop
        const nestedCard = await getOrCreateCardBySymbol(cardlabel.symbol)
        const nestedEditor = new TextEditor(nestedCard.body.text)
        nestedEditor.setMarkerlinesToInsert(markerlines.filter(e => e.new))
        nestedEditor.flush()
        // eslint-disable-next-line no-await-in-loop
        await createCardBody(nestedCard, nestedEditor, req.userId)
      }

      // 必須在最後才創root-card，不然markerlines的new標記會被刪除，因為已經儲存
      return await createCardBody(card, editor, req.userId)
    },

    createMycard: async function (parent, { symbolName, data }, { prisma, req }) {
      const cocard = await prisma.cocard.findUnique({ where: { linkUrl: symbolToUrl(symbolName) } })
      if (cocard === null) throw new Error('Symbol not found, fail to create ticker-mycard')
      // TODO:  需要確認comment的meta，又或者在這裡才加入meta
      const card = await prisma.selfcard.create({
        data: {
          template: PA.CardTemplate.TICKER,
          user: { connect: { id: req.userId } },
          symbol: { connect: { name: symbolName } },
          body: { create: { text: '', user: { connect: { id: req.userId } } } },
        },
      })
      // 無法直接include（prisma的bug）
      return await prisma.selfcard.findUnique({
        where: { id: card.id },
        include: { symbol: true, body: true },
      })
    },

    signup: async (parent, { email, password }, { prisma, res }) => {
      res.clearCookie('token')
      const hashedPassword = await hash(password, 10)
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          // profile: { create: {} },
          // dailyProfile: { create: {} },
        },
      })
      return {
        token: sign({ userId: user.id }, APP_SECRET),
        user,
      }
    },

    login: async function (parent, { email, password }, { prisma, res }) {
      const user = await prisma.user.findUnique({
        where: { email },
      })
      if (!user) throw new Error('Could not find a match for username and password')

      const valid = await compare(password, user.password)
      if (!valid) throw new Error('Could not find a match for username and password')

      const token = sign({ userId: user.id }, APP_SECRET)
      res.cookie('token', `Bearer ${token}`, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        // secure: true,  // https only
      })
      console.log(`User ${user.email} login succeess`)
      return { token, user }
    },

    logout: function (parent, { email, password }, { prisma, res }) {
      res.clearCookie('token')
      return true
    },

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
    //   console.log(cardId, cardType, symbolName, data)

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
    //   console.log(conn)

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

    createReply: async (parent, { commentId, data }, { prisma, req }) => {
      const comment = await prisma.comment.findUnique({
        where: { id: parseInt(commentId) },
        include: { count: true },
      })
      if (comment === null) throw new Error(`Cannot find comment: id=${commentId}`)
      // if (post.status !== PostStatus.ACTIVE)
      //   throw new Error("post is not active")
      // await prisma.commentCount.update({
      //   data: { nReplies: comment.count.nComments + 1 },
      //   where: { commentId: comment.id }
      // })
      return prisma.reply.create({
        data: {
          text: data.text,
          user: { connect: { id: req.userId } },
          comment: { connect: { id: parseInt(commentId) } },
          count: { create: {} },
        },
        include: { count: true },
      })
    },

    createAnchorLike: async (parent, { anchorId, data }, { prisma, req }) => {
      const like = await prisma.anchorLike.create({
        data: {
          choice: data.choice,
          user: { connect: { id: req.userId } },
          anchor: { connect: { id: parseInt(anchorId) } },
        },
      })
      const count = await prisma.anchorCount.findUnique({ where: { anchorId: like.anchorId } })
      if (count === null) throw new Error('Prisma error')

      const delta = deltaLike(like)
      const updatedCount = await prisma.anchorCount.update({
        data: {
          nUps: count.nUps + delta.dUps,
          nDowns: count.nDowns + delta.dDowns,
        },
        where: { anchorId: like.anchorId },
      })
      return { like, count: updatedCount }
    },

    updateAnchorLike: async (parent, { id, data }, { prisma, req }) => {
      const oldLike = await prisma.anchorLike.findUnique({ where: { id: parseInt(id) } })
      if (oldLike === null || data.choice === oldLike.choice) throw new Error('No matched data')

      const like = await prisma.anchorLike.update({
        data: { choice: data.choice },
        where: { id: oldLike.id },
      })
      const delta = deltaLike(like, oldLike)
      const count = await prisma.anchorCount.findUnique({ where: { anchorId: like.anchorId } })
      if (count === null) throw new Error('Something went wrong')

      const updatedCount = await prisma.anchorCount.update({
        data: {
          nUps: count.nUps + delta.dUps,
          nDowns: count.nDowns + delta.dDowns,
        },
        where: { anchorId: like.anchorId },
      })
      return { like, count: updatedCount }
    },

    createCommentLike: async (parent, { commentId, data }, { prisma, req }) => {
      const like = await prisma.commentLike.create({
        data: {
          choice: data.choice,
          user: { connect: { id: req.userId } },
          comment: { connect: { id: parseInt(commentId) } },
        },
      })
      const count = await prisma.commentCount.findUnique({ where: { commentId: like.commentId } })
      if (count === null) throw new Error('Something went wrong')
      const delta = deltaLike(like)
      const updatedCount = await prisma.commentCount.update({
        data: {
          nUps: count.nUps + delta.dUps,
          nDowns: count.nDowns + delta.dDowns,
        },
        where: { commentId: like.commentId },
      })
      return { like, count: updatedCount }
    },

    updateCommentLike: async (parent, { id, data }, { prisma, req }) => {
      const oldLike = await prisma.commentLike.findUnique({ where: { id: parseInt(id) } })
      if (oldLike === null || data.choice === oldLike.choice) throw new Error('No matched data')
      const like = await prisma.commentLike.update({
        data: { choice: data.choice },
        where: { id: oldLike.id },
      })
      const delta = deltaLike(like, oldLike)
      const count = await prisma.commentCount.findUnique({ where: { commentId: like.commentId } })
      if (count === null) throw new Error('Something went wrong')
      const updatedCount = await prisma.commentCount.update({
        data: {
          nUps: count.nUps + delta.dUps,
          nDowns: count.nDowns + delta.dDowns,
        },
        where: { commentId: like.commentId },
      })
      return { like, count: updatedCount }
    },

    createReplyLike: async (parent, { replyId, data }, { prisma, req }) => {
      const like = await prisma.replyLike.create({
        data: {
          choice: data.choice,
          user: { connect: { id: req.userId } },
          reply: { connect: { id: parseInt(replyId) } },
        },
      })
      const count = await prisma.replyCount.findUnique({ where: { replyId: like.replyId } })
      if (count === null) throw new Error('Something went wrong')
      const delta = deltaLike(like)
      const updatedCount = await prisma.replyCount.update({
        data: {
          nUps: count.nUps + delta.dUps,
          nDowns: count.nDowns + delta.dDowns,
        },
        where: { replyId: like.replyId },
      })
      return { like, count: updatedCount }
    },

    updateReplyLike: async (parent, { id, data }, { prisma, req }) => {
      const oldLike = await prisma.replyLike.findUnique({ where: { id: parseInt(id) } })
      if (oldLike === null || data.choice === oldLike.choice) throw new Error('No matched data')
      const like = await prisma.replyLike.update({
        data: { choice: data.choice },
        where: { id: oldLike.id },
      })
      const delta = deltaLike(like, oldLike)
      const count = await prisma.replyCount.findUnique({ where: { replyId: like.replyId } })
      if (count === null) throw new Error('Something went wrong')
      const updatedCount = await prisma.replyCount.update({
        data: {
          nUps: count.nUps + delta.dUps,
          nDowns: count.nDowns + delta.dDowns,
        },
        where: { replyId: like.replyId },
      })
      return { like, count: updatedCount }
    },

    createVote: (parent, { pollId, choiceIdx }, { prisma, req }) => {
      return prisma.vote.create({
        data: {
          user: { connect: { id: req.userId } },
          poll: { connect: { id: parseInt(pollId) } },
          choiceIdx,
        },
      })
    },

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
  },
}
