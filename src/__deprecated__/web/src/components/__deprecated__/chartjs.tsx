// import React, { useRef, useEffect } from 'react'
// // import 'chartjs-chart-financial'
// import Chart from 'chart.js'
// import ChartDataLabels from 'chartjs-plugin-datalabels'

// Chart.plugins.unregister(ChartDataLabels)


// const color = {
//     "orange": [
//         "#ffe8cc",
//         "#ffd8a8",
//         "#ffc078",
//         "#ffa94d",
//         "#ff922b",
//         "#fd7e14",
//         "#f76707",
//         "#e8590c",
//         "#d9480f"
//     ]
// }

// export function BarChart() {
//     const chartRef = useRef<HTMLCanvasElement>(null);

//     useEffect(() => {
//         const chart = new Chart(chartRef.current!, {
//             plugins: [ChartDataLabels],
//             type: 'horizontalBar',
//             data: {
//                 labels: ['AAA', 'BBB', 'CCC'],
//                 datasets: [{
//                     label: "得票數",
//                     data: [1, 10, 2],
//                     backgroundColor: color.orange,
//                 }]
//             },
//             options: {
//                 animation: {
//                     duration: 0 // general animation time
//                 },
//                 hover: {
//                     animationDuration: 0 // duration of animations when hovering an item
//                 },
//                 responsiveAnimationDuration: 0,
//                 scales: {
//                     xAxes: [{
//                         ticks: {
//                             beginAtZero: true,
//                             max: 15,
//                             display: false,
//                         },

//                     }]
//                 },
//                 plugins: {
//                     datalabels: {
//                         anchor: "end",
//                         align: "right",
//                     }
//                 },
//             },
//         })
//     }, [])


//     return <canvas ref={chartRef} />
// }


// export function CandleChart() {
//     const chartRef = useRef<HTMLCanvasElement>(null);

//     useEffect(() => {
//         const chart = new Chart(chartRef.current!, {
//             plugins: [ChartDataLabels],
//             type: 'horizontalBar',
//             data: {
//                 labels: ['AAA', 'BBB', 'CCC'],
//                 datasets: [{
//                     label: "得票數",
//                     data: [1, 10, 2],
//                     backgroundColor: color.orange,
//                 }]
//             },
//             options: {
//                 animation: {
//                     duration: 0 // general animation time
//                 },
//                 hover: {
//                     animationDuration: 0 // duration of animations when hovering an item
//                 },
//                 responsiveAnimationDuration: 0,
//                 scales: {
//                     xAxes: [{
//                         ticks: {
//                             beginAtZero: true,
//                             max: 15,
//                             display: false,
//                         },

//                     }]
//                 },
//                 plugins: {
//                     datalabels: {
//                         anchor: "end",
//                         align: "right",
//                     }
//                 },
//             },
//         })
//     }, [])


//     return <canvas ref={chartRef} />
// }