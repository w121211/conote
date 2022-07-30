import { addEntities, setEntities } from '@ngneat/elf-entities'
import { validateChildrenUids } from '../../src/op/helpers'
import { blockNewOp } from '../../src/op/ops'
import {
  blockRepo,
  blocksStore,
  getBlock,
} from '../../src/stores/block.repository'
import { docsStore } from '../../src/stores/doc.repository'
import { blocks } from '../helpers'
import { mockDocs } from '../__mocks__/mock-doc'

/**
 *  a0
 *  - b1
 *    - c3
 *       - d5
 *       - d7
 *         - e8
 *    - c4
 *       - d9
 *       - d10
 *    - c6
 *  - b2
 */
beforeEach(() => {
  blockRepo.update([setEntities(blocks)])
  validateChildrenUids(blocksStore.getValue().entities)
})

// it('blockNewOp() throws', () => {
//   expect(() =>
//     blockNewOp('x', { refBlockUid: 'a0', relation: 'first' }),
//   ).toThrowErrorMatchingInlineSnapshot(
//     `"[validatePosition] Location uid is a doc, location must use title instead."`,
//   )

//   expect(() =>
//     blockNewOp('x', { docTitle: mockDocs[0].symbol, relation: 'first' }),
//   ).toThrowErrorMatchingInlineSnapshot(`"Doc not found by docTitle"`)
//   // pagesStore.update(addEntities([page]))
//   docsStore.update(addEntities([mockDocs[0]]))

//   expect(() =>
//     blockNewOp('x', {
//       refBlockUid: '0',
//       // docTitle: 'page-0',
//       docTitle: mockDocs[0].symbol,
//       relation: 'first',
//     }),
//   ).toThrowErrorMatchingInlineSnapshot(
//     `"[getBlock] Block not found: 5OHxZ9zkuNWrvq8LpsUmL"`,
//   )

//   // thrown: "Given uid is not unique"
//   expect(() =>
//     blockNewOp('b2', { refBlockUid: 'b1', relation: 'first' }),
//   ).toThrowErrorMatchingInlineSnapshot(
//     `"[validateUid] Given uid is not unique"`,
//   )
// })

/**
 *  a0
 *  - b1
 *    - c3
 *       - d5
 *       - d7
 *         - e8
 *    - (before)
 *    - c4*
 *      - (first)
 *      - d9
 *      - d10
 *      - (last)
 *    - (after)
 *    - c6
 *  - b2
 */

it('c4, before', () => {
  blockRepo.update(blockNewOp('x', { refBlockUid: 'c4', relation: 'before' }))
  expect(() =>
    validateChildrenUids(blocksStore.getValue().entities),
  ).not.toThrow()
  expect(getBlock('b1').childrenUids).toMatchInlineSnapshot(`
    Array [
      "c3",
      "x",
      "c4",
      "c6",
    ]
  `)
})

it('c4, after', () => {
  blockRepo.update(blockNewOp('x', { refBlockUid: 'c4', relation: 'after' }))
  expect(() =>
    validateChildrenUids(blocksStore.getValue().entities),
  ).not.toThrow()
  expect(getBlock('b1').childrenUids).toMatchInlineSnapshot(`
    Array [
      "c3",
      "c4",
      "x",
      "c6",
    ]
  `)
})

it('c4, first', () => {
  blockRepo.update(blockNewOp('x', { refBlockUid: 'c4', relation: 'first' }))
  expect(() =>
    validateChildrenUids(blocksStore.getValue().entities),
  ).not.toThrow()
  expect(getBlock('c4').childrenUids).toMatchInlineSnapshot(`
    Array [
      "x",
      "d9",
      "d10",
    ]
  `)
})

it('c4, last', () => {
  blockRepo.update(blockNewOp('x', { refBlockUid: 'c4', relation: 'last' }))
  expect(() =>
    validateChildrenUids(blocksStore.getValue().entities),
  ).not.toThrow()
  expect(getBlock('c4').childrenUids).toMatchInlineSnapshot(`
    Array [
      "d9",
      "d10",
      "x",
    ]
  `)
})

