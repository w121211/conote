import { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../apollo/apollo-client'
<<<<<<< HEAD
import Layout from '../components/layout/layout'
import 'antd/dist/antd.css' //  See: https://github.com/vercel/next.js/blob/canary/examples/with-ant-design/pages/_app.js
import '../style/global.scss'
=======
import 'antd/dist/antd.css' //  See: https://github.com/vercel/next.js/blob/canary/examples/with-ant-design/pages/_app.js
>>>>>>> backend-dev

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const apolloClient = useApollo(pageProps.initialApolloState)

  return (
    <ApolloProvider client={apolloClient}>
<<<<<<< HEAD
      <Layout>
        <Component {...pageProps} />
      </Layout>
=======
      <Component {...pageProps} />
>>>>>>> backend-dev
    </ApolloProvider>
  )
}
