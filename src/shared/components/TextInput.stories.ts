import type { Meta, StoryObj } from '@storybook/react-vite';

import TextInput from './TextInput';

const meta = {
  component: TextInput
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'default',
    placeholder: 'placeholder text',
  },
};

export const Invalid: Story = {
  args: {
    id: 'invalid',
    placeholder: 'placeholder text',
    invalid: true,
  },
};

export const Disabled: Story = {
  args: {
    id: 'disabled',
    placeholder: 'placeholder text',
    disabled: true,
  },
};