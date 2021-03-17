// import React, { useState } from 'react'
// import { useQuery, useMutation } from '@apollo/client'
// import * as queries from '../../store/queries'
// import * as QT from '../../store/queryTypes'


// interface SymbolSlotProps {
//   name: string
// }

// const SymbolTile: React.FC<SymbolSlotProps> = ({ name }) => {
//   // const { data, loading, error } = useQuery<QT.getSymbol, QT.getSymbolVariables>(
//   //   queries.GET_SYMBOL, {
//   //   variables: { name }
//   // })
//   // return (
//   //   <a>
//   //     {data?.symbol.name} (+0.00%)
//   //   </a>
//   // )
//   return null
// }

// // interface SymbolTilesProps extends QT.myFollows { }

// // export const SymbolTilesEvents: React.FC<SymbolTilesProps> = ({ myFollows }) => {
// //   const follows = myFollows.filter(x => x.followed === true)
// //   return (
// //     <>
// //       {follows.map(
// //         (x, i) => <SymbolTile key={i} name={x.symbolId} />
// //       )}
// //     </>
// //   )
// // }