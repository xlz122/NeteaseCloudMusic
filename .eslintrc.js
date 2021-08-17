module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 关闭类型推断
    // "@typescript-eslint/no-inferrable-types": "off",
    // 关闭any类型时的警告
    // '@typescript-eslint/no-explicit-any': 'off',
    // 禁止在变量定义之前使用它们 variables(变量)
    '@typescript-eslint/no-use-before-define': [
      2,
      { functions: false, classes: true, variables: true }
    ],
    // 禁用var，用let和const代替
    "no-var": 2,
    // 开启强制单引号
    "quotes": [2, "single"],
    // 强制全等( === 和 !==)
    "eqeqeq": 2,
    // 语句强制分号结尾
    "semi": [2, "always"],
    "@typescript-eslint/no-unused-vars": [2],
    // 箭头函数参数括号，一个参数时可省略括号
    "arrow-parens": [2, "as-needed"],
    // 箭头函数，箭头前后空格
    "arrow-spacing": [2, { before: true, after: true }],
    // 禁止对象最后一项逗号
    "comma-dangle": [2, "never"],
    // 单行代码/字符串最大长度
    "max-len": [2, { code: 120 }],
    // 缩进2个空格
    "indent": [2, 2],
    // 文件末尾强制换行
    "eol-last": 2,
  }
};
