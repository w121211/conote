import { nanoid } from 'nanoid'
import { MonoNode, NodeChange, TreeNode, TreeService } from '../../../packages/docdiff/src'
import { Markerline } from '../../../packages/editor/src'
import { Card, CardInput } from '../../apollo/type-defs.graphqls'
import { Bullet } from '../../components/bullet/types'

type MKDocProps = {
  symbol: string
  cardInput: CardInput | null
  cardCopy: Card | null
  sourceCardCopy: Card | null
  // subSymbols?: string[]
  updatedAt?: number
  value: TreeNode<Bullet>[]
  // syncValue: LiElement[]
  // editorValue: LiElement[]
}

export class MKDoc {
  readonly cid: string
  readonly symbol: string // as CID
  readonly cardCopy: Card | null // to keep the prev-state,
  readonly sourceCardCopy: Card | null // indicate current doc is a mirror
  cardInput: CardInput | null // required if card is null
  updatedAt: number = Date.now() // timestamp
  value: TreeNode<Bullet>[]

  constructor({ symbol, cardInput, cardCopy, sourceCardCopy, value }: MKDocProps) {
    if (cardCopy && cardCopy.sym.symbol !== symbol) {
      throw 'cardSnapshot.symbol !== symbol'
    }
    if (cardCopy && cardInput) {
      throw 'Card-snapshot & card-input cannot co-exist'
    }
    if (cardCopy === null && cardInput === null) {
      throw 'Need card-input if no card-snapshot'
    }
    this.cid = symbol
    // this.editorValue = editorValue
    this.symbol = symbol
    this.cardCopy = cardCopy
    this.sourceCardCopy = sourceCardCopy
    // this.subSymbols = subSymbols ?? []
    this.cardInput = cardInput
    // this.store = new NestedNodeValueStore(value)
    this.value = value
  }

  createBullet({
    head,
  }: // authorId,
  // sourceCardId,
  {
    head: string
    // authorId?: string
    // sourceCardId?: string
  }): MonoNode<Bullet> {
    const cid = nanoid()
    const node: MonoNode<Bullet> = {
      cid,
      data: {
        id: cid,
        cid,
        head,
        // sourceCardId,
        // authorId,
      },
    }
    return node
  }

  insertMarkerLines({ markerlines }: { markerlines: Markerline[] }): void {
    // const root = cloneDeep(rootBullet)
    for (const e of markerlines) {
      if (e.new && e.marker?.key && e.marker.value) {
        const { key, value } = e.marker
        const valueNode = this.createBullet({ head: value })

        const found = TreeService.find(this.value, node => node.data?.head.includes(key) ?? false)
        if (found.length > 0) {
          this.value = TreeService.insert(this.value, valueNode, found[0].cid, -1)
        } else {
          // key node not found, create one
          const keyNode = this.createBullet({ head: key })
          this.value = TreeService.insert(this.value, keyNode, TreeService.tempRootCid, -1) // insert key
          this.value = TreeService.insert(this.value, valueNode, keyNode.cid, -1) // insert value
        }
      }
    }
  }

  insertBullet(bullet: MonoNode<Bullet>, toParentCid: string, toIndex = -1): void {
    this.value = TreeService.insert(this.value, bullet, toParentCid, toIndex)
  }
}
