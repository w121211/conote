import assert from 'assert'
import { Editor, Transforms, Range, Element, Node, Path, Text, NodeEntry } from 'slate'
import { BulletOperation } from '../../lib/bullet/types'
import { LcElement } from './slate-custom-types'
import { isLc } from './with-list'

export function withOp(editor: Editor): Editor {
  const { normalizeNode } = editor

  /**
   * 用於標示op
   * - CREATE: 沒有id、有head input
   * - UPDATE: 有id、head/body與prev不同
   * - DELETE: TODO 需要在close editor時才可以偵測到
   * - MOVE: TODO
   */
  editor.normalizeNode = ([node, path]) => {
    if (isLc(node)) {
      let op: BulletOperation | undefined
      const input = Node.string(node)

      // CREATE: 沒有id、有head input
      if (node.id === undefined && input.length > 0) {
        op = 'CREATE'
      }
      // UPDATE: 有id、head/body與prev不同
      if (node.id && node.prevHead && input !== node.prevHead) {
        op = 'UPDATE'
      }
      if (op !== node.op) {
        Transforms.setNodes<LcElement>(editor, { op }, { at: path })
      }
    }

    normalizeNode([node, path])
  }

  return editor
}
