import React, { ReactNode, useState } from 'react'
import { Modal, Button, Input, Form } from 'antd'
import classes from './preview.module.scss'

const { TextArea } = Input

const MyModal = ({
  previewVisible,
  onSubmit,
  handleCancel,
  children,
}: {
  previewVisible?: boolean
  onSubmit?: (e: any) => void
  handleCancel?: (e: any) => void
  children?: ReactNode
}) => {
  //   const [state, setState] = useState({ visible: false })

  //   const showModal = () => {
  //     setState({
  //       visible: true,
  //     })
  //   }
  // const [form] = Form.useForm()
  const [button, setButton] = useState({ visible: false, loading: false })

  // const handleCancel = () => {
  //   // console.log(e)
  //   setButton({
  //     ...button,
  //     visible: false,
  //   })
  // }

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
        visible={previewVisible}
        onOk={onSubmit}
        onCancel={handleCancel}
        style={{ top: 20 }}
        okText={'送出'}
        cancelText={'取消'}
        // footer={[
        //   <Button key="submit" type="primary" onClick={handleOk}>
        //     送出
        //   </Button>,
        //   <Button key="back" onClick={handleCancel}>
        //     取消
        //   </Button>,
        // ]}
      >
        {/* <TextArea placeholder="寫下留言..." autoSize={{ minRows: 3 }} /> */}
        {children}
      </Modal>
    </div>
  )
}

export default MyModal
