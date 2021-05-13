import React, { useState, forwardRef, LegacyRef } from 'react'
import { Input, Button, Form } from 'antd'

import classes from './myTextArea.module.scss'
// import { TextAreaRef } from 'antd/lib/input/TextArea'

const { TextArea } = Input

interface props {
  size?: string
  placeHolder?: string
  clickHandler: () => void
}

const MyTextArea = (props: props) => {
  const [commentValue, setValue] = useState('')

  const [buttonDisable, setButtonState] = useState(true)

  const onChangeHandler = (e: any) => {
    const texts = e.target.value
    setValue(texts)
    buttonStateHandler(texts)
  }
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
    <>
      <Form.Item className={classLister(classes.Wrapper)} name="text">
        <TextArea
          className={classes.TextArea}
          placeholder={props.placeHolder ? props.placeHolder : '留言...'}
          autoSize
          onChange={onChangeHandler}
          id="commentTextArea"
        />
      </Form.Item>
      <Button type="text" disabled={buttonDisable} onClick={props.clickHandler}>
        送出
      </Button>
    </>
  )
}
export default MyTextArea
