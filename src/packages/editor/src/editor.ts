/**
 * 原則：直接儲存text（含stamp）+linemetas
 * 概念：
 * 1. note的核心為text（純文字），編輯是純文字編輯
 * 2. text中分為marker-line, plain-text
 *    - marker-line會紀錄marker, value及其他meta（例如編輯者、來源等），並會建立對應的`anchor`
 * 3. 在儲存時，
 *    - 對沒有stamp的marker-line產生stamp -> server端會依照stamp取得line-meta，建立anchor
 *    - 對已經有stamp的marker-line不額外處理
 *
 * 步驟：
 * 1. 輸入text(string)
 * 2. 轉成section: 對texttokenize -> secteions，section可分為root, ticker, topic, plain-string
 * 3. 轉成markers: 對每個section tokenize -> markers
 * 4. 在編輯過程中不管stamp，user若將stamp刪除則會變成orphan-stamp
 * 5. 儲存時，依序 1. 對新的marker-line建立anchor 2. 存root-card 3. 插入marker-line至對應的nested-card
 *
 * Get: stamp-text + linemetas
 * Show: tokenized sections -> for each section for each token, render token (其中value-token的顯示需要搭配stamp)
 * Edit: tokenized sections -> for each section, for each token, render token (實時)
 * Upsert: tokenized sections -> update stamp & linemetas -> (server)依linemetas建立stamps & 更新linemetas -> (server)儲存text
 *
 * Nested-card: (server) for each linemetas, if linemeta has nested card, 同步於nested card更新text (through marker), linemetas
 *
 * 需要考慮但目前暫時忽略的問題
 * - 當stamp損壞、遺失時，沒有補救機制（例如惡意把stamp消掉，程式會視為新的marker而建立一個新stamp）
 *
 * Stamp:
 * [+]
 * something %sajs
 * another %swjd
 * [poll] [X]Buy []Sell %qwi2
 * 
 * 
// (Server) 更新 webpage-card -> 同步更新ocard, cocard
// for (const e of linemetas.filter(e => e.new)) {
//     const stamp = insertAnchor()
//     e.userId = userId
//     e.stampId = stamp.id
// }
// const savedText = JSON.stringify(linemetas) + '\n' + text
// const lines = cocard.text.split('\n')
// lines.insert(lastMarkerIdx, )
// (Server) 更新 my-card
 */
import { cloneDeep } from 'lodash'
import { CardLabel, DBLinker, Markerheader, Markerline, ExtToken, Section } from './typing'
import { filterTokens, toStampMarkerlinesDict } from './helper'
import { tokenizeSection } from './parser'
import { updateMarkerlines, insertMarkerlinesToText } from './markerline'

export class Editor {
  // private readonly _storedText: string
  // private readonly _storedMarkerLines: MarkerLine[];

  private _sects: Section[]
  private _text: string
  private _markerlines: Markerline[] = []

  // 預定要插入至bod的markerlines，在flush()時插入並清空（用在nested-card）
  private _markerlinesToInsert: Markerline[] = []

  private _src: string | undefined
  private _oauthor: string | undefined

  constructor(fromText = '', fromMarkerlines: Markerline[] = [], src?: string, oauthor?: string) {
    // if (fromText === undefined) {
    //   fromText = Editor._toStoredText('', [])
    // }

    // const [markerLines, body] = Editor._splitStoredText(fromText)
    const sects = tokenizeSection(fromText)

    // this._storedText = fromText
    this._markerlines = fromMarkerlines
    this._text = fromText
    this._sects = sects
    this._src = src
    this._oauthor = oauthor
  }

  // private static _toStoredText(body: string, markerLines: Markerline[]): string {
  //   return [JSON.stringify(markerLines), body].join('\n')
  // }

  // private static _splitStoredText(storedText: string): [Markerline[], string] {
  //   const lns = storedText.split('\n')
  //   const markerLines = JSON.parse(lns[0])
  //   const body = lns.splice(1).join('\n')
  //   return [markerLines, body]
  // }

  public getSections(): Section[] {
    // for (const sect of this._sects) {
    //   for (const e of filterTokens(sect.stream ?? [], f => f.type === 'stamp' || f.type === 'line-value')) {
    //     // e.markerline = dict[(e.content as string).trim()]
    //     console.log(e)
    //   }
    // }
    return this._sects
  }

