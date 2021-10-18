import React, { useState, useMemo, useCallback, useEffect, CSSProperties, useContext } from 'react'
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
  InlineFiltertagElement,
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
  PollDocument,
  PollQuery,
  useCreateEmojiMutation,
  useCreatePollMutation,
  useCreateVoteMutation,
  useMyHashtagLikeQuery,
  useMyVotesLazyQuery,
  usePollLazyQuery,
  usePollQuery,
  useUpsertEmojiLikeMutation,
} from '../../apollo/query.graphql'
import ArrowUpIcon from '../../assets/svg/arrow-up.svg'
import BulletPanel from '../bullet-panel/bullet-panel'
import MyHashtagGroup from '../upDown/poll-group'
import { spawn } from 'child_process'
import { isLiArray, isUl, lcPath, onKeyDown as withListOnKeyDown, ulPath, withList } from './with-list'
import { NavLocation, locationToUrl } from './with-location'
import { withOperation } from './with-operation'
import { parseLcAndReplace, withParse } from './with-parse'
import { Bullet, BulletDraft, RootBulletDraft, toInlinePoll } from '../../lib/bullet/types'
import CreatePollForm from '../board-form/create-poll-form'
import HashtagTextToIcon from '../upDown/hashtag-text-to-icon'
import PollPage from '../board/poll-page'
// import { Context } from '../../pages/card/[symbol]'
import AuthorPollPage from '../board/author-poll-page'
import router, { useRouter } from 'next/router'
import Popup from '../popup/popup'
import PollGroup from '../upDown/poll-group'
import { getLocalOrQueryRoot } from './use-local-value'
import { useApolloClient } from '@apollo/client'
import { Serializer } from './serializer'
import { BulletNode } from '../../lib/bullet/node'
import { Token, tokenize } from 'prismjs'
import { tokenizeBulletString } from '../../lib/bullet/text'
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
  const tokens = tokenizeBulletString(Node.string(node))
  let start = 0

  for (const token of tokens) {
    const length = getLength(token)
    const end = start + length

    if (typeof token !== 'string') {
      ranges.push({
        // [token.type]: true,
        type: token.type,
        anchor: { path, offset: start },
        focus: { path, offset: end },
      })
    }
    start = end
  }
  // }

  return ranges
}

const Leaf = (props: RenderLeafProps): JSX.Element => {
  const { attributes, children, leaf } = props
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

  switch (leaf.type) {
    case 'ticker':
    case 'topic': {
      className = classes.topicLeaf

      // style = { color: '#ff619b', fontWeight: 'bold',cursor:'pointer'}
      break
    }
    case 'mirror-ticker':
    case 'mirror-topic': {
      className = classes.mirrorLeaf
      // style = { color: '#5395f0' }
      break
    }
    case 'user': {
      style = { color: '#0cb26e' }
      break
    }
    case 'poll':
    case 'new-poll': {
      style = { color: '#329ead' }
      break
    }
    case 'filtertag': {
      className = classes.filtertagLeaf
      style = { color: '#6a53fe' }
      break
    }
    default: {
      style = { color: '#3d434a' }
    }
  }

  return (
    // {/* <span {...attributes}>{children}</span> */}
    <span
      {...attributes}
      className={className}
      style={style}
      // onFocus={e => {
      //   e.preventDefault
      // }}

      ref={e => {
        if (
          leaf.type === 'ticker' ||
          leaf.type === 'topic' ||
          leaf.type === 'mirror-ticker' ||
          leaf.type === 'mirror-topic' ||
          leaf.type === 'filtertag'
        ) {
          e && (e.onselectstart = ev => false)
        }
      }}
    >
      {/* {leaf.text} */}
      {children}
    </span>
  )
}

const EmojiLike = (props: { hashtag: Hashtag }): JSX.Element | null => {
  const { hashtag } = props
  const { data, loading, error } = useMyHashtagLikeQuery({
    variables: { hashtagId: hashtag.id.toString() },
  })

  // console.log(data?.myHashtagLike, hashtag)

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
    <button
      className={`inline mR ${data.myHashtagLike?.choice === 'UP' ? classes.clicked : classes.hashtag}`}
      onClick={() => {
        handleClickLike('UP')
      }}
    >
      {/* {data.myHashtagLike?.choice && hashtag.text} */}
      {/* {hashtag.text} */}
      <HashtagTextToIcon hashtag={hashtag} />

      <span style={{ marginLeft: '3px' }}>{hashtag.count.nUps}</span>
    </button>
  )
}

