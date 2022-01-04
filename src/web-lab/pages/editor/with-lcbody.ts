import {
  Editor,
  Element,
  Node,
  NodeEntry,
  Path,
  Range,
  Transforms,
} from 'slate'
import { LcBodyElement, LcHeadElement } from './slate-custom-types'

/**
 * 嘗試用inline表示body，遇到的困難：
 * - inline element不能是最後一個child (slate本身的限制)，會自動在最後加一個text -> 可能對render有問題
 * - inline 在輸入時會自動合併到text
 */

export function isLcHead(node: Node): node is LcHeadElement {
  return (
    !Editor.isEditor(node) && Element.isElement(node) && node.type === 'lc-head'
  )
}

export function isLcBody(node: Node): node is LcBodyElement {
  return (
    !Editor.isEditor(node) && Element.isElement(node) && node.type === 'lc-body'
  )
}

/**
 * 用element表示body，關鍵是只有要編輯body時才插入body，其他時刻移除，body顯示的部分由lc-head負責
 */

/**
 * 設定lc-head的isEditingBody為true -> 插入lc-body（包括設好lc-body的text） -> 將指標移動至lc-body尾端
 */
export function insertLcBody(
  editor: Editor,
  lcHeadEntry: NodeEntry<LcHeadElement>
): void {
  const [node, path] = lcHeadEntry

  Transforms.setNodes<LcHeadElement>(
    editor,
    { isEditingBody: true },
    { at: path }
  )

  const insertAt = Path.next(path)

  const next = Editor.next(editor, { at: path })
  if (next) {
    // throw new Error('?')
    console.warn('指標在lc-head時應該不能有lc-body')
  } else {
    Transforms.insertNodes(
      editor,
      {
        type: 'lc-body',
        children: [{ text: node.body ?? '' }],
      },
      { at: insertAt }
    )
  }

  Transforms.select(editor, insertAt)
  Transforms.collapse(editor, { edge: 'end' })
}

/**
 * 將lc-body的text存入lc-head的body -> 刪除lc-body element
 */
export function removeLcBody(
  editor: Editor,
  lcBodyEntry: NodeEntry<LcBodyElement>
): void {
  const [node, path] = lcBodyEntry
  Transforms.setNodes<LcHeadElement>(
    editor,
    {
      body: Node.string(node),
      isEditingBody: undefined,
    },
    { at: Path.previous(path) }
  )
  Transforms.removeNodes(editor, { at: path })
  Transforms.select(editor, Path.previous(path))
  Transforms.collapse(editor, { edge: 'end' })
}

/**
 * 在lc-head：
 * - 按Shift + Enter：插入lc-body
 *
 * 在lc-body：
 * - 按Shift + Enter：移除lc-body
 * - 按Enter：插入new line `\n`
 * - 按up/down/left/right：控制不能移動到lc-body以外的地方（若超出邊界即設定為無效作用）
 * - 當lc-body unselected（例如指標點擊別處、unfocus）：移除lc-body
 */
export function onKeyDown(event: React.KeyboardEvent, editor: Editor): void {
  const { selection } = editor

  if (selection && Range.isCollapsed(selection)) {
    const lcHead = Editor.above<LcHeadElement>(editor, {
      match: (n) => isLcHead(n),
    })
    if (lcHead) {
      if (event.shiftKey && event.key === 'Enter') {
        event.preventDefault()
        insertLcBody(editor, lcHead)
      }
      return
    }

    const lcBody = Editor.above<LcBodyElement>(editor, {
      match: (n) => isLcBody(n),
    })
    if (lcBody) {
      if (event.shiftKey && event.key === 'Enter') {
        event.preventDefault()
      } else if (event.key === 'Enter') {
        event.preventDefault()
        Editor.insertText(editor, '\n') // TODO: BUG: firefox的指標顯示還維持在原行，用select/collapse解決？
      }
      return
    }
  }
}
