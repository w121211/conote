import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Node } from 'slate'
import { BulletEditor } from '../../components/editor/editor'
import { LiElement } from '../../components/editor/slate-custom-types'
import { useLocalValue } from '../../components/editor/use-local-value'
import { isLi } from '../../components/editor/with-list'
import { getNavLocation, NavLocation, pathToHref } from '../../components/editor/with-location'
import Layout from '../../components/layout/layout'

import HashtagUpDown from '../../components/upDown/hashtag-up-down'
import NavPath from '../../components/nav-path/nav-path'

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
  const { card, mirror, openedLi, value } = data
  const [openedLiLc] = openedLi.children

  // console.log('symbol', navs)
  return (
    <Layout
      navPath={
        <NavPath
          path={navs}
          mirrorHomeUrl={mirror && pathToHref({ selfSymbol: location.selfSymbol, openedLiPath: [] })}
        />
      }
    >
      <div style={{ marginBottom: '3em' }}>
        {/* <a href="/api/auth/login">Login</a> */}

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
            <a href={pathToHref({ selfSymbol: location.selfSymbol, openedLiPath: [] })}>Home</a>
         
          </span>
        )} */}

        {/* {navs &&
          navs.map((e, i) => (
            <span key={i}>
              <a href={pathToHref({ ...location, openedLiPath: e.path })}>{e.text}</a>
            </span>
          ))} */}

        <div>
          {card.link?.authorName && <span>@{card.link?.authorName}</span>}
          {card.link?.url && <span>@{card.link?.url}</span>}
          <h3>{Node.string(openedLiLc)}</h3>
          <div className="hashtagContainer">
            {openedLiLc.rootBulletDraft?.allHashtags
              ? openedLiLc.rootBulletDraft.allHashtags.map((e, i) => <HashtagUpDown key={i} hashtag={e} />)
              : openedLiLc.curHashtags && openedLiLc.curHashtags.map((e, i) => <HashtagUpDown key={i} hashtag={e} />)}
          </div>
        </div>
        {/* {console.log(openedLiLc.rootBulletDraft?.allHashtags)} */}

        <BulletEditor
          initialValue={value}
          location={location}
          onValueChange={value => {
            setLocalValue(value)
          }}
          readOnly={readonly}
          // sourceUrl={data.card.link}
        />
      </div>
    </Layout>
  )
}

export default CardSymbolPage
