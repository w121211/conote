import moment from 'moment'
import React, { ReactNode, useState } from 'react'

type AlertType = 'warning' | 'error' | 'success' | 'announce'

const warnningBg = `bg-orange-200/50 dark:bg-orange-300/30`
const warnningIcon = `text-yellow-500 dark:text-yellow-400`

const errorBg = `bg-red-200/50 dark:bg-red-300/30`
const errorIcon = `text-red-500 dark:text-red-400`

const successBg = `bg-green-200/50 dark:bg-green-300/30`
const successIcon = `text-green-500 dark:text-green-400`

const announceBg = `bg-yellow-200/60 dark:bg-yellow-400`
// const announceIcon=`text-blue-600 dark:bg-blue-300`

const bg = (type: AlertType) => {
  if (type === 'warning') return warnningBg
  if (type === 'error') return errorBg
  if (type === 'success') return successBg
  if (type === 'announce') return announceBg
}

const icon = (type: AlertType) => {
  if (type === 'warning') return warnningIcon
  if (type === 'error') return errorIcon
  if (type === 'success') return successIcon
  if (type === 'announce') return ''
}

type Props = {
  children: ReactNode
  type: AlertType
  action?: string
  time?: Date // to do: change to Date type
  onClose?: () => void
  visible?: boolean
  closable?: boolean
}

/**
 * @reference https://flowbite.com/docs/components/alerts/
 */
export const Alert: React.FC<Props> = ({
  type,
  children,
  action,
  time,
  visible = true,
  // onClose,
  closable = false,
}) => {
  const [fold, setFold] = useState(true)
  const onClickFold = () => {
    setFold(!fold)
  }
  const [show, setShow] = useState(true)

  if (!visible) {
    return null
  }
  if (!show) {
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
            material-icons-outlined
            flex items-center
            mx-2
            text-lg  
            leading-none
            ${icon(type)}
            `}
        >
          {type === 'warning'
            ? 'warnning'
            : type === 'error'
            ? 'error'
            : type === 'success'
            ? 'check_circle'
            : ''}
        </span>

        <span
          className={`
          flex-grow 
          dark:text-white 
          break-words whitespace-pre-wrap
          ${fold ? 'line-clamp-1' : ''}
          `}
        >
          {action && <span className="font-bold">[{action}]</span>}
          {children}
          {time && (
            <span className="text-amber-400 dark:text-amber-300 text-xs">
              {moment(time).calendar()}
            </span>
          )}
        </span>
        {React.Children.toArray(children).length > 1 && (
          <div className="inline-flex mt-0.5 mr-1 ">
            <span
              className={`
            material-icons-outlined
            h-fit
            text-lg leading-none text-amber-600 dark:text-amber-200 
            hover:cursor-pointer
            ${fold ? '' : 'rotate-180'}
            `}
              onClick={onClickFold}
            >
              keyboard_arrow_down
            </span>
          </div>
        )}

        {closable && (
          <span
            className="material-icons-outlined inline-flex mt-0.5 text-base leading-none text-amber-600 dark:text-amber-200 hover:cursor-pointer"
            // onClick={onClose}
            onClick={() => setShow(false)}
          >
            close
          </span>
        )}
      </p>
    </div>
  )
}
