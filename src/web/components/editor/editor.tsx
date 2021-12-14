import React, { useState, useMemo, useCallback, useEffect, CSSProperties } from 'react'
import { Editor, Transforms, createEditor, Node, NodeEntry, Range, Text, Path, Element, Point } from 'slate'
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
import { CardFragment } from '../../apollo/query.graphql'
import ArrowUpIcon from '../../assets/svg/arrow-up.svg'
import { decorationTokenizer, tokenizeBulletString } from '../bullet/parser'
import { Bullet, BulletDraft, RootBulletDraft, toInlinePoll, toInlineShotString } from '../bullet/types'
import BulletPanel from '../bullet-panel/bullet-panel'
import BulletSvg from '../bullet-svg/bullet-svg'
import BulletEmojiButtonGroup from '../emoji-up-down/bullet-emoji-button-group'
// import PollPage from '../poll/poll-page'
// import AuthorPollPage from '../poll/author-poll-page'
// import CreatePollForm from '../poll-form/create-poll-form'
// import Popover from '../popover/popover'
import { Doc } from '../workspace/doc'
import classes from './editor.module.scss'
import { LcElement, LiElement, UlElement } from './slate-custom-types'
import { isLiArray, isUl, lcPath, onKeyDown as withListOnKeyDown, ulPath, withList } from './with-list'
import { isInlineElement, parseLcAndReplace, withParse } from './with-parse'
import BulletPointEmojis from '../emoji-up-down/bullet-point-emojis'
import { Doc } from '../workspace/doc'
import Modal from '../modal/modal'

// import { Context } from '../../pages/card/[symbol]'
// import { BulletNode } from '../bullet/node'
// import UpdateShotForm from '../shot-form/update-shot-form'
// import MirrorPopover from '../../pages/card/[selfSymbol]/modal/[m]'

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

const decorate = ([node, path]: NodeEntry) => {
  // const focused = useFocused() // 整個editor是否focus
  // const selected = useSelected()

  const ranges: CustomRange[] = []
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

  function getLength(token: string | Token): number {
    if (typeof token === 'string') {
      return token.length
    } else if (typeof token.content === 'string') {
      return token.content.length
    } else if (Array.isArray(token.content)) {
      return token.content.reduce((l, t) => l + getLength(t), 0)
    } else {
      return 0
    }
  }
  // if (selected) {
  if (!Text.isText(node)) {
    return ranges
  }
  // const tokens = tokenize(Node.string(node), LINE_VALUE_GRAMMAR)
  const tokens = decorationTokenizer(Node.string(node))
  let start = 0

  for (const token of tokens) {
    const length = getLength(token)
    const end = start + length

    if (typeof token !== 'string') {
      if (token.type === 'topic' || token.type === 'mirror-topic') {
        let tokenOffset = 0
        if (Array.isArray(token.content)) {
          for (const content of token.content.entries()) {
            if (typeof content[1] === 'string') {
              ranges.push({
                leafType: token.type,
                anchor: { path, offset: tokenOffset },
                focus: { path, offset: tokenOffset + content[1].length },
              })
            } else if (typeof content[1] !== 'string' && content[1].type === 'punctuation') {
              ranges.push({
                leafType: 'punctuation',
                anchor: { path, offset: tokenOffset },
                focus: { path, offset: tokenOffset + content[1].length },
              })
            }
            tokenOffset = tokenOffset + content[1].length
          }
        }
        // ranges.push({
        //   leafType: 'topic-bracket',
        //   anchor: { path, offset: start },
        //   focus: { path, offset: start + 2 },
        // })
        // ranges.push({
        //   leafType: 'topic-bracket',
        //   anchor: { path, offset: end - 2 },
        //   focus: { path, offset: end },
        // })
      } else {
        // console.log(token)
        ranges.push({
          // [token.type]: true,
          leafType: token.type,
          anchor: { path, offset: start },
          focus: { path, offset: end },
        })
      }
    }
    start = end
  }
  // }

  return ranges
}

