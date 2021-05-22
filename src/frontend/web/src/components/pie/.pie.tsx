// import React, { useState } from 'react'
// import Pie, { ProvidedProps, PieArcDatum } from '@visx/shape/lib/shapes/Pie'
// import { scaleOrdinal } from '@visx/scale'
// import { animated, useTransition } from 'react-spring'

// interface Options {
//   label: string
//   count: number
// }

// export type PieProps = {
//   width: number
//   height: number
//   margin?: typeof defaultMargin
//   animate?: boolean
// }
// const mockData: Options[] = [
//   { label: '選項1', count: 10 },
//   { label: '選項2', count: 20 },
//   { label: '選項3', count: 6 },
//   { label: '選項4', count: 47 },
//   { label: '選項5', count: 2 },
// ]
// //accessor
// const getCount = (d: Options) => d.count
// const getOptionsColor = scaleOrdinal({
//   domain: mockData.map(l => l.label),
//   range: ['rgba(93,30,91,1)', 'rgba(93,30,91,0.8)', 'rgba(93,30,91,0.6)', 'rgba(93,30,91,0.4)'],
// })
// const defaultMargin = { top: 0, right: 60, bottom: 0, left: 60 }

// export const PieChart = ({ width, height, margin = defaultMargin, animate = true }: PieProps) => {
//   if (width < 10) return null

//   const innerWidth = width - margin.left - margin.right
//   const innerHeight = height - margin.top - margin.bottom
//   const radius = Math.min(innerWidth, innerHeight) / 2
//   const centerY = innerHeight / 2
//   const centerX = innerWidth / 2
//   return (
//     <svg width={width} height={height}>
//       <Pie
//         top={centerY + margin.top}
//         left={centerX + margin.left}
//         data={mockData}
//         pieValue={getCount}
//         outerRadius={radius}
//       >
//         {pie => (
//           <AnimatedPie<Options>
//             {...pie}
//             animate={animate}
//             getKey={({ data: { label } }) => label}
//             getColor={({ data: { label } }) => getOptionsColor(label)}
//             onClickDatum={
//               ({ data: { label } }) => animate && label

//               //   setSelectedAlphabetLetter(selectedAlphabetLetter && selectedAlphabetLetter === letter ? null : letter)
//             }
//           />
//         )}
//       </Pie>
//       {animate && (
//         <text
//           textAnchor="end"
//           x={width - 16}
//           y={height - 16}
//           fill="white"
//           fontSize={11}
//           fontWeight={300}
//           pointerEvents="none"
//         >
//           Click segments to update
//         </text>
//       )}
//     </svg>
//   )
// }

// // react-spring transition definitions
// type AnimatedStyles = { startAngle: number; endAngle: number; opacity: number }
// const fromLeaveTransition = ({ endAngle }: PieArcDatum<any>) => ({
//   // enter from 360° if end angle is > 180°
//   startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
//   endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
//   opacity: 0,
// })
// const enterUpdateTransition = ({ startAngle, endAngle }: PieArcDatum<any>) => ({
//   startAngle,
//   endAngle,
//   opacity: 1,
// })

// type AnimatedPieProps<Datum> = ProvidedProps<Datum> & {
//   animate?: boolean
//   getKey: (d: PieArcDatum<Datum>) => string
//   getColor: (d: PieArcDatum<Datum>) => string
//   onClickDatum: (d: PieArcDatum<Datum>) => void
//   delay?: number
// }

// function AnimatedPie<Datum>({ animate, arcs, path, getKey, getColor, onClickDatum }: AnimatedPieProps<Datum>) {
//   const transitions = useTransition<PieArcDatum<Datum>, AnimatedStyles>(
//     arcs,
//     // @ts-ignore react-spring doesn't like this overload
//     getKey,
//     {
//       from: animate ? fromLeaveTransition : enterUpdateTransition,
//       enter: enterUpdateTransition,
//       update: enterUpdateTransition,
//       leave: animate ? fromLeaveTransition : enterUpdateTransition,
//     },
//   )
//   return (
//     <>
//       {transitions.map(
//         ({ item: arc, props, key }: { item: PieArcDatum<Datum>; props: AnimatedStyles; key: string }) => {
//           const [centroidX, centroidY] = path.centroid(arc)
//           const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1

//           return (
//             <g key={key}>
//               <animated.path
//                 // compute interpolated path d attribute from intermediate angle values
//                 d={interpolate([props.startAngle, props.endAngle], (startAngle, endAngle) =>
//                   path({
//                     ...arc,
//                     startAngle,
//                     endAngle,
//                   }),
//                 )}
//                 fill={getColor(arc)}
//                 onClick={() => onClickDatum(arc)}
//                 onTouchStart={() => onClickDatum(arc)}
//               />
//               {hasSpaceForLabel && (
//                 <animated.g style={{ opacity: props.opacity }}>
//                   <text
//                     fill="white"
//                     x={centroidX}
//                     y={centroidY}
//                     dy=".33em"
//                     fontSize={9}
//                     textAnchor="middle"
//                     pointerEvents="none"
//                   >
//                     {getKey(arc)}
//                   </text>
//                 </animated.g>
//               )}
//             </g>
//           )
//         },
//       )}
//     </>
//   )
// }
