import { randString } from './helper'

// 最多嘗試幾次以避免重複產生重複的stamp，超過就不再嘗試
const MAX_TRY = 10

export function createStamp(curStamps: string[]): string {
  let stamp: string | undefined
  for (let i = 0; i < MAX_TRY; i++) {
    const s = `%${randString()}`
    if (!curStamps.includes(s)) {
      stamp = s
      break
    }
  }
  if (stamp === undefined) {
    throw new Error(`嘗試生成stamp${MAX_TRY}次仍未成功，超過 MAX_TRY 次數`)
  }
  return stamp
}
