import React, { Children, useContext, useEffect, useState } from 'react'
import Select, { ControlProps, components, SingleValueProps, GroupBase, SingleValue, OptionProps } from 'react-select'
import { ChannelType } from './channel'
import { ChannelContext } from './channel-context'

type BranchOption = {
  label: string
  value: ChannelType
}

const branchOptions: BranchOption[] = [
  { label: 'dev/', value: 'dev' },
  { label: 'fin/', value: 'fin' },
]

const ControlComponent = (props: ControlProps<BranchOption, false>) => {
  const { children, ...rest } = props
  return (
    <components.Control {...rest} className="!border-none rounded !cursor-pointer !bg-blue-600 text-xs">
      {children}
    </components.Control>
  )
}

const SingleValueComponent = (props: SingleValueProps<BranchOption, false>) => {
  const { children, ...rest } = props
  return (
    <components.SingleValue {...rest} className="!text-white">
      {children}
    </components.SingleValue>
  )
}

// const OptionComponent = (props: OptionProps<BranchOption, false>) => {
//   const { children, ...rest } = props
//   return (
//     <components.Option {...rest} className="hover:!bg-blue-200 selection:!bg-blue-500 ">
//       {children}
//     </components.Option>
//   )
// }

const ChannelSelect = () => {
  const { channel, setChannel } = useContext(ChannelContext)
  const [value, setValue] = useState<BranchOption>({ label: 'dev/', value: 'dev' })

  useEffect(() => {
    const foundChannel = branchOptions.find(({ value }) => {
      return value === channel
    })
    if (foundChannel) {
      setValue(foundChannel)
    }
  }, [channel])

  const onChange = (newValue: SingleValue<BranchOption>) => {
    if (newValue) {
      setChannel(newValue.value)
    }
  }
  return (
    <Select
      value={value}
      onChange={onChange}
      options={branchOptions}
      isSearchable={false}
      //   menuIsOpen
      styles={{
        container: base => ({ ...base, flexGrow: 1 }),
        control: base => ({
          ...base,
          width: 'fit-content',
          height: 'fit-content',
          minHeight: 'fit-content',
          boxShadow: 'none',
        }),
        menu: base => ({
          ...base,
          width: 'fit-content',
          fontSize: '12px',
        }),
        option: base => ({ ...base, paddingTop: '2px', paddingBottom: '2px', cursor: 'pointer' }),
        // singleValue: base => ({ ...base, color: 'rgb(107 114 128)' }),
        valueContainer: base => ({ ...base, paddingRight: 0, paddingLeft: '2px' }),
        dropdownIndicator: (base, state) => ({
          ...base,
          display: 'flex',
          padding: '0px ',
          color: 'white',
          ':hover': { color: 'white' },
          // transform: 'scale(0.7)',
        }),
        indicatorsContainer: base => ({ ...base, transform: 'scale(0.6)' }),
      }}
      components={{
        IndicatorSeparator: null,
        Control: ControlComponent,
        SingleValue: SingleValueComponent,
        // Option: OptionComponent,
      }}
    />
  )
}

export default ChannelSelect
