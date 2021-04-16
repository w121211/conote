import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import React, { useState } from 'react'
import { RouteComponentProps, navigate, Link, WindowLocation, Redirect } from '@reach/router'
import { InvariantError } from 'ts-invariant'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import {
  Alert,
  AutoComplete,
  Form,
  Input,
  Button,
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Radio,
  Popover,
  Space,
} from 'antd'
import * as queries from '../graphql/queries'
import * as QT from '../graphql/query-types'
import { Pane } from './layout'
import { SymbolAutoComplete } from './symbol-hint'
import { toUrlParams } from '../helper'
import '../appLayout/appLayout.less'

// interface VotePostFormProps {
//   pollId: string
//   choice: QT.pollFragment_choices
// }

// export const VotePostForm: React.FC<VotePostFormProps> = ({ pollId, choice }) => {
//   const [form] = Form.useForm()
//   const [createVotePost] = useMutation<QT.createVotePost, QT.createVotePostVariables>(
//     queries.BLOCK,
//     //   queries.CREATE_VOTE_POST, {
//     //   update(cache, { data }) {
//     //     // console.log(typeof data?.createPost.poll?.start)
//     //     // console.log(data?.createPost)
//     //     try {
//     //       const res = cache.readQuery<QT.latestPolls>({ query: queries.LATEST_POLLS })
//     //       if (data?.createVotePost && res?.latestPolls) {
//     //         res.latestPolls.map(function (e) {
//     //           if (e.id === pollId) e.posts.concat(data.createVotePost)
//     //           return e
//     //         })
//     //         cache.writeQuery<QT.latestPolls>({
//     //           query: queries.LATEST_POLLS,
//     //           data: { latestPolls: res.latestPolls },
//     //         })
//     //       }
//     //     } catch (e) {
//     //       if (e instanceof InvariantError) { }
//     //       else { console.error(e) }
//     //     }
//     //     // navigate("/")
//     //   },
//     // }
//   )
//   function onFinish(values: any) {
//     console.log('submit', values)
//     createVotePost({
//       variables: {
//         pollId,
//         choiceId: choice?.id,
//         data: {
//           cat: QT.PostCat.REPLY,
//           // symbolIds: [values.symbols],
//           symbolIds: [],
//           text: values.text,
//         }
//       }
//     })
//   }
//   function onFinishFailed(errorInfo: any) {
//     console.log('Failed:', errorInfo);
//   }
//   return (
//     <Form
//       form={form}
//       name="basic"
//       size="small"
//       initialValues={PLACEHOLDER}
//       onFinish={onFinish}
//       onFinishFailed={onFinishFailed}
//     >
//       <Form.Item label="選項" required>
//         <Button size="small" shape="round">{choice?.text}</Button>
//       </Form.Item>
//       <Form.Item
//         label="意見"
//         name="text"
//         rules={[{ required: false, message: '請輸入內文' }]}
//       >
//         <Input.TextArea rows={3} autoSize={{ minRows: 1 }} />
//       </Form.Item>
//       <Form.Item>
//         <Button type="primary" htmlType="submit">投票</Button>
//       </Form.Item>

//     </Form >
//   )
// }

// interface NewChoicePostFormProps { }

// export const NewChoicePostForm: React.FC<NewChoicePostFormProps> = () => {
//   const [form] = Form.useForm()
//   const [createPost] = useMutation<QT.createPost, QT.createPostVariables>(
//     queries.BLOCK,
//     // queries.CREATE_POST, {
//     // update(cache, { data }) {
//     // console.log(typeof data?.createPost.poll?.start)
//     // console.log(data?.createPost)
//     // try {
//     //   const res = cache.readQuery<QT.latestPosts>({ query: queries.LATEST_POLLS })
//     //   if (data?.createPost && res?.latestPolls) {
//     //     cache.writeQuery<QT.latestPolls>({
//     //       query: queries.LATEST_POLLS,
//     //       data: {
//     //         latestPolls: res.latestPolls.concat([data.createPoll]),
//     //       },
//     //     })
//     //   }
//     // } catch (e) {
//     //   if (e instanceof InvariantError) { }
//     //   else { console.error(e) }
//     // }

//     // navigate("/")
//     // },
//     // }
//   )

//   function onFinish(values: any) {
//     console.log('submit', values)

//     createPost({
//       variables: {
//         data: {
//           cat: values.cat,
//           symbolIds: values.symbols,
//           text: values.text,
//         }
//       }
//     })
//   }
//   function onFinishFailed(errorInfo: any) {
//     console.log('Failed:', errorInfo);
//   }

//   // const requireText = cat === QT.PollCat.ADD_BY_POST

