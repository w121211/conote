import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

const Link = () => {
  return (
    <a className="text-blue-500 cursor-pointer dark:text-blue-300 hover:bg-gray-100 dark:hover:bg-gray-600">
      test
    </a>
  )
}

export default {
  component: Link,
} as ComponentMeta<typeof Link>

export const Template: ComponentStory<typeof Link> = () => <Link />
