import React, { useState } from 'react'
import { AutoComplete, Button, Form, Input } from 'antd'
import { Editor, Section } from '../../packages/editor/src/index'
import {
  // useCreateWebCardBodyMutation,
  Card,
  // CocardDocument,
  // CocardQuery,
  // CocardQueryVariables,
} from '../apollo/query.graphql'
import { RenderCardBody } from '../components/card'
import Preview from './preview/preview'
import SaveIcon from '../assets/svg/save.svg'
import classes from './card-form.module.scss'
function CardInput() {
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
   * TODO:
   * - autocomplete: 搜尋ticker
   * - (改在別的地方處理)允許update、delete comment
   * - poll?
   */
  // const [options, setOptions] = useState<{ value: string }[]>([]);
  // const [error, setError] = useState<string | null>(null)
  // const [notes, setNotes] = useState<string[]>([])
  // const [searchAll, { loading, data }] = useLazyQuery<QT.searchAll, QT.searchAllVariables>(queries.SEARCH_ALL)
  // const [automark, { loading, data }] = useLazyQuery<QT.automark, QT.automarkVariables>(queries.AUTOMARK)

  // const initialValue = {
  //   text: initInputText({ comments })
  // }
  // function onSearch(term: string) {
  //   console.log(`search term: ${term}`)
  //   if (term.endsWith("#")) {
  //     setOptions([{ value: "..." }])
  //     searchAll({ variables: { term } })
  //   } else {
  //     setOptions([])
  //   }
  //   // if (term.length === 0)
  //   //   setOptions([])
  //   // else {
  //   //   searchAll({ variables: { term } })
  //   //   if (data && data.searchAll)
  //   //     setOptions(data.searchAll.map((e) => ({ value: e })))
  //   // }
  // }
  // function onSelect(data: string) {
  //   console.log('onSelect', data)
  //   // redirect('/topic/some_where')
  // }
  // function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {}
  // function onChange({ target: { value } }: { target: { value: string } }) {
  //   setValue(value)
  // }
  // function onKeyDown(e: React.KeyboardEvent) {
  //   console.log(e.key)
  //   // if (e.key === "Enter") {
  //     // if (value === "") {
  //       // setError("note不得空白")
  //       // return
  //     // }
  //     // setNotes([...notes, value])
  //     // setValue("")
  //   // }
  // }
  // if (!loading && data && data.searchAll) {
  //   // setOptions([])
  //   console.log(data.searchAll)
  //   setOptions(data.searchAll.map((e) => ({ value: e })))
  // }
  // if (data?.automark) {
  //   setNotes([...notes, value])
  // }
  return (
    <>
      {/* {isHash ? <span>[Note mode]</span> : null} */}
      {/* {notes.map((e, i) => <p key={i}># {e}</p>)} */}
      {/* <AutoComplete style={{ width: 200 }} value={value} onSelect={onSelect} onChange={onChange} onSearch={onSearch} onKeyDown={onKeyDown}>
        {data && data.searchAll.map((e, i) => <AutoComplete.Option key={i} value={e}>{e}</AutoComplete.Option>)}
        <Input value={value} onChange={onChange} onPressEnter={onPressEnter} />
      </AutoComplete> */}
      {/* {!!error && <p>{error}</p>} */}
      {/* <Input.TextArea rows={4} onChange={onChange} value={value} autoSize={true} /> */}
      <Form.Item name="card">
        <Input.TextArea rows={4} autoSize />
      </Form.Item>
    </>
  )
}