  public getText(): string {
    return this._text
  }

  public setText(text: string): void {
    this._text = text
  }

  public getMarkerlines(): Markerline[] {
    return this._markerlines
  }

  public getNestedMarkerlines(): [CardLabel, Markerline[]][] {
    const nested: [CardLabel, Markerline[]][] = []
    for (const e of this._markerlines) {
      if (e.nestedCard && e.nestedCard.symbol) {
        const res = nested.find(f => f[0].symbol === e.nestedCard?.symbol)
        if (res === undefined) {
          nested.push([e.nestedCard, [e]])
        } else {
          res[1].push(e)
        }
      }
    }
    return nested
  }

  public setMarkerlinesToInsert(items: Markerline[]): void {
    this._markerlinesToInsert = cloneDeep(items)
  }

  public flush(opt = { attachMarkerlinesToTokens: false }): void {
    /** 跑tokenizer、更新markerlines, stamp，因為expensive，所以將此步驟獨立出來 */
    if (this._markerlinesToInsert.length > 0) {
      const { markerheaders, markerlines } = updateMarkerlines(
        this._markerlines,
        tokenizeSection(this._text),
        this._src,
        this._oauthor,
      )
      const [text, _markerlines] = insertMarkerlinesToText(
        markerheaders,
        markerlines,
        this._text,
        this._markerlinesToInsert,
      )
      this._text = text
      this._markerlines = _markerlines
      this._markerlinesToInsert = []
    }

    this._sects = tokenizeSection(this._text)
    const { markerlines } = updateMarkerlines(this._markerlines, this._sects, this._src, this._oauthor)
    this._markerlines = markerlines

    // 依照line-number對還沒有stamp的line插入stamp
    const lns = this._text.split('\n')
    for (const e of this._markerlines) {
      if (e.new && e.noStamp) {
        lns[e.linenumber] = `${lns[e.linenumber]} ${e.stampId}`
        delete e.noStamp
      }
    }
    this._text = lns.join('\n')

    if (opt.attachMarkerlinesToTokens) {
      // 在render的時候，token有markerline會更容易使用
      const dict: Record<number, Markerline> = {}
      for (const e of this._markerlines) {
        dict[e.linenumber] = e
      }
      for (const sect of this._sects) {
        for (const e of filterTokens(sect.stream ?? [], f =>
          ['stamp', 'line-value', 'inline-value'].includes(f.type),
        )) {
          e.markerline = dict[e.linenumber]
        }
      }
    }
  }

  public attachDblinker(stampDblinkerDict: Record<string, DBLinker>): void {
    const dict = toStampMarkerlinesDict(this._markerlines)
    for (const stamp in stampDblinkerDict) {
      const mkln = dict[stamp]
      if (mkln === undefined) {
        throw new Error('給予的stamp不在現有的markerlines中，anchor無法加入')
      }
      const linker = stampDblinkerDict[stamp]
      mkln.anchorId = linker.anchorId
      mkln.createrId = linker.createrId
      mkln.commentId = linker.commentId
      mkln.pollId = linker.pollId
      mkln.replyId = linker.replyId

      // 已經在Database上創立，刪除此標記
      delete mkln.new
    }
  }

  //   public addConnectedContents(record: MarkToConnectedContentRecord): void {
  //     /** 將connected-contents併入marker-lines
  //      * - marker-line需要先有stamp-id，併入後會把該marker-line的new拿掉（表示不需要建立anchor）
  //      * - 不用flush()
  //      *  */
  //     for (const k in record) {
  //       const mkln = this._markerlines.find(e => e.stampId && e.marker?.key === k)
  //       if (mkln === undefined) {
  //         console.error(this._body)
  //         throw new Error(`Card-body裡找不到${k}`)
  //       }
  //       const cont = record[k]
  //       if (cont.comment && cont.poll) {
  //         throw new Error('不能同時是comment & poll')
  //       }
  //       if (cont.comment) {
  //         if (cont.commentId === undefined) {
  //           throw new Error('缺commentId')
  //         } else {
  //           mkln.comment = true
  //           mkln.commentId = cont.commentId
  //         }
  //       }
  //       if (cont.poll) {
  //         if (cont.pollId === undefined || cont.commentId === undefined) {
  //           throw new Error('缺commentId or pollId')
  //         } else {
  //           mkln.poll = true
  //           mkln.pollId = cont.pollId
  //           mkln.commentId = cont.commentId
  //         }
  //       }
  //       delete mkln.new
  //     }
  //   }
}

