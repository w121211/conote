import React, { useState } from 'react'

export default () => {
  const [modal, setModal] = useState(false)
  // const [modalContent,setModalContent]=useState<ReactNode>()

  const handleModal = (content: React.ReactNode | false = false) => {
    setModal(!modal)
    // if(content){
    //     setModalContent(content)
    // }
  }
  return { modal, handleModal }
}
