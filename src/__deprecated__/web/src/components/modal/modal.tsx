import React, { useState } from 'react'
import { Modal, Button, Input } from 'antd'
import classes from './modal.module.scss'

const { TextArea } = Input

const MyModal = ({
  modalVisible,
  handleOk,
  handleCancel,
}: {
  modalVisible?: boolean
  handleOk?: (e: any) => void
  handleCancel?: (e: any) => void
}) => {
  //   const [state, setState] = useState({ visible: false })

  //   const showModal = () => {
  //     setState({
  //       visible: true,
  //     })
  //   }

  //   const handleOk = (e: any) => {
  //     console.log(e)
  //     setState({
  //       visible: false,
  //     })
  //   }

  //   const handleCancel = (e: any) => {
  //     console.log(e)
  //     setState({
  //       visible: false,
  //     })
  //   }
  const clickHandler = (e: any) => {
    e.stopPropagation()
  }

  return (
    <div onClick={clickHandler}>
      {/* <Button type="primary" onClick={showModal}>
                新增留言
            </Button> */}
      <Modal
        // title="留言"
        wrapClassName={classes.Modal}
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <TextArea placeholder="寫下留言..." autoSize={{ minRows: 3 }} />
      </Modal>
    </div>
  )
}

export default MyModal
