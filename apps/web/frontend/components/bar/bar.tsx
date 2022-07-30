import React, { useEffect, useState } from 'react'

const BarChart = ({
  content,
  // value,
  count,
  total,
  voted,
  checked,
}: {
  content: string
  // value: number
  total: number
  count: number
  voted: boolean
  checked?: boolean
}): JSX.Element => {
  const persentage = (count: number, total: number) =>
    Math.round((count / total + Number.EPSILON) * 100) || 0

  return (
    <div className="w-full p-1 text-gray-700">
      <span
        className={`relative block w-full h-9 rounded bg-gray-200 hover:bg-gray-300 font-bold ${
          checked ? 'outline outline-blue-300' : ''
        }`}
      >
        <div
          className={`absolute flex w-full h-9 rounded overflow-hidden bg-blue-500 ${
            voted ? 'bg-blue-700' : ''
          }`}
          style={{
            clipPath: `inset(0  ${
              100 - persentage(count, total)
            }% 0 0 round 4px) `,
          }}
        >
          <span className="flex items-center justify-between w-full mx--4 capitalize text-white">
            {content}
            <span className="text-white">
              {persentage(count, total)}%({count || 0})
            </span>
          </span>
        </div>
        <span className="flex items-center justify-between h-full mx-4 font-bold capitalize">
          {content}
          <span>
            {persentage(count, total)}%({count || 0})
          </span>
        </span>
      </span>
    </div>
  )
}
export default BarChart
