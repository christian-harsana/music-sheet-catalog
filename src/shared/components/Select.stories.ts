import type { Meta, StoryObj } from '@storybook/react-vite';

import Select from './Select.tsx';

const meta = {
    component: Select<Option>,
} satisfies Meta<typeof Select<Option>>

export default meta;
type Story = StoryObj<typeof meta>;
type Option = { value: string, label: string}

export const Default: Story = {
    args: {
        id: 'default',
        options: [
            {'value' : '1', 'label' : 'option 1'}, 
            {'value' : '2', 'label' : 'option 2'}, 
            {'value' : '3', 'label' : 'option 3'}
        ],
        getOptionLabel: (o: Option) => o.label,
        getOptionValue: (o: Option) => o.value,
    },
};

export const Loading: Story = {
    args: {
        id: 'loading',
        options: [
            {'value' : '1', 'label' : 'option 1'}, 
            {'value' : '2', 'label' : 'option 2'}, 
            {'value' : '3', 'label' : 'option 3'}
        ],
        getOptionLabel: (o: Option) => o.label,
        getOptionValue: (o: Option) => o.value,
        loading: true
    },
};

export const Invalid: Story = {
    args: {
        id: 'invalid',
        options: [
            {'value' : '1', 'label' : 'option 1'}, 
            {'value' : '2', 'label' : 'option 2'}, 
            {'value' : '3', 'label' : 'option 3'}
        ],
        getOptionLabel: (o: Option) => o.label,
        getOptionValue: (o: Option) => o.value,
        invalid: true
    },
};

export const Disabled: Story = {
    args: {
        id: 'disabled',
        options: [
            {'value' : '1', 'label' : 'option 1'}, 
            {'value' : '2', 'label' : 'option 2'}, 
            {'value' : '3', 'label' : 'option 3'}
        ],
        getOptionLabel: (o: Option) => o.label,
        getOptionValue: (o: Option) => o.value,
        disabled: true
    },
};