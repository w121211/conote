import React from 'react'
import { RouteComponentProps } from "@reach/router"
import { Radio, Input, Card, Divider, Row, Col, Typography, Tag, Button, List, Space, Form, Comment, Progress } from 'antd'
import { UpOutlined, DownOutlined, LikeOutlined, DislikeOutlined, MessageOutlined, CoffeeOutlined } from '@ant-design/icons'

// const layout = {
//   labelCol: { span: 8 },
//   wrapperCol: { span: 16 },
// }

const comments = [
  (<p>
    We supply a series of design principles, practical patterns and high quality design
    resources (Sketch and Axure), to help people create their product prototypes beautifully
    and efficiently
  </p>),
  (<p>
    We supply a series of design principles, practical patterns and high quality design
    resources (Sketch and Axure), to help people create their product prototypes beautifully
    and efficiently
  </p>),
  (<p>
    We supply a series of design principles, practical patterns and high quality design
    resources (Sketch and Axure), to help people create their product prototypes beautifully
    and efficiently
  </p>)
]

export function Board(props: RouteComponentProps) {
  const [form] = Form.useForm();
  return (
    <Row justify="center">
      <Col span={10} >

        <Space direction="vertical">

          <div>
            <br />
            <Space size={13}>
              <Tag color="#108ee9"><a>Feeds</a></Tag>
              <a>Reviews(3+)</a>
              <a><Typography.Text>@auto-cnbc</Typography.Text></a>
              <a><Typography.Text>@auto-reuters</Typography.Text></a>
            </Space>
          </div>

          <Card>
            <ul>
              <li>AAA 38%</li>
              <li>BBB 38%</li>
              <li><Typography.Text mark>[CCC]</Typography.Text> 38%</li>
            </ul>

            BBB 42%<br />
            CCC 12%<br />
          </Card>

          <Comment
            style={{ background: "white" }}
            actions={[
              <span key="comment-basic-like">
                {/* <Tooltip title="Like">
                    {createElement(action === 'liked' ? LikeFilled : LikeOutlined, {
                      onClick: like,
                    })}
                  </Tooltip> */}
                <LikeOutlined />
                <span className="comment-action">{123}</span>
              </span>,
              <span key="comment-basic-dislike">
                {/* <Tooltip title="Dislike">
                    {React.createElement(action === 'disliked' ? DislikeFilled : DislikeOutlined, {
                      onClick: dislike,
                    })}
                  </Tooltip> */}
                <DislikeOutlined />
                <span>{123}</span>
              </span>,
              <span key="msg">
                <CoffeeOutlined />123
                </span>,
              <span key="domain">source.com</span>,
              <span key="time">15:32</span>
            ]}
            content={
              <>
                <p>
                  <Tag><a>!event-aaa-bbb</a></Tag>
                  <Tag>$ABC</Tag>
                  <Tag>$OPQ</Tag>
                  <br />
                  <a><b>Ant Design, a design language for background applications, is refined by Ant UED Team</b></a>
                &nbsp;&nbsp;&nbsp;
                <br />
                  {/* Ant Design, a design language for background applications, is refined by Ant UED Team... */}

                </p>

                <Form
                  size="small"
                  layout="inline"
                  name="validate_other"
                // labelCol={{ span: 8 }}
                // wrapperCol={{ span: 16 }}
                // {...formItemLayout}
                // onFinish={onFinish}
                // initialValues={{
                //   ['input-number']: 3,
                //   ['checkbox-group']: ['A', 'B'],
                //   rate: 3.5,
                // }}
                >
                  <Form.Item
                    name="radio-group"
                  // label="Radio.Group"
                  >
                    <Radio.Group value={"a"}>
                      <Radio value="a">item 1</Radio>: 14 votes (12%) <br />
                      <Radio value="b">item 2</Radio><br />
                      <Radio value="c">item 3</Radio><br />
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                  // wrapperCol={{ offset: 8, span: 16 }}
                  >
                    <Button type="primary" htmlType="submit">
                      Vote
                        </Button>
                  </Form.Item>
                </Form>
              </>
            }
          />



          <Comment
            style={{ background: "white" }}
            actions={[
              <span key="comment-basic-like">
                {/* <Tooltip title="Like">
                    {createElement(action === 'liked' ? LikeFilled : LikeOutlined, {
                      onClick: like,
                    })}
                  </Tooltip> */}
                <LikeOutlined />
                <span className="comment-action">{123}</span>
              </span>,
              <span key="comment-basic-dislike">
                {/* <Tooltip title="Dislike">
                    {React.createElement(action === 'disliked' ? DislikeFilled : DislikeOutlined, {
                      onClick: dislike,
                    })}
                  </Tooltip> */}
                <DislikeOutlined />
                <span>{123}</span>
              </span>,
              <span key="msg">
                <CoffeeOutlined />123
                </span>,
              <span key="domain">source.com</span>,
              <span key="time">15:32</span>
            ]}
            content={
              <p>
                <Tag><a>!event-aaa-bbb</a></Tag>
                <Tag>$ABC</Tag>
                <Tag>$OPQ</Tag>
                <br />
                <a><b>Ant Design, a design language for background applications, is refined by Ant UED Team</b></a>
            &nbsp;&nbsp;&nbsp;
            <br />
            Ant Design, a design language for background applications, is refined by Ant UED Team...
            <a>expand</a>
              </p>
            }
          >
            <List
              // size="small"
              // className="demo-loadmore-list"
              // loading={initLoading}
              // itemLayout="horizontal"
              // loadMore={loadMore}
              dataSource={comments}
              renderItem={item => (
                <Comment
                  actions={[
                    <span key="comment-basic-like">
                      {/* <Tooltip title="Like">
                        {createElement(action === 'liked' ? LikeFilled : LikeOutlined, {
                          onClick: like,
                        })}
                      </Tooltip> */}
                      <LikeOutlined />
                      <span className="comment-action">{123}</span>
                    </span>,
                    <span key="comment-basic-dislike">
                      {/* <Tooltip title="Dislike">
                        {React.createElement(action === 'disliked' ? DislikeFilled : DislikeOutlined, {
                          onClick: dislike,
                        })}
                      </Tooltip> */}
                      <DislikeOutlined />
                      <span className="comment-action">{123}</span>
                    </span>,
                  ]}
                  author={"@anonymous"}
                  // avatar={
                  //   <Avatar
                  //     src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  //     alt="Han Solo"
                  //   />
                  // }
                  content={item}
                // datetime={
                //   <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                //   <span>{moment().fromNow()}</span>
                // </Tooltip>
                // }
                />

              )}
            />
          </Comment>

          <Comment
            style={{ background: "white" }}
            actions={[
              <span key="comment-basic-like">
                {/* <Tooltip title="Like">
                    {createElement(action === 'liked' ? LikeFilled : LikeOutlined, {
                      onClick: like,
                    })}
                  </Tooltip> */}
                <LikeOutlined />
                <span className="comment-action">{123}</span>
              </span>,
              <span key="comment-basic-dislike">
                {/* <Tooltip title="Dislike">
                    {React.createElement(action === 'disliked' ? DislikeFilled : DislikeOutlined, {
                      onClick: dislike,
                    })}
                  </Tooltip> */}
                <DislikeOutlined />
                <span>{123}</span>
              </span>,
              <span key="msg">
                <CoffeeOutlined />123
                </span>,
              <span key="domain">source.com</span>,
              <span key="time">15:32</span>
            ]}
            content={
              <p>
                <Tag><a>!event-aaa-bbb</a></Tag>
                <Tag>$ABC</Tag>
                <Tag>$OPQ</Tag>
                <br />
                <a><b>Ant Design, a design language for background applications, is refined by Ant UED Team</b></a>
            &nbsp;&nbsp;&nbsp;
            <br />
            Ant Design, a design language for background applications, is refined by Ant UED Team...
            <a>expand</a>
              </p>
            }
          />
        </Space>

        <br />



        <Card size="small">
          <Comment
            actions={[
              <span key="comment-basic-like">
                {/* <Tooltip title="Like">
                    {createElement(action === 'liked' ? LikeFilled : LikeOutlined, {
                      onClick: like,
                    })}
                  </Tooltip> */}
                <LikeOutlined />
                <span className="comment-action">{123}</span>
              </span>,
              <span key="comment-basic-dislike">
                {/* <Tooltip title="Dislike">
                    {React.createElement(action === 'disliked' ? DislikeFilled : DislikeOutlined, {
                      onClick: dislike,
                    })}
                  </Tooltip> */}
                <DislikeOutlined />
                <span>{123}</span>
              </span>,
              <span key="msg">
                <CoffeeOutlined />123
                </span>,
              <span key="domain">source.com</span>,
              <span key="time">15:32</span>
            ]}
            content={
              <p>
                <Tag><a>!event-aaa-bbb</a></Tag>
                <Tag>$ABC</Tag>
                <Tag>$OPQ</Tag>
                <br />
                <a><b>Ant Design, a design language for background applications, is refined by Ant UED Team</b></a>
            &nbsp;&nbsp;&nbsp;
            <br />
            Ant Design, a design language for background applications, is refined by Ant UED Team...
            <a>expand</a>
                <br />
                <Typography.Text type="secondary">17:32, Source.com, 23 comments  </Typography.Text>
              </p>
            }
          />


          {/* <div style={{ marginTop: 5 }}>
              <Typography.Text type="secondary">17:32, Source.com, 23 comments  </Typography.Text>
            </div> */}

          <List
            // size="small"
            // className="demo-loadmore-list"
            // loading={initLoading}
            // itemLayout="horizontal"
            // loadMore={loadMore}
            dataSource={comments}
            renderItem={item => (
              <Comment
                actions={[
                  <span key="comment-basic-like">
                    {/* <Tooltip title="Like">
                        {createElement(action === 'liked' ? LikeFilled : LikeOutlined, {
                          onClick: like,
                        })}
                      </Tooltip> */}
                    <LikeOutlined />
                    <span className="comment-action">{123}</span>
                  </span>,
                  <span key="comment-basic-dislike">
                    {/* <Tooltip title="Dislike">
                        {React.createElement(action === 'disliked' ? DislikeFilled : DislikeOutlined, {
                          onClick: dislike,
                        })}
                      </Tooltip> */}
                    <DislikeOutlined />
                    <span className="comment-action">{123}</span>
                  </span>,
                ]}
                author={"@anonymous"}
                // avatar={
                //   <Avatar
                //     src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                //     alt="Han Solo"
                //   />
                // }
                content={item}
              // datetime={
              //   <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
              //   <span>{moment().fromNow()}</span>
              // </Tooltip>
              // }
              />

            )}
          />
          <Comment
            content={
              (<div>
                <Form.Item>
                  {/* <TextArea rows={4} onChange={onChange} value={value} /> */}
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    // loading={submitting}
                    // onClick={onSubmit}
                    type="primary">
                    Add Comment
              </Button>
                </Form.Item>
              </div>
              )
            }
          />
        </Card>



        <List
          header={
            <div style={{ textAlign: "center" }}><Button type="primary">Trending</Button></div>
          }
          // size="small"
          // className="demo-loadmore-list"
          // loading={initLoading}
          // itemLayout="horizontal"
          // loadMore={loadMore}
          // bordered
          style={{ background: "white" }}
          dataSource={[1, 2, 3, 4]}
          renderItem={item => (
            <List.Item >
              {/* <List.Item.Meta
                  // avatar={<p>123</p>}
                  title={<Typography.Text type="secondary" strong>#1</Typography.Text>}
                // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                /> */}
              <Row>
                <Col offset={1} span={1}><Typography.Title level={4} type="secondary">{item}</Typography.Title></Col>
                <Col offset={1} span={21} >Ant Design, a design language for background applications, is refined by Ant UED Team</Col>
              </Row>
            </List.Item>
          )}
        />




        <Card size="small">
          {/* <a>
              <b>Ant Design, a design language for background applications, is refined by Ant UED Team</b>
            </a> &nbsp;
              <Tag>event-aaa-bbb</Tag>
            <Tag>$ABC</Tag>
            <Tag>$OPQ</Tag> */}
          <a><b>Ant Design, a design language for background applications, is refined by Ant UED Team</b></a>
            &nbsp;&nbsp;&nbsp;Ant Design, a design language for background applications, is refined by Ant UED Team
            <Tag>!event-aaa-bbb</Tag>
          <Tag>$ABC</Tag>
          <Tag>$OPQ</Tag>
          <div style={{ marginTop: 5 }}>
            <Typography.Text type="secondary">17:32, Source.com, <a style={{ color: "inherit" }}>23 comments</a>  </Typography.Text>
          </div>
          {/* <Divider /> */}
          <List
            size="small"
            // className="demo-loadmore-list"
            // loading={initLoading}
            itemLayout="horizontal"
            // loadMore={loadMore}
            dataSource={[1, 2, 3, 4]}
            renderItem={item => (
              <List.Item
              // actions={[
              //   <a key="list-loadmore-edit">+1</a>,
              //   <a key="list-loadmore-more">-1</a>
              // ]}
              >
                <div>
                  Ant Design, a design language for background applications, is refined by Ant UED Team
                  &nbsp;&nbsp;&nbsp;&nbsp;
                    <Typography.Text type="secondary">
                    <a style={{ color: "inherit" }}>+1</a>
                    &nbsp;&nbsp;
                      <a style={{ color: "inherit" }}>-1</a>
                  </Typography.Text>
                  {/* <a>like</a> <a>dislike</a> */}
                  {/* <br />
                    <span style={{ float: "right" }}>
                      <Typography.Text type="secondary">
                        <a style={{ color: "inherit" }}>+1</a>&nbsp;&nbsp;
                      <a style={{ color: "inherit" }}>-1</a>
                      </Typography.Text>
                    </span> */}
                </div>
              </List.Item>
            )}
          />
          {/* <a>23 more</a> */}
          <Row>
            <Col offset={1} span={22}>
              <Form form={form} name="horizontal_login" onFinish={() => { }}>
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Input placeholder="comment..." />
                </Form.Item>
                {/* <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item> */}
                {/* <Form.Item shouldUpdate={true}>
                {() => (
                  <Button
                    type="primary"
                    htmlType="submit"
                  // disabled={
                  //   !form.isFieldsTouched(true) ||
                  //   form.getFieldsError().filter(({ errors }) => errors.length).length
                  // }
                  >
                    Log in
                  </Button>
                )}
              </Form.Item> */}
              </Form>
            </Col>
          </Row>


          {/* <Form
              // {...layout}
              layout="inline"
              name="basic"
              initialValues={{ remember: true }}
              size="small"
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            >
              <Form.Item
                // label="Username"
                // wrapperCol={{ span: 24 }}
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input placeholder="comment ..." />
              </Form.Item>

              <Form.Item >
                <Button type="primary" htmlType="submit">
                  Submit
                  </Button>
              </Form.Item>

            </Form> */}
        </Card>


        <br />
        <Card size="small">
          <Typography.Text strong>
            Ant Design, a design language for background applications, is refined by Ant UED Team
            &nbsp;
                <Tag>event-aaa-bbb</Tag>
            <Tag>$ABC</Tag>
            <Tag>$OPQ</Tag>
          </Typography.Text>
        </Card>
        <br />
        <Card size="small">
          <Typography.Text strong>
            Ant Design, a design language for background applications, is refined by Ant UED Team
            &nbsp;
                <Tag>event-aaa-bbb</Tag>
            <Tag>$ABC</Tag>
            <Tag>$OPQ</Tag>
          </Typography.Text>
        </Card>
        <br />


        <Card size="small">
          <a>
            <Typography.Text strong>
              Ant Design, a design language for background applications, is refined by Ant UED Team
                </Typography.Text>
          </a>
          <br />
          <Tag>event-aaa-bbb</Tag>
          <Tag>$ABC</Tag>
          <Tag>$OPQ</Tag>
          <br />
          <Typography.Text type="secondary">17:32 Source.com | 12 Comments</Typography.Text>
        </Card>
        <p />
        <Card size="small">
          <a>
            <Typography.Text strong>
              Ant Design, a design language for background applications, is refined by Ant UED Team
                </Typography.Text>
          </a>&nbsp;
              <Tag>event-aaa-bbb</Tag>
          <Tag>$ABC</Tag>
          <Tag>$OPQ</Tag>

          <br />
          <Button shape="circle" icon={<UpOutlined />} />
          <Button shape="circle" icon={<DownOutlined />} />
          <Divider />
          <Typography.Text underline>Comments [打開後才顯示]</Typography.Text>
          <ul>
            <li>Dictum non consectetur a erat nam at lectus urna.
                    <br />
              <a>upvote</a>
            </li>
            <li>Dolor purus non enim praesent elementum facilisis leo.
                    <br />
              <a>upvote</a>
            </li>
            <li>Vel pretium lectus quam id leo in vitae turpis <a>edit</a>
              <br />
                    30 ups
                  </li>
          </ul>
          <a>23 more</a>
          <Input
            placeholder="Your comment"
            style={{ width: 200 }}
          />
          <Button>SUBMIT</Button>

        </Card>
        <p />
        <Card size="small">
          <a>
            <Typography.Title level={4}>
              Trending / Signals [像寶箱一樣需要開啟]
                  </Typography.Title>
          </a>
        </Card>
        <p />
        <Card size="small">
          <a>
            <Typography.Title level={4}>
              Ant Design, a design language for background applications, is refined by Ant UED Team
                  </Typography.Title>
          </a>
          <Tag>event-aaa-bbb</Tag>
          <Tag>$ABC</Tag>
          <Tag>$OPQ</Tag>
          <Typography.Text type="secondary">17:32 Source.com</Typography.Text>
        </Card>
        <p />

        <Divider>Below have been reached</Divider>

        <Card size="small">
          <a>
            <Typography.Title level={4}>
              Ant Design, a design language for background applications, is refined by Ant UED Team
                  </Typography.Title>
          </a>
          <Tag>event-aaa-bbb</Tag>
          <Tag>$ABC</Tag>
          <Tag>$OPQ</Tag>
          <Typography.Text type="secondary">17:32 Source.com</Typography.Text>
        </Card>
        <p />
        <Button>loading more</Button>
      </Col>

      <Col offset={1} span={4}>
        <p />
        <Button>Post</Button>
        <p />
        <List
          header={<Typography.Title level={4}>Followed Events</Typography.Title>}
          dataSource={[1, 2, 3, 4]}
          renderItem={item => (
            <List.Item>
              <a>short-event-name (+1.82%)</a>
              {/* <Typography.Text>remove</Typography.Text> */}
            </List.Item>
          )}
        />
        {/* <Divider /> */}

        <List
          header={<Typography.Title level={4}>Followed Tickers</Typography.Title>}
          dataSource={[1, 2, 3, 4]}
          renderItem={item => (
            <List.Item>
              {/* <Typography.Text mark>[ITEM]</Typography.Text> {item} */}
              <a>$OSD (-3.21%)</a>
            </List.Item>
          )}
        />

      </Col>
    </Row >
  )
}