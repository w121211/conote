import { nanoid } from 'nanoid'
import { Editor, Element, NodeEntry, Transforms } from 'slate'
import { ElementIndenter } from '../interfaces'

function findIndenters(
  editor: Editor,
  uid: string,
): NodeEntry<ElementIndenter>[] {
  // console.debug('findIndenters')
  const entries = Editor.nodes<ElementIndenter>(editor, {
      at: [],
      match: (n, p) =>
        Element.isElementType<ElementIndenter>(n, 'indenter') && n.uid === uid,
      mode: 'highest',
    }),
    entries_ = Array.from(entries)

  return entries_
}

export function withIndenter(editor: Editor): Editor {
  const { normalizeNode } = editor

  // editor.insertNode = node => {
  //   console.log('editor.insertNode', node)
  //   insertNode(node)
  // }

  // editor.insertFragment = fragment => {
  //   console.log('editor.insertFragment', fragment)
  // }

  // editor.insertFragmentData = data => {
  //   console.log('editor.insertFragmentData', data)
  //   return insertFragmentData(data)
  // }

  // editor.insertData = data => {
  //   console.log('editor.insertData', data)
  //   insertData(data)
  //   indenterNoramalize(editor)
  // }

  // editor.setFragmentData = (...props) => {
  //   console.log('editor.setFragmentData')
  // }

  /**
   * Cases for normalize
   * - Copy, cut, paste
   * - Split node (when enter)
   *
   * TODO:
   * - 'normalizeNode' calls on everey change (heavy), may shift to check only on insertions
   */
  editor.normalizeNode = entry => {
    const [n, p] = entry

    if (Element.isElementType<ElementIndenter>(n, 'indenter')) {
      if (n.uid === undefined) throw new Error('n.uid === undefined')

      const sameUids = findIndenters(editor, n.uid)
      if (sameUids.length > 1) {
        Transforms.setNodes(editor, { uid: nanoid() }, { at: p })
      }

      return normalizeNode(entry)
    }
  }

  return editor
}
