// import React, { useState } from 'react'
// import { useQuery, useMutation } from '@apollo/client'
// import * as queries from '../../store/queries'
// import * as QT from '../../store/queryTypes'


// interface CommitTileProps {
//   name: string
// }

// // const CommitTile: React.FC<CommitTileProps> = ({ name }) => {
// //   const { data, loading, error } = useQuery<QT.getSymbol, QT.getSymbolVariables>(
// //     queries.BLOCK,
// //     //   queries.GET_SYMBOL, {
// //     //   variables: { name }
// //     // }
// //   )
// //   return (
// //     <a>
// //       {data?.symbol.name} (+0.00%)
// //     </a>
// //   )
// // }

// // interface CommitTilesProps extends QT.myFollows { }

// // export const CommitTiles: React.FC<CommitTilesProps> = ({ myFollows }) => {
// //   const follows = myFollows.filter(x => x.followed === true)
// //   return (
// //     <>
// //       {follows.map(
// //         (x, i) => <CommitTile key={i} name={x.symbolId} />
// //       )}
// //     </>
// //   )
// // }