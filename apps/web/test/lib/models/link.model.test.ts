import { Link } from '@prisma/client'
import { LinkParsed } from '../../../lib/interfaces'
import { linkModel } from '../../../lib/models/link.model'
import prisma from '../../../lib/prisma'
import { mockLinks } from '../../__mocks__/link.mock'

// afterAll(async () => {
//   // Bug: comment out to avoid rerun loop  @see https://github.com/facebook/jest/issues/2516
//   // await prisma.$disconnect()
// })

// beforeEach(async () => {
//   // await prisma.$queryRaw`TRUNCATE "NoteDoc", "Poll" CASCADE;`
//   await prisma.$queryRaw`TRUNCATE "Note", "NoteDoc", "NoteDraft", "Sym", "Commit", "Link", "Poll"  CASCADE;`
// })

function c(link: LinkParsed) {
  const { domain, url } = link
  return { domain, url }
}

describe('getOrCreateLink()', () => {
  beforeAll(async () => {
    await prisma.$queryRaw`TRUNCATE "Link" CASCADE;`
    // await prisma.$transaction(mockSyms.map(e => prisma.sym.create({ data: e })))
  })

  it('Fail to create link if url is wrong', async () => {
    const [link] = await linkModel.getOrCreateLink('https://stackoverflow.coom')
    expect(c(link)).toMatchInlineSnapshot(`
      Object {
        "domain": "stackoverflow.com",
        "url": "https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url",
      }
    `)
  })

  it('Create link by url', async () => {
    const [link] = await linkModel.getOrCreateLink(mockLinks[0].url)

    expect(c(link)).toMatchInlineSnapshot(`
      Object {
        "domain": "stackoverflow.com",
        "url": "https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url",
      }
    `)
  })

  it('Get link if different url resolved to the same', async () => {
    const [link] = await linkModel.getOrCreateLink(mockLinks[0].url)

    expect(c(link)).toMatchInlineSnapshot(`
      Object {
        "domain": "stackoverflow.com",
        "url": "https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url",
      }
    `)
  })
})

// describe('update()', () => {
//   it('throws if rename a ticker to topic', async () => {
//     await expect(
//       symModel.update(mockSyms[2].id, '[[Hello world]]'),
//     ).rejects.toThrowErrorMatchingInlineSnapshot(
//       `"Not support update symbol to different type"`,
//     )
//   })

//   it('throws if rename a topic to ticker', async () => {
//     await expect(
//       symModel.update(mockSyms[0].id, '$XX'),
//     ).rejects.toThrowErrorMatchingInlineSnapshot(
//       `"Not support update symbol to different type"`,
//     )
//   })

//   it('throws if update a url', async () => {
//     await expect(
//       symModel.update(
//         mockSyms[3].id,
//         '[[https://stackoverflow.com/questions/45713938/jest-looping-through-dynamic-test-cases]]',
//       ),
//     ).rejects.toThrowErrorMatchingInlineSnapshot(
//       `"Not support update URL symbol"`,
//     )
//   })

//   it('rename topic', async () => {
//     const sym = mockSyms[0]
//     expect(
//       (await symModel.update(sym.id, '[[Hello world]]')).symbol,
//     ).toMatchInlineSnapshot(`"[[Hello world]]"`)
//   })
// })
