import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { useRouter } from 'next/router'
import SideBar from '../sidebar/sidebar'
import MyTooltip from '../my-tooltip/my-tooltip'
import classes from './layout.module.scss'
import MenuIcon from '../../assets/svg/menu.svg'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useMeQuery } from '../../apollo/query.graphql'
import RightArrow from '../../assets/svg/right-arrow.svg'

function getTextWidth(text: string, font?: any) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (context) {
    context.font = font || getComputedStyle(document.body).font

    // console.log(context.font)

    return Math.ceil(context.measureText(text).width)
    // return Math.round((context.measureText(text).width + Number.EPSILON) * 100) / 100
  }
}

export default function Layout({
  children,
  path,
  handlePath,
  handleSymbol,
}: {
  children: React.ReactNode
  path: string[]
  handlePath?: (i: number) => void
  handleSymbol?: (e: string) => void
}) {
  // const [origin, setOrigin] = useState<string[]>(path)
  const router = useRouter()
  const [myPath, setMyPath] = useState<string[]>([...path])
  const [hiddenPath, setHiddenPath] = useState<string[]>([])
  const [showMenu, setShowMenu] = useState(false)
  const [prevPath, setPrevPath] = useState<string[]>([])
  // const [pathTooLong, setPathTooLong] = useState(false)
  const [viewPortWidth, setViewPortWidth] = useState(0)
  // const [ulOffsetWidth, setUlOffsetWidth] = useState(0)
  // const [liMaxWidth, setLiMaxWidth] = useState<number>(0)
  const [showTooltip, setShowTooltip] = useState(false)
  const pathRef = useRef<HTMLUListElement>(null)
  // const pathLiRef = useRef<any[]>([])

  // if (path !== prevPath) {
  //   if (path.length > 2 && viewPortWidth > 0 && 501 > viewPortWidth) {
  //     const pathElementWidth: number[] = []
  //     path.forEach((e, i) => {
  //       const textWidth = getTextWidth(e)
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
  //         // console.log(
  //         //   pathElementWidth,
  //         //   pathElementWidth.reduce((a, b) => a + b) + 25 * (pathElementWidth.length - indx) + 15,
  //         //   viewPortWidth - 62 - 16,
  //         // )
  //       } while (
  //         pathElementWidth.reduce((a, b) => a + b) + 25 * (pathElementWidth.length - indx) + 13 >=
  //         viewPortWidth - 62 - 16
  //       )
  //       // console.log(pathElementWidth, pathElementWidth.reduce((a, b) => a + b) + 10, viewPortWidth - 62 - 16)
  //       const copyArr: string[] = [...path]
  //       const filterCopyArr = copyArr.slice(1, indx + 1)

  //       const newCopyArr = [...path]
  //       newCopyArr.splice(1, indx - 1, '...')
  //       // setMyPath(newMyPath)
  //       setHiddenPath(filterCopyArr)
  //       setMyPath(newCopyArr)
  //       // console.log(newCopyArr)
  //     } else {
  //       setMyPath(path)
  //     }
  //   } else {
  //     setMyPath(path)
  //   }
  //   setPrevPath(path)
  // }

  const showMenuHandler = () => {
    setShowMenu(false)
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
    return window.removeEventListener('resize', () => {
      setViewPortWidth(window.innerWidth)
    })
  }, [])

  // useEffect(() => {
  //   // setMyPath([...path])

  //   if (pathLiRef.current[0]) {
  //     setLiMaxWidth(
  //       (viewPortWidth - 62 - 25 * (path.length - 1) - 16 - pathLiRef.current[0].clientWidth) / (path.length - 1),
  //     )
  //   }
  // }, [])

  useEffect(() => {
    // console.log('pathEffect')
    // if (path.length >= 4) {
    //   const nestedPath: string[] = []
    //   const newPath: string[] = []
    //   nestedPath.push(...path.slice(1, -2))
    //   newPath.push(path[0], '...', ...path.slice(-2))
    //   setMyPath(newPath)
    //   setHiddenPath(nestedPath)
    // } else {
    //   setMyPath([...path])
    //   setHiddenPath([])
    // }

    if (path.length > 2 && viewPortWidth > 0 && 501 > viewPortWidth) {
      const pathElementWidth: number[] = []
      path.forEach((e, i) => {
        const textWidth = getTextWidth(e)
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
          // console.log(
          //   pathElementWidth,
          //   pathElementWidth.reduce((a, b) => a + b) + 25 * (pathElementWidth.length - indx) + 15,
          //   viewPortWidth - 62 - 16,
          // )
        } while (
          pathElementWidth.reduce((a, b) => a + b) + 25 * (pathElementWidth.length - indx) + 13 >=
          viewPortWidth - 62 - 16
        )
        // console.log(pathElementWidth, pathElementWidth.reduce((a, b) => a + b) + 10, viewPortWidth - 62 - 16)
        const copyArr: string[] = [...path]
        const filterCopyArr = copyArr.slice(1, indx)
        // console.log(indx)
        const newCopyArr = [...path]
        newCopyArr.splice(1, indx - 1, '...')
        // setMyPath(newMyPath)
        setHiddenPath(filterCopyArr)
        setMyPath(newCopyArr)
        // console.log(newCopyArr)
      } else {
        setMyPath([...path])
      }
    } else {
      // console.log(path)
      setMyPath([...path])
    }
  }, [viewPortWidth, path])

  // useEffect(() => {
  //   if (window) {
  //     console.log(window && window.history)
  //   }
  // })
  // console.log('path', path, 'myPath', myPath)

  return (
    <div className={classes.layout}>
      <div className={classes.children}>{children}</div>
      <div className={classes.navBar}>
        <div
          className={classes.menuIconWrapper}
          onClick={() => {
            setShowMenu(prev => !prev)
          }}
        >
          <MenuIcon className={classes.menuIcon} />
        </div>

        <ul className={classes.pathUl} ref={pathRef} style={{ maxWidth: `${viewPortWidth - 62}px` }}>
          {myPath.length !== 0 &&
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
                      if (e === '...') {
                        ev.preventDefault()

                        setShowTooltip(prev => !prev)
                      } else {
                        window.history.go(-(myPath.length - i - 1))
                        // router.push(`/card/${encodeURIComponent(e)}`)
                        handlePath && handlePath(i)
                        // handleSymbol && handleSymbol(e)
                      }
                    }}
                    style={{
                      maxWidth: '80px',
                      overflow: `${e === '...' ? 'visible' : 'hidden'}`,
                      justifyContent: `${e === '...' ? 'center' : 'flex-start'}`,
                    }}

                    // style={
                    //   myPath.length < 4
                    //     ? { maxWidth: `${(viewPortWidth - 62 - 25 * (myPath.length - 1)) / myPath.length}px` }
                    //     : { maxWidth: `${(viewPortWidth - 62 - 25 * 3 - 13) / 3}px` }
                    // }
                  >
                    {e}
                    {showTooltip && e === '...' && (
                      <MyTooltip
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
                                window.history.go(-(myPath.length + hiddenPath.length - 1 - 1 - (ind + 1)))
                                handlePath && handlePath(ind + 1)
                                setShowTooltip(false)
                                // handleSymbol && handleSymbol(e)
                              }}
                            >
                              {el}
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
      </div>
      {/* <div className={classes.sideBarContainer} style={showMenu ? { visibility: 'visible' } : { visibility: 'hidden' }}> */}
      <div
        className={classes.mask}
        style={showMenu ? { opacity: 1, visibility: 'visible' } : { opacity: 0, visibility: 'hidden' }}
        onClick={() => {
          setShowMenu(false)
        }}
      ></div>
      <SideBar
        showMenuHandler={showMenuHandler}
        style={showMenu ? { transform: 'translate3d(0,0,0)' } : { transform: 'translate3d(-100%,0,0)' }}
      />
      {/* </div> */}
    </div>
  )
}