const Leaf = (props: RenderLeafProps): JSX.Element => {
  const { attributes, leaf, children } = props

  const readonly = useReadOnly()
  const selected = useSelected()
  // const [isPressShift, setIsPressShift] = useState(false)
  // console.log(isPressShift)
  let style: React.CSSProperties = {}
  let className = ''

  // if (leaf.placeholder) {
  //   return (
  //     <span style={{ minWidth: '135px', display: 'inline-block', position: 'relative' }}>
  //       <span {...attributes}>
  //         {/* <DefaultLeaf {...props} /> */}
  //         {children}
  //       </span>
  //       <span style={{ opacity: 0.3, position: 'absolute', top: 0 }} contentEditable={false}>
  //         Type / to open menu
  //       </span>
  //     </span>
  //   )
  // }

  /* grammer 參考 */
  // 'mirror-ticker': { pattern: reMirrorTicker },
  // 'mirror-topic': { pattern: reMirrorTopic },
  // ticker: { pattern: /\$[A-Z-=]+/ },
  // topic: { pattern: /\[\[[^\]\n]+\]\]/u },
  // url: {
  //   pattern: /(?<=\s|^)@(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})(?=\s|$)/,
  // },
  // user: { pattern: /\B@[\p{L}\d_]+\b/u },
  // poll: { pattern: rePoll },
  // 'new-poll': { pattern: reNewPoll },
  // filtertag: { pattern: /(?<=\s|^)#[a-zA-Z0-9()]+(?=\s|$)/ },
  // console.log(leaf.type, children)
  // console.log(leaf)
  // if (readonly || !selected) {
  //   switch (leaf.type) {
  //     case 'mirror-ticker':
  //     case 'mirror-topic':
  //     case 'topic':
  //     case 'ticker': {
  //       className = classes.mirrorLeaf
  //       // style = { color: '#5395f0' }
  //       break
  //     }
  //     case 'mTopic-bracket':
  //     case 'topic-bracket': {
  //       style = { color: '#b5b5b3' }
  //       break
  //     }
  //     case 'author':
  //     case 'url':
  //     case 'filtertag': {
  //       style = { color: '#0cb26e' }
  //       break
  //     }
  //     // case 'poll':
  //     // case 'new-poll': {
  //     //   style = { color: '#329ead' }
  //     //   break
  //     // }
  //     // case 'shot':
  //     // case 'new-shot': {
  //     //   style = { color: 'rgb(215 159 29)' }
  //     //   break
  //     // }
  //     // case 'filtertag': {
  //     //   className = classes.filtertagLeaf
  //     //   style = { color: '#6a53fe' }
  //     //   break
  //     // }
  //     // case 'url': {
  //     //   style = { color: '#ff619b' }
  //     //   break
  //     // }
  //     // default: {
  //     //   style = { color: '#3d434a' }
  //     // }
  //   }
  // } else {
  if (selected) {
    switch (leaf.leafType) {
      case 'mirror-ticker':
      case 'mirror-topic': {
        className = 'text-blue-500 '
        break
      }
      case 'punctuation': {
        className = 'text-blue-500'
        // style = { color: '#5395f0' }
        break
      }
      case 'author': {
        className = 'text-green-500'
        break
      }
      case 'poll':
      case 'new-poll': {
        className = 'text-cyan-500'
        break
      }
      case 'shot':
      case 'new-shot': {
        className = 'text-yellow-500'
        break
      }
      case 'ticker':
      case 'topic-bracket':
      case 'topic': {
        className = 'text-pink-500'

        // style = { color: '#ff619b', fontWeight: 'bold',cursor:'pointer'}
        break
      }
      case 'filtertag': {
        className = 'text-purple-500'

        break
      }
      case 'url': {
        className = 'text-sky-500'
        break
      }
      default: {
        className = 'text-gray-600'
      }
    }
  } else {
    switch (leaf.leafType) {
      case 'mirror-ticker':
      case 'mirror-topic':
      case 'topic':
      case 'ticker': {
        className = 'text-blue-500'
        // style = { color: '#5395f0' }
        break
      }

      case 'punctuation': {
        className = 'text-gray-400'
        break
      }

      case 'author':
      case 'url': {
        className = 'text-green-500'
        break
      }
      case 'filtertag': {
        className = 'text-purple-500'
      }
    }
  }

  // }

  return (
    // {/* <span {...attributes}>{children}</span> */}
    <span
      {...attributes}
      className={className}
      style={style}
      // onFocus={e => {
      //   e.preventDefault
      // }}

      // ref={e => {
      //   if (
      //     leaf.type === 'ticker' ||
      //     leaf.type === 'topic' ||
      //     leaf.type === 'mirror-ticker' ||
      //     leaf.type === 'mirror-topic' ||
      //     leaf.type === 'filtertag' ||
      //     leaf.type === 'punctuation'
      //   ) {
      //     if (e) {
      //       e.onselectstart = () => false
      //     }
      //   }
      // }}
    >
      {/* {leaf.text} */}
      {children}
    </span>
  )
}

