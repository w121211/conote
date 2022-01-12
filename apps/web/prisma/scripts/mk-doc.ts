import { nanoid } from 'nanoid'
import {
  Card as GQLCard,
  CardInput as GQLCardInput,
  CardStateInput as GQLCardStateInput,
} from 'graphql-let/__generated__/__types__'
import { NodeBody, TreeNode, TreeService } from '@conote/docdiff'
import { Markerline } from '@conote/editor'
import { Bullet } from '../../components/bullet/bullet'

type MKDocProps = {
  cardCopy: GQLCard | null
  cardInput: GQLCardInput | null
  fromDocCid: string | null
  updatedAt?: number
  value: TreeNode<Bullet>[]
}

export class MKDoc {
  // readonly symbol: string // as CID
  readonly cid: string
  readonly cardCopy: GQLCard | null // to keep the prev-state,
  readonly fromDocCid: string | null
  cardInput: GQLCardInput | null // required if card is null
  updatedAt: number = Date.now() // timestamp
  value: TreeNode<Bullet>[]

  constructor({ cardInput, cardCopy, fromDocCid, value }: MKDocProps) {
    if (cardCopy && cardInput) {
      throw 'Card-snapshot & card-input cannot co-exist'
    }
    if (cardCopy === null && cardInput === null) {
      throw 'Need card-input if no card-snapshot'
    }
    this.cid = nanoid()
    this.fromDocCid = fromDocCid
    this.cardCopy = cardCopy
    this.cardInput = cardInput
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
  }): NodeBody<Bullet> {
    const cid = nanoid()
    const node: NodeBody<Bullet> = {
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

  insertBullet(bullet: NodeBody<Bullet>, toParentCid: string, toIndex = -1): void {
    this.value = TreeService.insert(this.value, bullet, toParentCid, toIndex)
  }

  toGQLCardStateInput(): GQLCardStateInput {
    const { cid, fromDocCid, cardInput, cardCopy, value } = this
    // const changes = this.updateChanges()
    return {
      cid,
      fromDocCid,
      cardInput,
      cardId: cardCopy?.id,
      prevStateId: cardCopy?.state?.id,
      changes: [], // TODO
      value,
    }
  }
}
