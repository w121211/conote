import moment from 'moment'
import React from 'react'
import { styleSymbol } from './style-fc/style-symbol'
import { Tile } from './tile'

export interface NoteData {
  title: string
  symbol: string
  updatedAt: number
}

export const NoteList = ({ data }: { data: NoteData[] }) => {
  return (
    <Tile>
      {/* <div className="p-3 border border-gray-200 rounded text-sm shadow-sm"> */}
      <h4 className="  mb-2 text-base tracking-widest text-gray-700">筆記</h4>
      {data.map(({ symbol, title, updatedAt }, i) => {
        const styledSymbol = styleSymbol(symbol, title)
        return (
          <div
            key={i}
            className="group py-3 border-b border-gray-200 last:border-none hover:cursor-pointer "
          >
            <div className="">
              <h5 className="flex-grow flex-shrink mb-1 truncate min-w-0 text-blue-500 g font-normal">
                {styledSymbol}
              </h5>
              <div className=" text-gray-400 text-xs">
                {moment(updatedAt).subtract(10, 'days').calendar()}
              </div>
            </div>
            {/* <p className="truncate text-gray-500 ">我是內容，我寫了一些東西在這裡，哈哈哈＝＝，效果如何？</p> */}
          </div>
        )
      })}
      {/* </div> */}
    </Tile>
  )
}