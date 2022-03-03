import { BulletEmojiLike, NoteEmojiLike, DiscussEmojiLike, DiscussPostEmojiLike, LikeChoice } from '@prisma/client'

// type IEmojiLike = BulletEmojiLike | NoteEmojiLike | DiscussEmojiLike | DiscussPostEmojiLike

export const EmojiLike = {
  /**
   * Get change of up, down
   */
  compare<T extends DiscussEmojiLike | DiscussPostEmojiLike>(like: T, prevLike?: T): { dUp: number } {
    let dUp = 0
    if (prevLike) {
      if (prevLike.liked) {
        dUp -= 1
      }
    }
    if (like.liked) {
      dUp += 1
    }
    return { dUp }
  },

  /**
   * Get change of up, down
   */
  compareOld<T extends BulletEmojiLike | NoteEmojiLike>(like: T, prevLike?: T): { dDown: number; dUp: number } {
    let dUp = 0
    const dDown = 0
    if (prevLike) {
      switch (prevLike.choice) {
        case LikeChoice.UP:
          dUp -= 1
          break
        // case LikeChoice.DOWN:
        //   dDown -= 1
        //   break
      }
    }
    switch (like.choice) {
      case LikeChoice.UP:
        dUp += 1
        break
      // case LikeChoice.DOWN:
      //   dDown += 1
      //   break
    }
    return { dDown, dUp }
  },
}
