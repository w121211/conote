import React, { FC } from 'react'
import { styleSymbol } from './style-fc/style-symbol'

const warningBg = `bg-orange-200/50 dark:bg-orange-300/30`
const warningIcon = `text-yellow-500 dark:text-yellow-400`

const errorBg = `bg-red-200/50 dark:bg-red-300/30`
const errorIcon = `text-red-500 dark:text-red-400`

const successBg = `bg-green-200/50 dark:bg-green-300/30`
const successIcon = `text-green-500 dark:text-green-400`

type AlertType = 'warning' | 'error' | 'success'

const bg = (type: AlertType) => {
  if (type === 'warning') return warningBg
  if (type === 'error') return errorBg
  if (type === 'success') return successBg
}

const icon = (type: AlertType) => {
  if (type === 'warning') return warningIcon
  if (type === 'error') return errorIcon
  if (type === 'success') return successIcon
}

interface AlertProps {
  str: string
  type: AlertType
  action: string
  time: string // to do: change to Date type
  onClose: () => void
  visible: boolean
}

export const Alert: FC<AlertProps> = ({
  str,
  action,
  time,
  type,
  visible,
  onClose,
}) => {
  if (!visible) {
    return null
  }
  return (
    <div
      className={`
        py-2 px-1 
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
            : 'check_circle'}
        </span>
        <p className="flex-grow pt-[2px] dark:text-white break-words whitespace-pre-wrap">
          <span className="font-bold">[{action}]</span>
          {styleSymbol(str, '')}
          <span className="text-gray-400 dark:text-gray-300 text-xs">
            {time}
          </span>
        </p>
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
