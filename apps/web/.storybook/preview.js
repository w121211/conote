import { RouterContext } from 'next/dist/shared/lib/router-context'
import 'react-toastify/dist/ReactToastify.css'
import '../style/global.css'

export const parameters = {
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
  options: {
    storySort: {
      order: [
        'Intro',
        'Pages',
        ['Home', 'Login', 'Admin'],
        'Components',
        '*',
        'WIP',
      ],
    },
  },
}
export const globalTypes = {
  darkMode: true,
}
