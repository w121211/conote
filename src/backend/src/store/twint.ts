/**
 * 抓elasticsearch的資料（twint project），用cronjob執行（與server-node分開）
 *
 * Run:
 * cd .../src && npx ts-node twint.ts
 */
import { Client, ApiResponse, RequestParams } from '@elastic/elasticsearch';
import * as PA from '@prisma/client';

const es = new Client({ node: 'http://es:9200' });

const commonScanParams = {
  youtube: '*youtube*',
};

async function scanPages(params: string, afterAt?: Date) {
  /** 返回pages */
}

// --- Youtube (author, video)

async function _saveYtChannelPage(botEmail: string, hit: any) {
  /** 依序建立: 1. author-symbol 2. page 3. link */
  const j = JSON.parse(hit['_source']['entry_meta']);
  const d = {
    // id: j["id"],
    url: hit['_id'],
    // contentId: j["yt_channelid"],
    contentId: j['id'],
    symbol: `@${j['yt_channelid']}:youtube`,
    srcTitle: j['title'],
  };
  // 若已有author-symbol，則返回
  // const [symbol, created] = await getOrCreateSymbol(PA.SymbolCat.AUTHOR, d.symbol);
  // if (!created) {
  //   console.log(`Page:${d.symbol}已經建立，跳過`);
  //   return;
  // }
  // const page = await insertPage(botEmail, initAuthorPage(d.symbol, d.srcTitle));
  // console.log(page);
  // const [link, _] = await getOrCreateLink(d.url, page, PA.LinkContentType.AUTHOR, d.contentId);
}

async function _saveYtVideoPage(botEmail: string, hit: any) {
  /** 依序建立: 1. page 2. link */
  const j = JSON.parse(hit['_source']['entry_meta']);
  const d = {
    url: hit['_id'],
    contentId: j['id'],
    contentAuthorId: j['yt_channelid'],
    srcAuthor: `@${j['yt_channelid']}:youtube`,
    srcTitle: j['title'],
  };
  // 若已有page，則返回
  // const [res, parsed] = await getLink(d.url);
  // if (res !== null) {
  //   console.log(`Link:${d.url}已經建立，跳過`);
  //   return;
  // }
  // 建立page、link
  // const page = await insertPage(botEmail, initWebpagePage(parsed.url, d.srcAuthor, d.srcTitle));
  // const link = await createLink(parsed, page, PA.LinkContentType.AUTHOR, d.contentId, d.contentAuthorId);
}

async function saveYoutubePages(botEmail: string, after: Date = new Date(2020, 1, 1)) {
  // 抓channel
  const prams1: RequestParams.Search = {
    index: 'scraper-page',
    body: {
      query: {
        bool: {
          must: [
            { wildcard: { from_url: '*youtube*' } },
            { wildcard: { from_url: '*channel*' } },
            { range: { created_at: { gte: after.toISOString() } } },
          ],
        },
      },
    },
  };
  const res1: ApiResponse = await es.search(prams1);
  // console.log(chRes.body.hits.total)
  for (const h of res1.body.hits.hits) {
    // console.log(h)
    await _saveYtChannelPage(botEmail, h);
  }

  // 抓videos
  const params2: RequestParams.Search = {
    index: 'scraper-page',
    body: {
      query: {
        bool: {
          must: [{ wildcard: { from_url: '*youtube*' } }, { range: { created_at: { gte: after.toISOString() } } }],
        },
      },
    },
  };
  const res2: ApiResponse = await es.search(params2);
  for (const h of res2.body.hits.hits) {
    await _saveYtVideoPage(botEmail, h);
  }
}

async function run(): Promise<void> {
  const botEmail = 'bot@bot.bot';
  await saveYoutubePages(botEmail);
}

run().catch(function (e: Error) {
  console.error(e);
  // process.exit(1)
});
