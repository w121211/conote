import React, { ReactNode } from 'react'

// export const BlockListContainer = styled.div`
//   display: flex;
//   flex-direction: column;
// `
export const BlockListContainer = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col">{children}</div>
}
