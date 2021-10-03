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

/**
 * @param poll
 * @param author 若給予視為代表 author 投票
 */
// const PollComponent = (props: { poll: Poll; author?: string }): JSX.Element => {
//   const { poll, author } = props
//   const [createVote] = useCreateVoteMutation({
//     update(cache, { data }) {
//       // const res = cache.readQuery<MyVotesQuery>({
//       //   query: MyVotesDocument,
//       // })
//       // if (data?.createVote && res?.myVotes) {
//       //   cache.writeQuery({
//       //     query: MyVotesDocument,
//       //     data: { myVotes: res.myVotes.concat([data.createVote]) },
//       //   })
//       // }
//       // refetch()
//     },
//     // refetchQueries: [{ query: BoardDocument, variables: { id: boardId } }],
//   })
//   const onVote = () => {
//     // 已經投票且生效，不能再投
//     // 尚未投票，可以投
//     // 送出按鈕
//   }

//   return (
//     <>
//       {poll.choices.map((e, i) => (
//         <button
//           key={i}
//           onClick={event => {
//             createVote({
//               variables: {
//                 pollId: poll.id,
//                 data: { choiceIdx: i },
//               },
//             })
//           }}
//         >
//           {e}
//         </button>
//       ))}
//     </>
//   )
// }

export const Context = createContext({
  author: '' as string | undefined,
  login: false,
  showLoginPopup: (b: boolean) => {
    ;('')
  },
})

const CardSymbolPage = (): JSX.Element | null => {
  const router = useRouter()
  // const [navs, setNavs] = useState<Nav[]>() // editor route
  const [readonly, setReadonly] = useState(true)
  const [location, setLocation] = useState<NavLocation>()
  const { data, setLocalValue, submitValue, dropValue } = useLocalValue({ location })
  const [authorName, setAuthorName] = useState<string | undefined>((router.query.a as string) ?? undefined)
  // const [prevAuthor, setPrevAuthor] = useState<string | undefined>()
  const [disableSubmit, setDisableSubmit] = useState(true)
  const { data: meData, loading: meLoading } = useMeQuery({ fetchPolicy: 'cache-first' })
  const { user, error, isLoading } = useUser()
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [showHeaderForm, setShowHeaderForm] = useState(false)
  const { data, isValueModified, setValue, submitValue, dropValue } = useLocalValue({ location })
  const [authorName, setAuthorName] = useState<string | undefined>(
    data?.selfCard.link?.authorName?.split(':', 1)[0] ?? undefined,
  )
  const [prevAuthor, setPrevAuthor] = useState<string | undefined>()

  // if (
  //   data?.selfCard.link?.authorName?.split(':', 1)[0] !== undefined &&
  //   data?.selfCard.link?.authorName?.split(':', 1)[0] !== prevAuthor
  // ) {
  //   setAuthorName(data?.selfCard.link?.authorName?.split(':', 1)[0])
  //   setPrevAuthor(data?.selfCard.link?.authorName?.split(':', 1)[0])
  // }

  useEffect(() => {
    if (router.isReady) {
      const location = getNavLocation(router.query)
      setLocation(location)
      // console.log(location)
      if (router.query.a) {
        setAuthorName(router.query.a as string)
      }
    }
  }, [router])

  useEffect(() => {
    if (meData || user) {
      // console.log(meData, user)
      setReadonly(false)
    }
  }, [meData, user])

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
            setLocalValue(value)
            setDisableSubmit(false)
            setValue(value)
          }}
          readOnly={readonly}
          selfCard={selfCard}
        />
      )
    }
    return null
  }, [data, readonly])

  if (data === undefined || location === undefined) {
    return null
  }
  return (
    <Layout>
      <div style={{ marginBottom: '3em' }}>
        <div>
          <button
            className="noBg"
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
                  // dropValue()
                  // router.reload()
                },
              })
            }}
            disabled={disableSubmit}
          >
            Submit
          </button>
        <button
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
        </button>

          <button
            onClick={() => {
              dropValue()
              router.reload()
            }}
          >
            {'Drop'}
          </button>
          {data.selfCard.link?.url && (
            <a href={data.selfCard.link?.url} target="_blank" rel="noreferrer">
              來源連結
            </a>
          )}
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
          <NavPath
            path={navs}
            mirrorHomeUrl={data.mirror && locationToUrl({ selfSymbol: location.selfSymbol, openedLiPath: [] })}
          />
          {/* {data.selfCard.link?.authorName && <span>@{data.selfCard.link?.authorName}</span>} */}

          {router.query.a && (
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
          )}
          <h3>{Node.string(data.openedLi.children[0])}</h3>
          <button
            className="secondary"
            onClick={() => {
              setShowHeaderForm(true)
            }}
          >
            詳細資訊
          </button>
          {
            <Popover
              visible={showHeaderForm}
              hideBoard={() => {
                setShowHeaderForm(false)
              }}
            >
              <HeaderForm initialValue={{ authorName: `${authorName ?? ''}`, props: [{ title: '', value: '' }] }} />
            </Popover>
          }
          {/* {console.log(data.openedLi)} */}
        </div>
        <Context.Provider
          value={{
            author: authorName,
            login: meData || user ? true : false,
            showLoginPopup: (b: boolean) => {
              setShowLoginPopup(b)
            },
          }}
        >
          <div
            onClick={e => {
              e.preventDefault()
              if (!meData && !user) {
                setShowLoginPopup(true)
              }
            }}
          >
            {editor}
          </div>
          {/* <Popover
            visible={!!router.query.m}
            hideBoard={() => {
              router.push(`/card/${encodeURIComponent(location.selfSymbol)}`)
            }}
          >
            {editor}
          </Popover> */}
        </Context.Provider>
      </div>
    </Layout>
  )
}

export default CardSymbolPage
