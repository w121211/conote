import { nanoid } from 'nanoid'
import { Block } from '../../components/block-editor/src/interfaces'
import { validateChildrenUids } from '../../components/block-editor/src/op/helpers'

type BlockInput = [string, BlockInput[]] | string

function blockWrite(input: BlockInput): Block[] {
  function f(input: BlockInput, order = 0, parentUid: string | null = null) {
    const [str, children] = typeof input === 'string' ? [input, []] : input
    return {
      uid: nanoid(),
      str,
      order,
      parentUid,
      children,
    }
  }

  const blocks: Block[] = [],
    stack: {
      uid: string
      str: string
      order: number
      parentUid: string | null
      children?: BlockInput[]
    }[] = [f(input)]

  while (stack.length > 0) {
    const shift = stack.shift()

    if (shift) {
      const { uid, str, order, parentUid, children } = shift,
        children_ = children ? children.map((e, i) => f(e, i, uid)) : [],
        childrenUids = children_.map(e => e.uid),
        docTitle = parentUid === null ? str : undefined

      children_.forEach(e => stack.push(e))
      blocks.push({
        uid,
        str,
        order,
        parentUid,
        childrenUids,
        docTitle,
        open: true,
      })
    }
  }

  validateChildrenUids(Object.fromEntries(blocks.map(e => [e.uid, e])))

  return blocks
}

const input: BlockInput = [
  '[[Firefox]]',
  [
    [
      'About',
      [
        'Official site: https://www.mozilla.org/en-US/firefox/new/',
        'Super fast and fiercely independent. Get the only browser that works to make the internet better for everyone.',
        'Backed by the non-profit that puts people first',
        [
          'Latest Firefox features',
          [
            '[[Picture-in-Picture]]\n' +
              'Pop a video out of the browser window so you can stream and multitask.',
            'Choose your color\n' +
              'Personalize your experience with new colorways.',
            'An extra layer of protection\n' +
              '[[DNS over HTTPS (DoH)]] helps keep internet service providers from selling your data.',
          ],
        ],
      ],
    ],
    [
      'Discuss',
      [
        [
          '#How Firefox compares to other browsers?#',
          [
            // '@source https://www.mozilla.org/en-US/firefox/browsers/compare/',
            //     'A great internet browser should have the functionality you need, portability across devices, and the privacy you deserve.',
          ],
        ],
        // [
        //   '#Which browser is best at keeping things confidential?#',
        //   [
        //     'Its not unreasonable to expect a high level of data protection and privacy from the products we regularly use to get online.',
        //     'At a minimum, a browser should offer some version of “private browsing mode” that automatically deletes your history and search history so other users on the same computer cant access it.',
        //     'In this area, all seven of the browsers compared here score points.',
        //   ],
        // ],
      ],
    ],
  ],
]

export const mockBlocks = blockWrite(input)
