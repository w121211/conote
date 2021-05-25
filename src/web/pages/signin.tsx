import Link from 'next/link'
import { Form, Input, Button, Result } from 'antd'
import { SignInMutationVariables, useMeQuery, useSignInMutation } from '../apollo/query.graphql'

function SignInForm({ signIn }: { signIn: (a: { variables: SignInMutationVariables }) => void }) {
  // const [form] = Form.useForm()
  return (
    <Form
      // form={form}
      name="Sign In"
      onFinish={function (values) {
        signIn({
          variables: {
            email: values.email,
            password: values.password,
            // email: 'aaa@aaa.com',
            // password: 'aaa',
          },
        })
      }}
      onFinishFailed={function (errorInfo) {
        console.log('Failed:', errorInfo)
      }}
    >
      <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your username' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password' }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          送出
        </Button>
      </Form.Item>
    </Form>
  )
}

function SignInPage(): JSX.Element | null {
  // const client: ApolloClient<any> = useApolloClient()
  // const [login, { loading, error }] = useMutation<QT.login, QT.loginVariables>(
  //   queries.LOGIN,
  //   {
  //     onCompleted(data) {
  //       // localStorage.setItem('token', data.token as string)
  //       // localStorage.setItem('token', data.login as string)
  //       client.writeData({ data: { isLoggedIn: true } })
  //       // TODO: 在這裡fetch me
  //     }
  //   }
  // )
  const me = useMeQuery()
  const [signIn, { data, loading, error }] = useSignInMutation({
    onCompleted() {
      me.refetch()
    },
    onError(e) {
      // 需要這個來catch error，useMutation返回的error只是for render
      // https://stackoverflow.com/questions/59465864/handling-errors-with-react-apollo-usemutation-hook
      console.error(e)
    },
    errorPolicy: 'all',
  })

  if (loading) {
    return null
  }
  if (error) {
    return <Result status="warning" title="Oops! Log In Failed" subTitle={error.message} />
  }
  if (me.data) {
    return (
      <Result
        status="success"
        title="Successfully Logged In"
        extra={
          <Button type="primary">
            <Link href="/">Go to Main Page</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div>
      <h1>Sign In</h1>
      <SignInForm signIn={signIn} />
    </div>
  )
}

// interface ProtectedRouteProps extends RouteComponentProps {
//   // as: React.FC
//   as: React.ReactElement
//   isLoggedIn: boolean
// }

// export function ProtectedRoute({ as: Component, isLoggedIn, ...rest }: ProtectedRouteProps): JSX.Element {
//   if (isLoggedIn) {
//     return <>{React.cloneElement(Component, { ...rest })}</>
//   }
//   return <Redirect from="" to="/login" noThrow />
// }

export function AutoSignIn(): JSX.Element | null {
  const me = useMeQuery()
  const [login, { data, loading }] = useSignInMutation({
    onCompleted() {
      me.refetch()
    },
  })

  if (loading) {
    return null
  }
  if (!data) {
    login({
      variables: {
        email: 'aaa@aaa.com',
        password: 'aaa',
      },
    })
    console.log('logging')
    // me.refetch()
  } else {
    console.log(data)
    // me.refetch()
  }

  if (me.data) {
    console.log(me.data)
  } else {
    console.log('no me data')
  }

  return null
}

export default SignInPage
