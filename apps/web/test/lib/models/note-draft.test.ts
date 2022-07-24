import { NoteDraftInput } from 'graphql-let/__generated__/__types__'
import prisma from '../../../lib/prisma'
import { testHelper } from '../../test-helpers'
import { noteDraftModel } from '../../../lib/models/note-draft.model'
import { mockBranches } from '../../__mocks__/branch.mock'
import { mockNoteDrafts } from '../../__mocks__/note-draft.mock'
import { mockSyms } from '../../__mocks__/sym.mock'
import { mockNoteDocs } from '../../__mocks__/note-doc.mock'
import { mockDiscusses } from '../../__mocks__/discuss.mock'
import { mockBlocks } from '../../../frontend/components/editor-textarea/test/__mocks__/mock-block'
import { mockNotes } from '../../__mocks__/note.mock'

beforeAll(async () => {
  await prisma.$queryRaw`TRUNCATE "Author", "Branch", "User" CASCADE;`
  await testHelper.createUsers(prisma)
  await testHelper.createBranches(prisma)
})

afterAll(async () => {
  // Bug: comment out to avoid rerun loop  @see https://github.com/facebook/jest/issues/2516
  // fetcher.dump()
  await prisma.$disconnect()
})

beforeEach(async () => {
  await prisma.$queryRaw`TRUNCATE "Note", "NoteDoc", "NoteDoc", "NoteDraft", "Sym", "Commit", "Link", "Poll" CASCADE;`
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
    const { symbol, userId, fromDocId, domain, contentHead, contentBody } =
      mockNoteDrafts[0]
    const noteDraft = await noteDraftModel.create(
      mockBranches[0].name,
      symbol,
      userId,
      { fromDocId, domain, contentHead, contentBody },
    )
    expect({
      branchId: noteDraft.branchId,
      symId: noteDraft.symId,
      symbol: noteDraft.symbol,
    }).toMatchInlineSnapshot(`
      Object {
        "branchId": "0",
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
    const { symbol, userId, domain, contentHead, contentBody } =
      mockNoteDrafts[0]
    const fromDocId = mockNoteDocs[0].id
    const noteDraft = await noteDraftModel.create(
      mockBranches[0].name,
      symbol,
      userId,
      { fromDocId, domain, contentHead, contentBody },
    )
    expect({
      branchId: noteDraft.branchId,
      symId: noteDraft.symId,
      symbol: noteDraft.symbol,
    }).toMatchInlineSnapshot(`
      Object {
        "branchId": "0",
        "symId": "0-topic",
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
        "fromDocId": "0-candidate_initial_commit",
        "status": "EDIT",
      }
    `)
  })

  it('create by link if the link exists', async () => {
    await testHelper.createLink(prisma)
    const { symbol, userId, linkId, domain, contentHead, contentBody } =
      mockNoteDrafts[4]
    // await prisma.link.create({ data: { id: linkId!, url: symbol, domain } })
    const noteDraft = await noteDraftModel.create(
      mockBranches[0].name,
      symbol,
      userId,
      { domain, contentHead, contentBody },
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
        "branchId": "0",
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
    const { symbol, userId, domain, contentHead, contentBody } =
      mockNoteDrafts[4]
    expect(async () => {
      await noteDraftModel.createByLink(
        mockBranches[0].name,
        'mock-sym-no-link',
        userId,
        { domain, contentHead, contentBody },
      )
    }).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[NoteDraftModel.createByLink] link not found."`,
    )
  })
})

it('noteDraftModel.update()', async () => {
  await testHelper.createMergeCommit(prisma)
  // Change from-doc require to create the doc first and all related data
  await prisma.sym.create({ data: mockSyms[1] })
  await prisma.note.create({ data: mockNotes[1] })
  await prisma.noteDoc.create({ data: mockNoteDocs[1] })
  const draftId = mockNoteDrafts[0].id,
    update: NoteDraftInput = {
      domain: 'new_domain',
      contentHead: {
        duplicatedSymbols: ['duplicate-1'],
        keywords: ['key-1', 'key-2'],
        redirectFroms: [],
      },
      contentBody: {
        discussIds: [{ blockUid: 'uid-0', discussId: mockDiscusses[0].id }],
        symbols: [{ symbol: '[[Google]]', symId: null }],
        blocks: mockBlocks,
      },
      fromDocId: mockNoteDocs[1].id,
    },
    result = await noteDraftModel.update(draftId, update)

  expect(result.domain).toMatchInlineSnapshot(`"new_domain"`)
  expect(result.contentHead).toMatchInlineSnapshot(`
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
  expect(result.contentBody.discussIds).toMatchInlineSnapshot(`
    Array [
      Object {
        "blockUid": "uid-0",
        "discussId": "mock_discuss_0_active",
      },
    ]
  `)
  expect(result.contentBody.symbols).toMatchInlineSnapshot(`
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
