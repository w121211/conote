/* eslint-disable no-useless-escape */
import { resolve } from 'path'
import omitDeep from 'omit-deep-lodash'
import { tokenizeSection } from '../parser'
import { Markerline, MarkToConnectedContentRecord } from '../typing'
import { TextEditor, insertMarkerlinesToBody, updateMarkerlines } from '../editor'
import { load, FakeChance } from '../test-helper'

/**
 * mock module & typescript的血淚經驗：
 * 1. 不要使用'./__mocks__'，typescript跟他非常不合，各種問題
 * 2. 'ts-jest/utils'有個mocked，但mock-class的情況會變成要求implement所有的class-function，非常不實際
 * 3. 目前的方法是mockFactory，會無法reset mocks，test-case中的數值會持續累積，原因不明
 * 4. 為了解決，現在是把chance放入editor class內，每次新開一個editor就會新創一個chance，
 *    有點冗余，也額外加了需要將chance帶入function-params的情況
 * 5. 不過未來也需要考慮到stamp-id不能重複的問題，總之先暫時這樣處理
 * 6. 也許可以將chance.string()放入helper.ts，然後mock那個helper
 */
jest.mock('chance', () => {
  return {
    Chance: jest.fn().mockImplementation(() => {
      return {
        i: 0,
        string(): string {
          const str = this.i.toString(36).padStart(3, '0')
          this.i += 1
          if (this.i >= 36 * 36 * 36) {
            this.i = 0
          }
          return str
        },
      }
    }),
  }
})

describe('updateMarkerlines()', () => {
  const text = `[~]
[?] a inline value
[+]
a line value
[-]`
  const starter = updateMarkerlines(
    [],
    tokenizeSection(text),
    new FakeChance(),
    //   src?: string,
    // oauthor?: string,
  )

  // beforeEach(() => {})

  it('parse text to markerlines', () => {
    expect(starter.markerheaders).toMatchSnapshot()
    expect(starter.markerlines).toMatchSnapshot()
  })

  it('parse swaped lines', () => {
    const t1 = `[~]
[+]
a line value %001
[?] a inline value %000
[-]`
    const parsed1 = updateMarkerlines(starter.markerlines, tokenizeSection(t1), new FakeChance())
    expect(parsed1.markerlines).toMatchSnapshot()
  })

  it('parse new added lines', () => {
    const t1 = `[~]
[?] a inline value %000
[+]
111 111 %001
222 222
[-]
333 333`
    const parsed1 = updateMarkerlines(starter.markerlines, tokenizeSection(t1), new FakeChance())
    expect(parsed1.markerlines).toMatchSnapshot()
  })
})

describe('insertMarkerlinesToBody()', () => {
  const starterBody = `[~]
[?] inline inline inline
[+]
111 111
[-]
[多了空格1]\s
[多了空格2]\s
多了空格2.1 多了空格2.1 多了空格2.1
多了空格2.2 多了空格2.2 多了空格2.2
`
  const starter = updateMarkerlines([], tokenizeSection(starterBody), new FakeChance())

  it('insert markerline to existed marker-header', () => {
    const [body, markerlines] = insertMarkerlinesToBody(
      starter.markerheaders,
      starter.markerlines,
      starterBody,
      [
        {
          linenumber: 10,
          str: 'insert insert insert',
          marker: {
            key: '[+]',
            value: 'insert insert insert',
          },
        },
      ],
      new FakeChance(),
    )
    expect(body).toMatchSnapshot()
    expect(markerlines).toMatchSnapshot()
  })

  it('insert markerline to non existed marker-header', () => {
    //   const cur: Markerline[] = [
    //   ]
    // body: string,
    // insert: Markerline[],
    // chance: { string: (a: any) => string },
    //   insertMarkerlinesToBody()
  })

  it('insert inline markerline', () => {
    //   const cur: Markerline[] = [
    //   ]
    // body: string,
    // insert: Markerline[],
    // chance: { string: (a: any) => string },
    //   insertMarkerlinesToBody()
  })
})

