import { readFileSync } from 'fs'
import { resolve } from 'path'
import { splitByUrl, tokenizeSection } from '../src/parser'
import { TextEditor } from '../src/editor'
import { MarkToConnectedContentRecord } from '../src/typing'

function load(filepath: string): [string, string][] {
  return (
    splitByUrl(readFileSync(filepath, { encoding: 'utf8' }))
      .filter((e): e is [string, string] => e[0] !== undefined)
      // .map(e => [e[0], `\n${e[1].trim()}`])
      .map(e => [e[0], e[1].trim()])
  )
}

describe('Parser', () => {
  it('use url to split text to sections', () => {
    const a =
      'https://www.youtube.com/watch?v=qSYGlOZNUCw\n$AAAA\n\nhttps://www.youtube.com/watch?v=kprnW5VadnY&list=WL&index=53\n$BBBB\n'
    expect(splitByUrl(a)).toEqual([
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
            marker: { mark: '[=]' },
          },
          {
            type: 'inline-value',
            alias: undefined,
            length: 17,
            linenumber: 0,
            marker: {
              mark: '[=]',
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

  it.each<[string, string]>(load(resolve(__dirname, 'test-cases', 'common.txt')))(
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

describe('TextEditor', () => {
  beforeEach(() => {
    // jest.resetModules()
  })

  it.each<[string, MarkToConnectedContentRecord]>([
    [
      '[key]\n[?]買 vs 賣？\n[+]\n[-]\n[Alternative]\n[Q]\n[Comment]這是一個comment',
      { '[Comment]': { comment: true, commentId: 3 } },
    ],
    [
      '[key]\n[?:poll]<買> vs <賣>？\n[+]\n[-]\n[Alternative]\n[Q]',
      { '[?:poll]': { poll: true, commentId: 3, pollId: 10 } },
    ],
  ])('add connected contents', (body: string, conn: MarkToConnectedContentRecord) => {
    const editor = new TextEditor(undefined, 'a.source', '@oauthor')
    editor.setBody(body)
    editor.flush()
    editor.addConnectedContents(conn)

    expect(editor.getBody()).toMatchSnapshot()
    expect(editor.getMarkerLines()).toMatchSnapshot()
  })

  it.each<string>(['[=]\n[?]買 vs 賣？\n[+]\n[-]\n', '$AAA\n[=]\n[?]買 vs 賣？\n[+]\n[-]\n'])(
    'embed markerlines to tokens',
    (body: string) => {
      const conn: MarkToConnectedContentRecord = { '[?]': { comment: true, commentId: 3 } }

      const editor = new TextEditor(undefined, 'a.source', '@oauthor')
      editor.setBody(body)
      editor.flush()
      editor.addConnectedContents(conn)
      editor.flush({ embedMarkerlinesToTokens: true })
      expect(editor.getSections()).toMatchSnapshot()
    },
  )

  it('edit text from previous stored text', () => {
    const prevCases = load(resolve(__dirname, 'test-cases', 'edit-previous.txt'))

    let prev: string | undefined
    for (const [url, body] of prevCases) {
      const editor = new TextEditor(prev, url, undefined)
      editor.setBody(body)
      editor.flush()
      prev = editor.toStoredText()
      expect(editor.getBody()).toMatchSnapshot()
      // expect(editor.getMarkerLines()).toMatchSnapshot()
    }
  })

  // it.each<[string, string]>(nestedCases)('會辨識nested ticker', (url: string, body: string) => {
  //   const editor = new TextEditor('[]\n', url)
  //   editor.setBody(body)
  //   editor.flush()
  //   // expect(editor.getBody()).toMatchSnapshot()
  //   for (const [card, markerlines] of editor.getNestedMarkerLines()) {
  //     expect(card).toMatchSnapshot()
  //   }
  // })

  it.each<[string, string]>(load(resolve(__dirname, 'test-cases', 'generate-markerlines.txt')))(
    'generate markerline',
    (url: string, body: string) => {
      const editor = new TextEditor('[]\n', url, '@oauthor')
      editor.setBody(body)
      editor.flush()
      expect(editor.getBody()).toMatchSnapshot()
      expect(editor.getMarkerLines()).toMatchSnapshot()
    },
  )

  it('insert markerlines', () => {
    let blank = new TextEditor('[]\n', undefined, undefined)
    for (const [url, body] of load(resolve(__dirname, 'test-cases', 'insert-markerlines.txt'))) {
      const cur = new TextEditor('[]\n', url, undefined)
      cur.setBody(body)
      cur.flush()

      blank = new TextEditor(blank.toStoredText())
      for (const [cardlabel, markerlines] of cur.getNestedMarkerLines()) {
        blank.setMarkerlinesToInsert(markerlines.filter(e => e.new))
        blank.flush()
      }
    }
    expect(blank.getBody()).toMatchSnapshot()
    expect(blank.getMarkerLines()).toMatchSnapshot()
  })

  it.each<[string, string]>(load(resolve(__dirname, 'test-cases', 'common.txt')))(
    'handle common cases',
    (url: string, body: string) => {
      const editor = new TextEditor('[]\n', url)
      editor.setBody(body)
      editor.flush()
      expect(editor.getBody()).toMatchSnapshot()
    },
  )
})
