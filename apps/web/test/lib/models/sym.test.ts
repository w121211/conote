/**
 * yarn run test-lib sym.test
 */
import { SymModel } from '../../../lib/models/sym-model'

it('SymModel.getAll()', async () => {
  const symbols = await SymModel.getAll()
  expect(symbols.map(e => e.symbol)).toEqual([
    '$AAA',
    '$ABB',
    '$ACC',
    '$BBB',
    '$CCC',
    '$DDD',
    '[[Apple]]',
    '[[Google]]',
    '[[蘋果]]',
    '[[估狗]]',
    '[[Apple love Google]]',
    '[[Google hate Apple]]',
  ])
})
