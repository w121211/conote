import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { AutoComplete, Input } from 'antd'
import { toUrlParams } from '../lib/helper'
import { useSearchAllLazyQuery } from '../apollo/query.graphql'

export function SearchAllForm(): JSX.Element {
  const router = useRouter()
  const [searchAll, { loading, data }] = useSearchAllLazyQuery()
  const [options, setOptions] = useState<{ value: string }[]>([])
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (data && data.searchAll) {
      setOptions(data.searchAll.map(e => ({ value: e })))
    }
  }, [data])

  return (
    <AutoComplete
      options={options}
      onSelect={(value: string) => {
        // console.log('onSelect', data)
        if (value.startsWith('$') || value.startsWith('[')) {
          // navigate(`/card?${toUrlParams({ s: value })}`)
          router.push(`/card?${toUrlParams({ s: value })}`)
        }
        // else if (value.startsWith('['))
      }}
      onSearch={(term: string) => {
        console.log(`search term: ${term}`)
        if (term.length === 0) {
          setOptions([])
        } else {
          searchAll({ variables: { term } })
        }
      }}
      filterOption={(inputValue, option) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
      // placeholder="input here"
    >
      <Input
        placeholder="搜尋全站: $BA, Google, 自動駕駛"
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            if (inputValue.startsWith('$') || inputValue.startsWith('[')) {
              // navigate(`/card?${toUrlParams({ s: value })}`)
              router.push(`/card?${toUrlParams({ s: inputValue.toUpperCase() })}`)
            }
          }
        }}
      />
    </AutoComplete>
  )
}
