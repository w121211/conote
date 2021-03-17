import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react'
import Prism, { Token as PrismToken } from 'prismjs'
import { useMutation } from '@apollo/client'
import { Button, Form, Input } from 'antd'
// import { tokenize, validate, WEBPAGE_ALLOWED_MARKERS, Marker } from '../utils/marker'
import * as queries from '../graphql/queries'
import * as QT from '../graphql/query-types'

// import * as Parser from '../utils/parser'
// import { Portal } from '../components'

const t1 = `[start]test
[intro]
1st line starter
2nd line starter

[you_are] ()用戶 ()業內 ()行業相關 ()插花

[+]
- 全美市占率第一 (source → webpage card)
- 為搶佔市場需燒錢，美國餐飲價格高，外送需求不如亞洲國家來的大
- $AAA

[-]
- 美國配送成本高
- 燒錢行業
- 疫情關係拉高業績，未來
- 還在賠錢中

[verdict] []買 []賣 []觀望
[verdict理由]

[target_price] 31

atest
`

// function Token({ token, marker }: { token: PrismToken | string, marker?: Marker }) {
//   if (typeof (token) === 'string')
//     return <span style={{ color: 'gray' }}>{token}</span>
//   // if (Array.isArray(token.content))
//   //   return <>{token.content.map((e, i) => <Token key={i} token={e} />)}</>
//   const mk = marker ? <span>({marker.error})</span> : null
//   switch (token.type) {
//     case 'marker':
//       return <span style={{ color: '#9a6e3a' }}>{token.content}{mk}</span>
//     case 'ticker':
//       return <a style={{ color: '#9a6e3a' }} href="https://regex101.com/r/C2T0so/2" contentEditable={false}>{token.content}{mk}</a>
//     case 'inline-ticker':
//       return <a style={{ color: '#9a6e3a' }} href="https://regex101.com/r/C2T0so/2" contentEditable={false}>{token.content}{mk}</a>
//   }
//   // if (token.type === 'marker')
//   //   return <span style={{ color: '#9a6e3a' }}>{token.content}</span>
//   // if (token.type === '')
//   //   return <a style={{ color: '#9a6e3a' }} href="https://regex101.com/r/C2T0so/2" contentEditable={false}>{token.content}</a>
//   if (['number', 'radio', 'list-string', 'line-string', 'string'].includes(token.type))
//     return <span style={{ color: '#905' }}>{token.content}{mk}</span>
//   return <span>{token.content}{mk}</span>
// }

// function StylizedText({ tokens, markers }: { tokens: Array<PrismToken | string>, markers: Marker[] }) {
//   let lineNumber = 0
//   const zipped: [PrismToken | string, Marker | undefined][] = []

//   function _zip(token: PrismToken | string) {
//     if (typeof token === 'string') {
//       lineNumber += token.split('\n').length - 1
//     } else if (Array.isArray(token.content)) {
//       for (const e of token.content)
//         _zip(e)
//       return
//     }
//     zipped.push([token, markers.find(e => e.lineNumber === lineNumber)])
//   }
//   for (const e of tokens)
//     _zip(e)
//   return <pre>{zipped.map(([tk, mk], i) => <Token key={i} token={tk} marker={mk} />)}</pre>
// }

// export function TextEditor() {
//   /**
//    * 1. onInputChange -> tokenzize as tokens -> render textarea & symbol-list
//    * 2. onFinish -> input -> tokens -> comments -> submit
//    * 3. onLoad -> comments -> tokens -> input text
//    * 4. onClick symbol -> open symbol card
//    */
//   const [input, setInput] = useState<string>('')
//   const [symbols, setSymbols] = useState<string[] | undefined>()
//   const [symbol, setSymbol] = useState<string | undefined>()
//   const [tokens, setTokens] = useState<Array<PrismToken | string>>([])
//   const [markers, setMarkers] = useState<Marker[]>([])
//   // const [createComments] = useMutation<QT.createComments, QT.createCommentsVariables>(
//   //   queries.CREATE_COMMENTS,
//   // )
//   // function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {}
//   function onValuesChange(changedValues: any) {
//     const value = changedValues['card']
//     if (value) {
//       const [tokens, _markers] = tokenize(value)
//       const markers = validate(_markers, WEBPAGE_ALLOWED_MARKERS)
//       setTokens(tokens)
//       setMarkers(markers)
//       setInput(value)
//       // const comments = textToComments(value, [{ mark: 'ticker', syntax: '[卡]', multi: true }])
//       // setSymbol(comments[comments.length - 1].text)
//       // const _symbols = comments.map(e => e.text)
//       // setSymbols(_symbols.filter((e, i) => _symbols.indexOf(e) === i))
//     }
//   }
//   function onFinish() {
//     // await createComments({
//     //   variables: {
//     //     cardId: card.id,
//     //     cardType: card.__typename,
//     //     data: textToComments(input, undefined)
//     //   }
//     // })
//   }
//   return (
//     <div>
//       <StylizedText tokens={tokens} markers={markers} />
//       <Form onFinish={onFinish}
//         initialValues={
//           { card: t1 }
//           // { card: commentsToText(card.comments ?? [], webpageMarkers) }
//         } onValuesChange={onValuesChange}>
//         <Form.Item name="card">
//           <Input.TextArea rows={10} autoSize />
//         </Form.Item>
//         <Form.Item>
//           <Button type="primary" htmlType="submit">送出</Button>
//         </Form.Item>
//       </Form>
//     </div>
//   )
// }
