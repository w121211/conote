import { ChangeType } from '.'

export type NodeBody<T> = {
  cid: string
  change?: ChangeType // record change-event lively
  data?: T
  index?: number // index of children array
  parentCid?: string
  // prevId: string | null
}

export type TreeNode<T> = NodeBody<T> & {
  children: TreeNode<T>[]
}

export type Match<T> = (node: NodeBody<T>) => boolean

export const TreeService = {
  tempRootCid: 'TEMP_ROOT_CID',

  /** In-place initialize cid */
  // initCid<T extends { id?: string; cid?: string }>(children: TreeNode<T>[]): TreeNode<T>[] {
  // for (const e of this.toList(children)) {
  // e.data
  // }
  // },

  find<T>(children: TreeNode<T>[], match: Match<T>): NodeBody<T>[] {
    const found: NodeBody<T>[] = []
    for (const e of this.toList(children)) {
      if (match(e)) {
        found.push(e)
      }
    }
    return found
  },

  fromList<T>(nodes: NodeBody<T>[]): TreeNode<T>[] {
    const pcDict: Record<string, NodeBody<T>[]> = Object.fromEntries(
      nodes.map((e): [string, NodeBody<T>[]] => [e.cid, []]),
    )
    for (const e of nodes) {
      const { index, parentCid } = e
      if (index === undefined || parentCid === undefined) {
        console.error(e)
        throw '[docdiff] index === undefined || parentCid === undefined'
      }

      if (pcDict[parentCid]) {
        pcDict[parentCid].push(e)
      } else {
        pcDict[parentCid] = [e]
      }
    }
    this.sortParentChildrenDict_(pcDict)
    return this.fromParentChildrenDict(pcDict)
  },

  /**
   * Use given parent-children dict to construct a tree.
   * P.S. Node's index is followed by the given array, not by the node's index
   */
  fromParentChildrenDict<T>(dict: Record<string, NodeBody<T>[]>): TreeNode<T>[] {
    if (!(this.tempRootCid in dict)) {
      return [] // temp-root has no children, return an empty array
    }
    const tempRoot: TreeNode<T> = {
      cid: this.tempRootCid,
      children: [],
    }
    const seenIds: string[] = [tempRoot.cid]
    const parents: TreeNode<T>[] = [tempRoot]
    while (parents.length > 0) {
      const p = parents.shift()
      if (p === undefined || !(p.cid in dict)) {
        console.error(dict, p)
        throw '[docdiff] p === undefined || !(p.cid in dict)'
      }
      seenIds.push(p.cid)
      p.children = dict[p.cid].map<TreeNode<T>>(e => ({
        ...e,
        children: [],
      }))
      p.children.forEach(e => {
        if (seenIds.includes(e.cid)) {
          throw '[docdiff] input data form a loop tree' // id 不能重複，會造成循環錯誤
        }
        parents.push(e)
      })
    }
    return tempRoot.children
  },

  insert<T>(value: TreeNode<T>[], item: NodeBody<T>, toParentCid: string, toIndex: number): TreeNode<T>[] {
    const dict = this.toParentChildrenDict(value)
    const arr = dict[toParentCid]
    item.parentCid = toParentCid
    dict[item.cid] = []

    if (toIndex < 0) {
      arr.push(item)
    } else {
      arr.splice(toIndex, 0, item)
    }
    return this.fromParentChildrenDict(dict)
  },

  /**
   * In-place initialize every node's index & parentCid base on its current position
   */
  initPosition<T>(children: TreeNode<T>[]): TreeNode<T>[] {
    // root.parentCid = this.tempRootCid
    // root.index = 0
    const tempRoot: TreeNode<T> = {
      cid: this.tempRootCid,
      children: children.map((e, i) => ({ ...e, parentCid: this.tempRootCid, index: i })),
    }
    const stack: TreeNode<T>[] = [tempRoot]
    while (stack.length > 0) {
      const p = stack.shift()
      if (p === undefined) {
        throw '[docdiff] p === undefined, unexpected error'
      }
      p.children.forEach((c, i) => {
        c.parentCid = p.cid
        c.index = i
        stack.push(c)
      })
    }
    return tempRoot.children
  },

  isRoot<T>(node: TreeNode<T>): boolean {
    return node.parentCid === TreeService.tempRootCid
  },

  sortParentChildrenDict_<T>(dict: Record<string, NodeBody<T>[]>): void {
    Object.entries(dict).forEach(([k, v]) => {
      // sort children by its index
      dict[k] = v.sort((a, b) => {
        if (a.index === undefined || b.index === undefined) {
          throw '[docdiff] a.index === undefined || b.index === undefined'
        }
        return a.index - b.index
      })
    })
  },

  toPreOrderList<T>(children: TreeNode<T>[]): NodeBody<T>[] {
    const traversed: NodeBody<T>[] = []
    const parents: TreeNode<T>[] = children.map((e, i) => ({
      ...e,
      parentCid: this.tempRootCid,
      index: i,
    }))
    while (parents.length > 0) {
      const p = parents.shift()
      if (p === undefined) {
        throw '[docdiff] unexpected error'
      }
      const { children, ...rest } = p
      children.forEach((v, i) => {
        parents.push({ ...v, parentCid: p.cid, index: i })
      })
      traversed.push({ ...rest })
    }
    return traversed
  },

  // alias
  toList<T>(children: TreeNode<T>[]): NodeBody<T>[] {
    return this.toPreOrderList(children)
  },

  toDict<T>(children: TreeNode<T>[]): Record<string, NodeBody<T>> {
    // const nd = cloneDeep(node)
    const dict: Record<string, NodeBody<T>> = {}
    for (const e of this.toList(children)) {
      dict[e.cid] = e
    }
    return dict
  },

  toParentChildrenDict<T>(children: TreeNode<T>[]): Record<string, NodeBody<T>[]> {
    const nodeDict = this.toDict(children)
    const dict: Record<string, NodeBody<T>[]> = Object.fromEntries(
      Object.entries(nodeDict).map(([k]): [string, NodeBody<T>[]] => [k, []]),
    )
    dict[this.tempRootCid] = []

    Object.entries(nodeDict).forEach(([, node]) => {
      const { parentCid } = node
      if (parentCid === undefined) {
        throw `[docdiff] parentCid === undefined`
      }
      if (dict[parentCid]) {
        dict[parentCid].push(node)
      } else {
        dict[parentCid] = [node]
      }
    })
    this.sortParentChildrenDict_(dict)
    return dict
  },
}