// const AddEmojiButotn = (props: {
//   bulletId: number
//   emojiText: EmojiText
//   // curEmojis: Hashtag[]
//   onCreated: (emoji: Hashtag, myEmojiLike: HashtagLike) => void
// }): JSX.Element => {
//   const { bulletId, emojiText, onCreated } = props
//   const [createEmoji] = useCreateEmojiMutation({
//     variables: { bulletId, emojiText },
//     onCompleted(data) {
//       const { emoji, like } = data.createEmoji
//       onCreated(emoji, like)
//     },
//   })
//   return (
//     <button
//       onClick={() => {
//         createEmoji()
//       }}
//     >
//       {emojiText}
//     </button>
//   )
// }

const InlineFiltertag = ({
  attributes,
  children,
  element,
}: RenderElementProps & { element: InlineFiltertagElement }): JSX.Element => {
  return <span {...attributes}>{children}</span>
}

const InlineSymbol = ({
  attributes,
  children,
  element,
}: RenderElementProps & {
  element: InlineSymbolElement
}): JSX.Element => {
  const [showPopover, setShowPopover] = useState(false)
  const router = useRouter()
  // const selected = useSelected()
  // console.log(element)
  return (
    <span {...attributes} className="text-blue-500 hover:cursor-pointer hover:shadow-underline hover:shadow-blue-500">
      {/* <span contentEditable={false}> */}
      {/* <Link href={`/card/${encodeURI(element.symbol)}`}> */}
      {/* <a
          className="inline"
          onClick={e => {
            e.preventDefault()
            setShowPopover(true)
          }}
        >
          {children}
        </a> */}
      <button
        className="noStyle"
        onClick={e => {
          // e.preventDefault()
          // e.stopPropagation()
          // router.push(`/card/${encodeURIComponent(element.symbol)}`)
          // console.log('hi~')
          setShowPopover(true)
        }}
      >
        {children}
      </button>
      {/* </Link> */}
      {showPopover && (
        <span contentEditable={false}>
          {router.query.symbol !== element.symbol && router.query.m !== '::' + element.symbol ? (
            <Popup
              visible={showPopover}
              hideBoard={() => {
                setShowPopover(false)
              }}
              buttons={
                <>
                  <button
                    className="secondary"
                    onClick={e => {
                      // e.preventDefault()
                      // e.stopPropagation()
                      setShowPopover(false)
                      router.push(`/cardx/${encodeURI(element.symbol)}`)
                    }}
                  >
                    確定
                  </button>
                  <button
                    className="primary"
                    onClick={e => {
                      e.preventDefault()
                      e.stopPropagation()
                      setShowPopover(false)
                    }}
                  >
                    取消
                  </button>
                </>
              }
              mask={false}
            >
              尚有未儲存內容，確定要離開本頁嗎？
            </Popup>
          ) : (
            <Popup
              visible={showPopover}
              hideBoard={() => {
                setShowPopover(false)
              }}
              buttons={
                <button
                  className="primary"
                  onClick={() => {
                    setShowPopover(false)
                  }}
                >
                  確定
                </button>
              }
              mask={false}
            >
              你就在這頁了！
            </Popup>
          )}
        </span>
      )}
      {/* </span> */}
    </span>
  )
}

