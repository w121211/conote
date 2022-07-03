import { cloneDeep } from 'lodash'
import { treeNodeDifferencer } from '../diff'
import {
  isBlockEqual,
  mockBlockNodes,
  mockBlockNodes_deletes,
  mockBlockNodes_mix,
  mockBlockNodes_updateRoot,
  mockBlockNodes_updates,
} from '../__mocks__/mock-block-nodes'

/**
 * Checks
 * - [] Start is null
 * - [] Start is an empty array
 * - [] Final has only the root
 * - [] No changes
 * - [] Insertions
 */

it('Start is null', () => {
  expect(treeNodeDifferencer.difference(mockBlockNodes, null, isBlockEqual))
    .toMatchInlineSnapshot(`
    Array [
      Object {
        "type": "insert",
        "uid": "mock-tree-node-body-0",
      },
      Object {
        "type": "insert",
        "uid": "mock-tree-node-body-1",
      },
      Object {
        "type": "insert",
        "uid": "mock-tree-node-body-2",
      },
      Object {
        "type": "insert",
        "uid": "mock-tree-node-body-3",
      },
      Object {
        "type": "insert",
        "uid": "mock-tree-node-body-4",
      },
      Object {
        "type": "insert",
        "uid": "mock-tree-node-body-5",
      },
      Object {
        "type": "insert",
        "uid": "mock-tree-node-body-6",
      },
      Object {
        "type": "insert",
        "uid": "mock-tree-node-body-7",
      },
    ]
  `)
})

it('Start is an empty array', () => {
  expect(treeNodeDifferencer.difference(mockBlockNodes, [], isBlockEqual))
    .toMatchInlineSnapshot(`
    Array [
      Object {
        "type": "insert",
        "uid": "mock-tree-node-body-0",
      },
      Object {
        "type": "insert",
        "uid": "mock-tree-node-body-1",
      },
      Object {
        "type": "insert",
        "uid": "mock-tree-node-body-2",
      },
      Object {
        "type": "insert",
        "uid": "mock-tree-node-body-3",
      },
      Object {
        "type": "insert",
        "uid": "mock-tree-node-body-4",
      },
      Object {
        "type": "insert",
        "uid": "mock-tree-node-body-5",
      },
      Object {
        "type": "insert",
        "uid": "mock-tree-node-body-6",
      },
      Object {
        "type": "insert",
        "uid": "mock-tree-node-body-7",
      },
    ]
  `)
})

it('Final has only the root ', () => {
  console.debug(mockBlockNodes[0])
  expect(
    treeNodeDifferencer.difference(
      mockBlockNodes.slice(0, 1),
      [],
      isBlockEqual,
    ),
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "type": "insert",
        "uid": "mock-tree-node-body-0",
      },
    ]
  `)
})

it('no changes', () => {
  expect(
    treeNodeDifferencer.difference(
      mockBlockNodes,
      cloneDeep(mockBlockNodes),
      isBlockEqual,
    ),
  ).toMatchInlineSnapshot(`Array []`)
})

it('insertions', () => {
  expect(
    treeNodeDifferencer.difference(
      mockBlockNodes,
      mockBlockNodes_deletes,
      isBlockEqual,
    ),
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "type": "insert",
        "uid": "mock-tree-node-body-3",
      },
      Object {
        "type": "insert",
        "uid": "mock-tree-node-body-6",
      },
      Object {
        "type": "insert",
        "uid": "mock-tree-node-body-7",
      },
    ]
  `)
})

it('get delete changes', () => {
  expect(
    treeNodeDifferencer.difference(
      mockBlockNodes_deletes,
      mockBlockNodes,
      isBlockEqual,
    ),
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "type": "delete",
        "uid": "mock-tree-node-body-3",
      },
      Object {
        "type": "delete",
        "uid": "mock-tree-node-body-6",
      },
      Object {
        "type": "delete",
        "uid": "mock-tree-node-body-7",
      },
    ]
  `)
})

it('get update changes', () => {
  expect(
    treeNodeDifferencer.difference(
      mockBlockNodes_updates,
      mockBlockNodes,
      isBlockEqual,
    ),
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "type": "update",
        "uid": "mock-tree-node-body-2",
      },
      Object {
        "type": "update",
        "uid": "mock-tree-node-body-7",
      },
    ]
  `)

  expect(
    treeNodeDifferencer.difference(
      mockBlockNodes_updateRoot,
      mockBlockNodes,
      isBlockEqual,
    ),
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "type": "update",
        "uid": "mock-tree-node-body-0",
      },
    ]
  `)
})

it('get move changes', () => {
  // treeNodeDifferencer.difference()
})

it('get change-parent changes', () => {
  // treeNodeDifferencer.difference()
})

it('get change-parent-update changes', () => {
  // treeNodeDifferencer.difference()
})

it('get mixed changes', () => {
  expect(
    treeNodeDifferencer.difference(
      mockBlockNodes_mix,
      mockBlockNodes_deletes,
      isBlockEqual,
    ),
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "type": "insert",
        "uid": "mock-tree-node-body-3",
      },
      Object {
        "type": "insert",
        "uid": "mock-tree-node-body-6",
      },
      Object {
        "type": "insert",
        "uid": "mock-tree-node-body-7",
      },
      Object {
        "type": "delete",
        "uid": "mock-tree-node-body-5",
      },
      Object {
        "type": "update",
        "uid": "mock-tree-node-body-2",
      },
      Object {
        "type": "update",
        "uid": "mock-tree-node-body-4",
      },
    ]
  `)
})
