import { cloneDeep } from 'lodash'
import { TreeNodeBody } from '../interfaces'
import { treeUtil } from '../tree-util'
import { mockTreeNodes } from '../__mocks__/mock-nodes'

let bodies: Required<TreeNodeBody<object>>[] = []

beforeEach(() => {
  bodies = cloneDeep(mockTreeNodes)
})

/**
 * validateList() throws if
 * - [x] no roots
 * - [x] multiple roots
 * - [x] children uids not matched
 * - [x] order not matched
 * - [x] has orphan
 * - [x] has cycle -> catched by has orphan
 */

it('validateList() passed on mockTreeNodeBodies', () => {
  treeUtil.validateList(bodies)
})

it('validateList() throws if no roots', () => {
  bodies[0].parentUid = 'mock-tree-node-body-1'
  expect(() => {
    treeUtil.validateList(bodies)
  }).toThrowErrorMatchingInlineSnapshot(`"[getRootUid] Root-node not found"`)
})

it('validateList() throws if multiple roots', () => {
  bodies.push(bodies[0])
  expect(() => {
    treeUtil.validateList(bodies)
  }).toThrowErrorMatchingInlineSnapshot(
    `"[getRootUid] Found multiple root-nodes"`,
  )
})

it('validateList() throws if children uids not matched', () => {
  bodies[2].childrenUids = []
  expect(() => {
    treeUtil.validateList(bodies)
  }).toThrowErrorMatchingInlineSnapshot(
    `"[validateList] Children-uids not matched"`,
  )
})

it('validateList() throws if children uids not matched', () => {
  bodies[1].childrenUids = ['mock-tree-node-body-4']
  expect(() => {
    treeUtil.validateList(bodies)
  }).toThrowErrorMatchingInlineSnapshot(
    `"[validateList] Children-uids not matched"`,
  )
})

it('validateList() throws if order not matched', () => {
  bodies[1].order = 1
  bodies[2].order = 0
  expect(() => {
    treeUtil.validateList(bodies)
  }).toThrowErrorMatchingInlineSnapshot(
    `"[validateList] Children-uids not matched"`,
  )
})

it('validateList() throws if has orphan', () => {
  bodies.push({
    uid: 'orphan',
    parentUid: 'orpahn-parent',
    childrenUids: [],
    order: 0,
    data: {},
    extraInfo: { depth: 0 },
  })
  expect(() => {
    treeUtil.validateList(bodies)
  }).toThrowErrorMatchingInlineSnapshot(
    `"[buildFromParentChildrenDict] Has orphan(s)"`,
  )
})

it('validateList() throws if has cycle (catched by has orphan)', () => {
  bodies[2].parentUid = 'mock-tree-node-body-6'
  expect(() => {
    treeUtil.validateList(bodies)
  }).toThrowErrorMatchingInlineSnapshot(
    `"[buildFromParentChildrenDict] Has orphan(s)"`,
  )
})

/**
 * buildFromList() throws:
 * - [x] has orphans
 * - [x] (wont't throw) has cycle <- by building from the list the cycle
 *       will form a seperated tree, which is a case of orphans
 */

it('buildFromList() throws if has orpahns', () => {
  bodies[2].parentUid = 'mock-tree-node-body-6'
  expect(() => {
    treeUtil.buildFromList(bodies)
  }).toThrowErrorMatchingInlineSnapshot(
    `"[buildFromParentChildrenDict] Has orphan(s)"`,
  )
})

it('buildFromList() throws if has orpahns', () => {
  bodies[1].parentUid = 'mock-tree-node-body-1'
  expect(() => {
    treeUtil.buildFromList(bodies)
  }).toThrowErrorMatchingInlineSnapshot(
    `"[buildFromParentChildrenDict] Has orphan(s)"`,
  )
})

it('buildFromList() build and recover to list', () => {
  const root = treeUtil.buildFromList(bodies),
    nodes_ = treeUtil.toList(root)
  treeUtil.validateList(nodes_)
})

it('buildFromList() regadless of list order', () => {
  const rootMoveToEnd = [...bodies.slice(1), bodies[0]],
    root = treeUtil.buildFromList(rootMoveToEnd),
    nodes_ = treeUtil.toList(root)
  treeUtil.validateList(nodes_)
})

it('buildFromList() regadless of list order', () => {
  const someNodesMoveToEnd = [...bodies.slice(3), ...bodies.slice(0, 3)],
    root1 = treeUtil.buildFromList(someNodesMoveToEnd),
    nodes_1 = treeUtil.toList(root1)
  treeUtil.validateList(nodes_1)
})

//
// insert()
//
//
//
//
//
//

const insertItem: TreeNodeBody<object> = {
  uid: 'insert',
  parentUid: '',
  order: -1,
  data: {},
}

it('insert() to root', () => {
  const root = treeUtil.buildFromList(bodies)

  treeUtil.insert(root, insertItem, {
    prevSiblingUid: null,
    parentUid: mockTreeNodes[0].uid,
  })

  const nodes_ = treeUtil.toList(root)
  treeUtil.validateList(nodes_)

  expect(nodes_.find(e => e.uid === mockTreeNodes[0].uid)?.childrenUids)
    .toMatchInlineSnapshot(`
    Array [
      "insert",
      "1",
      "2",
      "3",
    ]
  `)
})

it('insert() to previous sibling', () => {
  const root = treeUtil.buildFromList(bodies)

  treeUtil.insert(root, insertItem, {
    prevSiblingUid: '2',
  })

  const nodes_ = treeUtil.toList(root)
  treeUtil.validateList(nodes_)

  expect(nodes_.find(e => e.uid === mockTreeNodes[0].uid)?.childrenUids)
    .toMatchInlineSnapshot(`
    Array [
      "1",
      "2",
      "insert",
      "3",
    ]
  `)
})

it('insert() to parent', () => {
  const root = treeUtil.buildFromList(bodies)

  treeUtil.insert(root, insertItem, {
    prevSiblingUid: null,
    parentUid: '2',
  })

  const nodes_ = treeUtil.toList(root)
  treeUtil.validateList(nodes_)
  expect(nodes_.find(e => e.uid === '2')?.childrenUids).toMatchInlineSnapshot(`
    Array [
      "insert",
      "4",
      "5",
    ]
  `)
})
