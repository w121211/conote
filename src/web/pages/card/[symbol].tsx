import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Node } from 'slate'
import { BulletEditor, EmojiButotn } from '../../components/editor/editor'
import { LiElement } from '../../components/editor/slate-custom-types'
import { useLocalValue } from '../../components/editor/use-local-value'
import { isLi } from '../../components/editor/with-list'
import { getNavLocation, locationToUrl, NavLocation } from '../../components/editor/with-location'
import Layout from '../../components/layout/layout'
import NavPath from '../../components/nav-path/nav-path'
import { CardMeta, useEmojisQuery, useMeQuery } from '../../apollo/query.graphql'
import { parseChildren } from '../../components/editor/with-parse'
import classes from '../../style/symbol.module.scss'
import Popover from '../../components/popover/popover'
import { useUser } from '@auth0/nextjs-auth0'
import Popup from '../../components/popup/popup'
import HeaderForm from '../../components/header-form/header-form'
import Link from 'next/link'
import LinkIcon from '../../assets/svg/link.svg'

// TODO: 與 li-location 合併
export type Nav = {
  text: string
  path: number[]
}

function getNavs(root: LiElement, destPath: number[], meta: CardMeta): Nav[] {
  const navs: Nav[] = []
  for (const [n, p] of Node.levels(root, destPath)) {
    if (isLi(n)) {
      const [lc] = n.children
      // console.log(s)
      // if (lc.rootBulletDraft?.root) {
      //   navs.push({ text: meta.title || Node.string(lc), path: p })
      // } else {
      navs.push({
        text: Node.string(lc),
        path: p,
      })
      // }
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

// export const Context = createContext({
//   author: '' as string | undefined,
//   login: true,
//   showLoginPopup: (b: boolean) => {
//     '_'
//   },
// })
const rePoll = /\B!\(\(poll:(\d+)\)\)\(((?:#[a-zA-Z0-9]+\s)+#[a-zA-Z0-9]+)\)\B/g

const CardSymbolPage = (): JSX.Element | null => {
  const router = useRouter()
  // const [navs, setNavs] = useState<Nav[]>() // editor route
  const [readonly, setReadonly] = useState(true)
  const [location, setLocation] = useState<NavLocation>()
  const [authorName, setAuthorName] = useState<string | undefined>((router.query.a as string) ?? undefined)
  // const [prevAuthor, setPrevAuthor] = useState<string | undefined>()
  const [disableSubmit, setDisableSubmit] = useState(true)
  const { data: meData, loading: meLoading } = useMeQuery({ fetchPolicy: 'cache-first' })
  const { user, error, isLoading } = useUser()
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [showHeaderForm, setShowHeaderForm] = useState(false)
  const [headerFormSubmited, setHeaderFormSubmited] = useState(false)
  const { data, isValueModified, setValue, submitValue, dropValue } = useLocalValue({ location })
  const [submitFinished, setSubmitFinished] = useState(false)
  const { data: emojiData } = useEmojisQuery({
    fetchPolicy: 'cache-first',
    variables: { bulletId: data?.openedLi.children[0].id ?? '' },
  })
  // const [openLiHashtags, setOpenLiHashtags] = useState<Hashtag[]>([])
  // const [queryHashtags, { data: hashtagData }] = useHashtagsLazyQuery({
  //   fetchPolicy: 'cache-first',
  //   variables: { symbol: data?.self.symbol ?? '' },
  // })

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
    if (!meLoading && (meData || user)) {
      // console.log(meData, user)
      setReadonly(false)
    }
  }, [meData, user, meLoading])

  useEffect(() => {
    if (!showHeaderForm && headerFormSubmited) {
      dropValue()
      router.reload()
    }
  }, [headerFormSubmited, showHeaderForm])

  // useEffect(() => {
  //   queryHashtags()
  //   if (hashtagData?.hashtags && data) {
  //     const newHashtagsArr: Hashtag[] = []
  //     hashtagData?.hashtags?.forEach(e => {
  //       if (e.bulletId === data.openedLi.children[0].id) {
  //         newHashtagsArr.push(e)
  //       }
  //     })
  //     setOpenLiHashtags(newHashtagsArr)
  //   }
  // }, [data?.openedLi])

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

      return mirror
        ? getNavs(mirror.rootLi, location.openedLiPath, data.selfCard.meta)
        : getNavs(self.rootLi, location.openedLiPath, data.selfCard.meta)
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

  if (data === undefined || location === undefined) {
    return null
  }

  return (
    <Layout>
      <div style={{ marginBottom: '3em' }}>
        <div>
          <NavPath
            path={navs}
            location={{ ...location }}
            mirrorHomeUrl={data.mirror && locationToUrl({ selfSymbol: location.selfSymbol, openedLiPath: [] })}
          />
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

          {data.openedLi.children[0].rootBulletDraft && (
            <button
              className="secondary"
              onClick={() => {
                setShowHeaderForm(true)
              }}
            >
              編輯卡片資訊
            </button>
          )}
          {/* // )} */}
          {showHeaderForm && (
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
                  title: (data.selfCard.meta.title || data.selfCard.link?.url) ?? '',
                  url: (data.selfCard.meta.url || data.selfCard.link?.url) ?? '',
                  keywords: data.selfCard.meta.keywords?.map(e => {
                    return { label: e, value: e }
                  }) ?? [{ label: '', value: '' }],
                  redirects: data.selfCard.meta.redirects?.join(' ') ?? '',
                  duplicates: data.selfCard.meta.duplicates?.join(' ') ?? '',
                }}
                handleSubmitted={isSubmitted => {
                  setHeaderFormSubmited(isSubmitted)
                }}
              />
            </Popover>
          )}
          <div className={classes.header}>
            <h3>
              {router.query.p && Node.string(data.openedLi.children[0]).replace(rePoll, '').trimEnd()}
              {data.mirror && !router.query.p && data.mirror.symbol}
              {!router.query.p && !data.mirror && <>{data.selfCard.meta.title ?? data.selfCard.symbol}</>}
            </h3>
            {data.selfCard.link?.url && (
              // <button>
              <a href={data.selfCard.link?.url} target="_blank" rel="noreferrer">
                {/* 來源連結 */}
                <LinkIcon />
              </a>
              // </button>
            )}
            {data.selfCard.meta.author && (
              <Link href={`/author/${encodeURIComponent('@' + data.selfCard.meta.author)}`}>
                <a className={classes.author}>@{data.selfCard.meta.author}</a>
              </Link>
            )}
          </div>
          {/* {hashtags && <div>{hashtags.text}</div>} */}
          {/* {openLiHashtags.length > 0 && (
            <div>
              {openLiHashtags.map((e, i) => {
                return <EmojiButotn key={i} emoji={e} />
              })}
            </div>
          )}
 */}
          {/* {console.log(data.openedLi.children[0].id)} */}

          {/* <h3>{Node.string(data.openedLi.children[0])}</h3> */}
          {/* {data.selfCard.meta && ( */}
          {/* {console.log(data.selfCard.meta)} */}
          {/* {console.log(data.openedLi)} */}
        </div>
        {/* <div
        // onClick={e => {
        //   // e.preventDefault()
        //   if (!meLoading && !meData && !user) {
        //     setShowLoginPopup(true)
        //   }
        // }}
        > */}
        {editor}
        {/* </div> */}
        {/* <Context.Provider
                value={{
                  author: authorName,
                  login: meData ? true : false,
                  showLoginPopup: (b: boolean) => {
                    setShowLoginPopup(b)
                  },
                }}
              >
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
    </Layout>
  )
}

export default CardSymbolPage
