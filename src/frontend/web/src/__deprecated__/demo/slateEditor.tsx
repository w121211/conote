import Prism, { Token, TokenStream } from 'prismjs'
// import 'prismjs/components/prism-python'

import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react'
import { Node, Editor, Transforms, Range, createEditor, NodeEntry, Text } from 'slate'
import { withHistory } from 'slate-history'
import { Slate, Editable, ReactEditor, withReact, useSelected, useFocused, } from 'slate-react'
import { RenderElementProps, RenderLeafProps } from 'slate-react/dist/components/editable'
import { Typography, Space } from 'antd'

// import * as Parser from '../utils/parser'
// import { Portal } from '../components'

const CHARACTERS = [
  'Aayla Secura',
  'Adi Gallia',
  'Admiral Dodd Rancit',
  'Admiral Firmus Piett',
  'Admiral Gial Ackbar',
  'Admiral Ozzel',
]

const t1 = `[start]test
[intro]
1st line starter
2nd line starter

[you_are] ()用戶 ()業內 ()行業相關 ()插花

[+]
- 全美市占率第一 (source → webpage card)
- 為搶佔市場需燒錢，美國餐飲價格高，外送需求不如亞洲國家來的大
- $AAA

[-]
- 美國配送成本高
- 燒錢行業
- 疫情關係拉高業績，未來
- 還在賠錢中

[verdict] []買 []賣 []觀望
[verdict理由]

[target_price] 31

atest
`

const initialValue = [
  {
    children: [
      { text: t1 },
      { type: 'mention', character: 'R2-D2', children: [{ text: '' }], },
      { text: t1 },
      // { text: 'this is a list-item', },
      // { text: '$AAA', ticker: true },
    ],
  },
  {
    type: 'paragraph',
    children: [
      { text: '' },
    ],
  },
]

const insertMention = (editor: any, character: any) => {
  const mention = { type: 'mention', character, children: [{ text: '' }] }
  Transforms.insertNodes(editor, mention)
  Transforms.move(editor)
}

const MentionElement = ({ attributes, children, element }: any) => {
  const selected = useSelected()
  const focused = useFocused()
  return (
    <span
      {...attributes}
      contentEditable={false}
      style={{
        padding: '3px 3px 2px',
        margin: '0 1px',
        verticalAlign: 'baseline',
        display: 'inline-block',
        borderRadius: '4px',
        backgroundColor: '#eee',
        fontSize: '0.9em',
        boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
      }}
    >
      @{element.character}
      {children}
    </span>
  )
}


const withMentions = (editor: ReactEditor) => {
  const { isInline, isVoid, deleteBackward, insertText, insertBreak } = editor
  editor.isInline = element => {
    return ['mention', 'block'].includes(element.type as string) ? true : isInline(element)
  }
  editor.isVoid = element => {
    return ['mention', 'block'].includes(element.type as string) ? true : isVoid(element)
  }
  // editor.isInline = element => {
  //   return element.type === 'error' ? true : isInline(element)
  // }
  // editor.isVoid = element => {
  //   return element.type === 'error' ? true : isVoid(element)
  // }

  editor.insertBreak = () => {
    const { selection } = editor
    console.log('enter')
    // if (selection) {
    //   const [table] = Editor.nodes(editor, {
    //     match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'table',
    //   })
    //   if (table) return
    // }
    insertBreak()
  }

  return editor

  editor.insertText = text => {
    const { selection } = editor
    // console.log(text)
    if (text === '[') {
      // Transforms.insertText(editor, '\n- [+]\n- [-]')
      // Transforms.move(editor, { reverse: true })
      insertMention(editor, 'mention')
      return
    } else {
      insertText(text)
      return
    }
    // if (text === ' ' && selection && Range.isCollapsed(selection)) {
    //   const { anchor } = selection
    //   const block = Editor.above(editor, {
    //     match: n => Editor.isBlock(editor, n),
    //   })
    //   const path = block ? block[1] : []
    //   const start = Editor.start(editor, path)
    //   const range = { anchor, focus: start }
    //   const beforeText = Editor.string(editor, range)

    //   // console.log(beforeText)

    //   // const type = SHORTCUTS[beforeText]

    //   // if (type) {
    //   //   Transforms.select(editor, range)
    //   //   Transforms.delete(editor)
    //   //   const newProperties: Partial<SlateElement> = {
    //   //     type,
    //   //   }
    //   //   Transforms.setNodes(editor, newProperties, {
    //   //     match: n => Editor.isBlock(editor, n),
    //   //   })
    //   //   if (type === 'list-item') {
    //   //     const list = { type: 'bulleted-list', children: [] }
    //   //     Transforms.wrapNodes(editor, list, {
    //   //       match: n =>
    //   //         !Editor.isEditor(n) &&
    //   //         SlateElement.isElement(n) &&
    //   //         n.type === 'list-item',
    //   //     })
    //   //   }
    //   //   return
    //   // }
    //   return
    // }
    // insertText(text)
  }

  return editor
}

