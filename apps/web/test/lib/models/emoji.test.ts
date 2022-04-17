import {
  DiscussEmoji,
  DiscussEmojiCount,
  DiscussEmojiLike,
  NoteEmoji,
  NoteEmojiCount,
  NoteEmojiLike,
} from '@prisma/client'
import {
  discussEmojiModel,
  noteEmojiModel,
} from '../../../lib/models/emoji-model'
import prisma from '../../../lib/prisma'
import { TestDataHelper, TESTUSERS } from '../../test-helpers'

beforeAll(async () => {
  await TestDataHelper.createUsers(prisma)
})

afterAll(async () => {
  await prisma.$queryRaw`TRUNCATE "Author", "Bullet", "BulletEmoji", "Note", "NoteState", "NoteEmoji", "Link", "Poll", "Sym", "User" CASCADE;`

  // Bug: comment out to avoid rerun loop  @see https://github.com/facebook/jest/issues/2516
  // await prisma.$disconnect()
})

describe('discussEmojiModel.upsertLike()', () => {
  function f({
    emoji,
    count,
    like,
  }: {
    emoji: DiscussEmoji
    count: DiscussEmojiCount
    like: DiscussEmojiLike
  }) {
    const { code } = emoji,
      { nUps } = count,
      { liked, userId } = like
    return { code, nUps, liked, userId }
  }

  test('like, unlike UP and DOWN', async () => {
    const discuss = await prisma.discuss.create({
      data: {
        title: 'hello world',
        user: { connect: { id: TESTUSERS[0].id } },
      },
    })

    const userId = TESTUSERS[0].id

    const likeUp = await discussEmojiModel.upsertLike({
      userId,
      liked: true,
      subj: { subjId: discuss.id, code: 'UP' },
    })
    expect(likeUp.map(f)).toMatchInlineSnapshot(`
      Array [
        Object {
          "code": "UP",
          "liked": true,
          "nUps": 1,
          "userId": "testuser0",
        },
      ]
    `)

    const unlikeUp = await discussEmojiModel.upsertLike({
      userId,
      liked: false,
      subj: { subjId: discuss.id, code: 'UP' },
    })
    expect(unlikeUp.map(f)).toMatchInlineSnapshot(`
      Array [
        Object {
          "code": "UP",
          "liked": false,
          "nUps": 0,
          "userId": "testuser0",
        },
      ]
    `)

    const likeUpGivenEmojiId = await discussEmojiModel.upsertLike({
      userId,
      liked: true,
      emojiId: likeUp[0].emoji.id,
    })
    expect(likeUpGivenEmojiId.map(f)).toMatchInlineSnapshot(`
      Array [
        Object {
          "code": "UP",
          "liked": true,
          "nUps": 1,
          "userId": "testuser0",
        },
      ]
    `)

    const likeDown = await discussEmojiModel.upsertLike({
      userId,
      liked: true,
      subj: { subjId: discuss.id, code: 'DOWN' },
    })
    expect(likeDown.map(f)).toMatchInlineSnapshot(`
      Array [
        Object {
          "code": "UP",
          "liked": false,
          "nUps": 0,
          "userId": "testuser0",
        },
        Object {
          "code": "DOWN",
          "liked": true,
          "nUps": 1,
          "userId": "testuser0",
        },
      ]
    `)
  })

  test('count properly when multiple users like UP', async () => {
    const discuss = await prisma.discuss.create({
      data: {
        title: 'hello world',
        user: { connect: { id: TESTUSERS[0].id } },
      },
    })

    const user0_likeUp = await discussEmojiModel.upsertLike({
      userId: TESTUSERS[0].id,
      liked: true,
      subj: { subjId: discuss.id, code: 'UP' },
    })
    expect(user0_likeUp.map(f)).toMatchInlineSnapshot(`
      Array [
        Object {
          "code": "UP",
          "liked": true,
          "nUps": 1,
          "userId": "testuser0",
        },
      ]
    `)

    const emojiId = user0_likeUp[0].emoji.id
    expect(emojiId).not.toBeUndefined()

    const user1_likeUp = await discussEmojiModel.upsertLike({
      userId: TESTUSERS[1].id,
      liked: true,
      emojiId,
    })
    expect(user1_likeUp.map(f)).toMatchInlineSnapshot(`
      Array [
        Object {
          "code": "UP",
          "liked": true,
          "nUps": 2,
          "userId": "testuser1",
        },
      ]
    `)

    const user1_unlikeUp = await discussEmojiModel.upsertLike({
      userId: TESTUSERS[1].id,
      liked: false,
      emojiId,
    })
    expect(user1_unlikeUp.map(f)).toMatchInlineSnapshot(`
      Array [
        Object {
          "code": "UP",
          "liked": false,
          "nUps": 1,
          "userId": "testuser1",
        },
      ]
    `)

    const user0_unlikeUp = await discussEmojiModel.upsertLike({
      userId: TESTUSERS[0].id,
      liked: false,
      emojiId,
    })
    expect(user0_unlikeUp.map(f)).toMatchInlineSnapshot(`
      Array [
        Object {
          "code": "UP",
          "liked": false,
          "nUps": 0,
          "userId": "testuser0",
        },
      ]
    `)
  })
})

