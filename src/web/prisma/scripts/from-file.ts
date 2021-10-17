import { inspect } from 'util'
import { readdirSync, readFileSync } from 'fs'
import { resolve, join } from 'path'
import { cloneDeep } from '@apollo/client/utilities'
import { Author, Card, CardBody, Link, PrismaClient, Shot, ShotChoice } from '.prisma/client'
import { Editor, Markerline, splitByUrl } from '../../../packages/editor/src'
import { FetchClient } from '../../lib/fetcher/fetcher'
import { BulletNode } from '../../lib/bullet/node'
import { BulletDraft, RootBulletDraft } from '../../lib/bullet/types'
import {
  CardBodyContent,
  CardMeta,
  createCardBody,
  getOrCreateCardBySymbol,
  getOrCreateCardByUrl,
} from '../../lib/models/card'
import { createTestUsers, TESTUSERS } from '../../lib/test-helper'
import { ShotContent, toShotInlineText } from '../../lib/models/shot'
// import { getBotId } from '../../lib/models/user'
// import { injectHashtags, toGQLHashtag } from '../../lib/hashtag/inject'

const IGNORE_FILE_STARTS_WITH = '_'
const includeFiles: string[] = [
  '20210425-j.txt',
  // '20210615-j.txt',
  // '20210716-j.txt',
  // '20210816-j.txt',
]

const seedDirPath = resolve(process.cwd(), process.argv[2])
const scraper = new FetchClient(resolve(process.cwd(), process.argv[2], '_local-cache.dump.json'))
const prisma = new PrismaClient({ errorFormat: 'pretty' })

const NEAT_REPLY_CHOICE = [
  { options: ['<BUY>', '<B>', '<買>', '<LONG>', '<L>', '<多>', '<看多>'], choiceIdx: 0, shotChoice: ShotChoice.LONG },
  { options: ['<SELL>', '<S>', '<買>', '<SHORT>', '<空>', '<看空>'], choiceIdx: 1, shotChoice: ShotChoice.SHORT },
  { options: ['<觀望>'], choiceIdx: 2, shotChoice: ShotChoice.HOLD },
]

async function createNeatReply({
  authorId,
  neatReply,
  linkId,
  targetCardId,
  userId,
}: {
  authorId: string
  neatReply: Markerline
  linkId: string
  targetCardId: string
  userId: string
}): Promise<
  Shot & {
    author: Author
    target: Card
  }
