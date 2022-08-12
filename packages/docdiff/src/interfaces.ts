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
  // TODO: If 'a' move to 'b' and move to 'a', should it detect as not moved?
  // change?: TreeNodeChangeType

  // Extra information for reading only
  extraInfo?: {
    depth: number
  }
}

export type TreeNodeChange = {
  type: TreeNodeChangeType
  uid: string

  // Refers to final state id
  // toParentUid: string

  // For insert only, others set to null
  // toOrder: number | null

  // data?: T
}

export type TreeNodeChangeType =
  | 'change-parent' // Move a node under a different parent
  | 'change-parent-update' // Move a node under a different parent & update the value
  | 'delete' // Delete a node
  | 'insert' // Insert a node
  | 'move' // Move a node between siblings, TODO: if node move back to its original place?
  | 'move-update' // Move a node between siblings & update the value
  | 'update' // Update the data value
