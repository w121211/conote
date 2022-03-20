// import '!style-loader!css-loader!sass-loader!../src/globalStyles/global.scss'
import { MockedProvider } from '@apollo/client/testing'
import '../style/global.css'

export const parameters = {
  apolloClient: {
    MockedProvider,
    // any props you want to pass to MockedProvider on every story
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  layout: 'centered',
}
