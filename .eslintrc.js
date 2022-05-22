module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        semi: ['error', 'always'],
        'eol-last': 1,
        'no-irregular-whitespace': 1,
        'no-mixed-spaces-and-tabs': [1, 'smart-tabs'],
        'no-trailing-spaces': 1
    },
};
