import { AuthenticationError } from 'apollo-server-micro'
import {
  DiscussEmoji,
  DiscussEmojiCount,
  DiscussPostEmoji,
  DiscussPostEmojiCount,
  NoteDraft,
  NoteEmoji,
  NoteEmojiCount,
} from '@prisma/client'
import {
  QueryResolvers,
  MutationResolvers,
} from 'graphql-let/__generated__/__types__'
import { isAuthenticated, sessionLogin, sessionLogout } from '../lib/auth/auth'
import { hasCount, toStringId } from '../lib/helpers'
import { authorModel } from '../lib/models/author-model'
import { rateModel } from '../lib/models/rate-model'
import { getOrCreateUser } from '../lib/models/user-model'
import prisma from '../lib/prisma'
import {
  authorSearcher,
  discussSearcher,
  symSearcher,
} from '../lib/searcher/searchers'
import { ResolverContext } from './apollo-client-ssr'
import {
  discussEmojiModel,
  discussPostEmojiModel,
  noteEmojiModel,
} from '../lib/models/emoji-model'
import { commitNoteDrafts } from '../lib/models/commit-model'
import { noteDraftModel } from '../lib/models/note-draft-model'
import { noteModel } from '../lib/models/note-model'
import { pollModel } from '../lib/models/poll-model'
import { noteDocModel } from '../lib/models/note-doc-model'
import { pollVoteModel } from '../lib/models/poll-vote-model'

