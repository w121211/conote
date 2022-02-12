import { useRouter } from 'next/router'
import React from 'react'
import DiscussFullPage from '../../components/discuss/discuss-full-page'
import Layout from '../../components/layout'

const DiscussPage = () => {
  const router = useRouter()

  return (
    <Layout>
      {router.query.discuss && typeof router.query.discuss === 'string' && (
        <DiscussFullPage id={router.query.discuss} />
      )}
    </Layout>
  )
}

export default DiscussPage
