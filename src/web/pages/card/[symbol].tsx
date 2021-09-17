import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Node } from 'slate'
import { BulletEditor } from '../../components/editor/editor'
import { LiElement } from '../../components/editor/slate-custom-types'
import { useLocalValue } from '../../components/editor/use-local-value'
import { isLi } from '../../components/editor/with-list'
import { getNavLocation, locationToUrl, NavLocation } from '../../components/editor/with-location'
import Layout from '../../components/layout/layout'

import HashtagUpDown from '../../components/upDown/hashtag-up-down'
import NavPath from '../../components/nav-path/nav-path'
import { Poll, useCreateVoteMutation } from '../../apollo/query.graphql'
import { parseChildren } from '../../components/editor/with-parse'

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
const PollComponent = (props: { poll: Poll; author?: string }): JSX.Element => {
  const { poll, author } = props
  const [createVote] = useCreateVoteMutation({
    update(cache, { data }) {
      // const res = cache.readQuery<MyVotesQuery>({
      //   query: MyVotesDocument,
      // })
      // if (data?.createVote && res?.myVotes) {
      //   cache.writeQuery({
      //     query: MyVotesDocument,
      //     data: { myVotes: res.myVotes.concat([data.createVote]) },
      //   })
      // }
      // refetch()
    },
    // refetchQueries: [{ query: BoardDocument, variables: { id: boardId } }],
  })
  const onVote = () => {
    // 已經投票且生效，不能再投
    // 尚未投票，可以投
    // 送出按鈕
  }

  return (
    <>
      {poll.choices.map((e, i) => (
        <button
          key={i}
          onClick={event => {
            createVote({
              variables: {
                pollId: poll.id,
                data: { choiceIdx: i },
              },
            })
          }}
        >
          {e}
        </button>
      ))}
    </>
  )
}

const HashtagComponent = (props: { hashtag: Hashtag | HashtagGroup }): JSX.Element => {
  const { hashtag } = props
  // if (hashtag.type === 'hashtag' || hashtag.typ === 'hashtag-group')
  // const hashtagLike = useHashtagLike({ hashtag })
  switch (hashtag.type) {
    case 'hashtag':
      return (
        <div>
          {/* <HashtagUpDown hashtagId={e.id} text={e.text} /> */}
          {/* <HashtagLike hashtag={hashtag} /> */}
          <button>{hashtag.text}</button>
        </div>
      )
    case 'hashtag-group':
      return (
        <div>
          (
          {hashtag.poll.choices.map((e, i) => (
            <button key={i}>{e}</button>
          ))}
          )
        </div>
      )
  }
}

const CardSymbolPage = (): JSX.Element | null => {
  const router = useRouter()
  const [navs, setNavs] = useState<Nav[]>() // editor route
  const [readonly, setReadonly] = useState(false)
  const [location, setLocation] = useState<NavLocation>()
  const { data, setLocalValue, submitValue, dropValue } = useLocalValue({ location })

  useEffect(() => {
    if (router.isReady) {
      const location = getNavLocation(router.query)
      setLocation(location)
      // console.log(location)
    }
  }, [router])

  useEffect(() => {
    if (data && location) {
      const { self, mirror } = data
      const navs = mirror ? getNavs(mirror.rootLi, location.openedLiPath) : getNavs(self.rootLi, location.openedLiPath)
      // navs.pop() // 最後一個是當前的 li ，不需要
      setNavs(navs)
      // console.log('navs effect')
    }
  }, [data, location])

  if (data === undefined || location === undefined) {
    return null
  }
  const { selfCard, mirror, openedLi, value } = data
  const [openedLiLc] = openedLi.children
  // const parsedValue = parseChildren(value)
  const parsedValue = value
  // console.log('symbol', navs)
  return (
    <Layout
      navPath={
        <NavPath
          path={navs}
          mirrorHomeUrl={mirror && locationToUrl({ selfSymbol: location.selfSymbol, openedLiPath: [] })}
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
          {selfCard.link?.authorName && <span>@{selfCard.link?.authorName}</span>}
          {selfCard.link?.url && <span>@{selfCard.link?.url}</span>}
          <h3>{Node.string(openedLiLc)}</h3>
          {/* {openedLiLc.rootBulletDraft?.emojis
            ? openedLiLc.rootBulletDraft.emojis.map((e, i) => <HashtagComponent key={i} hashtag={e} />)
            : openedLiLc.curHashtags && openedLiLc.curHashtags.map((e, i) => <HashtagComponent key={i} hashtag={e} />)} */}
        </div>
        {/* {console.log(openedLiLc.rootBulletDraft?.allHashtags)} */}

        <BulletEditor
          initialValue={parsedValue}
          location={location}
          onValueChange={value => {
            setLocalValue(value)
          }}
          readOnly={readonly}
          selfCard={selfCard}
        />
      </div>
    </Layout>
  )
}

export default CardSymbolPage
