import { PrismaClient } from '@prisma/client'
import { commitNoteDrafts } from '../../lib/models/commit-model'
import {
  mockNoteDrafts,
  mockNoteDrafts_gotFromDoc,
} from '../../test/__mocks__/mock-note-draft'
import { testHelper } from '../../test/test-helpers'
import { noteDraftModel } from '../../lib/models/note-draft-model'
import { mockBranches } from '../../test/__mocks__/mock-branch'
import { noteDocModel } from '../../lib/models/note-doc-model'
import { parseGQLBlocks } from '../../shared/block-helpers'
import { mockUsers } from '../../test/__mocks__/mock-user'

// const scraper = new FetchClient(
//   resolve(process.cwd(), process.argv[2], '_local-cache.dump.json'),
// )

const prisma = new PrismaClient({ errorFormat: 'pretty' })

/**
 * Main entry
 */
async function main() {
  console.log('Truncating databse...')
  await prisma.$queryRaw`TRUNCATE "Author", "Branch", "User", "Commit", "Discuss", "DiscussPost", "Note", "NoteDoc", "NoteDraft", "Link", "Sym", "Poll", "PollVote" CASCADE;`

  await testHelper.createUsers(prisma)
  await testHelper.createBranches(prisma)

  // await testHelper.createNoteDrafts(prisma, mockNoteDrafts.slice(0, 2))

  const mockDraft = mockNoteDrafts[0],
    { symbol, userId, contentBody, ...rest } = mockDraft,
    draft = await noteDraftModel.create(mockBranches[0].name, symbol, userId, {
      ...rest,
      contentBody: { blocks: contentBody.blocks, discussIds: [], symbols: [] },
    })

  await testHelper.createDiscusses(prisma, draft.id)
  // const draft_ = await noteDraftModel.update(draft.id, draft.userId, {
  //   ...rest,
  //   contentBody: {
  //     blocks: contentBody.blocks,
  //     discussIds: [],
  // symbols: [],
  //   },
  // })

  const { noteDocs } = await commitNoteDrafts([draft.id], draft.userId)

  const { blocks, docBlock } = parseGQLBlocks(
    noteDocModel.parse(noteDocs[0]).contentBody.blocks,
  )

  console.log(docBlock)

  // Warnning! This is the wrong way to create merge polls. Only used for the testing.
  await testHelper.createMergePolls(prisma, noteDocs[0])

  const fromDoc = noteDocs[0],
    fromDoc_ = noteDocModel.parse(fromDoc),
    drafts = mockNoteDrafts_gotFromDoc(mockUsers[4].id, fromDoc_)

  await testHelper.createNoteDrafts(prisma, drafts)
  await commitNoteDrafts(
    drafts.map(e => e.id),
    mockUsers[4].id,
  )
}

main()
  .catch(err => {
    console.error('error', err)
    throw new Error()
  })
  .finally(async () => {
    console.log('Done, closing primsa')
    // scraper.dump()
    prisma.$disconnect()
    process.exit()
  })