// cur = blocksStore.getValue().entities
// blocksStore.update(
//   ...blockNewOp('x1', { docTitle: 'page-0', relation: 'first' }),
// )
// next = clean(blocksStore.getValue().entities)
// expect(diff(cur, next)).toMatchInlineSnapshot(`
//    Object {
//      "0": Object {
//        "childrenUids": Object {
//          "0": "x1",
//          "1": "1",
//          "2": "2",
//        },
//      },
//      "1": Object {
//        "order": 1,
//      },
//      "2": Object {
//        "order": 2,
//      },
//      "x1": Object {
//        "childrenUids": Array [],
//        "open": true,
//        "order": 0,
//        "parentUid": "0",
//        "str": "",
//        "uid": "x1",
//      },
//    }
//  `)

// /**
//  *  0
//  *  - x1
//  *    - x2*
//  *  - 1
//  *    - 3
//  *  - 2
//  */
// cur = next
// blocksStore.update(
//   ...blockNewOp('x2', { refBlockUid: 'x1', relation: 'first' }),
// )
// next = clean(blocksStore.getValue().entities)
// expect(diff(cur, next)).toMatchInlineSnapshot(`
//   Object {
//     "x1": Object {
//       "childrenUids": Object {
//         "0": "x2",
//       },
//     },
//     "x2": Object {
//       "childrenUids": Array [],
//       "open": true,
//       "order": 0,
//       "parentUid": "x1",
//       "str": "",
//       "uid": "x2",
//     },
//   }
// `)

// /**
//  *  0
//  *  - x1
//  *    - x2
//  *  - 1
//  *    - 3
//  *    - x3
//  *  - 2
//  */
// cur = next
// blocksStore.update(
//   ...blockNewOp('x3', { refBlockUid: '1', relation: 'last' }),
// )
// next = clean(blocksStore.getValue().entities)
// expect(diff(cur, next)).toMatchInlineSnapshot(`
//    Object {
//      "1": Object {
//        "childrenUids": Object {
//          "1": "x3",
//        },
//      },
//      "x3": Object {
//        "childrenUids": Array [],
//        "open": true,
//        "order": 1,
//        "parentUid": "1",
//        "str": "",
//        "uid": "x3",
//      },
//    }
//  `)

// /**
//  *  0
//  *  - x1
//  *    - x2
//  *  - 1
//  *    - 3
//  *    - x3
//  *  - 2
//  *   - x4*
//  */
// cur = next
// blocksStore.update(
//   ...blockNewOp('x4', { refBlockUid: '2', relation: 'last' }),
// )
// next = clean(blocksStore.getValue().entities)
// expect(diff(cur, next)).toMatchInlineSnapshot(`
//   Object {
//     "2": Object {
//       "childrenUids": Object {
//         "0": "x4",
//       },
//     },
//     "x4": Object {
//       "childrenUids": Array [],
//       "open": true,
//       "order": 0,
//       "parentUid": "2",
//       "str": "",
//       "uid": "x4",
//     },
//   }
// `)

// /**
//  *  0
//  *  - x1
//  *    - x2
//  *  - x5*
//  *  - 1
//  *    - 3
//  *    - x3
//  *  - 2
//  *   - x4
//  */
// cur = next
// blocksStore.update(
//   ...blockNewOp('x5', { refBlockUid: '1', relation: 'before' }),
// )
// next = clean(blocksStore.getValue().entities)
// expect(diff(cur, next)).toMatchInlineSnapshot(`
//   Object {
//     "0": Object {
//       "childrenUids": Object {
//         "1": "x5",
//         "2": "1",
//         "3": "2",
//       },
//     },
//     "1": Object {
//       "order": 2,
//     },
//     "2": Object {
//       "order": 3,
//     },
//     "x5": Object {
//       "childrenUids": Array [],
//       "open": true,
//       "order": 1,
//       "parentUid": "0",
//       "str": "",
//       "uid": "x5",
//     },
//   }
// `)

