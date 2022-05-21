import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { Layout } from '../../components/ui-component/layout'

export default {
  component: Layout,
} as ComponentMeta<typeof Layout>

const Template: ComponentStory<typeof Layout> = args => <Layout {...args} />

export const Default = Template.bind({})
Default.args = {
  children: (
    <div>
      asdfasdf aj;sdlkfj;alksjd;lkfj aj;sdlkfj;alskjd;lfk ajs;dlkfj;alksjd;lkfj;
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      ja;slkdjf;lakjs;ldk ja;sldkfj;a lksjd;flkaj asjdf;lakjsd
      asdjf;laksjd;lfkj;alskdj;flkj jas;dlkjfojwoiejfoiwje ofj jfwoiejfoiwjeof
      jwjdijf sjdofjosijofij
    </div>
  ),
}
