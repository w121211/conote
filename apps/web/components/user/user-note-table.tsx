import moment from 'moment'
import React from 'react'
import { NoteData, NoteList } from '../../layout/note-list'
import { TableData } from '../author/author-rate-table'

const UserNoteTable = ({ data }: { data: NoteData[] }) => {
  return (
    <NoteList data={data} />
    // <div className="">
    //   <h2 className="mb-2 text-lg font-medium text-gray-700 ">筆記</h2>
    //   <div className=" border border-gray-200 rounded text-sm ">
    //     {data.map(({ ticker, title }, i) => {
    //       return (
    //         <div
    //           key={i}
    //           className="px-4 py-3 border-b border-gray-200 last:border-none hover:cursor-pointer hover:bg-gray-50"
    //         >
    //           <div className="flex items-center">
    //             <div
    //               className="flex-grow flex-shrink truncate min-w-0 text-gray-700 font-medium
    //                 "
    //             >
    //               {ticker}
    //             </div>
    //             <div className=" text-gray-400 text-xs">{moment().subtract(10, 'days').calendar()}</div>
    //           </div>
    //           {/* <p className="truncate text-gray-500 ">我是內容，我寫了一些東西在這裡，哈哈哈＝＝，效果如何？</p> */}
    //         </div>
    //       )
    //     })}
    //   </div>
    // </div>
  )
}

export default UserNoteTable
