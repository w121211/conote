import React, { createContext, useEffect, useState } from 'react'
import { useNoteQuery } from '../apollo/query.graphql'
// import { NoteItem } from './note'

export const SymbolContext = createContext({ symbol: '' })

const NotePage = ({
  pathSymbol,
  handlePathPush,
}: {
  pathSymbol: string
  handlePathPush: (e: string) => void
}): JSX.Element => {
  // const { user, error: userError, isLoading } = useUser()
  // const { data: meData, loading: meLoading } = useMeQuery()
  const [symbol, setSymbol] = useState<string>('$GOOG')
  // const [path, setPath] = useState<string[]>(['$GOOG'])
  // const [showBoardPage, setShowBoardPage] = useState(false)
  // const[url,setUrl]=useState('')
  // useEffect(()=>{
  //   const tabUrl=getTabUrl()
  //   tabUrl&&setUrl(tabUrl)
  // },[])
  const {
    data,
    error,
    loading,
    refetch: noteRefetch,
  } = useNoteQuery({
    variables: { symbol: pathSymbol },
  })
  useEffect(() => {
    noteRefetch()
  }, [pathSymbol])
  // console.log(pathSymbol, data?.note)
  const handleSymbol = (symbol: string) => {
    handlePathPush(symbol)
    setSymbol(symbol)
  }
  return (
    // <div>
    <SymbolContext.Provider value={{ symbol: pathSymbol }}>
      {/* <div>{(user === undefined || meData === undefined) && <a href="/api/auth/login">Login</a>}</div> */}
      {/* <button
        onClick={() => {
          setSymbol('')
          handlePathPush('')
        }}
      >
        Clear
      </button>
      <button
        onClick={() => {
          setSymbol('$AAPL')
          handlePathPush('$AAPL')
          // setPath([...path, '$AAPL'])
        }}
      >
        $AAPL
      </button>
      <button
        onClick={() => {
          setSymbol('$BA')
          handlePathPush('$BA')
          // setPath([...path, '$BA'])
        }}
      >
        $BA
      </button>
      <button
        onClick={() => {
          setSymbol('$ROCK')
          handlePathPush('$ROCK')
          // setPath([...path, '$ROCK'])
        }}
      >
        $ROCK
      </button>
      <button
        onClick={() => {
          setSymbol('[[https://www.youtube.com/watch?v=F57gz9O0ABw]]')
          handlePathPush('[[https://www.youtube.com/watch?v=F57gz9O0ABw]]')
          // setPath([...path, '[[https://www.youtube.com/watch?v=F57gz9O0ABw]]'])
        }}
      >
        [[https://www.youtube.com/watch?v=F57gz9O0ABw]]
      </button> */}
      {/* {console.log(data?.note)} */}
      {/* {data && data.note && <NoteItem note={data.note} handleSymbol={handleSymbol} />} */}
      {/* <BoardPage boardId={}/> */}
    </SymbolContext.Provider>
    // {/* </div> */}
  )
}
export default NotePage
