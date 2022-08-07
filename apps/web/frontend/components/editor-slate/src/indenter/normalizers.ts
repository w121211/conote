import { every } from 'lodash'
import { Editor, Element, Node, NodeEntry, Text, Transforms } from 'slate'
import { ElementIndenter } from '../interfaces'
import { getEditorSons } from './queries'

export function isIndenterArray(v: Node[]): v is ElementIndenter[] {
  return every(v, e => Element.isElementType<ElementIndenter>(e, 'indenter'))
}

/**
 * @throws indent error
 */
export function validateIndenters(indenters: ElementIndenter[]) {
  for (let i = 0; i < indenters.length; i++) {
    const cur = indenters[i],
      prev = i > 0 && indenters[i - 1]

    if (cur.indent < 0) throw new Error('cur.indent < 0')

    if (prev) {
      if (cur.indent - prev.indent > 1) {
        throw new Error('indent_oversize')
      }
    } else {
      if (cur.indent > 0) {
        console.debug(cur, prev)
        throw new Error('indent_oversize')
      }
    }
  }
}

/**
 * Process every line one by one to ensure all lines follow the tree structure indentation
 *
 * TODO: Not done yet
 * - undo/redo
 */
export function normalizeIndent(
  editor: Editor,
  indenters: NodeEntry<ElementIndenter>[],
) {
  // Editor.withoutNormalizing(()
  for (let i = 0; i < indenters.length; i++) {
    const [n, p] = indenters[i],
      prev = i > 0 && indenters[i - 1],
      maxIndent = prev && prev[0].indent + 1

    if (maxIndent && n.indent > maxIndent) {
      Transforms.setNodes<ElementIndenter>(
        editor,
        { indent: maxIndent },
        { at: p },
      )
    }
  }
}

/**
 * Indenter value is a plain array of indenters instead of tree.
 *
 * Check every node by
 * - Element except the root is an indenter (consider case of outside incoming data)
 * - Indenter only contains children text
 * - If current indent minus previous indent <= 1 (ie, can only be one offset indent) -> raise warnning
 *
 */
export function indenterNoramalize(editor: Editor): {
  error: ElementIndenter['error'] | null
} {
  const sons = getEditorSons(editor)
  let error: ElementIndenter['error'] | null = null

  for (let i = 0; i < sons.length; i++) {
    const [n, p] = sons[i],
      prev = i > 0 && sons[i - 1]

    if (!Element.isElementType<ElementIndenter>(n, 'indenter')) {
      // throw new Error('Editor son should be an indenter')
      console.debug('Editor son is not an indenter', n, p)
      Transforms.setNodes<ElementIndenter>(
        editor,
        { type: 'indenter', indent: 0 },
        { at: p },
      )
    }
    if (!Element.isElementType<ElementIndenter>(n, 'indenter')) {
      throw new Error(
        'Unexpect error: Son is not the indenter after transforms',
      )
    }
    if (n.indent < 0) {
      throw new Error('n.indent < 0')
    }
    if (!every(n.children, e => Text.isText(e))) {
      throw new Error('Indenter children should only be text')
    }
    if (!prev) {
      if (n.indent > 0) {
        Transforms.setNodes<ElementIndenter>(
          editor,
          { error: 'indent_oversize' },
          { at: p },
        )
        error = 'indent_oversize'
      }
    }
    if (prev) {
      const [prevN, prevP] = prev

      if (!Element.isElementType<ElementIndenter>(prevN, 'indenter')) {
        throw new Error('Unexpect error: Prev-son is not the indenter')
      }
      if (n.indent - prevN.indent > 1) {
        Transforms.setNodes<ElementIndenter>(
          editor,
          { error: 'indent_oversize' },
          { at: p },
        )
        error = 'indent_oversize'
      }
    }
  }

  return { error }
}