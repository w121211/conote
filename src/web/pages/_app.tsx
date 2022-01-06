import { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../apollo/apollo-client'
import '../style/global.css'
import ModalProvider from '../components/modal/modal-context'
import Script from 'next/script'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
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
        <ModalProvider>
          <Component {...pageProps} />
        </ModalProvider>
      </ApolloProvider>
    </>
    // </UserProvider>
  )
}
