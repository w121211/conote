import React, { Children, useContext, useEffect, useState } from 'react'
import Select, {
  ControlProps,
  components,
  SingleValueProps,
  GroupBase,
  SingleValue,
  OptionProps,
} from 'react-select'
import { ListItem } from '../ui-component/list-item'
import ToggleMenu from '../ui-component/toggle-menu'
import { DomainType } from './domain'
import { DomainContext } from './domain-context'

const mockData = ['main', 'test1', 'test2']

const DomainSelect = () => {
  const [candidate, setCandidate] = useState('main')
  // const { domain, setDomain } = useContext(DomainContext)
  // const [value, setValue] = useState<BranchOption>({
  //   label: 'dev/',
  //   value: 'dev',
  // })

  // useEffect(() => {
  //   const foundDomain = branchOptions.find(({ value }) => {
  //     return value === domain
  //   })
  //   if (foundDomain) {
  //     setValue(foundDomain)
  //   }
  // }, [domain])

  const onClick = () => {
    setCandidate(candidate)
  }

  return (
    <ToggleMenu summary={<button className="btn-primary">{candidate}</button>}>
      <ul>
        {mockData.map((title, i) => {
          return (
            <ListItem key={i} onClick={onClick}>
              <a>{title}</a>
            </ListItem>
          )
        })}
      </ul>
    </ToggleMenu>
    // <Select
    //   value={value}
    //   onChange={onChange}
    //   options={branchOptions}
    //   isSearchable={false}
    //   //   menuIsOpen
    //   styles={{
    //     // container: base => ({ ...base, flexGrow: 1 }),
    //     control: base => ({
    //       ...base,
    //       width: 'fit-content',
    //       height: 'fit-content',
    //       minHeight: 'fit-content',
    //       boxShadow: 'none',
    //     }),
    //     menu: base => ({
    //       ...base,
    //       width: 'fit-content',
    //       // fontSize: '12px',
    //     }),
    //     option: base => ({
    //       ...base,
    //       paddingTop: '2px',
    //       paddingBottom: '2px',
    //       cursor: 'pointer',
    //     }),
    //     // singleValue: base => ({ ...base, color: 'rgb(107 114 128)' }),
    //     valueContainer: base => ({
    //       ...base,
    //       padding: 0,
    //     }),
    //     // dropdownIndicator: (base, state) => ({
    //     //   ...base,
    //     //   display: 'flex',
    //     //   padding: '0px ',
    //     //   color: 'white',
    //     //   ':hover': { color: 'white' },
    //     //   // transform: 'scale(0.7)',
    //     // }),
    //     // indicatorsContainer: base => ({ ...base, transform: 'scale(0.6)' }),
    //   }}
    //   components={{
    //     IndicatorSeparator: null,
    //     Control: ControlComponent,
    //     SingleValue: SingleValueComponent,
    //     DropdownIndicator: null,
    //     // Option: OptionComponent,
    //   }}
    // />
  )
}

export default DomainSelect
