import { cloneDeep } from 'lodash'
import { TreeNode, TreeNodeBody } from './interfaces'

export function isTreeNode<T>(
  node: TreeNode<T> | TreeNodeBody<T>,
): node is TreeNode<T> {
  return (node as TreeNode<T>).children !== undefined
}

class TreeUtil {
  // filter<T>(children: TreeNode<T>[], match: MatchFn<T>): TreeNodeBody<T>[] {
  //   const found: TreeNodeBody<T>[] = []
  //   for (const e of this.toList(children)) {
  //     if (match(e)) {
  //       found.push(e)
  //     }
  //   }
  //   return found
  // }

  private getRoot<T>(nodes: TreeNodeBody<T>[]): TreeNodeBody<T> {
    const foundRoots = nodes.filter(e => e.parentUid === null)

    if (foundRoots.length === 0)
      throw new Error('[getRootUid] Root-node not found')
    if (foundRoots.length > 1) {
      console.debug(foundRoots)
      throw new Error('[getRootUid] Found multiple root-nodes')
    }

    return foundRoots[0]
  }

  private getParentChildrenDict_AllNodeUids<T>(
    parent_children: Record<string, TreeNodeBody<T>[]>,
  ): string[] {
    const uids = new Set<string>()
    Object.entries(parent_children).forEach(([k, v]) => {
      uids.add(k)
      v.forEach(e => uids.add(e.uid))
    })
    return Array.from(uids)
  }

  /**
   * In-place sort children's index in the array according to its order
   */
  private sortParentChildrenDict_<T>(
    parent_children: Record<string, TreeNodeBody<T>[]>,
  ): void {
    Object.entries(parent_children).forEach(([k, v]) => {
      parent_children[k] = v.sort((a, b) => {
        if (a.order === undefined || b.order === undefined)
          throw new Error(
            '[sortParentChildrenDict_] a.index === undefined || b.index === undefined',
          )
        return a.order - b.order
      })
    })
  }

  /**
   * @returns root-tree-node
   */
  buildFromList<T>(nodes: TreeNodeBody<T>[]): TreeNode<T> {
    const parent_children: Record<string, TreeNodeBody<T>[]> =
        Object.fromEntries(
          nodes.map((e): [string, TreeNodeBody<T>[]] => [e.uid, []]),
        ),
      root = this.getRoot(nodes)

    for (const e of nodes) {
      const { parentUid } = e

      if (parentUid === null) {
        // Do nothing
      } else if (parent_children[parentUid]) {
        parent_children[parentUid].push(e)
      } else {
        parent_children[parentUid] = [e]
      }
    }
    return this.buildFromParentChildrenDict(parent_children, root)
  }

  /**
   * Use the given parent-children dict to construct a tree.
   * p.s. Node's index is followed by the given array, not by the node's index
   *
   * @returns root-tree-node
   *
   * @throws
   * - has orphans
   * - has cycle in tree
   */
  buildFromParentChildrenDict<T>(
    parent_children: Record<string, TreeNodeBody<T>[]>,
    rootNode: TreeNodeBody<T>,
  ): TreeNode<T> {
    if (!(rootNode.uid in parent_children))
      throw new Error(
        '[buildFromParentChildrenDict] no tempRootUid in parent-children-dict',
      )

    const { uid, data } = rootNode,
      root: TreeNode<T> = {
        uid,
        order: 0,
        parentUid: null,
        data,
        children: [],
        childrenUids: [],
      },
      traversedUids: string[] = [],
      parents: TreeNode<T>[] = [root],
      allUids = this.getParentChildrenDict_AllNodeUids(parent_children)

    this.sortParentChildrenDict_(parent_children)

    while (parents.length > 0) {
      const p = parents.shift()

      if (p === undefined)
        throw new Error('[buildFromParentChildrenDict] p === undefined')
      if (!(p.uid in parent_children)) {
        console.error(parent_children, p)
        throw new Error(
          '[buildFromParentChildrenDict] !(p.uid in parent_children)',
        )
      }

      traversedUids.push(p.uid)
      p.children = parent_children[p.uid].map<TreeNode<T>>(e => ({
        ...e,
        children: [],
      }))
      p.children.forEach(e => {
        if (traversedUids.includes(e.uid))
          throw new Error('[buildFromParentChildrenDict] Has cylce')
        parents.push(e)
      })
    }

    if (allUids.length !== traversedUids.length) {
      throw new Error('[buildFromParentChildrenDict] Has orphan(s)')
    }

    return root
  }

  // insert<T>(
  //   value: TreeNode<T>[],
  //   item: TreeNodeBody<T>,
  //   toParentCid: string,
  //   toIndex: number,
  // ): TreeNode<T>[] {
  //   const dict = this.toParentChildrenDict(value)
  //   const arr = dict[toParentCid]
  //   item.parentCid = toParentCid
  //   dict[item.cid] = []
  //   if (toIndex < 0) {
  //     arr.push(item)
  //   } else {
  //     arr.splice(toIndex, 0, item)
  //   }
  //   return this.fromParentChildrenDict(dict)
  // }

