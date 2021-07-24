// import { curveLinear } from '@visx/curve'
// import { LinePath, BarGroupHorizontal, BarGroup, Bar } from '@visx/shape'
// import { Group } from '@visx/group'
// import { AxisLeft, AxisBottom } from '@visx/axis'
// import { scaleLog } from '@visx/scale'
// import generateDateValue, { DateValue } from '@visx/mock-data/lib/generators/genDateValue'
// import { scaleTime, scaleLinear, scaleLog, scaleOrdinal, scaleBand } from '@visx/scale'

// import { extent, max, min } from 'd3-array'
import { Poll } from '../../apollo/query.graphql'

type PollData = {
  choice: string
  value: number
}

const LineChart = ({ pollData }: { pollData: Poll }) => {
  const dataArr: PollData[] = []
  pollData.choices.forEach((e, i) => {
    dataArr.push({ choice: e, value: pollData.count.nVotes[i] })
  })
  // const lineCount = 3
  // const series = new Array(lineCount).fill(null).map((_, i) =>
  //   // vary each series value deterministically
  //   generateDateValue(7, /* seed= */ i / 2).sort((a: DateValue, b: DateValue) => a.date.getTime() - b.date.getTime()),
  // )
  // console.log(series)
  // const allData = series.reduce((rec, d) => rec.concat(d), [])
  // data accessors
  const getX = (d: PollData) => d.value
  const getY = (d: PollData) => d.choice

  // const lineData = generateDateValue(25, /* seed= */ 3 / 72).sort(
  //   (a: DateValue, b: DateValue) => a.date.getTime() - b.date.getTime(),
  // )
  const blue = '#aeeef8'
  const green = '#e5fd3d'
  const purple = '#9caff6'
  // const colorScale = scaleOrdinal<string, string>({
  //   domain: pollData.choices,
  //   range: [blue, green, purple],
  // })

  // const xScale = scaleLinear<number>({
  //   domain: [0, Math.max(...pollData.count.nVotes) * 10],
  //   range: [0, Math.max(...pollData.count.nVotes)],
  // })
  // const yScale = scaleLinear<number>({
  //   domain: dataArr.map(e => e.choice),
  //   range: [100, 0],
  //   // base: 10,
  // })

  // const dataScale = scaleBand({
  //   domain: pollData.choices,
  //   padding: 10,
  // })
  // const cityScale = scaleBand({
  //   domain: keys,
  //   padding: 0.1,
  // });

  const getData = (d: PollData) => d.choice

  // const timeScale = scaleTime<number>({
  //   domain: [Math.min(...cityTemperature.map(date)), Math.max(...cityTemperature.map(date))],
  // });
  // xScale.range([0, 300])
  // yScale.range([100, 0])
  return (
    <div>
      <svg width="100%" height="100%">
        {/* {series.map((e, i) => { */}
        {/* return ( */}
        {/* <Group top={20} left={20}>
          <AxisBottom scale={xScale} top={100} /> */}
        {/* <AxisLeft scale={yScale} /> */}
        {/* <LinePath
                curve={curveLinear}
                data={e}
                x={d => xScale(getX(d)) ?? 0}
                y={d => yScale(getY(d)) ?? 0}
                stroke="#333"
                strokeWidth={1}
              /> */}
        {/* <BarGroupHorizontal
          data={dataArr}
          keys={pollData.choices}
          color={colorScale}
          xScale={xScale}
          y0={getData}
          y0Scale={dataScale}
          y1Scale={dataScale}
          width={400}
        >
          {barGroups =>
            barGroups.map(bar => <Bar key={bar.index} fill={bar.bars[bar.index].color} width={20} height={20} />)
          }
        </BarGroupHorizontal> */}
        {/* </Group> */}
        {/* ) */}
        {/* })} */}
      </svg>
    </div>
  )
}
export default LineChart
