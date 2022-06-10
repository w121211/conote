import moment from 'moment'
import React from 'react'
import { styleSymbol } from './style-fc/style-symbol'
import { Box } from './box'
import { ListItem } from './list-item'
import { NoteDocFragment } from '../../apollo/query.graphql'

export interface NoteData {
  title: string
  symbol: string
  updatedAt: number
}

export const NoteList = ({ data }: { data: NoteDocFragment[] }) => {
  return (
    <Box padding="sm">
      <h5 className="  mb-2 tracking-widest text-gray-700 dark:text-gray-200">
        NOTES
      </h5>
      {data.map(({ symbol, contentHead: { title }, updatedAt }, i) => {
        const styledSymbol = styleSymbol(symbol, title)
        return (
          <ListItem key={i}>
            <div className="flex-1 group truncate hover:cursor-pointer ">
              <h5 className="flex-grow flex-shrink mb-1 truncate min-w-0 text-blue-500 dark:text-blue-300 font-normal">
                {styledSymbol}
              </h5>
              <div className=" text-gray-400 text-xs">
                {moment(updatedAt).subtract(10, 'days').calendar()}
              </div>
            </div>
          </ListItem>
        )
      })}
    </Box>
  )
}
