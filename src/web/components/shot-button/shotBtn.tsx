import React from 'react'

const ShotBtn = ({
  author,
  target,
  choice,
  handleClick,
}: {
  author?: string
  target?: string
  choice?: string
  handleClick: () => void
}): JSX.Element => {
  if (!author && !target && !choice) {
    return (
      <button className="btn-reset-style" onClick={handleClick} contentEditable={false}>
        <span className="p-1 border border-gray-300 rounded text-sm bg-gray-200 hover:bg-gray-300">新增Shot</span>
      </button>
    )
  }
  return (
    <button className="group btn-reset-style inline-flex" onClick={handleClick} contentEditable={false}>
      <span className="flex items-center p-1 border border-gray-300 rounded text-sm bg-gray-200 group-hover:bg-gray-300">
        {author && (
          <span className="inline-block max-w-[100px] overflow-hidden whitespace-nowrap text-ellipsis">{author}</span>
        )}

        {choice && <span className="font-bold">·{target}</span>}
      </span>
      <span
        className={`relative ml-2 py-1 px-2 rounded text-white text-sm before:content-['']
         before:inline-block before:absolute before:w-0 before:h-[1px] before:top-[calc(25%+2px)] before:left-[-4px] 
         before:border-r-4 before:border-t-4 before:border-t-transparent before:border-b-4 before:border-b-transparent ${
           choice === '#LONG'
             ? 'bg-green-700 before:border-r-green-700'
             : choice === '#SHORT'
             ? 'bg-red-700 before:border-r-red-700'
             : 'bg-yellow-700 before:border-r-yellow-700'
         }`}
      >
        {choice?.replace('#LONG', '看多').replace('#SHORT', '看空').replace('#HOLD', '觀望')}
      </span>
    </button>
  )
}
export default ShotBtn
