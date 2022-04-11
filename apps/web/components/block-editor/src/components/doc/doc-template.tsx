import React, { ReactNode, useEffect } from 'react'
import { Block } from '../../interfaces'

function selectTemplate(templateName: string) {
  //
}

// type StrNode = [string, StrNode[]]

// function makeBlocks(nodes: StrNode[]): Block[] {
//   const stack: StrNode[] = nodes
//   while (stack.length > 0) {
//     const pop = stack.shift()
//     if (pop === undefined) break

//     const [str, children] = pop
//   }
// }

// function makeTemplate() {}

// const templates = {
//   general: [
//     ['About', ['What is ', 'Why %NAME%']],
//     ['About', ['What is ', 'Why ']],
//   ],
// }

/**
 * Block-like style
 */
const templateContent = [
  {
    str: '**Similar notes existed** #deduplicate policy#',
    children: [
      { str: '[[Hello World]]' },
      { str: '[[Hello world (computer science)]]' },
    ],
  },
  { str: '' }, // a blank line
  {
    str: '**Choose a template to start**',
    children: [
      {
        inlineItems: [
          {
            type: 'button',
            onClick: () => selectTemplate('general'),
            str: 'General',
          },
        ],
      },
      {
        inlineItems: [
          {
            type: 'button',
            onClick: () => selectTemplate('company'),
            str: 'Company',
          },
        ],
      },
    ],
  },
  { str: '' }, // a blank line
  {
    inlineItems: [
      {
        type: 'bold',
        str: 'Or start from ',
      },
      {
        type: 'button',
        onClick: () => {
          //
        },
        str: 'Blank',
      },
    ],
  },
]

export const DocTemplate = (): JSX.Element | null => {
  return (
    <>
      <section>
        <h3>Similar notes existed #deduplicate policy#</h3>
        <div>• [[Hello World]]</div>
        <div>• [[Hello world (computer science)]]</div>
      </section>
    </>
  )
}
