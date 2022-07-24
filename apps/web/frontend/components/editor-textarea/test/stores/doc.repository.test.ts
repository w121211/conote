import { setEntities } from '@ngneat/elf-entities'
import { docRepo, docsStore } from '../../src/stores/doc.repository'
import { mockDocs } from '../__mocks__/mock-doc'

beforeEach(() => {
  docsStore.update(setEntities(mockDocs))
})

it('find doc by symbol', () => {
  expect(docRepo.findDoc({ symbol: 'symbol_1' })?.uid).toMatchInlineSnapshot(
    `"1"`,
  )
  expect(docRepo.findDoc({ symbol: 'symbol_2' })?.uid).toMatchInlineSnapshot(
    `"2"`,
  )
  expect(
    docRepo.findDoc({ symbol: 'symbol_not_exist' })?.uid,
  ).toMatchInlineSnapshot(`undefined`)
})
