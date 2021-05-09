/* eslint-disable no-useless-escape */
import omitDeep from 'omit-deep-lodash'
import { tokenizeSection } from '../parser'
import { insertMarkerlinesToText, updateMarkerlines } from '../markerline'
import { FakeChance, omitUndefined } from '../test-helper'
import * as helper from '../helper'

const fakeChance = new FakeChance()

jest.spyOn(helper, 'randString').mockImplementation(() => {
  return fakeChance.string()
})

beforeEach(() => {
  fakeChance.reset()
})

const text = {
  basic: `
[~] inline 111 
[=] inline 222 
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
[小標句尾多了空格111]\s
[小標句尾多了空格222]\s
句尾多了空格 111\s
句尾多了空格 222\s

[小標沒有連在一起]

內文沒有連在一起
`.trim(),
  nano: `
[?] inline inline inline %000
[+]
111 111 %001
`.trim(),
  nanoSwapOneLine: `
[+]
111 111 %001
[?] inline inline inline %000
`.trim(),
  nanoAddOneLine: `
[?] inline inline inline %000
[+]
111 111 %001
222 222
`.trim(),
}

describe('function updateMarkerlines()', () => {
  const nano = updateMarkerlines([], tokenizeSection(text.nano))

  it('parse text to markerlines', () => {
    expect(
      omitUndefined(
        updateMarkerlines(
          [],
          tokenizeSection(text.basic),
          //   src?: string,
          // oauthor?: string,
        ),
      ),
    ).toMatchSnapshot()
  })

  it('parse new added lines & avoid duplicated-stamp', () => {
    expect(updateMarkerlines(nano.markerlines, tokenizeSection(text.nanoAddOneLine)).markerlines).toMatchSnapshot()
  })

  // it('parse new added lines', () => {
  //   expect(updateMarkerlines(basic.markerlines, tokenizeSection(text.basicAddLine)).markerlines).toMatchSnapshot()
  // })

  // it('parse swaped lines', () => {
  //   const {markerlines} = updateMarkerlines([], tokenizeSection(text.basic))
  //   const parsed1 = updateMarkerlines(markerlines, tokenizeSection(t1))
  //   expect(parsed1.markerlines).toMatchSnapshot()
  // })
})

// describe('function insertMarkerlinesToText()', () => {
//   const starter = updateMarkerlines([], tokenizeSection(starterBody))

//   it('insert markerline to existed marker-header', () => {
//     const [body, markerlines] = insertMarkerlinesToText(starter.markerheaders, starter.markerlines, starterBody, [
//       {
//         linenumber: 10,
//         str: 'insert insert insert',
//         marker: {
//           key: '[+]',
//           value: 'insert insert insert',
//         },
//       },
//     ])
//     expect(body).toMatchSnapshot()
//     expect(markerlines).toMatchSnapshot()
//   })

//   // it('insert markerline to non existed marker-header', () => {
//   //   //   const cur: Markerline[] = [
//   //   //   ]
//   //   // body: string,
//   //   // insert: Markerline[],
//   //   // chance: { string: (a: any) => string },
//   //   //   insertMarkerlinesToBody()
//   // })

//   // it('insert inline markerline', () => {
//   //   //   const cur: Markerline[] = [
//   //   //   ]
//   //   // body: string,
//   //   // insert: Markerline[],
//   //   // chance: { string: (a: any) => string },
//   //   //   insertMarkerlinesToBody()
//   // })
// })
