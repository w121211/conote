import React from 'react'
import { RouteComponentProps, Redirect, Link, navigate } from '@reach/router'
import { useQuery } from '@apollo/client'
import { Row, Col, Badge, Button, Card, Radio, Space, List, Typography, Layout, Divider, Drawer, Modal } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import * as queries from '../../store/queries'
import * as QT from '../../store/queryTypes'
import { Pane } from '../../components/layout'
// import { Post } from '../components/tile'
// import { RepliedPostList } from '../components/postList'

// %24AADR

interface PostSingleProps {
  id: string
  me?: QT.me_me
}

// const PostThread: React.FC<PostSingleProps> = ({ id, me }) => {
//   const queryPost = useQuery<QT.post, QT.postVariables>(
//     queries.BLOCK,
//     // queries.POST, { variables: { id } }
//   )

//   if (queryPost.loading) return null
//   if (!queryPost.data) return <p>something goes wrong</p>

//   return (
//     <>
//       <Post post={queryPost.data.post} me={me} folded={false} choice="choice" />

//       {/* <div style={{ textAlign: "center" }}>
//         <Typography.Title level={4}>Replies</Typography.Title>
//       </div> */}

//       <br />
//       <Typography.Title level={4}>回覆</Typography.Title>
//       <RepliedPostList parent={queryPost.data.post} me={me} noHeader />
//     </>
//   )
// }


interface PostThreadPageProps extends RouteComponentProps<{ id: string }> {
  me?: QT.me_me
}
// interface PostThreadPageProps {
// location?: WindowLocation<{ parent: QT.post_post }>
// location?: WindowLocation<{ id: string }>
// isLoggedIn?: boolean
// }


export const PostThreadPage: React.FC<PostThreadPageProps> = ({ id, me }) => {
  if (!id) return <Redirect to="/" />
  // if (!location?.state.id) return <Redirect to="/" />

  // return <Symbol name={decodeURIComponent(name)} />
  return (
    <Layout>
      <Layout.Content>
        <Pane
          left={
            <Button type="link" size="large" onClick={() => { navigate(-1) }} >
              <ArrowLeftOutlined />
            </Button>
          }
        />

        {/* <Pane left={<PostThread id={decodeURIComponent(id)} me={me} />} /> */}
      </Layout.Content>

      <Layout.Footer />
    </Layout>

  )
}