import React, { useRef, useState } from 'react'
// // import { LatestNotes } from '../pages'
// import HotDisplay from './latest-discuss-tile'
// // import TabsWithSlider from './tabs-with-slider'

// const NewHotList = () => {
//   const [activeList, setActiveList] = useState(0)
//   return (
//     <div className="w-screen md:w-2/3 flex-grow flex-shrink min-w-0">
//       {/* <div className="flex justify-between gap-3 mb-6 border-gray-200">
//         {['熱門'].map((tab, i) => (
//           <h4
//             className={`flex-grow flex items-center gap-1 px-4 py-2 border font-normal rounded ${
//               activeList === i ? 'text-blue-600 bg-blue-100 border-transparent' : 'border-gray-200 text-gray-700'
//             } cursor-pointer `}
//             onClick={e => {
//               setActiveList(i)
//             }}
//             key={tab}
//           >
//             <span className="material-icons text-lg">{i === 0 ? 'auto_awesome' : 'whatshot'}</span>
//             {tab}
//           </h4>
//         ))}
//       </div> */}
//       {/* <div className="flex justify-between gap-3 mb-4 border-gray-200">
//         {['熱門'].map((tab, i) => (
//           <h2
//             className={`flex-grow flex items-center gap-1 text-xl font-medium text-gray-800`}
//             onClick={e => {
//               setActiveList(i)
//             }}
//             key={tab}
//           >
//             <span className="material-icons text-lg">{i === 0 ? 'auto_awesome' : 'whatshot'}</span>
//             {tab}
//           </h2>
//         ))}
//       </div> */}
//       {/* <TabsWithSlider
//         tabs={['最新', '熱門']}
//         tabListWidth={listContainer.current?.getBoundingClientRect().width}
//         handleActiveList={i => setActiveList(i)}
//       /> */}
//       {/* {activeList === 0 && <LatestNotes />} */}
//       {activeList === 0 && <HotDisplay />}
//     </div>
//   )
// }

// export default NewHotList
