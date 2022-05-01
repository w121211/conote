import React from 'react'
import { nanoid } from 'nanoid'
import { Block } from './interfaces'
import { validateChildrenUids } from './op/helpers'

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
export function escapeStr() {}

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
  return block.docTitle !== undefined && block.parentUid === null
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
 * @param docBlock if given, use it to replace input's root
 * @returns block array, the first block is doc-block
 */
export function writeBlocks(input: BlockInput, docBlock?: Block): Block[] {
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

  const rootInput = f(input),
    rootInput_ = docBlock
      ? {
          ...rootInput,
          uid: docBlock.uid,
          str: docBlock.str,
        }
      : rootInput

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
        docTitle = parentUid === null ? str : undefined

      children_.forEach(e => stack.push(e))
      blocks.push({
        uid,
        str,
        order,
        parentUid,
        childrenUids,
        docTitle,
        open: true,
      })
    }
  }

  validateChildrenUids(Object.fromEntries(blocks.map(e => [e.uid, e])))

  return blocks
}
