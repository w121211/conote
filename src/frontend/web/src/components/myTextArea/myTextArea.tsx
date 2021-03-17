import React, { useState } from 'react'
import { Input, Button } from 'antd'

import classes from './myTextArea.module.scss'

const { TextArea } = Input

interface props {
  size?: string
  placeHolder?: string
}

const MyTextArea: React.FC<props> = (props) => {
  const [commentValue, setValue] = useState('')

  const [buttonDisable, setButtonState] = useState(true)

  const onChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    let texts = event.target.value
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

    if (props.size == "sm") classname.push(classes.small)
    return classname.join(' ')

  }

  return (
    <div className={classLister(classes.Wrapper)} onClick={onClickHandler}>
      <TextArea
        className={classes.TextArea}
        placeholder={props.placeHolder ? props.placeHolder : '留言...'}
        autoSize
        onChange={onChangeHandler}

      />
      <Button type="text" disabled={buttonDisable}>
        送出
      </Button>
    </div>
  )
}

export default MyTextArea


