import { useRouter } from 'next/router'
import React from 'react'
import DiscussFullPage from '../../components/discuss/full-page/full-page'
import Layout from '../../components/layout'

const DiscussPage = () => {
  const router = useRouter()
  return (
    <Layout>
      {router.query.discussId && typeof router.query.discussId === 'string' && (
        <DiscussFullPage id={router.query.discussId} />
      )}
    </Layout>
  )
}

export default DiscussPage
