import React from 'react'
import { DiscussFragment, useMeQuery } from '../../apollo/query.graphql'
import DiscussEmojis from './discuss-emojis'

const DiscussHeader = ({ data }: { data: DiscussFragment }) => {
  const { data: meData } = useMeQuery()
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{data.title}</h2>
        {/* {meData && <DiscussEmojis discussId={data.id} disable={meData.me.id === data.userId} />} */}
      </div>
      {data.content && <p className="text-gray-500">{data.content}</p>}
    </div>
  )
}

export default DiscussHeader
