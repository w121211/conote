import { Editor, Transforms, Node, Operation } from 'slate'
import { isLc } from './with-list'

type Change = {
  // id: string
  // arrayId: string | null // for multiple array case, eg tree
  type: 'insert' | 'update' | 'move' | 'move-update' | 'delete'
  // index?: number // for insert only
  // data?: T
}

export function withObserve(editor: Editor): Editor {
  const { apply, normalizeNode } = editor

  editor.apply = (operation: Operation) => {
    console.log(operation)
    apply(operation)
  }

  // editor.normalizeNode = ([node, path]) => {
  //   if (isLc(node)) {
  //     // console.log(node)
  //     // let op: BulletOperation | undefined
  //     // const input = Node.string(node)
  //     // CREATE: 沒有 id、有 input
  //     // if (node.id === undefined && input.length > 0) {
  //     //   op = 'CREATE'
  //     // }
  //     // // UPDATE: 有id、head/body與prev不同
  //     // if (node.id && node.prevHead && input !== node.prevHead) {
  //     //   op = 'UPDATE'
  //     // }
  //     // if (op !== node.op) {
  //     //   Transforms.setNodes<LcElement>(editor, { op }, { at: path })
  //     // }
  //   }
  //   normalizeNode([node, path])
  // }

  return editor
}
