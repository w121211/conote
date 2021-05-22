import React, { useState, forwardRef, LegacyRef } from 'react'
import { Input, Button } from 'antd'

import classes from './myTextArea.module.scss'
import { TextAreaRef } from 'antd/lib/input/TextArea'

const { TextArea } = Input

interface props {
  size?: string
  placeHolder?: string
}

const MyTextArea = (props: props) => {
  const [commentValue, setValue] = useState('')

  const [buttonDisable, setButtonState] = useState(true)

  // const onChangeHandler = () => {
  //   let texts = event.target.value
  //   setValue(texts)
  //   buttonStateHandler(texts)
  // }
  const buttonStateHandler = (value: string) => {
    if (value == '') {
      setButtonState(true)
    } else {
      setButtonState(false)
    }
  }

  const onClickHandler = (e: any) => {
    e.stopPropagation()
  }

  //   const { value } = commentValue

  const classLister = (oldClass: string) => {
    const classname = [oldClass]

    if (props.size == 'sm') classname.push(classes.small)
    return classname.join(' ')
  }

  return (
    <div className={classLister(classes.Wrapper)} onClick={onClickHandler}>
      <TextArea
        className={classes.TextArea}
        placeholder={props.placeHolder ? props.placeHolder : '留言...'}
        autoSize
        // onChange={onChangeHandler}
        id="commentTextArea"
      />
      <Button type="text" disabled={buttonDisable}>
        送出
      </Button>
    </div>
  )
}
export default MyTextArea
