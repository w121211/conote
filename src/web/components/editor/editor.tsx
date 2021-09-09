import React, { useState, useMemo, useCallback, useEffect, CSSProperties } from 'react'
import { Editor, Transforms, createEditor, Node, NodeEntry, Range, Text, Path, Element } from 'slate'
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  useFocused,
  useReadOnly,
  useSelected,
  useSlateStatic,
  withReact,
} from 'slate-react'
import { withHistory } from 'slate-history'
import {
  CustomRange,
  InlineMirrorElement,
  InlinePollElement,
  InlineSymbolElement,
  LcElement,
  LiElement,
  UlElement,
} from './slate-custom-types'
import { isLiArray, isUl, onKeyDown as withListOnKeyDown, ulPath, withList } from './with-list'
import { withOperation } from './with-operation'
import BulletSvg from '../bullet-svg/bullet-svg'
import classes from './editor.module.scss'
import Popover from '../popover/popover'
import MyTooltip from '../my-tooltip/my-tooltip'
import {
  Card,
  Hashtag,
  LikeChoice,
  MyHashtagLikeDocument,
  MyHashtagLikeQuery,
  MyHashtagLikeQueryVariables,
  Poll,
  useCreateEmojiLikeMutation,
  useMyHashtagLikeQuery,
  usePollQuery,
  useUpdateEmojiLikeMutation,
} from '../../apollo/query.graphql'
import { NavLocation, locationToHref } from './with-location'
import { parseLcAndReplace, withParse } from './with-parse'
import ArrowUpIcon from '../../assets/svg/arrow-up.svg'
import BulletPanel from '../bullet-panel/bullet-panel'

const useAuthorSwitcher = (props: { authorName?: string }): [string, JSX.Element] => {
  const { authorName } = props
  const [author, setAuthor] = useState<string>(authorName ?? '@self')
  const switcher = authorName ? (
    <button
      onClick={() => {
        if (author === '@self') {
          setAuthor(authorName)
        } else {
          setAuthor('@self')
        }
      }}
    >
      {author}
    </button>
  ) : (
    <span>{author}</span>
  )
  return [author, switcher]
}

const HashtagLike = (props: { hashtag: Hashtag }): JSX.Element | null => {
  const { hashtag } = props
  const { data, loading, error } = useMyHashtagLikeQuery({
    variables: { hashtagId: hashtag.id.toString() },
  })
  const [createEmojiLike] = useCreateEmojiLikeMutation({
    update(cache, { data }) {
      // TODO: 這裡忽略了更新 count
      if (data?.createEmojiLike) {
        cache.writeQuery<MyHashtagLikeQuery, MyHashtagLikeQueryVariables>({
          query: MyHashtagLikeDocument,
          variables: { hashtagId: data.createEmojiLike.like.hashtagId.toString() },
          data: { myHashtagLike: data.createEmojiLike.like },
        })
      }
    },
  })
  const [updateEmojiLike] = useUpdateEmojiLikeMutation({
    update(cache, { data }) {
      // TODO: 這裡忽略了更新 count
      if (data?.updateEmojiLike) {
        cache.writeQuery<MyHashtagLikeQuery, MyHashtagLikeQueryVariables>({
          query: MyHashtagLikeDocument,
          variables: { hashtagId: data.updateEmojiLike.like.hashtagId.toString() },
          data: { myHashtagLike: data.updateEmojiLike.like },
        })
      }
    },
  })

  function handleClickLike(choice: LikeChoice) {
    if (data === undefined) {
      return
    }
    const { myHashtagLike } = data
    if (myHashtagLike && myHashtagLike.choice === choice) {
      updateEmojiLike({
        variables: {
          id: myHashtagLike.id,
          data: { choice: 'NEUTRAL' },
        },
      })
    }
    if (myHashtagLike && myHashtagLike.choice !== choice) {
      updateEmojiLike({
        variables: {
          id: myHashtagLike.id,
          data: { choice },
        },
      })
    }
    if (myHashtagLike === null) {
      createEmojiLike({
        variables: {
          hashtagId: hashtag.id.toString(),
          data: { choice },
        },
      })
    }
  }

  if (loading) {
    return null
  }
  if (error || data === undefined) {
    return <div>Error</div>
  }
  return (
    <>
      <button
        onClick={() => {
          handleClickLike('UP')
        }}
      >
        {data.myHashtagLike?.choice === 'UP' ? 'up*' : 'up'}
      </button>
      <button
        onClick={() => {
          handleClickLike('DOWN')
        }}
      >
        {data.myHashtagLike?.choice === 'DOWN' ? 'down*' : 'down'}
      </button>
    </>
  )
}

