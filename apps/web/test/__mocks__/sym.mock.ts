import { Sym } from '@prisma/client'
import { mockLinks } from './link.mock'

// export const TEST_SYMBOLS = [
//   { name: '$AAA', cat: SymbolCat.TICKER },
//   { name: '$ABB', cat: SymbolCat.TICKER },
//   { name: '$ACC', cat: SymbolCat.TICKER },
//   { name: '$BBB', cat: SymbolCat.TICKER },
//   { name: '$CCC', cat: SymbolCat.TICKER },
//   { name: '$DDD', cat: SymbolCat.TICKER },
//   { name: '[[Apple]]', cat: SymbolCat.TOPIC },
//   { name: '[[Google]]', cat: SymbolCat.TOPIC },
//   { name: '[[蘋果]]', cat: SymbolCat.TOPIC },
//   { name: '[[估狗]]', cat: SymbolCat.TOPIC },
//   { name: '[[Apple love Google]]', cat: SymbolCat.TOPIC },
//   { name: '[[Google hate Apple]]', cat: SymbolCat.TOPIC },
// ]

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
    symbol: mockLinks[0].url,
    type: 'URL',
    linkId: mockLinks[0].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
