import { createStore, Reducer, setProp, withProps } from '@ngneat/elf'
import {
  getEntity,
  selectEntity,
  selectManyByPredicate,
  withEntities,
} from '@ngneat/elf-entities'
import { stateHistory } from '@ngneat/elf-state-history'
import { map, Observable } from 'rxjs'
import type { Block, CursorProp } from '../interfaces'

type BlocksStoreState = {
  entities: Record<string, Block>
  ids: string[]
}

export type BlockReducer = Reducer<BlocksStoreState & CursorProp>

export type BlockReducerFn = () => BlockReducer[]

//
// Store & Getters
//
//
//
//
//
//

export const blocksStore = createStore(
  { name: 'blocksStore' },
  withEntities<Block, 'uid'>({ idKey: 'uid' }),
  withProps<CursorProp>({ cursor: null }),
)

const blocksStateHistory = stateHistory(blocksStore)

export function getBlock(uid: string): Block {
  const block = blocksStore.query(getEntity(uid))

  if (block === undefined) {
    console.error(uid)
    throw new Error('[getBlock] Block not found: ' + uid)
  }
  return block
}

export function getBlockChildren(uid: string): Block[] {
  // return blocksStore.query(getAllEntitiesApply({ filterEntity: e => e.parentUid === uid }))
  const block = getBlock(uid),
    children = block.childrenUids.map(e => getBlock(e))
  return children
}

// export function getBlockAndChildren(uid: string): Block {
// }

class BlockRepository {
  undo() {
    // console.log(blocksStateHistory.hasPast)
    blocksStateHistory.undo()
  }

  redo() {
    blocksStateHistory.redo()
  }

  clearHistory() {
    blocksStateHistory.clear()
  }

  getBlockWithChildren(uid: string) {
    return getBlock(uid)
  }

  getBlock$(uid: string) {
    return blocksStore.pipe(
      selectEntity(uid),
      // tap(v => console.log(`${uid} -> ${v ? v.uid + '-' + v.str : v}`)),
    )
  }

  getBlockChildren$(uid: string): Observable<Block[]> {
    // const children$ = blocksStore.pipe(selectManyByPredicate(e => e.parentUid === uid))
    // return this.getBlock$(uid).pipe(
    //   combineLatestWith(children$),
    //   map(([block, children]) => {
    //     return block ? { ...block, children } : undefined
    //   }),
    // )
    // if (uid === undefined) {
    //   return of([])
    // }
    return blocksStore.pipe(
      selectManyByPredicate(e => e.parentUid === uid),
      map(e => {
        e.sort((a, b) => a.order - b.order)
        return e
      }),
    )
  }

  getCursor(): CursorProp['cursor'] {
    return blocksStore.getValue().cursor
  }

  update(reducers: BlockReducer[], cursor?: CursorProp['cursor']) {
    if (cursor !== undefined) {
      reducers.push(setProp('cursor', cursor))
    }
    blocksStore.update(...reducers)
  }

  /**
   * Execute each op one-after-one instead of a single batch
   *
   * TODO: undo/redo
   */
  updateChain(chainOpFns: BlockReducerFn[], cursor?: CursorProp['cursor']) {
    chainOpFns.forEach((e, i) => {
      const isFirst = i === 0,
        isLast = i === chainOpFns.length - 1

      if (isFirst) blocksStateHistory.pause()
      if (isLast) blocksStateHistory.resume()

      if (isLast && cursor !== undefined) {
        blocksStore.update(...e(), setProp('cursor', cursor))
      } else {
        blocksStore.update(...e())
      }
    })
  }
}

export const blockRepo = new BlockRepository()
