import { ApolloClient, useApolloClient } from '@apollo/client'
import { useCallback, useEffect, useState } from 'react'
import { Node } from 'slate'
// import { editorCurrentSymbol, editorRootDict } from '../../apollo/cache'
import {
  CardQuery,
  CardDocument,
  CardQueryVariables,
  Card,
  HashtagsQuery,
  HashtagsQueryVariables,
  HashtagsDocument,
  Hashtag as GqlHashtag,
  CreateCardBodyMutation,
  CreateCardBodyMutationVariables,
  CreateCardBodyDocument,
} from '../../apollo/query.graphql'
import { BulletNode } from '../../lib/bullet/node'
import { injectHashtags } from '../../lib/hashtag/inject'
import { CardBodyContent } from '../../lib/models/card'
import { Serializer } from './serializer'
import { LiElement } from './slate-custom-types'
import { isLi } from './with-list'
import { NavLocation } from './with-location'

const defaultLi: LiElement = {
  type: 'li',
  children: [
    {
      type: 'lc',
      children: [{ text: '' }],
    },
  ],
}

/** Local storage (非常簡易、未確認什麼時候資料會消失) */

const editorCurrentCard = {
  key: 'editorCurrentCard',
  get: (): Card | null => {
    const data = window.sessionStorage.getItem(editorCurrentCard.key)
    // console.log('get', editorCurrentSymbol.key, data)
    if (data) {
      const parsed: Card = JSON.parse(data)
      return parsed
    }
    return null
  },
  set: (data: Card | null): void => {
    // console.log('set', editorCurrentSymbol.key, data)
    window.sessionStorage.setItem(editorCurrentCard.key, JSON.stringify(data))
  },
}

// const editorCurrentSymbol = {
//   key: 'editorCurrentSymbol',
//   get: (): string | null => {
//     const data = window.sessionStorage.getItem(editorCurrentSymbol.key)
//     // console.log('get', editorCurrentSymbol.key, data)
//     return data
//   },
//   set: (data: string): void => {
//     // console.log('set', editorCurrentSymbol.key, data)
//     window.sessionStorage.setItem(editorCurrentSymbol.key, data)
//   },
// }

const editorRootDict = {
  key: 'editorRootDict',
  get: (): Record<string, LiElement> | null => {
    const data = window.sessionStorage.getItem(editorRootDict.key)
    // console.log('get', editorRootDict.key, data)
    if (data) {
      const parsed: Record<string, LiElement> = JSON.parse(data)
      return parsed
    }
    return null
  },
  set: (data: Record<string, LiElement> | null): void => {
    // console.log('set', editorRootDict.key, data)
    window.sessionStorage.setItem(editorRootDict.key, JSON.stringify(data))
  },
}

/**
 * 用 client.query(...) 而非使用 useQuery(...)，適用在非 component 但需要取得 card 的情況，例如取得 mirror
 *
 * @returns 當有 card 時返回 card body bullet root; 找不到 card 時 root 為 undefined
 * @throws apoollo query error
 */
async function getLocalOrQueryRoot(props: {
  // eslint-disable-next-line @typescript-eslint/ban-types
  client: ApolloClient<object>
  symbol: string
  // url?: string
}): Promise<{ card: Card; rootLi: LiElement }> {
  const { client, symbol } = props

  // 讀取 local cache
  const localCard = editorCurrentCard.get()
  const localRootDict = editorRootDict.get() ?? {}
  // console.log('localRootDict', localRootDict)

  if (symbol && localRootDict[symbol]) {
    if (localCard && localCard.symbol === symbol) {
      return { card: localCard, rootLi: localRootDict[symbol] }
    } else {
      console.error(symbol)
      console.error(localCard)
      throw 'Unexpected error'
    }
  }

  // local 沒有，query card & hashtags
  let card: Card | undefined
  let gqlHashtags: GqlHashtag[] = []

  const queryCard = await client.query<CardQuery, CardQueryVariables>({
    query: CardDocument,
    variables: { symbol },
  })
  const queryHashtags = await client.query<HashtagsQuery, HashtagsQueryVariables>({
    query: HashtagsDocument,
    variables: { symbol },
  })
  if (queryCard.data && queryCard.data.card) {
    card = queryCard.data.card
  }
  if (queryCard.error) {
    throw queryCard.error
  }
  if (queryHashtags.data && queryHashtags.data.hashtags) {
    gqlHashtags = queryHashtags.data.hashtags
  }
  if (queryHashtags.error) {
    throw queryHashtags.error
  }

  // if (url) {
  //   const { data, error } = await client.query<WebpageCardQuery, WebpageCardQueryVariables>({
  //     query: WebpageCardDocument,
  //     variables: { url },
  //   })
  //   if (data && data.webpageCard) {
  //     card = data.webpageCard
  //   }
  //   if (error) {
  //     throw error
  //   }
  // } else {
  //   throw '需給予 symbol 或 url 其中一個'
  // }

  if (card) {
    const parsed: CardBodyContent = JSON.parse(card.body.content)
    const rootBullet = parsed.value
    const rootBulletDraft = BulletNode.toDraft(rootBullet)
    const rootBulletWithHashtags = injectHashtags({ root: rootBulletDraft, gqlHashtags }) // 合併 hashtags 與 bullet
    const rootLi = Serializer.toRootLi(rootBulletWithHashtags)

    localRootDict[card.symbol] = rootLi // 存入 local cache
    // editorRootDict(localRootDict)
    editorRootDict.set(localRootDict)
    return { card, rootLi }
  }
  throw 'unexpected error'
}