const EmojiComponent = (props: { hashtag: Hashtag }): JSX.Element => {
  const { hashtag } = props
  return (
    <span>
      {hashtag.text}
      <HashtagLike hashtag={hashtag} />
    </span>
  )
}

const Leaf = (props: RenderLeafProps): JSX.Element => {
  const { attributes, children, leaf } = props
  // let style: React.CSSProperties = {}
  if (leaf.placeholder) {
    return (
      <span style={{ minWidth: '135px', display: 'inline-block', position: 'relative' }}>
        <span {...attributes}>
          {/* <DefaultLeaf {...props} /> */}
          {children}
        </span>
        <span style={{ opacity: 0.3, position: 'absolute', top: 0 }} contentEditable={false}>
          Type / to open menu
        </span>
      </span>
    )
  }
  // switch (leaf.type) {
  //   case 'sect-symbol': {
  //     style = { fontWeight: 'bold' }
  //     break
  //   }
  //   case 'multiline-marker':
  //   case 'inline-marker': {
  //     style = { color: 'red' }
  //     break
  //   }
  //   case 'inline-value':
  //   case 'line-value': {
  //     style = { color: 'blue' }
  //     break
  //   }
  //   case 'line-mark':
  //   case 'inline-mark': {
  //     style = { color: 'orange' }
  //     break
  //   }
  //   case 'mark':
  //   case 'ticker':
  //   case 'topic': {
  //     style = { color: 'brown' }
  //     break
  //   }
  //   case 'stamp': {
  //     style = { color: 'yellow' }
  //     break
  //   }
  // }
  return (
    // <span {...attributes} style={style}>
    <span {...attributes}>{children}</span>
  )
}

const InlineSymbol = (
  props: RenderElementProps & {
    element: InlineSymbolElement
    authorName?: string
    sourceUrl?: string
  },
): JSX.Element => {
  const { attributes, children, element, authorName, sourceUrl } = props
  const readonly = useReadOnly()
  const focused = useFocused()
  const selected = useSelected()

  useEffect(() => {
    // console.log(readonly, focused, selected)
  }, [readonly, focused, selected])
  // if (readonly) {
  //   // console.log(Node.string(element))
  //   return (
  //     <a href={`/card/${Node.string(element)}`} {...attributes}>
  //       {children}
  //     </a>
  //   )
  // }
  // return <span {...attributes}>{children}</span>
  return <button {...attributes}>{children}</button>
}

