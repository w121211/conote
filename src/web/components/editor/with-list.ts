/* eslint-disable no-console */
import assert from 'assert'
import { ReactEditor } from 'slate-react'
import { Editor, Transforms, Range, Element, Node, Path, Text, NodeEntry } from 'slate'
import { LcElement, LiElement, UlElement } from './slate-custom-types'

export function isUl(node: Node): node is UlElement {
  return !Editor.isEditor(node) && Element.isElement(node) && node.type === 'ul'
}

export function isLi(node: Node): node is LiElement {
  return !Editor.isEditor(node) && Element.isElement(node) && node.type === 'li'
}

export function isLiArray(nodes: Node[]): nodes is LiElement[] {
  for (const e of nodes) {
    if (!isLi(e)) {
      return false
    }
  }
  return true
}

export function isLc(node: Node): node is LcElement {
  return !Editor.isEditor(node) && Element.isElement(node) && node.type === 'lc'
}

export function lcPath(liPath: Path): Path {
  return [...liPath, 0]
}

export function ulPath(liPath: Path): Path {
  return [...liPath, 1]
}

export function insertNextUl(editor: Editor, entry: NodeEntry<LiElement>, root?: true): void {
  const insertPath = Path.next(Path.parent(entry[1]))
  Transforms.insertNodes<UlElement>(
    editor,
    {
      type: 'ul',
      children: [{ type: 'li', children: [{ type: 'lc', children: [{ text: '' }] }] }],
    },
    { at: insertPath },
  )
  Transforms.select(editor, [...insertPath, 0, 0]) // 移動cursor至新的位置
}

function removePrevUl(editor: Editor, path: Path) {
  if (!Path.hasPrevious(Path.parent(path))) {
    console.warn('第一個<li root>無法刪除')
    return
  }
  const next = Editor.next(editor, { at: Path.parent(path) })
  if (next === undefined) {
    console.warn('最後一個<li root>無法刪除')
    return
  }
  Transforms.removeNodes(editor, { at: Path.parent(path) })

  // 將cursor移至前一個ul-li的尾端
  Transforms.select(editor, [...Path.previous(Path.parent(path)), 0])
  Transforms.collapse(editor, { edge: 'end' })
}

export function insertNextLi(editor: Editor, entry: NodeEntry<LiElement>): void {
  console.log('insertNextLi')
  const [, path] = entry
  Transforms.insertNodes<LiElement>(
    editor,
    { type: 'li', children: [{ type: 'lc', children: [{ text: '' }] }] },
    { at: Path.next(path) },
  )
  Transforms.move(editor)
}

function insertPrevLi(editor: Editor, entry: NodeEntry<LiElement>) {
  const [, path] = entry
  Transforms.insertNodes<LiElement>(
    editor,
    { type: 'li', children: [{ type: 'lc', children: [{ text: '' }] }] },
    { at: path },
  )
  // Transforms.move(editor)
}

function insertNextIndentLi(editor: Editor, entry: NodeEntry<LiElement>) {
  const [node, path] = entry
  if (node.children[1] === undefined) {
    // 沒有子ul，創一個
    Transforms.insertNodes<UlElement>(
      editor,
      {
        type: 'ul',
        children: [{ type: 'li', children: [{ type: 'lc', children: [{ text: '' }] }] }],
      },
      { at: [...ulPath(path)] },
    )
  } else {
    // 有子ul，插入至第1個
    Transforms.insertNodes<LiElement>(
      editor,
      { type: 'li', children: [{ type: 'lc', children: [{ text: '' }] }] },
      { at: [...ulPath(path), 0] },
    )
  }
  Transforms.move(editor)
}

/**
 * Indent li node
 *
 * TODO:
 * - indent是位置移動，需要設定op='MOVE'
 */
