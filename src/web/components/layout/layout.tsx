import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { useRouter } from 'next/router'
import SideBar from '../sidebar/sidebar'
import MyTooltip from '../my-tooltip/my-tooltip'
import classes from './layout.module.scss'
import MenuIcon from '../../assets/svg/menu.svg'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useMeQuery } from '../../apollo/query.graphql'
import RightArrow from '../../assets/svg/right-arrow.svg'
import { Nav } from '../../pages/card/[symbol]'
import BulletPanel from '../bullet-panel/bullet-panel'

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
  path?: Nav[]
  handlePath?: (i: number) => void
  handleSymbol?: (e: string) => void
}) {
  // const [origin, setOrigin] = useState<string[]>(path)
  const { user, error: userError, isLoading } = useUser()
  const { data: meData, loading: meLoading } = useMeQuery()
  const router = useRouter()
  const [showNav, setShowNav] = useState(true)
  const [myPath, setMyPath] = useState<(Nav | string)[] | undefined>(path)
  const [hiddenPath, setHiddenPath] = useState<(Nav | string)[]>([])
  const [showMenu, setShowMenu] = useState(false)
  const [prevPath, setPrevPath] = useState<Nav[] | undefined>([])
  // const [pathTooLong, setPathTooLong] = useState(false)
  const [viewPortWidth, setViewPortWidth] = useState(0)
  // const [ulOffsetWidth, setUlOffsetWidth] = useState(0)
  // const [liMaxWidth, setLiMaxWidth] = useState<number>(0)
  const [showTooltip, setShowTooltip] = useState(false)
  const [scroll, setScroll] = useState(0)
  const pathRef = useRef<HTMLUListElement>(null)
  const layoutRef = useRef<HTMLDivElement>(null)
  // console.log('layout', path)

  if (prevPath !== path && path !== undefined) {
    setMyPath(path)
    setPrevPath(path)
  }
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

  const handleScroll = () => {
    if (layoutRef.current) {
      //getBoundingClientRect().top 總是<=0
      const clientRectTop = layoutRef.current.getBoundingClientRect().top
      // console.log(clientRectTop, scroll, clientRectTop > scroll)

      if (scroll < clientRectTop) {
        setShowNav(true)
        setScroll(clientRectTop)
      }
      if (scroll > clientRectTop) {
        setShowNav(false)
        setScroll(clientRectTop)
      }
      if (clientRectTop === 0) {
        setShowNav(true)
        setScroll(clientRectTop)
      }
    }
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
    // document.addEventListener(
    //   'scroll',

    //   handleScroll,
    //   true,
    // )
    return () => {
      window.removeEventListener('resize', () => {
        setViewPortWidth(window.innerWidth)
      })
      // document.removeEventListener(
      //   'scroll',

      //   handleScroll,
      //   true,
      // )
    }
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
    if (path) {
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
          const copyArr = [...path]
          const filterCopyArr = copyArr.slice(1, indx)
          // console.log(indx)
          const newCopyArr: (Nav | string)[] = [...path]
          newCopyArr.splice(1, indx - 1, '...')
          // setMyPath(newMyPath)
          console.log(filterCopyArr)
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
    }
  }, [viewPortWidth, path])

  // useEffect(() => {
  //   if (window) {
  //     console.log(window && window.history)
  //   }
  // })
  // console.log('path', path, 'myPath', myPath)

  return (
    <div className={classes.layout} onScroll={handleScroll}>
      <div className={classes.children} ref={layoutRef}>
        {children}
        {/* <footer>footer</footer> */}
      </div>
      <nav
        className={classes.navBar}
        style={showNav ? { transform: 'translateY(0)' } : { transform: 'translateY(-45px)' }}
      >
        <div
          className={classes.menuIconWrapper}
          onClick={() => {
            setShowMenu(prev => !prev)
          }}
        >
          <MenuIcon className={classes.menuIcon} />
        </div>

        <ul className={classes.pathUl} ref={pathRef} style={{ width: `${viewPortWidth - 62}px` }}>
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
                        console.log('clicked')
                      } else {
                        // router.push('')
                        // window.history.go(-(myPath.length - i - 1))
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
                    {typeof e !== 'string' && e.path.length > 0 && (
                      <a className="ui" href={`/card/${router.query.symbol}?p=${e.path.join('.')}`}>
                        {e.text}
                      </a>
                    )}
                    {typeof e !== 'string' && e.path.length === 0 && (
                      <a className="ui" href={`/card/${router.query.symbol}`}>
                        {e.text}
                      </a>
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

                                handlePath && handlePath(ind + 1)
                                setShowTooltip(false)
                                // handleSymbol && handleSymbol(e)
                              }}
                            >
                              {typeof el !== 'string' && (
                                <a
                                  className="ui"
                                  href={`/card/${router.query.symbol}${
                                    el.path.length > 0 ? '?p=' + el.path.join('.') : ''
                                  }`}
                                >
                                  {el.text}
                                </a>
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
          {/* {user || meData ? (
            // <div>
            //   <svg viewBox="0 0 100 100" height="30px" width="30px">
            //     <circle cx="50" cy="50" r="50" fill="#555555"></circle>
            //     <text x="30" y="70" fontSize="70" fill="#ffffff">
            //       {meData?.me.id[0]}
            //     </text>
            //   </svg>
            //   <MyTooltip>
            //     <span>{meData?.me.id}</span>
            <a href="/api/auth/logout" data-type="ui">
              Logout
            </a>
          ) : (
            //   </MyTooltip>
            // </div>
            <a href="/api/auth/login" data-type="ui">
              Login
            </a>
          )} */}
        </ul>
      </nav>

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
