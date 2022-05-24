import { PrismaClient } from '@prisma/client'
import { getBotEmail } from '../lib/models/user-model'
import { mockDiscusses, mockDiscussPosts } from './__mocks__/mock-discuss'
import { mockUsers } from './__mocks__/mock-user'
import { mockBranches } from './__mocks__/mock-branch'
import { mockNoteDrafts } from './__mocks__/mock-note-draft'
import { NoteDraftParsed } from '../lib/interfaces'
import { mockSyms } from './__mocks__/mock-sym'
import { mockNotes } from './__mocks__/mock-note'
import { mockCommits } from './__mocks__/mock-commit'
import { mockNoteDocs } from './__mocks__/mock-note-doc'
import { mockLinks } from './__mocks__/mock-link'
import { mockPolls } from './__mocks__/mock-poll'

// fake incremental id
let i = 0
const fid = () => {
  i++
  return i.toString()
}

export const BOT = { id: 'bot', email: getBotEmail() }

// --- Tree values ---

// export const bt = (
//   cid: number,
//   children: TreeNode<Bullet>[] = [],
// ): TreeNode<Bullet> => {
//   return {
//     cid: cid.toString(),
//     data: {
//       id: cid.toString(),
//       cid: cid.toString(),
//       head: `${cid}${cid}${cid}`,
//     },
//     children,
//   }
// }

/**
 * Recursively remove keys from an object
 * Source: https://github.com/lodash/lodash/issues/723
 *
 * @param {object} input
 * @param {Array<number | string>>} excludes
 * @return {object}
 */
export const omitDeep = (
  input: Record<string, unknown>,
  excludes: Array<number | string>,
): Record<string, unknown> => {
  return Object.entries(input).reduce<Record<string, unknown>>(
    (acc, [key, value]) => {
      const shouldExclude = excludes.includes(key)
      if (shouldExclude) return acc

      if (Array.isArray(value)) {
        const arrValue = value
        const nextValue = arrValue.map(arrItem => {
          if (typeof arrItem === 'object') {
            return omitDeep(arrItem, excludes)
          }
          return arrItem
        })
        acc[key] = nextValue
        return acc
      } else if (typeof value === 'object' && value !== null) {
        acc[key] = omitDeep(value as Record<string, unknown>, excludes)
        return acc
      }

      acc[key] = value

      return acc
    },
    {},
  )
}

const omitUndefined = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

export const clean = (
  obj: Record<string, unknown> | null,
): Record<string, unknown> | null => {
  return obj === null
    ? obj
    : omitUndefined(
        omitDeep(obj, ['createdAt', 'updatedAt', 'id', 'symId', 'noteId']),
      )
}

/**
 * Test helper for creating mock data
 */
class TestHelper {
  async createBranches(prisma: PrismaClient): Promise<void> {
    await prisma.$transaction(
      mockBranches.map(e => prisma.branch.create({ data: e })),
    )
  }

  /**
   * Create Commit and also create Sym, Note, NoteDoc
   */
  async createMergeCommit(prisma: PrismaClient) {
    const sym = await prisma.sym.create({
        data: mockSyms[0],
      }),
      note = await prisma.note.create({
        data: mockNotes[0],
      }),
      // Need to create commit before note-doc so the note-doc can connect to it
      commit = await prisma.commit.create({
        data: mockCommits[0],
      }),
      // poll = await prisma.poll.create({
      //   data: {
      //     id: mockNoteDocs[1].mergePollId,
      //     meta: {},
      //     user: { connect: { id: mockNoteDocs[1].userId } },
      //   },
      // }),
      noteDoc = await prisma.noteDoc.create({
        data: {
          ...mockNoteDocs[1],
          // meta: NoteDocMetaModel.toJSON(mockNoteDocs[1].meta),
          meta: {},
        },
      })
    return { sym, note, commit, noteDoc }

    // const noteDoc = await prisma.noteDoc.create({
    //   data: {
    //     ...mockNoteDocs[1],
    //     // meta: NoteDocMetaModel.toJSON(mockNoteDocs[1].meta),
    //     meta: {},
    //   },
    // })
  }

  async createCandidateCommit(prisma: PrismaClient) {
    const sym = await prisma.sym.create({
        data: mockSyms[0],
      }),
      note = await prisma.note.create({
        data: mockNotes[0],
      }),
      // Need to create commit before note-doc so the note-doc can connect to it
      commit = await prisma.commit.create({
        data: mockCommits[0],
      }),
      poll = await prisma.poll.create({
        data: {
          ...mockPolls[0],
          // id: mockPolls[0].id,
          // user: {connect: {id: mockPolls[0].userId}},
          // choices: mockPolls[0].choices,
          meta: mockPolls[0].meta as unknown as object,
          count: { create: { nVotes: mockPolls[0].choices.map(e => 0) } },
        },
      })
    const noteDoc = await prisma.noteDoc.create({
      data: {
        ...mockNoteDocs[0],
        meta: {},
      },
    })
  }

  async createDiscusses(prisma: PrismaClient): Promise<void> {
    await prisma.$transaction([
      ...mockDiscusses.map(e =>
        prisma.discuss.create({
          data: {
            ...e,
            count: { create: {} },
          },
        }),
      ),
      ...mockDiscussPosts.map(e => prisma.discussPost.create({ data: e })),
    ])
  }

  async createLinks(prisma: PrismaClient): Promise<void> {
    await prisma.$transaction(
      mockLinks.map(e => prisma.link.create({ data: e })),
    )
  }

  async createNoteDrafts(
    prisma: PrismaClient,
    drafts: Omit<
      NoteDraftParsed,
      'symId' | 'branchId' | 'commitId'
    >[] = mockNoteDrafts,
  ): Promise<void> {
    await prisma.$transaction(
      drafts.map(
        ({ id, symbol, userId, domain, meta, content, fromDocId, linkId }) => {
          return prisma.noteDraft.create({
            data: {
              id,
              symbol,
              branch: { connect: { name: mockBranches[0].name } },
              user: { connect: { id: userId } },
              fromDoc: fromDocId ? { connect: { id: fromDocId } } : undefined,
              link: linkId ? { connect: { id: linkId } } : undefined,
              domain,
              meta,
              content,
            },
          })
        },
      ),
    )
  }

  async createUsers(prisma: PrismaClient): Promise<void> {
    await prisma.user.create({
      data: { id: BOT.id, email: BOT.email },
    })
    await prisma.$transaction(
      mockUsers.map(e =>
        prisma.user.create({
          data: { id: e.id, email: e.email },
        }),
      ),
    )
  }

  async createLink(prisma: PrismaClient): Promise<void> {
    const { id, url, domain } = mockLinks[0]
    await prisma.link.create({ data: { id, url, domain } })
  }
}

export const testHelper = new TestHelper()
