import { NodeBody, TreeNode, TreeService } from '@conote/docdiff'
import { Doc } from './doc'

export type DocIndex = {
  cid: string // client side temporary id
  symbol: string
  // symbolType: SymType
  title?: string // webpage-note use title instead of symbol
  noteId?: string // 'undefined' refers to a new note
  // sourceNoteId?: string
  commitId?: string
  createdAt: number // doc created time, for sorting
  updatedAt: number // doc updated time
  parentCid?: string
}

export const DocIndexService = {
  /**
   * Flatten tree depth = 2
   *
   */
  _flattenDepth(rootChildren: TreeNode<DocIndex>[]): TreeNode<DocIndex>[] {
    for (const node of rootChildren) {
      const flattenChildren = TreeService.toList<DocIndex>(node.children)
      for (const e of flattenChildren) {
        e.parentCid = node.cid
      }
    }
    const nodes = TreeService.toList<DocIndex>(rootChildren)
    return TreeService.fromList<DocIndex>(nodes)
  },

  _toDocIndex(doc: Doc): DocIndex {
    const { cid, fromDocCid, noteCopy, createdAt, updatedAt } = doc
    return {
      cid,
      symbol: doc.getSymbol(),
      title: doc.getNoteMetaInput().title ?? undefined,
      noteId: noteCopy?.id,
      createdAt,
      updatedAt,
      parentCid: fromDocCid ?? TreeService.tempRootCid,
    }
  },

  _toDocIndexNode(doc: Doc): NodeBody<DocIndex> {
    const idx = this._toDocIndex(doc)
    return {
      cid: idx.cid,
      parentCid: idx.parentCid,
      index: idx.createdAt,
      data: idx,
    }
  },

  toDocIndexNodes(docs: Doc[]): TreeNode<DocIndex>[] {
    // const nodes = TreeService.fromList<DocIndex>(docs.map(e => e.toDocIndex()))
    const nodes = TreeService.fromList<DocIndex>(docs.map(e => this._toDocIndexNode(e)))
    return nodes
  },

  /**
   * Give current DocIndexNodes and the doc to be appended
   * @return updated DocIndexNodes
   *
   */
  appendDoc(cur: TreeNode<DocIndex>[], doc: Doc, force?: true): [TreeNode<DocIndex>[], { appended: boolean }] {
    const filtered = TreeService.filter(cur, node => node.cid === doc.cid)
    if (filtered.length === 0 || force) {
      // doc is not in current tree, append it
      const nodes = TreeService.toList<DocIndex>(cur)
      const appended = TreeService.fromList<DocIndex>([...nodes, this._toDocIndexNode(doc)])
      const flattened = this._flattenDepth(appended)
      return [flattened, { appended: true }]
    } else {
      return [cur, { appended: false }]
    }
  },

  /**
   * Given current DocIndexNodes and the doc-cid to be removed, remove the doc and all its children docs
   * @return updated DocIndexNodes
   *
   */
  getDocIndexWithChildren(cur: TreeNode<DocIndex>[], docCid: string): NodeBody<DocIndex>[] | null {
    const found = TreeService.searchBreadthFirst(cur, docCid)
    if (found) {
      const nodes = TreeService.toList<DocIndex>([found])
      return nodes
    }
    return null
  },
}
