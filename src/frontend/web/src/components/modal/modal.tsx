import React, { useState } from 'react';
import { Modal, Button, Input } from 'antd';
import classes from './modal.module.scss';

const { TextArea } = Input

const MyModal = () => {
    const [state, setState] = useState({ visible: false })

    const showModal = () => {
        setState({
            visible: true,
        });
    };

    const handleOk = (e: any) => {
        console.log(e);
        setState({
            visible: false,
        });
    };

    const handleCancel = (e: any) => {
        console.log(e);
        setState({
            visible: false,
        });
    };

    return (
        <div className={classes.Modal}>
            <Button type="primary" onClick={showModal}>
                新增留言
            </Button>
            <Modal
                title="留言"
                visible={state.visible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <TextArea rows={3} autoSize />
            </Modal>
        </div>
    );
}

export default MyModal