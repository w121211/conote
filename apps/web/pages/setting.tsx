import React from 'react'
import Select, { GroupBase, OptionsOrGroups } from 'react-select'
import Layout from '../frontend/components/ui-component/layout/layout'
import { LayoutChildrenPadding } from '../frontend/components/ui-component/layout/layout-children-padding'

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
    <LayoutChildrenPadding>
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
    </LayoutChildrenPadding>
  )
}

export default SettingPage
