import { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../apollo/apollo-client'
// See: https://github.com/vercel/next.js/blob/canary/examples/with-ant-design/pages/_app.js
import 'antd/dist/antd.css'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const apolloClient = useApollo(pageProps.initialApolloState)

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}
