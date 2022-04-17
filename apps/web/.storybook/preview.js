// import '!style-loader!css-loader!sass-loader!../src/globalStyles/global.scss'
import { MockedProvider } from '@apollo/client/testing'
import { RouterContext } from 'next/dist/shared/lib/router-context'
import '../style/global.css'

export const parameters = {
  apolloClient: {
    MockedProvider,
    // any props you want to pass to MockedProvider on every story
  },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    expanded: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  // layout: 'centered',
  options: {
    storySort: {
      order: ['Intro', 'Pages', ['Home', 'Login', 'Admin'], 'Components', '*', 'WIP'],
    },
  },
}
