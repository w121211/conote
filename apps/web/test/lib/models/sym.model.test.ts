import { symModel } from '../../../lib/models/sym.model'
import prisma from '../../../lib/prisma'
import { mockSyms } from '../../__mocks__/sym.mock'

beforeAll(async () => {
  await prisma.$queryRaw`TRUNCATE "Sym" CASCADE;`
  await prisma.$transaction(mockSyms.map(e => prisma.sym.create({ data: e })))
})

// afterAll(async () => {
//   // Bug: comment out to avoid rerun loop  @see https://github.com/facebook/jest/issues/2516
//   // await prisma.$disconnect()
// })

// beforeEach(async () => {
//   // await prisma.$queryRaw`TRUNCATE "NoteDoc", "Poll" CASCADE;`
//   await prisma.$queryRaw`TRUNCATE "Note", "NoteDoc", "NoteDraft", "Sym", "Commit", "Link", "Poll"  CASCADE;`
// })

it('getAll()', async () => {
  expect((await symModel.getAll()).map(e => e.symbol)).toMatchInlineSnapshot(`
    Array [
      "[[Apple]]",
      "[[Google]]",
      "$BA",
    ]
  `)
})

describe('update()', () => {
  it('throws if rename a ticker to topic', async () => {
    await expect(
      symModel.update(mockSyms[2].id, '[[Hello world]]'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Not support update symbol to different type"`,
    )
  })

  it('throws if rename a topic to ticker', async () => {
    await expect(
      symModel.update(mockSyms[0].id, '$XX'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Not support update symbol to different type"`,
    )
  })

  it('throws if update a url', async () => {
    await expect(
      symModel.update(
        mockSyms[3].id,
        '[[https://stackoverflow.com/questions/45713938/jest-looping-through-dynamic-test-cases]]',
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Not support update URL symbol"`,
    )
  })

  it('rename topic', async () => {
    const sym = mockSyms[0]
    expect(
      (await symModel.update(sym.id, '[[Hello world]]')).symbol,
    ).toMatchInlineSnapshot(`"[[Hello world]]"`)
  })
})
