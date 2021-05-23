import React, { useState } from 'react'
import { Table } from 'antd'

export function SomeTable() {
  const columns = [
    {
      title: 'Ticker',
      dataIndex: 'ticker',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      // sorter: {
      //     compare: (a: any, b: any) => a.chinese - b.chinese,
      //     multiple: 3,
      // },
    },
    {
      title: 'Change',
      dataIndex: 'change',
      // sorter: {
      //     compare: (a: any, b: any) => a.math - b.math,
      //     multiple: 2,
      // },
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      // sorter: {
      //     compare: (a: any, b: any) => a.english - b.english,
      //     multiple: 1,
      // },
    },
  ]
  const data = [
    {
      key: 1,
      ticker: '$AAA',
      price: 23.7,
      change: 1.2,
      volume: 10.3,
    },
    {
      key: 2,
      ticker: '$AAA',
      price: 23.7,
      change: 1.2,
      volume: 10.3,
    },
  ]

  // function onChange(pagination, filters, sorter, extra) {
  //     console.log('params', pagination, filters, sorter, extra);
  // }

  // return <Table columns={columns} dataSource={data} onChange={onChange} />
  return <Table columns={columns} dataSource={data} />
}
