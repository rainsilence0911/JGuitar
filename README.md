# JGuitar

本项目的原型是2010年google主页上的电吉他。除了图片用了原版，其余无一行代码一样，完全原创。

## 功能
1）琴弦动画＋吉他单音

2）录音&回放

3）支持键盘


##效果图
![image](https://github.com/rainsilence0911/JGuitar/blob/master/standalone/images/snapshot20160914.PNG)

## 技术架构
standalone版本比较早，是在电吉他发布后4天制作的（在google代码开放前），支持全浏览器（IE6－IE8能看到动画，但没有声音）。

原帖地址：http://rainsilence.iteye.com/blog/1081323

改进后的ES6版本中

1）支持ES6 module来对代码进行模块化

2）将绘图技术和业务逻辑分离，使得只需要修改少量的代码就可以从canvas切换到svg

3）将原来component组件之间的循环依赖解藕，组件之间完全不存在依赖关系

4）用设计中的组合模式构建dom tree，使得代码更加清晰可维护。

## How to install
Standalone版本直接双击test.html就可以运行

es6版本用了webpack+hot deploy plugin作为开发环境

1）进入webpack.config.js的目录

2) npm install

3) npm run hot-dev-server

4) open browser and input http://localhost:8080
