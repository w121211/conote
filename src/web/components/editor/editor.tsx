import React, { useState, useMemo, useCallback, useEffect, CSSProperties } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Token } from 'prismjs'
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
import {
  BulletEmoji,
  BulletEmojiLike,
  Card,
  LikeChoice,
  MyBulletEmojiLikeDocument,
  MyBulletEmojiLikeQuery,
  MyBulletEmojiLikeQueryVariables,
  Poll,
  PollDocument,
  PollQuery,
  useCreateBulletEmojiMutation,
  useCreatePollMutation,
  useCreateVoteMutation,
  useMyBulletEmojiLikeQuery,
  useMyVotesLazyQuery,
  usePollLazyQuery,
  usePollQuery,
  useUpsertBulletEmojiLikeMutation,
  useBulletEmojisQuery,
  useShotLazyQuery,
  Shot,
  useCardQuery,
  useShotQuery,
} from '../../apollo/query.graphql'
import ArrowUpIcon from '../../assets/svg/arrow-up.svg'
import { tokenizeBulletString } from '../bullet/parser'
import { Bullet, BulletDraft, RootBulletDraft, toInlinePoll, toInlineShotString } from '../bullet/types'
import BulletPanel from '../bullet-panel/bullet-panel'
import BulletSvg from '../bullet-svg/bullet-svg'
import HashtagTextToIcon from '../emoji-up-down/emoji-text-to-icon'
import PollGroup from '../emoji-up-down/poll-group'
import PollPage from '../poll/poll-page'
import AuthorPollPage from '../poll/author-poll-page'
import CreatePollForm from '../poll-form/create-poll-form'
import Popover from '../popover/popover'
import Popup from '../popup/popup'
import CreateShotForm, { FormInput } from '../shot-form/create-shot-form'
import ShotBtn from '../shot-button/shotBtn'
import { DocPathService } from '../workspace/doc-path'
import { Doc } from '../workspace/workspace'
import classes from './editor.module.scss'
import {
  CustomRange,
  InlineFiltertagElement,
  InlineMirrorElement,
  InlinePollElement,
  InlineShotElement,
  InlineSymbolElement,
  LcElement,
  LiElement,
  UlElement,
} from './slate-custom-types'
import { isLiArray, isUl, lcPath, onKeyDown as withListOnKeyDown, ulPath, withList } from './with-list'
import { isInlineElement, parseLcAndReplace, withParse } from './with-parse'
import { useApolloClient } from '@apollo/client'
import { getLocalOrQueryRoot } from './use-local-value'
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
  const tokens = tokenizeBulletString(Node.string(node))
  let start = 0

  for (const token of tokens) {
    const length = getLength(token)
    const end = start + length

    if (typeof token !== 'string') {
      if (token.type === 'topic') {
        ranges.push({
          type: token.type,
          anchor: { path, offset: start },
          focus: { path, offset: end },
        })
        ranges.push({
          type: 'topic-bracket',
          anchor: { path, offset: start },
          focus: { path, offset: start + 2 },
        })
        ranges.push({
          type: 'topic-bracket',
          anchor: { path, offset: end - 2 },
          focus: { path, offset: end },
        })
      } else if (token.type === 'mirror-topic') {
        const bracketMatches = Node.string(node).matchAll(/\[\[|\]\]/g)

        ranges.push({
          type: token.type,
          anchor: { path, offset: start },
          focus: { path, offset: end },
        })
        for (const match of bracketMatches) {
          if (match.index) {
            ranges.push({
              type: 'mTopic-bracket',
              anchor: { path, offset: match.index },
              focus: { path, offset: match.index + 2 },
            })
          }
        }
      } else {
        ranges.push({
          // [token.type]: true,
          type: token.type,
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
    switch (leaf.type) {
      case 'mirror-ticker':
      case 'mirror-topic':
      case 'mTopic-bracket': {
        className = classes.mirrorLeaf
        // style = { color: '#5395f0' }
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
      case 'ticker':
      case 'topic-bracket':
      case 'topic': {
        className = classes.topicLeaf

        // style = { color: '#ff619b', fontWeight: 'bold',cursor:'pointer'}
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
  } else {
    switch (leaf.type) {
      case 'mirror-ticker':
      case 'mirror-topic':
      case 'topic':
      case 'ticker': {
        className = classes.mirrorLeaf
        // style = { color: '#5395f0' }
        break
      }
      case 'mTopic-bracket':
      case 'topic-bracket': {
        style = { color: '#b5b5b3' }
        break
      }

      case 'author':
      case 'url': {
        style = { color: '#0cb26e' }
        break
      }
      case 'filtertag': {
        style = { color: '#3f70de' }
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

      ref={e => {
        if (
          leaf.type === 'ticker' ||
          leaf.type === 'topic' ||
          leaf.type === 'mirror-ticker' ||
          leaf.type === 'mirror-topic' ||
          leaf.type === 'filtertag' ||
          leaf.type === 'topic-bracket' ||
          leaf.type === 'mTopic-bracket'
        ) {
          if (e) {
            e.onselectstart = () => false
          }
        }
      }}
    >
      {/* {leaf.text} */}
      {children}
    </span>
  )
}

const UpdateEmojiLike = ({ emoji }: { emoji: BulletEmoji }): JSX.Element | null => {
  const { data, loading, error } = useMyBulletEmojiLikeQuery({
    variables: { bulletEmojiId: emoji.id },
  })
  const [upsertEmojiLike] = useUpsertBulletEmojiLikeMutation({
    update(cache, { data }) {
      // TODO: 這裡忽略了更新 count
      if (data?.upsertBulletEmojiLike) {
        cache.writeQuery<MyBulletEmojiLikeQuery, MyBulletEmojiLikeQueryVariables>({
          query: MyBulletEmojiLikeDocument,
          variables: { bulletEmojiId: data.upsertBulletEmojiLike.like.bulletEmojiId },
          data: { myBulletEmojiLike: data.upsertBulletEmojiLike.like },
        })
      }
    },
  })
  function handleClickLike(choice: LikeChoice) {
    const myLike = data?.myBulletEmojiLike
    if (myLike && myLike.choice === choice) {
      upsertEmojiLike({
        variables: {
          bulletEmojiId: emoji.id,
          data: { choice: 'NEUTRAL' },
        },
      })
    }
    if (myLike && myLike.choice !== choice) {
      upsertEmojiLike({
        variables: {
          bulletEmojiId: emoji.id,
          data: { choice },
        },
      })
    }
    if (myLike === null) {
      upsertEmojiLike({
        variables: {
          bulletEmojiId: emoji.id,
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
      className={`inline mR ${data.myBulletEmojiLike?.choice === 'UP' ? classes.clicked : classes.hashtag}`}
      onClick={() => {
        handleClickLike('UP')
      }}
    >
      {/* {data.myHashtagLike?.choice && hashtag.text} */}
      {/* {hashtag.text} */}
      <HashtagTextToIcon emoji={emoji} />

      <span style={{ marginLeft: '3px' }}>{emoji.count.nUps}</span>
    </button>
  )
}

/**
 * @returns 若 emoji 目前沒有人點贊，返回 null
 */
export const EmojiButotn = ({ emoji }: { emoji: BulletEmoji }): JSX.Element | null => {
  // console.log(emoji)
  // if (emoji.count.nUps === 0) {
  //   return null
  // }

  return (
    // <span>
    <UpdateEmojiLike emoji={emoji} />
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
  const selected = useSelected()
  // console.log(element)
  return (
    <span {...attributes} className={classes.symbolContainer}>
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
                      router.push(`/cardx/${encodeURI(element.symbol)}`)
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
      // const queryPollData = async () => {
      //   queryPoll({ variables: { id: pollId } })
      // }
      // queryPollData()
      queryPoll({ variables: { id: pollId } })
      if (pollData?.poll) {
        onCreated(pollData.poll)
      }
    }
  }, [showPopover, pollData, pollId])

  // useEffect(() => {
  //   // console.log(path, selection)
  //   if (selected && selection) {
  //     const isEnd = Point.equals(selection.focus, { path: [...path, 0], offset: element.str.length })
  //     if (isEnd) {
  //       Transforms.setSelection(editor, {
  //         anchor: { path: Path.next(path), offset: 0 },
  //         focus: { path: Path.next(path), offset: 0 },
  //       })
  //     }
  //   }
  // }, [selection, selected])

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
      {/* <span style={selected ? undefined : { display: 'none' }}>{children}</span> */}

      {!selected && (
        <span contentEditable={false}>
          <PollGroup
            // bulletId={parent.id}
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
          {/* {showPopover && parent.id && (
            <Popover visible={showPopover} hideBoard={handleHideBoard}>
              {pollId ? (
                <PollPage pollId={pollId} clickedChoiceIdx={clickedIdx} />
              ) : (
                <CreatePollForm
                  choices={element.choices}
                  handlePollId={(pollId: string) => {
                    setPollId(pollId)
                  }}
                />
              )}
            </Popover>
          )} */}
        </span>
      )}
      {/* <span>{children}</span> */}
      <span style={selected ? undefined : { fontSize: '0px' }}>{children}</span>
    </span>
  )
}

const InlineShot = (props: RenderElementProps & { element: InlineShotElement }): JSX.Element => {
  const editor = useSlateStatic()
  const selected = useSelected()

  const { children, attributes, element } = props
  const [showPopover, setShowPopover] = useState(false)
  const [shotId, setShotId] = useState(element.id)
  const [shotData, setShotData] = useState<Shot | undefined>()
  const { data: targetData } = useCardQuery({ variables: { id: shotId } })

  function onCreated(shot: Shot) {
    // const editor = useSlateStatic()
    if (shotId) {
      const path = ReactEditor.findPath(editor, element)
      const inlineShot = toInlineShotString({
        id: shotId,
        choice: shot.choice,
        targetSymbol: targetData?.card?.sym.symbol ?? '',
        author: element.authorName ?? '',
      })
      Transforms.setNodes<InlineShotElement>(
        editor,
        {
          id: shotId,
        },
        { at: path },
      )
      Transforms.insertText(editor, inlineShot, { at: path })
    }
  }

  // console.log(element)
  useEffect(() => {
    // if (showPopover && !pollId) {
    //   handleCreatePoll()
    // }
    // console.log(shotData, shotId)

    if (!showPopover && !element.id && shotId && shotData) {
      // const queryPollData = async () => {
      //   queryPoll({ variables: { id: pollId } })
      // }
      // queryPollData()
      // queryShot({ variables: { id:shotId } })
      if (shotData) {
        onCreated(shotData)
      }
    }
  }, [showPopover, shotData, shotId])
  return (
    <span {...attributes}>
      {!selected && (
        <>
          {/* <button
            className={classes.shotBtn}
            contentEditable={false}
            onClick={e => {
              e.stopPropagation()
              setShowPopover(true)
            }}
          >
            {element.params.map((e, i) => {
              return (
                <span
                  className={
                    e.startsWith('@')
                      ? classes.shotAuthor
                      : e.startsWith('$') || e.startsWith('[[')
                      ? classes.shotTarget
                      : e.startsWith('#')
                      ? classes.shotChoice
                      : ''
                  }
                  data-choice={e.startsWith('#') ? e : ''}
                  key={i}
                >
                  {e.startsWith('$') ? '  ' + e + '  ' : e.startsWith('#') ? e.substr(1) : e}
                </span>
              )
            })}
          </button> */}

          <ShotBtn
            author={element.params.find(e => e.startsWith('@'))}
            target={element.params.find(e => e.startsWith('$'))}
            choice={element.params.find(e => e.startsWith('#'))}
          />
        </>
      )}
      {showPopover && (
        <span contentEditable={false}>
          <Popover visible={showPopover} hideBoard={() => setShowPopover(false)}>
            <CreateShotForm
              initialInput={{
                author: element.authorName ?? '',
                target: element.targetSymbol ?? '',
                choice: element.choice ?? '',
                link: '',
              }}
              handleShotData={(shot: Shot) => {
                setShotId(shot.id)
                setShotData(shot)
              }}
            />
          </Popover>
        </span>
      )}
      <span style={selected ? undefined : { fontSize: '0px' }}>{children}</span>
      {/* <span>{children}</span> */}
    </span>
  )
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

// const FilterMirror = ({
//   mirrors,
//   sourceCardId,
// }: {
//   mirrors: InlineMirrorElement[]
//   sourceCardId?: string
// }): JSX.Element | null => {
//   const [filteredBullet, setFilteredBullet] = useState<BulletDraft | null | undefined>()
//   const client = useApolloClient()

//   useEffect(() => {
//     const asyncRun = async () => {
//       if (mirrors.length === 1) {
//         const mirror = mirrors[0]
//         const { rootLi } = await getLocalOrQueryRoot({ client, mirrorSymbol: mirror.mirrorSymbol })
//         const rootBulletDraft = Serializer.toRootBulletDraft(rootLi)
//         const filtered = BulletNode.filter({
//           node: rootBulletDraft,
//           match: ({ node }) => node.sourceCardId === sourceCardId,
//         })
//         setFilteredBullet(filtered)
//       }
//     }
//     asyncRun().catch(err => {
//       console.error(err)
//     })
//   }, [])

//   if (mirrors.length === 0) {
//     return null
//   }
//   if (mirrors.length > 1) {
//     return <div>一行只允許一個 mirror</div>
//   }
//   if (filteredBullet === undefined) {
//     return null
//   }
//   if (filteredBullet === null) {
//     return <div>Click to edit</div>
//   }
//   return (
//     <ul className={classes.filterMirrorContainer}>
//       {/* 忽略 root，從 root children 開始 render */}
//       {filteredBullet.children.map((e, i) => (
//         <BulletComponent key={i} bullet={e} />
//       ))}
//     </ul>
//   )
// }

const Lc = ({
  attributes,
  children,
  element,
  curCardId,
}: // sourceLinkId,
RenderElementProps & {
  element: LcElement
  curCardId?: string
  // sourceLinkId?: string
}): JSX.Element => {
  const editor = useSlateStatic()
  const readonly = useReadOnly()
  const focused = useFocused() // 整個editor是否focus
  const selected = useSelected() // 這個element是否被select（等同指標在這個element裡）

  // TODO: 改成 lazyQuery + useEffect
  const { data: emojiData } = useBulletEmojisQuery({
    fetchPolicy: 'cache-first',
    variables: { bulletId: element.bulletSnapshot?.id ?? '' },
  })
  // const [author, authorSwitcher] = useAuthorSwitcher({ authorName })
  // const [placeholder, setPlaceholder] = useState<string | undefined>()
  // useEffect(() => {
  //   setPlaceholder(element.placeholder)
  // }, [element])
  // const author = location.author

  // useEffect(() => {
  //   if (element.op === 'CREATE') {
  //     let lcPath: number[] | undefined
  //     if (author && element.author === undefined) {
  //       lcPath = ReactEditor.findPath(editor, element)
  //       Transforms.setNodes<LcElement>(editor, { author }, { at: lcPath })
  //     }
  //     if (sourceUrl && element.sourceUrl === undefined) {
  //       Transforms.setNodes<LcElement>(editor, { sourceUrl }, { at: lcPath ?? ReactEditor.findPath(editor, element) })
  //     }
  //   }
  // }, [author, element, sourceUrl])
  // console.log(element)
  useEffect(() => {
    if ((focused && !selected) || readonly) {
      // cursor 離開 lc-head，將 text 轉 tokens、驗證 tokens、轉成 inline-elements
      const path = ReactEditor.findPath(editor, element)
      parseLcAndReplace({ editor, lcEntry: [element, path] })
      return
    }
    if (selected) {
      // cursor 進入 lc-head，將 inlines 轉回 text，避免直接操作 inlines
      const path = ReactEditor.findPath(editor, element)
      //   const lcChildren = Node.children(editor, path)

      //   for (const lcChild of lcChildren) {
      //     if (!Text.isText(lcChild[0]) && (lcChild[0].type === 'poll' || lcChild[0].type === 'shot')) {
      //       console.log(lcChild)
      //       Transforms.insertText(editor, lcChild[0].str, { at: lcChild[1] })
      //       // Transforms.setNodes(editor, { children: [{ text: `${lcChild[0].str}` }] }, { at: lcChild[1] })
      //       // match:(n,p)=>!Text.isText(n)&&Element.isElement(n)&&isInlineElement(n)
      //     }
      //   }

      Transforms.unwrapNodes(editor, {
        at: path,
        match: (n, p) => Element.isElement(n) && Path.isChild(p, path),
      })
      //   // console.log('unwrapNodes', path)
    }
  }, [selected, readonly])

  const mirrors = element.children.filter((e): e is InlineMirrorElement => e.type === 'mirror')
  // console.log(element, children)
  return (
    <div {...attributes}>
      <div className={classes.lcText}>
        {children}

        {emojiData && (
          <>
            {emojiData.bulletEmojis?.map((e, i) => {
              if (e.count.nUps === 0) {
                return null
              }
              return (
                <span contentEditable={false} key={i}>
                  <EmojiButotn emoji={e} />
                </span>
              )
            })}
          </>
        )}
      </div>
      {/* {sourceCardId && ( */}
      <span contentEditable={false}>
        {/* {author === element.author && element.author}
          {sourceUrl === element.sourceUrl && sourceUrl} */}
        {/* <FilterMirror mirrors={mirrors} /> */}
      </span>
      {/* )} */}
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
  // const href = locationToUrl(location, ReactEditor.findPath(editor, element))

  function onEmojiCreated(emoji: BulletEmoji, myEmojiLike: BulletEmojiLike) {
    // const curEmojis = lc.emojis ?? []
    // const path = ReactEditor.findPath(editor, element)
    // Transforms.setNodes<LcElement>(editor,  { at: lcPath(path) })
  }
  // console.log(lc.emojis)

  return (
    <div
      {...attributes}
      className={classes.bulletLi}
      onMouseOver={event => {
        event.stopPropagation()
        event.preventDefault()
        // setShowPanelIcon(true)
      }}
      onMouseOut={event => {
        event.stopPropagation()
        event.preventDefault()
        // setShowPanelIcon(false)
      }}
    >
      {/* <div contentEditable={false}></div> */}
      <div className={classes.arrowBulletWrapper} contentEditable={false}>
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

        <Link href={'/href'}>
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

              setShowPanel(false)
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
        </Link>
        {showPanel && (
          <BulletPanel
            className={classes.bulletPanel}
            tooltipClassName={classes.bulletPanelTooltip}
            bulletId={lc.bulletCopy?.id}
            visible={showPanel}
            onEmojiCreated={onEmojiCreated}
          />
        )}

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
  card,
}: RenderElementProps & { card: Card | null }): JSX.Element => {
  switch (element.type) {
    case 'symbol':
      return <InlineSymbol {...{ attributes, children, element }} />
    case 'mirror':
      return <InlineMirror {...{ attributes, children, element, sourceCardId: card?.id }} />
    case 'filtertag':
      return <InlineFiltertag {...{ attributes, children, element }} />
    case 'poll':
      return <InlinePoll {...{ attributes, children, element }} />
    case 'shot':
      return <InlineShot {...{ attributes, children, element }} />
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
  const editor = useMemo(() => withParse(withList(withHistory(withReact(createEditor())))), [])
  const renderElement = useCallback(
    (props: RenderElementProps) => <CustomElement {...{ ...props, card: doc.cardCopy }} />,
    [doc],
  )
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const renderDecorate = useCallback(([node, path]) => decorate([node, path]), [])

  // const [isPressShift, setIsPressShift] = useState(false)
  // const withListOnKeyDownMemo = useCallback((event: React.KeyboardEvent) => {
  //   withListOnKeyDown(event, editor)
  //   // console.log(editor.children)
  // }, [])

  // const [searchPanel, onValueChange] = useSearch(editor)
  const [value, setValue] = useState<LiElement[]>(doc.editorValue ?? [])

  // useEffect(() => {
  //   // 當 initialValue 變動時，重設 editor value @see https://github.com/ianstormtaylor/slate/issues/713
  //   Transforms.deselect(editor)
  //   setValue(initialValue)
  // }, [initialValue])

  useEffect(() => {
    // 當 doc 變動時，重設 editor value @see https://github.com/ianstormtaylor/slate/issues/713
    Transforms.deselect(editor)
    setValue(doc.editorValue ?? [])
  }, [doc])

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
          // readOnly={readOnly}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
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
