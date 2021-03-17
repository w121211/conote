import React from 'react'
import { RouteComponentProps } from "@reach/router"
import { Form, Input, Row, Col, Layout, Button, Typography } from 'antd'


const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 10 },
};


export function Signup(props: RouteComponentProps) {
  const [form] = Form.useForm();

  const onGenderChange = (value: any) => {
    switch (value) {
      case "male":
        form.setFieldsValue({ note: "Hi, man!" });
        return;
      case "female":
        form.setFieldsValue({ note: "Hi, lady!" });
        return;
      case "other":
        form.setFieldsValue({ note: "Hi there!" });
        return;
    }
  };

  const onFinish = (values: any) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFill = () => {
    form.setFieldsValue({
      email: 'aaa@aaa.com',
      password: 'aaa',
    });
  };

  return (
    <Layout>
      <Layout.Content style={{ margin: 30 }}>
        <Row justify="center" align="middle">
          <Col span={12}>
            <Typography.Title>Signup</Typography.Title>
            <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
              <Form.Item name="email" label="Email" rules={[{ required: true }, { type: "email" }]} validateTrigger="onSubmit">
                <Input />
              </Form.Item>
              <Form.Item name="password" label="Password" rules={[{ required: true }]} validateTrigger="onSubmit">
                <Input.Password />
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  Submit
                    </Button>
                <Button htmlType="button" onClick={onReset}>
                  Reset
                    </Button>
                <Button type="link" htmlType="button" onClick={onFill}>
                  Fill form
                    </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  )


}