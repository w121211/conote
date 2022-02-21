import React from 'react'
import { DiscussFragment } from '../../apollo/query.graphql'
import DiscussEmojis from './discuss-emojis'

const DiscussHeader = ({ data }: { data: DiscussFragment }) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{data.title}</h2>
        <DiscussEmojis discussId={data.id} />
      </div>
      {data.content && <p className="text-gray-500">{data.content}</p>}
    </div>
  )
}

export default DiscussHeader
