interface CardStamp {
  cardId: number
  stamp: string
}

export interface CommentMeta {
  // 每個card都帶有一個comment作為discuss-board
  cardId?: number
  // card-body有此comment，不包含dicuss-board的卡片
  inCardIds: number[]
}
