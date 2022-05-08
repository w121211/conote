import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { HomePage } from '../../pages/index'

export default {
  component: HomePage,
} as ComponentMeta<typeof HomePage>

const Template: ComponentStory<typeof HomePage> = () => <HomePage />

export const Default = Template.bind({})
