import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import MyTooltip from '../my-tooltip/my-tooltip'
import BulletPanel from './bullet-panel'
import { BulletPanelType } from './bullet-panel'
import SrcIcon from '../../assets/svg/foreign.svg'
// import BulletPanelSvg from './bullet-panel-svg'
// import classes from './bullet-panel.module.scss'

export default {
  comoponent: BulletPanel,
  title: 'BulletPanel',
  decorators: [
    Story => (
      <div style={{ position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
} as Meta

const Template: Story<BulletPanelType> = args => <BulletPanel {...args} />

export const Default = Template.bind({})
Default.args = {
  children: [
    {
      icon: 's',
      text: '來源連結',
    },
    { icon: '#', text: '新增標籤' },
  ],
}