/**
 * @returns 若 emoji 目前沒有人點贊，返回 null
 */
export const EmojiButotn = ({ emoji }: { emoji: Hashtag }): JSX.Element | null => {
  // console.log(emoji)
  // if (emoji.count.nUps === 0) {
  //   return null
  // }

  return (
    // <span>
    <EmojiLike hashtag={emoji} />
    // {/* </span> */}
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
  return (
    <span {...attributes}>
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
      <span
        className="inline"
        onClick={e => {
          // e.preventDefault()
          // e.stopPropagation()
          // router.push(`/card/${encodeURIComponent(element.symbol)}`)

          setShowPopover(true)
        }}
      >
        {children}
      </span>
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
                      router.push(`/card/${encodeURI(element.symbol)}`)
                    }}
                  >
                    確定
                  </button>
                  <button
                    className="primary"
                    onClick={e => {
                      // e.preventDefault()
                      // e.stopPropagation()
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
  location,
  selfCard,
}: RenderElementProps & { element: InlineMirrorElement; location: NavLocation; selfCard: Card }): JSX.Element => {
  const [showPopover, setShowPopover] = useState(false)
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
      Transforms.insertNodes(editor, { text: ` @${authorName.split(':', 1)}` }, { at: Path.next(path) })
    }
  }, [authorName, element])

  return (
    <span {...attributes}>
      {/* <span contentEditable={false}> */}
      <Link
        href={href}
        // as={`/card/${encodeURIComponent(location.selfSymbol)}/${encodeURIComponent(element.mirrorSymbol)}`}
      >
        <a className="ui">{children}</a>
      </Link>
      {/* </span> */}
    </span>
  )
}

// const PollForm = ({ id }: { id: string }): JSX.Element => {
//   const { data, loading, error } = usePollQuery({ variables: { id } })
//   const [createVote, createVoteResult] = useCreateVoteMutation()
//   if (loading || createVoteResult.loading) {
//     return <div>loading...</div>
//   }
//   if (error || data === undefined || createVoteResult.error) {
//     return <div>error</div>
//   }
//   if (createVoteResult.data) {
//     const vote = createVoteResult.data.createVote
//     const voted = data.poll.choices[vote.choiceIdx]
//     return (
//       <div>
//         {data.poll.choices.join(' ')}[{voted}]
//       </div>
//     )
//   }
//   return (
//     <div>
//       {data.poll.choices.map((e, i) => (
//         <button
//           key={i}
//           onClick={() => {
//             createVote({
//               variables: {
//                 pollId: id,
//                 data: { choiceIdx: i },
//               },
//             })
//           }}
//         >
//           {e}
//         </button>
//       ))}
//     </div>
//   )
// }

// const NewPollForm = ({ choices }: { choices?: string[]; onCreated: (poll: Poll) => void }): JSX.Element => {
//   // const queryPoll = usePollQuery({ variables: { id } })
//   return <div></div>
// }

