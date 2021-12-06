import { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../apollo/apollo-client'
import '../style/global.scss'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const apolloClient = useApollo(pageProps.initialApolloState)
  return (
    // <UserProvider>
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
    // </UserProvider>
  )
}
