import { flatten } from 'lodash'
import { buildChains } from '../../src/stores/editor.repository'

const prevId = <T extends { prevId: string | null | undefined }>(v: T) =>
  v.prevId

const c = <T extends { id: string }>({
  chains,
  orphans,
}: {
  chains: T[][]
  orphans: T[]
}) => ({
  chains: chains.map(a => a.map(b => b.id).join(' <- ')),
  orphans: orphans.map(e => e.id).join(', '),
})

describe('buildChains', () => {
  /**
   * 2 <- 1 <- 2 <- 3
   * 4 <- 5
   */
  it('circular chain', () => {
    const entries = [
      { id: '1', prevId: '2' },
      { id: '2', prevId: '1' },
      { id: '3', prevId: '2' },
      { id: '4', prevId: null },
      { id: '5', prevId: '4' },
    ]
    expect(c(buildChains(entries, prevId))).toMatchInlineSnapshot(`
      Object {
        "chains": Array [
          "4 <- 5",
        ],
        "orphans": "1, 2, 3",
      }
    `)
  })

  /**
   * 1 <- 2 <- 4
   *   <- 3 <- 5
   *        <- 6
   */
  it('parent has multiple children', () => {
    const entries = [
      { id: '1', prevId: null },
      { id: '2', prevId: '1' },
      { id: '3', prevId: '1' },
      { id: '4', prevId: '2' },
      { id: '5', prevId: '3' },
      { id: '6', prevId: '3' },
    ]
    expect(c(buildChains(entries, prevId))).toMatchInlineSnapshot(`
      Object {
        "chains": Array [
          "1 <- 3 <- 6",
        ],
        "orphans": "2, 4, 5",
      }
    `)
  })

  /**
   * 1 <- 2 <- 3
   * 4 <- 5
   * 6
   */
  it('normal', () => {
    const entries = [
      { id: '1', prevId: undefined },
      { id: '2', prevId: '1' },
      { id: '3', prevId: '2' },
      { id: '4', prevId: null },
      { id: '5', prevId: '4' },
      { id: '6', prevId: null },
    ]
    expect(c(buildChains(entries, prevId))).toMatchInlineSnapshot(`
      Object {
        "chains": Array [
          "1 <- 2 <- 3",
          "4 <- 5",
          "6",
        ],
        "orphans": "",
      }
    `)
  })
})
