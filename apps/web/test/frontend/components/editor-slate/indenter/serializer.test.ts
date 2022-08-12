import { treeUtil } from '@conote/docdiff'
import { Node } from 'slate'
import {
  blocksToIndenters,
  indentersToBlocks,
} from '../../../../../frontend/components/editor-slate/src/indenter/serializers'
import { ElementIndenter } from '../../../../../frontend/components/editor-slate/src/interfaces'
import { Block } from '../../../../../frontend/components/editor-textarea/src/interfaces'
import { mockDocBlock_contentBlocks } from '../../../../../frontend/components/editor-textarea/test/__mocks__/mock-block'

// function c(d: ElementIndenter) {
//   const { indent, blockCopy } = d
//   return { str: Node.string(d), indent, order: blockCopy?.order }
// }

/**
 * - a
 *   - b
 *     - c
 *     - d
 *       - e
 *   - f
 * - g
 */
const _mockIndenters: [string, number][] = [
  ['a', 0],
  ['b', 1],
  ['c', 2],
  ['d', 2],
  ['e', 3],
  ['f', 1],
  ['g', 0],
]
const mockIndenters: ElementIndenter[] = _mockIndenters.map(
  ([uid, indent]): ElementIndenter => ({
    type: 'indenter',
    children: [{ text: uid }],
    uid,
    indent,
  }),
)

it('blocksToIndenters', () => {
  const blocks = indentersToBlocks(mockIndenters, 'root').map(e => ({
      ...e,
      childrenUids: [],
    })),
    root: Block = {
      uid: 'root',
      parentUid: null,
      childrenUids: [],
      order: 0,
      str: 'root',
    }

  console.debug(blocks)

  const [_rootIndenter, ...indenters] = blocksToIndenters([root, ...blocks])

  console.debug(indenters)

  for (let i = 0; i < mockIndenters.length; i++) {
    const start = mockIndenters[i],
      { blockCopy, ...final } = indenters[i]

    expect(final).toEqual(start)
  }
})

it('indentersToBlocks()', () => {
  const [root, ...indenters] = blocksToIndenters(mockDocBlock_contentBlocks)
  const blocks = indentersToBlocks(indenters, root.uid)

  expect(() => {
    treeUtil.validateList(
      treeUtil.toTreeNodeBodyList([mockDocBlock_contentBlocks[0], ...blocks]),
    )
  }).not.toThrow()

  for (const e of blocks) {
    const src = mockDocBlock_contentBlocks.find(a => a.uid === e.uid)

    expect(src).not.toBeUndefined()

    if (src) {
      const { childrenUids, open, docSymbol, ...rest } = src
      // console.debug(e, { ...rest })
      // expect({ ...rest }).toEqual(e)
      expect(e).toEqual({ ...rest })
    }
  }
})
