import { resolve } from 'path'
import { splitByUrl, tokenizeSection } from '../parser'
import { load } from '../test-helper'

describe('Parser', () => {
  it('use url to split text to sections', () => {
    const text = [
      'https://www.youtube.com/watch?v=qSYGlOZNUCw\n',
      '$AAAA\n\n',
      'https://www.youtube.com/watch?v=kprnW5VadnY&list=WL&index=53\n',
      '$BBBB\n',
    ].join('')
    expect(splitByUrl(text)).toEqual([
      [undefined, ''],
      ['https://www.youtube.com/watch?v=qSYGlOZNUCw', '\n$AAAA\n\n'],
      ['https://www.youtube.com/watch?v=kprnW5VadnY&list=WL&index=53', '\n$BBBB\n'],
    ])
  })

  it('tokenize inline-marker', () => {
    const a = '[=] [[大數據]] [[SaaS]]'
    expect(tokenizeSection(a)[0].stream).toEqual([
      {
        type: 'inline-marker',
        alias: undefined,
        length: 20,
        linenumber: 0,
        content: [
          {
            type: 'inline-mark',
            alias: undefined,
            content: '[=]',
            length: 3,
            linenumber: 0,
            marker: { key: '[=]' },
          },
          {
            type: 'inline-value',
            alias: undefined,
            length: 17,
            linenumber: 0,
            marker: {
              key: '[=]',
              value: '[[大數據]] [[SaaS]]',
            },
            content: [
              ' ',
              {
                type: 'topic',
                alias: undefined,
                content: '[[大數據]]',
                length: 7,
                linenumber: 0,
              },
              ' ',
              {
                type: 'topic',
                alias: undefined,
                content: '[[SaaS]]',
                length: 8,
                linenumber: 0,
              },
            ],
          },
        ],
      },
    ])
  })

  it.each<[string, string]>(load(resolve(__dirname, '__samples', 'common.txt')))(
    'tokenize to sections',
    (url: string, body: string) => {
      const sects = tokenizeSection(body).map(e => ({
        root: e.root,
        breaker: e.breaker,
        ticker: e.ticker,
        topic: e.topic,
        nestedCard: e.nestedCard,
      }))
      expect(sects).toMatchSnapshot()
    },
  )
})
