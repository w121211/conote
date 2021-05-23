import React, { useState } from 'react'
import { useMeQuery, useSignInMutation } from '../../backend-nextjs/apollo/query.graphql'

export function AutoLogin(): JSX.Element | null {
  // const [a, setA] = useState(123)
  // console.log(typeof refetch)
  // const me = useQuery<QT.me>(queries.ME)
  const me = useMeQuery()
  const [login, { data, loading }] = useSignInMutation({
    onCompleted() {
      me.refetch()
    },
  })

  // const [login, { data, loading }] = useMutation<QT.login, QT.loginVariables>(queries.LOGIN, {
  //   onCompleted() {
  //     me.refetch()
  //   },
  // })
  // if (me.data) {
  //   console.log('got me data')
  //   console.log(me.data)
  // } else {
  //   console.log('no me data')
  // }

  if (loading) return null
  if (!data) {
    login({
      variables: {
        email: 'aaa@aaa.com',
        password: 'aaa',
      },
    })
    console.log('logging...')
    // me.refetch()
  } else {
    console.log('login successed!')
    console.log(data)
    // me.refetch()
  }

  return null
  // return <h1>Auto Login</h1>
}
