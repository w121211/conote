import { User } from '@prisma/client'
import { getBotEmail } from '../../lib/models/user.model'

export const mockBotUser: User = {
  id: 'bot',
  email: getBotEmail(),
}

export const mockUsers: User[] = [
  { id: 'testuser0', email: 'aaa@aaa.com' },
  { id: 'testuser1', email: 'bbb@bbb.com' },
  { id: 'testuser2', email: 'ccc@ccc.com' },
  { id: 'testuser3', email: 'ddd@ddd.com' },
  { id: 'testuser4', email: 'eee@eee.com' },
]
