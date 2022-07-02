import faker from '@faker-js/faker'
import type { Discuss, DiscussPost } from '@prisma/client'
import { mockUsers } from './mock-user'

type DiscussParsed = Omit<Discuss, 'meta'> & {
  meta: object
}

const base: Omit<DiscussParsed, 'draftId' | 'createdAt' | 'updatedAt'> = {
  id: '',
  // draftId: '',
  userId: '',
  type: 'DISCUSS',
  status: 'ACTIVE',
  meta: {},
  title: faker.lorem.lines(1),
  content: faker.lorem.paragraph(),
}

export const mockDiscusses = (
  draftId: string,
): Omit<DiscussParsed, 'createdAt' | 'updatedAt'>[] => [
  {
    ...base,
    id: 'mock_discuss_0_active',
    // draftId: mockNoteDrafts[0].id,
    draftId,
    userId: mockUsers[0].id,
    status: 'ACTIVE',
    title: faker.lorem.lines(1),
    content: faker.lorem.paragraph(),
  },
  {
    ...base,
    id: 'mock_discuss_1_draft',
    // draftId: mockNoteDrafts[0].id,
    draftId,
    userId: mockUsers[1].id,
    status: 'DRAFT',
    title: faker.lorem.lines(1),
    content: null,
  },
  {
    ...base,
    id: 'mock_discuss_2_archive',
    // draftId: mockNoteDrafts[0].id,
    draftId,
    userId: mockUsers[2].id,
    status: 'ARCHIVE',
    title: faker.lorem.lines(1),
    content: faker.lorem.paragraph(),
  },
]

const mockDiscusses_ = mockDiscusses('')

export const mockDiscussPosts: DiscussPost[] = [
  {
    id: 0,
    discussId: mockDiscusses_[0].id,
    userId: mockUsers[0].id,
    status: 'ACTIVE',
    content: faker.lorem.paragraph(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 1,
    discussId: mockDiscusses_[0].id,
    userId: mockUsers[1].id,
    status: 'ACTIVE',
    content: faker.lorem.paragraph(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    discussId: mockDiscusses_[1].id,
    userId: mockUsers[2].id,
    status: 'ACTIVE',
    content: faker.lorem.paragraph(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    discussId: mockDiscusses_[1].id,
    userId: mockUsers[3].id,
    status: 'ACTIVE',
    content: faker.lorem.paragraph(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
