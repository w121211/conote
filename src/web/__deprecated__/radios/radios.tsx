import React, { useState } from 'react'
import { Radio, Space } from 'antd'
import BarChart from '../../components/bar/bar'
import classes from './radios.module.scss'

type RadioArr = {
  label: string
  counts: number
}

interface Props {
  title?: string
  data: string[]
  // buttonText: string[]
  // counts?: number[]
  countsHandler?: (prevIdx: number | null, countIdx: number) => void
  // mykey: string
}

const Radios = (props: Props) => {
  const [value, setValue] = useState<number | null>(null)
  // const [countsArr,setCountsArr]=useState(props.counts)
  const totalArr: number[] = []
  // props.data.forEach(el => totalArr.push(el.counts))
  const onChange = (e: any) => {
    console.log('radio checked', e.target.value)
    props.countsHandler && props.countsHandler(value, e.target.value)
    setValue(e.target.value)
    // setCountsArr
  }
  // const radioGroup = props.buttonText.map((text: string) => <Radio.Button value={text}>{text}</Radio.Button>)
  return (
    <div className={classes.RadioWrapper}>
      {/* {props.title ? <h4>{props.title}</h4> : null} */}
      <Radio.Group size="small" value={value} onChange={onChange}>
        <Space direction="vertical" size={0}>
          {props.data.map((el, idx) => (
            <>
              <Radio value={idx} key={idx}>
                {/* {el.label} */}
                {/* {el.counts} */}
              </Radio>
              {/* <BarChart total={totalArr.reduce((a, b) => a + b)} count={el.counts} /> */}
            </>
          ))}
          <div style={{ fontSize: '10px', color: '#75848f' }}>{`共${totalArr.reduce((a, b) => a + b)}人參與投票`}</div>
          {/* {radioGroup} */}
        </Space>
      </Radio.Group>
    </div>
  )
}

export default Radios
