import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { SearchAllForm } from '../components/search-all-form';

export default{
    component:SearchAllForm
}as ComponentMeta<typeof SearchAllForm>

const Template:ComponentStory<typeof SearchAllForm>=args=><SearchAllForm {...args}/>

export const Default=Template.bind({})