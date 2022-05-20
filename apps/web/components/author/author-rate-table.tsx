import React from 'react'
import Link from 'next/link'
import EmojiIcon from '../emoji/emoji-icon'

export type TableData = {
  title?: string
  ticker: string
  srcSym: string
  author?: string
  rate: string
}

const AuthorRateTable = ({ data }: { data: TableData[] }): JSX.Element => {
  return (
    <div className="w-full overflow-hidden border border-gray-200 rounded text-sm">
      <table className="w-full ">
        <tbody>
          {data.map(({ ticker, title, rate, srcSym }, i) => {
            return (
              <tr
                key={i}
                className="border-b border-gray-200 last:border-none "
              >
                <td className="px-4 py-3 text-gray-900 font-medium ">
                  <Link
                    href={{
                      pathname: '/card/[symbol]',
                      query: { symbol: ticker },
                    }}
                  >
                    <a className="inline-flex flex-col underline-offset-2 hover:underline cursor-pointer">
                      {ticker}

                      <span className="font-normal text-xs text-gray-500 whitespace-nowrap capitalize">
                        {title == '' ? '-' : title}
                      </span>
                    </a>
                  </Link>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 rounded text-sm leading-6 ${
                      rate === 'LONG'
                        ? 'text-green-700 bg-green-100'
                        : rate === 'SHORT'
                        ? 'text-red-700 bg-red-100'
                        : 'text-blue-700 bg-blue-100'
                    }`}
                  >
                    {rate === 'LONG'
                      ? '看多'
                      : rate === 'SHORT'
                      ? '看空'
                      : '觀望'}
                  </span>
                </td>
                <td className="py-3 px-4 truncate text-gray-500 ">
                  <Link
                    href={{
                      pathname: '/card/[symbol]',
                      query: { symbol: srcSym },
                    }}
                  >
                    <a className="inline-flex truncate hover:underline underline-offset-2 cursor-pointer">
                      {srcSym}
                    </a>
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default AuthorRateTable
