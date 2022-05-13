## [1.1.1](https://github.com/xlz122/NeteaseCloudMusic/compare/v1.1.0...v1.1.1) (2022-05-13)


### ⚡ Performance Improvements | 性能优化

* 抽离数据处理成播放器所需数据的逻辑代码 [#330cec9](https://github.com/xlz122/NeteaseCloudMusic/commit/330cec9) 
* 优化播放数据逻辑代码 [#8896c4a](https://github.com/xlz122/NeteaseCloudMusic/commit/8896c4a) 
* 优化播放完成随机播放逻辑(和上、下首切换一致) [#d22092f](https://github.com/xlz122/NeteaseCloudMusic/commit/d22092f) 
* 优化添加到播放列表逻辑代码 [#e92b15d](https://github.com/xlz122/NeteaseCloudMusic/commit/e92b15d) 


### ✨ Features | 新功能

* 歌单播放按钮可将歌曲添加至播放列表代码简化 [#507a803](https://github.com/xlz122/NeteaseCloudMusic/commit/507a803) 
* 视频vuex数据分单独的视频模块 [#e6e294e](https://github.com/xlz122/NeteaseCloudMusic/commit/e6e294e) 
* 无关音乐模块的数据防止在外层 [#ed21c81](https://github.com/xlz122/NeteaseCloudMusic/commit/ed21c81) 
* 页面底部更新，意见反馈代码去除 [#53bc9f3](https://github.com/xlz122/NeteaseCloudMusic/commit/53bc9f3) 
* 专辑播放按钮可将歌曲添加至播放列表 [#6bec405](https://github.com/xlz122/NeteaseCloudMusic/commit/6bec405) 


### 🎫 Chores | 其他更新

* 调整引入顺序 [#5ec2ec9](https://github.com/xlz122/NeteaseCloudMusic/commit/5ec2ec9) 
* 添加common文件夹 [#e3cce2a](https://github.com/xlz122/NeteaseCloudMusic/commit/e3cce2a) 


### 🐛 Bug Fixes | Bug 修复

* 删除跳转歌曲位置相关代码 [#62997a3](https://github.com/xlz122/NeteaseCloudMusic/commit/62997a3) 
* 修复各页面将歌单歌曲添加到播放器，时间NaN的bug [#a397702](https://github.com/xlz122/NeteaseCloudMusic/commit/a397702) 



# [1.1.0](https://github.com/xlz122/NeteaseCloudMusic/compare/v1.0.14...v1.1.0) (2022-05-09)


### ✨ Features | 新功能

* 视频增加可拖动进度条 [#1d01e7c](https://github.com/xlz122/NeteaseCloudMusic/commit/1d01e7c) 
* 首页(登陆后)补充跳转等级详情 [#452d67d](https://github.com/xlz122/NeteaseCloudMusic/commit/452d67d) 
* 首页(登陆后)个人资料补充跳转详情 [#406910f](https://github.com/xlz122/NeteaseCloudMusic/commit/406910f) 
* 完善搜索详情无数据展示 [#f853c9c](https://github.com/xlz122/NeteaseCloudMusic/commit/f853c9c) 


### 🎫 Chores | 其他更新

* 模板（template）删除部分多余注释 [#a3e2820](https://github.com/xlz122/NeteaseCloudMusic/commit/a3e2820) 
* 移除rimraf插件 [#43ba77c](https://github.com/xlz122/NeteaseCloudMusic/commit/43ba77c) 
* 中文空格符替换成英文空格符 [#b1ff30a](https://github.com/xlz122/NeteaseCloudMusic/commit/b1ff30a) 
* css样式文件删除多余注释 [#43131d6](https://github.com/xlz122/NeteaseCloudMusic/commit/43131d6) 
* modify changelog config [#193dcd2](https://github.com/xlz122/NeteaseCloudMusic/commit/193dcd2) 
* modify changelog config [#8b5d754](https://github.com/xlz122/NeteaseCloudMusic/commit/8b5d754) 
* modify eslint config [#de8e2cb](https://github.com/xlz122/NeteaseCloudMusic/commit/de8e2cb) 
* modify prettier config [#8967c04](https://github.com/xlz122/NeteaseCloudMusic/commit/8967c04) 
* release 1.1.0 [#2eb96e8](https://github.com/xlz122/NeteaseCloudMusic/commit/2eb96e8) 
* update .env config [#41c13cb](https://github.com/xlz122/NeteaseCloudMusic/commit/41c13cb) 
* update tsconfig.json [#020aff4](https://github.com/xlz122/NeteaseCloudMusic/commit/020aff4) 
* update tsconfig.json [#032f19c](https://github.com/xlz122/NeteaseCloudMusic/commit/032f19c) 


### 🐛 Bug Fixes | Bug 修复

* 修复歌曲切换进度条回弹bug [#b6ab0c5](https://github.com/xlz122/NeteaseCloudMusic/commit/b6ab0c5) 
* 修复歌曲切换瞬间会短暂播放器里歌曲的bug [#dae65f4](https://github.com/xlz122/NeteaseCloudMusic/commit/dae65f4) 
* 修复生命周期函数使用错误导致报错的bug [#a72d4d3](https://github.com/xlz122/NeteaseCloudMusic/commit/a72d4d3) 



## [1.0.14](https://github.com/xlz122/NeteaseCloudMusic/compare/v1.0.13...v1.0.14) (2022-05-05)


### ⚡ Performance Improvements | 性能优化

* 优化上/下一首切换逻辑 [#5b1d95e](https://github.com/xlz122/NeteaseCloudMusic/commit/5b1d95e) 
* 优化随机播放逻辑，播放列表大于5首时，后续5次切换不会被播放 [#81b9c5b](https://github.com/xlz122/NeteaseCloudMusic/commit/81b9c5b) 


### ✨ Features | 新功能

* 调整导航部分的样式 [#bf1dcd1](https://github.com/xlz122/NeteaseCloudMusic/commit/bf1dcd1) 
* 搜索详情-未登录时只显示20条数据 [#1c3cac0](https://github.com/xlz122/NeteaseCloudMusic/commit/1c3cac0) 
* 搜索详情各页面搜索关键字匹配 [#0304681](https://github.com/xlz122/NeteaseCloudMusic/commit/0304681) 


### 🎫 Chores | 其他更新

* 升级部分依赖项 [#b850d83](https://github.com/xlz122/NeteaseCloudMusic/commit/b850d83) 


### 🐛 Bug Fixes | Bug 修复

* 修复从排行榜页面进入我的音乐页面显示不正确bug [#b3feb9e](https://github.com/xlz122/NeteaseCloudMusic/commit/b3feb9e) 
* 修复从其他页面进入我的音乐页面，歌单不是选中第一项的bug [#5b43391](https://github.com/xlz122/NeteaseCloudMusic/commit/5b43391) 
* 修复从我的音乐页面登录，登录后侧边菜单显示不全的bug [#4a8d4c6](https://github.com/xlz122/NeteaseCloudMusic/commit/4a8d4c6) 
* 修复随机播放bug [#86276c1](https://github.com/xlz122/NeteaseCloudMusic/commit/86276c1) 
* 修复我的音乐-歌单详情，页面加载评论接口被请求两次的bug [#e304019](https://github.com/xlz122/NeteaseCloudMusic/commit/e304019) 



## [1.0.13](https://github.com/xlz122/NeteaseCloudMusic/compare/v1.0.12...v1.0.13) (2022-04-17)


### ✨ Features | 新功能

* 歌单可播放歌单内歌曲 [#590a2e5](https://github.com/xlz122/NeteaseCloudMusic/commit/590a2e5) 
* 视频、MV大屏收藏按钮可用 [#9ae814d](https://github.com/xlz122/NeteaseCloudMusic/commit/9ae814d) 


### 🐛 Bug Fixes | Bug 修复

* 未登录时请求不再携带cookie字段 [#c7e347a](https://github.com/xlz122/NeteaseCloudMusic/commit/c7e347a) 
* 修复进入专辑详情，接口被触发两次的bug [#513b5c0](https://github.com/xlz122/NeteaseCloudMusic/commit/513b5c0) 
* 修复轮播图图片未加载时控制台报的404报错 [#4ea8da9](https://github.com/xlz122/NeteaseCloudMusic/commit/4ea8da9) 
* 修复评论组件userId报错的bug [#8ad5193](https://github.com/xlz122/NeteaseCloudMusic/commit/8ad5193) 
* 修复首页-热门推荐样式bug [#c471fe0](https://github.com/xlz122/NeteaseCloudMusic/commit/c471fe0) 
* 修复首页排行榜图片未加载报错 [#00e7f9e](https://github.com/xlz122/NeteaseCloudMusic/commit/00e7f9e) 
* 修复专辑详情-其他热门专辑接口404的bug [#4859c8f](https://github.com/xlz122/NeteaseCloudMusic/commit/4859c8f) 
* 修复专辑详情-热门专辑接口404报错 [#5b56329](https://github.com/xlz122/NeteaseCloudMusic/commit/5b56329) 
* 修复资源警告未判断环境的bug [#0c40630](https://github.com/xlz122/NeteaseCloudMusic/commit/0c40630) 
* 修复https中请求http接口或引入http资源时控制台出现的警告 [#a64e1d2](https://github.com/xlz122/NeteaseCloudMusic/commit/a64e1d2) 



## [1.0.12](https://github.com/xlz122/NeteaseCloudMusic/compare/v1.0.11...v1.0.12) (2022-04-02)


### ♻ Code Refactoring | 代码重构

* 重构我的音乐页面，修复一些已知bug [#879ea69](https://github.com/xlz122/NeteaseCloudMusic/commit/879ea69) 


### ✨ Features | 新功能

* 首页、搜索详情歌单播放按钮可将歌曲添加至播放列表 [#4ac0013](https://github.com/xlz122/NeteaseCloudMusic/commit/4ac0013) 
* 完成用户资料-登录用户获取vip信息 [#e3e3961](https://github.com/xlz122/NeteaseCloudMusic/commit/e3e3961) 


### 🐛 Bug Fixes | Bug 修复

* 歌单详情页面处理一些容错 [#3bf61ac](https://github.com/xlz122/NeteaseCloudMusic/commit/3bf61ac) 
* 歌曲详情页面处理一些容错 [#bdfc8e9](https://github.com/xlz122/NeteaseCloudMusic/commit/bdfc8e9) 
* 歌手、歌单页面处理一些容错 [#7269630](https://github.com/xlz122/NeteaseCloudMusic/commit/7269630) 
* 歌手详情页面处理一些容错 [#fbe662b](https://github.com/xlz122/NeteaseCloudMusic/commit/fbe662b) 
* 公共组件部分处理一些容错 [#3f5cf0d](https://github.com/xlz122/NeteaseCloudMusic/commit/3f5cf0d) 
* 关注、创作者中心、专辑详情页面处理一些容错 [#d9a4cee](https://github.com/xlz122/NeteaseCloudMusic/commit/d9a4cee) 
* 每日推荐、新碟上架、电台页面处理一些容错 [#fd1e33b](https://github.com/xlz122/NeteaseCloudMusic/commit/fd1e33b) 
* 排行榜页面处理一些容错 [#30e711d](https://github.com/xlz122/NeteaseCloudMusic/commit/30e711d) 
* 视频、MV详情页面处理一些容错 [#68899a0](https://github.com/xlz122/NeteaseCloudMusic/commit/68899a0) 
* 首页签到部分的用户vip信息替换成动态数据 [#3b4b34b](https://github.com/xlz122/NeteaseCloudMusic/commit/3b4b34b) 
* 搜索详情页面处理一些容错 [#cb6106c](https://github.com/xlz122/NeteaseCloudMusic/commit/cb6106c) 
* 修复评论第二页显示标题的bug [#51d7f93](https://github.com/xlz122/NeteaseCloudMusic/commit/51d7f93) 
* 修复搜索详情-跳转至别的页面，返回后导航不一致的bug [#d955287](https://github.com/xlz122/NeteaseCloudMusic/commit/d955287) 
* 修复用户资料页面已知bug [#c0a165c](https://github.com/xlz122/NeteaseCloudMusic/commit/c0a165c) 
* 用户等级、用户等级详情页面处理一些容错 [#bb46cc3](https://github.com/xlz122/NeteaseCloudMusic/commit/bb46cc3) 



## [1.0.11](https://github.com/xlz122/NeteaseCloudMusic/compare/v1.0.10...v1.0.11) (2022-03-31)


### ✨ Features | 新功能

* 歌手页面补充跳转用户资料页面 [#ee163b7](https://github.com/xlz122/NeteaseCloudMusic/commit/ee163b7) 
* 更新页面底部信息部分 [#e65db69](https://github.com/xlz122/NeteaseCloudMusic/commit/e65db69) 
* 搜索详情-单曲,增加专辑跳转 [#e8a8bb2](https://github.com/xlz122/NeteaseCloudMusic/commit/e8a8bb2) 
* 增加用户主页-听歌排行 [#986915f](https://github.com/xlz122/NeteaseCloudMusic/commit/986915f) 


### 🎫 Chores | 其他更新

* 部分变量重命名，补充部分类型，删除部分注释 [#dafdc94](https://github.com/xlz122/NeteaseCloudMusic/commit/dafdc94) 
* 删除部分多余注释 [#6855463](https://github.com/xlz122/NeteaseCloudMusic/commit/6855463) 


### 🐛 Bug Fixes | Bug 修复

* 部分文件template增加可选链? [#346cb15](https://github.com/xlz122/NeteaseCloudMusic/commit/346cb15) 
* 所有接口方法补充catch回调 [#65e4eac](https://github.com/xlz122/NeteaseCloudMusic/commit/65e4eac) 
* 修复/deep/被弃用警告 [#fde1603](https://github.com/xlz122/NeteaseCloudMusic/commit/fde1603) 
* 修复播放列表-清空列表，刷新页面播放器还存在音乐的bug [#8ac8942](https://github.com/xlz122/NeteaseCloudMusic/commit/8ac8942) 
* 修复部分注释错误，重复接口 [#b658701](https://github.com/xlz122/NeteaseCloudMusic/commit/b658701) 
* 修复从歌手页跳转个人资料页面再返回歌手页导航没有正确显示bug [#20d59a0](https://github.com/xlz122/NeteaseCloudMusic/commit/20d59a0) 
* 修复单曲详情显示不正确bug [#f6df21f](https://github.com/xlz122/NeteaseCloudMusic/commit/f6df21f) 
* 修复电台详情控制台图片报404的bug [#84c2419](https://github.com/xlz122/NeteaseCloudMusic/commit/84c2419) 
* 修复歌单-信息部分样式bug [#e439c17](https://github.com/xlz122/NeteaseCloudMusic/commit/e439c17) 
* 修复歌单点击范围bug，热门点击无效bug [#17e85aa](https://github.com/xlz122/NeteaseCloudMusic/commit/17e85aa) 
* 修复歌单详情-热门歌单头像缺少提示的bug [#b4ba989](https://github.com/xlz122/NeteaseCloudMusic/commit/b4ba989) 
* 修复歌手详情，点击跳转不正确bug [#83f5040](https://github.com/xlz122/NeteaseCloudMusic/commit/83f5040) 
* 修复个性化推荐点击范围bug [#62a5b38](https://github.com/xlz122/NeteaseCloudMusic/commit/62a5b38) 
* 修复关注页样式bug [#e31daf2](https://github.com/xlz122/NeteaseCloudMusic/commit/e31daf2) 
* 修复每日推荐收藏全部bug [#730111a](https://github.com/xlz122/NeteaseCloudMusic/commit/730111a) 
* 修复首页-榜单跳转bug [#03b6544](https://github.com/xlz122/NeteaseCloudMusic/commit/03b6544) 
* 修复首页-热门推荐点击范围bug [#f4b3089](https://github.com/xlz122/NeteaseCloudMusic/commit/f4b3089) 
* 修复搜索详情各页面样式、显示、点击范围bug [#7716d55](https://github.com/xlz122/NeteaseCloudMusic/commit/7716d55) 
* 修复我的视频样式展示bug [#5f34f22](https://github.com/xlz122/NeteaseCloudMusic/commit/5f34f22) 
* 修复我的音乐-创建的歌单统计数失去响应式的bug [#a3bb280](https://github.com/xlz122/NeteaseCloudMusic/commit/a3bb280) 
* 修复新碟上架页面点击范围不一致bug [#9b89ad1](https://github.com/xlz122/NeteaseCloudMusic/commit/9b89ad1) 
* 修复用户资料点击范围bug [#e967e81](https://github.com/xlz122/NeteaseCloudMusic/commit/e967e81) 
* 修复专辑详情-其他热门专辑显示bug [#9685681](https://github.com/xlz122/NeteaseCloudMusic/commit/9685681) 
* 修复mv、视频详情显示bug [#82c26c7](https://github.com/xlz122/NeteaseCloudMusic/commit/82c26c7) 



## [1.0.10](https://github.com/xlz122/NeteaseCloudMusic/compare/v1.0.9...v1.0.10) (2022-03-27)


### ✨ Features | 新功能

* 关注页面-单曲、专辑修改 [#2791898](https://github.com/xlz122/NeteaseCloudMusic/commit/2791898) 
* 完成视频的收藏/取消收藏功能（通过收藏的视频列表判断视频被收藏） [#871c320](https://github.com/xlz122/NeteaseCloudMusic/commit/871c320) 
* 增加搜索详情-歌单页面 [#c77a165](https://github.com/xlz122/NeteaseCloudMusic/commit/c77a165) 
* 增加一些工具函数 [#67b1f4c](https://github.com/xlz122/NeteaseCloudMusic/commit/67b1f4c) 


### 🎫 Chores | 其他更新

* 升级部分依赖项 [#903cf48](https://github.com/xlz122/NeteaseCloudMusic/commit/903cf48) 
* cli更新v5.0.3版本 [#5306895](https://github.com/xlz122/NeteaseCloudMusic/commit/5306895) 


### 🐛 Bug Fixes | Bug 修复

* 升级compression-webpack-plugin，并修复高版本打包失败的bug [#27f9246](https://github.com/xlz122/NeteaseCloudMusic/commit/27f9246) 
* 修复登录后排行榜页面收藏按钮样式bug [#66dc4f1](https://github.com/xlz122/NeteaseCloudMusic/commit/66dc4f1) 
* 修复歌曲重新播放歌词没有重置滚动条、歌词最后一项不高亮等bug [#9073fc3](https://github.com/xlz122/NeteaseCloudMusic/commit/9073fc3) 
* 修复各页面评论按钮跳转因修改全局跳转顶部导致无效的bug [#7901019](https://github.com/xlz122/NeteaseCloudMusic/commit/7901019) 
* 修复搜索详情搜索框、导航样式bug [#4c03b19](https://github.com/xlz122/NeteaseCloudMusic/commit/4c03b19) 
* 修复跳转专辑详情控制台图片404报错 [#b4e8489](https://github.com/xlz122/NeteaseCloudMusic/commit/b4e8489) 
* 修复未登录/登录，排行榜-收藏按钮展示不同的bug [#036c3d2](https://github.com/xlz122/NeteaseCloudMusic/commit/036c3d2) 
* 修复未登录触发获取用户歌单接口的bug [#f7433b4](https://github.com/xlz122/NeteaseCloudMusic/commit/f7433b4) 
* 修复未登录各页面分享、下载按钮未弹出登录框的bug [#8f0a944](https://github.com/xlz122/NeteaseCloudMusic/commit/8f0a944) 
* 修复新建歌单后，页面会删除歌单第二项的bug [#874d566](https://github.com/xlz122/NeteaseCloudMusic/commit/874d566) 



## [1.0.9](https://github.com/xlz122/NeteaseCloudMusic/compare/v1.0.8...v1.0.9) (2022-03-16)


### ⚡ Performance Improvements | 性能优化

* 回到顶部优化(使用防抖) [#7ba89bd](https://github.com/xlz122/NeteaseCloudMusic/commit/7ba89bd) 


### ✨ Features | 新功能

* 播放器列表收藏全部完善 [#3b80bcf](https://github.com/xlz122/NeteaseCloudMusic/commit/3b80bcf) 
* 歌手详情-收藏歌手完成 [#6d631c4](https://github.com/xlz122/NeteaseCloudMusic/commit/6d631c4) 
* 每日推荐、专辑、歌手详情收藏完善 [#22331b2](https://github.com/xlz122/NeteaseCloudMusic/commit/22331b2) 
* 视频播放器增加时间进度 [#2a38562](https://github.com/xlz122/NeteaseCloudMusic/commit/2a38562) 
* 首页、歌单详情，歌单收藏功能修改 [#f5b529c](https://github.com/xlz122/NeteaseCloudMusic/commit/f5b529c) 
* 搜索详情-用户关注完成 [#881790a](https://github.com/xlz122/NeteaseCloudMusic/commit/881790a) 
* 完善mv收藏 [#18adfba](https://github.com/xlz122/NeteaseCloudMusic/commit/18adfba) 
* 增加mv详情页面,各页面视频、mv跳转完善 [#6cebbc9](https://github.com/xlz122/NeteaseCloudMusic/commit/6cebbc9) 


### 🐛 Bug Fixes | Bug 修复

* 修复播放列表点击链接图标会播放音乐的bug [#37f8901](https://github.com/xlz122/NeteaseCloudMusic/commit/37f8901) 
* 修复各页面收藏未登录情况下未弹出登录框的bug [#8584a38](https://github.com/xlz122/NeteaseCloudMusic/commit/8584a38) 
* 修复首页轮播图动态class类名bug [#f9d87f8](https://github.com/xlz122/NeteaseCloudMusic/commit/f9d87f8) 
* 修复跳转至二级导航路由所在页面，watch触发两次的bug [#a4084c5](https://github.com/xlz122/NeteaseCloudMusic/commit/a4084c5) 
* 修复未登录页面无法打开的bug [#8b7fa7c](https://github.com/xlz122/NeteaseCloudMusic/commit/8b7fa7c) 
* 修复我的视频跳转mv报错bug [#683c3c1](https://github.com/xlz122/NeteaseCloudMusic/commit/683c3c1) 
* 修复我的音乐切换至歌单以外的tab项,意外请求评论接口的bug [#fa463ff](https://github.com/xlz122/NeteaseCloudMusic/commit/fa463ff) 
* 修复已收藏的歌单会继续调用收藏歌单接口的bug [#cdbc050](https://github.com/xlz122/NeteaseCloudMusic/commit/cdbc050) 
* 修复音频播放器鼠标松开依然在拖动的bug [#27172ff](https://github.com/xlz122/NeteaseCloudMusic/commit/27172ff) 
* 修复音视频可以同时播放的bug [#4d54a97](https://github.com/xlz122/NeteaseCloudMusic/commit/4d54a97) 



## [1.0.8](https://github.com/xlz122/NeteaseCloudMusic/compare/v1.0.7...v1.0.8) (2022-02-24)


### ✨ Features | 新功能

* 404页面完善 [#3603b35](https://github.com/xlz122/NeteaseCloudMusic/commit/3603b35) 
* 增加歌曲添加到歌单功能 [#07896d8](https://github.com/xlz122/NeteaseCloudMusic/commit/07896d8) 


### 🎫 Chores | 其他更新

* 更新其余依赖项 [#9708df3](https://github.com/xlz122/NeteaseCloudMusic/commit/9708df3) 
* cli更新正式版(v5.0.1) [#5d3a344](https://github.com/xlz122/NeteaseCloudMusic/commit/5d3a344) 
* cli更新v5.0.0-rc.2版本 [#8e97ecc](https://github.com/xlz122/NeteaseCloudMusic/commit/8e97ecc) 
* cli更新v5.0.0-rc.3版本 [#644fa01](https://github.com/xlz122/NeteaseCloudMusic/commit/644fa01) 
* update license year [#ded2c5f](https://github.com/xlz122/NeteaseCloudMusic/commit/ded2c5f) 


### 🐛 Bug Fixes | Bug 修复

* 弹框组件关闭按钮替换成图标 [#7845aa4](https://github.com/xlz122/NeteaseCloudMusic/commit/7845aa4) 
* 更改axios cdn版本 [#abe519a](https://github.com/xlz122/NeteaseCloudMusic/commit/abe519a) 
* 修复播放列表，歌曲切换-歌词滚动条没有重置的bug [#bf9e318](https://github.com/xlz122/NeteaseCloudMusic/commit/bf9e318) 
* 修复播放列表点击操作按钮也会触发播放的bug [#1de535c](https://github.com/xlz122/NeteaseCloudMusic/commit/1de535c) 
* 修复评论状态(-10),评论显示空白的bug [#ac7f9b4](https://github.com/xlz122/NeteaseCloudMusic/commit/ac7f9b4) 
* 修复首页新碟上架无法滚动bug [#e582070](https://github.com/xlz122/NeteaseCloudMusic/commit/e582070) 



## [1.0.7](https://github.com/xlz122/NeteaseCloudMusic/compare/v1.0.6...v1.0.7) (2022-01-10)


### ✨ Features | 新功能

* 搜索详情已有各页面加上loading [#b736014](https://github.com/xlz122/NeteaseCloudMusic/commit/b736014) 
* 增加播放器头像可跳转歌曲详情 [#86be3cc](https://github.com/xlz122/NeteaseCloudMusic/commit/86be3cc) 
* 增加等级详情页面 [#480c805](https://github.com/xlz122/NeteaseCloudMusic/commit/480c805) 


### 🐛 Bug Fixes | Bug 修复

* 导航栏朋友改为关注 [#da86eed](https://github.com/xlz122/NeteaseCloudMusic/commit/da86eed) 
* 头像和默认头像样式bug [#07b3e89](https://github.com/xlz122/NeteaseCloudMusic/commit/07b3e89) 
* 修复播放器列表覆盖音量控制器的样式bug [#36f9e96](https://github.com/xlz122/NeteaseCloudMusic/commit/36f9e96) 
* 修复回到顶部bug [#d135be4](https://github.com/xlz122/NeteaseCloudMusic/commit/d135be4) 



## [1.0.6](https://github.com/xlz122/NeteaseCloudMusic/compare/v1.0.5...v1.0.6) (2021-12-21)


### ✨ Features | 新功能

* 增加视频详情页面 [#cf64d64](https://github.com/xlz122/NeteaseCloudMusic/commit/cf64d64) 


### 🎫 Chores | 其他更新

* 更新npm版本svg图标 [#d5081ca](https://github.com/xlz122/NeteaseCloudMusic/commit/d5081ca) 
* 我的视频页面相关文件重命名 [#4c79bdf](https://github.com/xlz122/NeteaseCloudMusic/commit/4c79bdf) 
* cdn配置的包版本改为和package.json对应 [#bbb0c22](https://github.com/xlz122/NeteaseCloudMusic/commit/bbb0c22) 
* cli更新v5.0.0-rc.1版本 [#e06427d](https://github.com/xlz122/NeteaseCloudMusic/commit/e06427d) 


### 🐛 Bug Fixes | Bug 修复

* 首页分类标题补齐点击跳转 [#7334e35](https://github.com/xlz122/NeteaseCloudMusic/commit/7334e35) 
* 拖拽ts类型补齐 [#6841e60](https://github.com/xlz122/NeteaseCloudMusic/commit/6841e60) 
* 修复播放列表，删除单项，刷新页面歌曲还在的bug [#bcc943e](https://github.com/xlz122/NeteaseCloudMusic/commit/bcc943e) 
* 修复打包后出现的JSON.pase报错 [#f841854](https://github.com/xlz122/NeteaseCloudMusic/commit/f841854) 
* 修复歌单、排行榜loading显示bug [#08f478c](https://github.com/xlz122/NeteaseCloudMusic/commit/08f478c) 



## [1.0.5](https://github.com/xlz122/NeteaseCloudMusic/compare/v1.0.4...v1.0.5) (2021-11-19)


### 🎫 Chores | 其他更新

* cli更新v5.0.0-rc.0版本 [#5f54bf9](https://github.com/xlz122/NeteaseCloudMusic/commit/5f54bf9) 
* commit message 类型增加 perf [#a0e2d6b](https://github.com/xlz122/NeteaseCloudMusic/commit/a0e2d6b) 
* webpack 5配置变更 [#c5afaaa](https://github.com/xlz122/NeteaseCloudMusic/commit/c5afaaa) 


### 🐛 Bug Fixes | Bug 修复

* 修复播放器被滚动条覆盖的样式bug [#dd0f0b4](https://github.com/xlz122/NeteaseCloudMusic/commit/dd0f0b4) 
* 修复歌单详情页，刷新页面歌曲列表loading一直显示bug [#22ab528](https://github.com/xlz122/NeteaseCloudMusic/commit/22ab528) 
* 修复歌曲详情歌词无法显示bug [#d6c5b1a](https://github.com/xlz122/NeteaseCloudMusic/commit/d6c5b1a) 



## [1.0.4](https://github.com/xlz122/NeteaseCloudMusic/compare/v1.0.3...v1.0.4) (2021-11-16)


### ✨ Features | 新功能

* 播放器-歌名跳转至单曲详情 [#7e6ec3b](https://github.com/xlz122/NeteaseCloudMusic/commit/7e6ec3b) 
* 增加回到顶部功能 [#9b3098d](https://github.com/xlz122/NeteaseCloudMusic/commit/9b3098d) 
* 增加搜索-声音主播页面 [#8829dcc](https://github.com/xlz122/NeteaseCloudMusic/commit/8829dcc) 


### 🐛 Bug Fixes | Bug 修复

* 调整项目不一致样式，补充缺少的样式 [#5c7a14f](https://github.com/xlz122/NeteaseCloudMusic/commit/5c7a14f) 
* 修复歌单详情-歌曲loading不显示bug [#9bdf120](https://github.com/xlz122/NeteaseCloudMusic/commit/9bdf120) 
* 修复每日推荐歌曲列表-loading/无数据显示bug [#4d99641](https://github.com/xlz122/NeteaseCloudMusic/commit/4d99641) 
* 修复删除、无版权音乐弹框样式bug [#6d6724e](https://github.com/xlz122/NeteaseCloudMusic/commit/6d6724e) 
* 修复搜索框回车偶尔出现跳转详情不是单曲项bug [#745c8c9](https://github.com/xlz122/NeteaseCloudMusic/commit/745c8c9) 
* 修复搜索详情播放歌曲，没有选中当前歌曲的bug [#7358c74](https://github.com/xlz122/NeteaseCloudMusic/commit/7358c74) 



## [1.0.3](https://github.com/xlz122/NeteaseCloudMusic/compare/v1.0.2...v1.0.3) (2021-10-25)


### ✨ Features | 新功能

* 首页-个性化推荐，不感兴趣完成 [#fcdf0a9](https://github.com/xlz122/NeteaseCloudMusic/commit/fcdf0a9) 
* 邮箱、手机号增加回车快捷键登录 [#21f169f](https://github.com/xlz122/NeteaseCloudMusic/commit/21f169f) 
* 增加搜索详情-视频页面 [#5d7a713](https://github.com/xlz122/NeteaseCloudMusic/commit/5d7a713) 
* 增加搜索详情-用户页面 [#42b2a0f](https://github.com/xlz122/NeteaseCloudMusic/commit/42b2a0f) 


### 🎫 Chores | 其他更新

* 开发/生产环境的接口基础路径放置在.env文件中 [#b7c125e](https://github.com/xlz122/NeteaseCloudMusic/commit/b7c125e) 
* 新增自定义 changelog 配置 [#8ec53e8](https://github.com/xlz122/NeteaseCloudMusic/commit/8ec53e8) 
* 增加 commit message 规范 [#5338e0e](https://github.com/xlz122/NeteaseCloudMusic/commit/5338e0e) 
* 增加代码提交前eslint验证(error不允许提交) [#143c8c7](https://github.com/xlz122/NeteaseCloudMusic/commit/143c8c7) 
* 增加开发环境配置，用于vscode内debugger调试 [#54570fe](https://github.com/xlz122/NeteaseCloudMusic/commit/54570fe) 
* 增加自动生成 CHANGELOG.md 功能 [#cee91bc](https://github.com/xlz122/NeteaseCloudMusic/commit/cee91bc) 


### 🐛 Bug Fixes | Bug 修复

* 保留原有cookie逻辑 [#138307e](https://github.com/xlz122/NeteaseCloudMusic/commit/138307e) 
* 评论部分接口存放在同一文件 [#e704210](https://github.com/xlz122/NeteaseCloudMusic/commit/e704210) 
* 搜索详情-用户页面，未登录点击关注弹出登录框 [#1d56378](https://github.com/xlz122/NeteaseCloudMusic/commit/1d56378) 
* 修复电台节目详情样式bug [#cfa6489](https://github.com/xlz122/NeteaseCloudMusic/commit/cfa6489) 
* 修复无法登录的bug，cookie替换成本地存储 [#cd2b7aa](https://github.com/xlz122/NeteaseCloudMusic/commit/cd2b7aa) 
* 修复无歌词未清空本地存储歌词bug,修复未打开播放列表切换歌曲，歌词不更新bug [#c3f2f34](https://github.com/xlz122/NeteaseCloudMusic/commit/c3f2f34) 



## [1.0.2](https://github.com/xlz122/NeteaseCloudMusic/compare/v1.0.1...v1.0.2) (2021-10-08)


### ✨ Features | 新功能

* 项目文档更新 [#baeb6ab](https://github.com/xlz122/NeteaseCloudMusic/commit/baeb6ab) 
* 增加每日推荐路由及对应文件并完成页面 [#4b98380](https://github.com/xlz122/NeteaseCloudMusic/commit/4b98380) 
* vue-cli版本更新 [#aaa3ed1](https://github.com/xlz122/NeteaseCloudMusic/commit/aaa3ed1) 


### 🐛 Bug Fixes | Bug 修复

* 补充项目文字提示 [#140bfaf](https://github.com/xlz122/NeteaseCloudMusic/commit/140bfaf) 
* 修复部分页面样式bug，朋友页面单曲可点击播放 [#9da8b62](https://github.com/xlz122/NeteaseCloudMusic/commit/9da8b62) 
* 修复接口返回301没有清除用户信息并退出登录的bug [#61a6810](https://github.com/xlz122/NeteaseCloudMusic/commit/61a6810) 
* 修复评论bug，当前账号且登录才有删除按钮，未登录没有删除按钮 [#a587ee4](https://github.com/xlz122/NeteaseCloudMusic/commit/a587ee4) 
* 修复首页-榜单跳转排行榜没有对应选中的bug,排行榜歌单数据持久化 [#984013c](https://github.com/xlz122/NeteaseCloudMusic/commit/984013c) 
* 修复首页-排行榜样式bug [#4f5ad0b](https://github.com/xlz122/NeteaseCloudMusic/commit/4f5ad0b) 
* 修复首页个性化推荐日期显示bug及部分样式显示bug [#4b92a4a](https://github.com/xlz122/NeteaseCloudMusic/commit/4b92a4a) 



## [1.0.1](https://github.com/xlz122/NeteaseCloudMusic/compare/v1.0.0...v1.0.1) (2021-09-18)


### ✨ Features | 新功能

* 歌曲详情-展开/收起完成 [#d45332e](https://github.com/xlz122/NeteaseCloudMusic/commit/d45332e) 
* 完成首页-排行榜页面 [#37378dc](https://github.com/xlz122/NeteaseCloudMusic/commit/37378dc) 
* 完善排行榜样式 [#497a5d5](https://github.com/xlz122/NeteaseCloudMusic/commit/497a5d5) 
* 完善搜索详情-搜索结果数量 [#c160ab9](https://github.com/xlz122/NeteaseCloudMusic/commit/c160ab9) 


### 🐛 Bug Fixes | Bug 修复

* 去除小于10k的svg处理成base64路径,修复打包出现svg警告 [#cc994d5](https://github.com/xlz122/NeteaseCloudMusic/commit/cc994d5) 
* 去除console.log [#18cf1ac](https://github.com/xlz122/NeteaseCloudMusic/commit/18cf1ac) 
* 首页-排行榜，收藏按钮样式调整，去除事件 [#626f330](https://github.com/xlz122/NeteaseCloudMusic/commit/626f330) 
* 我的音乐-侧边列表补充歌单作者 [#4bc5acb](https://github.com/xlz122/NeteaseCloudMusic/commit/4bc5acb) 
* 修复播放模式为随机时，上下切换歌曲不是随机歌曲bug [#952e036](https://github.com/xlz122/NeteaseCloudMusic/commit/952e036) 
* 修复导航搜索和导航详情搜索bug [#364ada8](https://github.com/xlz122/NeteaseCloudMusic/commit/364ada8) 
* 修复导航搜索回车进入详情，初始化页面没有重置为单曲bug [#9bdbfaa](https://github.com/xlz122/NeteaseCloudMusic/commit/9bdbfaa) 
* 修复点击生效范围和实际返回不符的bug [#409e138](https://github.com/xlz122/NeteaseCloudMusic/commit/409e138) 
* 修复首页-新碟上架轮播样式 [#b018385](https://github.com/xlz122/NeteaseCloudMusic/commit/b018385) 
* 修复首页热门推荐样式 [#6522b7a](https://github.com/xlz122/NeteaseCloudMusic/commit/6522b7a) 
* 修复搜索建议点击用户，搜索详情未定位用户的bug [#8c9b6f8](https://github.com/xlz122/NeteaseCloudMusic/commit/8c9b6f8) 
* 修复因网络慢，我的音乐-头像加载失败报错的bug [#da456e2](https://github.com/xlz122/NeteaseCloudMusic/commit/da456e2) 
* 重构评论组件，修复评论组件存在的bug [#0b32c6a](https://github.com/xlz122/NeteaseCloudMusic/commit/0b32c6a) 



# [1.0.0](https://github.com/xlz122/NeteaseCloudMusic/compare/8b0b078...v1.0.0) (2021-09-04)


### ✨ Features | 新功能

* 404页面优化 [#358571c](https://github.com/xlz122/NeteaseCloudMusic/commit/358571c) 
* 安装babel-plugin-dynamic-import-node插件，优化热更新速度 [#8369019](https://github.com/xlz122/NeteaseCloudMusic/commit/8369019) 
* 播放器-播放进度条，音量进度条放单独文件夹 [#c38de79](https://github.com/xlz122/NeteaseCloudMusic/commit/c38de79) 
* 播放器-播放列表部分完善 [#52afc99](https://github.com/xlz122/NeteaseCloudMusic/commit/52afc99) 
* 播放器播放进度拖动完成 [#5758143](https://github.com/xlz122/NeteaseCloudMusic/commit/5758143) 
* 播放器列表点击歌手可跳转至歌手详情 [#5a54f2d](https://github.com/xlz122/NeteaseCloudMusic/commit/5a54f2d) 
* 创作者中心登录后页面完成 [#0fe52fb](https://github.com/xlz122/NeteaseCloudMusic/commit/0fe52fb) 
* 创作者中心未登录页面完成 [#084b67b](https://github.com/xlz122/NeteaseCloudMusic/commit/084b67b) 
* 单曲详情添加歌曲完成 [#a6c820d](https://github.com/xlz122/NeteaseCloudMusic/commit/a6c820d) 
* 弹框由teleport改为createVNode方式挂载，login文件夹位置更改 [#fb0e49b](https://github.com/xlz122/NeteaseCloudMusic/commit/fb0e49b) 
* 登录手机号正则验证 [#39bd47e](https://github.com/xlz122/NeteaseCloudMusic/commit/39bd47e) 
* 底部播放器，歌手名可跳转至歌手详情页 [#37b4453](https://github.com/xlz122/NeteaseCloudMusic/commit/37b4453) 
* 底部反馈弹框完成 [#385e04c](https://github.com/xlz122/NeteaseCloudMusic/commit/385e04c) 
* 点击搜索列表播放,添加播放列表并播放 [#43225a2](https://github.com/xlz122/NeteaseCloudMusic/commit/43225a2) 
* 点击logo图标，跳转至首页 [#b672676](https://github.com/xlz122/NeteaseCloudMusic/commit/b672676) 
* 对接收藏/取消歌单接口，自己的歌单不可操作 [#8769cb2](https://github.com/xlz122/NeteaseCloudMusic/commit/8769cb2) 
* 二次封装的axios增加ts类型 [#467b07b](https://github.com/xlz122/NeteaseCloudMusic/commit/467b07b) 
* 二维码登录、网易云邮箱（测试邮箱）完成 [#0e754a4](https://github.com/xlz122/NeteaseCloudMusic/commit/0e754a4) 
* 封装评论组件 [#3634ffa](https://github.com/xlz122/NeteaseCloudMusic/commit/3634ffa) 
* 歌词本地持久保存 [#661f3f6](https://github.com/xlz122/NeteaseCloudMusic/commit/661f3f6) 
* 歌词抽单独组件 [#760532b](https://github.com/xlz122/NeteaseCloudMusic/commit/760532b) 
* 歌词增加无歌词和不支持滚动 [#664aa7a](https://github.com/xlz122/NeteaseCloudMusic/commit/664aa7a) 
* 歌单-分类完成 [#b612bcd](https://github.com/xlz122/NeteaseCloudMusic/commit/b612bcd) 
* 歌单评论按钮完善 [#22e2b1a](https://github.com/xlz122/NeteaseCloudMusic/commit/22e2b1a) 
* 歌单评论回复表情渲染成图片 [#e8fe1c6](https://github.com/xlz122/NeteaseCloudMusic/commit/e8fe1c6) 
* 歌单详情-标签跳转至对应歌单 [#1f3f7df](https://github.com/xlz122/NeteaseCloudMusic/commit/1f3f7df) 
* 歌单详情-用户名跳转至用户资料页面 [#34bba8c](https://github.com/xlz122/NeteaseCloudMusic/commit/34bba8c) 
* 歌单详情（待完善），歌单详情-音乐列表部分分离组件 [#809260b](https://github.com/xlz122/NeteaseCloudMusic/commit/809260b) 
* 歌单详情侧边栏部分完善 [#b60d872](https://github.com/xlz122/NeteaseCloudMusic/commit/b60d872) 
* 歌单详情页 - 所有专辑完成 [#61feb9a](https://github.com/xlz122/NeteaseCloudMusic/commit/61feb9a) 
* 歌单页面，增加选择分类组件，待接入数据 [#f73edbb](https://github.com/xlz122/NeteaseCloudMusic/commit/f73edbb) 
* 歌单页面除分类选择，其余完成 [#739889b](https://github.com/xlz122/NeteaseCloudMusic/commit/739889b) 
* 歌曲个人信息部分（待完善） [#cefc2d3](https://github.com/xlz122/NeteaseCloudMusic/commit/cefc2d3) 
* 歌曲删除，播放列表清空，删除 [#93144ca](https://github.com/xlz122/NeteaseCloudMusic/commit/93144ca) 
* 歌曲详情页面完善 [#abf01b1](https://github.com/xlz122/NeteaseCloudMusic/commit/abf01b1) 
* 歌手-菜单完成 [#b6f4ac7](https://github.com/xlz122/NeteaseCloudMusic/commit/b6f4ac7) 
* 歌手-推荐歌手对接接口口 [#429d79b](https://github.com/xlz122/NeteaseCloudMusic/commit/429d79b) 
* 歌手分类列表完善 [#61881c0](https://github.com/xlz122/NeteaseCloudMusic/commit/61881c0) 
* 歌手详情-艺人介绍完成，搜索点击歌手可跳转至歌手详情页 [#daaaf8f](https://github.com/xlz122/NeteaseCloudMusic/commit/daaaf8f) 
* 歌手详情页 - 热门作品完成 [#9ee4658](https://github.com/xlz122/NeteaseCloudMusic/commit/9ee4658) 
* 歌手详情页-相关mv完成 [#1857e3e](https://github.com/xlz122/NeteaseCloudMusic/commit/1857e3e) 
* 歌手详情页导航修改为保持，增加mv文件（待完善） [#714b2c6](https://github.com/xlz122/NeteaseCloudMusic/commit/714b2c6) 
* 歌手页面-对接分类歌手接口 [#d4acd34](https://github.com/xlz122/NeteaseCloudMusic/commit/d4acd34) 
* 更新文档，链接跳转更改为打开新标签页 [#eed8e11](https://github.com/xlz122/NeteaseCloudMusic/commit/eed8e11) 
* 更新文档以及项目效果图 [#9ed6dcf](https://github.com/xlz122/NeteaseCloudMusic/commit/9ed6dcf) 
* 更新项目文档，并增加演示图片 [#f898401](https://github.com/xlz122/NeteaseCloudMusic/commit/f898401) 
* 更新项目文档，接口文档地址更改 [#f2970ce](https://github.com/xlz122/NeteaseCloudMusic/commit/f2970ce) 
* 更新cdn vue vue-router vuex版本 [#85dc158](https://github.com/xlz122/NeteaseCloudMusic/commit/85dc158) 
* 更新vue、vue-router、vuex、eslint、prettier、typescript版本，修复更新后各文件eslint报错，ts报错 [#2289a5a](https://github.com/xlz122/NeteaseCloudMusic/commit/2289a5a) 
* 路由切换，关闭播放列表 [#80bbe1f](https://github.com/xlz122/NeteaseCloudMusic/commit/80bbe1f) 
* 描述文档更新 [#8edbe87](https://github.com/xlz122/NeteaseCloudMusic/commit/8edbe87) 
* 描述文档修改 [#d28658d](https://github.com/xlz122/NeteaseCloudMusic/commit/d28658d) 
* 配置cdn引入vue vue-router vuex axios lodash,修改vue.config.js [#f0e4793](https://github.com/xlz122/NeteaseCloudMusic/commit/f0e4793) 
* 朋友 - 内容部分完成 [#6e1c194](https://github.com/xlz122/NeteaseCloudMusic/commit/6e1c194) 
* 朋友（登录后）侧边栏静态数据，中间内容区块字段修i该 [#f9cde85](https://github.com/xlz122/NeteaseCloudMusic/commit/f9cde85) 
* 朋友（登录后）专辑 歌单 文案匹配 [#8c7a4d0](https://github.com/xlz122/NeteaseCloudMusic/commit/8c7a4d0) 
* 朋友侧边栏ui界面 [#bfaad67](https://github.com/xlz122/NeteaseCloudMusic/commit/bfaad67) 
* 朋友侧边栏ui完善部分 [#c8712cf](https://github.com/xlz122/NeteaseCloudMusic/commit/c8712cf) 
* 朋友页面，头像名称可跳转至用户资料，滚动加载bug修复 [#ee8819b](https://github.com/xlz122/NeteaseCloudMusic/commit/ee8819b) 
* 朋友页面滚动加载完成 [#427f2e3](https://github.com/xlz122/NeteaseCloudMusic/commit/427f2e3) 
* 朋友页面滚动加载增加loading [#e651c97](https://github.com/xlz122/NeteaseCloudMusic/commit/e651c97) 
* 朋友页面节目类型匹配 [#68f597d](https://github.com/xlz122/NeteaseCloudMusic/commit/68f597d) 
* 评论接口修改 [#1c2a2b6](https://github.com/xlz122/NeteaseCloudMusic/commit/1c2a2b6) 
* 评论消息提醒 [#b9dbccc](https://github.com/xlz122/NeteaseCloudMusic/commit/b9dbccc) 
* 其他登录方式修改 [#1409e21](https://github.com/xlz122/NeteaseCloudMusic/commit/1409e21) 
* 删除商城，音乐人路由及对应文件，改为外部链接 [#e36bfb7](https://github.com/xlz122/NeteaseCloudMusic/commit/e36bfb7) 
* 删除my-home-page路由及文件，个人资料页面完成，歌单详情样式调整 [#dc6bd4b](https://github.com/xlz122/NeteaseCloudMusic/commit/dc6bd4b) 
* 实名认证跳转外部链接 [#925a0fb](https://github.com/xlz122/NeteaseCloudMusic/commit/925a0fb) 
* 手机号登录，国家编码静态完成 [#0023cae](https://github.com/xlz122/NeteaseCloudMusic/commit/0023cae) 
* 手机号登录完成，修复我的音乐详情id获取失败bug [#d51486a](https://github.com/xlz122/NeteaseCloudMusic/commit/d51486a) 
* 手机号登录注册ui部分完成 [#bce2870](https://github.com/xlz122/NeteaseCloudMusic/commit/bce2870) 
* 手机号注册完成 [#a3cc482](https://github.com/xlz122/NeteaseCloudMusic/commit/a3cc482) 
* 首页-歌单加入跳转 [#dfcc922](https://github.com/xlz122/NeteaseCloudMusic/commit/dfcc922) 
* 首页榜单-查看全部增加跳转 [#69856e8](https://github.com/xlz122/NeteaseCloudMusic/commit/69856e8) 
* 首页榜单，头部播放按钮完善 [#2ebc079](https://github.com/xlz122/NeteaseCloudMusic/commit/2ebc079) 
* 首页播放量处理 [#04f95b0](https://github.com/xlz122/NeteaseCloudMusic/commit/04f95b0) 
* 首页部分静态页面完成,对接个性化推荐 [#c4e7f1b](https://github.com/xlz122/NeteaseCloudMusic/commit/c4e7f1b) 
* 首页侧边栏，增加热门主播数据（本地列表，无接口） [#b2df89e](https://github.com/xlz122/NeteaseCloudMusic/commit/b2df89e) 
* 首页侧边栏列表数据增加跳转 [#6418514](https://github.com/xlz122/NeteaseCloudMusic/commit/6418514) 
* 首页侧边栏入驻歌手增加本地数据 [#6db0bc0](https://github.com/xlz122/NeteaseCloudMusic/commit/6db0bc0) 
* 首页侧边栏用户信息组件位置更改，增加首页排行榜页面 [#cf933f5](https://github.com/xlz122/NeteaseCloudMusic/commit/cf933f5) 
* 首页歌手页面，可跳转至歌手详情页，完成歌手详情侧边栏并对接 [#bb35b5b](https://github.com/xlz122/NeteaseCloudMusic/commit/bb35b5b) 
* 首页个人信息部分，静态页面完成 [#7c9b94d](https://github.com/xlz122/NeteaseCloudMusic/commit/7c9b94d) 
* 首页轮播图增加歌单，外部链接跳转 [#3443124](https://github.com/xlz122/NeteaseCloudMusic/commit/3443124) 
* 首页热门推荐-更多，跳转至歌单页面 [#6401813](https://github.com/xlz122/NeteaseCloudMusic/commit/6401813) 
* 首页热门推荐对接数据 [#ad5c349](https://github.com/xlz122/NeteaseCloudMusic/commit/ad5c349) 
* 首页热门推荐右侧列表，跳转至歌单页面 [#266b9b7](https://github.com/xlz122/NeteaseCloudMusic/commit/266b9b7) 
* 首页申请入驻歌手链接添加 [#0800d16](https://github.com/xlz122/NeteaseCloudMusic/commit/0800d16) 
* 首页下载阴影添加 [#68e3724](https://github.com/xlz122/NeteaseCloudMusic/commit/68e3724) 
* 首页新碟上架-更多跳转至新碟上架页面 [#5afa012](https://github.com/xlz122/NeteaseCloudMusic/commit/5afa012) 
* 首页新碟上架、歌手详情页专辑增加跳转事件 [#2e4324f](https://github.com/xlz122/NeteaseCloudMusic/commit/2e4324f) 
* 首页增加点击提示，朋友点赞对接接口 [#1ff6de3](https://github.com/xlz122/NeteaseCloudMusic/commit/1ff6de3) 
* 首页主体内容和侧边栏部分使用异步加载组件方式 [#d2ec206](https://github.com/xlz122/NeteaseCloudMusic/commit/d2ec206) 
* 首页banner轮播图，可跳转单曲，暂不可跳转专辑 [#813fc5d](https://github.com/xlz122/NeteaseCloudMusic/commit/813fc5d) 
* 搜索框部分分离成单独组件 [#6672fc2](https://github.com/xlz122/NeteaseCloudMusic/commit/6672fc2) 
* 搜索详情-搜索建议跳转完善 [#b4afce2](https://github.com/xlz122/NeteaseCloudMusic/commit/b4afce2) 
* 搜索详情，跳转至歌手详情，增加操作项 [#425f5d6](https://github.com/xlz122/NeteaseCloudMusic/commit/425f5d6) 
* 搜索以及搜索详情完善部分 [#cf91d43](https://github.com/xlz122/NeteaseCloudMusic/commit/cf91d43) 
* 搜索增加歌曲跳转，搜索详情增加歌曲跳转 [#92a9181](https://github.com/xlz122/NeteaseCloudMusic/commit/92a9181) 
* 统计数判断更改，歌手单曲页增加收藏热门按钮 [#b295bb4](https://github.com/xlz122/NeteaseCloudMusic/commit/b295bb4) 
* 头部导航持久化保持，下载页面完成 [#3636d4b](https://github.com/xlz122/NeteaseCloudMusic/commit/3636d4b) 
* 图片整理，删除重复图片，修改css的图片路径为绝对路径 [#406caa7](https://github.com/xlz122/NeteaseCloudMusic/commit/406caa7) 
* 退出登录完成 [#a147a3c](https://github.com/xlz122/NeteaseCloudMusic/commit/a147a3c) 
* 完成分页组件，新碟上架页面以及搜索歌曲详情页面使用分页组件 [#decfb88](https://github.com/xlz122/NeteaseCloudMusic/commit/decfb88) 
* 完成歌手详情，个人信息部分完成 [#2502661](https://github.com/xlz122/NeteaseCloudMusic/commit/2502661) 
* 完成首页榜单部分 [#26fa828](https://github.com/xlz122/NeteaseCloudMusic/commit/26fa828) 
* 完成首页签到功能 [#075cf61](https://github.com/xlz122/NeteaseCloudMusic/commit/075cf61) 
* 完成首页图片轮播 [#28fc3a4](https://github.com/xlz122/NeteaseCloudMusic/commit/28fc3a4) 
* 完成搜索建议 [#94e2241](https://github.com/xlz122/NeteaseCloudMusic/commit/94e2241) 
* 完成搜索详情-专辑页面 [#20e58c0](https://github.com/xlz122/NeteaseCloudMusic/commit/20e58c0) 
* 完成新碟上架 [#8e9c5cf](https://github.com/xlz122/NeteaseCloudMusic/commit/8e9c5cf) 
* 完成专辑详情页面，完成其余页面专辑跳转 [#8487f44](https://github.com/xlz122/NeteaseCloudMusic/commit/8487f44) 
* 我的等级，等级动画部分完成 [#7cc733f](https://github.com/xlz122/NeteaseCloudMusic/commit/7cc733f) 
* 我的视频，增加跳转用户资料 [#72c6079](https://github.com/xlz122/NeteaseCloudMusic/commit/72c6079) 
* 我的音乐 - 歌单详情 - 没有歌曲展示页面完善 [#1f1e29e](https://github.com/xlz122/NeteaseCloudMusic/commit/1f1e29e) 
* 我的音乐 - 歌单详情 - 评论/回复/点赞/删除功能完成 [#afbb05b](https://github.com/xlz122/NeteaseCloudMusic/commit/afbb05b) 
* 我的音乐 - 评论部分静态页面 [#9f1ec22](https://github.com/xlz122/NeteaseCloudMusic/commit/9f1ec22) 
* 我的音乐 - 收藏的歌单部分完成 [#b6384e8](https://github.com/xlz122/NeteaseCloudMusic/commit/b6384e8) 
* 我的音乐 - 音乐播放部分完成 [#651673c](https://github.com/xlz122/NeteaseCloudMusic/commit/651673c) 
* 我的音乐 - 增加我的歌手页面 [#5d14fb1](https://github.com/xlz122/NeteaseCloudMusic/commit/5d14fb1) 
* 我的音乐 - 重构左侧歌单栏 [#183b41c](https://github.com/xlz122/NeteaseCloudMusic/commit/183b41c) 
* 我的音乐-当前播放持久保持 [#f19d324](https://github.com/xlz122/NeteaseCloudMusic/commit/f19d324) 
* 我的音乐-歌单列表滚动条样式修改 [#519fdcd](https://github.com/xlz122/NeteaseCloudMusic/commit/519fdcd) 
* 我的音乐-歌单评论列表ui修改，对接列表接口 [#09ba105](https://github.com/xlz122/NeteaseCloudMusic/commit/09ba105) 
* 我的音乐-歌曲列表增加loading加载动画 [#9e17262](https://github.com/xlz122/NeteaseCloudMusic/commit/9e17262) 
* 我的音乐-我的歌手增加跳转 [#bf8a9ff](https://github.com/xlz122/NeteaseCloudMusic/commit/bf8a9ff) 
* 我的音乐详情样式修改，评论增加精彩评论 [#a20bd5a](https://github.com/xlz122/NeteaseCloudMusic/commit/a20bd5a) 
* 我的主页 - 增加增加城市邮编对照表 [#e0c1736](https://github.com/xlz122/NeteaseCloudMusic/commit/e0c1736) 
* 我的主页歌单完成 [#3e276dc](https://github.com/xlz122/NeteaseCloudMusic/commit/3e276dc) 
* 我的主页文件位置更改，我的等级页面完善 [#79da857](https://github.com/xlz122/NeteaseCloudMusic/commit/79da857) 
* 下载页，其他操作系统弹框更改[@click](https://github.com/click).stop [#88380f9](https://github.com/xlz122/NeteaseCloudMusic/commit/88380f9) 
* 项目使用线上地址，并更新使用文档 [#88c8747](https://github.com/xlz122/NeteaseCloudMusic/commit/88c8747) 
* 修复进入我的主页userId传递错误bug，修复评论最新评论-用户名无法进入个人主页bug [#c85f736](https://github.com/xlz122/NeteaseCloudMusic/commit/c85f736) 
* 一级导航页面加上name属性，home组件取消缓存，download组件缓存 [#04df7a2](https://github.com/xlz122/NeteaseCloudMusic/commit/04df7a2) 
* 音乐播放器，模式切换静态页面完成 [#09e014d](https://github.com/xlz122/NeteaseCloudMusic/commit/09e014d) 
* 音乐播放器完成音量控制 [#0af158a](https://github.com/xlz122/NeteaseCloudMusic/commit/0af158a) 
* 音乐模式切换完成，gzip压缩插件版本降级 [#36caeaf](https://github.com/xlz122/NeteaseCloudMusic/commit/36caeaf) 
* 增加404页面 [#b7198fc](https://github.com/xlz122/NeteaseCloudMusic/commit/b7198fc) 
* 增加播放列表添加提示 [#870af16](https://github.com/xlz122/NeteaseCloudMusic/commit/870af16) 
* 增加代码提交前eslint验证(error不允许提交) [#be62a93](https://github.com/xlz122/NeteaseCloudMusic/commit/be62a93) 
* 增加当前播放音乐详情数据 [#526a604](https://github.com/xlz122/NeteaseCloudMusic/commit/526a604) 
* 增加电台页面文件 [#0ebbcb4](https://github.com/xlz122/NeteaseCloudMusic/commit/0ebbcb4) 
* 增加歌单详情页面（待完善），歌单详情-用户信息部分分离组件 [#786702a](https://github.com/xlz122/NeteaseCloudMusic/commit/786702a) 
* 增加歌曲详情路由及对应文件，歌手详情侧边栏增加热门歌手 [#0dfa636](https://github.com/xlz122/NeteaseCloudMusic/commit/0dfa636) 
* 增加歌手详情路由及文件 [#f2833df](https://github.com/xlz122/NeteaseCloudMusic/commit/f2833df) 
* 增加几个实用类型 [#b4082b7](https://github.com/xlz122/NeteaseCloudMusic/commit/b4082b7) 
* 增加评论删除失败提示 [#d5ac83e](https://github.com/xlz122/NeteaseCloudMusic/commit/d5ac83e) 
* 增加首页二级导航歌手文件，以及完成静态页面 [#1343f2d](https://github.com/xlz122/NeteaseCloudMusic/commit/1343f2d) 
* 增加新碟上架路由及文件 [#8ff78c6](https://github.com/xlz122/NeteaseCloudMusic/commit/8ff78c6) 
* 增加组件缓存示例，并将首页作为缓存组件。 [#62a75a0](https://github.com/xlz122/NeteaseCloudMusic/commit/62a75a0) 
* 增加rimraf插件，使用yarn rimraf node_modules命令删除依赖文件夹，api文件夹内各文件增加返回类型 [#935992f](https://github.com/xlz122/NeteaseCloudMusic/commit/935992f) 
* 整理空框架 [#8b0b078](https://github.com/xlz122/NeteaseCloudMusic/commit/8b0b078) 
* 整理vuex,music音乐模块 [#19b5747](https://github.com/xlz122/NeteaseCloudMusic/commit/19b5747) 
* 重构播放器所需数据，解决遗留bug [#9f74fd9](https://github.com/xlz122/NeteaseCloudMusic/commit/9f74fd9) 
* 重构歌词（歌词滚动动画待优化） [#481ad45](https://github.com/xlz122/NeteaseCloudMusic/commit/481ad45) 
* 重构评论组件（待完善），修复若干bug [#535829b](https://github.com/xlz122/NeteaseCloudMusic/commit/535829b) 
* 重构搜索详情，新增详情-歌手页，修复首页-歌手图标bug [#90d8e97](https://github.com/xlz122/NeteaseCloudMusic/commit/90d8e97) 
* 重构我的音乐现有部分 [#7e6ee56](https://github.com/xlz122/NeteaseCloudMusic/commit/7e6ee56) 
* 主播电台页面，分类列表对接 [#0e957aa](https://github.com/xlz122/NeteaseCloudMusic/commit/0e957aa) 
* cookie过期退出登录，首页未登录展示修改 [#6cb435c](https://github.com/xlz122/NeteaseCloudMusic/commit/6cb435c) 
* eslint+prettier规则增加，接口地址更改 [#a4ea80f](https://github.com/xlz122/NeteaseCloudMusic/commit/a4ea80f) 
* message提示改成全局，混合文本方法提取 [#3fe1f1b](https://github.com/xlz122/NeteaseCloudMusic/commit/3fe1f1b) 
* vue-cli版本更新，浏览器小图标更改为本地文件 [#7710843](https://github.com/xlz122/NeteaseCloudMusic/commit/7710843) 
* vue.config.js增加8k及以下的小图片，转成base64配置 [#513b6da](https://github.com/xlz122/NeteaseCloudMusic/commit/513b6da) 
* vue.config.js增加代码拆分示例 [#a5fecd2](https://github.com/xlz122/NeteaseCloudMusic/commit/a5fecd2) 
* vuex版本升级为4.0正式版 [#aa92f13](https://github.com/xlz122/NeteaseCloudMusic/commit/aa92f13) 
* vuex存储用户uid,用于用户资料页面 [#628a539](https://github.com/xlz122/NeteaseCloudMusic/commit/628a539) 
* vuex音乐数据分模块 [#a738276](https://github.com/xlz122/NeteaseCloudMusic/commit/a738276) 


### 🐛 Bug Fixes | Bug 修复

* 404页面setup语法糖替换成普通写法,解决打包部署后,template不渲染bug [#44ee829](https://github.com/xlz122/NeteaseCloudMusic/commit/44ee829) 
* 播放列表歌名未更改 [#4541a82](https://github.com/xlz122/NeteaseCloudMusic/commit/4541a82) 
* 播放列表容器高度调整 [#bd9315c](https://github.com/xlz122/NeteaseCloudMusic/commit/bd9315c) 
* 播放列表双滚动条样式修改 [#c0f1414](https://github.com/xlz122/NeteaseCloudMusic/commit/c0f1414) 
* 播放列表样式修改，朋友页个人资料增加跳转 [#19d0786](https://github.com/xlz122/NeteaseCloudMusic/commit/19d0786) 
* 播放器列表部分还原 [#82680ef](https://github.com/xlz122/NeteaseCloudMusic/commit/82680ef) 
* 部分未开发功能提示语修改 [#e391288](https://github.com/xlz122/NeteaseCloudMusic/commit/e391288) 
* 代码风格整理 [#0bae7d2](https://github.com/xlz122/NeteaseCloudMusic/commit/0bae7d2) 
* 代码容错处理 [#c36473b](https://github.com/xlz122/NeteaseCloudMusic/commit/c36473b) 
* 单曲循环无法正常播放bug修复 [#44bbb7e](https://github.com/xlz122/NeteaseCloudMusic/commit/44bbb7e) 
* 登录接口params拼写错误 [#ff69b44](https://github.com/xlz122/NeteaseCloudMusic/commit/ff69b44) 
* 底部反馈弹框关闭后，清空表单 [#3de5e9e](https://github.com/xlz122/NeteaseCloudMusic/commit/3de5e9e) 
* 底部意见反馈点击会跳转刷新bug修复 [#76fcb13](https://github.com/xlz122/NeteaseCloudMusic/commit/76fcb13) 
* 调整轮播图下载部分层级 [#0763478](https://github.com/xlz122/NeteaseCloudMusic/commit/0763478) 
* 顶部搜索框，获得/失去焦点展示更改 [#306a19b](https://github.com/xlz122/NeteaseCloudMusic/commit/306a19b) 
* 歌词调整，播放列表清除刷新页面数据还在bug修复 [#bf67b2b](https://github.com/xlz122/NeteaseCloudMusic/commit/bf67b2b) 
* 歌词动画需优化 [#5237d75](https://github.com/xlz122/NeteaseCloudMusic/commit/5237d75) 
* 歌单评论时间方法修改 [#02be837](https://github.com/xlz122/NeteaseCloudMusic/commit/02be837) 
* 歌单详情，外部链接替换动态id，删除歌单详情跳转顶部导航取消选中的操作 [#ee51393](https://github.com/xlz122/NeteaseCloudMusic/commit/ee51393) 
* 歌单详情样式修复 [#af242a4](https://github.com/xlz122/NeteaseCloudMusic/commit/af242a4) 
* 歌曲切换时，清空所有进度 [#5bfd118](https://github.com/xlz122/NeteaseCloudMusic/commit/5bfd118) 
* 歌曲时间更新时间更改为500毫秒,注释歌词动画 [#2accffb](https://github.com/xlz122/NeteaseCloudMusic/commit/2accffb) 
* 歌曲详情，播放/添加单曲增加提示 [#98010c0](https://github.com/xlz122/NeteaseCloudMusic/commit/98010c0) 
* 更改评论组件文件路径 [#d144671](https://github.com/xlz122/NeteaseCloudMusic/commit/d144671) 
* 更换接口地址 [#5afc118](https://github.com/xlz122/NeteaseCloudMusic/commit/5afc118) 
* 更新项目文档-访问地址改为https [#ab15629](https://github.com/xlz122/NeteaseCloudMusic/commit/ab15629) 
* 接口地址更改 [#699ea35](https://github.com/xlz122/NeteaseCloudMusic/commit/699ea35) 
* 框架查缺补漏 [#7939619](https://github.com/xlz122/NeteaseCloudMusic/commit/7939619) 
* 路由传参名称修改 [#31e25e0](https://github.com/xlz122/NeteaseCloudMusic/commit/31e25e0) 
* 轮播图开启自动轮播 [#6c3785c](https://github.com/xlz122/NeteaseCloudMusic/commit/6c3785c) 
* 没有播放歌曲，拖动进度条报错bug [#6022b22](https://github.com/xlz122/NeteaseCloudMusic/commit/6022b22) 
* 朋友-发动态增加提示语 [#b71b23a](https://github.com/xlz122/NeteaseCloudMusic/commit/b71b23a) 
* 朋友（登录后）样式修复，发布视频跳转外部链接 [#a7f5b3c](https://github.com/xlz122/NeteaseCloudMusic/commit/a7f5b3c) 
* 朋友页面样式修复 [#59e79eb](https://github.com/xlz122/NeteaseCloudMusic/commit/59e79eb) 
* 评论组件加上分页，并修复样式bug [#0b605f3](https://github.com/xlz122/NeteaseCloudMusic/commit/0b605f3) 
* 签到部分样式修改 [#7b6662a](https://github.com/xlz122/NeteaseCloudMusic/commit/7b6662a) 
* 签到bug修复 [#7596e01](https://github.com/xlz122/NeteaseCloudMusic/commit/7596e01) 
* 去除无用console.log [#7cf57aa](https://github.com/xlz122/NeteaseCloudMusic/commit/7cf57aa) 
* 去除无用console.log [#cd8d3b9](https://github.com/xlz122/NeteaseCloudMusic/commit/cd8d3b9) 
* 热门新碟文件名及路由修改，增加歌单文件 [#a441e17](https://github.com/xlz122/NeteaseCloudMusic/commit/a441e17) 
* 删除无用备注 [#0733f26](https://github.com/xlz122/NeteaseCloudMusic/commit/0733f26) 
* 首页二级导航根据路由变化选中 [#4dd849a](https://github.com/xlz122/NeteaseCloudMusic/commit/4dd849a) 
* 首页轮播图部分还原 [#7f21a0e](https://github.com/xlz122/NeteaseCloudMusic/commit/7f21a0e) 
* 首页签到更改 [#e96f35d](https://github.com/xlz122/NeteaseCloudMusic/commit/e96f35d) 
* 首页新碟上架，刷新后原显示前五项更改为后五项 [#f601712](https://github.com/xlz122/NeteaseCloudMusic/commit/f601712) 
* 搜索详情-单曲字段补充 [#584af0f](https://github.com/xlz122/NeteaseCloudMusic/commit/584af0f) 
* 搜索详情离开页面重置tab下标，修复导航条样式bug [#4d03071](https://github.com/xlz122/NeteaseCloudMusic/commit/4d03071) 
* 搜索项增加提示语 [#0490fab](https://github.com/xlz122/NeteaseCloudMusic/commit/0490fab) 
* 图片base64配置修改 [#3c3f46d](https://github.com/xlz122/NeteaseCloudMusic/commit/3c3f46d) 
* 完成歌单详情页面，修改部分文件注释 [#1b8ae71](https://github.com/xlz122/NeteaseCloudMusic/commit/1b8ae71) 
* 文档还原上次更改 [#68cdde3](https://github.com/xlz122/NeteaseCloudMusic/commit/68cdde3) 
* 我的音乐 - 当前音乐播放id字段变更 [#11734ac](https://github.com/xlz122/NeteaseCloudMusic/commit/11734ac) 
* 我的音乐 - 列表滚动条样式修改 [#691f1fd](https://github.com/xlz122/NeteaseCloudMusic/commit/691f1fd) 
* 我的音乐-侧边栏样式修复 [#a92cdb2](https://github.com/xlz122/NeteaseCloudMusic/commit/a92cdb2) 
* 我的音乐-歌单列表滚动条样式调整 [#6b7295a](https://github.com/xlz122/NeteaseCloudMusic/commit/6b7295a) 
* 我的音乐-歌单详情部分替换成组件 [#f6ade7d](https://github.com/xlz122/NeteaseCloudMusic/commit/f6ade7d) 
* 我的音乐-歌单详情删除无用代码 [#9d223c1](https://github.com/xlz122/NeteaseCloudMusic/commit/9d223c1) 
* 我的音乐-列表hover效果根据官网修改 [#769e90e](https://github.com/xlz122/NeteaseCloudMusic/commit/769e90e) 
* 我的音乐bug修复 [#3e41088](https://github.com/xlz122/NeteaseCloudMusic/commit/3e41088) 
* 下载页样式问题，页面无法滚动 [#e27c4c8](https://github.com/xlz122/NeteaseCloudMusic/commit/e27c4c8) 
* 下载页样式优化，大屏适配 [#9b449d6](https://github.com/xlz122/NeteaseCloudMusic/commit/9b449d6) 
* 项目==修改成=== [#d7e5843](https://github.com/xlz122/NeteaseCloudMusic/commit/d7e5843) 
* 项目服务代理地址更改 [#c2a78e4](https://github.com/xlz122/NeteaseCloudMusic/commit/c2a78e4) 
* 项目统一使用type定义类型（原interface） [#6af800b](https://github.com/xlz122/NeteaseCloudMusic/commit/6af800b) 
* 项目文档更新 [#32636bd](https://github.com/xlz122/NeteaseCloudMusic/commit/32636bd) 
* 项目文档更新 [#90e797d](https://github.com/xlz122/NeteaseCloudMusic/commit/90e797d) 
* 项目文档描述更新 [#17469d8](https://github.com/xlz122/NeteaseCloudMusic/commit/17469d8) 
* 新增歌手接口文件 [#ce81b38](https://github.com/xlz122/NeteaseCloudMusic/commit/ce81b38) 
* 修复播放列表-播放音乐名称bug [#d285ec7](https://github.com/xlz122/NeteaseCloudMusic/commit/d285ec7) 
* 修复播放列表（清空播放列表后，重新添加出现这种情况），无法上下切换歌曲bug [#19fc573](https://github.com/xlz122/NeteaseCloudMusic/commit/19fc573) 
* 修复播放器若干bug [#3bf75e3](https://github.com/xlz122/NeteaseCloudMusic/commit/3bf75e3) 
* 修复播放器拖动bug [#691d19e](https://github.com/xlz122/NeteaseCloudMusic/commit/691d19e) 
* 修复不是当前用户的评论也出现删除按钮的bug [#2418750](https://github.com/xlz122/NeteaseCloudMusic/commit/2418750) 
* 修复不同歌手跳转至歌手详情页，歌手详情tab没有重置为第一项的bug [#7a527f6](https://github.com/xlz122/NeteaseCloudMusic/commit/7a527f6) 
* 修复从本地拿到字符串数字,===不匹配bug [#35ec361](https://github.com/xlz122/NeteaseCloudMusic/commit/35ec361) 
* 修复从首页-歌单页面进入用户详情页面，浏览器后退导航选中消失bug [#ae87883](https://github.com/xlz122/NeteaseCloudMusic/commit/ae87883) 
* 修复打包后，我的主页，我的等级页面，刷新后页面崩溃bug [#ee48472](https://github.com/xlz122/NeteaseCloudMusic/commit/ee48472) 
* 修复打包后登录弹框打不开bug,接口端口修改，去除无用console [#0aaf7be](https://github.com/xlz122/NeteaseCloudMusic/commit/0aaf7be) 
* 修复导航bug [#2738e49](https://github.com/xlz122/NeteaseCloudMusic/commit/2738e49) 
* 修复登陆后，首页数据没有刷新bug [#e6a6523](https://github.com/xlz122/NeteaseCloudMusic/commit/e6a6523) 
* 修复登录成功后退出登录，重新打开登录弹框，停留在其他登录方式页面bug [#c7d6a46](https://github.com/xlz122/NeteaseCloudMusic/commit/c7d6a46) 
* 修复登录弹框，按下移动和input输入冲突bug [#d83cfec](https://github.com/xlz122/NeteaseCloudMusic/commit/d83cfec) 
* 修复登录弹框偶尔不显示bug， 修复我的音乐侧边栏歌单弹框不显示bug [#2d829df](https://github.com/xlz122/NeteaseCloudMusic/commit/2d829df) 
* 修复登录二维码过期，刷新二维码遮罩不关闭bug [#f6e4a80](https://github.com/xlz122/NeteaseCloudMusic/commit/f6e4a80) 
* 修复登录返回二维码登录bug [#39aff15](https://github.com/xlz122/NeteaseCloudMusic/commit/39aff15) 
* 修复登录后重新登录，显示bug [#d222958](https://github.com/xlz122/NeteaseCloudMusic/commit/d222958) 
* 修复点击进度后，切换歌曲，进度条跳动问题 [#c357be3](https://github.com/xlz122/NeteaseCloudMusic/commit/c357be3) 
* 修复顶部二级导航点击范围bug [#a081b03](https://github.com/xlz122/NeteaseCloudMusic/commit/a081b03) 
* 修复顶部搜索回车和搜索详情回车bug [#c68fa4c](https://github.com/xlz122/NeteaseCloudMusic/commit/c68fa4c) 
* 修复分页页数重置，分页不会改变bug [#eadbd84](https://github.com/xlz122/NeteaseCloudMusic/commit/eadbd84) 
* 修复改动造成播放列表无法播放音乐的bug [#e16070f](https://github.com/xlz122/NeteaseCloudMusic/commit/e16070f) 
* 修复改动造成歌单详情,歌曲选中样式丢失bug [#2475775](https://github.com/xlz122/NeteaseCloudMusic/commit/2475775) 
* 修复歌词比唱的更快bug [#aad4801](https://github.com/xlz122/NeteaseCloudMusic/commit/aad4801) 
* 修复歌词列表icon图标层级不够被遮挡的样式bug [#48ba8f3](https://github.com/xlz122/NeteaseCloudMusic/commit/48ba8f3) 
* 修复歌单详情样式bug [#4bb43b0](https://github.com/xlz122/NeteaseCloudMusic/commit/4bb43b0) 
* 修复歌单详情页，点击评论无法跳转到评论处的bug [#529db8b](https://github.com/xlz122/NeteaseCloudMusic/commit/529db8b) 
* 修复歌单只有一首歌，单曲循环无法继续播放bug，首页侧边栏头像链接更新 [#0fdeeab](https://github.com/xlz122/NeteaseCloudMusic/commit/0fdeeab) 
* 修复歌曲-相似歌曲点击，歌曲详情不更新bug，歌曲、歌单、专辑信息的操作按钮增加统计数 [#20d04bc](https://github.com/xlz122/NeteaseCloudMusic/commit/20d04bc) 
* 修复歌手详情-艺人介绍标题bug [#3546170](https://github.com/xlz122/NeteaseCloudMusic/commit/3546170) 
* 修复歌手详情页，歌手样式被覆盖bug [#a64e103](https://github.com/xlz122/NeteaseCloudMusic/commit/a64e103) 
* 修复歌手页面，侧边栏重复请求bug [#985f2f0](https://github.com/xlz122/NeteaseCloudMusic/commit/985f2f0) 
* 修复歌手页跳转详情，二级导航没有取消选中bug [#8e1c86a](https://github.com/xlz122/NeteaseCloudMusic/commit/8e1c86a) 
* 修复回复他人，数据没有处理bug [#30b9f95](https://github.com/xlz122/NeteaseCloudMusic/commit/30b9f95) 
* 修复回复他人没有提示bug [#3ed1d1c](https://github.com/xlz122/NeteaseCloudMusic/commit/3ed1d1c) 
* 修复将歌单一键添加到播放列表,无版权歌曲也被添加bug [#21f3859](https://github.com/xlz122/NeteaseCloudMusic/commit/21f3859) 
* 修复精彩评论和最新评论可以同时回复bug [#a69d572](https://github.com/xlz122/NeteaseCloudMusic/commit/a69d572) 
* 修复类型错误 [#4c1690e](https://github.com/xlz122/NeteaseCloudMusic/commit/4c1690e) 
* 修复每次歌曲播放,定时器叠加bug [#3ff9159](https://github.com/xlz122/NeteaseCloudMusic/commit/3ff9159) 
* 修复频繁切换歌曲播放，控制台报错（audio Uncaught (in promise) DOMException: The play() request was interrupted by a new load request.）bug [#0cc6093](https://github.com/xlz122/NeteaseCloudMusic/commit/0cc6093) 
* 修复评论不加载bug [#5bae626](https://github.com/xlz122/NeteaseCloudMusic/commit/5bae626) 
* 修复评论分页不重新加载数据bug [#5fc4855](https://github.com/xlz122/NeteaseCloudMusic/commit/5fc4855) 
* 修复评论组件样式bug [#bfca129](https://github.com/xlz122/NeteaseCloudMusic/commit/bfca129) 
* 修复签到后，第二天无法签到bug [#13ff836](https://github.com/xlz122/NeteaseCloudMusic/commit/13ff836) 
* 修复前期重构播放器loading不显示bug [#bf09192](https://github.com/xlz122/NeteaseCloudMusic/commit/bf09192) 
* 修复嵌套路由，路由跳转组件渲染两次bug [#ef112fa](https://github.com/xlz122/NeteaseCloudMusic/commit/ef112fa) 
* 修复上次更新遗留样式bu [#4e4717b](https://github.com/xlz122/NeteaseCloudMusic/commit/4e4717b) 
* 修复上一次改动造成的歌词bug [#c5f75f6](https://github.com/xlz122/NeteaseCloudMusic/commit/c5f75f6) 
* 修复收藏列表重复bug [#c6eb930](https://github.com/xlz122/NeteaseCloudMusic/commit/c6eb930) 
* 修复首页-歌单，选择分类无效bug [#0aab4d0](https://github.com/xlz122/NeteaseCloudMusic/commit/0aab4d0) 
* 修复首页、单曲部分样式bug [#a0b223c](https://github.com/xlz122/NeteaseCloudMusic/commit/a0b223c) 
* 修复首页轮播图按钮点击切换，自动轮播没有停止bug [#569d1df](https://github.com/xlz122/NeteaseCloudMusic/commit/569d1df) 
* 修复首页轮播图背景切换时，白色闪屏bug [#f060bb6](https://github.com/xlz122/NeteaseCloudMusic/commit/f060bb6) 
* 修复首页热门推荐电台、新碟上架样式bug [#452a705](https://github.com/xlz122/NeteaseCloudMusic/commit/452a705) 
* 修复刷新页面，有播放数据，点击播放不能播放bug [#d01204d](https://github.com/xlz122/NeteaseCloudMusic/commit/d01204d) 
* 修复搜索bug，用户增加跳转，歌曲所属专辑增加跳转 [#80f61f0](https://github.com/xlz122/NeteaseCloudMusic/commit/80f61f0) 
* 修复跳转歌单详情，用户资料页面，顶部导航以及二级导航选中bug [#7b7f9b1](https://github.com/xlz122/NeteaseCloudMusic/commit/7b7f9b1) 
* 修复跳转至创作中心页面时，头部导航依然选中bug [#a0bb899](https://github.com/xlz122/NeteaseCloudMusic/commit/a0bb899) 
* 修复退出登录，顶部导航栏还是登录状态问题 [#624c14e](https://github.com/xlz122/NeteaseCloudMusic/commit/624c14e) 
* 修复未登录，点击评论提交按钮出现提示bug [#5c95387](https://github.com/xlz122/NeteaseCloudMusic/commit/5c95387) 
* 修复未登录，评论头像、评论点击bug，删除旧评论组件 [#0fa67cf](https://github.com/xlz122/NeteaseCloudMusic/commit/0fa67cf) 
* 修复未登录状态下，用户资料页面报错 bug [#ecc7454](https://github.com/xlz122/NeteaseCloudMusic/commit/ecc7454) 
* 修复我的等级，进度bug [#afa670a](https://github.com/xlz122/NeteaseCloudMusic/commit/afa670a) 
* 修复我的音乐-收藏歌单全部删除报错bug [#dbf7425](https://github.com/xlz122/NeteaseCloudMusic/commit/dbf7425) 
* 修复我的音乐，歌单详情，播放按钮bug [#e1eae3f](https://github.com/xlz122/NeteaseCloudMusic/commit/e1eae3f) 
* 修复我的音乐出现多条滚动条bug， 修复底部播放器固定后，我的音乐侧边栏列表看不全bug [#461b84e](https://github.com/xlz122/NeteaseCloudMusic/commit/461b84e) 
* 修复我的音乐歌单详情bug,评论-用户名可以跳转至用户详情，更新文档 [#43225f8](https://github.com/xlz122/NeteaseCloudMusic/commit/43225f8) 
* 修复我的音乐样式bug [#9c071bf](https://github.com/xlz122/NeteaseCloudMusic/commit/9c071bf) 
* 修复我的主页，创建的歌单样式bug [#8ff1f64](https://github.com/xlz122/NeteaseCloudMusic/commit/8ff1f64) 
* 修复我的主页样式bug [#eab80b6](https://github.com/xlz122/NeteaseCloudMusic/commit/eab80b6) 
* 修复显隐音量条位置偏移bug [#26d0c69](https://github.com/xlz122/NeteaseCloudMusic/commit/26d0c69) 
* 修复项目无法打包bug，去除项目无用console.log，增加vue.config.js打包最大文件限制配置 [#bac01c6](https://github.com/xlz122/NeteaseCloudMusic/commit/bac01c6) 
* 修复新碟上架分页切换，样式bug [#a5bd8e6](https://github.com/xlz122/NeteaseCloudMusic/commit/a5bd8e6) 
* 修复新碟上架线上分页bug [#55268cd](https://github.com/xlz122/NeteaseCloudMusic/commit/55268cd) 
* 修复验证码倒计时结束，重新发送不显示倒计时bug [#9ee5534](https://github.com/xlz122/NeteaseCloudMusic/commit/9ee5534) 
* 修复页面切换，首页轮播定时器没有清除bug [#8c97496](https://github.com/xlz122/NeteaseCloudMusic/commit/8c97496) 
* 修复因播放数据重构，导致播放列表背景不显示的bug [#a1c2078](https://github.com/xlz122/NeteaseCloudMusic/commit/a1c2078) 
* 修复音乐列表样式bug [#0e1e270](https://github.com/xlz122/NeteaseCloudMusic/commit/0e1e270) 
* 修复音乐详情播放音乐选中样式消失bug [#79b701d](https://github.com/xlz122/NeteaseCloudMusic/commit/79b701d) 
* 修复音量条在顶部底部,位置偏移bug [#535073e](https://github.com/xlz122/NeteaseCloudMusic/commit/535073e) 
* 修复在我的音乐页面登录出现样式错乱bug [#f9345a9](https://github.com/xlz122/NeteaseCloudMusic/commit/f9345a9) 
* 修复之前整理公共方法，导致的时间格式化bug [#96bc6d2](https://github.com/xlz122/NeteaseCloudMusic/commit/96bc6d2) 
* 修复只有当前用户才显示歌曲删除按钮 [#f92b4a1](https://github.com/xlz122/NeteaseCloudMusic/commit/f92b4a1) 
* 修复重构音乐列表，导致的样式bug [#c7c4df2](https://github.com/xlz122/NeteaseCloudMusic/commit/c7c4df2) 
* 修复axios增加类型时，还原被覆盖的cookie过期处理代码 [#347585d](https://github.com/xlz122/NeteaseCloudMusic/commit/347585d) 
* 修复body有个nbsp的bug [#ec59b7a](https://github.com/xlz122/NeteaseCloudMusic/commit/ec59b7a) 
* 修复eslint警告 [#6dcb677](https://github.com/xlz122/NeteaseCloudMusic/commit/6dcb677) 
* 修复eslint警告 [#c48a86a](https://github.com/xlz122/NeteaseCloudMusic/commit/c48a86a) 
* 修改备注 [#0ccff88](https://github.com/xlz122/NeteaseCloudMusic/commit/0ccff88) 
* 修改朋友页滚动加载 [#ea02d86](https://github.com/xlz122/NeteaseCloudMusic/commit/ea02d86) 
* 修整项目部分注释 [#9c2b0be](https://github.com/xlz122/NeteaseCloudMusic/commit/9c2b0be) 
* 样式调整 [#57f2a62](https://github.com/xlz122/NeteaseCloudMusic/commit/57f2a62) 
* 样式修复 [#0807807](https://github.com/xlz122/NeteaseCloudMusic/commit/0807807) 
* 移除@types/lodash [#24a04fc](https://github.com/xlz122/NeteaseCloudMusic/commit/24a04fc) 
* 音乐人页面暂时改为bug 未完成列表 [#ba6bad2](https://github.com/xlz122/NeteaseCloudMusic/commit/ba6bad2) 
* 音乐详情 - 播放添加数据时bug修复 [#728df4b](https://github.com/xlz122/NeteaseCloudMusic/commit/728df4b) 
* 音量精致度由一位小数更改为两位小数 [#271dfdf](https://github.com/xlz122/NeteaseCloudMusic/commit/271dfdf) 
* 音量控制静态页面 [#2282287](https://github.com/xlz122/NeteaseCloudMusic/commit/2282287) 
* 音量控制静态页面调整 [#5489ec0](https://github.com/xlz122/NeteaseCloudMusic/commit/5489ec0) 
* 用户中心更改 [#9635ee5](https://github.com/xlz122/NeteaseCloudMusic/commit/9635ee5) 
* 增加部分提示语，删除朋友侧边栏无用代码 [#2128202](https://github.com/xlz122/NeteaseCloudMusic/commit/2128202) 
* 增加歌曲详情，个人信息文件 [#4c46d45](https://github.com/xlz122/NeteaseCloudMusic/commit/4c46d45) 
* 整理公共方法，首页个性化日期动态设置 [#8574370](https://github.com/xlz122/NeteaseCloudMusic/commit/8574370) 
* cdn vuex引入错误修复 [#0eeaeba](https://github.com/xlz122/NeteaseCloudMusic/commit/0eeaeba) 
* eslint规则修改，单独使用any报warning [#34cb674](https://github.com/xlz122/NeteaseCloudMusic/commit/34cb674) 
* eslint语法警告修复 [#0ea6774](https://github.com/xlz122/NeteaseCloudMusic/commit/0ea6774) 
* img图片大小限制 [#dc06b60](https://github.com/xlz122/NeteaseCloudMusic/commit/dc06b60) 
* ts类型检测修改 [#4a5bf54](https://github.com/xlz122/NeteaseCloudMusic/commit/4a5bf54) 
* vuex结合本地存储容错处理 [#04d996c](https://github.com/xlz122/NeteaseCloudMusic/commit/04d996c) 
* vuex整理，搜索建议歌单增加跳转 [#15ca343](https://github.com/xlz122/NeteaseCloudMusic/commit/15ca343) 



