import { BulletEmojiLike, CardEmojiLike, LikeChoice } from '@prisma/client'

type IEmojiLike = BulletEmojiLike | CardEmojiLike

export const EmojiLike = {
  /** Get change of up, down  */
  compare<T extends IEmojiLike>(like: T, prevLike?: T): { dDown: number; dUp: number } {
    let dUp = 0
    let dDown = 0
    if (prevLike) {
      switch (prevLike.choice) {
        case LikeChoice.UP:
          dUp -= 1
          break
        case LikeChoice.DOWN:
          dDown -= 1
          break
      }
    }
    switch (like.choice) {
      case LikeChoice.UP:
        dUp += 1
        break
      case LikeChoice.DOWN:
        dDown += 1
        break
    }
    return { dDown, dUp }
  },
}
