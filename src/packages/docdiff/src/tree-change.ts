import { cloneDeep } from 'lodash'
import { DataNode, TreeService, TreeNode } from './tree'

export type ChangeType =
  | 'insert'
  | 'update'
  | 'move' // TODO: 若又改回來了的情況？
  | 'move-update'
  | 'delete'
  | 'change-parent' // TODO: 若又改回來了的情況？
  | 'change-parent-update'

export type NodeChange<T> = {
  type: ChangeType
  cid: string
  toParentCid: string // refers to final state id
  toIndex: number | null // for insert only, others set to null
  data?: T
}

interface ITreeChangeService {
  _applyArrayChanges: <T>(arr: DataNode<T>[], changes: NodeChange<T>[]) => DataNode<T>[]

  applyChanges: <T>(value: TreeNode<T>[] | null, changes: NodeChange<T>[]) => TreeNode<T>[]

  getChnages: <T>(
    finalValue: TreeNode<T>[],
    startValue: TreeNode<T>[] | null,
    isDataEqual: (a: T, b: T) => boolean,
  ) => NodeChange<T>[]
}

export const TreeChangeService: ITreeChangeService = {
  _applyArrayChanges<T>(arr: DataNode<T>[], changes: NodeChange<T>[]): DataNode<T>[] {
    const _apply = (arr: DataNode<T>[], change: NodeChange<T>): DataNode<T>[] => {
      switch (change.type) {
        case 'delete': {
          const keeps = arr.filter(e => e.cid !== change.cid)
          // (pending) TODO: udpate prevId
          return keeps
        }
        case 'insert': {
          if (change.data === undefined || change.toIndex === null) {
            throw '[bullet-doc] NodeChange properties error'
          }
          arr.splice(change.toIndex, 0, { cid: change.cid, data: change.data })
          return arr
        }
        case 'update': {
          if (change.data === undefined) {
            throw '[bullet-doc] NodeChange properties error'
          }
          return arr.map(e => {
            if (e.cid === change.cid) {
              return { ...e, data: change.data }
            }
            return e
          })
        }
        default:
          throw '[bullet-doc] Unhandled error'
      }
    }

    // 執行順序: delete -> insert -> update
    let applied = cloneDeep(arr)
    const _score = (name: string): number => {
      const score: Record<string, number> = {
        delete: 1,
        insert: 2,
        update: 3,
      }
      return name in score ? score[name] : 0
    }
    const sortedChanges = changes.sort((a, b) => _score(a.type) - _score(b.type))
    for (const e of sortedChanges) {
      applied = _apply(applied, e)
    }
    return applied
  },

  applyChanges<T>(value: TreeNode<T>[] | null, changes: NodeChange<T>[]): TreeNode<T>[] {
    // const tempRoot: NestedNode<T> = {
    //   id: rootParentId,
    //   children: [],
    // }
    const startPC = TreeService.toParentChildrenDict(value ?? [])
    const finalPC: Record<string, DataNode<T>[]> = {}

    let parentCids: string[] = [TreeService.tempRootCid]
    const doneCids: string[] = []
    while (parentCids.length > 0) {
      const cid = parentCids.shift()
      if (cid === undefined || doneCids.includes(cid)) {
        throw '[bullet-doc] node data error'
      }
      const children: DataNode<T>[] = startPC[cid] ?? []
      const appliedChildren = this._applyArrayChanges(
        children,
        changes.filter(e => e.toParentCid === cid),
      )
      finalPC[cid] = appliedChildren
      parentCids = parentCids.concat(appliedChildren.map(e => e.cid))
      doneCids.push(cid)
    }
    return TreeService.fromParentChildrenDict(finalPC)
  },

  getChnages<T>(
    finalValue: TreeNode<T>[],
    startValue: TreeNode<T>[] | null,
    isDataEqual: (a: T, b: T) => boolean,
  ): NodeChange<T>[] {
    const startDict = startValue ? TreeService.toDict(startValue) : {}
    const finalDict = TreeService.toDict(finalValue)
    const changeDict: Record<string, NodeChange<T>> = {} // { [nodeCid]: Change }

    // 以 start-value 為基礎比較 final
    Object.entries(startDict).forEach(([startCid, start]) => {
      const { parentCid: startParentCid, index: startIndex, data: startData } = start
      if (startParentCid === undefined || startIndex === undefined || startData === undefined) {
        throw '[bullet-doc] start node data error'
      }

      const final = finalDict[startCid]
      if (final === undefined) {
        // final 中沒有該 node -> deleted
        changeDict[startCid] = {
          type: 'delete',
          cid: startCid,
          toParentCid: startParentCid,
          toIndex: null,
        }
        return
      }

      // final 中有該 node -> 更新、移動、無變動
      const { parentCid: finalParentCid, index: finalIndex, data: finalData } = final
      if (finalParentCid === undefined || finalIndex === undefined || finalData === undefined) {
        throw '[bullet-doc] final node data error'
      }

      let change: NodeChange<T> | undefined
      if (!isDataEqual(finalData, startData)) {
        // 資料有更新
        change = {
          type: 'update',
          cid: startCid,
          data: finalData,
          toParentCid: startParentCid,
          toIndex: null,
        }
      }
      if (final.change === 'move') {
        // 有標注移動
        change =
          change?.type === 'update'
            ? {
                ...change,
                type: 'move-update',
                toParentCid: finalParentCid,
                toIndex: finalIndex,
              }
            : {
                type: 'move',
                cid: startCid,
                toParentCid: finalParentCid,
                toIndex: finalIndex,
              }
      } else if (finalParentCid !== startParentCid) {
        // parent 有變換
        change =
          change?.type === 'update'
            ? {
                ...change,
                type: 'change-parent-update',
                toParentCid: finalParentCid,
                toIndex: finalIndex,
              }
            : {
                type: 'change-parent',
                cid: startCid,
                toParentCid: finalParentCid,
                toIndex: finalIndex,
              }
      }
      if (change) {
        changeDict[startCid] = change
      }
    })

    // 以 final-value 為基礎比較 start -> eg 新增
    Object.entries(finalDict).forEach(([finalCid, final]) => {
      if (!(finalCid in startDict)) {
        // start-value 沒有 final node -> insert
        const { parentCid: finalParentCid, index: finalIndex } = final
        if (finalParentCid === undefined || finalIndex === undefined) {
          throw '[bullet-doc] final node data error'
        }
        changeDict[finalCid] = {
          type: 'insert',
          cid: finalCid,
          toParentCid: finalParentCid,
          toIndex: finalIndex,
          data: final.data,
        }
      }
    })

    const changes = Object.entries(changeDict).map<NodeChange<T>>(([, v]) => v)
    return changes
  },
}

