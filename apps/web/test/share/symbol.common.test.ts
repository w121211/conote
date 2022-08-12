import { parseSymbol } from '../../share/symbol.common'

const urls = [
  'https://stackoverflow.com/questions/66032487/jest-expect-to-array-contains-element',
  'https://www.google.com/search?q=%E6%8B%AC%E8%99%9F+%E8%8B%B1%E6%96%87&rlz=1C5CHFA_enTW989TW990&sxsrf=ALiCzsZg1ePnGqgxfIIrMoiIGOvS_GbZpw%3A1659767590131&ei=JgvuYtfBB8WB2roP1JO6sAQ&ved=0ahUKEwjX7PmMzLH5AhXFgFYBHdSJDkYQ4dUDCA4&uact=5&oq=%E6%8B%AC%E8%99%9F+%E8%8B%B1%E6%96%87&gs_lcp=Cgdnd3Mtd2l6EAMyBQgAEMQCMgUIABCABDIECAAQHjIGCAAQHhAPMgYIABAeEA8yBggAEB4QDzIECAAQHjIGCAAQHhAPMgYIABAeEA8yBAgAEB46BwgjELADECc6BwgAEEcQsAM6BAgAEEM6CwgAEIAEELEDEIMBOggIABCABBCxAzoFCC4QgAQ6CwguEIAEEMcBENEDOgcIABAeEMkDOgcIIxDqAhAnOggILhCABBDUAjoLCC4QgAQQxwEQrwFKBAhBGABKBAhGGABQ8AJYux5g6CBoB3ABeACAAZsBiAGnEZIBBDAuMTiYAQCgAQGwAQrIAQrAAQE&sclient=gws-wiz',
]

const samples = {
  topic: {
    okay: [
      '[[Hello world 123]]',
      '[[みんなの日本語 Min na no ni hon go]]',
      '[[Punctuations allowed , . - _ () ]]',
    ],
    fail: [
      '[One bracket]',
      '[[[Triple bracket]]]',
      '[[Braket inside [ content]]',
      '[[New line \n]]',
    ],
  },
  url: {
    okay: urls.map(e => `[[${e}]]`),
    fail: urls,
  },
}

describe('parseSymbol()', () => {
  test.each(samples.url.okay)('parse topic-like url: %s', input => {
    expect(parseSymbol(input).type).toEqual('URL')
  })

  test.each(samples.url.fail)('throws for url: %s', input => {
    expect(() => parseSymbol(input)).toThrow()
  })

  it('throws for url', () => {
    expect(() =>
      parseSymbol(
        'https://stackoverflow.com/questions/66032487/jest-expect-to-array-contains-element',
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Symbol format is not recognized: https://stackoverflow.com/questions/66032487/jest-expect-to-array-contains-element"`,
    )
  })

  it('parse topic-like url, [[https://...]]', () => {
    expect(parseSymbol('[[https://github.com/streamich/react-use]]'))
      .toMatchInlineSnapshot(`
      Object {
        "symbol": "[[https://github.com/streamich/react-use]]",
        "type": "URL",
        "url": "https://github.com/streamich/react-use",
      }
    `)

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
      `"Symbol format is not recognized: [Hello]"`,
    )
    expect(() => f('[[[Hello]]]')).toThrowErrorMatchingInlineSnapshot(
      `"Symbol format is not recognized: [[[Hello]]]"`,
    )
    expect(() => f('[[He[llo]]')).toThrowErrorMatchingInlineSnapshot(
      `"Symbol format is not recognized: [[He[llo]]"`,
    )
    expect(() => f('[[He[]o]]')).toThrowErrorMatchingInlineSnapshot(
      `"Symbol format is not recognized: [[He[]o]]"`,
    )
  })
})
