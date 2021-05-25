import React, { useState } from 'react'
import { RouteComponentProps, Redirect, Link, navigate } from '@reach/router'
import { useQuery } from '@apollo/client'
import { Layout } from 'antd'
import * as queries from '../graphql/queries'
import * as QT from '../graphql/query-types'

interface RouteProps extends RouteComponentProps<{ symbol: string }> {
  me?: QT.me_me
}

// export const AuthorPage: React.FC<RouteProps> = function ({ symbol, me }) {
//   const queryPage = useQuery<QT.page, QT.pageVariables>(
//     queries.PAGE, { variables: { symbolName: symbol } }
//   )
//   if (queryPage.loading)
//     return null
//   if (!queryPage.data)
//     return <p>something goes wrong</p>
//   const pg = queryPage.data.page
//   if (!pg)
//     return <h1>Null page</h1>
//   return (
//     <Layout.Content className="site-layout-background content" style={{ minHeight: 280, }}>
//       {pg.title} ({pg.props.srcAuthor})
//       <CssBlockCard title="">
//         <ul>
//           {pg.props.links &&
//             <Comment comment={pg.props.links} options={{ dispCommentAs: 'key-value', dispReplyAs: 'tag', swapText: 'Links' }} />}
//           <li>
//             <span className={blockMetaCss.span}>Publish</span>
//             {pg.props.wiki}
//           </li>
//         </ul>
//       </CssBlockCard>
//       <pre>(NEXT) Ranks</pre>
//       <pre>(NEXT) Comments: by filter</pre>
//     </Layout.Content>
//   )
// }
