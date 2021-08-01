import React, { createContext, useEffect, useState } from 'react'
import { useMeQuery, useCardQuery } from '../apollo/query.graphql'
import { CardItem } from './card'

export const SymbolContext = createContext({ symbol: '' })

const CardPage = ({
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
    refetch: cardRefetch,
  } = useCardQuery({
    variables: { symbol: pathSymbol },
  })
  useEffect(() => {
    cardRefetch()
  }, [pathSymbol])
  // console.log(pathSymbol, data?.card)
  const handleSymbol = (symbol: string) => {
    handlePathPush(symbol)
    setSymbol(symbol)
  }
  return (
    // <div>
    <SymbolContext.Provider value={{ symbol: pathSymbol }}>
      {/* <div>{(user === undefined || meData === undefined) && <a href="/api/auth/login">Login</a>}</div> */}
      <button
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
      </button>
      {/* {console.log(data?.card)} */}
      {data && data.card && <CardItem card={data.card} handleSymbol={handleSymbol} />}
      {/* <BoardPage boardId={}/> */}
    </SymbolContext.Provider>
    // {/* </div> */}
  )
}
export default CardPage
