import { inspect } from 'util'
import { readdirSync, readFileSync } from 'fs'
import { resolve, join } from 'path'
import { Author, Card, CardState, Link, PrismaClient, Shot, ShotChoice, Sym } from '.prisma/client'
import { TreeService } from '../../../packages/docdiff/src'
import { Editor as MKEditor, Markerline, splitByUrl } from '../../../packages/editor/src'
import { FetchClient } from '../../lib/fetcher/fetcher'
import { CardMeta, CardModel } from '../../lib/models/card'
import { TestDataHelper, TESTUSERS } from '../../test/test-helpers'
import { ShotBody, ShotModel } from '../../lib/models/shot'
import { CommitModel } from '../../lib/models/commit'
import { CardStateBody, CardStateParsed } from '../../lib/models/card-state'
import { MKDoc } from './mk-doc'
// import { Doc, DocProps } from '../../components/workspace/workspace'
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
  Shot & {
    author: Author
    sym: Sym
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

const main = async () => {
  console.log('Truncating databse...')
  await prisma.$queryRaw`TRUNCATE "Author", "Bullet", "BulletEmoji", "Card", "CardState", "CardEmoji", "Link", "Poll", "Shot", "Sym", "User" CASCADE;`

  console.log('Creating test users...')
  await TestDataHelper.createUsers(prisma)

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
        sym: Sym
        meta: CardMeta
        state: CardStateParsed | null
      }
      try {
        webpageCard = await CardModel.getOrCreateByUrl({ scraper, url })
      } catch (err) {
        console.warn(err)
        continue
      }

      // {
      //   symbol: string
      //   cardInput: CardInput | null
      //   cardCopy: Card | null
      //   sourceCardCopy: Card | null
      //   // subSymbols?: string[]
      //   updatedAt?: number
      //   // value: TreeNode<Bullet>[]
      //   // syncValue: LiElement[]
      //   editorValue: LiElement[]
      // }

      const doc = new MKDoc({
        symbol: webpageCard.sym.symbol,
        cardInput: null,
        cardCopy: webpageCard,
        sourceCardCopy: null,
        value: webpageCard.state ? (webpageCard.state.body as unknown as CardStateBody).value : [],
      })
      const subDocs: MKDoc[] = []

      const mkEditor = new MKEditor('', [], webpageCard.link.url, webpageCard.link.authorId ?? undefined)
      mkEditor.setText(text)
      mkEditor.flush()

      for (const [cardlabel, markerlines] of mkEditor.getNestedMarkerlines()) {
        const mirrorSymbol = cardlabel.symbol
        const mirrorCard = await CardModel.getBySymbol(mirrorSymbol)
        const mirrorDoc = mirrorCard
          ? new MKDoc({
              symbol: mirrorSymbol,
              cardInput: null,
              cardCopy: mirrorCard,
              sourceCardCopy: webpageCard,
              value: (mirrorCard.state.body as unknown as CardStateBody).value,
            })
          : new MKDoc({
              symbol: mirrorSymbol,
              cardInput: { symbol: mirrorSymbol, meta: {} },
              cardCopy: null,
              sourceCardCopy: webpageCard,
              value: [],
            })
        mirrorDoc.insertMarkerLines({ markerlines })
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
            const shot = await getNeatReply({
              authorId: webpageCard.link.authorId,
              neatReply: neatReplies[0],
              linkId: webpageCard.linkId,
              symbol: mirrorSymbol,
              userId: TESTUSERS[0].id,
            })
            inlineShotStr = ShotModel.toInlineShotString({
              author: shot.author.name,
              choice: shot.choice,
              symbol: shot.sym.symbol,
              id: shot.id,
            })
          }
        }

        // 在 root 上新增 mirror & shot (if any)
        const bt = doc.createBullet({ head: `::${mirrorSymbol} ${inlineShotStr}` })
        // const bt = doc.createBullet({ head: `::${mirrorSymbol} {{inlineShotStr}}` })
        doc.insertBullet(bt, TreeService.tempRootCid)
      }

      const commit = await CommitModel.create(
        {
          cardStateInputs: [doc, ...subDocs].map(e => {
            const { cid, cardCopy, sourceCardCopy, cardInput, value } = e
            return {
              cid,
              prevStateId: cardCopy?.state?.id,
              cardId: cardCopy?.id,
              sourceCardId: sourceCardCopy?.id,
              changes: [],
              value,
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
