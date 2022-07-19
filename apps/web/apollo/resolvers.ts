import type {
  Branch,
  Discuss,
  DiscussCount,
  DiscussEmoji,
  DiscussEmojiCount,
  DiscussPostEmoji,
  DiscussPostEmojiCount,
  Link,
  Note,
  NoteDoc,
  NoteDraft,
  NoteEmoji,
  NoteEmojiCount,
  Sym,
} from '@prisma/client'
import { ApolloError, AuthenticationError } from 'apollo-server-micro'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  Discuss as GQLDiscuss,
  QueryResolvers,
  MutationResolvers,
  NoteEntry as GQLNoteEntry,
} from 'graphql-let/__generated__/__types__'
import { isAuthenticated, sessionLogin, sessionLogout } from '../lib/auth/auth'
import { hasCount, toStringProps } from '../lib/helpers'
import { authorModel } from '../lib/models/author.model'
import { rateModel } from '../lib/models/rate.model'
import { getOrCreateUser } from '../lib/models/user.model'
import prisma from '../lib/prisma'
import {
  authorSearcher,
  discussSearcher,
  symSearcher,
} from '../lib/searcher/searchers'
import {
  discussEmojiModel,
  discussPostEmojiModel,
  noteEmojiModel,
} from '../lib/models/emoji.model'
import { CommitInputError, commitNoteDrafts } from '../lib/models/commit.model'
import { noteDraftModel } from '../lib/models/note-draft.model'
import { noteModel } from '../lib/models/note.model'
import { pollModel } from '../lib/models/poll.model'
import { noteDocModel } from '../lib/models/note-doc.model'
import { pollVoteModel } from '../lib/models/poll-vote.model'
import { isNil } from 'lodash'
import { linkModel } from '../lib/models/link.model'
import { LinkParsed } from '../lib/interfaces'

export type ResolverContext = {
  req: NextApiRequest
  res: NextApiResponse
}

//
// Helpers
//
//
//
//
//
//

function toGQLNoteDoc(d: NoteDoc & { branch: Branch; sym: Sym }) {
  return toStringProps(noteDocModel.attachBranchSymbol(noteDocModel.parse(d)))
}

function toGQLNoteEntry(
  d: Note & {
    branch: Branch
    sym: Sym
    link: Link | null
  },
): GQLNoteEntry {
  const { id, branch, sym, link } = d
  return {
    id: id,
    branchName: branch.name,
    sym: sym,
    link: link && linkModel.parse(link),
  }
}

function toGQLDiscuss(
  d: Discuss & {
    count: DiscussCount | null
    notes: (Note & {
      branch: Branch
      sym: Sym
      link: Link | null
    })[]
  },
): GQLDiscuss {
  if (d.count) {
    const { notes, meta, count, ...rest } = d
    return toStringProps({
      ...rest,
      noteEntries: notes.map(e => toGQLNoteEntry(e)),
      // TODO:
      meta: meta as unknown as object,
      count: toStringProps(count),
    })
  }
  throw new Error('Discuss.count not found')
}

//
// Resolvers
//
//
//
//
//
//