//   return (
//     <Form
//       form={form}
//       name="basic"
//       size="small"
//       initialValues={PLACEHOLDER}
//       onFinish={onFinish}
//       onFinishFailed={onFinishFailed}
//     >

//       <Form.Item
//         label="選項"
//         name="choice"
//         rules={[{ required: true, message: '請輸入選項' }]}
//       >
//         <Input />
//       </Form.Item>

//       <Form.Item
//         label="意見"
//         name="text"
//         required
//         rules={[{ required: true, message: '請輸入內文' }]}
//       >
//         <Input.TextArea rows={3} autoSize={{ minRows: 1 }} />
//       </Form.Item>

//       <Form.Item>
//         <Button type="primary" htmlType="submit">投票</Button>
//       </Form.Item>

//     </Form >
//   )
// }

dayjs.extend(localizedFormat)

export function SearchAllForm() {
  const [options, setOptions] = useState<{ value: string }[]>([])
  const [searchAll, { loading, data }] = useLazyQuery<QT.searchAll, QT.searchAllVariables>(queries.SEARCH_ALL)
  function onSearch(term: string) {
    console.log(`search term: ${term}`)
    if (term.length === 0) setOptions([])
    else {
      searchAll({ variables: { term } })
      if (data && data.searchAll) setOptions(data.searchAll.map(e => ({ value: e })))
    }
  }
  function onSelect(value: string) {
    // console.log('onSelect', data)
    if (value.startsWith('$') || value.startsWith('[')) {
      navigate(`/card?${toUrlParams({ s: value })}`)
    }
    // else if (value.startsWith('['))
  }
  return (
    <AutoComplete
      options={options}
      onSelect={onSelect}
      onSearch={onSearch}
      // placeholder="input here"
    >
      <Input.Search className="search" placeholder="搜尋全站: $BA, Google, 自動駕駛" loading={loading} />
    </AutoComplete>
  )
}

const VALID_DOMAINS = ['www.youtube.com', 'youtu.be', 'm.youtube.com']

function isUrl(value: string) {
  try {
    new URL(value)
  } catch (err) {
    return false
  }
  return true
}

function isValidDomain(value: string) {
  try {
    const url = new URL(value)
    return VALID_DOMAINS.includes(url.hostname)
  } catch (err) {
    return false
  }
}

// export function SearchPageForm() {
//   /**
//    * 1. 有找到就redirect
//    * 2. 沒找到，新建一個page & redirect
//    * 3. 不符合要求者，提示錯誤訊息
//    * */
//   const [form] = Form.useForm()
//   const [searchPage, { loading, data }] = useLazyQuery<QT.searchPage, QT.searchPageVariables>(queries.SEARCH_PAGE)
//   function onFinish(values: any) {
//     console.log('submit', values)
//     searchPage({ variables: { url: values.url } })
//   }
//   // function onFinishFailed(errorInfo: any) {
//   //   console.log('Failed:', errorInfo);
//   // }
//   if (loading)
//     return <div>Searching...</div>
//   if (data && data.searchPage)
//     return <Redirect to="/" state={{ page: data.searchPage }} noThrow />
//   // return <Redirect to="/block/999" state={{ page: data.searchPage }} />
//   return (
//     <Form form={form} name="search-page-form" onFinish={onFinish}
//       initialValues={{ url: "https://www.youtube.com/watch?v=erJaXtindOo" }}>
//       <Form.Item label="URL" name="url" required={true} validateTrigger="onSubmit"
//         rules={[
//           { required: true, message: '請輸入URL' },
//           {
//             validator: async function (rule, value) {
//               if (isUrl(value))
//                 return Promise.resolve()
//               form.resetFields()
//               return Promise.reject('錯誤的URL');
//               // throw new Error('URL錯誤')
//             }
//           },
//           {
//             validator: async function (rule, value) {
//               if (isValidDomain(value))
//                 return Promise.resolve()
//               form.resetFields()
//               return Promise.reject('目前僅支援Youtube');
//             }
//           }
//         ]}>
//         <Input />
//       </Form.Item>
//       <Form.Item>
//         <Button type="primary" htmlType="submit">送出</Button>
//       </Form.Item>
//     </Form >
//   )
// }

