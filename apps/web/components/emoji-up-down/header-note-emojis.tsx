import React, { useEffect, useState } from 'react'
import { useMeQuery, useNoteEmojisQuery } from '../../apollo/query.graphql'
import CreateNoteEmojiBtn from './create-note-emoji-btn'
import NoteEmojiBtn from './note-emoji-btn'
import { EmojiCode } from '@prisma/client'
import ToggleMenu from '../../layout/toggle-menu'

const HeaderNoteEmojis = ({
  noteId,
}: {
  noteId: string
}): JSX.Element | null => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [likedChoice, setLikedChoice] = useState<'UP' | 'DOWN' | null>(null)
  const [hoverEmoji, setHoverEmoji] = useState<number | undefined>()
  const { data: emojiData } = useNoteEmojisQuery({ variables: { noteId } })
  const emojis: EmojiCode[] = ['UP', 'DOWN']
  const mockEmojis = ['up', 'down', 'need coorperattion']
  const pinEmojiData = emojiData?.noteEmojis.find(e => e.code === 'PIN')

  return (
    <div className={`flex`}>
      {emojis.map((e, i) => {
        const foundData = emojiData?.noteEmojis.find(el => el.code === e)
        return foundData !== undefined && foundData.count.nUps > 0 ? (
          <div key={i} className="flex items-center">
            <NoteEmojiBtn
              noteEmoji={foundData}
              showCounts
              onLiked={code => {
                setLikedChoice(code)
              }}
              likedChoice={likedChoice}
            />
          </div>
        ) : null
      })}
      {pinEmojiData ? (
        <NoteEmojiBtn
          noteEmoji={pinEmojiData}
          onLiked={code => {
            setLikedChoice(code)
          }}
          likedChoice={likedChoice}
        />
      ) : (
        <CreateNoteEmojiBtn noteId={noteId} emojiCode="PIN" />
      )}
      <ToggleMenu
        className="-translate-x-full left-full"
        summary={
          <span
            className="material-icons  flex items-center justify-center p-1 rounded
        cursor-pointer select-none text-xl leading-none text-gray-500 mix-blend-multiply hover:bg-gray-100 hover:text-gray-700"
          >
            sentiment_satisfied_alt
          </span>
        }
      >
        <div className="block w-[150px] ">
          <p className="block p-1 border-b border-gray-200 text-sm text-gray-500 capitalize">
            {hoverEmoji !== undefined
              ? mockEmojis[hoverEmoji]
              : 'pick your emoji'}
          </p>
          <div className="p-1">
            {emojis.map((e, i) => {
              const foundData = emojiData?.noteEmojis.find(el => el.code === e)
              return (
                <span
                  key={i}
                  onMouseEnter={() => setHoverEmoji(i)}
                  onMouseLeave={() => setHoverEmoji(undefined)}
                >
                  {foundData !== undefined ? (
                    <NoteEmojiBtn
                      key={i}
                      noteEmoji={foundData}
                      onLiked={code => {
                        setLikedChoice(code)
                      }}
                      likedChoice={likedChoice}
                    />
                  ) : (
                    <CreateNoteEmojiBtn key={i} noteId={noteId} emojiCode={e} />
                  )}
                </span>
              )
            })}
            <button
              className=" p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              onMouseEnter={() => setHoverEmoji(2)}
              onMouseLeave={() => setHoverEmoji(undefined)}
            >
              <span className="material-icons-outlined  text-lg leading-none ">
                waving_hand
              </span>
            </button>
          </div>
        </div>
      </ToggleMenu>
      <div
        className="relative"
        onClick={e => {
          e.stopPropagation()
          setShowTooltip(!showTooltip)
        }}
      >
        {/* <Tooltip
          className="!block w-[150px] px-0 py-0 left-full -translate-x-full"
          visible={showTooltip}
          onClose={() => setShowTooltip(false)}
        >
          
        </Tooltip> */}
      </div>
    </div>
  )
}
export default HeaderNoteEmojis
