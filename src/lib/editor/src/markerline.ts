import { Markerheader, Markerline, ExtToken, Section } from './typing'
import { filterTokens, streamToStr, markerToStr, toStampMarkerlinesDict } from './helper'

/**
 * 將markerline插入至body-text中，插入的line會同時加入stamp
 * 注意：插入後line-number會變動，但這裡不更新line-number，需要另外叫`updateMarkerlines()`來修正
 * */
export function insertMarkerlinesToText(
  curMarkerheaders: Markerheader[],
  curMarkerlines: Markerline[],
  curText: string,
  insertMarkerlines: Markerline[],
  chance: { string: (a: any) => string },
): [string, Markerline[]] {
  // 將body分成一行一行，每行搭配對應的markerline, markerheader
  const lns: [string, { markerheader?: Markerheader; markerline?: Markerline }][] = curText
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

/**
 * 和原本的markerlines比較，返回更新後的markerLines，過程中不會動到text
 * 1. 依照stamp更新markerline的line-number、value等等  TODO：需要check, validate
 * 2. 對新的line增加markerline
 */
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
  // 建立、更新markerLines，同步檢查、建立stamp
  const dict = toStampMarkerlinesDict(cur)
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

    // 2. 針對line value, inline-value
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
        // 沒有stamp，生成一個stmampId TODO: 要確保stampId不重複

        // 1. 辨識是否為comment, poll, reply, neat-reply，需為`[?]`
        let isComment: true | undefined
        let isPoll: true | undefined
        let isReply: true | undefined // TODO: 還未支援
        let isNeatReply: true | undefined
        let pollChoices

        if (tk.marker.key === '[?]') {
          const choices = filterTokens<ExtToken>(tk.content ?? [], e => e.type === 'vote-chocie')
          if (choices.length === 1) {
            isNeatReply = true
            pollChoices = choices.map<string>(e => streamToStr(e))
          } else if (choices.length > 0) {
            isPoll = true
            pollChoices = choices.map<string>(e => streamToStr(e))
          } else {
            isComment = true
          }
        }

        // 2. 生成stampId、存入
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
          comment: isComment,
          poll: isPoll,
          pollChoices,
          neatReply: isNeatReply,
        })
        continue
      } else {
        // 有stamp TODO: validate

        // Hack: Prism-Parser不會在同一行內找到2個stamp-token，可直接用index=0來呼叫
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

  // 依linenumber排序markerlines，不能省略，因為有些function會需要找最後一行
  markerheaders.sort((a, b) => a.linenumber - b.linenumber)
  markerlines.sort((a, b) => a.linenumber - b.linenumber)

  return { markerheaders, markerlines }
}
