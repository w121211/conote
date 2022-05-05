/* eslint-disable no-await-in-loop */
import { resolve } from 'path'
import cuid from 'cuid'
import { NodeChange, TreeChangeService, TreeNode } from '@conote/docdiff'
import {
  CommitInput as GQLCommitInput,
  NoteDocMetaInput,
} from 'graphql-let/__generated__/__types__'
import { Bullet } from '../../../components/bullet/bullet'
import prisma from '../../../lib/prisma'
import { NoteModel } from '../../../lib/models/note-model'
// import { CommitModel } from '../../../lib/models/commit-model'
import { testHelper } from '../../test-helpers'
import { commitNoteDrafts } from '../../../lib/models/commit-model'
import { noteDocModel } from '../../../lib/models/note-doc-model'
import { SymType } from '@prisma/client'
import { noteDraftModel } from '../../../lib/models/note-draft-model'
import { mockBranches } from '../../__mocks__/mock-branch'
import { mockNoteDrafts } from '../../__mocks__/mock-note-draft'
import CreateSymbolForm from '../../../components/rate-form/create-symbol-form'
import { mockSyms } from '../../__mocks__/mock-sym'
import { mockNoteDocs } from '../../__mocks__/mock-note-doc'

beforeEach(async () => {
  console.log('Writing required data into database')
  await testHelper.createUsers(prisma)
  await testHelper.createBranch(prisma)

  console.log('Setting up a fetch-client')
  // fetcher = new FetchClient(resolve(__dirname, '.cache.fetcher.json'))
})

afterEach(async () => {
  await prisma.$queryRaw`TRUNCATE "Author", "Bullet", "BulletEmoji", "Branch", "Note", "NoteDoc", "NoteDraft", "NoteEmoji", "Link", "Poll", "Sym",  "User" CASCADE;`

  // Bug: comment out to avoid rerun loop  @see https://github.com/facebook/jest/issues/2516
  // fetcher.dump()
  await prisma.$disconnect()
})

/**
 * Cases
 * - [] create without link and symId
 * - [] create without link but with symId and fromDoc
 * - [] create by link
 * - [] update (save)
 * - [] drop
 */
describe('noteDraftModel.create()', () => {
  it('create without link and symId', async () => {
    const {
      symbol,
      userId,
      fromDocId,
      domain,
      meta: meta_,
      content,
    } = mockNoteDrafts[0]
    const meta = meta_ as unknown as NoteDocMetaInput
    const noteDraft = await noteDraftModel.create(
      mockBranches[0].name,
      symbol,
      userId,
      {
        fromDocId,
        domain,
        meta,
        content,
      },
    )
    expect({
      branchId: noteDraft.branchId,
      symId: noteDraft.symId,
      symbol: noteDraft.symbol,
    }).toMatchInlineSnapshot()
    expect({
      domain: noteDraft.domain,
      status: noteDraft.status,
      fromDocId: noteDraft.fromDocId,
    }).toMatchInlineSnapshot()
  })

  it('create without link but with symId and fromDoc', async () => {
    await testHelper.createCommit(prisma)
    const { symbol, userId, domain, meta: meta_, content } = mockNoteDrafts[0]
    const fromDocId = mockNoteDocs[1].id
    const meta = meta_ as unknown as NoteDocMetaInput
    const noteDraft = await noteDraftModel.create(
      mockBranches[0].name,
      symbol,
      userId,
      {
        fromDocId,
        domain,
        meta,
        content,
      },
    )
    expect({
      branchId: noteDraft.branchId,
      symId: noteDraft.symId,
      symbol: noteDraft.symbol,
    }).toMatchInlineSnapshot()
    expect({
      domain: noteDraft.domain,
      status: noteDraft.status,
      fromDocId: noteDraft.fromDocId,
    }).toMatchInlineSnapshot()
  })

  it('create by link', async () => {
    await testHelper.createCommit(prisma)
    const { symbol, userId, domain, meta: meta_, content } = mockNoteDrafts[0]
    const fromDocId = mockNoteDocs[1].id
    const meta = meta_ as unknown as NoteDocMetaInput
    const noteDraft = await noteDraftModel.create(
      mockBranches[0].name,
      symbol,
      userId,
      {
        fromDocId,
        domain,
        meta,
        content,
      },
    )
    expect({
      branchId: noteDraft.branchId,
      symId: noteDraft.symId,
      symbol: noteDraft.symbol,
    }).toMatchInlineSnapshot()
    expect({
      domain: noteDraft.domain,
      status: noteDraft.status,
      fromDocId: noteDraft.fromDocId,
    }).toMatchInlineSnapshot()
  })

  // use implementation in resolver
  // async noteDraft(_parent, { id, symbol, url }, { req }, _info) {
  //   const { userId } = await isAuthenticated(req)
  //   let draft: (NoteDraft & { note: Note | null }) | null = null

  //   if (id) {
  //     draft = await prisma.noteDraft.findUnique({
  //       where: { id },
  //       include: { note: true },
  //     })
  //   }
  //   if (symbol) {
  //     // TODO: use findMany and check there is only one element in the array
  //     draft = await prisma.noteDraft.findFirst({
  //       where: { userId, symbol, status: 'EDIT' },
  //       include: { note: true },
  //     })
  //   }
  //   if (url) {
  //     // TODO: use findMany and check there is only one element in the array
  //     draft = await prisma.noteDraft.findFirst({
  //       where: { userId, symbol: url, status: 'EDIT' },
  //       include: { note: true },
  //     })
  //   }

  //   if (draft) {
  //     return {
  //       ...draft,
  //       noteId: draft.note?.id,
  //       meta: draft.meta as unknown as NoteMeta,
  //       // TODO
  //       content: { blocks: [], symbolIdDict: {}, diff: {} },
  //     }
  //   }
  //   return null
  // },
})