const Query: Required<QueryResolvers<ResolverContext>> = {
  async author(_parent, { id, name }, _context, _info) {
    return await authorModel.get(id ?? undefined, name ?? undefined)
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

  async myPollVotes(_parent, { pollId }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const votes = await prisma.pollVote.findMany({
      where: {
        AND: { pollId, userId },
      },
    })
    return votes.map(e => ({ ...toStringId(e) }))
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

  async poll(_parent, { id }, _context, _info) {
    const poll = await pollModel.find(id)
    if (poll) {
      return {
        ...poll,
        count: { ...toStringId(poll.count) },
      }
    }
    throw new Error('Poll not found')
  },

  async rate(_parent, { id }, _context, _info) {
    return await prisma.rate.findUnique({
      where: { id },
    })
  },

  async ratesByAuthor(_parent, { authorId, symId }, _context, _info) {
    const rates = await prisma.rate.findMany({
      where: { AND: { authorId, symId } },
      orderBy: { updatedAt: 'desc' },
    })
    return rates
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

  async searchAuthor(_parent, { term }, _context, _info) {
    const hits = await authorSearcher.search(term)
    return hits.map(e => ({ id: e.id, str: e.name }))
  },

  async searchDiscuss(_parent, { term }, _context, _info) {
    const hits = await discussSearcher.search(term)
    return hits.map(e => ({ id: e.id, str: e.title }))
  },

  async searchSymbol(_parent, { term, type }, _context, _info) {
    const hits = await symSearcher.search(term, type ?? undefined)
    return hits.map(e => ({ id: e.id, str: e.symbol }))
  },

  // -------------New------------------

  // # to know all latest commit docs
  // how latest?? take 10
  // process to form Commit of type-defs version (DictEntryArray)
  // myCommits: [Commit!]!
  async myCommits(_parent, _args, { req }, _info) {
    const { userId } = await isAuthenticated(req),
      commits = await prisma.commit.findMany({
        where: { userId: userId },
        include: { noteDrafts: true, noteDocs: true },
        take: 10,
        orderBy: { createdAt: 'desc' },
      })
    return commits.map(e => {
      return {
        ...e,
        noteDocs: e.noteDocs.map(d => noteDocModel.parse(d)),
      }
    })
  },

  // # get user's all drafts for draft-sidebar
  // # provide id and some necessary info for sidebar to display, avoid offering unnecessary info in one go
  // myNoteDraftEntries: [NoteDraftEntry!]!
  // can use select filter to only get id field
  async myNoteDraftEntries(_parent, _args, { req }, _info) {
    const { userId } = await isAuthenticated(req),
      drafts = await prisma.noteDraft.findMany({
        where: {
          AND: {
            userId: userId,
            status: 'EDIT',
          },
        },
        // select: { id: true },
      }),
      parsed = drafts.map(e => noteDraftModel.parse(e)),
      entries = parsed.map(e => {
        const {
          id,
          symbol,
          contentHead: { title },
        } = e
        return { id, symbol, title }
      })
    return entries
  },

  async noteById(_parent, { id }, _context, _info) {
    return noteModel.getById(id)
  },

  async noteByBranchSymbol(_parent, { branch, symbol }, _context, _info) {
    return noteModel.getByBranchSymbol(branch, symbol)
  },

  async noteDoc(_parent, { id }, _context, _info) {
    const doc = await prisma.noteDoc.findUnique({ where: { id } })
    if (doc) {
      return noteDocModel.parse(doc)
    }
    throw new Error('NoteDoc not found.')
  },

  async noteDocsToMerge(_parent, { noteId }, _context, _info) {
    const docs = await prisma.noteDoc.findMany({
      where: {
        AND: [{ note: { id: noteId } }, { status: 'CANDIDATE' }],
      },
      orderBy: { createdAt: 'asc' },
    })
    return docs.map(e => noteDocModel.parse(e))
  },

  async latestNoteDocsMerged(_parent, _args, _context, _info) {
    const docs = await prisma.noteDoc.findMany({
      where: { status: 'MERGED' },
      orderBy: { createdAt: 'desc' },
    })
    return docs.map(e => noteDocModel.parse(e))
  },

  async latestNoteDocsToMerge(_parent, _args, _context, _info) {
    const docs = await prisma.noteDoc.findMany({
      where: { status: 'CANDIDATE' },
      orderBy: { createdAt: 'desc' },
    })
    return docs.map(e => noteDocModel.parse(e))
  },

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
      return noteDraftModel.parse(draft)
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

  // searchNote(symbol: String, title: String): [Note!]!
  // async searchNote(_parent, { symbol, title, domain }, _context, _info) {
  //   // TODO
  //   // if (symbol && title === undefined) {
  //   //   return await SearchNoteService.searchBySymbol(symbol)
  //   // }
  //   // if (symbol === undefined && title) {
  //   //   return await SearchNoteService.searchByTitle(title)
  //   // }
  //   return []
  // },

  // ------------New End---------------
}

const Mutation: Required<MutationResolvers<ResolverContext>> = {
  async createAuthor(_parent, { data }, { req }, _info) {
    await isAuthenticated(req)
    const author = await authorModel.create(data)
    await authorSearcher.add(author)
    return authorModel.toGQLAuthor(author)
  },

  async updateAuthor(_parent, { id, data }, { req }, _info) {
    await isAuthenticated(req)
    const author = await authorModel.update(id, data)

    // TODO: Remove previous author
    await authorSearcher.add(author)

    return authorModel.toGQLAuthor(author)
  },

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
    const { userId } = await isAuthenticated(req),
      poll = await pollModel.create({ userId, choices: data.choices })
    return {
      ...poll,
      count: toStringId(poll.count),
    }
  },

  async createPollVote(_parent, { pollId, data }, { req }, _info) {
    const { userId } = await isAuthenticated(req),
      vote = await pollVoteModel.create({
        choiceIdx: data.choiceIdx,
        pollId,
        userId,
      })
    return toStringId(vote)
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
    return await rateModel.create({
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

  async sessionLogin(_parent, { idToken }, { req, res }, _info) {
    const claims = await sessionLogin(req, res, idToken)
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

  async createCommit(_parent, { noteDraftIds }, { req }, _info) {
    const { userId } = await isAuthenticated(req),
      { commit, noteDocs } = await commitNoteDrafts(noteDraftIds, userId)
    return {
      ...commit,
      noteDocs: noteDocs.map(e => ({
        ...noteDocModel.parse(e),
        branch: e.branch.name,
      })),
    }
  },

  async createNoteDraft(
    _parent,
    { branch, symbol, draftInput },
    { req },
    _info,
  ) {
    const { userId } = await isAuthenticated(req)
    return await noteDraftModel.create(branch, symbol, userId, draftInput)
  },

  async createNoteDraftByLink(
    _parent,
    { branch, linkId, draftInput },
    { req },
    _info,
  ) {
    const { userId } = await isAuthenticated(req)
    return await noteDraftModel.createByLink(branch, linkId, userId, draftInput)
  },

  // # input not yet decided
  // updateNotepDraft(data: DraftInput): NoteDraft!
  async updateNoteDraft(_parent, { id, data }, _context, _info) {
    return noteDraftModel.update(id, data)
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

  // -----------End New--------------
}

export default { Query, Mutation }
