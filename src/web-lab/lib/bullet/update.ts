/**
 * doc {cur: [], fromState: [], updates: []} ->
 *
 * doc + updates -> validate updates, apply updates, create bullets/stream -> next-doc
 *
 * const doc = new Doc(state)
 * doc.getMap('')
 */

const doc = new Doc(state)
doc.set({})
doc.children.insert(0, { abc })
