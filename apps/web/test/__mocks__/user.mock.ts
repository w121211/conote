import type { User } from '@prisma/client'

if (process.env.APP_BOT_EMAIL === undefined) {
  throw new Error('Not found APP_BOT_EMAIL')
}

export const mockBotUser: User = {
  id: 'bot',
  // email: getBotEmail(),
  email: process.env.APP_BOT_EMAIL,
}

export const mockUsers: User[] = [
  { id: 'testuser0', email: 'aaa@aaa.com' },
  { id: 'testuser1', email: 'bbb@bbb.com' },
  { id: 'testuser2', email: 'ccc@ccc.com' },
  { id: 'testuser3', email: 'ddd@ddd.com' },
  { id: 'testuser4', email: 'eee@eee.com' },
]
