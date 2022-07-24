import { Block } from '../interfaces'
import { validateChildrenUids } from '../op/helpers'
import { genBlockUid } from '../utils'

export type BlockInput = [string, BlockInput[]] | string

//
// Templates
//
//
//
//
//
//

export const blankLines: BlockInput = [
  'DUMMY_ROOT',
  ['', '', '', '', '', '', '', '', '', '', '', ''],
]

//
//
//
//
//
//
//
//

/**
 * @param opts.docBlock If given, use it to replace input's root
 * @param opts.docSymbol If given, use it to replace input's root title
 * @returns Block array, the first block is doc-block
 */
export function writeBlocks(
  input: BlockInput,
  opts: {
    docBlock?: Block
    docSymbol?: string
  } = {},
): Block[] {
  function f(input: BlockInput, order = 0, parentUid: string | null = null) {
    const [str, children] = typeof input === 'string' ? [input, []] : input
    return {
      uid: genBlockUid(),
      str,
      order,
      parentUid,
      children,
    }
  }

  const { docBlock, docSymbol } = opts,
    rootInput = f(input)

  let rootInput_ = rootInput
  if (docBlock) {
    rootInput_ = {
      ...rootInput,
      uid: docBlock.uid,
      str: docBlock.str,
    }
  } else if (docSymbol) {
    rootInput_ = {
      ...rootInput,
      str: docSymbol,
    }
  }

  const blocks: Block[] = [],
    stack: {
      uid: string
      str: string
      order: number
      parentUid: string | null
      children?: BlockInput[]
    }[] = [rootInput_]

  while (stack.length > 0) {
    const shift = stack.shift()

    if (shift) {
      const { uid, str, order, parentUid, children } = shift,
        children_ = children ? children.map((e, i) => f(e, i, uid)) : [],
        childrenUids = children_.map(e => e.uid),
        docSymbol = parentUid === null ? str : undefined

      children_.forEach(e => stack.push(e))
      blocks.push({
        uid,
        str,
        order,
        parentUid,
        childrenUids,
        docSymbol,
        open: true,
      })
    }
  }

  validateChildrenUids(Object.fromEntries(blocks.map(e => [e.uid, e])))

  return blocks
}
