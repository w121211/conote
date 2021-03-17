import React from 'react'
import { Result } from 'antd'
import { Link } from '@reach/router'

export function On404() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={<Link to="/">Back Home</Link>}
    />
  )
}
