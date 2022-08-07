import { differenceWith, intersectionWith, zipWith } from 'lodash'
import type {
  TreeNode,
  TreeNodeBody,
  TreeNodeChange,
  TreeNodeChangeType,
} from './interfaces'
import { treeUtil } from './tree-util'

const treeNodeChangeTypeSet = new Set([
  'change-parent',
  'change-parent-update',
  'delete',
  'insert',
  'move',
  'move-update',
  'update',
])

export function isTreeNodeChangeType(type: string): type is TreeNodeChangeType {
  return treeNodeChangeTypeSet.has(type)
}

/**
 * Current support 'delete', 'insert', 'update' changes,
 * 'move' related changes is limited supported
 *
 * TODOS:
 * - [] 'move' related changes is limited supported
 */
class TreeeDifferencer {
  /**
   * Get tree-node-changes
   * - Final - start -> 'insert'
   * - Start - final -> 'delete'
   * - Start and final intersections -> check is 'update', 'change-parent'
   *   - (Not implement yet!) If label 'move' -> check is 'move'
   */
  difference<T>(
    final: TreeNodeBody<T>[],
    start: TreeNodeBody<T>[] | null,
    isDataEqual: (a: T, b: T) => boolean,
  ): TreeNodeChange[] {
    const isSameUidFn = (a: TreeNodeBody<T>, b: TreeNodeBody<T>) =>
        a.uid === b.uid,
      final_minus_start = differenceWith(final, start ?? [], isSameUidFn),
      start_minus_final = differenceWith(start, final, isSameUidFn),
      insertions: TreeNodeChange[] = final_minus_start.map(e => ({
        type: 'insert',
        uid: e.uid,
      })),
      deletions: TreeNodeChange[] = start_minus_final.map(e => ({
        type: 'delete',
        uid: e.uid,
      })),
      start_intersect_final = intersectionWith(start, final, isSameUidFn),
      intersectedZips: [TreeNodeBody<T>, TreeNodeBody<T>][] =
        start_intersect_final.map(startNode => {
          const finalNode = final.find(e => e.uid === startNode.uid)
          if (finalNode) {
            return [startNode, finalNode]
          } else {
            throw new Error('[difference] finalNode === undefined')
          }
        }),
      intersecteds_changes = intersectedZips
        .map(([startNode, finalNode]) => {
          const {
              uid: s_uid,
              parentUid: s_parentUid,
              // order: s_order,
              data: s_data,
            } = startNode,
            {
              uid: f_uid,
              parentUid: f_parentUid,
              // order: f_order,
              data: f_data,
              // change: f_change,
            } = finalNode

          if (f_uid !== s_uid) throw new Error('[difference] s_uid !== f_uid')

          let change: TreeNodeChange | null = null

          if (!isDataEqual(f_data, s_data)) {
            change = { type: 'update', uid: f_uid }
          }
          // if (f_change === 'move') {
          //   change =
          //     change?.type === 'update'
          //       ? { ...change, type: 'move-update' }
          //       : { type: 'move', uid: f_uid }
          // }
          if (f_parentUid !== s_parentUid) {
            change =
              change?.type === 'update'
                ? { ...change, type: 'change-parent-update' }
                : { type: 'change-parent', uid: f_uid }
          }
          return change
        })
        .filter((e): e is TreeNodeChange => e !== null),
      changes = [...insertions, ...deletions, ...intersecteds_changes]

    return changes
  }

  /**
   * Merge two trees
   * - Use final tree as starter
   * - Include deleted nodes
   */
  merge<T>(
    final: TreeNodeBody<T>[],
    start: TreeNodeBody<T>[] | null,
    isDataEqual: (a: T, b: T) => boolean,
  ): [TreeNodeBody<T>, TreeNodeChange | null][] {
    function attachChange(
      bodies: TreeNodeBody<T>[],
      changes: TreeNodeChange[],
    ): [TreeNodeBody<T>, TreeNodeChange | null][] {
      return bodies.map(body => {
        const change = changes.find(e => e.uid === body.uid)
        return [body, change ?? null]
      })
    }

    const changes = this.difference(final, start, isDataEqual)

    if (start === null || start.length === 0) {
      return attachChange(final, changes)
    }

    const f_root = treeUtil.buildFromList(final),
      s_root = treeUtil.buildFromList(start),
      deletions = changes.filter(e => e.type === 'delete')

    this._mergeDeletions(f_root, s_root, deletions)

    const merged = treeUtil.toList(f_root)

    return attachChange(merged, changes)
  }

  /**
   * Inplace insert deleted nodes to the final tree
   */
  _mergeDeletions<T>(
    f_root: TreeNode<T>,
    s_root: TreeNode<T>,
    deletions: TreeNodeChange[],
  ) {
    const uids = treeUtil.toList(f_root).map(e => e.uid),
      f_uidSet = new Set(uids)

    const stack: TreeNode<T>[] = []
    for (const { uid, type } of deletions) {
      if (type !== 'delete') throw new Error('')

      const node = treeUtil.getNode(s_root, uid),
        prevSibling = treeUtil.getPrevSibling(s_root, uid)

      if (prevSibling) {
        if (f_uidSet.has(prevSibling.uid)) {
          treeUtil.insert(f_root, treeUtil.toTreeNodeBody(node), {
            prevSiblingUid: prevSibling.uid,
          })
          f_uidSet.add(node.uid)
        } else {
          stack.push(node)
        }
      } else {
        const { parentUid } = node
        if (parentUid === null)
          throw new Error('Deleted node is the root, not handle this case.')

        if (f_uidSet.has(parentUid)) {
          treeUtil.insert(f_root, treeUtil.toTreeNodeBody(node), {
            prevSiblingUid: null,
            parentUid,
          })
          f_uidSet.add(node.uid)
        } else {
          stack.push(node)
        }
      }
    }
  }
}

export const treeDifferencer = new TreeeDifferencer()

// function insertDeletedBlocks(tree: Block[], deletedBlocks: Block[]): Block[] {
//   const deleted = new Set(deletedBlocks)
//   const stack: Block[] = []

//   }
// }
