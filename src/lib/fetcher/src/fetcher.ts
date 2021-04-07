import got from 'got'
// import KeyvRedis from '@keyv/redis'
import { FetchResult, SrcType } from './index'

// const keyv = new KeyvRedis('redis://redis:6379')
// keyv.on('error', (err: any) => console.log('Connection Error', err))

export const fetcher: Record<string, (url: string, domain?: string) => Promise<FetchResult>> = {
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
      const j = JSON.parse(p)
      return {
        domain,
        // TODO: 可能會有redirect, short-url
        resolvedUrl: url,
        srcType: SrcType.VIDEO,
        srcId: vid ?? '',
        srcTitle: j.microformat.playerMicroformatRenderer.title.simpleText,
        srcPublishDate: new Date(j.microformat.playerMicroformatRenderer.publishDate).toISOString(),
        authorId: j.microformat.playerMicroformatRenderer.externalChannelId,
        authorName: j.microformat.playerMicroformatRenderer.ownerChannelName,
        keywords: j.videoDetails.keywords,
        description: j.videoDetails.shortDescription,
      }
    }
    throw new Error(`youtube fetcher failed: ${url}`)
  },
  default: async function (url, domain) {
    if (domain === undefined) throw new Error()
    return {
      domain,
      resolvedUrl: url,
      srcType: SrcType.OTHER,
    }
  },
}

// function youtube(): void {
//   console.log('hi')
// }

// const fetchers = [youtube]

// function fetch() {
//   const domain = resolveDomain(url)
//   const fetcher = fetchers.find(e => e.matcher(domain))
//   fetcher
// }
