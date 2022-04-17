import { parse } from '../src/parse-renderer'
import { mockBlockStrDict } from './__mocks__/mock-data'

test('', () => {
  expect(parse(mockBlockStrDict.symbolTitle)).toMatchInlineSnapshot(`
    Array [
      Object {
        "str": "[[React (web framework)]]",
        "symbol": "[[React (web framework)]]",
        "type": "inline-symbol",
      },
      Object {
        "str": " in cljs",
        "type": "text",
      },
    ]
  `)
})
