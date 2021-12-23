import { NodeBody, TreeNode, TreeService } from '../../../packages/docdiff/src'
import { Doc } from './doc'

export type DocIndex = {
  cid: string // client side temporary id
  symbol: string
  // symbolType: SymType
  title?: string // webpage-card use title instead of symbol
  cardId?: string // 'undefined' refers to a new card
  // sourceCardId?: string
  commitId?: string
  createdAt: number // doc created time, for sorting
  updatedAt: number // doc updated time
  parentCid?: string
}

export const DocIndexService = {
  fromDoc(doc: Doc): DocIndex {
    const { cid, fromDocCid, cardCopy, createdAt, updatedAt } = doc
    return {
      cid,
      symbol: doc.getSymbol(),
      title: doc.getTitle(),
      cardId: cardCopy?.id,
      createdAt,
      updatedAt,
      parentCid: fromDocCid ?? TreeService.tempRootCid,
    }
  },

  _toDocIndexNode(doc: Doc): NodeBody<DocIndex> {
    const idx = this.fromDoc(doc)
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

  mergeDoc(cur: TreeNode<DocIndex>[], doc: Doc, force?: true): [TreeNode<DocIndex>[], { merged: boolean }] {
    const found = TreeService.find(cur, node => node.cid === doc.cid)
    if (found.length === 0 || force) {
      // doc is not in current tree, append it
      const nodes = TreeService.toList<DocIndex>(cur)
      const merged = TreeService.fromList<DocIndex>([...nodes, this._toDocIndexNode(doc)])
      return [merged, { merged: true }]
    } else {
      return [cur, { merged: false }]
    }
  },
}
