import { treeUtil } from '@conote/docdiff'
import { cloneDeep } from 'lodash'
import type { Block } from '../../src/interfaces'

/**
 *  a0
 *  - b1
 *    - c3
 *       - d5  update
 *       - d7
 *         - e8
 *    - c4
 *       - d9  insert
 *       - d10  insert
 *    - c6
 *  - b2  delete
 */
const initial: Block[] = [
  {
    uid: 'a0',
    str: 'a0',
    order: 0,
    parentUid: null,
    childrenUids: ['b1', 'b2'],
    docSymbol: 'a0',
  },
  {
    uid: 'b1',
    str: 'b1',
    order: 0,
    parentUid: 'a0',
    childrenUids: ['c3', 'c4', 'c6'],
  },
  {
    uid: 'b2',
    str: 'b2',
    order: 1,
    parentUid: 'a0',
    childrenUids: [],
  },
  {
    uid: 'c3',
    str: 'c3',
    order: 0,
    parentUid: 'b1',
    childrenUids: ['d5', 'd7'],
  },
  {
    uid: 'c4',
    str: 'c4',
    order: 1,
    parentUid: 'b1',
    // childrenUids: ['d9', 'd10'],
    childrenUids: [],
  },
  {
    uid: 'd5',
    str: 'd5',
    order: 0,
    parentUid: 'c3',
    childrenUids: [],
  },
  {
    uid: 'c6',
    str: 'c6',
    order: 2,
    parentUid: 'b1',
    childrenUids: [],
  },
  {
    uid: 'd7',
    str: 'd7',
    order: 1,
    parentUid: 'c3',
    childrenUids: ['e8'],
  },
  {
    uid: 'e8',
    str: 'e8',
    order: 0,
    parentUid: 'd7',
    childrenUids: [],
  },
  // {
  //   uid: 'd9',
  //   str: 'd9',
  //   order: 0,
  //   parentUid: 'c4',
  //   childrenUids: [],
  //   open: true,
  // },
  // {
  //   uid: 'd10',
  //   str: 'd10',
  //   order: 1,
  //   parentUid: 'c4',
  //   childrenUids: [],
  //   open: true,
  // },
]

const insertsOnly = cloneDeep(initial).concat([
  {
    uid: 'd9',
    str: 'd9',
    order: 0,
    parentUid: 'c4',
    childrenUids: [],
  },
  {
    uid: 'd10',
    str: 'd10',
    order: 1,
    parentUid: 'c4',
    childrenUids: [],
  },
])
insertsOnly[4].childrenUids = ['d9', 'd10']

const _deletes = cloneDeep(insertsOnly)
_deletes.splice(2, 1)
_deletes[0].childrenUids = ['b1']

const _update = cloneDeep(_deletes)
_update[5].str = _update[5].str + ' updated'

treeUtil.validateList(treeUtil.toTreeNodeBodyList(initial))
treeUtil.validateList(treeUtil.toTreeNodeBodyList(insertsOnly))
treeUtil.validateList(treeUtil.toTreeNodeBodyList(_update))

export const mockDiffBlocks = {
  initial,
  insertsOnly,
  mix: _update,
}
