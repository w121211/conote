// enum PinCode {
//   VS = 'VS',
//   BUYSELL = 'BUYSELL',
// }

// import { CardBody } from './apollo/query.graphql'

type PinCode = 'BUYSELL' | 'VS'

type BoardStatus = 'ACTIVE'

type Hashtag = {
  userId: string
  boardId: number
  boardStatus: BoardStatus
  text: string
  linkBullet?: true // 特殊hashtag，用於表示bullet的board/poll
}

type HashtagInput = Partial<Hashtag> & {
  text: string
  op: 'create' | 'update' | 'delete' // 編輯狀態
}

export type Bullet = {
  id: number
  timestamp: number // 該次的commit時間點，用於判斷哪些是本次的commit
  userIds: string[] // 最後一個為目前的user

  head: string
  body?: string
  hashtags?: Hashtag[]
  placeholder?: string
  children?: Bullet[]
  prevHead?: string
  prevBody?: string
  op?: 'create' | 'move' | 'update' | 'delete' | 'update-move' // 記錄編輯狀態，用於提醒

  sourceUrl?: string
  oauthorName?: string
  boardId?: number // 連結到一個board，例如提問
  pollId?: number // 連結到一個poll

  freeze?: true // 無法變動
  freezeChildren?: true // 無法新增child
  keyvalue?: true // 用key-value的方式呈現
  valueBoolean?: true // body必須是boolean
  valueArray?: true // body必須是string array
  board?: true
  poll?: true
  pollChoices?: string[]

  pin?: true
  pinCode?: PinCode

  childTemplate?: Omit<Bullet, 'id'>

  headValidator?: string
  bodyValidator?: string
}

export type BulletInput = Omit<Partial<Bullet>, 'children' | 'hashtags'> & {
  head: string
  hashtags?: (Hashtag | HashtagInput)[]
  children?: BulletInput[]

  board?: true
  poll?: true
  pollChoices?: string[]
}

type BulletOmitChildren = Omit<Bullet, 'children'> & {
  path?: number[]
}

type BulletOmitOp = Omit<Bullet, 'children' | 'op'> & {
  children?: BulletOmitOp[]
}

/**
 * 用於讓前端知道有什麼可用的property
 * card-head-content是以bullet形式儲存，但需能導出此資料格式
 */
export type CardHeadContentValue = {
  template: string
  title: string
  keywords: string[]
  tags: string[]

  // links
  link?: {
    official?: string
    yahooFinance?: string
    sec?: string
    wiki?: string
  }

  // pins
  pinPrice?: true
}

type PinBoard = {
  code: PinCode
  boardId: number
  pollId?: number
}

export type CardHeadContentValueInject = CardHeadContentValue & {
  pinBoards: PinBoard[]
}

export type CardHeadContent = {
  root: Bullet
  value: CardHeadContentValue
}

export type NestedCard = {
  cardSymbol: string
  cardBodyId: number
}

export type CardBodyContent = {
  root: Bullet
  nestedCards?: NestedCard[]
}

export type CardTemplate = {
  name: string
  headRoot: BulletInput
  bodyRoot: BulletInput
}

export type CardTemplateProps = {
  symbol: string
  template: string
  title: string
  ticker?: string
}

