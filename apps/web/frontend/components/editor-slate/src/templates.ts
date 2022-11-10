import { Block } from '../../editor-textarea/src/interfaces'
import {
  BlockInput,
  writeBlocks,
} from '../../editor-textarea/src/utils/block-writer'

export const templateNames = [
  'General',
  //   'Company',
  //   'Research',
  //   'Thing',
  //   'Person',
  'Blank',
]

function templateGeneral(symbol: string): BlockInput {
  // const symbolParsed = parseSymbol(symbol)
  const symbolTrim = symbol.slice(2, -2)
  const input: BlockInput = [
    '__DUMMY_ROOT__',
    [
      [
        '_',
        [
          '// Quick notes block. Put your unorganized questions and ideas in here.',
        ],
      ],
      [
        '# Basics',
        [
          [`### What is ${symbolTrim}?`, ['']],
          [`### Explain ${symbolTrim} in one picture?`, ['']],
          [`### Why ... ${symbolTrim}?`, ['']],
          [`### Why not ... ${symbolTrim}?`, ['']],
          [`### How to ... ${symbolTrim}?`, ['']],
          // ['### What difference compared to the others?', ['']],
        ],
      ],
      ['# Versus', ['// List of alternatives, compertitors.', '', '']],
      [
        '# Discussions',
        [
          [
            '// List of questions and answer, eg #How to mine Bitcoin?#',
            [
              '// Provide the answer to the question if possible, or just left it as blank!',
              '// See detail guideline here. https://....',
            ],
          ],
          '',
          '',
        ],
      ],
      ['# Links', ['', '', '']],
    ],
  ]
  return input
}

export function genTemplateBlocks(
  templateName: string,
  docBlock: Block,
  symbol: string,
) {
  let input: BlockInput

  switch (templateName) {
    case 'general':
      input = templateGeneral(symbol)
      break
    case 'blank':
    default:
      input = ['__DUMMY_ROOT__', ['', '', '']]
      break
  }

  const blocks = writeBlocks(input, { docBlock })

  return blocks
}
