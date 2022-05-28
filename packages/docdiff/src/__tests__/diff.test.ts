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

describe('TreeNodeDifferencer.difference()', () => {
  // it('', () => {
  //   treeNodeDifferencer.difference()
  // })

  it('get no changes', () => {
    expect(
      treeNodeDifferencer.difference(
        mockBlockNodes,
        cloneDeep(mockBlockNodes),
        isBlockEqual,
      ),
    ).toMatchInlineSnapshot(`Array []`)
  })

  it('get insert changes', () => {
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
})
