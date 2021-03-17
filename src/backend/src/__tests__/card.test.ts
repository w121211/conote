/**
 * @jest-environment ./src/__tests__/prisma-test-environment
 */
// import { createConnectedContents } from '../models/card'
// describe('card', () => {
//   it('use url to split text to sections', () => {
//     const a =
//       'https://www.youtube.com/watch?v=qSYGlOZNUCw\n$AAAA\n\nhttps://www.youtube.com/watch?v=kprnW5VadnY&list=WL&index=53\n$BBBB\n'
//     expect(createConnectedContents().toEqual())
//   })
// })
import { createTestContext } from './__helpers'
import { createCardBody } from '../models/card'

const ctx = createTestContext()

it('ensures that a draft can be created and published', async () => {
  // Create a new draft
  const draftResult = await ctx.client.request(`               # 1
    mutation {
      createDraft(title: "Nexus", body: "...") {            # 2
        id
        title
        body
        published
      }
    }
  `)

  // Snapshot that draft and expect `published` to be false
  expect(draftResult).toMatchInlineSnapshot(`
    Object {
      "createDraft": Object {
        "body": "...",
        "id": 1,
        "published": false,
        "title": "Nexus",
      },
    }
  `) // 3

  // Publish the previously created draft
  const publishResult = await ctx.client.request(
    `
    mutation publishDraft($draftId: Int!) {
      publish(draftId: $draftId) {
        id
        title
        body
        published
      }
    }
  `,
    { draftId: draftResult.createDraft.id },
  )

  // Snapshot the published draft and expect `published` to be true
  expect(publishResult).toMatchInlineSnapshot(`
    Object {
      "publish": Object {
        "body": "...",
        "id": 1,
        "published": true,
        "title": "Nexus",
      },
    }
  `)

  const persistedData = await ctx.prisma.post.findMany()

  expect(persistedData).toMatchInlineSnapshot(`
    Array [
      Object {
        "body": "...",
        "id": 1,
        "published": true,
        "title": "Nexus",
      },
    ]
  `)
})
