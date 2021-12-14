import { cloneDeep } from '@apollo/client/utilities'
import { Bullet } from '../../components/bullet/bullet'

// export type BulletDraftOrRootBulletDraft<T extends Bullet | RootBullet> = T extends Bullet
//   ? RootBulletDraft
//   : BulletDraft

// export type Match = (params: { node: Bullet | BulletDraft; depth: number }) => boolean

// export class BulletNode {
//   /**
//    * 將node展開為list，附上path，並將children設為空array（避免後續操作children）
//    */
//   public static toList(node: Bullet, path: number[] = [0]): Bullet[] {
//     const _node = cloneDeep(node)
//     if (_node.children) {
//       const children = _node.children.reduce<Bullet[]>((acc, cur, i) => {
//         const items = BulletNode.toList(cur, [...path, i])
//         return acc.concat(items)
//       }, [])
//       node.children = [] // 將children設為空
//       // return [{ ..._node, path }, ...children]
//       return [{ ..._node }, ...children]
//     }
//     // return [{ ..._node, path }]
//     return [{ ..._node }]
//   }

//   public static toDict(node: Bullet): Record<string, Bullet> {
//     const _node = cloneDeep(node)
//     const record: Record<string, Bullet> = {}
//     for (const e of BulletNode.toList(_node)) {
//       record[e.id] = e
//     }
//     return record
//   }

//   private static _toDraft(node: Bullet): BulletDraft {
//     const _node = cloneDeep(node)
//     delete _node.op
//     return {
//       ..._node,
//       prevHead: _node.head,
//       prevBody: _node.body,
//       children: _node.children?.map(e => BulletNode._toDraft(e)),
//     }
//   }

//   /**
//    * （Recursive）刪除cur bullet的op、將prev的值設為cur等，用於編輯
//    * Root node不能被編輯，所以是從root的children開始變更
//    */
//   public static toDraft(node: RootBullet): RootBulletDraft {
//     const _node = cloneDeep(node)
//     delete _node.op
//     return {
//       ..._node,
//       prevHead: _node.head,
//       prevBody: _node.body,
//       children: _node.children.map(e => BulletNode._toDraft(e)),
//     }
//   }

//   /**
//    * （Recursive）查看tree中至少一個node有op，若無返回false
//    */
//   public static hasAnyOp(node: BulletDraft): boolean {
//     if (node.op) {
//       return true
//     }
//     for (const e of node.children) {
//       if (BulletNode.hasAnyOp(e)) {
//         return true
//       }
//     }
//     return false
//   }

//   /**
//    * Search in a bullet tree and return the first found
//    */
//   public static find({
//     node,
//     match,
//     curDepth = 0,
//   }: {
//     node: Bullet | BulletDraft
//     match: Match
//     curDepth?: number
//   }): (Bullet | BulletDraft)[] {
//     let found: (Bullet | BulletDraft)[] = []
//     if (match({ node, depth: curDepth })) {
//       found.push(node)
//     }
//     // if (depth.stopAfter === undefined || nextDepth <= depth.stopAfter) {
//     // }
//     for (const e of node.children ?? []) {
//       found = found.concat(BulletNode.find({ node: e, match, curDepth: curDepth + 1 }))
//     }
//     return found
//   }

//   /**
//    * 設定bullet的property
//    */
//   public static set<T extends Bullet | BulletDraft>(props: {
//     node: T
//     match: Match
//     setter: (node: Bullet | BulletDraft) => void
//   }): T {
//     const { node, match, setter } = props
//     const _node = cloneDeep(node)
//     for (const e of BulletNode.find({ node: _node, match })) {
//       setter(e)
//     }
//     return _node
//   }

//   /**
//    * 移除空的 leaf-node，若仍有 children @throws error
//    */
//   public static prune(node: BulletDraft): BulletDraft | null {
//     if (node.head.length === 0) {
//       if (node.children.length > 0) {
//         throw new Error('node沒有head，但有children，無法移除')
//       }
//       return null
//     }
//     return {
//       ...node,
//       children: node.children.map(e => BulletNode.prune(e)).filter((e): e is BulletDraft => e !== null),
//     }
//   }

//   /**
//    * 依照 match 找對應的 nodes
//    */
//   public static filter({
//     node,
//     match,
//     curDepth = 0,
//   }: {
//     node: Bullet | BulletDraft
//     match: Match
//     curDepth?: number
//   }): BulletDraft | null {
//     const filtered = node.children
//       .map(e => BulletNode.filter({ node: e, match }))
//       .filter((e): e is BulletDraft => e !== null)
//     if (filtered.length > 0) {
//       return {
//         ...node,
//         children: filtered,
//       }
//     }
//     if (match({ node, depth: curDepth })) {
//       return {
//         ...node,
//         children: [],
//       }
//     }
//     return null
//   }
// }

