import React from 'react'
import Link from 'next/link'
import EmojiIcon from '../emoji-up-down/emoji-icon'
import { RateTable } from '../../layout/rate-table'

export type TableData = {
  title?: string
  ticker: string
  srcSym: string
  author?: string
  rate: string
}

const UserRateTable = ({ data }: { data: TableData[] }): JSX.Element => {
  return (
    <RateTable data={data} />
    // <div className="flex-1">
    //   <h2 className=" py-2 text-sm font-medium tracking-widest text-gray-500">預測</h2>
    //   <div className="w-full overflow-hidden border border-gray-200 rounded text-sm">
    //     <table className="w-full ">
    //       <thead></thead>
    //       <tbody>
    //         {data.map(({ ticker, title, rate, srcSym }, i) => {
    //           return (
    //             <tr key={i} className="border-b border-gray-200 last:border-none ">
    //               <td className="px-4 py-3 text-gray-700  ">
    //                 <Link href={{ pathname: '/card/[symbol]', query: { symbol: ticker } }}>
    //                   <a className="inline-flex flex-col underline-offset-2 hover:underline cursor-pointer">
    //                     {ticker}

    //                     <span className="font-normal text-xs text-gray-500 whitespace-nowrap capitalize">
    //                       {title == '' ? '-' : title}
    //                     </span>
    //                   </a>
    //                 </Link>
    //               </td>
    //               <td className="py-3 px-4 whitespace-nowrap">
    //                 <span
    //                   className={`inline-flex px-2 rounded text-sm leading-6 ${
    //                     rate === 'LONG'
    //                       ? 'text-green-700 bg-green-100'
    //                       : rate === 'SHORT'
    //                       ? 'text-red-700 bg-red-100'
    //                       : 'text-gray-700 bg-gray-100'
    //                   }`}
    //                 >
    //                   {rate === 'LONG' ? '看多' : rate === 'SHORT' ? '看空' : '觀望'}
    //                 </span>
    //               </td>
    //               {/* <td className="py-3 px-4 truncate text-gray-500 ">
    //               <Link href={{ pathname: '/card/[symbol]', query: { symbol: srcSym } }}>
    //                 <a className="inline-flex truncate hover:underline underline-offset-2 cursor-pointer">{srcSym}</a>
    //               </Link>
    //             </td> */}
    //             </tr>
    //           )
    //         })}
    //       </tbody>
    //     </table>
    //   </div>
    // </div>
  )
}

export default UserRateTable
