import { TreeNode, treeUtil } from '@conote/docdiff'
import { Node } from 'slate'
import type { Block } from '../../editor-textarea/src/interfaces'
import type { ElementLic, ElementLi, ElementUl } from './interfaces'

/**
 * Convert li to blocks and vice versa.
 */
// class LiSerializer {
//   /**
//    * Recursively iterate and transform all nodes
//    *
//    * TODO: avoid using recusive method!
//    */
//   _toLi(node: TreeNode<Bullet>): LiElement {
//     const { data } = node
//     if (data === undefined) {
//       throw 'Every tree-node needs to contain data'
//     }
//     const lc: LcElement = {
//       type: 'lc',
//       children: [{ text: data.head }],
//       cid: node.cid,
//       bulletCopy: data,
//     }
//     const ul: UlElement | undefined =
//       node.children.length > 0
//         ? {
//             type: 'ul',
//             children: node.children.map(e => this._toLi(e)),
//           }
//         : undefined
//     return { type: 'li', children: ul ? [lc, ul] : [lc] }
//   }

//   /**
//    * Recursively iterate and transform all nodes
//    *
//    * TODO: avoid recusive!
//    */
//   _toTreeNode(li: LiElement): TreeNode<Bullet> {
//     const [lc, ul] = li.children
//     if (lc.bulletCopy) {
//       if (lc.bulletCopy.cid) {
//         throw 'bullet-copy should not have cid'
//       }
//       const node: TreeNode<Bullet> = {
//         cid: lc.cid,
//         data: {
//           id: lc.bulletCopy.id,
//           head: Node.string(lc),
//         },
//         change: lc.change,
//         children: ul?.children.map(e => this._toTreeNode(e)) ?? [], // recursive
//       }
//       return node
//     }
//     const cid = nanoid()
//     const bullet: Bullet = {
//       id: cid, // bullet require an id, use cid for temporary fill
//       cid,
//       head: Node.string(lc),
//     }
//     const node: TreeNode<Bullet> = {
//       cid,
//       data: bullet,
//       change: lc.change,
//       children: ul?.children.map(e => this._toTreeNode(e)) ?? [], // recursive
//     }
//     return node
//   }

//   toLiList(children: Block[]): LiElement[] {
//     return children.map(e => this._toLi(e))
//   }

//   // toTreeNodes(lis: LiElement[]): TreeNode<Bullet>[] {
//   //   return lis.map(e => this._toTreeNode(e))
//   // }
// }

// export const liSerializer = new LiSerializer()

/**
 * Recursively iterate and transform all nodes
 *
 * TODO:
 * - [] Avoid recusive !
 */
function blockToLi(node: TreeNode<Block>): ElementLi {
  const { data } = node,
    { uid } = data
  const lc: ElementLic = {
    type: 'lic',
    children: [
      {
        text: data.str,
        //     blockUid: string,
        // draftId: string,
        // inlineItem: InlineItem,
      },
    ],
    uid: node.uid,
    // bulletCopy: data,
    blockCopy: data,
  }
  const ul: ElementUl | undefined =
    node.children.length > 0
      ? {
          type: 'ul',
          children: node.children.map(e => blockToLi(e)),
        }
      : undefined

  return { type: 'li', children: ul ? [lc, ul] : [lc] }
}

/**
 * Recursively iterate and transform all nodes
 *
 * TODO: avoid recusive!
 */
function liToTreeNodeBlock(
  li: ElementLi,
  parentUid: string,
  order: number,
): TreeNode<Omit<Block, 'childrenUids'>> {
  const [lc, ul] = li.children

  if (lc.blockCopy && lc.blockCopy.uid !== lc.uid)
    throw new Error('lc.blockCopy && lc.blockCopy.uid !== lc.uid')

  const { uid, change } = lc,
    str = Node.string(lc),
    block: Omit<Block, 'childrenUids'> = {
      uid,
      parentUid,
      order,
      str,
    },
    node: TreeNode<Omit<Block, 'childrenUids'>> = {
      uid: block.uid,
      parentUid: block.parentUid,
      order: block.order,
      data: block,
      children: ul?.children.map((e, i) => liToTreeNodeBlock(e, uid, i)) ?? [], // recursive
    }

  return node
}

export function blocksToLiList(blocks: Block[]): ElementLi[] {
  const list = treeUtil.toTreeNodeBodyList(blocks)
  const root = treeUtil.buildFromList(list),
    liList = root.children.map(blockToLi)
  return liList
}

/**
 * Convert the slate input value (ie, li list) to blocks
 *
 */
export function elementLisToBlocks(lis: ElementLi[], rootUid: string): Block[] {
  const nodes = lis.map((e, i) => liToTreeNodeBlock(e, rootUid, i)),
    nodes_flattens = nodes.map(e => treeUtil.toList(e)),
    blocks = nodes_flattens
      .reduce((acc, cur) => [...acc, ...cur], [])
      .map(e => e.data)

  // Add dummy children-uids
  const blocks_: Block[] = blocks.map(e => ({ ...e, childrenUids: [] }))

  return blocks_
}
