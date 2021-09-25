import React, { useState, useEffect, CSSProperties } from 'react'
import { useRouter } from 'next/router'
import Creatable from 'react-select/creatable'
import { toUrlParams } from '../lib/helper'
import { useSearchAllLazyQuery } from '../apollo/query.graphql'
import { ActionMeta, GroupTypeBase, Styles } from 'react-select'
const components = {
  DropdownIndicator: null,
}
const createOption = (label: string) => ({
  label,
  value: label.toUpperCase().replace(/\W/g, ''),
})

type Option = {
  label: string
  value: string
}

export function SearchAllForm(): JSX.Element {
  const router = useRouter()
  const [searchAll, { loading, data }] = useSearchAllLazyQuery()
  const [options, setOptions] = useState<Option[]>([])
  const [value, setValue] = useState<Option | null>()
  const [inputValue, setInputValue] = useState('')
  const [openMenu, setOpenMenu] = useState(false)

  // console.log(data?.searchAll)
  useEffect(() => {
    if (data && data.searchAll) {
      setOptions(data.searchAll.map(e => ({ label: e, value: e })))
    }
  }, [data])

  const handleChange = (value: Option | null, action: ActionMeta<Option>) => {
    setValue(value)
  }

  const handleCreate = (inputValue: string) => {
    // const newOption = createOption(inputValue)
    // setOptions(prev => [...prev, newOption])
  }
  const handleInput = (value: string, action: any) => {
    setInputValue(value)
    if (value) {
      setOpenMenu(true)
      searchAll({ variables: { term: value } })
    }
    if (!value) {
      setOpenMenu(false)
    }
  }

  const customStyles: Partial<Styles<Option, false, GroupTypeBase<Option>>> = {
    container: (provided: any, state: any) => ({
      ...provided,
      flex: '1',
    }),
    menu: (provided: any, state: any) => ({
      ...provided,
      width: '100%',
      minHeight: '30px',
      border: 'none',
      borderRadius: '10px',
      boxShadow: '0 1px 6px 0 #17171730',
    }),
    control: (provided, { isFocused }) => ({
      ...provided,
      width: '100%',
      maxHeight: '30px',
      whiteSpace: 'nowrap',
      borderRadius: '99px',

      // borderColor: isFocused ? '#5c6cda' : 'hsl(0, 0%, 80%)',
      ':hover': {
        borderColor: '#fff',
        boxShadow: '0 1px 6px 0 #17171730',
      },
      borderColor: isFocused ? '#fff' : 'hsl(0, 0%, 80%)',
      boxShadow: isFocused ? '0 1px 6px 0 #17171730' : 'none',
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      padding: '0 8px',
    }),
  }

  return (
    <Creatable
      components={components}
      styles={customStyles}
      isClearable
      options={options}
      inputValue={inputValue}
      onInputChange={handleInput}
      value={value}
      onChange={handleChange}
      onCreateOption={handleCreate}
      menuIsOpen={openMenu}
      placeholder="搜尋全站"

      // onClick={() => {
      //   setOpenMenu(prev => !prev)
      // }}
      // onSelect={(value: string) => {
      //   // console.log('onSelect', data)
      //   if (value.startsWith('$') || value.startsWith('[')) {
      //     // navigate(`/card?${toUrlParams({ s: value })}`)
      //     router.push(`/card?${toUrlParams({ s: value })}`)
      //   }
      //   // else if (value.startsWith('['))
      // }}
      // onSearch={(term: string) => {
      //   console.log(`search term: ${term}`)
      //   if (term.length === 0) {
      //     setOptions([])
      //   } else {
      //     searchAll({ variables: { term } })
      //   }
      // }}
      // filterOption={(inputValue, option) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
      // placeholder="input here"
    />
    //   {/* <Input
    //     placeholder="搜尋全站: $BA, Google, 自動駕駛"
    //     onChange={e => setInputValue(e.target.value)}
    //     onKeyDown={e => {
    //       if (e.key === 'Enter') {
    //         if (inputValue.startsWith('$') || inputValue.startsWith('[')) {
    //           // navigate(`/card?${toUrlParams({ s: value })}`)
    //           router.push(`/card?${toUrlParams({ s: inputValue.toUpperCase() })}`)
    //         }
    //       }
    //     }}
    //   /> */}
    // {/* </AutoComplete> */}
  )
}