function NewLinkForm() {
  const [options, setOptions] = useState<{ value: string }[]>([])
  // const options = [{ value: "aaa" }, { value: "bbb" }]
  function onSelect(value: string) {
    console.log('onSelect', value)
  }
  function onSearch(value: string) {
    // console.log(value)
    if (value.endsWith('#')) {
      setOptions([{ value: '~~~' }])
      // setOptions(
      //   !value ? [] : [{ value }, { value: value + value }, { value: value + value + value }],
      // );
    } else {
      setOptions([])
    }
  }
  function handleKeyPress(ev: React.KeyboardEvent<HTMLTextAreaElement>) {
    console.log('handleKeyPress', ev)
  }
  return (
    <>
      <pre>
        1. Link submit ＃ 若有找到就redirect # 沒有的話就新建一個 2. get (redirect) or create... 3. (create) user:
        @somebody:youtube contentId: aaaaa contentType: video contentTitle: some title Note: # ... # ...
      </pre>
      {/* <SearchPageForm /> */}

      <AutoComplete disabled={true} options={options} onSelect={onSelect} onSearch={onSearch}>
        <Input.TextArea
          placeholder="input here"
          autoSize={true}
          // onKeyPress={handleKeyPress}
        />
      </AutoComplete>
    </>
  )
}

function _NoteForm() {
  /**
   * 理想（類code-editor）：
   * 1. 自動在前方增加hash（無法消除）
   * 2. 打"[[______]]", "$___"會開啟搜尋視窗
   * 3. (NEXT)換行後會automark前一行
   * 範例：
   * -------------------
   * | # OOOOOOO[[OO]]OOO
   * | # ...
   * ____________________
   *
   *
   *
   */
  // const [value, setValue] = useState("# ")
  // const [isHash, setIsHash] = useState(false)
  // function onChange({ target: { value } }: { target: { value: string } }) {
  // if (value === "")
  //   setValue("# ")
  // if (value.charAt(0) === "#") {
  //   setValue(value.replace(/(\n\n|\n[^#]|\n$)/, "\n# "))
  // }
  // setValue(value.replace(/(\n\n|\n[^#]|\n$)/, "\n# "))
  // else {
  //   setValue(value)
  // }
  // }
  // function onKeyDown(event: React.KeyboardEvent) {
  //   // console.log(event.key === "ArrowDown")
  //   if (event.key === "ArrowDown") {
  //     console.log('Down arrow key fired'); // does not fire
  //   }
  // }
  const [options, setOptions] = useState<{ value: string }[]>([])
  const [value, setValue] = useState<string>('')
  // const [error, setError] = useState<string | null>(null)
  const [notes, setNotes] = useState<string[]>([])
  const [searchAll, { loading, data }] = useLazyQuery<QT.searchAll, QT.searchAllVariables>(queries.SEARCH_ALL)
  // const [automark, { loading, data }] = useLazyQuery<QT.automark, QT.automarkVariables>(queries.AUTOMARK)

  function onSearch(term: string) {
    console.log(`search term: ${term}`)
    if (term.endsWith('#')) {
      setOptions([{ value: '...' }])
      searchAll({ variables: { term } })
    } else {
      setOptions([])
    }
    // if (term.length === 0)
    //   setOptions([])
    // else {
    //   searchAll({ variables: { term } })
    //   if (data && data.searchAll)
    //     setOptions(data.searchAll.map((e) => ({ value: e })))
    // }
  }
  function onSelect(data: string) {
    console.log('onSelect', data)
    // redirect('/topic/some_where')
  }
  // function onChange({ target: { value } }: { target: { value: string } }) {
  //   setValue(value)
  // }
  function onChange(value: string) {
    setValue(value)
  }
  function onKeyDown(e: React.KeyboardEvent) {
    console.log(e.key)
    if (e.key === 'Enter') {
      if (value === '') {
        // setError("note不得空白")
        return
      }
      setNotes([...notes, value])
      setValue('')
    }
  }
  // if (!loading && data && data.searchAll) {
  //   // setOptions([])
  //   console.log(data.searchAll)
  //   setOptions(data.searchAll.map((e) => ({ value: e })))
  // }
  // if (data?.automark) {
  //   setNotes([...notes, value])
  // }
  return (
    <div>
      {/* {isHash ? <span>[Note mode]</span> : null} */}
      {/* <Input.TextArea rows={4} onChange={onChange} value={value} /> */}
      {notes.map((e, i) => (
        <p key={i}># {e}</p>
      ))}
      <AutoComplete
        style={{ width: 200 }}
        value={value}
        onSelect={onSelect}
        onChange={onChange}
        onSearch={onSearch}
        onKeyDown={onKeyDown}
      >
        {data &&
          data.searchAll.map((e, i) => (
            <AutoComplete.Option key={i} value={e}>
              {e}
            </AutoComplete.Option>
          ))}
        {/* <Input value={value} onChange={onChange} onPressEnter={onPressEnter} /> */}
      </AutoComplete>
      {/* {!!error && <p>{error}</p>} */}
    </div>
  )
}
