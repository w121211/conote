import { AuthenticationError } from 'apollo-server-micro'
// import { compare, hash } from 'bcryptjs'
import {
  DiscussEmoji,
  DiscussEmojiCount,
  DiscussPostEmoji,
  DiscussPostEmojiCount,
  Note,
  NoteDoc,
  NoteDraft,
  NoteEmoji,
  NoteEmojiCount,
  SymType,
} from '@prisma/client'
import {
  QueryResolvers,
  MutationResolvers,
} from 'graphql-let/__generated__/__types__'
import { isAuthenticated, sessionLogin, sessionLogout } from '../lib/auth/auth'
import { hasCount, toStringId } from '../lib/helpers'
import { AuthorModel } from '../lib/models/author-model'
import { PollMeta } from '../lib/models/poll-model'
import { RateModel } from '../lib/models/rate-model'
import { getOrCreateUser } from '../lib/models/user-model'
import { createVote } from '../lib/models/vote-model'
import { SymModel } from '../lib/models/sym-model'
import prisma from '../lib/prisma'
import {
  SearchAuthorService,
  SearchDiscussService,
  SearchSymService,
} from '../lib/search/search'
import { ResolverContext } from './apollo-client'
import {
  discussEmojiModel,
  discussPostEmojiModel,
  noteEmojiModel,
} from '../lib/models/emoji-model'
import { NoteDocContent, NoteDocMeta } from '../lib/interfaces'
import { commitNoteDrafts } from '../lib/models/commit-model'

// function _deleteNull<T>(obj: T) {
//   let k: keyof T
//   for (k in obj) {
//     if (obj[k] === null) {
//       delete obj[k]
//     }
//   }
// }

// function _nullToUndefined<T>(obj: T): { [P in keyof T]: Exclude<T[P], null> } {
//   for (const k in obj) {
//     if (obj[k] === null) {
//       delete obj[k]
//     }
//   }
//   if (isNonNull(obj)) {
//     return obj
//   }
// }

// function isLocalAuthenticated(req: NextApiRequest, res: NextApiResponse): Session {
//   try {
//     return getLoginSession(req)
//   } catch (error) {
//     console.log(error)
//     removeTokenCookie(res)
//     throw new AuthenticationError('')
//   }
// }

// const isAuthenticated = (req: NextApiRequest, res: NextApiResponse): { userId: string; email: string } => {
//   const session = getSession(req, res)
//   if (session?.user && session.user.appUserId) {
//     return { userId: session.user.appUserId, email: session.user.email }
//   }
//   throw new AuthenticationError('Not authenticated')
// }

