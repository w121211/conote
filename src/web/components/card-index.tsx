import React, { useEffect, useRef, useState } from 'react'
import { useQuery } from '@apollo/client'
// import { UserProvider } from '@auth0/nextjs-auth0'

import TestPage from './card'
import CardPage from './extension-page'
import Layout from './layout/layout'
import { useCardQuery, useWebpageCardQuery } from '../apollo/query.graphql'
// import { GET_PATH_HISTORY } from '../../browser/src/popup/cache'
// import { useRouter } from 'next/router'

function getTabUrl(): string | null {
  // let url: string | null
  // if (window.location.protocol.includes('extension')) {
  //   // popup的情況
  //   const params = new URLSearchParams(new URL(window.location.href).search)
  //   url = params.get('u')
  // } else {
  // inject的情況
  // url = window.location.href
  const params = new URLSearchParams(new URL(window.location.href).search)
  const url = params.get('u')
  // }

  return url
}

const CardIndex = ({ mySymbol, webPageUrl }: { webPageUrl?: string; mySymbol?: string }): JSX.Element => {
  const pathRef = useRef<string[]>([])
  const [path, setPath] = useState<string[]>([])
  // const [symbol, setSymbol] = useState('')
  // const [url, setUrl] = useState<string>('')
  const [prevPath, setPrevPath] = useState<string>('')

  const handlePath = (i: number) => {
    // setPath(prev => {
    //   // window.history.pushState([...prev].slice(0, i + 1), '')
    //   return [...prev].slice(0, i + 1)
    // })
    pathRef.current = [...pathRef.current].slice(0, i + 1)
    // console.log('handlePath', i + 1)
  }
  // const handleSymbol = (e: string) => {
  //   // setSymbol(e)
  // }
  const handlePathPush = (e: string) => {
    // setPath(prev => {
    //   // window.history.pushState([...prev, e], '')
    //   // console.log(window.history)
    //   return [...prev, e]
    // })
    if (pathRef.current[pathRef.current.length - 1] !== e) {
      pathRef.current = [...pathRef.current, e]
    }
  }

  const handlePopState = (e: PopStateEvent) => {
    if (e.state.idx < pathRef.current.length) {
      //back
      // const newArr = [...path]
      // newArr.pop()

      // setPath(newArr)
      pathRef.current = [...pathRef.current].slice(0, e.state.idx + 1)
      setPath(pathRef.current)
      // handlePath(e.state.idx)
      // console.log(e.state.idx, pathRef.current, pathRef.current.length)
      console.log('back')
    }
    if (e.state.idx === pathRef.current.length) {
      // setPath([...path, decodeURIComponent(e.state.as.replace('/card/', ''))])
      pathRef.current = [...pathRef.current, decodeURIComponent(e.state.as.replace('/card/', ''))]
      setPath(pathRef.current)
      console.log('forward')
    }

    // console.log(e.state.idx, pathRef.current.length, e.state.idx === pathRef.current.length - 1)
  }

  useEffect(() => {
    if (mySymbol) {
      pathRef.current = [mySymbol]
    }
    if (window) {
      window.addEventListener(
        'popstate',
        e => handlePopState(e),

        true,
      )
    }
    return window.removeEventListener(
      'popstate',
      e => handlePopState(e),

      true,
    )
  }, [])

  if ((prevPath !== mySymbol || prevPath !== `[[${webPageUrl}]]`) && prevPath === '') {
    if (mySymbol) {
      pathRef.current = [mySymbol]
      setPrevPath(mySymbol)
    }
    if (webPageUrl) {
      pathRef.current = [`[[${webPageUrl}]]`]

      setPrevPath(`[[${webPageUrl}]]`)
    }
    // console.log('[mySymbol]', mySymbol)
  }

  useEffect(() => {
    setPath(pathRef.current)
    console.log('setPath')
  }, [pathRef.current])
  // useEffect(() => {
  //   if (rootPath) {
  //     // window.history.pushState([rootPath], '')
  //     // setPath([rootPath])
  //     pathRef.current.push(rootPath)
  //   }
  // }, [rootPath])
  // useEffect(() => {
  //   if (rootPath) {
  //     // window.history.pushState([rootPath], '')
  //     setPath([rootPath])
  //   }
  // }, [rootPath])
  // useEffect(() => {
  //   if (window) {
  //     // window.history.pushState(path, '')
  //     console.log(window.history)
  //   }
  // }, [path])

  // useEffect(() => {
  //   if (mySymbol) {
  //     // setPath([...path, mySymbol])
  //     // setSymbol(webPageData.webpageCard.symbol)
  //     // console.log(webPageData.webpageCard)
  //   }

  // }, [mySymbol])

  // const { data, loading, error } = useCardQuery({ variables: { symbol} })
  //   const router = useRouter()
  //   if (typeof window !== 'undefined') console.log(window.history)
  //   console.log(router.asPath)

  // console.log(path)
  // console.log(window.history)

  return (
    // <UserProvider>
    <Layout path={path} handlePath={handlePath}>
      {/* {window.location.protocol.includes('extension') ? (
        <CardPage pathSymbol={symbol} handlePathPush={handlePathPush} />
      ) : ( */}
      <TestPage pathSymbol={mySymbol} webPageUrl={webPageUrl} handlePathPush={handlePathPush} />
      {/* // )} */}
    </Layout>
    // </UserProvider>
  )
}

export default CardIndex
