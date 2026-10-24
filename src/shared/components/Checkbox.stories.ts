import type { Meta, StoryObj } from '@storybook/react-vite';

import Checkbox from './Checkbox';

const meta = {
	component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		id: 'default',
		label: 'Set as default',
	},
};

export const Invalid: Story = {
	args: {
		id: 'invalid',
		label: 'Set as default',
		invalid: true,
	},
};

export const Disabled: Story = {
	args: {
		id: 'disabled',
		label: 'Set as default',
		disabled: true,
	},
};
