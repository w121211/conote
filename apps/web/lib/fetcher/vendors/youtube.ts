import { google } from 'googleapis'
import { LinkScrapedResult } from '../../interfaces'
import { DomainFetchFunction, DomainNotFitError } from './index'

const reYoutube = {
  video_id: [
    /(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/watch\?v=([\w_-]+)(?:&.*)?/i,
    /(?:http[s]?:\/\/)?youtu.be\/([\w_-]+)(?:\?.*)?/i,
  ],
  playlist_id: [
    /(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/playlist\?list=([\w_-]+)(?:&.*)?/i,
  ],
  channel_user: [
    /(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/user\/([\w_-]+)(?:\?.*)?/i,
  ],
  channel_id: [
    /(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/channel\/([\w_-]+)(?:\?.*)?/i,
  ],
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
  for (const e of reYoutube.video_id) {
    const result = e.exec(url)
    if (result) {
      return { vid: result[1] }
    }
  }
  throw new DomainNotFitError(`Not found youtube video id: ${url}`)
}

export const youtube: DomainFetchFunction = async url => {
  const { vid } = parseUrl(url) // include test domain

  const resp = await youtubeApi.videos.list({
    part: ['snippet'],
    id: [vid],
  })
  if (resp.data.items && resp.data.items[0]) {
    const e = resp.data.items[0]
    const res: LinkScrapedResult = {
      domain: 'youtube.com',
      finalUrl: url, // TODO: (bug) possibly be redirect, short-url, mobile-url
      srcType: 'video',
      srcId: vid,
      authorId: e.snippet?.channelId ?? undefined,
      authorName: e.snippet?.channelTitle ?? undefined,
      date: e.snippet?.publishedAt
        ? new Date(e.snippet.publishedAt).toISOString()
        : undefined,
      description: e.snippet?.description ?? undefined,
      title: e.snippet?.title ?? undefined,
      keywords: e.snippet?.tags ?? undefined,
    }
    return res
  }

  throw new Error(`Youtube fetcher failed: ${url}`)
}
