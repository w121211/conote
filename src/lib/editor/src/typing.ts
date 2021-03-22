export interface Marker {
  key: string
  value?: string
  error?: string
  // nested的時候，需要確認對應的卡是存在的
  // cardId?: string;
}

export interface MarkerFormat extends Marker {
  inline?: true
  multiline?: true
  poll?: true
  nested?: true
  freeze?: true
  meta?: true
  list?: true

  // 用空array代表自由輸入，例如price
  pollVotes?: string[]

  validater?(value: string): boolean
}

export interface CardLabel {
  // queried: boolean
  // unfound?: boolean
  // error?: string
  symbol: string
  oauthor?: string
  me?: true
}

export interface Markerheader {
  linenumber: number
  marker: Marker
  inline?: true
}

export interface Markerline {
  linenumber: number
  // 這行實際的string（原封不動）
  str: string

  // 建立這個line的user
  userId?: string
  anchorId?: number

  stampId?: string
  // 新創的一行，靠此flag創anchor
  new?: true
  // 在行內還沒有stamp
  noStamp?: true
  // 有stamp，但損毀
  broken?: true

  // 對網頁做筆記時，紀錄該網頁的url，視為來源
  src?: string
  // 紀錄src-card對應的那一行
  srcStamp?: string

  // TODO: 還未決定是否需要此項
  oauthor?: string

  // 這個line對應的是投票
  poll?: true
  pollId?: number

  // 這個line對應的是一個comment
  comment?: true
  commentId?: number

  // 這個line屬於的nested-card，沒有即代表root
  nested?: true
  nestedCard?: CardLabel

  // 這個line的marker
  marker?: Marker
}

interface ConnectedContent {
  // 這行對應的是投票
  poll?: true
  pollId?: number
  pollChoices?: string[]

  // 這行對應的是一個comment
  comment?: true
  commentId?: number
}

export type MarkToConnectedContentRecord = Record<string, ConnectedContent>

export interface ExtToken extends Prism.Token {
  content: ExtTokenStream
  linenumber: number
  marker?: Marker
  // 需要embed，預設沒有
  markerline?: Markerline
}

export type ExtTokenStream = string | ExtToken | Array<string | ExtToken>

export interface Section {
  root?: true
  breaker?: true
  ticker?: true
  topic?: true
  // plain?: true

  nestedCard?: CardLabel

  stream?: ExtTokenStream
}

// export interface TokenizedTextSection extends TextSection {
//     card?: CardIdentifier
//     stream: (ExtToken | string)[]
//     // tokens?: Array<string | Token>
//     markers?: Marker[]
//     symbols?: Set<string>
// }
