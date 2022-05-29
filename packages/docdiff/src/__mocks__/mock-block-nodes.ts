import { cloneDeep } from 'lodash'
import { TreeNodeBody } from '../interfaces'
import { mockTreeNodes } from './mock-nodes'

/**
 * Copy from block-editor
 */
type Block = {
  uid: string

  // Null for doc-block
  parentUid: string | null
  childrenUids: string[]
  order: number

  // Doc block only, equals to doc.str
  docTitle?: string

  str: string
  open?: boolean

  // TBC, consider to drop
  editTime?: number
}

export function isBlockEqual(a: Block, b: Block) {
  return a.str === b.str && a.docTitle === b.docTitle
}

/**
 * 0
 * - 1
 * - 2
 *   - 4
 *     - 6
 *   - 5
 * - 3
 *   - 7
 */
export const mockBlockNodes: Required<TreeNodeBody<Block>>[] =
  mockTreeNodes.map(e => {
    const { uid, parentUid, childrenUids, order } = e,
      block: Block = {
        uid,
        parentUid,
        childrenUids,
        order,
        str: uid,
        docTitle: parentUid === null ? 'docTitle' : undefined,
      }
    return {
      ...e,
      data: block,
    }
  })

/**
 * 0
 * - 1
 * - 2
 *   - 4
 *     - 6* delete
 *   - 5
 * - 3* delete
 *   - 7* delete
 */
export const mockBlockNodes_deletes = cloneDeep(mockBlockNodes).slice(0, 6)
mockBlockNodes_deletes.splice(3, 1)

/**
 * 0
 * - 1
 * - 2* update
 *   - 4
 *     - 6
 *   - 5
 * - 3
 *   - 7* update
 */
export const mockBlockNodes_updates = cloneDeep(mockBlockNodes)
mockBlockNodes_updates[2].data.str = `${mockBlockNodes_updates[2].data.str}-update`
mockBlockNodes_updates[7].data.str = `${mockBlockNodes_updates[7].data.str}-update`

/**
 * 0
 * - 1
 * - 2* update
 *   - 4
 *     - 6
 *   - 5
 * - 3
 *   - 7* update
 */
export const mockBlockNodes_updateRoot = cloneDeep(mockBlockNodes)
mockBlockNodes_updateRoot[0].data.str = `${mockBlockNodes_updateRoot[0].data.str}-update`

/**
 * Assume mockBlockNodes_deletes as the start-value
 *
 * 0
 * - 1
 * - 2* update
 *   - 4* update
 *     - 6* insert
 *   - 5* delete
 * - 3* insert
 *   - 7* insert
 */
export const mockBlockNodes_mix = cloneDeep(mockBlockNodes)
mockBlockNodes_mix[2].data.str = `${mockBlockNodes_mix[2].data.str}-update`
mockBlockNodes_mix[4].data.str = `${mockBlockNodes_mix[4].data.str}-update`
mockBlockNodes_mix.splice(5, 1)
