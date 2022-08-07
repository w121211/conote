import { Block } from '../../src/interfaces'
import { genBlockUid } from '../../src/utils'
import { BlockInput, writeBlocks } from '../../src/utils/block-writer'

const input0: BlockInput = [
  '[[Next.js]]',
  [
    [
      '# Basic',
      [
        [
          'What is Next.js?',
          ['A javascript backend framework, use React.js for SSR.'],
        ],
        [
          '#Why use Next.js?#',
          [
            'Simple and straightforward.',
            'Very popular backend framework for javascript, its github repository has over 90k stars.',
            'Suitable for front-end developers who want to develop a full stack app.',
            '',
          ],
        ],
        [
          '#Why not use Next.js?#',
          [
            'Lack of official support of higher level features, e.g. authentication.',
            'Mix of frontend and backend codes may be difficult to organize, e.g. writing test code.',
          ],
        ],
      ],
    ],
    [
      '# Versus',
      [
        ['Nuxt.js', ['Similar to Next.js, use Vue instead of React']],
        ['Nest.js', ['']],
      ],
    ],
    ['# Discuss', ['']],
    ['# Link', ['']],
  ],
]

// const input0: BlockInput = [
//   '[[Next.js]]',
//   [
//     [
//       '# About',
//       [
//         'Official site: https://www.mozilla.org/en-US/firefox/new/',
//         'Super fast and fiercely independent. Get the only browser that works to make the internet better for everyone.',
//         'Backed by the non-profit that puts people first',
//         [
//           'Latest Firefox features',
//           [
//             '[[Picture-in-Picture]]\n' +
//               'Pop a video out of the browser window so you can stream and multitask.',
//             'Choose your color\n' +
//               'Personalize your experience with new colorways.',
//             'An extra layer of protection\n' +
//               '[[DNS over HTTPS (DoH)]] helps keep internet service providers from selling your data.',
//           ],
//         ],
//       ],
//     ],
//     [
//       'Discuss',
//       [
//         [
//           '#How Firefox compares to other browsers?#',
//           [
//             'https://www.mozilla.org/en-US/firefox/browsers/compare/',
//             'A great internet browser should have the functionality you need, portability across devices, and the privacy you deserve.',
//           ],
//         ],
//         [
//           '#Which browser is best at keeping things confidential?-mock_discuss_0_active#',
//           [
//             'Its not unreasonable to expect a high level of data protection and privacy from the products we regularly use to get online.',
//             'At a minimum, a browser should offer some version of “private browsing mode” that automatically deletes your history and search history so other users on the same computer cant access it.',
//             'In this area, all seven of the browsers compared here score points.',
//           ],
//         ],
//         ['#One more discuss?-mock_discuss_1_draft#', ['']],
//         ['#Two more discuss?-mock_discuss_2_archive#', ['']],
//       ],
//     ],
//   ],
// ]

const input1: BlockInput = [
  '[[Firefox]]',
  [
    [
      'Discuss',
      [
        [
          '#How Firefox compares to other browsers?#',
          [
            'https://www.mozilla.org/en-US/firefox/browsers/compare/',
            'A great internet browser should have the functionality you need, portability across devices, and the privacy you deserve.',
          ],
        ],
        [
          '#Which browser is best at keeping things confidential?-mock_discuss_0_active#',
          [
            'Its not unreasonable to expect a high level of data protection and privacy from the products we regularly use to get online.',
            'At a minimum, a browser should offer some version of “private browsing mode” that automatically deletes your history and search history so other users on the same computer cant access it.',
            'In this area, all seven of the browsers compared here score points.',
          ],
        ],
      ],
    ],
  ],
]

export const mockBlockInputs: BlockInput[] = [input0, input1]

/**
 * The first block is doc-block, ie [doc-block, ...content-blocks]
 */
export const mockDocBlock_contentBlocks: Block[] = writeBlocks(input0)

export const mockDocBlockWithoutContent: Block = {
  uid: genBlockUid(),
  str: '[[Mock Doc Block Without Content]]',
  order: 0,
  docSymbol: '[[Mock Doc Block Without Content]]',
  parentUid: null,
  childrenUids: [],
}

export const mockBlocks = [
  ...mockDocBlock_contentBlocks,
  mockDocBlockWithoutContent,
]