const Query: Required<QueryResolvers<ResolverContext>> = {
  async author(_parent, { id, name }, _context, _info) {
    return await AuthorModel.get(id ?? undefined, name ?? undefined)
  },

  async bullet(_parent, { id }, _context, _info) {
    return await prisma.bullet.findUnique({
      where: { id },
    })
  },

  async discuss(_parent, { id }, _context, _info) {
    const discuss = await prisma.discuss.findUnique({
      where: { id },
      include: { count: true },
    })
    if (discuss && discuss.count) {
      return {
        ...discuss,
        id: discuss.id.toString(),
        meta: discuss.meta as unknown as object,
        count: toStringId(discuss.count),
      }
    }
    return null
  },

  async discussEmojis(_parent, { discussId }, _context, _info) {
    const emojis = (
      await prisma.discussEmoji.findMany({
        where: { discussId },
        include: { count: true },
      })
    ).filter(
      (
        e,
      ): e is DiscussEmoji & {
        count: DiscussEmojiCount
      } => e.count !== null,
    )
    return emojis.map(e => {
      return {
        ...e,
        id: e.id.toString(),
        count: { ...toStringId(e.count) },
      }
    })
  },

  async discussPosts(_parent, { discussId }, _context, _info) {
    const posts = (
      await prisma.discussPost.findMany({
        where: { discussId },
      })
    ).map(e => toStringId(e))
    return posts
  },

  async discussPostEmojis(_parent, { discussPostId }, _context, _info) {
    const emojis = (
      await prisma.discussPostEmoji.findMany({
        where: { discussPostId: parseInt(discussPostId) },
        include: { count: true },
      })
    ).filter(
      (
        e,
      ): e is DiscussPostEmoji & {
        count: DiscussPostEmojiCount
      } => e.count !== null,
    )
    return emojis.map(e => {
      return {
        ...toStringId(e),
        count: { ...toStringId(e.count) },
      }
    })
  },

  async link(_parent, { id, url }, _context, _info) {
    if (id) {
      return await prisma.link.findUnique({ where: { id } })
    }
    if (url) {
      return await prisma.link.findUnique({ where: { url } })
    }
    throw 'Param requires either id or url'
  },

  async me(_parent, _args, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    // const user = await getOrCreateUser(uid, email)
    // await prisma.user.findUnique({ where: { id: userId } })
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    if (user === null) {
      throw 'Unexpected error'
    }
    return user
  },

  async myNoteEmojiLike(_parent, { noteEmojiId }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const like = await prisma.noteEmojiLike.findUnique({
      where: {
        noteEmojiId_userId: { noteEmojiId: parseInt(noteEmojiId), userId },
      },
    })
    return like ? toStringId(like) : null
  },

  async myDiscussEmojiLike(_parent, { discussEmojiId }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const like = await prisma.discussEmojiLike.findUnique({
      where: {
        discussEmojiId_userId: {
          discussEmojiId: parseInt(discussEmojiId),
          userId,
        },
      },
    })
    return like ? toStringId(like) : null
  },

  async myDiscussPostEmojiLike(
    _parent,
    { discussPostEmojiId },
    { req },
    _info,
  ) {
    const { userId } = await isAuthenticated(req)
    const like = await prisma.discussPostEmojiLike.findUnique({
      where: {
        userId_discussPostEmojiId: {
          discussPostEmojiId: parseInt(discussPostEmojiId),
          userId,
        },
      },
    })
    return like ? toStringId(like) : null
  },

  async myRates(_parent, { symId }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const rates = await prisma.rate.findMany({
      where: {
        AND: { symId, userId },
      },
      orderBy: { updatedAt: 'desc' },
    })
    return rates
  },

  async myVotes(_parent, { pollId }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const votes = await prisma.vote.findMany({
      where: {
        AND: { pollId, userId },
      },
    })
    return votes.map(e => ({ ...toStringId(e) }))
  },

  async noteEmojis(_parent, { noteId }, _context, _info) {
    const emojis = (
      await prisma.noteEmoji.findMany({
        where: { noteId },
        include: { count: true },
      })
    ).filter(
      (
        e,
      ): e is NoteEmoji & {
        count: NoteEmojiCount
      } => e.count !== null,
    )
    return emojis.map(e => {
      return {
        ...e,
        id: e.id.toString(),
        count: { ...toStringId(e.count) },
      }
    })
  },

  // async myNote(_parent, { noteStatus }, { req }, _info) {
  //   const { userId } = await isAuthenticated(req)
  //   const notes = await prisma.note.findMany({
  //     where: {
  //       AND: {
  //         id: userId,
  //         noteStatus: { equals: noteStatus,}
  //       }
  //     }
  //   })
  //   if (userId === null) {
  //     throw 'Unexpected error'
  //   }
  //   return notes
  // }

  // // access all the drafts of the login user
  // async myDraft(_parent, _args, { req }, _info) {
  //   const { userId } = await isAuthenticated(req)
  //   const drafts = await prisma.noteDraft.findMany({
  //     where: {
  //       AND: {
  //         id: userId,
  //         status: 'EDIT',
  //       }
  //     },

  //   })
  //   if (userId === null) {
  //     throw 'Unexpected error'
  //   }
  //   return drafts
  // }

  // async getOrCreateDraft(_parent, {branch, sym, }, _context, _info) {

  // }

  // async noteMeta(_parent, { symbol }, _context, _info) {
  //   const note = await prisma.note.findUnique({
  //     where: { symbol },
  //     include: { link: true },
  //   })
  //   if (note === null) {
  //     throw `Note ${symbol} not found`
  //   }
  //   return note.meta as unknown as NoteMeta
  //   // const meta: NoteMeta = note.meta ? note.meta : {}
  //   // return meta
  // },

  async poll(_parent, { id }, _context, _info) {
    const poll = await prisma.poll.findUnique({
      include: { count: true },
      where: { id },
    })
    if (poll && hasCount(poll)) {
      return {
        ...poll,
        meta: poll.meta as unknown as PollMeta,
        count: { ...toStringId(poll.count) },
      }
    }
    return null
  },

  async rate(_parent, { id }, _context, _info) {
    return await prisma.rate.findUnique({
      where: { id },
    })
  },

  async ratesBySource(_parent, { linkId }, _context, _info) {
    const rate = await prisma.rate.findMany({
      where: { linkId },
      orderBy: { updatedAt: 'desc' },
      // cursor: afterId ? { id: afterId } : undefined,
      // take: 10,
      // skip: afterId ? 1 : 0,
    })
    return rate
  },

  async ratesByAuthor(_parent, { authorId, symId }, _context, _info) {
    const rates = await prisma.rate.findMany({
      where: { AND: { authorId, symId } },
      orderBy: { updatedAt: 'desc' },
    })
    return rates
  },

  async searchAuthor(_parent, { term }, _context, _info) {
    const hits = await SearchAuthorService.search(term)
    return hits.map(e => ({ id: e.id, str: e.name }))
  },

  async searchDiscuss(_parent, { term }, _context, _info) {
    const hits = await SearchDiscussService.search(term)
    return hits.map(e => ({ id: e.id, str: e.title }))
  },

  async searchSymbol(_parent, { term, type }, _context, _info) {
    const hits = await SearchSymService.search(term, type ?? undefined)
    return hits.map(e => ({ id: e.id, str: e.symbol }))
  },

  // -------------New------------------

  // # get all notes for homepage
  // noteDocsJustMerged: [NoteDoc!]!
  // process to comply with NoteDoc of type-defs version
  async noteDocsJustMerged(_parent, _args, _context, _info) {
    const docs = await prisma.noteDoc.findMany({
      where: { status: 'MERGE' },
      orderBy: { updatedAt: 'desc' },
    })
    return docs.map(e => {
      return {
        ...e,
        meta: e.meta as unknown as NoteDocMeta,
        content: e.content as unknown as NoteDocContent,
      }
    })
  },

  async note(_parent, { id }, _context, _info) {
    const note = await prisma.note.findUnique({
      where: { id },
      include: { sym: true, link: true },
    })
    const doc =
      note &&
      (await prisma.noteDoc.findFirst({
        where: {
          branchId: note.branchId,
          symId: note.symId,
          status: 'MERGE',
        },
        orderBy: { updatedAt: 'desc' },
      }))
    if (doc) {
      return {
        ...note,
        meta: doc.meta as unknown as NoteDocMeta,
        doc: {
          ...doc,
          meta: doc.meta as unknown as NoteDocMeta,
          content: doc.content as unknown as NoteDocContent,
        },
      }
    }
    throw new Error('Note not found.')
  },

  async noteDoc(_parent, { id }, _context, _info) {
    const noteDoc = await prisma.noteDoc.findUnique({ where: { id } })
    if (noteDoc) {
      return {
        ...noteDoc,
        meta: noteDoc.meta as unknown as NoteDocMeta,
        content: noteDoc.content as unknown as NoteDocContent,
      }
    }
    throw new Error('NoteDoc not found.')
  },

  // noteDraft(id: ID!): NoteDraft
  // process to comply with NoteDraft of type-defs version
  async noteDraft(_parent, { id, symbol, url }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    let draft: NoteDraft | null = null

    if (id) {
      draft = await prisma.noteDraft.findUnique({
        where: { id },
      })
    }
    if (symbol) {
      // TODO: use findMany and check there is only one element in the array
      draft = await prisma.noteDraft.findFirst({
        where: { userId, symbol, status: 'EDIT' },
      })
    }
    if (url) {
      // TODO: use findMany and check there is only one element in the array
      draft = await prisma.noteDraft.findFirst({
        where: { userId, symbol: url, status: 'EDIT' },
      })
    }

    if (draft) {
      return {
        ...draft,
        meta: draft.meta as unknown as NoteDocMeta,
        content: draft.content as unknown as NoteDocContent,
      }
    }
    return null
  },

  // noteHistory(noteId: ID!, status: String): [NoteDocEntry!]!
  async noteHistory(_parent, { noteId, status }, _context, _info) {
    const entries = await prisma.note.findUnique({
      where: { id: noteId },
      select: {
        docs: {
          where: { status: status ? status : undefined },
          select: { id: true },
        },
      },
    })
    if (entries) {
      return entries.docs
    }
    return []
  },

  // # to know all latest commit docs
  // how latest?? take 10
  // process to form Commit of type-defs version (DictEntryArray)
  // myCommits: [Commit!]!
  async myCommits(_parent, _args, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const commits = await prisma.commit.findMany({
      where: { userId: userId },
      include: { drafts: true, docs: true },
      take: 10,
      orderBy: { createdAt: 'desc' },
    })
    return commits.map(e => {
      return {
        ...e,
        drafts: e.drafts.map(d => ({
          ...d,
          meta: d.meta as unknown as NoteDocMeta,
          content: d.content as unknown as NoteDocContent,
        })),
        docs: e.docs.map(d => ({
          ...d,
          meta: d.meta as unknown as NoteDocMeta,
          content: d.content as unknown as NoteDocContent,
        })),
      }
    })
  },

  // searchNote(symbol: String, title: String): [Note!]!
  async searchNote(_parent, { symbol, title }, _context, _info) {
    // TODO
    // if (symbol && title === undefined) {
    //   return await SearchNoteService.searchBySymbol(symbol)
    // }
    // if (symbol === undefined && title) {
    //   return await SearchNoteService.searchByTitle(title)
    // }
    return []
  },

  // searchByDomain(domain: String): Note
  // use the data from prisma to form a simpler structure for Type Note specified in type-defs
  // missing return: domain, doc, meta, sym
  // need to use note-model.ts to deal with it
  async searchByDomain(_parent, { domain }, _context, _info) {
    // TODO
    // const noteDocs = prisma.noteDoc.findMany({
    //   where: { domain },
    //   orderBy: { updatedAt: 'desc' },
    // })
    // return noteDocs
    return []
  },

  // searchByAuthor(name: String): [Note!]!
  async searchByAuthor(_parent, { name }, _context, _info) {
    //  TODO
    const notes = await prisma.author.findUnique({
      where: { name },
      select: {
        links: {
          select: { notes: true },
        },
      },
    })
    if (notes) {
      // process notes data to align with definition of Note in type-defs
      // return notes
      return []
    } else {
      return []
    }
  },

  // # get user's all drafts for draft-sidebar
  // # provide id and some necessary info for sidebar to display, avoid offering unnecessary info in one go
  // myNoteDraftEntries: [NoteDraftEntry!]!
  // can use select filter to only get id field
  async myNoteDraftEntries(_parent, _args, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const drafts = await prisma.noteDraft.findMany({
      where: {
        AND: {
          userId: userId,
          status: 'EDIT',
        },
      },
      select: { id: true },
    })
    return drafts
  },

  // # get all candidate docs for verdict
  // filter: status = CANDIDATE
  // time??
  // id input is optional in order to query some specific note
  // noteDocsToMerge(noteId:ID): [NoteDoc!]!
  async noteDocsToMerge(_parent, _args, _context, _info) {
    const candidates = await prisma.noteDoc.findMany({
      where: { status: 'CANDIDATE' },
    })
    return candidates.map(e => {
      return {
        ...e,
        meta: e.meta as unknown as NoteDocMeta,
        content: e.content as unknown as NoteDocContent,
      }
    })
  },

  // ------------New End---------------

  // tagHints: (parent, { term }, { prisma }) => {
  //   return null
  // },

  // tickerHints: (parent, { term }, { prisma }) => {
  //   return null
  // },

  // eventHints: (parent, { term }, { prisma }) => {
  //   return null
  // },

  // async board(_parent, { id }, _context, _info) {
  // throw 'Consider to remove'
  // const board = await prisma.board.findUnique({
  //   include: {
  //     count: true,
  //     poll: { include: { count: true } },
  //   },
  //   where: { id: parseInt(id) },
  // })
  // if (board && board.count && board.poll && board.poll.count) {
  //   return {
  //     ..._toStringId(board),
  //     count: _toStringId(board.count),
  //     poll: board.poll && {
  //       ..._toStringId(board.poll),
  //       count: _toStringId(board.poll.count),
  //     },
  //   }
  // } else if (board && board.count && board.poll === null) {
  //   return {
  //     ..._toStringId(board),
  //     count: _toStringId(board.count),
  //     poll: undefined,
  //   }
  // }
  // throw new Error()
  // },

  // async comments(_parent, { boardId, afterId }, _context, _info) {
  // throw 'Consider to remove'
  // const comments = await prisma.comment.findMany({
  //   include: { count: true, vote: true },
  //   where: { boardId: parseInt(boardId) },
  //   orderBy: { createdAt: 'desc' },
  //   cursor: afterId ? { id: parseInt(afterId) } : undefined,
  //   take: 100,
  // })
  // return comments.map(e => {
  //   if (e.count) {
  //     return {
  //       ..._toStringId(e),
  //       oauthorName: e.oauthorName ?? undefined,
  //       count: _toStringId(e.count),
  //       vote: e.vote && _toStringId(e.vote),
  //     }
  //   }
  //   throw new Error()
  // })
  // },

  // botPolls: async (parent, { symbolName }, { prisma }) => {
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

  // async myVotes(_parent, { after }, { req, res }, _info) {
  //   const { userId } = isAuthenticated(req, res)
  //   const votes = await prisma.vote.findMany({ where: { userId }, take: 50 })
  //   return votes.map(e => ({ ..._toStringId(e) }))
  // },

  // async myCommentLikes(_parent, { after }, { req, res }, _info) {
  //   // return prisma.replyLike.findMany({ where: { userId: req.userId }, take: 50 })
  //   const { userId } = isAuthenticated(req, res)
  //   const likes = await prisma.commentLike.findMany({ where: { userId }, take: 50 })
  //   return likes.map(e => ({ ..._toStringId(e) }))
  // },

  // async myBoardLikes(_parent, { after }, { req, res }, _info) {
  //   const { userId } = isAuthenticated(req, res)
  //   const likes = await prisma.boardLike.findMany({ where: { userId }, take: 50 })
  //   return likes.map(e => ({ ..._toStringId(e) }))
  // },

  // async myBulletLikes(_parent, { after }, { req, res }, _info) {
  //   const { userId } = isAuthenticated(req, res)
  //   const likes = await prisma.bulletLike.findMany({ where: { userId }, take: 50 })
  //   return likes.map(e => ({ ..._toStringId(e) }))
  // },

  // myFollows: (parent, { after }, { prisma, req }) => {
  //   return prisma.follow.findMany({ where: { userId: req.userId, followed: true } })
  // },
}

