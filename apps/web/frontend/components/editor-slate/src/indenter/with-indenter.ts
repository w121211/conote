import { nanoid } from 'nanoid'
import { Editor, Element, NodeEntry, Transforms } from 'slate'
import { ElementIndenter } from '../interfaces'
import { normalizeIndent } from './normalizers'

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
  const { normalizeNode, insertFragment } = editor

  // editor.insertNode = node => {
  //   console.log('editor.insertNode', node)
  //   insertNode(node)
  // }

  editor.insertFragment = fragment => {
    console.log('editor.insertFragment', fragment)
    // for (const node of fragment) {
    //   if (Element.isElementType<ElementIndenter>(node, 'indenter')) {
    //     // const sameUids = findIndenters(editor, node.uid)
    //     // if (sameUids.length > 1) {
    //     //   Transforms.setNodes(editor, { uid: nanoid() }, { at: p })
    //     // }
    //   }
    // }

    const fragment_ = fragment.map(e => {
      if (Element.isElementType<ElementIndenter>(e, 'indenter')) {
        // const sameUids = findIndenters(editor, node.uid)
        // if (sameUids.length > 1) {
        //   Transforms.setNodes(editor, { uid: nanoid() }, { at: p })
        // }
        return {
          ...e,
          uid: nanoid(),
        }
      } else {
        return e
      }
    })
    console.log(fragment_)

    return insertFragment(fragment_)
  }

  // editor.insertFragmentData = data => {
  //   console.log('editor.insertFragmentData', data)
  //   return insertFragmentData(data)
  // }

  // editor.insertData = data => {
  //   console.log('editor.insertData', data)
  //   return insertData(data)
  //   // indenterNoramalize(editor)
  // }

  // editor.setFragmentData = (...props) => {
  //   console.log('editor.setFragmentData')
  // }

  /**
   * Ensure
   * - If uid is duplicated, assign a new uid
   *
   * TODO:
   * - 'normalizeNode' calls on everey change (heavy), may shift to check only on insertions
   */
  editor.normalizeNode = entry => {
    const [n, p] = entry

    if (Element.isElementType<ElementIndenter>(n, 'indenter')) {
      // If uid is duplicated, assign a new uid
      if (n.uid === undefined) throw new Error('n.uid === undefined')
      const sameUids = findIndenters(editor, n.uid)
      if (sameUids.length > 1) {
        Transforms.setNodes(editor, { uid: nanoid() }, { at: p })
      }
    }

    return normalizeNode(entry)

    //   const entries = Editor.nodes<ElementIndenter>(editor, {
    //       // Start from the root
    //       at: [],
    //       // Only find nodes at the first depth
    //       match: (n, p) =>
    //         p.length === 1 &&
    //         Element.isElementType<ElementIndenter>(n, 'indenter'),
    //       // Once found a match, stop going deeper
    //       mode: 'highest',
    //     }),
    //     entries_ = Array.from(entries)
    //   normalizeIndent(editor, entries_)
  }

  return editor
}
