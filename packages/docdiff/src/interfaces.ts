export type MatchFn<T> = (node: TreeNodeBody<T>) => boolean

export type TreeNode<T> = TreeNodeBody<T> & {
  children: TreeNode<T>[]
}

export type TreeNodeBody<T> = {
  // This node's id. Naming 'uid' instead of 'id' for naming clearity,
  // ie back-end use id (for database entities) and front-end use uid
  uid: string

  // If null, refers to the root-node
  parentUid: string | null

  // A reverse links to parent, useful for quick search
  childrenUids?: string[]

  // Order in the children array
  order: number

  // The data to store
  data: T

  // Record change-event lively
  // change?: ChangeType
}

export type ChangeType =
  | 'insert'
  | 'update'
  | 'move' // TODO: 若又改回來了的情況？
  | 'move-update'
  | 'delete'
  | 'change-parent' // TODO: 若又改回來了的情況？
  | 'change-parent-update'

export type NodeChange<T> = {
  type: ChangeType
  cid: string
  toParentCid: string // refers to final state id
  toIndex: number | null // for insert only, others set to null
  data?: T
}