const InlineMirror = ({
  attributes,
  children,
  element,
  sourceCardId,
}: RenderElementProps & { element: InlineMirrorElement; sourceCardId?: string }): JSX.Element => {
  // const [showPopover, setShowPopover] = useState(false)
  // const editor = useSlateStatic()
  // const href = locationToUrl({
  //   ...location,
  //   mirrorSymbol: element.mirrorSymbol,
  //   openedLiPath: [],
  //   // author: element.author,
  // })

  // const authorName = selfCard.link?.authorName
  // useEffect(() => {
  //   // 若有 sourceUrl 且未設有 author 的情況，設一個預設 author
  //   if (authorName && element.author === undefined) {
  //     const path = ReactEditor.findPath(editor, element)
  //     Transforms.setNodes<InlineMirrorElement>(editor, { author: authorName }, { at: path })
  //     Transforms.insertNodes(editor, { text: ` @${authorName.split(':', 1)}` }, { at: Path.next(path) })
  //   }
  // }, [authorName, element])

  return (
    <span {...attributes} className={classes.mirrorContainer}>
      {/* <span contentEditable={false}> */}
      <Link href={DocPathService.toURL(element.mirrorSymbol.substr(2), sourceCardId)}>
        <a className="ui">{children}</a>
      </Link>
      {/* </span> */}
      {/* <a className="ui">{element.str}</a> */}
    </span>
  )
}