const InlineMirror = (
  props: RenderElementProps & { element: InlineMirrorElement; location: NavLocation; selfCard: Card },
): JSX.Element => {
  const { attributes, children, element, location, selfCard } = props
  const readonly = useReadOnly()
  const editor = useSlateStatic()
  const href = locationToHref({
    ...location,
    mirrorSymbol: element.mirrorSymbol,
    openedLiPath: [],
    author: '@tester',
  })
  const authorName = selfCard.link?.authorName

  const focused = useFocused() // 整個editor是否focus
  const selected = useSelected() // 這個element是否被select（等同指標在這個element裡）

  useEffect(() => {
    // 若有 sourceUrl 且未設有 author 的情況，設一個預設 author
    if (authorName && element.author === undefined) {
      const path = ReactEditor.findPath(editor, element)
      Transforms.setNodes<InlineMirrorElement>(editor, { author: authorName }, { at: path })
      Transforms.insertNodes(editor, { text: ` @${authorName}` }, { at: Path.next(path) })
    }
  }, [authorName, element])

  useEffect(() => {
    // cursor 進入 inline
    if (focused && selected) {
      console.log('setInlinesToText')
      // const path = ReactEditor.findPath(editor, element)
      // setInlinesToText(editor, [element, path])
      // Transforms.setNodes<LcElement>(editor, { parsed: undefined }, { at: path })
      // return
    }
  }, [selected, readonly])

  if (readonly) {
    return (
      <a {...attributes} href={href}>
        {children}
      </a>
    )
  }
  return (
    <span {...attributes} style={{ color: 'blue' }}>
      {children}
    </span>
  )
}

// const CurHashtagsPlacerInline = (
//   props: RenderElementProps & { element: CurHashtagsPlacerInlineElement; location: NavLocation },
// ): JSX.Element => {
//   const { attributes, children, element, location } = props
//   const readonly = useReadOnly()
//   if (readonly) {
//     return (
//       <span {...attributes}>
//         {/* {children} */}
//         {element.hashtags.map((e, i) => {
//           switch (e.type) {
//             case 'hashtag':
//               return <HashtagComponent key={i} hashtag={e} />
//             case 'hashtag-group':
//               return (
//                 <HashtagGroupComponent
//                   key={i}
//                   hashtagGroup={e}
//                   onClick={text => {
//                     if (location.author) {
//                       // 新增表示投票的 child lc
//                       // const editor = useSlateStatic()
//                       // const lcPath = ReactEditor.findPath(editor, element)
//                       // Editor.insertNode(editor, {})
//                     }
//                   }}
//                 />
//               )
//           }
//         })}
//       </span>
//     )
//   }
//   return (
//     <span {...attributes} style={{ color: 'blue' }}>
//       {children}
//     </span>
//   )
// }

// const InlineHashtag = (props: RenderElementProps & { element: InlineHashtagElement }): JSX.Element => {
//   const { attributes, children, element } = props
//   const readonly = useReadOnly()
//   const queryMyHashtagLike = useMyHashtagLikeQuery({ variables: { hashtagId: element.id.toString() } })
//   if (readonly) {
//     const { data, error } = queryMyHashtagLike
//     if (error) {
//       return <div>{error}</div>
//     }
//     return (
//       <button {...attributes} data-type="inline">
//         {/* {children} */}
//         {data?.myHashtagLike?.choice === 'UP' ? `${element.str}*` : element.str}({element.hashtag?.count.nUps})
//       </button>
//     )
//   }
//   return <span {...attributes}>{children}</span>
// }

const InlinePoll = (props: RenderElementProps & { element: InlinePollElement }): JSX.Element => {
  const { attributes, children, element } = props
  const readonly = useReadOnly()
  const queryPoll = usePollQuery({ variables: { id: element.id.toString() } })
  if (readonly) {
    return <button {...attributes}>{children}</button>
  }
  return <span {...attributes}>{children}</span>
}

