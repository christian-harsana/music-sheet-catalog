module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'jest-fixed-jsdom',
	testEnvironmentOptions: {
		customExportConditions: [''],
	},
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				tsconfig: {
					jsx: 'react-jsx',
				},
			},
		],
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
};
