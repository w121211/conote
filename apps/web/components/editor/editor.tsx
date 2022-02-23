import React, { useState, useMemo, useCallback, useEffect, CSSProperties } from 'react'
import { cloneDeep } from 'lodash'
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
import { withInline, wrapToInlines } from './with-inline'
import InlineSymbol from '../inline/inline-symbol'
import InlineMirror from '../inline/inline-mirror'
import InlineFiltertag from '../inline/inline-filtertag'
import InlinePoll from '../inline/inline-poll'
import InlineRate from '../inline/inline-rate'
import { decorate } from './decorate'
import ArrowUpIcon from '../../assets/svg/arrow-up.svg'
import BulletPanel from '../bullet-panel/bullet-panel'
import BulletSvg from '../bullet-svg'
import BulletEmojiButtonGroup from '../emoji-up-down/bullet-emoji-button-group'
import { Doc } from '../workspace/doc'
import { LcElement, LiElement, UlElement } from './slate-custom-types'
import { isLiArray, isUl, onKeyDown as onKeyDownWithList, ulPath, withList } from './with-list'
import { withAutoComplete } from './with-auto-complete'
import InlineDiscuss from '../inline/inline-discuss'
import { useSearchPanel } from './use-search-panel'
import { useApolloClient } from '@apollo/client'
import { useSearchDiscussModal } from './use-search-discuss-modal'

