/* eslint-disable no-useless-escape */
import { resolve } from 'path'
import { Markerline } from '../typing'
import { load, removeUndefinedFields } from '../test-helper'
import { Editor } from '../editor'

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

const symbolText = `[~]
[?] <買> vs <賣>？
[+]
[-]`

const webText = `[~] [[生物技術]]
[+]
@ARK開倉
@巴菲特2020Q4加倉
[-]`

describe('Editor basic', () => {
  let symbolStarter: Editor
  let webStarter: Editor

  beforeEach(() => {
    symbolStarter = new Editor()
    symbolStarter.setText(symbolText)
    symbolStarter.flush()
    webStarter = new Editor()
    webStarter.setText(webText)
    webStarter.flush()
  })

  it('add stamps to inline value', () => {
    expect(removeUndefinedFields(symbolStarter.getText())).toMatchSnapshot()
    expect(removeUndefinedFields(symbolStarter.getMarkerlines())).toMatchSnapshot()
  })

  it('parse stamped inline value', () => {
    const editor = new Editor(symbolStarter.getText(), symbolStarter.getMarkerlines())
    editor.flush()
    expect(removeUndefinedFields(editor.getSections())).toMatchSnapshot()
  })

  it('attach dblink', () => {
    symbolStarter.attachDblinker({
      '%000': {
        createrId: 'user-id',
        anchorId: 444,
        pollId: 111,
        commentId: 222,
        replyId: 333,
      },
    })
    expect(symbolStarter.getText()).toMatchSnapshot()
    expect(removeUndefinedFields(symbolStarter.getMarkerlines())).toMatchSnapshot()
  })

  it('insert markerlines to a blank editor', () => {
    const blank = new Editor()
    blank.setMarkerlinesToInsert(symbolStarter.getMarkerlines())
    blank.flush()
    expect(blank.getText()).toMatchSnapshot()
    expect(blank.getMarkerlines()).toMatchSnapshot()
  })

  it('insert markerlines to an editxor with existed value', () => {
    symbolStarter.setMarkerlinesToInsert(webStarter.getMarkerlines())
    symbolStarter.flush()
    expect(symbolStarter.getText()).toMatchSnapshot()
    expect(symbolStarter.getMarkerlines()).toMatchSnapshot()
  })

  it('insert markerlines to an editxor with existed value and connected contents', () => {
    // symbolStarter.addConnectedContents(data.symbolStarterConn)
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
    expect(symbolStarter.getText()).toMatchSnapshot()
    expect(symbolStarter.getMarkerlines()).toMatchSnapshot()
  })
})

describe('Editor use sample data', () => {
  it('does basic edit', () => {
    const editor0 = new Editor(
      `[{"linenumber":1,"str":"[~]","marker":{"mark":"[~]"}},{"linenumber":2,"str":"[?]","marker":{"mark":"[?]"}},{"linenumber":2,"str":"<買> vs <賣>？","marker":{"mark":"[?]","value":"<買> vs <賣>？"},"src":"some.source","oauthor":"@someauthor","stampId":"%100","poll":true,"pollId":10,"commentId":3},{"linenumber":3,"str":"[+]","marker":{"mark":"[+]"}},{"linenumber":4,"str":"[-]","marker":{"mark":"[-]"}}]
[~]
[?]<買> vs <賣>？ %100
[+]
[-]`,
    )

    const editor1 = new Editor(editor0.getText(), editor0.getMarkerlines(), 'some.source', '@someauthor')
    editor1.setText(`
[?]<買> vs <賣>？ %100
[~] [[生物技術]]
[+]
@ARK開倉
@巴菲特2020Q4加倉
[-]`)
    editor1.flush()
    expect(editor1.getText()).toMatchSnapshot()
    expect(editor1.getMarkerlines()).toMatchSnapshot()
  })

  // it.each<string>(['[=]\n[?]買 vs 賣？\n[+]\n[-]\n', '$AAA\n[=]\n[?]買 vs 賣？\n[+]\n[-]\n'])(
  //   'attach markerlines to tokens',
  //   (body: string) => {
  //     const conn: MarkToConnectedContentRecord = { '[?]': { poll: true, commentId: 3, pollId: 10 } }

  //     const editor = new Editor(undefined, undefined, 'a.source', '@oauthor')
  //     editor.setText(body)
  //     editor.flush()
  //     // editor.addConnectedContents(conn)
  //     editor.flush({ attachMarkerlinesToTokens: true })

  //     expect(editor.getSections()).toMatchSnapshot()
  //   },
  // )

  it('edit text from previous stored text', () => {
    const prevCases = load(resolve(__dirname, '__samples', 'edit-previous.txt'))

    let prev: string | undefined
    for (const [url, body] of prevCases) {
      const editor = new Editor(prev, [], url, undefined)
      editor.setText(body)
      editor.flush()
      prev = editor.getText()
      expect(editor.getText()).toMatchSnapshot()
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
      const editor = new Editor(undefined, undefined, url, '@oauthor')
      editor.setText(body)
      editor.flush()
      expect(editor.getText()).toMatchSnapshot()
      expect(editor.getMarkerlines()).toMatchSnapshot()
    },
  )

  it('insert markerlines', () => {
    let blank = new Editor()
    for (const [url, body] of load(resolve(__dirname, '__samples', 'insert-markerlines.txt'))) {
      const cur = new Editor(undefined, undefined, url, undefined)
      cur.setText(body)
      cur.flush()

      blank = new Editor(blank.getText(), blank.getMarkerlines())
      for (const [cardlabel, markerlines] of cur.getNestedMarkerlines()) {
        blank.setMarkerlinesToInsert(markerlines.filter(e => e.new))
        blank.flush()
      }
    }
    expect(blank.getText()).toMatchSnapshot()
    expect(blank.getMarkerlines()).toMatchSnapshot()
  })

  it.each<[string, string]>(load(resolve(__dirname, '__samples', 'common.txt')))(
    'handle common cases',
    (url: string, body: string) => {
      const editor = new Editor(undefined, undefined, url)
      editor.setText(body)
      editor.flush()
      expect(editor.getText()).toMatchSnapshot()
    },
  )
})
