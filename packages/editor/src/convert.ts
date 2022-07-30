import { readdirSync, readFileSync } from 'fs'
import { join, resolve } from 'path'
import { Editor } from './editor'
import { splitByUrl } from './parser'

const RateChoice = {
  LONG: 'LONG',
  SHORT: 'SHORT',
  HOLD: 'HOLD',
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

/**
 *
 */
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
 *
 */
function convert() {}

function main() {
  const ignoreFileStartsWith = '_',
    includeFiles = [
      '20210425-j.txt',
      // '20210615-j.txt',
      // '20210716-j.txt',
      // '20210816-j.txt',
    ],
    filesDirPath = resolve(process.cwd(), process.argv[2])

  for (const filename of readdirSync(filesDirPath).sort()) {
    if (filename.startsWith(ignoreFileStartsWith)) {
      console.log(`Skip: ${filename}`)
      continue
    }
    if (includeFiles.length > 0 && !includeFiles.includes(filename)) {
      console.log(`Skip: ${filename}`)
      continue
    }

    const filepath = join(filesDirPath, filename),
      f = readFileSync(filepath, { encoding: 'utf8' })
    console.log(`*\n*\n* Convert file: ${filepath}`)

    for (const [url, text] of splitByUrl(f)) {
      console.log(`Working on: ${url}`)

      //   let webpageNote: Omit<Note, 'meta'> & {
      //     link: Link
      //     sym: Sym
      //     meta: NoteMeta
      //     state: NoteStateParsed | null
      //   }
      //   try {
      //     webpageNote = await NoteModel.getOrCreateByUrl({ scraper, url })
      //   } catch (err) {
      //     console.warn(err)
      //     continue
      //   }

      //   const doc = new MKDoc({
      //     noteInput: null,
      //     noteCopy: webpageNote,
      //     fromDocCid: null,
      //     value: webpageNote.state ? webpageNote.state.body.value : [],
      //   })
      //   const subDocs: MKDoc[] = []

      const editor = new Editor(
        '',
        [],
        url,
        // webpageNote.link.authorId ?? undefined,
      )
      editor.setText(text)
      editor.flush()

      for (const [notelabel, markerlines] of editor.getNestedMarkerlines()) {
        const modalSymbol = notelabel.symbol
        const modalNote = await NoteModel.getBySymbol(modalSymbol)
        const modalDoc = modalNote
          ? new MKDoc({
              noteInput: null,
              noteCopy: modalNote,
              fromDocCid: doc.cid,
              value: modalNote.state?.body.value ?? [],
            })
          : new MKDoc({
              noteInput: { symbol: modalSymbol, meta: {} },
              noteCopy: null,
              fromDocCid: doc.cid,
              value: [],
            })
        modalDoc.insertMarkerLines({ markerlines })
        subDocs.push(modalDoc)

        // if (mirrorNote) {
        //   console.log(inspect((mirrorNote.state.body as unknown as NoteStateBody).value, { depth: null }))
        //   console.log(inspect(mirrorDoc.value, { depth: null }))
        // }
        // console.log(mirrorDoc)

        let inlineRateStr = ''
        const neatReplies = markerlines.filter(e => e.neatReply)
        if (neatReplies.length > 1) {
          console.warn(inspect(neatReplies, { depth: null }))
          throw '[conote-seed] neatReplies.length > 1'
        } else if (neatReplies.length === 1) {
          if (webpageNote.link.authorId && webpageNote.linkId) {
            const rate = await getNeatReply({
              authorId: webpageNote.link.authorId,
              neatReply: neatReplies[0],
              linkId: webpageNote.linkId,
              symbol: modalSymbol,
              userId: TESTUSERS[0].id,
            })
            inlineRateStr = InlineItemService.toInlineRateString({
              author: rate.author.name,
              choice: rate.choice,
              symbol: rate.sym.symbol,
              id: rate.id,
            })
          }
        }

        // 在 root 上新增 mirror & shot (if any)
        const bt = doc.createBullet({
          head: `::${modalSymbol} ${inlineRateStr}`,
        })
        // const bt = doc.createBullet({ head: `::${mirrorSymbol} {{inlineShotStr}}` })
        doc.insertBullet(bt, TreeService.tempRootCid)
      }

      const commit = await CommitModel.create(
        {
          noteStateInputs: [doc, ...subDocs].map(e => e.toGQLCardStateInput()),
        },
        TESTUSERS[0].id,
      )
      // console.log(inspect(selfRootDraft, { depth: null }))

      console.log(`Create a commit`)
    }
  }
}
