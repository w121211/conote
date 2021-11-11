export type DataNode<T> = {
  cid: string
  parentCid?: string
  index?: number
  // prevId: string | null
  data?: T
  change?: 'move' // record change-event lively
}

export type TreeNode<T> = DataNode<T> & {
  children: TreeNode<T>[]
}

export type Match<T> = (node: DataNode<T>) => boolean

export const TreeService = {
  tempRootCid: 'TEMP_ROOT_CID',

  /** In-place initialize cid */
  // initCid<T extends { id?: string; cid?: string }>(children: TreeNode<T>[]): TreeNode<T>[] {
  // for (const e of this.toList(children)) {
  // e.data
  // }
  // },

  find<T>(children: TreeNode<T>[], match: Match<T>): DataNode<T>[] {
    const found: DataNode<T>[] = []
    for (const e of this.toList(children)) {
      if (match(e)) {
        found.push(e)
      }
    }
    return found
  },

  fromList<T>(nodes: DataNode<T>[]): TreeNode<T>[] {
    const pcDict: Record<string, DataNode<T>[]> = Object.fromEntries(
      nodes.map((e): [string, DataNode<T>[]] => [e.cid, []]),
    )

    for (const e of nodes) {
      const { index, parentCid } = e
      if (index === undefined || parentCid === undefined) {
        console.error(e)
        throw 'index === undefined || parentCid === undefined'
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
  fromParentChildrenDict<T>(dict: Record<string, DataNode<T>[]>): TreeNode<T>[] {
    const root: TreeNode<T> = {
      cid: this.tempRootCid,
      children: [],
    }
    const addedIds: string[] = [root.cid]
    const parents: TreeNode<T>[] = [root]
    while (parents.length > 0) {
      const p = parents.shift()
      if (p === undefined || !(p.cid in dict)) {
        console.error(dict, p)
        throw '[bullet-doc] p === undefined || !(p.cid in dict)'
      }
      addedIds.push(p.cid)
      p.children = dict[p.cid].map<TreeNode<T>>(e => ({
        ...e,
        children: [],
      }))
      p.children.forEach(e => {
        if (addedIds.includes(e.cid)) {
          throw '[bullet-doc] Input data error' // id 不能重複，會造成循環錯誤
        }
        parents.push(e)
      })
    }
    return root.children
  },

  insert<T>(value: TreeNode<T>[], item: DataNode<T>, toParentCid: string, toIndex: number): TreeNode<T>[] {
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
        throw '[bullet-doc] unexpected error'
      }
      p.children.forEach((c, i) => {
        c.parentCid = p.cid
        c.index = i
        stack.push(c)
      })
    }
    return tempRoot.children
  },

  sortParentChildrenDict_<T>(dict: Record<string, DataNode<T>[]>): void {
    Object.entries(dict).forEach(([k, v]) => {
      // sort children by its index
      dict[k] = v.sort((a, b) => {
        if (a.index === undefined || b.index === undefined) {
          throw '[bullet-doc] a.index === undefined || b.index === undefined'
        }
        return a.index - b.index
      })
    })
  },

  toPreOrderList<T>(children: TreeNode<T>[]): DataNode<T>[] {
    const traversed: DataNode<T>[] = []
    const parents: TreeNode<T>[] = children.map((e, i) => ({
      ...e,
      parentCid: this.tempRootCid,
      index: i,
    }))
    while (parents.length > 0) {
      const p = parents.shift()
      if (p === undefined) {
        throw '[bullet-doc] unexpected error'
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
  toList<T>(children: TreeNode<T>[]): DataNode<T>[] {
    return this.toPreOrderList(children)
  },

  toDict<T>(children: TreeNode<T>[]): Record<string, DataNode<T>> {
    // const nd = cloneDeep(node)
    const dict: Record<string, DataNode<T>> = {}
    for (const e of this.toList(children)) {
      dict[e.cid] = e
    }
    return dict
  },

  toParentChildrenDict<T>(children: TreeNode<T>[]): Record<string, DataNode<T>[]> {
    const nodeDict = this.toDict(children)
    const dict: Record<string, DataNode<T>[]> = Object.fromEntries(
      Object.entries(nodeDict).map(([k]): [string, DataNode<T>[]] => [k, []]),
    )
    dict[this.tempRootCid] = []

    Object.entries(nodeDict).forEach(([, node]) => {
      const { parentCid } = node
      if (parentCid === undefined) {
        throw `[bullet-doc] parentCid === undefined`
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
