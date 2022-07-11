import { parseSymbol } from '../../share/symbol.common'

describe('parseSymbol', () => {
  it('parse topic-like url, [[https://...]]', () => {
    expect(parseSymbol('[[https://github.com/streamich/react-use]]'))
      .toMatchInlineSnapshot(`
      Object {
        "symbol": "[[https://github.com/streamich/react-use]]",
        "type": "URL",
        "url": "https://github.com/streamich/react-use",
      }
    `)
  })

  it('parse topic, [[...]]', () => {
    const f = (s: string) => parseSymbol(s).type

    expect(f('[[Hello world]]')).toMatchInlineSnapshot(`"TOPIC"`)
    expect(f('[[Punctuation .!#?_-]]')).toMatchInlineSnapshot(`"TOPIC"`)
    expect(f('[[Language 測試]]')).toMatchInlineSnapshot(`"TOPIC"`)

    expect(() => f('[Hello]')).toThrowErrorMatchingInlineSnapshot(
      `"[parseSymbol] Symbol format is not recognized, [Hello]"`,
    )
    expect(() => f('[[[Hello]]]')).toThrowErrorMatchingInlineSnapshot(
      `"[parseSymbol] Symbol format is not recognized, [[[Hello]]]"`,
    )
    expect(() => f('[[He[llo]]')).toThrowErrorMatchingInlineSnapshot(
      `"[parseSymbol] Symbol format is not recognized, [[[Hello]]]"`,
    )
    expect(() => f('[[He[]o]]')).toThrowErrorMatchingInlineSnapshot(
      `"[parseSymbol] Symbol format is not recognized, [[[Hello]]]"`,
    )
  })

  //   it('parse topic', () => {
  //     expect(parseSymbol).toMatchInlineSnapshot()
  //   })

  //   it('parse topic', () => {
  //     expect(parseSymbol).toMatchInlineSnapshot()
  //   })
})