export const nestedCards: { head: CardHeadContent; body: CardBodyContent }[] = [
  {
    head: {
      root: {
        head: '_[[瑞典央行數字貨幣白皮書]]',
        freeze: true,
        freezeChildren: true,
        op: 'create',
        children: [
          {
            head: 'template',
            body: '::Ticker',
            keyvalue: true,
            op: 'create',
            id: 441,
            userIds: ['bot'],
            timestamp: 1625159031322,
          },
          {
            head: 'title',
            body: '',
            keyvalue: true,
            op: 'create',
            id: 439,
            userIds: ['bot'],
            timestamp: 1625159031322,
          },
          {
            head: 'keywords',
            body: '',
            keyvalue: true,
            valueArray: true,
            op: 'create',
            id: 443,
            userIds: ['bot'],
            timestamp: 1625159031322,
          },
          {
            head: 'tags',
            body: '',
            keyvalue: true,
            valueArray: true,
            op: 'create',
            id: 440,
            userIds: ['bot'],
            timestamp: 1625159031322,
          },
          {
            head: 'pinPrice',
            body: 'true',
            freeze: true,
            keyvalue: true,
            valueBoolean: true,
            op: 'create',
            id: 442,
            userIds: ['bot'],
            timestamp: 1625159031322,
          },
        ],
        id: 437,
        userIds: ['bot'],
        timestamp: 1625159031322,
      },
      value: {
        template: '::Ticker',
        title: '[[瑞典央行數字貨幣白皮書]]',
        keywords: [''],
        tags: [''],
        pinPrice: true,
      },
    },
    body: {
      root: {
        head: '[[瑞典央行數字貨幣白皮書]]',
        freeze: true,
        id: 449,
        userIds: ['bot'],
        timestamp: 1625159031514,
        children: [
          {
            head: '[!]',
            freeze: true,
            id: 453,
            userIds: ['bot'],
            timestamp: 1625159031514,
          },
          {
            head: '[?]',
            freeze: true,
            id: 452,
            userIds: ['bot'],
            timestamp: 1625159031514,
            children: [
              {
                head: '[[瑞典央行數字貨幣白皮書]] <BUY> <SELL> <WATCH>',
                pin: true,
                pinCode: 'BUYSELL',
                poll: true,
                pollChoices: ['BUY', 'SELL', 'WATCH'],
                freeze: true,
                hashtags: [
                  {
                    userId: 'bot',
                    boardId: 26,
                    boardStatus: 'ACTIVE',
                    text: '#Answer',
                  },
                ],
                id: 461,
                boardId: 26,
                pollId: 26,
                userIds: ['bot'],
                timestamp: 1625159031514,
              },
            ],
          },
          {
            head: '[*]',
            freeze: true,
            id: 456,
            userIds: ['bot'],
            timestamp: 1625159031514,
          },
          {
            head: '[+]',
            freeze: true,
            id: 451,
            userIds: ['bot'],
            timestamp: 1625159031514,
          },
          {
            head: '[-]',
            freeze: true,
            id: 455,
            userIds: ['bot'],
            timestamp: 1625159031514,
          },
          {
            head: '[錢的定義]',
            op: 'create',
            children: [
              {
                head: '實質紙幣及硬幣銀行借貸：支撐經濟發展要素(央行[[貨幣政策]]之一是調節利息，以調節銀行借貸力度)',
                sourceUrl: 'https://www.youtube.com/watch?v=F57gz9O0ABw',
                oauthorName: 'C_K_GO_:youtube.com',
                op: 'create',
                id: 464,
                userIds: ['testuser0'],
                timestamp: 1625159031833,
                children: [
                  {
                    head: '實質紙幣及硬幣銀行借貸：支撐經濟發展要素(央行[[貨幣政策]]之一是調節利息，以調節銀行借貸力度)',
                    sourceUrl: 'https://www.youtube.com/watch?v=F57gz9O0ABw',
                    oauthorName: 'C_K_GO_:youtube.com',
                    op: 'create',
                    id: 464,
                    userIds: ['testuser0'],
                    timestamp: 1625159031833,
                  },
                ],
              },
            ],
            id: 463,
            userIds: ['testuser0'],
            timestamp: 1625159031833,
          },
        ],
      },
    },
  },
  {
    head: {
      root: {
        head: '_[[數字貨幣]]',
        freeze: true,
        freezeChildren: true,
        op: 'create',
        children: [
          {
            head: 'template',
            body: '::Ticker',
            keyvalue: true,
            op: 'create',
            id: 448,
            userIds: ['bot'],
            timestamp: 1625159031369,
          },
          {
            head: 'title',
            body: '',
            keyvalue: true,
            op: 'create',
            id: 444,
            userIds: ['bot'],
            timestamp: 1625159031369,
          },
          {
            head: 'keywords',
            body: '',
            keyvalue: true,
            valueArray: true,
            op: 'create',
            id: 445,
            userIds: ['bot'],
            timestamp: 1625159031369,
          },
          {
            head: 'tags',
            body: '',
            keyvalue: true,
            valueArray: true,
            op: 'create',
            id: 446,
            userIds: ['bot'],
            timestamp: 1625159031369,
          },
          {
            head: 'pinPrice',
            body: 'true',
            freeze: true,
            keyvalue: true,
            valueBoolean: true,
            op: 'create',
            id: 447,
            userIds: ['bot'],
            timestamp: 1625159031369,
          },
        ],
        id: 438,
        userIds: ['bot'],
        timestamp: 1625159031369,
      },
      value: {
        template: '::Ticker',
        title: '[[數字貨幣]]',
        keywords: [''],
        tags: [''],
        pinPrice: true,
      },
    },
    body: {
      root: {
        head: '[[數字貨幣]]',
        freeze: true,
        id: 450,
        userIds: ['bot'],
        timestamp: 1625159031522,
        children: [
          {
            head: '[!]',
            freeze: true,
            id: 457,
            userIds: ['bot'],
            timestamp: 1625159031522,
          },
          {
            head: '[?]',
            freeze: true,
            id: 459,
            userIds: ['bot'],
            timestamp: 1625159031522,
            children: [
              {
                head: '[[數字貨幣]] <BUY> <SELL> <WATCH>',
                pin: true,
                pinCode: 'BUYSELL',
                poll: true,
                pollChoices: ['BUY', 'SELL', 'WATCH'],
                freeze: true,
                hashtags: [
                  {
                    userId: 'bot',
                    boardId: 27,
                    boardStatus: 'ACTIVE',
                    text: '#Answer',
                  },
                ],
                id: 462,
                boardId: 27,
                pollId: 27,
                userIds: ['bot'],
                timestamp: 1625159031522,
              },
            ],
          },
          {
            head: '[*]',
            freeze: true,
            id: 460,
            userIds: ['bot'],
            timestamp: 1625159031522,
          },
          {
            head: '[+]',
            freeze: true,
            id: 454,
            userIds: ['bot'],
            timestamp: 1625159031522,
          },
          {
            head: '[-]',
            freeze: true,
            id: 458,
            userIds: ['bot'],
            timestamp: 1625159031522,
          },
        ],
      },
    },
  },
]

