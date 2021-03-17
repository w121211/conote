// import * as request from 'request'
import got from 'got'
// import KeyvRedis from '@keyv/redis'
import * as PA from '@prisma/client'
import { prisma } from '../context'

// const keyv = new KeyvRedis('redis://redis:6379')
// keyv.on('error', (err: any) => console.log('Connection Error', err))

interface ParsedUrl {
  url: string
  domain: string
}

interface FetchResult {
  domain: string
  resolvedUrl: string
  oauthorName?: string
  srcId?: string
  srcType: PA.SrcType
  srcTitle?: string
  srcPublishDate?: string
}

function toOauthorName(domain: string, domainAuthorName: string) {
  return `${domainAuthorName}:${domain}`
}

function parseUrl(url: string): ParsedUrl {
  /**
   * TODO: 不同的URL(eg: short-url)可能指向同一頁面，需整合
   * - 特別是URL params
   */
  let u = new URL(url)
  return {
    url: url,
    domain: u.hostname,
  }
}

const fetcher: Record<string, (url: string, domain?: string) => Promise<FetchResult>> = {
  youtube: async function (url: string) {
    const domain = 'youtube'
    const u = new URL(url)
    const vid = new URLSearchParams(u.search).get('v')
    // try {
    // const resp = await got.get('https://youtube.com/get_video_info', { searchParams: { video_id: vid } })
    // } catch (error) {
    //     console.log(error.response.body)
    // }
    const resp = await got.get('https://youtube.com/get_video_info', {
      searchParams: { video_id: vid },
      // cache: keyv,
    })
    const p = new URLSearchParams(resp.body).get('player_response')
    if (p) {
      const j = JSON.parse(p).microformat.playerMicroformatRenderer
      return {
        domain,
        // TODO: 可能會有redirect, short-url
        resolvedUrl: url,
        oauthorName: toOauthorName(domain, j.ownerChannelName),
        srcId: vid ?? '',
        srcType: PA.SrcType.VIDEO,
        srcTitle: j.title.simpleText,
        srcPublishDate: new Date(j.publishDate).toISOString(),
        // channelId: j.externalChannelId,
        // channelName: j.ownerChannelName,
        // viewCount: j.viewCount
      }
    }
    throw new Error()
  },
  default: async function (url, domain) {
    if (domain === undefined) throw new Error()
    return {
      domain,
      resolvedUrl: url,
      srcType: PA.SrcType.OTHER,
    }
  },
}

async function fetch(url: string): Promise<FetchResult> {
  /** 嘗試連接URL取得來源資訊 */
  const parsed = parseUrl(url)

  let fetched: FetchResult
  // if (parsed.domain === 'www.youtube.com') {
  //   fetched = await fetcher.youtube(parsed.url)
  // } else {
  //   fetched = await fetcher.default(parsed.url, parsed.domain)
  // }
  fetched = await fetcher.default(parsed.url, parsed.domain)

  return fetched
}

// --- Database Ops ---

export async function createLink(
  parsed: ParsedUrl,
  srcType?: PA.SrcType,
  srcId?: string,
  contentAuthorId?: string,
): Promise<PA.Link | null> {
  return await prisma.link.create({
    data: {
      url: parsed.url,
      domain: parsed.domain,
      srcType,
      srcId,
      // contentAuthorId,
    },
  })
}

export async function getOrCreateLink(url: string): Promise<[PA.Link, { fetched?: FetchResult }]> {
  /**
   * 給予一個URL，從資料庫中返回該URL對應的link
   * 若link未存在，建立link，同時建立oauthor
   */
  // TODO: 這個url尚未resolved, 需要考慮redirect、不同url指向同一個頁面的情況
  const parsed = parseUrl(url)
  const found = await prisma.link.findUnique({ where: { url: parsed.url } })

  if (found !== null) {
    return [found, {}]
  }

  // Link未存在，嘗試fetch取得來源資訊，建立link, cocard, oauthor後返回
  // TODO: 可能在fetch後發現resolved-url已經存在
  const fetched = await fetch(url)

  // TODO: Oauthor的辨識太低，而且沒有統一
  const oauthor = fetched.oauthorName
    ? await prisma.oauthor.upsert({
        where: { name: fetched.oauthorName },
        create: { name: fetched.oauthorName },
        update: {},
      })
    : undefined
  const link = await prisma.link.create({
    data: {
      url: fetched.resolvedUrl,
      domain: fetched.domain,
      srcId: fetched.srcId,
      srcType: fetched.srcType,
      extra: fetched as object,
      oauthor: oauthor ? { connect: { id: oauthor.id } } : undefined,
    },
  })

  return [link, { fetched }]
}
