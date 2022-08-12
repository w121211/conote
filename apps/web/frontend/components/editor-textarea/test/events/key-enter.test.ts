import { setEntities } from '@ngneat/elf-entities'
import {
  enterAddChild,
  enterBumpUp,
  enterNewBlock,
  enterSplitBlock,
} from '../../src/events'
// import { diff } from 'deep-object-diff'
import { validateChildrenUids } from '../../src/op/helpers'
import {
  blockRepo,
  blocksStore,
  getBlock,
} from '../../src/stores/block.repository'
import { rfdbRepo } from '../../src/stores/rfdb.repository'
import { blocks, clean } from '../helpers'

/**
 *  a0
 *  - b1
 *    - c3
 *       -d5
 *    - c4
 *    - c6
 *  - b2
 *
 */
const [a0, b1, b2, c3, c4, d5, c6] = blocks

beforeEach(() => {
  blockRepo.update([setEntities(blocks)])
  validateChildrenUids(blocksStore.getValue().entities)
  rfdbRepo.setProps({ editing: { uid: 'b1' } })
})

describe('enterAddChild()', () => {
  it('validate', () => {
    /**
     *  a0*
     *  - (x)
     *  - b1
     *    - c3
     *       -d5
     *    - c4
     *    - c6
     *  - b2
     *
     */
    const cur = blocksStore.getValue().entities
    expect(() => enterAddChild(a0, 'x')).toThrowErrorMatchingInlineSnapshot(
      `"[getPage] title not found "`,
    )
  })

  it('enterAddChild', () => {
    /**
     *  a0
     *  - b1*
     *    - (x)
     *    - c3
     *       -d5
     *    - c4
     *    - c6
     *  - b2
     *
     */
    const cur = blocksStore.getValue().entities
    enterAddChild(b1, 'x')
    const next = clean(blocksStore.getValue().entities)
    expect(() =>
      validateChildrenUids(blocksStore.getValue().entities),
    ).not.toThrow()
    expect(rfdbRepo.getValue().editing?.uid).toMatchInlineSnapshot(`"x"`)
    // expect(diff(cur, next)).toMatchInlineSnapshot()
  })

  it('enterAddChild, enterAddChild, enterAddChild', () => {
    /**
     *  a0
     *  - b1
     *    - (x)
     *      - (y)
     *        - (z)
     *    - c3
     *       -d5
     *    - c4
     *    - c6
     *  - b2
     *
     */
    const cur = blocksStore.getValue().entities

    enterAddChild(b1, 'x')
    enterAddChild(getBlock('x'), 'y')
    enterAddChild(getBlock('y'), 'z')

    const next = clean(blocksStore.getValue().entities)
    expect(() =>
      validateChildrenUids(blocksStore.getValue().entities),
    ).not.toThrow()
    expect(rfdbRepo.getValue().editing?.uid).toMatchInlineSnapshot(`"z"`)
    // expect(diff(cur, next)).toMatchInlineSnapshot()
  })
})

describe('enterBumpUp()', () => {
  it('validate', () => {
    /**
     *  (x)
     *  a0*
     *  - b1
     *    - c3
     *       -d5
     *    - c4
     *    - c6
     *  - b2
     *
     */
    expect(() => enterBumpUp(a0, 'x')).toThrowErrorMatchingInlineSnapshot(
      `"[getPage] title not found "`,
    )
  })

  it('enterBumpUp', () => {
    /**
     *  a0
     *  - (x)
     *  - b1*
     *    - c3
     *       -d5
     *    - c4
     *    - c6
     *  - b2
     *
     */
    const cur = blocksStore.getValue().entities
    enterBumpUp(b1, 'x')
    const next = clean(blocksStore.getValue().entities)
    expect(() =>
      validateChildrenUids(blocksStore.getValue().entities),
    ).not.toThrow()
    expect(rfdbRepo.getValue().editing?.uid).toMatchInlineSnapshot(`"x"`)
    // expect(diff(cur, next)).toMatchInlineSnapshot()
  })

  it('enterBumpUp, enterBumpUp, enterBumpUp', () => {
    /**
     *  a0
     *  - (z)
     *  - (y)
     *  - (x)
     *  - b1*
     *    - c3
     *       -d5
     *    - c4
     *    - c6
     *  - b2
     *
     */
    const cur = blocksStore.getValue().entities

    enterBumpUp(b1, 'x')
    enterBumpUp(getBlock('x'), 'y')
    enterBumpUp(getBlock('y'), 'z')

    const next = clean(blocksStore.getValue().entities)
    expect(() =>
      validateChildrenUids(blocksStore.getValue().entities),
    ).not.toThrow()
    expect(rfdbRepo.getValue().editing?.uid).toMatchInlineSnapshot(`"z"`)
    // expect(diff(cur, next)).toMatchInlineSnapshot()
  })
})