  /**
   * In-place initialize every node's index & parentCid base on its current position
   */
  // initPosition<T>(children: TreeNode<T>[]): TreeNode<T>[] {
  //   // root.parentCid = this.tempRootCid
  //   // root.index = 0
  //   const tempRoot: TreeNode<T> = {
  //     cid: this.tempRootCid,
  //     children: children.map((e, i) => ({
  //       ...e,
  //       parentCid: this.tempRootCid,
  //       index: i,
  //     })),
  //   }
  //   const stack: TreeNode<T>[] = [tempRoot]
  //   while (stack.length > 0) {
  //     const p = stack.shift()
  //     if (p === undefined) {
  //       throw '[docdiff] p === undefined, unexpected error'
  //     }
  //     p.children.forEach((c, i) => {
  //       c.parentCid = p.cid
  //       c.index = i
  //       stack.push(c)
  //     })
  //   }
  //   return tempRoot.children
  // }

  isRoot<T>(node: TreeNode<T>): boolean {
    return node.parentUid === null
  }

  /**
   * BFS search
   */
  searchBreadthFirst<T>(
    root: TreeNode<T>,
    findUid: string,
  ): TreeNode<T> | null {
    const parents: TreeNode<T>[] = [root]
    while (parents.length > 0) {
      const p = parents.shift()
      if (p === undefined)
        throw new Error(
          '[searchBreadthFirst] p === undefined, unexpected error',
        )
      if (p.uid === findUid) {
        return p
      }
      p.children.forEach(e => {
        parents.push(e)
      })
    }
    return null
  }

  /**
   * Turn node-bodies into a dict `{ [uid]: node-body }`
   */
  toDict<T>(nodes: TreeNodeBody<T>[]): Record<string, TreeNodeBody<T>> {
    return Object.fromEntries(nodes.map(e => [e.uid, e]))
  }

  /**
   *
   */
  toPreOrderList<T>(root: TreeNode<T>): Required<TreeNodeBody<T>>[] {
    const traversed: Required<TreeNodeBody<T>>[] = [],
      parents = [root]

    while (parents.length > 0) {
      const p = parents.shift()
      if (p === undefined)
        throw new Error('[toPreOrderList] p === undefined, unexpected error')

      const { children, ...rest } = p
      children.forEach((v, i) => {
        parents.push({ ...v, parentUid: p.uid, order: i })
      })
      traversed.push({
        ...rest,
        childrenUids: children.map(e => e.uid),
      })
    }
    return traversed
  }

  /**
   * Reconstruct the list to get children-uids
   */
  toTreeNodeBodyList<
    T extends {
      uid: string
      parentUid: string | null
      // childrenUids: string[]
      order: number
    },
  >(items: T[]): Required<TreeNodeBody<T>>[] {
    const nodes: TreeNodeBody<T>[] = items.map(e => {
        const { uid, parentUid, order } = e
        return { uid, parentUid, order, data: e }
      }),
      root = this.buildFromList(nodes),
      nodes_ = this.toList(root)

    if (nodes_.length !== items.length)
      throw new Error('[toTreeNodeBodyList] list.length !== items.length')

    this.validateList(nodes_)
    return nodes_

    // const nodes: Required<TreeNodeBody<T>>[] = items.map(e => {
    //   const { uid, parentUid, childrenUids, order } = e
    //   return { uid, parentUid, childrenUids, order, data: e }
    // })
    // this.validateList(nodes)
    // return nodes
  }

  /**
   * Alias of toPreOrderList()
   */
  toList<T>(root: TreeNode<T>): Required<TreeNodeBody<T>>[] {
    return this.toPreOrderList(root)
  }

  // toParentChildrenDict<T>(
  //   children: TreeNode<T>[],
  // ): Record<string, TreeNodeBody<T>[]> {
  //   const nodeDict = this.toDict(children)
  //   const dict: Record<string, TreeNodeBody<T>[]> = Object.fromEntries(
  //     Object.entries(nodeDict).map(([k]): [string, TreeNodeBody<T>[]] => [
  //       k,
  //       [],
  //     ]),
  //   )
  //   dict[this.tempRootCid] = []
  //   Object.entries(nodeDict).forEach(([, node]) => {
  //     const { parentCid } = node
  //     if (parentCid === undefined) {
  //       throw `[docdiff] parentCid === undefined`
  //     }
  //     if (dict[parentCid]) {
  //       dict[parentCid].push(node)
  //     } else {
  //       dict[parentCid] = [node]
  //     }
  //   })
  //   this.sortParentChildrenDict_(dict)
  //   return dict
  // }

  /**
   * Should
   * - Have only one root
   * - Children-uids match its children
   * - No orphans
   */
  validateList<T>(list: Required<TreeNodeBody<T>>[]): void {
    const cloned = cloneDeep(list),
      root = this.buildFromList(cloned)

    for (const e of list) {
      const found = this.searchBreadthFirst(root, e.uid)

      if (found === null) {
        throw new Error('[validateList] Has orphan node')
      }

      const treeNodeUids = found.children.map(e => e.uid),
        uidsStr = treeNodeUids.join('_'),
        itemUidsStr = e.childrenUids.join('_')

      if (uidsStr !== itemUidsStr) {
        const uids = found.children.map(e => e.uid)
        console.debug(e, uids, e.childrenUids)
        throw new Error('[validateList] Children-uids not matched')
      }
    }
  }
}

export const treeUtil = new TreeUtil()
