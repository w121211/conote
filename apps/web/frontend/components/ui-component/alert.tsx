import React, { FC, ReactNode } from 'react'

type AlertType = 'warning' | 'error' | 'success' | 'announce'

const warningBg = `bg-orange-200/50 dark:bg-orange-300/30`
const warningIcon = `text-yellow-500 dark:text-yellow-400`

const errorBg = `bg-red-200/50 dark:bg-red-300/30`
const errorIcon = `text-red-500 dark:text-red-400`

const successBg = `bg-green-200/50 dark:bg-green-300/30`
const successIcon = `text-green-500 dark:text-green-400`

const announceBg = `bg-yellow-300 dark:bg-yellow-400`
// const announceIcon=`text-blue-600 dark:bg-blue-300`

const bg = (type: AlertType) => {
  if (type === 'warning') return warningBg
  if (type === 'error') return errorBg
  if (type === 'success') return successBg
  if (type === 'announce') return announceBg
}

const icon = (type: AlertType) => {
  if (type === 'warning') return warningIcon
  if (type === 'error') return errorIcon
  if (type === 'success') return successIcon
  if (type === 'announce') return ''
}

interface AlertProps {
  children: ReactNode
  type: AlertType
  action?: string
  time?: string // to do: change to Date type
  onClose?: () => void
  visible?: boolean
}

export const Alert: FC<AlertProps> = ({
  type,
  children,
  action,
  time,
  visible = true,
  onClose,
}) => {
  if (!visible) {
    return null
  }
  return (
    <div
      className={`
        py-1 px-1 
        text-sm 
        ${bg(type)}
        `}
    >
      <p className="flex">
        <span
          className={`
            material-icons
            mx-2  
            leading-none
            ${icon(type)}
            `}
        >
          {type === 'warning'
            ? 'warning'
            : type === 'error'
            ? 'error'
            : type === 'success'
            ? 'check_circle'
            : ''}
        </span>

        <span className="flex-grow pt-[2px] dark:text-white break-words whitespace-pre-wrap">
          {action && <span className="font-bold">[{action}]</span>}
          {children}
          <span className="text-gray-400 dark:text-gray-300 text-xs">
            {time}
          </span>
        </span>

        <span
          className="material-icons text-base leading-none text-gray-600 dark:text-gray-200 hover:cursor-pointer"
          onClick={onClose}
        >
          close
        </span>
      </p>
    </div>
  )
}
