/* eslint-disable no-await-in-loop */
import { resolve } from 'path'
import cuid from 'cuid'
import { NodeChange, TreeChangeService, TreeNode } from '@conote/docdiff'
import { CommitInput as GQLCommitInput } from 'graphql-let/__generated__/__types__'
import { Bullet } from '../../../components/bullet/bullet'
import prisma from '../../../lib/prisma'
import { NoteModel } from '../../../lib/models/note-model'
import { CommitModel } from '../../../lib/models/commit-model'
import { bt, clean, TestDataHelper, TESTUSERS } from '../../test-helpers'

let fakeId = 0

jest.mock('cuid', () => {
  return () => {
    fakeId++
    return fakeId.toString()
  }
})

// let fetcher: FetchClient
const startValue: TreeNode<Bullet>[] = [bt(1, [bt(3), bt(4)]), bt(2)]
const finalValue: TreeNode<Bullet>[] = [bt(1, [bt(3), bt(4)]), bt(2), bt(5)]
const nanoValue: TreeNode<Bullet>[] = [bt(0)]

beforeAll(async () => {
  console.log('Writing required data into database')
  await TestDataHelper.createUsers(prisma)

  console.log('Setting up a fetch-client')
  // fetcher = new FetchClient(resolve(__dirname, '.cache.fetcher.json'))
})

afterAll(async () => {
  await prisma.$queryRaw`TRUNCATE "Author", "Bullet", "BulletEmoji", "Note", "NoteState", "NoteEmoji", "Link", "Poll", "Shot", "Sym", "User" CASCADE;`

  // Bug: comment out to avoid rerun loop  @see https://github.com/facebook/jest/issues/2516
  // fetcher.dump()
  await prisma.$disconnect()

  jest.spyOn(global.Math, 'random').mockRestore()
})

it('create commit: note-state has note-input', async () => {
  const commit0 = await CommitModel.create(
    {
      noteStateInputs: [
        {
          cid: '$AA',
          prevStateId: null,
          noteInput: { symbol: '$AA' },
          changes: [],
          value: nanoValue,
        },
      ],
    },
    TESTUSERS[0].id,
  )
  expect(clean(commit0)).toMatchSnapshot()

  const state0 = commit0.noteStates[0]
  const commit1 = await CommitModel.create(
    {
      noteStateInputs: [
        {
          cid: '$AA',
          prevStateId: state0.id,
          noteId: state0.noteId,
          changes: [],
          value: nanoValue,
        },
      ],
    },
    TESTUSERS[0].id,
  )
  expect(clean(commit1)).toMatchSnapshot()

  expect(commit1.noteStates[0]).toBeDefined()
  expect(commit1.noteStates[0].prevId).toEqual(state0.id)
})

it('create commit: multi note-state', async () => {
  const note = await NoteModel.getBySymbol('$AA')
  expect(note).not.toBeNull()
  expect(note).toBeDefined()

  if (note) {
    const commitInput: GQLCommitInput = {
      noteStateInputs: [
        {
          cid: '$BB',
          prevStateId: null,
          sourceNoteId: note.id,
          noteInput: { symbol: '$BB' },
          changes: [],
          value: nanoValue,
        },
        {
          cid: '$CC',
          prevStateId: null,
          sourceNoteId: note.id,
          noteInput: { symbol: '$CC' },
          changes: [],
          value: nanoValue,
        },
      ],
    }
    const commit = await CommitModel.create(commitInput, TESTUSERS[0].id)
    expect(clean(commit)).toMatchSnapshot()
  }
})

// test('create commit from prev commit', () => {
// })

// test('replaceBulletInput()', () => {
//   expect(clean(replaceBulletInput(templateTicker.body, params))).toMatchSnapshot()
// })

// test('runBulletInputOp()', async () => {
//   const root0 = await runBulletInputOp({
//     noteId: note.id,
//     input: input0,
//     // prevDict,
//     timestamp: 111111111,
//     userId: TESTUSERS[0].id,
//   })
//   expect(clean(root0)).toMatchSnapshot()
// })

// test('createNoteBody()', async () => {
//   const body0 = await createNoteBody({ noteId: note.id, bulletInputRoot: input0 }, TESTUSERS[0].id)
//   expect(clean({ ...body0, content: omitDeep(JSON.parse(body0.content), ['timestamp']) })).toMatchSnapshot()

//   const input1: BulletInput = {
//     id: 6,
//     head: '111+++',
//     body: '111-111+++',
//     op: 'update',
//     children: [
//       { id: 7, head: '222', body: '222-222', op: 'delete' },
//       {
//         id: 8,
//         head: '333',
//         children: [{ id: 9, head: '444' }],
//       },
//       { id: 10, head: '555', op: 'move' },
//       { head: '666', op: 'create' },
//     ],
//   }

//   const body1 = await createNoteBody({ noteId: note.id, bulletInputRoot: input1 }, TESTUSERS[1].id)
//   console.log(body1)
//   expect(clean({ ...body1, content: omitDeep(JSON.parse(body1.content), ['timestamp']) })).toMatchSnapshot()
// })

// test('createNote()', async () => {
//   const { note, body } = await createNote({ name: '$BBB', template: templateTicker, title: 'BBB Company' })
//   expect(clean(note)).toMatchSnapshot()
//   expect(clean({ ...body, content: omitDeep(JSON.parse(body.content), ['timestamp']) })).toMatchSnapshot()
// })
