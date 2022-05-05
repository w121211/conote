import { Sym } from '@prisma/client'

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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-sym-1',
    symbol: '[[Google]]',
    type: 'TOPIC',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-sym-2',
    symbol: '$BA',
    type: 'TICKER',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-sym-3-link',
    symbol: 'www.link.com',
    type: 'URL',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
