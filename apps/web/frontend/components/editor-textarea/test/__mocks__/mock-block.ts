import { Block } from '../../src/interfaces'
import { genBlockUid } from '../../src/utils'
import { BlockInput, writeBlocks } from '../../src/utils/block-writer'

const input0: BlockInput = [
  '[[Next.js]]',
  [
    [
      '# Basics',
      [
        [
          '### What is Next.js?',
          ['A javascript backend framework, use React.js for SSR.'],
        ],
        [
          '### Why use Next.js?',
          [
            'Simple and straightforward.',
            'Very popular backend framework for javascript, its github repository has over 90k stars.',
            'Suitable for front-end developers who want to develop a full stack app.',
            '',
          ],
        ],
        [
          '### #Why not use Next.js?-mock_discuss_0_active#',
          [
            'Lack of official support of higher level features, e.g. authentication.',
            'Mix of frontend and backend codes may be difficult to organize, e.g. writing test code.',
          ],
        ],
        [
          '### Test of multi lines in a single block',
          ['This is the first line.\n  This is the second line.'],
        ],
      ],
    ],
    [
      '# Versus',
      [
        [
          '### Nuxt.js ',
          [
            '#Next.js v.s. Nuxt.js?-mock_discuss_0_active#',
            'Similar to Next.js, use Vue instead of React',
          ],
        ],
        ['### Nest.js', ['']],
      ],
    ],
    [
      '# Discussions',
      [
        ['#How to use next.js?-mock_discuss_0_active#', ['']],
        ['#How to use next.js?-mock_discuss_1_draft#', ['']],
        ['#How to use next.js?-mock_discuss_2_archive#', ['']],
      ],
    ],
    ['# Link', ['']],
  ],
]

const input1: BlockInput = [
  '[[A sample for testing preview render]]',
  [
    [
      '# H1 heading',
      [
        [
          '## H2 heading',
          [
            [
              'Excepteur sint occaecat *cupidatat* non **proident**.',
              [
                'Pellentesque habitant morbi tristique senectus et netus et.  \nVitae elementum curabitur vitae nunc.',
                'Eu non diam phasellus vestibulum lorem. Non curabitur gravida arcu ac tortor dignissim convallis aenean et. Vitae elementum curabitur vitae nunc sed velit dignissim sodales. Volutpat est velit egestas dui id ornare arcu.',
              ],
            ],
            [
              '### H3 heading',
              [
                ['Paragraph node.', ['Indented node.']],
                'A line break is `space + space + \\n`  \nThis is second line.',
                'Inline code `inline code`',
              ],
            ],
          ],
        ],
        [
          '### H3 heading',
          [
            [
              'Paragraph node.',
              ['Indented paragraph node. https://finance.yahoo.com/'],
            ],
          ],
        ],
        [
          '### List',
          [
            ['List item.', ['Indented paragraph node.']],
            ['List item.', ['Indented paragraph node.']],
            ['List item.', ['Indented paragraph node.']],
          ],
        ],
      ],
    ],
    [
      '# Syntax mix',
      [
        '### Heading + #A discussion with id, where id should not render.-cl7dhm6rn000h2e6d83bt99am#',
        '### Heading + [[symbol]]',
        '### Heading + // Comment ...',
        [
          '### Paragraph + X',
          [
            'Paragraph + #discussion with id-cl7dhm6rn000h2e6d83bt99am# ...',
            'Paragraph + #discussion without id# ...',
            'Paragraph + [[symbol]] ...',
            'Paragraph + ...  // Comment ...',
          ],
        ],
        [
          '### X + Paragraph',
          ['#discussion# paragraph ...', '[[symbol]] paragraph ...'],
        ],
      ],
    ],
    [
      '# Paragraph follow by heading // This is prompt to be a wrong style, only testing the render result.',
      [
        'Paragraph',
        [
          '### Paragraph child 1 as heading // Heading should ignore the indent',
          [['Paragraph reset the indent', ['Paragraph follow by its parent']]],
        ],
        [
          'Paragraph child 2',
          ['#discussion# paragraph ...', '[[symbol]] paragraph ...'],
        ],
      ],
    ],
    ['# Debug format', ['##', ['a', [['b', ['[[c]]']]]]]],
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
