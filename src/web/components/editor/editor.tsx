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
import { parseLcAndReplace, withInline } from './with-inline'
import InlineSymbol from '../inline/inline-symbol'
import InlineMirror from '../inline/inline-mirror'
import InlineFiltertag from '../inline/inline-filtertag'
import InlinePoll from '../inline/inline-poll'
import InlineRate from '../inline/inline-rate'
import { decorate } from './decorate'
import ArrowUpIcon from '../../assets/svg/arrow-up.svg'
import BulletPanel from '../bullet-panel/bullet-panel'
import BulletSvg from '../bullet-svg/bullet-svg'
import BulletEmojiButtonGroup from '../emoji-up-down/bullet-emoji-button-group'
import { Doc } from '../workspace/doc'
import { LcElement, LiElement, UlElement } from './slate-custom-types'
import { isLiArray, isUl, lcPath, onKeyDown as withListOnKeyDown, ulPath, withList } from './with-list'
import Modal from '../modal/modal'

const Leaf = (props: RenderLeafProps): JSX.Element => {
  const { attributes, leaf, children } = props

  const selected = useSelected()
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
  // } else {
  switch (leaf.tokenType) {
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
      className = 'text-gray-400'
      break
    }
    case 'filtertag':
    case 'author':
    case 'url': {
      className = 'text-green-500'
      break
    }

    default: {
      className = 'text-gray-600'
    }
  }
  // }

  return (
    // {/* <span {...attributes}>{children}</span> */}
    <span
      {...attributes}
      className={className}
      // ref={e => {
      //   if (e && !selected && leaf.tokenType) {
      //     e.onselectstart = () => false
      //   }
      // }}
    >
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
