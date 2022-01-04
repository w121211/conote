import * as localforage from 'localforage'

const DB_NAME = 'conote-client-database'

const TABLE_NAME = {
  docTable: 'doc-table',
  committedDocTable: 'committed-doc-table',
  // workspace: 'table-workspace',
}

export const LocalDatabaseService = {
  docTable: localforage.createInstance({
    name: DB_NAME,
    storeName: TABLE_NAME.docTable,
  }),

  committedDocTable: localforage.createInstance({
    name: DB_NAME,
    storeName: TABLE_NAME.committedDocTable,
  }),

  // workspaceTable: localforage.createInstance({
  //   name: DB_NAME,
  //   storeName: TABLE_NAME.workspace,
  // }),

  async dropAll(): Promise<void> {
    const promises = Object.entries(TABLE_NAME).map(([, v]) =>
      localforage.dropInstance({
        name: DB_NAME,
        storeName: v,
      }),
    )
    await Promise.all(promises)
  },
}