describe('Basic TextEditor (not use sample data)', () => {
  // beforeEach(() => {})
  const data: Record<string, any> = {
    symbolStarter: `[~]
[?]<買> vs <賣>？
[+]
[-]`,
    symbolStarterConn: { '[?]': { poll: true, commentId: 3, pollId: 10 } },
    webStarter: `[~] [[生物技術]]
[+]
@ARK開倉
@巴菲特2020Q4加倉
[-]`,
  }

  let symbolStarter: TextEditor
  let webStarter: TextEditor

  beforeEach(() => {
    symbolStarter = new TextEditor()
    symbolStarter.setBody(data.symbolStarter)
    symbolStarter.flush()

    webStarter = new TextEditor()
    webStarter.setBody(data.webStarter)
    webStarter.flush()
  })

  it('add stamps to inline value', () => {
    expect(symbolStarter.getBody()).toMatchSnapshot()
    expect(symbolStarter.getMarkerlines()).toMatchSnapshot()
  })

  it('parse stamped inline value', () => {
    const blank = new TextEditor(symbolStarter.toStoredText())
    blank.flush()
    expect(blank.getSections()).toMatchSnapshot()
  })

  it('add connected contents', () => {
    symbolStarter.addConnectedContents(data.symbolStarterConn)
    expect(symbolStarter.getBody()).toMatchSnapshot()
    expect(symbolStarter.getMarkerlines()).toMatchSnapshot()
  })

  it('insert markerlines to a blank editor', () => {
    const blank = new TextEditor()
    blank.setMarkerlinesToInsert(symbolStarter.getMarkerlines())
    blank.flush()
    expect(blank.getBody()).toMatchSnapshot()
    expect(blank.getMarkerlines()).toMatchSnapshot()
  })

  it('insert markerlines to an editxor with existed value', () => {
    symbolStarter.setMarkerlinesToInsert(webStarter.getMarkerlines())
    symbolStarter.flush()
    expect(symbolStarter.getBody()).toMatchSnapshot()
    expect(symbolStarter.getMarkerlines()).toMatchSnapshot()
  })

  it('insert markerlines to an editxor with existed value and connected contents', () => {
    symbolStarter.addConnectedContents(data.symbolStarterConn)
    symbolStarter.setMarkerlinesToInsert([
      {
        linenumber: 0,
        str: ' [[生物技術]]',
        marker: { key: '[~]', value: '[[生物技術]]' },
        new: true,
        stampId: '%000',
      },
    ])
    symbolStarter.flush()
    expect(symbolStarter.getBody()).toMatchSnapshot()
    expect(symbolStarter.getMarkerlines()).toMatchSnapshot()
  })
})

