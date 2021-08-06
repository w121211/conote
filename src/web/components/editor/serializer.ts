import { Node } from 'slate'
import { Node as BulletNode } from '../../lib/bullet/node'
import { BulletDraft, isRootBulletDraft, RootBullet, RootBulletDraft } from '../../lib/bullet/types'
import { LcElement, LiElement, UlElement } from './slate-custom-types'

/**
 * 不允許initiate，例如 const s = new Serializer(...)，只讓外部用class static methods
 */
export class Serializer {
  private static _toBulletDraft(li: LiElement): BulletDraft {
    const [lc, ul] = li.children
    return {
      ...lc,
      head: Node.string(lc),
      children: ul?.children.map(e => Serializer._toBulletDraft(e)) ?? [],
    }
  }

  private static _toLi(draft: BulletDraft | RootBulletDraft): LiElement {
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
  }

  /**
   * @throws 輸入資料格式錯誤
   */
  static toRootBulletDraft(li: LiElement): RootBulletDraft {
    const [lc, ul] = li.children
    if (lc.rootBullet === undefined) {
      throw 'lc沒有rootBullet'
    }
    if (ul?.children === undefined) {
      throw 'ul沒有children'
    }
    return {
      ...BulletNode.toDraft(lc.rootBullet),
      head: Node.string(lc),
      children: ul.children.map(e => Serializer._toBulletDraft(e)),
    }
  }

  static toRootLi(root: RootBullet, options?: { newSymbol?: true }): LiElement {
    const li = Serializer._toLi(BulletNode.toDraft(root))
    const [lc, ...rest] = li.children
    return {
      ...li,
      children: [
        {
          ...lc,
          root: true,
          symbol: root.symbol,
          rootBullet: root,
          mirror: root.mirror,
          newSymbol: options?.newSymbol,
        },
        ...rest,
      ],
    }
  }
}

// interface SerializerInterface {
// _toBulletDraft(node: LiElement): BulletDraft
// toRootBulletDraft(node: LiElement): RootBulletDraft
// _toLi(bullet: BulletDraft): LiElement
// toRootLi(rootBullet: RootBullet, options?: { mirror?: true; newSymbol?: true }): LiElement
// }

// export const Serializer: SerializerInterface = {
//   _toBulletDraft: (li: LiElement): BulletDraft => {
//     const [lc, ul] = li.children
//     return {
//       ...lc,
//       head: Node.string(lc),
//       children: ul?.children.map(e => Serializer._toBulletDraft(e)) ?? [],
//     }
//   },

//   /**
//    * @throws 輸入資料格式錯誤
//    */
//   toRootBulletDraft: (li: LiElement): RootBulletDraft => {
//     const [lc, ul] = li.children
//     if (lc.rootBullet === undefined) {
//       throw 'lc沒有rootBullet'
//     }
//     if (ul?.children === undefined) {
//       throw 'ul沒有children'
//     }
//     return {
//       ...BulletNode.toDraft(lc.rootBullet),
//       head: Node.string(lc),
//       children: ul.children.map(e => Serializer.toBulletDraft(e)),
//     }
//   },

//   _toLi: (draft: BulletDraft | RootBulletDraft): LiElement => {
//     const lc: LcElement = {
//       ...draft,
//       type: 'lc',
//       children: [{ text: draft.head }],
//       // rootBullet: isRootBulletDraft(draft) ? draft : undefined,
//     }
//     const ul: UlElement | undefined =
//       draft.children.length > 0
//         ? {
//             type: 'ul',
//             children: draft.children.map(e => Serializer._toLi(e)),
//           }
//         : undefined
//     return { type: 'li', children: ul ? [lc, ul] : [lc] }
//   },

//   toRootLi: (root: RootBullet, options?: { mirror?: true; newSymbol?: true }): LiElement => {
//     const li = Serializer._toLi(BulletNode.toDraft(root))
//     const [lc, ...rest] = li.children
//     return {
//       ...li,
//       children: [
//         {
//           ...lc,
//           root: true,
//           symbol: root.symbol,
//           rootBullet: root,
//           mirror: options?.mirror,
//           newSymbol: options?.newSymbol,
//         },
//         ...rest,
//       ],
//     }
//   },
// }

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
