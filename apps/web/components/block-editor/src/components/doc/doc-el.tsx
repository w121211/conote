import React, { ReactNode, useEffect, useState } from 'react'
import { Observable, switchMap, tap } from 'rxjs'
import { useObservable } from '@ngneat/react-rxjs'
import { NoteHead } from '../../../../note-head'
import { BlockEl } from '../block/block-el'
import { DocPlaceholder } from './doc-placeholder'
import { blockRepo, getBlock } from '../../stores/block.repository'
import { Block, Doc } from '../../interfaces'
import { docTemplateSet } from '../../events'
import { hotkey, multiBlockSelection } from '../../listeners'

const PageWrap = ({ children }: { children: ReactNode }) => {
  return (
    <article
      className="
    basis-full 
    self-stretch 
    w-full max-w-[60em] 
    mx-auto 
    p-4"
    >
      {children}
    </article>
  )
}

// const PageHeader = styled.header`
//   position: relative;
//   padding: 0 3rem;
// `

// const Title = styled.h1`
//   font-size: 2.5rem;
//   position: relative;
//   overflow: visible;
//   flex-grow: 1;
//   margin: 0.1em 0;
//   white-space: pre-line;
//   word-break: break-word;
//   line-height: 1.1em;

//   textarea {
//     padding: 0;
//     margin: 0;
//     width: 100%;
//     min-height: 100%;
//     font-weight: inherit;
//     letter-spacing: inherit;
//     font-size: inherit;
//     appearance: none;
//     cursor: text;
//     resize: none;
//     transform: translate3d(0, 0, 0);
//     color: inherit;
//     caret-color: var(--link-color);
//     background: transparent;
//     line-height: inherit;
//     border: 0;
//     font-family: inherit;
//     visibility: hidden;
//     position: absolute;

//     &::webkit-scrollbar {
//       display: none;
//     }

//     &:focus,
//     &.is-editing {
//       outline: none;
//       visibility: visible;
//       position: relative;
//     }

//     abbr {
//       z-index: 4;
//     }

//     &.is-editing + span {
//       visibility: hidden;
//       position: absolute;
//     }
//   }
// `

// const PageMenuToggle = styled.button`
//   float: left;
//   border-radius: 1000px;
//   margin-left: -2.5rem;
//   margin-top: 0.5rem;
//   width: 2rem;
//   height: 2rem;
//   color: var(--body-text-color---opacity-high);
//   vertical-align: bottom;
// `

// const PageMenuToggle = ({
//   onClick,
//   children,
// }: {
//   onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
//   children: ReactNode
// }) => {
//   return (
//     <button
//       className="
//       float-left
//       w-8 h-8
//       rounded-full
//       -ml-10 mt-2
//       align-bottom
//       text-[#AAA]/75"
//       onClick={onClick}
//     >
//       {children}
//     </button>
//   )
// }

// const BlocksContainer = styled(BlockListContainer)`
//   padding-left: 1rem;
//   padding-right: 1rem;
//   display: flex;
//   flex-direction: column;
// `

interface DocProps {
  // assume to be block-els, if given, use it and ignore doc-block's children
  children?: React.ReactNode

  // /**
  //  * Whether the page is a Daily Note
  //  */
  // isDailyNote: boolean
  // /**
  //  * Whether the page has a corresponding shortcut
  //  */
  // hasShortcut?: boolean
  // /**
  //  * The title of the page
  //  */
  // title: React.ReactNode
  // /**
  //  * Whether the page can be edited
  //  */
  isEditable?: boolean
  // /**
  //  * The unique identifier of the page
  //  */
  // uid: string
  // handlePressRemoveShortcut(): void
  // handlePressAddShortcut(): void
  // handlePressShowLocalGraph(): void
  // handlePressDelete(): void

  doc: Doc
}

