import { difference, intersection, union } from 'lodash'
import {
  blockSave,
  editingTarget,
  mouseDownSet,
  mouseDownUnset,
  selectionClear,
  selectionSetItems,
} from '../events'
import { DestructTextareaKeyEvent } from '../interfaces'
import { getBlock } from '../stores/block.repository'
import { rfdbRepo } from '../stores/rfdb.repository'
import { getDatasetChildrenUid, getDatasetUid } from '../utils'

export function getDescendantsUids(
  candidateUids: string[],
  uids_childrenUids: Record<string, string[] | null>,
) {
  let descendants: string[] = []
  const stack = [...candidateUids]

  while (stack.length > 0) {
    const uid = stack.shift()
    if (uid === undefined) break

    // childrenUids can be undefined if not found
    const childrenUids = uids_childrenUids[uid]
    if (childrenUids) {
      descendants = descendants.concat(childrenUids)
      childrenUids.forEach(e => stack.push(e))
    }
  }

  return descendants
}

/**
 * "Used by both shift-click and click-drag for multi-block-selection.
  Given a mouse event, a source block, and a target block, highlight blocks.
  Find all blocks on the page using the DOM.
  Determine if direction is up or down.
  Algorithm: call select-up or select-down until start and end of vector are source and target.

  Bug: there isn't an algorithmic path for all pairs of source and target blocks, because sometimes the parent is
  highlighted, meaning a child block might not be selected itself. Rather, it inherits selection from parent.

  e.g.: 1 and 3 as source and target, or vice versa.
  • 1
  • 2
   • 3
  Because of this bug, add additional exit cases to prevent stack overflow."
 */
export function findSelectedItems(
  e: React.MouseEvent<HTMLTextAreaElement>,
  sourceUid: string,
  targetUid: string,
) {
  const { currentTarget: target } = e,
    page = target.closest('.node-page') ?? target.closest('.block-page')

  if (page) {
    const qBlockEls = page.querySelectorAll<HTMLElement>('.block-container'),
      blockEls = [...qBlockEls],
      uids = blockEls.map(e => getDatasetUid(e)),
      childrenUids = blockEls.map(e => getDatasetChildrenUid(e)),
      uids_childrenUids = Object.fromEntries(
        uids.map<[string, string[] | null]>((e, i) => [e, childrenUids[i]]),
      ),
      indexedUids = uids.map<[number, string]>((e, i) => [i, e]),
      startIndex = indexedUids.find(([_, uid]) => sourceUid === uid)?.[0],
      endIndex = indexedUids.find(([_, uid]) => targetUid === uid)?.[0]

    if (startIndex !== undefined && endIndex !== undefined) {
      const candidateUids = indexedUids
          .filter(
            ([i, uid]) =>
              Math.min(startIndex, endIndex) <= i &&
              i <= Math.max(startIndex, endIndex),
          )
          .map(e => e[1]),
        descendantsUids = getDescendantsUids(candidateUids, uids_childrenUids),
        selectedUids = rfdbRepo.getValue().selection.items,
        toRemoveUids = intersection(selectedUids, descendantsUids),
        selectionNewUids = difference(candidateUids, descendantsUids),
        newSelectedUids = union(
          difference(selectedUids, toRemoveUids),
          selectionNewUids,
        ),
        selectionOrder = indexedUids
          .filter(([, v]) => newSelectedUids.includes(v))
          .map(([, v]) => v)

      // console.debug(
      //   indexedUids,
      //   candidateUids,
      //   selectedUids,
      //   toRemoveUids,
      //   selectionNewUids,
      // )

      if (selectionOrder) {
        selectionSetItems(selectionOrder)
      }
    }
  }
}

/**
 * "Clipboard data can only be accessed if user triggers JavaScript paste event.
  Uses previous keydown event to determine if shift was held, since the paste event has no knowledge of shift key.

  Image Cases:
  - items N=1, image/png
  - items N=2, text/html and image/png
  For both of these, just write image to filesystem. Roam behavior is to copy the <img> src and alt of the copied picture.
  Roam's approach is useful to preserve the original source url and description, but is unsafe in case the link breaks.
  Writing to filesystem (or to Firebase a la Roam) is useful, but has storage costs.
  Writing to filesystem each time for now until get feedback otherwise that user doesn't want to save the image.
  Can eventually become a setting.

  Plaintext cases:
  - User pastes and last keydown has shift -> default
  - User pastes and clipboard data doesn't have new lines -> default
  - User pastes without shift and clipboard data has new line characters -> PREVENT default and convert to outliner blocks"
 */
// export function textareaPaste(
//   e: React.ClipboardEvent<HTMLTextAreaElement>,
//   lastKeyDown: DestructTextareaKeyEvent | null,
// ) {
//   const data = e.clipboardData

