import React, { useState } from 'react'
import { RouteComponentProps, Redirect, Link, navigate } from '@reach/router'
import { useQuery } from '@apollo/client'
import { Button, Layout } from 'antd'
import * as queries from '../graphql/queries'
import * as QT from '../graphql/query-types'
import { SearchAllForm } from '../components/forms'
import { QueryCommentModal } from '../components/tile'
import { getCardUrlParam } from '../helper'
import { PollForm } from '../components/poll-form'

interface RouteProps extends RouteComponentProps {
  me?: QT.me_me
}

export function DebugPage({ me }: RouteProps): JSX.Element {
  return (
    <Layout.Content className="site-layout-background content" style={{ minHeight: 280 }}>
      <QueryCommentModal commentId={'169'}>
        <div>a comment</div>
      </QueryCommentModal>
    </Layout.Content>
  )
}
