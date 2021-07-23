import { cloneDeep } from '@apollo/client/utilities'
import { Bullet, BulletDraft, RootBullet, RootBulletDraft } from './types'

export type BulletDraftOrRootBulletDraft<T extends Bullet | RootBullet> = T extends Bullet
  ? RootBulletDraft
  : BulletDraft

interface NodeInterface {
  _toDraft: (node: Bullet) => BulletDraft

  toList: (node: Bullet, path?: number[]) => Bullet[]
  toDict: (node: Bullet) => Record<string, Bullet>
  toDraft: (node: RootBullet) => RootBulletDraft

  hasAnyOp: (node: BulletDraft) => boolean

  removeEmptryNode: (node: BulletDraft) => BulletDraft | null
}

export const Node: NodeInterface = {
  /**
   * 將node展開為list，附上path，並將children設為空array（避免後續操作children）
   */
  toList: (node: Bullet, path: number[] = [0]): Bullet[] => {
    const _node = cloneDeep(node)
    if (_node.children) {
      const children = _node.children.reduce<Bullet[]>((acc, cur, i) => {
        const items = Node.toList(cur, [...path, i])
        return acc.concat(items)
      }, [])
      node.children = [] // 將children設為空
      return [{ ..._node, path }, ...children]
    }
    return [{ ..._node, path }]
  },

  toDict: (node: Bullet): Record<string, Bullet> => {
    const _node = cloneDeep(node)
    const record: Record<string, Bullet> = {}
    for (const e of Node.toList(_node)) {
      record[e.id] = e
    }
    return record
  },

  _toDraft: (node: Bullet): BulletDraft => {
    const _node = cloneDeep(node)
    delete _node.op
    return {
      ..._node,
      prevHead: _node.head,
      prevBody: _node.body,
      children: _node.children?.map(e => Node._toDraft(e)),
    }
  },

  /**
   * （Recursive）刪除cur bullet的op、將prev的值設為cur等，用於編輯
   * Root node不能被編輯，所以是從root的children開始變更
   */
  toDraft: (node: RootBullet): RootBulletDraft => {
    const _node = cloneDeep(node)
    delete _node.op
    return {
      ..._node,
      prevHead: _node.head,
      prevBody: _node.body,
      children: _node.children.map(e => Node._toDraft(e)),
    }
  },

  /**
   * （Recursive）查看tree中至少一個node有op，若無返回false
   */
  hasAnyOp: (node: BulletDraft): boolean => {
    if (node.op) {
      return true
    }
    for (const e of node.children) {
      if (Node.hasAnyOp(e)) {
        return true
      }
    }
    return false
  },

  /**
   * （Recursive）若node的head為空且沒有children，移除，若仍有children @throws error
   */
  removeEmptryNode: (node: BulletDraft): BulletDraft | null => {
    if (node.head.length === 0) {
      if (node.children.length > 0) {
        throw new Error('node沒有head，但有children，無法移除')
      }
      return null
    }
    return {
      ...node,
      children: node.children.map(e => Node.removeEmptryNode(e)).filter((e): e is BulletDraft => e !== null),
    }
  },
}

/**
 * Compare previouse bullet node with current one, and update the current node information in-place
 * TODO:
 * - bullet cut/paste
 * - validation
 *
 */
// function addOp(cur: BulletDraft, prev: Bullet, sourceUrl?: string, oauthorName?: string): BulletDraft {
//   // const prevDict = bulletToDict(cleanOp(prev))
//   const prevDict = Node.toDict(Node.toDraft(prev))

