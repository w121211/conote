import { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import { useApolloClientSSR } from '../apollo/apollo-client-ssr'
import ErrorBoundary from '../components/error-boundary'
import ModalProvider from '../components/modal/modal-context'
import { TooltipProvider } from '../layout/tooltip/tooltip-provider'
import '../style/global.css'

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  const apolloClient = useApolloClientSSR(pageProps.initialApolloState)

  return (
    <ErrorBoundary>
      {/* <Script id='show-sidebar' strategy='afterInteractive' dangerouslySetInnerHTML={{
      __html:`
      if (localStorage.showSidebar === 'true' || (!('showSidebar' in localStorage))) {
        document.getElementById('sidebar').classList.add('open')
      } else {
        document.getElementById('sidebar').classList.remove('open')
      }`
    }}/> */}
      <ApolloProvider client={apolloClient}>
        <TooltipProvider>
          <ModalProvider>
            <Component {...pageProps} />
          </ModalProvider>
        </TooltipProvider>
      </ApolloProvider>
    </ErrorBoundary>
  )
}

export default App
