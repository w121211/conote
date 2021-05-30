import { resolve } from 'path'
import Prism from 'prismjs'
import { splitByUrl, tokenizeSection, GRAMMAR } from '../parser'
import { load, omitUndefined } from '../test-helper'

describe('Card grammar', () => {
  it('tokenize list', () => {
    const t = `[111]
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
- kkk
`
    // kkk 不會被識別出來
    expect(omitUndefined(Prism.tokenize(t, GRAMMAR))).toMatchSnapshot()
  })

  test.each(['[111]<AAA><BBB>', '[111] <AAA> <BBB>', '[111] <AAA> <BBB> CCC'])('tokenize vote-choice', (t: string) => {
    expect(omitUndefined(Prism.tokenize(t, GRAMMAR))).toMatchSnapshot()
  })
})

describe('Parser', () => {
  // it('use url to split text to sections', () => {
  //   const text = [
  //     'https://www.youtube.com/watch?v=qSYGlOZNUCw\n',
  //     '$AAAA\n\n',
  //     'https://www.youtube.com/watch?v=kprnW5VadnY&list=WL&index=53\n',
  //     '$BBBB\n',
  //   ].join('')
  //   expect(splitByUrl(text)).toEqual([
  //     [undefined, ''],
  //     ['https://www.youtube.com/watch?v=qSYGlOZNUCw', '\n$AAAA\n\n'],
  //     ['https://www.youtube.com/watch?v=kprnW5VadnY&list=WL&index=53', '\n$BBBB\n'],
  //   ])
  // })

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