// /**
//  * Compare previouse bullet node with current one, and update the current node information in-place
//  * TODO:
//  * - bullet cut/paste
//  * - validation
//  *
//  */
// // function addOp(cur: BulletDraft, prev: Bullet, sourceUrl?: string, oauthorName?: string): BulletDraft {
// //   // const prevDict = bulletToDict(cleanOp(prev))
// //   const prevDict = Node.toDict(Node.toDraft(prev))

// //   function _diff(cur: BulletDraft): BulletDraft {
// //     let node: BulletDraft
// //     if (cur.id) {
// //       const prev = prevDict[cur.id]
// //       delete prev.path
// //       if (cur.head !== prev.head || cur.body !== prev.body) {
// //         node = {
// //           ...prev,
// //           head: cur.head,
// //           body: cur.body,
// //           op: 'UPDATE',
// //         }
// //       } else {
// //         node = { ...prev }
// //       }
// //     } else {
// //       node = {
// //         head: cur.head,
// //         body: cur.body,
// //         sourceUrl,
// //         oauthorName,
// //         op: 'CREATE',
// //       }
// //     }
// //     return {
// //       ...node,
// //       children: cur.children?.map(e => _diff(e)),
// //     }
// //   }
// //   return _diff(cur)
// // }

// /**
//  * Bullet的更新步驟
//  * - Client端
//  *   - 接收到bullet（cur）
//  *   - 進入edit，將cur轉成next，包括移除op，將prev的值設為cur
//  *   - 編輯完成，將next回傳server
//  * - Server端
//  *   - 若next的每個node裡都沒有op，視為無更新，返回
//  *   - 從資料庫取得cur，依照next的op，比較cur & next
//  *     - CREATE: next沒有id
//  *     - UPDATE: next有id & cur中有此node(green) & head, body變動
//  *     - MOVE: next有id & cur中有此node(green)，next的位置變動，包括CUT/PASTE
//  *             事後很難用algorithm的方式找到，需要在編輯時取得哪個是CUT/PASTE的，
//  *             哪些是連帶受影響的，連帶受影響的不算變動
//  *     - DELETE: next有id & cur中有此node(green)
//  *   - 針對沒有op的node，會依照id clone cur node
//  *    （這時會連帶把cur的op也複製進來，但可以依據timestamp、user來判斷是屬於哪次的更新）
//  *   - 針對有op的next node
//  *     - copy必要的值（例如head, body），其餘不copy、沿用原本的（這是避免copy到freeze這些）
//  *     - 將user加入
//  *     - 將oauther、source加入
//  */

// /**
//  * Remove bullet op recursively
//  */
// // function cleanOp(node: Bullet): BulletOmitOp {
// //   delete node.op
// //   return {
// //     ...node,
// //     children: node.children?.map(e => cleanOp(e)),
// //   }
// // }

// /**
//  * （Recursive）
//  * 檢查draft的op，清潔值，確保儲存的內容
//  * users的值是在runOp時才會增加，這裡忽略user
//  *
//  * @returns {BulletDraft}
//  * @throws 檢查到錯時返回錯誤
//  *
//  * TODO:
//  * - MOVE
//  * - path
//  */
// export function checkBulletDraft(draft: BulletDraft, cur: RootBullet): BulletDraft {
//   const curDict = BulletNode.toDict(cur)

//   function _check(_draft: BulletDraft): BulletDraft {
//     const cur = _draft.id ? curDict[_draft.id] : undefined
//     delete cur?.op
//     delete cur?.prevHead
//     delete cur?.prevBody

//     let checked: Omit<BulletDraft, 'children'>
//     switch (_draft.op) {
//       case 'CREATE': {
//         if (cur) throw 'node不能同時有 id 與 CREATE'
//         checked = {
//           head: _draft.head,
//           body: _draft.body,
//           authorId: _draft.authorId,
//           sourceCardId: _draft.sourceCardId,
//           sourceLinkId: _draft.sourceLinkId,
//           op: 'CREATE',
//         }
//         break
//       }
//       case 'UPDATE': {
//         if (cur === undefined) throw 'UPDATE 找不到原本的 node'
//         if (_draft.head === cur.head && _draft.body === _draft.body) throw 'UPDATE 沒有偵測到值變動'
//         checked = {
//           ...cur,
//           head: _draft.head,
//           body: _draft.body,
//           prevHead: cur.head,
//           prevBody: cur.body,
//           op: 'UPDATE',
//         }
//         break
//       }
//       case 'DELETE':
//         if (cur === undefined) throw 'DELETE 找不到原本的 node'
//         checked = {
//           ...cur,
//           head: '',
//           body: undefined,
//           prevHead: cur.head,
//           prevBody: cur.body,
//           op: 'DELETE',
//         }
//         break
//       default:
//         if (cur === undefined) throw '無 op，但找不到原本的 node'
//         checked = cur
//         break
//     }

//     return {
//       ...checked,
//       children: _draft.children?.map(e => _check(e)),
//     }
//   }

//   return _check(draft)
// }
