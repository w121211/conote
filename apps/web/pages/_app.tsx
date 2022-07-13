import { ApolloProvider } from '@apollo/client'
import { AppProps } from 'next/app'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ToastContainer } from 'react-toastify'
import { useApolloClientInitial } from '../apollo/apollo-client'
import { useMe } from '../frontend/components/auth/use-me'
import { MeProvider } from '../frontend/components/auth/use-me-context'
import ErrorFallback from '../frontend/components/error-fallback'
import Layout from '../frontend/components/ui-component/layout/layout'
import ModalProvider from '../frontend/components/modal/modal-context'
import { Alert } from '../frontend/components/ui-component/alert'
import { StatusDisplay } from '../frontend/components/ui-component/status-display'
import { TooltipProvider } from '../frontend/components/ui-component/tooltip/tooltip-provider'
import { getLoginPageURL } from '../frontend/utils'
import 'react-toastify/dist/ReactToastify.css'
import '../style/global.css'

const App = ({ Component, pageProps }: AppProps): JSX.Element | null => {
  const router = useRouter(),
    apolloClient = useApolloClientInitial(pageProps.initialApolloState),
    { me, loading } = useMe(),
    [showAnnounce, setAnnounce] = useState(true)

  if (pageProps.protected && loading) {
    return null
  }
  if (pageProps.protected && !loading && me === null) {
    return (
      <StatusDisplay
        str="Login require"
        btn={
          <Link href={getLoginPageURL(router)}>
            <a className="btn-primary-lg font-medium text-lg">Login</a>
          </Link>
        }
      />
    )
  }
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {/* <Script id='show-sidebar' strategy='afterInteractive' dangerouslySetInnerHTML={{
      __html:`
      if (localStorage.showSidebar === 'true' || (!('showSidebar' in localStorage))) {
        document.getElementById('sidebar').classList.add('open')
      } else {
        document.getElementById('sidebar').classList.remove('open')
      }`
    }}/> */}

      {/* <Script
        id="theme"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          // On page load or when changing themes, best to add inline in "head" to avoid FOUC
          if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }

          // Whenever the user explicitly chooses light mode
          // localStorage.theme = 'light'

          // Whenever the user explicitly chooses dark mode
          // localStorage.theme = 'dark'

          // Whenever the user explicitly chooses to respect the OS preference
          // localStorage.removeItem('theme')`,
        }}
      /> */}

      <ToastContainer
        position="top-center"
        autoClose={false}
        hideProgressBar
        closeOnClick
        draggable={false}
      />

      <ApolloProvider client={apolloClient}>
        <MeProvider>
          <TooltipProvider>
            <ModalProvider>
              <div className="flex flex-col h-screen">
                {showAnnounce && (
                  <Alert type="announce" onClose={() => setAnnounce(false)}>
                    <span className="flex-grow flex items-center justify-center  gap-2 ">
                      <span className="material-icons">campaign</span>
                      <span className="truncate">new announcement!</span>
                    </span>
                  </Alert>
                )}
                <Layout>
                  <Component {...pageProps} />
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
