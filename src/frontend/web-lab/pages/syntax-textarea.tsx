import { useState, useRef } from 'react'
// import Link from 'next/link'
// import Layout from '../components/Layout'
// import styles from './syntax-textarea.module.css'
// import './styles.css'
import 'antd/dist/antd.css'
import { AutoComplete, Input } from 'antd'

function FormPage(): JSX.Element {
  return (
    <div>
      <AutoComplete
        options={[{ value: 'a' }, { value: 'b' }, { value: 'c' }]}
        style={{ width: 200 }}
        // onSelect={onSelect}
        // onSearch={handleSearch}
      >
        <Input.TextArea style={{ height: 50 }} />
        {/* <textarea
          // readOnly={true}
          // ref={(c) => (this._input = c)}
          style={
            {
              // margin: 0,
              // // border: 0,
              // background: 'none',
              // boxSizing: 'inherit',
              // display: 'inherit',
              // fontFamily: 'inherit',
              // fontSize: 'inherit',
              // fontStyle: 'inherit',
              // fontVariantLigatures: 'inherit',
              // fontWeight: 'inherit',
              // letterSpacing: 'inherit',
              // lineHeight: 'inherit',
              // tabSize: 'inherit',
              // textIndent: 'inherit',
              // textRendering: 'inherit',
              // textTransform: 'inherit',
              // whiteSpace: 'pre-wrap',
              // wordBreak: 'keep-all',
              // overflowWrap: 'break-word',
              // position: 'absolute',
              // top: 0,
              // left: 0,
              // // padding: 0,  // 當<pre>的padding也設0時，雖然可以完全符合，但是最左的輸入記號會被遮住
              // height: '100%',
              // width: '100%',
              // resize: 'none',
              // //   color: 'inherit',
              // overflow: 'hidden',
              // MozOsxFontSmoothing: 'grayscale',
              // WebkitFontSmoothing: 'antialiased',
              //   WebkitTextFillColor: 'transparent',
            }
          }
        /> */}
      </AutoComplete>
    </div>
  )
}

function SyntaxTextareaPage(): JSX.Element {
  //   let containerProps = {}
  //   const textareaClassName = `${styles.input} ${styles.content}`
  const textareaRef = useRef(null)
  const backdropRef = useRef(null)

  //   className = `${styles.input} ${styles.content}`
  //   containerClassName = `${styles.container}`

  // Resizing is currently not supported
  //   style.resize = 'none'

  // To properly work, value and onChange must be supplied.  Give a hint for new users.
  //   const [fakeValue, setFakeValue] = useState(
  //     'Please supply a value and an onChange parameter.'
  //   )
  //   if (value == undefined) {
  //     value = fakeValue
  //     onChange = (event) => {
  //       setFakeValue(event.target.value)
  //     }
  //   }

  const handleScroll = () => {
    backdropRef.current.scrollTop = textareaRef.current.scrollTop
    backdropRef.current.scrollLeft = textareaRef.current.scrollLeft
  }
  const blockContainerScroll = handleScroll

  return (
    // <div className={styles.container} onScroll={blockContainerScroll}>
    //   <textarea
    //     // value={'this is a test'}
    //     // onChange={onChange}
    //     style={{ resize: 'none', outline: 'none' }}
    //     className={`${styles.input} ${styles.content}`}
    //     // {...textareaProps}
    //     onScroll={handleScroll}
    //     ref={textareaRef}
    //   ></textarea>
    //   <div className={styles.backdrop} ref={backdropRef}>
    //     <div>
    //       <div className={`${styles.highlights} ${styles.content}`}>
    //         <span style={{ color: 'black' }}>this </span>
    //         <span style={{ color: 'red' }}>is</span>
    //         <span style={{ color: 'black' }}> a test</span>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div>
      <div
        style={{
          position: 'relative',
          // textAlign: 'left',
          boxSizing: 'border-box',
          overflow: 'hidden',
          // padding: 0,
          width: 300,
        }}
        // className={styles.container}
      >
        <AutoComplete
          options={[{ value: 'a' }, { value: 'b' }, { value: 'c' }]}
          style={{ width: 200 }}
          // onSelect={onSelect}
          // onSearch={handleSearch}
        >
          <textarea
            // readOnly={true}
            // ref={(c) => (this._input = c)}
            style={{
              margin: 0,
              // border: 0,
              background: 'none',
              boxSizing: 'inherit',
              display: 'inherit',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              fontStyle: 'inherit',
              fontVariantLigatures: 'inherit',
              fontWeight: 'inherit',
              letterSpacing: 'inherit',
              lineHeight: 'inherit',
              tabSize: 'inherit',
              textIndent: 'inherit',
              textRendering: 'inherit',
              textTransform: 'inherit',
              whiteSpace: 'pre-wrap',
              wordBreak: 'keep-all',
              overflowWrap: 'break-word',

              position: 'absolute',
              top: 0,
              left: 0,
              // padding: 0,  // 當<pre>的padding也設0時，雖然可以完全符合，但是最左的輸入記號會被遮住
              height: '100%',
              width: '100%',
              resize: 'none',
              //   color: 'inherit',
              overflow: 'hidden',
              MozOsxFontSmoothing: 'grayscale',
              WebkitFontSmoothing: 'antialiased',
              //   WebkitTextFillColor: 'transparent',
            }}
            // className={`${styles.editor} ${styles.textarea}`}
            // className={className}
            // id={textareaId}
            // value={'this is a test'}
            // onChange={this._handleChange}
            // onKeyDown={this._handleKeyDown}
            // onClick={onClick}
            // onKeyUp={onKeyUp}
            // onFocus={onFocus}
            // onBlur={onBlur}
            // disabled={disabled}
            // form={form}
            // name={name}
            // placeholder={placeholder}
            // readOnly={readOnly}
            // required={required}
            // autoFocus={autoFocus}
            // autoCapitalize="off"
            // autoComplete="off"
            // autoCorrect="off"
            // spellCheck={false}
            // data-gramm={false}
          />
        </AutoComplete>

        {/* <pre
        // className={preClassName}
        aria-hidden="true"
        // className={`${styles.editor} ${styles.highlight}`}
        style={{
          margin: 0,
          border: 0,
          background: 'none',
          boxSizing: 'inherit',
          display: 'inherit',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          fontStyle: 'inherit',
          fontVariantLigatures: 'inherit',
          fontWeight: 'inherit',
          letterSpacing: 'inherit',
          lineHeight: 'inherit',
          tabSize: 'inherit',
          textIndent: 'inherit',
          textRendering: 'inherit',
          textTransform: 'inherit',
          whiteSpace: 'pre-wrap',
          wordBreak: 'keep-all',
          overflowWrap: 'break-word',

          position: 'relative',
          padding: '2px',
          pointerEvents: 'none',
        }}
      >
        {
          'this \n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n'
        }
        <span style={{ color: 'red' }}>is</span>
        {' a test'}
      </pre> */}
        {/* eslint-disable-next-line react/no-danger */}
        {/* <style type="text/css" dangerouslySetInnerHTML={{ __html: cssText }} /> */}
      </div>
    </div>
  )
}

export default FormPage
// export default SyntaxTextareaPage
