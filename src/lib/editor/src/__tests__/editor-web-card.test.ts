/* eslint-disable no-useless-escape */
import { resolve } from 'path'
import { Markerline } from '../typing'
import { Editor } from '../editor'
import * as helper from '../helper'
import { load, omitUndefined, FakeChance } from '../test-helper'

const fakeChance = new FakeChance()

jest.spyOn(helper, 'randString').mockImplementation(() => {
  return fakeChance.string()
})

const symbolCardTemplate = `[*]
[?]
<BUY> <SELL>
[+]
[-]`

const symbolCardEditor = new Editor()
symbolCardEditor.setText(symbolCardTemplate)
symbolCardEditor.flush()

test('input nested cards', () => {
  const editor = new Editor(undefined, undefined, 'http://test2.com', 'test-oauther')
  editor.setText(`$AA
[?] <BUY> @30
[+]
111 111
222 222

$BB
[?] <SELL> @30`)
  editor.flush()

  expect(omitUndefined(editor.getText())).toMatchSnapshot()
  expect(omitUndefined(editor.getMarkerlines())).toMatchSnapshot()
  expect(omitUndefined(editor.getNestedMarkerlines())).toMatchSnapshot()

  for (const [cardlabel, markerlines] of editor.getNestedMarkerlines()) {
    // const nestedCard = await getOrCreateCardBySymbol(cardlabel.symbol)
    // const nestedEditor = new Editor(editors.$AA.getText(), editors.$AA.getMarkerlines())
    // console.log(nestedEditor.getMarkerlines())
    console.log(markerlines)
    symbolCardEditor.setMarkerlinesToInsert(markerlines.filter(e => e.new && !e.neatReply))
    symbolCardEditor.flush()
    console.log(symbolCardEditor.getText())
    console.log(symbolCardEditor.getMarkerlines())
    // await createCardBody(nestedCard, nestedEditor, TESTUSERS[1].id)
  }
})

// test('add nested markerlines', () => {
//   const editor = new Editor(undefined, undefined, 'some.src', '@someauthor')
//   editor.setText(`$ABBV
// [~] [[生物技術]]
// [+]
// @ARK開倉
// @巴菲特2020Q4加倉`)
//   editor.flush()

//   const [cardlabel, markerlines] = editor.getNestedMarkerlines()[0]
//   // expect(cardlabel).toBe({ oauthor: '@someauthor', symbol: '$ABBV' })
//   expect(markerlines).toMatchSnapshot()

//   const nestedEditor = new Editor(
//     `[{"linenumber":1,"str":"[~]","marker":{"mark":"[~]"}},{"linenumber":2,"str":"[?]","marker":{"mark":"[?]"}},{"linenumber":2,"str":"<買> vs <賣>？","marker":{"mark":"[?]","value":"<買> vs <賣>？"},"src":"some.source","oauthor":"@someauthor","stampId":"%100","poll":true,"pollId":10,"commentId":3},{"linenumber":3,"str":"[+]","marker":{"mark":"[+]"}},{"linenumber":4,"str":"[-]","marker":{"mark":"[-]"}}]
// [~]
// [?]<買> vs <賣>？ %100
// [+]
// [-]`,
//   )
//   nestedEditor.setMarkerlinesToInsert(markerlines.filter(e => e.new))
//   nestedEditor.flush()
//   expect(nestedEditor.getMarkerlines()).toMatchSnapshot()
// })
