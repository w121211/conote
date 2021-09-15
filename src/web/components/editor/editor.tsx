import React, { useState, useMemo, useCallback, useEffect, CSSProperties } from 'react'
import Link from 'next/link'
import Modal from 'react-modal'
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
import BulletSvg from '../bullet-svg/bullet-svg'
import classes from './editor.module.scss'
import Popover from '../popover/popover'
import MyTooltip from '../my-tooltip/my-tooltip'
import {
  Card,
  EmojiText,
  Hashtag,
  HashtagLike,
  LikeChoice,
  MyHashtagLikeDocument,
  MyHashtagLikeQuery,
  MyHashtagLikeQueryVariables,
  Poll,
  useCreateEmojiMutation,
  useCreateVoteMutation,
  useMyHashtagLikeQuery,
  useMyVotesLazyQuery,
  usePollQuery,
  useUpsertEmojiLikeMutation,
} from '../../apollo/query.graphql'
import ArrowUpIcon from '../../assets/svg/arrow-up.svg'
import BulletPanel from '../bullet-panel/bullet-panel'
import MyHashtagGroup from '../upDown/hashtag-group'
import { spawn } from 'child_process'
import { isLiArray, isUl, lcPath, onKeyDown as withListOnKeyDown, ulPath, withList } from './with-list'
import { NavLocation, locationToUrl } from './with-location'
import { withOperation } from './with-operation'
import { parseLcAndReplace, withParse } from './with-parse'
import { toInlinePoll } from '../../lib/bullet/types'

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

