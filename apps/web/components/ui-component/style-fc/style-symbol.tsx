import { tokenize } from 'prismjs'
import React, { ReactNode } from 'react'
import { TokenHelper } from '../../../common/token-helper'
import { grammar } from '../../block-editor/src/parse-render'

const bracketStyle = `text-gray-400/50 dark:text-gray-400`
const blueHighlight = `text-blue-500 dark:text-blue-300`

export function styleSymbol(
  str: string,
  title?: string,
  // lightBracket?: boolean,
) {
  const tokens = tokenize(str, grammar)
  const renderArr: (string | ReactNode)[] = []
  tokens.forEach(token => {
    if (typeof token === 'string') {
      return renderArr.push(token)
    }
    const str = TokenHelper.toString(token.content)

    switch (token.type) {
      case 'discuss':
      case 'discussNew': {
        return renderArr.push(
          <span className={blueHighlight}>
            <span className={bracketStyle}>#</span>
            {str.substring(1, str.length - 1)}
            <span className={bracketStyle}>#</span>
          </span>,
        )
      }
      // case 'filtertag': {
      //   return { type: 'inline-filtertag', str, token }
      // }
      // case 'poll':
      // case 'pollNew': {
      //   const match = rePollNew.exec(str)
      //   if (match) {
      //     return {
      //       type: 'inline-poll',
      //       str,
      //       token,
      //       choices: match[1].split(' '),
      //     }
      //   } else {
      //     throw `Parse poll-new error,: ${str}`
      //   }
      // }
      // case 'rate':
      // case 'rateNew': {
      //   const match = reRateNew.exec(str)
      //   if (match) {
      //     const params = match[1].split(' ')
      //     const { authorName, targetSymbol, choice } =
      //       parseInlineRateParams(params)
      //     return {
      //       type: 'inline-rate',
      //       str,
      //       token,
      //       params,
      //       authorName,
      //       targetSymbol,
      //       // choice,
      //     }
      //   } else {
      //     console.error(str)
      //     throw 'Parse error'
      //   }
      // }
      case 'topic': {
        // console.log(str)
        return renderArr.push(
          <span className={blueHighlight}>
            <span className={bracketStyle}>{'[['}</span>
            {str.substring(2, str.length - 2)}
            <span className={bracketStyle}>{']]'}</span>
          </span>,
        )
      }
      case 'url': {
        return renderArr.push(title ? title : str)
      }
      case 'author':
      case 'ticker': {
        return renderArr.push(<span className={blueHighlight}>{str}</span>)
      }
      // case 'comment': {
      //   return { type: 'inline-comment', str, token }
      // }
    }
  })
  return renderArr.map((e, i) => <React.Fragment key={i}>{e}</React.Fragment>)
}
