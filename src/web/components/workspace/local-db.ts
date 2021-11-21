import localforage from 'localforage'

const DB_NAME = 'conote-database'

const TABLE_NAME: Record<string, string> = {
  doc: 'table-doc',
  docCommitted: 'table-doc-committed',
  workspace: 'table-workspace',
}

export const LocalDBService = {
  docTable: localforage.createInstance({
    name: DB_NAME,
    storeName: TABLE_NAME.doc,
  }),

  docCommittedTable: localforage.createInstance({
    name: DB_NAME,
    storeName: TABLE_NAME.committedDoc,
  }),

  workspaceTable: localforage.createInstance({
    name: DB_NAME,
    storeName: TABLE_NAME.workspace,
  }),

  async drop(): Promise<void> {
    const promises = Object.entries(TABLE_NAME).map(([, v]) =>
      localforage.dropInstance({
        name: DB_NAME,
        storeName: v,
      }),
    )
    await Promise.all(promises)
  },
}
