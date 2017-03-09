## 项目介绍

本项目为微群相册项目的前端代码部分。项目以前后端分离的方式开发。

##技术选型

- ECMAScript版本： ECMAScript2015
- 模块化方案：CommonJS
- 技术栈：React + Redux
- css预处理语言：Less
- 构建套件：Webpack2

##代码风格约定

- 缩进采用两个空格
- 不使用分号
- 字符串使用单引号而不是双引号

##开发环境搭建

搭建开发环境步骤（以Mac环境下的Sublime编辑器为例）

*建议：由于npm registry的官方镜像访问速度比较慢，因此建议下文中的npm install操作，都使用淘宝的国内镜像来加速下载， 后面跟参数--registry=https://registry.npm.taobao.org*

####安装node运行环境

    brew install node

####安装ES2015语法支持插件：Babel插件

打开Sublime，按Shift + Command + P组合键
输入Package Control: Install Package，按回车
待弹出搜索框后，输入Babel

####安装代码检查工具：SublimeLinter插件

打开Sublime，按Shift + Command + P组合键
输入Package Control: Install Package，按回车
待弹出搜索框后，输入SublimeLinter

重复上述过程，安装语言扩展包，SublimeLinter-contrib-eslint

####下载代码

    git clone https://github.com/cainiaokan/micro_album_frontend.git

####安装项目依赖库

切换到项目目录

    npm install

##编译构建

构建的输出目录是项目目录下的dist文件夹

####开发构建

    npm run build:dev

####发布构建

    npm run build:dist

####清空产出目录

    npm run clean

两种构建方式的区别
  
<table>
    <thead>
      <tr>
        <th>功能</th>
        <th>开发构建</th>
        <th>发布构建</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>自动编译</th>
        <td>是，进程不退出，当有文件修改时，自动编译</td>
        <td>否</td>
      </tr>
      <tr>
        <th>代码压缩</th>
        <td>否</td>
        <td>是，减小代码传输体积</td>
      </tr>
      <tr>
        <th>sourcemap</th>
        <td>无</td>
        <td>有，可以方便线上调试</td>
      </tr>
      <tr>
        <th>文件名哈希</th>
        <td>无</td>
        <td>有，可以开启http强缓存</td>
      </tr>
    </tbody>
</table>


