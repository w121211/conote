import Link from 'next/link'
import React from 'react'
import { Tile } from './tile'

export type TableData = {
  title?: string
  ticker: string
  srcSym: string
  author?: string
  rate: string
}

export const RateTable = ({ data }: { data: TableData[] }): JSX.Element => {
  return (
    <Tile className="flex-1 min-w-[300px] w-full p-3 overflow-hidden  text-sm">
      <h4 className="  mb-2 text-base tracking-widest text-gray-700 dark:text-gray-200">
        預測
      </h4>
      {data.map(({ ticker, title, rate, srcSym }, i) => {
        return (
          <div
            key={i}
            className="flex justify-between items-center gap-8 py-3 border-b border-inherit last:border-none "
          >
            <Link
              href={{ pathname: '/card/[symbol]', query: { symbol: ticker } }}
            >
              <a className="flex-grow flex flex-col text-gray-700 dark:text-gray-200 underline-offset-2 hover:underline cursor-pointer">
                {ticker}

                <span className="font-normal text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap capitalize">
                  {title == '' ? '-' : title}
                </span>
              </a>
            </Link>

            <div className=" whitespace-nowrap">
              <span
                className={`inline-flex px-2 rounded text-sm leading-6 ${
                  rate === 'LONG'
                    ? 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-800'
                    : rate === 'SHORT'
                    ? 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-800'
                    : 'text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-500'
                }`}
              >
                {rate === 'LONG' ? '看多' : rate === 'SHORT' ? '看空' : '觀望'}
              </span>
            </div>
            {/* <div className="py-3 px-4 truncate text-gray-500 ">
                  <Link href={{ pathname: '/card/[symbol]', query: { symbol: srcSym } }}>
                    <a className="inline-flex truncate hover:underline underline-offset-2 cursor-pointer">{srcSym}</a>
                  </Link>
                </div> */}
          </div>
        )
      })}
    </Tile>
  )
}