// export class BaseNestedNodeDoc<T extends BaseNode> implements BaseDoc {
//   public readonly id: string // must have
//   // public subDocIds: string[] = []
//   public startDocId: string

//   private startState: NestedNode<T> // not to change
//   private startDataMap: Map<string, T> // not to change

//   // private curState: Map<string, T> // 不保存目前的 state
//   // public changeMap: Map<string, Change<T>> = new Map() // { [bulletId]: Change<Bullet> }

//   constructor({ startDocId, startState }: { startDocId: string; startState: NestedNode<T> }) {
//     this.startDocId = startDocId
//     this.startState = startState
//     this.startDataMap = NodeHelper.toMap(startState) // TODO: immutable
//   }

//   static _applyArrayChanges<T extends BaseNode>(arr: T[], changes: Change<T>[]) {
//     const _delete = (arr: T[], del: Change<T>): T[] => {
//       if (del.data === undefined) {
//         throw 'Change properties error'
//       }
//       const filtered = arr.filter(e => e.id !== del.data?.id)
//       if (filtered.length !== arr.length - 1) {
//         console.error(arr, del)
//         throw 'Change data error'
//       }
//       // (pending) TODO: udpate prevId
//       return filtered
//     }

//     const _insert = (arr: T[], insert: Change<T>): T[] => {
//       if (insert.data === undefined || insert.index === undefined) {
//         throw 'Change properties error'
//       }
//       return arr.splice(insert.index, 0, insert.data)
//     }