const InlinePoll = (props: RenderElementProps & { element: InlinePollElement; location: NavLocation }): JSX.Element => {
  const { attributes, children, element, location } = props
  const selected = useSelected()
  // const context = useContext(Context)
  const editor = useSlateStatic()
  const path = ReactEditor.findPath(editor, element)
  const readonly = useReadOnly()
  const [showPopover, setShowPopover] = useState(false)
  const [clickedIdx, setClickedIdx] = useState<number | undefined>()
  const [pollId, setPollId] = useState(element.id)
  // const [pollData, setPollData] = useState<Poll | undefined>()
  // console.log(clickedIdx)
  function onCreated(poll: Poll) {
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
      const queryPollData = async () => {
        await queryPoll({ variables: { id: pollId } })
      }
      queryPollData()
      pollData && onCreated(pollData.poll)
    }
  }, [showPopover, pollData, pollId])

  const handleHideBoard = () => {
    setClickedIdx(undefined)
    setShowPopover(false)
  }
  // const queryPoll = usePollQuery({ variables: { id: element.id.toString() } })

  // if (readonly) {
  //   if (element.type === 'poll') {
  //     return (
  //       <span {...attributes}>
  //         <MyHashtagGroup choices={element.choices} pollId={element.id?.toString() ?? ''} />
  //       </span>
  //     )
  //   }
  //   return (
  //     <button {...attributes} className="inline mR">
  //       {children}
  //     </button>
  //   )
  // }
  // if (element.type === 'poll') {
  return (
    <span {...attributes}>
      <span style={selected ? undefined : { display: 'none' }}>{children}</span>
      {selected || (
        <span contentEditable={false}>
          <PollGroup
            bulletId={parent.id}
            choices={element.choices}
            pollId={element.id?.toString()}
            handleShowPopover={b => {
              setShowPopover(b)
            }}
            onCreatePoll={handleCreatePoll}
            handleClickedIdx={i => {
              setClickedIdx(i)
            }}
            handlePollId={(id: string) => {
              setPollId(id)
            }}
            handlePollData={(data: Poll) => {
              // setPollData(data)
            }}
            inline
          />
          {/* parent.id = bullet id */}
          {showPopover && parent.id && (
            <Popover visible={showPopover} hideBoard={handleHideBoard}>
              {pollId ? <PollPage pollId={pollId} clickedChoiceIdx={clickedIdx} /> : <span>loading</span>}
            </Popover>
          )}

          {/* {showPopover && authorContext.author && (
          <Popover visible={showPopover} hideBoard={handleHideBoard}>
            
            {pollId ? (
              <AuthorPollPage author={authorContext.author} pollId={pollId} clickedChoiceIdx={clickedIdx} />
            ) : (
              <span>loading</span>
            )}
          </Popover>
        )} */}
          {/* {element.id ? (
          <MyHashtagGroup choices={element.choices} pollId={element.id.toString()} inline />
        ) : (
          <>
            <button
              className="inline mR"
              onClick={() => {
                handleCreatePoll()
                setShowPopover(true)
              }}
            >
              創建{element.choices}
            </button>

            <Popover
              visible={showPopover}
              hideBoard={() => {
                setShowPopover(false)
              }}
            >
              <CreatePollForm bulletId={element.id ?? ''} choices={element.choices}></CreatePollForm>
            </Popover>
          </>
        )} */}
        </span>
      )}
    </span>
  )
  // }
  // return (
  //   <button {...attributes} className="inline">
  //     {children}
  //   </button>
  // )
  // return <span {...attributes}>{children}</span>

  // const [isOpen, setIsOpen] = useState(false)
  // const [queryMyVotes, { data, loading, error }] = useMyVotesLazyQuery() // 若已投票可展現投票結果

  // useEffect(() => {
  //   // console.log('inline poll')
  //   if (element.id) {
  //     queryMyVotes({ variables: { pollId: element.id } })
  //   }
  // }, [element])

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

  // function closeModal() {
  //   setIsOpen(false)
  // }

  // return (
  //   <span {...attributes}>
  //     <span style={{ display: 'none' }}>{children}</span>

  //     <span contentEditable={false}>
  //       <button
  //         onClick={event => {
  //           event.preventDefault()
  //           setIsOpen(true)
  //         }}
  //       >
  //         {element.choices.join(' ')}
  //         {data?.myVotes && data.myVotes.length > 0 && `[${data.myVotes[data.myVotes.length - 1].choiceIdx}]`}
  //       </button>

  //       <Modal
  //         ariaHideApp={false}
  //         isOpen={isOpen}
  //         // onAfterOpen={afterOpenModal}
  //         onRequestClose={closeModal}
  //         contentLabel="Example Modal"
  //       >
  //         <button onClick={closeModal}>close</button>
  //         {element.id ? <PollForm id={element.id} /> : <NewPollForm choices={element.choices} onCreated={onCreated} />}
  //       </Modal>
  //     </span>
  //   </span>
  // )
}

