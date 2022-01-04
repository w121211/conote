import assert from 'assert'
import { nanoid } from 'nanoid'
import {
  Editor,
  Transforms,
  Range,
  Element,
  Node,
  Path,
  Text,
  NodeEntry,
} from 'slate'
import { LcElement, LiElement, UlElement } from './slate-custom-types'

export const ListHelper = {
  // getLiEntry(editor: Editor, path: Path): NodeEntry<LiElement> | undefined {
  //   return Editor.above<LiElement>(editor, {
  //     match: (n) => ListHelper.isLi(n),
  //     at: path,
  //   })
  // },

  isUl(node: Node): node is UlElement {
    return (
      !Editor.isEditor(node) && Element.isElement(node) && node.type === 'ul'
    )
  },

  isLi(node: Node): node is LiElement {
    return (
      !Editor.isEditor(node) && Element.isElement(node) && node.type === 'li'
    )
  },

  isLiArray(nodes: Node[]): nodes is LiElement[] {
    for (const e of nodes) {
      if (!ListHelper.isLi(e)) {
        return false
      }
    }
    return true
  },

  isLc(node: Node): node is LcElement {
    return (
      !Editor.isEditor(node) && Element.isElement(node) && node.type === 'lc'
    )
  },

  lcPath(liPath: Path): Path {
    return [...liPath, 0]
  },

  ulPath(liPath: Path): Path {
    return [...liPath, 1]
  },
}

interface ListOperator {
  _newLc: () => LcElement

  onInsertLc: (lc: LcElement) => void
  onMoveLc: (lc: LcElement) => void

  insertNextUl: (
    editor: Editor,
    entry: NodeEntry<LiElement>,
    root?: true
  ) => void
  removePrevUl: (editor: Editor, path: Path) => void

  insertNextLi: (editor: Editor, entry: NodeEntry<LiElement>) => void
  insertPrevLi: (editor: Editor, entry: NodeEntry<LiElement>) => void
  insertNextIndentLi: (editor: Editor, entry: NodeEntry<LiElement>) => void
  splitLi: (editor: Editor, entry: NodeEntry<LiElement>) => void

  indent: (editor: Editor, entry: NodeEntry<LiElement>) => void
  unindent: (editor: Editor, entry: NodeEntry<LiElement>) => void

  deleteLiAndMergePrevChildren: (
    editor: Editor,
    unit: 'character' | 'word' | 'line' | 'block',
    liPath: number[],
    prevLiPath: number[]
  ) => void
}

