import localforage from 'localforage'

// export const tableOne = localforage.createInstance({
//   name: dbName,
//   storeName: 'tableOne',
// })

// export const tableTwo = localforage.createInstance({
//   name: dbName,
//   storeName: 'tableTwo',
// })

// export const dropDatabase = () => {
//   localforage.dropInstance({
//     name: dbName,
//     storeName: 'tableOne',
//   })
// }

// const docTable = localforage.createInstance({
//   name: dbName,
//   storeName: 'docTable',
// })

// const dropDatabase = (): void => {
//   localforage.dropInstance({
//     name: dbName,
//     storeName: 'docTable',
//   })
// }

const DB_NAME = 'conote-database'

const DOC_TABLE_NAME = 'table-doc'

export const LocalDBService = {
  docTable: localforage.createInstance({
    name: DB_NAME,
    storeName: DOC_TABLE_NAME,
  }),

  async drop(): Promise<void> {
    await localforage.dropInstance({
      name: DB_NAME,
      storeName: DOC_TABLE_NAME,
    })
    const a = await this.docTable.getItem('BBB')
    console.log(a)

    // this.tableOne = localforage.createInstance({
    //   name: DB_NAME,
    //   storeName: DOC_TABLE_NAME,
    // })
  },
}