const BulletComponent = ({ bullet }: { bullet: BulletDraft }): JSX.Element => {
  return (
    <>
      <li>{bullet.head}</li>
      {bullet.children.length > 0 && (
        <ul>
          {bullet.children.map((e, i) => (
            <BulletComponent key={i} bullet={e} />
          ))}
        </ul>
      )}
    </>
  )
}

const FilterMirror = ({
  mirrors,
  sourceUrl,
}: {
  mirrors: InlineMirrorElement[]
  sourceUrl: string
}): JSX.Element | null => {
  const [filteredBullet, setFilteredBullet] = useState<BulletDraft | null | undefined>()
  const client = useApolloClient()

  useEffect(() => {
    const asyncRun = async () => {
      if (mirrors.length === 1) {
        const mirror = mirrors[0]
        const { rootLi } = await getLocalOrQueryRoot({ client, mirrorSymbol: mirror.mirrorSymbol })
        const rootBulletDraft = Serializer.toRootBulletDraft(rootLi)
        const filtered = BulletNode.filter({
          node: rootBulletDraft,
          matcher: e => e.sourceUrl === sourceUrl,
        })
        setFilteredBullet(filtered)
      }
    }
    asyncRun().catch(err => {
      console.error(err)
    })
  }, [])

  if (mirrors.length === 0) {
    return null
  }
  if (mirrors.length > 1) {
    return <div>一行只允許一個 mirror</div>
  }
  if (filteredBullet === undefined) {
    return null
  }
  if (filteredBullet === null) {
    return <div>Click to edit</div>
  }
  return (
    <ul style={{ background: '#f3f4f9', borderRadius: '6px' }}>
      {/* 忽略 root，從 root children 開始 render */}
      {filteredBullet.children.map((e, i) => (
        <BulletComponent key={i} bullet={e} />
      ))}
    </ul>
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
    if ((focused && !selected) || readonly) {
      // cursor 離開 lc-head，將 text 轉 tokens、驗證 tokens、轉成 inline-elements
      const path = ReactEditor.findPath(editor, element)

      // parseLcAndReplace({ editor, lcEntry: [element, path] })
      // return
    }
    if (selected) {
      // cursor 進入 lc-head，將 inlines 轉回 text，避免直接操作 inlines
      const path = ReactEditor.findPath(editor, element)
      // Transforms.unwrapNodes(editor, {
      //   at: path,
      //   match: (n, p) => Element.isElement(n) && Path.isChild(p, path),
      // })
      // console.log('unwrapNodes', path)
    }
  }, [selected, readonly])

  const mirrors = element.children.filter((e): e is InlineMirrorElement => e.type === 'mirror')

  return (
    <div {...attributes}>
      <p className={classes.lcText}>
        {children}
        {element.emojis && (
          <span contentEditable={false}>
            {element.emojis?.map((e, i) => (
              <EmojiButotn key={i} emoji={e} />
            ))}
          </span>
        )}
      </p>
      {mirrors.length > 0 && sourceUrl && (
        <span contentEditable={false}>
          {/* {author === element.author && element.author}
          {sourceUrl === element.sourceUrl && sourceUrl} */}
          <FilterMirror mirrors={mirrors} sourceUrl={sourceUrl} />
        </span>
      )}
    </div>
  )
}

const Li = ({
  attributes,
  children,
  element,
  location,
}: RenderElementProps & { element: LiElement; location: NavLocation }): JSX.Element => {
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
  // console.log(lc.emojis)

  return (
    <div
      {...attributes}
      className={classes.bulletLi}
      onMouseOver={event => {
        event.stopPropagation()
        event.preventDefault()
        setShowPanelIcon(true)
      }}
      onMouseOut={event => {
        event.stopPropagation()
        event.preventDefault()
        setShowPanelIcon(false)
      }}
    >
      {/* <div contentEditable={false}></div> */}
      <div className={classes.arrowBulletWrapper} contentEditable={false}>
        <BulletPanel
          bulletId={lc.id}
          emoji={lc.emojis}
          visible={showPanelIcon}
          sourceUrl={element.children[0].sourceUrl}
          authorName={element.children[0].author}
          onEmojiCreated={onEmojiCreated}
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
            </span>
            {/* <BulletPanel><span className={classes.oauthorName}> @{authorName}</span></BulletPanel> */}
          </>
        ) : (
          <span className={classes.arrowWrapper}>
            <ArrowUpIcon style={{ opacity: 0 }} />
          </span>
        )}

        <Link href={href}>
          <a>
            <BulletSvg />
          </a>
        </Link>

        {/* {lc.id && <AddEmojiButotn bulletId={lc.id} emojiText={'UP'} onCreated={onEmojiCreated} />} */}
      </div>

      <div style={{ width: '100%' }}>{children}</div>
    </div>
  )
}