export const DocEl = ({
  // isDailyNote,
  // hasShortcut,
  // children,
  // title,
  // uid,
  // isLinkedReferencesOpen,
  // isUnlinkedReferencesOpen,
  // handlePressLinkedReferencesToggle,
  // handlePressUnlinkedReferencesToggle,
  // handlePressRemoveShortcut,
  // handlePressAddShortcut,
  // handlePressShowLocalGraph,
  // handlePressDelete,
  isEditable = true,
  // children,
  doc,
}: DocProps): JSX.Element | null => {
  const [isPageMenuOpen, setIsPageMenuOpen] = React.useState(false)
  const [pageMenuAnchor, setPageMenuAnchor] =
    React.useState<HTMLButtonElement | null>(null)

  const [docBlock] = useObservable(blockRepo.getBlock$(doc.blockUid), {
    deps: [doc],
    initialValue: null,
  })

  // (BUG) useObservable set docBlock as null initially if default value is undefined
  // however, the return type will not include null
  // const docBlock = useObservable<Block | undefined, [Doc]>(
  //   (_, inputs$) =>
  //     inputs$.pipe(
  //       tap(console.log),
  //       switchMap(([v]) => blockRepo.getBlock$(v.blockUid)),
  //     ),
  //   undefined,
  //   [doc],
  // )

  // useEffect(() => {
  //   console.log(docBlockUid, docBlock)
  //   // console.log(docBlock)
  // }, [docBlockUid, docBlock])

  useEffect(() => {
    document.addEventListener('keydown', hotkey)
    document.addEventListener('keydown', multiBlockSelection)

    return () => {
      document.removeEventListener('keydown', hotkey)
      document.removeEventListener('keydown', multiBlockSelection)
    }
  }, [])

  const handlePressMenuToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    setPageMenuAnchor(e.currentTarget)
    setIsPageMenuOpen(true)
  }

  // const handleClosePageMenu = () => {
  //   setPageMenuAnchor(null)
  //   setIsPageMenuOpen(false)
  // }

  if (docBlock === undefined || docBlock === null) {
    return null
  }

  return (
    <article
      className="
      node-page
      basis-full 
      self-stretch 
      w-full max-w-[60em] 
      mx-auto 
      p-4"
    >
      {/* <button
        className="
      float-left 
      w-8 h-8 
      rounded-full 
      -ml-10 mt-2 
      align-bottom 
      text-[#AAA]/75"
        // shape="round"
        // isPressed={isPageMenuOpen}
        onClick={handlePressMenuToggle}
      >
        <MoreHoriz />
      </button> */}

      {/* <PopperUnstyled
        open={isPageMenuOpen}
        anchorEl={pageMenuAnchor}
        disablePortal={true}
        placement="bottom-start"
      >
        <button>hello</button>
        <button>world</button>
      </PopperUnstyled> */}

      {/* <PageHeader>
        <Title>
          <PageMenuToggle
            // shape="round"
            // isPressed={isPageMenuOpen}
            onClick={handlePressMenuToggle}
          >
            <MoreHoriz />
          </PageMenuToggle>
          <Modal
            onClose={handleClosePageMenu}
            BackdropProps={{ invisible: true }}
            container={DOMRoot}
            open={isPageMenuOpen}
          >
            <Popper
              open={isPageMenuOpen}
              anchorEl={pageMenuAnchor}
              disablePortal={true}
              placement="bottom-start"
            >
              <Overlay className="animate-in">
                <Menu>
                  {hasShortcut ? (
                    <Button onClick={handlePressRemoveShortcut}>
                      <Bookmark /> <span>Remove Shortcut</span>
                    </Button>
                  ) : (
                    <Button onClick={handlePressAddShortcut}>
                      <Bookmark /> <span>Add Shortcut</span>
                    </Button>
                  )}
                  <Button onClick={handlePressShowLocalGraph}>
                    <BubbleChart /> <span>Show Local Graph</span>
                  </Button>
                  <Menu.Separator />
                  <Button onClick={handlePressDelete}>
                    <Delete /> <span>Delete Page</span>
                  </Button>
                </Menu>
              </Overlay>
            </Popper>
          </Modal>
          {title} {isDailyNote && <Today />}
          {title}
        </Title>
      </PageHeader> */}

      {/* {children ? (
        children
      ) : isEditable ? (
        <BlocksContainer>
          {block.childrenUids.map((e) => (
            <BlockEl key={e} uid={e} isEditable={isEditable} />
          ))}
        </BlocksContainer>
      ) : (
        <DocPlaceholder />
      )} */}

      <NoteHead
        isNew
        symbol="test"
        title="test test test"
        link="http://asdfasdf.asdfasdf.com"
        fetchTime={new Date()}
        nodeId="asdfasdfas"
      />

      {/* <button
        onClick={() => {
          docSave(doc)
        }}
      >
        Save
      </button>

      <button
        onClick={() => {
          docRemove(doc)
        }}
      >
        Remove
      </button> */}

      {
        // children ? (
        //   children
        // ) : docBlock.childrenUids.length > 0 ? (
        docBlock.childrenUids.length > 0 ? (
          // <BlocksContainer>
          <div>
            {docBlock.childrenUids.map(e => (
              <BlockEl key={e} uid={e} isEditable={isEditable} />
            ))}
          </div>
        ) : (
          // <DocPlaceholder />
          <button onClick={e => docTemplateSet(docBlock)}>demo-template</button>
        )
      }
    </article>
  )
}
