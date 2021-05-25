import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react'
import { Input, Button, Form } from 'antd'

import classes from './myTextArea.module.scss'

// import { TextAreaRef } from 'antd/lib/input/TextArea'

const { TextArea } = Input

interface props {
  size?: string
  placeHolder?: string
  clickHandler?: () => void
  onChangeHandler?: (e: any) => void
}

const MyTextArea = forwardRef((props: props, ref) => {
  const [commentValue, setValue] = useState('')

  const [buttonDisable, setButtonState] = useState(true)
  const textAreaRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null)
  // console.log(textAreaRef)
  useImperativeHandle(ref, () => ({
    focus: () => textAreaRef?.current?.focus(),
  }))
  // const onChangeHandler = (e: any) => {
  //   const texts = e.target.value
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
    <>
      <Form.Item className={classLister(classes.Wrapper)} name="text">
        <TextArea
          className={classes.TextArea}
          placeholder={props.placeHolder ? props.placeHolder : '留言...'}
          autoSize
          // onChange={props.onChangeHandler}
          ref={textAreaRef}
        />
      </Form.Item>
      {/* <Button type="text" disabled={buttonDisable} onClick={props.clickHandler}>
        送出
      </Button> */}
    </>
  )
})

export default MyTextArea
