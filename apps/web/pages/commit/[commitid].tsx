import React from 'react'
import { useRouter } from 'next/router'
import DiscussPageEl from '../../components/discuss/discuss-page-el'
import Layout from '../../layout/layout'

const CommitPage = () => {
  const router = useRouter()
  return (
    <Layout>
      {router.query.discussId && typeof router.query.discussId === 'string' && (
        <DiscussPageEl id={router.query.discussId} />
      )}
    </Layout>
  )
}

export default CommitPage
