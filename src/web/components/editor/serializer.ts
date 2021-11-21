import { nanoid } from 'nanoid'
import { Node } from 'slate'
import { TreeNode } from '../../../packages/docdiff/src'
import { Bullet } from '../bullet/types'
import { LcElement, LiElement, UlElement } from './slate-custom-types'

export const EditorSerializer = {
  /**
   * Recursively iterate and transform all nodes
   *
   * TODO: avoid using recusive method!
   */
  _toLi(node: TreeNode<Bullet>): LiElement {
    const { data } = node
    if (data === undefined) {
      throw 'Every tree-node needs to contain data'
    }
    const lc: LcElement = {
      type: 'lc',
      children: [{ text: data.head }],
      cid: node.cid,
      bulletCopy: data,
    }
    const ul: UlElement | undefined =
      node.children.length > 0
        ? {
            type: 'ul',
            children: node.children.map(e => this._toLi(e)),
          }
        : undefined
    return { type: 'li', children: ul ? [lc, ul] : [lc] }
  },

  /**
   * Recursively iterate and transform all nodes
   *
   * TODO: avoid recusive!
   */
  _toTreeNode(li: LiElement): TreeNode<Bullet> {
    const [lc, ul] = li.children
    if (lc.bulletCopy) {
      if (lc.bulletCopy.cid) {
        throw 'bullet-copy should not have cid'
      }
      const node: TreeNode<Bullet> = {
        cid: lc.cid,
        data: {
          id: lc.bulletCopy.id,
          head: Node.string(lc),
        },
        change: lc.change,
        children: ul?.children.map(e => this._toTreeNode(e)) ?? [], // recursive
      }
      return node
    }
    const cid = nanoid()
    const bullet: Bullet = {
      id: cid, // bullet require an id, use cid for temporary fill
      cid,
      head: Node.string(lc),
    }
    const node: TreeNode<Bullet> = {
      cid,
      data: bullet,
      change: lc.change,
      children: ul?.children.map(e => this._toTreeNode(e)) ?? [], // recursive
    }
    return node
  },

  toLiArray(children: TreeNode<Bullet>[]): LiElement[] {
    return children.map(e => this._toLi(e))
  },

  toTreeNodes(lis: LiElement[]): TreeNode<Bullet>[] {
    return lis.map(e => this._toTreeNode(e))
  },
}
