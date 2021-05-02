// import React from 'react'
// import { BarGroupHorizontal, Bar } from '@visx/shape'
// import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale'

// export type BarGroupHorizontalProps = {
//   width: number
//   height: number
//   margin?: { top: number; right: number; bottom: number; left: number }
//   events?: boolean
// }
// interface Options {
//   label: string
//   count: number
// }
// const mockData: Options[] = [
//   { label: '選項1', count: 10 },
//   { label: '選項2', count: 20 },
//   { label: '選項3', count: 6 },
//   { label: '選項4', count: 47 },
//   { label: '選項5', count: 2 },
// ]

// const blue = '#aeeef8'
// export const green = '#e5fd3d'
// const purple = '#9caff6'
// export const background = '#612efb'
// const defaultMargin = { top: 20, right: 20, bottom: 20, left: 50 }

// function max<D>(arr: D[], fn: (d: D) => number) {
//   return Math.max(...arr.map(fn))
// }

// const keys = mockData.map(el => el.label)
// const counts = mockData.map(el => el.count)

// // accessors
// const getDate = (d: Options) => d.count

// // scales

// const labelScale = scaleBand({
//   domain: keys,
//   padding: 0.1,
// })
// const countScale = scaleLinear<number>({
//   domain: [0, max(counts, d => max(keys, key => Number(d[key])))],
// })
// const colorScale = scaleOrdinal<string, string>({
//   domain: keys,
//   range: [blue, green, purple],
// })

// export default function Example({ width, height, margin = defaultMargin, events = false }: BarGroupHorizontalProps) {
//   // bounds
//   const xMax = width - margin.left - margin.right
//   const yMax = height - margin.top - margin.bottom

//   // update scale output dimensions

//   //    labelScale.rangeRound([0, dateScale.bandwidth()]);
//   countScale.rangeRound([0, xMax])

//   return width < 10 ? null : (
//     <svg width={width} height={height}>
//       <Bar
//         data={mockData}
//         keys={keys}
//         width={xMax}
//         y0={getDate}
//         y0Scale={}
//         y1Scale={labelScale}
//         xScale={countScale}
//         color={colorScale}
//       >
//         {bar =>
//           bar.map(barGroup => (
//             <Bar
//               key={`${barGroup.index}-${bar.index}-${bar.key}`}
//               x={bar.x}
//               y={bar.y}
//               width={bar.width}
//               height={bar.height}
//               fill={bar.color}
//               rx={4}
//               onClick={() => {
//                 if (events) alert(`${bar.key} (${bar.value}) - ${JSON.stringify(bar)}`)
//               }}
//             />
//           ))
//         }
//       </Bar>
//     </svg>
//   )
// }
