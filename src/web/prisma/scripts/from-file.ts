import { inspect } from 'util'
import { readdirSync, readFileSync } from 'fs'
import { resolve, join } from 'path'
import { cloneDeep } from '@apollo/client/utilities'
import { Card, CardBody, Hashtag, HashtagCount, HashtagStatus, Link, Poll, PrismaClient } from '@prisma/client'
import { Editor, Markerline, splitByUrl } from '../../../packages/editor/src'
import { FetchClient } from '../../../packages/fetcher/src'
import { BulletNode } from '../../lib/bullet/node'
import { BulletDraft, InlineItem, InlinePoll, RootBulletDraft } from '../../lib/bullet/types'
import { parseBulletHead } from '../../lib/bullet/text'
import { CardBodyContent, createCardBody, getOrCreateCardBySymbol, getOrCreateCardByUrl } from '../../lib/models/card'
import { createAuthorVote } from '../../lib/models/vote'
import { createTestUsers, TESTUSERS } from '../../lib/test-helper'
import { getBotId } from '../../lib/models/user'
import { injectHashtags, toGQLHashtag } from '../../lib/hashtag/inject'

const IGNORE_FILE_STARTS_WITH = '_'
const includeFiles: string[] = [
  '20210425-j.txt',
  // '20210615-j.txt',
  // '20210716-j.txt',
  // '20210816-j.txt',
]

const seedDirPath = resolve(process.cwd(), process.argv[2])
const fetcher = new FetchClient(resolve(process.cwd(), process.argv[2], '_local-cache.dump.json'))
const prisma = new PrismaClient({ errorFormat: 'pretty' })

const NEAT_REPLY_CHOICE = [
  { options: ['<BUY>', '<B>', '<買>', '<LONG>', '<L>', '<多>', '<看多>'], choiceIdx: 0 },
  { options: ['<SELL>', '<S>', '<買>', '<SHORT>', '<空>', '<看空>'], choiceIdx: 1 },
  { options: ['<觀望>'], choiceIdx: 2 },
]

const BUYSELL_POLL_TEXT = '(#buy #sell #hold)'
const BUYSELL_POLL_CHOICES = ['#buy', '#sell', '#hold']

function searchTree(props: {
  node: BulletDraft
  depth: number
  inDepth?: number
  where: {
    // userId?: string
    head?: string
    hashtag?: { text: string }
    // hashtagGroup?: { text: string }
    poll?: { text: string }
  }
}): [BulletDraft | null, InlineItem | undefined] {
  const { node, depth, where, inDepth } = props
  const nextDepth = depth + 1

  if (where.head && where.head === node.head) {
    return [node, undefined]
  }
  // if (where.hashtag) {
  //   const text = where.hashtag.text
  //   const hashtag = node.curHashtags?.find((e): e is Hashtag => e.type === 'hashtag' && e.text === text)
  //   if (hashtag) {
  //     return [node, hashtag]
  //   }
  // }
  if (where.poll) {
    const text = where.poll.text
    const { headInlines } = parseBulletHead({ str: node.head })
    const poll = headInlines.find((e): e is InlinePoll => e.type === 'poll' && e.str.includes(text))
    if (poll) {
      return [node, poll]
    }
  }
  if (inDepth === undefined || nextDepth <= inDepth) {
    for (const e of node.children) {
      const res = searchTree({
        node: e,
        depth: depth + 1,
        inDepth,
        where,
      })
      if (res[0] !== null) {
        return res
      }
    }
  }
  return [null, undefined]
}

/**
 * 將markerlines插入(in-place)至對應的children裡，並對neat-reply創新comment/vote
 */
