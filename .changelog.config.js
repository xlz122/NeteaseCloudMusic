const compareFunc = require('compare-func');

module.exports = {
  writerOpts: {
    transform: (commit, context) => {
      let discard = true;

      commit.notes.forEach(note => {
        note.title = 'BREAKING CHANGES';
        discard = false;
      });

      // 标题分类
      if (commit.type === 'feat') {
        commit.type = '✨ Features | 新功能';
      } else if (commit.type === 'fix') {
        commit.type = '🐛 Bug Fixes | Bug 修复';
      } else if (commit.type === 'perf') {
        commit.type = '⚡ Performance Improvements | 性能优化';
      } else if (commit.type === 'revert' || commit.revert) {
        commit.type = '⏪ Reverts | 回退';
      } else if (commit.type === 'refactor') {
        commit.type = '♻ Code Refactoring | 代码重构';
      } else if (commit.type === 'build') {
        commit.type = '👷‍ Build System | 构建';
      } else if (commit.type === 'chore') {
        commit.type = '🎫 Chores | 其他更新';
      } else if (discard) {
        return false;
      } else if (commit.type === 'docs') {
        commit.type = '📝 Documentation | 文档';
      } else if (commit.type === 'style') {
        commit.type = '💄 Styles | 风格';
      } else if (commit.type === 'test') {
        commit.type = '✅ Tests | 测试';
      } else if (commit.type === 'ci') {
        commit.type = '🔧 Continuous Integration | CI 配置';
      }

      if (commit.scope === '*') {
        commit.scope = '';
      }

      if (typeof commit.hash === 'string') {
        commit.hash = commit.hash.substring(0, 7);
      }

      if (typeof commit.subject === 'string') {
        let url = context.repository
          ? `${context.host}/${context.owner}/${context.repository}`
          : context.repoUrl;

        // 自定义标题
        if (url) {
          // 取消默认生成的链接引用
          context.linkReferences = false;
 
          url = `${url}/commit/`;
          commit.subject = `${commit.subject} [#${commit.hash}](${url}${commit.hash})`;
        }

        if (context.host) {
          // User URLs.
          commit.subject = commit.subject.replace(/\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g, (_, username) => {
            if (username.includes('/')) {
              return `@${username}`;
            }

            return `[@${username}](${context.host}/${username})`;
          });
        }
      }

      return commit;
    },
    groupBy: 'type',
    commitGroupsSort: 'title',
    commitsSort: ['scope', 'subject'],
    noteGroupsSort: 'title',
    notesSort: compareFunc
  }
};