describe('enterNewBlock()', () => {
  it('validate', () => {
    /**
     *  a0*
     *  - b1
     *    - c3
     *       -d5
     *    - c4
     *    - c6
     *  - b2
     *
     */
    expect(() => enterNewBlock(a0, 'x')).toThrowErrorMatchingInlineSnapshot(
      `"[validatePosition] Location uid is a page, location must use title instead."`,
    )
  })

  it('enterNewBlock', () => {
    /**
     *  a0
     *  - b1*
     *    - c3
     *       -d5
     *    - c4
     *    - c6
     *  - (x)
     *  - b2
     *
     */
    const cur = blocksStore.getValue().entities
    enterNewBlock(b1, 'x')
    const next = clean(blocksStore.getValue().entities)
    expect(() =>
      validateChildrenUids(blocksStore.getValue().entities),
    ).not.toThrow()
    expect(rfdbRepo.getValue().editing?.uid).toMatchInlineSnapshot(`"x"`)
    // expect(diff(cur, next)).toMatchInlineSnapshot()
  })

  it('enterNewBlock, enterNewBlock, enterNewBlock', () => {
    /**
     *  a0
     *  - b1*
     *    - c3
     *       -d5
     *    - c4
     *    - c6
     *  - (x)
     *  - (y)
     *  - (z)
     *  - b2
     *
     */
    const cur = blocksStore.getValue().entities

    enterNewBlock(b1, 'x')
    enterNewBlock(getBlock('x'), 'y')
    enterNewBlock(getBlock('y'), 'z')

    const next = clean(blocksStore.getValue().entities)
    expect(() =>
      validateChildrenUids(blocksStore.getValue().entities),
    ).not.toThrow()
    expect(rfdbRepo.getValue().editing?.uid).toMatchInlineSnapshot(`"z"`)
    // expect(diff(cur, next)).toMatchInlineSnapshot()
  })
})

describe('enterSplitBlock()', () => {
  it('validate', () => {
    /**
     *  a0*
     *  - b1
     *    - c3
     *       -d5
     *    - c4
     *    - c6
     *  - b2
     *
     */
    expect(() =>
      enterSplitBlock(a0, 'x', 'value', 0, 'before'),
    ).toThrowErrorMatchingInlineSnapshot(
      `"[validatePosition] Location uid is a page, location must use title instead."`,
    )
  })

  it('enterSplitBlock', () => {
    /**
     *  a0
     *  - b1*
     *    - c3
     *       -d5
     *    - c4
     *    - c6
     *  - (x)
     *  - b2
     *
     */
    const cur = blocksStore.getValue().entities
    enterSplitBlock(c3, 'x', '12345', 0, 'before')
    const next = clean(blocksStore.getValue().entities)
    expect(() =>
      validateChildrenUids(blocksStore.getValue().entities),
    ).not.toThrow()
    expect(rfdbRepo.getValue().editing?.uid).toMatchInlineSnapshot(`"x"`)
    // expect(diff(cur, next)).toMatchInlineSnapshot()
  })

  // it('enterSplitBlock, enterSplitBlock, enterSplitBlock', () => {
  //   /**
  //    *  a0
  //    *  - b1*
  //    *    - c3
  //    *       -d5
  //    *    - c4
  //    *    - c6
  //    *  - (x)
  //    *  - (y)
  //    *  - (z)
  //    *  - b2
  //    *
  //    */
  //   const cur = blocksStore.getValue().entities

  //   events.enterSplitBlock(b1, 'x')
  //   events.enterSplitBlock(getBlock('x'), 'y')
  //   events.enterSplitBlock(getBlock('y'), 'z')

  //   const next = clean(blocksStore.getValue().entities)
  //   expect(() =>
  //     validateChildrenUids(blocksStore.getValue().entities),
  //   ).not.toThrow()
  //   expect(rfdbRepo.getValue().editing?.uid).toMatchInlineSnapshot(`"z"`)
  //   expect(diff(cur, next)).toMatchInlineSnapshot(`
  //     Object {
  //       "a0": Object {
  //         "childrenUids": Object {
  //           "1": "x",
  //           "2": "y",
  //           "3": "z",
  //           "4": "b2",
  //         },
  //       },
  //       "b2": Object {
  //         "order": 4,
  //       },
  //       "x": Object {
  //         "childrenUids": Array [],
  //         "open": true,
  //         "order": 1,
  //         "parentUid": "a0",
  //         "str": "",
  //         "uid": "x",
  //       },
  //       "y": Object {
  //         "childrenUids": Array [],
  //         "open": true,
  //         "order": 2,
  //         "parentUid": "a0",
  //         "str": "",
  //         "uid": "y",
  //       },
  //       "z": Object {
  //         "childrenUids": Array [],
  //         "open": true,
  //         "order": 3,
  //         "parentUid": "a0",
  //         "str": "",
  //         "uid": "z",
  //       },
  //     }
  //   `)
  // })
})
