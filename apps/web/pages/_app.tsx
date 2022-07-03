import { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import ModalProvider from '../components/modal/modal-context'
import '../style/global.css'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from '../components/error-fallback'
import { TooltipProvider } from '../components/ui-component/tooltip/tooltip-provider'
import { useMe } from '../components/auth/use-me'
import Link from 'next/link'
import { useApolloClientInitial } from '../apollo/apollo-client'
import { MeProvider } from '../components/auth/use-me-context'
import Layout from '../components/ui-component/layout/layout'
import { useState } from 'react'
import { Alert } from '../components/ui-component/alert'
import { getLoginPageURL } from '../components/utils'

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  const apolloClient = useApolloClientInitial(pageProps.initialApolloState),
    { me, loading } = useMe()
  const [showAnnounce, setAnnounce] = useState(true)

  if (pageProps.protected && !loading && me === null) {
    return (
      <div>
        <p>
          <Link href={getLoginPageURL()}>
            <a>Login</a>
          </Link>{' '}
          to continue
        </p>
      </div>
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

      <ApolloProvider client={apolloClient}>
        <MeProvider>
          <TooltipProvider>
            <ModalProvider>
              <div className="flex flex-col h-screen">
                {showAnnounce && (
                  <Alert type="announce" onClose={() => setAnnounce(false)}>
                    <div className="flex-grow flex items-center justify-center  gap-2 ">
                      <span className="material-icons">campaign</span>
                      <span className="truncate">new announcement!</span>
                    </div>
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
