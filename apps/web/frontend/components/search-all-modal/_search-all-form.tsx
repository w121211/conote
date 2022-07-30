import { cloneDeep } from 'lodash'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  ActionMeta,
  components,
  ControlProps,
  GroupBase,
  Options,
  OptionsOrGroups,
  StylesConfig,
} from 'react-select'
import Creatable from 'react-select/creatable'
import { Accessors } from 'react-select/dist/declarations/src/useCreatable'
import { useSearchSymbolLazyQuery } from '../../../apollo/query.graphql'

type Option = {
  label: string
  value: string
}

const Control = ({
  children,
  ...props
}: ControlProps<Option, false, GroupBase<Option>>) => (
  <components.Control
    {...props}
    className="!border-gray-200 hover:!border-transparent focus-within:!border-transparent"
  >
    <span className="material-icons-outlined ml-2 text-gray-400 ">search</span>
    {children}
  </components.Control>
)

const customComponents = {
  DropdownIndicator: null,
  Control,
}
export const SearchAllForm = ({ small }: { small?: boolean }): JSX.Element => {
  const router = useRouter()
  const [searchSymbol, { data }] = useSearchSymbolLazyQuery()
  const [options, setOptions] = useState<Option[]>([])
  const [value, setValue] = useState<Option | null>()
  const [inputValue, setInputValue] = useState('')
  const [openMenu, setOpenMenu] = useState(false)

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
      router.push(`/note/${encodeURIComponent(value.label)}`)
    }
    setValue(value)
  }

  const handleCreate = (inputValue: string) => {
    // const newOption = createOption(inputValue)
    if (inputValue.startsWith('http')) {
      router.push(`/note?url=${encodeURIComponent(inputValue)}`)
    } else if (
      !inputValue.startsWith('$') &&
      !inputValue.startsWith('@') &&
      !inputValue.startsWith('[[') &&
      !inputValue.startsWith('http')
    ) {
      // 未打任何記號且非 http
      router.push(`/note/${encodeURIComponent('[[' + inputValue + ']]')}`)
    } else {
      router.push(`/note/${encodeURIComponent(inputValue)}`)
    }

    // setOptions([...options, newOption])
    // setValue(newOption)
  }

  const handleInput = (value: string, action: any) => {
    const newValue = value
      .replace(/[\uff01-\uff5e]/g, fullwidthChar =>
        String.fromCharCode(fullwidthChar.charCodeAt(0) - 0xfee0),
      )
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
      // border: 'none',
      // backgroundColor: isFocused ? 'white' : '#f3f4f6',
      // mixBlendMode: 'multiply',
      whiteSpace: 'nowrap',
      borderRadius: '4px',
      minHeight: '40px',
      lineHeight: small ? '1' : 'inherit',
      ':hover': {
        // backgroundColor: 'white',
        // borderColor: '#fff',
        boxShadow: '0 1px 6px 0 #17171730',
        cursor: 'text',
      },
      // borderColor: isFocused ? '#fff' : '#f3f4f6',
      boxShadow: isFocused ? '0 1px 6px 0 #17171730' : 'none',
    }),
    // valueContainer: (provided, state) => ({
    //   ...provided,
    //   // padding: '0 8px',
    // }),
    // input: (provided, state) => ({
    //   ...provided,
    //   // display: 'flex',
    //   // alignItems: 'center',
    // }),
    placeholder: provided => ({
      ...provided,
      color: 'rgb(156 163 175)',
    }),
  }

  return (
    <Creatable
      instanceId="search-all-form"
      components={customComponents}
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
        if (
          !inputValue.startsWith('@') &&
          !inputValue.startsWith('$') &&
          !inputValue.startsWith('http')
        ) {
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
  )
}