//   if (data) {
//     const textData = data.getData('text/plain'),
//       internalRepresentation = JSON.parse(
//         data.getData('application/athens-representation'),
//       ),
//       lineBreaks = reFind(/\r?\n/, textData)

//     if (internalRepresentation && Array.isArray(internalRepresentation)) {
//       // With internal representation
//       // internal = internalRepresentation ,
//       // newUids = newUidsMap(internalPresentation),
//       // reprWithNewUids = updateUids(internalPresentation, newUids),
//       e.preventDefault()
//       // dispatchEvent('paste-internal', uid, state.string.local, reprWithNewUids)
//       events.pasteInternal()
//     } else if (seq(filter())) {
//       // images in clipboard
//       // items = arraySeq(e.clipboardData.items),
//       // { head, tail } = destructTarget(e.target),
//       // imgRegex = /#"(?i)^image\/(p?jpeg|gif|png)$"/,
//       // callback = () => {},
//       // For images
//     } else if (lineBreaks && !lastKeyDown.shift) {
//       // external to internal representation
//       // textToInter = textData !== '' && textToInternalPresentation(textData),
//       // lineBreaks = reFind(/\r?\n/, textData),
//       // noShift = state.lastKeydown !== 'shift'
//       e.preventDefault()
//       dispatchEvent('paste-internal', uid, state.string.local, textToInter)
//     } else if (noShift) {
//       e.preventDefaul()
//       dispatchEvent('paste-verbatim', uid, textData)
//     }
//   }
// }

export function textareaBlur(
  event: React.ChangeEvent<HTMLTextAreaElement>,
  uid: string,
) {
  // If the doc has only one block and got deleted, it will call textareaBlur.
  //  Because the block is alredy deleted, the block not found error need to be catched
  try {
    getBlock(uid)
    blockSave(uid, event.currentTarget.value)
  } catch (err) {
    console.debug('textareaBlur')
    console.debug(err)
  }
}

export function textareaChange(
  event: React.ChangeEvent<HTMLTextAreaElement>,
  uid: string,
  // state: BlockElState,
  // setState: BlockElStateSetFn,
  // state: BlockElState,
  // setState: BlockElStateSetFn,
  // setStr: (s: string) => void,
  setLocalStr: (s: string) => void,
) {
  // setState({
  //   ...state,
  //   str: { ...state.str, local: event.target.value },
  // })
  // if (state.str.idleFn) {
  //   state.str.idleFn()
  // }

  // setStr(event.currentTarget.value)
  // events.blockSave(uid, event.currentTarget.value)
  setLocalStr(event.currentTarget.value)
}

/**
 * "If shift key is held when user clicks across multiple blocks, select the blocks."
 */
export function textareaClick(
  e: React.MouseEvent<HTMLTextAreaElement>,
  targetUid: string,
): void {
  const { shiftKey: shift } = e,
    sourceUid = rfdbRepo.getValue().editing?.uid

  if (shift && sourceUid && sourceUid !== targetUid) {
    findSelectedItems(e, sourceUid, targetUid)
  } else {
    selectionClear()
  }
}

function globalMouseup() {
  document.removeEventListener('mouseup', globalMouseup)
  mouseDownUnset()
}

/**
 * * "Attach global mouseup listener. Listener can't be local because user might let go of mousedown off of a block.
    See https://javascript.info/mouse-events-basics#events-order"
 *
 */
export function textareaMouseDown(e: React.MouseEvent<HTMLTextAreaElement>) {
  e.stopPropagation()

  if (!e.shiftKey) {
    editingTarget(e.currentTarget)

    const { mouseDown } = rfdbRepo.getValue()
    if (!mouseDown) {
      mouseDownSet()
      document.addEventListener('mouseup', globalMouseup)
    }
  }
}

/**
 * "When mouse-down, user is selecting multiple blocks with click+drag.
    Use same algorithm as shift-enter, only updating the source and target."
 * 
 * @bug firefox, when mouse is down, 
 *      onMouseEnter event won't fire and jamed until mouse is up
 */
export function textareaMouseEnter(
  e: React.MouseEvent<HTMLTextAreaElement>,
  targetUid: string,
) {
  const {
    editing: { uid: sourceUid },
    mouseDown,
  } = rfdbRepo.getValue()

  if (mouseDown && sourceUid) {
    selectionClear()
    findSelectedItems(e, sourceUid, targetUid)
  }
}

/**
 * When textarea unmount, save local string to block
 */
export function textareaUnmount(uid: string, localStr: string) {
  // console.debug('textareaUnmount')
  blockSave(uid, localStr)
}
