import { Tooltip } from 'antd'
import { ReactChild } from 'react'
import classes from './my-tooltip.module.scss'

export const MyTooltip = ({ children, title }: { children: ReactChild; title: string }) => {
  return (
    <Tooltip title={title} overlayClassName={classes.tooltip}>
      {children}
    </Tooltip>
  )
}
