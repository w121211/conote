import React from 'react'
import { nanoid } from 'nanoid'
import { Block } from './interfaces'
import { validateChildrenUids } from './op/helpers'
import { cloneDeepWith } from 'lodash'

//
// OS
//
//
//
//
//
//
//

function getOS() {
  if (typeof window !== 'undefined') {
    const os = window.navigator.appVersion
    if (os.includes('Windows')) return 'Windows'
    if (os.includes('Linux')) return 'Linux'
    if (os.includes('Mac')) return 'Mac'
  }
  return 'Others'
}

export function isShortcutKey(meta: boolean, ctrl: boolean) {
  const os = getOS()
  if (os === 'Mac' && meta) return true
  if (os === 'Windows' && ctrl) return true
  if (os === 'Linux' && ctrl) return true
  if (os === 'Others' && ctrl) return true
  return false
}

//
// DOM
//
//
//
//
//
//
//

export function destructKeyDown(e: React.KeyboardEvent | KeyboardEvent) {
  const {
    key,
    keyCode,
    altKey: alt,
    ctrlKey: ctrl,
    metaKey: meta,
    shiftKey: shift,
  } = e
  return { key, keyCode, alt, ctrl, meta, shift }
}

export function getDatasetUid(el: HTMLElement): string {
  const block = el.closest('.block-container'),
    uid = block && block.getAttribute('data-uid')

  if (uid === null) {
    throw new Error('uid === null')
  }
  return uid
}

export function getDatasetChildrenUid(el: HTMLElement): string[] | null {
  const block = el.closest('.block-container'),
    childrenuids = block && block.getAttribute('data-childrenuids')?.split(',')

  console.debug(block)
  return childrenuids ?? null
}

/**
 * "Finds offset between mouse event and container. If container is not passed, use target as container."
 */
export function mouseOffset(event: React.DragEvent, container: Element) {
  const rect = container.getBoundingClientRect(),
    offsetX = event.pageX - rect.left,
    offsetY = event.pageY - rect.top
  return { x: offsetX, y: offsetY }
}

export function verticalCenter(el: Element) {
  const rect = el.getBoundingClientRect(),
    y = (rect.bottom - rect.top) / 2
  return y
}

//
// Regex
//
//
//
//
//
//
//

/**
 * Take a string and escape all regex special characters in it
 */
export function escapeStr() {
  throw new Error('Not implemented')
}

//
// Block helpers
//
//
//
//
//
//
//

export function isDocBlock(block: Block): boolean {
  return block.docSymbol !== undefined && block.parentUid === null
}

/**
 * TODO: ensure decentralized client's block-uid will not conflict @eg include user-id as part of id?
 *
 */
export function genBlockUid(): string {
  return nanoid()
}

export type BlockInput = [string, BlockInput[]] | string

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

//
// Graphql
//
//
//
//
//
//
//

/**
 * Recursively omit '__typename' of the given value
 */
export function omitTypenameDeep(
  value: Record<string, unknown>,
): Record<string, unknown> {
  return cloneDeepWith(value, v => {
    if (v?.__typename) {
      const { __typename, ...rest } = v
      return omitTypenameDeep(rest)
    }
    return undefined
  })
}
