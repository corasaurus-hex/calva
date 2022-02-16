module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        sourceType: 'module',
        project: './tsconfig.eslint.json',
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'prettier',
    ],
    plugins: ['@typescript-eslint', 'import'],
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true,
    },
    rules: {
        curly: ['error'],
        'import/no-unresolved': ['error', { ignore: ['^vscode$'] }], // errors
        'no-constant-condition': ['error', { checkLoops: false }],
        'prefer-const': ['error'],
        'prefer-rest-params': ['error'],
        'prefer-spread': ['error'],
        'array-callback-return': ['error'],
        'no-constructor-return': ['error'],
        '@typescript-eslint/no-inferrable-types': 'off',

        // 'no-unused-vars': 'off',
        // '@typescript-eslint/no-unused-vars': [
        //     'error',
        //     {
        //         vars: 'all',
        //         args: 'after-used',
        //         ignoreRestSiblings: true,
        //         argsIgnorePattern: '^_',
        //     },
        // ],

        // '@typescript-eslint/await-thenable': 'off',
        // '@typescript-eslint/ban-types': 'off',
        // '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        // '@typescript-eslint/no-for-in-array': 'off',
        // '@typescript-eslint/no-misused-promises': 'off',
        // '@typescript-eslint/no-non-null-assertion': 'off',
        // '@typescript-eslint/no-this-alias': 'off',
        // '@typescript-eslint/no-unnecessary-type-assertion': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        // '@typescript-eslint/no-var-requires': 'off',
        // '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/restrict-plus-operands': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/unbound-method': 'off',
    },
    overrides: [
        {
            files: ['*.js'],
            rules: {
                '@typescript-eslint/no-var-requires': 'off',
            },
        },
    ],
};
