import React from 'react'

export const Badge = ({
  bgClassName,
  textClassName,
  content,
}: {
  bgClassName?: string
  textClassName?: string
  content: string
}) => {
  return (
    <span
      className={`
        h-fit 
        px-2 
        rounded
        font-[Consolas] 
        select-none 
        text-gray-900 dark:text-white
        ${bgClassName ? bgClassName : 'bg-gray-200/60'} 
        ${textClassName ? textClassName : ''}
        `}
    >
      {content}
    </span>
  )
}
