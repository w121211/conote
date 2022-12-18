import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import { CommitFragment, NoteDocFragment } from '../../../apollo/query.graphql'
import { getNotePageURL } from '../../utils'
import { toMergeComponents } from '../commit/CommitList'
import SymbolDecorate from '../symbol/SymbolDecorate'

// const NoteDocListItem = ({ noteDoc }: { noteDoc: NoteDocFragment }) => (
//   <div>
//     <div className="py-1">
//       <p className="text-sm text-gray-500 italic dark:text-gray-400">
//         {moment(commit.createdAt).format('L')}
//       </p>
//     </div>
//     <ul role="list">
//       {noteDocs.map(({ id, symbol, meta, contentHead, mergePollId }) => {
//         const { icon, description } = totMergeComponents(
//           meta.mergeState,
//           mergePollId ?? undefined,
//         )
//         return (
//           <li key={id}>
//             <div className="flex items-center space-x-2 py-2">
//               <div className="flex-shrink-0 mt-0.5 mr-2">{icon}</div>
//               <div className="flex-1 min-w-0">
//                 <Link href={getNotePageURL(symbol, id)}>
//                   <a className="text-base font-base text-blue-600 dark:text-white hover:underline">
//                     <SymbolDecorate
//                       symbol={symbol}
//                       title={contentHead.title}
//                       id={id}
//                     />
//                   </a>
//                 </Link>
//                 <p className="text-sm text-gray-500 truncate italic dark:text-gray-400">
//                   {description}
//                 </p>
//               </div>
//             </div>
//           </li>
//         )
//       })}
//     </ul>
//   </div>
// )

const NoteDocListItem = ({ noteDoc }: { noteDoc: NoteDocFragment }) => {
  const { id, symbol, meta, contentHead, mergePollId } = noteDoc
  const { icon, description } = toMergeComponents(
    meta.mergeState,
    mergePollId ?? undefined,
  )
  return (
    <li key={id}>
      <div className="flex items-center space-x-2 py-2">
        <div className="flex-shrink-0 mt-0.5 mr-2">{icon}</div>
        <div className="flex-1 min-w-0">
          <Link href={getNotePageURL(symbol, id)}>
            <a className="text-base font-base text-blue-600 dark:text-white hover:underline">
              <SymbolDecorate
                symbol={symbol}
                title={contentHead.title}
                id={id}
              />
            </a>
          </Link>
          <p className="text-sm text-gray-500 truncate italic dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </li>
  )
}

interface Props {
  noteDocs: NoteDocFragment[]
}

const NoteDocList = ({ noteDocs }: Props) => {
  return (
    <div className="w-full dark:bg-gray-800 dark:border-gray-700">
      {/* <div className="flex justify-between items-center mb-2">
        <h2 className="leading-none">Commits</h2>
        <a
          href="#"
          className="text-sm text-blue-600 hover:underline dark:text-blue-500"
        >
          View all
        </a>
      </div> */}
      <div>
        {noteDocs.length > 0 ? (
          <ul
            role="list"
            className="divide-y divide-gray-200 dark:divide-gray-700"
          >
            {noteDocs.map(e => (
              <li key={e.id} className="py-2 sm:py-3">
                <div className="flex items-center space-x-4">
                  <NoteDocListItem noteDoc={e} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">Empty :{'('}</p>
        )}
      </div>
    </div>
  )
}

export default NoteDocList
