import { readdirSync, readFileSync } from 'fs'
import { resolve, join } from 'path'
import { Card, CardBody, CardHead, Link, PrismaClient } from '@prisma/client'
import { Editor, Markerline, splitByUrl } from '../../../packages/editor/src'
import { FetchClient } from '../../../packages/fetcher/src'
import { Node as BulletNode } from '../../lib/bullet/node'
import { BulletDraft, RootBulletDraft } from '../../lib/bullet/types'
import {
  CardBodyContent,
  createCardBody,
  getOrCreateCardBySymbol,
  getOrCreateCardByUrl,
  PinBoardCode,
} from '../../lib/models/card'
import { createOauthorVote } from '../../lib/models/vote'
import { createTestUsers, TESTUSERS } from '../../lib/test-helper'
import { cloneDeep } from '@apollo/client/utilities'

const IGNORE_FILE_STARTS_WITH = '_'

const seedDirPath = resolve(process.cwd(), process.argv[2])
const fetcher = new FetchClient(resolve(process.cwd(), process.argv[2], '_local-cache.dump.json'))
const prisma = new PrismaClient({ errorFormat: 'pretty' })

/**
 * search tree
 */
function search({
  node,
  depth,
  byHead,
  byPinCode,
  inDepth,
}: {
  node: BulletDraft
  depth: number
  byHead?: string
  byPinCode?: PinBoardCode
  inDepth?: number
}): BulletDraft | null {
  const nextDepth = depth + 1

  if (byHead && byHead === node.head) {
    return node
  }
  if (byPinCode && byPinCode === node.pinCode) {
    return node
  }
  if (inDepth === undefined || nextDepth <= inDepth) {
    for (const e of node.children ?? []) {
      const res = search({
        node: e,
        depth: depth + 1,
        byHead,
        byPinCode,
        inDepth,
      })
      if (res) {
        return res
      }
    }
  }
  return null
}

const NEAT_REPLY_CHOICE = [
  { options: ['<BUY>', '<B>', '<買>', '<LONG>', '<L>', '<多>', '<看多>'], choiceIdx: 0 },
  { options: ['<SELL>', '<S>', '<買>', '<SHORT>', '<空>', '<看空>'], choiceIdx: 1 },
]

/**
 * 將markerlines插入(in-place)至對應的children裡，並對neat-reply創新comment/vote
 */
async function insertMarkerlines(
  root: RootBulletDraft,
  markerlines: Markerline[],
  userId: string,
): Promise<RootBulletDraft> {
  const _root = cloneDeep(root)

  for (const e of markerlines) {
    if (e.new && e.marker?.key && e.marker.value) {
      if (e.neatReply) {
        if (!e.neatReply) throw new Error('非neatReply')
        if (!e.src) throw new Error('缺src，無法創neat-reply')
        if (!e.stampId) throw new Error('缺stampId，無法創neat-reply')
        if (!e.pollChoices) throw new Error('缺pollChoices，無法創neat-reply')
        if (e.pollChoices.length !== 1) throw new Error('pollChoices的length不等於1，無法創neat-reply')
        if (!e.nestedCard) throw new Error('缺nestedCard，無法創neat-reply')
        if (!e.oauthor) throw new Error('缺oauthor，無法創neat-reply')

        // 取得並檢查choice-index
        const choice = e.pollChoices[0]
        let choiceIdx: number | undefined
        for (const e of NEAT_REPLY_CHOICE) {
          if (e.options.indexOf(choice)) {
            choiceIdx = e.choiceIdx
            break
          }
        }
        if (choiceIdx === undefined) {
          console.error(e)
          throw new Error('所給的vote-choice非預設的那幾個')
        }

        // 取得node
        const node = search({ node: _root, depth: 0, byPinCode: 'BUYSELL' })
        if (node === null) {
          throw new Error('找不到buysell的node')
        }
        if (node.boardId === undefined || node.pollId === undefined) {
          console.error(node)
          throw new Error('node需要boardId, pollId才能創neat-reply')
        }

        const vote = await createOauthorVote({
          choiceIdx,
          pollId: node.pollId,
          oauthorName: e.oauthor,
          userId,
        })
        const comment = await prisma.comment.create({
          data: {
            content: `${e.str} ^[[${e.src}]]`,
            user: { connect: { id: userId } },
            oauthor: { connect: { name: e.oauthor } },
            count: { create: {} },
            board: { connect: { id: node.boardId } },
            vote: { connect: { id: vote.id } },
          },
        })
        // oauther的board comment直接創造一個bullet
        const child: BulletDraft = {
          head: e.str,
          sourceUrl: e.src,
          oauthorName: e.oauthor,
          commentId: comment.id,
          voteId: vote.id,
          op: 'CREATE',
          children: [],
        }
        node.children.push(child)

        continue
      }

      // 依照 markerline key 找對應的 subtitle node（PS. 僅找第一層）
      const node = search({
        node: _root,
        depth: 0,
        byHead: e.marker.key,
        inDepth: 1,
      })
      const child: BulletDraft = {
        head: e.marker.value,
        sourceUrl: e.src,
        oauthorName: e.oauthor,
        op: 'CREATE',
        children: [],
      }
      if (node) {
        node.children.push(child)
      } else {
        // 創一個subtitle bullet
        _root.children.push({
          head: e.marker.key,
          op: 'CREATE',
          children: [child],
        })
      }
    }
  }

  return _root
}

async function main() {
  console.log('Truncating databse...')
  await prisma.$executeRaw('TRUNCATE "User", "Oauthor", "Link", "Bullet", "Card", "CardHead", "CardBody" CASCADE;')

  console.log('Creating test users...')
  await createTestUsers(prisma)

  for (const filename of readdirSync(seedDirPath).sort()) {
    if (filename.startsWith(IGNORE_FILE_STARTS_WITH)) {
      console.log(`Skip: ${filename}`)
      continue
    }
    const filepath = join(seedDirPath, filename)
    console.log(`Seed file: ${filepath}`)

    for (const [url, text] of splitByUrl(readFileSync(filepath, { encoding: 'utf8' }))) {
      let card: Card & { link: Link; head: CardHead; body: CardBody }
      try {
        card = await getOrCreateCardByUrl({ fetcher, url })
      } catch (err) {
        console.warn(err)
        continue
      }

      const editor = new Editor('', [], card.link.url, card.link.oauthorName ?? undefined)
      editor.setText(text)
      editor.flush()

      const mirrors: RootBulletDraft[] = []

      for (const [cardlabel, markerlines] of editor.getNestedMarkerlines()) {
        const mirrorCard = await getOrCreateCardBySymbol(cardlabel.symbol)
        const { self }: CardBodyContent = JSON.parse(mirrorCard.body.content)

        const draft = BulletNode.toDraft(self)

        // console.log(markerlines)

        const mirror = await insertMarkerlines(draft, markerlines, TESTUSERS[0].id)
        mirrors.push(mirror)
      }

      // console.log(inspect(mirrors, { depth: 0 }))
      // return

      await createCardBody({
        cardId: card.id,
        mirrors,
        userId: TESTUSERS[0].id,
      })

      console.log(`Card and card-body created`)
    }
  }
}

main()
  .catch(err => {
    console.error(err)
    throw new Error()
  })
  .finally(async () => {
    console.log('Done, closing primsa')
    fetcher.dump()
    prisma.$disconnect()
    process.exit()
  })