export function indent(editor: Editor, entry: NodeEntry<LiElement>): void {
  const [, path] = entry
  const prev = Editor.previous<LiElement>(editor, { at: path })
  if (prev === undefined) {
    console.warn('第一個<li>無法indent')
    return
  }

  const [prevNode, prevPath] = prev
  const prevUl = prevNode.children[1]

  if (prevUl) {
    // prev有ul，將li移至prev-ul中的最後一個
    Transforms.moveNodes(editor, {
      at: path,
      to: [...ulPath(prevPath), prevUl.children.length],
    })
  } else {
    // prev沒有ul，創一個，然後搬運
    Editor.withoutNormalizing(editor, () => {
      Transforms.insertNodes<UlElement>(editor, { type: 'ul', children: [] }, { at: ulPath(prevPath) })
      Transforms.moveNodes(editor, {
        at: path,
        to: [...ulPath(prevPath), 0],
      })
    })
  }
}

/**
 * Unindent li node
 */
export function unindent(editor: Editor, entry: NodeEntry<LiElement>): void {
  const [, path] = entry
  // const [, parentPath] = Editor.parent(editor, path)
  // const [, parentLiPath] = Editor.parent(editor, parentPath)
  let grandparentPath: Path
  try {
    grandparentPath = Path.parent(Path.parent(path))
  } catch (err) {
    console.error(err)
    console.warn('grandparent不存在，無法unindent')
    return
  }

  Editor.withoutNormalizing(editor, () => {
    Transforms.moveNodes(editor, {
      at: path,
      to: Path.next(grandparentPath),
    })

    // 若原ul已沒有children，刪除該parent
    const [parentNode, parentPath] = Editor.parent(editor, path)
    if (isUl(parentNode) && Editor.isEmpty(editor, parentNode)) {
      Transforms.removeNodes(editor, { at: parentPath })
    }
  })
}

export function onKeyDown(event: React.KeyboardEvent, editor: Editor): void {
  const { selection } = editor

  // if (event.key === 'Shift') {
  //   const lc = Editor.above<LcElement>(editor, { match: n => isLc(n) })
  //   console.log(lc)
  //   if (lc) {
  //     Transforms.setNodes(
  //       editor,
  //       { shift: true },
  //       {
  //         // at:selection,
  //         match: n => {
  //           // console.log(n)
  //           return isLc(n)
  //         },
  //       },
  //     )
  //   } else {
  //     // const lc = Editor.above<LcElement>(editor, { match: n => isLc(n) })
  //     // if (lc) {
  //     Transforms.setNodes(editor, { shift: false })
  //     // }
  //   }
  // }
  if (selection && Range.isCollapsed(selection)) {
    // 非tab、enter，略過
    if (!['Tab', 'Enter'].includes(event.key)) return

    const li = Editor.above<LiElement>(editor, { match: n => isLi(n) })

    if (li) {
      const [, path] = li
      let op: 'indent' | 'unindent' | 'body' | undefined

      // if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      //   // const editorNode =
      //   // console.log(editorNode)
      //   if (editor.selection == null) return
      //   const domPoint = ReactEditor.toDOMPoint(editor, editor.selection?.focus)
      //   const node = domPoint[0]
      //   const element = node.parentElement

      //   if (element === null) return
      //   element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      // }

      if (event.shiftKey && event.key === 'Tab') {
        op = 'unindent'
      } else if (event.key === 'Tab') {
        op = 'indent'
      }
      // else if (event.key === 'Enter' && Node.string(node).length === 0) {
      //   op = 'unindent'
      // }

      switch (op) {
        case 'unindent':
          event.preventDefault()
          // if (path.length === 3) {
          //   console.warn('因為上層是root，無法unindent')
          //   return
          // }
          unindent(editor, li)
          return
        case 'indent':
          event.preventDefault()
          indent(editor, li)
          return
      }

      // if (event.shiftKey && event.key === 'Enter') {
      //   event.preventDefault()
      //   editBody(editor, [bullet, bulletPath])
      //   return
      // }
    }

    // 目前在bulletBody裡
    // const [bulletBody] = Editor.nodes(editor, {
    //   match: (n) =>
    //     !Editor.isEditor(n) &&
    //     Element.isElement(n) &&
    //     n.type === 'bullet-body',
    // })
    // if (bulletBody) {
    //   const [, bodyPath] = bulletBody
    //   const [bullet, bulletPath] = Editor.parent(editor, bodyPath)

    //   if (!Element.isElement(bullet) || bullet.type !== 'bullet') return

    //   if (event.shiftKey && event.key === 'Enter') {
    //     event.preventDefault()
    //     finishEditBody(editor, [bullet, bulletPath])
    //     return
    //   }
    // }
  }
}

