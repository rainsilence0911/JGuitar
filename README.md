# JGuitar

本项目的原型是2010年google主页上的电吉他。除了图片用了原版，其余无一行代码一样，完全原创。

## 功能
琴弦动画

录音&回放

支持键盘


## What is standalone version?
standalone版本比较早，是在电吉他发布后4天制作的（在google代码开放前），支持全浏览器（IE6－IE8能看到动画，但没有声音）。

原帖地址：http://rainsilence.iteye.com/blog/1081323

## What is react es6 version?
前端经过多年发展，现在回头看当时的作品，代码有众多的缺陷。最大的缺陷莫过于没有模块化。所以最近一有时间就想着用es6+react对代码进行重构。

现在仅仅只支持琴弦动画。

## How to install
Standalone版本直接双击test.html就可以运行

es6版本用了webpack+hot deploy plugin作为开发环境

1）进入webpack.config.js的目录

2) npm install

3) npm run hot-dev-server

4) open browser and input http://localhost:8080