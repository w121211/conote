import { TreeNodeBody } from '../interfaces'

/**
 * 0
 * - 1
 * - 2
 *   - 4
 *     - 6
 *     - 8
 *   - 5
 * - 3
 *   - 7
 */
export const mockTreeNodes: Required<TreeNodeBody<object>>[] = [
  {
    uid: '0',
    parentUid: null,
    childrenUids: ['1', '2', '3'],
    order: 0,
    data: {},
    extraInfo: { depth: -1 },
  },
  {
    uid: '1',
    parentUid: '0',
    childrenUids: [],
    order: 0,
    data: {},
    extraInfo: { depth: -1 },
  },
  {
    uid: '2',
    parentUid: '0',
    childrenUids: ['4', '5'],
    order: 1,
    data: {},
    extraInfo: { depth: -1 },
  },
  {
    uid: '3',
    parentUid: '0',
    childrenUids: ['7'],
    order: 2,
    data: {},
    extraInfo: { depth: -1 },
  },
  {
    uid: '4',
    parentUid: '2',
    childrenUids: ['6'],
    order: 0,
    data: {},
    extraInfo: { depth: -1 },
  },
  {
    uid: '5',
    parentUid: '2',
    childrenUids: [],
    order: 1,
    data: {},
    extraInfo: { depth: -1 },
  },
  {
    uid: '6',
    parentUid: '4',
    childrenUids: [],
    order: 0,
    data: {},
    extraInfo: { depth: -1 },
  },
  {
    uid: '7',
    parentUid: '3',
    childrenUids: [],
    order: 0,
    data: {},
    extraInfo: { depth: -1 },
  },
  {
    uid: '8',
    parentUid: '4',
    childrenUids: [],
    order: 1,
    data: {},
    extraInfo: { depth: -1 },
  },
]
