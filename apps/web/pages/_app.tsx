import { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../apollo/apollo-client'
import '../style/global.css'
import ModalProvider from '../components/modal/modal-context'
import Script from 'next/script'
import ChannelProvider from '../components/channel/channel-context'
import { TooltipProvider} from '../layout/tooltip/tooltip-provider'

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  const apolloClient = useApollo(pageProps.initialApolloState)

  return (
    // <UserProvider>
    <>
      {/* <Script id='show-sidebar' strategy='afterInteractive' dangerouslySetInnerHTML={{
      __html:`
      if (localStorage.showSidebar === 'true' || (!('showSidebar' in localStorage))) {
        document.getElementById('sidebar').classList.add('open')
      } else {
        document.getElementById('sidebar').classList.remove('open')
      }`
    }}/> */}
      <ApolloProvider client={apolloClient}>
        {/* <ChannelProvider> */}
          <TooltipProvider>
        <ModalProvider>
          <Component {...pageProps} />
        </ModalProvider>
          <TooltipProvider/>
        {/* </ChannelProvider> */}
      </ApolloProvider>
    </>
    // </UserProvider>
  )
}

export default App
