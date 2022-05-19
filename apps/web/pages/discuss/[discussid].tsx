import { useRouter } from 'next/router'
import React from 'react'
import { DiscussPageComponent } from '../../components/discuss/discuss-page'
import { Layout } from '../../layout/layout'

const DiscussPage = () => {
  const router = useRouter()
  return (
    <Layout>
      {router.query.discussId && typeof router.query.discussId === 'string' && (
        <DiscussPageComponent id={router.query.discussId} />
      )}
    </Layout>
  )
}

export default DiscussPage
