import React, { createContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Node } from 'slate'
import { BulletEditor } from '../../components/editor/editor'
import { LiElement } from '../../components/editor/slate-custom-types'
import { useLocalValue } from '../../components/editor/use-local-value'
import { isLi } from '../../components/editor/with-list'
import { getNavLocation, locationToUrl, NavLocation } from '../../components/editor/with-location'
import Layout from '../../components/layout/layout'
import NavPath from '../../components/nav-path/nav-path'
import { Poll, useCreateVoteMutation } from '../../apollo/query.graphql'
import { parseChildren } from '../../components/editor/with-parse'
import classes from '../../style/symbol.module.scss'

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

export const AuthorContext = createContext({ author: '' as string | undefined })

const CardSymbolPage = (): JSX.Element | null => {
  const router = useRouter()
  // const [navs, setNavs] = useState<Nav[]>() // editor route
  const [readonly, setReadonly] = useState(false)
  const [location, setLocation] = useState<NavLocation>()
  const { data, setLocalValue, submitValue, dropValue } = useLocalValue({ location })
  const [authorName, setAuthorName] = useState<string | undefined>(
    data?.selfCard.link?.authorName?.split(':', 1)[0] ?? undefined,
  )

  useEffect(() => {
    if (router.isReady) {
      const location = getNavLocation(router.query)
      setLocation(location)
      // console.log(location)
    }
  }, [router])

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
      // const parsedValue = value
      return (
        <BulletEditor
          initialValue={parsedValue}
          location={location}
          onValueChange={value => {
            setLocalValue(value)
          }}
          readOnly={readonly}
          selfCard={selfCard}
        />
      )
    }
    return null
  }, [data])

  if (data === undefined || location === undefined) {
    return null
  }
  return (
    <Layout
      navPath={
        <NavPath
          path={navs}
          mirrorHomeUrl={data.mirror && locationToUrl({ selfSymbol: location.selfSymbol, openedLiPath: [] })}
        />
      }
    >
      <div style={{ marginBottom: '3em' }}>
        <button
          className="noBg"
          onClick={() => {
            setReadonly(!readonly)
          }}
        >
          {readonly ? '編輯' : '鎖定'}
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
          Submit
        </button>

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

        <div>
          {/* {data.selfCard.link?.authorName && <span>@{data.selfCard.link?.authorName}</span>} */}
          {data.selfCard.link?.url && <div>@{data.selfCard.link?.url}</div>}
          {data.selfCard.link?.authorName && (
            <button
              className="transparent"
              onClick={() => {
                setAuthorName(prev => {
                  if (prev) {
                    return undefined
                  } else {
                    return data.selfCard.link?.authorName?.split(':', 1)[0] ?? undefined
                  }
                })
              }}
            >
              {authorName}
              <div className={classes.toggle}></div>
            </button>
          )}
          <h3>{Node.string(data.openedLi.children[0])}</h3>
          {/* {console.log(location)} */}
        </div>
        <AuthorContext.Provider value={{ author: authorName }}>{editor}</AuthorContext.Provider>
      </div>
    </Layout>
  )
}

export default CardSymbolPage
