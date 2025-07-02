module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es2021: true,
        jest: true
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@babel/eslint-parser',
        requireConfigFile: false,
        ecmaVersion: 2022,
        sourceType: 'module'
    },
    extends: [
        '@nuxtjs/eslint-config',
        'plugin:nuxt/recommended',
        'plugin:vue/recommended',
        'plugin:jest/recommended'
    ],
    plugins: [
        'vue',
        'prettier',
        'jest'
    ],
    rules: {
        'camelcase': 'off',
        'import/no-named-as-default-member': 'off',
        'indent': 'off',
        'new-cap': 'off',
        'no-console': 'off',
        'no-multi-spaces': 'off',
        'unicorn/prefer-type-error': 'off',
        'vue/html-indent': 'off',
        'vue/html-self-closing': ['error', {
            'html': {
                'void': 'always',
                'normal': 'never',
                'component': 'always'
            },
            'svg': 'always',
            'math': 'always'
        }],
        'vue/max-attributes-per-line': 'off'
    },
    overrides: [{
        files: ['server/payment/tests/resources/**/*.test.js'],
        rules: {
            'jest/expect-expect': 'off'
        }
    }],
    globals: {
        '$nuxt': true
    }
};
