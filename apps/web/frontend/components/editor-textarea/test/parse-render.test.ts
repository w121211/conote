import { InlineItem } from '../src/interfaces'
import { parseBlockString } from '../src/parse-render'
import { mockBlockStr } from './__mocks__/mock-block-str'

function parse_(s: string): Omit<InlineItem, 'token'>[] {
  return parseBlockString(s).inlineItems.map(e => {
    delete (e as any).token
    return e
  })
}

it('parse symbol-title', () => {
  expect(parse_(mockBlockStr.symbolTitle)).toMatchInlineSnapshot(`
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

it('parse discuss', () => {
  expect(parse_(mockBlockStr.discussMock)).toMatchInlineSnapshot(`
    Array [
      Object {
        "id": "mock_discuss_0_active",
        "str": "#Recommend tutorials resources on Clojure for begginners?-mock_discuss_0_active#",
        "title": "Recommend tutorials resources on Clojure for begginners?",
        "type": "inline-discuss",
      },
    ]
  `)

  expect(parse_(mockBlockStr.discussNew)).toMatchInlineSnapshot(`
    Array [
      Object {
        "str": "#Recommend tutorials/resources on Clojure for begginners?#",
        "type": "text",
      },
    ]
  `)
})