// /**
//  *  0
//  *  - x6
//  *  - x1
//  *    - x2
//  *  - x5
//  *  - 1
//  *    - 3
//  *    - x3
//  *  - 2
//  *   - x4
//  */
// cur = next
// blocksStore.update(
//   ...blockNewOp('x6', { refBlockUid: 'x1', relation: 'before' }),
// )
// next = clean(blocksStore.getValue().entities)
// expect(diff(cur, next)).toMatchInlineSnapshot(`
//   Object {
//     "0": Object {
//       "childrenUids": Object {
//         "0": "x6",
//         "1": "x1",
//         "2": "x5",
//         "3": "1",
//         "4": "2",
//       },
//     },
//     "1": Object {
//       "order": 3,
//     },
//     "2": Object {
//       "order": 4,
//     },
//     "x1": Object {
//       "order": 1,
//     },
//     "x5": Object {
//       "order": 2,
//     },
//     "x6": Object {
//       "childrenUids": Array [],
//       "open": true,
//       "order": 0,
//       "parentUid": "0",
//       "str": "",
//       "uid": "x6",
//     },
//   }
// `)

// /**
//  *  0
//  *  - x6
//  *  - x1
//  *    - x2
//  *    - x7
//  *  - x5
//  *  - 1
//  *    - 3
//  *    - x3
//  *  - 2
//  *   - x4
//  */
// cur = next
// blocksStore.update(
//   ...blockNewOp('x7', { refBlockUid: 'x2', relation: 'after' }),
// )
// next = clean(blocksStore.getValue().entities)
// expect(diff(cur, next)).toMatchInlineSnapshot(`
//   Object {
//     "x1": Object {
//       "childrenUids": Object {
//         "1": "x7",
//       },
//     },
//     "x7": Object {
//       "childrenUids": Array [],
//       "open": true,
//       "order": 1,
//       "parentUid": "x1",
//       "str": "",
//       "uid": "x7",
//     },
//   }
// `)

// /**
//  *  0
//  *  - x6
//  *  - x1
//  *    - x2
//  *    - x8
//  *    - x7
//  *  - x5
//  *  - 1
//  *    - 3
//  *    - x3
//  *  - 2
//  *   - x4
//  */
// cur = next
// blocksStore.update(
//   ...blockNewOp('x8', { refBlockUid: 'x7', relation: 'before' }),
// )
// next = clean(blocksStore.getValue().entities)
// expect(diff(cur, next)).toMatchInlineSnapshot(`
//   Object {
//     "x1": Object {
//       "childrenUids": Object {
//         "1": "x8",
//         "2": "x7",
//       },
//     },
//     "x7": Object {
//       "order": 2,
//     },
//     "x8": Object {
//       "childrenUids": Array [],
//       "open": true,
//       "order": 1,
//       "parentUid": "x1",
//       "str": "",
//       "uid": "x8",
//     },
//   }
// `)

// /**
//  *  0
//  *  - x6
//  *  - x1
//  *    - x8
//  *    - x9
//  *    - x2
//  *    - x7
//  *  - x5
//  *  - 1
//  *    - 3
//  *    - x3
//  *  - 2
//  *   - x4
//  */
// cur = next
// blocksStore.update(
//   ...blockNewOp('x9', { refBlockUid: 'x8', relation: 'after' }),
// )
// next = clean(blocksStore.getValue().entities)
// expect(diff(cur, next)).toMatchInlineSnapshot(`
//   Object {
//     "x1": Object {
//       "childrenUids": Object {
//         "2": "x9",
//         "3": "x7",
//       },
//     },
//     "x7": Object {
//       "order": 3,
//     },
//     "x9": Object {
//       "childrenUids": Array [],
//       "open": true,
//       "order": 2,
//       "parentUid": "x1",
//       "str": "",
//       "uid": "x9",
//     },
//   }
// `)
