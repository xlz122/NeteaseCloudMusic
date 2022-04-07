// feat: 新增功能
// fix: 修复bug
// perf: 性能优化(提高代码性能的改变)
// reverts: 代码回退
// refactor: 重构(即不是新增功能，也不是修改bug的代码变动)
// chore: 对非 src 和 test 目录的修改(日常事务)
// docs: 更新文档
// style: 格式化(不影响代码运行的变动,空格、备注等)
// test: 增加/修改测试
// ci: 对CI配置文件和脚本的更改
// build: 影响构建系统或外部依赖项的更改(maven、gradle、npm等)

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'chore', 'perf', 'reverts', 'refactor', 'build']
    ],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never']
  }
};
