import localizedFormat from 'dayjs/plugin/localizedFormat'
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  Alert,
  AutoComplete,
  Form,
  Input,
  Button,
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Radio,
  Popover,
  Space,
} from 'antd'
import { FormInstance } from 'antd/lib/form'
import * as queries from '../graphql/queries'
import * as QT from '../graphql/query-types'

const hashSymbols = [{ value: '#aaa' }, { value: '#bbb' }]

const dollarSymbols = [{ value: '$123' }, { value: '$456' }]

interface PopoverSymbolProps {
  symbol: string
  removeSymbol: (a: string) => void
}

const PopoverSymbol: React.FC<PopoverSymbolProps> = ({ symbol, removeSymbol }) => {
  const [visible, setVisible] = useState<boolean>(false)
  return (
    <Popover
      content={
        <>
          <Button
            type="link"
            onClick={() => {
              removeSymbol(symbol)
              setVisible(false)
            }}
          >
            刪除
          </Button>
        </>
      }
      trigger="click"
      visible={visible}
      onVisibleChange={visible => setVisible(visible)}
    >
      <Button type="link">{symbol}</Button>
    </Popover>
  )
}

interface SymbolAutoCompleteProps {
  form: FormInstance
  cat?: string
  // cat?: QT.PostCat
}

export const SymbolAutoComplete: React.FC<SymbolAutoCompleteProps> = ({ form, cat }) => {
  const [symbols, setSymbols] = useState<string[]>(form.getFieldValue('symbols'))
  const [value, setValue] = useState<string>('')
  const [options, setOptions] = useState<{ value: string }[]>([])

  useEffect(() => {
    // form.getFieldValue
    setSymbols(form.getFieldValue('symbols'))
  }, [form, cat])

  function addSymbol(name: string) {
    const _symbols = Array.from(new Set(symbols).add(name))
    setSymbols(_symbols)
    // form.setFields([{ name: "symbols", value: _symbols }])
    form.setFieldsValue({ symbols: _symbols })
  }

  function removeSymbol(name: string) {
    const _symbols = symbols.filter(x => x !== name)
    setSymbols(_symbols)
    form.setFieldsValue({ symbols: _symbols })
  }

  function onSearch(data: string) {
    if (data.includes('#')) setOptions(hashSymbols)
    else if (data.includes('$')) setOptions(dollarSymbols)
    else setOptions([])
    // setOptions([{ value: "沒有找到" }])
  }

  function onSelect(data: string) {
    addSymbol(data)
    setValue('')
  }

  function onChange(data: string) {
    setValue(data)
  }

  return (
    <>
      {symbols.map((item, i) => (
        <PopoverSymbol key={i} symbol={item} removeSymbol={removeSymbol} />
      ))}
      <AutoComplete
        value={value}
        options={options}
        style={{ width: 120 }}
        onSelect={onSelect}
        onSearch={onSearch}
        onChange={onChange}
        placeholder="輸入#, $搜尋"
      />
      {/* 建議：
      {
        suggestSymbols.map((item, i) => {
          if (symbols.includes(item))
            return null
          return <Button type="link" key={i} onClick={() => { addSymbol(item) }}>{item}</Button>
        })
      } */}
    </>
  )
}
