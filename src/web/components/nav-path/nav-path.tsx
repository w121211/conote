import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Nav } from '../../pages/card/[symbol]'
import MyTooltip from '../my-tooltip/my-tooltip'
import RightArrow from '../../assets/svg/right-arrow.svg'

import classes from './nav-path.module.scss'
import { UrlObject } from 'url'
import Link from 'next/link'

function getTextWidth(text: string, font?: any) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (context) {
    context.font = font || getComputedStyle(document.body).font
    return Math.ceil(context.measureText(text).width)
  }
}

export interface NavPathProps {
  path?: Nav[]
  mirrorHomeUrl?: UrlObject
}

const NavPath: React.FC<NavPathProps> = ({ path, mirrorHomeUrl }): JSX.Element => {
  const [myPath, setMyPath] = useState<(Nav | string)[] | undefined>(path)
  const [hiddenPath, setHiddenPath] = useState<(Nav | string)[]>([])

  const [prevPath, setPrevPath] = useState<Nav[] | undefined>([])
  const [viewPortWidth, setViewPortWidth] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)

  const router = useRouter()

  const pathRef = useRef<HTMLUListElement>(null)

  if (prevPath !== path && path !== undefined) {
    setMyPath(path)
    setPrevPath(path)
  }

  useEffect(() => {
    if (window) {
      setViewPortWidth(window.innerWidth)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('resize', () => {
      setViewPortWidth(window.innerWidth)
    })

    return () => {
      window.removeEventListener('resize', () => {
        setViewPortWidth(window.innerWidth)
      })
    }
  }, [])

  useEffect(() => {
    if (path) {
      if (path.length > 2 && viewPortWidth > 0 && 501 > viewPortWidth) {
        const pathElementWidth: number[] = []
        path.forEach((e, i) => {
          const textWidth = getTextWidth(e.text)
          if (textWidth) {
            const newWidth = textWidth > 80 ? 80 : textWidth
            pathElementWidth.push(newWidth)
          }
        })
        if (pathElementWidth.reduce((a, b) => a + b) + 25 * (pathElementWidth.length - 1) > viewPortWidth - 62 - 16) {
          let indx = 1
          do {
            pathElementWidth[indx] = 0
            indx += 1
          } while (
            pathElementWidth.reduce((a, b) => a + b) + 25 * (pathElementWidth.length - indx) + 13 >=
            viewPortWidth - 62 - 16
          )
          const copyArr = [...path]
          const filterCopyArr = copyArr.slice(1, indx)

          const newCopyArr: (Nav | string)[] = [...path]
          newCopyArr.splice(1, indx - 1, '...')

          setHiddenPath(filterCopyArr)
          setMyPath(newCopyArr)
        } else {
          setMyPath([...path])
        }
      } else {
        setMyPath([...path])
      }
    }
  }, [viewPortWidth, path])

  return (
    <ul className={classes.pathUl} ref={pathRef} style={{ width: `${viewPortWidth - 62}px` }}>
      {mirrorHomeUrl && (
        <li>
          <span>
            <Link href={mirrorHomeUrl}>
              <a>Home</a>
            </Link>
          </span>
          <div className={classes.rightArrow}>
            <RightArrow />
          </div>
        </li>
      )}
      {myPath &&
        myPath.length !== 0 &&
        myPath.map((e, i) => (
          <li key={i}>
            {i !== 0 && (
              <div className={classes.rightArrow}>
                <RightArrow />
              </div>
            )}

            {
              <span
                // ref={e => {
                //   pathLiRef.current[i] = e
                // }}
                onClick={ev => {
                  if (typeof e === 'string' && e === '...') {
                    ev.preventDefault()
                    setShowTooltip(prev => !prev)
                  }
                }}
                style={{
                  overflow: `${e === '...' ? 'visible' : 'hidden'}`,
                  justifyContent: `${e === '...' ? 'center' : 'flex-start'}`,
                }}
              >
                {typeof e !== 'string' && e.path.length > 0 && (
                  <Link href={`/card/${encodeURIComponent(router.query.symbol as string)}?p=${e.path.join('.')}`}>
                    <a className="ui">{e.text}</a>
                  </Link>
                )}
                {typeof e !== 'string' && e.path.length === 0 && (
                  <Link href={`/card/${encodeURIComponent(e.text)}`}>
                    <a className="ui">{e.text}</a>
                  </Link>
                )}
                {e === '...' && e}
                {showTooltip && e === '...' && (
                  <MyTooltip
                    className={classes.tooltip}
                    visible={showTooltip}
                    handleVisibleState={s => {
                      setShowTooltip(s)
                    }}
                  >
                    {hiddenPath.map((el, ind) => {
                      return (
                        <span
                          key={ind}
                          onClick={ev => {
                            ev.stopPropagation()
                            setShowTooltip(false)
                          }}
                        >
                          {typeof el !== 'string' && (
                            <Link
                              href={`/card/${encodeURIComponent(router.query.symbol as string)}${
                                el.path.length > 0 ? '?p=' + el.path.join('.') : ''
                              }`}
                            >
                              <a className="ui">{el.text}</a>
                            </Link>
                          )}
                        </span>
                      )
                    })}
                  </MyTooltip>
                )}
              </span>
            }
          </li>
        ))}
    </ul>
  )
}

export default NavPath
