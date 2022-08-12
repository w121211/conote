import { Sym } from '@prisma/client'
import { mockLinks } from './link.mock'

export const mockSyms: Sym[] = [
  {
    id: '0-topic',
    symbol: '[[Apple]]',
    type: 'TOPIC',
    linkId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '1-topic',
    symbol: '[[Google]]',
    type: 'TOPIC',
    linkId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2-ticker',
    symbol: '$BA',
    type: 'TICKER',
    linkId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3-url',
    symbol: `[[${mockLinks[0].url}]]`,
    type: 'URL',
    linkId: mockLinks[0].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4-topic',
    symbol: '[[A tester of rename topic]]',
    type: 'TOPIC',
    linkId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