//   function _diff(cur: BulletDraft): BulletDraft {
//     let node: BulletDraft
//     if (cur.id) {
//       const prev = prevDict[cur.id]
//       delete prev.path
//       if (cur.head !== prev.head || cur.body !== prev.body) {
//         node = {
//           ...prev,
//           head: cur.head,
//           body: cur.body,
//           op: 'UPDATE',
//         }
//       } else {
//         node = { ...prev }
//       }
//     } else {
//       node = {
//         head: cur.head,
//         body: cur.body,
//         sourceUrl,
//         oauthorName,
//         op: 'CREATE',
//       }
//     }
//     return {
//       ...node,
//       children: cur.children?.map(e => _diff(e)),
//     }
//   }
//   return _diff(cur)
// }

/**
 * Bullet的更新步驟
 * - Client端
 *   - 接收到bullet（cur）
 *   - 進入edit，將cur轉成next，包括移除op，將prev的值設為cur
 *   - 編輯完成，將next回傳server
 * - Server端
 *   - 若next的每個node裡都沒有op，視為無更新，返回
 *   - 從資料庫取得cur，依照next的op，比較cur & next
 *     - CREATE: next沒有id
 *     - UPDATE: next有id & cur中有此node(green) & head, body變動
 *     - MOVE: next有id & cur中有此node(green)，next的位置變動，包括CUT/PASTE
 *             事後很難用algorithm的方式找到，需要在編輯時取得哪個是CUT/PASTE的，
 *             哪些是連帶受影響的，連帶受影響的不算變動
 *     - DELETE: next有id & cur中有此node(green)
 *   - 針對沒有op的node，會依照id clone cur node
 *    （這時會連帶把cur的op也複製進來，但可以依據timestamp、user來判斷是屬於哪次的更新）
 *   - 針對有op的next node
 *     - copy必要的值（例如head, body），其餘不copy、沿用原本的（這是避免copy到freeze這些）
 *     - 將user加入
 *     - 將oauther、source加入
 */

/**
 * Remove bullet op recursively
 */
// function cleanOp(node: Bullet): BulletOmitOp {
//   delete node.op
//   return {
//     ...node,
//     children: node.children?.map(e => cleanOp(e)),
//   }
// }

/**
 * （Recursive）
 * 檢查draft的op，清潔值，確保儲存的內容
 * users的值是在runOp時才會增加，這裡忽略user
 *
 * @returns {BulletDraft}
 * @throws 檢查到錯時返回錯誤
 *
 * TODO:
 * - MOVE
 * - path
 */
export function checkBulletDraft(draft: BulletDraft, cur: RootBullet): BulletDraft {
  const curDict = Node.toDict(cur)

  function _check(_draft: BulletDraft): BulletDraft {
    const cur = _draft.id ? curDict[_draft.id] : undefined
    delete cur?.op
    delete cur?.prevHead
    delete cur?.prevBody

    let checked: Omit<BulletDraft, 'children'>
    switch (_draft.op) {
      case 'CREATE': {
        if (cur) throw new Error('node不能同時有id與CREATE')
        checked = {
          head: _draft.head,
          body: _draft.body,
          sourceUrl: _draft.sourceUrl,
          oauthorName: _draft.oauthorName,
          op: 'CREATE',
        }
        break
      }
      case 'UPDATE': {
        if (cur === undefined) throw new Error('UPDATE找不到原本的node')
        if (_draft.head === cur.head && _draft.body === _draft.body) throw new Error('UPDATE沒有偵測到值變動')
        checked = {
          ...cur,
          head: _draft.head,
          body: _draft.body,
          prevHead: cur.head,
          prevBody: cur.body,
          op: 'UPDATE',
        }
        break
      }
      case 'DELETE':
        if (cur === undefined) throw new Error('DELETE找不到原本的node')
        checked = {
          ...cur,
          head: '',
          body: undefined,
          prevHead: cur.head,
          prevBody: cur.body,
          op: 'DELETE',
        }
        break
      default:
        if (cur === undefined) throw new Error('無op，但找不到原本的node')
        checked = cur
        break
    }

    return {
      ...checked,
      children: _draft.children?.map(e => _check(e)),
    }
  }

  return _check(draft)
}
