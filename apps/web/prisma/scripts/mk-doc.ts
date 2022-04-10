import { nanoid } from 'nanoid'
import {
  Note as GQLCard,
  NoteInput as GQLCardInput,
  NoteStateInput as GQLCardStateInput,
} from 'graphql-let/__generated__/__types__'
import { NodeBody, TreeNode, TreeService } from '@conote/docdiff'
import { Markerline } from '@conote/editor'
import { Bullet } from '../../components/bullet/bullet'

type MKDocProps = {
  noteCopy: GQLCard | null
  noteInput: GQLCardInput | null
  fromDocCid: string | null
  updatedAt?: number
  value: TreeNode<Bullet>[]
}

export class MKDoc {
  // readonly symbol: string // as CID
  readonly cid: string
  readonly noteCopy: GQLCard | null // to keep the prev-state,
  readonly fromDocCid: string | null
  noteInput: GQLCardInput | null // required if card is null
  updatedAt: number = Date.now() // timestamp
  value: TreeNode<Bullet>[]

  constructor({ noteInput, noteCopy, fromDocCid, value }: MKDocProps) {
    if (noteCopy && noteInput) {
      throw 'Card-snapshot & card-input cannot co-exist'
    }
    if (noteCopy === null && noteInput === null) {
      throw 'Need card-input if no card-snapshot'
    }
    this.cid = nanoid()
    this.fromDocCid = fromDocCid
    this.noteCopy = noteCopy
    this.noteInput = noteInput
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

        const found = TreeService.filter(this.value, node => node.data?.head.includes(key) ?? false)
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
    const { cid, fromDocCid, noteInput, noteCopy, value } = this
    // const changes = this.updateChanges()
    return {
      cid,
      fromDocCid,
      noteInput,
      noteId: noteCopy?.id,
      prevStateId: noteCopy?.state?.id,
      changes: [], // TODO
      value,
    }
  }
}