async function insertMarkerlines(
  root: RootBulletDraft,
  markerlines: Markerline[],
  userId: string,
): Promise<RootBulletDraft> {
  const _root = cloneDeep(root)

  async function _insertNeatReply(e: Markerline) {
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
      throw new Error('所給的 vote-choice 非預設的那幾個')
    }

    // 取得 buysell node
    const [node, poll] = searchTree({
      node: _root,
      depth: 0,
      where: { poll: { text: BUYSELL_POLL_TEXT } },
    })

    if (node && poll && poll.type === 'poll' && poll.id) {
      const vote = await createAuthorVote({
        choiceIdx,
        pollId: poll.id,
        authorName: e.oauthor,
        userId,
      })
      // const comment = await prisma.comment.create({
      //   data: {
      //     content: `${e.str} ^[[${e.src}]]`,
      //     user: { connect: { id: userId } },
      //     author: { connect: { name: e.oauthor } },
      //     count: { create: {} },
      //     board: { connect: { id: node.boardId } },
      //     vote: { connect: { id: vote.id } },
      //   },
      // })
    } else {
      console.error(inspect(_root, { depth: null }))
      throw new Error('找不到 buysell 的 node')
    }

    // auther 的 comment 併入 node children
    const child: BulletDraft = {
      head: `(${BUYSELL_POLL_CHOICES[choiceIdx]}) ${e.str}`,
      sourceUrl: e.src,
      author: e.oauthor,
      // commentId: comment.id,
      // voteId: vote.id,
      op: 'CREATE',
      children: [],
    }
    node.children.push(child)
  }

  for (const e of markerlines) {
    if (e.new && e.marker?.key && e.marker.value) {
      if (e.neatReply) {
        _insertNeatReply(e)
      }

      // 依照 markerline key 找對應的 subtitle node（PS. 僅找第一層）
      const [node] = searchTree({
        node: _root,
        depth: 0,
        inDepth: 1,
        where: { head: e.marker.key },
      })
      const child: BulletDraft = {
        head: e.marker.value,
        sourceUrl: e.src,
        author: e.oauthor,
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
  await prisma.$executeRaw('TRUNCATE "User", "Author", "Link", "Bullet", "Hashtag", "Card", "CardBody" CASCADE;')

  console.log('Creating test users...')
  await createTestUsers(prisma)

  for (const filename of readdirSync(seedDirPath).sort()) {
    if (filename.startsWith(IGNORE_FILE_STARTS_WITH)) {
      console.log(`Skip: ${filename}`)
      continue
    }
    if (includeFiles.length > 0 && !includeFiles.includes(filename)) {
      console.log(`Skip: ${filename}`)
      continue
    }

    const filepath = join(seedDirPath, filename)
    console.log(`*\n*\n* Seed file: ${filepath}`)

    for (const [url, text] of splitByUrl(readFileSync(filepath, { encoding: 'utf8' }))) {
      let card: Card & { link: Link; body: CardBody }
      try {
        card = await getOrCreateCardByUrl({ fetcher, url })
      } catch (err) {
        console.warn(err)
        continue
      }

      const { value: selfRoot }: CardBodyContent = JSON.parse(card.body.content)

      const selfRootDraft = BulletNode.toDraft(selfRoot)

      const editor = new Editor('', [], card.link.url, card.link.authorName ?? undefined)
      editor.setText(text)
      editor.flush()

      // console.log(url, text)
      // console.log(editor.getNestedMarkerlines())

      for (const [cardlabel, markerlines] of editor.getNestedMarkerlines()) {
        const mirrorCard = await getOrCreateCardBySymbol(cardlabel.symbol)
        const { value: mirrorRoot }: CardBodyContent = JSON.parse(mirrorCard.body.content)
        // console.log(inspect(mirrorRoot, { depth: null }))

        const hashtags = (
          await prisma.hashtag.findMany({
            where: { AND: [{ card: { id: mirrorCard.id } }, { status: HashtagStatus.ACTIVE }] },
            include: { count: true },
          })
        ).map(e => {
          const hasCount = (
            obj: Hashtag & { count: HashtagCount | null },
          ): obj is Hashtag & { count: HashtagCount } => {
            return obj.count !== null
          }
          if (hasCount(e)) {
            return toGQLHashtag(e)
          }
          throw ''
        })

        const draft = BulletNode.toDraft(mirrorRoot)
        const draftWithHashtags = injectHashtags({ root: draft, hashtags })
        // console.log(inspect(draftWithHashtags, { depth: null }))

        const mirror = await insertMarkerlines(draftWithHashtags, markerlines, TESTUSERS[0].id)
        // console.log(inspect(mirror, { depth: null }))

        const body = await createCardBody({ cardId: mirrorCard.id, root: mirror, userId: TESTUSERS[0].id })
        // console.log(inspect(body[1], { depth: null }))

        selfRootDraft.children.push({
          draft: true,
          op: 'CREATE',
          head: `::${cardlabel.symbol}`,
          // mirror: true,
          children: [],
        })
      }

      // console.log(inspect(selfRootDraft, { depth: null }))
      const body = await createCardBody({
        cardId: card.id,
        root: selfRootDraft,
        userId: TESTUSERS[0].id,
      })
      // console.log(inspect(body[1], { depth: null }))

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
