import assert from 'assert'
import { Editor, Transforms, Range, createEditor, Descendant, Element, Node, Path, Text, NodeEntry, Point } from 'slate'
import { parse } from '../../lib/models/symbol'
import { LiElement, UlElement } from './slate-custom-types'
import { insertNextLi, isLi, lcPath } from './with-list'

function setSymbol(editor: Editor, entry: NodeEntry<LiElement>): void {
  const [node, path] = entry
  if (!node.children[0].root) {
    throw new Error('只有<Li root>才能parse symbol')
  }
  const input = Node.string(node).trim()
  if (input.length === 0) {
    // console.warn('<li root>沒input，不能parse')
    insertNextLi(editor, entry) // 新增下一行
    return
  }

  try {
    const parsed = parse(input)

    // 刪除原本的li，並創一個新的（因為li可能存有之前的tree）
    Editor.withoutNormalizing(editor, () => {
      insertNextLi(editor, entry) // 先新增下一行，指標才會先移動到下一行
      Transforms.removeNodes(editor, { at: path })
      Transforms.insertNodes<UlElement>(
        editor,
        {
          type: 'li',
          children: [
            {
              type: 'lc',
              root: true,
              symbol: parsed.symbolName,
              // cardType: parsed.cardType,
              children: [{ text: input }],
            },
          ],
        },
        { at: path },
      )
    })
  } catch (err) {
    // Parse失敗，set warning後返回
    Transforms.setNodes(editor, { error: 'symbol格式無法辨識', placeholder: 'placeholder' }, { at: lcPath(path) })
  }
}

/**
 * 在有mirror的情況，root為多個li（vs 一般為一個li），且可以新增/刪除li（等同新增/刪除mirror）
 * 第一個li是self，無法刪除，除第一個以外要有一個新增用的li，無法刪除
 */
export function withMirror(editor: Editor): Editor {
  const { insertBreak } = editor

  editor.insertBreak = () => {
    const { selection } = editor

    if (selection) {
      const li = Editor.above<LiElement>(editor, { match: n => isLi(n) })

      if (li) {
        const [node, path] = li
        const point = Editor.point(editor, selection)

        if (node.children[0].root) {
          // 指標在句尾
          if (Editor.isEnd(editor, point, path)) {
            setSymbol(editor, li)
            // insertNextLi(editor, li)
            return
          }
          if (!Editor.isStart(editor, point, path)) {
            // 指標在句中，不動作
            return
          }
        }
      }
    }

    insertBreak()
  }

  return editor
}