const EmojiLike = (props: { hashtag: Hashtag }): JSX.Element | null => {
  const { hashtag } = props
  const { data, loading, error } = useMyHashtagLikeQuery({
    variables: { hashtagId: hashtag.id.toString() },
  })
  const [upsertEmojiLike] = useUpsertEmojiLikeMutation({
    update(cache, { data }) {
      // TODO: 這裡忽略了更新 count
      if (data?.upsertEmojiLike) {
        cache.writeQuery<MyHashtagLikeQuery, MyHashtagLikeQueryVariables>({
          query: MyHashtagLikeDocument,
          variables: { hashtagId: data.upsertEmojiLike.like.hashtagId.toString() },
          data: { myHashtagLike: data.upsertEmojiLike.like },
        })
      }
    },
  })
  function handleClickLike(choice: LikeChoice) {
    const myLike = data?.myHashtagLike
    if (myLike && myLike.choice === choice) {
      upsertEmojiLike({
        variables: {
          hashtagId: hashtag.id.toString(),
          data: { choice: 'NEUTRAL' },
        },
      })
    }
    if (myLike && myLike.choice !== choice) {
      upsertEmojiLike({
        variables: {
          hashtagId: hashtag.id.toString(),
          data: { choice },
        },
      })
    }
    if (myLike === null) {
      upsertEmojiLike({
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
    return <span>Error</span>
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
    </>
  )
}

/**
 * @returns 若 emoji 目前沒有人點贊，返回 null
 */
const EmojiButotn = ({ emoji }: { emoji: Hashtag }): JSX.Element | null => {
  // console.log(emoji)
  // if (emoji.count.nUps === 0) {
  //   return null
  // }
  return (
    <span>
      <EmojiLike hashtag={emoji} />
    </span>
  )
}

const AddEmojiButotn = (props: {
  bulletId: number
  emojiText: EmojiText
  // curEmojis: Hashtag[]
  onCreated: (emoji: Hashtag, myEmojiLike: HashtagLike) => void
}): JSX.Element => {
  const { bulletId, emojiText, onCreated } = props
  const [createEmoji] = useCreateEmojiMutation({
    variables: { bulletId, emojiText },
    onCompleted(data) {
      const { emoji, like } = data.createEmoji
      onCreated(emoji, like)
    },
  })
  return (
    <button
      onClick={() => {
        createEmoji()
      }}
    >
      {emojiText}
    </button>
  )
}

const InlineSymbol = (
  props: RenderElementProps & {
    element: InlineSymbolElement
  },
): JSX.Element => {
  const { attributes, children, element } = props

  return <button {...attributes}>{children}</button>
}

const InlineMirror = (
  props: RenderElementProps & { element: InlineMirrorElement; location: NavLocation; selfCard: Card },
): JSX.Element => {
  const { attributes, children, element, location, selfCard } = props
  const editor = useSlateStatic()
  const href = locationToUrl({
    ...location,
    mirrorSymbol: element.mirrorSymbol,
    openedLiPath: [],
    author: element.author,
  })
  const authorName = selfCard.link?.authorName

  useEffect(() => {
    // 若有 sourceUrl 且未設有 author 的情況，設一個預設 author
    if (authorName && element.author === undefined) {
      const path = ReactEditor.findPath(editor, element)
      Transforms.setNodes<InlineMirrorElement>(editor, { author: authorName }, { at: path })
      Transforms.insertNodes(editor, { text: ` @${authorName}` }, { at: Path.next(path) })
    }
  }, [authorName, element])

  return (
    <span {...attributes}>
      <Link href={href}>
        <a>{children}</a>
      </Link>
    </span>
  )
}

const PollForm = ({ id }: { id: string }): JSX.Element => {
  const { data, loading, error } = usePollQuery({ variables: { id } })
  const [createVote, createVoteResult] = useCreateVoteMutation()
  if (loading || createVoteResult.loading) {
    return <div>loading...</div>
  }
  if (error || data === undefined || createVoteResult.error) {
    return <div>error</div>
  }
  if (createVoteResult.data) {
    const vote = createVoteResult.data.createVote
    const voted = data.poll.choices[vote.choiceIdx]
    return (
      <div>
        {data.poll.choices.join(' ')}[{voted}]
      </div>
    )
  }
  return (
    <div>
      {data.poll.choices.map((e, i) => (
        <button
          key={i}
          onClick={() => {
            createVote({
              variables: {
                pollId: id,
                data: { choiceIdx: i },
              },
            })
          }}
        >
          {e}
        </button>
      ))}
    </div>
  )
}

const NewPollForm = ({ choices }: { choices?: string[]; onCreated: (poll: Poll) => void }): JSX.Element => {
  // const queryPoll = usePollQuery({ variables: { id } })
  return <div></div>
}

const InlinePoll = (props: RenderElementProps & { element: InlinePollElement }): JSX.Element => {
  const { attributes, children, element } = props
  const readonly = useReadOnly()
  const queryPoll = usePollQuery({ variables: { id: element.id.toString() } })
  console.log(children, element)
  if (readonly) {
    if (element.type === 'poll') {
      return <MyHashtagGroup {...attributes} choices={element.choices} pollId={element.id.toString()} />
    }
    return (
      <button {...attributes} className="inline">
        {children}
      </button>
    )
  }
  if (element.type === 'poll') {
    return (
      <span {...attributes}>
        <span style={{ display: 'none' }}>{children}</span>
        <span contentEditable={false}>
          <MyHashtagGroup choices={element.choices} pollId={element.id.toString()} inline />
        </span>
      </span>
    )
  }
  return (
    <button {...attributes} className="inline">
      {children}
    </button>
  )
  // return <span {...attributes}>{children}</span>
  const editor = useSlateStatic()
  const [isOpen, setIsOpen] = useState(false)
  const [queryMyVotes, { data, loading, error }] = useMyVotesLazyQuery() // 若已投票可展現投票結果

  useEffect(() => {
    // console.log('inline poll')
    if (element.id) {
      queryMyVotes({ variables: { pollId: element.id } })
    }
  }, [element])

  // useEffect(() => {
  //   console.log(element)
  //   if (isOpen) {
  //     const path = ReactEditor.findPath(editor, element)
  //     Transforms.setNodes<PopupInlineElement>(
  //       editor,
  //       { id: 'test', str: 'hello-world' },
  //       { at: path }
  //     )
  //     Transforms.insertText(editor, 'hello-world', { at: [...path, 0] })
  //     console.log('setNodes', element)
  //     setIsOpen(false)
  //   }
  // }, [isOpen])

  function closeModal() {
    setIsOpen(false)
  }

  function onCreated(poll: Poll) {
    const path = ReactEditor.findPath(editor, element)
    const inlinePoll = toInlinePoll({ id: poll.id, choices: poll.choices })
    Transforms.setNodes<InlinePollElement>(editor, inlinePoll, { at: path })
    Transforms.insertText(editor, inlinePoll.str, { at: path })
  }

  return (
    <span {...attributes}>
      <span style={{ display: 'none' }}>{children}</span>

      <span contentEditable={false}>
        <button
          onClick={event => {
            event.preventDefault()
            setIsOpen(true)
          }}
        >
          {element.choices.join(' ')}
          {data?.myVotes && data.myVotes.length > 0 && `[${data.myVotes[data.myVotes.length - 1].choiceIdx}]`}
        </button>

        <Modal
          ariaHideApp={false}
          isOpen={isOpen}
          // onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          contentLabel="Example Modal"
        >
          <button onClick={closeModal}>close</button>
          {element.id ? <PollForm id={element.id} /> : <NewPollForm choices={element.choices} onCreated={onCreated} />}
        </Modal>
      </span>
    </span>
  )
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

  // console.log('lc entry', element)

  useEffect(() => {
    if (element.op === 'CREATE') {
      let lcPath: number[] | undefined
      if (author && element.author === undefined) {
        lcPath = ReactEditor.findPath(editor, element)
        Transforms.setNodes<LcElement>(editor, { author }, { at: lcPath })
      }
      if (sourceUrl && element.sourceUrl === undefined) {
        Transforms.setNodes<LcElement>(editor, { sourceUrl }, { at: lcPath ?? ReactEditor.findPath(editor, element) })
      }
    }
  }, [author, element, sourceUrl])

  useEffect(() => {
    // cursor 離開 lc-head，將 text 轉 tokens、驗證 tokens、轉成 inline-elements
    if ((focused && !selected) || readonly) {
      const path = ReactEditor.findPath(editor, element)
      parseLcAndReplace({ editor, lcEntry: [element, path] })
      // console.log('parseLcAndReplace', path)
    }
    // cursor 進入 lc-head，將 inlines 轉回 text，避免直接操作 inlines
    if (selected) {
      const path = ReactEditor.findPath(editor, element)
      Transforms.unwrapNodes(editor, {
        at: path,
        match: (n, p) => Element.isElement(n) && Path.isChild(p, path),
      })
      // console.log('unwrapNodes', path)
    }
  }, [selected, readonly])

  return (
    <div {...attributes}>
      <span className={classes.lcText}>{children}</span>
      {((focused && !selected) || readonly) && (
        <span contentEditable={false} style={{ color: 'green' }}>
          {author === element.author && element.author}
          {sourceUrl === element.sourceUrl && sourceUrl}
          {element.emojis?.map((e, i) => (
            <EmojiButotn key={i} emoji={e} />
          ))}
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

  const [lc, ul] = element.children
  const hasUl = ul !== undefined
  const href = locationToUrl(location, ReactEditor.findPath(editor, element))

  function onEmojiCreated(emoji: Hashtag, myEmojiLike: HashtagLike) {
    const curEmojis = lc.emojis ?? []
    const path = ReactEditor.findPath(editor, element)
    Transforms.setNodes<LcElement>(editor, { emojis: [...curEmojis, emoji] }, { at: lcPath(path) })
  }

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
      {/* <div contentEditable={false}></div> */}
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

        <Link href={href}>
          <a>
            <BulletSvg />
          </a>
        </Link>

        {lc.id && <AddEmojiButotn bulletId={lc.id} emojiText={'UP'} onCreated={onEmojiCreated} />}
      </div>

      <div>{children}</div>
    </div>
  )
}

const Ul = (props: RenderElementProps & { element: UlElement }): JSX.Element => {
  const { attributes, children, element } = props
  const style: CSSProperties = element.folded ? { display: 'none' } : {} // { display: 'none', visibility: 'hidden', height: 0 }
  return (
    <div {...attributes} className={classes.bulletUl} style={style}>
      {children}
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
  const editor = useMemo(() => withParse(withOperation(withList(withHistory(withReact(createEditor()))))), [])
  const renderElement = useCallback(
    (props: RenderElementProps) => <CustomElement {...{ ...props, location, selfCard }} />,
    [location, selfCard],
  )
  // const decorate = useCallback(([node, path]: NodeEntry) => {
  //   const ranges: CustomRange[] = []
  //   if (editor.selection != null) {
  //     if (
  //       !Editor.isEditor(node) &&
  //       // Editor.string(editor, [path[0]]) === '' &&
  //       Editor.string(editor, path) === '' &&
  //       Range.includes(editor.selection, path) &&
  //       Range.isCollapsed(editor.selection)
  //     ) {
  //       // ranges.push({
  //       //   ...editor.selection,
  //       //   placeholder: true,
  //       // })
  //       // console.log(editor.selection)
  //       return [{ ...editor.selection, placeholder: true }]
  //     }
  //   }
  //   //   if (!Text.isText(node)) {
  //   //     return ranges
  //   // }

  //   //   function getLength(token: string | Token): number {
  //   //     if (typeof token === 'string') {
  //   //       return token.length
  //   //     } else if (typeof token.content === 'string') {
  //   //       return token.content.length
  //   //     } else if (Array.isArray(token.content)) {
  //   //       return token.content.reduce((l, t) => l + getLength(t), 0)
  //   //     } else {
  //   //       return 0
  //   //     }
  //   //   }

  //   // const tokens = tokenize(node.text, LINE_VALUE_GRAMMAR)
  //   // let start = 0

  //   // for (const token of tokens) {
  //   //   const length = getLength(token)
  //   //   const end = start + length

  //   //   if (typeof token !== 'string') {
  //   //     ranges.push({
  //   //       // [token.type]: true,
  //   //       type: token.type,
  //   //       anchor: { path, offset: start },
  //   //       focus: { path, offset: end },
  //   //     })
  //   //   }
  //   //   start = end
  //   // }

  //   return ranges
  // }, [])
  const withListOnKeyDownMemo = useCallback((event: React.KeyboardEvent) => {
    withListOnKeyDown(event, editor)
    // console.log(editor.children)
  }, [])

  // const [searchPanel, onValueChange] = useSearch(editor)
  const [value, setValue] = useState<LiElement[]>(initialValue)

  useEffect(() => {
    // 當 initialValue 變動時，重設 editor value @see https://github.com/ianstormtaylor/slate/issues/713
    Transforms.deselect(editor)
    setValue(initialValue)
    // console.log('initial value setted')
  }, [initialValue])

  // useEffect(() => {
  //   if (searchAllResult.data) {
  //     setSuggestions(searchAllResult.data.searchAll)
  //   } else {
  //     setSuggestions(null)
  //   }
  // }, [searchAllResult])

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

            // TODO: 每字都儲存會有效能問題
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
          // decorate={decorate}
          readOnly={readOnly}
          renderElement={renderElement}
          // renderLeaf={renderLeaf}
          onKeyDown={event => {
            // withListOnKeyDownMemo(event)
            withListOnKeyDown(event, editor)
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