> {
  if (!neatReply.neatReply) throw new Error('非neatReply')
  if (!neatReply.src) throw new Error('缺src，無法創neat-reply')
  if (!neatReply.stampId) throw new Error('缺stampId，無法創neat-reply')
  if (!neatReply.pollChoices) throw new Error('缺pollChoices，無法創neat-reply')
  if (neatReply.pollChoices.length !== 1) throw new Error('pollChoices的length不等於1，無法創neat-reply')
  if (!neatReply.nestedCard) throw new Error('缺nestedCard，無法創neat-reply')
  if (!neatReply.oauthor) throw new Error('缺oauthor，無法創neat-reply')

  // 取得並檢查choice-index
  const choice = neatReply.pollChoices[0]
  let choiceIdx: number | undefined
  let shotChoice: ShotChoice | undefined
  for (const e of NEAT_REPLY_CHOICE) {
    if (e.options.indexOf(choice) >= 0) {
      choiceIdx = e.choiceIdx
      shotChoice = e.shotChoice
      break
    }
  }
  if (choiceIdx === undefined || shotChoice === undefined) {
    console.error(neatReply)
    throw new Error('所給的 vote choice 非預設的那幾個')
  }

  // 創 shot
  const shotContent: ShotContent = {
    comment: neatReply.str,
  }
  const shot = await prisma.shot.create({
    data: {
      choice: shotChoice,
      content: shotContent,
      user: { connect: { id: userId } },
      author: { connect: { id: authorId } },
      link: { connect: { id: linkId } },
      target: { connect: { id: targetCardId } },
    },
    include: {
      author: true,
      target: true,
    },
  })
  if (shot.author) {
    return {
      ...shot,
      author: shot.author,
    }
  }
  throw 'shot must have an author'

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
 * 將markerlines插入(in-place)至對應的children裡，並對neat-reply創新comment/vote
 */
async function insertMarkerlines({
  rootBullet,
  markerlines,
  authorId,
  sourceCardId,
}: {
  authorId?: string
  markerlines: Markerline[]
  rootBullet: RootBulletDraft
  sourceCardId: string
  // userId: string
}): Promise<RootBulletDraft> {
  const root = cloneDeep(rootBullet)
  for (const e of markerlines) {
    if (e.new && e.marker?.key && e.marker.value) {
      // if (e.neatReply) {
      //   _insertNeatReply(e)
      // }

      // 依照 markerline key 找對應的 subtitle node（PS. 僅找第一層）
      // const [node] = searchTree({
      //   node: root,
      //   depth: 0,
      //   inDepth: 1,
      //   where: { head: e.marker.key },
      // })

      const { key, value } = e.marker
      const found = BulletNode.find({
        node: root,
        match: ({ node }) => node.head.includes(key),
      }) as BulletDraft[]
      const child: BulletDraft = {
        head: e.marker.value,
        sourceCardId,
        authorId,
        op: 'CREATE',
        children: [],
      }
      if (found.length > 0) {
        found[0].children.push(child)
      } else {
        // 創一個subtitle bullet
        root.children.push({
          head: e.marker.key,
          op: 'CREATE',
          children: [child],
        })
      }
    }
  }
  return root
}

async function main() {
  console.log('Truncating databse...')
  await prisma.$executeRaw(
    'TRUNCATE "User", "Author", "Link", "Card", "CardBody", "Bullet", "Emoji", "Poll", "Shot" CASCADE;',
  )

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
      let sourceCard: Omit<Card, 'meta'> & { link: Link; meta: CardMeta; body: CardBody }

      try {
        sourceCard = await getOrCreateCardByUrl({ scraper, url })
      } catch (err) {
        console.warn(err)
        continue
      }

      const { value: sourceRoot } = sourceCard.body.content as unknown as CardBodyContent
      const sourceRootDraft = BulletNode.toDraft(sourceRoot)

      const editor = new Editor('', [], sourceCard.link.url, sourceCard.link.authorId ?? undefined)
      editor.setText(text)
      editor.flush()

      for (const [cardlabel, markerlines] of editor.getNestedMarkerlines()) {
        const mirrorCard = await getOrCreateCardBySymbol(cardlabel.symbol)
        const { value: mirrorRoot } = mirrorCard.body.content as unknown as CardBodyContent

        const mirror = await insertMarkerlines({
          authorId: sourceCard.link.authorId ?? undefined,
          rootBullet: BulletNode.toDraft(mirrorRoot),
          markerlines,
          sourceCardId: sourceCard.id,
        })
        await createCardBody({ cardId: mirrorCard.id, root: mirror, userId: TESTUSERS[0].id })
        // console.log(inspect(mirror, { depth: null }))

        let shotInlineText = ''
        const neatReplies = markerlines.filter(e => e.neatReply)
        if (neatReplies.length > 1) {
          console.log(inspect(neatReplies, { depth: null }))
          throw ''
        } else if (neatReplies.length === 1) {
          if (sourceCard.link.authorId && sourceCard.linkId) {
            const shot = await createNeatReply({
              authorId: sourceCard.link.authorId,
              neatReply: neatReplies[0],
              linkId: sourceCard.linkId,
              targetCardId: mirrorCard.id,
              userId: TESTUSERS[0].id,
            })
            shotInlineText = toShotInlineText({
              author: shot.author.name,
              choice: shot.choice,
              targetSymbol: shot.target.symbol,
              id: shot.id,
            })
          }
        }
        // console.log(inspect(body[1], { depth: null }))

        // 在 root 上新增 mirror & shot (if any)
        sourceRootDraft.children.push({
          draft: true,
          op: 'CREATE',
          head: `::${mirrorCard.symbol} ${shotInlineText}`,
          // mirror: true,
          children: [],
        })
      }

      // console.log(inspect(selfRootDraft, { depth: null }))
      await createCardBody({
        cardId: sourceCard.id,
        root: sourceRootDraft,
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
    scraper.dump()
    prisma.$disconnect()
    process.exit()
  })
