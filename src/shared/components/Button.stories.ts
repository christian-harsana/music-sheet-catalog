import type { Meta, StoryObj } from '@storybook/react-vite';

import Button from './Button.tsx';

const meta = {
  component: Button,
  argTypes: {
    variant: {
      options: ['primary', 'secondary'],
      control: { type: 'radio' }
    },
    size: {
      options: ['small', 'medium'],
      control: { type: 'radio'}
    }
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Click Here',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Click Here',
    variant: 'secondary',
  },
};

export const Small: Story = {
  args: {
    children: 'Click Here',
    size: 'small',
  },
};

export const FullWidth: Story = {
  args: {
    children: 'Click Here',
    fullWidth: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Click Here',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: 'Click Here',
    loading: true,
  },
};

export const Link: Story = {
  args: {
    children: 'Go to Google',
    tag: 'a',
    href: 'https://www.google.com',
    target: '_blank'
  },
};