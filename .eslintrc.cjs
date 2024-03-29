module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'eslint-config-prettier',
    'plugin:prettier/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@typescript-eslint/parser'
  },
  plugins: ['vue', 'prettier'],
  globals: {
    NodeJS: true
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    '@typescript-eslint/no-explicit-any': 0,
    'vue/attributes-order': 0,
    'vue/attribute-hyphenation': 0,
    'vue/v-on-event-hyphenation': 0,
    'vue/no-v-html': 0,
    // 组件name
    'vue/multi-word-component-names': [0, {
      'ignores': []
    }],

    // 禁用var
    'no-var': 2,
    // 禁止在变量定义之前使用
    '@typescript-eslint/no-use-before-define': [
      2,
      { functions: false, classes: true, variables: true }
    ],
    // 禁止出现未使用的变量
    '@typescript-eslint/no-unused-vars': [2],
    // 强制单引号
    'quotes': [2, 'single'],
    // 强制全等(===、!==)
    'eqeqeq': 2,
    // 强制语句分号结尾
    'semi': [2, 'always'],
    // 强制文件末尾换行
    'eol-last': 2,
    // 箭头函数参数括号(1个参数不需要, 1个以上需要)
    'arrow-parens': [2, 'as-needed'],
    // 箭头函数(箭头前后空格)
    'arrow-spacing': [2, { before: true, after: true }],
    // 对象末尾是否需要逗号
    'comma-dangle': [2, 'never'],
    // 单行代码最大长度
    'max-len': [2, { code: 120 }],
    // 空格缩进
    'indent': [2, 2]
  }
};
