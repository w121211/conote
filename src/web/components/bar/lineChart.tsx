import { curveLinear } from '@visx/curve'
import { LinePath } from '@visx/shape'
import { Group } from '@visx/group'
import { AxisLeft, AxisBottom } from '@visx/axis'
// import { scaleLog } from '@visx/scale'
import generateDateValue, { DateValue } from '@visx/mock-data/lib/generators/genDateValue'
import { scaleTime, scaleLinear, scaleLog } from '@visx/scale'

import { extent, max, min } from 'd3-array'

const LineChart = () => {
  const lineCount = 3
  const series = new Array(lineCount).fill(null).map((_, i) =>
    // vary each series value deterministically
    generateDateValue(7, /* seed= */ i / 2).sort((a: DateValue, b: DateValue) => a.date.getTime() - b.date.getTime()),
  )
  // console.log(series)
  const allData = series.reduce((rec, d) => rec.concat(d), [])
  // data accessors
  const getX = (d: DateValue) => d.date
  const getY = (d: DateValue) => d.value / 200

  // const lineData = generateDateValue(25, /* seed= */ 3 / 72).sort(
  //   (a: DateValue, b: DateValue) => a.date.getTime() - b.date.getTime(),
  // )

  const xScale = scaleTime<number>({
    domain: extent(allData, getX) as [Date, Date],
  })
  const yScale = scaleLinear<number>({
    domain: [0, 16],
    range: [100, 0],
    // base: 10,
  })

  // const timeScale = scaleTime<number>({
  //   domain: [Math.min(...cityTemperature.map(date)), Math.max(...cityTemperature.map(date))],
  // });
  xScale.range([0, 400])
  // yScale.range([100, 0])
  return (
    <div>
      <svg width="100%" height="100%">
        {series.map((e, i) => {
          return (
            <Group key={i} top={20} left={20}>
              <AxisBottom scale={xScale} top={100} />
              <AxisLeft scale={yScale} />
              <LinePath
                curve={curveLinear}
                data={e}
                x={d => xScale(getX(d)) ?? 0}
                y={d => yScale(getY(d)) ?? 0}
                stroke="#333"
                strokeWidth={1}
              />
            </Group>
          )
        })}
      </svg>
    </div>
  )
}
export default LineChart
