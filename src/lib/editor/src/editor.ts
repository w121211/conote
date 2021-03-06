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
import { findLastIndex, cloneDeep } from 'lodash'
import { Chance } from 'chance'
import {
  CardLabel,
  Marker,
  MarkerFormat,
  Markerheader,
  Markerline,
  ExtToken,
  ExtTokenStream,
  Section,
  MarkToConnectedContentRecord,
} from './typing'
import { filterTokens, streamToStr, markerToStr } from './helper'
import { tokenizeSection } from './parser'

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

export function insertMarkerlinesToBody(
  curMarkerheaders: Markerheader[],
  curMarkerlines: Markerline[],
  curBody: string,
  insertMarkerlines: Markerline[],
  chance: { string: (a: any) => string },
): [string, Markerline[]] {
  /** 將markerline插入至body-text中，插入的line會同時加入stamp 注意：插入後line-number會變動，這裡不更新line-number */

  // 將body分成一行一行，每行搭配對應的markerline, markerheader
  const lns: [string, { markerheader?: Markerheader; markerline?: Markerline }][] = curBody
    .split('\n')
    .map<[string, { markerheader?: Markerheader; markerline?: Markerline }]>((e, i) => {
      const markerheader = curMarkerheaders.find(e => e.linenumber === i)
      const markerline = curMarkerlines.find(e => e.linenumber === i)
      return [e, { markerheader, markerline }]
    })

  function _insert(marekerline: Markerline, chance: { string: (a: any) => string }) {
    const a: Markerline = {
      // line-number需要之後再update
      linenumber: -1,
      str: marekerline.str,
      marker: marekerline.marker,
      new: true,
      src: marekerline.src,
      srcStamp: marekerline.stampId,
      oauthor: marekerline.oauthor,
      stampId: `%${chance.string({
        length: 3,
        pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      })}`,
    }

    if (a.marker) {
      const strWithStamp = `${markerToStr(a.marker, false)} ${a.stampId}`

      // 找對應的marker-header，並插入至header下一行
      const idx = lns.findIndex(e => e[1].markerheader?.marker.key && e[1].markerheader.marker.key === a.marker?.key)
      if (idx >= 0) {
        lns.splice(idx + 1, 0, [strWithStamp, { markerline: a }])
      } else {
        // 找不到marker-header的情況，插入一個header
        lns.push([a.marker.key, { markerheader: { linenumber: -1, marker: { key: a.marker.key } } }])
        lns.push([strWithStamp, { markerline: a }])
      }

      // const idx = findLastIndex(lns, e => e[1]?.marker?.mark === marekerline.marker?.mark)
    }
  }

  for (const e of insertMarkerlines) {
    if (e.marker && e.marker.key && e.marker.value) {
      _insert(e, chance)
    } else {
      console.error(`想插入的markerline不符合格式\n${e}`)
      // throw new Error('想插入的markerline不符合格式')
    }
  }

  // 將分行的body重新組合起來
  let joinedBody = ''
  const markerlines: Markerline[] = []
  for (const [str, { markerline }] of lns) {
    joinedBody += `${str}\n`
    if (markerline) {
      markerlines.push(markerline)
    }
  }

  return [joinedBody, markerlines]
}

export function updateMarkerlines(
  cur: Markerline[],
  sects: Section[],
  chance: { string: (a: any) => string },
  src?: string,
  oauthor?: string,
): {
  markerheaders: Markerheader[]
  markerlines: Markerline[]
} {
  /** 和初始比較，1. 基於stamp更新markerline的line-number、value等等、2. 對新的line增加markerline，返回更新後的markerLines，這裡面不會動到body-text */

  // 建立stamp-dict
  const dict: Record<string, Markerline> = {}
  for (const e of cur) {
    if (e.stampId !== undefined) {
      dict[e.stampId as string] = e
    }
  }

  // 建立、更新markerLines，同步檢查、建立stamp
  const markerlines: Markerline[] = []
  const markerheaders: Markerheader[] = []

  for (const sect of sects) {
    // 1. 針對marker-header，只需紀錄mark的linenumber
    for (const tk of filterTokens<ExtToken>(
      sect.stream ?? [],
      e => e.type === 'line-mark' || e.type === 'inline-mark',
    )) {
      if (tk.marker === undefined) {
        throw new Error('line-marker, inline-mark token一定要有marker')
      }
      markerheaders.push({
        linenumber: tk.linenumber,
        marker: tk.marker,
        inline: tk.type === 'inline-mark' ? true : undefined,
      })
    }

    // 2. 針對line-value
    for (const tk of filterTokens<ExtToken>(
      sect.stream ?? [],
      e => e.type === 'inline-value' || e.type === 'line-value',
    )) {
      if (tk.marker === undefined) {
        throw new Error('line-value, inline-value token一定要有marker')
      }
      const _updated = {
        linenumber: tk.linenumber,
        str: streamToStr(tk),
        marker: tk.marker,
        nestedCard: sect.nestedCard,
      }
      const stampTokens = filterTokens<ExtToken>(tk.content ?? [], e => e.type === 'stamp')

      if (stampTokens.length === 0) {
        // 沒有stamp
        // TODO: 要確保stampId不重複
        markerlines.push({
          ..._updated,
          new: true,
          noStamp: true,
          src,
          oauthor,
          stampId: `%${chance.string({
            length: 3,
            pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
          })}`,
        })
        continue
      } else {
        // 有stamp
        // 註：Prism-Parser程式上不會在同一行內找到2個stamp-token
        const _stamp = (stampTokens[0].content as string).trim()
        if (_stamp in dict) {
          // TODO: 和原始markerLine比較是否有更動
          markerlines.push({ ...dict[_stamp], ..._updated })
        } else {
          // 有anchor但broken
          // console.log(cur)
          // console.log(dict)
          // console.log({ ..._updated, stampId: _stamp, broken: true })
          markerlines.push({ ..._updated, stampId: _stamp, broken: true })
        }
      }
    }
  }

  // 依linenumber排序markerlines（不能忽略，因為有些function會需要找最後一行）
  markerheaders.sort((a, b) => a.linenumber - b.linenumber)
  markerlines.sort((a, b) => a.linenumber - b.linenumber)

  return { markerheaders, markerlines }
}

