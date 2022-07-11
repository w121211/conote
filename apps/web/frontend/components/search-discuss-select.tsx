import { cloneDeep } from 'lodash'
import React, { useState, useEffect, CSSProperties } from 'react'
import {
  ActionMeta,
  GroupBase,
  InputActionMeta,
  Options,
  OptionsOrGroups,
  StylesConfig,
} from 'react-select'
import Creatable from 'react-select/creatable'
import { Accessors } from 'react-select/dist/declarations/src/useCreatable'
import { useSearchDiscussLazyQuery } from '../../apollo/query.graphql'

type Option = {
  label: string
  id: string
}

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
    zIndex: '100',
  }),
  // singleValue: (provided: any) => ({
  //   ...provided,
  //   background: 'black',
  // }),
  option: (provided: any) => ({
    ...provided,
    lineHeight: 'inherit',
  }),
  control: (provided, { isFocused }) => ({
    ...provided,
    // width: '100%',

    whiteSpace: 'nowrap',
    borderRadius: '4px',
    minHeight: '40px',
    lineHeight: 'inherit',
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

export const SearchDiscussSelect = ({
  onOptionSelected,
  onCreateOptionSelected,
}: {
  onOptionSelected: (option: Option) => void
  onCreateOptionSelected: (input: string) => void
}): JSX.Element => {
  const [searchDiscuss, { data }] = useSearchDiscussLazyQuery()
  const [options, setOptions] = useState<Option[]>([])
  const [value, setValue] = useState<Option | null>()
  const [inputValue, setInputValue] = useState('')
  const [openMenu, setOpenMenu] = useState(false)

  useEffect(() => {
    if (data && data.searchDiscuss) {
      const cloned = cloneDeep(data.searchDiscuss)
      setOptions(cloned.map(e => ({ label: e.str, id: e.id })))
    }
  }, [data])

  const formatCreateLabel = (inputValue: string): JSX.Element => {
    // if (!inputValue.startsWith('@') && !inputValue.startsWith('$') && !inputValue.startsWith('http')) {
    //   return <>創建:[[{inputValue}]]</>
    // }
    // return <>Create {inputValue}</>
    return <>Create #{inputValue}#</>
  }

  const isValidNewOption = (
    inputValue: string,
    value: Options<Option>,
    options: OptionsOrGroups<Option, GroupBase<Option>>,
    acc: Accessors<Option>,
  ) => {
    // console.log(inputValue, value, options, accor)
    if (options.find(e => e.label === inputValue)) {
      return false
    }
    return true
  }

  const onChange = (newValue: Option | null, action: ActionMeta<Option>) => {
    if (action.action === 'select-option' && newValue) {
      onOptionSelected(newValue)
    }
    setValue(newValue)
  }

  const onCreateOption = (inputValue: string) => {
    onCreateOptionSelected(inputValue)
  }

  const onInputChange = (newValue: string, actionMeta: InputActionMeta) => {
    // const newValue = value
    //   .replace(/[\uff01-\uff5e]/g, fullwidthChar => String.fromCharCode(fullwidthChar.charCodeAt(0) - 0xfee0))
    //   .replace(/\u3000/g, '\u0020')
    setInputValue(newValue)
    if (newValue.length > 0) {
      setOpenMenu(true)
      searchDiscuss({ variables: { term: newValue } })
    } else {
      setOpenMenu(false)
    }
  }

  return (
    <Creatable
      instanceId="search-discuss-select"
      components={{
        DropdownIndicator: null,
      }}
      formatCreateLabel={formatCreateLabel}
      inputValue={inputValue}
      isValidNewOption={isValidNewOption}
      // menuIsOpen={openMenu}
      menuIsOpen={true}
      menuPortalTarget={document.body}
      onChange={onChange}
      onCreateOption={onCreateOption}
      onInputChange={onInputChange}
      options={options}
      placeholder="搜尋 or 新增"
      styles={customStyles}
      value={value}
      autoFocus={true}
    />
  )
}
