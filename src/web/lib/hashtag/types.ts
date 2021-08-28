import { Hashtag as PrismaHashtag, Poll, PollCount } from '@prisma/client'

/**
 * Hashtag 類型
 * - plain text：用於 filter 時可以被搜尋，不會在資料庫裡建立，eg (#buy)
 * - by system: 系統預設，可+1、可 filter，可從功能列上增加，eg #up #down #pin
 * - by user: 使用者建立，可+1/-1（-1表答對此 hashtag 不認同）、可 filter，可從功能列上增加，eg #黑馬
 * - hashtag group：本質上是 poll，eg (#多 #空)，用括號包住投票的選項，可點擊投票（類似+1）、filter、可對整個 group +1/-1、可查看當前投票情形
 */

export type HashtagOperation = 'CREATE' | 'UPDATE' | 'DELETE'

export type Hashtag = Omit<PrismaHashtag, 'status' | 'pollId' | 'createdAt' | 'updatedAt'> & {
  type: 'hashtag'
}

export type HashtagDraft = Partial<Omit<Hashtag, 'type'>> & {
  type: 'hashtag-draft'
  op: HashtagOperation // 編輯狀態
  text: string
}

/** eg (#buy #sell #hold) */
export type HashtagGroup = Omit<Hashtag, 'type'> & {
  type: 'hashtag-group'
  poll: Omit<Poll, 'type' | 'status' | 'createdAt' | 'updatedAt'> & {
    count: Omit<PollCount, 'pollId' | 'nJudgments' | 'createdAt' | 'updatedAt'>
  }
}

export type HashtagGroupDraft = Partial<Omit<HashtagGroup, 'type'>> & {
  type: 'hashtag-group-draft'
  op: HashtagOperation // 編輯狀態
  pollChoices: string[]
}