const Lc = (
  props: RenderElementProps & { element: LcElement; location: NavLocation; sourceUrl?: string },
): JSX.Element => {
  const { attributes, children, element, location, sourceUrl } = props
  const editor = useSlateStatic()
  const readonly = useReadOnly()
  const focused = useFocused() // 整個editor是否focus
  const selected = useSelected() // 這個element是否被select（等同指標在這個element裡）
  // const [author, authorSwitcher] = useAuthorSwitcher({ authorName })
  // const [placeholder, setPlaceholder] = useState<string | undefined>()
  // useEffect(() => {
  //   setPlaceholder(element.placeholder)
  // }, [element])
  const author = location.author

  useEffect(() => {
    if (author && element.op === 'CREATE') {
      const lcPath = ReactEditor.findPath(editor, element)
      if (author === '@self') {
        Transforms.setNodes<LcElement>(editor, { author: undefined }, { at: lcPath })
      } else {
        Transforms.setNodes<LcElement>(editor, { author }, { at: lcPath })
      }
    }
  }, [author, element])

  useEffect(() => {
    // cursor 離開 lc-head，將 text 轉 tokens、驗證 tokens、轉成 inline-elements
    if ((focused && !selected) || readonly) {
      const path = ReactEditor.findPath(editor, element)
      parseLcAndReplace(editor, [element, path])
      console.log('parseLcAndReplace', path)
    }
    // cursor 進入 lc-head，將 inlines 轉回 text，避免直接操作 inlines
    if (selected) {
      const path = ReactEditor.findPath(editor, element)
      Transforms.unwrapNodes(editor, {
        at: path,
        match: (n, p) => Element.isElement(n) && Path.isChild(p, path),
      })
      console.log('unwrapNodes', path)
    }
  }, [selected, readonly])

  return (
    <div {...attributes}>
      <span className={classes.lcText}>{children}</span>
      {readonly && (
        <span contentEditable={false} style={{ color: 'green' }}>
          {author === element.author && author}
          {sourceUrl === element.sourceUrl && sourceUrl}
          {/* {element.op === 'CREATE' && authorSwitcher} */}
          {/* {placeholder && Node.string(element).length === 0 && <span style={{ color: 'grey' }}>{placeholder}</span>} */}
        </span>
      )}
    </div>
  )
}

const Li = (props: RenderElementProps & { element: LiElement; location: NavLocation }): JSX.Element => {
  const { attributes, children, element, location } = props
  const editor = useSlateStatic()
  // const [hasUl, setHasUl] = useState(false)
  const [ulFolded, setUlFolded] = useState<true | undefined>()
  const [showPanelIcon, setShowPanelIcon] = useState(false)
  // console.log(element)

  // useEffect(() => {
  //   const [, ul] = element.children
  //   if (ul) {
  //     setHasUl(true)
  //   } else {
  //     setHasUl(false)
  //   }
  //   // const path = ReactEditor.findPath(editor, element)
  //   // try {
  //   //   const ul = Editor.node(editor, ulPath(path))
  //   //   if (isUl(ul[0])) {
  //   //     setHasUl(true)
  //   //     // setUlFolded(ul[0].folded)
  //   //   }
  //   // } catch (err) {
  //   //   // 找不到ul
  //   //   setHasUl(false)
  //   //   // setUlFolded(undefined)
  //   // }
  // }, [editor, element])

  const [, ul] = element.children
  const hasUl = ul !== undefined
  const href = locationToHref(location, ReactEditor.findPath(editor, element))
  return (
    <div
      {...attributes}
      className={classes.bulletLi}
      onMouseOver={event => {
        event.stopPropagation()
        setShowPanelIcon(true)
      }}
      onMouseOut={event => {
        setShowPanelIcon(false)
      }}
    >
      <div contentEditable={false}></div>
      <div className={classes.arrowBulletWrapper} contentEditable={false}>
        <BulletPanel
          visible={showPanelIcon}
          sourceUrl={element.children[0].sourceUrl}
          authorName={element.children[0].author}
        >
          {/* <span className={classes.oauthorName}> @{authorName}</span> */}
        </BulletPanel>

        {hasUl ? (
          <>
            <span
              className={classes.arrowWrapper}
              onClick={event => {
                // 設定 folded property
                event.preventDefault()
                const path = ReactEditor.findPath(editor, element)
                try {
                  const ul = Editor.node(editor, ulPath(path))
                  if (isUl(ul[0])) {
                    Transforms.deselect(editor)
                    Transforms.setNodes<UlElement>(editor, { folded: ul[0].folded ? undefined : true }, { at: ul[1] })
                    setUlFolded(ul[0].folded ? undefined : true)
                  }
                } catch (err) {
                  // 不用處理
                }
              }}
            >
              <ArrowUpIcon
                style={ulFolded === undefined ? { transform: 'rotate(180deg)' } : { transform: 'rotate(90deg)' }}
              />
              {/* {authorName ? (
              ) : // <MyTooltip className={classes.bulletTooltip}>
              //   <span className={classes.oauthorName}> @{authorName}</span>
              // </MyTooltip>
              null} */}
            </span>
            {/* <BulletPanel><span className={classes.oauthorName}> @{authorName}</span></BulletPanel> */}
          </>
        ) : (
          <span className={classes.arrowWrapper}>
            <ArrowUpIcon style={{ opacity: 0 }} />
            {/* <BulletSvg /> */}
            {/* {authorName ? (
              ) : // <MyTooltip className={classes.bulletTooltip}>
              //   <span className={classes.oauthorName}> @{authorName}</span>
              // </MyTooltip>
              null} */}
          </span>
        )}
        <a href={href}>
          <BulletSvg />
        </a>
      </div>

      <div>{children}</div>
    </div>
  )
}

