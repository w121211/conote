import { cloneDeep } from 'lodash'
import { treeDifferencer } from '../tree-differencer'
import { treeUtil } from '../tree-util'
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
  expect(treeDifferencer.difference(mockBlockNodes, null, isBlockEqual))
    .toMatchInlineSnapshot(`
    Array [
      Object {
        "type": "insert",
        "uid": "0",
      },
      Object {
        "type": "insert",
        "uid": "1",
      },
      Object {
        "type": "insert",
        "uid": "2",
      },
      Object {
        "type": "insert",
        "uid": "3",
      },
      Object {
        "type": "insert",
        "uid": "4",
      },
      Object {
        "type": "insert",
        "uid": "5",
      },
      Object {
        "type": "insert",
        "uid": "6",
      },
      Object {
        "type": "insert",
        "uid": "7",
      },
      Object {
        "type": "insert",
        "uid": "8",
      },
    ]
  `)
})

it('Start is an empty array', () => {
  expect(treeDifferencer.difference(mockBlockNodes, [], isBlockEqual))
    .toMatchInlineSnapshot(`
    Array [
      Object {
        "type": "insert",
        "uid": "0",
      },
      Object {
        "type": "insert",
        "uid": "1",
      },
      Object {
        "type": "insert",
        "uid": "2",
      },
      Object {
        "type": "insert",
        "uid": "3",
      },
      Object {
        "type": "insert",
        "uid": "4",
      },
      Object {
        "type": "insert",
        "uid": "5",
      },
      Object {
        "type": "insert",
        "uid": "6",
      },
      Object {
        "type": "insert",
        "uid": "7",
      },
      Object {
        "type": "insert",
        "uid": "8",
      },
    ]
  `)
})

it('Final has only the root ', () => {
  console.debug(mockBlockNodes[0])
  expect(
    treeDifferencer.difference(mockBlockNodes.slice(0, 1), [], isBlockEqual),
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "type": "insert",
        "uid": "0",
      },
    ]
  `)
})

it('no changes', () => {
  expect(
    treeDifferencer.difference(
      mockBlockNodes,
      cloneDeep(mockBlockNodes),
      isBlockEqual,
    ),
  ).toMatchInlineSnapshot(`Array []`)
})

it('insertions', () => {
  expect(
    treeDifferencer.difference(
      mockBlockNodes,
      mockBlockNodes_deletes,
      isBlockEqual,
    ),
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "type": "insert",
        "uid": "3",
      },
      Object {
        "type": "insert",
        "uid": "6",
      },
      Object {
        "type": "insert",
        "uid": "7",
      },
      Object {
        "type": "insert",
        "uid": "8",
      },
    ]
  `)
})

it('get delete changes', () => {
  expect(
    treeDifferencer.difference(
      mockBlockNodes_deletes,
      mockBlockNodes,
      isBlockEqual,
    ),
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "type": "delete",
        "uid": "3",
      },
      Object {
        "type": "delete",
        "uid": "6",
      },
      Object {
        "type": "delete",
        "uid": "7",
      },
      Object {
        "type": "delete",
        "uid": "8",
      },
    ]
  `)
})

it('get update changes', () => {
  expect(
    treeDifferencer.difference(
      mockBlockNodes_updates,
      mockBlockNodes,
      isBlockEqual,
    ),
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "type": "update",
        "uid": "2",
      },
      Object {
        "type": "update",
        "uid": "7",
      },
    ]
  `)

  expect(
    treeDifferencer.difference(
      mockBlockNodes_updateRoot,
      mockBlockNodes,
      isBlockEqual,
    ),
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "type": "update",
        "uid": "0",
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
    treeDifferencer.difference(
      mockBlockNodes_mix,
      mockBlockNodes_deletes,
      isBlockEqual,
    ),
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "type": "insert",
        "uid": "3",
      },
      Object {
        "type": "insert",
        "uid": "6",
      },
      Object {
        "type": "insert",
        "uid": "7",
      },
      Object {
        "type": "insert",
        "uid": "8",
      },
      Object {
        "type": "delete",
        "uid": "5",
      },
      Object {
        "type": "update",
        "uid": "2",
      },
      Object {
        "type": "update",
        "uid": "4",
      },
    ]
  `)
})

//
// Merge
//
//
//
//

it('_mergeDeletions() only deletions', () => {
  const final = mockBlockNodes_deletes,
    start = mockBlockNodes,
    changes = treeDifferencer.difference(final, start, isBlockEqual),
    f_root = treeUtil.buildFromList(final),
    s_root = treeUtil.buildFromList(start)

  treeDifferencer._mergeDeletions(f_root, s_root, changes)
  expect(treeUtil.toString(f_root)).toMatchInlineSnapshot(`
    "- 0
      - 1
      - 2
        - 4
          - 6
          - 8
        - 5
      - 3
        - 7"
  `)
})

it('_mergeDeletions() mix', () => {
  const final = mockBlockNodes_mix,
    start = mockBlockNodes_deletes,
    changes = treeDifferencer.difference(final, start, isBlockEqual),
    deletes = changes.filter(e => e.type === 'delete'),
    f_root = treeUtil.buildFromList(final),
    s_root = treeUtil.buildFromList(start)

  treeDifferencer._mergeDeletions(f_root, s_root, deletes)
  expect(treeUtil.toString(f_root)).toMatchInlineSnapshot(`
    "- 0
      - 1
      - 2
        - 4
          - 6
          - 8
        - 5
      - 3
        - 7"
  `)
})

it('merge() only deletions', () => {
  expect(
    treeDifferencer
      .merge(mockBlockNodes_mix, mockBlockNodes_deletes, isBlockEqual)
      .map(([a, b]) => `${a.uid} ${b?.type ?? 'null'}`),
  ).toMatchInlineSnapshot(`
    Array [
      "0 null",
      "1 null",
      "2 update",
      "4 update",
      "6 insert",
      "8 insert",
      "5 delete",
      "3 insert",
      "7 insert",
    ]
  `)
})
