import React, { useState, useEffect, CSSProperties } from 'react'
import { useRouter } from 'next/router'
import Creatable from 'react-select/creatable'
// import { toUrlParams } from '../lib/helper'
import { useSearchSymbolLazyQuery } from '../apollo/query.graphql'
import { ActionMeta, GroupBase, Options, OptionsOrGroups, StylesConfig } from 'react-select'
import { Accessors } from 'react-select/dist/declarations/src/useCreatable'
import { cloneDeep } from 'lodash'

type Option = {
  label: string
  value: string
}

export function SearchAllForm({ small }: { small?: boolean }): JSX.Element {
  const router = useRouter()
  const [searchSymbol, { loading, data }] = useSearchSymbolLazyQuery()
  const [options, setOptions] = useState<Option[]>([])
  const [value, setValue] = useState<Option | null>()
  const [inputValue, setInputValue] = useState('')
  const [openMenu, setOpenMenu] = useState(false)

  const components = {
    DropdownIndicator: null,
  }
  const createOption = (label: string) => ({
    label,
    value: label.toUpperCase().replace(/\W/g, ''),
  })

  // console.log(data?.searchAll)
  useEffect(() => {
    if (data && data.searchSymbol) {
      const colon = cloneDeep(data.searchSymbol)
      setOptions(colon.map(e => ({ label: e.str, value: e.id })))
    }
  }, [data])

  const handleChange = (value: Option | null, action: ActionMeta<Option>) => {
    if (action.action === 'select-option' && value) {
      router.push(`/card/${encodeURIComponent(value.value)}`)
    }
    setValue(value)
  }

  const handleCreate = (inputValue: string) => {
    const newOption = createOption(inputValue)
    if (inputValue.startsWith('http')) {
      router.push(`/card?url=${encodeURIComponent(inputValue)}`)
    } else if (
      !inputValue.startsWith('$') &&
      !inputValue.startsWith('@') &&
      !inputValue.startsWith('[[') &&
      !inputValue.startsWith('http')
    ) {
      //未打任何記號且非 http
      router.push(`/card/${encodeURIComponent('[[' + inputValue + ']]')}`)
    } else {
      router.push(`/card/${encodeURIComponent(inputValue)}`)
    }

    // setOptions([...options, newOption])
    // setValue(newOption)
  }

  const handleInput = (value: string, action: any) => {
    const newValue = value
      .replace(/[\uff01-\uff5e]/g, fullwidthChar => String.fromCharCode(fullwidthChar.charCodeAt(0) - 0xfee0))
      .replace(/\u3000/g, '\u0020')
    setInputValue(newValue)
    if (newValue) {
      setOpenMenu(true)
      searchSymbol({ variables: { term: newValue } })
    }
    if (!newValue) {
      setOpenMenu(false)
    }
  }
  const handleShowCreate = (
    inputValue: string,
    value: Options<Option>,
    options: OptionsOrGroups<Option, GroupBase<Option>>,
    acc: Accessors<Option>,
  ) => {
    // console.log(inputValue, value, options, accor)
    if (options.find(e => e.label === `[[${inputValue}]]`)) {
      return false
    }
    return true
  }
  // const filterOption = (option, inputValue) => {
  //   const { value, label } = option
  //   console.log(option)

  //   return inputValue===
  // }

  // const customStyles: Partial<Styles<Option, false, GroupTypeBase<Option>>> = {
  const customStyles: StylesConfig<Option, false, GroupBase<Option>> = {
    container: (provided: any, state: any) => ({
      ...provided,
      // maxWidth: '36rem',
      // flex: '1',
      // padding: small ? '0 1rem' : '0',
    }),
    menu: (provided: any, state: any) => ({
      ...provided,
      // width: '100%',
      // minHeight: '30px',
      // height: height + 'px' ?? 'initial',
      // marginTop: '1em',
      border: 'none',
      borderRadius: '4px',
      boxShadow: '0 1px 6px 0 #17171730',
    }),
    // singleValue: (provided: any) => ({
    //   ...provided,
    //   background: 'black',
    // }),
    option: (provided: any) => ({
      ...provided,
      lineHeight: small ? '1' : 'inherit',
    }),
    control: (provided, { isFocused }) => ({
      ...provided,
      // width: '100%',

      whiteSpace: 'nowrap',
      borderRadius: '4px',
      minHeight: '40px',
      lineHeight: small ? '1' : 'inherit',
      ':hover': {
        borderColor: '#fff',
        boxShadow: '0 1px 6px 0 #17171730',
        cursor: 'text',
      },
      borderColor: isFocused ? '#fff' : 'hsl(0, 0%, 80%)',
      boxShadow: isFocused ? '0 1px 6px 0 #17171730' : 'none',
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      // padding: '0 8px',
    }),
    input: (provided, state) => ({
      ...provided,
      // display: 'flex',
      // alignItems: 'center',
    }),
  }

  return (
    <Creatable
      instanceId="search-all-form"
      components={components}
      styles={customStyles}
      isValidNewOption={handleShowCreate}
      options={options}
      inputValue={inputValue}
      onInputChange={handleInput}
      value={value}
      onChange={handleChange}
      onCreateOption={handleCreate}
      menuIsOpen={openMenu}
      placeholder="搜尋 or 新增"
      formatCreateLabel={inputValue => {
        if (!inputValue.startsWith('@') && !inputValue.startsWith('$') && !inputValue.startsWith('http')) {
          return <>創建:[[{inputValue}]]</>
        }
        return <>創建:{inputValue}</>
      }}
      // filterOption={filterOption}
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
