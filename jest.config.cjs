module.exports = {
	preset: 'ts-jest/presets/default-esm',
	setupFiles: ['./jest.setup.ts'],
	testEnvironment: 'jest-fixed-jsdom',
	testEnvironmentOptions: {
		customExportConditions: [''],
	},
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				useESM: true,
				tsconfig: {
					jsx: 'react-jsx',
					module: 'ESNext',
    				moduleResolution: 'bundler',
					types: ['vite/client'],
				},
			},
		],
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
	extensionsToTreatAsEsm: ['.ts', '.tsx'],
};
