import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Form, Input, Button, Result } from 'antd'
import { SignUpMutationVariables, useSignUpMutation } from '../apollo/query.graphql'

function SignUpForm({ signUp }: { signUp: (a: { variables: SignUpMutationVariables }) => void }) {
  // const [form] = Form.useForm()
  return (
    <Form
      // form={form}
      name="Sign Up"
      onFinish={function (values) {
        signUp({
          variables: {
            email: values.email,
            password: values.password,
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

function SignUpPage(): JSX.Element | null {
  const [signUp, { data, loading, error }] = useSignUpMutation({
    onError(e) {
      console.error(e)
    },
    errorPolicy: 'all',
  })

  if (loading) {
    return null
  }
  if (error) {
    return <Result status="warning" title="Oops! Sign Up Failed" subTitle={error.message} />
  }
  if (data && data.signUp) {
    return (
      <Result
        status="success"
        title="Successfully Signed Up"
        extra={
          <Button type="primary">
            <Link href="/signin">Go to Sign In Page</Link>
          </Button>
        }
      />
    )
  }
  return (
    <div>
      <h1>Sign Up</h1>
      <SignUpForm signUp={signUp} />
    </div>
  )
}

export default SignUpPage
