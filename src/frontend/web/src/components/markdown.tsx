import dayjs from 'dayjs'

import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Link } from '@reach/router'
// import ReactMarkdown from 'react-markdown'
import { wikiLinkPlugin } from 'remark-wiki-link'

import * as queries from '../graphql/queries'
import * as QT from '../graphql/query-types'

function _parser(text: string) {
  /**
   * @deprecated
   * 用regex寫的parser，已棄置（應該要用現成的grammar, parser庫）
   * */
  // const tokens = [
  //   <span key={1}>This is some </span>,
  //   <a key={2}>#bbb</a>,
  // ]
  // return <>{tokens.map(e => e)}</>
  const re = /#\w+/g
  const matched = []

  while (true) {
    const match = re.exec(text)
    if (!match) break
    matched.push([match.index, re.lastIndex])
  }
  const elements = []
  let start = 0
  for (let m of matched) {
    const pre = text.substr(start, m[0] - start)
    const matched = text.substr(m[0], m[1] - m[0])
    start = m[1]
    elements.push(pre)
    elements.push(matched)
  }
  // tail string
  elements.push(text.substr(start))
  return null
}

export function MdText({ text }: { text: string }) {
  /**
   * 將markdown轉成components
   * - [[topic with blank]] -> /topic/topic_with_blank
   * - @asomebody:domain -> /author/@asomebody:domain
   * - $ticker -> /ticker/$ticker
   * - [external link](http://...) -> <a href="...">...</a>
   */
  const renderers = {
    paragraph: function ({ value, children }: any) {
      return <span>{children}</span>
    },
    link: function (a: any) {
      console.log(a)
      console.log(a.href)
      return <h3>{a.children}</h3>
      // <h1>{value}</h1>
    },
    wikiLink: function ({ value }: { value: string }) {
      if (value.startsWith('$')) return <Link to={`/ticker/${value}`}>{value}</Link>
      return <Link to={`/topic/${value}`}>{value}</Link>
    },
  }
  return null
  // return (
  //   <ReactMarkdown
  //     plugins={[wikiLinkPlugin]}
  //     allowedTypes={['text', 'paragraph', 'link']}
  //     children={text}
  //     renderers={renderers}
  //   />
  // )
}
