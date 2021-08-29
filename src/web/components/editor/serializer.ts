import { Node } from 'slate'
import { BulletNode } from '../../lib/bullet/node'
import { BulletDraft, isRootBulletDraft, RootBullet, RootBulletDraft } from '../../lib/bullet/types'
import { LcElement, LiElement, UlElement } from './slate-custom-types'

interface SerializerInterface {
  _toBulletDraft: (li: LiElement) => BulletDraft
  _toLi: (draft: BulletDraft | RootBulletDraft) => LiElement
  toRootBulletDraft: (li: LiElement) => RootBulletDraft
  toRootLi: (root: RootBulletDraft, options?: { newSymbol?: true }) => LiElement
}

export const Serializer: SerializerInterface = {
  _toBulletDraft: (li: LiElement): BulletDraft => {
    const [lc, ul] = li.children
    return {
      ...lc,
      head: Node.string(lc),
      children: ul?.children.map(e => Serializer._toBulletDraft(e)) ?? [],
    }
  },

  _toLi(draft: BulletDraft | RootBulletDraft): LiElement {
    const lc: LcElement = {
      ...draft,
      type: 'lc',
      children: [{ text: draft.head }],
      // rootBullet: isRootBulletDraft(draft) ? draft : undefined,
    }
    const ul: UlElement | undefined =
      draft.children.length > 0
        ? {
            type: 'ul',
            children: draft.children.map(e => Serializer._toLi(e)),
          }
        : undefined
    return { type: 'li', children: ul ? [lc, ul] : [lc] }
  },

  /**
   * @throws 輸入資料格式錯誤
   */
  toRootBulletDraft(li: LiElement): RootBulletDraft {
    const [lc, ul] = li.children
    if (lc.rootBulletDraft === undefined) {
      throw 'lc 沒有 rootBulletDraft'
    }
    if (ul?.children === undefined) {
      throw 'ul 沒有 children'
    }
    return {
      ...lc.rootBulletDraft,
      children: ul.children.map(e => Serializer._toBulletDraft(e)),
    }
  },

  toRootLi(root: RootBulletDraft, options?: { newSymbol?: true }): LiElement {
    const li = Serializer._toLi(root)
    const [lc, ...rest] = li.children
    return {
      ...li,
      children: [
        {
          ...lc,
          root: true,
          symbol: root.symbol,
          rootBulletDraft: root,
          mirror: root.mirror,
          newSymbol: options?.newSymbol,
          // boardId: root.boardId,
          // pollId: root.pollId,
        },
        ...rest,
      ],
    }
  },
}

// /**
//  * @deprecated
//  *
//  * Traver a slate element node and convert to bullet input nodes and return
//  * Bullet input與li是1對1的關係，bullet tree與ul是1對1的關係，1個card body對應至1個ul，self及nested cards表示多個ul
//  * 因為輸入是ul，會返回ul裡的children
//  */
// function serialize(node: UlElement): BulletDraft[] {
//   return node.children.map(e => Serializer.toBulletDraft(e))
// }

// /**
//  * @deprecated
//  *
//  * Traver a bullet node and convert to slate element node and return
//  *
//  * @param options.includeRoot - 若`true`返回ul包著root，若`false`返回ul包著root children
//  */
// function deserialize(root: BulletDraft, options?: { includeRoot?: true }): UlElement {
//   const li = Serializer.toLi(root)
//   return {
//     type: 'ul',
//     children: options?.includeRoot ? [li] : li.children[1]?.children ?? [],
//   }
// }
