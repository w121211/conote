import * as events from './events'
import { Block, BlockWithChildren } from './interfaces'
import { blockRepo } from './stores/block.repository'
import { rfdbRepo, rfdbStore } from './stores/rfdb.repository'
import { destructKeyDown, isShortcutKey } from './utils'

//
// Mouse events
//
//
//
//
//
//

function unfocus(event: globalThis.MouseEvent) {
  // const selectedItems = empty(subscribe('select-subs/items')),
  //   editingUid = subscribe('editing/uid'),
  const rfdb = rfdbStore.getValue(),
    selectedItems = rfdb.selectSubs?.items,
    editingUid = rfdb.editing?.uid,
    target = event.target as HTMLElement,
    closestBlock = target.closest('.block-content'),
    closestBlockHeader = target.closest('.block-header'),
    closestPageHeader = target.closest('.page-header'),
    closestBullet = target.closest('.anchor'),
    closestDropdown = target.closest('#dropdown-menu'),
    closest =
      closestBlock ?? closestBlockHeader ?? closestPageHeader ?? closestDropdown

  if (selectedItems && closestBullet === null) {
    // dispatch('select-events/clear')
  }
  if (closest === null && editingUid) {
    // dispatch('editing/uid', null)
    dispatch.editingUid('')
  }
}

//
// Keyboard events
//
//
//
//
//
//

/**
 * "When blocks are selected, handle various keypresses:
  - shift+up/down: increase/decrease selection.
  - enter: deselect and begin editing textarea
  - backspace: delete all blocks
  - up/down: change editing textarea
  - tab: indent/unindent blocks
  Can't use textarea-key-down from keybindings.cljs because textarea is no longer focused."
 */
export function multiBlockSelection(e: KeyboardEvent) {
  const selectedItems = rfdbRepo.getValue().selection.items

  if (selectedItems.length > 0) {
    const { shift, key } = destructKeyDown(e),
      enter = key === 'Enter',
      bksp = key === 'Backspace',
      tab = key === 'Tab',
      dlt = key === 'Delete',
      up = key === 'ArrowUp',
      down = key === 'ArrowDown',
      left = key === 'ArrowLeft',
      right = key === 'ArrowRight'

    if (enter) {
      events.editingUid(selectedItems[0])
      events.selectionClear()
    } else if (bksp || dlt) {
      events.selectionDelete()
      events.selectionClear()
    } else if (tab) {
      e.preventDefault()

      if (shift) {
        events.unindentMulti(selectedItems)
      } else {
        events.indentMulti(selectedItems)
      }
    } else if (shift && up) {
      events.selectedUp(selectedItems)
    } else if (shift && down) {
      events.selectedDown(selectedItems)
    } else if (up || down) {
      e.preventDefault()
      events.selectionClear()

      if (up) {
        events.up(selectedItems[0], 'end')
      } else {
        events.down(selectedItems[selectedItems.length - 1], 'end')
      }
    } else if (left || right) {
      e.preventDefault()
      events.selectionClear()

      if (left) {
        events.editingUid(selectedItems[0], 0)
      } else {
        events.editingUid(selectedItems[selectedItems.length - 1], 'end')
      }
    }
  }
}

/**
 * @athens key-down!
 *
 * If redo, use browser's native undo/redo first
 */
// export function editorKeyDown(event: globalThis.KeyboardEvent) {
export function hotkey(event: KeyboardEvent) {
  const dKeyDown = destructKeyDown(event),
    { key, ctrl, meta, shift, alt } = dKeyDown
  // editingUid = rfdbRepo
  // editingUid = subscribe('editing/uid')

  if (isShortcutKey(meta, ctrl)) {
    switch (key) {
      case 's':
        // save
        break
      case 'k':
        // open search-all panel
        break
      case 'z':
        // reado/undo
        if (shift) {
          events.historyRedo()
        } else {
          console.debug('editor undo()')
          events.historyUndo()
        }
        break
    }
  }
}

//
// Clipboard
//
//
//
//
//
//

/**
 * https://github.com/ryanguill/roam-tools/blob/eda72040622555b52e40f7a28a14744bce0496e5/src/index.js#L336-L345
 */
function unformatDoubleBrackets(s: string): string {
  throw new Error('Not implemented')
}

/**
 * Four spaces per depth level.
 */
function blocksToClipboardData(
  depth: number,
  block: BlockWithChildren,
  unformat = false,
): string {
  const { str, children } = block,
    leftOffset = '    '.repeat(depth),
    walkChildren = children.map(e =>
      blocksToClipboardData(depth++, e, unformat),
    ),
    // string_ = unformat ? unformatDoubleBrackets(str),
    dash = unformat ? '' : '- '
  return leftOffset + dash + str + '\n' + walkChildren
}

/**
 *   "If blocks are selected, copy blocks as markdown list.
  Use -event_ because goog events quirk "
 */
function copy(e: ClipboardEvent): void {
  const uids = rfdbRepo.getValue().selection.items

  if (uids.length > 0) {
    const copyData = uids
      .map(e => getReactiveBlockDocument(blockRepo))
      .map(e => blocksToClipboardData(0, e))
      .join()
    // clipboardData = e.event_.clipboardData,
    // copiedBlocks = mapv(() => {
    //   getInternalRepresentation(dsdb, [':block/uid', uids]), uids
    // })
    const { clipboardData } = e

    if (clipboardData) {
      clipboardData.setData('text/plain', copyData)
      clipboardData.setData(
        'application/athens-representation',
        prStr(copiedBlocks),
      )
      clipboardData.setData('application/athens', prStr({ uids }))
    }

    e.preventDefault()
  }
}

/**
 * Cut is essentially copy AND delete selected blocks
 */
function cut(e: ClipboardEvent) {
  const uids = rfdbRepo.getValue().selection.items
  if (uids.length > 0) {
    copy(e)
    events.selectionDelete()
  }

  // const uids = subscribe('::select-subs/items')
  // if (!empty(uids)) {
  //   copy(e)
  //   dispatch('::select-events/delete')
  // }
}

// const forceLeave = atom(false)

const preventSave = () => {
  window.addEventListener('beforeunload', e => {
    const synced = subscribe(':db/synced'),
      e2eIgnoreSave = localStorage.getItem('E2E_IGNORE_SAVE') === 'true'
    if (!synced && !forceLeave && !e2eIgnoreSave) {
      dispatch(
        ':confirm/js',
        "Athens hasn't finished saving yet. Athens is finished saving when the sync dot is green. " +
          'Try refreshing or quitting again once the sync is complete. ' +
          'Press Cancel to wait, or OK to leave without saving (will cause data loss!).',
        () => {
          reset(forceLeave, true)
          window.close()
        },
      )
      e.preventDefault()
      e.returnValue =
        'Setting e.returnValue to string prevents exit for some browsers.'
      return 'Returning a string also prevents exit on other browsers.'
    }
  })
}

// function init() {
//   document.addEventListener('mousedown', unfocus)
//   window.addEventListener('keydown', multiBlockSelection)
//   window.addEventListener('keydown', keyDown)
//   window.addEventListener('copy', copy)
//   window.addEventListener('cut', cut)
// }
