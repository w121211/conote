import { useRouter } from 'next/router'
import React from 'react'
import Popover from '../../../components/popover/popover'

const MirrorPopover = () => {
  const router = useRouter()
  return (
    <></>
    // <Popover
    //   visible={!!router.query.mirror}
    //   hideBoard={() => {
    //     router.push(`/card/${!!router.query.symbol}`)
    //   }}
    // >
    //   <div></div>
    // </Popover>
  )
}
export default MirrorPopover
