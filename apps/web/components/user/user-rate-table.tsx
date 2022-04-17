import React from 'react'
import { RateTable } from '../../layout/rate-table'

export type TableData = {
  title?: string
  ticker: string
  srcSym: string
  author?: string
  rate: string
}

const UserRateTable = ({ data }: { data: TableData[] }): JSX.Element => {
  return <RateTable data={data} />
}

export default UserRateTable
