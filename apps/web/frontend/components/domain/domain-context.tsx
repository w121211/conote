import React, { ReactNode, useEffect, useState } from 'react'
import Domain, { DomainType } from './domain'

export const DomainContext = React.createContext<{
  domain: DomainType
  setDomain: (domain: DomainType) => void
}>({
  domain: 'dev',
  setDomain: () => {
    //
  },
})
const { Provider } = DomainContext

const DomainProvider = ({ children }: { children: ReactNode }) => {
  const [domain, setDomain] = useState<DomainType>('dev')

  useEffect(() => {
    const localCannel = Domain.getInstance()
    const hasChannel = localCannel.getDomain()
    if (hasChannel) {
      setDomain(hasChannel)
    } else {
      localCannel.setDomain('dev')
    }
  }, [])

  useEffect(() => {
    const localCannel = Domain.getInstance()
    localCannel.setDomain(domain)
  }, [domain])

  return <Provider value={{ domain, setDomain }}>{children}</Provider>
}

export default DomainProvider
