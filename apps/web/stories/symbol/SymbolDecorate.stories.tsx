import { ComponentMeta } from '@storybook/react'
import React from 'react'
import NoteDocEl from '../../frontend/components/note/NoteDocEl'
import { NoteFragment } from '../../apollo/query.graphql'
import { mockNoteFragments } from '../../test/__mocks__/note-fragment.mock'
import { mockNoteDocFragments } from '../../test/__mocks__/note-doc-fragment.mock'
import SymbolDecorate from '../../frontend/components/symbol/SymbolDecorate'

const urls = [
  'https://stackoverflow.com/questions/66032487/jest-expect-to-array-contains-element',
  'https://www.google.com/search?q=%E6%8B%AC%E8%99%9F+%E8%8B%B1%E6%96%87&rlz=1C5CHFA_enTW989TW990&sxsrf=ALiCzsZg1ePnGqgxfIIrMoiIGOvS_GbZpw%3A1659767590131&ei=JgvuYtfBB8WB2roP1JO6sAQ&ved=0ahUKEwjX7PmMzLH5AhXFgFYBHdSJDkYQ4dUDCA4&uact=5&oq=%E6%8B%AC%E8%99%9F+%E8%8B%B1%E6%96%87&gs_lcp=Cgdnd3Mtd2l6EAMyBQgAEMQCMgUIABCABDIECAAQHjIGCAAQHhAPMgYIABAeEA8yBggAEB4QDzIECAAQHjIGCAAQHhAPMgYIABAeEA8yBAgAEB46BwgjELADECc6BwgAEEcQsAM6BAgAEEM6CwgAEIAEELEDEIMBOggIABCABBCxAzoFCC4QgAQ6CwguEIAEEMcBENEDOgcIABAeEMkDOgcIIxDqAhAnOggILhCABBDUAjoLCC4QgAQQxwEQrwFKBAhBGABKBAhGGABQ8AJYux5g6CBoB3ABeACAAZsBiAGnEZIBBDAuMTiYAQCgAQGwAQrIAQrAAQE&sclient=gws-wiz',
]

const samples = {
  topic: {
    okay: [
      '[[Hello world 123]]',
      '[[みんなの日本語 Min na no ni hon go]]',
      '[[Punctuations allowed , . - _ () ]]',
    ],
  },
  url: {
    okay: urls.map(e => `[[${e}]]`),
    fail: urls,
  },
}

export default {
  component: SymbolDecorate,
} as ComponentMeta<typeof SymbolDecorate>

export const Base = () => {
  return (
    <div>
      {samples.topic.okay.map(e => (
        <div key={e} className="px-5 py-2">
          <SymbolDecorate symbolStr={e} />
        </div>
      ))}
      {samples.url.okay.map(e => (
        <div key={e} className="px-5 py-2">
          <SymbolDecorate
            key={e}
            symbolStr={e}
            title={'Check if a JavaScript string is a URL'}
          />
        </div>
      ))}
    </div>
  )
}
