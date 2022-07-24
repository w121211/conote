import { Editor, Element, NodeEntry } from 'slate'
import { ElementIndenter } from '../interfaces'

/**
 * Return the first-depth nodes of the editor value
 */
export function getEditorSons(editor: Editor) {
  const _entries = Editor.nodes(editor, {
      at: [], // Start from the root
      match: (n, p) => p.length === 1, // Only find nodes at the first depth
      mode: 'highest', // Once found a match, stop going deeper
    }),
    entries = Array.from(_entries)

  return entries
}

export function getAllIndenters(editor: Editor) {
  return Editor.nodes<ElementIndenter>(editor, {
    at: [],
    match: (n, p) => Element.isElementType<ElementIndenter>(n, 'indenter'),
  })
}

/**
 * Returns parent of the current node, or returns null if the node has no parent (in case of 0-depth)
 *
 * @throws If parent not found
 */
export function getParentIndenter(
  cur: ElementIndenter,
  itemsBefore: ElementIndenter[],
): ElementIndenter | null {
  if (cur.indent === 0) return null

  let parent: ElementIndenter | null = null
  for (let i = itemsBefore.length - 1; i >= 0; i--) {
    const prev = itemsBefore[i]
    if (cur.indent > prev.indent) {
      parent = prev
      break
    }
  }

  if (parent === null) {
    console.debug(cur, itemsBefore)
    throw new Error('[getParent] parent not found')
  }

  return parent
}

export function getPrevSiblings(
  cur: ElementIndenter & { parentUid: string },
  itemsBefore: (ElementIndenter & { parentUid: string })[],
): ElementIndenter[] {
  return itemsBefore.filter(
    e => e.parentUid === cur.parentUid && e.indent === cur.indent,
  )
}

export function getIndenterByUid(
  editor: Editor,
  uid: string,
): NodeEntry<ElementIndenter> {
  const _entries = Editor.nodes<ElementIndenter>(editor, {
      match: n =>
        Element.isElementType<ElementIndenter>(n, 'indenter') && n.uid === uid,
      at: [],
    }),
    entries = Array.from(_entries)

  if (entries.length > 1)
    throw new Error('Found multiple indenters by the given uid')
  if (entries.length === 0)
    throw new Error('Found no indenters by the given uid')

  return entries[0]
}