const Ul = (props: RenderElementProps & { element: UlElement }): JSX.Element => {
  const { attributes, children, element } = props
  // { display: 'none', visibility: 'hidden', height: 0 }
  const style: CSSProperties = element.folded ? { display: 'none' } : {}
  return (
    <div {...attributes}>
      <div className={classes.bulletUl} style={style}>
        {children}
      </div>
    </div>
  )
}

const CustomElement = (props: RenderElementProps & { location: NavLocation; selfCard: Card }): JSX.Element => {
  const { attributes, children, element, location, selfCard } = props
  const sourceUrl = selfCard.link?.url
  switch (element.type) {
    case 'symbol':
      return <InlineSymbol {...{ attributes, children, element }} />
    case 'mirror':
      return <InlineMirror {...{ attributes, children, element, location, selfCard }} />
    // case 'hashtag':
    //   return <InlineHashtag {...{ attributes, children, element, location }} />
    // case 'new-hashtag':
    //   return <InlineNewHashtag {...{ attributes, children, element, location }} />
    case 'poll':
      return <InlinePoll {...{ attributes, children, element, location }} />
    case 'lc':
      return <Lc {...{ attributes, children, element, location, sourceUrl }} />
    case 'li':
      return <Li {...{ attributes, children, element, location }} />
    case 'ul':
      return <Ul {...{ attributes, children, element }} />
    default:
      return <span {...attributes}>{children}</span>
  }
}

export const BulletEditor = (props: {
  initialValue: LiElement[]
  location: NavLocation
  selfCard: Card
  readOnly?: boolean
  onValueChange?: (value: LiElement[]) => void
}): JSX.Element => {
  const { initialValue, location, selfCard, readOnly, onValueChange } = props
  const [value, setValue] = useState<LiElement[]>(initialValue)
  const editor = useMemo(() => withParse(withOperation(withList(withHistory(withReact(createEditor()))))), [])
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, [])
  const renderElement = useCallback(
    (props: RenderElementProps) => <CustomElement {...{ ...props, location, selfCard }} />,
    [],
  )
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
  const withListOnKeyDownMemo = useCallback((event: React.KeyboardEvent) => {
    withListOnKeyDown(event, editor)
    // console.log(editor.children)
  }, [])

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
      <div>
        @{selfCard.link?.url ?? 'undefined'}; @{location.author ?? 'undefined'}
      </div>
      <Slate
        editor={editor}
        value={value}
        onChange={value => {
          if (isLiArray(value)) {
            setValue(value)
            if (onValueChange) {
              onValueChange(value)
            }
          } else {
            throw new Error('value需為ul array')
          }
        }}
      >
        <Editable
          autoCorrect="false"
          decorate={decorate}
          readOnly={readOnly}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={event => {
            withListOnKeyDownMemo(event)
            // if (search) {
            //   onKeyDownForSuggest(event)
            // } else {
            //   onKeyDownForBullet(event)
            // }
          }}
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
