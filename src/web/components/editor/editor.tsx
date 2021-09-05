import React, { useState, useMemo, useCallback, useEffect, CSSProperties } from 'react'
import { Editor, Transforms, createEditor, Node, NodeEntry, Range, Text, Path } from 'slate'
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
  CurHashtagsPlacerInlineElement,
  CustomRange,
  HashtagGroupInlineElement,
  HashtagInlineElement,
  LabelInlineElement,
  LcElement,
  LiElement,
  MirrorInlineElement,
  UlElement,
} from './slate-custom-types'
import { isLiArray, isUl, onKeyDown as withListOnKeyDown, ulPath, withList } from './with-list'
import { withOperation } from './with-operation'
import BulletSvg from '../bullet-svg/bullet-svg'
import classes from './editor.module.scss'
import Popover from '../popover/popover'
import MyTooltip from '../my-tooltip/my-tooltip'
import { Hashtag, HashtagDraft, HashtagGroup, HashtagGroupDraft } from '../../lib/hashtag/types'
import {
  LikeChoice,
  MyHashtagLikeDocument,
  MyHashtagLikeQuery,
  MyHashtagLikeQueryVariables,
  useCreateHashtagLikeMutation,
  useMyHashtagLikeQuery,
  useUpdateHashtagLikeMutation,
} from '../../apollo/query.graphql'
import { NavLocation, pathToHref } from './with-location'
import { parseLcAndReplaceChildren, withInline } from './with-inline'
import ArrowUpIcon from '../../assets/svg/arrow-up.svg'
import BulletPanel from '../bullet-panel/bullet-panel'

