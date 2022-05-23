/* eslint-disable no-await-in-loop */
import { resolve } from 'path'
import cuid from 'cuid'
import { NodeChange, TreeChangeService, TreeNode } from '@conote/docdiff'
import {
  CommitInput as GQLCommitInput,
  NoteDocMetaInput,
  NoteDraftInput,
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
import { mockDiscusses } from '../../__mocks__/mock-discuss'
import { mockBlocks } from '../../../components/block-editor/test/__mocks__/mock-block'

beforeAll(async () => {
  console.log('Writing required data into database')
  await prisma.$queryRaw`TRUNCATE "Author", "Branch", "User" CASCADE;`
  await testHelper.createUsers(prisma)
  await testHelper.createBranches(prisma)

  console.log('Setting up a fetch-client')
  // fetcher = new FetchClient(resolve(__dirname, '.cache.fetcher.json'))
})

afterAll(async () => {
  // await prisma.$queryRaw`TRUNCATE "Author", "Bullet", "BulletEmoji", "Branch", "Note", "NoteDoc", "NoteDraft", "NoteEmoji", "Link", "Poll", "Sym",  "User" CASCADE;`

  // Bug: comment out to avoid rerun loop  @see https://github.com/facebook/jest/issues/2516
  // fetcher.dump()
  await prisma.$disconnect()
})

afterEach(async () => {
  await prisma.$queryRaw`TRUNCATE "Note", "NoteDoc", "NoteDraft", "Sym", "Commit", "Link", "Poll" CASCADE;`
})

/**
 * Cases
 * - [x] create without link and symId
 * - [x] create without link but with symId and fromDoc
 * - [x] create by link if the link exists
 * - [x] create by link if the link does not exist
 * - [x] update (save)
 * - [x] drop
 */
describe('noteDraftModel.validateCreateInput()', () => {
  it('branch not found', async () => {
    await expect(
      noteDraftModel.validateCreateInput('mock-branch-100'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[NoteDraftModel.createByLink] branch not found."`,
    )
  })
  it('symbol is not in valid form', async () => {
    await expect(
      noteDraftModel.validateCreateInput(mockBranches[0].name, 'test-symbol'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"symbol parse error: test-symbol"`,
    )
  })
  it('fromDoc not found', async () => {
    await expect(
      noteDraftModel.validateCreateInput(
        mockBranches[0].name,
        undefined,
        mockNoteDocs[0].id,
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[NoteDraftModel.createByLink] fromDoc not found."`,
    )
  })
  it('linkId not found', async () => {
    await expect(
      noteDraftModel.validateCreateInput(
        mockBranches[0].name,
        undefined,
        undefined,
        mockSyms[3].id,
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[NoteDraftModel.createByLink] link not found."`,
    )
  })
})
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
    }).toMatchInlineSnapshot(`
          Object {
            "branchId": "mock-branch-0",
            "symId": null,
            "symbol": "[[Apple]]",
          }
      `)
    expect({
      domain: noteDraft.domain,
      status: noteDraft.status,
      fromDocId: noteDraft.fromDocId,
    }).toMatchInlineSnapshot(`
          Object {
            "domain": "domain0",
            "fromDocId": null,
            "status": "EDIT",
          }
      `)
  })

  it('create without link but with symId and fromDoc', async () => {
    await testHelper.createMergeCommit(prisma)
    const { symbol, userId, domain, meta, content } = mockNoteDrafts[0]
    const fromDocId = mockNoteDocs[1].id
    const noteDraft = await noteDraftModel.create(
      mockBranches[0].name,
      symbol,
      userId,
      {
        fromDocId,
        domain,
        meta: meta as unknown as NoteDocMetaInput,
        content,
      },
    )
    expect({
      branchId: noteDraft.branchId,
      symId: noteDraft.symId,
      symbol: noteDraft.symbol,
    }).toMatchInlineSnapshot(`
          Object {
            "branchId": "mock-branch-0",
            "symId": "mock-sym-0",
            "symbol": "[[Apple]]",
          }
      `)
    expect({
      domain: noteDraft.domain,
      status: noteDraft.status,
      fromDocId: noteDraft.fromDocId,
    }).toMatchInlineSnapshot(`
          Object {
            "domain": "domain0",
            "fromDocId": "mock-doc-1_merge",
            "status": "EDIT",
          }
      `)
  })

  it('create by link if the link exists', async () => {
    await testHelper.createLink(prisma)
    const { symbol, userId, linkId, domain, meta, content } = mockNoteDrafts[4]
    // await prisma.link.create({ data: { id: linkId!, url: symbol, domain } })
    const noteDraft = await noteDraftModel.create(
      mockBranches[0].name,
      symbol,
      userId,
      {
        domain,
        meta: meta as unknown as NoteDocMetaInput,
        content,
      },
    )
    expect(
      (await prisma.link.findUnique({ where: { id: linkId! } }))?.url,
    ).toMatchInlineSnapshot(
      `"https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url"`,
    )
    expect({
      branchId: noteDraft.branchId,
      symId: noteDraft.symId,
      symbol: noteDraft.symbol,
      fromDoc: noteDraft.fromDocId,
    }).toMatchInlineSnapshot(`
      Object {
        "branchId": "mock-branch-0",
        "fromDoc": null,
        "symId": null,
        "symbol": "https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url",
      }
    `)
    expect({
      domain: noteDraft.domain,
      status: noteDraft.status,
    }).toMatchInlineSnapshot(`
          Object {
            "domain": "domain0",
            "status": "EDIT",
          }
      `)
  })

  it('create by link if the link does not exist', async () => {
    const { symbol, userId, domain, meta, content } = mockNoteDrafts[4]
    expect(async () => {
      await noteDraftModel.createByLink(
        mockBranches[0].name,
        'mock-sym-no-link',
        userId,
        {
          domain,
          meta: meta as unknown as NoteDocMetaInput,
          content,
        },
      )
    }).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[NoteDraftModel.createByLink] link not found."`,
    )
  })
})

