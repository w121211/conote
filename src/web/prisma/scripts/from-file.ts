import { inspect } from 'util'
import { readdirSync, readFileSync } from 'fs'
import { resolve, join } from 'path'
import { nanoid } from 'nanoid'
import { Author, Card, CardState, Link, PrismaClient, Shot, ShotChoice, Symbol as PrismaSymbol } from '.prisma/client'
import { DataNode, NodeChange, TreeNode, TreeService } from '../../../packages/docdiff/src'
import { Editor as OldEditor, Markerline, splitByUrl } from '../../../packages/editor/src'
import { FetchClient } from '../../lib/fetcher/fetcher'
import { Bullet } from '../../lib/bullet/types'
import { CardMeta, CardModel } from '../../lib/models/card'
import { createTestUsers, TESTUSERS } from '../../lib/test-helper'
import { ShotBody, ShotModel } from '../../lib/models/shot'
import { CardStateBody, CommitModel } from '../../lib/models/commit'
import { CardInput } from '../../apollo/type-defs.graphqls'
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
  symbol,
  userId,
}: {
  authorId: string
  neatReply: Markerline
  linkId: string
  symbol: string
  userId: string
}): Promise<
  Shot & {
    author: Author
    symbol: PrismaSymbol
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
  const shotBody: ShotBody = {
    comment: neatReply.str,
  }
  const shot = await ShotModel.create({
    choice: shotChoice,
    symbol,
    userId,
    authorId,
    body: shotBody,
    linkId,
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

type DocProps = {
  symbol: string // use as cid
  card: Card | null
  prevState: CardState | null
  subSymbols?: string[]
  value: TreeNode<Bullet>[]
  cardInput?: CardInput // only needs if card does not exist, which creating card and doc in the same time
}

class Doc {
  readonly symbol: string // as CID
  readonly card: Card | null
  readonly prevState: CardState | null

  subSymbols: string[]
  value: TreeNode<Bullet>[]
  cardInput?: CardInput

  constructor({ card, prevState, symbol, subSymbols, value, cardInput }: DocProps) {
    // this.cid = cid
    this.symbol = symbol
    this.card = card
    this.prevState = prevState
    this.subSymbols = subSymbols ?? []
    this.cardInput = cardInput
    // this.store = new NestedNodeValueStore(value)
    this.value = value
  }

  createBullet({
    head,
    authorId,
    sourceCardId,
  }: {
    head: string
    authorId?: string
    sourceCardId?: string
  }): DataNode<Bullet> {
    const cid = nanoid()
    const node: DataNode<Bullet> = {
      cid,
      data: {
        id: cid,
        cid,
        head,
        sourceCardId,
        authorId,
      },
    }
    return node
  }

  insertMarkerLines({
    markerlines,
    authorId,
    sourceCardId,
  }: {
    markerlines: Markerline[]
    authorId?: string
    sourceCardId?: string
  }): void {
    // const root = cloneDeep(rootBullet)
    for (const e of markerlines) {
      if (e.new && e.marker?.key && e.marker.value) {
        const { key, value } = e.marker
        const valueNode = this.createBullet({
          head: value,
          sourceCardId,
          authorId,
        })

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

  insertBullet(bullet: DataNode<Bullet>, toParentCid: string, toIndex = -1): void {
    this.value = TreeService.insert(this.value, bullet, toParentCid, toIndex)
  }
}

const main = async () => {
  console.log('Truncating databse...')
  await prisma.$queryRaw`TRUNCATE "Author", "Bullet", "BulletEmoji", "Card", "CardState", "CardEmoji", "Link", "Poll", "Shot", "Symbol", "User" CASCADE;`

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
      console.log(`Working on: ${url}`)

      let webpageCard: Omit<Card, 'meta'> & {
        link: Link
        symbol: PrismaSymbol
        meta: CardMeta
        state: CardState | null
      }
      try {
        webpageCard = await CardModel.getOrCreateByUrl({ scraper, url })
      } catch (err) {
        console.warn(err)
        continue
      }

      const doc = new Doc({
        symbol: webpageCard.symbol.name,
        card: webpageCard,
        prevState: webpageCard.state,
        value: webpageCard.state ? (webpageCard.state.body as unknown as CardStateBody).value : [],
      })
      const subDocs: Doc[] = []

      const mkEditor = new OldEditor('', [], webpageCard.link.url, webpageCard.link.authorId ?? undefined)
      mkEditor.setText(text)
      mkEditor.flush()

      for (const [cardlabel, markerlines] of mkEditor.getNestedMarkerlines()) {
        const mirrorSymbol = cardlabel.symbol
        const mirrorCard = await CardModel.getBySymbol(mirrorSymbol)
        const mirrorDoc = mirrorCard
          ? new Doc({
              symbol: mirrorSymbol,
              card: mirrorCard,
              prevState: mirrorCard.state,
              value: (mirrorCard.state.body as unknown as CardStateBody).value,
            })
          : new Doc({
              symbol: mirrorSymbol,
              card: null,
              prevState: null,
              value: [],
              cardInput: { symbol: mirrorSymbol, meta: {} },
            })
        mirrorDoc.insertMarkerLines({
          markerlines,
          authorId: webpageCard.link.authorId ?? undefined,
          sourceCardId: webpageCard.id,
        })
        subDocs.push(mirrorDoc)

        // if (mirrorCard) {
        //   console.log(inspect((mirrorCard.state.body as unknown as CardStateBody).value, { depth: null }))
        //   console.log(inspect(mirrorDoc.value, { depth: null }))
        // }
        // console.log(mirrorDoc)

        let inlineShotStr = ''
        const neatReplies = markerlines.filter(e => e.neatReply)
        if (neatReplies.length > 1) {
          console.warn(inspect(neatReplies, { depth: null }))
          throw '[conote-seed] neatReplies.length > 1'
        } else if (neatReplies.length === 1) {
          if (webpageCard.link.authorId && webpageCard.linkId) {
            const shot = await createNeatReply({
              authorId: webpageCard.link.authorId,
              neatReply: neatReplies[0],
              linkId: webpageCard.linkId,
              symbol: mirrorSymbol,
              userId: TESTUSERS[0].id,
            })
            inlineShotStr = ShotModel.toInlineShotString({
              author: shot.author.name,
              choice: shot.choice,
              symbol: shot.symbol.name,
              id: shot.id,
            })
          }
        }

        // 在 root 上新增 mirror & shot (if any)
        const bt = doc.createBullet({ head: `::${mirrorSymbol} ${inlineShotStr}` })
        // const bt = doc.createBullet({ head: `::${mirrorSymbol} {{inlineShotStr}}` })
        doc.insertBullet(bt, TreeService.tempRootCid)
      }

      doc.subSymbols = subDocs.map(e => e.symbol)

      const commit = await CommitModel.create(
        {
          cardStateInputs: [doc, ...subDocs].map(e => {
            const { prevState, card, symbol, subSymbols, value, cardInput } = e
            return {
              prevStateId: prevState?.id,
              cardId: card ? card.id : undefined,
              symbol,
              subSymbols,
              changes: [],
              finalValue: value,
              cardInput,
            }
          }),
        },
        TESTUSERS[0].id,
      )
      // console.log(inspect(selfRootDraft, { depth: null }))

      console.log(`Create a commit`)
    }
  }
}

main()
// .catch(err => {
//   console.error(err)
//   throw new Error()
// })
// .finally(async () => {
//   console.log('Done, closing primsa')
//   scraper.dump()
//   prisma.$disconnect()
//   process.exit()
// })
