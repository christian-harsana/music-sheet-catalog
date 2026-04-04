import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier/recommended';

export default defineConfig([
	// Global ignores
	globalIgnores(['node_modules/**', 'dist/**', 'build/**', 'coverage/**']),

	// Base JS + TypeScript + React rules
	eslint.configs.recommended, // cover .js, .cjs, and .mjs files
	tseslint.configs.recommended, // cover .ts files

	// Browser globals for all files
	{
		languageOptions: {
			sourceType: 'module',
			ecmaVersion: 'latest',
			globals: globals.browser,
		},
	},

	// Fix for babel.config.cjs, jest.config.cjs etc.
	{
		files: ['**/*.cjs'],
		languageOptions: {
			sourceType: 'commonjs',
			globals: globals.node,
		},
	},

	// Override specific TypeScript rules
	{
		files: ['**/*.{ts,tsx}'],
		rules: {
			// Ignore no-unused-vars rule for function with _
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					varsIgnorePattern: '^_',
					argsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
		},
	},

	// React + React Hooks rules (jsx/tsx files only)
	{
		files: ['**/*.{jsx,tsx}'],
		extends: [
			reactPlugin.configs.flat.recommended,
			reactPlugin.configs.flat['jsx-runtime'], // for React 17+ new JSX transform
			reactHooks.configs['recommended-latest'],
			reactRefresh.configs.vite,
		],
		settings: {
			sourceType: 'module', // explicit ES module declaration
			ecmaVersion: 'latest', // enable latest JS syntax
			react: { version: 'detect' },
		},
		rules: {
			'react/react-in-jsx-scope': 'off',
			'react/prop-types': 'off',
		},
	},

	// Prettier — must be last
	prettierConfig,
	prettierPlugin,
]);
