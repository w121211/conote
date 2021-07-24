import React from 'react'
// import { Anchor } from 'antd'
import { Editor, Section, ExtTokenStream, streamToStr } from '../../../packages/editor/src/index'
// import { CocardFragment } from '../../apollo/query.graphql'
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
  // data,
  clickHandler,
}: {
  // data: CocardFragment
  clickHandler: (e: any, index: number) => void
}) => {
  // if (data.body === null) return <p>[Error]: null body</p>

  // const editor = new Editor(data.body?.text, data.body?.meta, data.link?.url, data.link.oauthorName ?? undefined)
  // editor.flush({ attachMarkerlinesToTokens: true })
  // const sect = editor.getSections()
  const anchArr: dataObj[] = []
  /* 資料結構 */

  // sect
  //   // .filter(key => key.nestedCard)
  //   .filter(e => e.nestedCard !== undefined)
  //   .forEach((key, idx) => {
  //     // console.log(key)
  //     // const obj: dataObj = { symbol: '', subtitles: [] }
  //     if (key.nestedCard) {
  //       anchArr[idx] = { symbol: key.nestedCard.symbol.replace('[[', '').replace(']]', '') }

  //     }

  //   })

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