// --- Unused functions, wait to remove ---

// function markersToText(markers: Marker[], formatter: MarkerFormat[]): string {
//   /**
//    * TODO:
//    * - netsed card
//    * - 排序、filter
//    * - 再編輯的情況：poll需要涵蓋上次投票&本次全新的
//    */
//   const lines: string[] = []
//   for (const e of formatter) {
//     if (e.inline) {
//       // TODO: 缺少驗證（例如inline mark可有複數個marker）
//       const mk = markers.find(f => f.mark === e.mark)
//       lines.push(`${e.mark} ${mk?.value ?? ''}`)
//     } else if (e.multiline) {
//       lines.push(`${e.mark}`)
//       for (const mk of markers.filter(f => f.mark === e.mark)) lines.push(`${mk.value}`)
//       lines.push('')
//     }
//   }
//   return lines.join('\n')
// }

// function initText(formatter: MarkerFormat[]): string {
//   let lines: string[] = []
//   // let linenumber = 0;

//   for (const e of formatter) {
//     let stamp: string

//     // 先處理data-creation & 建立linemeta, stamp
//     // if (e.poll) {
//     //   await prisma.poll.create({
//     //     data: {
//     //       cat: PA.PollCat.FIXED,
//     //       // status?: PollStatus
//     //       // choices?: XOR<PollCreatechoicesInput, Enumerable<string>>
//     //       // user: UserCreateOneWithoutPollsInput
//     //       // comment: CommentCreateOneWithoutPollInput
//     //       // votes?: VoteCreateManyWithoutPollInput
//     //       // count?: PollCountCreateOneWithoutPollInput
//     //     }
//     //   })
//     // }

//     // 處理實際的text
//     if (e.inline) {
//       lines = lines.concat(`${e.mark}\n`.split('\n'))
//     }
//     if (e.multiline) {
//       lines = lines.concat(`${e.mark}\n\n\n\n`.split('\n'))
//     }
//   }
//   return lines.join('\n')
// }

// export const MARKER_FORMAT: Record<string, MarkerFormat> = {
//   // srcId: { mark: '[_srcId]', inline: true, meta: true, freeze: true, },
//   // srcType: { mark: '[_srcType]', inline: true, meta: true, freeze: true, },
//   // '_oauthor': {},
//   // '_url': {},
//   srcTitle: { mark: '[_srcTitle]', meta: true, inline: true, freeze: true },
//   srcPublishDate: { mark: '[_srcPublishDate]', meta: true, inline: true, freeze: true },
//   link: { mark: '[_link]', meta: true, multiline: true },
//   keyword: { mark: '[_keyword]', meta: true, inline: true, list: true },

//   plus: { mark: '[+]', multiline: true },
//   minus: { mark: '[-]', multiline: true },
//   note: { mark: '[note]', multiline: true },
//   // ticker: { mark: '[car]', nested: true },
//   // card: { mark: '[card]', nested: true },

//   price: {
//     mark: '[price]',
//     inline: true,
//     poll: true,
//     pollVotes: [],
//     validater: a => !isNaN(parseFloat(a)),
//   },
//   act: { mark: '[act]', inline: true, poll: true, pollVotes: ['Buy', 'Sell'] },
// }
// export const WEBPAGE_HEAD_FORMATTER: MarkerFormat[] = [
//   MARKER_FORMAT.srcTitle,
//   MARKER_FORMAT.srcPublishDate,
//   MARKER_FORMAT.keyword,
//   MARKER_FORMAT.link,
// ]
// export const TICKER_FORMATTER: MarkerFormat[] = [MARKER_FORMAT.plus, MARKER_FORMAT.minus, MARKER_FORMAT.price]
// export const WEBPAGE_BODY_FORMATTER: MarkerFormat[] = [MARKER_FORMAT.note]
