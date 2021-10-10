import React, { createContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Node } from 'slate'
import { BulletEditor } from '../../components/editor/editor'
import { LiElement } from '../../components/editor/slate-custom-types'
import { useLocalValue } from '../../components/editor/use-local-value'
import { isLi } from '../../components/editor/with-list'
import { getNavLocation, locationToUrl, NavLocation } from '../../components/editor/with-location'
import Layout from '../../components/layout/layout'
import NavPath from '../../components/nav-path/nav-path'
import { Poll, useCreateVoteMutation, useMeQuery } from '../../apollo/query.graphql'
import { parseChildren } from '../../components/editor/with-parse'
import classes from '../../style/symbol.module.scss'
import Popover from '../../components/popover/popover'
import { useUser } from '@auth0/nextjs-auth0'
import Popup from '../../components/popup/popup'
import HeaderForm from '../../components/header-form/header-form'

// TODO: 與 li-location 合併
export type Nav = {
  text: string
  path: number[]
}

function getNavs(root: LiElement, destPath: number[]): Nav[] {
  const navs: Nav[] = []
  for (const [n, p] of Node.levels(root, destPath)) {
    // console.log(n, p)
    if (isLi(n)) {
      const [lc] = n.children
      navs.push({
        text: Node.string(lc),
        path: p,
      })
    }
  }
  return navs
}

export const Context = createContext({
  author: '' as string | undefined,
  login: true,
  showLoginPopup: (b: boolean) => {
    '_'
  },
})

