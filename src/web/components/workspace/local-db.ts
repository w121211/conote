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

const TABLE_NAME = {
  doc: 'table-doc',
  workspace: 'table-workspace',
}

export const LocalDBService = {
  docTable: localforage.createInstance({
    name: DB_NAME,
    storeName: TABLE_NAME.doc,
  }),

  workspaceTable: localforage.createInstance({
    name: DB_NAME,
    storeName: TABLE_NAME.workspace,
  }),

  async drop(): Promise<void> {
    // await localforage.dropInstance({
    //   name: DB_NAME,
    //   storeName: TABLE_NAME.doc,
    // })
    const promises = Object.entries(TABLE_NAME).map(([k, v]) =>
      localforage.dropInstance({
        name: DB_NAME,
        storeName: v,
      }),
    )
    await Promise.all(promises)
  },
}
