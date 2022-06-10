import { setEntities } from '@ngneat/elf-entities'
import { Doc } from '../../src/interfaces'
import { docRepo, docsStore } from '../../src/stores/doc.repository'

const base: Doc = {
  uid: '',
  symbol: '',
  branch: 'branch',
  domain: 'domain',
  contentHead: {},
  blockUid: 'blockUid',
}

const mockDocs: Doc[] = [
  {
    ...base,
    uid: '1',
    symbol: 'symbol_1',
  },
  {
    ...base,
    uid: '2',
    symbol: 'symbol_2',
  },
]

describe('docRepo', () => {
  beforeEach(() => {
    docsStore.update(setEntities(mockDocs))
  })

  it('find doc by symbol', () => {
    expect(docRepo.findDoc('symbol_1')?.uid).toMatchInlineSnapshot(`"1"`)
    expect(docRepo.findDoc('symbol_2')?.uid).toMatchInlineSnapshot(`"2"`)
    expect(docRepo.findDoc('symbol_not_exist')?.uid).toMatchInlineSnapshot(
      `undefined`,
    )
  })
})
