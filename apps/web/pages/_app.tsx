import { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import { useApolloClientSSR } from '../apollo/apollo-client-ssr'
import '../style/global.css'
import ModalProvider from '../components/modal/modal-context'
import Script from 'next/script'
import ChannelProvider from '../components/channel/channel-context'
import { TooltipProvider } from '../layout/tooltip/tooltip-provider'

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  const apolloClient = useApolloClientSSR(pageProps.initialApolloState)

  return (
    // <UserProvider>
    <>
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
    </>
  )
}

export default App
