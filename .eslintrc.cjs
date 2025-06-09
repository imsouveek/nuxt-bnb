module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es2021: true,
        jest: true
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/recommended', // Use 'vue/vue3-recommended' later
        'prettier'
    ],
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
    },
    plugins: ['vue'],
    rules: {
        'no-console': 'warn',
        'no-unused-vars': 'warn'
    }
}