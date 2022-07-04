# 网易云音乐

**特别声明：本项目中的展示图片归网易云所有。如果侵权，请提交 Issues 联系。**

## 环境要求

需要 NodeJS 14.18.0+ 环境

![](./src/assets/design-sketch/npm-6.14.15.svg)
![](./src/assets/design-sketch/node-14.18.0.svg)

## 简介

本项目是一个仿写网易云PC端网站项目。

后端接口部分使用 Binaryify 的 NodeJS 版Api项目。

Api项目github地址: [https://github.com/Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)。

Api接口文档地址: [https://binaryify.github.io/NeteaseCloudMusicApi/#/](https://binaryify.github.io/NeteaseCloudMusicApi/#/)。

## 项目使用技术栈

* Vue全家桶
* Vue3 Composition Api
* TypeScript

## 加入项目

如果想加入本项目开发，需将项目fork到自己的仓库下，功能开发完成后，提PR即可。

## 运行

启动项目

```
yarn install
```

```
yarn serve
```

项目打包

```
yarn build
```

## Vercel 部署

1. fork 此项目
2. 在 [Vercel](https://vercel.com/) 官网点击 `New Project`
3. 点击 `Import Git Repository` 并选择你 fork 的此项目并点击`import`
4. 进入部署配置页面，默认配置即可
5. 直接点 `Deploy` 接着等部署完成即可

项目使用 vercel 部署地址：[https://netease-cloud-music-ochre.vercel.app/](https://netease-cloud-music-ochre.vercel.app/)

## 效果图

![](./src/assets/design-sketch/home.png)

## 写在最后

* [The MIT License (MIT)](https://github.com/xlz122/NeteaseCloudMusic/blob/master/LICENSE)
* 本项目仅用于学习使用，切勿用于商业用途，否则产生的法律后果与作者无关。
