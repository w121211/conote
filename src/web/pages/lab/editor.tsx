import React, { useCallback, useMemo, useState } from 'react'
import { createEditor, Editor, NodeEntry, Range } from 'slate'
import { Editable, RenderElementProps, Slate, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { CustomRange, LiElement } from '../../components/editor/slate-custom-types'
import { isLiArray } from '../../components/editor/with-list'
import classes from '../../components/editor/editor.module.scss'

const initialValue: LiElement[] = [
  {
    type: 'li',
    children: [{ type: 'lc', children: [{ text: 'hello world' }] }],
  },
  // {
  //   type: 'li',
  //   children: [{ type: 'lc', body: '11', error: 'warning', placeholder: 'placeholder', children: [{ text: '11' }] }],
  // },
  // {
  //   type: 'li',
  //   children: [
  //     { type: 'lc', body: '22', placeholder: 'placeholder', children: [{ text: '22' }] },
  //     {
  //       type: 'ul',
  //       children: [
  //         { type: 'li', children: [{ type: 'lc', body: '22-11', children: [{ text: '22-11' }] }] },
  //         {
  //           type: 'li',
  //           children: [
  //             { type: 'lc', children: [{ text: '' }] },
  //             {
  //               type: 'ul',
  //               children: [
  //                 { type: 'li', children: [{ type: 'lc', body: '22-11', children: [{ text: '22-11' }] }] },
  //                 { type: 'li', children: [{ type: 'lc', children: [{ text: '' }] }] },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   type: 'li',
  //   children: [
  //     {
  //       type: 'lc',
  //       body: '111',
  //       freeze: true,
  //       children: [{ text: '111 這是中文 $AAA' }],
  //     },
  //     {
  //       type: 'ul',
  //       children: [
  //         {
  //           type: 'li',
  //           children: [
  //             {
  //               type: 'lc',
  //               body: '333',
  //               // freeze: true,
  //               id: 123,
  //               warning: 'warning',
  //               children: [{ text: '333' }],
  //             },
  //             {
  //               type: 'ul',
  //               children: [
  //                 {
  //                   type: 'li',
  //                   children: [
  //                     {
  //                       type: 'lc',
  //                       body: '444',
  //                       root: true,
  //                       children: [{ text: '444' }],
  //                     },
  //                   ],
  //                 },
  //                 {
  //                   type: 'li',
  //                   children: [
  //                     {
  //                       type: 'lc',
  //                       body: '555',
  //                       children: [{ text: '555' }],
  //                     },
  //                   ],
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //         {
  //           type: 'li',
  //           children: [
  //             {
  //               type: 'lc',
  //               body: '666',
  //               children: [{ text: '666' }],
  //             },
  //             {
  //               type: 'ul',
  //               children: [
  //                 {
  //                   type: 'li',
  //                   children: [
  //                     {
  //                       type: 'lc',
  //                       body: '777',
  //                       children: [{ text: '777' }],
  //                     },
  //                   ],
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   type: 'li',
  //   children: [
  //     {
  //       type: 'lc',
  //       root: true,
  //       // placeholder: 'Type some symbol and press enter',
  //       children: [{ text: '$BA' }],
  //       asOauthor: true,
  //     },
  //   ],
  // },
  // {
  //   type: 'li',
  //   children: [
  //     {
  //       type: 'lc',
  //       root: true,
  //       placeholder: 'Type some symbol and press enter',
  //       warning: 'Here is a warning',
  //       children: [{ text: '' }],
  //     },
  //   ],
  // },
]

const CustomElement = (props: RenderElementProps): JSX.Element => {
  const { attributes, children, element } = props
  // const sourceUrl = selfCard.link?.url
  switch (element.type) {
    // case 'symbol':
    //   return <InlineSymbol {...{ attributes, children, element }} />
    // case 'mirror':
    //   return <InlineMirror {...{ attributes, children, element, location, selfCard }} />
    // case 'hashtag':
    //   return <InlineHashtag {...{ attributes, children, element, location }} />
    // case 'new-hashtag':
    //   return <InlineNewHashtag {...{ attributes, children, element, location }} />
    // case 'poll':
    //   return <InlinePoll {...{ attributes, children, element, location }} />
    // case 'lc':
    //   return <Lc {...{ attributes, children, element, location, sourceUrl }} />
    // case 'li':
    //   return <Li {...{ attributes, children, element, location }} />
    // case 'ul':
    //   return <Ul {...{ attributes, children, element }} />
    default:
      return <span {...attributes}>{children}</span>
  }
}

export const BulletEditor = (props: { initialValue: LiElement[] }): JSX.Element => {
  const { initialValue } = props

  const [value, setValue] = useState<LiElement[]>(initialValue)
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const renderElement = useCallback((props: RenderElementProps) => <CustomElement {...{ ...props }} />, [])
  const decorate = useCallback(([node, path]: NodeEntry) => {
    const ranges: CustomRange[] = []
    if (editor.selection != null) {
      if (
        !Editor.isEditor(node) &&
        // Editor.string(editor, [path[0]]) === '' &&
        Editor.string(editor, path) === '' &&
        Range.includes(editor.selection, path) &&
        Range.isCollapsed(editor.selection)
      ) {
        // ranges.push({
        //   ...editor.selection,
        //   placeholder: true,
        // })
        // console.log(editor.selection)
        return [{ ...editor.selection, placeholder: true }]
      }
    }
    //   if (!Text.isText(node)) {
    //     return ranges
    // }

    //   function getLength(token: string | Token): number {
    //     if (typeof token === 'string') {
    //       return token.length
    //     } else if (typeof token.content === 'string') {
    //       return token.content.length
    //     } else if (Array.isArray(token.content)) {
    //       return token.content.reduce((l, t) => l + getLength(t), 0)
    //     } else {
    //       return 0
    //     }
    //   }

    // const tokens = tokenize(node.text, LINE_VALUE_GRAMMAR)
    // let start = 0

    // for (const token of tokens) {
    //   const length = getLength(token)
    //   const end = start + length

    //   if (typeof token !== 'string') {
    //     ranges.push({
    //       // [token.type]: true,
    //       type: token.type,
    //       anchor: { path, offset: start },
    //       focus: { path, offset: end },
    //     })
    //   }
    //   start = end
    // }

    return ranges
  }, [])
  // const withListOnKeyDownMemo = useCallback((event: React.KeyboardEvent) => {
  //   withListOnKeyDownMemo(event, editor)
  //   // console.log(editor.children)
  // }, [])

  // const [searchPanel, onValueChange] = useSearch(editor)

  // useEffect(() => {
  //   if (searchAllResult.data) {
  //     setSuggestions(searchAllResult.data.searchAll)
  //   } else {
  //     setSuggestions(null)
  //   }
  // }, [searchAllResult])
  // console.log(initialValue)

  return (
    <div className={classes.bulletEditorContainer}>
      <div>{/* @{selfCard.link?.url ?? 'undefined'}; @{location.author ?? 'undefined'} */}</div>
      <Slate
        editor={editor}
        value={value}
        onChange={value => {
          if (isLiArray(value)) {
            setValue(value)
            // if (onValueChange) {
            //   onValueChange(value)
            // }
          } else {
            throw new Error('value需為ul array')
          }
        }}
      >
        <Editable
          autoCorrect="false"
          // decorate={decorate}
          // readOnly={readOnly}
          renderElement={renderElement}
          // renderLeaf={renderLeaf}
          // onKeyDown={event => {
          //   withListOnKeyDownMemo(event)
          //   // if (search) {
          //   //   onKeyDownForSuggest(event)
          //   // } else {
          //   //   onKeyDownForBullet(event)
          //   // }
          // }}
        />
        {/* {searchPanel} */}
        {/* {search && (
          <Portal>
            <SuggestionPanel
              corner={corner}
              suggestions={suggestions}
              selectedIdx={selectedIdx}
              setSelectedIdx={setSelectedIdx}
              onSelected={onSelected}
            />
          </Portal>
        )} */}
        {/* <CommentPanel /> */}
      </Slate>
    </div>
  )
}

const TestPage = (): JSX.Element => {
  return (
    <div>
      <BulletEditor initialValue={initialValue} />
    </div>
  )
}

export default TestPage
