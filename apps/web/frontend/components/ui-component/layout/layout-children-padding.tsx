import React, { ReactNode } from 'react'

export const LayoutChildrenPadding = ({
  children,
}: {
  children: ReactNode
}) => {
  return <div className="flex-1 responsive-width px-10 pt-8">{children}</div>
}