const Mutation: Required<MutationResolvers<ResolverContext>> = {
  async createAuthor(_parent, { data }, { req }, _info) {
    await isAuthenticated(req)
    const author = await AuthorModel.create(data)
    await SearchAuthorService.add(author)
    return AuthorModel.toGQLAuthor(author)
  },

  async updateAuthor(_parent, { id, data }, { req }, _info) {
    await isAuthenticated(req)
    const author = await AuthorModel.update(id, data)
    await SearchAuthorService.add(author)
    return AuthorModel.toGQLAuthor(author)
  },

  // async createCommit(_parent, { data }, { req }, _info) {
  //   const { userId } = await isAuthenticated(req)
  //   const { commit, stateGidToCid, symsCommitted } = await CommitModel.create(
  //     data,
  //     userId,
  //   )

  //   // add newly created symbols to search (if any)
  //   for (const e of symsCommitted) {
  //     SearchSymService.add(e)
  //   }
  //   return {
  //     ...commit,
  //     stateIdToCidDictEntryArray: Object.entries(stateGidToCid).map<{
  //       k: string
  //       v: string
  //     }>(([k, v]) => ({ k, v })),
  //   }
  // },

  async createDiscuss(_parent, { noteId, data }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const { title, content } = data
    const discuss = await prisma.discuss.create({
      data: {
        user: { connect: { id: userId } },
        notes: noteId ? { connect: [{ id: noteId }] } : undefined,
        meta: {},
        title,
        content,
        // choices: data.choices,
        count: { create: {} },
      },
      include: { count: true },
    })
    // SearchDiscussService.
    if (hasCount(discuss)) {
      return {
        ...discuss,
        meta: {},
        count: toStringId(discuss.count),
      }
    }
    throw 'Internal error'
  },

  async updateDiscuss(_parent, { id, data }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const discuss = await prisma.discuss.findUnique({
      where: { id },
    })
    if (discuss?.userId === userId) {
      const { title, content } = data
      const discuss = await prisma.discuss.update({
        where: { id },
        data: {
          title,
          content,
        },
        include: { count: true },
      })
      if (hasCount(discuss)) {
        return {
          ...discuss,
          meta: {},
          count: toStringId(discuss.count),
        }
      }
      throw 'Internal error'
    }
    throw 'Not authorized, only author is allowed to update discuss'
  },

  async upsertDiscussEmojiLike(
    _parent,
    { liked, emojiId, discussId, emojiCode },
    { req },
    _info,
  ) {
    const { userId } = await isAuthenticated(req)
    let results
    if (emojiId) {
      results = await discussEmojiModel.upsertLike({ userId, liked, emojiId })
    } else if (discussId && emojiCode) {
      results = await discussEmojiModel.upsertLike({
        userId,
        liked,
        subj: { subjId: discussId, code: emojiCode },
      })
    } else {
      throw new Error('Input error')
    }
    return results.map(({ emoji, count, like }) => ({
      emoji: {
        ...emoji,
        id: emoji.id.toString(),
        count: toStringId(count),
      },
      like: toStringId(like),
    }))
  },

  async createDiscussPost(_parent, { discussId, data }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const { content } = data
    const post = await prisma.discussPost.create({
      data: {
        user: { connect: { id: userId } },
        discuss: { connect: { id: discussId } },
        content,
      },
    })
    return toStringId(post)
  },

  async updateDiscussPost(_parent, { id, data }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const post = await prisma.discussPost.findUnique({
      where: { id: parseInt(id) },
    })
    if (post?.userId === userId) {
      const { content } = data
      const post = await prisma.discussPost.update({
        where: { id: parseInt(id) },
        data: { content },
      })
      return toStringId(post)
    }
    throw 'Not authorized, only author is allowed to update discuss'
  },

  async upsertDiscussPostEmojiLike(
    _parent,
    { liked, emojiId, discussPostId, emojiCode },
    { req },
    _info,
  ) {
    const { userId } = await isAuthenticated(req)
    let results
    if (emojiId) {
      results = await discussPostEmojiModel.upsertLike({
        userId,
        liked,
        emojiId,
      })
    } else if (discussPostId && emojiCode) {
      results = await discussPostEmojiModel.upsertLike({
        userId,
        liked,
        subj: { subjId: discussPostId, code: emojiCode },
      })
    } else {
      throw new Error('Input error')
    }
    return results.map(({ emoji, count, like }) => ({
      emoji: {
        ...emoji,
        id: emoji.id.toString(),
        count: toStringId(count),
      },
      like: toStringId(like),
    }))
  },

  async upsertNoteEmojiLike(
    _parent,
    { liked, emojiId, noteId, emojiCode },
    { req },
    _info,
  ) {
    const { userId } = await isAuthenticated(req)
    let results
    if (emojiId) {
      results = await noteEmojiModel.upsertLike({
        userId,
        liked,
        emojiId,
      })
    } else if (noteId && emojiCode) {
      results = await noteEmojiModel.upsertLike({
        userId,
        liked,
        subj: { subjId: noteId, code: emojiCode },
      })
    } else {
      throw new Error('Input error')
    }
    return results.map(({ emoji, count, like }) => ({
      emoji: {
        ...emoji,
        id: emoji.id.toString(),
        count: toStringId(count),
      },
      like: toStringId(like),
    }))
  },

  async createPoll(_parent, { data }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const poll = await prisma.poll.create({
      data: {
        user: { connect: { id: userId } },
        choices: data.choices,
        count: { create: {} },
      },
      include: { count: true },
    })
    if (hasCount(poll)) {
      return {
        ...poll,
        count: toStringId(poll.count),
      }
    }
    throw 'Database internal error'
  },

  async createRate(_parent, { data }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const { choice, targetId, authorId, linkId } = data

    const note = await prisma.note.findUnique({
      where: { id: targetId },
      include: { sym: true },
    })
    if (note === null) {
      throw 'Target note not found'
    }
    return await RateModel.create({
      choice,
      symbol: note.sym.symbol,
      userId,
      authorId,
      linkId,
    })
  },

  async updateRate(_parent, { id, data }, { req }, _info) {
    throw 'Not implemented yet.'
  },

  async createVote(_parent, { pollId, data }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const vote = await createVote({
      choiceIdx: data.choiceIdx,
      pollId,
      userId,
    })
    return toStringId(vote)
  },

  async sessionLogin(_parent, { idToken, csrfToken }, { req, res }, _info) {
    const claims = await sessionLogin(req, res, idToken, csrfToken)
    if (claims.email) {
      const user = await getOrCreateUser(claims.uid, claims.email)
      return user
    }
    throw new AuthenticationError('Require email')
  },

  async sessionLogout(_parent, _args, { req, res }, _info) {
    await sessionLogout(req, res)
    return true
  },

  // -------------New---------------
  // createDraft(id: ID, symbol: String, draftInput: DraftInput): NoteDraft!
  // a new draft will be initiated locally at first
  // after saving the draft, this function will be called to physically create it remotely
  // input NoteDraftInput {
  //
  //   fromDocId: String
  //   domain
  //   meta: NoteDocMetaInput!
  //   content: NoteDocContentInput!
  // }

  // # similar to NoteDocMeta
  // input NoteDocMetaInput {
  //   duplicatedSymbols: [String] # to store Sym.symbols refering to the same note (e.g $BA, [[Boeing]] both to Boeing)
  //   keywords: [String] # note keywords
  //   redirectFroms: [String] # used when duplicate symbol exists
  //   redirectTo: String
  // }

  // input NoteDocContentInput {
  //   diff: JSON
  //   symbolIdMap: JSON
  //   blocks: [Block!]!
  // }
  async createNoteDraft(_parent, { symbol, draftInput }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const { fromDocId, domain, meta, content } = draftInput
    // TODO: access branchId from context
    const branchId = ''
    const { type } = SymModel.parse(symbol)
    if (type === SymType.URL) {
      throw new Error('createNoteDraft not allow to create from url')
    }
    const fromDoc = fromDocId
      ? await prisma.noteDoc.findUnique({ where: { id: fromDocId } })
      : null
    if (fromDocId && fromDoc === null) {
      throw new Error('[createNoteDraft] fromDocId && fromDoc === null')
    }
    const draft = await prisma.noteDraft.create({
      data: {
        symbol,
        branch: { connect: { id: branchId } },
        sym: fromDoc ? { connect: { id: fromDoc.symId } } : undefined,
        fromDoc: fromDoc ? { connect: { id: fromDoc.id } } : undefined,
        user: { connect: { id: userId } },
        domain,
        meta,
        content,
      },
    })
    // convert JSON to GQL type
    return {
      ...draft,
      meta: draft.meta as unknown as NoteDocMeta,
      content: draft.content as unknown as NoteDocContent,
    }
  },

  async createNoteDraftByLink(_parent, { linkId, draftInput }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const { fromDocId, domain, meta, content } = draftInput
    // TODO: access branchId from context
    const branchId = ''
    const fromDoc = fromDocId
      ? await prisma.noteDoc.findUnique({ where: { id: fromDocId } })
      : null
    if (fromDocId && fromDoc === null) {
      throw new Error('[createNoteDraft] fromDocId && fromDoc === null')
    }
    // TODO: handle the situation when different urls direct to the same webpage
    const link = await prisma.link.findUnique({ where: { id: linkId } })
    if (link === null) {
      throw new Error('[createNoteDraftByLink] link === null')
    }
    const draft = await prisma.noteDraft.create({
      data: {
        symbol: link.url,
        branch: { connect: { id: branchId } },
        sym: fromDoc ? { connect: { id: fromDoc.symId } } : undefined,
        fromDoc: fromDoc ? { connect: { id: fromDoc.id } } : undefined,
        link: { connect: { id: link.id } },
        user: { connect: { id: userId } },
        domain,
        meta,
        content,
      },
    })
    // convert JSON to GQL type
    return {
      ...draft,
      meta: draft.meta as unknown as NoteDocMeta,
      content: draft.content as unknown as NoteDocContent,
    }
  },

  // type NoteDraft {
  //   id: ID!
  //   noteId: String
  //   userId: String!
  //   commitId: String
  //   fromDocId: String
  //   meta: NoteDocMeta # not sure about this type
  //   content: NoteDocBody!
  //   updatedAt: DateTime!
  //   status: DraftStatus!
  // }

  // # input not yet decided
  // updateNotepDraft(data: DraftInput): NoteDraft!
  async updateNoteDraft(_parent, { id, data }, _context, _info) {
    const { domain, meta, content } = data
    const draft = await prisma.noteDraft.update({
      where: { id },
      data: {
        domain,
        meta,
        content,
      },
    })
    return {
      ...draft,
      meta: draft.meta as unknown as NoteDocMeta,
      content: draft.content as unknown as NoteDocContent,
    }
  },

  // dropNoteDraft(id: ID!): DraftDropResponse!
  async dropNoteDraft(_parent, { id }, _context, _info) {
    try {
      await prisma.noteDraft.update({ where: { id }, data: { status: 'DROP' } })
    } catch (e) {
      // what error message should be thrown
      throw new Error('[dropNoteDraft] Unable to drop the NoteDraft')
      // throw e
    }
    return { response: 'Draft is successfully dropped.' }
  },

  async commitNoteDrafts(_parent, { draftIds }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const { commit } = await commitNoteDrafts(draftIds, userId)
    if (commit) {
      return {
        commitId: commit.id,
        response: 'Success',
      }
    }
    throw new Error('Commit failed')
  },

  // -----------End New--------------

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
}

export default { Query, Mutation }