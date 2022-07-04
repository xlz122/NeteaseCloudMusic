module.exports = {
  "src/**/*.{js,ts,vue}": [
    "prettier --write",
    "eslint --fix"
  ],
  "src/**/*.{htm,html,vue,css,less,scss,sass}": [
    "stylelint"
  ]
}