describe('noteEmojiModel.upsertLike()', () => {
  function f({
    emoji,
    count,
    like,
  }: {
    emoji: NoteEmoji
    count: NoteEmojiCount
    like: NoteEmojiLike
  }) {
    const { code } = emoji,
      { nUps } = count,
      { liked, userId } = like
    return { code, nUps, liked, userId }
  }

  test('like, unlike UP and DOWN', async () => {
    const note = await prisma.note.create({
        data: {
          sym: {
            create: {
              type: 'TOPIC',
              symbol: '[[like, unlike UP and DOWN]]',
            },
          },
        },
      }),
      userId = TESTUSERS[0].id

    const likeUp = await noteEmojiModel.upsertLike({
      userId,
      liked: true,
      subj: { subjId: note.id, code: 'UP' },
    })
    expect(likeUp.map(f)).toMatchInlineSnapshot(`
      Array [
        Object {
          "code": "UP",
          "liked": true,
          "nUps": 1,
          "userId": "testuser0",
        },
      ]
    `)

    const unlikeUp = await noteEmojiModel.upsertLike({
      userId,
      liked: false,
      subj: { subjId: note.id, code: 'UP' },
    })
    expect(unlikeUp.map(f)).toMatchInlineSnapshot(`
      Array [
        Object {
          "code": "UP",
          "liked": false,
          "nUps": 0,
          "userId": "testuser0",
        },
      ]
    `)

    const likeUpGivenEmojiId = await noteEmojiModel.upsertLike({
      userId,
      liked: true,
      emojiId: likeUp[0].emoji.id,
    })
    expect(likeUpGivenEmojiId.map(f)).toMatchInlineSnapshot(`
      Array [
        Object {
          "code": "UP",
          "liked": true,
          "nUps": 1,
          "userId": "testuser0",
        },
      ]
    `)

    const likeDown = await noteEmojiModel.upsertLike({
      userId,
      liked: true,
      subj: { subjId: note.id, code: 'DOWN' },
    })
    expect(likeDown.map(f)).toMatchInlineSnapshot(`
      Array [
        Object {
          "code": "UP",
          "liked": false,
          "nUps": 0,
          "userId": "testuser0",
        },
        Object {
          "code": "DOWN",
          "liked": true,
          "nUps": 1,
          "userId": "testuser0",
        },
      ]
    `)
  })

  test('count properly when multiple users like UP', async () => {
    const note = await prisma.note.create({
      data: {
        sym: {
          create: {
            type: 'TOPIC',
            symbol: '[[count properly when multiple users like UP]]',
          },
        },
      },
    })

    const user0_likeUp = await noteEmojiModel.upsertLike({
      userId: TESTUSERS[0].id,
      liked: true,
      subj: { subjId: note.id, code: 'UP' },
    })
    expect(user0_likeUp.map(f)).toMatchInlineSnapshot(`
      Array [
        Object {
          "code": "UP",
          "liked": true,
          "nUps": 1,
          "userId": "testuser0",
        },
      ]
    `)

    const emojiId = user0_likeUp[0].emoji.id
    expect(emojiId).not.toBeUndefined()

    const user1_likeUp = await noteEmojiModel.upsertLike({
      userId: TESTUSERS[1].id,
      liked: true,
      emojiId,
    })
    expect(user1_likeUp.map(f)).toMatchInlineSnapshot(`
      Array [
        Object {
          "code": "UP",
          "liked": true,
          "nUps": 2,
          "userId": "testuser1",
        },
      ]
    `)

    const user1_unlikeUp = await noteEmojiModel.upsertLike({
      userId: TESTUSERS[1].id,
      liked: false,
      emojiId,
    })
    expect(user1_unlikeUp.map(f)).toMatchInlineSnapshot(`
      Array [
        Object {
          "code": "UP",
          "liked": false,
          "nUps": 1,
          "userId": "testuser1",
        },
      ]
    `)

    const user0_unlikeUp = await noteEmojiModel.upsertLike({
      userId: TESTUSERS[0].id,
      liked: false,
      emojiId,
    })
    expect(user0_unlikeUp.map(f)).toMatchInlineSnapshot(`
      Array [
        Object {
          "code": "UP",
          "liked": false,
          "nUps": 0,
          "userId": "testuser0",
        },
      ]
    `)
  })
})
