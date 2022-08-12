import React, { HtmlHTMLAttributes, ReactNode } from 'react'

const DropdownListItem = ({
  children,
}: {
  children: ReactNode
}): JSX.Element => {
  return (
    <div className="block whitespace-nowrap px-4 py-0.5 first:mt-1 last:mb-1  text-sm text-gray-600 hover:bg-gray-100 ">
      {children}
      {/* {newChildren()} */}
    </div>
  )
}