const HashtagLike = (props: { hashtag: Hashtag | HashtagGroup }): JSX.Element | null => {
  const { hashtag } = props
  const { data, loading, error } = useMyHashtagLikeQuery({
    variables: { hashtagId: hashtag.id },
  })
  const [createHashtagLike] = useCreateHashtagLikeMutation({
    update(cache, { data }) {
      // TODO: 這裡忽略了更新 count
      if (data?.createHashtagLike) {
        cache.writeQuery<MyHashtagLikeQuery, MyHashtagLikeQueryVariables>({
          query: MyHashtagLikeDocument,
          variables: { hashtagId: data.createHashtagLike.like.hashtagId },
          data: { myHashtagLike: data.createHashtagLike.like },
        })
      }
    },
  })
  const [updateHashtagLike] = useUpdateHashtagLikeMutation({
    update(cache, { data }) {
      // TODO: 這裡忽略了更新 count
      if (data?.updateHashtagLike) {
        cache.writeQuery<MyHashtagLikeQuery, MyHashtagLikeQueryVariables>({
          query: MyHashtagLikeDocument,
          variables: { hashtagId: data.updateHashtagLike.like.hashtagId },
          data: { myHashtagLike: data.updateHashtagLike.like },
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
      updateHashtagLike({
        variables: {
          id: myHashtagLike.id,
          data: { choice: 'NEUTRAL' },
        },
      })
    }
    if (myHashtagLike && myHashtagLike.choice !== choice) {
      updateHashtagLike({
        variables: {
          id: myHashtagLike.id,
          data: { choice },
        },
      })
    }
    if (myHashtagLike === null) {
      createHashtagLike({
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

const HashtagButton = (props: { hashtag: Hashtag | HashtagGroup }): JSX.Element => {
  const { hashtag } = props
  // if (hashtag.type === 'hashtag' || hashtag.typ === 'hashtag-group')
  // const hashtagLike = useHashtagLike({ hashtag })
  return (
    <div>
      {hashtag.text}
      <HashtagLike hashtag={hashtag} />
    </div>
  )
}

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

const LabelInline = (
  props: RenderElementProps & {
    element: LabelInlineElement
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
  if (readonly) {
    // console.log(Node.string(element))
    return (
      <a href={`/card/${Node.string(element)}`} {...attributes}>
        {children}
      </a>
    )
  }
  return <span {...attributes}>{children}</span>
}

const MirrorInline = (
  props: RenderElementProps & { element: MirrorInlineElement; location: NavLocation },
): JSX.Element => {
  const { attributes, children, element, location } = props
  const readonly = useReadOnly()
  const href = pathToHref({ ...location, mirrorSymbol: element.mirrorSymbol })
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

const CurHashtagsPlacerInline = (
  props: RenderElementProps & { element: CurHashtagsPlacerInlineElement },
): JSX.Element => {
  const { attributes, children, element } = props
  const readonly = useReadOnly()
  if (readonly) {
    return (
      <span {...attributes}>
        {/* {children} */}
        {element.hashtags.map((e, i) => (
          <HashtagButton key={i} hashtag={e} />
        ))}
      </span>
    )
  }
  return (
    <span {...attributes} style={{ color: 'blue' }}>
      {children}
    </span>
  )
}

const HashtagInline = (props: RenderElementProps & { element: HashtagInlineElement }): JSX.Element => {
  const { attributes, children, element } = props
  const readonly = useReadOnly()
  if (readonly) {
    return (
      <button {...attributes} className=".inline">
        {children}
      </button>
    )
  }
  return <span {...attributes}>{children}</span>
}

const HashtagGroupInline = (props: RenderElementProps & { element: HashtagGroupInlineElement }): JSX.Element => {
  const { attributes, children, element } = props
  const readonly = useReadOnly()
  if (readonly) {
    return <button {...attributes}>{children}</button>
  }
  return <span {...attributes}>{children}</span>
}

const Lc = (
  props: RenderElementProps & { element: LcElement; authorName?: string; sourceUrl?: string },
): JSX.Element => {
  const { attributes, children, element, authorName, sourceUrl } = props
  const editor = useSlateStatic()
  const readonly = useReadOnly()
  const focused = useFocused() // 整個editor是否focus
  const selected = useSelected() // 這個element是否被select（等同指標在這個element裡）
  const [author, authorSwitcher] = useAuthorSwitcher({ authorName })
  // const [placeholder, setPlaceholder] = useState<string | undefined>()
  // useEffect(() => {
  //   setPlaceholder(element.placeholder)
  // }, [element])
  useEffect(() => {
    if (authorName && element.op === 'CREATE') {
      const lcPath = ReactEditor.findPath(editor, element)
      if (author === '@self') {
        Transforms.setNodes<LcElement>(editor, { authorName: undefined }, { at: lcPath })
      } else {
        Transforms.setNodes<LcElement>(editor, { authorName }, { at: lcPath })
      }
    }
  }, [author, element])

  useEffect(() => {
    // cursor 離開 lc-head，將 text 轉 tokens、驗證 tokens、轉成 inline-elements
    if ((focused && !selected) || readonly) {
      const path = ReactEditor.findPath(editor, element)
      parseLcAndReplaceChildren(editor, [element, path])
    }
  }, [selected, readonly])

  return (
    <div {...attributes}>
      <span className={classes.lcText}>{children}</span>
      {readonly && (
        <div contentEditable={false} style={{ color: 'green' }}>
          {/* {placeholder && Node.string(element).length === 0 && <span style={{ color: 'grey' }}>{placeholder}</span>}
        {element.op === 'CREATE' && authorSwitcher}
        {sourceUrl}
        {element.id}
        {element.error}
        {element.freeze && 'freeze'} */}
        </div>
      )}
    </div>
  )
}

const Li = (
  props: RenderElementProps & { element: LiElement; location: NavLocation; authorName?: string },
): JSX.Element => {
  const { attributes, children, element, location, authorName } = props
  const editor = useSlateStatic()
  const [hasUl, setHasUl] = useState(false)
  const [ulFolded, setUlFolded] = useState<true | undefined>()
  const [showPanelIcon, setShowPanelIcon] = useState(false)
  // console.log(element)

  useEffect(() => {
    const path = ReactEditor.findPath(editor, element)
    try {
      const ul = Editor.node(editor, ulPath(path))
      if (isUl(ul[0])) {
        setHasUl(true)
        // setUlFolded(ul[0].folded)
      }
    } catch (err) {
      // 找不到ul
      setHasUl(false)
      // setUlFolded(undefined)
    }
  }, [editor, element])

  const href = pathToHref(location, ReactEditor.findPath(editor, element))
  // console.log(authorName, element)
  return (
    <div
      {...attributes}
      className={classes.bulletLi}
      onMouseOver={e => {
        e.stopPropagation()
        setShowPanelIcon(true)
      }}
      onMouseOut={e => {
        setShowPanelIcon(false)
      }}
    >
      <div contentEditable={false}></div>
      <div className={classes.arrowBulletWrapper} contentEditable={false}>
        <BulletPanel
          visible={showPanelIcon}
          sourceUrl={element.children[0].sourceUrl}
          authorName={element.children[0].authorName}
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
          <>
            <span className={classes.arrowWrapper}>
              <ArrowUpIcon style={{ opacity: 0 }} />
              {/* <BulletSvg /> */}
              {/* {authorName ? (
              ) : // <MyTooltip className={classes.bulletTooltip}>
              //   <span className={classes.oauthorName}> @{authorName}</span>
              // </MyTooltip>
              null} */}
            </span>
          </>
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

const CustomElement = (
  props: RenderElementProps & {
    location: NavLocation
    authorName?: string
    sourceUrl?: string
  },
): JSX.Element => {
  const { attributes, children, element, location, authorName, sourceUrl } = props

  switch (element.type) {
    case 'label-inline':
      return <LabelInline {...{ attributes, children, element, authorName, sourceUrl }} />
    case 'mirror-inline':
      return <MirrorInline {...{ attributes, children, element, location, authorName, sourceUrl }} />
    case 'cur-hashtags-placer-inline':
      return <CurHashtagsPlacerInline {...{ attributes, children, element }} />
    case 'hashtag-inline':
      return <HashtagInline {...{ attributes, children, element }} />
    case 'hashtag-group-inline':
      return <HashtagGroupInline {...{ attributes, children, element }} />
    case 'lc':
      return <Lc {...{ attributes, children, element, authorName, sourceUrl }} />
    case 'li':
      return <Li {...{ attributes, children, element, location, authorName, sourceUrl }} />
    case 'ul':
      return <Ul {...{ attributes, children, element, authorName, sourceUrl }} />
    default:
      return <span {...attributes}>{children}</span>
  }
}

export const BulletEditor = (props: {
  initialValue: LiElement[]
  location: NavLocation
  authorName?: string
  sourceUrl?: string
  readOnly?: boolean
  onValueChange?: (value: LiElement[]) => void
}): JSX.Element => {
  const { initialValue, location, authorName, sourceUrl, readOnly, onValueChange } = props
  const [value, setValue] = useState<LiElement[]>(initialValue)
  const editor = useMemo(() => withInline(withOperation(withList(withHistory(withReact(createEditor()))))), [])
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, [])
  const renderElement = useCallback(
    (props: RenderElementProps) => <CustomElement {...{ ...props, location, authorName, sourceUrl }} />,
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
