import { Editor, Element, Node, Range, Text, Transforms } from 'slate'
import { ElementIndenter } from '../interfaces'
import { indenterNoramalize } from './normalizers'
import { getIndenterByUid } from './queries'

interface SetIndentOptions {
  /**
   * 1 to indent
   * -1 to outdent
   * @default 1
   */
  offset?: number
}

/**
 * Add offset to the indentation of the selected blocks.
 */
export function setIndent(editor: Editor, { offset = 1 }: SetIndentOptions) {
  const _nodes = Editor.nodes<ElementIndenter>(editor, {
    match: (n, p) => Element.isElementType(n, 'indenter'),
  })
  const nodes = Array.from(_nodes)

  Editor.withoutNormalizing(editor, () => {
    nodes.forEach(([node, path]) => {
      const blockIndent = node.indent
      const newIndent = blockIndent + offset

      if (newIndent < 0) {
        // Do nothing
      } else {
        Transforms.setNodes<ElementIndenter>(
          editor,
          { indent: newIndent, error: undefined },
          { at: path },
        )
      }
    })
  })

  indenterNoramalize(editor)
}

/**
 * Increase the indentation of the selected blocks.
 * - If is already indent compare to prev -> stop indent
 */
export function indent(editor: Editor, options?: SetIndentOptions) {
  setIndent(editor, { offset: 1, ...options })
}

/**
 * Decrease the indentation of the selected blocks.
 */
export function outdent(editor: Editor, options?: SetIndentOptions) {
  setIndent(editor, { offset: -1, ...options })
}

/**
 * @returns true if replace successfully
 */
export function indenterTextReplace(
  editor: Editor,
  uid: string,
  strFind: string,
  strReplace: string,
): boolean {
  const [n, p] = getIndenterByUid(editor, uid)

  for (let i = 0; i < n.children.length; i++) {
    const t = n.children[i],
      idx = t.text.indexOf(strFind)

    if (idx >= 0) {
      const path = [...p, i]
      // Transforms.select(editor, { path, offset: idx })
      // Transforms.deselect(editor)
      Transforms.insertText(editor, strReplace, {
        at: {
          anchor: { path, offset: idx },
          focus: { path, offset: idx + strFind.length },
        },
      })
      return true
    }
  }

  console.debug('The given strFind is not found, do nothing')
  return false
}