describe('TextEditor use sample data', () => {
  afterEach(() => {
    // jest.restoreAllMocks()
    // jest.resetModules()
    // jest.clearAllMocks()
    // jest.resetAllMocks()
  })

  it('does basic edit', () => {
    const editor0 = new TextEditor(
      `[{"linenumber":1,"str":"[~]","marker":{"mark":"[~]"}},{"linenumber":2,"str":"[?]","marker":{"mark":"[?]"}},{"linenumber":2,"str":"<買> vs <賣>？","marker":{"mark":"[?]","value":"<買> vs <賣>？"},"src":"some.source","oauthor":"@someauthor","stampId":"%100","poll":true,"pollId":10,"commentId":3},{"linenumber":3,"str":"[+]","marker":{"mark":"[+]"}},{"linenumber":4,"str":"[-]","marker":{"mark":"[-]"}}]
[~]
[?]<買> vs <賣>？ %100
[+]
[-]`,
    )

    const editor1 = new TextEditor(editor0.toStoredText(), 'some.source', '@someauthor')
    editor1.setBody(`
[?]<買> vs <賣>？ %100
[~] [[生物技術]]
[+]
@ARK開倉
@巴菲特2020Q4加倉
[-]`)
    editor1.flush()
    expect(editor1.getBody()).toMatchSnapshot()
    expect(editor1.getMarkerlines()).toMatchSnapshot()
  })

  it('get nested markerlines', () => {
    const editor = new TextEditor(undefined, 'some.src', '@someauthor')
    editor.setBody(`$ABBV
[~] [[生物技術]]
[+]
@ARK開倉
@巴菲特2020Q4加倉`)
    editor.flush()

    const [cardlabel, markerlines] = editor.getNestedMarkerlines()[0]
    // expect(cardlabel).toBe({ oauthor: '@someauthor', symbol: '$ABBV' })
    expect(markerlines).toMatchSnapshot()

    const nestedEditor = new TextEditor(
      `[{"linenumber":1,"str":"[~]","marker":{"mark":"[~]"}},{"linenumber":2,"str":"[?]","marker":{"mark":"[?]"}},{"linenumber":2,"str":"<買> vs <賣>？","marker":{"mark":"[?]","value":"<買> vs <賣>？"},"src":"some.source","oauthor":"@someauthor","stampId":"%100","poll":true,"pollId":10,"commentId":3},{"linenumber":3,"str":"[+]","marker":{"mark":"[+]"}},{"linenumber":4,"str":"[-]","marker":{"mark":"[-]"}}]
[~]
[?]<買> vs <賣>？ %100
[+]
[-]`,
    )
    nestedEditor.setMarkerlinesToInsert(markerlines.filter(e => e.new))
    nestedEditor.flush()
    expect(nestedEditor.getMarkerlines()).toMatchSnapshot()
  })

  it.each<string>(['[=]\n[?]買 vs 賣？\n[+]\n[-]\n', '$AAA\n[=]\n[?]買 vs 賣？\n[+]\n[-]\n'])(
    'attach markerlines to tokens',
    (body: string) => {
      const conn: MarkToConnectedContentRecord = { '[?]': { poll: true, commentId: 3, pollId: 10 } }

      const editor = new TextEditor(undefined, 'a.source', '@oauthor')
      editor.setBody(body)
      editor.flush()
      editor.addConnectedContents(conn)
      editor.flush({ attachMarkerlinesToTokens: true })

      expect(editor.getSections()).toMatchSnapshot()
    },
  )

  it('edit text from previous stored text', () => {
    const prevCases = load(resolve(__dirname, '__samples', 'edit-previous.txt'))

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

  it.each<[string, string]>(load(resolve(__dirname, '__samples', 'generate-markerlines.txt')))(
    'generate markerline',
    (url: string, body: string) => {
      const editor = new TextEditor('[]\n', url, '@oauthor')
      editor.setBody(body)
      editor.flush()
      expect(editor.getBody()).toMatchSnapshot()
      expect(editor.getMarkerlines()).toMatchSnapshot()
    },
  )

  it('insert markerlines', () => {
    let blank = new TextEditor('[]\n', undefined, undefined)
    for (const [url, body] of load(resolve(__dirname, '__samples', 'insert-markerlines.txt'))) {
      const cur = new TextEditor('[]\n', url, undefined)
      cur.setBody(body)
      cur.flush()

      blank = new TextEditor(blank.toStoredText())
      for (const [cardlabel, markerlines] of cur.getNestedMarkerlines()) {
        blank.setMarkerlinesToInsert(markerlines.filter(e => e.new))
        blank.flush()
      }
    }
    expect(blank.getBody()).toMatchSnapshot()
    expect(blank.getMarkerlines()).toMatchSnapshot()
  })

  it.each<[string, string]>(load(resolve(__dirname, '__samples', 'common.txt')))(
    'handle common cases',
    (url: string, body: string) => {
      const editor = new TextEditor('[]\n', url)
      editor.setBody(body)
      editor.flush()
      expect(editor.getBody()).toMatchSnapshot()
    },
  )
})
