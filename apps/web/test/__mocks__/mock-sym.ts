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
    symbol: '[[Apple]]',
    type: 'TOPIC',
    linkId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-sym-1',
    symbol: '[[Google]]',
    type: 'TOPIC',
    linkId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-sym-2_ticker',
    symbol: '$BA',
    type: 'TICKER',
    linkId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-sym-3_link',
    symbol: mockLinks[0].url,
    type: 'URL',
    linkId: mockLinks[0].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