const Ul = ({ attributes, children, element }: RenderElementProps & { element: UlElement }): JSX.Element => {
  const style: CSSProperties = element.folded ? { display: 'none' } : {} // { display: 'none', visibility: 'hidden', height: 0 }
  return (
    <div {...attributes} className={classes.bulletUl} style={style}>
      {children}
    </div>
  )
}

const CustomElement = ({
  attributes,
  children,
  element,
  location,
  selfCard,
}: RenderElementProps & { location: NavLocation; selfCard: Card }): JSX.Element => {
  const sourceUrl = selfCard.link?.url

  switch (element.type) {
    case 'symbol':
      return <InlineSymbol {...{ attributes, children, element }} />
    case 'mirror':
      return <InlineMirror {...{ attributes, children, element, location, selfCard }} />
    // case 'hashtag':
    //   return <InlineHashtag {...{ attributes, children, element, location }} />
    case 'filtertag':
      return <InlineFiltertag {...{ attributes, children, element, location }} />
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

export const BulletEditor = ({
  initialValue,
  location,
  selfCard,
  readOnly,
  onValueChange,
}: {
  initialValue: LiElement[]
  location: NavLocation
  selfCard: Card
  readOnly?: boolean
  onValueChange?: (value: LiElement[]) => void
}): JSX.Element => {
  // const context = useContext(Context)
  const editor = useMemo(() => withParse(withOperation(withList(withHistory(withReact(createEditor()))))), [])
  const renderElement = useCallback(
    (props: RenderElementProps) => <CustomElement {...{ ...props, location, selfCard }} />,
    [location, selfCard],
  )
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const renderDecorate = useCallback(([node, path]) => decorate([node, path]), [])

  const withListOnKeyDownMemo = useCallback((event: React.KeyboardEvent) => {
    withListOnKeyDown(event, editor)
    // console.log(editor.children)
  }, [])

  // const [searchPanel, onValueChange] = useSearch(editor)
  const [value, setValue] = useState<LiElement[]>(initialValue)

  useEffect(() => {
    // console.log('use effect deps initialValue')
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
    <div
      className={`${classes.bulletEditorContainer} `}

      // onFocus={e => {
      //   if (!e.currentTarget.classList.contains(classes.focused)) {
      //     e.currentTarget.classList.add(classes.focused)
      //   }
      //   // if (!context.login) {
      //   //   context.showLoginPopup(true)
      //   // }
      // }}
      // onBlur={e => {
      //   e.currentTarget.classList.remove(classes.focused)
      // }}
    >
      {/* <div>
        @{selfCard.link?.url ?? 'undefined'}; @{location.author ?? 'undefined'}
      </div> */}
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
          // style={{ padding: '10px 10px 10px 3.5em' }}
          // onSelect={e => {
          //   if (!(window as any).chrome) return
          //   if (editor.selection == null) return
          //   try {
          //     const domPoint = ReactEditor.toDOMPoint(editor, editor.selection.focus)
          //     const node = domPoint[0]
          //     if (node == null) return
          //     const element = node.parentElement
          //     if (element == null) return
          //     element.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          //   } catch (e) {
          //     /**
          //      * Empty catch. Do nothing if there is an error.
          //      */
          //   }
          // }}

          autoCorrect="false"
          autoFocus={false}
          decorate={renderDecorate}
          readOnly={readOnly}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={event => {
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