export class TextEditor {
  // 從前次儲存的text開始做編輯
  private readonly _storedText: string
  // private readonly _storedMarkerLines: MarkerLine[];
  private readonly chance = new Chance()

  private _sects: Section[]
  private _body: string
  private _markerlines: Markerline[] = []

  // 預定要插入至bod的markerlines，在flush()時插入並清空（用在nested-card）
  private _markerlinesToInsert: Markerline[] = []

  private _src: string | undefined
  private _oauthor: string | undefined

  constructor(fromText?: string, src?: string, oauthor?: string) {
    if (fromText === undefined) {
      fromText = TextEditor._toStoredText('', [])
    }
    const [markerLines, body] = TextEditor._splitStoredText(fromText)
    const sects = tokenizeSection(body)

    this._storedText = fromText
    this._markerlines = markerLines
    this._body = body
    this._sects = sects
    this._src = src
    this._oauthor = oauthor
  }

  private static _toStoredText(body: string, markerLines: Markerline[]): string {
    return [JSON.stringify(markerLines), body].join('\n')
  }

  private static _splitStoredText(storedText: string): [Markerline[], string] {
    const lns = storedText.split('\n')
    const markerLines = JSON.parse(lns[0])
    const body = lns.splice(1).join('\n')
    return [markerLines, body]
  }

  public getSections(): Section[] {
    // for (const sect of this._sects) {
    //   for (const e of filterTokens(sect.stream ?? [], f => f.type === 'stamp' || f.type === 'line-value')) {
    //     // e.markerline = dict[(e.content as string).trim()]
    //     console.log(e)
    //   }
    // }
    return this._sects
  }

  public getBody(): string {
    return this._body
  }

  public setBody(body: string): void {
    this._body = body
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

  public toStoredText(): string {
    return TextEditor._toStoredText(this._body, this._markerlines)
  }

  public flush(opt = { attachMarkerlinesToTokens: false }): void {
    /** 跑tokenizer、更新markerlines, stamp，因為expensive，所以將此步驟獨立出來 */
    if (this._markerlinesToInsert.length > 0) {
      const { markerheaders, markerlines } = updateMarkerlines(
        this._markerlines,
        tokenizeSection(this._body),
        this.chance,
        this._src,
        this._oauthor,
      )
      // console.log(markerlines)
      // return
      const [body, _markerlines] = insertMarkerlinesToBody(
        markerheaders,
        markerlines,
        this._body,
        this._markerlinesToInsert,
        this.chance,
      )
      this._body = body
      this._markerlines = _markerlines
      this._markerlinesToInsert = []
    }
    this._sects = tokenizeSection(this._body)
    const { markerlines } = updateMarkerlines(this._markerlines, this._sects, this.chance, this._src, this._oauthor)
    this._markerlines = markerlines

    // 依照line-number對還沒有stamp的line插入stamp
    const lns = this._body.split('\n')
    for (const e of this._markerlines) {
      if (e.new && e.noStamp) {
        lns[e.linenumber] = `${lns[e.linenumber]} ${e.stampId}`
        delete e.noStamp
      }
    }
    this._body = lns.join('\n')

    if (opt.attachMarkerlinesToTokens) {
      // attach marklines with tokens
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

  public addAnchors(anchors: { id: number; userId: string; stamp: string }[]): void {
    const dict: Record<string, Markerline> = {}
    for (const e of this._markerlines) {
      dict[e.stampId as string] = e
    }
    for (const anchor of anchors) {
      if (anchor.stamp === null) throw new Error()
      const markerline = dict[anchor.stamp]
      markerline.anchorId = anchor.id
      markerline.userId = anchor.userId
      delete markerline.new
    }
  }

  public addConnectedContents(record: MarkToConnectedContentRecord): void {
    /** 將connected-contents併入marker-lines
     * - marker-line需要先有stamp-id，併入後會把該marker-line的new拿掉（表示不需要建立anchor）
     * - 不用flush()
     *  */
    for (const k in record) {
      const mkln = this._markerlines.find(e => e.stampId && e.marker?.key === k)
      if (mkln === undefined) {
        console.error(this._body)
        throw new Error(`Card-body裡找不到${k}`)
      }

      const cont = record[k]
      if (cont.comment && cont.poll) {
        throw new Error('不能同時是comment & poll')
      }
      if (cont.comment) {
        if (cont.commentId === undefined) {
          throw new Error('缺commentId')
        } else {
          mkln.comment = true
          mkln.commentId = cont.commentId
        }
      }
      if (cont.poll) {
        if (cont.pollId === undefined || cont.commentId === undefined) {
          throw new Error('缺commentId or pollId')
        } else {
          mkln.poll = true
          mkln.pollId = cont.pollId
          mkln.commentId = cont.commentId
        }
      }

      delete mkln.new
    }
  }
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
