import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import ReactMarkdown from 'react-markdown'
import { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown'
import ParseRenderEl from '../../frontend/components/editor-textarea/src/components/inline/parse-render-el'

export default {
  title: 'parsers/ReactMarkdown',
  component: ReactMarkdown,
} as ComponentMeta<typeof ReactMarkdown>

// function rehypeWrapText(): Plugin {
//   return (tree: Root) => {
//     // visitParents(tree, 'text', (node, ancestors) => {
//     //   if (ancestors.at(-1).tagName !== 'custom-typography') {
//     //     node.type = 'element'
//     //     node.tagName = 'custom-typography'
//     //     node.children = [{ type: 'text', value: node.value }]
//     //   }
//     // })
//     visit(tree, 'text', (node, i, parent) => {
//       console.log(node, parent)
//     })
//   }
// }

export const Base = () => {
  const markdown = `A paragraph with *emphasis* and **strong importance**. [[hello world]]

#this is something cool-123456789#

#Which browser is best at keeping things confidential?-mock_discuss_0_active#

> A block quote with ~strikethrough~ and a URL: https://reactjs.org. [[hello world]]

* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| - | - |
`

  const components: ReactMarkdownOptions['components'] = {
    p: ({ node, children, ...props }) => {
      return (
        <p {...props}>
          {children.map((e, i) => {
            if (typeof e === 'string') {
              return (
                <span key={i}>
                  <ParseRenderEl key={i} blockUid="blockUid" str={e} isViewer />
                </span>
              )
            } else return e
          })}
        </p>
      )
    },
  }

  return <ReactMarkdown components={components}>{markdown}</ReactMarkdown>
}
