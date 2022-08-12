import React from 'react'
import { templateTitles } from '../../../../editor-slate/src/templates'
import { styleSymbol } from '../../../../ui/style-fc/style-symbol'
import { docTemplateSet } from '../../events'
import { Doc } from '../../interfaces'

// const Message = styled.span`
//   color: var(--body-text-color---opacity-med);
// `

// const Message = ({ children }: { children: ReactNode }) => {
//   return <span className="text-[#AAA]/50">{children}</span>
// }

export const DocPlaceholder = ({
  docUid,
  templateOnClick,
}: {
  docUid: string
  templateOnClick?: (title: string) => void
}) => {
  return (
    <div className="inline-flex flex-col mt-2">
      <p className="text-gray-700 dark:text-gray-200">Template</p>
      {templateTitles.map((title, i) => {
        return (
          <button
            key={i}
            className="flex items-center gap-1 mt-2  text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            onClick={() =>
              templateOnClick ? templateOnClick(title) : docTemplateSet(docUid)
            }
          >
            <span className="material-icons-outlined text-xl leading-none text-gray-400">
              description
            </span>
            {styleSymbol(title, '')}
          </button>
        )
      })}
    </div>
  )
}

export default DocPlaceholder
