import React, { ReactElement, useState, useEffect } from 'react'
import { useQuery, useMutation, useLazyQuery, useApolloClient } from '@apollo/client'
import { Link, navigate, redirectTo } from '@reach/router'
import { AutoComplete, Button, Modal, Popover, Tag, Tooltip, Radio, Form, Input } from 'antd'
import { TextEditor, Section, ExtTokenStream, streamToStr, MarkToConnectedContentRecord } from '@conote/editor'
import * as queries from '../graphql/queries'
import * as QT from '../graphql/query-types'
import { AnchorPanel } from './tile-panel'
import { QueryCommentModal } from './tile'
import { toUrlParams } from '../helper'
import { RenderCardBody } from './card'
import classes from './card-form.module.scss'
// import classes from '../pages/card-page.module.scss'
import { ReactComponent as SaveIcon } from '../assets/save.svg'

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

export function CardForm({ card, onFinishFn }: { card: QT.cocardFragment; onFinishFn?: () => void }): JSX.Element {
  /**
   * TODO:
   * - 目前無法即時檢查輸入的ticker, topic是否存在
   * - submit時，若有不合格的input應該要提出warning & 無法submit
   * - input中有symbol時，提供symbol連結，但目前不會同時檢驗該symbol是否存在....（感覺要先檢驗比較好？）
   * - cache(目前只要一離開card就需要重來)
   * - `<QueryOcard />`無法解決初始render時會互相卡住的問題，最好替換回最為直接的query.refetch
   */
  // const [queryOcard, { refetch }] = useLazyQuery<QT.ocard, QT.ocardVariables>(queries.OCARD)
  const [createCardBody] = useMutation<QT.createCardBody, QT.createCardBodyVariables>(queries.CREATE_CARD_BODY, {
    update(cache, { data }) {
      const q = cache.readQuery<QT.cocard, QT.cocardVariables>({
        query: queries.COCARD,
        variables: { url: card.link.url },
      })
      if (data?.createCardBody && q?.cocard) {
        cache.writeQuery<QT.cocard, QT.cocardVariables>({
          query: queries.COCARD,
          variables: { url: card.link.url },
          data: { cocard: { ...q.cocard, body: data.createCardBody } },
        })
      }
      // if (card.__typename === 'Selfcard') {
      //   const q = cache.readQuery<QT.mycard, QT.mycardVariables>({
      //     query: queries.MYCARD,
      //     variables: { symbolName: card.symbol.name },
      //   })
      //   if (data?.createWebpageCardBody && q?.mycard) {
      //     cache.writeQuery<QT.mycard, QT.mycardVariables>({
      //       query: queries.MYCARD,
      //       variables: { symbolName: card.symbol.name },
      //       data: { mycard: { ...q.mycard, body: data?.createWebpageCardBody } },
      //     })
      //   }
      // }
    },
  })
  const editor = new TextEditor(card.body?.text, card.link.url, card.link.oauthorName ?? undefined)
  const [sects, setSects] = useState<Section[]>(editor.getSections())
  // const [symbols, setSymbols] = useState<string[]>([])
  // const symbolTokens = symbols.reduce<Array<string | PrismToken>>((acc, cur) => acc.concat(MK.tokenizeSymbol(cur)), [])

  function onValuesChange(changedValues: { input: string }) {
    if (changedValues['input']) {
      const editor = new TextEditor(undefined, card.link.url, card.link.oauthorName ?? undefined)
      editor.setBody(changedValues['input'])
      editor.flush()
      setSects(editor.getSections())
      // setSymbols([])
    }
  }

  async function onFinish(values: { input: string }) {
    const res = await createCardBody({
      variables: { cardId: card.id, data: { text: values['input'] } },
    })
    if (onFinishFn !== undefined) {
      onFinishFn()
    }
  }

  if (card.body === null) return <p>[Error]: null body</p>

  return (
    <div>
      {/* {symbolTokens.map((e, i) => <RenderToken key={i} token={e} />)} */}
      <Form
        className={classes.formContainer}
        onFinish={onFinish}
        initialValues={{ input: editor.getBody() }}
        onValuesChange={onValuesChange}
      >
        {/* <div className={classesCard.cardOuter}>
          <div className={classesCard.cardInner}>
            <div className={classesCard.cardElement}> */}
        <div className={classes.formItemWrapper}>
          <Form.Item name="input" className={classes.textAreaContainer}>
            <Input.TextArea rows={20} />
          </Form.Item>
          {/* </div>
          </div>
        </div> */}
          <Form.Item className={classes.buttonContainer}>
            <Button className={classes.button} type="primary" htmlType="submit">
              <SaveIcon className={classes.saveIcon} />
            </Button>
          </Form.Item>
        </div>
      </Form>
      <RenderCardBody sects={sects} />
    </div>
  )
}
