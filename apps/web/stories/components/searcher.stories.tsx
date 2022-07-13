import { ApolloProvider } from '@apollo/client'
import { ComponentMeta } from '@storybook/react'
import React from 'react'
import { getApolloClient } from '../../apollo/apollo-client'
import { editorChainItemInsert } from '../../frontend/components/block-editor/src/events'
import ModalProvider from '../../frontend/components/modal/modal-context'
import SearcherModal from '../../frontend/components/search-all-modal/searcher-modal'
import SearcherModalButton from '../../frontend/components/search-all-modal/searcher-modal-button'
import { SearcherProps } from '../../frontend/stores/searcher.repository'

const apolloClient = getApolloClient()

export default {
  component: SearcherModal,
  decorators: [
    Story => (
      <div style={{ width: '30%', margin: '3rem' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    backgrounds: {
      values: [
        { name: 'dark', value: 'rgb(55 65 81)' },
        { name: 'gray', value: 'rgb(243 244 246)' },
        { name: 'white', value: '#fff' },
      ],
    },
  },
} as ComponentMeta<typeof SearcherModal>

// const Template: ComponentStory<typeof SearcherModal> = (
//   searcher: SearcherProps['searcher'],
// ) => (
//   <ApolloProvider client={apolloClient}>
//     <ModalProvider>
//       <SearcherModalButton searcher={searcher} />
//       <SearcherModal />
//     </ModalProvider>
//   </ApolloProvider>
// )

// export const Default = Template.bind({})

export const Default = () => {
  const searcher: SearcherProps['searcher'] = {
    hitType: 'link',
    searchRange: 'symbol',
  }
  return (
    <ApolloProvider client={apolloClient}>
      <ModalProvider>
        <SearcherModalButton searcher={searcher} />
        <SearcherModal />
      </ModalProvider>
    </ApolloProvider>
  )
}

export const Chain = () => {
  const searcher: SearcherProps['searcher'] = {
    hitType: 'button',
    searchRange: 'symbol',
    hitOnClick: hit => {
      editorChainItemInsert(hit, null).then(({ draftInserted }) => {
        console.debug(draftInserted)
      })
    },
    createSymbolOnClick: symbol => {
      editorChainItemInsert(symbol, null).then(({ draftInserted }) => {
        console.debug(draftInserted)
      })
    },
  }
  return (
    <ApolloProvider client={apolloClient}>
      <ModalProvider>
        <SearcherModal />
        <SearcherModalButton searcher={searcher} />
        <SearcherModalButton searcher={searcher} />
      </ModalProvider>
    </ApolloProvider>
  )
}
