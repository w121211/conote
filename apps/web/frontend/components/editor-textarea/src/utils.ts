import { cloneDeepWith, isNil } from 'lodash'
import { nanoid } from 'nanoid'
import type React from 'react'
import type { Block } from './interfaces'

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

// export const classnames = (...classes) => classes.filter(Boolean).join(' ')

// TODO: Not used -> remove?
// export const DOMRoot = document.querySelector('body')

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
// Block
//
//
//
//
//
//
//

/**
 * TODO: ensure decentralized client's block-uid will not conflict @eg include user-id as part of id?
 *
 */
export function genBlockUid(): string {
  return nanoid()
}

export function genDocUid(): string {
  return nanoid()
}

export function isDocBlock(block: Block): boolean {
  return block.docSymbol !== undefined && block.parentUid === null
}

/**
 * Exaustively check every block's children-uids is matching the children's parent
 *
 * @param dict key: block-uid, value: block
 *
 */
export function validateChildrenUids(dict: Record<string, Block>): void {
  Object.entries(dict).forEach(([k, v]) => {
    const { childrenUids, uid } = v

    childrenUids.forEach((e, i) => {
      const child = dict[e]

      if (child === undefined) {
        console.error(dict, childrenUids, child)
        throw new Error(
          '[validateChildrenUids] child not found by children-uid',
        )
      }
      if (child.parentUid !== uid) {
        console.error(dict, childrenUids, child)
        throw new Error(
          "[validateChildrenUids] children-uids not match child's parent-uid",
        )
      }
      if (child.order !== i) {
        console.error(dict, childrenUids, child)
        throw new Error(
          "[validateChildrenUids] children-uids not match child's order",
        )
      }
    })
  })

  // Reverse check
  Object.entries(dict).forEach(([k, v]) => {
    const { parentUid, order, uid } = v,
      parent = parentUid ? dict[parentUid] : null

    if (parent) {
      if (parent.childrenUids[order] !== uid) {
        console.error(dict, parent, v)
        throw new Error(
          "[validateChildrenUids] child's parent-uid, order not match children-uids",
        )
      }
    }
  })

  // Check orphans
}
