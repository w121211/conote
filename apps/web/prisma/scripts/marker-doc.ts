import { nanoid } from 'nanoid'
import {
  Note as GQLNote,
  // NoteInput as GQLCardInput,
  // NoteStateInput as GQLCardStateInput,
} from 'graphql-let/__generated__/__types__'
import { NodeBody, TreeNode, TreeService } from '@conote/docdiff'
import { Markerline } from '@conote/editor'
import { Bullet } from '../../components/bullet/bullet'
import { RateChoice } from '@prisma/client'

type MarkerDocProps = {
  noteCopy: GQLCard | null
  noteInput: GQLCardInput | null
  fromDocCid: string | null
  updatedAt?: number
  value: TreeNode<Bullet>[]
}

const NEAT_REPLY_CHOICE = [
  {
    options: ['<BUY>', '<B>', '<買>', '<LONG>', '<L>', '<多>', '<看多>'],
    choiceIdx: 0,
    rateChoice: RateChoice.LONG,
  },
  {
    options: ['<SELL>', '<S>', '<買>', '<SHORT>', '<空>', '<看空>'],
    choiceIdx: 1,
    rateChoice: RateChoice.SHORT,
  },
  { options: ['<觀望>'], choiceIdx: 2, rateChoice: RateChoice.HOLD },
]

async function getNeatReply({
  authorId,
  neatReply,
  linkId,
  symbol,
  userId,
}: {
  authorId: string
  neatReply: Markerline
  linkId: string
  symbol: string
  userId: string
}): Promise<
  Rate & {
    author: Author
    sym: Sym
  }
> {
  if (!neatReply.neatReply) throw new Error('非neatReply')
  if (!neatReply.src) throw new Error('缺src, 無法創neat-reply')
  if (!neatReply.stampId) throw new Error('缺stampId, 無法創neat-reply')
  if (!neatReply.pollChoices) throw new Error('缺pollChoices, 無法創neat-reply')
  if (neatReply.pollChoices.length !== 1)
    throw new Error('pollChoices的length不等於1, 無法創neat-reply')
  if (!neatReply.nestedCard) throw new Error('缺nestedNote, 無法創neat-reply')
  if (!neatReply.oauthor) throw new Error('缺oauthor, 無法創neat-reply')

  // 取得並檢查choice-index
  const choice = neatReply.pollChoices[0]
  let choiceIdx: number | undefined
  let rateChoice: RateChoice | undefined
  for (const e of NEAT_REPLY_CHOICE) {
    if (e.options.indexOf(choice) >= 0) {
      choiceIdx = e.choiceIdx
      rateChoice = e.rateChoice
      break
    }
  }
  if (choiceIdx === undefined || rateChoice === undefined) {
    console.error(neatReply)
    throw new Error('所給的 vote choice 非預設的那幾個')
  }

  // 創 rate
  const rateBody: RateBody = {
    comment: neatReply.str,
  }
  const rate = await RateModel.create({
    choice: rateChoice,
    symbol,
    userId,
    authorId,
    body: rateBody,
    linkId,
  })

  if (rate.author) {
    return {
      ...rate,
      author: rate.author,
    }
  }
  throw 'rate must have an author'

  // auther 的 comment 併入 node children
  // const child: BulletDraft = {
  //   head: `(${BUYSELL_POLL_CHOICES[choiceIdx]}) ${e.str}`,
  //   sourceUrl: e.src,
  //   author: e.oauthor,
  //   op: 'CREATE',
  //   children: [],
  // }
  // node.children.push(child)
}

/**
 * Marker-doc
 * Use for reading marker-doc format files, and convert to current note format
 */
export class MarkerDoc {
  // readonly symbol: string // as CID

  readonly cid: string

  /**
   * To keep the prev-state
   */
  readonly noteCopy: GQLCard | null

  readonly fromDocCid: string | null

  /**
   * Required if card is null
   */
  noteInput: GQLCardInput | null

  /**
   * Timestamp
   */
  updatedAt: number = Date.now()

  value: TreeNode<Bullet>[]

  constructor({ noteInput, noteCopy, fromDocCid, value }: MarkerDocProps) {
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

        const found = TreeService.filter(
          this.value,
          node => node.data?.head.includes(key) ?? false,
        )
        if (found.length > 0) {
          this.value = TreeService.insert(
            this.value,
            valueNode,
            found[0].cid,
            -1,
          )
        } else {
          // key node not found, create one
          const keyNode = this.createBullet({ head: key })
          this.value = TreeService.insert(
            this.value,
            keyNode,
            TreeService.tempRootCid,
            -1,
          ) // insert key
          this.value = TreeService.insert(
            this.value,
            valueNode,
            keyNode.cid,
            -1,
          ) // insert value
        }
      }
    }
  }

  insertBullet(
    bullet: NodeBody<Bullet>,
    toParentCid: string,
    toIndex = -1,
  ): void {
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
