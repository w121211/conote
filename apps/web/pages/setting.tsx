import React from 'react'
import Select from 'react-select'
import { Layout } from '../components/ui-component/layout'

const SettingPage = () => {
  return (
    <Layout backgroundColor="bg-gray-100">
      <h2 className="py-3 border-b border-gray-300 text-gray-900 text-2xl">
        Settings
      </h2>
      {/* --- setting form --- */}
      <form>
        <dl className="my-4">
          <dt className="mb-2">Default note display</dt>
          <dd>
            <Select></Select>
          </dd>
        </dl>
      </form>
    </Layout>
  )
}

export default SettingPage
