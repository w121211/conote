import { differenceWith, intersectionWith } from 'lodash'
import type { TreeNodeBody, TreeNodeChange } from './interfaces'

/**
 * Current support 'delete', 'insert', 'update' changes,
 * 'move' related changes is limited supported
 *
 * TODOS:
 * - [] 'move' related changes is limited supported
 */
class TreeNodeDifferencer {
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
    const sameUid = (a: TreeNodeBody<T>, b: TreeNodeBody<T>) => a.uid === b.uid,
      final_minus_start = differenceWith(final, start ?? [], sameUid),
      start_minus_final = differenceWith(start, final, sameUid),
      insertions: TreeNodeChange[] = final_minus_start.map(e => ({
        type: 'insert',
        uid: e.uid,
      })),
      deletions: TreeNodeChange[] = start_minus_final.map(e => ({
        type: 'delete',
        uid: e.uid,
      })),
      start_intersect_final = intersectionWith(start, final, sameUid),
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
}

export const treeNodeDifferencer = new TreeNodeDifferencer()
