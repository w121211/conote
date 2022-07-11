/**
 * Code referenced from
 * https://github.com/ngneat/elf/blob/master/packages/state-history/src/lib/state-history.spec.ts
 *
 */
import { createStore, setProp, Store, withProps } from '@ngneat/elf'
import {
  addEntities,
  setEntities,
  updateEntities,
  withEntities,
} from '@ngneat/elf-entities'
import { stateHistory } from '@ngneat/elf-state-history'
import { inspect } from 'util'

interface Entity {
  id: number
  str: string
}

interface Props {
  count: number
}

function eq(store: Store, entities: Entity[], props?: Props) {
  expect(store.getValue().entities).toEqual(
    Object.fromEntries(entities.map(e => [e.id, e])),
  )

  if (props) {
    const value = store.getValue()
    Object.entries(props).forEach(([k, v]) => {
      expect(value[k]).toEqual(v)
    })
  }
}

function e(id: number, str: string): Entity {
  return { id, str }
}

describe('stateHistory', () => {
  const e1 = e(1, '1'),
    e2 = e(2, '2'),
    e3 = e(3, '3')

  it('batch update', () => {
    const store = createStore(
        { name: '' },
        withEntities<Entity>({ initialValue: [] }),
      ),
      history = stateHistory(store)

    eq(store, [])

    store.update(addEntities(e1), addEntities(e2))
    store.update(addEntities(e3))

    history.undo()
    eq(store, [e1, e2])

    history.undo()
    eq(store, [])

    history.undo()
    eq(store, [])

    history.redo()
    eq(store, [e1, e2])

    history.redo()
    eq(store, [e1, e2, e3])

    history.redo()
    eq(store, [e1, e2, e3])
  })

  it('consequence update with pause/resume', () => {
    const store = createStore(
        { name: '' },
        withEntities<Entity>({ initialValue: [] }),
      ),
      history = stateHistory(store)

    eq(store, [])

    store.update(addEntities(e1))
    eq(store, [e1])

    history.pause()

    store.update(updateEntities(e1.id, { str: '1a' }))
    store.update(updateEntities(e1.id, { str: '1aa' }))

    // resume need to place before the last op
    history.resume()

    store.update(updateEntities(e1.id, { str: '1aaa' }))

    history.undo()
    eq(store, [e1])

    history.undo()
    eq(store, [])
  })

  it('undo/redo store mix entities and props', () => {
    const store = createStore(
        { name: '' },
        withEntities<Entity>({ initialValue: [] }),
        withProps<Props>({ count: 0 }),
      ),
      history = stateHistory(store)

    eq(store, [], { count: 0 })

    // Update entities but not props

    store.update(addEntities(e1))
    eq(store, [e1], { count: 0 })

    history.undo()
    eq(store, [], { count: 0 })

    history.redo()
    eq(store, [e1], { count: 0 })

    // Update entities and props

    store.update(addEntities([e2]), setProp('count', 1))
    eq(store, [e1, e2], { count: 1 })

    history.undo()
    eq(store, [e1], { count: 0 })

    history.redo()
    eq(store, [e1, e2], { count: 1 })

    history.undo()
    eq(store, [e1], { count: 0 })

    // Pause

    history.pause()

    store.update(updateEntities(e1.id, { str: '1a' }), setProp('count', 2))
    store.update(updateEntities(e1.id, { str: '1aa' }))

    // Resume need to place before the last op
    history.resume()

    store.update(updateEntities(e1.id, { str: '1aaa' }))
    eq(store, [{ ...e1, str: '1aaa' }], { count: 2 })

    history.undo()
    eq(store, [e1], { count: 0 })

    history.undo()
    eq(store, [], { count: 0 })
  })
})