it('noteDraftModel.update()', async () => {
  await testHelper.createNoteDrafts(prisma, [mockNoteDrafts[0]])
  await testHelper.createMergeCommit(prisma)
  const draftId = mockNoteDrafts[0].id
  const update: NoteDraftInput = {
    domain: 'new_domain',
    meta: {
      duplicatedSymbols: ['duplicate-1'],
      keywords: ['key-1', 'key-2'],
      redirectFroms: [],
    },
    content: {
      discussIds: [{ blockUid: 'uid-0', discussId: mockDiscusses[0].id }],
      symbolIdMap: [{ symbol: '[[Google]]', symId: null }],
      blocks: mockBlocks,
    },
    fromDocId: mockNoteDocs[1].id,
  }
  const result = await noteDraftModel.update(draftId, update)
  expect(result.domain).toMatchInlineSnapshot(`"new_domain"`)
  expect(result.meta).toMatchInlineSnapshot(`
    Object {
      "duplicatedSymbols": Array [
        "duplicate-1",
      ],
      "keywords": Array [
        "key-1",
        "key-2",
      ],
      "redirectFroms": Array [],
    }
  `)
  expect(result.content.discussIds).toMatchInlineSnapshot(`
    Array [
      Object {
        "blockUid": "uid-0",
        "discussId": "mock-discuss-0_active",
      },
    ]
  `)
  expect(result.content.symbolIdMap).toMatchInlineSnapshot(`
    Array [
      Object {
        "symId": null,
        "symbol": "[[Google]]",
      },
    ]
  `)
  expect(result.fromDocId).toEqual(mockNoteDocs[1].id)
})

it('noteDraftModel.drop()', async () => {
  await testHelper.createNoteDrafts(prisma, [mockNoteDrafts[1]])
  const result = await noteDraftModel.drop(mockNoteDrafts[1].id)
  expect(result.status).toMatchInlineSnapshot(`"DROP"`)
})
