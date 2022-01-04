import { readFileSync } from 'fs'
import { resolve, join } from 'path'
import Prism from 'prismjs'
import { splitByUrl, tokenizeSection, GRAMMAR } from '../parser'
import { load, omitUndefined } from '../test-helper'

describe('Card grammar', () => {
  it('tokenize list', () => {
    const t = `
[111]
aaa
- bbb
- ccc
ddd
eee
- fff
- ggg

[222]
- hhh
- iii
jjj
- kkk`.trim()
    // kkk 不會被識別出來
    expect(omitUndefined(Prism.tokenize(t, GRAMMAR))).toMatchSnapshot()
  })

  test.each(['[111]<AAA><BBB>', '[111] <AAA> <BBB>', '[111] <AAA> <BBB> CCC'])('tokenize vote-choice', (t: string) => {
    expect(omitUndefined(Prism.tokenize(t, GRAMMAR))).toMatchSnapshot()
  })
})

describe('Parser', () => {
  it('splitByUrl()', () => {
    expect(
      splitByUrl(
        [
          'https://www.youtube.com/watch?v=qSYGlOZNUCw\n\n\n',
          '$AAAA\n\nBBB\nCCC\n\n',
          'https://www.youtube.com/watch?v=kprnW5VadnY&list=WL&index=53\n',
          '$BBBB\nCCC\nDDD\n\n',
        ].join(''),
      ),
    ).toEqual([
      ['https://www.youtube.com/watch?v=qSYGlOZNUCw', '$AAAA\n\nBBB\nCCC'],
      ['https://www.youtube.com/watch?v=kprnW5VadnY&list=WL&index=53', '$BBBB\nCCC\nDDD'],
    ])

    expect(
      splitByUrl(
        [
          '\n\n',
          'https://www.youtube.com/watch?v=qSYGlOZNUCw\n\n\n',
          '$AAAA\n\n',
          'https://www.youtube.com/watch?v=kprnW5VadnY&list=WL&index=53\n',
          '$BBBB\nCCC\nDDD\n\n',
        ].join(''),
      ),
    ).toEqual([
      ['https://www.youtube.com/watch?v=qSYGlOZNUCw', '$AAAA'],
      ['https://www.youtube.com/watch?v=kprnW5VadnY&list=WL&index=53', '$BBBB\nCCC\nDDD'],
    ])
  })

  // it('tokenize inline-marker', () => {
  //   const a = '[=] [[大數據]] [[SaaS]]'
  //   expect(tokenizeSection(a)[0].stream).toMatchSnapshot()
  // })

  it.each<[string, string]>(load(resolve(__dirname, '__samples__', 'common.txt')))(
    'tokenizeSection()',
    (url: string, body: string) => {
      expect(omitUndefined(tokenizeSection(body))).toMatchSnapshot()
    },
  )
})