export const head: CardHeadContent = {
  root: {
    head: '_[[https://www.youtube.com/watch?v=F57gz9O0ABw]]',
    freeze: true,
    op: 'create',
    children: [
      {
        head: 'template',
        body: '::Webpage',
        keyvalue: true,
        op: 'create',
        id: 426,
        userIds: ['bot'],
        timestamp: 1625159030863,
      },
      {
        head: 'title',
        body: 'CK投資理財|揭開‘數字貨幣’這潘多拉!居然還能引發銀行擠兌?!',
        keyvalue: true,
        op: 'create',
        id: 429,
        userIds: ['bot'],
        timestamp: 1625159030863,
      },
      {
        head: 'keywords',
        body: '',
        keyvalue: true,
        op: 'create',
        id: 428,
        userIds: ['bot'],
        timestamp: 1625159030863,
      },
      {
        head: 'tags',
        body: '',
        keyvalue: true,
        op: 'create',
        id: 427,
        userIds: ['bot'],
        timestamp: 1625159030863,
      },
    ],
    id: 425,
    userIds: ['bot'],
    timestamp: 1625159030863,
  },
  value: {
    template: '::Webpage',
    title: 'CK投資理財|揭開‘數字貨幣’這潘多拉!居然還能引發銀行擠兌?!',
    keywords: [''],
    tags: [''],
  },
}

export const body: CardBodyContent = {
  root: {
    head: '[[https://www.youtube.com/watch?v=F57gz9O0ABw]]',
    freeze: true,
    id: 470,
    userIds: ['bot'],
    timestamp: 1625160416507,
    children: [
      {
        head: '[!]',
        freeze: true,
        id: 472,
        userIds: ['bot'],
        timestamp: 1625160416507,
      },
      {
        head: '[?]',
        freeze: true,
        id: 475,
        userIds: ['bot'],
        timestamp: 1625160416507,
        children: [
          {
            head: '[[https://www.youtube.com/watch?v=F57gz9O0ABw]] <BUY> <SELL> <WATCH>',
            pin: true,
            pinCode: 'BUYSELL',
            poll: true,
            pollChoices: ['BUY', 'SELL', 'WATCH'],
            freeze: true,
            hashtags: [
              {
                userId: 'bot',
                boardId: 28,
                boardStatus: 'ACTIVE',
                text: '#Answer',
              },
            ],
            id: 476,
            boardId: 28,
            pollId: 28,
            userIds: ['bot'],
            timestamp: 1625160416507,
          },
        ],
      },
      {
        head: '[*]',
        freeze: true,
        id: 471,
        userIds: ['bot'],
        timestamp: 1625160416507,
      },
      {
        head: '[+]',
        freeze: true,
        id: 474,
        userIds: ['bot'],
        timestamp: 1625160416507,
      },
      {
        head: '[-]',
        freeze: true,
        id: 473,
        userIds: ['bot'],
        timestamp: 1625160416507,
      },
    ],
  },
  nestedCards: [
    { cardSymbol: '[[瑞典央行數字貨幣白皮書]]', cardBodyId: 59 },
    { cardSymbol: '[[數字貨幣]]', cardBodyId: 58 },
  ],
}

export const card = {
  id: 252,
  type: 'WEBPAGE',
  symbol: '[[https://www.youtube.com/watch?v=F57gz9O0ABw]]',
  head,
  body,
}
