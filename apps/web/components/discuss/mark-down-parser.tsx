import React, { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

export const MarkDownParser = ({ text }: { text: string }) => {
  return (
    <ReactMarkdown
      className="markdown-body "
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <SyntaxHighlighter
              language={match[1]}
              // style={prism}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          )
          // return !inline && match ? (
          //   <code className={className} {...props}>
          //     {children}
          //   </code>
          // ) : (
          //   // <SyntaxHighlighter language={match[1]} style={githubGist} PreTag="div" {...props}>
          //   //   {String(children).replace(/\n$/, '')}
          //   // </SyntaxHighlighter>
          //   <code className={className} {...props}>
          //     {children}
          //   </code>
          // )
        },
      }}
    >
      {text}
    </ReactMarkdown>
  )
}