export const createListOperator = ({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onInsertLc = () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onMoveLc = () => {},
}: {
  onInsertLc?: (lc: LcElement) => void
  onMoveLc?: (lc: LcElement) => void
}): ListOperator => {
  return {
    onInsertLc,
    onMoveLc,

    _newLc() {
      const lc: LcElement = {
        type: 'lc',
        id: nanoid(),
        children: [{ text: '' }],
      }
      this.onInsertLc(lc)
      return lc
    },

    insertNextUl(editor: Editor, entry: NodeEntry<LiElement>, root?: true) {
      const insertPath = Path.next(Path.parent(entry[1]))
      Transforms.insertNodes<UlElement>(
        editor,
        {
          type: 'ul',
          children: [{ type: 'li', children: [this._newLc()] }],
        },
        { at: insertPath }
      )
      Transforms.select(editor, [...insertPath, 0, 0]) // 移動cursor至新的位置
    },

    removePrevUl(editor: Editor, path: Path) {
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
    },

    insertNextLi(editor: Editor, entry: NodeEntry<LiElement>): void {
      // console.log('insertNextLi')
      const [, path] = entry
      Transforms.insertNodes<LiElement>(
        editor,
        { type: 'li', children: [this._newLc()] },
        { at: Path.next(path) }
      )
      Transforms.move(editor)
    },

    insertPrevLi(editor: Editor, entry: NodeEntry<LiElement>) {
      const [, path] = entry
      Transforms.insertNodes<LiElement>(
        editor,
        { type: 'li', children: [this._newLc()] },
        { at: path }
      )
      // Transforms.move(editor)
    },

    insertNextIndentLi(editor: Editor, entry: NodeEntry<LiElement>) {
      const [node, path] = entry
      if (node.children[1] === undefined) {
        // 沒有子ul，創一個
        Transforms.insertNodes<UlElement>(
          editor,
          {
            type: 'ul',
            children: [
              {
                type: 'li',
                children: [this._newLc()],
              },
            ],
          },
          { at: [...ListHelper.ulPath(path)] }
        )
      } else {
        // 有子ul，插入至第1個
        Transforms.insertNodes<LiElement>(
          editor,
          { type: 'li', children: [this._newLc()] },
          { at: [...ListHelper.ulPath(path), 0] }
        )
      }
      Transforms.move(editor)
    },

    splitLi(editor: Editor, entry: NodeEntry<LiElement>) {
      const [, liPath] = entry
      Transforms.splitNodes(editor, {
        always: true,
        match: (n) => ListHelper.isLi(n),
        // at: Path.parent(li[1]),  // at 會用 editor.selection
      })

      // 原生 split 會複製原本的 lc value，需重新設定
      const lc = this._newLc()
      Transforms.setNodes<LcElement>(
        editor,
        {
          id: lc.id,
          data: undefined,
        },
        { at: ListHelper.lcPath(Path.next(liPath)) }
      )
      this.onInsertLc(lc)
    },

    indent(editor: Editor, liEntry: NodeEntry<LiElement>): void {
      const [li, path] = liEntry

      const prev = Editor.previous<LiElement>(editor, { at: path })
      if (prev === undefined) {
        return // 第一個 li 無法 indent
      }

      const [prevNode, prevPath] = prev
      const prevUl = prevNode.children[1]
      if (prevUl) {
        // prev 有 ul，將li移至prev-ul中的最後一個
        Transforms.moveNodes(editor, {
          at: path,
          to: [...ListHelper.ulPath(prevPath), prevUl.children.length],
        })
      } else {
        // prev 沒有 ul，創一個，然後搬運
        Editor.withoutNormalizing(editor, () => {
          Transforms.insertNodes<UlElement>(
            editor,
            { type: 'ul', children: [] },
            { at: ListHelper.ulPath(prevPath) }
          )
          Transforms.moveNodes(editor, {
            at: path,
            to: [...ListHelper.ulPath(prevPath), 0],
          })
        })
      }
      this.onMoveLc(li.children[0])
    },

    unindent(editor: Editor, liEntry: NodeEntry<LiElement>): void {
      const [li, liPath] = liEntry
      let grandLiPath: Path
      try {
        grandLiPath = Path.parent(Path.parent(liPath))
      } catch (err) {
        return // grand-li 不存在，無法 unindent
      }

      Editor.withoutNormalizing(editor, () => {
        Transforms.moveNodes(editor, {
          at: liPath,
          to: Path.next(grandLiPath),
        })
        // 若原 ul 已經沒有 children，刪除該 parent
        const [ul, ulPath] = Editor.parent(editor, liPath)
        if (ListHelper.isUl(ul) && Editor.isEmpty(editor, ul)) {
          Transforms.removeNodes(editor, { at: ulPath })
        }
      })
      this.onMoveLc(li.children[0])
    },

    deleteLiAndMergePrevChildren(
      editor: Editor,
      unit: 'character' | 'word' | 'line' | 'block',
      liPath: number[],
      prevLiPath: number[]
    ): void {
      // 此行有子層: 與前行合併，並將此行子層移至前行子層
      // TODO: 子層算是 move
      Editor.withoutNormalizing(editor, () => {
        // 先用原生 delete，但原生 delete 會造成錯誤結構，所以 move nodes 看起來會和原本結構不同 （這是魔法）
        Transforms.delete(editor, { unit, reverse: true })
        Transforms.moveNodes(editor, {
          at: ListHelper.lcPath(liPath),
          to: ListHelper.ulPath(prevLiPath),
        })
        Transforms.removeNodes(editor, { at: liPath })
      })
    },
  }
}

