import { Sym } from '@prisma/client'
import { mockLinks } from './mock-link'

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
    id: 'mock-sym-0',
    linkId: null,
    symbol: '[[Apple]]',
    type: 'TOPIC',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-sym-1',
    linkId: null,
    symbol: '[[Google]]',
    type: 'TOPIC',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-sym-2_ticker',
    linkId: null,
    symbol: '$BA',
    type: 'TICKER',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-sym-3_link',
    linkId: mockLinks[0].id,
    symbol: mockLinks[0].url,
    type: 'URL',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
