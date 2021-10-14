import { ApolloClient, useApolloClient } from '@apollo/client'
import { useCallback, useEffect, useState } from 'react'
import { set } from 'react-hook-form'
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
  Hashtag as GQLHashtag,
  CreateCardBodyMutation,
  CreateCardBodyMutationVariables,
  CreateCardBodyDocument,
  WebpageCardQuery,
  WebpageCardQueryVariables,
  WebpageCardDocument,
} from '../../apollo/query.graphql'
import { BulletNode } from '../../lib/bullet/node'
import { injectHashtags } from '../../lib/hashtag/inject'
import { CardBodyContent } from '../../lib/models/card'
import { Serializer } from './serializer'
import { LiElement } from './slate-custom-types'
import { isLi } from './with-list'
import { NavLocation } from './with-location'
import { parseLcAndReplace } from './with-parse'

const defaultLi: LiElement = {
  type: 'li',
  children: [
    {
      type: 'lc',
      children: [{ text: '' }],
    },
  ],
}

/** Local storage (非常簡易、 TODO: 未確認什麼時候資料會消失) */
const store = {
  _toKey: (symbol: string, type: 'card' | 'rootLi'): string => {
    return `${type}-${symbol}`
  },
  _get: <T extends Card | LiElement>(key: string): T | null => {
    const data = window.sessionStorage.getItem(key)
    if (data) {
      const parsed: T = JSON.parse(data)
      return parsed
    }
    return null
  },
  _set: <T extends Card | LiElement>(key: string, data: T): void => {
    window.sessionStorage.setItem(key, JSON.stringify(data))
  },
  getCard: (symbol: string): Card | null => {
    return store._get<Card>(store._toKey(symbol, 'card'))
  },
  setCard: (symbol: string, data: Card): void => {
    return store._set<Card>(store._toKey(symbol, 'card'), data)
  },
  getRootLi: (symbol: string): LiElement | null => {
    return store._get<LiElement>(store._toKey(symbol, 'rootLi'))
  },
  setRootLi: (symbol: string, data: LiElement): void => {
    return store._set<LiElement>(store._toKey(symbol, 'rootLi'), data)
  },
  clear() {
    window.sessionStorage.clear()
  },
}

// const localSelfCard = {
//   key: 'localSelfCard',
//   get: (): Card | null => {
//     const data = window.sessionStorage.getItem(localSelfCard.key)
//     // console.log('get', editorCurrentSymbol.key, data)
//     if (data) {
//       const parsed: Card = JSON.parse(data)
//       return parsed
//     }
//     return null
//   },
//   set: (data: Card | null): void => {
//     // console.log('set', editorCurrentSymbol.key, data)
//     window.sessionStorage.setItem(localSelfCard.key, JSON.stringify(data))
//   },
// }

// const localCardRecord = {
//   key: 'localCardRecord',
//   get: (): Record<string, Card> | null => {
//     const data = window.sessionStorage.getItem(localCardRecord.key)
//     // console.log('get', editorCurrentSymbol.key, data)
//     if (data) {
//       const parsed: Record<string, Card> = JSON.parse(data)
//       return parsed
//     }
//     return null
//   },
//   set: (data: Record<string, Card> | null): void => {
//     // console.log('set', editorCurrentSymbol.key, data)
//     window.sessionStorage.setItem(localCardRecord.key, JSON.stringify(data))
//   },
// }

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

// const localRootRecord = {
//   key: 'localRootRecord',
//   get: (): Record<string, LiElement> | null => {
//     const data = window.sessionStorage.getItem(localRootRecord.key)
//     // console.log('get', editorRootDict.key, data)
//     if (data) {
//       const parsed: Record<string, LiElement> = JSON.parse(data)
//       return parsed
//     }
//     return null
//   },
//   set: (data: Record<string, LiElement> | null): void => {
//     // console.log('set', editorRootDict.key, data)
//     window.sessionStorage.setItem(localRootRecord.key, JSON.stringify(data))
//   },
// }

/**
 * 用 client.query(...) 而非使用 useQuery(...)，適用在非 component 但需要取得 card 的情況，例如取得 mirror
 *
 * @returns 當有 card 時返回 card body bullet root; 找不到 card 時 root 為 undefined
 * @throws apoollo query error
 */