export const onKeyDownWithList = (
  event: React.KeyboardEvent,
  editor: Editor,
  listOperator: ListOperator
): void => {
  const { selection } = editor

  // Single bullet indent
  if (selection && Range.isCollapsed(selection)) {
    if (!['Tab', 'Enter'].includes(event.key)) {
      return // only ['tab', 'enter'] keys are taken into account
    }

    const li = Editor.above<LiElement>(editor, {
      match: (n) => ListHelper.isLi(n),
    })
    if (li) {
      // const [, path] = li
      let action: 'indent' | 'unindent' | 'edit-body' | undefined

      if (event.shiftKey && event.key === 'Tab') {
        action = 'unindent'
      } else if (event.key === 'Tab') {
        action = 'indent'
      }
      // else if (event.key === 'Enter' && Node.string(node).length === 0) {
      //   op = 'unindent'
      // }

      switch (action) {
        case 'unindent':
          event.preventDefault()
          listOperator.unindent(editor, li)
          return
        case 'indent':
          event.preventDefault()
          listOperator.indent(editor, li)
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

    return
  }

  // Multi-bullet indent/unindent
  if (selection && !Range.isCollapsed(selection)) {
    if (!['Tab', 'Enter'].includes(event.key)) {
      return // only ['tab', 'enter'] keys are taken into account
    }

    const { anchor, focus } = selection
    const compare = Path.compare(anchor.path, focus.path)
    if (compare === 0) {
      return // anchor and focus in the same bullet
    }
    const [start, end] = compare < 0 ? [anchor, focus] : [focus, anchor]
    const startLi = Editor.above<LiElement>(editor, {
      match: (n) => ListHelper.isLi(n),
      at: start,
    })
    const endLi = Editor.above<LiElement>(editor, {
      match: (n) => ListHelper.isLi(n),
      at: end,
    })
    if (startLi && endLi) {
      if (
        !Path.isSibling(startLi[1], endLi[1]) &&
        // !Path.isDescendant(endLi[1], startLi[1])
        endLi[1].length < startLi[1].length
      ) {
        // console.log(startLi[1], endLi[1])
        console.warn(
          'Multi indent not support start-li & end-li in different branch'
        )
        return
      }
      if (Path.isDescendant(endLi[1], startLi[1])) {
        console.warn('Use normal indent indetead')
        return
      }

      event.preventDefault()
      const common = Path.common(startLi[1], endLi[1])
      const nIndents = endLi[1][common.length] - startLi[1][common.length] + 1
      for (let i = 0; i < nIndents; i++) {
        listOperator.indent(editor, startLi)
      }
    }

    // console.log(anchor.path, focus.path, Path.common(anchor.path, focus.path))
    // const common = Path.common(anchor.path, focus.path)

    // const nodes = Editor.nodes<LiElement>(editor, {
    //   match: (n) => ListHelper.isLi(n),
    //   mode: 'lowest',
    //   at: [...common, start.path[common.length]],
    // })

    // console.log([...common, start.path[common.length]], [...nodes])

    // console.log(
    //   [...common, anchor.path[common.length]],
    //   [...common, focus.path[common.length]]
    // )

    // const common = Path.common(anchor.path, focus.path)
    // console.log(
    //   anchor.path.splice(0, common.length + 1),
    //   focus.path.splice(0, common.length + 1)
    // )

    // event.preventDefault()
    // const span: [Path, Path] = [
    //   [...common, anchor.path[common.length]],
    //   [...common, focus.path[common.length]],
    // ]

    // const nodes = Editor.nodes(editor, {
    //   match: (n, p) => {
    //     return (
    //       ListHelper.isLi(n) &&
    //       (Path.isCommon(p, span[0]) || Path.isCommon(p, span[1]))
    //     )
    //   },
    //   mode: 'lowest',
    //   at: span,
    //   // at: [
    //   //   [...common, anchor.path[common.length]],
    //   //   [...common, focus.path[common.length]],
    //   // ],
    // })
    // console.log([...nodes])
    // console.log(anchor, focus)

    return
  }
}

export const withList = (
  editor: Editor,
  listOperator: ListOperator
): Editor => {
  const { deleteBackward, insertBreak, insertData, normalizeNode } = editor

  /**
   * - (freeze，不動作)
   * - OOOOOO
   * - IXXXXXX cursor在行首
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

    if (selection && Range.isCollapsed(selection)) {
      const liEntry = Editor.above<LiElement>(editor, {
        match: (n) => ListHelper.isLi(n),
      })

      if (liEntry) {
        const [li, liPath] = liEntry
        const [lc, ul] = li.children
        // const input = Editor.string(editor, path)
        const point = Editor.point(editor, selection)

        // 此行 freeze -> 不允許 deleteBackward
        // if (lc.freeze) { return }

        if (Editor.isStart(editor, point, ListHelper.lcPath(liPath))) {
          // 只考慮 cursor 在 lc 句首的情況

          // if (lc.root) {
          //   // li root，刪除ul & li
          //   removePrevRootLi(editor, path)
          //   return
          // }

          const prevLiEntry = Editor.previous<LiElement>(editor, { at: liPath })
          if (prevLiEntry) {
            // 有 prev-li
            // -----------
            // - OOOOOO PREV LI
            //   - ???
            // - IXXXXXX THIS LI
            //   - ???
            // -----------

            const [prevLi, prevLiPath] = prevLiEntry

            if (prevLi.children[1]) {
              // prev li 有子層
              if (Node.string(lc).length === 0 && ul === undefined) {
                // li 沒有子層、沒有內文: 刪除此行，cursor 移至前行 => 原生 deleteBackward
                // ------------------------
                // - OOOOOO PREV LI
                //   - OOOOOO
                // - I (THIS LI)
                // - OOOOOO
                deleteBackward(...args)
                return
              } else {
                // 此行有子層、或有內文: 不允許 deleteBackward
                // ------------------------
                // - OOOOOO PREV LI
                //   - OOOOOO
                // - IXXXXXX THIS LI
                //   - OOOOOO
                return
              }
            }

            if (ul) {
              // prev-li 沒有子層，li 有子層: 與 prev-li 合併，並將此行子層移至前行子層
              // 注意：這會造成 li 的子層移動至 prev-li (move-change)
              //
              // ------------------------
              // - OOOOOO PREV LI
              // - IXXXXXX THIS LI
              //   - OOOOOO THIS LI UL
              //
              // ------ becomes ------
              // - OOOOOO PREV LI IXXXXXX THIS LI
              //   - OOOOOO THIS LI UL
              //
              // ------------------------
              listOperator.deleteLiAndMergePrevChildren(
                editor,
                unit,
                liPath,
                prevLiPath
              )
              return
            } else {
              // 此行沒子層: 與前行合併 => 原生 deleteBackward
              // -----------
              // - OOOOOO
              // - IXXXXXX THIS LI
              //   - OOOOOO
              // -----------
              deleteBackward(...args)
              return
            }
          } else {
            // li 沒有 prev-li，ie 此行是該階層的首個

            if (ul) {
              // 此行有子層 -> 不允許 deleteBackward
              // -----------
              // - OOOOOO
              //   - IXXXXXX THIS LI
              //     - OOOOOO
              // -----------
              return
            } else {
              // 此行沒有子層 -> 原生 deleteBackward
              // -----------
              // - OOOOOO
              //   - IXXXXXX THIS LI
              //   - OOOOOO
              // -----------
              deleteBackward(...args)
              return
            }
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
      const liEntry = Editor.above<LiElement>(editor, {
        match: (n) => ListHelper.isLi(n),
      })
      if (liEntry) {
        const [node, path] = liEntry
        // const lc = node.children[0]
        const point = Editor.point(editor, selection)

        // li freeze
        // if (lc.freeze) {
        //   if (Editor.isEnd(editor, point, lcPath(path))) {
        //     // cursor在行尾，插入indent後行
        //     insertNextIndentLi(editor, li) // 後行是indent，插入indent後行
        //   }
        //   // 指標在句首、句中，不動作
        //   return
        // }

        if (
          Node.string(node).length === 0 &&
          Editor.next(editor, { at: path }) === undefined &&
          path.length > 1
        ) {
          // 此行為空 & 此行是最後一行 & 此行不是第一階層 -> unindent
          listOperator.unindent(editor, liEntry)
          return
        }

        if (Editor.isEnd(editor, point, ListHelper.lcPath(path))) {
          // cursor 在行尾
          if (node.children[1]) {
            // 後行是 indent -> 插入 indent 後行
            listOperator.insertNextIndentLi(editor, liEntry)
          } else {
            // 後行不是 indent -> 插入同階層後行
            listOperator.insertNextLi(editor, liEntry)
          }
          return
        }

        if (Editor.isStart(editor, point, ListHelper.lcPath(path))) {
          // cursor 在行首，插入前行
          listOperator.insertPrevLi(editor, liEntry)
          return
        }

        // cursor 在行中 -> 拆分本行並插入後行，若此行有 indent，會併入後行
        listOperator.splitLi(editor, liEntry)
        return
      }
    }
    insertBreak()
  }

  /**
   * @see https://github.com/ianstormtaylor/slate/blob/c1433f56cfe13feb826264989bb4f68a0eefab62/packages/slate-react/src/plugin/with-react.ts
   */

  editor.insertData = (data) => {
    const text = data.getData('text/plain')
    if (text) {
      // 貼上外部文字時需要先斷行
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

  // editor.insertText = (...args) => {
  //   const { selection } = editor
  //   if (selection) {
  //     const lc = Editor.above<LcElement>(editor, {
  //       match: (n) => isLc(n),
  //     })
  //     if (lc && lc[0].freeze) {
  //       // lc freeze，不動作
  //       return
  //     }
  //   }
  //   insertText(...args)
  // }

  /**
   * Hint:
   * - 每個操作都會被叫
   * - 只有操作的node及他的parent會進來，其他node並不會被送進來
   * - 盡量不要在這裡修改node，只作為檢查用，因為直接修改容易造成不可遇見的問題
   */

  editor.normalizeNode = ([node, path]) => {
    if (ListHelper.isUl(node)) {
      // 檢查 ul children 只能是 li, trick: 在沒有children的情況下，slate會自動增加一個text node
      for (const e of node.children) {
        assert(ListHelper.isLi(e))
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

    if (ListHelper.isLi(node)) {
      // console.log(editor.children)
      // console.log(node)

      // 檢查li只能有lc, ul?
      assert(node.children.length <= 2)
      const [lc, ul] = node.children
      assert(ListHelper.isLc(lc))
      if (ul) {
        assert(ListHelper.isUl(ul))
      }
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

// class BaseListHelper {}

// interface Constructor<T> extends Function {
//   new (...args: any[]): T
// }

// const createWithList = <T extends BaseListHelper>(ctor?: Constructor<T>) => {
//   return () => {
//     const a = ctor ? new ctor() : new BaseListHelper()
//   }
// }

// const withList = createWithList(BaseList)
