import Head from 'next/head'
import * as Y from 'yjs'

const testDoc = () => {
  const doc = new Y.Doc()

  doc.getArray('array').insert(0, ['1 hello 哈囉'])
  doc.getArray('array').insert(0, ['2 hello 哈囉'])
  doc.getArray('array').insert(0, ['3 hello 哈囉'])

  // const stateVector1 = Y.encodeStateVector(doc)
  // console.log(stateVector1)
  // console.log(Y.decodeStateVector(stateVector1))
  console.log(doc)

  const diff1 = Y.encodeStateAsUpdate(doc)
  console.log(diff1)

  const doc2 = new Y.Doc({ gc: false })
  const snap1 = Y.snapshot(doc2)
  const snapEncoded1 = Y.encodeSnapshot(snap1)
  const docRestored1 = Y.createDocFromSnapshot(
    doc2,
    Y.decodeSnapshot(snapEncoded1)
  )
  console.log(docRestored1.getArray('array').toJSON())

  Y.applyUpdate(doc2, diff1)

  const snap2 = Y.snapshot(doc2)
  const snapEncoded = Y.encodeSnapshot(snap2)
  console.log(snapEncoded)

  const docRestored = Y.createDocFromSnapshot(
    doc2,
    Y.decodeSnapshot(snapEncoded)
  )
  // const restored = docRestored.getArray('array').toArray()

  console.log(docRestored.getArray('array').toJSON())
  // const snap = Y.snapshot(doc)
  // console.log(snap)

  // const docRestored = Y.createDocFromSnapshot(doc, snap)
  // const restored = docRestored.getArray('array').toArray()
  // console.log(restored)
  // console.log(restored.toJSON())

  // const yarray = doc.getArray('my-array')
  // yarray.observe((event) => {
  //   console.log('yarray was modified')
  // })

  // yarray.insert(0, ['val']) // => "yarray was modified"

  // const state1 = Y.encodeStateAsUpdate(doc)
  // console.log(state1)

  // const permanentUserData = new Y.PermanentUserData(ydoc)
  // permanentUserData.setUserMapping(ydoc, ydoc.clientID, user.username)
  // ydoc.gc = false
  // const yXmlFragment = ydoc.get('prosemirror', Y.XmlFragment)
  // const versions = doc.getArray('versions')
  // const prevVersion = versions.length === 0 ? null : versions.get(versions.length - 1)
  // const prevSnapshot = prevVersion === null ? Y.emptySnapshot : Y.decodeSnapshot(prevVersion.snapshot)
  // const snapshot = Y.snapshot(doc)
  // if (prevVersion != null) {
  //   // account for the action of adding a version to ydoc
  //   prevSnapshot.sv.set(prevVersion.clientID, /** @type {number} */ (prevSnapshot.sv.get(prevVersion.clientID)) + 1)
  // }
  // if (!Y.equalSnapshots(prevSnapshot, snapshot)) {
  //   versions.push([{
  //     date: new Date().getTime(),
  //     snapshot: Y.encodeSnapshot(snapshot),
  //     clientID: doc.clientID
  //   }])
  // }
}

export const Yjs = (): JSX.Element => {
  testDoc()
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main></main>
    </div>
  )
}
export default Yjs