const Element = (props: RenderElementProps) => {
  const { attributes, children, element } = props
  switch (element.type) {
    case 'multi-block':
      return <p {...attributes}><span contentEditable={false}>{element.marker as string}</span>{children}</p>
    case 'single-block':
      return <p {...attributes}><span contentEditable={false}>{element.marker as string}</span>{children}</p>
    case 'ull':
      return <ul {...attributes}>{children}</ul>
    case 'lii':
      return <li {...attributes}>{children}</li>
    // case 'error':
    //   return <Typography.Text {...attributes} contentEditable={false} type="warning" >{children}</Typography.Text>
    case 'mention':
      // return <MentionElement {...props} />
      return <span {...attributes} contentEditable={false}>@{element.character}{children}</span>
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.ticker) {
    children = <a style={{ color: 'red' }} contentEditable={false} href="https://prismjs.com/extending.html">{children}</a>
  }

  if (leaf.list) {
    children = <span style={{ color: 'red' }} contentEditable={false}>{children}</span>
  }

  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  if (leaf.error) {
    // return <Typography.Text {...attributes} contentEditable={false} type="warning" >{children}</Typography.Text>
    children = <span {...attributes} style={{ color: 'red' }} contentEditable={false}>{children}</span>
  }

  return <span {...attributes}>{children}</span>
}




const t2 = `
[topic]
- [[IPO]]
- [[網路服務]]
- [[App]]
- [[App]] *錯誤：本條目已經建立，將忽略
- 

[link]
- (Home)[…] {validator: ‘(Home)[*]’, validateMsg: ‘格式須為(Home)[*]’}
- (Yahoo)[…]
- (Wiki)[…]
=====================
`

const grammar = {
  'multiline': {
    pattern: /^\[[^\]]+\](?:\n[^\[\n]+)+/m,
    inside: {
      'marker': {
        pattern: /^\[[^\]]+\]$/m,
      },
      'list-string': {
        pattern: /^[-]+\s.+$/m,
      },
      'line-string': {
        pattern: /^.+$/m,
      },
    }
  },
  'inline': {
    pattern: /^\[[^\]]+\].*$/m,
    inside: {
      'marker': {
        pattern: /^\[[^\]]+\]/,
      },
      'string': {
        pattern: /^.+$/,
      }
    }
  },
  // 'radio': {
  //   pattern: /[\s\t]+\[\w?\]\p{L}+/u,
  //   // greedy: true
  // },

}

interface MarkerTree {
  marker?: string
  text?: string
  children?: MarkerTree[]
}

const tokens = Prism.tokenize(t1, grammar)

function TokenSpan({ token }: { token: Token | string }) {
  if (typeof (token) === 'string')
    return <span style={{ color: 'gray' }}>{token}</span>
  if (Array.isArray(token.content))
    return <>{token.content.map((e, i) => <TokenSpan key={i} token={e} />)}</>
  if (token.type === 'marker')
    // return <span style={{ color: '#9a6e3a' }}>{token.content}</span>
    return <a style={{ color: '#9a6e3a' }} href="https://regex101.com/r/C2T0so/2" contentEditable={false}>{token.content}</a>
  if (['number', 'radio', 'list-string', 'line-string', 'string'].includes(token.type))
    return <span style={{ color: '#905' }}>{token.content}</span>
  return <span>{token.content}</span>
}

function parse(root: MarkerTree, tokens: Array<string | Token>) {
  let curMarker: string | undefined
  for (const tk of tokens) {
    if (typeof (tk) === 'string') {
      // for (const line of tk.split('\n')) {
      // }
    } else if (tk.type === 'marker') {
      for (const _tk of tk.content as Array<Token | string>) {
        if (typeof (_tk) === 'string') {
          throw new Error()
        } else if (_tk.type === 'name') {
          curMarker = _tk.content as string
          // root.children?.push({ marker: _tk.content as string })
        } else if (_tk.type === 'string') {
          root.children?.push({ marker: curMarker, text: (_tk.content as string).trim() })
        }
        // root.children.push({marker: (tk.content as Array<Token>)})
      }
    } else if (tk.type === 'list-string') {
      root.children?.push({ marker: curMarker, text: (tk.content as string).trim() })
    } else if (tk.type === 'line-string') {
      root.children?.push({ marker: curMarker, text: (tk.content as string).trim() })
    }

    // root.children.push({})
  }
}

function Parser() {
  console.log(tokens)
  // const root: MarkerTree = {
  //   children: []
  // }
  return (
    // <h1>hello</h1>
    <pre>
      {tokens.map((e, i) => <TokenSpan key={i} token={e} />)}
    </pre>
  )
}