const AuthorPage = (): JSX.Element | null => {
  const router = useRouter()
  // const [navs, setNavs] = useState<Nav[]>() // editor route
  const [readonly, setReadonly] = useState(true)
  const [location, setLocation] = useState<NavLocation>()
  const [showMentionedPopup, setShowMentionedPopup] = useState(false)
  const [mentionedPopupContents, setMentionedPopupContents] = useState<undefined | JSX.Element>()
  // const [prevAuthor, setPrevAuthor] = useState<string | undefined>()
  const [disableSubmit, setDisableSubmit] = useState(true)
  const { data: meData, loading: meLoading } = useMeQuery({ fetchPolicy: 'cache-first' })
  const { user, error, isLoading } = useUser()
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [showHeaderForm, setShowHeaderForm] = useState(false)
  const [headerFormSubmited, setHeaderFormSubmited] = useState(false)
  const { data, isValueModified, setValue, submitValue, dropValue } = useLocalValue({ location })
  const [submitFinished, setSubmitFinished] = useState(false)

  //   useEffect(() => {
  //     if (router.isReady) {
  //       const location = getNavLocation(router.query)
  //       setLocation(location)
  //       // console.log(location)
  //       if (router.query.a) {
  //         setAuthorName(router.query.a as string)
  //       }
  //     }
  //   }, [router])

  useEffect(() => {
    if (!meLoading && (meData || user)) {
      // console.log(meData, user)
      setReadonly(false)
    }
  }, [meData, user, meLoading])

  //   useEffect(() => {
  //     if (!showHeaderForm && headerFormSubmited) {
  //       dropValue()
  //       router.reload()
  //     }
  //   }, [headerFormSubmited, showHeaderForm])

  // useEffect(() => {
  //   if (data && location) {
  //     const { self, mirror } = data
  //     // const navs = mirror ? getNavs(mirror.rootLi, location.openedLiPath) : getNavs(self.rootLi, location.openedLiPath)
  //     // navs.pop() // 最後一個是當前的 li ，不需要
  //     // setNavs(navs)
  //     // console.log('navs effect')
  //   }
  // }, [data])

  const navs = useMemo(() => {
    if (data && location) {
      const { self, mirror } = data
      return mirror ? getNavs(mirror.rootLi, location.openedLiPath) : getNavs(self.rootLi, location.openedLiPath)
    }
  }, [data])

  const editor = useMemo(() => {
    if (data && location) {
      const { selfCard, mirror, openedLi, value } = data
      const parsedValue = parseChildren(value)
      return (
        <BulletEditor
          initialValue={parsedValue}
          location={location}
          onValueChange={value => {
            // setDisableSubmit(false)
            setSubmitFinished(false)
            setValue(value)
          }}
          readOnly={readonly}
          selfCard={selfCard}
        />
      )
    }
    return null
  }, [data, readonly])

  //   if (data === undefined || location === undefined) {
  //     return null
  //   }
  return (
    <Layout>
      <div style={{ marginBottom: '3em' }}>
        <div>
          <button
            // className="noBg"
            onClick={() => {
              if (meData || user) {
                setReadonly(!readonly)
              }
              if (!meData && !user) {
                setReadonly(true)
                setShowLoginPopup(true)
              }
            }}
          >
            {readonly || !meData || !user ? '編輯' : '鎖定'}
          </button>
          {showLoginPopup && (
            <Popup
              visible={showLoginPopup}
              hideBoard={() => {
                setShowLoginPopup(false)
              }}
              buttons={
                <button className="primary" onClick={() => setShowLoginPopup(false)}>
                  確定
                </button>
              }
            >
              請先登入！
            </Popup>
          )}

          <button
            className="primary"
            onClick={() => {
              submitValue({
                onFinish: () => {
                  setSubmitFinished(true)
                  setDisableSubmit(true)
                  dropValue()

                  router.reload()
                },
              })
            }}
            disabled={!isValueModified}
          >
            {submitFinished ? '已儲存' : '儲存'}
            {/* {console.log(isValueModified)} */}
          </button>
          {/* <button
          className="primary"
          onClick={() => {
            submitValue({
              onFinish: () => {
                // dropValue()
                router.reload()
              },
            })
          }}
        >
          Submit {isValueModified ? '*' : ''}
        </button> */}

          <button
            onClick={() => {
              dropValue()
              router.reload()
            }}
          >
            {'Drop'}
          </button>
          {/* {data.selfCard.link?.url && (
            <button>
              <a href={data.selfCard.link?.url} target="_blank" rel="noreferrer">
                來源連結
              </a>
            </button>
          )} */}
          {/* {location.author && (
          <button
            onClick={() => {
              setAuthorName(prev => {
                if (prev) {
                  return undefined
                } else {
                  return location.author
                }
              })
            }}
          >
            {location.author}
          </button>
        )} */}

          {/* {mirror && (
          <span>
            <Link href={locationToUrl({ selfSymbol: location.selfSymbol, openedLiPath: [] })}>
              <a>Home</a>
            </Link>
            ...
          </span>
        )} */}

          {/* {/* {navs &&
          navs.map((e, i) => (
            <Link href={locationToUrl({ ...location, openedLiPath: e.path })} key={i}>
              <a>{e.text}</a>
            </Link>
          ))} */}
          {/* <NavPath
            path={navs}
            location={{ ...location }}
            mirrorHomeUrl={data.mirror && locationToUrl({ selfSymbol: location.selfSymbol, openedLiPath: [] })}
          /> */}
          {/* {data.selfCard.link?.authorName && <span>@{data.selfCard.link?.authorName}</span>} */}

          {/* {router.query.a && (
            <button
              className="transparent"
              onClick={() => {
                setAuthorName(prev => {
                  if (prev) {
                    return undefined
                  } else {
                    return (router.query.a as string) ?? undefined
                  }
                })
              }}
            >
              {router.query.a}

              <div className={`${classes.toggle} ${authorName && classes.toggleClicked}`}></div>
            </button>
          )} */}
          {/* <button
            className="secondary"
            onClick={() => {
              setShowHeaderForm(true)
            }}
          >
            編輯詳細資訊
          </button> */}
          {/* // )} */}
          {/* {showHeaderForm && (
            <Popover
              visible={showHeaderForm}
              hideBoard={() => {
                setShowHeaderForm(false)
              }}
            >
              <HeaderForm
                symbol={router.query.symbol as string}
                initialValue={{
                  author: data.selfCard.meta.author ?? '',
                  title: data.selfCard.meta.title ?? '',
                  url: data.selfCard.meta.url ?? '',
                  keywords: data.selfCard.meta.keywords?.join(' ') ?? '',
                  redirects: data.selfCard.meta.redirects?.join(' ') ?? '',
                  duplicates: data.selfCard.meta.duplicates?.join(' ') ?? '',
                }}
                handleSubmitted={isSubmitted => {
                  setHeaderFormSubmited(isSubmitted)
                }}
              />
            </Popover>
          )} */}
          <h3 className={classes.header}>
            {router.query.authorName}
            {/* <span className={classes.author}>@{data.selfCard.meta.author}</span> */}
          </h3>
          <table>
            <th>網址</th>
            <td>www.xxx.yyy.com</td>
          </table>
          <h4>最新</h4>
          <ul>
            <li>$AA #buy</li>
            <li>$BB #sell</li>
          </ul>
          <h4>文章</h4>
          <ul>
            <li>晶片荒惡化費半大跌 交期拉長至逾20周</li>
            <li>哈哈晶片荒惡化費</li>
          </ul>
          <h4>Mention in</h4>
          <ul>
            <li
              onMouseOver={e => {
                e.stopPropagation()
                setShowMentionedPopup(true)
              }}
              //   onMouseLeave={e => {
              //     e.stopPropagation
              //     setShowMentionedPopup(false)
              //   }}
              style={{ position: 'relative', display: 'block' }}
            >
              @ARK OOOOOOO
            </li>
            <li>xxxxxxx @ARK OOOOOOO</li>
          </ul>

          {/* <h3>{Node.string(data.openedLi.children[0])}</h3> */}
          {/* {data.selfCard.meta && ( */}
          {/* {console.log(data.selfCard.meta)} */}
          {/* {console.log(data.openedLi)} */}
        </div>
        {/* <Context.Provider
          value={{
            author: authorName,
            login: meData ? true : false,
            showLoginPopup: (b: boolean) => {
              setShowLoginPopup(b)
            },
          }}
        >
          <div
            onClick={e => {
              e.preventDefault()
              if (!meLoading && !meData && !user) {
                setShowLoginPopup(true)
              }
            }}
          >
            {editor}
          </div>
          <Popover
            visible={!!router.query.m}
            hideBoard={() => {
              router.push(`/card/${encodeURIComponent(location.selfSymbol)}`)
            }}
          >
            {editor}
          </Popover>
        </Context.Provider> */}
      </div>
      {showMentionedPopup && (
        <Popup
          visible={showMentionedPopup}
          hideBoard={() => {
            setShowMentionedPopup(false)
          }}
          noMask={true}
        >
          文章peek
        </Popup>
      )}
    </Layout>
  )
}

export default AuthorPage
