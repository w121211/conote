import { TreeNodeBody } from '../interfaces'

/**
 * 0
 * - 1
 * - 2
 *   - 4
 *     - 6
 *   - 5
 * - 3
 *   - 7
 */
export const mockTreeNodeBodies: Required<TreeNodeBody<object>>[] = [
  {
    uid: 'mock-tree-node-body-0',
    parentUid: null,
    childrenUids: [
      'mock-tree-node-body-1',
      'mock-tree-node-body-2',
      'mock-tree-node-body-3',
    ],
    order: 0,
    data: {},
  },
  {
    uid: 'mock-tree-node-body-1',
    parentUid: 'mock-tree-node-body-0',
    childrenUids: [],
    order: 0,
    data: {},
  },
  {
    uid: 'mock-tree-node-body-2',
    parentUid: 'mock-tree-node-body-0',
    childrenUids: ['mock-tree-node-body-4', 'mock-tree-node-body-5'],
    order: 1,
    data: {},
  },
  {
    uid: 'mock-tree-node-body-3',
    parentUid: 'mock-tree-node-body-0',
    childrenUids: ['mock-tree-node-body-7'],
    order: 2,
    data: {},
  },
  {
    uid: 'mock-tree-node-body-4',
    parentUid: 'mock-tree-node-body-2',
    childrenUids: ['mock-tree-node-body-6'],
    order: 0,
    data: {},
  },
  {
    uid: 'mock-tree-node-body-5',
    parentUid: 'mock-tree-node-body-2',
    childrenUids: [],
    order: 1,
    data: {},
  },
  {
    uid: 'mock-tree-node-body-6',
    parentUid: 'mock-tree-node-body-4',
    childrenUids: [],
    order: 0,
    data: {},
  },
  {
    uid: 'mock-tree-node-body-7',
    parentUid: 'mock-tree-node-body-3',
    childrenUids: [],
    order: 0,
    data: {},
  },
]
