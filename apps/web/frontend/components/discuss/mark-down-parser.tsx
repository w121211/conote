import React, { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'

export const MarkDownParser = ({ text }: { text: string }) => {
  return (
    <ReactMarkdown
      className="prose"
      // components={{
      //   code({ node, inline, className, children, ...props }) {
      //     const match = /language-(\w+)/.exec(className || '')
      //     return !inline && match ? (
      //       <SyntaxHighlighter
      //         language={match[1]}
      //         // style={prism}
      //         {...props}
      //       >
      //         {String(children).replace(/\n$/, '')}
      //       </SyntaxHighlighter>
      //     ) : (
      //       <code className={className} {...props}>
      //         {children}
      //       </code>
      //     )
      //     // return !inline && match ? (
      //     //   <code className={className} {...props}>
      //     //     {children}
      //     //   </code>
      //     // ) : (
      //     //   // <SyntaxHighlighter language={match[1]} style={githubGist} PreTag="div" {...props}>
      //     //   //   {String(children).replace(/\n$/, '')}
      //     //   // </SyntaxHighlighter>
      //     //   <code className={className} {...props}>
      //     //     {children}
      //     //   </code>
      //     // )
      //   },
      // }}
    >
      {text}
    </ReactMarkdown>
  )
}