export async function getLocalOrQueryRoot(props: {
  // eslint-disable-next-line @typescript-eslint/ban-types
  client: ApolloClient<object>
  selfSymbol?: string
  mirrorSymbol?: string
  // url?: string
}): Promise<{ card: Card; rootLi: LiElement }> {
  const { client, selfSymbol, mirrorSymbol } = props

  const symbol = selfSymbol ?? mirrorSymbol?.substring(2)
  if (symbol === undefined) {
    throw '需至少提供 selfSymbol 或 mirrorSymbol'
  }

  // 讀取 local storage
  // const _localCard = localCardRecord.get() ?? {}
  // const _localRootRecord = localRootRecord.get() ?? {}
  const localCard = store.getCard(symbol)
  const localRootLi = store.getRootLi(symbol)

  if (localCard && localRootLi) {
    return { card: localCard, rootLi: localRootLi }
  }

  // local 沒有，query card & hashtags
  let card: Card | undefined
  let gqlHashtags: GQLHashtag[] = []

  const queryCard = await client.query<CardQuery, CardQueryVariables>({
    query: CardDocument,
    variables: { symbol },
  })
  const queryHashtags = await client.query<HashtagsQuery, HashtagsQueryVariables>({
    query: HashtagsDocument,
    variables: { symbol },
  })

  if (queryCard.data && queryCard.data.card) {
    if (queryCard.data.card) {
      card = queryCard.data.card
    }
  }
  if (queryCard.error) {
    const queryWebCard = await client.query<WebpageCardQuery, WebpageCardQueryVariables>({
      query: WebpageCardDocument,
      variables: { url: symbol },
    })
    card = queryWebCard.data.webpageCard
    // throw queryCard.error
    if (queryWebCard.error) {
      throw queryWebCard.error
    }
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
    const rootBulletWithHashtags = injectHashtags({
      root: rootBulletDraft,
      hashtags: gqlHashtags,
    }) // 合併 hashtags 與 bullet
    const rootLi = Serializer.toRootLi(rootBulletWithHashtags)

    store.setCard(symbol, card) // 存入 local storage
    store.setRootLi(symbol, rootLi)

    return { card, rootLi }
  }

  throw 'unexpected error'
}

export type LocalValueData = {
  selfCard: Card // router symbol 所對應的卡片
  self: { symbol: string; rootLi: LiElement } // router symbol 所對應的卡片裡的 root
  mirror?: { symbol: string; rootLi: LiElement }
  openedLi: LiElement // li opened by given location
  value: LiElement[] // opened li 對應的 value，也就是導入 editor 的 value
}

export const useLocalValue = ({
  location,
}: {
  location: NavLocation | undefined
}): {
  data?: LocalValueData
  isValueModified: boolean
  dropValue: () => void // 將 value 從 local 刪除
  setValue: (value: LiElement[]) => void
  submitValue: (props: { onFinish?: () => void }) => void // 將 value 發送至後端（搭配 createCardBody() )
} => {
  // console.log('useLocalValue', location)
  const client = useApolloClient()
  const [data, setData] = useState<LocalValueData | undefined>()
  const [isValueModified, setIsValueModified] = useState(false)

  const setValue = useCallback(
    (value: LiElement[]) => {
      if (data) {
        const { openedLi, self, mirror } = data
        openedLi.children = [openedLi.children[0], { type: 'ul', children: value }] // shallow copy
        const [symbol, rootLi] = mirror ? [mirror.symbol.substring(2), mirror.rootLi] : [self.symbol, self.rootLi] // 若目前有 mirror（等同於 location 指向 mirror）則存入 mirror
        store.setRootLi(symbol, rootLi) // TODO: 每次 input 都需要轉換 string <-> json，相當耗時

        if (!isValueModified) {
          setIsValueModified(true)
        }
      }
    },
    [data, isValueModified],
  )

  const dropValue = useCallback(() => {
    store.clear()
  }, [])

  const submitValue = useCallback(
    (props: { onFinish?: () => void }) => {
      const { onFinish } = props
      if (data) {
        const selfSymbol = data.self.symbol
        const rootLi = store.getRootLi(data.self.symbol)
        // console.log(rootLi)
        const mirrorSymbols = []
        const promises = []

        if (rootLi) {
          // TODO: 用 root 檢查哪些是新增的 mirrors （有些 mirror 可能新增後又刪掉，這些 mirror 不應該被創）
          for (const [element] of Node.elements(rootLi)) {
            if (element.type === 'mirror') {
              mirrorSymbols.push(element.mirrorSymbol)
            }
          }
          // Serializer.toRootBulletDraft(rootLi)
          promises.push(
            client.mutate<CreateCardBodyMutation, CreateCardBodyMutationVariables>({
              mutation: CreateCardBodyDocument,
              variables: { cardSymbol: selfSymbol, data: { root: Serializer.toRootBulletDraft(rootLi) } },
            }),
          )
        }
        for (const e of mirrorSymbols) {
          const mirrorSymbol = e.substring(2) // trick，要消掉 mirror 前綴
          const mirrorRootLi = store.getRootLi(mirrorSymbol)

          if (mirrorRootLi) {
            promises.push(
              client.mutate<CreateCardBodyMutation, CreateCardBodyMutationVariables>({
                mutation: CreateCardBodyDocument,
                variables: { cardSymbol: mirrorSymbol, data: { root: Serializer.toRootBulletDraft(mirrorRootLi) } },
              }),
            )
          }
        }
        Promise.all(promises).then(res => {
          store.clear() // 清除 local storage

          // TODO: 更新 apollo cache
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

          if (onFinish) {
            onFinish()
          }
        })
      }
    },
    [data],
  )

  useEffect(() => {
    const asyncRun = async () => {
      if (window && location) {
        // console.log(location)
        const { selfSymbol, mirrorSymbol, openedLiPath = [] } = location
        // 若在 local 找不到 self symbol，代表 symbol 有所變動，清除 & 更新 local
        if (store.getCard(selfSymbol) === null) {
          store.clear()
        }

        const { card: selfCard, rootLi: selfRootLi } = await getLocalOrQueryRoot({ client, selfSymbol })

        const { rootLi: mirrorRootLi } = mirrorSymbol
          ? await getLocalOrQueryRoot({ client, mirrorSymbol })
          : { rootLi: undefined }
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
          selfCard,
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
    isValueModified,
    setValue,
    submitValue,
    dropValue,
  }
}
