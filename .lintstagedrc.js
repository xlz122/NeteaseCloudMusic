module.exports = {
  "src/**/*.{js,ts,vue}": [
    "prettier --write",
    "eslint --fix"
  ],
  // "src/**/*.{css,less,scss,sass}": [
  //   "stylelint --custom-syntax postcss-less"
  // ],
  // "src/**/*.{vue,htm,html}": [
  //   "stylelint --custom-syntax postcss-html"
  // ]
}