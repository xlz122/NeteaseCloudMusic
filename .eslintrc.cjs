module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "eslint-config-prettier",
    "plugin:prettier/recommended"
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parser: "@typescript-eslint/parser"
  },
  plugins: ["vue", "prettier"],
  globals: {
    NodeJS: true
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",

    // 禁止使用var
    "no-var": [2],
    // 禁止未使用的变量
    "@typescript-eslint/no-unused-vars": [2],
    // 字符串单引号
    "quotes": [2, "single"],
    // 对象末尾逗号
    "comma-dangle": [2, "never"],
    // 语句末尾分号
    "semi": [2, "always"],
    // 箭头函数前后空格
    "arrow-spacing": [2, { before: true, after: true }],
    // 箭头函数参数括号
    "arrow-parens": [2, "as-needed"],
    // 全等(===、!==)
    "eqeqeq": [2],
    // 空格缩进
    "indent": [2, 2],
    // 文件末尾换行
    "eol-last": [2],

    "vue/no-v-html": [0],
    "vue/attributes-order": [0],
    "vue/attribute-hyphenation": [0],
    "vue/v-on-event-hyphenation": [0],
    "vue/multi-word-component-names": [0],

    "@typescript-eslint/no-explicit-any": [0],
    "@typescript-eslint/no-unused-expressions": [0]
  }
};
