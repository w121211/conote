import React from 'react'
import Select, { GroupBase, OptionsOrGroups } from 'react-select'
import MyNoteDocsExportEl from '../frontend/components/note/MyNoteDocsExportEl'
import MyNoteDraftsExportEl from '../frontend/components/note/MyNoteDraftssExportEl'

type Option = {
  value: string
  label: string
}

function isSelectOptions(inputs: any): inputs is Option[] {
  if (Array.isArray(inputs)) {
    return inputs.every(
      e => typeof e.value === 'string' && typeof e.label === 'string',
    )
  }
  return false
}

const mockData = [
  {
    title: 'Default note display',
    inputs: [
      { value: 'draft', label: 'Draft' },
      { value: 'candidates', label: 'Candidates' },
      { value: 'main', label: 'Main' },
      { value: 'blank', label: 'Blank' },
    ],
  },
  {
    title: 'Appearance',
    inputs: [
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
      { value: 'system', label: 'System' },
    ],
  },
  {
    title: 'Test',
    inputs: 'fasdf',
  },
]

const SettingPage = () => {
  return (
    <div className="pb-32">
      <h2 className="py-3 border-b border-gray-300 text-gray-900 text-2xl">
        Settings
      </h2>
      {/* --- setting form --- */}
      {mockData.map(({ title, inputs }) => {
        if (isSelectOptions(inputs)) {
          return (
            <form key={title} className="text-sm">
              <dl className="my-8">
                <dt className="mb-2 font-bold text-gray-700">{title}</dt>
                <dd>
                  <Select
                    defaultValue={inputs[0]}
                    options={inputs}
                    styles={{
                      container: base => ({ ...base, width: 'fit-content' }),
                    }}
                  />
                </dd>
              </dl>
            </form>
          )
        }
        return (
          <form key={title}>
            <dl className="my-8">
              <dt className="mb-2 font-bold text-gray-700">{title}</dt>
              <dd>
                {inputs}
                {/* <input type="text" value={inputs}/> */}
              </dd>
            </dl>
          </form>
        )
      })}
    </div>
  )
}

const Page = (): JSX.Element | null => {
  return (
    <div className="pb-32">
      <h2 className="py-3 border-b border-gray-300 text-gray-900 text-2xl">
        Settings
      </h2>

      <div className="my-8">
        <dl>
          <dt className="mb-2 font-bold text-gray-700">
            Export and download all your committed notes
          </dt>
          <dd>
            <MyNoteDocsExportEl />
          </dd>
        </dl>
      </div>

      <div className="my-8">
        <dl>
          <dt className="mb-2 font-bold text-gray-700">
            Export and download all your drafts
          </dt>
          <dd>
            <MyNoteDraftsExportEl />
          </dd>
        </dl>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  return {
    props: {
      protected: true,
    },
  }
}

export default Page
