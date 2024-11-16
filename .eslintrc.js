module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    "eslint:recommended", // ESLint 推荐规则
    "plugin:vue/vue3-essential", // Vue 推荐规则
    "plugin:prettier/recommended", // Prettier 推荐规则
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {
    // 定制规则
    "prettier/prettier": "error", // Prettier 的问题会报错
    "no-console": "off", // console.log 警告
    "no-unused-vars": "warn", // 未使用变量警告
  },
};
