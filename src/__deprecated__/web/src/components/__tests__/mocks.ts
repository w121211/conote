import * as QT from '../../store/queryTypes'

const postContent = {
    text: `if it is a link-post, then here can be some thought,
    or it can be a post-post, and http://aaa.com, #tag, $AAA, !event will auto recognize
    if it is a commit-post/poll-post, here is words describe the commit/poll
    here should allow author to add some [image]s, put this feature on the list
    `,
    poll: {
        start: "2000-01-01",  // 不准變更
        end: "2000-01-10", // 不准變更
        choices: ["choice a", "choice b", "choice c"], // 不准變更
        // _start: "2000-01-01",
        // _end: "2000-01-10",
        // _result: {},
    },
    link: {
        urL: "http://url.com",
        domain: "some domain",
        published_at: "2001-01-01 03:50",
    }
}

const basePost = {
    title: "some link's article title goes here",
    status: QT.PostStatus.ACTIVE,
    content: postContent,
    count: {},
    comments: [],
}

export const mockedPollPost = {
    ...basePost,
    cat: QT.PostCat.POLL,
    votes: [
        { userId: 1239, choice: 1 },
        { userId: 3281, choice: 0 },
    ],
    // pollCount: [3, 10, 21],  // 對應3個choices
}

export const mockedLinkPost = {
    ...basePost,
}

const ticker = {
    slug: "$AAA",
    freq: "DAY",
    range: [new Date(2010, 1, 1), new Date(2010, 1, 3)],
    ticks: [
        [new Date(2010, 1, 1), 150],
        [new Date(2010, 1, 2), 153],
        [new Date(2010, 1, 3), 160],
    ],
    buyZone: [
        [new Date(2010, 1, 1), 120, 125],
        [new Date(2010, 1, 2), 120, 127],
        [new Date(2010, 1, 3), 121, 126],
    ],
    sellZone: [
        [new Date(2010, 1, 1), 120, 125],
        [new Date(2010, 1, 2), 120, 127],
        [new Date(2010, 1, 3), 121, 126],
    ],
    markers: [
        {
            at: new Date(2010, 1, 1),
            type: "6_MONTH_BOTTOM",
            event: "!generated-event",
        }
    ],
    trend: "LONG",
}

const roboPredict = {
    symbol: "AAA",
    nextTicks: [
        [new Date(2010, 1, 4), 163, 158, 168],  // mid, upper, lower
        [new Date(2010, 1, 5), 163, 158, 168],
        [new Date(2010, 1, 6), 163, 158, 168],
    ],
    buyZone: [121, 126],
    sellZone: [180, 190],
    // suggest: "HOLD",  // BUY, HOLD, SELL
    oneDay: {
        direction: "UP",
        probability: 0.6,
    },
    oneWeek: {
        direction: "NEUTRAL",
        probability: 0.6,
    },
    oneMonth: {
        direction: "UP",
        probability: 0.6,
    },
}

const event = {
    slug: "!some-event-name",
    trend: "RISING",  // NEW, RISING
    tags: ["#rising"],
    heatTicks: [
        [new Date(2010, 1, 1), 10],
        [new Date(2010, 1, 2), 13],
        [new Date(2010, 1, 3), 15],
    ],
    followedTicks: [
        [new Date(2010, 1, 1), 10],
        [new Date(2010, 1, 2), 13],
        [new Date(2010, 1, 3), 15],
    ],
    impacts: [
        {
            cat: "THEME",
            content: "#theme-aaa",
            direction: "UP",  // UP, DOWN
            volume: 0.2,
            curReact: "",
            status: "", // OVERREACT, REACTED, UNDERREACT, NOTREACT
            createdAt: new Date(2010, 1, 1),
            potentialProfit: [0.1, 0.5],
        },
        {
            cat: "COMPANY_SHORT_TERM",
            content: "$",
            react: "",
            createdAt: new Date(2010, 1, 1),
            potentialProfit: [0, 0],
        },
    ],
    similarEvents: ["!some-past-event"]
}

const theme = {
    tag: "#some-theme",
    tickers: ["$AAA", "$BBB"],
    metrics: [
        ["$AAA", 0.3], // price-change-in-a-year, company-value, ...
        ["$BBB", 0.18],
    ]
}

const company = {
    ticker: "$AAA",
    name: "AAA Company",
    graph: {
        prior: ["$BBB"],
        poster: ["$CCC"],
    }
}

const technicalSignal = {
    ticker: "$AAA",
    tag: "#some-tech-signal",
    impact: {

    }
}

const fundamentalSignal = {
    ticker: "$AAA",
    tag: "#some-fundamental-signal",  // eg: report-loss, lawsuit, management-change
    impcat: {
        predictPeriod: 'SHORT', // IMMIDIATELY, SHORT
        predictMagnitude: [0.02, 0.07],
        status: "END", // ONGOING, END, NOT HAPPEND
        realMagnitude: [],
    }
}

// const _post: QT.post_post = {
//   __typename: 'Post',
//   id: '1283792128',
//   cat: QT.PostCat.LINK,
//   status: QT.PostStatus.ACTIVE,
//   title: 'some title goes here',
//   content: JSON.stringify({
//     text: `if it is a link-post, then here can be some thought,
//       or it can be a post-post, and http://aaa.com, #tag, $AAA, !event will auto recognize
//       if it is a commit-post/poll-post, here is words describe the commit/poll
//       here should allow author to add some [image]s, put this feature on the list
//       `,
//     poll: {
//       start: "2000-01-01",  // 不准變更
//       end: "2000-01-10", // 不准變更
//       choices: ["choice a", "choice b", "choice c"], // 不准變更
//       // _start: "2000-01-01",
//       // _end: "2000-01-10",
//       // _result: {},
//     },
//     link: {
//       url: "http://some.external.url",
//       source: "external source",
//     }
//   }),
//   symbols: [
//     {
//       __typename: "Symbol",
//       id: "1234",
//       name: "$AAA"
//     },
//     {
//       __typename: "Symbol",
//       id: "3212",
//       name: "%some-event"
//     }
//   ],
//   // count: null,
//   // meLike: null,
//   count: {
//     __typename: 'PostCount',
//     id: '129380192',
//     nUps: 15,
//     nDowns: 5,
//     nComments: 30,
//     updatedAt: '2000-1-1',
//   },
//   updatedAt: '2000-1-1',
//   mePost: true,
// }