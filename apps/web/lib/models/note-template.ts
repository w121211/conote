export type NoteTemplateProps = {
  symbol: string
  template: string
  title: string
  ticker?: string
}

// const buysellPollAttr: { choices: string[]; meta: PollMeta } = {
//   choices: ['#buy', '#sell', '#hold'],
//   meta: {
//     code: 'buysell',
//   },
// }

// export const tickerStarter = ({ symbol }: { symbol: string }): RootBulletDraft => {
//   return {
//     draft: true,
//     op: 'CREATE',
//     root: true,
//     symbol,
//     head: symbol,
//     freeze: true,
//     children: [
//       writeLine('_討論'),
//       writeLine('最新[!]'),
//       writeLine('簡介[*]'),
//       writeLine('優[+]'),
//       writeLine('缺[-]'),
//       writeLine('比較[vs]'),
//     ],
//   }
// }

// export const topicStarter = ({ symbol }: { symbol: string }): RootBulletDraft => {
//   return {
//     draft: true,
//     op: 'CREATE',
//     root: true,
//     symbol,
//     head: symbol,
//     freeze: true,
//     children: [
//       writeLine('_討論'),
//       writeLine('最新[!]'),
//       writeLine('簡介[*]'),
//       writeLine('優[+]'),
//       writeLine('缺[-]'),
//       writeLine('比較[vs]'),
//     ],
//   }
// }

// export const webpageStarter = ({ symbol }: { symbol: string }): RootBulletDraft => ({
//   draft: true,
//   op: 'CREATE',
//   head: symbol,
//   freeze: true,
//   root: true,
//   symbol,
//   children: [writeLine('_討論'), writeLine('_筆記')],
// })
