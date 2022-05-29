import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { RateTable, TableData } from '../../components/ui-component/rate-table'

const mockRateData: TableData[] = [
  {
    ticker: '$TSLA',
    title: 'Tesla Inc.',
    srcSym: '@http://www.youtube.com/xxx',
    rate: 'LONG',
  },
  {
    ticker: '$F',
    title: 'Ford Motor Company',
    srcSym: '@http://www.youtube.com/xwef',
    rate: 'LONG',
  },
  {
    ticker: '$AAPL',
    title: 'Apple Inc.',
    srcSym: '@http://www.youtube.com/sdjd',
    rate: 'LONG',
  },
  {
    ticker: '$NDVA',
    title: 'Nvidia Corporation',
    srcSym: '@http://www.youtube.com/ndewe',
    rate: 'HOLD',
  },
  {
    ticker: '$NFLX',
    title: '',
    srcSym: '@http://www.youtube.com/nflw',
    rate: 'SHORT',
  },
]

export default {
  component: RateTable,
  decorators: [
    Story => (
      <div style={{ width: 'fit-content' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof RateTable>

const Template: ComponentStory<typeof RateTable> = args => (
  <RateTable {...args} />
)

export const Default = Template.bind({})
Default.args = {
  data: mockRateData,
}