export function CardForm({ card, onFinish }: { card: Card; onFinish?: () => void }): JSX.Element {
  /**
   * TODO:
   * - 目前無法即時檢查輸入的ticker, topic是否存在
   * - submit時，若有不合格的input應該要提出warning & 無法submit
   * - input中有symbol時，提供symbol連結，但目前不會同時檢驗該symbol是否存在....（感覺要先檢驗比較好？）
   * - cache(目前只要一離開card就需要重來)
   * - `<QueryOcard />`無法解決初始render時會互相卡住的問題，最好替換回最為直接的query.refetch
   */
  // const [queryOcard, { refetch }] = useLazyQuery<QT.ocard, QT.ocardVariables>(queries.OCARD)
  // const [createWebCardBody] = useCreateWebCardBodyMutation({
  //   update(cache, { data }) {
  //     const res = cache.readQuery<CocardQuery, CocardQueryVariables>({
  //       query: CocardDocument,
  //       variables: { url: card.link.url },
  //     })
  //     if (data?.createWebCardBody && res?.cocard) {
  //       cache.writeQuery<CocardQuery, CocardQueryVariables>({
  //         query: CocardDocument,
  //         variables: { url: card.link.url },
  //         data: { cocard: { ...res.cocard, body: data.createWebCardBody } },
  //       })
  //     }
  //     // if (card.__typename === 'Selfcard') {
  //     //   const q = cache.readQuery<QT.mycard, QT.mycardVariables>({
  //     //     query: queries.MYCARD,
  //     //     variables: { symbolName: card.symbol.name },
  //     //   })
  //     //   if (data?.createWebpageCardBody && q?.mycard) {
  //     //     cache.writeQuery<QT.mycard, QT.mycardVariables>({
  //     //       query: queries.MYCARD,
  //     //       variables: { symbolName: card.symbol.name },
  //     //       data: { mycard: { ...q.mycard, body: data?.createWebpageCardBody } },
  //     //     })
  //     //   }
  //     // }
  //   },
  // })

  // const editor = new Editor(card.body?.text, [], card.link.url, card.link.oauthorName ?? undefined)
  // const [sects, setSects] = useState<Section[]>(editor.getSections())
  // const [symbols, setSymbols] = useState<string[]>([])
  // const symbolTokens = symbols.reduce<Array<string | PrismToken>>((acc, cur) => acc.concat(MK.tokenizeSymbol(cur)), [])

  function onValuesChange(changedValues: { input: string }) {
    // console.log(changedValues.input)
    // if (changedValues['input']) {
    //   const editor = new Editor(undefined, undefined, card.link.url, card.link.oauthorName ?? undefined)
    //   editor.setText(changedValues['input'])
    //   editor.flush()
    //   setSects(editor.getSections())
    // setSymbols([])
    // }
  }

  async function _onFinish(values: { input: string }) {
    // await createWebCardBody({
    //   variables: { cardId: card.id, data: { text: values['input'] } },
    // })
    // if (onFinish !== undefined) {
    //   onFinish()
    // }
  }

  const [preview, setPreview] = useState(false)
  const showPreview = () => {
    setPreview(true)
  }
  const handleCancel = () => {
    setPreview(false)
  }
  const [form] = Form.useForm()
  const onSubmit = () => {
    form.submit()
  }

  if (card.body === null) return <p>[Error]: null body</p>

  return (
    <div className={classes.container}>
      {/* {symbolTokens.map((e, i) => <RenderToken key={i} token={e} />)} */}
      <Form
        form={form}
        className={classes.formContainer}
        onFinish={_onFinish}
        // initialValues={{ input: editor.getText() }}
        // onValuesChange={onValuesChange}
        layout="inline"
      >
        {/* <div className={classesCard.cardOuter}>
          <div className={classesCard.cardInner}>
            <div className={classesCard.cardElement}> */}
        <div className={classes.formItemWrapper}>
          {/* <Form.Item name="input" className={classes.textAreaContainer}>
            <Input.TextArea rows={20} />
          </Form.Item> */}
          <Form.Item name="input" className={classes.textAreaContainer}>
            {/* <SlateEditorPage card={card} /> */}
          </Form.Item>
          {/* </div>
          </div>
        </div> */}
        </div>
        <Form.Item className={classes.buttonContainer}>
          <Button className={classes.button} type="primary" onClick={showPreview}>
            <SaveIcon className={classes.saveIcon} />
          </Button>
        </Form.Item>
      </Form>
      <Preview previewVisible={preview} handleCancel={handleCancel} onSubmit={onSubmit}>
        {/* <RenderCardBody sects={sects} /> */}
      </Preview>
    </div>
    // <div>
    //   {/* {symbolTokens.map((e, i) => <RenderToken key={i} token={e} />)} */}
    //   <Form onFinish={_onFinish} initialValues={{ input: editor.getText() }} onValuesChange={onValuesChange}>
    //     <Form.Item name="input">
    //       <Input.TextArea rows={10} autoSize />
    //     </Form.Item>
    //     <Form.Item>
    //       <Button type="primary" htmlType="submit">
    //         儲存
    //       </Button>
    //     </Form.Item>
    //   </Form>
    //   <RenderCardBody sects={sects} />
    // </div>
  )
}