//     const _update = (arr: T[], update: Change<T>): T[] => {
//       if (update.data === undefined) {
//         throw 'Change properties error'
//       }
//       return arr.map(e => {
//         if (update.data && e.id === update.id) {
//           return update.data
//         }
//         return e
//       })
//     }

//     // 執行順序: delete -> insert -> update
//     let applied = arr
//     for (const e of changes.filter(e => e.type === 'delete')) {
//       applied = _delete(applied, e)
//     }
//     for (const e of changes.filter(e => e.type === 'insert')) {
//       applied = _insert(applied, e)
//     }
//     for (const e of changes.filter(e => e.type === 'update')) {
//       applied = _update(applied, e)
//     }
//     return applied
//   }

//   static applyChanges<T extends BaseNode>(root: NestedNode<T> | null, changes: Change<T>[]): NestedNode<T> {
//     const starterMap: Map<string, T[]> = NodeHelper.toMap(root, {
//       rootParentId: 'root-parent',
//     })
//     const nextMap = new Map<string, T[]>()

//     const arrayIds: string[] = ['root-parent']
//     while (arrayIds.length > 0) {
//       const arrId = arrayIds.pop()
//       if (arrId === undefined) {
//         break
//       }
//       const arr = this._applyDiffOnArray(
//         starterMap.get(arrId) ?? [],
//         changes.filter(e => e.arrayId === arrId),
//       )
//       nextMap.set(arrId, arr)
//       arrayIds.concat(arr.map(e => e.id))
//     }

//     return NodeHelper.fromMap(nextMap, 'root-parent')
//   }

//   // static diff<T>(
//   //   from: DataNode<T>,
//   //   cur: DataNode<T>,
//   //   updateMap: Map<string, Change>
//   // ) {}
//   // diff(curState: DataNode<T>): void {
//   //   this.changeMap.forEach((v, k) => {})
//   // }

//   /**
//    * 只更新 change-map，值不存入 <- 為了節省時間
//    *
//    * TODO: move
//    */
//   setData(data: T, isValueEqual: (a: T, b: T) => boolean, isMoved: boolean): void {
//     let change: Change<T> | undefined = this.changeMap.get(data.id)
//     if (change) {
//       switch (change.type) {
//         case 'update':
//           break
//         default:
//           return
//       }
//     }
//     const starter = this.startDataMap.get(data.id)
//     if (starter) {
//       const isValueEq = isValueEqual(starter, data)
//       if (!isValueEq && isMoved) {
//         change = { type: 'update-move' }
//       } else if (isMoved) {
//         change = { type: 'move' }
//       } else if (!isValueEq) {
//         change = { type: 'update' }
//       }
//     } else {
//       change = { type: 'insert' }
//     }
//     if (change) {
//       this.changeMap.set(data.id, change)
//     }
//   }

//   /**
//    * 存入 indexed-db
//    *
//    * Use rxjs to save doc periodically @see https://www.learnrxjs.io/learn-rxjs/operators/creation/interval
//    */
//   // save(): void {}

//   /**
//    * 從 indexed-db 中刪除此 doc（若存在）
//    */
//   // drop(): void {}
// }

// const doc = new Doc()
// const snap = doc.toSnapshot()

// const doc = Doc.fromSnapShot(snap)
// doc.curState
// doc.fromState
// const updates = Doc.diff(from)

// Doc.applyUpdates(from)