export function withList(editor: Editor): Editor {
  const { deleteBackward, insertBreak, insertData, insertText, normalizeNode } = editor

  /**
   * - 此行freeze，不動作
   * - cursor在行首
   *   - 有同階層前行
   *     - 前行有子層，不動作
   *     - 前行沒子層
   *       - 此行有子層，與前行合併，並將子層移至前行子層
   *       - 此行沒子層，與前行合併
   *   - 沒有同階層前行，前行是父層
   *     - 此行有子層，不動作
   *     - 此行沒有子層，與前行合併，delete backward
   * - 此行為空，同cursor在行首
   * - cursor在行中、行尾，delete backward
   */
  editor.deleteBackward = (...args) => {
    const [unit] = args
    const { selection } = editor

    // TODO: 還未考慮一次刪除整段的情況
    if (selection && Range.isCollapsed(selection)) {
      const liEntry = Editor.above<LiElement>(editor, { match: n => isLi(n) })

      if (liEntry) {
        const [li, liPath] = liEntry
        const [lc, ul] = li.children
        // const input = Editor.string(editor, path)
        const point = Editor.point(editor, selection)

        // 此行 freeze，不動作
        if (lc.freeze) return

        // TODO: 需要考慮op

        if (Editor.isStart(editor, point, lcPath(liPath))) {
          // cursor 在 lc 行首

          // if (lc.root) {
          //   // li root，刪除ul & li
          //   removePrevRootLi(editor, path)
          //   return
          // }
          const prevLiEntry = Editor.previous<LiElement>(editor, { at: liPath })

          if (prevLiEntry) {
            // 有同階層的前行
            const [prevLi, prevLiPath] = prevLiEntry

            if (prevLi.children[1]) {
              // 前行有 indent-list
              if (Node.string(lc).length === 0 && ul === undefined) {
                // 此行沒有子層、沒有內文，刪除此行，cursor 移至前行
              } else {
                return // 此行有子層、或有內文，不動作
              }
            }
            if (ul) {
              // 此行有子層，與前行合併，並將此行子層移至前行子層
              Editor.withoutNormalizing(editor, () => {
                Transforms.delete(editor, { unit, reverse: true })
                Transforms.moveNodes(editor, { at: lcPath(liPath), to: ulPath(prevLiPath) })
                Transforms.removeNodes(editor, { at: liPath })
              })
              return
            }
            // else: 此行沒子層，與前行合併 => 原生 delete backward
          } else {
            // 沒有同階層的前行

            if (ul) return // 此行有子層，不動作
            // else: 此行沒有子層，與前行合併 => 原生 delete backward
          }
        }
      }
    }
    deleteBackward(...args)
  }

  /**
   * - 此行freeze
   *   - cursor在行尾，插入indent後行
   *   - 其他，不動作
   * - 此行為空
   *   - 此行是最後一行 & 此行不是第一層，unindent
   *   - 其他，同cursor在行尾的操作
   * - cursor在行尾
   *   - 後行是indent，插入indent後行
   *   - 後行不是indent，插入後行
   * - cursor在行首，插入前行
   * - cursor在行中，拆分本行並插入後行
   */
  editor.insertBreak = () => {
    const { selection } = editor

    if (selection) {
      const li = Editor.above<LiElement>(editor, { match: n => isLi(n) })

      if (li) {
        const [node, path] = li
        const lc = node.children[0]
        const point = Editor.point(editor, selection)

        // li freeze
        if (lc.freeze) {
          if (Editor.isEnd(editor, point, lcPath(path))) {
            // cursor在行尾，插入indent後行
            insertNextIndentLi(editor, li) // 後行是indent，插入indent後行
          }
          // 指標在句首、句中，不動作
          return
        }

        // 此行為空 & 此行是最後一行 & 此行不是第一層，unindent
        if (
          Node.string(node).length === 0 &&
          Editor.next(editor, { at: path }) === undefined &&
          // !Path.equals(path, [0])
          path.length > 1
        ) {
          unindent(editor, li)
          return
        }

        // cursor 在行尾
        if (Editor.isEnd(editor, point, lcPath(path))) {
          console.log(point, path)
          if (node.children[1]) {
            // 後行是indent，插入indent後行
            insertNextIndentLi(editor, li)
            return
          }

          // 後行不是 indent，插入後行
          insertNextLi(editor, li)
          return
        }

        // cursor 在行首，插入前行
        if (Editor.isStart(editor, point, lcPath(path))) {
          insertPrevLi(editor, li)
          return
        }

        // cursor 在行中，拆分本行並插入後行，若此行有 indent，會併入後行
        const insertAt = Path.next(path)
        Transforms.splitNodes(editor, {
          always: true,
          match: n => isLi(n),
          // at: Path.parent(li[1]),
          // match: (n, p) => {
          //   console.log(n, p)
          //   return isLi(n)
          // },
        })
        Transforms.setNodes<LcElement>(
          editor,
          {
            id: undefined,
            body: undefined,
            error: undefined,
            // op: 'CREATE',
          },
          { at: lcPath(insertAt) },
        )
        return
      }
    }
    console.log('original insertBreak')
    insertBreak()
  }

  editor.insertData = data => {
    // @see https://github.com/ianstormtaylor/slate/blob/c1433f56cfe13feb826264989bb4f68a0eefab62/packages/slate-react/src/plugin/with-react.ts
    const text = data.getData('text/plain')
    if (text) {
      const lines = text.trim().split(/\r\n|\r|\n/)
      for (let i = 0; i < lines.length; i++) {
        editor.insertText(lines[i])
        if (i < lines.length - 1) {
          editor.insertBreak()
        }
      }
      return
    }
    insertData(data)
  }

  editor.insertText = (...args) => {
    const { selection } = editor

    if (selection) {
      const lc = Editor.above<LcElement>(editor, {
        match: n => isLc(n),
      })
      // lc freeze，不動作
      if (lc && lc[0].freeze) {
        return
      }
    }
    insertText(...args)
  }

  /**
   * Hint:
   * - 每個操作都會被叫
   * - 只有操作的node及他的parent會進來，其他node並不會被送進來
   * - 盡量不要在這裡修改node，只作為檢查用，因為直接修改容易造成不可遇見的問題
   */
  editor.normalizeNode = ([node, path]) => {
    if (isUl(node)) {
      // 檢查 ul children 只能是 li, trick: 在沒有children的情況下，slate會自動增加一個text node
      for (const e of node.children) {
        assert(isLi(e))
      }

      // 檢查除了root ul以外，ul的前後均只能為li
      // const prev = Editor.previous(editor, { at: path })
      // const next = Editor.next(editor, { at: path })
      // if (prev && path.length > 1 && !isLi(prev[0])) {
      //   console.error(editor.children)
      //   console.error(prev)
      //   throw new Error()
      // }
      // if (next && path.length > 1 && !isLi(next[0])) {
      //   console.error(editor.children)
      //   console.error(prev)
      //   throw new Error()
      // }
    }

    if (isLi(node)) {
      // console.log(editor.children)
      // console.log(node)

      // 檢查li只能有lc, ul?
      assert(node.children.length <= 2)
      const [lc, ul] = node.children

      assert(isLc(lc))
      if (ul) assert(isUl(ul))

      // 只有第0層的li是root（lv0=ul, lv1=li）
      // if (path.length === 1 && node.children[0].root === undefined) {
      //   Transforms.setNodes(editor, { root: true }, { at: lcPath(path) })
      // }
      // if (path.length > 1 && node.children[0].root) {
      //   Transforms.setNodes(editor, { root: undefined }, { at: lcPath(path) })
      // }
    }
    normalizeNode([node, path])
  }

  return editor
}
