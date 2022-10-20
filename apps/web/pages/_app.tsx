import { ApolloProvider } from '@apollo/client'
import React, { useState } from 'react'
import { AppProps } from 'next/app'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ErrorBoundary } from 'react-error-boundary'
import { ToastContainer } from 'react-toastify'
import { useApolloClientInitial } from '../apollo/apollo-client'
import { useMe } from '../frontend/components/auth/use-me'
import { MeProvider } from '../frontend/components/auth/use-me-context'
import ErrorFallback from '../frontend/components/error-fallback'
import Layout from '../frontend/components/ui/layout/Layout'
import ModalProvider from '../frontend/components/modal/modal-context'
import { Alert } from '../frontend/components/ui/alert'
import { StatusDisplay } from '../frontend/components/ui/status-display'
import { TooltipProvider } from '../frontend/components/ui/tooltip/tooltip-provider'
import type { AppPageProps } from '../frontend/interfaces'
import { getLoginPageURL } from '../frontend/utils'
import 'react-toastify/dist/ReactToastify.css'
import '../style/global.css'

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()
  const appProps: AppPageProps = pageProps
  const apolloClient = useApolloClientInitial(appProps.initialApolloState)
  const { me, loading } = useMe()
  const [showAnnounce, setAnnounce] = useState(false)

  if (appProps.protected && loading) {
    return null
  }
  // if (appProps.protected && !loading && me === null) {
  //   return (
  //     <StatusDisplay str="Login require">
  //       <Link href={getLoginPageURL(router)}>
  //         <a className="btn-primary-lg">Login</a>
  //       </Link>
  //     </StatusDisplay>
  //   )
  // }
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ToastContainer
        position="top-center"
        autoClose={30000}
        closeOnClick={false}
        draggable={false}
        // hideProgressBar
      />

      <ApolloProvider client={apolloClient}>
        <MeProvider>
          <TooltipProvider>
            <ModalProvider>
              <div className="flex flex-col h-screen">
                {showAnnounce && (
                  <Alert type="announce" onClose={() => setAnnounce(false)}>
                    <span className="flex-grow flex items-center justify-center  gap-2 ">
                      <span className="material-icons-outlined">campaign</span>
                      <span className="truncate">new announcement!</span>
                    </span>
                  </Alert>
                )}
                <Layout sidebarPinned={appProps.sidebarPinned}>
                  {appProps.protected && !loading && me === null ? (
                    <StatusDisplay str="Login require">
                      <Link href={getLoginPageURL(router)}>
                        <a className="btn-primary-lg">Login</a>
                      </Link>
                    </StatusDisplay>
                  ) : (
                    <Component {...pageProps} />
                  )}
                  {/* <Component {...pageProps} /> */}
                </Layout>
              </div>
            </ModalProvider>
          </TooltipProvider>
        </MeProvider>
      </ApolloProvider>
    </ErrorBoundary>
  )
}

export default App
