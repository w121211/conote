import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Node } from 'slate'
import { BulletEditor } from '../../components/editor/editor'
import { LiElement } from '../../components/editor/slate-custom-types'
import { useLocalValue } from '../../components/editor/use-local-value'
import { isLi } from '../../components/editor/with-list'
import { getNavLocation, locationToUrl, NavLocation } from '../../components/editor/with-location'
import Layout from '../../components/layout/layout'
import PinIcon from '../../assets/svg/like.svg'
import UpIcon from '../../assets/svg/arrow-up.svg'
import HashtagUpDown from '../../components/upDown/hashtag-up-down'
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

// @lisa TODO: 移到 hashtag component、需要考慮非預設的text
export const hashtagTextToIcon = (text: string): JSX.Element | null => {
  switch (text) {
    case '#pin':
      return <PinIcon width="1em" height="1em" />
    case '#up':
      return <UpIcon width="1em" height="1em" />
    case '#down':
      return <UpIcon width="1em" height="1em" style={{ transform: 'rotate(180deg)' }} />
  }
  return null
}

const CardSymbolPage = (): JSX.Element | null => {
  const router = useRouter()
  // const [navs, setNavs] = useState<Nav[]>() // editor route
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
    console.log('hello up~')
    if (data && location) {
      console.log('hello~')
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
    <Layout path={navs}>
      <a href="/card?url=https://www.youtube.com/watch?v=q0ImE0kDlvw">https://www.youtube.com/watch?v=q0ImE0kDlvw</a>
      <div style={{ marginBottom: '3em' }}>
        <button
          onClick={() => {
            setReadonly(!readonly)
          }}
        >
          {readonly ? '編輯' : '鎖定'}
        </button>

        <button
          onClick={() => {
            submitValue({
              onFinish: () => {
                // dropValue()
                router.reload()
              },
            })
          }}
        ></button>

        <button
          onClick={() => {
            dropValue()
            router.reload()
          }}
        >
          {'Drop'}
        </button>

        {data.mirror && (
          <span>
            <Link href={locationToUrl({ selfSymbol: location.selfSymbol, openedLiPath: [] })}>
              <a>Home</a>
            </Link>
            ...
          </span>
        )}

        {navs &&
          navs.map((e, i) => (
            <Link href={locationToUrl({ ...location, openedLiPath: e.path })} key={i}>
              <a>{e.text}</a>
            </Link>
          ))}

        {/* <div>
          <span>@{selfCard.link?.authorName}</span>
          <span>@{selfCard.link?.url}</span>
          <h3>{Node.string(openedLiLc)}</h3>
        </div> */}

        {editor}
      </div>
    </Layout>
  )
}

export default CardSymbolPage
