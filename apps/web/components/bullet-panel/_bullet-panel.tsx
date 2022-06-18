import React, { useRef } from 'react'
// import { EmojiCode } from 'graphql-let/__generated__/__types__'
// import { BulletEmojiFragment } from '../../apollo/query.graphql'
// import { Tooltip } from '../ui-component/tooltip/tooltip'

// const BULLET_PANEL_EMOJIS: EmojiCode[] = ['PIN', 'UP', 'DOWN']

// const BulletPanel = ({
//   bulletId,
//   visible,
//   onClose,
// }: {
//   bulletId?: string
//   visible: boolean
//   onClose: () => void
// }): JSX.Element => {
//   return (
//     <Tooltip
//       className={`py-2 px-0 -translate-x-1/2 left-1/2`}
//       visible={visible}
//       onClose={onClose}
//     >
//       <div className="flex flex-col items-start">
//         {bulletId &&
//           BULLET_PANEL_EMOJIS.map((e, i) => (
//             <BulletEmojiCreateButton
//               bulletId={bulletId}
//               className="w-full px-4 hover:bg-gray-100"
//               emojiCode={e}
//               key={i}
//             />
//           ))}
//       </div>
//     </Tooltip>
//   )
// }
// export default BulletPanel
