import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
// import { Nav } from '../../pages/card/[symbol]'
import MyTooltip from '../tooltip/tooltip'
import RightArrow from '../../assets/svg/right-arrow.svg'
import { getNavLocation, locationToUrl, NavLocation } from '../../components/editor/with-location'
import { UrlObject } from 'url'
import Link from 'next/link'
import { useCardQuery } from '../../apollo/query.graphql'
import { DocIndex } from '../workspace/doc-index'

function getTextWidth(text: string, font?: any) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (context) {
    context.font = font || getComputedStyle(document.body).font
    return Math.ceil(context.measureText(text).width)
  }
}

export interface NavPathProps {
  path?: DocIndex[]
  mirrorHomeUrl?: UrlObject
  location: NavLocation
}

const rePoll = /\B!\(\(poll:(\d+)\)\)\(((?:#[a-zA-Z0-9]+\s)+#[a-zA-Z0-9]+)\)\B/g

const NavPath: React.FC<NavPathProps> = ({ path, mirrorHomeUrl, location }): JSX.Element => {
  const [myPath, setMyPath] = useState<(DocIndex | string)[] | undefined>(path)
  const [hiddenPath, setHiddenPath] = useState<(DocIndex | string)[]>([])

  const [prevPath, setPrevPath] = useState<DocIndex[] | undefined>([])
  const [viewPortWidth, setViewPortWidth] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)

  const router = useRouter()

  const pathRef = useRef<HTMLUListElement>(null)
  const { data } = useCardQuery({
    fetchPolicy: 'cache-first',
    variables: { symbol: router.query.symbol as string },
  })

  if (prevPath !== path && path !== undefined) {
    setMyPath(path)
    setPrevPath(path)
  }

  // useEffect(() => {
  // }, [])

  useEffect(() => {
    if (window) {
      setViewPortWidth(window.innerWidth)
    }
    // window.addEventListener('resize', () => {
    //   setViewPortWidth(window.innerWidth)
    // })

    return () => {
      // window.removeEventListener('resize', () => {
      //   setViewPortWidth(window.innerWidth)
      // })
    }
  }, [])

  useEffect(() => {
    // if (path) {
    //   if (path.length > 2 && viewPortWidth > 0 && 501 > viewPortWidth) {
    //     const pathElementWidth: number[] = []
    //     path.forEach((e, i) => {
    //       const textWidth = getTextWidth(e.title)
    //       if (textWidth) {
    //         const newWidth = textWidth > 80 ? 80 : textWidth
    //         pathElementWidth.push(newWidth)
    //       }
    //     })
    //     if (pathElementWidth.reduce((a, b) => a + b) + 25 * (pathElementWidth.length - 1) > viewPortWidth - 62 - 16) {
    //       let indx = 1
    //       do {
    //         pathElementWidth[indx] = 0
    //         indx += 1
    //       } while (
    //         pathElementWidth.reduce((a, b) => a + b) + 25 * (pathElementWidth.length - indx) + 13 >=
    //         viewPortWidth - 62 - 16
    //       )
    //       const copyArr = [...path]
    //       const filterCopyArr = copyArr.slice(1, indx)
    //       const newCopyArr: (DocEntry | string)[] = [...path]
    //       newCopyArr.splice(1, indx - 1, '...')
    //       newCopyArr.forEach(e => {
    //         if (typeof e !== 'string') {
    //           e.title.replace(rePoll, '')
    //         }
    //       })
    //       setHiddenPath(filterCopyArr)
    //       setMyPath(newCopyArr)
    //     } else {
    //       const newPath = JSON.parse(JSON.stringify(path)) as DocEntry[]
    //       newPath.forEach(e => {
    //         if (typeof e !== 'string') {
    //           e.text = e.text.replace(rePoll, '').trimEnd()
    //         }
    //       })
    //       setMyPath(newPath)
    //     }
    //   } else {
    //     const newPath = JSON.parse(JSON.stringify(path)) as Nav[]
    //     newPath.forEach(e => {
    //       if (typeof e !== 'string') {
    //         //去掉 !((poll))
    //         e.text = e.text.replace(rePoll, '').trimEnd()
    //       }
    //     })
    //     setMyPath(newPath)
    //   }
    // }
  }, [viewPortWidth, path])

  return (
    // <ul className={classes.pathUl} ref={pathRef} style={{ width: `calc(${viewPortWidth}px - 40vw)` }}>
    <ul className="flex items-center flex-wrap text-gray-500" ref={pathRef}>
      {mirrorHomeUrl && (
        <li>
          <Link href={mirrorHomeUrl}>
            <a>{data?.card && data?.card.meta.title}</a>
          </Link>
          <div className="flex items-center flex-shrink-0 mx-2">/{/* <RightArrow /> */}</div>
        </li>
      )}
      {myPath &&
        myPath.length !== 0 &&
        myPath.map((e, i) => (
          <li key={i}>
            {i !== 0 && <div className="flex items-center flex-shrink-0 mx-2">{/* <RightArrow /> */}/</div>}

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
                {/* {typeof e !== 'string' && (
                  <Link href={locationToUrl({ ...location, openedLiPath: e.path })}>
                    <a>
                      {mirrorHomeUrl && e.subEntries.length === 0 && '::'}
                      {!mirrorHomeUrl && i === 0 &&data?.card? data.card.meta.title || e.title : e.text}
                    </a>
                  </Link>
                )} */}
                {/* {typeof e !== 'string' && e.path.length === 0 && (
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
                )} */}
              </span>
            }
          </li>
        ))}
    </ul>
  )
}

export default NavPath
