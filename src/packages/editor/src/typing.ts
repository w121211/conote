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

export interface DBLinker {
  createrId?: string // 建立這行的user，新增時輸入
  editorIds?: string[] // 有修改過這行的user，最後者為最新修改的user

  anchorId?: number
  pollId?: number
  commentId?: number
  replyId?: number
}

export interface Markerline extends DBLinker {
  linenumber: number
  str: string // 這行實際的string（原封不動）

  new?: true // 這行是新增的，靠此創anchor, comment, poll, reply等
  broken?: true // 有stamp，但損毀

  stampId?: string
  noStamp?: true // 這行沒有stamp，靠此修改body-text，把stamp補進這行

  marker?: Marker // 這行的marker

  nested?: true // 這行屬於的nested-card，沒有即代表root
  nestedCard?: CardLabel

  src?: string // 對網頁做筆記時，紀錄該網頁的url，視為來源
  srcStamp?: string // 紀錄src-card對應的那一行

  oauthor?: string

  comment?: true // 這行是一個comment

  poll?: true // 這行是一個投票
  pollChoices?: string[]

  reply?: true // 這行是一個reply
  neatReply?: true // 這行是一個neat-reply，目前判別方式 -> [?] && 只有一個<choice>
}

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

// interface ConnectedContent {
//   // 這行對應的是投票
//   poll?: true
//   pollId?: number
//   pollChoices?: string[]

//   // 這行對應的是一個comment
//   comment?: true
//   commentId?: number
// }

// export type MarkToConnectedContentRecord = Record<string, ConnectedContent>
