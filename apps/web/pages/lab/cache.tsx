import { useReactiveVar } from '@apollo/client'

const TestPage = (): JSX.Element => {
  console.log('entry')
  const v = testValue()
  //   const v2 = useReactiveVar(testValue)

  return (
    <div>
      <button
        onClick={() => {
          testValue('hello world')
          console.log(testValue())
        }}
      >
        magic
      </button>
      <p>{v}</p>
      {/* <p>{v2}</p> */}
    </div>
  )
}

export default TestPage
