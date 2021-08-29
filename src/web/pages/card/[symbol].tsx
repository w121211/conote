import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Node } from 'slate'
import { BulletEditor } from '../../components/editor/editor'
import { LiElement } from '../../components/editor/slate-custom-types'
import { useLocalValue } from '../../components/editor/use-local-value'
import { isLi } from '../../components/editor/with-list'
import { getNavLocation, NavLocation, pathToHref } from '../../components/editor/with-location'

// TODO: 與 li-location 合併
type Nav = {
  text: string
  path: number[]
}

function getNavs(root: LiElement, destPath: number[]): Nav[] {
  const navs: Nav[] = []
  for (const [n, p] of Node.levels(root, destPath)) {
    console.log(n, p)
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
  const { data, setLocalValue, submitting, submitValue, dropValue } = useLocalValue({ location })

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
      navs.pop() // 最後一個是當前的 li ，不需要
      setNavs(navs)
    }
  }, [data, location])

  if (data === undefined || location === undefined) {
    return null
  }
  const { mirror, openedLi, value } = data
  const [openedLiLc] = openedLi.children

  return (
    <div>
      <a href="/api/auth/login">Login</a>

      <button
        onClick={() => {
          setReadonly(!readonly)
        }}
      >
        {readonly ? 'Readonly*' : 'Readonly'}
      </button>

      <button
        onClick={() => {
          if (!submitting) {
            submitValue()
          }
        }}
      >
        {submitting ? '...' : 'Submit'}
      </button>

      <button
        onClick={() => {
          dropValue()
          router.reload()
        }}
      >
        {'Drop'}
      </button>

      {mirror && (
        <span>
          <a href={pathToHref({ selfSymbol: location.selfSymbol, openedLiPath: [] })}>Home</a>
          ...
        </span>
      )}

      {navs &&
        navs.map((e, i) => (
          <span key={i}>
            <a href={pathToHref({ ...location, openedLiPath: e.path })}>{e.text}</a>|
          </span>
        ))}

      <div>
        <h3>{Node.string(openedLiLc)}</h3>
        {openedLiLc.rootBulletDraft?.allHashtags
          ? openedLiLc.rootBulletDraft.allHashtags.map((e, i) => <button key={i}>{e.text}</button>)
          : openedLiLc.curHashtags && openedLiLc.curHashtags.map((e, i) => <button key={i}>{e.text}</button>)}
      </div>

      <BulletEditor
        initialValue={value}
        location={location}
        onValueChange={value => {
          setLocalValue(value)
        }}
        readOnly={readonly}
      />
    </div>
  )
}

export default CardSymbolPage
