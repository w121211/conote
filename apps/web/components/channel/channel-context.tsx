import React, { ReactNode, useEffect, useState } from 'react'
import Channel, { ChannelType } from './channel'

export const ChannelContext = React.createContext<{ channel: ChannelType; setChannel: (channel: ChannelType) => void }>(
  {
    channel: 'dev',
    setChannel: () => {
      //
    },
  },
)
const { Provider } = ChannelContext

const ChannelProvider = ({ children }: { children: ReactNode }) => {
  const [channel, setChannel] = useState<ChannelType>('dev')

  useEffect(() => {
    const localCannel = Channel.getInstance()
    const hasChannel = localCannel.getChannel()
    if (hasChannel) {
      setChannel(hasChannel)
    } else {
      localCannel.setChannel('dev')
    }
  }, [])

  useEffect(() => {
    const localCannel = Channel.getInstance()
    localCannel.setChannel(channel)
  }, [channel])

  return <Provider value={{ channel, setChannel }}>{children}</Provider>
}

export default ChannelProvider
