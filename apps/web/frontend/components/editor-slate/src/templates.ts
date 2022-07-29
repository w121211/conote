import { Block } from '../../editor-textarea/src/interfaces'
import {
  BlockInput,
  writeBlocks,
} from '../../editor-textarea/src/utils/block-writer'

export const templateTitles = [
  'General',
  //   'Company',
  //   'Research',
  //   'Thing',
  //   'Person',
  'Blank',
]

function templateGeneral(): BlockInput {
  const input: BlockInput = [
    '__DUMMY_ROOT__',
    [
      [
        'Basic',
        [
          ['What is ...?', ['']],
          // ['Explain ... in one picture?', ['']],
          ['Why ...?', ['']],
          ['Why not ...?', ['']],
          ['How ...?', ['']],
          // ['How this research solve?', ['']],
          ['What difference compared to the others?', ['']],
        ],
      ],
      ['Discuss', ['']],
    ],
  ]
  return input
}

export function genTemplateBlocks(title: string, docBlock: Block) {
  let input: BlockInput

  switch (title) {
    case 'general':
      input = templateGeneral()
      break
    case 'blank':
    default:
      input = ['__DUMMY_ROOT__', ['', '', '', '', '', '', '', '']]
      break
  }

  const blocks = writeBlocks(input, { docBlock })

  return blocks
}