const InlinePoll = (props: RenderElementProps & { element: InlinePollElement }): JSX.Element => {
  const { attributes, children, element } = props
  const selected = useSelected()
  // const context = useContext(Context)
  const editor = useSlateStatic()
  const { selection } = editor
  const path = ReactEditor.findPath(editor, element)
  const readonly = useReadOnly()
  const [showPopover, setShowPopover] = useState(false)
  const [clickedIdx, setClickedIdx] = useState<number | undefined>()
  const [pollId, setPollId] = useState(element.id)
  // const [pollData, setPollData] = useState<Poll | undefined>()
  // console.log(clickedIdx)
  function onCreated(poll: PollFragment) {
    // const editor = useSlateStatic()
    // const path = ReactEditor.findPath(editor, element)
    const inlinePoll = toInlinePoll({ id: poll.id, choices: poll.choices })
    Transforms.setNodes<InlinePollElement>(editor, inlinePoll, { at: path })
    Transforms.insertText(editor, inlinePoll.str, { at: path })
  }

  const [queryPoll, { data: pollData, error, loading }] = usePollLazyQuery()

  const parent = Node.parent(editor, path) as LcElement

  const handleCreatePoll = () => {
    // if (parent.id) {
    //   createPoll({ variables: { bulletId: parent.id, data: { choices: element.choices } } })
    // }
  }

  useEffect(() => {
    // if (showPopover && !pollId) {
    //   handleCreatePoll()
    // }
    if (!showPopover && !element.id && pollId) {
      // const queryPollData = async () => {
      //   queryPoll({ variables: { id: pollId } })
      // }
      // queryPollData()
      queryPoll({ variables: { id: pollId } })
      if (pollData?.poll) {
        onCreated(pollData.poll)
      }
import { parseLcAndReplace, withInline } from './with-inline'
import InlineSymbol from '../inline/inline-symbol'
import InlineMirror from '../inline/inline-mirror'
import InlineFiltertag from '../inline/inline-filtertag'
import InlinePoll from '../inline/inline-poll'
import InlineRate from '../inline/inline-rate'
import { decorate } from './decorate'

const Leaf = ({ attributes, leaf, children }: RenderLeafProps): JSX.Element => {
  let style: React.CSSProperties = {}
  let className = ''

  switch (leaf.tokenType) {
    case 'mirror-ticker':
    case 'mirror-topic':
    case 'mTopic-bracket': {
      // className = classes.mirrorLeaf
      style = { color: '#5395f0' }
      break
    }
    case 'author': {
      style = { color: '#0cb26e' }
      break
    }
    case 'poll':
    case 'new-poll': {
      style = { color: '#329ead' }
      break
    }
    case 'shot':
    case 'new-shot': {
      style = { color: 'rgb(215 159 29)' }
      break
    }
    case 'topic-bracket-head':
    case 'topic-bracket-tail':
      style = { color: 'blue' }
      break
    case 'ticker':
    case 'topic': {
      // className = classes.topicLeaf
      // style = { color: '#ff619b', fontWeight: 'bold',cursor:'pointer'}
      style = { color: 'rgb(215 159 29)' }
      break
    }
    case 'filtertag': {
      className = classes.filtertagLeaf
      style = { color: '#6a53fe' }
      break
    }
    case 'url': {
      style = { color: '#ff619b' }
      break
    }
    default: {
      style = { color: '#3d434a' }
    }
  }
  return (
    <span {...attributes} className={className} style={style}>
      {children}
    </span>
  )
}

const Lc = ({
  attributes,
  children,
  element,
}: RenderElementProps & {
  element: LcElement
}): JSX.Element => {
  const editor = useSlateStatic()
  const readonly = useReadOnly()
  const focused = useFocused() // 整個editor是否focus
  const selected = useSelected() // 這個element是否被select（等同指標在這個element裡）

  // const [author, authorSwitcher] = useAuthorSwitcher({ authorName })
  // const [placeholder, setPlaceholder] = useState<string | undefined>()
  // useEffect(() => {
  //   setPlaceholder(element.placeholder)
  // }, [element])
  // const author = location.author

  useEffect(() => {
    if (!focused || !selected || readonly) {
      // cursor 離開 lc-head，將 text 轉 tokens、驗證 tokens、轉成 inline-elements
      const path = ReactEditor.findPath(editor, element)
      parseLcAndReplace({ editor, lcEntry: [element, path] })
      return
    }
    if (selected) {
      // cursor 進入 lc-head，將 inlines 轉回 text，避免直接操作 inlines
      const path = ReactEditor.findPath(editor, element)
      Transforms.unwrapNodes(editor, {
        at: path,
        match: (n, p) => Element.isElement(n) && Path.isChild(p, path),
      })
    }
  }, [selected, readonly])

  // const mirrors = element.children.filter((e): e is InlineMirrorElement => e.type === 'mirror')
  // console.log(element.bulletCopy?.id)

  return (
    <div {...attributes}>
      <div>
        {children}
        {element.bulletCopy?.id && <BulletEmojiButtonGroup bulletId={element.bulletCopy.id} />}
        {/* // <span contentEditable={false}>
          //   {emojiData.bulletEmojis?.map((e, i) => {
          //     return <BulletPointEmojis key={i} bulletId={e.id} bulletEmojis={e} />
          //   })}
          // </span> */}
      </div>
      {/* {sourceCardId && ( 
       <span contentEditable={false}>
        {author === element.author && element.author}
          {sourceUrl === element.sourceUrl && sourceUrl} 
        <FilterMirror mirrors={mirrors} />
      </span> 
       )} */}
    </div>
  )
}

const Li = ({ attributes, children, element }: RenderElementProps & { element: LiElement }): JSX.Element => {
  const editor = useSlateStatic()
  // const [hasUl, setHasUl] = useState(false)
  const [ulFolded, setUlFolded] = useState<true | undefined>()
  const [showPanel, setShowPanel] = useState(false)
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

  return (
    <div
      {...attributes}
      className="group relative break-all flex w-full"
      // onMouseOver={event => {
      //   event.stopPropagation()
      //   event.preventDefault()
      //   // setShowPanelIcon(true)
      // }}
      // onMouseOut={event => {
      //   event.stopPropagation()
      //   event.preventDefault()
      //   // setShowPanelIcon(false)
      // }}
    >
      {/* <div contentEditable={false}></div> */}
      <div className="inline-flex items-center h-8 " contentEditable={false}>
        <span
          className={`flex items-center justify-center flex-shrink-0 flex-grow-0 opacity-0 ${
            hasUl ? 'opacity-100' : 'opacity-0 select-none'
          }`}
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
            className={` w-2 h-2 fill-current text-gray-500 `}
            style={{ transform: ulFolded === undefined ? 'rotate(180deg)' : 'rotate(90deg)' }}
          />
        </span>
        {/* <BulletPanel><span className={classes.oauthorName}> @{authorName}</span></BulletPanel> */}

        {/* <Link href={'/href'}>
          <a
            onMouseOver={e => {
              e.stopPropagation()
              // e.preventDefault()
              // if (e.currentTarget.contains(containerRef.current)) {
              setShowPanel(true)
              // }
              // console.log('hover')
            }}
            onMouseLeave={e => {
              e.stopPropagation()
              // e.preventDefault()

              setShowPanel(true)
              // if (!e.currentTarget.contains(containerRef.current)) {
              //  setTimeout(
              //   () => {
              //   },
              //   100,
              //   false,
              // )
              // }
              // console.log('mouseout')
            }}
          >
            <BulletSvg />
          </a>
        </Link> */}
        <span
          className={`relative flex items-center justify-center w-5 h-full ${
            lc.bulletCopy?.id ? 'cursor-pointer' : 'cursor-default'
          }`}
          onMouseEnter={() => setShowPanel(true)}
          onMouseLeave={() => setShowPanel(false)}
        >
          <BulletSvg />
          {showPanel && lc.bulletCopy?.id && (
            <BulletPanel
              // className={classes.bulletPanel}
              // tooltipClassName={classes.bulletPanelTooltip}
              bulletId={lc.bulletCopy.id}
              visible={showPanel}
            />
          )}
        </span>

        {/* {lc.id && <AddEmojiButotn bulletId={lc.id} emojiText={'UP'} onCreated={onEmojiCreated} />} */}
      </div>

      <div className="w-full leading-loose">{children}</div>
    </div>
  )
}

const Ul = ({ attributes, children, element }: RenderElementProps & { element: UlElement }): JSX.Element => {
  const style: CSSProperties = element.folded ? { display: 'none' } : {} // { display: 'none', visibility: 'hidden', height: 0 }
  return (
    <div {...attributes} className="" style={style}>
      {children}
    </div>
  )
}

const CustomElement = ({
  attributes,
  children,
  element,
  card,
}: RenderElementProps & { card: CardFragment | null }): JSX.Element => {
  switch (element.type) {
    case 'symbol':
      return <InlineSymbol {...{ attributes, children, element }} />
    case 'mirror':
      return <InlineMirror {...{ attributes, children, element, sourceCardId: card?.id }} />
    case 'filtertag':
      return <InlineFiltertag {...{ attributes, children, element }} />
    case 'poll':
      return <InlinePoll {...{ attributes, children, element }} />
    case 'rate':
      return <InlineRate {...{ attributes, children, element }} />
    case 'lc':
      return <Lc {...{ attributes, children, element, curCardId: card?.id }} />
    case 'li':
      return <Li {...{ attributes, children, element }} />
    case 'ul':
      return <Ul {...{ attributes, children, element }} />
    default:
      return <span {...attributes}>{children}</span>
  }
}

export const BulletEditor = ({ doc }: { doc: Doc }): JSX.Element => {
  const editor = useMemo(() => withInline(withList(withHistory(withReact(createEditor())))), [])
  const renderElement = useCallback(
    (props: RenderElementProps) => <CustomElement {...{ ...props, card: doc.cardCopy }} />,
    [doc],
  )
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const decorateMemo = useCallback(([node, path]) => decorate([node, path]), [])
  const [value, setValue] = useState<LiElement[]>(doc.editorValue ?? [])

  useEffect(() => {
    // 當 doc 變動時，重設 editor value @see https://github.com/ianstormtaylor/slate/issues/713
    Transforms.deselect(editor)
    setValue(doc.editorValue ?? [])
  }, [doc])

  // const [searchPanel, onValueChange] = useSearch(editor)
  // useEffect(() => {
  //   if (searchAllResult.data) {
  //     setSuggestions(searchAllResult.data.searchAll)
  //   } else {
  //     setSuggestions(null)
  //   }
  // }, [searchAllResult])

  return (
    <div className="-ml-7 text-gray-800">
      <Slate
        editor={editor}
        value={value}
        onChange={value => {
          if (isLiArray(value)) {
            setValue(value)
            doc.editorValue = value // point to the new value

            // TODO: 每字都執行一遍儲存會有效能問題
            // if (onValueChange) {
            //   onValueChange(value)
            // }
          } else {
            throw 'value needs to be li array'
          }
        }}
      >
        <Editable
          autoCapitalize="false"
          autoCorrect="false"
          autoFocus={true}
          decorate={decorateMemo}
          // readOnly={readOnly}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          spellCheck={false}
          onKeyDown={event => {
            withListOnKeyDown(event, editor)
            // setIsPressShift(event.key === 'Shift')
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
