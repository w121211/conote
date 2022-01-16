import React from 'react'

const RateButton = ({
  author,
  target,
  choice,
  onClick,
}: {
  author?: string
  target?: string
  choice?: string
  onClick: () => void
}): JSX.Element => {
  if (!author && !target && !choice) {
    return (
      <button className="btn-reset-style" onClick={onClick}>
        <span className="px-1 border border-white rounded text-sm bg-gray-100 hover:bg-gray-200">新增Rate</span>
      </button>
    )
  }
  return (
    <button className="group btn-reset-style inline-flex text-gray-600" onClick={onClick} role="button">
      {(author || target) && (
        <span className="flex items-center px-1 border border-gray-200 rounded text-sm bg-white group-hover:bg-gray-100">
          {author && (
            <span className="inline-block max-w-[100px] overflow-hidden whitespace-nowrap text-ellipsis">{author}</span>
          )}
          {author && target && <span className="font-bold">·</span>}
          {target && <span className="font-bold">{target}</span>}
        </span>
      )}
      {choice && (
        <span
          className={`relative ml-2  px-2 rounded  text-sm before:content-['']
         before:inline-block before:absolute before:w-0 before:h-[1px] before:top-[calc(25%+2px)] before:left-[-4px] 
         before:border-r-4 before:border-t-4 before:border-t-transparent before:border-b-4 before:border-b-transparent ${
           choice === '#LONG'
             ? ' border-green-600 bg-green-100 before:border-r-green-100 text-green-800'
             : choice === '#SHORT'
             ? 'border-red-600 bg-red-100 before:border-r-red-100 text-red-800'
             : ' border-gray-400 bg-gray-100 before:border-r-gray-100 text-gray-800'
         }`}
        >
          {choice?.replace('#LONG', '看多').replace('#SHORT', '看空').replace('#HOLD', '觀望')}
        </span>
      )}
    </button>
  )
}

export default RateButton
