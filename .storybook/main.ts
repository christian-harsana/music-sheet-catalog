import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
	stories: [
		'../src/features/**/*.mdx',
		'../src/features/**/*.stories.@(js|jsx|mjs|ts|tsx)',
		'../src/shared/components/**/*.mdx',
		'../src/shared/components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
	],
	addons: [
		'@chromatic-com/storybook',
		'@storybook/addon-vitest',
		'@storybook/addon-a11y',
		'@storybook/addon-docs',
		'@storybook/addon-onboarding',
	],
	framework: '@storybook/react-vite',
};
export default config;
