import React from 'react'
import { nanoid } from 'nanoid'
import { Block, Doc } from './interfaces'
import { cloneDeepWith } from 'lodash'
import { getBlock } from './stores/block.repository'
import { docRepo } from './stores/doc.repository'

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

/**
 * Recusively find the root of the given block (should be a doc-block) and returns its doc.
 */
export function getDocByBlock(blockUid: string): Doc {
  console.log(blockUid)
  let cur = getBlock(blockUid)
  while (cur.parentUid !== null) {
    cur = getBlock(cur.parentUid)
  }
  if (cur.docSymbol === undefined)
    throw new Error('[getRootBlock] Root block should have a doc symbol')

  const doc = docRepo.findDoc(cur.docSymbol)
  if (doc === null)
    throw new Error(
      '[getRootBlock] Doc is not found by the symbol of doc-block',
    )
  return doc
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