const Leaf = (props: RenderLeafProps): JSX.Element => {
  const { attributes, leaf, children } = props

  // const [isPressShift, setIsPressShift] = useState(false)
  // console.log(isPressShift)
  // let style: React.CSSProperties = {}
  let className = ''

  // if (selected) {
  // switch (leaf.tokenType) {
  //   case 'mirror-ticker':
  //   case 'mirror-topic':
  //   case 'mirror-topic-bracket-head':
  //   case 'mirror-head':
  //   case 'topic-bracket-head':
  //   case 'topic-bracket-tail': {
  //     className = 'text-blue-500 '
  //     break
  //   }
  //   case 'author': {
  //     className = 'text-green-500'
  //     break
  //   }
  //   case 'poll':
  //   case 'new-poll': {
  //     className = 'text-cyan-500'
  //     break
  //   }
  //   case 'rate':
  //   case 'new-rate': {
  //     className = 'text-yellow-500'
  //     break
  //   }
  //   case 'ticker':
  //   case 'topic-bracket':
  //   case 'topic': {
  //     className = 'text-pink-500'
  //     break
  //   }
  //   case 'filtertag': {
  //     className = 'text-purple-500'
  //     break
  //   }
  //   case 'url': {
  //     className = 'text-sky-500'
  //     break
  //   }
  //   default: {
  //     className = 'text-gray-600'
  //   }
  // }
  switch (leaf.tokenType) {
    case 'author':
    case 'discuss':
    case 'mirror-ticker':
    case 'mirror-topic':
    case 'rate':
    case 'topic':
    case 'ticker': {
      className = 'text-blue-500'
      break
    }
    case 'mirror-topic-bracket-head':
    case 'mirror-head':
    case 'topic-bracket-head':
    case 'topic-bracket-tail': {
      className = 'text-gray-400 '
      break
    }
    case 'filtertag':
    case 'url': {
      className = 'text-green-600'
      break
    }

    default: {
      className = 'text-gray-600'
    }
  }

  return (
    <span {...attributes} className={className}>
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
  const focused = useFocused() // is editor in focus
  const selected = useSelected() // is element selected, ie cursor inside this element

  // const [author, authorSwitcher] = useAuthorSwitcher({ authorName })
  // const [placeholder, setPlaceholder] = useState<string | undefined>()
  // useEffect(() => {
  //   setPlaceholder(element.placeholder)
  // }, [element])
  // const author = location.author

  useEffect(() => {
    if (!focused || !selected || readonly) {
      // console.log(editor.history.undos)
      // cursor exited lc, wrap lc to inlines
      const path = ReactEditor.findPath(editor, element)
      wrapToInlines({ editor, lcEntry: [element, path] })
      return
    }
    if (selected) {
      // fix undo bug
      const { undos } = editor.history
      if (undos.length >= 2) {
        const lastBatch = undos[undos.length - 1]
        // looks like wrap lc just happened, merge undos
        if (lastBatch.length >= 2 && lastBatch[0].type === 'remove_node' && lastBatch[1].type === 'insert_node') {
          const _lastBatch = undos.pop()
          if (_lastBatch) {
            undos[undos.length - 1] = undos[undos.length - 1].concat(_lastBatch)
          }
        }
      }

      // cursor enters lc, unwrap inlines to string
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
    <div
      {...attributes}
      className="py-1"
      onMouseEnter={e => {
        // console.log(
        const arrow = e.currentTarget.parentElement?.parentElement?.firstElementChild?.firstElementChild as HTMLElement
        if (arrow) {
          arrow.style.visibility = 'visible'
        }

        // )
      }}
      onMouseLeave={e => {
        const arrow = e.currentTarget.parentElement?.parentElement?.firstElementChild?.firstElementChild as HTMLElement
        if (arrow) {
          arrow.style.removeProperty('visibility')
        }
      }}
    >
      {children}
      {element.bulletCopy?.id && <BulletEmojiButtonGroup bulletId={element.bulletCopy.id} />}

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
    <div {...attributes} className="relative break-words flex items-start w-full ">
      {/* <div contentEditable={false}></div> */}
      <div className="group inline-flex items-center h-8 select-none" contentEditable={false}>
        <span
          className={`flex-shrink-0 flex-grow-0 invisible group-hover:visible  ${
            hasUl ? 'opacity-100 group-hover:cursor-pointer' : 'opacity-0 '
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
          <span className={`material-icons w-4 text-lg `}>
            {ulFolded === undefined ? 'arrow_drop_down' : 'arrow_right'}
          </span>
          {/* <ArrowUpIcon
            className={` w-2 h-2 fill-current text-gray-500 `}
            style={{ transform: ulFolded === undefined ? 'rotate(180deg)' : 'rotate(90deg)' }}
          /> */}
        </span>
        <span
          className={`relative flex items-center justify-center w-5 h-full ${
            lc.bulletCopy?.id ? 'cursor-pointer' : 'cursor-default'
          }`}
          onMouseEnter={() => setShowPanel(true)}
          onMouseLeave={() => setShowPanel(false)}
        >
          <span
            className={`material-icons relative text-xs scale-[.65] text-gray-600 
            before:content-['']  before:w-5 before:h-5 before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:absolute before:rounded-full before:-z-10 
            ${ulFolded === undefined ? 'before:bg-transparent' : 'before:bg-gray-300'}`}
          >
            fiber_manual_record
          </span>

          {lc.bulletCopy?.id && (
            <BulletPanel
              // tooltipClassName={classes.bulletPanelTooltip}
              bulletId={lc.bulletCopy.id}
              visible={showPanel}
              onClose={() => setShowPanel(false)}
            />
          )}
        </span>

        {/* {lc.id && <AddEmojiButotn bulletId={lc.id} emojiText={'UP'} onCreated={onEmojiCreated} />} */}
      </div>

      <div className=" w-full">{children}</div>
    </div>
  )
}

const Ul = ({ attributes, children, element }: RenderElementProps & { element: UlElement }): JSX.Element => {
  return (
    <div {...attributes} className={`${element.folded ? 'hidden' : 'block'}`}>
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
    case 'inline-discuss':
      return <InlineDiscuss {...{ attributes, children, element }} />
    case 'inline-filtertag':
      return <InlineFiltertag {...{ attributes, children, element }} />
    case 'inline-mirror':
      return <InlineMirror {...{ attributes, children, element, sourceCardId: card?.id }} />
    case 'inline-poll':
      return <InlinePoll {...{ attributes, children, element }} />
    case 'inline-rate':
      return <InlineRate {...{ attributes, children, element }} />
    case 'inline-symbol':
      return <InlineSymbol {...{ attributes, children, element }} />
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

export const BulletEditor = ({ doc, readOnly }: { doc: Doc; readOnly?: boolean }): JSX.Element => {
  const editor = useMemo(() => withInline(withList(withAutoComplete(withHistory(withReact(createEditor()))))), [])
  const client = useApolloClient()
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

  useEffect(() => {
    console.log(`BulletEditor enter ${doc.getSymbol()}`)
    return () => {
      console.log(`BulletEditor unmount ${doc.getSymbol()}`)
    }
  }, [])

  const { searchPanel, onValueChange: onValueChangeWithSearchPanel } = useSearchPanel(editor, client)
  const { searchDiscussSelectModal, onKeyUp: onKeyUpWithSearchDiscuss } = useSearchDiscussModal(editor)
  // useEffect(() => {
  //   if (searchAllResult.data) {
  //     setSuggestions(searchAllResult.data.searchAll)
  //   } else {
  //     setSuggestions(null)
  //   }
  // }, [searchAllResult])

  return (
    <div className="text-gray-800">
      <Slate
        editor={editor}
        value={value}
        onChange={value => {
          if (isLiArray(value)) {
            doc.setEditorValue(value)
            onValueChangeWithSearchPanel(editor)
            setValue(value)
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
          readOnly={readOnly}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          spellCheck={false}
          onKeyDown={event => {
            onKeyDownWithList(event, editor)
          }}
          onKeyUp={event => {
            onKeyUpWithSearchDiscuss(event, editor)
          }}
        />
        {/* <CommentPanel /> */}
      </Slate>
      {searchDiscussSelectModal}
      {searchPanel}
    </div>
  )
}