export type LocalValueData = {
  card: Card // router symbol 所對應的卡片
  self: { symbol: string; rootLi: LiElement } // router symbol 所對應的卡片裡的 root
  mirror?: { symbol: string; rootLi: LiElement }
  openedLi: LiElement // li opened by given location
  value: LiElement[] // opened li 對應的 value，也就是導入 editor 的 value
}

export const useLocalValue = (props: {
  location: NavLocation | undefined
}): {
  data?: LocalValueData
  setLocalValue: (value: LiElement[]) => void
  submitting: boolean
  submitValue: () => void // 將 value 發送至後端（搭配 createCardBody() )
  dropValue: () => void // 將 value 從 local 刪除
} => {
  const { location } = props
  const client = useApolloClient()
  const [data, setData] = useState<LocalValueData | undefined>()
  const [submitting, setSubmitting] = useState(false)

  // const [createCardBody] = useCreateCardBodyMutation({
  //   update: (cache, { data }) => {
  //     // 更新 apollo cache
  //     if (data?.createCardBody) {
  //       const cardData = cache.readQuery<CardQuery, CardQueryVariables>({
  //         query: CardDocument,
  //         variables: { symbol: data.createCardBody.symbol },
  //       })
  //       if (cardData && cardData.card) {
  //         cache.writeQuery<CardQuery, CardQueryVariables>({
  //           query: CardDocument,
  //           variables: { symbol: data.createCardBody.symbol },
  //           data: {
  //             ...cardData,
  //             card: {
  //               ...cardData.card,
  //               body: data.createCardBody.body,
  //             },
  //           },
  //         })
  //       }
  //     }
  //   },
  // })

  const setLocalValue = useCallback(
    (value: LiElement[]) => {
      if (data) {
        const { openedLi, self, mirror } = data
        openedLi.children = [openedLi.children[0], { type: 'ul', children: value }] // shallow copy

        const [key, localRoot] = mirror ? [mirror.symbol, mirror.rootLi] : [self.symbol, self.rootLi] // 若目前有 mirror（等同於 location 指向 mirror）則存入 mirror
        // const localRootDict = editorRootDict() ?? {}
        const localRootDict = editorRootDict.get() ?? {}
        localRootDict[key] = localRoot
        // editorRootDict(localRootDict)
        editorRootDict.set(localRootDict)
      }
    },
    [data],
  )

  const submitValue = useCallback(() => {
    if (data) {
      setSubmitting(true)

      // TODO: 用 root 檢查哪些是新增的 mirrors （有些 mirror 可能新增後又刪掉，這些 mirror 不應該被創）

      // 從 local 取得目前的 root/mirror value 並依序 submit
      const rootDict = editorRootDict.get()
      const promises = []
      for (const k in rootDict) {
        const root = rootDict[k]
        promises.push(
          client.mutate<CreateCardBodyMutation, CreateCardBodyMutationVariables>({
            mutation: CreateCardBodyDocument,
            variables: { cardSymbol: k, data: Serializer.toRootBulletDraft(root) },
          }),
        )
      }
      Promise.all(promises).then(res => {
        // 清除 local storage
        editorCurrentCard.set(null)
        editorRootDict.set(null)
        setSubmitting(false)

        // TODO: 更新 apollo cache
      })
    }
  }, [data])

  const dropValue = useCallback(() => {
    editorCurrentCard.set(null)
    editorRootDict.set(null)
  }, [])

  useEffect(() => {
    const asyncRun = async () => {
      if (window && location) {
        const { selfSymbol, mirrorSymbol, openedLiPath = [] } = location

        // 若 self symbol 和 local 不同，代表 symbol 有所變動，清除 & 更新 local
        if (editorCurrentCard.get()?.symbol !== selfSymbol) {
          // editorCurrentSymbol.set(selfSymbol)
          editorCurrentCard.set(null)
          editorRootDict.set(null)
        }

        const { card, rootLi: selfRootLi } = await getLocalOrQueryRoot({ client, symbol: selfSymbol })
        const mirrorRootLi = mirrorSymbol
          ? (await getLocalOrQueryRoot({ client, symbol: mirrorSymbol })).rootLi
          : undefined

        editorCurrentCard.set(card)

        // 按照 root/mirror + path 取得對應的 opened-li
        let openedLi: LiElement, value: LiElement[]
        const node = mirrorRootLi ? Node.get(mirrorRootLi, openedLiPath) : Node.get(selfRootLi, openedLiPath)
        if (isLi(node)) {
          openedLi = node
          value = node.children[1]?.children ?? [defaultLi] // value 設為 opened-li 的 children，代表 opened-li 自身無法被編輯，若沒有 children，用預設的值帶入
        } else {
          console.error(node)
          throw 'Unexpected error'
        }

        setData({
          card,
          self: { symbol: selfSymbol, rootLi: selfRootLi },
          mirror: mirrorSymbol && mirrorRootLi ? { symbol: mirrorSymbol, rootLi: mirrorRootLi } : undefined,
          openedLi,
          value,
        })
      }
    }

    asyncRun().catch(err => {
      console.error(err)
    })
  }, [location])

  return {
    data,
    setLocalValue,
    submitting,
    submitValue,
    dropValue,
  }
}
