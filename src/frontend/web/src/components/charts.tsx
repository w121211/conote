import React, { useRef, useEffect } from 'react'
// import 'chartjs-chart-financial'
// import Chart from 'react-apexcharts'

export function BarChart() {
  const options = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [
        'South Korea',
        'Canada',
        'United Kingdom',
        'Netherlands',
        'Italy',
        'France',
        'Japan',
        'United States',
        'China',
        'Germany',
      ],
    },
  }
  const series = [
    {
      // name: 'series-1',
      data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
    },
  ]

  // return <Chart options={options} series={series} type="bar" />
  return null
}

export function CandleChart() {
  // const state = {
  //     series: [{
  //         data: data
  //     }],
  //     options: {
  //         chart: {
  //             id: 'chart2',
  //             type: 'line',
  //             height: 230,
  //             toolbar: {
  //                 autoSelected: 'pan',
  //                 show: false
  //             }
  //         },
  //         colors: ['#546E7A'],
  //         stroke: {
  //             width: 3
  //         },
  //         dataLabels: {
  //             enabled: false
  //         },
  //         fill: {
  //             opacity: 1,
  //         },
  //         markers: {
  //             size: 0
  //         },
  //         xaxis: {
  //             type: 'datetime'
  //         }
  //     },
  //     seriesLine: [{
  //         data: data
  //     }],
  //     optionsLine: {
  //         chart: {
  //             id: 'chart1',
  //             height: 130,
  //             type: 'area',
  //             brush: {
  //                 target: 'chart2',
  //                 enabled: true
  //             },
  //             selection: {
  //                 enabled: true,
  //                 xaxis: {
  //                     min: new Date('19 Jun 2017').getTime(),
  //                     max: new Date('14 Aug 2017').getTime()
  //                 }
  //             },
  //         },
  //         colors: ['#008FFB'],
  //         fill: {
  //             type: 'gradient',
  //             gradient: {
  //                 opacityFrom: 0.91,
  //                 opacityTo: 0.1,
  //             }
  //         },
  //         xaxis: {
  //             type: 'datetime',
  //             tooltip: {
  //                 enabled: false
  //             }
  //         },
  //         yaxis: {
  //             tickAmount: 2
  //         }
  //     },

  // }

  const options = {
    chart: {
      id: 'apexchart-example',
      animations: { enabled: false },
      toolbar: { show: false },
    },
  }
  const series = [
    {
      data: [
        [1538856000000, [6593.34, 6600, 6582.63, 6600]],
        [1538856900000, [6595.16, 6604.76, 6590.73, 6593.86]],
      ],
    },
  ]
  return null
  // return <Chart options={options} series={series} type="candlestick" />
  // return (
  //     <div id="wrapper">
  //         <div id="chart-line2">
  //             <Chart options={this.state.options} series={this.state.series} type="line" height={230} />
  //         </div>
  //         <div id="chart-line">
  //             <Chart options={this.state.optionsLine} series={this.state.seriesLine} type="area" height={130} />
  //         </div>
  //     </div>

  // )
}

// const dataSeries = []

function randomData() {
  let t = 1484418600000
  let prev = Math.floor(Math.random() * (10 - 0)) + 0

  const data = []
  for (var i = 0; i < 10; i++) {
    t += 86400000
    // prev += Math.floor(Math.random() * (5 - -5)) + -5
    prev += Math.floor(Math.random() * (5 - -5)) + -5
    prev = Math.max(prev, 0)
    data.push([t, prev])
  }
  return data
}

export function LineChart() {
  const state = {
    series: [
      { name: 'BUY', data: randomData() },
      { name: 'SELL', data: randomData() },
      { name: 'HOLD', data: randomData() },
    ],
    options: {
      chart: {
        // type: 'area',
        stacked: false,
        height: 350,
        // zoom: {
        //     type: 'x',
        //     enabled: true,
        //     autoScaleYaxis: true
        // },
        toolbar: {
          // autoSelected: 'zoom'
          show: false,
        },
      },
      // dataLabels: {
      //     enabled: false
      // },
      // markers: {
      //     size: 0,
      // },
      stroke: {
        width: 2,
      },
      title: { text: '風向標', align: 'left' },
      // fill: {
      //     type: 'gradient',
      //     gradient: {
      //         shadeIntensity: 1,
      //         inverseColors: false,
      //         opacityFrom: 0.5,
      //         opacityTo: 0,
      //         stops: [0, 90, 100]
      //     },
      // },
      yaxis: {
        // labels: {
        //     formatter: function (val: number) {
        //         return (val / 1000000).toFixed(0);
        //     },
        // },
        title: {
          text: 'Price',
        },
      },
      xaxis: {
        type: 'datetime',
      },
      tooltip: {
        shared: false,
        y: {
          // formatter: function (val: number) {
          //     return (val / 1000000).toFixed(0)
          // },
          title: {
            formatter: function () {
              return null
            },
          },
        },
      },
    },
  }
  // return <Chart options={state.options} series={state.series} type="line" height={350} />
  return null
}