const Query: Required<QueryResolvers<ResolverContext>> = {
  async author(_parent, { id, name }, _context, _info) {
    return await authorModel.get(id ?? undefined, name ?? undefined)
  },

  async commit(_parent, { id }, _context, _info) {
    const commit = await prisma.commit.findUnique({
      where: { id },
      include: { noteDocs: { include: { branch: true, sym: true } } },
    })

    if (commit) {
      return {
        ...toStringProps(commit),
        noteDocs: commit.noteDocs.map(e => toGQLNoteDoc(e)),
      }
    }
    throw new Error('Commit not found')
  },

  async commitsByUser(_parent, { userId, afterId }, _context, _info) {
    const commits = await prisma.commit.findMany({
      where: { userId },
      include: { noteDocs: { include: { branch: true, sym: true } } },
      orderBy: { createdAt: 'desc' },
      cursor: afterId ? { id: afterId } : undefined,
      take: 10,
      skip: afterId ? 1 : 0,
    })
    return commits.map(commit => {
      const { noteDocs, ...rest } = toStringProps(commit),
        noteDocs_ = noteDocs.map(e => toGQLNoteDoc(e))
      return { ...rest, noteDocs: noteDocs_ }
    })
  },

  async discuss(_parent, { id }, _context, _info) {
    const discuss = await prisma.discuss.findUnique({
      where: { id },
      include: {
        count: true,
        notes: { include: { sym: true, branch: true, link: true } },
      },
    })
    if (discuss) {
      return toGQLDiscuss(discuss)
    }
    throw new Error('Discuss not found')
  },

  async discussesByUser(_parent, { userId, afterId }, _context, _info) {
    const discusses = await prisma.discuss.findMany({
        where: { userId },
        include: {
          count: true,
          notes: { include: { sym: true, branch: true, link: true } },
        },
        orderBy: { updatedAt: 'desc' },
        cursor: afterId ? { id: afterId } : undefined,
        take: 10,
        skip: afterId ? 1 : 0,
      }),
      discusses_ = discusses.map(discuss => {
        if (discuss) {
          return toGQLDiscuss(discuss)
        }
        throw new Error('Discuss not found')
      })
    return discusses_
  },

  async discussesLatest(_parent, { afterId }, _context, _info) {
    const discusses = await prisma.discuss.findMany({
        where: { status: 'ACTIVE' },
        include: {
          count: true,
          notes: { include: { sym: true, branch: true, link: true } },
        },
        orderBy: { updatedAt: 'desc' },
        cursor: afterId ? { id: afterId } : undefined,
        take: 10,
        skip: afterId ? 1 : 0,
      }),
      discusses_ = discusses.map(discuss => {
        if (discuss) {
          return toGQLDiscuss(discuss)
        }
        throw new Error('Discuss not found')
      })
    return discusses_
  },

  async discussEmojis(_parent, { discussId }, _context, _info) {
    const emojis = (
      await prisma.discussEmoji.findMany({
        where: { discussId },
        include: { count: true },
      })
    )
      .filter(
        (
          e,
        ): e is DiscussEmoji & {
          count: DiscussEmojiCount
        } => e.count !== null,
      )
      .map(e => {
        return {
          ...toStringProps(e),
          count: { ...toStringProps(e.count) },
        }
      })
    return emojis
  },

  async discussPosts(_parent, { discussId }, _context, _info) {
    const posts = (
      await prisma.discussPost.findMany({
        where: { discussId },
      })
    ).map(e => toStringProps(e))
    return posts
  },

  async discussPostEmojis(_parent, { discussPostId }, _context, _info) {
    const emojis = (
      await prisma.discussPostEmoji.findMany({
        where: { discussPostId: parseInt(discussPostId) },
        include: { count: true },
      })
    )
      .filter(
        (
          e,
        ): e is DiscussPostEmoji & {
          count: DiscussPostEmojiCount
        } => e.count !== null,
      )
      .map(e => {
        return {
          ...toStringProps(e),
          count: { ...toStringProps(e.count) },
        }
      })
    return emojis
  },

  async link(_parent, { id, url }, _context, _info) {
    if (id) {
      const link = await prisma.link.findUnique({
          where: { id },
          include: { sym: true },
        }),
        link_ = link && linkModel.parse(link)
      return link_
    }
    if (url) {
      const link = await prisma.link.findUnique({
          where: { url },
          include: { sym: true },
        }),
        link_ = link && linkModel.parse(link)
      return link_
    }
    throw new Error('Param requires either id or url')
  },

  async me(_parent, _args, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    // const user = await getOrCreateUser(uid, email)
    // await prisma.user.findUnique({ where: { id: userId } })
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    if (user === null) {
      throw new Error('Unexpected error')
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
    return like ? toStringProps(like) : null
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
    return like ? toStringProps(like) : null
    // return null
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
    return like ? toStringProps(like) : null
  },

  async myPollVotes(_parent, { pollId }, { req }, _info) {
    const { userId } = await isAuthenticated(req),
      votes = (
        await prisma.pollVote.findMany({
          where: {
            AND: { pollId, userId },
          },
        })
      ).map(e => toStringProps(e))
    return votes
  },

  async myRates(_parent, { symId }, { req }, _info) {
    const { userId } = await isAuthenticated(req),
      rates = (
        await prisma.rate.findMany({
          where: {
            AND: { symId, userId },
          },
          orderBy: { updatedAt: 'desc' },
        })
      ).map(e => toStringProps(e))
    return rates
  },

  // # get user's all drafts for draft-sidebar
  // # provide id and some necessary info for sidebar to display, avoid offering unnecessary info in one go
  // can use select filter to only get id field
  async myNoteDraftEntries(_parent, _args, { req }, _info) {
    const { userId } = await isAuthenticated(req),
      drafts = await prisma.noteDraft.findMany({
        // where: {
        //   OR: [{ status: 'EDIT' }, { status: 'DROP' }],
        //   AND: { userId: userId },
        // },
        where: { userId: userId, status: 'EDIT' },
        orderBy: { createdAt: 'asc' },
      }),
      parsed = drafts.map(e => noteDraftModel.parse(e)),
      entries = parsed.map(
        ({ id, meta, status, symbol, contentHead: { title } }) => ({
          id,
          status,
          symbol,
          title,
          meta,
        }),
      )
    return entries
  },

  async noteById(_parent, { id }, _context, _info) {
    const [note, headDoc] = await noteModel.getById(id),
      note_ = {
        ...note,
        branchName: note.branch.name,
        headDoc: toGQLNoteDoc(headDoc),
        link: note.link && linkModel.parse(note.link),
      }
    return toStringProps(note_)
  },

  async noteByBranchSymbol(_parent, { branch, symbol }, _context, _info) {
    const branch_ = branch === 'default' ? 'mock-branch-0' : branch,
      found = await noteModel.getByBranchSymbol(branch_, symbol)

    if (found) {
      const [note, headDoc] = found,
        note_ = {
          ...note,
          branchName: note.branch.name,
          headDoc: toGQLNoteDoc(headDoc),
          link: note.link && linkModel.parse(note.link),
        }
      return toStringProps(note_)
    }
    return null
  },

  async noteDoc(_parent, { id }, _context, _info) {
    const doc = await prisma.noteDoc.findUnique({
      where: { id },
      include: { branch: true, sym: true },
    })
    if (doc) {
      return toGQLNoteDoc(doc)
    }
    throw new Error('NoteDoc not found.' + id)
  },

  async noteDocsByUser(_parent, { userId, afterId }, _context, _info) {
    const docs = (
      await prisma.noteDoc.findMany({
        where: { userId },
        include: { branch: true, sym: true },
        orderBy: { createdAt: 'desc' },
        cursor: afterId ? { id: afterId } : undefined,
        take: 10,
        skip: afterId ? 1 : 0,
      })
    ).map(e => toGQLNoteDoc(e))
    return docs
  },

  async noteDocsToMergeByNote(_parent, { noteId }, _context, _info) {
    const docs = (
      await prisma.noteDoc.findMany({
        where: {
          note: { id: noteId },
          status: 'CANDIDATE',
        },
        include: { branch: true, sym: true },
        orderBy: { createdAt: 'asc' },
      })
    ).map(e => toGQLNoteDoc(e))
    return docs
  },

  async noteDocsMergedLatest(_parent, { afterId }, _context, _info) {
    const docs = (
      await prisma.noteDoc.findMany({
        where: { status: 'MERGED' },
        include: { branch: true, sym: true },
        orderBy: { createdAt: 'desc' },
        cursor: afterId ? { id: afterId } : undefined,
        take: 10,
        skip: afterId ? 1 : 0,
      })
    ).map(e => toGQLNoteDoc(e))
    return docs
  },

  async noteDocsToMergeLatest(_parent, { afterId }, _context, _info) {
    const docs = (
      await prisma.noteDoc.findMany({
        where: { status: 'CANDIDATE' },
        include: { branch: true, sym: true },
        orderBy: { createdAt: 'desc' },
        cursor: afterId ? { id: afterId } : undefined,
        take: 10,
        skip: afterId ? 1 : 0,
      })
    ).map(e =>
      toStringProps(noteDocModel.attachBranchSymbol(noteDocModel.parse(e))),
    )
    return docs
  },

  async noteDraft(_parent, { id, symbol, url }, { req }, _info) {
    const { userId } = await isAuthenticated(req)

    let draft: (NoteDraft & { branch: Branch }) | null = null
    if (id) {
      draft = await prisma.noteDraft.findUnique({
        where: { id },
        include: { branch: true },
      })
    }
    if (symbol) {
      // TODO: use findMany and check there is only one element in the array
      draft = await prisma.noteDraft.findFirst({
        where: { userId, symbol, status: 'EDIT' },
        include: { branch: true },
      })
    }
    if (url) {
      // TODO: use findMany and check there is only one element in the array
      draft = await prisma.noteDraft.findFirst({
        where: { userId, symbol: url, status: 'EDIT' },
        include: { branch: true },
      })
    }
    if (draft) {
      if (draft.userId !== userId) throw new Error('Not the owner of draft')
      return noteDraftModel.toGQLNoteDraft(draft)
    }
    return null
  },

  async noteDraftById(_parent, { id }, { req }, _info) {
    const { userId } = await isAuthenticated(req),
      draft = await prisma.noteDraft.findUnique({
        where: { id },
        include: { branch: true },
      })

    if (draft) {
      if (draft.userId !== userId) throw new Error('Not the owner of draft')
      return noteDraftModel.toGQLNoteDraft(draft)
    }
    throw new Error('Note draft not found.')
  },

  async noteEmojis(_parent, { noteId }, _context, _info) {
    const emojis = (
      await prisma.noteEmoji.findMany({
        where: { noteId },
        include: { count: true },
      })
    )
      .filter(
        (
          e,
        ): e is NoteEmoji & {
          count: NoteEmojiCount
        } => e.count !== null,
      )
      .map(e => ({
        ...toStringProps(e),
        count: { ...toStringProps(e.count) },
      }))
    return emojis
  },

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

  async poll(_parent, { id }, _context, _info) {
    const poll = await pollModel.find(id)
    if (poll) {
      return {
        ...toStringProps(poll),
        noteDocToMerge: poll.noteDocToMerge
          ? toGQLNoteDoc(poll.noteDocToMerge)
          : null,
        count: { ...toStringProps(poll.count) },
      }
    }
    throw new Error('Poll not found')
  },

  async rate(_parent, { id }, _context, _info) {
    const rate = await prisma.rate.findUnique({
      where: { id },
    })
    if (rate) {
      return toStringProps(rate)
    }
    throw new Error('Rate not found')
  },

  async ratesByAuthor(_parent, { authorId, symId }, _context, _info) {
    const rates = (
      await prisma.rate.findMany({
        where: { AND: { authorId, symId } },
        orderBy: { updatedAt: 'desc' },
      })
    ).map(e => toStringProps(e))
    return rates
  },

  async ratesBySource(_parent, { linkId }, _context, _info) {
    const rate = (
      await prisma.rate.findMany({
        where: { linkId },
        orderBy: { updatedAt: 'desc' },
        // cursor: afterId ? { id: afterId } : undefined,
        // take: 10,
        // skip: afterId ? 1 : 0,
      })
    ).map(e => toStringProps(e))
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

  async createCommit(_parent, { noteDraftIds }, { req }, _info) {
    const { userId } = await isAuthenticated(req)

    try {
      const { commit, noteDocs, newSyms } = await commitNoteDrafts(
        noteDraftIds,
        userId,
      )
      newSyms.forEach(e => symSearcher.add(e))

      return {
        ...toStringProps(commit),
        noteDocs: noteDocs.map(e =>
          toStringProps(noteDocModel.attachBranchSymbol(noteDocModel.parse(e))),
        ),
      }
    } catch (err) {
      if (err instanceof CommitInputError) {
        throw new ApolloError('Commit input error', 'COMMIT_INPUT_ERROR', {
          items: err.items,
        })
      } else {
        throw err
      }
    }
  },

  async createDiscuss(_parent, { noteDraftId, data }, { req }, _info) {
    const { userId } = await isAuthenticated(req),
      { title, content } = data,
      discuss = await prisma.discuss.create({
        data: {
          user: { connect: { id: userId } },
          // notes: noteId ? { connect: [{ id: noteId }] } : undefined,
          draft: { connect: { id: noteDraftId } },
          meta: {},
          title,
          content,
          count: { create: {} },
        },
        include: {
          count: true,
          notes: { include: { branch: true, sym: true, link: true } },
        },
      })

    // TODO: Add to searchDiscussService

    if (hasCount(discuss)) {
      return toGQLDiscuss(discuss)
    }
    throw new Error('Discuss.count not found')
  },

  async updateDiscuss(_parent, { id, data }, { req }, _info) {
    const { userId } = await isAuthenticated(req),
      { title, content } = data,
      discuss = await prisma.discuss.findUnique({
        where: { id },
      })

    if (discuss === null) throw new Error('Discuss not found')
    if (discuss.userId !== userId)
      throw new Error(
        'Not authorized, only author is allowed to update discuss',
      )

    const discuss_ = await prisma.discuss.update({
      where: { id },
      data: {
        title,
        content,
      },
      include: {
        count: true,
        notes: { include: { branch: true, sym: true, link: true } },
      },
    })

    // TODO: Update to searchDiscussService

    if (hasCount(discuss_)) {
      return toGQLDiscuss(discuss_)
    }
    throw new Error('Discuss.count not found')
  },

  async upsertDiscussEmojiLike(
    _parent,
    { liked, emojiId, discussId, emojiCode },
    { req },
    _info,
  ) {
    const { userId } = await isAuthenticated(req)
    let results
    if (!isNil(emojiId)) {
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
        ...toStringProps(emoji),
        count: toStringProps(count),
      },
      like: toStringProps(like),
    }))
  },

  async createDiscussPost(_parent, { discussId, data }, { req }, _info) {
    const { userId } = await isAuthenticated(req),
      { content } = data,
      post = await prisma.discussPost.create({
        data: {
          user: { connect: { id: userId } },
          discuss: { connect: { id: discussId } },
          content,
        },
      })
    return toStringProps(post)
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
      return toStringProps(post)
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
    if (!isNil(emojiId)) {
      results = await discussPostEmojiModel.upsertLike({
        userId,
        liked,
        emojiId,
      })
    } else if (!isNil(discussPostId) && emojiCode) {
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
        ...toStringProps(emoji),
        count: toStringProps(count),
      },
      like: toStringProps(like),
    }))
  },

  async createLink(_parent, { url }, { req }, _info) {
    const { userId } = await isAuthenticated(req),
      [link] = await linkModel.getOrCreateLink(url)
    return link
  },

  async createNoteDraft(_parent, { branch, symbol, data }, { req }, _info) {
    const { userId } = await isAuthenticated(req),
      branch_ = branch === 'default' ? 'mock-branch-0' : branch,
      draft = await noteDraftModel.create(branch_, symbol, userId, data)
    return draft
  },

  async createNoteDraftByLink(
    _parent,
    { branch, linkId, data },
    { req },
    _info,
  ) {
    const { userId } = await isAuthenticated(req),
      branch_ = branch === 'default' ? 'mock-branch-0' : branch,
      draft = await noteDraftModel.createByLink(branch_, linkId, userId, data)
    return draft
  },

  async updateNoteDraft(_parent, { id, data, newSymbol }, { req }, _info) {
    const { userId } = await isAuthenticated(req),
      draft = await noteDraftModel.update(
        id,
        userId,
        data,
        newSymbol ?? undefined,
      )
    return draft
  },

  async updateNoteDraftMeta(_parent, { id, data }, { req }, _info) {
    const { userId } = await isAuthenticated(req),
      draft = await prisma.noteDraft.findUnique({
        where: { id },
      })

    if (draft === null) throw new Error('NoteDraft not found.')
    if (draft.userId !== userId)
      throw new Error('User is not the owner, cannot update')

    const meta = noteDraftModel.toMeta(data)
    const draft_ = await prisma.noteDraft.update({
      data: { meta },
      where: { id },
      include: { branch: true },
    })

    return noteDraftModel.toGQLNoteDraft(draft_)
  },

  async dropNoteDraft(_parent, { id }, _context, _info) {
    await prisma.noteDraft.update({ where: { id }, data: { status: 'DROP' } })
    return { response: 'Draft is successfully dropped.' }
  },

  async deleteNoteDraft(_parent, { id }, _context, _info) {
    // Require to delete discusses first
    // await prisma.discuss.deleteMany({ where: { draftId: id } })
    await prisma.noteDraft.delete({ where: { id } })
    return true
  },

  async upsertNoteEmojiLike(
    _parent,
    { liked, emojiId, noteId, emojiCode },
    { req },
    _info,
  ) {
    const { userId } = await isAuthenticated(req)
    let results
    if (!isNil(emojiId)) {
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
        ...toStringProps(emoji),
        count: toStringProps(count),
      },
      like: toStringProps(like),
    }))
  },

  async createPoll(_parent, { data }, { req }, _info) {
    const { userId } = await isAuthenticated(req),
      poll = await pollModel.create({ userId, choices: data.choices })
    return {
      ...toStringProps(poll),
      count: toStringProps(poll.count),
    }
  },

  async createPollVote(_parent, { pollId, data }, { req }, _info) {
    const { userId } = await isAuthenticated(req),
      vote = await pollVoteModel.create({
        choiceIdx: data.choiceIdx,
        pollId,
        userId,
      })
    return toStringProps(vote)
  },

  async createRate(_parent, { data }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const { choice, targetId, authorId, linkId } = data

    const note = await prisma.note.findUnique({
      where: { id: targetId },
      include: { sym: true },
    })
    if (note === null) throw 'Target note not found'

    const rate = await rateModel.create({
      choice,
      symbol: note.sym.symbol,
      userId,
      authorId,
      linkId,
    })
    return toStringProps(rate)
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
}

export default { Query, Mutation }
