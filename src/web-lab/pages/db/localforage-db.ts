import localforage from 'localforage'

const dbName = 'conoteDatabase'

export const tableOne = localforage.createInstance({
  name: dbName,
  storeName: 'tableOne',
})

export const tableTwo = localforage.createInstance({
  name: dbName,
  storeName: 'tableTwo',
})

export const dropDatabase = () => {
  localforage.dropInstance({
    name: dbName,
    storeName: 'tableOne',
  })
}