export const TextEditor = () => {
  const ref = useRef<HTMLDivElement | null>()
  const [value, setValue] = useState<Node[]>(initialValue)
  const [target, setTarget] = useState<Range | undefined>()
  const [index, setIndex] = useState(0)
  const [search, setSearch] = useState('')
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(
    () => withMentions(withReact(withHistory(createEditor()))),
    []
  )
  const decorate = useCallback(([node, path]: NodeEntry): Range[] => {
    // decorate會在每次動作時將目前'所有的nodes'以BFS的方式輸進來
    const ranges: Range[] = []
    if (!Text.isText(node)) {
      return ranges
    }
    // try {
    //   console.log(Node.parent(editor, path))
    // } catch { }
    // console.log(node.text)
    // const getLength = token => {
    //   if (typeof token === 'string') {
    //     return token.length
    //   } else if (typeof token.content === 'string') {
    //     return token.content.length
    //   } else {
    //     return token.content.reduce((l, t) => l + getLength(t), 0)
    //   }
    // }
    // const tokens = Prism.tokenize(node.text, Prism.languages.markdown)
    // let start = 0
    // for (const token of tokens) {
    //   const length = getLength(token)
    //   const end = start + length
    //   if (typeof token !== 'string') {
    //     ranges.push({
    //       [token.type]: true,
    //       anchor: {path, offset: start },
    //       focus: {path, offset: end },
    //     })
    //   }
    //   start = end
    // }
    return ranges
  }, [])

  // return <Parser />
  // const chars = CHARACTERS.filter(c =>
  //   c.toLowerCase().startsWith(search.toLowerCase())
  // ).slice(0, 10)

  const onKeyDown = useCallback(
    (event) => {
      // console.log(value)
      if (event.key === "Enter") {
        event.preventDefault();
        Transforms.insertText(editor, `\n`);
        // add a white sapce
        // Transforms.insertText(editor, `\n\u2060`);
      }
    }, []
    // event => {
    //   if (target) {
    //     switch (event.key) {
    //       case 'ArrowDown':
    //         event.preventDefault()
    //         const prevIndex = index >= chars.length - 1 ? 0 : index + 1
    //         setIndex(prevIndex)
    //         break
    //       case 'ArrowUp':
    //         event.preventDefault()
    //         const nextIndex = index <= 0 ? chars.length - 1 : index - 1
    //         setIndex(nextIndex)
    //         break
    //       case 'Tab':
    //       case 'Enter':
    //         event.preventDefault()
    //         Transforms.select(editor, target)
    //         insertMention(editor, chars[index])
    //         setTarget(undefined)
    //         break
    //       case 'Escape':
    //         event.preventDefault()
    //         setTarget(undefined)
    //         break
    //     }
    //   }
    // },
    // [index, search, target]
  )

  // useEffect(() => {
  //   if (target && chars.length > 0) {
  //     const el = ref.current
  //     const domRange = ReactEditor.toDOMRange(editor, target)
  //     const rect = domRange.getBoundingClientRect()
  //     if (el)
  //       el.style.top = `${rect.top + window.pageYOffset + 24}px`
  //     if (el)
  //       el.style.left = `${rect.left + window.pageXOffset}px`
  //   }
  // }, [chars.length, editor, index, search, target])

  // Prism.languages.html = Prism.languages.extend('html', {})
  // Prism.languages.insertBefore('html', 'prolog', {
  //   comment: { pattern: /<!--[^\n]*-->/, alias: 'comment' },
  // })

  // console.log(Parser.tokens)

  // return <Parser />

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={value => {
        setValue(value)
        const { selection } = editor
        // if (selection && Range.isCollapsed(selection)) {
        //   const [start] = Range.edges(selection)
        //   const wordBefore = Editor.before(editor, start, { unit: 'word' })
        //   const before = wordBefore && Editor.before(editor, wordBefore)
        //   const beforeRange = before && Editor.range(editor, before, start)
        //   const beforeText = beforeRange && Editor.string(editor, beforeRange)
        //   const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/)
        //   const after = Editor.after(editor, start)
        //   const afterRange = Editor.range(editor, start, after)
        //   const afterText = Editor.string(editor, afterRange)
        //   const afterMatch = afterText.match(/^(\s|$)/)
        //   if (beforeMatch && afterMatch) {
        //     setTarget(beforeRange)
        //     setSearch(beforeMatch[1])
        //     setIndex(0)
        //     return
        //   }
        // }
        setTarget(undefined)
      }}
    >
      <Editable
        decorate={decorate}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        // onKeyDown={onKeyDown}
        placeholder="Enter some text..."
      />
      {/* {target && chars.length > 0 && (
        <p>portal</p>
        // <Portal>
        //   <div
        //     ref={ref}
        //     style={{
        //       top: '-9999px',
        //       left: '-9999px',
        //       position: 'absolute',
        //       zIndex: 1,
        //       padding: '3px',
        //       background: 'white',
        //       borderRadius: '4px',
        //       boxShadow: '0 1px 5px rgba(0,0,0,.2)',
        //     }}
        //   >
        //     {chars.map((char, i) => (
        //       <div
        //         key={char}
        //         style={{
        //           padding: '1px 3px',
        //           borderRadius: '3px',
        //           background: i === index ? '#B4D5FF' : 'transparent',
        //         }}
        //       >
        //         {char}
        //       </div>
        //     ))}
        //   </div>
        // </Portal>
      )} */}
    </Slate>
  )
}