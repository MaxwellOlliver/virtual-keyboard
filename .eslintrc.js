module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ['plugin:vue/essential', 'eslint:recommended', 'plugin:prettier/recommended'],
	parserOptions: {
		ecmaVersion: 'latest',
		parser: '@typescript-eslint/parser',
		sourceType: 'module',
	},
	plugins: ['vue', '@typescript-eslint', 'prettier'],
	rules: {
		'prettier/prettier': ['error'],
		'vue/require-default-prop': 0,
		'vue/component-name-in-template-casing': ['error', 'PascalCase'],
	},
	globals: {
		_: true,
	},
}
