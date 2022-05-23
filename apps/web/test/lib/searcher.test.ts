import { authorSearcher, symSearcher } from '../../lib/searcher/searchers'

it('symSearcher.search() all', async () => {
  expect((await symSearcher.search('Apple')).map(e => e.symbol))
    .toMatchInlineSnapshot(`
    Array [
      "[[Apple]]",
    ]
  `)
  expect(
    (await symSearcher.search('半導體')).map(e => e.symbol),
  ).toMatchInlineSnapshot(`Array []`)
})

it('symSearcher.search() ticker only', async () => {
  expect(
    (await symSearcher.search('ai', 'TICKER')).map(e => e.symbol),
  ).toMatchInlineSnapshot(`Array []`)
})

it('symSearcher.search() topic only', async () => {
  expect(
    (await symSearcher.search('半導體', 'TOPIC')).map(e => e.symbol),
  ).toMatchInlineSnapshot(`Array []`)
})

it('authorSearcher.search()', async () => {
  expect(
    (await authorSearcher.search('NaNa')).map(e => e.name),
  ).toMatchInlineSnapshot(`Array []`)
  expect(
    (await authorSearcher.search('美股')).map(e => e.name),
  ).toMatchInlineSnapshot(`Array []`)
  // expect(await SearchSymbolService.search('半導體', 'TOPIC')).toMatchSnapshot()
})
