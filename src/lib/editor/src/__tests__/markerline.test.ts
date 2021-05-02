/* eslint-disable no-useless-escape */
import omitDeep from 'omit-deep-lodash'
import { tokenizeSection } from '../parser'
import { insertMarkerlinesToText, updateMarkerlines } from '../markerline'
import { load, FakeChance, removeUndefinedFields } from '../test-helper'

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

const basicText = `[~] inline 111 inline 111
[=] inline 222 inline 222
[?]
<AAA> <BBB> poll 111
poll 222 <AAA> <BBB>
question 333?
- reply 111
- reply 222
[+]
point 111
point 222
[-]
[?] <CCC> neat reply
`

const simpleText = `[?] inline inline inline
[+]
111 111 %001
[-]
`

describe('updateMarkerlines fn', () => {
  const starter = updateMarkerlines(
    [],
    tokenizeSection(basicText),
    new FakeChance(),
    //   src?: string,
    // oauthor?: string,
  )
  const simpler = updateMarkerlines([], tokenizeSection(simpleText), new FakeChance())

  it('parse text to markerlines', () => {
    expect(removeUndefinedFields(starter.markerheaders)).toMatchSnapshot()
    expect(removeUndefinedFields(starter.markerlines)).toMatchSnapshot()
  })

  it('parse swaped lines', () => {
    const t1 = `[~]
[+]
111 111 %001
[?] inline inline inline %000
[-]`
    const parsed1 = updateMarkerlines(simpler.markerlines, tokenizeSection(t1), new FakeChance())
    expect(parsed1.markerlines).toMatchSnapshot()
  })

  it('parse new added lines', () => {
    const t1 = `[~]
[?] inline inline inline %000
[+]
111 111 %001
222 222
[-]
333 333`
    const parsed1 = updateMarkerlines(simpler.markerlines, tokenizeSection(t1), new FakeChance())
    expect(parsed1.markerlines).toMatchSnapshot()
  })
})

describe('insertMarkerlinesToBody fn', () => {
  const starterBody = `[~] 111 222 333
[?]
<AAA> <BBB> question quesiton
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
    const [body, markerlines] = insertMarkerlinesToText(
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

  // it('insert markerline to non existed marker-header', () => {
  //   //   const cur: Markerline[] = [
  //   //   ]
  //   // body: string,
  //   // insert: Markerline[],
  //   // chance: { string: (a: any) => string },
  //   //   insertMarkerlinesToBody()
  // })

  // it('insert inline markerline', () => {
  //   //   const cur: Markerline[] = [
  //   //   ]
  //   // body: string,
  //   // insert: Markerline[],
  //   // chance: { string: (a: any) => string },
  //   //   insertMarkerlinesToBody()
  // })
})
