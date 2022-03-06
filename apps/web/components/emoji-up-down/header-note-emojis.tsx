import React, { useEffect, useState } from 'react'
import { useMeQuery, useNoteEmojisQuery } from '../../apollo/query.graphql'
import CreateNoteEmojiBtn from './create-note-emoji-btn'
import NoteEmojiBtn from './note-emoji-btn'
import { EmojiCode } from '@prisma/client'
import Tooltip from '../tooltip/tooltip'

const HeaderNoteEmojis = ({ noteId }: { noteId: string }): JSX.Element | null => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [likedChoice, setLikedChoice] = useState<'UP' | 'DOWN' | null>(null)
  const { data: emojiData } = useNoteEmojisQuery({ variables: { noteId } })
  const emojis: EmojiCode[] = ['UP', 'DOWN']
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
      <div
        className="relative"
        onClick={e => {
          e.stopPropagation()
          setShowTooltip(!showTooltip)
        }}
      >
        <span
          className="material-icons  flex items-center justify-center p-1 rounded
        cursor-pointer select-none text-xl leading-none text-gray-500 mix-blend-multiply hover:bg-gray-100"
        >
          sentiment_satisfied_alt
        </span>
        <Tooltip
          className="px-1 py-1 left-1/2 -translate-x-1/2"
          visible={showTooltip}
          onClose={() => setShowTooltip(false)}
        >
          {emojis.map((e, i) => {
            const foundData = emojiData?.noteEmojis.find(el => el.code === e)
            return foundData !== undefined ? (
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
            )
          })}
        </Tooltip>
      </div>
    </div>
  )
}
export default HeaderNoteEmojis
