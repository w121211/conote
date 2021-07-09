import got from 'got'
import { google } from 'googleapis'
import { DomainFetchFunction, DomainNotFitError } from './index'

const patterns = {
  video_id: [
    /(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/watch\?v=([\w_-]+)(?:&.*)?/i,
    /(?:http[s]?:\/\/)?youtu.be\/([\w_-]+)(?:\?.*)?/i,
  ],
  playlist_id: [/(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/playlist\?list=([\w_-]+)(?:&.*)?/i],
  channel_user: [/(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/user\/([\w_-]+)(?:\?.*)?/i],
  channel_id: [/(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/channel\/([\w_-]+)(?:\?.*)?/i],
  channel_custom: [
    /(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/c\/([\w_-]+)(?:\?.*)?/i,
    /(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/([\w_-]+)(?:\?.*)?/i,
  ],
}

const youtubeApi = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
})

function parseUrl(url: string): { vid: string } {
  for (const e of patterns.video_id) {
    const result = e.exec(url)
    if (result) {
      return { vid: result[1] }
    }
  }
  throw new DomainNotFitError()
}

// function determineInput(value) {
//   const parsed = {
//     type: 'unknown',
//     mayHideOthers: true,
//     original: value,
//   }
//   for (const k in patterns) {
//     for (let i = 0; i < patterns[k].length; i++) {
//       const regex = patterns[k][i]
//       const result = regex.exec(value)
//       if (result) {
//         parsed.type = type
//         parsed.value = result[1]
//         return parsed
//       }
//     }
//   }
//   return parsed
// }

export const youtube: DomainFetchFunction = async function (url) {
  // 測試domain
  const { vid } = parseUrl(url)

  const resp = await youtubeApi.videos.list({
    part: ['snippet'],
    id: [vid],
  })
  if (resp.data.items && resp.data.items[0]) {
    const e = resp.data.items[0]
    return {
      domain: 'youtube.com',
      resolvedUrl: url, // TODO: Bug 可能會有redirect, short-url, mobile-url
      srcType: 'VIDEO',
      srcId: vid,
      srcTitle: e.snippet?.title ?? undefined,
      srcPublishDate: e.snippet?.publishedAt ? new Date(e.snippet?.publishedAt).toISOString() : undefined,
      authorId: e.snippet?.channelId ?? undefined,
      authorName: e.snippet?.channelTitle ?? undefined,
      description: e.snippet?.description ?? undefined,
      tags: e.snippet?.tags ?? undefined,
    }
  }

  throw new Error(`youtube fetcher failed: ${url}`)
}
