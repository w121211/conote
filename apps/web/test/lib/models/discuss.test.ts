import prisma from '../../../lib/prisma'
import { clean, TESTUSERS } from '../../test-helpers'

const tempNoteId = 'a-temp-note-id'

beforeAll(async () => {
  await prisma.note.upsert({
    create: {
      id: tempNoteId,
      sym: { create: { type: 'TICKER', symbol: 'TEMP' } },
    },
    update: {},
    where: { id: tempNoteId },
  })
})

it('', async () => {
  const discuss = await prisma.discuss.create({
    data: {
      user: { connect: { id: TESTUSERS[0].id } },
      //   notes: noteId ? { connect: [{ id: noteId }] } : undefined,
      // notes: undefined,
      notes: { connect: [{ id: tempNoteId }] },
      meta: {},
      title: 'this is a title',
      content: undefined,
      // choices: data.choices,
      count: { create: {} },
    },
    include: { count: true },
  })
})
