// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import tailwind from 'eslint-plugin-tailwindcss';

export default tseslint.config(
    { ignores: ['dist'] },
    {
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            ...tailwind.configs['flat/recommended'],
        ],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            tailwindcss: tailwind,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'tailwindcss/classnames-order': 'warn',
            'tailwindcss/no-custom-classname': 'off',
            'tailwindcss/no-contradicting-classname': 'error',
        },
        settings: {
            tailwindcss: {
                callees: ['classnames', 'clsx', 'ctl'],
                config: 'tailwind.config.cjs',
                cssFiles: ['**/*.css', '!**/node_modules', '!**/.*', '!**/dist', '!**/build'],
                removeDuplicates: true,
                skipClassAttribute: false,
                whitelist: [],
            },
        },
    }
);