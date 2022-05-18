import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { UserPage } from '../../pages/user/[userid]'

export default {
  component: UserPage,
} as ComponentMeta<typeof UserPage>

const Template: ComponentStory<typeof UserPage> = () => <UserPage />

export const Default = Template.bind({})

Default.story = {
  parameters: {
    nextRouter: {
      // path: "/profile/[id]",
      // asPath: "/profile/lifeiscontent",
      query: {
        userid: 'fieowjelcij123',
      },
    },
  },
}
