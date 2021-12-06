import { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../apollo/apollo-client'
import '../style/global.scss'
import ModalProvider from '../components/modal/modalContext'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const apolloClient = useApollo(pageProps.initialApolloState)
  return (
    <UserProvider>
      <ApolloProvider client={apolloClient}>
        <ModalProvider>
          <Component {...pageProps} />
        </ModalProvider>
      </ApolloProvider>
    </UserProvider>
  )
}
