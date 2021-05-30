import React from 'react'
// import { Anchor } from 'antd'
import { Editor, Section, ExtTokenStream, streamToStr } from '../../../packages/editor/src/index'
import { CocardFragment } from '../../apollo/query.graphql'
import classes from './tickerAnchor.module.scss'

// const { Link } = Anchor
interface dataObj {
  symbol: string
  subtitles?: string[]
}
const Anchor = ({
  data,
  clickHandler,
  titleIndex,
}: {
  data: dataObj
  clickHandler: (e: any, index: number) => void
  titleIndex: number
}) => {
  // console.log(key)
  return (
    <div onClick={e => clickHandler(e, titleIndex)}>
      {data.symbol}
      {/* <div>
        {data.subtitles.map((e, i) => (
          <div key={i}>{e}</div>
        ))}
      </div> */}
    </div>
  )
}

const TickerAnchor = ({
  data,
  clickHandler,
}: {
  data: CocardFragment
  clickHandler: (e: any, index: number) => void
}) => {
  if (data.body === null) return <p>[Error]: null body</p>

  const editor = new Editor(data.body?.text, data.body?.meta, data.link?.url, data.link.oauthorName ?? undefined)
  editor.flush({ attachMarkerlinesToTokens: true })
  const sect = editor.getSections()
  const anchArr: dataObj[] = []
  /* 資料結構 */
  /* 
    1:
    breaker: undefined
    nestedCard: {symbol: "$ABBV", oauthor: undefined}
    root: undefined
    stream: (15) [{…}, {…}, "↵", {…}, "↵↵", {…}, " ↵", {…}, "↵", {…}, "↵", {…}, "↵", {…}, "↵"]
    ticker: true
    topic: undefined
    __proto__: Object
  */
  /*  stream: Array(15)
      0: {type: "sect-ticker-begin-line", content: Array(2), alias: "sect-ticker", length: 6, linenumber: 0}
      1:
        alias: undefined
        content: Array(2)
          0:
            alias: undefined
            content: "[key]"
            length: 5
            linenumber: 1
            marker: {key: "[key]"}
            type: "inline-mark"
            __proto__: Object
          1: {type: "inline-value", content: Array(3), alias: undefined, length: 14, linenumber: 1, …}
      length: 2
      __proto__: Array(0)
      length: 19
      linenumber: 1
      type: "inline-marker"
      __proto__: Object */
  sect
    // .filter(key => key.nestedCard)
    .forEach((key, idx) => {
      // const obj: dataObj = { symbol: '', subtitles: [] }
      if (key.nestedCard) {
        anchArr[idx] = { symbol: key.nestedCard.symbol.replace('[[', '').replace(']]', '') }

        // if (key.stream && Array.isArray(key.stream)) {
        //   key.stream.forEach(element => {
        //     if (typeof element !== 'string') {
        //       // element.content.forEach(stream => {
        //       if (Array.isArray(element.content)) {
        //         console.log(element.content)
        //         element.content.forEach(e => {
        //           // const content = streamToStr(e)
        //           console.log(e)
        //           if (e.content && typeof e.content === 'string') {
        //             obj.subtitles.push(e.content.replace('[key]', '關鍵字'))
        //           }
        //         })
        //       }
        //   console.log(stream)
        //   obj.subtitles.push(content)
        // })
        //     }
        //   })
        // }
      }

      // console.log(anchArr)
      // anchArr.push(obj)
    })

  return (
    <div className={classes.anchor}>
      {/* {console.log(anchArr)} */}
      {anchArr &&
        anchArr.map((element, index) => (
          <Anchor data={element} key={index} clickHandler={clickHandler} titleIndex={index} />
        ))}
      {/* {console.log(editor.getSections())} */}
    </div>
  )
}

export default TickerAnchor
