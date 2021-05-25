// import React, { useState } from 'react'
// import { useQuery } from '@apollo/client'
// import { Link } from '@reach/router'

// import * as queries from '../../store/queries'
// import * as QT from '../../store/queryTypes'
// // import { Posts } from './Posts'


// // interface EventProps {
// //   symbol: QT.getSymbol_symbol
// // }

// // export const Event: React.FC<EventProps> = ({ symbol }) => {
// //   // if (symbol.status === QT.SymbolStatus.ARCHIVED)

// //   return (
// //     <>
// //       <h1>
// //         {symbol.name}
// //       </h1>
// //       <p>
// //         {symbol.body}
// //       </p>
// //       {/* <Posts posts={symbol.posts} /> */}
// //     </>
// //   )
// // }


// // export function Symbol() {
// //   const name = "!event-name"
// //   const { data, loading, error, fetchMore } = useQuery<QT.getSymbol, QT.getSymbolVariables>(
// //     queries.BLOCK,
// //     //   queries.GET_SYMBOL, {
// //     //   variables: { name },
// //     //   fetchPolicy: "cache-and-network"
// //     // }
// //   )

// //   if (loading) return <p>Loading...</p>
// //   if (error) return <p>ERROR: {error.message}</p>
// //   if (!data) return <p>No feeds</p>

// //   switch (data.symbol.cat) {
// //     case QT.SymbolCat.EVENT:
// //       return <Event symbol={data.symbol} />
// //     case QT.SymbolCat.TAG:
// //       return <Event symbol={data.symbol} />
// //     case QT.SymbolCat.TICKER:
// //       return <Event symbol={data.symbol} />
// //   }
// //   return null
// // }
