import React, { ReactNode } from 'react'

export const DropdownListItem = ({
  children,
}: {
  children: ReactNode
}): JSX.Element => {
  return (
    <div className="block whitespace-nowrap first:mt-1 last:mb-1 px-4 py-0.5 text-sm text-gray-600 hover:bg-gray-100 ">
      {children}
    </div>
  )
}
