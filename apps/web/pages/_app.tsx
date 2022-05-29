import { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import { useApolloClientSSR } from '../apollo/apollo-client-ssr'
import ModalProvider from '../components/modal/modal-context'
import '../style/global.css'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from '../components/error-fallback'
import { TooltipProvider } from '../components/ui-component/tooltip/tooltip-provider'

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  const apolloClient = useApolloClientSSR(pageProps.initialApolloState)

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
