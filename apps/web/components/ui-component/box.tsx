import moment from 'moment'
import React, { ReactNode } from 'react'

export const Box = ({
  className,
  children,
  padding,
}: {
  className?: string
  children: ReactNode
  padding?: 'md' | 'sm'
}) => {
  const paddingClass =
    padding === 'md' ? `p-6 ` : padding === 'sm' ? `py-4 px-5` : ''
  return (
    <div
      className={`${paddingClass} rounded border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}
