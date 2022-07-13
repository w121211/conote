import { Search } from '../../src/interfaces'

const searchHitSymbols: Search['hits'] = [
  // { id: '3zRRf0i5iB', note: { symbol: 'Apple' } },
  // { id: 'x6F8ffEA4z', note: { symbol: 'Banana' } },
  // { id: 'Inz8albP1X', note: { symbol: 'Campfire' } },
  // { id: 'Fm5HyxvyVe', note: { symbol: 'DOM' } },
  // { id: 'ZM3Ffvg6EM', note: { symbol: 'Elephant' } },
  { id: '3zRRf0i5iB', str: 'Apple' },
  { id: 'x6F8ffEA4z', str: 'Banana' },
  { id: 'Inz8albP1X', str: 'Campfire' },
  { id: 'Fm5HyxvyVe', str: 'DOM' },
  { id: 'ZM3Ffvg6EM', str: 'Elephant' },
]

export const mockSearchHit = {
  symbols: searchHitSymbols,
}
